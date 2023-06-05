import React from 'react';
import { Center, Text, Icon, Heading, VStack, Pressable, Checkbox } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Fontisto, MaterialIcons } from '@expo/vector-icons';
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { useAuth } from '../hooks/useAuth';

import { firebaseConfig } from '../../firebase-config';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, updateDoc, doc, where, query } from 'firebase/firestore';

export function InfoRegisterUser() {

    const { navigate } = useNavigation();

    const [user, setUsers] = React.useState([]);
    const [cidade, setCidade] = React.useState('');
    const [estado, setEstado] = React.useState('');
    const [esportes, setEsportes] = React.useState([]);

    const auth = getAuth(firebaseConfig);
    const db = getFirestore(firebaseConfig);
    const userCollectionAdd = doc(db, 'users', auth.currentUser.uid);
    const userCollectionConsult = collection(db, 'users');

    React.useEffect(() => {
        const getUsers = async () => {

            const dataUser = query(userCollectionConsult, where("id", "==", auth.currentUser.uid));
            const querySnapshot = await getDocs(dataUser);
            setUsers(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        getUsers();
    }, []);

    console.log(user);

    const setRegister = async () => {
        try {
            const docRef = await updateDoc(userCollectionAdd, {
                cidade: cidade,
                estado: estado,
                esportes: esportes
            });
            console.log("Documento criado no branco: ", docRef);

            console.log('Conta criada com sucesso!')
            const user = auth.currentUser;
            console.log(user);
            navigate('pools');

        } catch (error) {
            console.error("Erro ao criar o documento: ", error);
        }
    }

    return (
        <Center flex={1} bgColor="gray.900" p={7}>

            <Text color="purple.500" fontSize={45} mt={10} fontFamily="heading">
                GPSports
            </Text>
            {/* <Header title="Buscar evento esportivo" showBackButton/> */}
            {user.map((user) => {
                return (
                    <VStack mt={8} mx={5} mb={8} alignItems="center">
                        <Heading fontFamily="heading" color="white" fontSize="16" textAlign="center">
                            Olá {user.nickName}, por favor nos informe sua Cidade e seu Estado juntamente com seus esportes favoritos {'\n'}
                            para que possamos mostrar para você todos os eventos que estão acontecendo perto de você!
                        </Heading>
                    </VStack>
                );
            })}

            <Input
                mb={2}
                placeholder='Estado'
                InputLeftElement={<Icon as={<MaterialIcons name="person-outline" />} size={5} ml="2" color="muted.400" />}
                value={estado}
                onChangeText={e => setEstado(e)}
            />

            <Input
                mb={2}
                placeholder='Cidade'
                InputLeftElement={<Icon as={<MaterialIcons name="person-outline" />} size={5} ml="2" color="muted.400" />}
                value={cidade}
                onChangeText={e => setCidade(e)}
            />

            <Checkbox.Group value={esportes} onChange={setEsportes}>
                <Checkbox value="Futebol">Futebol</Checkbox>
                <Checkbox value="Basquete">Basquete</Checkbox>
                <Checkbox value="Volei">Vôlei</Checkbox>
            </Checkbox.Group>

            <Button
                title="CONTINUAR"
                onPress={setRegister}
                mt={4}
            />


        </Center>
    );

}
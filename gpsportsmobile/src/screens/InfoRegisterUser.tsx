import React from 'react';
import { Center, Text, Icon, VStack, Checkbox, Stack, ScrollView} from 'native-base';

import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from "../components/Button";
import { Input } from "../components/Input";

import { firebaseConfig } from '../../firebase-config';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, updateDoc, doc, where, query } from 'firebase/firestore';
import { useEffect } from 'react';


export function InfoRegisterUser() {

    const { navigate } = useNavigation();

    const [isLoading, setIsLoading] = React.useState(false);

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

    const setRegister = async () => {
        try {

            setIsLoading(true);

            const docRef = await updateDoc(userCollectionAdd, {
                cidade: cidade,
                estado: estado,
                esportes: esportes
            });
            console.log("Documento criado no branco: ", docRef);

            console.log('Conta criada com sucesso!')

            navigate('email');

        } catch (error) {

            console.error("Erro ao criar o documento: ", error);

        }finally{
            setIsLoading(false);
        }
    }


    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            bgColor="gray.900">
            <Center flex={1} bgColor="gray.900" p={7}>

                <Text color="purple.500" fontSize={45} mt={'30%'} fontFamily="heading">
                    GPS<Text color="white" fontSize={45} fontFamily="heading">ports</Text>
                </Text>

                {user.map((user) => {
                    return (
                        <VStack mt={8} mx={5} mb={8} alignItems="center">
                            <Text fontFamily="heading" color="white" fontSize="14px" textAlign="center">
                                Olá {user.nickName}, continue informando seus dados para melhor funcionamento do aplicativo.
                            </Text>
                        </VStack>
                    );
                })}

                <Input
                    mb={2}
                    placeholder='Estado'
                    InputLeftElement={<Icon as={<MaterialIcons name="location-pin" />} size={5} ml="2" color="muted.400" />}
                    value={estado}
                    onChangeText={e => setEstado(e)}
                />

                <Input
                    mb={4}
                    placeholder='Cidade'
                    InputLeftElement={<Icon as={<MaterialIcons name="location-pin" />} size={5} ml="2" color="muted.400" />}
                    value={cidade}
                    onChangeText={e => setCidade(e)}
                />

                <VStack mt={8} mx={5} mb={4} alignItems="center">
                    <Text fontFamily="heading" color="white" fontSize="14px" textAlign="center">
                        Selecione os esportes que você pratica ou tem interesse.
                    </Text>

                    <Checkbox.Group value={esportes} mt={4} onChange={setEsportes}>
                        <Stack direction="row" my={2}>
                            <Checkbox value="Futebol" colorScheme="purple" bg={'gray.800'} borderColor="gray.600" mx={4}>
                                <Text color={'gray.300'} fontSize={14} fontFamily="heading">Futebol</Text>
                            </Checkbox>

                            <Checkbox value="Basquete" colorScheme="purple" bg={'gray.800'} borderColor="gray.600" mx={4}>
                                <Text color={'gray.300'} fontSize={14} fontFamily="heading">Basquete</Text>
                            </Checkbox>

                            <Checkbox value="Volei" colorScheme="purple" bg={'gray.800'} borderColor="gray.600" mx={4}>
                                <Text color={'gray.300'} fontSize={14} fontFamily="heading">Vôlei</Text>
                            </Checkbox>
                        </Stack>
                        <Stack direction="row" my={2}>
                            <Checkbox value="Tenis" colorScheme="purple" bg={'gray.800'} borderColor="gray.600" mx={4}>
                                <Text color={'gray.300'} fontSize={14} fontFamily="heading">Tênis</Text>
                            </Checkbox>

                            <Checkbox value="Surf" colorScheme="purple" bg={'gray.800'} borderColor="gray.600" mx={4}>
                                <Text color={'gray.300'} fontSize={14} fontFamily="heading">Surf</Text>
                            </Checkbox>

                            <Checkbox value="Boxe" colorScheme={'purple.500'} bg={'gray.800'} borderColor="gray.600" mx={4}>
                                <Text color={'gray.300'} fontSize={14} fontFamily="heading">Boxe</Text>
                            </Checkbox>
                        </Stack>
                    </Checkbox.Group>
                </VStack>

                <Button
                    title="CONTINUAR"
                    onPress={setRegister}
                    isLoading={isLoading}
                    mt={4}
                />

            </Center>
        </ScrollView>
    );

}
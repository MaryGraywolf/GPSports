// Import da biblioteca do React e de seus tipos
import React from 'react';
import { useState, useCallback } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { Avatar, Center, Icon, ScrollView, Text, TextArea, VStack } from 'native-base';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

// Imports do Firebase
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../../firebase-config';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore/lite';

// Imports de componentes e Icons
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import MaterialIcons from '@expo/vector-icons/build/MaterialIcons';

export function User() {

    const { navigate } = useNavigation();

    // Ligações com o Firebase
    const auth = getAuth(firebaseConfig); // autenticação
    const db = getFirestore(firebaseConfig); // banco de dados
    const userCollection = collection(db, 'users'); // documento users para retornar dados
    const userDocCollection = doc(db, 'users', auth.currentUser.uid); // documento users para receber dados

    // Const para pegar os dados do usuário
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');

    useFocusEffect(
        useCallback(() => {

            const fetchUser = async () => {

                const dataUser = query(userCollection, where("id", "==", auth.currentUser.uid));
                const querySnapshot = await getDocs(dataUser);

                const list = [];

                querySnapshot.forEach((doc) => {

                    const userData = {
                        id: doc.id,
                        name: doc.data().nickName,
                        esports: [
                            doc.data().esportes
                        ],
                        estado: doc.data().estado,
                        cidade: doc.data().cidade,
                    };

                    list.push(userData);
                });

                setUsers(list)
            };

            fetchUser();
        }, [])
    );

    const setRegister = async () => {
        try {

            if (email != '') {
                await updateDoc(userDocCollection, {
                    email: email
                });
            }

            if (name != '') {
                await updateDoc(userDocCollection, {
                    name: name
                });
            }

            if (bio != '') {
                await updateDoc(userDocCollection, {
                    bio: bio
                });
            }

            Alert.alert("Informações alteradas com sucesso!");
            navigate('user');

            setName('')
            setEmail('')
        } catch (error) {
            console.error("Erro ao tentar alterar as informações", error);
        }
    }

    console.log(name)

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 200 }}
            bgColor="gray.900">
            <VStack flex={1} bgColor="gray.900" >
                {users.map((user) => {
                    return (
                        <VStack key={user.id}>
                            <Header title="Perfil" showBackButton />

                            <VStack mt={8} mx={5} alignItems="center">
                                <TouchableOpacity>
                                    <Avatar
                                        size='xl'
                                    >
                                        <Text fontSize="30px" color="white" fontFamily="heading">{user.name?.at(0).toUpperCase()}
                                        </Text>
                                    </Avatar>
                                </TouchableOpacity>

                                <Center flexDirection='row'>
                                    <Text fontSize="20px" color="white" fontFamily="heading">{user.name}
                                    </Text>
                                </Center>
                            </VStack>

                            <VStack flexDirection="row" mx={5} justifyContent={'space-between'}  h={'10%'}>

                                <VStack mt={8} alignItems="center" width="48%" bgColor="gray.800" borderRadius={5}>
                                    <Text fontSize="15px" mt="2" color="white" fontFamily="heading">ESTADO</Text>
                                    <Text fontSize="15px" color="gray.300" mt="2px" fontFamily="heading">{user.estado}</Text>
                                </VStack>

                                <VStack mt={8} alignItems="center" width="48%" bgColor="gray.800" borderRadius={5}>
                                    <Text fontSize="15px" mt="2" color="white" fontFamily="heading">Cidade</Text>
                                    <Text fontSize="15px" color="gray.300" mt="2px" fontFamily="heading">{user.cidade}</Text>

                                </VStack>

                            </VStack>

                            <VStack px={4} mx={5} mt={8} alignItems="center" h={'8%'} bgColor="gray.800" borderRadius={5}>
                                <Text fontSize="15px" mt="2" color="white" fontFamily="heading">ESPORTE FAVORITO</Text>
                                {user.esports.map((esportes) => {
                                    return (
                                        <Text fontSize="15px" color="gray.300" mt="2px" fontFamily="heading"> {esportes.join('; ')} </Text>
                                    );
                                })}
                            </VStack>

                            <VStack mt="5%" mx={5} alignItems="center" borderRadius={5}>

                                <Text fontSize="15px" color="white" mt="3px" mb="5px" fontFamily="heading" justifyContent={'space-between'}>SOBRE MIM</Text>

                                <TextArea h={20}
                                    placeholder="Descreva algo sobre você..."
                                    mb={4}
                                    w={'full'}
                                    bg={'gray.800'}
                                    color={'gray.300'}
                                    borderColor={'gray.600'}
                                    fontSize={'md'}
                                    px={4}
                                    mx={5}
                                    autoCompleteType={undefined}
                                    onChangeText={b => setBio(b)}
                                />

                            </VStack>

                            <VStack mx={5} alignItems="center" flexDirection="column" justifyContent="center">
                                <Text fontSize="15px" color="white" mt="3px" mb="5px" fontFamily="heading">ALTERAR NOME DE USUÁRIO</Text>
                                <Input placeholder='Digite seu novo nome'
                                    onChangeText={n => setName(n)}
                                    value={name}
                                    InputRightElement={<Icon as={<MaterialIcons name="edit" />} size={5} mr="3" color="muted.400" />}
                                />
                            </VStack>

                            <VStack mt="5%" mx={5} alignItems="center" flexDirection="column" justifyContent="center">
                                <Text fontSize="15px" color="white" mt="3px" mb="5px" fontFamily="heading">ALTERAR EMAIL</Text>
                                <Input placeholder='Digite seu novo email'
                                    onChangeText={e => setEmail(e)}
                                    value={email}
                                    InputRightElement={<Icon as={<MaterialIcons name="edit" />} size={5} mr="3" color="muted.400" />}
                                />
                            </VStack>

                            <VStack mt={5} mx={5} alignItems="center" flexDirection="column" justifyContent="center">
                                <Button title={'SALVAR ALTERAÇÕES'} onPress={setRegister}></Button>

                                <Button mt="5%" title={'SAIR'} onPress={() => navigate('sign')}></Button>
                            </VStack>

                        </VStack>
                    )
                })}
            </VStack>
        </ScrollView>
    );

}
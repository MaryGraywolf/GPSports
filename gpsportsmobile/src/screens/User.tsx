import { useState, useEffect, useCallback } from 'react';
import { Avatar, Center, HStack, Heading, Icon, Row, ScrollView, Text, TextArea, VStack } from 'native-base';
import { Select as NativeBaseSelect } from "native-base";
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { firebaseConfig } from '../../firebase-config';
import { getFirestore, collection, getDocs, addDoc, query, where, updateDoc, doc  } from 'firebase/firestore/lite';

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { PencilSimpleLine, SignOut } from 'phosphor-react-native';
import { Alert, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/build/MaterialIcons';

export function User({ route }) {

    const { navigate } = useNavigation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [users, setUsers] = useState([]);
    const [pools, setPools] = useState([]);
    const [bio, setBio] = useState('');

    const auth = getAuth(firebaseConfig);
    const db = getFirestore(firebaseConfig);
    const userCollection = collection(db, 'users');
    const userDocCollection = doc(db, 'users', auth.currentUser.uid);
    const poolsCollection = collection(db, 'pools');

    useFocusEffect(
        useCallback(() => {

            const fetchUser = async () => {

                const dataUser = query(userCollection, where("id", "==", auth.currentUser.uid));
                const querySnapshot = await getDocs(dataUser);

                const list = [];

                querySnapshot.forEach((doc) => {

                    const userData = {
                        id: doc.id,
                        name: doc.data().name,
                    };
                
                    list.push(userData);
                });

                const participantQuery = query(poolsCollection, where('owner.id', '==', auth.currentUser.uid));
                const participantSnapshot = await getDocs(participantQuery);

                const participantList = [];
                
                participantSnapshot.forEach((doc) => {
                    const poolData = {
                        esporte: doc.data().esporte,
                        estado: doc.data().estado
                    };

                    if(participantList.length > 0)
                        return;

                    participantList.push(poolData);                 
                });   

                setPools(participantList);
                setUsers(list)
            };

            fetchUser();           
        }, [])
    ); 

    const setRegister = async () => {
        try {

            if(email === '' && name === ''){
                throw alert("Informe um email ou um nome")
            }

            if(email != ''){
                const updateEmail = await updateDoc(userDocCollection, {
                    email: email
                });
            }

            if(name != ''){
                const updateName = await updateDoc(userDocCollection, {
                    name: name
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
        contentContainerStyle={{paddingBottom: 100}}
        bgColor="gray.900">
         <VStack flex={1} bgColor="gray.900">
            <Header title="Perfil" showBackButton />

                <VStack mt={8} mx={5} alignItems="center">
                    <TouchableOpacity>
                    <Avatar 
                        size='xl'
                        source={{uri: ''}}
                    />
                    </TouchableOpacity>

                    <Center flexDirection='row'>
                        {users.map((user) => {
                            return (
                            <Text fontSize="20px" color="purple.500" fontFamily="heading">{user.name}
                            </Text>
                            );
                        })}                      
                    </Center>
                </VStack>

            <VStack flexDirection="row" mx={5}  justifyContent="space-between" height="12%">

                <VStack mt={8} alignItems="center" width="48%"  bgColor="gray.600" borderRadius={5}>
                <Text fontSize="15px" mt="2" color="purple.500" fontFamily="heading">ESPORTE FAVORITO</Text>
                        {pools.map((pool) => {
                            return (
                            <Text fontSize="15px" color="white" mt="2px" fontFamily="heading">{pool.esporte}</Text>
                            );
                        })}                                       
                </VStack>

                <VStack mt={8} alignItems="center" width="48%"  bgColor="gray.600" borderRadius={5}>
                    <Text fontSize="15px" mt="2" color="purple.500" fontFamily="heading">ESTADO</Text>
                    {pools.map((pool) => {
                            return (
                            <Text fontSize="15x" color="white" mt="2px" fontFamily="heading">{pool.estado}</Text>
                            );
                        })}   
                </VStack>

            </VStack>

            <VStack mt="5%" mx={5} alignItems="center" borderRadius={5}>

                <Text fontSize="15px" color="purple.500" mt="3px" mb="5px" fontFamily="heading" justifyContent="">SOBRE MIM</Text>

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
                <Text fontSize="15px" color="purple.500" mt="3px" mb="5px" fontFamily="heading">ALTERAR NOME DE USUÁRIO</Text>
                <Input placeholder='Digite seu novo nome'
                onChangeText={n => setName(n)}
                value = {name}
                InputRightElement={<Icon as={<MaterialIcons name="edit" />} size={5} mr="3" color="muted.400" />}
                />             
            </VStack>  

            <VStack mt="5%" mx={5} alignItems="center" flexDirection="column" justifyContent="center">
                <Text fontSize="15px" color="purple.500" mt="3px" mb="5px" fontFamily="heading">ALTERAR EMAIL</Text>
                <Input placeholder='Digite seu novo email'
                onChangeText={e => setEmail(e)}
                value = {email}
                InputRightElement={<Icon as={<MaterialIcons name="edit" />} size={5} mr="3" color="muted.400" />}
                />           
            </VStack>  

            <VStack mt={5} mx={5} alignItems="center" flexDirection="column" justifyContent="center">
                <Button title={'SALVAR ALTERAÇÕES'} onPress={setRegister}></Button>  

                <Button mt="5%" title={'SAIR'} onPress={() => navigate('sign')}></Button>                     
            </VStack>    

        </VStack>
     </ScrollView>
    );

}
import { useState, useEffect } from 'react';
import { Center, Heading, Text, VStack } from 'native-base';
import { Select as NativeBaseSelect } from "native-base";
import { useRoute } from '@react-navigation/native';

import { firebaseConfig } from '../../firebase-config';
import { getFirestore, collection, getDocs, addDoc  } from 'firebase/firestore/lite';


import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function User({ route }) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [users, setUsers] = useState([]);

    const db = getFirestore(firebaseConfig);
    const userCollection = collection(db, 'users');

    useEffect(() => {
        const getUsers = async () => {
            const data = await getDocs(userCollection);
            console.log(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        getUsers();
    }, []);

    const { user: userUid } = route.params; // Obtenha o valor de 'email' do objeto 'params'

    console.log(userUid);



    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Criar evento esportivo" showBackButton />

            <VStack mt={8} mx={5} alignItems="center">
                <Heading fontFamily="heading" color="purple.500" fontSize="xl" my={5} textAlign="center">
                    Olá, seja bem vindo!
                </Heading>

                <Heading fontFamily="heading" color="white" fontSize="25" textAlign="center">
                    {userUid}
                </Heading>

            </VStack>
            <VStack mt={8} mx={5} alignItems="center">
                <Input
                    mb={2}
                    placeholder='Qual nome do seu evento esportivo?'
                />
            </VStack>
        </VStack>
    );

}
import { useState, useEffect } from 'react';
import { Center, Heading, Text, VStack} from 'native-base';
import { Select as NativeBaseSelect } from "native-base";

import { firebaseConfig } from '../../firebase-config';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';


import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";


export function New(){   

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [users, setUsers] = useState([]);

    const db = getFirestore(firebaseConfig);
    const userCollection = collection(db, 'users');

    useEffect(() => {
        const getUsers = async () => {
            const data = await getDocs(userCollection);
            console.log(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        };
        getUsers();
    }, []);

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Criar evento esportivo" showBackButton/>

            <VStack mt={8} mx={5} alignItems="center">
                <Heading fontFamily="heading" color="purple.500" fontSize="xl" my={5} textAlign="center">
                    GPSPORTS
                </Heading>
                <Heading fontFamily="heading" color="white" fontSize="25" textAlign="center">
                    Crie seu evento de esporte e compartilhe entre amigos!
                </Heading>

                <Input
                mb={2}
                placeholder='Qual nome do seu evento esportivo?'
                />

                <Button 
                title="CRIAR MEU EVENTO"
                />

                <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
                    Após criar seu evento você irá receber um código único para compartilhar com seus amigos e chama-los para jogar.
                </Text>
            </VStack>
        </VStack>      
    );
}
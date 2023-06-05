import { Center, Text, Icon, Heading, VStack, Pressable } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Fontisto, MaterialIcons } from '@expo/vector-icons';
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { useAuth } from '../hooks/useAuth';

import React from 'react';
import { firebaseConfig } from '../../firebase-config';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, collection, getDocs, updateDoc, doc, where, query } from 'firebase/firestore';


function SendEmail() {

    const auth = getAuth(firebaseConfig); // Obtenha a inst�ncia do objeto de autentica��o
    const navigation = useNavigation();

    // Verifique se o usu�rio est� autenticado e o e-mail est� verificado
    if (auth.currentUser && !auth.currentUser.emailVerified) {
        sendEmailVerification(auth.currentUser)
            .then(() => {
                console.log('E-mail de verificação enviado com sucesso.');
            })
            .catch((error) => {
                console.error('Erro ao enviar o e-mail de verifica��o:', error);
            });
    } else {
        console.log('Usu�rio n�o autenticado ou e-mail j� verificado.');
    }

    return (
        <Center flex={1} bgColor="gray.900" p={7}>

            <Icon as={MaterialIcons} name="email" color="purple.500" size={20} />

            <VStack mt={8} mx={5} mb={8} alignItems="center">
                <Heading fontFamily="heading" color="white" fontSize="16" textAlign="center">
                    Verifique seu e-mail para autenticar sua conta
                </Heading>
            </VStack>

            <Text color="purple.500" fontSize={14} fontFamily="heading" onPress={() => navigation.navigate('sign')}>Clique aqui para retornar ao login!</Text>

        </Center>
    );
}

export function EmailVerification() {

    return (
        <SendEmail />
    )

}
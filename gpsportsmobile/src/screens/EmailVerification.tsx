import { Center, Text, Icon, Heading, VStack, Pressable } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import React from 'react';
import { firebaseConfig } from '../../firebase-config';
import { getAuth, sendEmailVerification } from 'firebase/auth';


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
                console.error('Erro ao enviar o e-mail de verificação:', error);
            });
    } else {
        console.log('Usuário não autenticado ou e-mail já verificado.');
    }

    return (
        <Center flex={1} bgColor="gray.900" p={7}>

            <Icon as={MaterialIcons} name="email" color="purple.500" size={20} />

            <VStack mt={8} mx={5} mb={8} alignItems="center">
                <Heading fontFamily="heading" color="white" fontSize="16px" textAlign="center">
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
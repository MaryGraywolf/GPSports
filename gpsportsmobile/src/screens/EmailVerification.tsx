// Import das bibliotecas do React
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Center, Text, Icon, Heading, VStack, useToast } from 'native-base';

// Import dos icones e componentes
import { MaterialIcons } from '@expo/vector-icons';

// Import das configurações do firebase
import { firebaseConfig } from '../../firebase-config';
import { getAuth, sendEmailVerification } from 'firebase/auth';


function SendEmail() {

    // Variaveis de controle
    const toast = useToast();
    const navigation = useNavigation();

    const auth = getAuth(firebaseConfig); // Variavel de autenticação

    // Função de envio de e-mail de verificação
    if (auth.currentUser && auth.currentUser.emailVerified == false) {
        sendEmailVerification(auth.currentUser)
            .then(() => {
                toast.show({
                    title: 'E-mail de verificação enviado!',
                    placement: 'top',
                    bgColor: 'green.500'
                  })
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
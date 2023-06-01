import { Center, Text, Icon, Heading, VStack, Pressable } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Fontisto, MaterialIcons } from '@expo/vector-icons';
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { useAuth } from '../hooks/useAuth';

import React from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from '../../firebase-config';

export function InfoRegisterUser({ route }) {

    const { navigate } = useNavigation();

    const [show, setShow] = React.useState(false);

    const [cidade, setCidade] = React.useState('');
    const [estado, setEstado] = React.useState('');
    const [name, setName] = React.useState('');

    const auth = getAuth(firebaseConfig);

    const handleCreateAccount = () => {

    }

    const { name: userName } = route.params;

    return (
        <Center flex={1} bgColor="gray.900" p={7}>

            <Text color="purple.500" fontSize={45} mt={10} fontFamily="heading">
                GPSports
            </Text>
            {/* <Header title="Buscar evento esportivo" showBackButton/> */}

            <VStack mt={8} mx={5} mb={8} alignItems="center">
                <Heading fontFamily="heading" color="white" fontSize="16" textAlign="center">
                    Olá {userName}, Por favor nos informe sua Cidade e seu Estado juntamente com seus esportes favoritos {'\n'}
                    para que possamos mostrar para você todos os eventos que estão acontecendo perto de você!
                </Heading>
            </VStack>


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

            <Button
                title="CONTINUAR"
                onPress={handleCreateAccount}
                mt={4}
            />


        </Center>
    );

}
import { Center, Text, Icon, Pressable, Heading, VStack, useToast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Fontisto, MaterialIcons, Octicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { Input } from "../components/Input";
import { useAuth } from '../hooks/useAuth';

import React from 'react';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebase-config';
import { Alert } from 'react-native';
import { EmailVerification } from './EmailVerification';


export function SignIn() {

  const navigation = useNavigation();

  const { signIn, user } = useAuth();

  const [show, setShow] = React.useState(false);
  const toast = useToast();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [id, setId] = React.useState('');

  const auth = getAuth(firebaseConfig);

  const handleSignIn = () => {

    setIsLoading(true);

    signInWithEmailAndPassword(auth, email, password).then(() => {

      if (auth.currentUser.emailVerified == false) {

        navigation.navigate('email');
        
      } else {

        navigation.navigate('pools');

        //navigation.navigate('inforegisteruser');

        toast.show({
          title: 'Login realizado com sucesso!',
          placement: 'top',
          bgColor: 'green.500'
        })

      }

      setEmail('')
      setPassword('')
      setIsLoading(false);

    }).catch((error) => {

      toast.show({
        title: 'Email ou senha incorretos!',
        placement: 'top',
        bgColor: 'red.500'
      })

      setIsLoading(false);

    })
  }

  return (
    <Center flex={1} bgColor="gray.900" p={7}>

      <Text color="purple.500" fontSize={45} fontFamily="heading">
        GPSports
      </Text>

      <VStack mt={8} mx={5} mb={2} alignItems="center">
        <Heading fontFamily="heading" color="white" fontSize="16" textAlign="center">
          Realize o login para participar de uma partida do seu esporte favorito!!
        </Heading>
      </VStack>

      <Input
        mb={2}
        mt={10}
        placeholder='Informe seu e-mail'
        value={email}
        onChangeText={e => setEmail(e)}
        InputLeftElement={<Icon as={<MaterialIcons name="alternate-email" />} size={5} ml="2" color="muted.400" />}
      />

      <Input
        mb={2}
        placeholder='Digite sua senha'
        value={password}
        onChangeText={e => setPassword(e)}
        InputLeftElement={<Icon as={<MaterialIcons name="lock" />} size={5} ml="2" color="muted.400" />}
        type={show ? "text" : "password"}
        InputRightElement={
          <Pressable onPress={() => setShow(!show)}>
            <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
          </Pressable>
        }
      />

      <Button
        title="LOGAR"
        mt={10}
        mb={4}
        onPress={handleSignIn}
        isLoading={isLoading}
      />

      <Button
        title="LOGAR COM O GOOGLE"
        leftIcon={<Icon as={Fontisto} name="google" color="white" size="md" />}
        type="SECUNDARY"
        onPress={signIn}
      />

      <Text color="white" fontSize={14} mt={6} fontFamily="heading">
        Ainda não é membro?
      </Text>
      <Text color="purple.500" fontSize={14} fontFamily="heading" onPress={() => navigation.navigate('regi')}>
        Clique aqui para realizar seu cadastro!
      </Text>

    </Center>
  );

}
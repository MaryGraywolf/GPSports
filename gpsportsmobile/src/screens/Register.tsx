import { Center, Text, Icon, Heading, VStack, Pressable } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Fontisto, MaterialIcons } from '@expo/vector-icons';
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { useAuth } from '../hooks/useAuth';

import React from 'react';
import { getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import { firebaseConfig } from '../../firebase-config';

function RegisteConext() {

  const { navigate } = useNavigation();

  const [show, setShow] = React.useState(false);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const auth = getAuth(firebaseConfig);

  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email, password).then(() => {
      console.log('Conta criada com sucesso!')
      const user = auth.currentUser;
      alert('Conta criada com sucesso!');
      console.log(user);
    })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      })
  }

  return (
    <Center flex={1} bgColor="gray.900" p={7}>

      <Text color="purple.500" fontSize={45} mt={10} fontFamily="heading">
        GPSports
      </Text>
      {/* <Header title="Buscar evento esportivo" showBackButton/> */}

      <VStack mt={8} mx={5} mb={8} alignItems="center">
        <Heading fontFamily="heading" color="white" fontSize="16" textAlign="center">
          Preencha os campos abaixo para se cadastrar
        </Heading>
      </VStack>


      <Input
        mb={2}
        placeholder='Informe seu nome completo'
        InputLeftElement={<Icon as={<MaterialIcons name="person-outline" />} size={5} ml="2" color="muted.400" />}


      />

      <Input
        mb={2}
        placeholder='Informe seu nickname'
      />

      <Input
        mb={2}
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

      <Input
        mb={2}
        placeholder='Confirme a senha'
        value={confirmPassword}
        onChangeText={e => setConfirmPassword(e)}
        InputLeftElement={<Icon as={<MaterialIcons name="lock" />} size={5} ml="2" color="muted.400" />}
        type={show ? "text" : "password"}
        InputRightElement={
          <Pressable onPress={() => setShow(!show)}>
            <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
          </Pressable>
        }
      />

      <Button
        title="CADASTRAR-SE"
        onPress={handleCreateAccount}
        mt={4}
      />

      <Text color="white" fontSize={14} mt={6} fontFamily="heading">
        Já é membro?
      </Text>
      <Text color="purple.500" fontSize={14} fontFamily="heading" onPress={() => navigate('sign')}>Clique aqui para logar!</Text>


    </Center>
  );
}

export function Register() {

  return (
    <RegisteConext />
  )

}
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
import { getFirestore, collection, getDocs, setDoc, doc } from 'firebase/firestore/lite';
import { Alert } from 'react-native';


function RegisteConext() {

  const { navigate } = useNavigation();

  const [show, setShow] = React.useState(false);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [nickName, setNickName] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const auth = getAuth(firebaseConfig);
  const db = getFirestore(firebaseConfig);

  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email, password).then(() => {

      const userCollection = doc(db, 'users', auth.currentUser.uid);

      console.log(auth.currentUser.uid);

      const setRegister = async () => {
        try {
          const docRef = await setDoc(userCollection, {
            id: auth.currentUser.uid,
            name: name,
            nickName: nickName,
            email: email,
            password: password,
            cidade: '',
            estado: '',
            esportes: []
          });
          console.log("Documento criado no branco: ", docRef);
          const user = auth.currentUser;
          console.log(user);
          //navigate('inforegisteruser', { name: nickName });
          navigate('email');
          Alert.alert("Cadastro feito com sucesso")
        } catch (error) {
          console.error("Erro ao criar o documento: ", error);
          Alert.alert("Preencha os campos corretamente")
        }
      }

      setRegister();
    })
      .catch((error) => {
        console.log(error);
        Alert.alert("Preencha os campos corretamente")
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
        value={name}
        onChangeText={e => setName(e)}
      />

      <Input
        mb={2}
        placeholder='Informe seu nickname'
        InputLeftElement={<Icon as={<MaterialIcons name="person-outline" />} size={5} ml="2" color="muted.400" />}
        value={nickName}
        onChangeText={e => setNickName(e)}
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
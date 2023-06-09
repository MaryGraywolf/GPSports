// Import das bibliotecas do React
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Center, Text, Icon, Heading, VStack, Pressable, useToast } from 'native-base';

// Import dos icones e dos componentes
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { MaterialIcons } from '@expo/vector-icons';

// Import das configurações do firebase
import { firebaseConfig } from '../../firebase-config';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';


function RegisteConext() {

  // Variaveis de controle
  const toast = useToast();
  const { navigate } = useNavigation();
  const [show, setShow] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Conexões com o banco
  const auth = getAuth(firebaseConfig);
  const db = getFirestore(firebaseConfig);

  // Variaveis de valor
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [nickName, setNickName] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  // Função de Registro com email e senha do Firebase
  const handleCreateAccount = () => {

    setIsLoading(true);

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

          navigate('inforegisteruser');

          toast.show({
            title: 'Registro realizado com sucesso!',
            placement: 'top',
            bgColor: 'green.500'
          })

        } catch (error) {
          console.error("Erro ao criar o documento: ", error);

          toast.show({
            title: 'Erro ao tentar fazer registro!',
            placement: 'top',
            bgColor: 'red.500'
          })

        } finally {
          setIsLoading(false);
        }
      }

      setRegister();
    })
      .catch((error) => {
        console.log(error);

        toast.show({
          title: 'Preencha os campos corretamente!',
          placement: 'top',
          bgColor: 'red.500'
        })

      })
  }

  return (
    <Center flex={1} bgColor="gray.900" p={7}>

      <Text color="purple.500" fontSize={45} fontFamily="heading">
        GPS<Text color="white" fontSize={45} fontFamily="heading">ports</Text>
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
        isLoading={isLoading}
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
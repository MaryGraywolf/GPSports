import React from 'react';
import { Center, Text, Icon, Heading, VStack, Checkbox, Stack, Box, ScrollView, useToast, HStack } from 'native-base';
import * as ImagePicker from 'expo-image-picker';

import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from "../components/Button";
import { Input } from "../components/Input";

import { firebaseConfig } from '../../firebase-config';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, updateDoc, doc, where, query } from 'firebase/firestore';
import { useEffect } from 'react';

import uplodImageFromDevice from "../ConfigImg/uploadImageFromDevice";
import manageFileUpload from "../ConfigImg/manageFileUpload";
import getBlobFromUri from "../ConfigImg/getBlobFroUri";

export function InfoRegisterUser() {

    const { navigate } = useNavigation();
    const toast = useToast();

    const [user, setUsers] = React.useState([]);
    const [cidade, setCidade] = React.useState('');
    const [estado, setEstado] = React.useState('');
    const [esportes, setEsportes] = React.useState([]);

    const auth = getAuth(firebaseConfig);
    const db = getFirestore(firebaseConfig);
    const userCollectionAdd = doc(db, 'users', auth.currentUser.uid);
    const userCollectionConsult = collection(db, 'users');

    const [imgURI, setImageURI] = React.useState(null);

    const [isUploading, setIsUploading] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [remoteURL, setRemoteURL] = React.useState("");

    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const getUsers = async () => {

            const dataUser = query(userCollectionConsult, where("id", "==", auth.currentUser.uid));
            const querySnapshot = await getDocs(dataUser);
            setUsers(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        getUsers();
    }, []);

    const setRegister = async () => {
        try {

            if (cidade == '') {
                toast.show({
                    title: 'Informe a Cidade!',
                    placement: 'top',
                    bgColor: 'red.500'
                });

                return;
            } else if (estado == '') {
                toast.show({
                    title: 'Informe o Estado!',
                    placement: 'top',
                    bgColor: 'red.500'
                });

                return;
            } else if (esportes.length == 0) {
                toast.show({
                    title: 'Selecione pelo menos um esporte!',
                    placement: 'top',
                    bgColor: 'red.500'
                });

                return;
            } else {
                const docRef = await updateDoc(userCollectionAdd, {
                    cidade: cidade,
                    estado: estado,
                    esportes: esportes,
                    img: remoteURL
                });

                navigate('email');
            }

        } catch (error) {
            toast.show({
                title: 'Erro ao preencher as informações!',
                placement: 'top',
                bgColor: 'red.500'
            });
        } finally {

            setCidade('');
            setEstado('');
            setEsportes([]);

        }
    }



    const handleLocalImageUpload = async () => {
        const fileURI = await uplodImageFromDevice();

        if (fileURI) {
            setImageURI(fileURI);
        }
    };

    const onStart = () => {
        setIsUploading(true);
    };

    const onProgress = (progress) => {
        setProgress(progress);
    };
    const onComplete = (fileUrl) => {
        setRemoteURL(fileUrl);
        setIsUploading(false);
        setImageURI(null);
    };

    const onFail = (error) => {
        setError(error);
        setIsUploading(false);
    };

    const handleCloudImageUpload = async () => {
        if (!imgURI) return;

        let fileToUpload = null;

        const blob = await getBlobFromUri(imgURI);

        await manageFileUpload(blob, { onStart, onProgress, onComplete, onFail });
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            bgColor="gray.900">
            <Center flex={1} bgColor="gray.900" p={7}>

                <Text color="purple.500" fontSize={26} mt={8} fontFamily="heading">
                    Dados Adicionais
                </Text>

                {user.map((user) => {
                    return (
                        <VStack mt={8} mx={5} mb={8} alignItems="center">
                            <Text fontFamily="heading" color="white" fontSize="14px" textAlign="center">
                                Olá {user.nickName}, continue informando seus dados para melhor funcionamento do aplicativo.
                            </Text>
                        </VStack>
                    );
                })}

                <Input
                    mb={2}
                    placeholder='Estado'
                    InputLeftElement={<Icon as={<MaterialIcons name="location-pin" />} size={5} ml="2" color="muted.400" />}
                    value={estado}
                    onChangeText={e => setEstado(e)}
                />

                <Input
                    mb={4}
                    placeholder='Cidade'
                    InputLeftElement={<Icon as={<MaterialIcons name="location-pin" />} size={5} ml="2" color="muted.400" />}
                    value={cidade}
                    onChangeText={e => setCidade(e)}
                />

                <VStack mt={8} mx={5} mb={4} alignItems="center">
                    <Text fontFamily="heading" color="white" fontSize="14px" textAlign="center">
                        Selecione os esportes que você pratica ou tem interesse.
                    </Text>

                    <Checkbox.Group value={esportes} mt={4} onChange={setEsportes}>
                        <Stack direction="row" my={2}>
                            <Checkbox value="Futebol" colorScheme="purple" bg={'gray.800'} borderColor="gray.600" mx={4}>
                                <Text color={'gray.300'} fontSize={14} fontFamily="heading">Futebol</Text>
                            </Checkbox>

                            <Checkbox value="Basquete" colorScheme="purple" bg={'gray.800'} borderColor="gray.600" mx={4}>
                                <Text color={'gray.300'} fontSize={14} fontFamily="heading">Basquete</Text>
                            </Checkbox>

                            <Checkbox value="Volei" colorScheme="purple" bg={'gray.800'} borderColor="gray.600" mx={4}>
                                <Text color={'gray.300'} fontSize={14} fontFamily="heading">Vôlei</Text>
                            </Checkbox>
                        </Stack>
                        <Stack direction="row" my={2}>
                            <Checkbox value="Tenis" colorScheme="purple" bg={'gray.800'} borderColor="gray.600" mx={4}>
                                <Text color={'gray.300'} fontSize={14} fontFamily="heading">Tênis</Text>
                            </Checkbox>

                            <Checkbox value="Surf" colorScheme="purple" bg={'gray.800'} borderColor="gray.600" mx={4}>
                                <Text color={'gray.300'} fontSize={14} fontFamily="heading">Surf</Text>
                            </Checkbox>

                            <Checkbox value="Boxe" colorScheme="purple" bg={'gray.800'} borderColor="gray.600" mx={4}>
                                <Text color={'gray.300'} fontSize={14} fontFamily="heading">Boxe</Text>
                            </Checkbox>
                        </Stack>
                    </Checkbox.Group>
                </VStack>

                <VStack my={4} alignItems="center">

                    <Text fontFamily="heading" color="white" fontSize="14px" textAlign="center" my={2}>
                        Selecione sua foto de perfil.
                    </Text>

                    <HStack alignItems="center" justifyContent="center" my={2} mt={4}>

                        <Button title="Escolher Imagem" w={'40'} h={'20'} mx={1.5} onPress={handleLocalImageUpload} />

                        <Button title="Enviar Imagem" w={'40'} h={'20'} mx={1.5}  onPress={handleCloudImageUpload} />

                    </HStack>

                </VStack>

                <Button
                    title="CONTINUAR"
                    onPress={setRegister}
                    mt={4}
                />


            </Center>
        </ScrollView>
    );

}
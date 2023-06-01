import { useState, useEffect } from 'react';
import { Center, Heading, Text, VStack, Select, CheckIcon, TextArea, HStack, Switch, ScrollView } from 'native-base';
import { Select as NativeBaseSelect } from "native-base";
import { useNavigation } from '@react-navigation/native';

import { firebaseConfig } from '../../firebase-config';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore/lite';

import { useTheme } from 'native-base';

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { getAuth } from 'firebase/auth';


export function New() {

    const { navigate } = useNavigation();

    const [esporte, setEsporte] = useState('');
    const [name, setName] = useState('');
    const [qtdPessoa, setQtdPessoa] = useState(0);
    const [particular, setParticular] = useState(false);
    const [valor, setValor] = useState(0.0);
    const [obs, setObs] = useState('');
    const [cep, setCep] = useState(0);
    const [estado, setEstado] = useState('');
    const [cidade, setCidade] = useState('');
    const [bairro, setBairro] = useState('');
    const [rua, setRua] = useState('');
    const [ref, setRef] = useState('');


    const auth = getAuth(firebaseConfig);
    const db = getFirestore(firebaseConfig);
    const userCollection = doc(db, 'pools', auth.currentUser.uid);

    const validateFields = () => {
        if (!name || !esporte || qtdPessoa <= 0 || valor <= 0 || cep <= 0 || !estado || !cidade || !bairro || !rua) {
            // Verifique se todos os campos obrigatórios estão preenchidos
            alert('Preencha todos os campos obrigatórios.');
            return false;
        }

        // Adicione outras validações específicas de acordo com seus requisitos

        return true;
    };

    const setRegister = async () => {

        if (!validateFields()) {
            return;
        }

        try {
            const docRef = await updateDoc(userCollection, {
                name: name,
                esporte: esporte,
                qtdPessoa: qtdPessoa,
                particular: particular,
                valor: valor,
                obs: obs,
                cep: cep,
                estado: estado,
                cidade: cidade,
                bairro: bairro,
                rua: rua,
                ref: ref,
            });
            console.log("Documento criado no branco: ", docRef);

            console.log('Conta criada com sucesso!')
            const user = auth.currentUser;
            console.log(user);
            navigate('pools');

        } catch (error) {
            console.error("Erro ao criar o documento: ", error);
        }
    }

    return (
        <ScrollView>
            <VStack flex={1} bgColor="gray.900">
                <Header title="Criar evento esportivo" showBackButton />

                <VStack mt={8} mx={5} alignItems="center">
                    <Heading fontFamily="heading" mb={4} color="purple.500" fontSize="xl" my={5} textAlign="center">
                        GPSPORTS
                    </Heading>
                    <Heading fontFamily="heading" mb={4} color="white" fontSize="25" textAlign="center">
                        Crie seu evento de esporte e compartilhe entre amigos!
                    </Heading>

                    <Input
                        mb={4}
                        placeholder='Qual nome do seu evento esportivo?'
                        onChangeText={e => setName(e)}
                    />

                    <Select selectedValue={esporte}
                        placeholder="Qual o Esporte?"
                        onValueChange={itemValue => setEsporte(itemValue)}
                        mb={4}
                        h={14}
                        w={'full'}
                        bg={'gray.800'}
                        color={'gray.300'}
                        borderColor={'gray.600'}
                        fontSize={'md'}
                        px={4}
                        mx={5}>
                        <Select.Item label="Futebol" value="Futebol" bg={'gray.800'} />
                        <Select.Item label="Vôlei" value="Volei" />
                        <Select.Item label="Basquete" value="Basquete" />
                    </Select>

                    <Input
                        mb={4}
                        placeholder='Quantas pessoas?'
                        value={qtdPessoa.toString()}
                        onChangeText={e => setQtdPessoa(parseFloat(e))}
                    />



                    <HStack alignItems="center" justifyContent="space-between" mb={2} mx={5}>



                    </HStack>
                    <Heading fontFamily="heading" color="gray.300" fontSize="16" textAlign="left">
                        Local Particular?
                    </Heading>
                    <HStack alignItems="center" justifyContent={'space-between'}>

                        <VStack>
                            <Switch size="md" />
                        </VStack>

                        <Input
                            mb={4}
                            placeholder='R$ por Pessoa'
                            w={'30%'}
                            onChangeText={e => setValor(parseFloat(e))}
                        />
                    </HStack>

                    <TextArea h={20}
                        placeholder="Observações"
                        mb={4}
                        w={'full'}
                        bg={'gray.800'}
                        color={'gray.300'}
                        borderColor={'gray.600'}
                        fontSize={'md'}
                        px={4}
                        mx={5}
                        autoCompleteType={undefined}
                        onChangeText={e => setObs(e)} />

                    <HStack alignItems="center" justifyContent={'space-between'}>
                        <Input
                            mb={4}
                            placeholder='CEP'
                            w={'40%'}
                            mr={3}
                            onChangeText={e => setCep(parseInt(e, 10))}
                        />

                        <Input
                            mb={4}
                            w={'50%'}
                            placeholder='Estado'
                            value={estado}
                            onChangeText={e => setEstado(e)}
                        />
                    </HStack>
                    <HStack alignItems="center" justifyContent={'space-between'}>
                        <Input
                            mb={4}
                            placeholder='Cidade'
                            w={'60%'}
                            mr={3}
                            value={cidade}
                            onChangeText={e => setCidade(e)}
                        />

                        <Input
                            mb={4}
                            w={'30%'}
                            placeholder='Número'
                            onChangeText={e => setRua(e)}
                        />
                    </HStack>

                    <Input
                        mb={4}
                        placeholder='Bairro'
                        value={bairro}
                        onChangeText={e => setBairro(e)}
                    />

                    <TextArea placeholder="Referência"
                        mb={4}
                        w={'full'}
                        bg={'gray.800'}
                        color={'gray.300'}
                        borderColor={'gray.600'}
                        fontSize={'md'}
                        px={4}
                        mx={5}
                        autoCompleteType={undefined}
                        onChangeText={e => setRef(e)} />

                    <Button
                        title="CRIAR MEU EVENTO"
                    />

                    <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
                        Após criar seu evento você irá receber um código único para compartilhar com seus amigos e chama-los para jogar.
                    </Text>
                </VStack>
            </VStack>
        </ScrollView>
    );
}
// Import das bibliotecas do React
import { useState, useCallback } from 'react';
import { TouchableOpacity} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Heading, Text, VStack, Select, TextArea, HStack, Switch, ScrollView, FormControl, useToast } from 'native-base';

// Import dos icones e componentes
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

// Import das configurações do firebase
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../../firebase-config';
import { getFirestore, collection, getDocs, addDoc, query, where  } from 'firebase/firestore';


export function New() {

    // const de navegação
    const { navigate } = useNavigation();

    // const de status
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showPicker, setShowPicker] = useState(false);

    // Conexões com o Banco
    const auth = getAuth(firebaseConfig);
    const db = getFirestore(firebaseConfig);
    const poolsCollection = collection(db, 'pools');
    const userCollection = collection(db, 'users');

    // Valores da tabela Users
    const [user, setUser] = useState([]);

    // Valores da tabela Pools
    const [esporte, setEsporte] = useState('');
    const [name, setName] = useState('');
    const [qtdPessoa, setQtdPessoa] = useState(0);
    const [particular, setParticular] = useState(false);
    const [valor, setValor] = useState(0);
    const [obs, setObs] = useState('');
    const [cep, setCep] = useState(0);
    const [estado, setEstado] = useState('');
    const [cidade, setCidade] = useState('');
    const [bairro, setBairro] = useState('');
    const [num, setNum] = useState('');
    const [rua, setRua] = useState('');
    const [ref, setRef] = useState('');
    const [date, setDate] = useState(new Date());

    // Função para buscar o usuário logado
    useFocusEffect(
        useCallback(() => {

            const fetchUser = async () => {

                const dataUser = query(userCollection, where("id", "==", auth.currentUser.uid));
                const querySnapshot = await getDocs(dataUser);

                const list = [];

                querySnapshot.forEach((doc) => {

                    const userData = {
                        id: doc.id,
                        name: doc.data().nickName,
                    };

                    list.push(userData);

                });

                setUser(list);

            };

            fetchUser();

        }, [])
    );

    // Função para gerar um código único aleatório para o evento
    function generateCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }
        return code;
    }

    const code = generateCode();

    // Função para criar o evento
    const setRegister = async () => {

        try {

            setIsLoading(true);

            if (!validateFields()) {
                return;
            }

            const docRef = await addDoc(poolsCollection, {
                name: name,
                code: code,
                owner: {
                    id: user[0].id,
                    name: user[0].name,
                },
                esporte: esporte,
                qtdPessoa: qtdPessoa,
                particular: particular,
                valor: valor,
                obs: obs,
                cep: cep,
                estado: estado,
                cidade: cidade,
                bairro: bairro,
                numero: num,
                rua: rua,
                ref: ref,
                date: date,
                participantes: [{
                    id: user[0].id,
                    user: {
                        name: user[0].name,
                    }
                }]

            });

            toast.show({
                title: 'Evento Criado com sucesso!',
                placement: 'top',
                bgColor: 'green.500'
            });

            navigate('pools');

        } catch (error) {

            toast.show({
                title: 'Não foi possível criar o evento!',
                placement: 'top',
                bgColor: 'red.500'
            });

        } finally {

            setIsLoading(false);

            setEsporte('')
            setName('')
            setParticular(false)
            setObs('')
            setEstado('')
            setCidade('')
            setBairro('')
            setNum('')
            setRua('')
            setRef('')
            setDate(new Date())
            setQtdPessoa(null)
            setValor(null)
            setCep(null)

        }
    }

    // Funções relacionadas a data
    const toggleDateTimePicker = () => {
        setShowPicker(!showPicker);
    };

    const handleDateTimeConfirm = (selectedDateTime) => {
        setDate(selectedDateTime);
        toggleDateTimePicker();
    };

    const formatDate = (date) => {
        const options = { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
        return date.toLocaleDateString('pt-BR', options);
    };

    // Função para validar os campos
    const validateFields = () => {
        if (!name || !esporte || qtdPessoa <= 0 || particular == true && valor <= 0
            || cep <= 0 || !estado || !cidade || !bairro || !rua
            || !num || !ref || !date) {
            // Verifique se todos os campos obrigatórios estão preenchidos
            toast.show({
                title: 'Preencha todos os campos!',
                placement: 'top',
                bgColor: 'red.500'
            });

            return false;
        }

        // Adicione outras validações específicas de acordo com seus requisitos

        return true;
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            bgColor="gray.900">
            <VStack flex={1} bgColor="gray.900">
                <Header title="Criar evento esportivo" showBackButton />

                <VStack mt={4} mx={5} alignItems="center">
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
                        value={name}
                    />
                    <HStack alignItems="center">
                        <FormControl w={'55%'} mr={4}>
                            <Select selectedValue={esporte}
                                placeholder="Qual o Esporte?"
                                onValueChange={itemValue => setEsporte(itemValue)}
                                mb={4}
                                h={14}
                                bg={'gray.800'}
                                color={'gray.300'}
                                borderColor={'gray.600'}
                                fontSize={'md'}>

                                <Select.Item label="Futebol" value="Futebol" />
                                <Select.Item label="Vôlei" value="Volei" />
                                <Select.Item label="Basquete" value="Basquete" />
                                <Select.Item label="Tênis" value="Tenis" />
                                <Select.Item label="Surf" value="Surf" />
                                <Select.Item label="Boxe" value="Boxe" />

                            </Select>
                        </FormControl>

                        <Input
                            mb={4}
                            w={'40%'}
                            placeholder='N° pessoas?'
                            onChangeText={e => setQtdPessoa(parseInt(e, 10))}
                        />

                    </HStack>

                    <DateTimePickerModal
                        isVisible={showPicker}
                        mode="datetime"
                        onCancel={toggleDateTimePicker}
                        onConfirm={handleDateTimeConfirm}
                    />

                    <TouchableOpacity onPress={toggleDateTimePicker} >
                        <Input
                            mb={4}
                            placeholder='Data do evento'
                            value={formatDate(date)}
                            editable={false}
                        />
                    </TouchableOpacity>

                    <Text fontFamily="heading" color="gray.300" fontSize="16" textAlign="left" mr={'60%'}>
                        Local Particular?
                    </Text>

                    <HStack alignItems="center" justifyContent={'space-between'} w='80%'>

                        <VStack w={'30%'} mr={8}>
                            <Switch size="md" onValueChange={itemValue => setParticular(itemValue)}
                                value={particular}
                            />
                        </VStack>

                        <Input
                            mb={4}
                            placeholder='R$ por Pessoa'
                            w={'70%'}
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
                        onChangeText={e => setObs(e)}
                        value={obs}
                    />

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
                            w={'55%'}
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
                            w={'35%'}
                            placeholder='Número'
                            onChangeText={e => setNum(e)}
                            value={num}
                        />
                    </HStack>

                    <Input
                        mb={4}
                        placeholder='Rua/Avenida'
                        value={rua}
                        onChangeText={e => setRua(e)}
                    />

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
                        onChangeText={e => setRef(e)}
                        value={ref}
                    />

                    <Button
                        title="CRIAR MEU EVENTO"
                        onPress={setRegister}
                        isLoading={isLoading}
                    />

                    <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
                        Após criar seu evento você irá receber um código único para compartilhar com seus amigos e chama-los para jogar.
                    </Text>

                </VStack>
            </VStack>
        </ScrollView>
    );
}
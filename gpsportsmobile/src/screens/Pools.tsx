import { useCallback, useState, useEffect } from 'react';
import { VStack, Icon, useToast, FlatList } from 'native-base';
import { Octicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { PoolCard, PoolCardPros } from '../components/PoolCard';
import { Loading } from '../components/Loading';
import { EmptyPoolList } from '../components/EmptyPoolList';

import { firebaseConfig } from '../../firebase-config';
import { getFirestore, collection, getDocs, addDoc  } from 'firebase/firestore/lite';



export function Pools() {

    const [isLoading, setIsLoading] = useState(true);
    const [pools, setPools] = useState([])

    const { navigate } = useNavigation();

    const [email, setEmail] = useState('');
    const [users, setUsers] = useState([]);

    const db = getFirestore(firebaseConfig);
    const userCollection = collection(db, 'pools');

    useEffect(() => {
        const getUsers = async () => {
            const data = await getDocs(userCollection);
            const pools = data.docs.map((doc) => (
                {
                    id: doc.id,
                    name: doc.data().name,
                    esporte: doc.data().esporte,
                    qtdPessoa: doc.data().qtdPessoa,
                    particular: doc.data().particular,
                    valor: doc.data().valor,
                    obs: doc.data().obs,
                    cep: doc.data().cep,
                    estado: doc.data().estado,
                    cidade: doc.data().cidade,
                    bairro: doc.data().bairro,
                    rua: doc.data().rua,
                    ref: doc.data().ref,
                    participantes: doc.data().participantes,
                }
            ));
            setPools(pools);
            console.log(pools[0].ref); 
            const info = {
                name: pools[0].name
            }
        };
        getUsers();
    }, []);

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Meus eventos esportivos" />

            <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>

                <Button title="BUSCAR EVENTO ESPORTIVO POR CÓDIGO"
                    leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
                    onPress={() => navigate('find')}
                />

                {
                    isLoading ? <Loading /> :
                        <FlatList
                            data={pools}
                            keyExtractor={data => data.id}
                            renderItem={({ data }) => (
                                <PoolCard
                                    data={data.name}
                                    //onPress={() => navigate('details', { id: item.id })}
                                />
                            )}
                            ListEmptyComponent={<EmptyPoolList />}
                            showsVerticalScrollIndicator={false}
                            _contentContainerStyle={{ pb: 10 }}
                            px={5}
                        />
                }

            </VStack>
        </VStack>
    );
}
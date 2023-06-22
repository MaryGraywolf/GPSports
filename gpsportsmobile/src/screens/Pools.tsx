// Import das bibliotecas do React
import { useCallback, useState} from 'react';
import { VStack, Icon, FlatList} from 'native-base';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Import dos icones e dos componentes
import { Octicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { PoolCard } from '../components/PoolCard';
import { Loading } from '../components/Loading';
import { EmptyPoolList } from '../components/EmptyPoolList';

// Import das configurações do firebase
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../../firebase-config';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

export function Pools() {

    // Variaveis de controle
    const { navigate } = useNavigation();
    const [isLoading, setIsLoading] = useState(true);

    // Conexões com o banco
    const auth = getAuth(firebaseConfig);
    const db = getFirestore(firebaseConfig);
    const poolsCollection = collection(db, 'pools');
    const userCollection = collection(db, 'users');

    // Variavel de armazenamento dos dados do banco
    const [pools, setPools] = useState([]);

    useFocusEffect(
        useCallback(() => {
            const fetchPools = async () => {

                const dataUser = query(userCollection, where("id", "==", auth.currentUser.uid));
                const querySnapshot = await getDocs(dataUser);

                const list = [];

                querySnapshot.forEach((doc) => {

                    const userData = {
                        id: doc.id,
                        user: {
                            name: doc.data().nickName,
                        }
                    };

                    list.push(userData);

                });

                const participantQuery = query(poolsCollection, where('participantes', 'array-contains-any', list));
                const participantSnapshot = await getDocs(participantQuery);

                const participantList = [];

                participantSnapshot.forEach((doc) => {
                    const poolData = {
                        id: doc.id,
                        code: doc.data().code,
                        title: doc.data().name,
                        owner: {
                            name: doc.data().owner.name,
                            ownerId: doc.data().owner.id,
                        },
                        participants: [], // inicializa como um array vazio
                        _count: {
                            participants: doc.data().participantes.length,
                        }
                    };

                    doc.data().participantes.forEach((participant) => {
                        const participantData = {
                            id: participant.id,
                            user: {
                                name: participant.user.name,
                                avatarUrl: participant.user.avatarUrl,
                            }
                        };

                        console.log(participantData);

                        poolData.participants.push(participantData);
                    });
                    participantList.push(poolData);
                });

                setPools(participantList);
                setIsLoading(false);
                //console.log(participants);

            };

            fetchPools();

        }, [])
    );

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Meus eventos esportivos" />

            <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>

                <Button title="BUSCAR POR NOVOS EVENTOS"
                    leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
                    onPress={() => navigate('find')}
                />

            </VStack>
            <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>

                {
                    isLoading ? <Loading /> :

                        <FlatList
                            data={pools}
                            keyExtractor={data => data.id}
                            renderItem={({ item }) =>
                                <PoolCard
                                    id={item.id}
                                    data={item}
                                    onPress={() => navigate('details', { id: item.code })}
                                />
                            }
                            ListEmptyComponent={<EmptyPoolList />}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                }

            </VStack>
        </VStack>
    );
}
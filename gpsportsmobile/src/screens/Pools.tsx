import { useCallback, useState, useEffect } from 'react';
import { VStack, Icon, useToast, FlatList, Text } from 'native-base';
import { Octicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { PoolCard, PoolCardPros } from '../components/PoolCard';
import { Loading } from '../components/Loading';
import { EmptyPoolList } from '../components/EmptyPoolList';

import { firebaseConfig } from '../../firebase-config';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';



export function Pools() {

    const [isLoading, setIsLoading] = useState(true);
    const [pools, setPools] = useState([]);

    const { navigate } = useNavigation();

    const auth = getAuth(firebaseConfig);
    const db = getFirestore(firebaseConfig);
    const poolsCollection = collection(db, 'pools');
    const userCollection = collection(db, 'users');

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
                            avatarUrl: doc.data().img,
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
                    };
                
                    doc.data().participantes.forEach((participant) => {
                        const participantData = {
                            id: participant.id,
                            user: {
                                name: participant.user.name,
                                avatarUrl: participant.user.avatarUrl,
                            }
                        };
                
                        poolData.participants.push(participantData);
                    });

                    participantList.push(poolData);
                });

                setPools(participantList);
                setIsLoading(false);

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
                            contentContainerStyle={{ paddingBottom: 100 }}
                        />
                }

            </VStack>
        </VStack>
    );
}
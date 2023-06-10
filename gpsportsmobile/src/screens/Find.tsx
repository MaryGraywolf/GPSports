import { useCallback, useState, useEffect } from 'react';
import { VStack, Icon, useToast, FlatList, Text, Heading, ScrollView } from 'native-base';
import { Octicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { PoolCard, PoolCardPros } from '../components/PoolCard';
import { Loading } from '../components/Loading';
import { EmptyPoolList } from '../components/EmptyPoolList';

import { firebaseConfig } from '../../firebase-config';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

export function Find() {


    const [isLoading, setIsLoading] = useState(true);
    const [pools, setPools] = useState([]);
    const [search, setSearch] = useState('');

    const { navigate } = useNavigation();

    const auth = getAuth(firebaseConfig);
    const db = getFirestore(firebaseConfig);
    const poolsCollection = collection(db, 'pools');
    const userCollection = collection(db, 'users');

    useFocusEffect(
        useCallback(() => {
            const fetchPools = async () => {

                // variáveis que serão usadas nas querys
                const list = [];
                const user = [];
                const allPools = [];

                // Obter os dados do usuário logado
                const dataUser = query(userCollection, where("id", "==", auth.currentUser.uid));
                const querySnapshot = await getDocs(dataUser);

                querySnapshot.forEach((doc) => {
                    const userData = {
                        cidade: doc.data().cidade,
                        esporte: doc.data().esportes,
                    };

                    // armazenar cidade e esportes do usuário
                    list.push(userData);

                    const userInfo = {
                        id: doc.id,
                        user: {
                            name: doc.data().nickName,
                        }
                    }

                    // armazenar id e nome do usuário
                    user.push(userInfo);
                });

                // Obter pools em que o usuário está participando
                const participantQuery = query(
                    poolsCollection,
                    where('participantes', 'array-contains-any', user)
                );

                const participantSnapshot = await getDocs(participantQuery);

                const participantPoolIds = participantSnapshot.docs.map((doc) => doc.id);

                // Obter todas as pools que estão na mesma cidade e possuem o mesmo esporte do usuário
                for (let i = 0; i < list[0].esporte.length; i++) {
                    const allPoolsQuery = query(poolsCollection,
                        where('cidade', '==', list[0].cidade),
                        where('esporte', '==', list[0].esporte[i])
                    );

                    const allPoolsSnapshot = await getDocs(allPoolsQuery);

                    allPoolsSnapshot.forEach((doc) => {
                        const poolData = {
                            id: doc.id,
                            title: doc.data().name,
                            code: doc.data().code,
                            owner: {
                                name: doc.data().owner.name,
                                ownerId: doc.data().owner.id,
                            },
                        };
                        allPools.push(poolData);
                    });
                }

                // filtrar as pools que o usuário não está participando
                const filteredPools = allPools.filter((pool) => !participantPoolIds.includes(pool.id));


                setPools(filteredPools);
                setIsLoading(false);
            };

            fetchPools();


        }, [])
    );



    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            bgColor="gray.900">
            <VStack flex={1} bgColor="gray.900">
                <Header 
                    title="Buscar evento esportivo" 
                    showBackButton
                    />

                <VStack mt={8} mx={5} alignItems="center">
                    <Heading fontFamily="heading" color="white" fontSize="md" textAlign="center">
                        Encontrar um evento esportivo através do código
                    </Heading>
                </VStack>
                <VStack mt={8} mx={5} alignItems="center">
                    <Input
                        mb={2}
                        placeholder='Qual o código do seu evento esportivo?'
                        onChangeText={(text) => setSearch(text)}
                    />

                    <Button
                        title="BUSCAR EVENTO ESPORTIVO"
                        onPress={() => navigate('details', { id: search })}
                    />

                </VStack>

                <VStack mt={8} mx={5} alignItems="center">
                    <Heading fontFamily="heading" color="white" fontSize="md" textAlign="center">
                        Ou pela redondeza
                    </Heading>
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
        </ScrollView>
    );
}
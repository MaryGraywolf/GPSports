import { useCallback, useState, useEffect } from 'react';
import { Share } from 'react-native';
import { FlatList, HStack, ScrollView, useToast, VStack } from 'native-base';

import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Button } from '../components/Button';
import { PoolCardPros } from '../components/PoolCard';
import { PoolHeader } from '../components/PoolHeader';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { Option } from '../components/Option';
import { Guesses } from '../components/Guesses';

import { firebaseConfig } from '../../firebase-config';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { PoolCardParticipants } from '../components/PoolCardParticipants';
import { useFocusEffect } from '@react-navigation/native';

export function Details({ route }) {
  const [optionSelected, setOptionSelected] = useState<'infoGeral' | 'participantes'>('infoGeral')
  const [isLoading, setIsLoading] = useState(true);
  const [poolDetails, setPoolDetails] = useState<PoolCardPros>({} as PoolCardPros);
  const [status, setStatus] = useState(2); // 0 = not registered, 1 = registered, 2 = owner
  const [user, setUsers] = useState([]);

  const db = getFirestore(firebaseConfig);
  const auth = getAuth(firebaseConfig);
  const poolsCollection = collection(db, 'pools');
  const userCollectionConsult = collection(db, 'users');

  const toast = useToast();

  const { id: userUid } = route.params;

  useFocusEffect(
    useCallback(() => {
      fetchPoolDetails();
    }, [userUid])
  );

  useEffect(() => {
    consultUser();
  }, [poolDetails]);
  

  if (isLoading == true && status == 2) {
    return (
      <Loading />
    )
  }

  async function handleJoinPool() {

    const detailsPoolsQuery = query(poolsCollection, where('code', '==', userUid));

    const detailsPoolsSnapshot = await getDocs(detailsPoolsQuery);

    const detailsPoolsList = [];

    detailsPoolsSnapshot.forEach((doc) => {
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

        poolData.participants.push(participantData);
      });

      detailsPoolsList.push(poolData);
    });

    setPoolDetails(detailsPoolsList[0]);
  }

  async function consultUser() {

    try {
      const dataUser = query(userCollectionConsult, where("id", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(dataUser);
      setUsers(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      const poolDoc = doc(db, 'pools', poolDetails.id);
      const poolSnapshot = await getDoc(poolDoc);
      const poolData = poolSnapshot.data();

      if (poolData && poolData.participantes) {
        const userIsRegistered = poolData.participantes.some(
          participant => participant.id === auth.currentUser.uid
        );

        if (userIsRegistered) {
          setStatus(1);

        } else {
          setStatus(0);
        }
      } else {
        setStatus(2);
      }

    } catch (error) {
      console.log(error);
    } finally{
      setIsLoading(false);
    }
  }

  async function fetchPoolDetails() {
    try {

      await handleJoinPool();

    } catch (error) {
      console.log(error);
      toast.show({
        title: 'Não foi possível carregar os dados do evento',
        placement: 'top',
        bgColor: 'red.500'
      })

    }
  }

  async function registerPool() {
    try {

      const userCollectionAdd = doc(db, 'pools', poolDetails.id);

      const docRef = await updateDoc(userCollectionAdd, {
        participantes: arrayUnion({
          id: auth.currentUser.uid,
          user: {
            name: user[0].nickName,
          }
        })
      });

      setStatus(1);

      toast.show({
        title: 'Inscrição realizada com sucesso',
        placement: 'top',
        bgColor: 'green.500'
      })

    } catch (erro) {
      console.log(erro);

      toast.show({
        title: 'Não foi possível se inscrever no evento',
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: 'Esse aqui é o código do meu evento esportivo: ' + poolDetails.code
    })
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
      bgColor="gray.900">
      <VStack flex={1} bgColor="gray.900">
        <Header
          title={poolDetails.title}
          showBackButton
          showShareButton
          onShare={handleCodeShare}
        />


        <VStack px={5} flex={1}>
          <PoolHeader data={poolDetails} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={8}>
            <Option
              title='Informações Gerais'
              isSelected={optionSelected === 'infoGeral'}
              onPress={() => setOptionSelected('infoGeral')}
            />
            <Option
              title='Participantes'
              isSelected={optionSelected === 'participantes'}
              onPress={() => setOptionSelected('participantes')}
            />
          </HStack>


          {optionSelected === 'infoGeral' ? <Guesses poolId={poolDetails.code} />
            : <FlatList
              data={poolDetails.participants}
              keyExtractor={data => data.id}
              renderItem={({ item }) =>
                <PoolCardParticipants
                  id={item.id}
                  data={item}
                />
              }
              ListEmptyComponent={<EmptyMyPoolList code={poolDetails.code} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />}

          {status == 0 ? <Button title="PARTICIPAR DO EVENTO" onPress={registerPool} /> : <></>}

        </VStack>

      </VStack>
    </ScrollView>
  );
}
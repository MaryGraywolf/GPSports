import { useCallback, useState, useEffect } from 'react';
import { Share } from 'react-native';
import { HStack, ScrollView, useToast, VStack } from 'native-base';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';

import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { PoolCardPros } from '../components/PoolCard';
import { PoolHeader } from '../components/PoolHeader';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { Option } from '../components/Option';
import { Guesses } from '../components/Guesses';

import { firebaseConfig } from '../../firebase-config';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';


export function Details({ route }) {
  const [optionSelected, setOptionSelected] = useState<'infoGeral' | 'participantes'>('infoGeral')
  const [isLoading, setIsLoading] = useState(false);
  const [poolDetails, setPoolDetails] = useState<PoolCardPros>({} as PoolCardPros);

  const db = getFirestore(firebaseConfig);
  const poolsCollection = collection(db, 'pools');

  const toast = useToast();

  const { id: userUid } = route.params;

  async function fetchPoolDetails() {
    try {
      setIsLoading(true);

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

    } catch (error) {
      console.log(error);
      toast.show({
        title: 'Não foi possível carregar os dados do evento',
        placement: 'top',
        bgColor: 'red.500'
      })

    } finally {
      setIsLoading(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: 'Esse aqui é o código do meu evento esportivo: ' + poolDetails.code
    })
  }

  useEffect(() => {
    fetchPoolDetails();
  }, [userUid])

  if (isLoading) {
    return (
      <Loading />
    )
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
            : <EmptyMyPoolList code={poolDetails.code} />}

        </VStack>



      </VStack>
    </ScrollView>
  );
}
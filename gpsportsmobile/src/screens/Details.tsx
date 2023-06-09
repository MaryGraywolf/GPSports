import { useCallback, useState, useEffect } from 'react';
import { Share } from 'react-native';
import { HStack, useToast, VStack } from 'native-base';
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
  const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>('guesses')
  const [isLoading, setIsLoading] = useState(false);
  const [poolDetails, setPoolDetails] = useState<PoolCardPros>({} as PoolCardPros);

  const db = getFirestore(firebaseConfig);
  const poolsCollection = collection(db, 'pools');


  const toast = useToast();

  const { id: userUid } = route.params;

  console.log(userUid);

  useFocusEffect(
    useCallback(() => {
      const fetchPools = async () => {
        const detailsPoolsQuery = query(poolsCollection, where('code', '==', userUid));

        const detailsPoolsSnapshot = await getDocs(detailsPoolsQuery);

        const detailsPoolsList = [];

        detailsPoolsSnapshot.forEach((doc) => {
          const poolData = {
            id: doc.id,
            title: doc.data().name,
            code: doc.data().code,
          };
          detailsPoolsList.push(poolData);
        });

        setPoolDetails(detailsPoolsList[0]);

      };

      fetchPools();


    }, [])
  );


  /*  async function fetchPoolDetails() {
     try {
       setIsLoading(true)
       //const response = await api.get(`/pools/${id}`);
       //setPoolDetails(response.data.pool);
     } catch (error) {
       console.log(error);
       toast.show({
         title: 'Não foi possível carregar os detalhes do bolão',
         placement: 'top',
         bgColor: 'red.500'
       })
 
     } finally {
       setIsLoading(false);
     }
   } */

  /* async function handleCodeShare() {
    await Share.share({
      message: poolDetails.code
    })
  } */

  /* useEffect(() => {
    fetchPoolDetails();
  }, [id]) */

  /* if (isLoading) {
    return (
      <Loading />
    )
  } */

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={poolDetails.title}
        showBackButton
        showShareButton
      //onShare={handleCodeShare}
      />


      <VStack px={5} flex={1}>
        <PoolHeader data={poolDetails} />

        <HStack bgColor="gray.800" p={1} rounded="sm" mb={8}>
          <Option
            title='Informa��es Gerais'
            isSelected={optionSelected === 'guesses'}
            onPress={() => setOptionSelected('guesses')}
          />
          <Option
            title='Participantes'
            isSelected={optionSelected === 'ranking'}
            onPress={() => setOptionSelected('ranking')}
          />
        </HStack>

        {/* <Guesses poolId={poolDetails.id} code={poolDetails.code} /> */}
      </VStack>

      {/* <EmptyMyPoolList code={poolDetails.code} /> */}

    </VStack>
  );
}
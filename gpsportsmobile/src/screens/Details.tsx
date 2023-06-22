// Import das bibliotecas do React
import { Share } from 'react-native';
import { useCallback, useState, useEffect } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FlatList, HStack, ScrollView, useToast, VStack } from 'native-base';

// Import dos icones e componentes
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Option } from '../components/Option';
import { Loading } from '../components/Loading';
import { Guesses } from '../components/Guesses';
import { PoolCardPros } from '../components/PoolCard';
import { PoolHeader } from '../components/PoolHeader';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { PoolCardParticipants } from '../components/PoolCardParticipants';

// Import das configurações do firebase
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../../firebase-config';
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, arrayUnion, getDoc, deleteDoc } from 'firebase/firestore';

export function Details({ route }) {

  // Const de navegação
  const { id: userUid } = route.params;
  const { navigate } = useNavigation();

  // Const de estado
  const toast = useToast();
  const [status, setStatus] = useState(2); // 0 = not registered, 1 = registered, 2 = owner
  const [isLoading, setIsLoading] = useState(true);
  const [optionSelected, setOptionSelected] = useState<'infoGeral' | 'participantes'>('infoGeral')

  // Conexão com o banco
  const db = getFirestore(firebaseConfig);
  const auth = getAuth(firebaseConfig);
  const poolsCollection = collection(db, 'pools');
  const userCollectionConsult = collection(db, 'users');

  // Armazenamento dos dados do banco
  const [poolDetails, setPoolDetails] = useState<PoolCardPros>({} as PoolCardPros);
  const [user, setUsers] = useState([]);

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

  // Função para chamar o carregamento dos dados do evento
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

  // Função para puxar os dados do evento
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

  // Função para descobrir se o usuário é dono, participante ou não está inscrito no evento
  async function consultUser() {

    try {
      const dataUser = query(userCollectionConsult, where("id", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(dataUser);
      setUsers(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      const poolDoc = doc(db, 'pools', poolDetails.id);
      const poolSnapshot = await getDoc(poolDoc);
      const poolData = poolSnapshot.data();

      if (poolData && poolData.participantes && poolData.owner) {
        const userIsRegistered = poolData.participantes.some(
          participant => participant.id === auth.currentUser.uid
        );

        const userIsMaster = poolData.owner.id === auth.currentUser.uid;

        if (userIsMaster) {
          setStatus(2);
        } else if (userIsRegistered) {
          setStatus(1);
        } else {
          setStatus(0);
        }
      }

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  // Função para se cadastrar no evento
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

  // Função para deletar o evento
  async function deleteEvent() {
    try {
      const poolDoc = doc(db, 'pools', poolDetails.id);
      await deleteDoc(poolDoc);
      toast.show({
        title: 'Evento deletado com sucesso',
        placement: 'top',
        bgColor: 'green.500'
      })

      navigate('pools');

    } catch (error) {
      toast.show({
        title: 'Não foi possível deletar o evento',
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  // Função para compartilhar código com outras pessoas
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

          {status == 2 ?
            <VStack>
              <Button title="EDITAR EVENTO" mb={4} onPress={() => navigate('editevent', { id: userUid })} />
              <Button title="EXCLUIR EVENTO" type="SECUNDARY" onPress={deleteEvent} />
            </VStack>
            : <></>}

        </VStack>
      </VStack>
    </ScrollView>
  );
}
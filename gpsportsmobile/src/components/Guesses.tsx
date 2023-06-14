import { useCallback, useEffect, useState } from 'react';
import { Box, Heading, VStack, useToast, Text, View, HStack } from 'native-base';
import { useFocusEffect } from '@react-navigation/native';

import { Loading } from '../components/Loading';

import { firebaseConfig } from '../../firebase-config';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';


interface Props {
  poolId: string;
}

export function Guesses({ poolId }: Props) {

  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  // Informações do Firebase

  const db = getFirestore(firebaseConfig);
  const poolsCollection = collection(db, 'pools');
  const [dadosPool, setDadosPool] = useState([]);

  const data = dadosPool[0]?.date?.toDate();
  const opcoes = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  const dataFormatada = data ? data.toLocaleDateString('pt-BR', opcoes) : 'Data não informada';
  console.log(dataFormatada);

  const fetchInformacoes = async () => {
    try {
      setIsLoading(true);

      console.log(poolId);

      const detailsPoolsQuery = query(poolsCollection, where('code', '==', poolId));

      const detailsPoolsSnapshot = await getDocs(detailsPoolsQuery);

      if (detailsPoolsSnapshot.docs.length > 0) {
        setDadosPool(detailsPoolsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      }

    } catch (error) {

      console.log(error);

      toast.show({
        title: 'Não foi possível carregar os dados do evento',
        placement: 'top',
        bgColor: 'red.500'
      });

    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (poolId !== undefined) {
      fetchInformacoes();
    }
  }, [poolId])

  if (isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <VStack
      w="full"
      bgColor="gray.800"
      rounded="sm"
      alignItems="center"
      borderBottomWidth={3}
      borderBottomColor="purple.500"
      mb={3}
      p={4}
    >
      {dadosPool.map((user) => {
        return (
          <VStack key={user.id}>

            <VStack mt={4} mx={4} alignItems="center">
              <Heading color="white" fontSize="md" fontFamily="heading"> Esporte do Evento </Heading>
              <Text color="gray.300" fontSize="sm" fontFamily="heading"> {user.esporte} </Text>
            </VStack>
            <VStack mt={4} mx={4} alignItems="center">
              <Heading color="white" fontSize="md" fontFamily="heading"> Data e hora </Heading>
              <Text color="gray.300" fontSize="sm" fontFamily="heading"> {dataFormatada} </Text>

            </VStack>

            {user.particular == true ? (
              <HStack alignItems="center" justifyContent={'space-between'} mt={4}>
                <VStack mt={4} alignItems="center" mx={2}>
                  <Heading color="white" fontSize="md" fontFamily="heading"> Local Particular? </Heading>
                  <Text color="gray.300" fontSize="sm" fontFamily="heading"> Sim </Text>
                </VStack>
                <VStack mt={4} alignItems="center" mx={2}>
                  <Heading color="white" fontSize="md" fontFamily="heading"> Valor p/Pessoa </Heading>
                  <Text color="gray.300" fontSize="sm" fontFamily="heading"> {user.valor} </Text>
                </VStack>
              </HStack>
            ) : (
              <VStack mt={4} alignItems="center">
                <Heading color="white" fontSize="md" fontFamily="heading"> Local Particular? </Heading>
                <Text color="gray.300" fontSize="sm" fontFamily="heading"> Não </Text>
              </VStack>
            )}

            <HStack alignItems="center" justifyContent={'space-between'} mt={4}>
              <VStack alignItems="center" mx={2}>
                <Heading color="white" fontSize="md" fontFamily="heading"> CEP </Heading>
                <Text color="gray.300" fontSize="sm" fontFamily="heading"> {user.cep} </Text>
              </VStack>

              <VStack alignItems="center" mx={2}>
                <Heading color="white" fontSize="md" fontFamily="heading"> Estado </Heading>
                <Text color="gray.300" fontSize="sm" fontFamily="heading"> {user.estado} </Text>
              </VStack>

              <VStack alignItems="center" mx={2}>
                <Heading color="white" fontSize="md" fontFamily="heading"> Cidade </Heading>
                <Text color="gray.300" fontSize="sm" fontFamily="heading"> {user.cidade} </Text>
              </VStack>

            </HStack>

            <VStack mt={4} alignItems="center">
              <Heading color="white" fontSize="md" fontFamily="heading"> Rua/Avenida </Heading>
              <Text color="gray.300" fontSize="sm" fontFamily="heading"> {user.rua} </Text>
            </VStack>

            <HStack alignItems="center" justifyContent={'space-between'} mt={4}>
              <VStack alignItems="center" mx={2}>
                <Heading color="white" fontSize="md" fontFamily="heading"> Bairro </Heading>
                <Text color="gray.300" fontSize="sm" fontFamily="heading"> {user.bairro} </Text>
              </VStack>

              <VStack alignItems="center" mx={2}>
                <Heading color="white" fontSize="md" fontFamily="heading"> Número </Heading>
                <Text color="gray.300" fontSize="sm" fontFamily="heading"> {user.numero} </Text>
              </VStack>
            </HStack>

            <VStack mt={4} alignItems="center">
              <Heading color="white" fontSize="md" fontFamily="heading"> Referência do Local </Heading>
              <Text color="gray.300" fontSize="sm" fontFamily="heading"> {user.ref} </Text>
            </VStack>

            <VStack mt={4} alignItems="center">
              <Heading color="white" fontSize="md" fontFamily="heading"> Observações </Heading>
              <Text color="gray.300" fontSize="sm" fontFamily="heading"> {user.obs} </Text>
            </VStack>

          </VStack>
        );
      })}
    </VStack>
  );
}

// Import das bibliotecas do React
import * as React from "react";
import { Heading, HStack, Text, VStack } from 'native-base';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

// Import dos Componentes
import { Participants, ParticipantProps } from './Participants';

export interface PoolCardPros {
  id: string;
  code: string;
  title: string;
  createdAt: string;
  owner: {
    name: string;
    ownerId: string;
  },
  participants: ParticipantProps[];
  _count: {
    participants: number;
  }
}

interface Props extends TouchableOpacityProps {
  data: PoolCardPros;
}

export function PoolCard({ data, ...rest }: Props) {

  console.log('verificando dados ' + data.participants);

  return (
    <TouchableOpacity {...rest}>
      <HStack
        w="full"
        h={20}
        bgColor="gray.800"
        borderBottomWidth={3}
        borderBottomColor="purple.500"
        justifyContent="space-between"
        alignItems="center"
        rounded="sm"
        mb={3}
        p={4}
      >
        <VStack>
          <Heading color="white" fontSize="md" fontFamily="heading">
            {data.title}
          </Heading>

          <Text color="gray.200" fontSize="xs">
            Criado por {data.owner?.name || 'Desconhecido'}
          </Text>
        </VStack>
        <Participants
          count={data._count.participants}
          participants={data.participants}
        />
      </HStack>
    </TouchableOpacity>
  );
}
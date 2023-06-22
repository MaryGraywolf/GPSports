// Import das bibliotecas do React
import * as React from "react";
import { Avatar, Heading, HStack, VStack } from 'native-base';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

export interface PoolCardPros {
  id: string;
  user: {
    name: string;
  };
}

interface Props extends TouchableOpacityProps {
  data: PoolCardPros;
}

export function PoolCardParticipants({ data, ...rest }: Props) {

  return (
    <TouchableOpacity {...rest}>
      <HStack
        w="full"
        bgColor="gray.800"
        borderBottomWidth={3}
        borderBottomColor="purple.500"
        rounded="sm"
        mb={3}
        p={4}
      >

        <Avatar
          w={12}
          h={12}
          rounded="full"
          borderWidth={2}
          //marginRight={-3}
          borderColor="gray.800"
        >
          {data.user?.name?.at(0).toUpperCase()}
        </Avatar>

        <VStack ml={4} mt={'2%'}>

          <Heading color="white" fontSize="md" fontFamily="heading">
            {data.user.name}
          </Heading>

        </VStack>
      </HStack>
    </TouchableOpacity>
  );
}
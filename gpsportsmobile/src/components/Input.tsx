import * as React from "react";
import { Input as NativeBaseInput, IInputProps } from 'native-base';

export function Input({ ...rest }: IInputProps) {
  return (
    <NativeBaseInput
      bg="gray.800"
      h={14}
      px={4}
      w={'full'}
      borderColor="gray.600"
      fontSize="md"
      fontFamily="body"
      color="gray.300"
      placeholderTextColor="gray.300"
      _focus={{
        bg: "gray.800",
        borderColor: "gray.600"
      }}
      {...rest}
    />
  );
}
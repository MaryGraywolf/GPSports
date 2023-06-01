import { Select as NativeBaseSelect, ISelectProps} from 'native-base';

export function Select({ ...rest }: ISelectProps) {
  return (
    <NativeBaseSelect
      bg="gray.300"
      h={14}
      px={4}
      borderColor="blue.900"
      fontSize="md"
      fontFamily="body"
      color="white"
      {...rest}
    />
  );
}
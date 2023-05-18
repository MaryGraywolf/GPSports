import { Button as ButtonNativeBase, Text, IButtonProps } from 'native-base'

export interface Props extends IButtonProps{
    title: string;
    type?: 'PRIMARY' | 'SECUNDARY';
}

export function Button({ title, type = 'PRIMARY', ...rest }: Props){
    return (
        <ButtonNativeBase 
        w="full"
        h={14}
        rounded="sm"
        fontSize="md"
        textTransform="uppercase"
        bg={type === 'SECUNDARY' ? 'red.500' : 'purple.500'}
        _pressed={{
            bg: type === 'SECUNDARY' ? 'red.600' : 'purple.500'
        }}
        _loading={{
            _spinner: { color: 'black'}
        }}
        { ...rest }>
            <Text
            fontSize="sm"
            fontFamily="heading"
            color={type == 'SECUNDARY' ? 'white' : 'black'}
            >
                {title}
            </Text>
        </ButtonNativeBase>
    );
}
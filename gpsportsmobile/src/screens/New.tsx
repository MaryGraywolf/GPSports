import { Center, Heading } from 'native-base';
import { Select as NativeBaseSelect } from "native-base";  
import { VStack } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";

export function New(){   
    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Criar evento esportivo" showBackButton/>

            <VStack mt={8} mx={5} alignItems="center">
                <Heading fontFamily="heading" color="purple.500" fontSize="xl" my={5} textAlign="center">
                    GPSPORTS
                </Heading>
                <Heading fontFamily="heading" color="white" fontSize="25" textAlign="center">
                    Crie seu evento de esporte e compartilhe entre amigos!
                </Heading>
            </VStack>
            <VStack mt={8} mx={5} alignItems="center">
                <Input
                mb={2}
                placeholder='Qual nome do seu evento esportivo?'
                />
            </VStack>
        </VStack>      
    );
}
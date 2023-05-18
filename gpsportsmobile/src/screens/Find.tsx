import { Center, Heading } from 'native-base';
import { Select as NativeBaseSelect } from "native-base";  
import { VStack } from "native-base";
import { Button } from "../components/Button"
import { Header } from "../components/Header";
import { Input } from "../components/Input";

export function Find(){   
    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Buscar evento esportivo" showBackButton/>

            <VStack mt={8} mx={5} alignItems="center">
                <Heading fontFamily="heading" color="white" fontSize="20" textAlign="center">
                   Encontrar um evento esportivo através do código
                </Heading>
            </VStack>
            <VStack mt={8} mx={5} alignItems="center">
                <Input
                mb={2}
                placeholder='Qual o código do seu evento esportivo?'
                />

                <Button 
                    title="BUSCAR EVENTO ESPORTIVO"
                />

            </VStack>
        </VStack>      
    );
}
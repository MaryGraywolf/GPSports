import * as React from "react";
import {Spinner, Center, NativeBaseProvider} from 'native-base';

export function Loading() {
    return (
        <Center flex={1} bg="gray.900">
            <Spinner color="purple.500"/>
        </Center>
    );
};
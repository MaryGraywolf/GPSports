//Import das bibliotecas do React
import * as React from "react";
import { NativeBaseProvider, StatusBar} from 'native-base';

//Import das bibliotecas de fontes e temas
import { theme } from './src/styles/theme';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';

//Import das rotas e do componente de loading
import { Loading } from './src/components/Loading';
import { Routes } from './src/routes';

export default function App() {

  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_500Medium, Roboto_700Bold });

  return (
    <NativeBaseProvider theme={theme}>
        <StatusBar 
          backgroundColor="transparent" 
          barStyle="light-content"
          translucent
        /> 
        
        {fontsLoaded ? <Routes /> : <Loading />}
    </NativeBaseProvider>
  );
}
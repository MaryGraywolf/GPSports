import { NativeBaseProvider, StatusBar} from 'native-base';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';

import { Find } from './src/screens/Find';
import { Loading } from './src/components/Loading';

import { theme } from './src/styles/theme';
import { AuthContextProvider } from './src/contexts/AuthContext';
import { SignIn } from './src/screens/SignIn';

export default function App() {

  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_500Medium, Roboto_700Bold });

  return (
    <NativeBaseProvider theme={theme}>
      <AuthContextProvider>
        <StatusBar 
          backgroundColor="transparent" 
          barStyle="light-content"
          translucent
        /> 
        
        {fontsLoaded ? <SignIn /> : <Loading />}
        </AuthContextProvider>
    </NativeBaseProvider>
  );
}
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { PlusCircle, SoccerBall, UserCircle } from 'phosphor-react-native';
import { useTheme } from 'native-base';
import { Platform } from 'react-native';

import { New } from '../screens/New';
import { Pools } from '../screens/Pools';
import { Find } from '../screens/Find';
import { User } from '../screens/User';
import { SignIn } from '../screens/SignIn';
import { Register } from '../screens/Register';
import { InfoRegisterUser } from '../screens/InfoRegisterUser';
import { EmailVerification } from '../screens/EmailVerification';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  const { colors } = useTheme();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.purple[500],
        tabBarInactiveTintColor: colors.gray[300],
        tabBarStyle: {
          position: 'absolute',
          height: 64,
          borderTopWidth: 0,
          backgroundColor: colors.gray[800],
        },
        tabBarItemStyle: {
          position: 'relative',
          top: Platform.OS == 'android' ? -10 : 0
        }
      }}
    >
      <Screen
        name="sign"
        component={SignIn}
        options={{
          tabBarButton: () => null,
          headerShown: false,
          tabBarStyle: { display: 'none' }
        }}
      />

      <Screen
        name="regi"
        component={Register}
        options={{
          tabBarButton: () => null,
          headerShown: false,
          tabBarStyle: { display: 'none' }
        }}
      />

      <Screen
        name="email"
        component={EmailVerification}
        options={{
          tabBarButton: () => null,
          headerShown: false,
          tabBarStyle: { display: 'none' }
        }}
      />

      <Screen
        name="inforegisteruser"
        component={InfoRegisterUser}
        initialParams={{ id: '' }}
        options={{
          tabBarButton: () => null,
          headerShown: false,
          tabBarStyle: { display: 'none' }
        }}
      />

      <Screen
        name="new"
        component={New}
        options={{
          tabBarIcon: ({ color, size }) => <PlusCircle color={color} />,
          tabBarLabel: ''
        }}
      />

      <Screen
        name="pools"
        component={Pools}
        options={{
          tabBarIcon: ({ color, size }) => <SoccerBall color={color} />,
          tabBarLabel: ''
        }}
      />

      <Screen
        name="user"
        component={User}
        initialParams={{ user: '' }} // Defina o tipo e o valor inicial do par�metro email
        options={{
          tabBarIcon: ({ color, size }) => <UserCircle color={color} />,
          tabBarLabel: ''
        }}
      />

      <Screen
        name="find"
        component={Find}
        options={{ tabBarButton: () => null }}
      />


    </Navigator>
  );
}

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
import { Details } from '../screens/Details';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  const { colors, sizes } = useTheme();

  const size = sizes[7];

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: 'beside-icon',
        tabBarActiveTintColor: colors.purple[500],
        tabBarInactiveTintColor: colors.gray[300],
        tabBarStyle: {
          position: 'absolute',
          height: sizes[22],
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
        name="pools"
        component={Pools}
        options={{
          tabBarIcon: ({ color }) => <SoccerBall color={color} size={size} />,
          tabBarLabel: () => null
        }}
      />

      <Screen
        name="new"
        component={New}
        options={{
          tabBarIcon: ({ color }) => <PlusCircle color={color} size={size} />,
          tabBarLabel: () => null
        }}
      />

      <Screen
        name="user"
        component={User}
        initialParams={{ user: '' }} // Defina o tipo e o valor inicial do par�metro email
        options={{
          tabBarIcon: ({ color }) => <UserCircle color={color} size={size} />,
          tabBarLabel: () => null
        }}
      />

      <Screen
        name="find"
        component={Find}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name="details"
        component={Details}
        initialParams={{ id: '' }}
        options={{ tabBarButton: () => null }}
      />


    </Navigator>
  );
}

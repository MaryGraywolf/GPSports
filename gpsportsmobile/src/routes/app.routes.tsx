import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PlusCircle , SoccerBall, UserCircle} from 'phosphor-react-native';
import { useTheme } from 'native-base';
import { Platform } from 'react-native';

import { New } from '../screens/New';
import { Pools } from '../screens/Pools';
import { Find } from '../screens/Find';
import { User } from '../screens/User';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {

    const {colors} = useTheme();

    return(
        <Navigator screenOptions={{
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
        }}>
            <Screen 
                name="new"
                component={New}
                options={{
                    tabBarIcon: ({ color, size }) => <PlusCircle color={color}/>,
                    tabBarLabel: 'Novo Evento'

                }}
            />

            <Screen 
                name="pools"
                component={Pools}
                options={{
                    tabBarIcon: ({ color, size }) => <SoccerBall color={color}/>,
                    tabBarLabel: 'Meus Eventos'
                }}
            />

            <Screen 
                name="user"
                component={User}
                options={{
                    tabBarIcon: ({ color, size }) => <UserCircle color={color}/>,
                    tabBarLabel: 'Perfil'
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
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Quadras from './screens/Quadras';
import Reservas from './screens/Reservas';
import Horarios from './screens/Horarios';

const Tab = createBottomTabNavigator();

export default function Rotas() {
    return (
        <NavigationContainer>
             <Tab.Navigator>
                <Tab.Screen name="Quadra" component={Quadras} />
                <Tab.Screen name="Reservas" component={Reservas} />
                <Tab.Screen name="Horarios" component={Horarios} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
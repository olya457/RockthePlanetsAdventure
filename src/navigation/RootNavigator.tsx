import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';

import LoaderScreen from '../screens/LoaderScreen';
import OnboardScreen from '../screens/OnboardScreen';
import MenuScreen from '../screens/MenuScreen';

import LaunchRocketScreen from '../screens/LaunchRocketScreen';
import StarExchangeScreen from '../screens/StarExchangeScreen';
import PlanetGuideScreen from '../screens/PlanetGuideScreen';
import ControlCenterScreen from '../screens/ControlCenterScreen';

import ConstellationsScreen from '../screens/ConstellationsScreen';
import ArticleScreen from '../screens/ArticleScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Loader"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Loader" component={LoaderScreen} />
      <Stack.Screen name="Onboard" component={OnboardScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} />

      <Stack.Screen name="LaunchRocket" component={LaunchRocketScreen} />
      <Stack.Screen name="StarExchange" component={StarExchangeScreen} />
      <Stack.Screen name="PlanetGuide" component={PlanetGuideScreen} />
      <Stack.Screen name="Constellations" component={ConstellationsScreen} />
      <Stack.Screen name="ControlCenter" component={ControlCenterScreen} />
      <Stack.Screen name="Article" component={ArticleScreen} />
    </Stack.Navigator>
  );
}

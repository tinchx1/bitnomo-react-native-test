import React from 'react';
import { NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import PaymentScreen from './PaymentScreen';
import CurrencySelectionScreen from './CurrencySelectionScreen';
import PaymentShareScreen from './PaymentShareScreen';
import CountrySelectionScreen from './CountrySelectionScreen';

// Create a stack navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationIndependentTree>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="CurrencySelection" component={CurrencySelectionScreen} />
        <Stack.Screen name="PaymentShare" component={PaymentShareScreen} />
        <Stack.Screen name="CountrySelection" component={CountrySelectionScreen} />
      </Stack.Navigator>
    </NavigationIndependentTree>

  );
}
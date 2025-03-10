import React from 'react';
import { NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import PaymentScreen from './PaymentScreen';
import CurrencySelectionScreen from './CurrencySelectionScreen';
import PaymentShareScreen from './PaymentShareScreen';
import CountrySelectionScreen from './CountrySelectionScreen';
import QRCodeScreen from './QRCodeScreen';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import PaymentConfirmationScreen from './PaymentConfirmationScreen';

// Create a stack navigator
const Stack = createStackNavigator();

const isWeb = Platform.OS === 'web';
// Ancho fijo para la aplicación en web (similar a un iPhone)
const FIXED_WIDTH = 390;

// Componente contenedor para centrar la app en web
const AppContainer = ({ children }) => {
  if (!isWeb) {
    return children;
  }

  return (
    <View style={styles.webContainer}>
      <View style={styles.phoneContainer}>
        {children}
      </View>
    </View>
  );
};

export default function App() {
  return (
    <AppContainer>
      <NavigationIndependentTree>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="CurrencySelection" component={CurrencySelectionScreen} />
          <Stack.Screen name="PaymentShare" component={PaymentShareScreen} />
          <Stack.Screen name="CountrySelection" component={CountrySelectionScreen} />
          <Stack.Screen name="QRCode" component={QRCodeScreen} />
          <Stack.Screen name="PaymentConfirmation" component={PaymentConfirmationScreen} />
        </Stack.Navigator>
      </NavigationIndependentTree>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Color de fondo para el área fuera de la app
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneContainer: {
    width: FIXED_WIDTH,
    height: '100%',
    maxHeight: 844, // Altura aproximada de un iPhone 13
    backgroundColor: 'white',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
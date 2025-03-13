import React, { useEffect } from 'react';
import { NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { View, StyleSheet, Platform, Text } from 'react-native';
import PaymentScreen from './PaymentScreen';
import CurrencySelectionScreen from './CurrencySelectionScreen';
import PaymentShareScreen from './PaymentShareScreen';
import CountrySelectionScreen from './CountrySelectionScreen';
import QRCodeScreen from './QRCodeScreen';
import PaymentConfirmationScreen from './PaymentConfirmationScreen';
import * as SplashScreen from 'expo-splash-screen';


// Stack Navigator
const Stack = createStackNavigator();
const isWeb = Platform.OS === 'web';
const FIXED_WIDTH = 390;
SplashScreen.preventAutoHideAsync();

// Contenedor para centrar en Web
const AppContainer = ({ children }) => {

  const [loaded, error] = useFonts({
    MulishRegular: require('@/assets/fonts/Mulish-Regular.ttf'),
    MulishBold: require('@/assets/fonts/Mulish-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return isWeb ? (
    <View style={styles.webContainer}>
      <View style={styles.phoneContainer}>{children}</View>
    </View>
  ) : (
      children
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
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneContainer: {
    width: FIXED_WIDTH,
    height: '100%',
    maxHeight: 844,
    backgroundColor: 'white',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const PaymentConfirmationScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/bitnovo-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Línea divisoria */}
      <View style={styles.divider} />

      {/* Contenido principal */}
      <View style={styles.content}>
        {/* Imagen de confeti con checkmark */}
        <Image
          source={require('@/assets/images/confetti-success.png')}
          style={styles.confettiImage}
          resizeMode="contain"
        />

        <Text style={styles.title}>Pago recibido</Text>
        <Text style={styles.subtitle}>
          El pago se ha confirmado con éxito
        </Text>
      </View>

      {/* Botón de finalizar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.finishButton}>
          <Text style={styles.finishButtonText}>Finalizar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    maxWidth: 400,
    alignSelf: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  logo: {
    height: 40,
    width: 150,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8ECF2',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  confettiImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#002859',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#647184',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  finishButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0066CC',
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#0066CC',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentConfirmationScreen;
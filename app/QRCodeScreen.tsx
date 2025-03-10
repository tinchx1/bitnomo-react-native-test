import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
// import QRCode from 'react-native-qrcode-svg';

// Logo para el centro del QR
// import BitnovoLogo from './assets/bitnovo-logo.png';

const { width } = Dimensions.get('window');
const QR_SIZE = width * 0.7;

const QRCodeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { amount, currency, paymentLink } = route.params || {
    amount: '56,00',
    currency: { code: 'EUR', symbol: '€' },
    paymentLink: 'pay.bitnovo.com/59f9g9'
  };

  // Estado para simular la actualización automática
  const [isUpdating, setIsUpdating] = useState(false);

  // Simular actualización automática cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true);
      setTimeout(() => {
        setIsUpdating(false);
      }, 500);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#002859" />
        </TouchableOpacity>
      </View>

      {/* Info Alert */}
      <View style={styles.alertContainer}>
        <View style={styles.alertIconContainer}>
          <Ionicons name="information-circle" size={24} color="#0066CC" />
        </View>
        <Text style={styles.alertText}>
          Escanea el QR y serás redirigido a la pasarela de pago de Bitnovo Pay.
        </Text>
      </View>

      {/* QR Code */}
      <View style={styles.qrContainer}>
        {/* <QRCode
          value={`https://${paymentLink}`}
          size={QR_SIZE}
          color="#002859"
          backgroundColor="white"
          // logo={BitnovoLogo}
          logoSize={QR_SIZE * 0.3}
          logoBackgroundColor="white"
          logoBorderRadius={10}
        /> */}
      </View>

      {/* Amount */}
      <Text style={styles.amountText}>{amount} {currency.symbol}</Text>

      {/* Footer */}
      <Text style={styles.footerText}>
        Esta pantalla se actualizará automáticamente.
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0066CC',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    marginHorizontal: 16,
    marginVertical: 20,
    padding: 16,
    borderRadius: 12,
  },
  alertIconContainer: {
    marginRight: 12,
  },
  alertText: {
    flex: 1,
    fontSize: 16,
    color: '#002859',
    lineHeight: 22,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 12,
  },
  amountText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 40,
  },
});

export default QRCodeScreen;
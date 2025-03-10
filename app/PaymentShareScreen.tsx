import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Platform,
  Share,
  Clipboard,
  Alert,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import SuccessModal from './SuccessModal';

// Default country
const defaultCountry = {
  id: 'es',
  name: 'España',
  code: '+34',
};

const PaymentShareScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { amount, currency, description } = route.params || {
    amount: '56,00',
    currency: { code: 'EUR', symbol: '€' },
    description: ''
  };

  // States for WhatsApp sharing
  const [showWhatsAppInput, setShowWhatsAppInput] = useState(route.params?.showWhatsAppInput || false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    title: '',
    message: '',
    buttonText: 'Entendido',
  });

  // Update selected country when returning from country selection
  useEffect(() => {
    if (route.params?.selectedCountry) {
      setSelectedCountry(route.params.selectedCountry);
    }
  }, [route.params?.selectedCountry]);

  // Generate a random payment link
  const paymentLink = `pay.bitnovo.com/59f9g9`;

  const copyToClipboard = () => {
    Clipboard.setString(paymentLink);
    Alert.alert('Enlace copiado', 'El enlace de pago ha sido copiado al portapapeles.');
  };

  const shareViaEmail = () => {
    // In a real app, this would open the email app or a form
    Alert.alert('Enviar por correo', 'Esta función abriría la app de correo electrónico.');
  };

  const toggleWhatsAppInput = () => {
    setShowWhatsAppInput(!showWhatsAppInput);
  };

  const openCountrySelector = () => {
    navigation.navigate('CountrySelection', {
      currentCountryId: selectedCountry.id,
    });
  };

  const sendWhatsAppMessage = () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Por favor, introduce un número de teléfono.');
      return;
    }

    // Show success modal
    setModalInfo({
      title: 'Solicitud enviada',
      message: `Tu solicitud de pago enviada ha sido enviado con éxito por WhatsApp.`,
      buttonText: 'Entendido',
    });
    setShowSuccessModal(true);
  };

  const shareWithOtherApps = async () => {
    try {
      await Share.share({
        message: `Solicitud de pago por ${amount} ${currency.symbol}. Enlace: ${paymentLink}`,
        url: `https://${paymentLink}`,
        title: 'Solicitud de pago',
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir el enlace.');
    }
  };

  const createNewRequest = () => {
    // Show success modal first
    setModalInfo({
      title: 'Solicitud enviada',
      message: 'Tu solicitud de pago ha sido creada con éxito.',
      buttonText: 'Entendido',
    });
    setShowSuccessModal(true);
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    // If this was from the "Nueva solicitud" button, navigate back to payment screen
    if (modalInfo.message.includes('creada con éxito')) {
      navigation.navigate('Payment', { reset: true });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Image
              source={require('@/assets/images/pending.png')}
              style={styles.headerIcon}
              resizeMode="contain"
            />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Solicitud de pago</Text>
            <Text style={styles.amount}>{amount} {currency.symbol}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>Comparte el enlace de pago con el cliente</Text>


        {/* Payment Link */}
        <View style={styles.linkContainer}>
          <TouchableOpacity style={styles.linkContent} onPress={copyToClipboard}>
            <Image
              source={require('@/assets/images/link.png')}
              style={styles.linkIcon}
              resizeMode="contain"
            />
            <Text style={styles.linkText}>{paymentLink}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.qrButton}>
            <Image
              source={require('@/assets/images/scan-barcode.png')}
              style={styles.qrIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Email Option */}
        <TouchableOpacity style={styles.shareOption} onPress={shareViaEmail}>
          <View style={styles.shareIconContainer}>
            <Image
              source={require('@/assets/images/email.png')}
              style={styles.shareIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.shareOptionText}>Enviar por correo electrónico</Text>
        </TouchableOpacity>

        {/* WhatsApp Option */}
        {showWhatsAppInput ? (
          <View style={styles.whatsappInputContainer}>
            <View style={styles.phoneInputRow}>
              <TouchableOpacity
                style={styles.countrySelector}
                onPress={openCountrySelector}
              >
                <Image
                  source={require('@/assets/images/wsp.png')}
                  style={styles.shareIcon}
                  resizeMode="contain"
                />
                <Text style={styles.countryCode}>{selectedCountry.code}</Text>
                <Ionicons name="chevron-down" size={16} color="#8E9AAB" />
              </TouchableOpacity>

              <TextInput
                style={styles.phoneInput}
                placeholder="200 5869 75423"
                placeholderTextColor="#9EA3AE"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />

              <TouchableOpacity style={styles.sendButton} onPress={sendWhatsAppMessage}>
                <Text style={styles.sendButtonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.shareOption} onPress={toggleWhatsAppInput}>
            <View style={styles.shareIconContainer}>
              <Image
                source={require('@/assets/images/wsp.png')}
                style={styles.shareIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.shareOptionText}>Enviar a número de WhatsApp</Text>
          </TouchableOpacity>
        )}

        {/* Share with other apps */}
        <TouchableOpacity style={styles.shareOption} onPress={shareWithOtherApps}>
          <View style={styles.shareIconContainer}>
            <Image
              source={require('@/assets/images/export.png')}
              style={styles.shareIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.shareOptionText}>Compartir con otras aplicaciones</Text>
        </TouchableOpacity>
      </View>

      {/* New Request Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.newRequestButton} onPress={createNewRequest}>
          <Text style={styles.newRequestText}>Nueva solicitud</Text>
          <View>
            <Image
              source={require('@/assets/images/add-wallet.png')}
              style={styles.shareIcon}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        title={modalInfo.title}
        message={modalInfo.message}
        buttonText={modalInfo.buttonText}
        onClose={handleModalClose}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
  },
  header: {
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    width: 60,
    height: 60,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    color: '#647184',
    marginBottom: 4,
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0A2463',
  },
  subtitle: {
    fontSize: 16,
    color: '#647184',
    marginBottom: 24,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  linkContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8ECF2',
    borderRadius: 8,
    padding: 16,
    marginRight: 12,
    backgroundColor: 'white',
  },
  linkIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  linkText: {
    fontSize: 16,
    color: '#0A2463',
  },
  qrButton: {
    width: 54,
    height: 54,
    borderRadius: 8,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8ECF2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  shareIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  shareIcon: {
    width: 20,
    height: 20,
  },
  shareOptionText: {
    fontSize: 16,
    color: '#0A2463',
  },
  whatsappInputContainer: {
    borderWidth: 1,
    borderColor: '#0066CC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  whatsappIcon: {
    marginRight: 8,
    color: '#25D366',
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0A2463',
    marginRight: 4,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#0A2463',
    paddingVertical: 4,
  },
  sendButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 8,
  },
  sendButtonText: {
    color: 'white',
    // fontWeight: '500',
    fontSize: 16,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  newRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  newRequestText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0066CC',
    marginRight: 8,
  },
  plusIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PaymentShareScreen;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';

// Define currency data with base64 encoded flags for Expo compatibility
export const currencies = [
  {
    id: 'eur',
    name: 'Euro',
    code: 'EUR',
    symbol: '€',
    // In a real app, you would use require('./assets/flags/eu.png')
    // For this example, we'll use a placeholder approach
    flagColor: '#0052B4', // EU blue
  },
  {
    id: 'usd',
    name: 'Dólar Estadounidense',
    code: 'USD',
    symbol: '$',
    flagColor: '#BD3D44', // US red
  },
  {
    id: 'gbp',
    name: 'Libra Esterlina',
    code: 'GBP',
    symbol: '£',
    flagColor: '#012169', // UK blue
  },
];

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Get the selected currency from route params or use USD as default
  const [selectedCurrencyId, setSelectedCurrencyId] = useState('usd');
  const [amount, setAmount] = useState('0.00');
  const [description, setDescription] = useState('');

  // Find the current currency object
  const selectedCurrency = currencies.find(c => c.id === selectedCurrencyId) || currencies[1]; // Default to USD

  // Update currency when returning from selection screen
  useEffect(() => {
    if (route.params?.selectedCurrencyId) {
      setSelectedCurrencyId(route.params.selectedCurrencyId);
    }
  }, [route.params?.selectedCurrencyId]);

  const handleNumberPress = (num) => {
    // Remove leading zero if it's the first digit
    if (amount === '0.00') {
      setAmount(num + '.00');
      return;
    }

    // Split the amount into whole and decimal parts
    const parts = amount.split('.');
    const wholePart = parts[0];

    // Update the whole part (before decimal)
    const newWholePart = wholePart + num;
    setAmount(newWholePart + '.00');
  };

  const handleDeletePress = () => {
    if (amount === '0.00' || amount.length === 1) {
      setAmount('0.00');
      return;
    }

    // Remove the last digit from the whole part
    const parts = amount.split('.');
    const wholePart = parts[0];
    const newWholePart = wholePart.slice(0, -1);

    if (newWholePart === '') {
      setAmount('0.00');
    } else {
      setAmount(newWholePart + '.00');
    }
  };

  const openCurrencySelector = () => {
    navigation.navigate('CurrencySelection', {
      currentCurrencyId: selectedCurrencyId,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Crear pago</Text>
        <TouchableOpacity
          style={styles.currencySelector}
          onPress={openCurrencySelector}
        >
          <Text style={styles.currencyText}>{selectedCurrency.code}</Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* Amount Display */}
      <View style={styles.amountContainer}>
        <Text style={styles.amountText}>{selectedCurrency.symbol} {amount}</Text>
      </View>

      {/* Description Field */}
      <View style={styles.conceptContainer}>
        <Text style={styles.conceptLabel}>Concepto</Text>
        <TextInput
          style={styles.conceptInput}
          placeholder="Añade descripción del pago"
          placeholderTextColor="#9EA3AE"
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => {
          // Navigate to the payment share screen with the current amount and currency
          navigation.navigate('PaymentShare', {
            amount: amount,
            currency: selectedCurrency,
            description: description
          });
        }}
      >
        <Text style={styles.continueButtonText}>Continuar</Text>
      </TouchableOpacity>
      {/* Custom Keypad */}
      <View style={styles.keypadContainer}>
        <View style={styles.keypadRow}>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handleNumberPress('1')}>
            <Text style={styles.keypadNumber}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handleNumberPress('2')}>
            <Text style={styles.keypadNumber}>2</Text>
            <Text style={styles.keypadLetters}>ABC</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handleNumberPress('3')}>
            <Text style={styles.keypadNumber}>3</Text>
            <Text style={styles.keypadLetters}>DEF</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.keypadRow}>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handleNumberPress('4')}>
            <Text style={styles.keypadNumber}>4</Text>
            <Text style={styles.keypadLetters}>GHI</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handleNumberPress('5')}>
            <Text style={styles.keypadNumber}>5</Text>
            <Text style={styles.keypadLetters}>JKL</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handleNumberPress('6')}>
            <Text style={styles.keypadNumber}>6</Text>
            <Text style={styles.keypadLetters}>MNO</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.keypadRow}>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handleNumberPress('7')}>
            <Text style={styles.keypadNumber}>7</Text>
            <Text style={styles.keypadLetters}>PQRS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handleNumberPress('8')}>
            <Text style={styles.keypadNumber}>8</Text>
            <Text style={styles.keypadLetters}>TUV</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={() => handleNumberPress('9')}>
            <Text style={styles.keypadNumber}>9</Text>
            <Text style={styles.keypadLetters}>WXYZ</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.keypadRow}>
          <View style={styles.emptyKey} />
          <TouchableOpacity style={styles.keypadButton} onPress={() => handleNumberPress('0')}>
            <Text style={styles.keypadNumber}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keypadButton} onPress={handleDeletePress}>
            <Text style={styles.deleteIcon}>⌫</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Home Indicator */}
      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0A2463',
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0A2463',
    marginRight: 5,
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#0A2463',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8ECF2',
  },
  amountContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  amountText: {
    fontSize: 60,
    fontWeight: '300',
    color: '#C5CFD9',
  },
  conceptContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  conceptLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0A2463',
    marginBottom: 10,
  },
  conceptInput: {
    borderWidth: 1,
    borderColor: '#E8ECF2',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#0A2463',
  },
  continueButton: {
    backgroundColor: '#E6F0FF',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: '#4D90FE',
    fontSize: 18,
    fontWeight: '500',
  },
  keypadContainer: {
    backgroundColor: '#E8ECF2',
    marginTop: 'auto',
    paddingTop: 10,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  keypadButton: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keypadNumber: {
    fontSize: 28,
    fontWeight: '400',
    color: '#000',
  },
  keypadLetters: {
    fontSize: 12,
    color: '#666',
    marginTop: -2,
  },
  deleteIcon: {
    fontSize: 24,
    color: '#000',
  },
  emptyKey: {
    flex: 1,
    marginHorizontal: 5,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 8,
  },
});

export default PaymentScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo
import { currencies } from './PaymentScreen'; // Import the shared currency data

const CurrencySelectionScreen = ({ navigation, route }) => {
  // Get the current currency from route params
  const currentCurrencyId = route.params?.currentCurrencyId || 'usd';
  const [selectedCurrency, setSelectedCurrency] = useState(currentCurrencyId);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter currencies based on search query
  const filteredCurrencies = searchQuery
    ? currencies.filter(currency =>
      currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : currencies;

  const handleCurrencySelect = (currencyId) => {
    setSelectedCurrency(currencyId);
    // Navigate back to payment screen with the selected currency
    navigation.navigate('Payment', {
      selectedCurrencyId: currencyId,
    });
  };

  const renderCurrencyItem = ({ item }) => {
    const isSelected = item.id === selectedCurrency;

    return (
      <TouchableOpacity
        style={styles.currencyItem}
        onPress={() => handleCurrencySelect(item.id)}
      >
        <View style={styles.currencyInfo}>
          <Image source={item.flag} style={styles.flagImage} />
          <View style={styles.currencyText}>
            <Text style={styles.currencyName}>{item.name}</Text>
            <Text style={styles.currencyCode}>{item.code}</Text>
          </View>
        </View>

        {isSelected ? (
          <View style={styles.checkmarkContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#4D90FE" />
          </View>
        ) : (
          <Ionicons name="chevron-forward" size={20} color="#8E9AAB" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#0A2463" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Selecciona una divisa</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E9AAB" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar"
          placeholderTextColor="#8E9AAB"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Currency List */}
      <FlatList
        data={filteredCurrencies}
        renderItem={renderCurrencyItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0A2463',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8ECF2',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0A2463',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  currencyText: {
    justifyContent: 'center',
  },
  currencyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A2463',
  },
  currencyCode: {
    fontSize: 14,
    color: '#8E9AAB',
    marginTop: 2,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
  },
});

export default CurrencySelectionScreen;
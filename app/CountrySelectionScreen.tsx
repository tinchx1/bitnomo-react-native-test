import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Platform,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

// Country data with flags, codes, and names
const countries = [
  {
    id: 'es',
    name: 'España',
    code: '+34',
    flag: require('@/assets/flags/es.png'), // You would need to add these flag images
  },
  {
    id: 'gq',
    name: 'Equatorial Guinea',
    code: '+240',
    flag: require('@/assets/flags/gq.png'),
  },
  {
    id: 'gr',
    name: 'Grecia',
    code: '+30',
    flag: require('@/assets/flags/gr.png'),
  },
  {
    id: 'gs',
    name: 'South Georgia and the S...',
    code: '+500',
    flag: require('@/assets/flags/gs.png'),
  },
  {
    id: 'gt',
    name: 'Guatemala',
    code: '+502',
    flag: require('@/assets/flags/gt.png'),
  },
  {
    id: 'gy',
    name: 'Guyana',
    code: '+592',
    flag: require('@/assets/flags/gy.png'),
  },
  {
    id: 'hk',
    name: 'Hong Kong',
    code: '+852',
    flag: require('@/assets/flags/hk.png'),
  },
  {
    id: 'hn',
    name: 'Honduras',
    code: '+504',
    flag: require('@/assets/flags/hn.png'),
  },
];

// For simplicity, we'll use colored circles instead of actual flag images
const CountryFlag = ({ countryId }) => {
  const flagColors = {
    es: '#FF0000', // Spain - red
    gq: '#3A7728', // Equatorial Guinea - green
    gr: '#0D5EAF', // Greece - blue
    gs: '#012169', // South Georgia - blue (UK)
    gt: '#4997D0', // Guatemala - blue
    gy: '#009E49', // Guyana - green
    hk: '#DE2910', // Hong Kong - red
    hn: '#0073CF', // Honduras - blue
  };

  return (
    <View style={[styles.flagCircle, { backgroundColor: flagColors[countryId] || '#CCCCCC' }]} />
  );
};

const CountrySelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');
  const currentCountryId = route.params?.currentCountryId || 'es';

  // Filter countries based on search query
  const filteredCountries = searchQuery
    ? countries.filter(country =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.includes(searchQuery)
    )
    : countries;

  const handleCountrySelect = (country) => {
    // Navigate back to payment share screen with the selected country
    navigation.navigate('PaymentShare', {
      selectedCountry: country,
      showWhatsAppInput: true,
    });
  };

  const renderCountryItem = ({ item }) => {
    const isSelected = item.id === currentCountryId;

    return (
      <TouchableOpacity
        style={[
          styles.countryItem,
          isSelected && styles.selectedCountryItem
        ]}
        onPress={() => handleCountrySelect(item)}
      >
        <View style={styles.countryInfo}>
          <CountryFlag countryId={item.id} />
          <View style={styles.countryText}>
            <Text style={styles.countryCode}>{item.code}</Text>
            <Text style={styles.countryName}>{item.name}</Text>
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
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#0A2463" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seleccionar país</Text>
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

      {/* Country List */}
      <FlatList
        data={filteredCountries}
        renderItem={renderCountryItem}
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
    marginTop: Platform.OS === 'android' ? 30 : 0,
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
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
  },
  selectedCountryItem: {
    backgroundColor: '#F5F7FA',
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  countryText: {
    justifyContent: 'center',
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A2463',
  },
  countryName: {
    fontSize: 14,
    color: '#8E9AAB',
    marginTop: 2,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
  },
});

export default CountrySelectionScreen;
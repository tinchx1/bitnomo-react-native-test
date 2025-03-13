import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Platform,
  Pressable,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppText from '@/components/ui/AppText';

const countries = [
  {
    id: 'es',
    name: 'España',
    code: '+34',
    flag: require('@/assets/flags/es.png'),
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



const CountrySelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchQuery, setSearchQuery] = useState('');
  const currentCountryId = route.params?.currentCountryId || 'es';
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const filteredCountries = searchQuery
    ? countries.filter(country =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.includes(searchQuery)
    )
    : countries;

  const handleCountrySelect = (country) => {
    console.log('Selected country:', country);
    console.log(route.params, "country.id");
    navigation.navigate("PaymentShare", {
      ...route.params, 
      currentCountryId: country.id,
      showWhatsAppInput: true,
      selectedCountry: country,
    });
  }
  const renderCountryItem = ({ item }) => {
    const isSelected = item.id === currentCountryId;
    const isHovered = item.id === hoveredCountry;

    return (
      <Pressable
        style={[
          styles.countryItem,
          isHovered && styles.hoveredCountryItem
        ]}
        onPress={() => handleCountrySelect(item)}
        onPressIn={() => setHoveredCountry(item.id)}
        onPressOut={() => setHoveredCountry(null)}
      >
        <View style={styles.countryInfo}>
          <Image source={item.flag} style={styles.flagCircle} />
          <View style={styles.countryText}>
            <AppText style={styles.countryCode}>{item.code}</AppText>
            <AppText style={styles.countryName}>{item.name}</AppText>
          </View>
        </View>

        {isSelected ? (
          <View style={styles.checkmarkContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#4D90FE" />
          </View>
        ) : (
          <Ionicons name="chevron-forward" size={20} color="#8E9AAB" />
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#0A2463" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <AppText style={styles.headerTitle}>Seleccionar país</AppText>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E9AAB" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar"
          placeholderTextColor="#8E9AAB"
          value={searchQuery}
          onChangeText={setSearchQuery}
          selectionColor="#4D90FE" 
        />
      </View>

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
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center', 
    marginRight: 40, 
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
    textAlign: 'center', 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
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
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  hoveredCountryItem: {
    backgroundColor: '#F5F7FA',
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
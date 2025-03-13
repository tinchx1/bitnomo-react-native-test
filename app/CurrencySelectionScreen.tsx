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
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { currencies } from './PaymentScreen';
import AppText from '@/components/ui/AppText';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';


type CurrencySelectionScreenRouteProp = RouteProp<{ Payment: { currentCurrencyId: string } }, 'Payment'>;

type RootStackParamList = {
  Payment: { selectedCurrencyId: string };
}


const CurrencySelectionScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Payment'>>();
  const route = useRoute<CurrencySelectionScreenRouteProp>();
  const currentCurrencyId = route.params?.currentCurrencyId || 'usd';
  const [selectedCurrency, setSelectedCurrency] = useState<String>(currentCurrencyId);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCurrency, setHoveredCurrency] = useState<string>("");

  const filteredCurrencies = searchQuery
    ? currencies.filter(currency =>
      currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : currencies;

  const handleCurrencySelect = (currencyId: string) => {
    setSelectedCurrency(currencyId);
    navigation.navigate('Payment', {
      selectedCurrencyId: currencyId,
    });
  };

  const renderCurrencyItem = ({ item }: { item: { id: string; name: string; code: string; flag: any } }) => {
    const isSelected = item.id === selectedCurrency;
    const isHovered = item.id === hoveredCurrency;

    return (
      <Pressable
        style={[
          styles.currencyItem,
          isHovered && styles.currencyItemHovered
        ]}
        onPress={() => handleCurrencySelect(item.id)}
        onPressIn={() => setHoveredCurrency(item.id)}
        onPressOut={() => setHoveredCurrency("")}
      >
        <View style={styles.currencyInfo}>
          <Image source={item.flag} style={styles.flagImage} />
          <View style={styles.currencyText}>
            <Text style={styles.currencyName}>{item.name}</Text>
            <AppText style={styles.currencyCode}>{item.code}</AppText>
          </View>
        </View>

        {isSelected ? (
          <View style={styles.checkmarkContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#71b0fd" />
          </View>
        ) : (
          <Ionicons name="chevron-forward" size={20} color="#8E9AAB" />
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#0A2463" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Selecciona una divisa</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Image source={require('@/assets/images/icon-search.png')} style={styles.searchIcon} />
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
    fontFamily: 'MulishBold',
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
    height: 20,
    width: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  currencyItemHovered: {
    backgroundColor: '#F5F7FA',
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
    fontFamily: 'MulishBold',
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
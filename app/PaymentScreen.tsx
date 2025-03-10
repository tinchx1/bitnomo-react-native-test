import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useRoute } from "@react-navigation/native";

export const currencies = [
  {
    id: "eur",
    name: "Euro",
    code: "EUR",
    symbol: "€",
    flag: require("@/assets/flags/eu.png"), // EU blue
  },
  {
    id: "usd",
    name: "Dólar Estadounidense",
    code: "USD",
    symbol: "$",
    flag: require("@/assets/flags/us.png"), // US blue
  },
  {
    id: "gbp",
    name: "Libra Esterlina",
    code: "GBP",
    symbol: "£",
    flag: require("@/assets/flags/gs.png"), // UK blue
  },
];

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const amountInputRef = useRef(null);

  // Estados existentes
  const [selectedCurrencyId, setSelectedCurrencyId] = useState("eur");
  const [amount, setAmount] = useState("0,00");
  const [description, setDescription] = useState("");
  const [amountFocused, setAmountFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [showCursor, setShowCursor] = useState(false);
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const [inputHeight, setInputHeight] = useState(40); // Estado para rastrear la altura del campo de entrada

  // Find the current currency object
  const selectedCurrency = currencies.find((c) => c.id === selectedCurrencyId) || currencies[0]; // Default to EUR

  // Update currency when returning from selection screen
  useEffect(() => {
    if (route.params?.selectedCurrencyId) {
      setSelectedCurrencyId(route.params.selectedCurrencyId);
    }
  }, [route.params?.selectedCurrencyId]);

  // Manejar cambios en el monto
  const handleAmountChange = (text) => {
    // Eliminar caracteres no numéricos
    const numericValue = text.replace(/[^0-9]/g, "");

    if (numericValue === "") {
      setAmount("0,00");
      setShowCursor(false);
    } else {
      // Formatear como número con dos decimales y coma como separador decimal
      const value = Number.parseInt(numericValue) / 100;
      const formattedValue = value.toFixed(2).replace(".", ",");
      setAmount(formattedValue);
      setShowCursor(false);
    }
  };

  // Manejar cambios en la descripción
  const handleDescriptionChange = (text) => {
    // Limitar a 140 caracteres
    if (text.length <= 140) {
      setDescription(text);
      setCharCount(text.length);
    }
  };

  const openCurrencySelector = () => {
    // Ocultar el teclado antes de navegar
    Keyboard.dismiss();
    navigation.navigate("CurrencySelection", {
      currentCurrencyId: selectedCurrencyId,
    });
  };

  // Función para enfocar el campo de monto
  const focusAmountInput = () => {
    if (amountInputRef.current) {
      amountInputRef.current.focus();
      if (amount === "0,00") {
        setShowCursor(true);
        setAmount("");
      }
    }
  };

  // Determinar si el monto es diferente de 0,00
  const isAmountNonZero = amount !== "0,00" && amount !== "";

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Importe a pagar</Text>
          <TouchableOpacity style={styles.currencySelector} onPress={openCurrencySelector}>
            <Text style={styles.currencyText}>{selectedCurrency.code}</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Amount Display */}
        <TouchableOpacity style={styles.amountContainer} onPress={focusAmountInput} activeOpacity={0.8}>
          {showCursor ? (
            <View style={styles.amountWrapper}>
              <Text style={[styles.amountText, styles.amountTextFocused]}>|€</Text>
            </View>
          ) : (
            <Text style={[styles.amountText, (amountFocused || isAmountNonZero) && styles.amountTextFocused]}>
              {amount}€
            </Text>
          )}
          <TextInput
            ref={amountInputRef}
            style={styles.hiddenInput}
            keyboardType="number-pad"
            value={amount === "0,00" ? "" : amount}
            onChangeText={handleAmountChange}
            caretHidden={true}
            onFocus={() => {
              setAmountFocused(true);
              if (amount === "0,00") {
                setShowCursor(true);
                setAmount("");
              }
            }}
            onBlur={() => {
              setAmountFocused(false);
              setShowCursor(false);
              if (amount === "") {
                setAmount("0,00");
              }
            }}
          />
        </TouchableOpacity>

        {/* Description Field */}
        <View style={styles.conceptContainer}>
          <Text style={styles.conceptLabel}>Concepto</Text>
          <TextInput
            multiline={true} // Permitir múltiples líneas
            style={[
              styles.conceptInput,
              { height: inputHeight }, // Ajustar la altura del campo de entrada
              (description.length > 0 || isDescriptionFocused) && styles.conceptInputActive,
            ]}
            placeholder="Añade descripción del pago"
            placeholderTextColor="#9EA3AE"
            value={description}
            onChangeText={handleDescriptionChange}
            maxLength={140}
            onFocus={() => setIsDescriptionFocused(true)}
            onBlur={() => setIsDescriptionFocused(false)}
            onContentSizeChange={(e) => setInputHeight(e.nativeEvent.contentSize.height)} // Actualizar la altura del campo de entrada
          />
          <Text style={(description.length > 0 || isDescriptionFocused) ? styles.charCounter : [styles.charCounter, styles.none]}>{charCount}/140 caracteres</Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueButton, isAmountNonZero && styles.continueButtonActive]}
          onPress={() => {
            Keyboard.dismiss();
            navigation.navigate("PaymentShare", {
              amount: amount,
              currency: selectedCurrency,
              description: description,
            });
          }}
        >
          <Text style={[styles.continueButtonText, isAmountNonZero && styles.continueButtonTextActive]}>Continuar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  none: {
    opacity: 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: Platform.OS === "android" ? 30 : 0,
    position: "relative",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "600",
    color: "#002859",
  },
  currencySelector: {
    position: "absolute",
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff2f7",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#002859",
    marginRight: 5,
  },
  dropdownIcon: {
    fontSize: 12,
    color: "#002859",
  },
  divider: {
    height: 1,
    backgroundColor: "#d3dce6",
  },
  amountContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  amountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  amountText: {
    fontSize: 60,
    fontWeight: "300",
    color: "#c0ccda",
  },
  amountTextFocused: {
    color: "#0052b4",
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  conceptContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  conceptLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#002859",
    marginBottom: 10,
  },
  conceptInput: {
    borderWidth: 1,
    borderColor: "#d3dce6",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "#002859",
  },
  conceptInputActive: {
    borderColor: "#0052b4",
  },
  charCounter: {
    textAlign: "right",
    marginTop: 5,
    color: "#647184",
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: "#eaf3ff",
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  continueButtonActive: {
    backgroundColor: "#0052b4",
  },
  continueButtonText: {
    color: "#0052b4",
    fontSize: 18,
    fontWeight: "500",
  },
  continueButtonTextActive: {
    color: "#ffffff",
  },
});

export default PaymentScreen;



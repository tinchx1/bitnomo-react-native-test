import React from "react"
import { useState, useEffect, useRef } from "react"
import {
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  ActivityIndicator,
  Text,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import AppText from "@/components/ui/AppText"
import { createPaymentOrder } from "@/api/payment-service"
import { Ionicons } from "@expo/vector-icons"
import { StackNavigationProp } from "@react-navigation/stack"

export const currencies = [
  {
    id: "eur",
    name: "Euro",
    code: "EUR",
    symbol: "€",
    flag: require("@/assets/flags/eu.png"),
  },
  {
    id: "usd",
    name: "Dólar Estadounidense",
    code: "USD",
    symbol: "$",
    flag: require("@/assets/flags/us.png"),
  },
  {
    id: "gbp",
    name: "Libra Esterlina",
    code: "GBP",
    symbol: "£",
    flag: require("@/assets/flags/gs.png"),
  },
]

type PaymentScreenRouteProp = RouteProp<{ params: { selectedCurrencyId: string; reset: boolean } }, "params">

type RootStackParamList = {
  Payment: undefined
  CurrencySelection: { currentCurrencyId: string }
  PaymentShare: { amount: string; currency: { id: string; code: string; symbol: string }; description: string; paymentData: any; web_url: string }
}

const PaymentScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Payment">>()
  const route = useRoute<PaymentScreenRouteProp>()
  const amountInputRef = useRef<TextInput>(null)

  const [selectedCurrencyId, setSelectedCurrencyId] = useState("eur")
  const [amount, setAmount] = useState("0,00")
  const [description, setDescription] = useState("")
  const [amountFocused, setAmountFocused] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [showCursor, setShowCursor] = useState(false)
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false)
  const [inputHeight, setInputHeight] = useState(40) // Estado para rastrear la altura del campo de entrada

  const [isCreatingPayment, setIsCreatingPayment] = useState(false)

  const selectedCurrency = currencies.find((c) => c.id === selectedCurrencyId) || currencies[0] // Default to EUR

  useEffect(() => {
    if (route.params?.selectedCurrencyId) {
      setSelectedCurrencyId(route.params.selectedCurrencyId)
    }

    if (route.params?.reset) {
      setAmount("0,00")
      setDescription("")
      setCharCount(0)
    }
  }, [route.params])

  // Manejar cambios en el monto
  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "")

    if (numericValue === "") {
      setAmount("0,00")
      setShowCursor(false)
    } else {
      const value = Number.parseInt(numericValue) / 100
      const formattedValue = value.toFixed(2).replace(".", ",")
      setAmount(formattedValue)
      setShowCursor(false)
    }
  }

  const handleDescriptionChange = (text: string) => {
    if (text.length <= 140) {
      setDescription(text)
      setCharCount(text.length)
    }
  }

  const openCurrencySelector = () => {
    Keyboard.dismiss()
    navigation.navigate("CurrencySelection", {
      currentCurrencyId: selectedCurrencyId,
    })
  }

  const focusAmountInput = () => {
    if (amountInputRef.current) {
      amountInputRef.current.focus()
      if (amount === "0,00") {
        setShowCursor(true)
        setAmount("")
      }
    }
  }

  const createPayment = async () => {
    try {
      setIsCreatingPayment(true)
      Keyboard.dismiss()

      const numericAmount = Number.parseFloat(amount.replace(",", "."))

      const paymentData = await createPaymentOrder({
        expected_output_amount: numericAmount,
        fiat: selectedCurrency.code,
        notes: description || undefined,
      })

      navigation.navigate("PaymentShare", {
        amount: amount,
        currency: selectedCurrency,
        description: description,
        paymentData: paymentData, // Pasar todos los datos del pago
        web_url: paymentData.web_url, // Pasar específicamente la URL web
      })
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el pago. Por favor, inténtalo de nuevo.", [{ text: "OK" }])
    } finally {
      setIsCreatingPayment(false)
    }
  }

  const isAmountNonZero = amount !== "0,00" && amount !== ""

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Crear pago</Text>
          <TouchableOpacity style={styles.currencySelector} onPress={openCurrencySelector}>
            <Text style={styles.currencyText}>{selectedCurrency.code}</Text>
            <Ionicons name="chevron-down" size={16} color="#8E9AAB" style={styles.dropdownIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.amountContainer} onPress={focusAmountInput} activeOpacity={0.8}>
          {showCursor ? (
            <View style={styles.amountWrapper}>
              <AppText style={[styles.amountText, styles.amountTextFocused]}>|{selectedCurrency.symbol}</AppText>
            </View>
          ) : (
            <AppText style={[styles.amountText, (amountFocused || isAmountNonZero) && styles.amountTextFocused]}>
              {selectedCurrency.id === "usd" ? `${selectedCurrency.symbol} ${amount}` : `${amount} ${selectedCurrency.symbol}`}
            </AppText>
          )}
          <TextInput
            ref={amountInputRef}
            style={styles.hiddenInput}
            keyboardType="number-pad"
            value={amount === "0,00" ? "" : amount}
            onChangeText={handleAmountChange}
            caretHidden={true}
            onFocus={() => {
              setAmountFocused(true)
              if (amount === "0,00") {
                setShowCursor(true)
                setAmount("")
              }
            }}
            onBlur={() => {
              setAmountFocused(false)
              setShowCursor(false)
              if (amount === "") {
                setAmount("0,00")
              }
            }}
          />
        </TouchableOpacity>

        <View style={styles.conceptContainer}>
          <Text style={styles.conceptLabel}>Concepto</Text>
          <TextInput
            multiline={true}
            style={[
              styles.conceptInput,
              { height: inputHeight },
              (description.length > 0 || isDescriptionFocused) && styles.conceptInputActive,
            ]}
            placeholder="Añade descripción del pago"
            placeholderTextColor="#9EA3AE"
            value={description}
            onChangeText={handleDescriptionChange}
            maxLength={140}
            onFocus={() => setIsDescriptionFocused(true)}
            onBlur={() => setIsDescriptionFocused(false)}
            onContentSizeChange={(e) => setInputHeight(e.nativeEvent.contentSize.height)}
          />
          <AppText
            style={
              description.length > 0 || isDescriptionFocused ? styles.charCounter : [styles.charCounter, styles.none]
            }
          >
            {charCount}/140 caracteres
          </AppText>
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            isAmountNonZero && styles.continueButtonActive,
            isCreatingPayment && styles.continueButtonDisabled,
          ]}
          onPress={createPayment}
          disabled={!isAmountNonZero || isCreatingPayment}
        >
          {isCreatingPayment ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <AppText style={[styles.continueButtonText, isAmountNonZero && styles.continueButtonTextActive]}>
              Continuar
            </AppText>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

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
    fontFamily: "MulishBold",
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
    height: 28,
    borderRadius: 20,
  },
  currencyText: {
    fontSize: 12,
    fontFamily: "MulishBold",
    lineHeight: 16,
    color: "#002859",
    marginRight: 5,
  },
  dropdownIcon: {
    width: 16,
    height: 16,
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
    fontFamily: "MulishBold",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: "#002859",
    marginBottom: 10,
  },
  conceptInput: {
    borderWidth: 1,
    borderColor: "#d3dce6",
    borderRadius: 10,
    height: 56,
    paddingVertical: 12,
    paddingHorizontal: 18,
    fontSize: 16,
    color: "#002859hvh",
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
  continueButtonDisabled: {
    backgroundColor: "#a0c0e0",
    opacity: 0.7,
  },
  continueButtonText: {
    color: "#71b0fd",
    fontSize: 18,
    fontWeight: "500",
  },
  continueButtonTextActive: {
    color: "#ffffff",
  },
})

export default PaymentScreen


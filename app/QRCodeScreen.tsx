import React from "react"
import { useEffect, useState } from "react"
import { View, TouchableOpacity, SafeAreaView, StyleSheet, Platform, Dimensions, Image } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import AppText from "@/components/ui/AppText"
import QRCode from "react-native-qrcode-svg"
import { usePaymentWebSocket } from "@/hooks/use-payment-websocket"

const { width } = Dimensions.get("window")
const QR_SIZE = width * 0.8

type RootStackParamList = {
  PaymentConfirmation: { amount: number; currency: { symbol: string }; paymentData: any }
}
type PaymentShareScreenRouteProp = RouteProp<{ params: { amount: number; currency: { symbol: string }, description: string, paymentData: any, web_url: string, showWhatsAppInput: boolean, selectedCountry: any } }, 'params'>

const QRCodeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const route = useRoute<PaymentShareScreenRouteProp>()
  const { amount, currency, web_url, paymentData } = route.params

  const paymentLink = web_url || paymentData?.web_url || "pay.bitnovo.com/error"


  usePaymentWebSocket(paymentData?.identifier,
    (status) => {
      if (status === "completed") {
        navigation.navigate("PaymentConfirmation", {
          amount,
          currency,
          paymentData,
        })
      }
    }
  )


  const getQRValue = () => {
    if (paymentLink.startsWith("http")) {
      return paymentLink
    }
    return `https://${paymentLink}`
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#002859" />
        </TouchableOpacity>
      </View>


      <View style={styles.alertContainer}>
        <View style={styles.alertIconContainer}>
          <Image source={require('@/assets/images/information.png')} width={24} height={24} />
        </View>
        <AppText style={styles.alertText}>
          Escanea el QR y serás redirigido a la pasarela de pago de Bitnovo Pay.
        </AppText>
      </View>

      <View style={styles.qrContainer}>
        <QRCode
          value={getQRValue()}
          size={QR_SIZE}
          color="#002859"
          backgroundColor="white"
          logo={require("@/assets/images/bitnomo-pay-icon.png")} // Asegúrate de tener este archivo
          logoSize={QR_SIZE * 0.25}
          logoBackgroundColor="white"
          logoBorderRadius={10}
        />
      </View>
      <AppText style={styles.amountText}>{amount} {currency.symbol}</AppText>

      <AppText style={styles.footerText}>Esta pantalla se actualizará automáticamente.</AppText>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0066CC",
  },
  header: {
    paddingHorizontal: 16,
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F7FA",
    alignItems: "center",
    justifyContent: "center",
  },
  alertContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
  },
  alertIconContainer: {
    marginRight: 12,
  },
  alertText: {
    flex: 1,
    fontSize: 12,
    color: "#002859",
    lineHeight: 16,
  },
  qrContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    marginHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 12,
  },
  qrUpdating: {
    opacity: 0.7,
  },
  detailsContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  amountText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 16,
  },
  paymentInfoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  paymentInfoLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  paymentInfoValue: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
  },
  footerText: {
    fontSize: 14,
    lineHeight: 20,
    color: "white",
    textAlign: "center",
    marginTop: "auto",
    marginBottom: 200,
  },
})

export default QRCodeScreen


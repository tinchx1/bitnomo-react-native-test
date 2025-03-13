import React from "react"
import { View, TouchableOpacity, SafeAreaView, StyleSheet, Image, Platform } from "react-native"
import { StatusBar } from "expo-status-bar"
import { useNavigation, useRoute, RouteProp, NavigationProp } from "@react-navigation/native"
import AppText from "@/components/ui/AppText"

type RootStackParamList = {
  Payment: undefined;
};

type PaymentConfirmationRouteProp = RouteProp<{ params: { amount: number; currency: string } }, 'params'>
const PaymentConfirmationScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const route = useRoute<PaymentConfirmationRouteProp>()

  const { amount, currency } = route.params

  const handleFinish = () => {
    navigation.navigate("Payment")
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.logoContainer}>
        <Image source={require("@/assets/images/bitnovo-icon.png")} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.divider} />

      <View style={styles.content}>
        <Image
          source={require("@/assets/images/confetti-success.png")}
          style={styles.confettiImage}
          resizeMode="contain"
        />

        <AppText style={styles.title}>Pago recibido</AppText>
        <AppText style={styles.subtitle}>El pago se ha confirmado con éxito</AppText>

      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <AppText style={styles.finishButtonText}>Finalizar</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignSelf: "center",
    width: "100%",
  },
  logoContainer: {
    alignItems: "center",
    paddingVertical: 16,
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  logo: {
    height: 40,
    width: 150,
  },
  divider: {
    height: 1,
    backgroundColor: "#E8ECF2",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  confettiImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#002859",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#647184",
    textAlign: "center",
    marginBottom: 16,
  },
  amountText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0066CC",
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  finishButton: {
    backgroundColor: "#F5F7FA",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  finishButtonText: {
    color: "#0066CC",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default PaymentConfirmationScreen


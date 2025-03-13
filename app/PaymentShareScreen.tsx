import React from "react"
import { useState, useEffect } from "react"
import {
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Share,
  Clipboard,
  Alert,
  Image,
  Linking,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import SuccessModal from "./SuccessModal"
import AppText from "@/components/ui/AppText"
import { usePaymentWebSocket } from "../hooks/use-payment-websocket"

const defaultCountry = {
  id: "es",
  name: "España",
  code: "+34",
}

const PaymentShareScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const { amount, currency, description, paymentData, web_url } = route.params

  const [showWhatsAppInput, setShowWhatsAppInput] = useState(route.params?.showWhatsAppInput || false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry)

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [modalInfo, setModalInfo] = useState({
    title: "",
    message: "",
    buttonText: "Entendido",
  })

  const [paymentLink, setPaymentLink] = useState("pay.bitnovo.com/cargando...")
  const {
    status: paymentStatus,
    isConnected,
    connectionAttempts,
    useMockWebSocket
  } = usePaymentWebSocket({
    identifier: paymentData?.identifier,
    onStatusChange: (status) => {
      if (status === "completed") {
        console.log("Payment status changed:", status)
        Navigate directly to PaymentConfirmationScreen
        navigation.navigate("PaymentConfirmation", {
          amount,
          currency,
          paymentData,
        })
      }
    },
  })
  useEffect(() => {
    if (web_url) {
      console.log("URL completa:", web_url)
      try {
        const url = new URL(web_url)
        setPaymentLink(url.hostname + url.pathname)
      } catch (error) {
        console.error("URL inválida:", web_url, error)
        setPaymentLink("pay.bitnovo.com/error")
      }
    }
  }, [web_url])

  useFocusEffect(
    React.useCallback(() => {
      console.log("Selected country in main:", route.params?.selectedCountry);
      if (route.params?.selectedCountry) {
        setSelectedCountry(route.params.selectedCountry);
      }
    }, [route.params?.selectedCountry])
  );
  const copyToClipboard = () => {
    Clipboard.setString(web_url || paymentLink)
    Alert.alert("Enlace copiado", "El enlace de pago ha sido copiado al portapapeles.")
  }

  const shareViaEmail = () => {
    if (web_url) {
      const subject = "Solicitud de pago"
      const body = `Solicitud de pago por ${amount} ${currency.symbol}.\n\nEnlace: ${web_url}`
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

      Linking.canOpenURL(mailtoUrl)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(mailtoUrl)
          } else {
            Alert.alert("Error", "No se pudo abrir la aplicación de correo electrónico.")
          }
        })
        .catch((error) => {
          Alert.alert("Error", "No se pudo abrir la aplicación de correo electrónico.")
        })
    } else {
      Alert.alert("Error", "No hay un enlace de pago disponible para compartir.")
    }
  }

  const toggleWhatsAppInput = () => {
    setShowWhatsAppInput(!showWhatsAppInput)
  }

  const openCountrySelector = () => {
    navigation.navigate("CountrySelection", {
      ...route.params, 
      currentCountryId: selectedCountry.id, 
    });

  }

  const sendWhatsAppMessage = () => {
    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Por favor, introduce un número de teléfono.")
      return
    }

    if (web_url) {
      const formattedNumber = `${selectedCountry.code}${phoneNumber.replace(/\s+/g, "")}`

      const message = `Solicitud de pago por ${amount} ${currency.symbol}. Enlace: ${web_url}`

      const whatsappUrl = `whatsapp://send?phone=${formattedNumber}&text=${encodeURIComponent(message)}`

      Linking.canOpenURL(whatsappUrl)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(whatsappUrl)
          } else {
            setModalInfo({
              title: "Solicitud enviada",
              message: `Tu solicitud de pago ha sido enviada con éxito por WhatsApp.`,
              buttonText: "Entendido",
            })
            setShowSuccessModal(true)
          }
        })
        .catch((error) => {
          setModalInfo({
            title: "Solicitud enviada",
            message: `Tu solicitud de pago ha sido enviada con éxito por WhatsApp.`,
            buttonText: "Entendido",
          })
          setShowSuccessModal(true)
        })
    } else {
      Alert.alert("Error", "No hay un enlace de pago disponible para compartir.")
    }
  }

  const shareWithOtherApps = async () => {
    if (web_url) {
      try {
        await Share.share({
          message: `Solicitud de pago por ${amount} ${currency.symbol}. Enlace: ${web_url}`,
          url: web_url,
          title: "Solicitud de pago",
        })
      } catch (error) {
        Alert.alert("Error", "No se pudo compartir el enlace.")
      }
    } else {
      Alert.alert("Error", "No hay un enlace de pago disponible para compartir.")
    }
  }

  const createNewRequest = () => {
    setModalInfo({
      title: "Solicitud enviada",
      message: "Tu solicitud de pago ha sido creada con éxito.",
      buttonText: "Entendido",
    })
    setShowSuccessModal(true)
  }

  const handleModalClose = () => {
    setShowSuccessModal(false)
    if (modalInfo.message.includes("creada con éxito")) {
      navigation.navigate("Payment", { reset: true })
    }
  }

  const navigateToQRCode = () => {
    if (paymentData) {
      navigation.navigate("QRCode", { paymentData, amount, currency })
    } else {
      Alert.alert("Error", "No hay datos de pago disponibles para mostrar el código QR.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              <Image source={require("@/assets/images/pending.png")} style={styles.headerIcon} resizeMode="contain" />
            </View>
            <View style={styles.headerTextContainer}>
              <AppText style={styles.headerTitle}>Solicitud de pago</AppText>
              <AppText style={styles.amount}>
                {amount} {currency.symbol}
              </AppText>
            </View>
          </View>
          <AppText style={styles.subtitle}>Comparte el enlace de pago con el cliente</AppText>
        </View>

        <View style={styles.linkContainer}>
          <TouchableOpacity style={styles.linkContent} onPress={copyToClipboard}>
            <Image source={require("@/assets/images/link.png")} style={styles.linkIcon} resizeMode="contain" />
            <AppText style={styles.linkText} >
              {paymentLink}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.qrButton} onPress={navigateToQRCode}>
            <Image source={require("@/assets/images/scan-barcode.png")} style={styles.qrIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.shareOption, paymentStatus === "completed" && styles.shareOptionDisabled]}
          onPress={shareViaEmail}
          disabled={paymentStatus === "completed"}
        >
          <View style={styles.shareIconContainer}>
            <Image source={require("@/assets/images/email.png")} style={styles.shareIcon} resizeMode="contain" />
          </View>
          <AppText style={styles.shareOptionText}>Enviar por correo electrónico</AppText>
        </TouchableOpacity>

        {showWhatsAppInput ? (
          <View style={styles.whatsappInputContainer}>
            <View style={styles.phoneInputRow}>
              <TouchableOpacity style={styles.countrySelector} onPress={openCountrySelector}>
                <Image source={require("@/assets/images/wsp.png")} style={styles.whatsappIcon} resizeMode="contain" />
                <AppText style={styles.countryCode}>{selectedCountry.code}</AppText>
                <Ionicons name="chevron-down" size={16} color="#8E9AAB" style={styles.chevronDown} />
              </TouchableOpacity>

              <TextInput
                style={styles.phoneInput}
                placeholder="300 678 9087"
                placeholderTextColor="#9EA3AE"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />

              <TouchableOpacity style={styles.sendButton} onPress={sendWhatsAppMessage}>
                <AppText style={styles.sendButtonText}>Enviar</AppText>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.shareOption, paymentStatus === "completed" && styles.shareOptionDisabled]}
            onPress={toggleWhatsAppInput}
            disabled={paymentStatus === "completed"}
          >
            <View style={styles.shareIconContainer}>
              <Image source={require("@/assets/images/wsp.png")} style={styles.shareIcon} resizeMode="contain" />
            </View>
            <AppText style={styles.shareOptionText}>Enviar a número de WhatsApp</AppText>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.shareOption, paymentStatus === "completed" && styles.shareOptionDisabled]}
          onPress={shareWithOtherApps}
          disabled={paymentStatus === "completed"}
        >
          <View style={styles.shareIconContainer}>
            <Image source={require("@/assets/images/export.png")} style={styles.shareIcon} resizeMode="contain" />
          </View>
          <AppText style={styles.shareOptionText}>Compartir con otras aplicaciones</AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.newRequestButton} onPress={createNewRequest}>
          <AppText style={styles.newRequestText}>Nueva solicitud</AppText>
          <View style={styles.plusIconContainer}>
            <Image source={require("@/assets/images/add-wallet.png")} style={styles.shareIcon} resizeMode="contain" />
          </View>
        </TouchableOpacity>
      </View>

      <SuccessModal
        visible={showSuccessModal}
        title={modalInfo.title}
        message={modalInfo.message}
        buttonText={modalInfo.buttonText}
        onClose={handleModalClose}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    padding: 20,
    paddingBottom: 100, 
  },
  header: {
    borderRadius: 12,
    backgroundColor: "#F5F7FA",
    padding: 20,
    marginBottom: 24,
    marginTop: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerIcon: {
    width: 58,
    height: 58,
  },
  headerTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    color: "#647184",
  },
  amount: {
    fontSize: 30,
    fontWeight: "700",
    color: "#002859",
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: "#647184",
    textAlign: "center",
  },

  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  linkContent: {
    maxHeight: 55,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8ECF2",
    borderRadius: 8,
    padding: 16,
    marginRight: 12,
    backgroundColor: "white",
  },
  linkIcon: {
    marginTop: 2,
    width: 20,
    height: 20,
    marginRight: 12,
  },
  linkText: {
    fontSize: 16,
    color: "#0A2463",
  },
  qrButton: {
    width: 54,
    height: 54,
    borderRadius: 8,
    backgroundColor: "#0066CC",
    justifyContent: "center",
    alignItems: "center",
  },
  qrIcon: {
    width: 24,
    height: 24,
    tintColor: "white",
  },
  shareOption: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8ECF2",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "white",
    height: 55,
  },
  shareOptionDisabled: {
    opacity: 0.5,
  },
  shareIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  shareIcon: {
    marginTop: 2,
    width: 20,
    height: 20,
  },
  shareOptionText: {
    fontSize: 16,
    color: "#0A2463",
  },
  whatsappInputContainer: {
    maxHeight: 55,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#0066CC",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "white",
  },
  phoneInputRow: {
    flexDirection: "row",
  },
  countrySelector: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  whatsappIcon: {
    height: 20,
    width: 20,
    marginRight: 8,
    marginTop: 2,
    color: "#25D366",
  },
  countryCode: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0A2463",
    width: 40,
  },
  chevronDown: {
    color: "#0A2463",
    marginTop: 2,
    paddingLeft: 4,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: "#0A2463",
    paddingVertical: 4,
    alignSelf: "center",
    top: 2,
    maxWidth: 160,
  },
  sendButton: {
    alignSelf: "center",
    backgroundColor: "#0066CC",
    height: 24,
    justifyContent: "center",
    paddingHorizontal: 12,
    marginLeft: 2,
    borderRadius: 6,
  },
  sendButtonText: {
    color: "white",
    fontSize: 12,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 1,
  },
  newRequestButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
  },
  newRequestText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#035ac5",
    marginRight: 12,
  },
  plusIconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default PaymentShareScreen



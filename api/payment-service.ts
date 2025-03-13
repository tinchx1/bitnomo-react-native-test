// API service for payment-related operations

// Base URL for the API
const API_BASE_URL = "https://payments.pre-bnvo.com/api/v1/orders/" // Replace with the actual API base URL
const WS_BASE_URL = "wss://payments.pre-bnvo.com/ws/merchant/" // WebSocket base URL

// Device ID for authentication
const DEVICE_ID = "d497719b-905f-4a41-8dbe-cf124c442f42"

/**
 * Creates a payment order
 * @param params Payment parameters
 * @returns The created payment data
 */
export async function createPaymentOrder(params: {
  expected_output_amount: number
  fiat: string
  notes?: string
}) {
  try {
    // Create form data for multipart/form-data request
    const formData = new FormData()

    // Add required fields
    console.log("params.expected_output_amount", params.expected_output_amount)
    console.log("params.fiat", params.fiat)
    console.log("params.notes", params.notes)
    formData.append("expected_output_amount", params.expected_output_amount.toString())
    formData.append("fiat", params.fiat)

    // Add optional fields if provided
    if (params.notes) {
      formData.append("notes", params.notes)
    }
    console.log("formData", formData.get("expected_output_amount"))
    console.log("formData", formData.get("fiat"))
    console.log("formData", formData.get("notes"))
    // Make the API request
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: {
        "X-Device-Id": DEVICE_ID,
        // No Content-Type header as it's automatically set for FormData
      },
      body: formData,
    })

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to create payment")
    }

    // Parse and return the response data
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error creating payment:", error)
    throw error
  }
}

/**
 * Creates a WebSocket connection for real-time payment updates
 * @param identifier The payment identifier returned from the API
 * @param onMessage Callback function to handle incoming messages
 * @returns WebSocket instance
 */
export function createPaymentWebSocket(
  identifier: string,
  onMessage?: (data: any) => void,
  onOpen?: () => void,
  onError?: (error: any) => void,
  onClose?: () => void,
) {
  try {
    if (!identifier) {
      console.error("WebSocket error: No identifier provided")
      return null
    }

    // Create WebSocket connection
    const wsUrl = `${WS_BASE_URL}${identifier}`
    console.log("Connecting to WebSocket:", wsUrl)

    const socket = new WebSocket(wsUrl)

    // Set up event handlers
    socket.onopen = (event) => {
      console.log("WebSocket connection established")
      if (onOpen) onOpen()
    }

    socket.onmessage = (event) => {
      console.log("WebSocket message received:", event.data)
      try {
        // Check if the data is a string that needs parsing
        let data
        if (typeof event.data === "string") {
          data = JSON.parse(event.data)
        } else {
          data = event.data
        }

        if (onMessage) onMessage(data)
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }

    socket.onerror = (error) => {
      console.error("WebSocket error:", error)
      if (onError) onError(error)
    }

    socket.onclose = (event) => {
      console.log("WebSocket connection closed", event.code, event.reason)
      if (onClose) onClose()

      // If the connection was closed abnormally and not by the user,
      // attempt to reconnect after a delay
      if (event.code !== 1000 && event.code !== 1001) {
        console.log("Attempting to reconnect in 5 seconds...")
        setTimeout(() => {
          console.log("Reconnecting to WebSocket...")
          createPaymentWebSocket(identifier, onMessage, onOpen, onError, onClose)
        }, 5000)
      }
    }

    return socket
  } catch (error) {
    console.error("Error creating WebSocket:", error)
    if (onError) onError(error)
    return null
  }
}

/**
 * Get payment status by ID
 * @param paymentId The payment ID
 * @returns The payment status data
 */
export async function getPaymentStatus(paymentId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}${paymentId}`, {
      method: "GET",
      headers: {
        "X-Device-Id": DEVICE_ID,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to get payment status")
    }

    const data = await response.json()
    console.log("Payment status data:", data)
    return data
  } catch (error) {
    console.error("Error getting payment status:", error)
    throw error
  }
}

/**
 * Mock WebSocket for testing when real WebSocket is not available
 * @param identifier The payment identifier
 * @param onMessage Callback function to handle incoming messages
 * @returns A mock WebSocket object
 */
export function createMockWebSocket(
  identifier: string,
  onMessage?: (data: any) => void,
  onOpen?: () => void,
  onError?: (error: any) => void,
  onClose?: () => void,
) {
  console.log("Creating mock WebSocket for testing")

  // Call onOpen immediately
  if (onOpen) {
    setTimeout(() => {
      onOpen()
    }, 500)
  }

  // Simulate a payment completion after 10 seconds
  const mockCompletionTimer = setTimeout(() => {
    if (onMessage) {
      onMessage({
        status: "completed",
        identifier: identifier,
        timestamp: new Date().toISOString(),
      })
    }
  }, 10000)

  // Return a mock WebSocket object
  return {
    // Don't automatically call onClose when close() is called in cleanup
    // This prevents the infinite reconnection loop
    close: () => {
      console.log("Mock WebSocket closed")
      clearTimeout(mockCompletionTimer)
      // Only call onClose if it's an explicit close, not during cleanup
      // We'll skip calling onClose here to prevent the reconnection loop
    },
    // Add a forceClose method for when we really want to trigger onClose
    forceClose: () => {
      console.log("Mock WebSocket force closed")
      clearTimeout(mockCompletionTimer)
      if (onClose) onClose()
    },
  }
}


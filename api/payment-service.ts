// API service for payment-related operations

// Base URL for the API
const API_BASE_URL = "https://payments.pre-bnvo.com/api/v1/orders/"
const WS_BASE_URL = "wss://payments.pre-bnvo.com/ws/merchant/"

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
    formData.append("expected_output_amount", params.expected_output_amount.toString())
    formData.append("fiat", params.fiat)

    // Add optional fields if provided
    if (params.notes) {
      formData.append("notes", params.notes)
    }

    // Make the API request
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: {
        "X-Device-Id": DEVICE_ID,
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





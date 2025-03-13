"use client"

import { useState, useEffect, useRef, useCallback } from "react"

// Define the types
type PaymentStatus = "pending" | "completed" | "expired" | "failed"
interface UsePaymentWebSocketProps {
  identifier?: string
  onStatusChange?: (status: PaymentStatus) => void
  useMockWebSocket?: boolean
}

// WebSocket base URL
const WS_BASE_URL = "wss://payments.pre-bnvo.com/ws/merchant/"

// Mock WebSocket implementation (for demonstration purposes)
const createMockWebSocket = (
  identifier: string,
  handleMessage: (data: any) => void,
  handleOpen: () => void,
  handleError: (error: any) => void,
  handleClose: () => void,
) => {
  let mockStatus = "pending"

  const mockSocket = {
    send: (message: string) => {
      console.log("Mock WebSocket sending:", message)
    },
    close: () => {
      console.log("Mock WebSocket closing")
    },
  }

  // Simulate connection opening
  setTimeout(() => {
    handleOpen()
  }, 100)

  // Simulate status updates
  // setTimeout(() => {
  //   mockStatus = "completed"
  //   handleMessage({ status: mockStatus })
  // }, 10000)

  // setTimeout(() => {
  //   handleClose()
  // }, 15000)

  return mockSocket
}

// Real WebSocket implementation
const createRealWebSocket = (
  identifier: string,
  handleMessage: (data: any) => void,
  handleOpen: () => void,
  handleError: (error: any) => void,
  handleClose: () => void,
) => {
  if (!identifier) {
    console.error("WebSocket error: No identifier provided")
    return null
  }

  // Create WebSocket connection with the correct URL
  const wsUrl = `${WS_BASE_URL}${identifier}`
  console.log("Connecting to WebSocket:", wsUrl)

  const ws = new WebSocket(wsUrl)

  ws.onopen = () => {
    console.log("WebSocket connected successfully")
    handleOpen()
  }

  ws.onmessage = (event) => {
    try {
      console.log("WebSocket message received:", event.data)
      const data = JSON.parse(event.data)
      handleMessage(data)
    } catch (error) {
      console.error("Error parsing WebSocket message:", error)
    }
  }

  ws.onerror = (error) => {
    console.error("WebSocket error:", error)
    handleError(error)
  }

  ws.onclose = () => {
    console.log("WebSocket closed")
    handleClose()
  }

  return ws
}

export function usePaymentWebSocket({
  identifier,
  onStatusChange,
  useMockWebSocket: initialMockWebSocket = false,
}: UsePaymentWebSocketProps) {
  const [status, setStatus] = useState<PaymentStatus>("pending")
  const [isConnected, setIsConnected] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [connectionAttempts, setConnectionAttempts] = useState(0)
  const [useMockWebSocket, setUseMockWebSocket] = useState(initialMockWebSocket)
  const wsRef = useRef<WebSocket | any>(null)
  const maxReconnectAttempts = 3
  const reconnectingRef = useRef(false)

  // WebSocket event handlers
  const handleMessage = useCallback(
    (data: any) => {
      // Handle incoming message
      setIsUpdating(true)

      setTimeout(() => {
        setIsUpdating(false)

        // Update payment status based on WebSocket data
        let newStatus: PaymentStatus = "pending"

        if (data.status === "completed" || data.status === "confirmed") {
          newStatus = "completed"
        } else if (data.status === "expired" || data.status === "failed") {
          newStatus = "expired"
        }

        setStatus(newStatus)

        // Call the onStatusChange callback if provided
        if (onStatusChange) {
          onStatusChange(newStatus)
        }
      }, 500)
    },
    [onStatusChange],
  )

  const handleOpen = useCallback(() => {
    console.log("WebSocket connected successfully")
    setIsConnected(true)
    reconnectingRef.current = false
  }, [])

  const handleError = useCallback((error: any) => {
    console.error("WebSocket error in hook:", error)
    setIsConnected(false)
  }, [])

  const handleClose = useCallback(() => {
    console.log("WebSocket closed in hook")
    setIsConnected(false)

    // Only attempt to reconnect if:
    // 1. We're not already reconnecting
    // 2. We're not using a mock WebSocket
    // 3. We haven't exceeded max attempts
    if (!reconnectingRef.current && !useMockWebSocket && connectionAttempts < maxReconnectAttempts) {
      reconnectingRef.current = true
      setConnectionAttempts((prev) => prev + 1)
    } else if (connectionAttempts >= maxReconnectAttempts && !useMockWebSocket) {
      // Switch to mock WebSocket after max attempts
      setUseMockWebSocket(true)
    }
  }, [connectionAttempts, useMockWebSocket])

  // Function to create WebSocket connection
  const connectWebSocket = useCallback(() => {
    // Clean up any existing connection
    if (wsRef.current) {
      try {
        wsRef.current.close()
      } catch (error) {
        console.error("Error closing existing WebSocket:", error)
      }
      wsRef.current = null
    }

    if (!identifier) return

    // Use mock WebSocket if specified
    if (useMockWebSocket) {
      console.log("Using mock WebSocket due to connection issues")
      wsRef.current = createMockWebSocket(identifier, handleMessage, handleOpen, handleError, handleClose)
      return
    }

    // Create real WebSocket connection
    wsRef.current = createRealWebSocket(identifier, handleMessage, handleOpen, handleError, handleClose)
  }, [identifier, useMockWebSocket, handleMessage, handleOpen, handleError, handleClose])

  // Connect to WebSocket when component mounts or when dependencies change
  useEffect(() => {
    if (!identifier) return

    // Only connect if we don't have an active connection
    if (!wsRef.current) {
      connectWebSocket()
    }

    // Clean up WebSocket connection when component unmounts
    return () => {
      if (wsRef.current) {
        try {
          wsRef.current.close()
        } catch (error) {
          console.error("Error closing WebSocket on cleanup:", error)
        }
        wsRef.current = null
      }
    }
  }, [identifier, useMockWebSocket, connectWebSocket])

  // Effect to switch to mock WebSocket after max attempts
  useEffect(() => {
    if (connectionAttempts >= maxReconnectAttempts && !useMockWebSocket) {
      setUseMockWebSocket(true)
    }
  }, [connectionAttempts, useMockWebSocket])

  // Function to manually reconnect
  const reconnect = useCallback(() => {
    setConnectionAttempts(0) // Reset connection attempts
    setUseMockWebSocket(false) // Try real WebSocket again

    if (wsRef.current) {
      try {
        wsRef.current.close()
      } catch (error) {
        console.error("Error closing WebSocket on reconnect:", error)
      }
      wsRef.current = null
    }

    connectWebSocket()
  }, [connectWebSocket])

  return {
    status,
    isConnected,
    isUpdating,
    reconnect,
    connectionAttempts,
    useMockWebSocket,
  }
}


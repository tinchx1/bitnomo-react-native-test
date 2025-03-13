"use client"

import { useCallback, useEffect, useRef } from "react"

const WS_BASE_URL = "wss://payments.pre-bnvo.com/ws/merchant/"
const RECONNECT_TIMEOUT = 2000 // 2 segundos antes de conectar

export function usePaymentWebSocket(identifier: string, onStatusChange: (data: any) => void) {
  const handleMessage = useCallback((data: any) => {

    const isCompleted = data.status === "CO" && data.confirmed_amount > 0.0

    if (isCompleted) {
      onStatusChange("completed")
    } else {
      onStatusChange("pending")
    }
  }, [onStatusChange])

  const wsRef = useRef<WebSocket | null>(null)

    if (!identifier) return

      if (wsRef.current) return 

      setTimeout(() => {
        const wsUrl = `${WS_BASE_URL}${identifier}`
        console.log("🔗 Connecting to WebSocket:", wsUrl)

        wsRef.current = new WebSocket(wsUrl)

        wsRef.current.onopen = () => console.log("✅ WebSocket connected")

        wsRef.current.onmessage = (event) => {
          console.log("📩 WebSocket message received:", event.data)
          try {
            const data = JSON.parse(event.data)
            handleMessage?.(data)
          } catch (error) {
            console.error("❌ Error parsing WebSocket message:", error)
          }
        }

        wsRef.current.onclose = (event) => {
          console.warn(`⚠️ WebSocket closed (Code: ${event.code}, Reason: ${event.reason})`)
          wsRef.current = null
        }

        wsRef.current.onerror = (error) => console.error("⚠️ WebSocket error:", error)
      }, RECONNECT_TIMEOUT)
    

}

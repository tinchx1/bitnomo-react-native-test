"use client"

import { useCallback, useEffect, useRef } from "react"

const WS_BASE_URL = "wss://payments.pre-bnvo.com/ws/merchant/"
const TIMEOUT = 2000

export function usePaymentWebSocket(identifier: string, onStatusChange: (data: any) => void) {
  const handleMessage = useCallback((data: any) => {

    const isCompleted = data.status === "CO"

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

    wsRef.current = new WebSocket(wsUrl)

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        handleMessage?.(data)
      } catch (error) {
        console.error("❌ Error parsing WebSocket message:", error)
      }
    }

    wsRef.current.onclose = (event) => {
      wsRef.current = null
    }

    wsRef.current.onerror = (error) => console.error("⚠️ WebSocket error:", error)
  }, TIMEOUT)


}

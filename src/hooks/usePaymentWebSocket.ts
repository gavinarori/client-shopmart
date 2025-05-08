"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useDispatch } from "react-redux"
import { setCurrentTransaction } from "@/store/reducers/paymentReducer"
import { toast } from "sonner"

interface WebSocketMessage {
  type: string
  message?: string
  transaction?: any
  checkoutRequestID?: string
}

export function usePaymentWebSocket(checkoutRequestID?: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const dispatch = useDispatch()

  // WebSocket server URL - should be configured in your environment
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000"

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.close()
    }

    // Create new WebSocket connection
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      setIsConnected(true)
      console.log("WebSocket connected")

      // Subscribe to specific transaction updates if checkoutRequestID is provided
      if (checkoutRequestID) {
        ws.send(
          JSON.stringify({
            type: "subscribe",
            checkoutRequestID,
          }),
        )
      }
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WebSocketMessage
        setLastMessage(data)

        // Handle payment updates
        if (data.type === "payment_update" && data.transaction) {
          console.log("Payment update received:", data.transaction)

          // Update Redux store with the latest transaction data
          dispatch(setCurrentTransaction(data.transaction))

          // Show toast notification based on status
          if (data.transaction.status === "completed") {
            toast.success("Payment completed successfully!")
          } else if (data.transaction.status === "failed") {
            toast.error(`Payment failed: ${data.transaction.resultDesc || "Please try again"}`)
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }

    ws.onclose = () => {
      setIsConnected(false)
      console.log("WebSocket disconnected")

      // Attempt to reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connectWebSocket()
      }, 3000)
    }

    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
      ws.close()
    }
  }, [wsUrl, checkoutRequestID, dispatch])

  // Connect to WebSocket when component mounts
  useEffect(() => {
    connectWebSocket()

    // Clean up on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [connectWebSocket])

  // Reconnect if checkoutRequestID changes
  useEffect(() => {
    if (isConnected && checkoutRequestID && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "subscribe",
          checkoutRequestID,
        }),
      )
    }
  }, [checkoutRequestID, isConnected])

  return {
    isConnected,
    lastMessage,
  }
}

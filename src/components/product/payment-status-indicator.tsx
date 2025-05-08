"use client"

import { useEffect, useState } from "react"
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react"

interface PaymentStatusIndicatorProps {
  status: "pending" | "completed" | "failed" | null
  isProcessing: boolean
  startTime?: number
}

export function PaymentStatusIndicator({ status, isProcessing, startTime }: PaymentStatusIndicatorProps) {
  const [displayStatus, setDisplayStatus] = useState<string>("Waiting for payment...")
  const [elapsedTime, setElapsedTime] = useState<number>(0)

  // Update elapsed time every second when processing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isProcessing && startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        setElapsedTime(elapsed)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isProcessing, startTime])

  useEffect(() => {
    if (status === "completed") {
      setDisplayStatus("Payment successful!")
    } else if (status === "failed") {
      setDisplayStatus("Payment failed")
    } else if (status === "pending" && isProcessing) {
      setDisplayStatus(`Waiting for M-Pesa confirmation... ${elapsedTime > 0 ? `(${elapsedTime}s)` : ""}`)
    } else if (!isProcessing && status === "pending") {
      setDisplayStatus("Payment cancelled or timed out")
    } else if (!isProcessing) {
      setDisplayStatus("Ready to process payment")
    }
  }, [status, isProcessing, elapsedTime])

  return (
    <div className="flex items-center justify-center gap-2 py-2">
      {isProcessing && status === "pending" && <Loader2 className="h-4 w-4 animate-spin text-amber-500" />}
      {status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
      {status === "failed" && <XCircle className="h-4 w-4 text-red-500" />}
      {!isProcessing && status === "pending" && <Clock className="h-4 w-4 text-gray-500" />}
      <span
        className={`text-sm ${
          status === "completed"
            ? "text-green-500"
            : status === "failed"
              ? "text-red-500"
              : !isProcessing && status === "pending"
                ? "text-gray-500"
                : "text-amber-500"
        }`}
      >
        {displayStatus}
      </span>
    </div>
  )
}

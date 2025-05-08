"use client"
import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { Phone } from "lucide-react"
import {
  initiateSTKPush,
  checkPaymentStatus,
  queryTransactionStatus,
  setCurrentTransaction,
} from "@/store/reducers/paymentReducer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { PaymentStatusIndicator } from "./payment-status-indicator"
import { usePaymentWebSocket } from "@/hooks/usePaymentWebSocket"

interface PaymentFormProps {
  isOpen: boolean
  onClose: () => void
  product: any
  quantity: number
}

export function PaymentForm({ isOpen, onClose, product, quantity = 1 }: PaymentFormProps) {
  const dispatch = useDispatch<any>()
  const { userInfo } = useSelector((state: any) => state.auth)
  const { loading, error, success, currentTransaction } = useSelector((state: any) => state.payment)

  const [phone, setPhone] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStartTime, setProcessingStartTime] = useState<number | null>(null)
  const maxPollingTime = 120000 // 2 minutes in milliseconds
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Connect to WebSocket for real-time payment updates
  const { isConnected } = usePaymentWebSocket(currentTransaction?.checkoutRequestID)

  // Calculate final price with discount
  const calculatePrice = () => {
    if (!product) return 0

    let price = product.price
    if (product.discount) {
      price = price - Math.floor((price * product.discount) / 100)
    }
    return price * quantity
  }

  const finalPrice = calculatePrice()

  // Format phone number to ensure it's in the correct format for M-Pesa
  const formatPhoneNumber = (phoneNumber: string) => {
    // Remove any non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, "")

    // Ensure it starts with 254 (Kenya code)
    if (cleaned.startsWith("0")) {
      cleaned = "254" + cleaned.substring(1)
    } else if (!cleaned.startsWith("254")) {
      cleaned = "254" + cleaned
    }

    return cleaned
  }

  // Reset payment state when component unmounts or dialog closes
  const resetPaymentState = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsProcessing(false)
    setProcessingStartTime(null)
    dispatch(setCurrentTransaction(null))
  }

  // Handle payment initiation
  const handlePayment = () => {
    if (!phone) {
      toast.error("Please enter your phone number")
      return
    }

    if (!userInfo) {
      toast.error("Please login to make a payment")
      return
    }

    // Reset any previous state
    resetPaymentState()

    const formattedPhone = formatPhoneNumber(phone)

    const paymentData = {
      phone: formattedPhone,
      amount: finalPrice,
      sellerId: product.sellerId,
      productId: product._id,
      buyerId: userInfo.id,
      shopName: product.shopName || "Online Store",
    }

    dispatch(initiateSTKPush(paymentData))
    setIsProcessing(true)
    setProcessingStartTime(Date.now())

    // Set a timeout to automatically stop processing after maxPollingTime
    timeoutRef.current = setTimeout(() => {
      if (isProcessing) {
        setIsProcessing(false)
        toast.error("Payment timed out. Please try again.")
      }
    }, maxPollingTime)
  }

  // Handle transaction status changes
  useEffect(() => {
    if (currentTransaction) {
      // Immediately stop processing if we have a definitive status
      if (currentTransaction.status === "completed" || currentTransaction.status === "failed") {
        // Clear the timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }

        // Update processing state
        setIsProcessing(false)

        // Show appropriate toast
        if (currentTransaction.status === "completed") {
          toast.success("Payment completed successfully!")
          setTimeout(() => {
            onClose()
          }, 2000)
        } else if (currentTransaction.status === "failed") {
          toast.error(`Payment failed: ${currentTransaction.resultDesc || "Please try again"}`)
        }
      }
    }
  }, [currentTransaction, onClose])

  // Handle errors and success messages
  useEffect(() => {
    if (error) {
      toast.error(error)
      setIsProcessing(false)
    }

    if (success) {
      toast.success(success)
    }
  }, [error, success])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      resetPaymentState()
    }
  }, [])

  // Force check status button
  const handleForceStatusCheck = () => {
    if (currentTransaction?.checkoutRequestID) {
      if (currentTransaction.mpesaReceiptNumber) {
        dispatch(
          queryTransactionStatus({
            transactionId: currentTransaction.mpesaReceiptNumber,
          }),
        )
      } else {
        dispatch(checkPaymentStatus(currentTransaction.checkoutRequestID))
      }
      toast.info("Checking payment status...")
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetPaymentState()
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
          <DialogDescription>
            Pay with M-Pesa for your order. You will receive a prompt on your phone to complete the payment.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="product">Product</Label>
            <Input id="product" value={product?.name} disabled />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input id="amount" value={`$${finalPrice.toFixed(2)}`} disabled />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                placeholder="e.g. 0712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isProcessing}
              />
            </div>
            <p className="text-xs text-muted-foreground">Enter your M-Pesa registered phone number</p>
          </div>
        </div>

        <div className="mt-2">
          <PaymentStatusIndicator
            status={currentTransaction?.status || null}
            isProcessing={isProcessing}
            startTime={processingStartTime || undefined}
          />

          {/* WebSocket connection status */}
          <div className="flex items-center justify-center mt-1">
            <div className={`h-2 w-2 rounded-full mr-2 ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className="text-xs text-muted-foreground">
              {isConnected ? "Real-time updates active" : "Connecting to payment service..."}
            </span>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => {
                resetPaymentState()
                onClose()
              }}
              disabled={loading}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>

            {isProcessing && (
              <Button variant="secondary" onClick={handleForceStatusCheck} className="flex-1 sm:flex-none">
                Refresh Status
              </Button>
            )}
          </div>

          <Button onClick={handlePayment} disabled={isProcessing || loading} className="w-full sm:w-auto">
            {isProcessing || loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Pay Now"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

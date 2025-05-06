"use client"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { Phone } from "lucide-react"
import { initiateSTKPush, checkPaymentStatus } from "@/store/reducers/paymentReducer"
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
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null)

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

    const formattedPhone = formatPhoneNumber(phone)

    const paymentData = {
      phone : formattedPhone,
      amount: finalPrice,
      sellerId: product.sellerId,
      productId: product._id,
      buyerId :userInfo.id,
      shopName: product.shopName || "Online Store",
    }

    dispatch(initiateSTKPush(paymentData))
    setIsProcessing(true)
  }

  // Check payment status periodically
  useEffect(() => {
    if (isProcessing && currentTransaction?.checkoutRequestID) {
      // Clear any existing interval
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval)
      }

      // Set up a new interval to check payment status every 5 seconds
      const interval = setInterval(() => {
        dispatch(checkPaymentStatus(currentTransaction.checkoutRequestID))
      }, 5000)

      setStatusCheckInterval(interval)
    }

    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval)
      }
    }
  }, [isProcessing, currentTransaction, dispatch])

  // Handle transaction status changes
  useEffect(() => {
    if (currentTransaction) {
      if (currentTransaction.status === "completed") {
        if (statusCheckInterval) {
          clearInterval(statusCheckInterval)
          setStatusCheckInterval(null)
        }
        setIsProcessing(false)
        toast.success("Payment completed successfully!")
        setTimeout(() => {
          onClose()
        }, 2000)
      } else if (currentTransaction.status === "failed") {
        if (statusCheckInterval) {
          clearInterval(statusCheckInterval)
          setStatusCheckInterval(null)
        }
        setIsProcessing(false)
        toast.error(`Payment failed: ${currentTransaction.resultDesc || "Please try again"}`)
      }
    }
  }, [currentTransaction, statusCheckInterval, onClose])

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={isProcessing || loading}>
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

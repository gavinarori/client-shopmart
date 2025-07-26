"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Calendar, MapPin, Package, CreditCard, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { createOrder, calculateOrderFees } from "@/store/reducers/orderReducer"
import { formatPrice } from "@/lib/utils"

interface OrderFormProps {
  isOpen: boolean
  onClose: () => void
  products: any[]
  sellerId: string
  sellerName: string
}

export function OrderForm({ isOpen, onClose, products, sellerId, sellerName }: OrderFormProps) {
  const dispatch = useDispatch<any>()
  const router = useRouter()
  const { userInfo } = useSelector((state: any) => state.auth)
  const { loading, error, success } = useSelector((state: any) => state.order)

  const [formData, setFormData] = useState({
    deliveryAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Kenya"
    },
    deliveryInstructions: "",
    expectedDeliveryDate: "",
    customerNotes: ""
  })

  const [fees, setFees] = useState({
    orderFee: 0,
    shippingFee: 0,
    totalFee: 0
  })

  // Calculate total amount from products
  const totalAmount = products.reduce((sum, product) => {
    const price = product.productInfo.discount 
      ? product.productInfo.price - Math.floor((product.productInfo.price * product.productInfo.discount) / 100)
      : product.productInfo.price
    return sum + (price * product.quantity)
  }, 0)

  // Calculate fees when location changes
  useEffect(() => {
    if (formData.deliveryAddress.city) {
      const calculateFees = async () => {
        try {
          const response = await fetch('/api/orders/calculate-fees', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              location: formData.deliveryAddress.city,
              totalAmount
            })
          })
          const data = await response.json()
          if (data.status === 'success') {
            setFees(data.data)
          }
        } catch (error) {
          console.error('Error calculating fees:', error)
        }
      }
      calculateFees()
    }
  }, [formData.deliveryAddress.city, totalAmount])

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userInfo) {
      toast.error("Please login to place an order")
      router.push("/login")
      return
    }

    // Validate required fields
    const requiredFields = [
      formData.deliveryAddress.street,
      formData.deliveryAddress.city,
      formData.deliveryAddress.state,
      formData.deliveryAddress.zipCode,
      formData.expectedDeliveryDate
    ]

    if (requiredFields.some(field => !field)) {
      toast.error("Please fill in all required fields")
      return
    }

    const orderData: any = {
      customerId: userInfo.id,
      sellerId,
      products: products.map(product => ({
        productId: product.productInfo._id,
        quantity: product.quantity,
        price: product.productInfo.discount 
          ? product.productInfo.price - Math.floor((product.productInfo.price * product.productInfo.discount) / 100)
          : product.productInfo.price,
        productName: product.productInfo.name,
        productImage: product.productInfo.images?.[0] || ""
      })),
      totalAmount: totalAmount + fees.totalFee,
      orderFee: fees.orderFee,
      shippingFee: fees.shippingFee,
      deliveryAddress: formData.deliveryAddress,
      deliveryInstructions: formData.deliveryInstructions,
      expectedDeliveryDate: new Date(formData.expectedDeliveryDate),
      customerNotes: formData.customerNotes
    }

    dispatch(createOrder(orderData))
  }

  // Handle successful order creation
  useEffect(() => {
    if (success) {
      toast.success("Order placed successfully!")
      onClose()
      router.push("/dashboard/orders")
    }
  }, [success, onClose, router])

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Place Your Order</DialogTitle>
          <DialogDescription>
            Complete your order details and delivery information for {sellerName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Summary
            </h3>
            <div className="space-y-2">
              {products.map((product, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <img 
                      src={product.productInfo.images?.[0] || "/placeholder.svg"} 
                      alt={product.productInfo.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{product.productInfo.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {product.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    {formatPrice(
                      (product.productInfo.discount 
                        ? product.productInfo.price - Math.floor((product.productInfo.price * product.productInfo.discount) / 100)
                        : product.productInfo.price) * product.quantity
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Delivery Address
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={formData.deliveryAddress.street}
                  onChange={(e) => handleInputChange('deliveryAddress.street', e.target.value)}
                  placeholder="Enter street address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.deliveryAddress.city}
                  onChange={(e) => handleInputChange('deliveryAddress.city', e.target.value)}
                  placeholder="e.g. Nairobi"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/County *</Label>
                <Input
                  id="state"
                  value={formData.deliveryAddress.state}
                  onChange={(e) => handleInputChange('deliveryAddress.state', e.target.value)}
                  placeholder="e.g. Nairobi County"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Postal Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.deliveryAddress.zipCode}
                  onChange={(e) => handleInputChange('deliveryAddress.zipCode', e.target.value)}
                  placeholder="e.g. 00100"
                />
              </div>
            </div>
          </div>

          {/* Delivery Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">Delivery Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.deliveryInstructions}
              onChange={(e) => handleInputChange('deliveryInstructions', e.target.value)}
              placeholder="Any special delivery instructions..."
              rows={3}
            />
          </div>

          {/* Expected Delivery Date */}
          <div className="space-y-2">
            <Label htmlFor="deliveryDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Expected Delivery Date *
            </Label>
            <Input
              id="deliveryDate"
              type="date"
              value={formData.expectedDeliveryDate}
              onChange={(e) => handleInputChange('expectedDeliveryDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Customer Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.customerNotes}
              onChange={(e) => handleInputChange('customerNotes', e.target.value)}
              placeholder="Any additional notes for the seller..."
              rows={3}
            />
          </div>

          {/* Fees and Total */}
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Order Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Order Fee:</span>
                <span>{formatPrice(fees.orderFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span>{formatPrice(fees.shippingFee)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(totalAmount + fees.totalFee)}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Placing Order..." : "Place Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
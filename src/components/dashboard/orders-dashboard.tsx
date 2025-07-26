"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { 
  Package, 
  Calendar, 
  MapPin, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  MessageSquare,
  Eye,
  Filter,
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCustomerOrders } from "@/store/reducers/orderReducer"
import { formatPrice } from "@/lib/utils"

export function OrdersDashboard() {
  const dispatch = useDispatch<any>()
  const router = useRouter()
  const { userInfo } = useSelector((state: any) => state.auth)
  const { orders, loading, error } = useSelector((state: any) => state.order)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showOrderDialog, setShowOrderDialog] = useState(false)

  useEffect(() => {
    if (!userInfo?.id) {
      router.push("/login")
      return
    }

    dispatch(getCustomerOrders(userInfo.id))
  }, [userInfo, dispatch, router])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'confirmed':
      case 'processing':
        return <Truck className="h-4 w-4 text-blue-500" />
      case 'shipped':
        return <Truck className="h-4 w-4 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Package className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setShowOrderDialog(true)
  }

  const handleContactSeller = (sellerId: string) => {
    router.push(`/dashboard/chat/${sellerId}`)
  }

  const filteredOrders = orders?.filter((order: any) => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.sellerId?.shopInfo?.shopName?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  const getOrdersByStatus = (status: string) => {
    return orders?.filter((order: any) => order.orderStatus === status) || []
  }

  if (!userInfo?.id) {
    return <div className="text-center py-8">Please log in to view your orders</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">Track your order history and status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{orders?.length || 0}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600">{getOrdersByStatus('pending').length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processing Orders</p>
                <p className="text-2xl font-bold text-blue-600">
                  {getOrdersByStatus('processing').length + getOrdersByStatus('confirmed').length}
                </p>
              </div>
              <Truck className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delivered Orders</p>
                <p className="text-2xl font-bold text-green-600">{getOrdersByStatus('delivered').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredOrders.length > 0 ? (
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({orders?.length || 0})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({getOrdersByStatus('pending').length})</TabsTrigger>
            <TabsTrigger value="processing">Processing ({getOrdersByStatus('processing').length + getOrdersByStatus('confirmed').length})</TabsTrigger>
            <TabsTrigger value="delivered">Delivered ({getOrdersByStatus('delivered').length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredOrders.map((order: any) => (
              <OrderCard 
                key={order._id} 
                order={order} 
                onView={handleViewOrder}
                onContact={handleContactSeller}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
              />
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {getOrdersByStatus('pending').map((order: any) => (
              <OrderCard 
                key={order._id} 
                order={order} 
                onView={handleViewOrder}
                onContact={handleContactSeller}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
              />
            ))}
          </TabsContent>

          <TabsContent value="processing" className="space-y-4">
            {[...getOrdersByStatus('processing'), ...getOrdersByStatus('confirmed')].map((order: any) => (
              <OrderCard 
                key={order._id} 
                order={order} 
                onView={handleViewOrder}
                onContact={handleContactSeller}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
              />
            ))}
          </TabsContent>

          <TabsContent value="delivered" className="space-y-4">
            {getOrdersByStatus('delivered').map((order: any) => (
              <OrderCard 
                key={order._id} 
                order={order} 
                onView={handleViewOrder}
                onContact={handleContactSeller}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
              />
            ))}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No orders found</h3>
          <p className="text-muted-foreground mb-4">
            {orders?.length === 0 
              ? "You haven't placed any orders yet. Start shopping to see your orders here."
              : "No orders match your current filters."
            }
          </p>
          <Button onClick={() => router.push("/products")}>
            Start Shopping
          </Button>
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?.orderId}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Summary
                </h3>
                <div className="space-y-2">
                  {selectedOrder.products.map((product: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.productImage || "/placeholder.svg"} 
                          alt={product.productName}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{product.productName}</p>
                          <p className="text-sm text-muted-foreground">Qty: {product.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold">
                        {formatPrice(product.price * product.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(selectedOrder.totalAmount - selectedOrder.orderFee - selectedOrder.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Fee:</span>
                    <span>{formatPrice(selectedOrder.orderFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{formatPrice(selectedOrder.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total:</span>
                    <span>{formatPrice(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Information
                </h3>
                <div className="text-sm space-y-1">
                  <p>{selectedOrder.deliveryAddress.street}</p>
                  <p>{selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state}</p>
                  <p>{selectedOrder.deliveryAddress.zipCode}, {selectedOrder.deliveryAddress.country}</p>
                  {selectedOrder.deliveryInstructions && (
                    <p className="text-muted-foreground mt-2">
                      <strong>Instructions:</strong> {selectedOrder.deliveryInstructions}
                    </p>
                  )}
                </div>
              </div>

              {/* Expected Delivery */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Expected Delivery
                </h3>
                <p className="text-sm">
                  {new Date(selectedOrder.expectedDeliveryDate).toLocaleDateString()}
                </p>
              </div>

              {/* Notes */}
              {selectedOrder.customerNotes && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Your Notes</h3>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customerNotes}</p>
                </div>
              )}

              {selectedOrder.sellerNotes && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Seller Notes</h3>
                  <p className="text-sm text-muted-foreground">{selectedOrder.sellerNotes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <img 
                    src={selectedOrder.sellerId?.image || "/placeholder.svg"} 
                    alt={selectedOrder.sellerId?.shopInfo?.shopName}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-medium">{selectedOrder.sellerId?.shopInfo?.shopName}</span>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => handleContactSeller(selectedOrder.sellerId._id)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Seller
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Order Card Component
function OrderCard({ 
  order, 
  onView, 
  onContact, 
  getStatusIcon, 
  getStatusColor 
}: {
  order: any
  onView: (order: any) => void
  onContact: (sellerId: string) => void
  getStatusIcon: (status: string) => JSX.Element
  getStatusColor: (status: string) => string
}) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(order.orderStatus)}
              Order #{order.orderId}
            </CardTitle>
            <CardDescription>
              Placed on {new Date(order.createdAt).toLocaleDateString()} by {order.sellerId?.shopInfo?.shopName || 'Seller'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(order.orderStatus)}>
              {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
            </Badge>
            <span className="text-lg font-semibold">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Products Preview */}
          <div>
            <h3 className="font-semibold mb-3">Products</h3>
            <div className="space-y-2">
              {order.products.slice(0, 3).map((product: any, index: number) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <img 
                    src={product.productImage || "/placeholder.svg"} 
                    alt={product.productName}
                    className="w-8 h-8 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.productName}</p>
                    <p className="text-xs text-muted-foreground">Qty: {product.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatPrice(product.price * product.quantity)}
                  </p>
                </div>
              ))}
              {order.products.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{order.products.length - 3} more items
                </p>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>{order.products.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expected Delivery:</span>
                  <span>{new Date(order.expectedDeliveryDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onContact(order.sellerId._id)}
                className="flex-1"
              >
                <MessageSquare className="mr-2 h-3 w-3" />
                Contact
              </Button>
              <Button 
                size="sm"
                onClick={() => onView(order)}
                className="flex-1"
              >
                <Eye className="mr-2 h-3 w-3" />
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
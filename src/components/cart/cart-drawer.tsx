"use client"

import { useState, useEffect, type ReactNode } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2, ShoppingCart, Trash, Package, Minus, Plus, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useSelector, useDispatch } from "react-redux"
import {
  get_card_products,
  delete_card_product,
  messageClear,
  quantity_inc,
  quantity_dec,
} from "@/store/reducers/cardReducer"
import { OrderForm } from "@/components/order/order-form"
import { formatPrice } from "@/lib/utils"

interface CartDrawerProps {
  children?: ReactNode
}

export function CartDrawer({ children }: CartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [selectedSeller, setSelectedSeller] = useState<any>(null)

  const dispatch = useDispatch<any>()
  const { userInfo } = useSelector((state: any) => state.auth)
  const { card_products, successMessage, price, card_product_count, shipping_fee, outofstock_products } = useSelector(
    (state: any) => state.card,
  )

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
      dispatch(messageClear())
      // Refresh cart data after any successful operation
      if (userInfo?.id) {
        dispatch(get_card_products(userInfo.id))
      }
    }
  }, [successMessage, dispatch, userInfo])

  // Refresh cart data when drawer opens
  useEffect(() => {
    if (isOpen && userInfo?.id) {
      dispatch(get_card_products(userInfo.id))
    }
  }, [isOpen, userInfo, dispatch])

  // Also refresh cart data when user changes
  useEffect(() => {
    if (userInfo?.id) {
      dispatch(get_card_products(userInfo.id))
    }
  }, [userInfo, dispatch])

  const inc = (quantity: number, stock: number, card_id: string | any) => {
    const temp = quantity + 1
    if (temp <= stock) {
      dispatch(quantity_inc(card_id))
    } else {
      toast.error("Cannot add more items. Stock limit reached.")
    }
  }

  const dec = (quantity: number, card_id: string | any) => {
    const temp = quantity - 1
    if (temp !== 0) {
      dispatch(quantity_dec(card_id))
    } else {
      toast.error("Quantity cannot be less than 1")
    }
  }

  const removeItem = (card_id: string | any) => {
    dispatch(delete_card_product(card_id))
  }

  const handlePlaceOrder = (seller: any) => {
    setSelectedSeller(seller)
    setShowOrderForm(true)
    setIsOpen(false)
  }

  const handleCheckout = () => {
    setIsCheckingOut(true)
    // Simulate checkout process
    setTimeout(() => {
      setIsCheckingOut(false)
      setIsOpen(false)
    }, 2000)
  }

  // Calculate total from card_products
  const total = price || 0

  // Check if cart is empty - card_products is an array of seller groups
  const isCartEmpty = !card_products || card_products.length === 0

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children ? (
          <div onClick={() => setIsOpen(true)}>{children}</div>
        ) : (
          <Button variant="outline" size="icon" className="relative" onClick={() => setIsOpen(true)}>
            <ShoppingCart className="h-5 w-5" />
            {card_product_count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {card_product_count}
              </span>
            )}
            <span className="sr-only">Open cart</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Your Cart ({card_product_count || 0})</span>
          </SheetTitle>
        </SheetHeader>

        {isCartEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4 py-12">
            <div className="rounded-full border-2 border-dashed p-6">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium">Your cart is empty</h3>
              <p className="text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
            </div>
            <Button onClick={() => setIsOpen(false)}>Continue Shopping</Button>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-5 overflow-hidden">
            <div className="flex-1 overflow-y-auto py-2 mx-2 space-y-4">
              <AnimatePresence initial={false}>
                {card_products.map((sellerGroup: any, sellerIndex: number) => (
                  <Card key={sellerGroup.sellerId} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm">{sellerGroup.shopName}</h3>
                            <p className="text-xs text-muted-foreground">
                              {sellerGroup.products?.length || 0} items
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {formatPrice(sellerGroup.price)}
                        </Badge>
                      </div>
                      
                      <Separator className="my-3" />
                      
                      <div className="space-y-3">
                        {sellerGroup.products?.map((product: any, productIndex: number) => (
                          <motion.div
                            key={product._id}
                            layout
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            className={`flex items-start gap-3 p-3 border rounded-lg ${
                              product.isOutOfStock ? 'bg-red-50 border-red-200' : 'bg-muted/30'
                            }`}
                          >
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-background">
                              {product.productInfo?.images && product.productInfo.images[0] ? (
                                <Image
                                  src={product.productInfo.images[0]}
                                  alt={product.productInfo.name}
                                  width={64}
                                  height={64}
                                  className="h-full w-full object-cover object-center"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-secondary">
                                  <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>

                            <div className="flex flex-1 flex-col gap-2">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className={`text-sm font-medium line-clamp-2 ${
                                    product.isOutOfStock ? 'text-red-600' : ''
                                  }`}>
                                    {product.productInfo?.name}
                                  </h4>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {formatPrice(product.productInfo?.price)} each
                                  </p>
                                  {product.isOutOfStock && (
                                    <p className="text-xs text-red-600 mt-1">
                                      Out of stock (only {product.productInfo?.stock} available)
                                    </p>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeItem(product._id)}
                                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                  <span className="sr-only">Remove</span>
                                </Button>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7 rounded-full"
                                    onClick={() => dec(product.quantity, product._id)}
                                    disabled={product.quantity <= 1 || product.isOutOfStock}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center text-sm font-medium">
                                    {product.quantity}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7 rounded-full"
                                    onClick={() => inc(product.quantity, product.productInfo?.stock, product._id)}
                                    disabled={product.quantity >= product.productInfo?.stock || product.isOutOfStock}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                <div className="text-right">
                                  <p className={`text-sm font-semibold ${
                                    product.isOutOfStock ? 'text-red-600' : ''
                                  }`}>
                                    {formatPrice(product.productInfo?.price * product.quantity)}
                                  </p>
                                  {product.quantity >= product.productInfo?.stock && !product.isOutOfStock && (
                                    <p className="text-xs text-muted-foreground">Max stock</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </AnimatePresence>
            </div>

            <SheetFooter className="border-t pt-4">
              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatPrice(total)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Shipping</span>
                    <span className="font-medium">{formatPrice(shipping_fee)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total + shipping_fee)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {card_products.map((sellerGroup: any) => (
                    <Button 
                      key={sellerGroup.sellerId}
                      className="w-full" 
                      onClick={() => handlePlaceOrder(sellerGroup)}
                      disabled={isCheckingOut}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Place Order - {sellerGroup.shopName}
                    </Button>
                  ))}
                </div>
                
                <div className="text-center">
                  <Button variant="link" className="text-sm" onClick={() => setIsOpen(false)}>
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
      
      {/* Order Form Modal */}
      {selectedSeller && (
        <OrderForm
          isOpen={showOrderForm}
          onClose={() => {
            setShowOrderForm(false)
            setSelectedSeller(null)
          }}
          products={selectedSeller.products}
          sellerId={selectedSeller.sellerId}
          sellerName={selectedSeller.shopName}
        />
      )}
    </Sheet>
  )
}

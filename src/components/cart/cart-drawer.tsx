"use client"

import { useState, useEffect, type ReactNode } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2, ShoppingCart, Trash } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { useSelector, useDispatch } from "react-redux"
import {
  get_card_products,
  delete_card_product,
  messageClear,
  quantity_inc,
  quantity_dec,
} from "@/store/reducers/cardReducer"
import { formatPrice } from "@/lib/utils"

interface CartDrawerProps {
  children?: ReactNode
}

export function CartDrawer({ children }: CartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const dispatch = useDispatch<any>()
  const { userInfo } = useSelector((state: any) => state.auth)
  const { card_products, successMessage, price, card_product_count, shipping_fee, outofstock_products } = useSelector(
    (state: any) => state.card,
  )

  useEffect(() => {
    if (isOpen && userInfo?.id) {
      dispatch(get_card_products(userInfo.id))
    }
  }, [isOpen, userInfo, dispatch])

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
      dispatch(messageClear())
      if (userInfo?.id) {
        dispatch(get_card_products(userInfo.id))
      }
    }
  }, [successMessage, dispatch, userInfo])

  const inc = (quantity: number, stock: number, card_id: string | any) => {
    const temp = quantity + 1
    if (temp <= stock) {
      dispatch(quantity_inc(card_id))
    }
  }

  const dec = (quantity: number, card_id: string | any) => {
    const temp = quantity - 1
    if (temp !== 0) {
      dispatch(quantity_dec(card_id))
    }
  }

  const removeItem = (card_id: string | any) => {
    dispatch(delete_card_product(card_id))
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

        {!card_products || card_products.length === 0 ? (
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
            <div className="flex-1 overflow-y-auto py-2 mx-2">
              <AnimatePresence initial={false}>
              {card_products.map((item: any) =>
  item.products.map((product: any) => (
    <motion.div
      key={product._id}
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      className="flex items-start gap-4 border-b py-4"
    >
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
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
            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="text-sm font-medium">{product.productInfo?.name}</h3>
            <p className="mt-1 text-sm font-medium">{formatPrice(product.productInfo?.price)}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(product._id)}
            className="h-8 w-8"
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>

        <div className="mt-2 flex items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-full"
              onClick={() => dec(product.quantity, product._id)}
            >
              <span>-</span>
            </Button>
            <span className="w-4 text-center text-sm">{product.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-full"
              onClick={() => inc(product.quantity, product.productInfo?.stock, product._id)}
            >
              <span>+</span>
            </Button>
          </div>
          <div className="ml-auto text-right text-sm font-medium">
            {formatPrice(product.productInfo?.price * product.quantity)}
          </div>
        </div>
      </div>
    </motion.div>
  ))
)}

              </AnimatePresence>
            </div>

            <SheetFooter className="border-t pt-4">
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between text-base font-medium">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="text-center text-sm text-muted-foreground">Shipping and taxes calculated at checkout</p>
                <Button className="w-full" disabled={isCheckingOut} onClick={handleCheckout}>
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Checkout"
                  )}
                </Button>
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
    </Sheet>
  )
}

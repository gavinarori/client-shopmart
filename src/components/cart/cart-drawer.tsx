"use client"

import { useState, type ReactNode } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2, ShoppingCart, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { useCart } from "./add-to-cart"
import { formatPrice } from "@/lib/utils"

interface CartDrawerProps {
  children?: ReactNode
}

export function CartDrawer({ children }: CartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const { items, count, total, updateQuantity, removeItem } = useCart()

  const handleCheckout = () => {
    setIsCheckingOut(true)
    // Simulate checkout process
    setTimeout(() => {
      setIsCheckingOut(false)
      setIsOpen(false)
    }, 2000)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children ? (
          <div onClick={() => setIsOpen(true)}>{children}</div>
        ) : (
          <Button variant="outline" size="icon" className="relative" onClick={() => setIsOpen(true)}>
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {count}
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
            <span>Your Cart ({count})</span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
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
            <div className="flex-1 overflow-y-auto py-2">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.variant || ""}`}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    className="flex items-start gap-4 border-b py-4"
                  >
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                      {item.image ? (
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
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
                          <h3 className="text-sm font-medium">{item.title}</h3>
                          {item.variant && <p className="mt-1 text-xs text-muted-foreground">{item.variant}</p>}
                          <p className="mt-1 text-sm font-medium">{formatPrice(item.price)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id, item.variant)}
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
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.variant)}
                          >
                            <span>-</span>
                            <span className="sr-only">Decrease quantity</span>
                          </Button>
                          <span className="w-4 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                          >
                            <span>+</span>
                            <span className="sr-only">Increase quantity</span>
                          </Button>
                        </div>
                        <div className="ml-auto text-right text-sm font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
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


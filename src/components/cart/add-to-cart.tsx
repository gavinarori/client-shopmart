"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Loader2, MinusCircle, PlusCircle, ShoppingCart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"

// You can extend this interface based on your product schema
interface CartItem {
  id: string | number
  title: string
  price: number
  quantity: number
  image?: string
  variant?: string
}

// Create a simple cart context that can be extended later
let cart: CartItem[] = []
let listeners: (() => void)[] = []

// Simple cart state management functions
export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(cart)

  useEffect(() => {
    const updateCart = () => {
      setCartItems([...cart])
    }
    listeners.push(updateCart)
    return () => {
      listeners = listeners.filter((listener) => listener !== updateCart)
    }
  }, [])

  return {
    items: cartItems,
    count: cartItems.reduce((acc, item) => acc + item.quantity, 0),
    total: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    addItem: (item: CartItem) => {
      const existingItemIndex = cart.findIndex(
        (cartItem) => cartItem.id === item.id && cartItem.variant === item.variant,
      )

      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += item.quantity
      } else {
        cart.push(item)
      }

      listeners.forEach((listener) => listener())
    },
    removeItem: (id: string | number, variant?: string) => {
      cart = cart.filter((item) => !(item.id === id && item.variant === variant))
      listeners.forEach((listener) => listener())
    },
    updateQuantity: (id: string | number, quantity: number, variant?: string) => {
      const item = cart.find((item) => item.id === id && item.variant === variant)
      if (item) {
        item.quantity = quantity
        listeners.forEach((listener) => listener())
      }
    },
    clearCart: () => {
      cart = []
      listeners.forEach((listener) => listener())
    },
  }
}

export function AddToCart({
  variants,
  availableForSale,
  selectedVariant = variants?.[0],
  product,
  className,
}: {
  variants: any[]
  availableForSale: boolean
  selectedVariant?: any
  product: any
  className?: string
}) {
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const { addItem } = useCart()

  const handleQuantityChange = (increment: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + increment
      return newQuantity < 1 ? 1 : newQuantity
    })
  }

  const handleAddToCart = () => {
    setAdding(true)

    // Create a cart item from the product and selected variant
    const cartItem: CartItem = {
      id: product.id,
      title: product.title,
      price: selectedVariant?.price?.amount || product.priceRange.maxVariantPrice.amount,
      quantity: quantity,
      image: product.featuredImage?.url || product.images?.[0]?.url,
      variant: selectedVariant?.title,
    }

    // Simulate adding to cart with a slight delay for animation
    setTimeout(() => {
      addItem(cartItem)
      setAdding(false)
      setAdded(true)

 

      // Reset added state after a moment
      setTimeout(() => {
        setAdded(false)
        setQuantity(1) // Reset quantity after adding
      }, 2000)
    }, 800)
  }

  const isOutOfStock = !availableForSale || (selectedVariant && !selectedVariant.availableForSale)

  return (
    <div className={cn("space-y-4", className)}>
      {/* Quantity selector */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium">Quantity:</span>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            disabled={quantity <= 1 || adding}
            onClick={() => handleQuantityChange(-1)}
            className="h-8 w-8"
          >
            <MinusCircle className="h-5 w-5" />
            <span className="sr-only">Decrease quantity</span>
          </Button>

          <span className="w-8 text-center">{quantity}</span>

          <Button
            variant="ghost"
            size="icon"
            disabled={adding}
            onClick={() => handleQuantityChange(1)}
            className="h-8 w-8"
          >
            <PlusCircle className="h-5 w-5" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>
      </div>

      {/* Add to cart button with animation states */}
      <AnimatePresence mode="wait">
        <motion.div
          key={added ? "added" : adding ? "adding" : "idle"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="w-full"
        >
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding || added}
            className={cn("relative w-full transition-all", added ? "bg-green-600 hover:bg-green-700" : "")}
          >
            {isOutOfStock ? (
              "Out of Stock"
            ) : added ? (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                Added to Cart
              </>
            ) : adding ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart {quantity > 1 ? `(${quantity})` : ""}
              </>
            )}
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Loader2, MinusCircle, PlusCircle, ShoppingCart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Interfaces
interface CartItem {
  id: string | number
  title: string
  price: number
  quantity: number
  image?: string
  variant?: string
}

// Simple cart context
let cart: CartItem[] = []
let listeners: (() => void)[] = []

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(cart)

  useEffect(() => {
    const updateCart = () => setCartItems([...cart])
    listeners.push(updateCart)
    return () => {
      listeners = listeners.filter((l) => l !== updateCart)
    }
  }, [])

  return {
    items: cartItems,
    count: cartItems.reduce((acc, item) => acc + item.quantity, 0),
    total: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    addItem: (item: CartItem) => {
      const existingIndex = cart.findIndex(
        (i) => i.id === item.id && i.variant === item.variant
      )
      if (existingIndex > -1) {
        cart[existingIndex].quantity += item.quantity
      } else {
        cart.push(item)
      }
      listeners.forEach((fn) => fn())
    },
    removeItem: (id: string | number, variant?: string) => {
      cart = cart.filter((item) => !(item.id === id && item.variant === variant))
      listeners.forEach((fn) => fn())
    },
    updateQuantity: (id: string | number, quantity: number, variant?: string) => {
      const item = cart.find((i) => i.id === id && i.variant === variant)
      if (item) {
        item.quantity = quantity
        listeners.forEach((fn) => fn())
      }
    },
    clearCart: () => {
      cart = []
      listeners.forEach((fn) => fn())
    },
  }
}

export function AddToCart({
  variants,
  availableForSale,
  selectedVariant = variants?.[0],
  product,
  className,
  stock,
}: {
  variants: any[]
  availableForSale: boolean
  selectedVariant?: any
  product: any
  className?: string
  stock: number
}) {
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const { addItem } = useCart()

  const handleQuantityChange = (increment: number) => {
    setQuantity((prev) => {
      const newQty = prev + increment
      if (newQty > stock) {
        toast.error(`Only ${stock} in stock`)
        return prev
      }
      return newQty < 1 ? 1 : newQty
    })
  }

  const handleAddToCart = () => {
    if (quantity > stock) {
      toast.error("Quantity exceeds available stock.")
      return
    }

    setAdding(true)

    const cartItem: CartItem = {
      id: product.id,
      title: product.title,
      price: selectedVariant?.price?.amount || product.priceRange.maxVariantPrice.amount,
      quantity,
      image: product.featuredImage?.url || product.images?.[0]?.url,
      variant: selectedVariant?.title,
    }

    setTimeout(() => {
      addItem(cartItem)
      setAdding(false)
      setAdded(true)

      setTimeout(() => {
        setAdded(false)
        setQuantity(1)
      }, 2000)
    }, 800)
  }

  const isOutOfStock = !availableForSale || stock <= 0 || (selectedVariant && !selectedVariant.availableForSale)

  return (
    <div className={cn("space-y-4", className)}>
      {/* Quantity Selector */}
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
          </Button>

          <span className="w-8 text-center">{quantity}</span>

          <Button
            variant="ghost"
            size="icon"
            disabled={adding || quantity >= stock}
            onClick={() => handleQuantityChange(1)}
            className="h-8 w-8"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Add To Cart Button */}
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
            className={cn("w-full transition-all", added && "bg-green-600 hover:bg-green-700")}
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

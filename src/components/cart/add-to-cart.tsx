"use client"

import { useState } from "react"
import { CheckCircle, Loader2, MinusCircle, PlusCircle, ShoppingCart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { add_to_card, get_card_products } from "@/store/reducers/cardReducer"

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
  const dispatch = useDispatch<any>()
  const router = useRouter()
  const { userInfo } = useSelector((state: any) => state.auth)
  const { count } = useSelector((state: any) => state.card)

  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

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

  const handleAddToCart = async () => {
    if (!userInfo) {
      toast.error("Please login to add items to cart")
      router.push("/login")
      return
    }

    if (quantity > stock) {
      toast.error("Quantity exceeds available stock.")
      return
    }

    setAdding(true)

    // Use the original product ID from the database
    const productId = product.id || product._id

    try {
      // Dispatch Redux action
      await dispatch(
        add_to_card({
          userId: userInfo.id,
          quantity,
          productId,
          // Include variant information if available
          ...(selectedVariant?.title && { variant: selectedVariant.title }),
        })
      ).unwrap()

      // Refresh cart data after successful addition
      if (userInfo.id) {
        dispatch(get_card_products(userInfo.id))
      }

      // Show animation and reset
      setAdding(false)
      setAdded(true)

      setTimeout(() => {
        setAdded(false)
        setQuantity(1)
      }, 2000)
    } catch (error) {
      setAdding(false)
      console.error("Failed to add to cart:", error)
    }
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

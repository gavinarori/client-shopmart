"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useState } from "react"

export function AddToCart({
  variants,
  availableForSale,
}: {
  variants: any[]
  availableForSale: boolean
}) {
  const [adding, setAdding] = useState(false)

  const handleAddToCart = () => {
    setAdding(true)

    // Simulate adding to cart
    setTimeout(() => {
      setAdding(false)
      alert("Product added to cart!")
    }, 1000)
  }

  return (
    <Button onClick={handleAddToCart} disabled={!availableForSale || adding} className="w-full">
      {adding ? (
        "Adding..."
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" /> Add To Cart
        </>
      )}
    </Button>
  )
}


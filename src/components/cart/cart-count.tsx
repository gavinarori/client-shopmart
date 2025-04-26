"use client"
import { ShoppingCart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import { CartDrawer } from "./cart-drawer"

export function CartCount() {
  const { card_product_count } = useSelector((state: any) => state.card)
  const count = card_product_count || 0

  return (
    <CartDrawer>
      <Button variant="outline" size="sm" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
            {count}
          </span>
        )}
      </Button>
    </CartDrawer>
  )
}

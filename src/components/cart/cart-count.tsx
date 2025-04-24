"use client"

import { useSelector } from "react-redux"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function CartCount() {
  const router = useRouter()
  const { count } = useSelector((state: any) => state.card)

  return (
    <Button variant="outline" size="sm" className="relative" onClick={() => router.push("/cart")}>
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
          {count}
        </span>
      )}
    </Button>
  )
}

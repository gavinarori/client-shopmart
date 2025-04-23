"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { get_card_products } from "@/store/reducers/cardReducer"

export function CartCount() {
  const dispatch = useDispatch<any>()
  const router = useRouter()
  const { userInfo } = useSelector((state:any) => state.auth)
  const { card_product_count } = useSelector((state:any) => state.card)

  const redirect_card_page = () => {
    if (userInfo) {
      router.push(`/card`)
    } else {
      router.push(`/login`)
    }
  }

  useEffect(() => {
    if (userInfo) {
      dispatch(get_card_products(userInfo.id))
    }
  }, [userInfo, dispatch])

  return (
    <Button variant="ghost" size="icon" className="relative" onClick={redirect_card_page}>
      <ShoppingCart className="h-5 w-5" />
      {card_product_count > 0 && (
        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          {card_product_count}
        </div>
      )}
      <span className="sr-only">Cart</span>
    </Button>
  )
}

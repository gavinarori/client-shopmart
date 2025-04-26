"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import { Heart, ShoppingCart, Trash2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { add_to_card } from "@/store/reducers/cardReducer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { get_wishlist_products, remove_wishlist, messageClear } from "@/store/reducers/cardReducer"
import { formatPrice } from "@/lib/utils"

export default function WishlistPage() {
  const dispatch = useDispatch<any>()
  const { userInfo } = useSelector((state: any) => state.auth)
  const { wishlist, successMessage } = useSelector((state: any) => state.card)

  useEffect(() => {
    if (userInfo?.id) {
      dispatch(get_wishlist_products(userInfo.id))
    }
  }, [dispatch, userInfo])

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
      dispatch(messageClear())
    }
  }, [successMessage, dispatch])



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          <span className="text-lg font-medium">{wishlist?.length || 0} items</span>
        </div>
      </div>

      {!wishlist || wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-xl font-medium">Your wishlist is empty</h3>
          <p className="mb-6 text-center text-muted-foreground">
            Items added to your wishlist will appear here. Start exploring to add products you love!
          </p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {wishlist.map((item: any) => (
  <Card key={item._id} className="overflow-hidden transition-all hover:shadow-md">
    <div className="relative aspect-square overflow-hidden">
      <Link href={`/product/${item.slug}`}>
        {item.image ? (
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <AlertCircle className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
      </Link>
      <Button
        variant="destructive"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8 rounded-full opacity-90"
        onClick={() => dispatch(remove_wishlist(item._id))} 
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
    <CardContent className="p-4">
      <Link href={`/product/${item.slug}`} className="hover:underline">
        <h3 className="mb-1 line-clamp-2 font-medium">{item.name}</h3>
      </Link>
      <div className="mb-3 flex items-center justify-between">
        <span className="font-bold">{formatPrice(item.price)}</span>
        {item.discount > 0 && (
          <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">
            {item.discount}% OFF
          </span>
        )}
      </div>
      <div className="flex gap-2">
      <Link href={`/product/${item.slug}`} >
      <Button className="flex-1">
          <ShoppingCart className="mr-2 h-4 w-4" />
          View the product
        </Button>
      </Link>
       
      </div>
    </CardContent>
  </Card>
))}

        </div>
      )}
    </div>
  )
}

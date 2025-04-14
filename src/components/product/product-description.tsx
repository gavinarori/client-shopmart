"use client"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Heart, MessageCircle } from "lucide-react"
import { CartProvider } from "@/components/cart/cart-provider"
import Price from "@/components/price"
import { VariantSelector } from "./variant-selector"
import { AddToCart } from "@/components/cart/add-to-cart"
import { CartCount } from "@/components/cart/cart-count"
import { Button } from "../ui/button"
import { messageClear, add_to_wishlist } from "@/store/reducers/cardReducer"

export function ProductDescription({ product }: { product: any }) {
  const dispatch = useDispatch<any>()
  const router = useRouter()
  const { userInfo } = useSelector((state: any) => state.auth)
  const { errorMessage, successMessage } = useSelector((state: any) => state.card)
  const [quantity, setQuantity] = useState(1)

  // Format product data to match expected structure
  const formattedProduct = {
    id: product._id,
    title: product.name,
    priceRange: {
      maxVariantPrice: {
        amount: product.discount
          ? (product.price - Math.floor((product.price * product.discount) / 100)).toString()
          : product.price.toString(),
        currencyCode: "USD",
      },
    },
    descriptionHtml: product.description,
    options: product.options || [],
    variants: product.variants || [],
    availableForSale: product.stock > 0,
    featuredImage: { url: product.images?.[0] || "/placeholder.svg" },
    images: product.images?.map((img: string) => ({ url: img })) || [],
  }

  // Handle messages
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage)
      dispatch(messageClear())
    }
    if (successMessage) {
      toast.success(successMessage)
      dispatch(messageClear())
    }
  }, [errorMessage, successMessage, dispatch])

  // Add to wishlist handler
  const addToWishlist = () => {
    if (!product) return

    if (userInfo) {
      dispatch(
        add_to_wishlist({
          userId: userInfo.id,
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          discount: product.discount,
          rating: product.rating,
          slug: product.slug,
        }),
      )
    } else {
      router.push("/login")
    }
  }

  // Buy now handler
  const buyNow = () => {
    if (!product) return

    let price = 0
    if (product.discount !== 0) {
      price = product.price - Math.floor((product.price * product.discount) / 100)
    } else {
      price = product.price
    }

    const obj = [
      {
        sellerId: product.sellerId,
        shopName: product.shopName,
        price: quantity * (price - Math.floor((price * 5) / 100)),
        products: [
          {
            quantity,
            productInfo: product,
          },
        ],
      },
    ]

    // Navigate to shipping page with product data
    router.push("/shipping")
    toast.success(`Proceeding to checkout with ${quantity} items`)
  }

  const chatWithSeller = () => {
    if (!userInfo) {
      toast.error("Please login to chat with seller")
      router.push("/login")
      return
    }

    if (product.sellerId) {
      // Calculate the final price with discount
      const finalPrice = product.discount
        ? product.price - Math.floor((product.price * product.discount) / 100)
        : product.price

      // Store product info in localStorage
      localStorage.setItem(
        "chatProduct",
        JSON.stringify({
          id: product._id,
          name: product.name,
          price: finalPrice,
          image: product.images?.[0] || "/placeholder.svg",
          slug: product.slug,
        }),
      )

      // Show confirmation toast
      toast.success("Product added to chat", {
        description: "You can share it with the seller in the chat",
      })

      // Navigate to chat
      router.push(`/dashboard/chat/${product.sellerId}`)
    }
  }

  return (
    <CartProvider>
      <div className="flex justify-end mb-4">
        <CartCount />
      </div>

      {/* Product Title and Price */}
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-4xl font-medium">{product.name}</h1>

          {product.discount !== 0 ? (
            <div className="flex items-center gap-4">
              <span className="line-through text-gray-500 text-lg">${product.price}</span>
              <div className="rounded-full bg-blue-600 px-4 py-2 text-sm text-white flex items-center">
                <Price
                  amount={(product.price - Math.floor((product.price * product.discount) / 100)).toString()}
                  currencyCode="USD"
                />
                <span className="ml-1">(-{product.discount}%)</span>
              </div>
            </div>
          ) : (
            <div className="rounded-full bg-blue-600 px-4 py-2 text-sm text-white">
              <Price amount={product.price.toString()} currencyCode="USD" />
            </div>
          )}
        </div>
      </div>

      {/* Location */}
      {product.location && (
        <div className="flex gap-2 py-3 mb-4">
          <p className="">Location:</p>
          {product.location.state && <p className="">{product.location.state},</p>}
          {product.location.city && <p className="">{product.location.city},</p>}
          {product.location.country && <p className="">{product.location.country}</p>}
        </div>
      )}

      {/* Variants */}
      {product.options && product.options.length > 0 && (
        <VariantSelector options={product.options} variants={product.variants || []} />
      )}

      {/* Description */}
      <div className="mb-6 text-sm leading-tight ">
        <p>{product.description}</p>
      </div>

      {/* Availability */}
      <div className="flex py-3 mb-6">
        <div className="w-[150px] font-medium">
          <span>Availability:</span>
        </div>
        <div>
          <span className={product.stock ? "text-green-600" : "text-red-600"}>
            {product.stock ? `In Stock (${product.stock})` : "Out of Stock"}
          </span>
        </div>
      </div>

      {/* Add to Cart */}
      <div className="flex gap-3 mb-8">
        <AddToCart
          variants={formattedProduct.variants}
          availableForSale={formattedProduct.availableForSale}
          product={formattedProduct}
          className="flex-1"
          stock={product.stock}
        />

        <Button onClick={addToWishlist} className="h-full aspect-square mt-11 flex items-center justify-center ">
          <Heart className="h-5 w-5" />
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {product.stock ? <Button onClick={buyNow}>Buy Now</Button> : null}

        <Button onClick={chatWithSeller} className="bg-green-600 hover:bg-green-700">
          <MessageCircle className="mr-2 h-5 w-5" />
          Chat Seller
        </Button>
      </div>
    </CartProvider>
  )
}

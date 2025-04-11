"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { GridTileImage } from "./tile"
import Link from "next/link"
import { get_products } from "@/store/reducers/homeReducer"

// Helper function to get products from different categories
const getProductsFromDifferentCategories = (allProducts:any) => {
  if (!allProducts || allProducts.length === 0) return []

  // Flatten nested arrays if needed
  const flattenedProducts = Array.isArray(allProducts[0]) ? allProducts.flat() : allProducts

  // Group products by category
  const productsByCategory:any = {}
  flattenedProducts.forEach((product:any) => {
    if (!productsByCategory[product.category]) {
      productsByCategory[product.category] = []
    }
    productsByCategory[product.category].push(product)
  })

  // Get one product from each category
  const categories = Object.keys(productsByCategory)
  const selectedProducts:any = []

  // Get up to 3 products from different categories
  for (let i = 0; i < Math.min(3, categories.length); i++) {
    selectedProducts.push(productsByCategory[categories[i]][0])
  }

  // If we don't have 3 products yet, fill with remaining products
  if (selectedProducts.length < 3 && flattenedProducts.length >= 3) {
    const remainingProducts = flattenedProducts.filter((p:any) => !selectedProducts.some((sp:any) => sp._id === p._id))

    for (let i = 0; i < Math.min(3 - selectedProducts.length, remainingProducts.length); i++) {
      selectedProducts.push(remainingProducts[i])
    }
  }

  return selectedProducts
}

function ThreeItemGridItem({
  product,
  size,
  priority,
}: {
  product: any
  size: "full" | "half"
  priority?: boolean
}) {
  if (!product) return null

  // Calculate discounted price
  const discountedPrice = product.discount
    ? (product.price - (product.price * product.discount) / 100).toFixed(2)
    : product.price.toFixed(2)

  return (
    <div className={size === "full" ? "md:col-span-4 md:row-span-2" : "md:col-span-2 md:row-span-1"}>
      <Link className="relative block aspect-square h-full w-full" href={`/product/${product.slug}`}>
        <GridTileImage
          src={product.images[0] || "/placeholder.svg"}
          fill
          sizes={size === "full" ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
          priority={priority}
          alt={product.name}
          label={{
            position: size === "full" ? "center" : "bottom",
            title: product.name,
            amount: discountedPrice.toString(),
            currencyCode: "USD",
          }}
        />
      </Link>
    </div>
  )
}

export function ThreeItemGrid() {
  const dispatch = useDispatch<any>()
  const { products, latest_product, topRated_product, discount_product } = useSelector((state: any) => state.home)
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dispatch(get_products()).then(() => setLoading(false))
  }, [dispatch])

  useEffect(() => {
    // Combine all product sources to get a diverse selection
    let allProducts = []

    // Handle the nested array structure in your API response
    if (products && products.length) {
      allProducts.push(...products)
    }

    if (latest_product && latest_product.length) {
      // Check if latest_product is a nested array
      const latestProducts = Array.isArray(latest_product[0]) ? latest_product.flat() : latest_product
      allProducts.push(...latestProducts)
    }

    if (topRated_product && topRated_product.length) {
      // Check if topRated_product is a nested array
      const topRatedProducts = Array.isArray(topRated_product[0]) ? topRated_product.flat() : topRated_product
      allProducts.push(...topRatedProducts)
    }

    if (discount_product && discount_product.length) {
      // Check if discount_product is a nested array
      const discountProducts = Array.isArray(discount_product[0]) ? discount_product.flat() : discount_product
      allProducts.push(...discountProducts)
    }

    // Remove duplicates by ID
    allProducts = allProducts.filter((product, index, self) => index === self.findIndex((p) => p._id === product._id))

    const diverseProducts = getProductsFromDifferentCategories(allProducts)
    setSelectedProducts(diverseProducts)
  }, [products, latest_product, topRated_product, discount_product])

  if (loading) {
    return (
      <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2">
        <div className="md:col-span-4 md:row-span-2 bg-gray-200 animate-pulse aspect-square"></div>
        <div className="md:col-span-2 md:row-span-1 bg-gray-200 animate-pulse aspect-square"></div>
        <div className="md:col-span-2 md:row-span-1 bg-gray-200 animate-pulse aspect-square"></div>
      </section>
    )
  }

  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2">
      {selectedProducts.length > 0 ? (
        <>
          <ThreeItemGridItem size="full" product={selectedProducts[0]} priority={true} />
          {selectedProducts.length > 1 && (
            <ThreeItemGridItem size="half" product={selectedProducts[1]} priority={true} />
          )}
          {selectedProducts.length > 2 && <ThreeItemGridItem size="half" product={selectedProducts[2]} />}
        </>
      ) : (
        <div className="md:col-span-6 text-center py-12">
          <p>No products found. Please check your data.</p>
        </div>
      )}
    </section>
  )
}

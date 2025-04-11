"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"

export default function ComparePage() {
  const [compareItems, setCompareItems] = useState<number[]>([])
  const { products } = useSelector((state: any) => state.home)
  const [compareProducts, setCompareProducts] = useState<any[]>([])

  // Load compare items from localStorage on client side
  useEffect(() => {
    const storedItems = localStorage.getItem("compareItems")
    if (storedItems) {
      setCompareItems(JSON.parse(storedItems))
    }
  }, [])

  // Update compareProducts when products or compareItems change
  useEffect(() => {
    if (products && products.length > 0 && compareItems.length > 0) {
      const filtered = products.filter((product: any) => compareItems.includes(product.id))
      setCompareProducts(filtered)
    }
  }, [products, compareItems])

  // Get all unique features from all products
  const allFeatures = compareProducts.reduce((acc: string[], product: any) => {
    if (product.features) {
      product.features.forEach((feature: string) => {
        if (!acc.includes(feature)) {
          acc.push(feature)
        }
      })
    }
    return acc
  }, [])

  if (compareProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Compare Products</h1>
        <p className="text-muted-foreground mb-6">No products selected for comparison</p>
        <Link href="/product-listing">
          <Button>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Shopping
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/product-listing">
          <Button variant="outline" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Shopping
          </Button>
        </Link>
        <h1 className="text-3xl font-bold ml-4">Compare Products</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-4 border-b w-1/4">Product</th>
              {compareProducts.map((product) => (
                <th key={`header-${product.id}`} className="p-4 border-b">
                  <div className="flex flex-col items-center">
                    <div className="aspect-square w-32 h-32 relative mb-2">
                      <Image
                        src={product.image || "/placeholder.svg?height=128&width=128"}
                        alt={product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <h3 className="font-medium text-center">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border-b font-medium">Price</td>
              {compareProducts.map((product) => (
                <td key={`price-${product.id}`} className="p-4 border-b text-center">
                  <div className="flex flex-col items-center">
                    {product.originalPrice ? (
                      <>
                        <span className="font-medium">${product.price.toFixed(2)}</span>
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="font-medium">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b font-medium">Size</td>
              {compareProducts.map((product) => (
                <td key={`size-${product.id}`} className="p-4 border-b text-center">
                  {product.sizes ? product.sizes.join(", ") : "N/A"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b font-medium">Color</td>
              {compareProducts.map((product) => (
                <td key={`color-${product.id}`} className="p-4 border-b text-center">
                  {product.colors ? product.colors.join(", ") : "N/A"}
                </td>
              ))}
            </tr>
            {allFeatures.map((feature) => (
              <tr key={`feature-${feature}`}>
                <td className="p-4 border-b font-medium">{feature}</td>
                {compareProducts.map((product) => (
                  <td key={`feature-${product.id}-${feature}`} className="p-4 border-b text-center">
                    {product.features && product.features.includes(feature) ? "✓" : "✗"}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-4 border-b font-medium">Actions</td>
              {compareProducts.map((product) => (
                <td key={`actions-${product.id}`} className="p-4 border-b text-center">
                  <div className="flex flex-col gap-2 items-center">
                    <Link href={`/product/${product.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Button size="sm" className="w-full">
                      Add to Cart
                    </Button>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

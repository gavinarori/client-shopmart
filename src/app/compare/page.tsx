"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ComparePage() {
  // This would typically come from a URL parameter or state management
  // For demo purposes, we're using static data
  const [compareItems] = useState([1, 2, 3])

  // Sample product data - in a real app, you'd fetch this based on compareItems
  const products = [
    {
      id: 1,
      name: "Essential T-Shirt Bundle",
      brand: "Urban Basics",
      price: 89.99,
      rating: 4.5,
      ratingCount: 42,
      description:
        "A collection of premium cotton t-shirts in essential colors. Perfect for everyday wear with a comfortable fit and durable fabric that maintains its shape after washing.",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Classic Denim Jacket",
      brand: "Vintage Apparel",
      price: 129.0,
      rating: 0,
      ratingCount: 0,
      description:
        "Bring timeless style to your wardrobe with this classic denim jacket. Features a comfortable fit with just the right amount of stretch for everyday wear.",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Comfort Fit Hoodie",
      brand: "Urban Basics",
      price: 65.0,
      rating: 0,
      ratingCount: 0,
      description:
        "Stay cozy with this ultra-soft hoodie. Made from a premium cotton blend that provides warmth without weight, perfect for layering in any season.",
      image: "/placeholder.svg",
    },
  ]

  // Get the selected products for comparison
  const selectedProducts = products.filter((product) => compareItems.includes(product.id))

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Compare products <span className="text-muted-foreground">{selectedProducts.length}</span>
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {selectedProducts.map((product) => (
          <div key={product.id} className="flex flex-col">
            <div className="aspect-square bg-[#f5f0e8] rounded-lg overflow-hidden mb-4">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={400}
                height={400}
                className="object-cover w-full h-full"
              />
            </div>
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
            <p className="font-medium mb-4">${product.price.toFixed(2)}</p>

            {product.id === 1 ? (
              <Button className="mb-4">View options</Button>
            ) : product.id === 2 ? (
              <Button className="mb-4 bg-lime-400 hover:bg-lime-500 text-black">Add to cart</Button>
            ) : (
              <Button className="mb-4">View options</Button>
            )}

            <div className="mb-4">
              <h3 className="text-xs uppercase text-muted-foreground mb-1">RATING</h3>
              <div className="flex items-center">
                {product.rating > 0 ? (
                  <>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-black" : "fill-muted stroke-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm">{product.rating}</span>
                  </>
                ) : (
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-muted stroke-muted-foreground" />
                    ))}
                    <span className="ml-2 text-sm">0</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase text-muted-foreground mb-1">DESCRIPTION</h3>
              <p className="text-sm">{product.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


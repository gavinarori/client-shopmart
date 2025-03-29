"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, ChevronUp, X, ArrowRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProductListing() {
  const [expandedFilters, setExpandedFilters] = useState({
    brand: true,
    color: true,
    size: true,
    price: false,
    shipping: false,
  })

  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [compareItems, setCompareItems] = useState<number[]>([])

  const toggleFilter = (filter: keyof typeof expandedFilters) => {
    setExpandedFilters({
      ...expandedFilters,
      [filter]: !expandedFilters[filter],
    })
  }

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
    } else {
      setSelectedBrands([...selectedBrands, brand])
    }
  }

  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color))
    } else {
      setSelectedColors([...selectedColors, color])
    }
  }

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size))
    } else {
      setSelectedSizes([...selectedSizes, size])
    }
  }

  const toggleCompare = (id: number) => {
    if (compareItems.includes(id)) {
      setCompareItems(compareItems.filter((item) => item !== id))
    } else {
      if (compareItems.length < 4) {
        // Limit to 4 items for comparison
        setCompareItems([...compareItems, id])
      }
    }
  }

  const removeFromCompare = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setCompareItems(compareItems.filter((item) => item !== id))
  }

  // Sample product data
  const products = [
    {
      id: 1,
      name: "Essential T-Shirt Bundle",
      brand: "Urban Basics",
      price: 89.99,
      originalPrice: null,
      image: "/assests/shoes_1.png",
    },
    {
      id: 2,
      name: "Classic Denim Jacket",
      brand: "Vintage Apparel",
      price: 129.0,
      originalPrice: null,
      image: "/assests/shoes_2.png",
    },
    {
      id: 3,
      name: "Comfort Fit Hoodie",
      brand: "Urban Basics",
      price: 65.0,
      originalPrice: null,
      image: "/assests/shoes_3.png",
    },
    {
      id: 4,
      name: "Slim Fit Chinos",
      brand: "Modern Threads",
      price: 79.5,
      originalPrice: 95.0,
      image: "/assests/shoes_4.png",
    },
    {
      id: 5,
      name: "Oversized Sweater",
      brand: "Vintage Apparel",
      price: 110.0,
      originalPrice: null,
      image: "/assests/shoes_5.png",
    },
    {
      id: 6,
      name: "Linen Button-Up Shirt",
      brand: "Modern Threads",
      price: 59.99,
      originalPrice: 75.0,
      image: "/assests/shoes_6.png",
    },
    {
      id: 7,
      name: "Relaxed Fit Jeans",
      brand: "Vintage Apparel",
      price: 89.0,
      originalPrice: null,
      image: "/assests/shoes_7.png",
    },
    {
      id: 8,
      name: "Cotton Blend Cardigan",
      brand: "Urban Basics",
      price: 69.99,
      originalPrice: null,
      image: "/assests/shoes_8.png",
    },
  ]

  // Get the selected products for comparison
  const selectedProducts = products.filter((product) => compareItems.includes(product.id))

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Shop All <span className="text-muted-foreground">18</span>
        </h1>
        <Select defaultValue="featured">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured Items</SelectItem>
            <SelectItem value="newest">Newest Arrivals</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0">
          {/* Brand Filter */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={() => toggleFilter("brand")}
            >
              <h3 className="font-medium text-sm tracking-wider text-muted-foreground">BRAND</h3>
              {expandedFilters.brand ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expandedFilters.brand && (
              <div className="flex flex-wrap gap-2">
                {["Urban Basics", "Vintage Apparel", "Modern Threads"].map((brand) => (
                  <Button
                    key={brand}
                    variant={selectedBrands.includes(brand) ? "default" : "outline"}
                    className="rounded-full text-sm py-1 h-auto"
                    onClick={() => toggleBrand(brand)}
                  >
                    {brand}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Color Filter */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={() => toggleFilter("color")}
            >
              <h3 className="font-medium text-sm tracking-wider text-muted-foreground">COLOR</h3>
              {expandedFilters.color ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expandedFilters.color && (
              <div className="flex flex-wrap gap-2">
                {["Black", "White", "Denim", "Beige", "Navy", "Olive", "Burgundy", "Gray", "Khaki"].map((color) => (
                  <Button
                    key={color}
                    variant={selectedColors.includes(color) ? "default" : "outline"}
                    className="rounded-full text-sm py-1 h-auto"
                    onClick={() => toggleColor(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Size Filter */}
          <div className="mb-6">
            <div className="flex justify-between items-center cursor-pointer mb-2" onClick={() => toggleFilter("size")}>
              <h3 className="font-medium text-sm tracking-wider text-muted-foreground">SIZE</h3>
              {expandedFilters.size ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expandedFilters.size && (
              <div className="flex flex-wrap gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <Button
                    key={size}
                    variant={selectedSizes.includes(size) ? "default" : "outline"}
                    className="rounded-full text-sm py-1 h-auto"
                    onClick={() => toggleSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Price Filter */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={() => toggleFilter("price")}
            >
              <h3 className="font-medium text-sm tracking-wider text-muted-foreground">PRICE</h3>
              {expandedFilters.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expandedFilters.price && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="price-under-50" />
                  <label htmlFor="price-under-50" className="text-sm">
                    Under $50
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="price-50-100" />
                  <label htmlFor="price-50-100" className="text-sm">
                    $50 - $100
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="price-100-150" />
                  <label htmlFor="price-100-150" className="text-sm">
                    $100 - $150
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="price-over-150" />
                  <label htmlFor="price-over-150" className="text-sm">
                    Over $150
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Free Shipping Filter */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={() => toggleFilter("shipping")}
            >
              <h3 className="font-medium text-sm tracking-wider text-muted-foreground">FREE SHIPPING</h3>
              {expandedFilters.shipping ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expandedFilters.shipping && (
              <div className="flex items-center space-x-2">
                <Checkbox id="free-shipping" />
                <label htmlFor="free-shipping" className="text-sm">
                  Free Shipping Only
                </label>
              </div>
            )}
          </div>

          {/* Reset Filters Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSelectedBrands([])
              setSelectedColors([])
              setSelectedSizes([])
            }}
          >
            Reset filters
          </Button>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group">
                <Link href={`/product/${product.id}`} className="block mb-3">
                  <div className="aspect-square  rounded-lg overflow-hidden relative">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </Link>
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                  <div className="flex items-center gap-2 mt-1">
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
                  <div className="flex items-center mt-2">
                    <Checkbox
                      id={`compare-${product.id}`}
                      checked={compareItems.includes(product.id)}
                      onCheckedChange={() => toggleCompare(product.id)}
                    />
                    <label htmlFor={`compare-${product.id}`} className="ml-2 text-sm">
                      Compare
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Bar */}
      {compareItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {selectedProducts.map((product) => (
                <div
                  key={`compare-bar-${product.id}`}
                  className="flex items-center gap-2 rounded-lg p-2 shrink-0"
                >
                  <div className="relative w-12 h-12 bg-[#f5f0e8] rounded overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div className="max-w-[120px]">
                    <p className="text-xs font-medium truncate">{product.name}</p>
                  </div>
                  <button
                    onClick={(e) => removeFromCompare(product.id, e)}
                    className="p-1 hover:bg-gray-200 rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <Link href="/compare">
              <Button className="">
                Compare <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}


"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ChevronDown, ChevronUp, X, ArrowRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDispatch, useSelector } from "react-redux"
import { price_range_product, query_products } from "@/store/reducers/homeReducer"

export default function ProductListing() {
  const { products, totalProduct, priceRange, parPage, loading } = useSelector((state: any) => state.home)
  const searchParams = useSearchParams()
  const category = searchParams.get("category")

  const [pageNumber, setPageNumber] = useState(1)
  const [styles, setStyles] = useState("grid")
  const [filter, setFilter] = useState(true)
  const [state, setState] = useState({ values: [0, 1000] }) // Default values before priceRange is loaded
  const [rating, setRatingQ] = useState("")
  const [sortPrice, setSortPrice] = useState("")

  const dispatch = useDispatch<any>()
  const [expandedFilters, setExpandedFilters] = useState({
    brand: true,
    color: true,
    size: true,
    price: false,
    shipping: false,
  })

  useEffect(() => {
    dispatch(price_range_product())
  }, [dispatch])

  useEffect(() => {
    if (priceRange && priceRange.high !== undefined && priceRange.low !== undefined) {
      if (priceRange.high <= priceRange.low) {
        setState({
          values: [priceRange.low, priceRange.low + 1],
        })
      } else {
        setState({
          values: [priceRange.low, priceRange.high],
        })
      }
    }
  }, [priceRange])

  useEffect(() => {
    dispatch(
      query_products({
        low: state.values[0] || "",
        high: state.values[1] || "",
        category,
        rating,
        sortPrice,
        pageNumber,
      } as any),
    )
  }, [state.values[0], state.values[1], category, rating, pageNumber, sortPrice, dispatch])

  const resetRating = () => {
    setRatingQ("")
    dispatch(
      query_products({
        low: state.values[0],
        high: state.values[1],
        category,
        rating: "",
        sortPrice,
        pageNumber,
      } as any),
    )
  }

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

  // Get the selected products for comparison
  const selectedProducts = products.filter((product: any) => compareItems.includes(product.id))

  const handleSortChange = (value: string) => {
    if (value === "price-low") {
      setSortPrice("low")
    } else if (value === "price-high") {
      setSortPrice("high")
    } else {
      setSortPrice("")
    }
  }

  const resetFilters = () => {
    setSelectedBrands([])
    setSelectedColors([])
    setSelectedSizes([])
    setState({ values: [priceRange.low, priceRange.high] })
    setRatingQ("")
    setSortPrice("")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {category ? (
            <>
              {category} <span className="text-muted-foreground">({totalProduct || 0})</span>
            </>
          ) : (
            <>
              Shop All <span className="text-muted-foreground">({totalProduct || 0})</span>
            </>
          )}
        </h1>
        <Select defaultValue="featured" onValueChange={handleSortChange}>
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
                  <Checkbox
                    id="price-under-50"
                    checked={state.values[0] === 0 && state.values[1] === 50}
                    onCheckedChange={() => setState({ values: [0, 50] })}
                  />
                  <label htmlFor="price-under-50" className="text-sm">
                    Under $50
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="price-50-100"
                    checked={state.values[0] === 50 && state.values[1] === 100}
                    onCheckedChange={() => setState({ values: [50, 100] })}
                  />
                  <label htmlFor="price-50-100" className="text-sm">
                    $50 - $100
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="price-100-150"
                    checked={state.values[0] === 100 && state.values[1] === 150}
                    onCheckedChange={() => setState({ values: [100, 150] })}
                  />
                  <label htmlFor="price-100-150" className="text-sm">
                    $100 - $150
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="price-over-150"
                    checked={state.values[0] === 150 && state.values[1] === (priceRange?.high || 1000)}
                    onCheckedChange={() => setState({ values: [150, priceRange?.high || 1000] })}
                  />
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
          <Button variant="outline" className="w-full" onClick={resetFilters}>
            Reset filters
          </Button>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="aspect-square bg-muted rounded-lg animate-pulse"></div>
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-2/3 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <div key={product.id} className="group">
                  <Link href={`/product/${product.id}`} className="block mb-3">
                    <div className="aspect-square rounded-lg overflow-hidden relative">
                      <Image
                        src={product.image || "/placeholder.svg?height=300&width=300"}
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
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-lg text-muted-foreground mb-4">No products found</p>
              <Button onClick={resetFilters}>Clear filters</Button>
            </div>
          )}

          {/* Pagination */}
          {totalProduct > parPage && (
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                {[...Array(Math.ceil(totalProduct / parPage))].map((_, i) => (
                  <Button
                    key={i}
                    variant={pageNumber === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPageNumber(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Bar */}
      {compareItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {selectedProducts.map((product: any) => (
                <div key={`compare-bar-${product.id}`} className="flex items-center gap-2 rounded-lg p-2 shrink-0">
                  <div className="relative w-12 h-12 bg-[#f5f0e8] rounded overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg?height=48&width=48"}
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

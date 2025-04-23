"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ChevronDown, ChevronUp, Search, X, ArrowRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useDispatch, useSelector } from "react-redux"
import { price_range_product, query_products } from "@/store/reducers/homeReducer"

export default function ProductListing() {
  const { products, totalProduct, priceRange, parPage, loading } = useSelector((state: any) => state.home)
  const searchParams = useSearchParams()
  const category = searchParams.get("category")

  const [pageNumber, setPageNumber] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortPrice, setSortPrice] = useState("")
  const [compareItems, setCompareItems] = useState<string[]>([])
  const [state, setState] = useState({ values: [0, 1000] })
  const [rating, setRatingQ] = useState("")

  // State for filter UI
  const [expandedFilters, setExpandedFilters] = useState({
    brand: true,
    category: true,
    price: true,
    rating: false,
  })

  const dispatch = useDispatch<any>()

  // Extract unique brands, categories from products for dynamic filtering
  const uniqueBrands = useMemo(() => {
    if (!products || !Array.isArray(products)) return []
    const brands = [...new Set(products.map((product: any) => product.brand).filter(Boolean))]
    return brands.sort()
  }, [products])

  const uniqueCategories = useMemo(() => {
    if (!products || !Array.isArray(products)) return []
    const categories = [...new Set(products.map((product: any) => product.category).filter(Boolean))]
    return categories.sort()
  }, [products])

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return []

    let result = [...products]

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product: any) =>
          product.name?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query),
      )
    }

    // Apply brand filters
    if (selectedBrands.length > 0) {
      result = result.filter((product: any) => selectedBrands.includes(product.brand))
    }

    // Apply category filters
    if (selectedCategories.length > 0) {
      result = result.filter((product: any) => selectedCategories.includes(product.category))
    }

    return result
  }, [products, searchQuery, selectedBrands, selectedCategories])

  // Get selected products for comparison
  const selectedProductsForCompare = useMemo(() => {
    if (!products || !Array.isArray(products)) return []
    return products.filter((product: any) => compareItems.includes(product._id))
  }, [products, compareItems])

  // Fetch price range on mount
  useEffect(() => {
    dispatch(price_range_product())
  }, [dispatch])

  // Update state when price range is fetched
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

  // Fetch products when filters or pagination change
  useEffect(() => {
    dispatch(
      query_products({
        low: state.values[0] || "",
        high: state.values[1] || "",
        category,
        rating,
        sortPrice,
        pageNumber,
        searchQuery,
        brands: selectedBrands.length > 0 ? selectedBrands.join(",") : "",
        categories: selectedCategories.length > 0 ? selectedCategories.join(",") : "",
      } as any),
    )
  }, [
    state.values[0],
    state.values[1],
    category,
    rating,
    pageNumber,
    sortPrice,
    dispatch,
    searchQuery,
    selectedBrands,
    selectedCategories,
  ])

  // Calculate pagination details
  const totalPages = parPage ? Math.ceil(totalProduct / parPage) : 0

  // Toggle filter sections
  const toggleFilter = (filter: keyof typeof expandedFilters) => {
    setExpandedFilters({
      ...expandedFilters,
      [filter]: !expandedFilters[filter],
    })
  }

  // Toggle brand selection
  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  // Toggle compare item
  const toggleCompare = (id: string) => {
    setCompareItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : prev.length < 4 ? [...prev, id] : prev,
    )
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedBrands([])
    setSelectedCategories([])
    setRatingQ("")
    setSortPrice("")
    if (priceRange) {
      setState({ values: [priceRange.low, priceRange.high] })
    }
    setPageNumber(1)
  }

  // Handle sort change
  const handleSortChange = (value: string) => {
    if (value === "price-low") {
      setSortPrice("low")
    } else if (value === "price-high") {
      setSortPrice("high")
    } else {
      setSortPrice("")
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
      {/* Header with search and sort */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
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

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPageNumber(1) // Reset to first page on search
              }}
              className="pl-9"
            />
          </div>

          <Select value={sortPrice ? `price-${sortPrice}` : "featured"} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filters */}
      {(selectedBrands.length > 0 || selectedCategories.length > 0 || searchQuery) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {searchQuery}
              <button onClick={() => setSearchQuery("")} className="ml-1">
                <X size={14} />
              </button>
            </Badge>
          )}

          {selectedBrands.map((brand) => (
            <Badge key={brand} variant="secondary" className="flex items-center gap-1">
              {brand}
              <button onClick={() => toggleBrand(brand)} className="ml-1">
                <X size={14} />
              </button>
            </Badge>
          ))}

          {selectedCategories.map((category) => (
            <Badge key={category} variant="secondary" className="flex items-center gap-1">
              {category}
              <button onClick={() => toggleCategory(category)} className="ml-1">
                <X size={14} />
              </button>
            </Badge>
          ))}

          {(selectedBrands.length > 0 || selectedCategories.length > 0 || searchQuery) && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Clear all
            </Button>
          )}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0">
          {/* Brand Filter - Dynamically generated from products */}
          {uniqueBrands.length > 0 && (
            <div className="mb-6">
              <div
                className="flex justify-between items-center cursor-pointer mb-2"
                onClick={() => toggleFilter("brand")}
              >
                <h3 className="font-medium text-sm tracking-wider text-muted-foreground">BRAND</h3>
                {expandedFilters.brand ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {expandedFilters.brand && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {uniqueBrands.map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={() => toggleBrand(brand)}
                      />
                      <label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Category Filter - Dynamically generated from products */}
          {uniqueCategories.length > 0 && (
            <div className="mb-6">
              <div
                className="flex justify-between items-center cursor-pointer mb-2"
                onClick={() => toggleFilter("category")}
              >
                <h3 className="font-medium text-sm tracking-wider text-muted-foreground">CATEGORY</h3>
                {expandedFilters.category ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {expandedFilters.category && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {uniqueCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Price Filter */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={() => toggleFilter("price")}
            >
              <h3 className="font-medium text-sm tracking-wider text-muted-foreground">PRICE</h3>
              {expandedFilters.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expandedFilters.price && priceRange && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="price-under-50"
                    checked={state.values[0] === priceRange.low && state.values[1] === 50}
                    onCheckedChange={() => setState({ values: [priceRange.low, 50] })}
                  />
                  <label htmlFor="price-under-50" className="text-sm cursor-pointer">
                    Under $50
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="price-50-100"
                    checked={state.values[0] === 50 && state.values[1] === 100}
                    onCheckedChange={() => setState({ values: [50, 100] })}
                  />
                  <label htmlFor="price-50-100" className="text-sm cursor-pointer">
                    $50 - $100
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="price-100-150"
                    checked={state.values[0] === 100 && state.values[1] === 150}
                    onCheckedChange={() => setState({ values: [100, 150] })}
                  />
                  <label htmlFor="price-100-150" className="text-sm cursor-pointer">
                    $100 - $150
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="price-over-150"
                    checked={state.values[0] === 150 && state.values[1] === priceRange.high}
                    onCheckedChange={() => setState({ values: [150, priceRange.high] })}
                  />
                  <label htmlFor="price-over-150" className="text-sm cursor-pointer">
                    Over $150
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Rating Filter */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={() => toggleFilter("rating")}
            >
              <h3 className="font-medium text-sm tracking-wider text-muted-foreground">RATING</h3>
              {expandedFilters.rating ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expandedFilters.rating && (
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center space-x-2">
                    <Checkbox
                      id={`rating-${star}`}
                      checked={rating === star.toString()}
                      onCheckedChange={() => setRatingQ(rating === star.toString() ? "" : star.toString())}
                    />
                    <label htmlFor={`rating-${star}`} className="text-sm cursor-pointer flex items-center">
                      {Array(star).fill("★").join("")}
                      {Array(5 - star)
                        .fill("☆")
                        .join("")}
                    </label>
                  </div>
                ))}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-3 border rounded-lg p-4">
                  <div className="aspect-square bg-muted rounded-lg animate-pulse"></div>
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-2/3 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <div key={product._id} className="group border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <Link href={`/product/${product.slug}`} className="block mb-3">
                    <div className="aspect-square rounded-lg overflow-hidden relative ">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}
                      {product.discount > 0 && (
                        <Badge className="absolute top-2 right-2 bg-red-500">-{product.discount}%</Badge>
                      )}
                    </div>
                  </Link>
                  <div>
                    <h3 className="font-medium truncate">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {product.discount > 0 ? (
                        <>
                          <span className="font-medium">
                            ${(product.price - (product.price * product.discount) / 100).toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="font-medium">${product.price.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <Checkbox
                          id={`compare-${product._id}`}
                          checked={compareItems.includes(product._id)}
                          onCheckedChange={() => toggleCompare(product._id)}
                        />
                        <label htmlFor={`compare-${product._id}`} className="ml-2 text-sm">
                          Compare
                        </label>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Stock: {product.stock}
                      </Badge>
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
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                  disabled={pageNumber === 1}
                >
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show first page, last page, current page, and pages around current page
                    return page === 1 || page === totalPages || (page >= pageNumber - 1 && page <= pageNumber + 1)
                  })
                  .map((page, index, array) => {
                    // Add ellipsis
                    const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1
                    const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1

                    return (
                      <div key={page} className="flex items-center">
                        {showEllipsisBefore && <span className="px-2">...</span>}

                        <Button
                          variant={pageNumber === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPageNumber(page)}
                        >
                          {page}
                        </Button>

                        {showEllipsisAfter && <span className="px-2">...</span>}
                      </div>
                    )
                  })}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
                  disabled={pageNumber === totalPages}
                >
                  Next
                </Button>
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
              {selectedProductsForCompare.map((product: any) => (
                <div
                  key={`compare-bar-${product._id}`}
                  className="flex items-center gap-2 rounded-lg p-2 shrink-0 border"
                >
                  <div className="relative w-12 h-12 rounded overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0] }
                        alt={product.name}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="max-w-[120px]">
                    <p className="text-xs font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">${product.price}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      toggleCompare(product._id)
                    }}
                    className="p-1  rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <Link href="/compare">
              <Button>
                Compare <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

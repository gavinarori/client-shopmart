"use client"

import { useEffect, useState } from "react"
import { price_range_product, query_products, get_category } from "@/store/reducers/homeReducer"
import { useDispatch, useSelector } from "react-redux"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Grid3x3, List, SlidersHorizontal, X } from "lucide-react"
import ProductCard from "@/components/product-card"
import ProductRow from "@/components/product-row"
import { Badge } from "@/components/ui/badge"

export default function Shop() {
  const { products, totalProduct, latest_product,  priceRange, parPage } = useSelector(
    (state: any) => state.home,
  )
  const categories = useSelector((state: any) => state.home.categories)
  const dispatch = useDispatch<any>()
  const [pageNumber, setPageNumber] = useState(1)
  const [styles, setStyles] = useState("grid")
  const [filter, setFilter] = useState(false)
  const [category, setCategory] = useState("")
  const [state, setState] = useState({ values: [0, 1000] })
  const [rating, setRatingQ] = useState<any>("")
  const [sortPrice, setSortPrice] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  useEffect(() => {
    dispatch(get_category())
    dispatch(price_range_product())
  }, [])

  useEffect(() => {
    if (priceRange.high <= priceRange.low) {
      setState({
        values: [priceRange.low, priceRange.low + 1],
      })
    } else {
      setState({
        values: [priceRange.low, priceRange.high],
      })
    }
  }, [priceRange])

  const queryCategory = (e: any, value: any) => {
    if (e.target.checked) {
      setCategory(value)
      if (!activeFilters.includes(`Category: ${value}`)) {
        setActiveFilters([...activeFilters, `Category: ${value}`])
      }
    } else {
      setCategory("")
      setActiveFilters(activeFilters.filter((filter) => filter !== `Category: ${value}`))
    }
  }

  const handlePriceChange = (values: number[]) => {
    setState({ values })

    // Update active filters for price
    const priceFilterIndex = activeFilters.findIndex((filter) => filter.startsWith("Price:"))
    const newActiveFilters = [...activeFilters]
    const priceFilter = `Price: $${values[0]} - $${values[1]}`

    if (priceFilterIndex >= 0) {
      newActiveFilters[priceFilterIndex] = priceFilter
    } else {
      newActiveFilters.push(priceFilter)
    }

    setActiveFilters(newActiveFilters)
  }

  const handleRatingChange = (value: string) => {
    setRatingQ(value)

    // Update active filters for rating
    const ratingFilterIndex = activeFilters.findIndex((filter) => filter.startsWith("Rating:"))
    const newActiveFilters = [...activeFilters]
    const ratingFilter = `Rating: ${value} stars`

    if (ratingFilterIndex >= 0) {
      if (value) {
        newActiveFilters[ratingFilterIndex] = ratingFilter
      } else {
        newActiveFilters.splice(ratingFilterIndex, 1)
      }
    } else if (value) {
      newActiveFilters.push(ratingFilter)
    }

    setActiveFilters(newActiveFilters)
  }

  const handleSortChange = (value: string) => {
    setSortPrice(value)

    // Update active filters for sorting
    const sortFilterIndex = activeFilters.findIndex((filter) => filter.startsWith("Sort:"))
    const newActiveFilters = [...activeFilters]
    let sortFilter = ""

    switch (value) {
      case "low-to-high":
        sortFilter = "Sort: Price Low to High"
        break
      case "high-to-low":
        sortFilter = "Sort: Price High to Low"
        break
      default:
        sortFilter = ""
    }

    if (sortFilterIndex >= 0) {
      if (sortFilter) {
        newActiveFilters[sortFilterIndex] = sortFilter
      } else {
        newActiveFilters.splice(sortFilterIndex, 1)
      }
    } else if (sortFilter) {
      newActiveFilters.push(sortFilter)
    }

    setActiveFilters(newActiveFilters)
  }

  const removeFilter = (filter: string) => {
    if (filter.startsWith("Category:")) {
      setCategory("")
    } else if (filter.startsWith("Rating:")) {
      setRatingQ("")
    } else if (filter.startsWith("Sort:")) {
      setSortPrice("")
    } else if (filter.startsWith("Price:")) {
      setState({ values: [priceRange.low, priceRange.high] })
    }

    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  const clearAllFilters = () => {
    setCategory("")
    setRatingQ("")
    setSortPrice("")
    setState({ values: [priceRange.low, priceRange.high] })
    setActiveFilters([])
  }

  useEffect(() => {
    dispatch(
      query_products({
        low: state.values[0],
        high: state.values[1],
        category,
        rating,
        sortPrice,
        pageNumber,
      } as any),
    )
  }, [state.values[0], state.values[1], category, rating, pageNumber, sortPrice])

  // Group products by category for the "counter" display
  const productsByCategory = products.reduce((acc: any, product: any) => {
    if (!acc[product.category]) {
      acc[product.category] = []
    }
    acc[product.category].push(product)
    return acc
  }, {})

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with title and filter toggle for mobile */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Window Shopping</h1>
          <p className="text-muted-foreground">Browse our collection as if you were walking by our store</p>
        </div>

        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center gap-2 md:hidden" onClick={() => setFilter(!filter)}>
            <SlidersHorizontal size={16} />
            Filters
          </Button>

          <div className="flex items-center border rounded-md">
            <Button
              variant={styles === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setStyles("grid")}
              className="rounded-none rounded-l-md"
            >
              <Grid3x3 size={18} />
            </Button>
            <Button
              variant={styles === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setStyles("list")}
              className="rounded-none rounded-r-md"
            >
              <List size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium">Active Filters:</span>
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                {filter}
                <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => removeFilter(filter)}>
                  <X size={12} />
                </Button>
              </Badge>
            ))}
            <Button variant="ghost" size="sm" className="text-xs" onClick={clearAllFilters}>
              Clear All
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters - hidden on mobile unless toggled */}
        <div className={`md:w-64 shrink-0 ${filter ? "block" : "hidden md:block"}`}>
          <div className="sticky top-4 space-y-6 bg-background p-4 rounded-lg border">
            <div className="flex items-center justify-between md:hidden">
              <h3 className="font-medium">Filters</h3>
              <Button variant="ghost" size="icon" onClick={() => setFilter(false)}>
                <X size={18} />
              </Button>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
              <h3 className="font-medium">Price Range</h3>
              <div className="px-2">
                <Slider
                  defaultValue={[state.values[0], state.values[1]]}
                  min={priceRange.low || 0}
                  max={priceRange.high || 1000}
                  step={1}
                  value={[state.values[0], state.values[1]]}
                  onValueChange={handlePriceChange}
                  className="my-6"
                />
                <div className="flex justify-between">
                  <span>${state.values[0]}</span>
                  <span>${state.values[1]}</span>
                </div>
              </div>
            </div>
            {categories?.map((category: any) => (
  <div key={category._id} className="flex items-center space-x-2">
    <Checkbox
      id={`category-${category._id}`}
      checked={category === category.name}
      onCheckedChange={(checked) => queryCategory({ target: { checked } }, category.name)}
    />
    <Label className="font-normal">
      {category.name}
    </Label>
  </div>
))}




            {/* Rating */}
            <div className="space-y-4">
              <h3 className="font-medium">Rating</h3>
              <Select value={rating} onValueChange={handleRatingChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any rating</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars & Up</SelectItem>
                  <SelectItem value="3">3 Stars & Up</SelectItem>
                  <SelectItem value="2">2 Stars & Up</SelectItem>
                  <SelectItem value="1">1 Star & Up</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="space-y-4">
              <h3 className="font-medium">Sort By</h3>
              <Select value={sortPrice} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="low-to-high">Price: Low to High</SelectItem>
                  <SelectItem value="high-to-low">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="w-full mt-4" onClick={clearAllFilters}>
              Clear All Filters
            </Button>
          </div>
        </div>

        {/* Products display */}
        <div className="flex-1 space-y-12">
          {Object.keys(productsByCategory).length > 0 ? (
            Object.entries(productsByCategory).map(([categoryName, categoryProducts]: [string, any]) => (
              <div key={categoryName} className="space-y-4">
                <div className="relative">
                  <h2 className="text-2xl font-semibold">{categoryName}</h2>
                  <div className="absolute h-1 w-20 bg-primary bottom-0 left-0"></div>
                </div>

                <div
                  className={`
                ${
                  styles === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              `}
                >
                  {categoryProducts.map((product: any) =>
                    styles === "grid" ? (
                      <ProductCard key={product._id} product={product} />
                    ) : (
                      <ProductRow key={product._id} product={product} />
                    ),
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium">No products found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
              <Button variant="outline" className="mt-4" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

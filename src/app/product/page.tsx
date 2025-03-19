"use client"

import { useState } from "react"
import { Filter, ShoppingCart, SlidersHorizontal } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample product data
const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 199.99,
    rating: 4.8,
    category: "Audio",
    brand: "SoundMaster",
    color: "Black",
    features: ["Noise Cancellation", "40h Battery", "Bluetooth 5.2"],
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    name: 'Ultra HD Smart TV 55"',
    price: 699.99,
    rating: 4.6,
    category: "TV & Home Cinema",
    brand: "VisionPlus",
    color: "Black",
    features: ["4K Resolution", "Smart Assistant", "HDR10+"],
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "Professional DSLR Camera",
    price: 1299.99,
    rating: 4.9,
    category: "Cameras",
    brand: "PhotoPro",
    color: "Black",
    features: ["24MP Sensor", "4K Video", "Weather Sealed"],
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 4,
    name: "Ergonomic Office Chair",
    price: 249.99,
    rating: 4.5,
    category: "Furniture",
    brand: "ComfortPlus",
    color: "Gray",
    features: ["Lumbar Support", "Adjustable Height", "Breathable Mesh"],
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 5,
    name: "Smart Fitness Watch",
    price: 149.99,
    rating: 4.7,
    category: "Wearables",
    brand: "FitTech",
    color: "Blue",
    features: ["Heart Rate Monitor", "GPS", "5 Day Battery"],
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 6,
    name: "Portable Bluetooth Speaker",
    price: 79.99,
    rating: 4.4,
    category: "Audio",
    brand: "SoundMaster",
    color: "Red",
    features: ["Waterproof", "12h Battery", "360° Sound"],
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 7,
    name: 'Gaming Laptop 15.6"',
    price: 1499.99,
    rating: 4.8,
    category: "Computers",
    brand: "GameForce",
    color: "Black",
    features: ["RTX 4070", "16GB RAM", "1TB SSD"],
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 8,
    name: "Wireless Mechanical Keyboard",
    price: 129.99,
    rating: 4.6,
    category: "Computer Accessories",
    brand: "TypeMaster",
    color: "White",
    features: ["RGB Lighting", "Hot-swappable", "Multi-device"],
    image: "/placeholder.svg?height=200&width=200",
  },
]

// Get unique categories and brands for filters
const categories = [...new Set(products.map((product) => product.category))]
const brands = [...new Set(products.map((product) => product.brand))]
const colors = [...new Set(products.map((product) => product.color))]

export default function ProductComparison() {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [priceRange, setPriceRange] = useState([0, 1500])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [sortOption, setSortOption] = useState("featured")

  // Handle product selection for comparison
  const toggleProductSelection = (productId: number) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    } else {
      // Limit to 4 products for comparison
      if (selectedProducts.length < 4) {
        setSelectedProducts([...selectedProducts, productId])
      }
    }
  }

  // Apply filters
  const applyFilters = () => {
    let result = products

    // Filter by price
    result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter((product) => selectedCategories.includes(product.category))
    }

    // Filter by brands
    if (selectedBrands.length > 0) {
      result = result.filter((product) => selectedBrands.includes(product.brand))
    }

    // Filter by colors
    if (selectedColors.length > 0) {
      result = result.filter((product) => selectedColors.includes(product.color))
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })

    setFilteredProducts(result)
  }

  // Reset filters
  const resetFilters = () => {
    setPriceRange([0, 1500])
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedColors([])
    setFilteredProducts(products)
  }

  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  // Toggle brand selection
  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
    } else {
      setSelectedBrands([...selectedBrands, brand])
    }
  }

  // Toggle color selection
  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color))
    } else {
      setSelectedColors([...selectedColors, color])
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Shop Products</h1>
          <p className="text-muted-foreground">Compare and find the perfect product for you</p>
        </div>
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filter Products</SheetTitle>
                <SheetDescription>Narrow down your product search</SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <div className="mb-6">
                  <h3 className="mb-2 font-medium">Price Range</h3>
                  <div className="mb-2 flex justify-between">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <Slider
                    defaultValue={priceRange}
                    max={1500}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                </div>

                <div className="mb-6">
                  <h3 className="mb-2 font-medium">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <Label htmlFor={`category-${category}`}>{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="mb-2 font-medium">Brands</h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
                        />
                        <Label htmlFor={`brand-${brand}`}>{brand}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="mb-2 font-medium">Colors</h3>
                  <div className="space-y-2">
                    {colors.map((color) => (
                      <div key={color} className="flex items-center space-x-2">
                        <Checkbox
                          id={`color-${color}`}
                          checked={selectedColors.includes(color)}
                          onCheckedChange={() => toggleColor(color)}
                        />
                        <Label htmlFor={`color-${color}`}>{color}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline" onClick={resetFilters}>
                    Reset
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button onClick={applyFilters}>Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    setSortOption("featured")
                    applyFilters()
                  }}
                >
                  Featured
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortOption("price-low")
                    applyFilters()
                  }}
                >
                  Price: Low to High
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortOption("price-high")
                    applyFilters()
                  }}
                >
                  Price: High to Low
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortOption("rating")
                    applyFilters()
                  }}
                >
                  Highest Rated
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {selectedProducts.length > 0 && (
            <Drawer>
              <DrawerTrigger asChild>
                <Button className="gap-2">Compare ({selectedProducts.length})</Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[90vh]">
                <DrawerHeader>
                  <DrawerTitle>Product Comparison</DrawerTitle>
                  <DrawerDescription>Compare your selected products side by side</DrawerDescription>
                </DrawerHeader>
                <div className="overflow-x-auto p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Feature</TableHead>
                        {selectedProducts.map((id) => {
                          const product = products.find((p) => p.id === id)
                          return (
                            <TableHead key={id} className="min-w-[200px] text-center">
                              <div className="flex flex-col items-center gap-2">
                                <Image
                                  src={product?.image || ""}
                                  alt={product?.name || ""}
                                  width={100}
                                  height={100}
                                  className="rounded-md object-contain"
                                />
                                {product?.name}
                              </div>
                            </TableHead>
                          )
                        })}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Price</TableCell>
                        {selectedProducts.map((id) => {
                          const product = products.find((p) => p.id === id)
                          return (
                            <TableCell key={id} className="text-center">
                              ${product?.price}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Rating</TableCell>
                        {selectedProducts.map((id) => {
                          const product = products.find((p) => p.id === id)
                          return (
                            <TableCell key={id} className="text-center">
                              {product?.rating}/5
                            </TableCell>
                          )
                        })}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Category</TableCell>
                        {selectedProducts.map((id) => {
                          const product = products.find((p) => p.id === id)
                          return (
                            <TableCell key={id} className="text-center">
                              {product?.category}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Brand</TableCell>
                        {selectedProducts.map((id) => {
                          const product = products.find((p) => p.id === id)
                          return (
                            <TableCell key={id} className="text-center">
                              {product?.brand}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Color</TableCell>
                        {selectedProducts.map((id) => {
                          const product = products.find((p) => p.id === id)
                          return (
                            <TableCell key={id} className="text-center">
                              {product?.color}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Features</TableCell>
                        {selectedProducts.map((id) => {
                          const product = products.find((p) => p.id === id)
                          return (
                            <TableCell key={id} className="text-center">
                              <ul className="list-inside list-disc text-left">
                                {product?.features.map((feature, index) => (
                                  <li key={index}>{feature}</li>
                                ))}
                              </ul>
                            </TableCell>
                          )
                        })}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Actions</TableCell>
                        {selectedProducts.map((id) => {
                          return (
                            <TableCell key={id} className="text-center">
                              <Button size="sm" className="gap-2">
                                <ShoppingCart className="h-4 w-4" />
                                Add to Cart
                              </Button>
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}
        </div>
      </div>

      <Tabs defaultValue="grid" className="mb-8">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>
        <TabsContent value="grid">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="h-[200px] w-full object-cover"
                  />
                  <div className="absolute right-2 top-2">
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => toggleProductSelection(product.id)}
                      aria-label={`Select ${product.name} for comparison`}
                      className="h-5 w-5 rounded-sm border-2 border-white bg-white/20 backdrop-blur-sm"
                    />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="mb-2 text-sm text-muted-foreground">{product.category}</div>
                  <h3 className="mb-1 line-clamp-1 text-lg font-semibold">{product.name}</h3>
                  <div className="mb-2 flex items-center gap-1">
                    <span className="text-sm">⭐ {product.rating}/5</span>
                  </div>
                  <div className="mb-3 text-lg font-bold">${product.price}</div>
                  <div className="space-y-1">
                    {product.features.slice(0, 2).map((feature, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        • {feature}
                      </div>
                    ))}
                    {product.features.length > 2 && <div className="text-sm text-muted-foreground">• ...</div>}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="table">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => toggleProductSelection(product.id)}
                        aria-label={`Select ${product.name} for comparison`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={50}
                          height={50}
                          className="rounded object-cover"
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{product.color}</TableCell>
                    <TableCell>⭐ {product.rating}/5</TableCell>
                    <TableCell className="text-right font-medium">${product.price}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" className="gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Add
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {filteredProducts.length === 0 && (
        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
          <p className="text-lg font-medium">No products match your filters</p>
          <Button variant="link" onClick={resetFilters}>
            Reset all filters
          </Button>
        </div>
      )}
    </div>
  )
}


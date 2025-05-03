import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ProductProps {
  product: {
    _id: string
    name: string
    slug: string
    price: number
    discount: number
    images: string[]
    rating: number
    stock: number
    category: string
    description: string
    location: {
      city: string
      state: string
      country: string
    }
  }
}

export default function ProductRow({ product }: ProductProps) {
  const discountedPrice = product.price - (product.price * product.discount) / 100

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-48 h-48">
          {product.discount > 0 && (
            <Badge className="absolute top-2 right-2 z-20 bg-red-500">{product.discount}% OFF</Badge>
          )}

          <Link href={`/product/${product.slug}`}>
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 192px"
            />
          </Link>
        </div>

        <CardContent className="flex-1 p-4">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">({product.rating})</span>
              </div>

              <Link href={`/product/${product.slug}`} className="block">
                <h3 className="font-medium hover:text-primary transition-colors">{product.name}</h3>
              </Link>

              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>

              <div className="mt-2">
                <div className="flex items-center gap-2">
                  {product.discount > 0 ? (
                    <>
                      <span className="font-semibold">${discountedPrice.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground line-through">${product.price}</span>
                    </>
                  ) : (
                    <span className="font-semibold">${product.price}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>

                <Badge variant={product.stock > 0 ? "outline" : "destructive"} className="text-xs">
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </Badge>
              </div>

              <div className="text-xs text-muted-foreground mt-2">
                Location: {product.location.city}, {product.location.state}, {product.location.country}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button size="sm" className="w-full sm:w-auto">
                Add to Cart
              </Button>
              <Button size="sm" variant="outline" className="w-full sm:w-auto">
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

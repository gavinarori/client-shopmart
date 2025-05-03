import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
  }
}

export default function ProductCard({ product }: ProductProps) {
  const discountedPrice = product.price - (product.price * product.discount) / 100

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>

        {product.discount > 0 && (
          <Badge className="absolute top-2 right-2 z-20 bg-red-500">{product.discount}% OFF</Badge>
        )}

        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain transform group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </Link>
      </div>

      <CardContent className="p-4">
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
          <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
        </Link>

        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{product.description}</p>

        <div className="mt-2 flex items-center justify-between">
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

          <Badge variant={product.stock > 0 ? "outline" : "destructive"} className="text-xs">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

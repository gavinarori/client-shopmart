"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ExternalLink, X } from "lucide-react"

interface ProductPreviewProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    slug?: string
  }
  onShare?: () => void
  onDismiss?: () => void
  inMessage?: boolean
  isCompact?: boolean
}

export function ProductPreview({
  product,
  onShare,
  onDismiss,
  inMessage = false,
  isCompact = false,
}: ProductPreviewProps) {
  if (!product) return null

  // Compact version for the top of the chat
  if (isCompact) {
    return (
      <div className="bg-background border rounded-lg shadow-sm p-3 mb-4 flex items-center">
        <div className="flex-shrink-0 mr-3">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={60}
            height={60}
            className="rounded-md object-cover"
          />
        </div>
        <div className="flex-grow">
          <h3 className="font-medium text-sm truncate">{product.name}</h3>
          <p className="text-blue-600 font-medium text-sm">${product.price.toFixed(2)}</p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          {onShare && (
            <Button size="sm" onClick={onShare}>
              Share in Chat
            </Button>
          )}
          {onDismiss && (
            <Button variant="ghost" size="icon" onClick={onDismiss}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Full version for messages
  return (
    <Card className={`w-full overflow-hidden ${inMessage ? "max-w-[280px]" : ""}`}>
      <div className="relative aspect-video">
        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium truncate">{product.name}</h3>
        <p className="text-blue-600 font-medium">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between">
        <Link href={`/products/${product.slug || product.id}`}>
          <Button variant="outline" size="sm" className="w-full">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Product
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

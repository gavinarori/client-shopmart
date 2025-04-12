"use client"

import { Star, StarHalf } from "lucide-react"

interface RatingProps {
  value: number
  max?: number
  size?: "sm" | "md" | "lg"
  color?: string
}

export function Rating({ value, max = 5, size = "md", color = "text-yellow-400" }: RatingProps) {
  // Calculate full stars, half stars, and empty stars
  const fullStars = Math.floor(value)
  const hasHalfStar = value % 1 !== 0
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0)

  // Determine star size based on the size prop
  const starSize = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }[size]

  return (
    <div className="flex items-center">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className={`${starSize} fill-current ${color}`} />
      ))}

      {/* Half star */}
      {hasHalfStar && <StarHalf className={`${starSize} fill-current ${color}`} />}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className={`${starSize} text-gray-300`} />
      ))}
    </div>
  )
}

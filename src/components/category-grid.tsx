"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Skeleton } from "./skeleton"
import { get_category } from "@/store/reducers/homeReducer"

export default function CategoryGrid() {
  const dispatch = useDispatch<any>()
  const router = useRouter()
  const { categories } = useSelector((state: any) => state.home)
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(4)

  useEffect(() => {
    dispatch(get_category()).then(() => setLoading(false))
  }, [dispatch])

  const handleClick = (categoryName: string) => {
    router.push(`/products?category=${encodeURIComponent(categoryName)}`)
  }

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 4)
  }

  const visibleCategories = categories?.slice(0, visibleCount) || []
  const hasMoreCategories = categories?.length > visibleCount

  return (
    <div>
      <div className="py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Top Featured Categories</h1>
        <p className="max-w-2xl mx-auto">
          Check out our latest collection of premium products. Click on any item to see more details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 w-full py-4 ">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="relative aspect-[4/3]">
              <Skeleton className="absolute inset-0 rounded-none" />
              <div className="absolute bottom-6 left-6 z-10">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-7 w-48 mb-2" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>
          ))
        ) : visibleCategories.length > 0 ? (
          visibleCategories.map((category: any) => (
            <div
              key={category._id}
              className="relative aspect-[4/3] overflow-hidden group cursor-pointer"
              onClick={() => handleClick(category.name)}
            >
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <Overlay title={category.name} subtitle={`Shop the best in ${category.name}`} />
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-12">
            <p>No categories found. Please check your data.</p>
          </div>
        )}
      </div>

      {!loading && hasMoreCategories && (
        <div className="flex justify-center mt-8 mb-12">
          <Button onClick={handleShowMore} variant="outline" size="lg">
            Show More Categories
          </Button>
        </div>
      )}
    </div>
  )
}

type OverlayProps = {
  title: string
  subtitle: string
}

function Overlay({ title, subtitle }: OverlayProps) {
  return (
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
      <div className="absolute bottom-6 left-6 text-white">
        <p className="text-sm mb-1">{subtitle}</p>
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <Button variant="secondary" className="bg-white text-black hover:bg-white/90">
          Shop
        </Button>
      </div>
    </div>
  )
}

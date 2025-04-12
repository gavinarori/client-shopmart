"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"
import Image from "next/image"
import { get_product } from "@/store/reducers/homeReducer"
import { Gallery } from "@/components/product/gallery"
import { ProductDescription } from "@/components/product/product-description"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ProductClient({ slug }: { slug: string }) {
  const dispatch = useDispatch<any>()

  // Redux state
  const { product, relatedProducts, moreProducts } = useSelector((state: any) => state.home)

  // Local state
  const [loading, setLoading] = useState(true)

  // Fetch product data
  useEffect(() => {
    if (slug) {
      dispatch(get_product(slug))
        .then(() => setLoading(false))
        .catch((error: any) => {
          console.error("Error fetching product:", error)
          setLoading(false)
        })
    }
  }, [dispatch, slug])

  if (loading || !product) {
    return (
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12 lg:flex-row lg:gap-8">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden bg-gray-200 animate-pulse"></div>
          </div>
          <div className="basis-full lg:basis-2/6">
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-6 w-1/4 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Format product images for the Gallery component
  const formattedImages = product.images.map((img: string) => ({
    src: img,
    altText: product.name,
  }))

  return (
    <>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="py-5 mb-5 bg-background -mx-4 px-4">
          <div className="flex items-center text-sm ">
            <Link href="/" className="text-blue-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/" className="text-blue-600">
              {product.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="">{product.name}</span>
          </div>
        </div>

        <div className="">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12 lg:flex-row lg:gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-full w-full basis-full lg:basis-4/6">
              <Gallery images={formattedImages} />
            </div>
            <div className="basis-full lg:basis-2/6">
              <ProductDescription product={product} />
            </div>
          </div>
        </div>
        </div>
       

        {/* Reviews and Description Tabs */}
        <div className="w-full mx-auto pb-16 mt-6">
          <div className="flex flex-wrap">
            <div className="w-full lg:w-[72%]">
              <div className="pr-0 lg:pr-4">
                <Tabs defaultValue="reviews">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="description">Description</TabsTrigger>
                  </TabsList>
                  <TabsContent value="reviews" className="py-5">
                    <p>Reviews for {product.name}</p>
                    {/* Reviews component would go here */}
                  </TabsContent>
                  <TabsContent value="description" className="py-5 ">
                    <p>{product.description}</p>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* More Products from Shop */}
            <div className="w-full lg:w-[28%]">
              <div className="pl-0 lg:pl-4 mt-8 lg:mt-0">
                <div className="px-3 py-2  bg-background">
                  <h2>From {product.shopName}</h2>
                </div>
                <div className="flex flex-col gap-5 mt-3 border p-3">
                  {moreProducts &&
                    moreProducts.map((p: any, i: number) => (
                      <Link key={i} href={`/product/${p.slug}`} className="block">
                        <div className="border-b py-3 flex">
                          <div className="w-[35%]">
                            <div className="relative h-[100px] w-full">
                              <Image
                                src={p.image || p.images?.[0] || "/placeholder.svg"}
                                alt={p.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <div className="w-[60%] pl-3">
                            <h2 className="font-bold text-md">{p.name}</h2>
                            <p className="text-sm text-gray-600">{p.category}</p>
                            <p className="text-lg font-bold text-red-600">${p.price}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="py-8">
            <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((product: any) => (
                <Link key={product._id} href={`/product/${product.slug}`} className="block">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="aspect-square relative">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{product.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <p className="font-bold text-red-600">
                          $
                          {product.discount
                            ? (product.price - (product.price * product.discount) / 100).toFixed(2)
                            : product.price.toFixed(2)}
                        </p>
                        {product.discount > 0 && (
                          <span className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

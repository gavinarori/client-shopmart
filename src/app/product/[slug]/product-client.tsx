"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"
import Image from "next/image"
import { get_product, customer_review, messageClear, get_reviews } from "@/store/reducers/homeReducer"
import { Gallery } from "@/components/product/gallery"
import { ProductDescription } from "@/components/product/product-description"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

export function ProductClient({ slug }: { slug: string }) {
  const dispatch = useDispatch<any>()

  const { product, relatedProducts, moreProducts } = useSelector((state: any) => state.home)
  const { successMessage, reviews, totalReview, rating_review } = useSelector((state: any) => state.home)
  const { userInfo } = useSelector((state: any) => state.auth)
  const [rating, setRating] = useState("")
  const [review, setReview] = useState("")
  const [pageNumber, setPageNumber] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [loading, setLoading] = useState(true)

  const review_submit = (e: any) => {
    e.preventDefault()
    if (product && product._id) {
      const obj = {
        name: userInfo.name,
        review: review,
        rating: Number.parseInt(rating),
        productId: product._id,
        date: new Date().toISOString(),
      }
      dispatch(customer_review(obj))
    } else {
      toast.error("Cannot submit review: Product information is missing")
    }
  }

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
      dispatch(
        get_reviews({
          productId: product._id,
          pageNumber,
        }),
      )
      dispatch(get_product(product.slug))
      setRating("")
      setReview("")
      dispatch(messageClear())
    }
  }, [successMessage])

  useEffect(() => {
    if (product && product._id) {
      dispatch(
        get_reviews({
          productId: product._id,
          pageNumber,
        }),
      )
    }
  }, [pageNumber, product, dispatch])

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
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Customer Reviews ({totalReview})</h3>
                        <div className="flex items-center">
                          <span className="mr-2">Average Rating:</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 ${
                                  star <= Math.round(rating_review || 0)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Review Form for logged-in users */}
                      {userInfo ? (
                        <div className="border p-4 rounded-lg">
                          <h4 className="font-medium mb-3">Write a Review</h4>
                          <form onSubmit={review_submit}>
                            <div className="mb-4">
                              <label className="block mb-2 text-sm font-medium">Rating</label>
                              <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star.toString())}
                                    className="focus:outline-none"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className={`h-8 w-8 ${
                                        star <= Number.parseInt(rating || "0")
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="mb-4">
                              <label htmlFor="review" className="block mb-2 text-sm font-medium">
                                Your Review
                              </label>
                              <textarea
                                id="review"
                                rows={4}
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                required
                              ></textarea>
                            </div>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                              disabled={!rating || !review}
                            >
                              Submit Review
                            </button>
                          </form>
                        </div>
                      ) : (
                        <div className="border p-4 rounded-lg bg-gray-50">
                          <p>
                            Please{" "}
                            <Link href="/login" className="text-blue-600 font-medium">
                              login
                            </Link>{" "}
                            to write a review.
                          </p>
                        </div>
                      )}

                      {/* Display existing reviews */}
                      <div className="space-y-4 mt-6">
                        {reviews && reviews.length > 0 ? (
                          reviews.map((review: any, i: number) => (
                            <div key={i} className="border-b pb-4">
                              <div className="flex justify-between items-center mb-2">
                                <h5 className="font-medium">{review.name}</h5>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                      key={star}
                                      xmlns="http://www.w3.org/2000/svg"
                                      className={`h-5 w-5 ${
                                        star <= Number(review.rating)
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                              <p className="">{review.review}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {review.date
                                  ? new Date(review.date).toLocaleDateString()
                                  : new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                        )}
                      </div>

                      {/* Pagination */}
                      {reviews && reviews.length > 0 && totalReview > perPage && (
                        <div className="flex justify-center mt-6">
                          <div className="flex gap-2">
                            {[...Array(Math.ceil(totalReview / perPage))].map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setPageNumber(i + 1)}
                                className={`px-3 py-1 rounded ${
                                  pageNumber === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                                }`}
                              >
                                {i + 1}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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

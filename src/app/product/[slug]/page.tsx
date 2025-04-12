import { Suspense } from "react"
import { ProductClient } from "./product-client"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return {
    title: `Product: ${slug}`,
    description: "Product details page",
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (!slug) return notFound()

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: slug,
    description: "Product description",
    image: "/placeholder.svg",
    offers: {
      "@type": "AggregateOffer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      highPrice: "0",
      lowPrice: "0",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <Suspense fallback={<ProductSkeleton />}>
        <ProductClient slug={slug} />
      </Suspense>
    </>
  )
}

function ProductSkeleton() {
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

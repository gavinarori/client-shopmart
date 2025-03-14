import { GridTileImage } from "./tile"
import Link from "next/link"
import { products } from "@/lib/data"

function ThreeItemGridItem({
  item,
  size,
  priority,
}: {
  item: (typeof products)[0]
  size: "full" | "half"
  priority?: boolean
}) {
  return (
    <div className={size === "full" ? "md:col-span-4 md:row-span-2" : "md:col-span-2 md:row-span-1"}>
      <Link className="relative block aspect-square h-full w-full" href={`/product/${item.handle}`}>
        <GridTileImage
          src={item.featuredImage.url}
          fill
          sizes={size === "full" ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
          priority={priority}
          alt={item.title}
          label={{
            position: size === "full" ? "center" : "bottom",
            title: item.title,
            amount: item.priceRange.maxVariantPrice.amount,
            currencyCode: item.priceRange.maxVariantPrice.currencyCode,
          }}
        />
      </Link>
    </div>
  )
}

export function ThreeItemGrid() {
  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2">
      <ThreeItemGridItem size="full" item={products[0]} priority={true} />
      <ThreeItemGridItem size="half" item={products[1]} priority={true} />
      <ThreeItemGridItem size="half" item={products[2]} />
    </section>
  )
}


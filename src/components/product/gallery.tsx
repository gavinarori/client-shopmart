"use client"

import { useRef, useEffect } from "react"
import { ArrowLeftIcon, ArrowRightIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { createUrl } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

export function Gallery({ images }: { images: { src: string; altText: string }[] }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const imageSearchParam = searchParams.get("image")
  const imageIndex = imageSearchParam ? Number.parseInt(imageSearchParam) : 0
  const thumbnailsRef = useRef<HTMLUListElement>(null)

  // Set up navigation URLs
  const nextSearchParams = new URLSearchParams(searchParams.toString())
  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0
  nextSearchParams.set("image", nextImageIndex.toString())
  const nextUrl = createUrl(pathname, nextSearchParams)

  const previousSearchParams = new URLSearchParams(searchParams.toString())
  const previousImageIndex = imageIndex === 0 ? images.length - 1 : imageIndex - 1
  previousSearchParams.set("image", previousImageIndex.toString())
  const previousUrl = createUrl(pathname, previousSearchParams)

  // Scroll the active thumbnail into view when the image index changes
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeThumbnail = thumbnailsRef.current.querySelector(`[data-index="${imageIndex}"]`)
      if (activeThumbnail) {
        activeThumbnail.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        })
      }
    }
  }, [imageIndex])

  // Thumbnail carousel navigation
  const scrollThumbnails = (direction: "left" | "right") => {
    if (!thumbnailsRef.current) return

    const container = thumbnailsRef.current
    const scrollAmount = 200 // Adjust as needed

    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const buttonClassName =
    "h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center"

  return (
    <>
      {/* Main Image */}
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden  p-5 ">
        {images[imageIndex] && (
          <Image
            className="h-full w-full object-contain"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={images[imageIndex]?.altText as string}
            src={(images[imageIndex]?.src as string) || "/placeholder.svg"}
            priority={true}
          />
        )}

        {images.length > 1 ? (
          <div className="absolute bottom-[15%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur dark:border-black dark:bg-neutral-900/80">
              <Link aria-label="Previous product image" href={previousUrl} className={buttonClassName} scroll={false}>
                <ArrowLeftIcon className="h-5" />
              </Link>
              <div className="mx-1 h-6 w-px bg-neutral-500"></div>
              <Link aria-label="Next product image" href={nextUrl} className={buttonClassName} scroll={false}>
                <ArrowRightIcon className="h-5" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {/* Thumbnails */}
      {images.length > 1 ? (
        <div className="relative mt-4">
          {images.length > 4 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow-md"
                onClick={() => scrollThumbnails("left")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white shadow-md"
                onClick={() => scrollThumbnails("right")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          <ul
            ref={thumbnailsRef}
            className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-3 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {images.map((image, index) => {
              const isActive = index === imageIndex
              const imageSearchParams = new URLSearchParams(searchParams.toString())
              imageSearchParams.set("image", index.toString())

              return (
                <li key={image.src} className="h-[120px] w-[120px] flex-none" data-index={index}>
                  <Link
                    aria-label={`View product image ${index + 1}`}
                    href={createUrl(pathname, imageSearchParams)}
                    scroll={false}
                    className={`block h-full w-full transition-all duration-200 ${
                      isActive
                        ? "border-2 border-blue-500 opacity-100"
                        : "border border-gray-200 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <div className="relative h-full w-full">
                      <Image alt={image.altText} src={image.src || "/placeholder.svg"} fill className="object-cover" />
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </>
  )
}

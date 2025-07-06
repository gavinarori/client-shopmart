"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type SlideType = {
  id: number
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  image?: string
  video?: string
  altText: string
}

const slides: SlideType[] = [
  {
    id: 1,
    title: "Welcome to Kicksvaultke",
    subtitle: "We don't just sell shoes — we deliver quality, style & trust to every doorstep. Tap in. Rock with us. Be the vault.",
    buttonText: "Shop Now",
    buttonLink: "#",
    video: "/assests/cinematic jordan.mp4",
    altText: "Cinematic Jordan sneaker showcase",
  },
  {
    id: 2,
    title: "PlayStation X Cactus",
    subtitle: "Exclusive gaming meets streetwear! Limited edition PlayStation X Cactus t-shirts now available. Premium quality, bold designs, perfect for gamers and fashion enthusiasts alike.",
    buttonText: "Shop PlayStation X Cactus",
    buttonLink: "#",
    video: "/assests/cactus ad.mp4",
    altText: "PlayStation X Cactus t-shirt collection",
  },
  {
    id: 3,
    title: "Premium T-Shirt Collection",
    subtitle: "From streetwear essentials to statement pieces, our t-shirt collection has you covered. Quality fabrics, trendy designs, and unbeatable comfort. Order now and elevate your style game!",
    buttonText: "Shop T-Shirts",
    buttonLink: "#",
    image: "/assests/sidewalk-sale-retail-shop-shirts.jpg",
    altText: "Premium t-shirt collection showcase",
  },
]

interface HeroSliderProps {
  autoplaySpeed?: number
  className?: string
}

export default function HeroSlider({ autoplaySpeed = 5000, className }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const slideCount = slides.length

  const goToSlide = useCallback(
    (index: number) => {
      let slideIndex = index

      if (index < 0) {
        slideIndex = slideCount - 1
      } else if (index >= slideCount) {
        slideIndex = 0
      }

      setCurrentSlide(slideIndex)
    },
    [slideCount],
  )

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1)
  }, [currentSlide, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1)
  }, [currentSlide, goToSlide])

  const toggleAutoplay = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying) {
      interval = setInterval(() => {
        nextSlide()
      }, autoplaySpeed)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, nextSlide, autoplaySpeed])

  // Format the slide number with leading zero
  const formatSlideNumber = (num: number) => {
    return String(num + 1).padStart(2, "0")
  }

  return (
    <div className={cn("relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden", className)}>
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0",
          )}
        >
          {/* Background Media */}
          <div className="absolute inset-0">
            {slide.video ? (
              <video
                src={slide.video}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.altText}
                fill
                priority={index === 0}
                className="object-cover"
              />
            )}
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Content */}
          <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-4xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">{slide.title}</h2>
            <p className="text-base md:text-lg text-white/90 mb-8 max-w-xl">{slide.subtitle}</p>
            <div>
              <Button asChild className="rounded-full px-8 bg-white text-black hover:bg-white/90 hover:text-black">
                <Link href={slide.buttonLink}>{slide.buttonText}</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 text-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 text-white"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Bottom Controls */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center items-center gap-8">
        {/* Dots */}
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                currentSlide === index ? "bg-white w-8" : "bg-white/50 hover:bg-white/70",
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Counter */}
        <div className="text-white text-sm font-medium">
          {formatSlideNumber(currentSlide)}/{formatSlideNumber(slideCount - 1)}
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={toggleAutoplay}
          className="text-white hover:text-white/80"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}


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
  image: string
  altText: string
}

const slides: SlideType[] = [
  {
    id: 1,
    title: "Designed for comfort",
    subtitle: "Experience our ergonomic furniture collection designed to support your lifestyle and well-being.",
    buttonText: "Shop Now",
    buttonLink: "#",
    image: "https://img.freepik.com/free-photo/smiley-woman-selling-clothes-front-view_23-2149731135.jpg?t=st=1741944749~exp=1741948349~hmac=880dcf91efb00eefbda5158a6e3d286bf856a2efd6b8208c7adebd2a20797d56&w=996",
    altText: "Ergonomic furniture collection",
  },
  {
    id: 2,
    title: "Sustainable living",
    subtitle:
      "Our eco-friendly products are made with sustainable materials to help reduce your environmental footprint.",
    buttonText: "Explore",
    buttonLink: "#",
    image: "https://img.freepik.com/free-photo/close-up-man-shopping-with-laptop_23-2149241375.jpg?t=st=1741944213~exp=1741947813~hmac=16c0b68b82b5713af83f10fe048b3b40a71577fe20189a3b0f6c639c965dc96f&w=996",
    altText: "Eco-friendly products",
  },
  {
    id: 3,
    title: "Something for everyone",
    subtitle:
      "Don't miss out on exclusive offers across our best-selling products. Shop today and save big on the items you love.",
    buttonText: "Shop Now",
    buttonLink: "#",
    image: "https://img.freepik.com/free-photo/medium-shot-women-clothes-shopping_23-2150639894.jpg?t=st=1741944281~exp=1741947881~hmac=fdb71ac3a740951c53e51c541c66eac2b90b03f6e49e0fe82711a9154dca9fe4&w=900",
    altText: "Best-selling products",
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
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.altText}
              fill
              priority={index === 0}
              className="object-cover"
            />
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


"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"

export function FeatureSection() {
  return (
    <section className="min-h-screen mx-auto  w-full border-b border-neutral-500 rounded-lg">
<div className="relative flex   px-6 py-24 sm:py-32 lg:px-8 ">

        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight  sm:text-4xl md:text-5xl">
          Your Ultimate Online Store.
          </h1>
          <h2 className="mt-2 text-3xl font-bold tracking-tight  sm:text-4xl md:text-5xl">
          Shop the Best Deals, Anytime, Anywhere.
          </h2>
          <p className="mt-6 text-lg leading-8 ">
          Explore a vast collection of top-quality products at unbeatable prices. Enjoy a seamless shopping experience with fast delivery and secure payments.
          </p>
          <div className="mt-8">
            <Button
              variant="outline"
              className="group inline-flex items-center gap-2 rounded-full  px-6 py-2 text-sm font-semibold   transition-colors"
            >
             <ShoppingCart className="h-4 w-4" />
             Start Shopping
            </Button>
          </div>
        </div>
      </div>

    <div className="relative flex item-center mx-auto w-full max-w-5xl ">
      <div className="relative w-full h-full aspect-[2440/1280]">
        <img 
          className="absolute inset-0 w-full h-full  bg-transparent"
          src="/assests/feature.webp"
          alt="Seamless customization with Once UI"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  </section>
  

  )
}

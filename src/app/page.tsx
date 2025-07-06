"use client"

import Image from "next/image";
import { useEffect } from 'react'
import { ThreeItemGrid } from "@/components/grid/three-items";
import HeroSlider from "@/components/hero-slider"
import { FeatureSection } from "@/components/feature-section";
import { Footer } from "@/components/Footer";
import CategoryGrid from "@/components/category-grid";
import { useDispatch } from 'react-redux';



export default function Home() {

  return (
   <>
   <HeroSlider/>
   <CategoryGrid/>
   <main className="min-h-screen ">
      <div className="py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Featured Kicks</h1>
        <p className="max-w-2xl mx-auto">
          Check out our latest collection of premium sneakers. From streetwear to luxury kicks, we've got your style covered. Click on any item to see more details.
        </p>
      </div>
      <ThreeItemGrid />
    </main>
    <FeatureSection/>
    <Footer/>
   </>
  );
}

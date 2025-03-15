import Image from "next/image";
import { ThreeItemGrid } from "@/components/grid/three-items";
import HeroSlider from "@/components/hero-slider"
import { FeatureSection } from "@/components/feature-section";
import { Footer } from "@/components/Footer";
import CategoryGrid from "@/components/category-grid";


export default function Home() {
  return (
   <>
   <HeroSlider/>
   <CategoryGrid/>
   <main className="min-h-screen ">
      <div className="py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Featured Products</h1>
        <p className="max-w-2xl mx-auto">
          Check out our latest collection of premium products. Click on any item to see more details.
        </p>
      </div>
      <ThreeItemGrid />
    </main>
    <FeatureSection/>
    <Footer/>
   </>
  );
}

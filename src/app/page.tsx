import Image from "next/image";
import { ThreeItemGrid } from "@/components/grid/three-items";
import HeroSlider from "@/components/hero-slider"


export default function Home() {
  return (
   <>
   <HeroSlider/>
   <main className="min-h-screen bg-white dark:bg-gray-900">
      <div className="py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Featured Products</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Check out our latest collection of premium products. Click on any item to see more details.
        </p>
      </div>
      <ThreeItemGrid />
    </main>
   </>
  );
}

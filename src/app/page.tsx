import Image from "next/image";
import { ThreeItemGrid } from "@/components/grid/three-items";
import HeroSlider from "@/components/hero-slider"
import Navbar from "@/components/layout/navbar";

export default function Home() {
  return (
   <>
   <Navbar/>
   <HeroSlider/>
   <ThreeItemGrid/>
   </>
  );
}

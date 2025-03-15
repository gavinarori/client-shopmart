import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function CategoryGrid() {
  return (
    <div>
      <div className="py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Top Featured Categories</h1>
        <p className="max-w-2xl mx-auto">
          Check out our latest collection of premium products. Click on any item to see more details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 w-full py-4 ">
      
        {/* Top Left Section */}
        <div className="relative aspect-[4/3] overflow-hidden group">
          <Image
            src="/assests/category-1.jpg"
            alt="Electronics collections"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
           <Overlay title="Electronics Collection" subtitle="Explore the Latest Tech" />
        </div>

        {/* Top Right Section */}
        <div className="relative aspect-[4/3] overflow-hidden group">
          <Image
            src="/assests/category-2.jpg"
            alt="Nike Fast Pack"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
         <Overlay title="Home Appliances" subtitle="Upgrade Your Living Space" />
        </div>

        {/* Bottom Left Section */}
        <div className="relative aspect-[4/3] overflow-hidden group">
          <Image
            src="/assests/category-3.avif"
            alt="Winter Collection"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Overlay title="Shoes Collection" subtitle="Step Into Style & Comfort" />
        </div>

        {/* Bottom Right Section */}
        <div className="relative aspect-[4/3] overflow-hidden group">
          <Image
            src="/assests/category-4.jpg"
            alt="Hoodie Collection"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Overlay title="Clothing Collection" subtitle="Fashion for Every Season" />
        </div>

      </div>
    </div>
  )
}


type OverlayProps = {
  title: string;
  subtitle: string;
};

function Overlay({ title, subtitle }: OverlayProps) {
  return (
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
      <div className="absolute bottom-8 left-8 text-white">
        <p className="text-sm mb-2">{subtitle}</p>
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <Button variant="secondary" className="bg-white text-black hover:bg-white/90">
          Shop
        </Button>
      </div>
    </div>
  );
}

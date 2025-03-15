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
            src="https://img.freepik.com/free-photo/portrait-man-with-virtual-reality-headset_23-2148850995.jpg?t=st=1742048137~exp=1742051737~hmac=57d2a740da194b4d439288bbcac2570ba201703203cc3b7170f9941b234d754b&w=996"
            alt="Electronics collections"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
           <Overlay title="Electronics Collection" subtitle="Explore the Latest Tech" />
        </div>

        {/* Top Right Section */}
        <div className="relative aspect-[4/3] overflow-hidden group">
          <Image
            src="https://img.freepik.com/free-photo/happy-smiling-couple-just-bought-new-household-appliances-hypermarket_93675-133602.jpg?t=st=1742048264~exp=1742051864~hmac=0d60adf79c96e43ed0674efed265b9395e0fbe6731fbfbb10d0142982e50ec3e&w=996"
            alt="Nike Fast Pack"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
         <Overlay title="Home Appliances" subtitle="Upgrade Your Living Space" />
        </div>

        {/* Bottom Left Section */}
        <div className="relative aspect-[4/3] overflow-hidden group">
          <Image
            src="https://img.freepik.com/free-photo/close-up-person-wearing-futuristic-sneakers_23-2151005727.jpg?t=st=1742056452~exp=1742060052~hmac=d4c4ab0366f92dfed253f738f7fe58ec71f6692be88e267b166357e6656b80cc&w=740"
            alt="Winter Collection"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Overlay title="Shoes Collection" subtitle="Step Into Style & Comfort" />
        </div>

        {/* Bottom Right Section */}
        <div className="relative aspect-[4/3] overflow-hidden group">
          <Image
            src="https://img.freepik.com/free-photo/fashion-clothing-hangers-show_1153-5492.jpg?t=st=1742045265~exp=1742048865~hmac=a802ac5c8a8a8cb82c73656227736f41e9a16412875c845747ca04f1f0802955&w=996"
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

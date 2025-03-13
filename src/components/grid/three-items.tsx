import { GridTileImage } from './tile';
import Link from 'next/link';

type Product = {
  id: string;
  handle: string;
  title: string;
  featuredImage: {
    url: string;
  };
  priceRange: {
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
};

const staticProducts: Product[] = [
  {
    id: '1',
    handle: '/product-1',
    title: 'Premium Leather Jacket',
    featuredImage: {
      url: '/jacket-1.jpg'
    },
    priceRange: {
      maxVariantPrice: {
        amount: '129.99',
        currencyCode: 'USD'
      }
    }
  },
  {
    id: '2',
    handle: '/product-2',
    title: 'Casual Sneakers',
    featuredImage: {
      url: '/jacket-2.jpg'
    },
    priceRange: {
      maxVariantPrice: {
        amount: '89.99',
        currencyCode: 'USD'
      }
    }
  },
  {
    id: '3',
    handle: '/product-3',
    title: 'Classic Denim Jeans',
    featuredImage: {
      url: '/jacket-3.jpg'
    },
    priceRange: {
      maxVariantPrice: {
        amount: '69.99',
        currencyCode: 'USD'
      }
    }
  }
];

function ThreeItemGridItem({
  item,
  size,
  priority
}: {
  item: Product;
  size: 'full' | 'half';
  priority?: boolean;
}) {
  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <Link className="relative block aspect-square h-full w-full" href={`${item.handle}`}>
        <GridTileImage
          src={item.featuredImage.url}
          fill
          sizes={
            size === 'full' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'
          }
          priority={priority}
          alt={item.title}
          label={{
            position: size === 'full' ? 'center' : 'bottom',
            title: item.title,
            amount: item.priceRange.maxVariantPrice.amount,
            currencyCode: item.priceRange.maxVariantPrice.currencyCode
          }}
        />
      </Link>
    </div>
  );
}

export function ThreeItemGrid() {
  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2">
      <ThreeItemGridItem size="full" item={staticProducts[0]} priority={true} />
      <ThreeItemGridItem size="half" item={staticProducts[1]} priority={true} />
      <ThreeItemGridItem size="half" item={staticProducts[2]} />
    </section>
  );
}

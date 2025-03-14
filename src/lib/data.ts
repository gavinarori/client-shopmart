// Static product data
export const products = [
    {
      id: "1",
      handle: "premium-leather-jacket",
      title: "Premium Leather Jacket",
      description:
        "A luxurious leather jacket made from the finest materials. Perfect for any occasion and built to last.",
      descriptionHtml:
        "<p>A luxurious leather jacket made from the finest materials. Perfect for any occasion and built to last.</p>",
      availableForSale: true,
      featuredImage: {
        url: "/placeholder.svg?height=600&width=600",
        altText: "Premium Leather Jacket",
        width: 600,
        height: 600,
      },
      images: [
        {
          url: "/placeholder.svg?height=600&width=600",
          altText: "Premium Leather Jacket - Front",
          width: 600,
          height: 600,
        },
        {
          url: "/placeholder.svg?height=600&width=600&text=Back",
          altText: "Premium Leather Jacket - Back",
          width: 600,
          height: 600,
        },
        {
          url: "/placeholder.svg?height=600&width=600&text=Side",
          altText: "Premium Leather Jacket - Side",
          width: 600,
          height: 600,
        },
      ],
      priceRange: {
        minVariantPrice: {
          amount: "129.99",
          currencyCode: "USD",
        },
        maxVariantPrice: {
          amount: "129.99",
          currencyCode: "USD",
        },
      },
      options: [
        {
          id: "option1",
          name: "Color",
          values: ["Black", "Brown", "Tan"],
        },
        {
          id: "option2",
          name: "Size",
          values: ["S", "M", "L", "XL"],
        },
      ],
      variants: [
        {
          id: "variant1",
          title: "Black / S",
          availableForSale: true,
          selectedOptions: [
            { name: "Color", value: "Black" },
            { name: "Size", value: "S" },
          ],
        },
        {
          id: "variant2",
          title: "Black / M",
          availableForSale: true,
          selectedOptions: [
            { name: "Color", value: "Black" },
            { name: "Size", value: "M" },
          ],
        },
        {
          id: "variant3",
          title: "Black / L",
          availableForSale: true,
          selectedOptions: [
            { name: "Color", value: "Black" },
            { name: "Size", value: "L" },
          ],
        },
        {
          id: "variant4",
          title: "Brown / M",
          availableForSale: true,
          selectedOptions: [
            { name: "Color", value: "Brown" },
            { name: "Size", value: "M" },
          ],
        },
        {
          id: "variant5",
          title: "Tan / L",
          availableForSale: false,
          selectedOptions: [
            { name: "Color", value: "Tan" },
            { name: "Size", value: "L" },
          ],
        },
      ],
      tags: [],
      seo: {
        title: "Premium Leather Jacket",
        description: "A luxurious leather jacket made from the finest materials.",
      },
    },
    {
      id: "2",
      handle: "casual-sneakers",
      title: "Casual Sneakers",
      description: "Comfortable and stylish sneakers for everyday wear. Available in multiple colors.",
      descriptionHtml: "<p>Comfortable and stylish sneakers for everyday wear. Available in multiple colors.</p>",
      availableForSale: true,
      featuredImage: {
        url: "/placeholder.svg?height=600&width=600&text=Sneakers",
        altText: "Casual Sneakers",
        width: 600,
        height: 600,
      },
      images: [
        {
          url: "/placeholder.svg?height=600&width=600&text=Sneakers",
          altText: "Casual Sneakers - Front",
          width: 600,
          height: 600,
        },
        {
          url: "/placeholder.svg?height=600&width=600&text=Sneakers+Side",
          altText: "Casual Sneakers - Side",
          width: 600,
          height: 600,
        },
      ],
      priceRange: {
        minVariantPrice: {
          amount: "89.99",
          currencyCode: "USD",
        },
        maxVariantPrice: {
          amount: "89.99",
          currencyCode: "USD",
        },
      },
      options: [
        {
          id: "option1",
          name: "Color",
          values: ["White", "Black", "Blue"],
        },
        {
          id: "option2",
          name: "Size",
          values: ["7", "8", "9", "10", "11"],
        },
      ],
      variants: [
        {
          id: "variant1",
          title: "White / 8",
          availableForSale: true,
          selectedOptions: [
            { name: "Color", value: "White" },
            { name: "Size", value: "8" },
          ],
        },
        {
          id: "variant2",
          title: "Black / 9",
          availableForSale: true,
          selectedOptions: [
            { name: "Color", value: "Black" },
            { name: "Size", value: "9" },
          ],
        },
      ],
      tags: [],
      seo: {
        title: "Casual Sneakers",
        description: "Comfortable and stylish sneakers for everyday wear.",
      },
    },
    {
      id: "3",
      handle: "classic-denim-jeans",
      title: "Classic Denim Jeans",
      description: "High-quality denim jeans with a classic fit. Durable and comfortable for everyday wear.",
      descriptionHtml: "<p>High-quality denim jeans with a classic fit. Durable and comfortable for everyday wear.</p>",
      availableForSale: true,
      featuredImage: {
        url: "/placeholder.svg?height=600&width=600&text=Jeans",
        altText: "Classic Denim Jeans",
        width: 600,
        height: 600,
      },
      images: [
        {
          url: "/placeholder.svg?height=600&width=600&text=Jeans",
          altText: "Classic Denim Jeans - Front",
          width: 600,
          height: 600,
        },
        {
          url: "/placeholder.svg?height=600&width=600&text=Jeans+Back",
          altText: "Classic Denim Jeans - Back",
          width: 600,
          height: 600,
        },
      ],
      priceRange: {
        minVariantPrice: {
          amount: "69.99",
          currencyCode: "USD",
        },
        maxVariantPrice: {
          amount: "69.99",
          currencyCode: "USD",
        },
      },
      options: [
        {
          id: "option1",
          name: "Style",
          values: ["Slim", "Regular", "Relaxed"],
        },
        {
          id: "option2",
          name: "Size",
          values: ["30", "32", "34", "36"],
        },
      ],
      variants: [
        {
          id: "variant1",
          title: "Slim / 32",
          availableForSale: true,
          selectedOptions: [
            { name: "Style", value: "Slim" },
            { name: "Size", value: "32" },
          ],
        },
        {
          id: "variant2",
          title: "Regular / 34",
          availableForSale: true,
          selectedOptions: [
            { name: "Style", value: "Regular" },
            { name: "Size", value: "34" },
          ],
        },
      ],
      tags: [],
      seo: {
        title: "Classic Denim Jeans",
        description: "High-quality denim jeans with a classic fit.",
      },
    },
  ]
  
  export function getProduct(handle: string) {
    return products.find((product) => product.handle === handle) || null
  }
  
  export function getProductRecommendations(id: string) {
    // Return all products except the one with the given ID
    return products.filter((product) => product.id !== id)
  }
  
  
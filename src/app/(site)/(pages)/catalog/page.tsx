import React from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // In a real scenario, you might have a specific SEO endpoint for the shop
  // For now we'll use a descriptive default
  return {
    title: "Eco-friendly Plants & Greenery Shop | NextCommerce",
    description: "Browse our exclusive collection of high-quality indoor and outdoor plants. From Monstera to Hoya, find the perfect greenery for your home.",
    keywords: ["plants", "indoor plants", "buy plants online", "monstera", "hoya", "nextjs ecommerce"],
    openGraph: {
      title: "Eco-friendly Plants & Greenery Shop | NextCommerce",
      description: "Browse our exclusive collection of high-quality indoor and outdoor plants.",
      type: "website",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/catalog`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Eco-friendly Plants & Greenery Shop | NextCommerce",
      description: "Find your next favorite plant at NextCommerce.",
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/catalog`,
    },
  };
};

const ShopWithSidebarPage = async ({ searchParams }: { searchParams: { category?: string } }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;
  const category = (await searchParams)?.category;

  let initialProducts = [];
  let initialCategories = [];
  let initialMeta = null;

  try {
    const [prodRes, catRes] = await Promise.all([
      fetch(`${apiUrl}/api/products?page=1${category ? `&category=${category}` : ""}`, { cache: "no-store" }),
      fetch(`${apiUrl}/api/categories`, { cache: "no-store" })
    ]);

    if (prodRes.ok) {
      const json = await prodRes.json();
      initialMeta = json.meta;
      initialProducts = json.data.map((item: any) => ({
        id: item.id,
        title: item.name,
        slug: item.slug,
        price: item.price,
        discountedPrice: item.price,
        average_rating: item.average_rating || 0,
        reviews_count: item.reviews_count || 0,
        imgs: {
          thumbnails: [`${storageUrl}/${item.primary_image}`],
          previews: [`${storageUrl}/${item.primary_image}`],
        },
      }));
    }

    if (catRes.ok) {
      initialCategories = await catRes.json();
    }
  } catch (error) {
    console.error("SSR fetch error:", error);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Plant Collection",
    "description": "List of available plants in our shop",
    "itemListElement": initialProducts.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `${process.env.NEXT_PUBLIC_APP_URL}/shop-details/${p.slug}`,
      "name": p.title,
      "image": p.imgs.previews[0]
    }))
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShopWithSidebar 
        initialProducts={initialProducts} 
        initialCategories={initialCategories}
        initialMeta={initialMeta}
      />
    </main>
  );
};

export default ShopWithSidebarPage;

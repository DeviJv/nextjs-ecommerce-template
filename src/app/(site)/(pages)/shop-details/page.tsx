import React from "react";
import ShopDetails from "@/components/ShopDetails";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/api/products?per_page=1`, { cache: 'no-store' });
    const json = await res.json();
    const product = json.data[0];
    
    if (!product) return { title: "Shop Details" };

    return {
      title: `${product.name} | NextCommerce`,
      description: product.description?.substring(0, 160),
    };
  } catch (error) {
    return { title: "Shop Details" };
  }
}

const ShopDetailsPage = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;

  let product = null;
  try {
    const res = await fetch(`${apiUrl}/api/products?per_page=1`, { cache: 'no-store' });
    if (res.ok) {
        const json = await res.json();
        const data = json.data[0];
        
        if (data) {
            product = {
                id: data.id,
                slug: data.slug,
                title: data.name,
                description: data.description,
                price: data.price,
                discountedPrice: data.price,
                currency: data.currency || 'USD',
                imgs: {
                    thumbnails: [`${storageUrl}/${data.primary_image}`],
                    previews: [`${storageUrl}/${data.primary_image}`],
                },
                average_rating: data.average_rating || 0,
                reviews_count: data.reviews_count || 0,
                reviews: data.reviews || [],
                category: data.category,
            };
        }
    }
  } catch (error) {
    console.error("Default product fetch error:", error);
  }

  return (
    <main>
      <ShopDetails product={product} />
    </main>
  );
};

export default ShopDetailsPage;

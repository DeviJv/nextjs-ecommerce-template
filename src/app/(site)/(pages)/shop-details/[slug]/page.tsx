import React from "react";
import ShopDetails from "@/components/ShopDetails";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  try {
    const res = await fetch(`${apiUrl}/api/products/${slug}`, { cache: 'no-store' });
    if (!res.ok) {
        return { title: "Product Not Found" };
    }
    const { data: product } = await res.json();

    return {
      title: product.seo?.title || `${product.name} | NextCommerce`,
      description: product.seo?.description || product.description?.substring(0, 160),
      keywords: product.seo?.keywords?.join(', '),
      alternates: {
        canonical: product.seo?.canonical_url || `${process.env.NEXT_PUBLIC_APP_URL || ''}/shop-details/${product.slug}`,
      },
      openGraph: {
        title: product.seo?.title || product.name,
        description: product.seo?.description || product.description?.substring(0, 160),
        images: product.primary_image ? [{ url: product.primary_image }] : [],
      },
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return { title: "Product Details" };
  }
}

const ShopDetailsPage = async ({ params }: Props) => {
  const slug = (await params).slug;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;

  let product = null;
  try {
    const res = await fetch(`${apiUrl}/api/products/${slug}`, { cache: 'no-store' });
    if (res.ok) {
        const json = await res.json();
        const data = json.data;
        
        // Map API data to the component's expected format
        product = {
            id: data.id,
            slug: data.slug,
            title: data.name,
            description: data.description,
            price: data.price,
            discountedPrice: data.price, // Assuming no discount for now
            currency: data.currency || 'USD',
            imgs: {
                thumbnails: data.images.map((img: any) => `${storageUrl}/${img.path}`),
                previews: data.images.map((img: any) => `${storageUrl}/${img.path}`),
            },
            average_rating: data.average_rating || 0,
            reviews_count: data.reviews_count || 0,
            reviews: data.reviews || [],
            category: data.category,
            seo: data.seo,
        };
    }
  } catch (error) {
    console.error("Product fetch error:", error);
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.imgs.previews[0],
    description: product.seo?.description || product.description,
    sku: product.id.toString(),
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_APP_URL || ''}/shop-details/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShopDetails product={product} />
    </main>
  );
};

export default ShopDetailsPage;

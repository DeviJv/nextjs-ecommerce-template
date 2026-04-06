import Home from "@/components/Home";
import { HomepageResponse } from "@/types/homepage";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getHomepageData();
    const homepageData = data?.data;

    return {
      title: homepageData?.seo_title || "NextCommerce | Nextjs E-commerce template",
      description: homepageData?.seo_description || "This is Home for NextCommerce Template",
      keywords: homepageData?.seo_keywords || [],
      alternates: {
        canonical: process.env.NEXT_PUBLIC_APP_URL || "https://e-commerce.test",
      },
      openGraph: {
        title: homepageData?.seo_title || "NextCommerce",
        description: homepageData?.seo_description || "E-commerce template",
        images: homepageData?.og_image_url ? [{ url: homepageData.og_image_url }] : [],
      },
    };
  } catch (error) {
    console.error("Metadata error:", error);
    return {
      title: "NextCommerce | Nextjs E-commerce template",
      description: "This is Home for NextCommerce Template",
    };
  }
}

async function getHomepageData(): Promise<HomepageResponse | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://e-commerce.test";
  const res = await fetch(`${apiUrl}/api/homepage`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function HomePage() {
  const data = await getHomepageData();

  return (
    <>
      <Home homepageData={data?.data} />
    </>
  );
}


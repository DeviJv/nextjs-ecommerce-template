import Home from "@/components/Home";
import { HomepageResponse } from "@/types/homepage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NextCommerce | Nextjs E-commerce template",
  description: "This is Home for NextCommerce Template",
  // other metadata
};

async function getHomepageData(): Promise<HomepageResponse | null> {
  const res = await fetch("https://e-commerce.test/api/homepage", {
    next: { revalidate: 3600 }, // Cache for 1 hour
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


import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://e-commerce-plant.vercel.app'; 
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://e-commerce.test';

  try {
    // 1. Fetch slug data from Laravel API
    const response = await fetch(`${apiUrl}/api/sitemap-data`, { cache: 'no-store' });
    if (!response.ok) {
        return [{ url: baseUrl, lastModified: new Date() }];
    }
    const { data } = await response.json();

    // 2. Format data for Next.js sitemap
    const dynamicRoutes = data.map((item: any) => {
      // Ensure no double slashes
      const itemUrl = item.url.startsWith('/') ? item.url : `/${item.url}`;
      const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      
      return {
        url: `${base}${itemUrl}`,
        lastModified: new Date(item.last_modified || new Date()),
        changeFrequency: item.change_frequency || 'weekly',
        priority: item.priority || 0.8,
      };
    });

    // 3. Combine with static routes
    const staticBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return [
      {
        url: `${staticBase}/`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      ...dynamicRoutes,
    ];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return [{ url: baseUrl, lastModified: new Date() }];
  }
}

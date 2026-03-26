// import { MetadataRoute } from 'next';

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://e-commerce-plant.vercel.app'; // Ganti jika sudah ada domain tetap
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL;

//   try {
//     // 1. Ambil data slug dari Laravel API
//     const response = await fetch(`${apiUrl}/api/sitemap-data`, { cache: 'no-store' });
//     if (!response.ok) {
//         return [{ url: baseUrl, lastModified: new Date() }];
//     }
//     const { data } = await response.json();

//     // 2. Format data untuk sitemap Next.js
//     const dynamicRoutes = data.map((item: any) => ({
//       url: `${baseUrl}${item.url}`,
//       lastModified: new Date(item.last_modified),
//       changeFrequency: 'weekly',
//       priority: 0.8,
//     }));

//     // 3. Gabungkan dengan static routes
//     return [
//       {
//         url: baseUrl,
//         lastModified: new Date(),
//         changeFrequency: 'daily',
//         priority: 1,
//       },
//       ...dynamicRoutes,
//     ];
//   } catch (error) {
//     console.error("Sitemap generation error:", error);
//     return [{ url: baseUrl, lastModified: new Date() }];
//   }
// }

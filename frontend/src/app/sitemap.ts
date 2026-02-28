import type { MetadataRoute } from 'next';

const BASE_URL = 'https://hylacviet.vn';
const API_URL = process.env.API_URL || 'http://hylacviet-api:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/san-pham`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/gioi-thieu`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/may-do`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/lien-he`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ];

    // Dynamic product pages
    let productPages: MetadataRoute.Sitemap = [];
    try {
        const res = await fetch(`${API_URL}/api/products`, {
            next: { revalidate: 3600 }, // Re-fetch every hour
        });
        if (res.ok) {
            const data = await res.json();
            const items = data.success
                ? (Array.isArray(data.data) ? data.data : (data.data?.items || []))
                : [];

            productPages = items
                .filter((p: { status: string }) => p.status === 'active')
                .map((p: { id: string; updated_at?: string }) => ({
                    url: `${BASE_URL}/san-pham/${p.id}`,
                    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
                    changeFrequency: 'weekly' as const,
                    priority: 0.8,
                }));
        }
    } catch (error) {
        console.error('Sitemap: Failed to fetch products:', error);
    }

    return [...staticPages, ...productPages];
}

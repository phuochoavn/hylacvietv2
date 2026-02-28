import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Cormorant_Garamond, Roboto } from 'next/font/google';
import '@/styles/main.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

import LayoutEffects from '@/components/layout/LayoutEffects';

// Configure Google Fonts with next/font for optimized loading
const cormorant = Cormorant_Garamond({
    subsets: ['latin', 'vietnamese'],
    weight: ['400', '500'],
    variable: '--font-cormorant',
    display: 'swap',
});

const roboto = Roboto({
    subsets: ['latin', 'vietnamese'],
    weight: ['400', '700'],
    variable: '--font-roboto',
    display: 'swap',
});

// API URL for server-side fetch
const API_URL = process.env.API_URL || 'http://hylacviet-api:3000';

// Allow Next.js to choose rendering strategy (ISR via revalidate in fetch)
export const dynamic = 'auto';

// Dynamic metadata generation
export async function generateMetadata(): Promise<Metadata> {
    // Default metadata
    const defaultMeta = {
        title: 'Hỷ Lạc Việt - Áo Dài & Pháp Phục Cao Cấp',
        description: 'Nơi nghệ thuật áo dài truyền thống hội tụ cùng tâm huyết của những nghệ nhân lành nghề. Mỗi tác phẩm là một câu chuyện văn hóa được thêu dệt bằng sự tinh tế.',
        ogImage: 'https://hylacviet.vn/images/og-image.jpg',
    };

    try {
        // Fetch settings from API
        const res = await fetch(`${API_URL}/api/settings`, {
            next: { revalidate: 60 }, // Cache for 60 seconds
        });

        if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                const settings: Record<string, string> = {};
                for (const item of data.data) {
                    settings[item.key] = item.value;
                }

                // Get values from settings or use defaults
                const title = settings.meta_title || settings.site_name || defaultMeta.title;
                const description = settings.meta_description || defaultMeta.description;
                const ogImage = settings.og_image
                    ? (settings.og_image.startsWith('http') ? settings.og_image : `https://hylacviet.vn${settings.og_image}`)
                    : defaultMeta.ogImage;

                return {
                    title,
                    description,
                    keywords: ['áo dài', 'pháp phục', 'áo dài cao cấp', 'áo dài Việt Nam', 'hỷ lạc việt', 'áo dài cưới', 'may áo dài'],
                    icons: {
                        icon: [
                            { url: '/favicon.ico', sizes: '32x32' },
                            { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
                        ],
                        apple: '/apple-touch-icon.png',
                    },
                    openGraph: {
                        title,
                        description,
                        type: 'website',
                        locale: 'vi_VN',
                        siteName: settings.site_name || 'Hỷ Lạc Việt',
                        images: [
                            {
                                url: ogImage,
                                width: 1200,
                                height: 630,
                                alt: title,
                            },
                        ],
                    },
                    twitter: {
                        card: 'summary_large_image',
                        title,
                        description,
                        images: [ogImage],
                    },
                    robots: {
                        index: true,
                        follow: true,
                    },
                    alternates: {
                        canonical: 'https://hylacviet.vn',
                    },
                };
            }
        }
    } catch (error) {
        console.error('Failed to fetch metadata settings:', error);
    }

    // Return default metadata on error
    return {
        title: defaultMeta.title,
        description: defaultMeta.description,
        keywords: ['áo dài', 'pháp phục', 'áo dài cao cấp', 'áo dài Việt Nam', 'hỷ lạc việt', 'áo dài cưới', 'may áo dài'],
        icons: {
            icon: [
                { url: '/favicon.ico', sizes: '32x32' },
                { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            ],
            apple: '/apple-touch-icon.png',
        },
        openGraph: {
            title: defaultMeta.title,
            description: defaultMeta.description,
            type: 'website',
            locale: 'vi_VN',
        },
    };
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi" className={`${cormorant.variable} ${roboto.variable}`}>
            <head>
                {/* Preload critical fonts for faster FCP */}
                <link rel="preload" href="/fonts/CottaFree.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
                {/* Critical CSS for Mobile Menu - prevents FOUC on iOS WebKit */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .mobile-menu {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        right: 0 !important;
                        bottom: 0 !important;
                        background-color: #1a1614 !important;
                        background: linear-gradient(135deg, rgba(26,22,20,0.98) 0%, rgba(35,30,26,0.98) 50%, rgba(26,22,20,0.98) 100%) !important;
                        z-index: 9999 !important;
                        opacity: 0 !important;
                        visibility: hidden !important;
                        transform: translateY(-20px) !important;
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                        justify-content: center !important;
                    }
                    .mobile-menu.active {
                        opacity: 1 !important;
                        visibility: visible !important;
                        transform: translateY(0) !important;
                    }
                    .mobile-nav-link {
                        color: #FFFFF0 !important;
                        font-size: 1.25rem;
                        opacity: 0 !important;
                        transform: translateY(20px) !important;
                    }
                    .mobile-menu.active .mobile-nav-link {
                        opacity: 1 !important;
                        transform: translateY(0) !important;
                    }
                    .mobile-menu-footer {
                        opacity: 0 !important;
                    }
                    .mobile-menu.active .mobile-menu-footer {
                        opacity: 1 !important;
                    }
                ` }} />
                {/* JSON-LD Organization Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Organization',
                            name: 'Hỷ Lạc Việt',
                            url: 'https://hylacviet.vn',
                            logo: 'https://hylacviet.vn/images/logo.png',
                            description: 'Áo dài & pháp phục cao cấp — may đo thủ công từ lụa tơ tằm, gấm nhung.',
                            contactPoint: {
                                '@type': 'ContactPoint',
                                telephone: '+84-912-503-456',
                                contactType: 'customer service',
                                availableLanguage: 'Vietnamese',
                            },
                            address: {
                                '@type': 'PostalAddress',
                                addressLocality: 'Hà Nội',
                                addressCountry: 'VN',
                            },
                            sameAs: [
                                'https://facebook.com/hylacviet',
                                'https://instagram.com/hylacviet',
                                'https://youtube.com/hylacviet',
                            ],
                        }),
                    }}
                />
            </head>
            <body>
                {/* Page Transition Loading Bar - Gold */}
                <NextTopLoader
                    color="#D4AF37"
                    initialPosition={0.08}
                    crawlSpeed={200}
                    height={2}
                    crawl={true}
                    showSpinner={false}
                    easing="ease"
                    speed={200}
                    shadow="0 0 10px #D4AF37, 0 0 5px #D4AF37"
                />

                <LayoutEffects />
                <Header />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}

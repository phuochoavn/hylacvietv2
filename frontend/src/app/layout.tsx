import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import '@/styles/main.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Preloader from '@/components/effects/Preloader';
import CustomCursor from '@/components/effects/CustomCursor';
import SmoothScroll from '@/components/effects/SmoothScroll';
import ScrollProgress from '@/components/effects/ScrollProgress';
import FloatingContactButtons from '@/components/ui/FloatingContactButtons';

// API URL for server-side fetch
const API_URL = process.env.API_URL || 'http://hylacviet-api:3000';

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
        <html lang="vi">
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
                <Preloader />
                <CustomCursor />
                <SmoothScroll />
                <ScrollProgress />
                <Header />
                <main>{children}</main>
                <Footer />
                <FloatingContactButtons />
            </body>
        </html>
    );
}

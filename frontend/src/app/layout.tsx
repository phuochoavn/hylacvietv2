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

export const metadata: Metadata = {
    title: 'Hỷ Lạc Việt - Áo Dài & Pháp Phục Cao Cấp',
    description: 'Nơi nghệ thuật áo dài truyền thống hội tụ cùng tâm huyết của những nghệ nhân lành nghề. Mỗi tác phẩm là một câu chuyện văn hóa được thêu dệt bằng sự tinh tế.',
    keywords: ['áo dài', 'pháp phục', 'áo dài cao cấp', 'áo dài Việt Nam', 'hỷ lạc việt', 'áo dài cưới', 'may áo dài'],
    openGraph: {
        title: 'Hỷ Lạc Việt - Áo Dài & Pháp Phục Cao Cấp',
        description: 'Nơi nghệ thuật áo dài truyền thống hội tụ cùng tâm huyết của những nghệ nhân lành nghề',
        type: 'website',
        locale: 'vi_VN',
    },
};

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

import type { Metadata } from 'next';
import '@/styles/main.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Preloader from '@/components/effects/Preloader';
import CustomCursor from '@/components/effects/CustomCursor';
import SmoothScroll from '@/components/effects/SmoothScroll';
import ScrollProgress from '@/components/effects/ScrollProgress';

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
                <Preloader />
                <CustomCursor />
                <SmoothScroll />
                <ScrollProgress />
                <Header />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}

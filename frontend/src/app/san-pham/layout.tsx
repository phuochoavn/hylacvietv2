import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sản Phẩm | Hỷ Lạc Việt - Bộ Sưu Tập Áo Dài & Pháp Phục',
    description: 'Khám phá bộ sưu tập áo dài và pháp phục cao cấp Hỷ Lạc Việt. Áo dài ngũ thân, áo dài cưới, pháp phục linen — tất cả may đo thủ công bằng lụa tơ tằm và gấm nhung.',
    keywords: ['sản phẩm áo dài', 'áo dài cao cấp', 'bộ sưu tập áo dài', 'áo dài ngũ thân', 'áo dài cưới', 'pháp phục linen', 'áo dài hỷ lạc việt'],
    openGraph: {
        title: 'Bộ Sưu Tập | Hỷ Lạc Việt',
        description: 'Bộ sưu tập áo dài & pháp phục cao cấp — may đo thủ công từ lụa tơ tằm, gấm nhung.',
        url: 'https://hylacviet.vn/san-pham',
        type: 'website',
        locale: 'vi_VN',
        siteName: 'Hỷ Lạc Việt',
    },
    alternates: {
        canonical: 'https://hylacviet.vn/san-pham',
    },
};

export default function SanPhamLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

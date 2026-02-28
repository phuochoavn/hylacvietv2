import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Liên Hệ | Hỷ Lạc Việt - Đặt Lịch Tư Vấn Áo Dài',
    description: 'Liên hệ Hỷ Lạc Việt để đặt lịch tư vấn và may đo áo dài cao cấp. Showroom tại Hà Nội. Hotline: 0912 503 456. Đón khách 8:00 - 20:00, Thứ 2 - Thứ 7.',
    keywords: ['liên hệ hỷ lạc việt', 'đặt lịch may áo dài', 'showroom áo dài hà nội', 'tư vấn áo dài', 'may đo áo dài'],
    openGraph: {
        title: 'Liên Hệ | Hỷ Lạc Việt',
        description: 'Đặt lịch tư vấn may đo áo dài cao cấp. Showroom Hà Nội — Hotline: 0912 503 456.',
        url: 'https://hylacviet.vn/lien-he',
        type: 'website',
        locale: 'vi_VN',
        siteName: 'Hỷ Lạc Việt',
    },
    alternates: {
        canonical: 'https://hylacviet.vn/lien-he',
    },
};

export default function LienHeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

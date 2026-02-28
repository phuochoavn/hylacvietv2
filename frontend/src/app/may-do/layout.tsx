import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'May Đo Áo Dài | Hỷ Lạc Việt - Bespoke Tailoring Cao Cấp',
    description: 'Dịch vụ may đo áo dài theo yêu cầu. 5 bước kiến tạo tác phẩm độc bản: tư vấn, đo số, chọn chất liệu, thêu tay, hoàn thiện. Chất liệu lụa tơ tằm, gấm nhung cao cấp.',
    keywords: ['may đo áo dài', 'áo dài theo yêu cầu', 'bespoke áo dài', 'may áo dài cao cấp', 'thêu tay áo dài', 'áo dài lụa tơ tằm'],
    openGraph: {
        title: 'May Đo Áo Dài | Hỷ Lạc Việt',
        description: 'Dịch vụ may đo áo dài bespoke — 5 bước kiến tạo tác phẩm độc bản từ lụa tơ tằm, gấm nhung cao cấp.',
        url: 'https://hylacviet.vn/may-do',
        type: 'website',
        locale: 'vi_VN',
        siteName: 'Hỷ Lạc Việt',
    },
    alternates: {
        canonical: 'https://hylacviet.vn/may-do',
    },
};

export default function MayDoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

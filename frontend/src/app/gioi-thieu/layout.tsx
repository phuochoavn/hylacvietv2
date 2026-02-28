import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Giới Thiệu | Hỷ Lạc Việt - Câu Chuyện Áo Dài Cao Cấp',
    description: 'Hành trình gìn giữ và phát triển nghệ thuật áo dài Việt Nam. Từ năm 2018, Hỷ Lạc Việt đã kiến tạo hàng nghìn tác phẩm áo dài cao cấp bằng tay nghề thủ công tinh xảo.',
    keywords: ['giới thiệu hỷ lạc việt', 'câu chuyện áo dài', 'nghệ nhân áo dài', 'thương hiệu áo dài Việt Nam', 'áo dài thủ công'],
    openGraph: {
        title: 'Giới Thiệu | Hỷ Lạc Việt',
        description: 'Hành trình gìn giữ và phát triển nghệ thuật áo dài Việt Nam từ năm 2018.',
        url: 'https://hylacviet.vn/gioi-thieu',
        type: 'website',
        locale: 'vi_VN',
        siteName: 'Hỷ Lạc Việt',
    },
    alternates: {
        canonical: 'https://hylacviet.vn/gioi-thieu',
    },
};

export default function GioiThieuLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

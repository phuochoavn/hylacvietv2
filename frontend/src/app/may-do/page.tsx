'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MayDoPage() {
    return (
        <main className="page-container">
            <motion.section
                className="page-hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1>May Đo Theo Yêu Cầu</h1>
                <p className="page-subtitle">Tạo nên tác phẩm áo dài riêng của bạn</p>
            </motion.section>

            <motion.section
                className="page-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
            >
                <div className="content-block">
                    <h2>Dịch Vụ May Đo</h2>
                    <p>
                        Với đội ngũ nghệ nhân lành nghề và hơn 20 năm kinh nghiệm, Hỷ Lạc Việt mang đến
                        dịch vụ may đo áo dài cao cấp theo yêu cầu. Mỗi sản phẩm được thiết kế riêng biệt,
                        phù hợp với vóc dáng và phong cách của từng khách hàng.
                    </p>
                </div>

                <div className="content-block">
                    <h2>Quy Trình May Đo</h2>
                    <ul>
                        <li><strong>Bước 1:</strong> Tư vấn và lựa chọn mẫu thiết kế</li>
                        <li><strong>Bước 2:</strong> Đo số và lấy thông số cơ thể</li>
                        <li><strong>Bước 3:</strong> Lựa chọn chất liệu vải và phụ kiện</li>
                        <li><strong>Bước 4:</strong> May mẫu và thử lần 1</li>
                        <li><strong>Bước 5:</strong> Hoàn thiện và bàn giao</li>
                    </ul>
                </div>

                <div className="content-block">
                    <h2>Liên Hệ Đặt May</h2>
                    <p>
                        Để được tư vấn chi tiết về dịch vụ may đo, vui lòng liên hệ với chúng tôi qua Zalo
                        hoặc đến trực tiếp showroom.
                    </p>
                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <a
                            href="https://zalo.me/hylacviet"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            Tư Vấn Qua Zalo
                        </a>
                        <Link href="/contact" className="btn btn-outline">
                            Xem Thông Tin Liên Hệ
                        </Link>
                    </div>
                </div>
            </motion.section>
        </main>
    );
}

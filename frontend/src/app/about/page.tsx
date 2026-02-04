'use client';

import { motion } from 'framer-motion';

export default function AboutPage() {
    return (
        <main className="page-container">
            <motion.section
                className="page-hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1>Giới Thiệu</h1>
                <p className="page-subtitle">Câu chuyện Hỷ Lạc Việt</p>
            </motion.section>

            <motion.section
                className="page-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
            >
                <div className="content-block">
                    <h2>Về Chúng Tôi</h2>
                    <p>
                        Hỷ Lạc Việt được thành lập từ năm 2018 tại Hà Nội, với tâm nguyện bảo tồn và phát huy
                        vẻ đẹp truyền thống của áo dài Việt Nam. Mỗi sản phẩm của chúng tôi đều được thực hiện
                        bởi những nghệ nhân lành nghề, kết hợp giữa kỹ thuật thủ công tinh xảo và thiết kế hiện đại.
                    </p>
                </div>

                <div className="content-block">
                    <h2>Sứ Mệnh</h2>
                    <p>
                        Chúng tôi mong muốn mang đến cho khách hàng những tác phẩm áo dài và pháp phục cao cấp,
                        thể hiện đẳng cấp và tinh hoa văn hóa Việt Nam trong từng đường kim mũi chỉ.
                    </p>
                </div>

                <div className="content-block">
                    <h2>Giá Trị Cốt Lõi</h2>
                    <ul>
                        <li><strong>Chất lượng:</strong> Sử dụng chất liệu cao cấp, thủ công tỉ mỉ</li>
                        <li><strong>Truyền thống:</strong> Bảo tồn và phát huy văn hóa Việt</li>
                        <li><strong>Sáng tạo:</strong> Kết hợp nét đẹp cổ điển với xu hướng hiện đại</li>
                        <li><strong>Tận tâm:</strong> Phục vụ khách hàng như người thân</li>
                    </ul>
                </div>
            </motion.section>
        </main>
    );
}

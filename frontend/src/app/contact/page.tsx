'use client';

import { motion } from 'framer-motion';

export default function ContactPage() {
    return (
        <main className="page-container">
            <motion.section
                className="page-hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1>Liên Hệ</h1>
                <p className="page-subtitle">Kết nối với Hỷ Lạc Việt</p>
            </motion.section>

            <motion.section
                className="page-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
            >
                <div className="contact-grid">
                    <div className="content-block">
                        <h2>Thông Tin Liên Hệ</h2>
                        <div className="contact-info">
                            <p><strong>Địa chỉ:</strong> Hà Nội, Việt Nam</p>
                            <p><strong>Điện thoại:</strong> <a href="tel:+84123456789">+84 123 456 789</a></p>
                            <p><strong>Email:</strong> <a href="mailto:info@hylacviet.vn">info@hylacviet.vn</a></p>
                            <p><strong>Zalo:</strong> <a href="https://zalo.me/hylacviet" target="_blank" rel="noopener noreferrer">Hỷ Lạc Việt</a></p>
                        </div>
                    </div>

                    <div className="content-block">
                        <h2>Giờ Làm Việc</h2>
                        <div className="work-hours">
                            <p><strong>Thứ 2 - Thứ 6:</strong> 8:00 - 18:00</p>
                            <p><strong>Thứ 7:</strong> 8:00 - 12:00</p>
                            <p><strong>Chủ nhật:</strong> Nghỉ</p>
                        </div>
                    </div>

                    <div className="content-block">
                        <h2>Kết Nối Với Chúng Tôi</h2>
                        <p>
                            Hãy liên hệ với chúng tôi qua Zalo để được tư vấn nhanh nhất về các sản phẩm
                            áo dài và pháp phục cao cấp.
                        </p>
                        <a
                            href="https://zalo.me/hylacviet"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{ marginTop: '1rem', display: 'inline-block' }}
                        >
                            Tư Vấn Qua Zalo
                        </a>
                    </div>
                </div>
            </motion.section>
        </main>
    );
}

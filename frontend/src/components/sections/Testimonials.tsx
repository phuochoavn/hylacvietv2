'use client';

import { motion } from 'framer-motion';

const testimonials = [
    {
        id: 1,
        quote: 'Áo dài cưới của tôi từ Hỷ Lạc Việt đẹp hoàn hảo. Từng đường thêu, từng chi tiết đều được chăm chút tỉ mỉ. Đó là bộ đồ đẹp nhất tôi từng mặc.',
        name: 'Minh Anh',
        title: 'Khách hàng áo dài cưới',
    },
    {
        id: 2,
        quote: 'Chất lượng vải lụa và kỹ thuật thêu tay của Hỷ Lạc Việt thực sự xuất sắc. Tôi đã đặt may 3 bộ và bộ nào cũng vượt mong đợi.',
        name: 'Thu Hà',
        title: 'Khách hàng thân thiết',
    },
    {
        id: 3,
        quote: 'Bộ pháp phục linen tôi đặt may cho mẹ nhân dịp lễ Vu Lan đã khiến mẹ rất xúc động. Cảm ơn sự tận tâm của đội ngũ Hỷ Lạc Việt.',
        name: 'Quốc Đạt',
        title: 'Khách hàng pháp phục',
    },
];

export default function Testimonials() {
    return (
        <section className="testimonials-premium">
            <div className="testimonials-container">
                {/* Header - Changed to "Lưu Bút" */}
                <motion.div
                    className="testimonials-header"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <span className="section-label-premium">Tri Ân & Sẻ Chia</span>
                    <h2 className="testimonials-title">
                        <span className="title-accent">Lưu Bút</span>
                    </h2>
                </motion.div>

                {/* Testimonials Grid - Transparent cards, no avatar, no stars */}
                <div className="testimonials-grid">
                    {testimonials.map((item, index) => (
                        <motion.article
                            key={item.id}
                            className="testimonial-card"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            viewport={{ once: true }}
                        >
                            {/* Large decorative quote watermark */}
                            <div className="card-quote-watermark">"</div>

                            {/* Quote text - Italic Serif style */}
                            <p className="card-quote">{item.quote}</p>

                            {/* Author info - No avatar, just name and title */}
                            <div className="card-author">
                                <div className="author-signature">
                                    <span className="author-dash">—</span>
                                    <div className="author-info">
                                        <h4>{item.name}</h4>
                                        <span>{item.title}</span>
                                    </div>
                                </div>
                            </div>
                            {/* No stars - removed */}
                        </motion.article>
                    ))}
                </div>

                {/* Social Proof - Serif font for numbers */}
                <motion.div
                    className="social-proof"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <div className="proof-item">
                        <span className="proof-number">500+</span>
                        <span className="proof-label">Khách hàng hài lòng</span>
                    </div>
                    <div className="proof-divider" />
                    <div className="proof-item">
                        <span className="proof-number">4.9</span>
                        <span className="proof-label">Đánh giá trung bình</span>
                    </div>
                    <div className="proof-divider" />
                    <div className="proof-item">
                        <span className="proof-number">98%</span>
                        <span className="proof-label">Khách quay lại</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

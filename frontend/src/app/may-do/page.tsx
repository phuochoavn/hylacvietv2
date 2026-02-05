'use client';
// REBUILD TRIGGER: 2026-02-05T08:54

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import '@/styles/bespoke.css';

const journeySteps = [
    {
        number: '01',
        title: 'Tư Vấn & Cảm Hứng',
        desc: 'Gặp gỡ nhà thiết kế để chia sẻ ý tưởng, phong cách sống và dịp đặc biệt bạn muốn tỏa sáng. Chúng tôi lắng nghe và thấu hiểu.'
    },
    {
        number: '02',
        title: 'Đo Số Thể Hình',
        desc: 'Hơn 20 thông số được đo chính xác đến từng milimet. Mỗi đường cong cơ thể đều được ghi nhận để tạo nên sự vừa vặn hoàn hảo.'
    },
    {
        number: '03',
        title: 'Chọn Chất Liệu',
        desc: 'Lựa chọn từ bộ sưu tập vải lụa tơ tằm, gấm nhung và linen cao cấp. Mỗi loại vải kể một câu chuyện riêng.'
    },
    {
        number: '04',
        title: 'Thêu & Nung Nọt',
        desc: 'Nghệ nhân tỉ mỉ thêu tay từng họa tiết, từng đường kim. Đây là nơi nghệ thuật và tâm hồn hòa quyện.'
    },
    {
        number: '05',
        title: 'Hoàn Thiện Tác Phẩm',
        desc: 'Sau hai lần thử đồ và điều chỉnh, tác phẩm độc bản của bạn được hoàn thiện — sẵn sàng tỏa sáng.'
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } }
};

export default function MayDoPage() {
    return (
        <main className="bespoke-page">
            {/* Hero Section */}
            <section className="bespoke-hero">
                <div className="bespoke-hero-bg" />

                <motion.div
                    className="bespoke-hero-content"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.p className="bespoke-overline" variants={fadeUp}>
                        Bespoke Tailoring
                    </motion.p>
                    <motion.h1 className="bespoke-title" variants={fadeUp}>
                        Kiến Tạo<br />
                        <em>Tác Phẩm Độc Bản</em>
                    </motion.h1>
                    <motion.p className="bespoke-subtitle" variants={fadeUp}>
                        Một chiếc áo dài không chỉ để mặc — mà để kể câu chuyện của riêng bạn.
                        Từ bản phác thảo đầu tiên đến đường kim cuối cùng.
                    </motion.p>
                </motion.div>

                <div className="bespoke-scroll-hint">
                    <span>Khám phá</span>
                    <div className="bespoke-scroll-line" />
                </div>
            </section>

            {/* Split Section - The Philosophy */}
            <motion.section
                className="bespoke-split"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
            >
                <div className="bespoke-split-container">
                    <motion.div className="bespoke-split-image" variants={fadeUp}>
                        <Image
                            src="/images/craft-measuring.webp"
                            alt="Nghệ nhân đo số"
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    </motion.div>
                    <motion.div className="bespoke-split-content" variants={fadeUp}>
                        <span className="bespoke-split-number">01</span>
                        <h2 className="bespoke-split-heading">
                            Nghệ Thuật<br />
                            Của Sự Vừa Vặn
                        </h2>
                        <p className="bespoke-split-text">
                            Với hơn 20 năm kinh nghiệm, đội ngũ nghệ nhân Hỷ Lạc Việt hiểu rằng
                            mỗi nét đường cong đều là duy nhất. Chúng tôi không may áo —
                            chúng tôi kiến tạo tác phẩm nghệ thuật mang hơi thở và linh hồn của người mặc.
                        </p>
                    </motion.div>
                </div>
            </motion.section>

            {/* Split Section - Reverse */}
            <motion.section
                className="bespoke-split"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
            >
                <div className="bespoke-split-container reverse">
                    <motion.div className="bespoke-split-image" variants={fadeUp}>
                        <Image
                            src="/images/craft-embroidery.webp"
                            alt="Thêu tay tinh xảo"
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    </motion.div>
                    <motion.div className="bespoke-split-content" variants={fadeUp}>
                        <span className="bespoke-split-number">02</span>
                        <h2 className="bespoke-split-heading">
                            Thêu Tay —<br />
                            Di Sản Thủ Công
                        </h2>
                        <p className="bespoke-split-text">
                            Mỗi họa tiết thêu là hàng nghìn đường kim, là sự kiên nhẫn và
                            lòng trân trọng nghề thủ công truyền thống. Không có hai tác phẩm
                            giống nhau — vì mỗi tác phẩm mang dấu ấn riêng của nghệ nhân.
                        </p>
                    </motion.div>
                </div>
            </motion.section>

            {/* Journey Timeline */}
            <section className="bespoke-journey">
                <motion.header
                    className="bespoke-journey-header"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                >
                    <motion.h2 className="bespoke-journey-title" variants={fadeUp}>
                        Hành Trình <em>Kiến Tạo</em>
                    </motion.h2>
                    <motion.p className="bespoke-journey-desc" variants={fadeUp}>
                        Từ ý tưởng đến hiện thực — 5 bước để sở hữu tác phẩm độc bản
                    </motion.p>
                </motion.header>

                <motion.div
                    className="bespoke-timeline"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                >
                    {journeySteps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            className="bespoke-step"
                            variants={fadeUp}
                        >
                            <div className="bespoke-step-content">
                                <h3 className="bespoke-step-title">{step.title}</h3>
                                <p className="bespoke-step-desc">{step.desc}</p>
                            </div>
                            <div className="bespoke-step-number">
                                <span>{step.number}</span>
                            </div>
                            <div className="bespoke-step-empty" />
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* CTA Section */}
            <motion.section
                className="bespoke-cta"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
            >
                <div className="bespoke-cta-content">
                    <motion.h2 className="bespoke-cta-heading" variants={fadeUp}>
                        Sẵn Sàng Bắt Đầu<br />
                        <em>Câu Chuyện Của Bạn?</em>
                    </motion.h2>
                    <motion.p className="bespoke-cta-text" variants={fadeUp}>
                        Đặt lịch tư vấn cùng nhà thiết kế để khởi đầu hành trình
                    </motion.p>
                    <motion.div variants={fadeUp}>
                        <a
                            href="https://zalo.me/0912503456"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bespoke-btn-primary"
                        >
                            Đặt Lịch Hẹn Với NTK
                        </a>
                        <div>
                            <a
                                href="https://zalo.me/0912503456"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bespoke-link-secondary"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.49 10.272v-.45h1.347v6.322h-.77a.58.58 0 01-.577-.577v-.072a2.4 2.4 0 01-1.907.843 2.554 2.554 0 01-1.848-.753 2.968 2.968 0 01-.764-2.1 2.97 2.97 0 01.794-2.136 2.543 2.543 0 011.818-.748 2.5 2.5 0 011.907.671zm-.104 4.367a1.61 1.61 0 001.172-.485 1.777 1.777 0 00.469-1.287 1.809 1.809 0 00-.469-1.294 1.593 1.593 0 00-1.172-.494 1.593 1.593 0 00-1.171.494 1.8 1.8 0 00-.47 1.294 1.77 1.77 0 00.47 1.287 1.61 1.61 0 001.171.485z" />
                                </svg>
                                Chat ngay qua Zalo
                            </a>
                        </div>
                    </motion.div>
                </div>
            </motion.section>
        </main>
    );
}

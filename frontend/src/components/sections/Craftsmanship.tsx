'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface StepData {
    number: string;
    title: string;
    titleEn: string;
    desc: string;
    image: string;
}

function toRelativeUrl(url: string): string {
    if (!url) return url;
    try {
        const u = new URL(url);
        if (u.hostname.endsWith('hylacviet.vn')) return u.pathname + u.search;
    } catch { /* not a valid URL */ }
    return url;
}

const defaultSteps: StepData[] = [
    {
        number: '01',
        title: 'Tư Vấn',
        titleEn: 'Consultation',
        desc: 'Lắng nghe mong muốn, tư vấn kiểu dáng và chất liệu phù hợp với vóc dáng.',
        image: '/images/craft-fabric.webp',
    },
    {
        number: '02',
        title: 'Thiết Kế',
        titleEn: 'Design',
        desc: 'Phác thảo mẫu riêng, chọn họa tiết thêu và phối màu theo ý tưởng.',
        image: '/images/craft-embroidery.webp',
    },
    {
        number: '03',
        title: 'Hoàn Thiện',
        titleEn: 'Finishing',
        desc: 'Kiểm tra chất lượng, điều chỉnh size và bàn giao tác phẩm.',
        image: '/images/craft-final.webp',
    },
];

export default function Craftsmanship() {
    const containerRef = useRef<HTMLElement>(null);
    const [steps, setSteps] = useState<StepData[]>(defaultSteps);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                if (data.success && data.data) {
                    const s: Record<string, string> = {};
                    for (const item of data.data) {
                        s[item.key] = item.value;
                    }

                    const fetched: StepData[] = [
                        {
                            number: '01',
                            title: s.step1_title || defaultSteps[0].title,
                            titleEn: s.step1_subtitle || defaultSteps[0].titleEn,
                            desc: s.step1_desc || defaultSteps[0].desc,
                            image: toRelativeUrl(s.craft_step1_image || s.step1_image || '') || defaultSteps[0].image,
                        },
                        {
                            number: '02',
                            title: s.step2_title || defaultSteps[1].title,
                            titleEn: s.step2_subtitle || defaultSteps[1].titleEn,
                            desc: s.step2_desc || defaultSteps[1].desc,
                            image: toRelativeUrl(s.craft_step2_image || s.step2_image || '') || defaultSteps[1].image,
                        },
                        {
                            number: '03',
                            title: s.step3_title || defaultSteps[2].title,
                            titleEn: s.step3_subtitle || defaultSteps[2].titleEn,
                            desc: s.step3_desc || defaultSteps[2].desc,
                            image: toRelativeUrl(s.craft_step3_image || s.step3_image || '') || defaultSteps[2].image,
                        },
                    ];
                    setSteps(fetched);
                }
            } catch (e) {
                console.error('Failed to fetch craftsmanship settings:', e);
            }
        }
        fetchSettings();
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%']);

    return (
        <section ref={containerRef} className="craftsmanship-premium">
            {/* Background */}
            <div className="craft-bg">
                <div className="craft-bg-overlay" />
            </div>

            <div className="craft-container">
                {/* Header */}
                <motion.div
                    className="craft-header"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <span className="section-label-premium light">Quy Trình</span>
                    <h2 className="craft-title">
                        Nghệ Thuật<br />
                        <span className="title-accent">Tay Nghề</span>
                    </h2>
                    <p className="craft-subtitle">
                        Hành trình từ ý tưởng đến tác phẩm hoàn thiện
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="craft-timeline">
                    {/* Progress Line */}
                    <div className="timeline-track">
                        <motion.div
                            className="timeline-progress"
                            style={{ height: lineHeight }}
                        />
                    </div>

                    {/* Steps */}
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className={`timeline-step ${index % 2 === 0 ? 'left' : 'right'}`}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: index * 0.15 }}
                            viewport={{ once: true, margin: '-100px' }}
                        >
                            <div className="step-content">
                                <div className="step-number">{step.number}</div>
                                <div className="step-text">
                                    <h3>{step.title}</h3>
                                    <span className="step-title-en">{step.titleEn}</span>
                                    <p>{step.desc}</p>
                                </div>
                            </div>
                            <div className="step-image">
                                <img
                                    src={step.image}
                                    alt={step.title}
                                    className="step-img"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    loading="lazy"
                                />
                            </div>
                            <div className="step-dot" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ProcessSettings {
    step1_title?: string;
    step1_subtitle?: string;
    step1_desc?: string;
    step1_image?: string;
    step2_title?: string;
    step2_subtitle?: string;
    step2_desc?: string;
    step2_image?: string;
    step3_title?: string;
    step3_subtitle?: string;
    step3_desc?: string;
    step3_image?: string;
    step4_title?: string;
    step4_subtitle?: string;
    step4_desc?: string;
    step4_image?: string;
    process_label?: string;
    process_title?: string;
    process_subtitle?: string;
}

const defaultSteps = [
    {
        number: '01',
        title: 'Tư Vấn',
        titleEn: 'Consultation',
        desc: 'Lắng nghe mong muốn, tư vấn kiểu dáng và chất liệu phù hợp với vóc dáng.',
        image: '/images/craft/step-1.jpg',
    },
    {
        number: '02',
        title: 'Thiết Kế',
        titleEn: 'Design',
        desc: 'Phác thảo mẫu riêng, chọn họa tiết thêu và phối màu theo ý tưởng.',
        image: '/images/craft/step-2.jpg',
    },
    {
        number: '03',
        title: 'Thêu Tay',
        titleEn: 'Handcraft',
        desc: 'Nghệ nhân thêu tay từng chi tiết với kỹ thuật truyền thống.',
        image: '/images/craft/step-3.jpg',
    },
    {
        number: '04',
        title: 'Hoàn Thiện',
        titleEn: 'Finishing',
        desc: 'Kiểm tra chất lượng, điều chỉnh size và bàn giao tác phẩm.',
        image: '/images/craft/step-4.jpg',
    },
];

export default function Craftsmanship() {
    const containerRef = useRef<HTMLElement>(null);
    const [settings, setSettings] = useState<ProcessSettings>({});
    const [isLoaded, setIsLoaded] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%']);

    // Fetch settings from API
    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    const settingsMap: ProcessSettings = {};
                    for (const item of data.data) {
                        settingsMap[item.key as keyof ProcessSettings] = item.value;
                    }
                    setSettings(settingsMap);
                }
            } catch (e) {
                console.error('Failed to fetch settings:', e);
            } finally {
                setIsLoaded(true);
            }
        }
        fetchSettings();
    }, []);

    // Build steps from API settings or use defaults
    const steps = [
        {
            number: '01',
            title: settings.step1_title || defaultSteps[0].title,
            titleEn: settings.step1_subtitle || defaultSteps[0].titleEn,
            desc: settings.step1_desc || defaultSteps[0].desc,
            image: settings.step1_image || defaultSteps[0].image,
        },
        {
            number: '02',
            title: settings.step2_title || defaultSteps[1].title,
            titleEn: settings.step2_subtitle || defaultSteps[1].titleEn,
            desc: settings.step2_desc || defaultSteps[1].desc,
            image: settings.step2_image || defaultSteps[1].image,
        },
        {
            number: '03',
            title: settings.step3_title || defaultSteps[2].title,
            titleEn: settings.step3_subtitle || defaultSteps[2].titleEn,
            desc: settings.step3_desc || defaultSteps[2].desc,
            image: settings.step3_image || defaultSteps[2].image,
        },
        {
            number: '04',
            title: settings.step4_title || defaultSteps[3].title,
            titleEn: settings.step4_subtitle || defaultSteps[3].titleEn,
            desc: settings.step4_desc || defaultSteps[3].desc,
            image: settings.step4_image || defaultSteps[3].image,
        },
    ];

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
                    <span className="section-label-premium light">
                        {settings.process_label || 'Quy Trình'}
                    </span>
                    <h2 className="craft-title">
                        Nghệ Thuật<br />
                        <span className="title-accent">Tay Nghề</span>
                    </h2>
                    <p className="craft-subtitle">
                        {settings.process_subtitle || 'Hành trình từ ý tưởng đến tác phẩm hoàn thiện'}
                    </p>
                </motion.div>

                {/* Timeline */}
                {isLoaded && (
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
                                    {step.image && (
                                        <Image
                                            src={step.image}
                                            alt={step.title}
                                            width={350}
                                            height={450}
                                            className="step-img"
                                        />
                                    )}
                                </div>
                                <div className="step-dot" />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

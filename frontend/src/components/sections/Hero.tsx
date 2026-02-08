'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import Button from '@/components/core/Button';
import BrandLogoText from '@/components/core/BrandLogoText';
import { SITE } from '@/lib/constants';

// Static content — no API needed
const content = {
    label: 'Since 2026 • Hà Nội',
    title: 'Hỷ Lạc Việt',
    tagline: 'Áo Dài & Pháp Phục Cao Cấp',
    description: 'Nơi nghệ thuật áo dài truyền thống hội tụ cùng tâm huyết của những nghệ nhân lành nghề. Mỗi tác phẩm là một câu chuyện văn hóa được thêu dệt bằng sự tinh tế.',
    ctaText: 'Khám Phá Bộ Sưu Tập',
};

const heroSlides = [
    { id: 1, image: '/images/hero/aodai-1.webp', title: 'Áo Dài Ngũ Thân', subtitle: 'Tinh hoa cổ truyền' },
    { id: 2, image: '/images/hero/aodai-2.webp', title: 'Áo Dài Cưới', subtitle: 'Ngày trọng đại' },
    { id: 3, image: '/images/hero/aodai-3.webp', title: 'Pháp Phục Linen', subtitle: 'Thiền định cao quý' },
];

// Marquee gallery — static images from /public/images/
const marqueeCol1 = [
    { id: 1, image: '/images/gallery-red-nonla.webp' },
    { id: 2, image: '/images/gallery-white-lotus.webp' },
    { id: 3, image: '/images/gallery-blue-fan.webp' },
    { id: 4, image: '/images/gallery-green-kids.webp' },
];

const marqueeCol2 = [
    { id: 1, image: '/images/gallery-red-street.webp' },
    { id: 2, image: '/images/gallery-white-lake.webp' },
    { id: 3, image: '/images/craft-embroidery.webp' },
    { id: 4, image: '/images/craft-measuring.webp' },
];

export default function Hero() {
    const containerRef = useRef<HTMLElement>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Parallax scroll
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
    const springScale = useSpring(scale, springConfig);

    // Auto-rotate slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Mouse parallax effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            setMousePosition({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <>
            <section ref={containerRef} className="hero-premium">
                {/* Background Layer with Parallax */}
                <motion.div
                    className="hero-bg-layer"
                    style={{
                        x: mousePosition.x * -0.5,
                        y: mousePosition.y * -0.5,
                    }}
                >
                    <AnimatePresence mode="sync">
                        <motion.div
                            key={currentSlide}
                            className="hero-bg-image"
                            initial={{ opacity: 0, scale: 1 }}
                            animate={{
                                opacity: 1,
                                scale: [1, 1.08, 1],
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                                opacity: { duration: 1.5, ease: [0.22, 1, 0.36, 1] },
                                scale: {
                                    duration: 20,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    ease: "easeInOut",
                                },
                            }}
                        >
                            <Image
                                src={heroSlides[currentSlide]?.image || heroSlides[0].image}
                                alt={heroSlides[currentSlide]?.title || 'Hero'}
                                fill
                                priority
                                quality={90}
                                className="hero-bg-img"
                                sizes="100vw"
                                style={{ objectFit: 'cover' }}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Gradient Overlays */}
                    <div className="hero-gradient-overlay" />
                    <div className="hero-vignette" />
                </motion.div>

                {/* Floating Particles */}
                <div className="hero-particles">
                    {[
                        { left: 15, top: 20 }, { left: 35, top: 60 }, { left: 55, top: 30 },
                        { left: 75, top: 70 }, { left: 25, top: 45 }, { left: 85, top: 15 },
                        { left: 45, top: 80 }, { left: 65, top: 25 }, { left: 20, top: 65 },
                        { left: 80, top: 50 }, { left: 40, top: 10 }, { left: 60, top: 85 },
                        { left: 30, top: 35 }, { left: 70, top: 55 }, { left: 50, top: 40 },
                    ].map((pos, i) => (
                        <motion.div
                            key={i}
                            className="particle"
                            animate={{
                                y: [-20, 20, -20],
                                x: [-10, 10, -10],
                                opacity: [0.2, 0.6, 0.2],
                            }}
                            transition={{
                                duration: 4 + (i % 5),
                                repeat: Infinity,
                                delay: i * 0.3,
                                ease: 'easeInOut',
                            }}
                            style={{
                                left: `${pos.left}%`,
                                top: `${pos.top}%`,
                            }}
                        />
                    ))}
                </div>

                {/* Main Content */}
                <motion.div
                    className="hero-content-wrapper"
                    style={{ opacity }}
                >
                    <div className="hero-content-inner">
                        {/* Left: Typography */}
                        <motion.div
                            className="hero-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            style={{
                                transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
                            }}
                        >
                            <motion.h1
                                className="hero-title-main"
                                initial={{ opacity: 0, y: 60, clipPath: 'inset(100% 0 0 0)' }}
                                animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }}
                                transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <span className="title-line"><BrandLogoText height={100} /></span>
                            </motion.h1>

                            <motion.p
                                className="hero-tagline"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1.4 }}
                            >
                                {content.tagline}
                            </motion.p>

                            <motion.div
                                className="hero-description"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1.6 }}
                            >
                                <p>{content.description}</p>
                            </motion.div>

                            <motion.span
                                className="hero-label"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1.7 }}
                            >
                                <span className="hero-label-line" />
                                {content.label}
                            </motion.span>

                            <motion.div
                                className="hero-cta-group"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1.8 }}
                            >
                                <Button href="/san-pham" variant="primary" size="lg" className="btn-glow">
                                    <svg className="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {content.ctaText}
                                </Button>
                                <Button href={SITE.zalo} variant="ghost" size="lg" external>
                                    <svg className="btn-icon" width="20" height="20" viewBox="0 0 50 50" fill="currentColor">
                                        <path d="M25 2C12.3 2 2 11.1 2 22.5c0 5.5 2.5 10.5 6.5 14.2L6 47l12-5.5c2.2.6 4.5 1 7 1C37.7 38.5 48 29.4 48 18 48 11.1 37.7 2 25 2zm-4 30l-7-7 2-2 5 5 10-10 2 2-12 12z" />
                                    </svg>
                                    Tư vấn Zalo
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Right: Bi-directional Vertical Marquee Gallery */}
                        <motion.div
                            className="hero-marquee-gallery"
                            initial={{ opacity: 0, x: 200, rotate: 0 }}
                            animate={{ opacity: 1, x: 0, rotate: 12 }}
                            transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {/* Column 1 - Scrolling Up */}
                            <div className="marquee-column">
                                <motion.div
                                    className="marquee-track marquee-up"
                                    animate={{ y: ['0%', '-50%'] }}
                                    transition={{
                                        y: {
                                            duration: 20,
                                            repeat: Infinity,
                                            repeatType: 'loop',
                                            ease: 'linear',
                                        },
                                    }}
                                >
                                    {/* Duplicate slides for seamless loop */}
                                    {[...marqueeCol1, ...marqueeCol1].map((slide, idx) => (
                                        <div
                                            key={`up-${idx}`}
                                            className={`marquee-card ${idx % marqueeCol1.length === currentSlide % marqueeCol1.length ? 'active' : ''}`}
                                            onClick={() => setCurrentSlide(idx % marqueeCol1.length)}
                                        >
                                            <div className="marquee-image">
                                                <Image
                                                    src={slide.image}
                                                    alt={'Marquee ' + idx}
                                                    fill
                                                    sizes="180px"
                                                    className="marquee-img"
                                                    loading="lazy"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                                <div className="marquee-overlay">
                                                    <span className="marquee-number">
                                                        {String((idx % marqueeCol1.length) + 1).padStart(2, '0')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>

                            {/* Column 2 - Scrolling Down */}
                            <div className="marquee-column">
                                <motion.div
                                    className="marquee-track marquee-down"
                                    animate={{ y: ['-50%', '0%'] }}
                                    transition={{
                                        y: {
                                            duration: 25,
                                            repeat: Infinity,
                                            repeatType: 'loop',
                                            ease: 'linear',
                                        },
                                    }}
                                >
                                    {/* Duplicate and reverse for variety */}
                                    {[...marqueeCol2, ...marqueeCol2].reverse().map((slide, idx) => (
                                        <div
                                            key={`down-${idx}`}
                                            className="marquee-card"
                                            onClick={() => setCurrentSlide(idx % marqueeCol2.length)}
                                        >
                                            <div className="marquee-image">
                                                <Image
                                                    src={slide.image}
                                                    alt={'Marquee ' + idx}
                                                    fill
                                                    sizes="500px"
                                                    className="marquee-img"
                                                    loading="lazy"
                                                    quality={90}
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        className="hero-scroll-indicator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 2.5 }}
                    >
                        <span>Cuộn xuống</span>
                        <motion.div
                            className="scroll-line"
                            animate={{ scaleY: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </motion.div>
                </motion.div>

                {/* Corner Decorations */}
                <div className="hero-corner hero-corner-tl" />
                <div className="hero-corner hero-corner-br" />
            </section>
            <div className="hero-spacer" />
        </>
    );
}

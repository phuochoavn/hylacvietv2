'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import Button from '@/components/core/Button';
import { SITE } from '@/lib/constants';

// Default content (fallback if API fails)
const defaultContent = {
    label: 'Since 2018 • Hà Nội',
    title: 'Hỷ Lạc Việt',
    tagline: 'Áo Dài & Pháp Phục Cao Cấp',
    description: 'Nơi nghệ thuật áo dài truyền thống hội tụ cùng tâm huyết của những nghệ nhân lành nghề. Mỗi tác phẩm là một câu chuyện văn hóa được thêu dệt bằng sự tinh tế.',
    ctaText: 'Khám Phá Bộ Sưu Tập',
};

const defaultSlides = [
    { id: 1, image: '/images/hero/aodai-1.webp', title: 'Áo Dài Ngũ Thân', subtitle: 'Tinh hoa cổ truyền' },
    { id: 2, image: '/images/hero/aodai-2.webp', title: 'Áo Dài Cưới', subtitle: 'Ngày trọng đại' },
    { id: 3, image: '/images/hero/aodai-3.webp', title: 'Pháp Phục Linen', subtitle: 'Thiền định cao quý' },
];

interface HeroSlide {
    id: number;
    image: string;
    title: string;
    subtitle: string;
}

interface HeroContent {
    label: string;
    title: string;
    tagline: string;
    description: string;
    ctaText: string;
}

export default function Hero() {
    const containerRef = useRef<HTMLElement>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(defaultSlides);
    const [content, setContent] = useState<HeroContent>(defaultContent);
    const [isLoaded, setIsLoaded] = useState(false);

    // 3 separate galleries
    const [heroBackgrounds, setHeroBackgrounds] = useState<{ id: number, image: string }[]>([]);
    const [marqueeCol1, setMarqueeCol1] = useState<{ id: number, image: string }[]>([]);
    const [marqueeCol2, setMarqueeCol2] = useState<{ id: number, image: string }[]>([]);

    // Fetch hero content and slides from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all settings
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && Array.isArray(data.data)) {
                        const settings: Record<string, string> = {};
                        for (const item of data.data) {
                            settings[item.key] = item.value;
                        }

                        // Update content from settings
                        setContent({
                            label: settings.hero_label || defaultContent.label,
                            title: settings.hero_title || settings.site_name || defaultContent.title,
                            tagline: settings.hero_tagline || settings.site_tagline || defaultContent.tagline,
                            description: settings.hero_description || defaultContent.description,
                            ctaText: settings.hero_cta_text || defaultContent.ctaText,
                        });

                        // Update slides from settings (legacy fallback)
                        if (settings.hero_slides) {
                            try {
                                const slidesData = JSON.parse(settings.hero_slides);
                                const slides: HeroSlide[] = slidesData
                                    .filter((s: any) => s.image)
                                    .map((s: any, idx: number) => ({
                                        id: idx + 1,
                                        image: s.image.startsWith('http') ? s.image : `https://hylacviet.vn${s.image}`,
                                        title: s.title || defaultSlides[idx]?.title || 'Hỷ Lạc Việt',
                                        subtitle: s.subtitle || defaultSlides[idx]?.subtitle || '',
                                    }));
                                if (slides.length > 0) {
                                    setHeroSlides(slides);
                                }
                            } catch (e) {
                                console.log('Using default slides');
                            }
                        }

                        // Load 3 separate galleries
                        const parseImages = (json: string) => {
                            try {
                                return JSON.parse(json)
                                    .filter((item: any) => item.image)
                                    .map((item: any) => ({
                                        id: item.id,
                                        image: item.image.startsWith('http') ? item.image : `https://hylacviet.vn${item.image}`
                                    }));
                            } catch { return []; }
                        };

                        if (settings.hero_backgrounds) {
                            const bgs = parseImages(settings.hero_backgrounds);
                            if (bgs.length > 0) setHeroBackgrounds(bgs);
                        }
                        if (settings.marquee_column1) {
                            const col1 = parseImages(settings.marquee_column1);
                            if (col1.length > 0) setMarqueeCol1(col1);
                        }
                        if (settings.marquee_column2) {
                            const col2 = parseImages(settings.marquee_column2);
                            if (col2.length > 0) setMarqueeCol2(col2);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch hero data:', error);
            } finally {
                setIsLoaded(true);
            }
        };
        fetchData();
    }, []);

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
    }, [heroSlides.length]);

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

    // Only split title if it's a short brand name (2-3 words like "Hỷ Lạc Việt")
    const titleWords = content.title.split(' ');
    const isShortTitle = titleWords.length >= 2 && titleWords.length <= 3;

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
                        {isLoaded && (
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
                                    src={(heroBackgrounds.length > 0 ? heroBackgrounds[currentSlide % heroBackgrounds.length]?.image : heroSlides[currentSlide]?.image) || defaultSlides[0].image}
                                    alt={heroSlides[currentSlide]?.title || 'Hero'}
                                    fill
                                    priority
                                    quality={90}
                                    className="hero-bg-img"
                                    sizes="100vw"
                                    style={{ objectFit: 'cover' }}
                                />
                            </motion.div>
                        )}
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
                            <motion.span
                                className="hero-label"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                            >
                                <span className="hero-label-line" />
                                {content.label}
                            </motion.span>

                            <motion.h1
                                className="hero-title-main"
                                initial={{ opacity: 0, y: 60, clipPath: 'inset(100% 0 0 0)' }}
                                animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }}
                                transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <span className="title-line">{content.title}</span>
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
                        {isLoaded && (marqueeCol1.length > 0 || marqueeCol2.length > 0) && (
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
                                        {[...(marqueeCol1.length > 0 ? marqueeCol1 : heroSlides), ...(marqueeCol1.length > 0 ? marqueeCol1 : heroSlides)].map((slide, idx) => {
                                            const itemsLen = marqueeCol1.length > 0 ? marqueeCol1.length : heroSlides.length;
                                            return (
                                                <div
                                                    key={`up-${idx}`}
                                                    className={`marquee-card ${idx % itemsLen === currentSlide % itemsLen ? 'active' : ''}`}
                                                    onClick={() => setCurrentSlide(idx % itemsLen)}
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
                                                                {String((idx % itemsLen) + 1).padStart(2, '0')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
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
                                        {[...(marqueeCol2.length > 0 ? marqueeCol2 : heroSlides), ...(marqueeCol2.length > 0 ? marqueeCol2 : heroSlides)].reverse().map((slide, idx) => {
                                            const itemsLen = marqueeCol2.length > 0 ? marqueeCol2.length : heroSlides.length;
                                            return (
                                                <div
                                                    key={`down-${idx}`}
                                                    className={`marquee-card`}
                                                    onClick={() => setCurrentSlide(idx % itemsLen)}
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
                                            );
                                        })}
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
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

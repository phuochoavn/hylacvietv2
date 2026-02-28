'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Button from '@/components/core/Button';
import BrandLogoText from '@/components/core/BrandLogoText';
import { SITE } from '@/lib/constants';

// Default content (fallback if API fails)
const defaultContent = {
    label: 'Since 2026 • Hà Nội',
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

interface HeroProps {
    serverSettings?: Record<string, string> | null;
}

/** Parse image gallery JSON from settings */
function parseImages(json: string): { id: number; image: string }[] {
    try {
        return JSON.parse(json)
            .filter((item: any) => item.image)
            .map((item: any) => ({
                id: item.id,
                image: item.image.startsWith('http') ? item.image : `https://hylacviet.vn${item.image}`,
            }));
    } catch {
        return [];
    }
}

/** Build hero state from settings (shared between server-props and client-fetch paths) */
function buildHeroState(settings: Record<string, string>) {
    const content: HeroContent = {
        label: settings.hero_label || defaultContent.label,
        title: settings.hero_title || settings.site_name || defaultContent.title,
        tagline: settings.hero_tagline || settings.site_tagline || defaultContent.tagline,
        description: settings.hero_description || defaultContent.description,
        ctaText: settings.hero_cta_text || defaultContent.ctaText,
    };

    let heroSlides: HeroSlide[] = defaultSlides;
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
            if (slides.length > 0) heroSlides = slides;
        } catch { }
    }

    const heroBackgrounds = settings.hero_backgrounds ? parseImages(settings.hero_backgrounds) : [];
    const marqueeCol1 = settings.marquee_column1 ? parseImages(settings.marquee_column1) : [];
    const marqueeCol2 = settings.marquee_column2 ? parseImages(settings.marquee_column2) : [];

    return { content, heroSlides, heroBackgrounds, marqueeCol1, marqueeCol2 };
}

export default function Hero({ serverSettings }: HeroProps) {
    const containerRef = useRef<HTMLElement>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Initialize from server settings if available, otherwise use defaults
    const initialState = serverSettings ? buildHeroState(serverSettings) : null;

    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(initialState?.heroSlides || defaultSlides);
    const [content, setContent] = useState<HeroContent>(initialState?.content || defaultContent);
    const [isLoaded, setIsLoaded] = useState(!!serverSettings); // Loaded immediately if server data

    const [heroBackgrounds, setHeroBackgrounds] = useState<{ id: number; image: string }[]>(initialState?.heroBackgrounds || []);
    const [marqueeCol1, setMarqueeCol1] = useState<{ id: number; image: string }[]>(initialState?.marqueeCol1 || []);
    const [marqueeCol2, setMarqueeCol2] = useState<{ id: number; image: string }[]>(initialState?.marqueeCol2 || []);

    // Only fetch client-side if server didn't provide settings (non-homepage usage)
    useEffect(() => {
        if (serverSettings) return; // Already have server data
        const fetchData = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && Array.isArray(data.data)) {
                        const settingsMap: Record<string, string> = {};
                        for (const item of data.data) {
                            settingsMap[item.key] = item.value;
                        }
                        const state = buildHeroState(settingsMap);
                        setContent(state.content);
                        setHeroSlides(state.heroSlides);
                        setHeroBackgrounds(state.heroBackgrounds);
                        setMarqueeCol1(state.marqueeCol1);
                        setMarqueeCol2(state.marqueeCol2);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch hero data:', error);
            } finally {
                setIsLoaded(true);
            }
        };
        fetchData();
    }, [serverSettings]);

    // Parallax scroll
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    // Auto-rotate slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [heroSlides.length]);

    // Mouse parallax effect — throttled to ~15fps for performance
    useEffect(() => {
        let rafId: number;
        let lastTime = 0;
        const THROTTLE_MS = 66; // ~15fps

        const handleMouseMove = (e: MouseEvent) => {
            const now = performance.now();
            if (now - lastTime < THROTTLE_MS) return;
            lastTime = now;
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 20;
                setMousePosition({ x, y });
            });
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(rafId);
        };
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
                                    quality={75}
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

                {/* Floating Particles — pure CSS, no JS animation */}
                <div className="hero-particles" aria-hidden="true">
                    <span className="particle" style={{ left: '15%', top: '20%', animationDelay: '0s' }} />
                    <span className="particle" style={{ left: '35%', top: '60%', animationDelay: '0.8s' }} />
                    <span className="particle" style={{ left: '55%', top: '30%', animationDelay: '1.6s' }} />
                    <span className="particle" style={{ left: '75%', top: '70%', animationDelay: '2.4s' }} />
                    <span className="particle" style={{ left: '25%', top: '45%', animationDelay: '3.2s' }} />
                    <span className="particle" style={{ left: '85%', top: '15%', animationDelay: '4.0s' }} />
                    <span className="particle" style={{ left: '45%', top: '80%', animationDelay: '4.8s' }} />
                    <span className="particle" style={{ left: '65%', top: '25%', animationDelay: '5.6s' }} />
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
                                <span className="title-line" style={{ filter: 'drop-shadow(0 2px 8px rgba(90, 58, 26, 0.3))' }}><BrandLogoText height={100} fill="#B8860B" stroke="#5A3A1A" strokeWidth={4} /></span>
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
                                                            quality={70}
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

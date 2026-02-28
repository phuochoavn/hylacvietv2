'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
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

/** Build hero state from settings */
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
    const [isMobile, setIsMobile] = useState(false);

    // Initialize from server settings if available
    const initialState = serverSettings ? buildHeroState(serverSettings) : null;

    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(initialState?.heroSlides || defaultSlides);
    const [content, setContent] = useState<HeroContent>(initialState?.content || defaultContent);
    const [isLoaded, setIsLoaded] = useState(!!serverSettings);

    const [heroBackgrounds, setHeroBackgrounds] = useState<{ id: number; image: string }[]>(initialState?.heroBackgrounds || []);
    const [marqueeCol1, setMarqueeCol1] = useState<{ id: number; image: string }[]>(initialState?.marqueeCol1 || []);
    const [marqueeCol2, setMarqueeCol2] = useState<{ id: number; image: string }[]>(initialState?.marqueeCol2 || []);

    // Track previous slide for crossfade
    const [prevSlide, setPrevSlide] = useState(-1);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile, { passive: true });
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Only fetch client-side if no server settings
    useEffect(() => {
        if (serverSettings) return;
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

    // Scroll-based fade - pure CSS with Intersection Observer fallback
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const rect = container.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            // Calculate how much we've scrolled past the hero
            const scrollRatio = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.8)));
            const opacity = 1 - scrollRatio;
            const contentWrapper = container.querySelector('.hero-content-wrapper') as HTMLElement;
            if (contentWrapper) {
                contentWrapper.style.opacity = String(Math.max(0, opacity));
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-rotate slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => {
                setPrevSlide(prev);
                return (prev + 1) % heroSlides.length;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [heroSlides.length]);

    // Clear previous slide after crossfade transition completes
    useEffect(() => {
        if (prevSlide >= 0) {
            const timer = setTimeout(() => setPrevSlide(-1), 1200);
            return () => clearTimeout(timer);
        }
    }, [prevSlide]);

    // Get current hero bg image URL
    const getHeroBgImage = (slideIdx: number) => {
        if (heroBackgrounds.length > 0) return heroBackgrounds[slideIdx % heroBackgrounds.length]?.image;
        return heroSlides[slideIdx]?.image || defaultSlides[0].image;
    };

    return (
        <>
            <section ref={containerRef} className="hero-premium">
                {/* Background Layer */}
                <div className="hero-bg-layer">
                    {/* Previous slide — fading out via CSS transition */}
                    {prevSlide >= 0 && prevSlide !== currentSlide && (
                        <div className="hero-bg-image hero-bg-fade-out">
                            <Image
                                src={getHeroBgImage(prevSlide)}
                                alt={heroSlides[prevSlide]?.title || 'Hero'}
                                fill
                                quality={75}
                                className="hero-bg-img"
                                sizes="100vw"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    )}

                    {/* Current slide — always visible */}
                    <div className={`hero-bg-image hero-bg-visible ${!isMobile ? 'hero-bg-zoom' : ''}`}>
                        <Image
                            src={getHeroBgImage(currentSlide)}
                            alt={heroSlides[currentSlide]?.title || 'HỶ LẠC VIỆT'}
                            fill
                            priority
                            quality={75}
                            className="hero-bg-img"
                            sizes="100vw"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>

                    {/* Gradient Overlays */}
                    <div className="hero-gradient-overlay" />
                    <div className="hero-vignette" />
                </div>

                {/* Floating Particles — hidden on mobile via CSS */}
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

                {/* Main Content — no framer-motion, pure CSS + scroll JS */}
                <div className="hero-content-wrapper">
                    <div className="hero-content-inner">
                        {/* Left: Typography */}
                        <div className="hero-text hero-text-animate">
                            {/* Title + tagline render IMMEDIATELY (no opacity:0) for fast LCP */}
                            <h1 className="hero-title-main">
                                <span className="title-line" style={{ filter: 'drop-shadow(0 2px 8px rgba(90, 58, 26, 0.3))' }}>
                                    <BrandLogoText height={100} fill="#B8860B" stroke="#5A3A1A" strokeWidth={4} />
                                </span>
                            </h1>

                            <p className="hero-tagline">
                                {content.tagline}
                            </p>

                            {/* Below-title content uses delayed CSS entrance */}
                            <div className="hero-description hero-anim hero-anim-3">
                                <p>{content.description}</p>
                            </div>

                            <span className="hero-label hero-anim hero-anim-4">
                                <span className="hero-label-line" />
                                {content.label}
                            </span>

                            <div className="hero-cta-group hero-anim hero-anim-5">
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
                            </div>
                        </div>

                        {/* Right: Marquee Gallery — desktop only, hidden on <=1024px via CSS */}
                        {!isMobile && isLoaded && (marqueeCol1.length > 0 || marqueeCol2.length > 0) && (
                            <div className="hero-marquee-gallery hero-anim hero-anim-gallery">
                                {/* Column 1 - Scrolling Up */}
                                <div className="marquee-column">
                                    <div className="marquee-track marquee-up marquee-scroll-up">
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
                                    </div>
                                </div>

                                {/* Column 2 - Scrolling Down */}
                                <div className="marquee-column">
                                    <div className="marquee-track marquee-down marquee-scroll-down">
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
                                                            sizes="180px"
                                                            className="marquee-img"
                                                            loading="lazy"
                                                            quality={70}
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Scroll Indicator — CSS animation */}
                    <div className="hero-scroll-indicator hero-anim hero-anim-scroll">
                        <span>Cuộn xuống</span>
                        <div className="scroll-line scroll-line-animate" />
                    </div>
                </div>

                {/* Corner Decorations */}
                <div className="hero-corner hero-corner-tl" />
                <div className="hero-corner hero-corner-br" />
            </section>
            <div className="hero-spacer" />
        </>
    );
}

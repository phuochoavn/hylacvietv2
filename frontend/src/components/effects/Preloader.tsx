'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { SITE } from '@/lib/constants';

/** Convert absolute hylacviet URL to relative path */
function toRelativeUrl(url: string): string {
    if (!url) return url;
    try {
        const u = new URL(url);
        if (u.hostname.endsWith('hylacviet.vn')) {
            return u.pathname + u.search;
        }
    } catch { /* not a valid URL, return as-is */ }
    return url;
}


// Preloader timing configuration
const LOGO_ANIMATION_MS = 1800; // Logo spin+zoom animation duration
const STROKE_ANIMATION_MS = 2100; // Stroke drawing + fill (1.5s draw + 0.5s fill + delays)
const MIN_DISPLAY_MS = 2800;    // Minimum preloader display time
const MAX_WAIT_MS = 10000;      // Maximum preloader duration (fallback)

interface Settings {
    logo_url?: string;
}

/**
 * Smart Preloader — waits for critical assets before dismissing:
 *   1. Logo image must be loaded
 *   2. Hero background must be prefetched
 *   3. Animations must complete (MIN_DISPLAY_MS)
 *   4. Fallback: MAX_WAIT_MS prevents infinite loading
 *
 * Progress bar reflects real loading state.
 */
export default function Preloader() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [settings, setSettings] = useState<Settings>({});
    const startTimeRef = useRef<number>(Date.now());

    // Asset readiness flags
    const [logoLoaded, setLogoLoaded] = useState(false);
    const [heroImageLoaded, setHeroImageLoaded] = useState(false);
    const [animationDone, setAnimationDone] = useState(false);
    const [fontsLoaded, setFontsLoaded] = useState(false);

    // Refs to avoid stale closures
    const logoLoadedRef = useRef(false);
    const heroImageLoadedRef = useRef(false);
    const animationDoneRef = useRef(false);
    const fontsLoadedRef = useRef(false);
    const dismissedRef = useRef(false);

    // Keep refs in sync
    useEffect(() => { logoLoadedRef.current = logoLoaded; }, [logoLoaded]);
    useEffect(() => { heroImageLoadedRef.current = heroImageLoaded; }, [heroImageLoaded]);
    useEffect(() => { animationDoneRef.current = animationDone; }, [animationDone]);
    useEffect(() => { fontsLoadedRef.current = fontsLoaded; }, [fontsLoaded]);

    // ─── Try to dismiss preloader whenever any flag changes ───
    const tryDismiss = useCallback(() => {
        if (dismissedRef.current) return;

        const allReady = logoLoadedRef.current && heroImageLoadedRef.current && animationDoneRef.current;
        if (!allReady) return;

        dismissedRef.current = true;

        // Ensure minimum display time is met
        const elapsed = Date.now() - startTimeRef.current;
        const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

        setTimeout(() => {
            setProgress(100);
            setTimeout(() => setLoading(false), 300); // Brief pause at 100%
        }, remaining);
    }, []);

    // Call tryDismiss whenever any readiness flag changes
    useEffect(() => { tryDismiss(); }, [logoLoaded, heroImageLoaded, animationDone, tryDismiss]);

    // ─── 1. Fetch logo from settings ───
    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    for (const item of data.data) {
                        if (item.key === 'logo_url') {
                            setSettings({ logo_url: toRelativeUrl(item.value) });
                            break;
                        }
                    }
                }
            } catch (e) {
                console.error('Failed to fetch logo:', e);
                // If we can't fetch settings, mark logo as "loaded" so we don't block
                setLogoLoaded(true);
            }
        }
        fetchSettings();
    }, []);

    // If no logo URL after settings load, mark as loaded
    useEffect(() => {
        if (settings.logo_url === undefined) return;
        if (!settings.logo_url) {
            setLogoLoaded(true);
        }
        // If logo_url exists, we wait for the Image onLoad callback
    }, [settings]);

    // ─── 2. Prefetch hero background image ───
    useEffect(() => {
        async function prefetchHeroImage() {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    let heroImageUrl = '';

                    for (const item of data.data) {
                        // Try hero_backgrounds gallery first
                        if (item.key === 'hero_backgrounds' && item.value) {
                            try {
                                const images = JSON.parse(item.value);
                                if (images.length > 0 && images[0].image) {
                                    heroImageUrl = toRelativeUrl(images[0].image);
                                    if (!heroImageUrl.startsWith('http') && !heroImageUrl.startsWith('/')) {
                                        heroImageUrl = '/' + heroImageUrl;
                                    }
                                    break;
                                }
                            } catch { /* ignore parse error */ }
                        }
                        // Fallback to hero_slides
                        if (item.key === 'hero_slides' && item.value && !heroImageUrl) {
                            try {
                                const slides = JSON.parse(item.value);
                                if (slides.length > 0 && slides[0].image) {
                                    heroImageUrl = toRelativeUrl(slides[0].image);
                                    if (!heroImageUrl.startsWith('http') && !heroImageUrl.startsWith('/')) {
                                        heroImageUrl = '/' + heroImageUrl;
                                    }
                                }
                            } catch { /* ignore parse error */ }
                        }
                    }

                    if (heroImageUrl) {
                        // Prefetch using native Image
                        const img = new window.Image();
                        img.onload = () => {
                            setHeroImageLoaded(true);
                        };
                        img.onerror = () => {
                            // Don't block preloader on image error
                            setHeroImageLoaded(true);
                        };
                        img.src = heroImageUrl;
                        return; // Wait for onload/onerror
                    }
                }
            } catch (e) {
                console.error('Failed to prefetch hero image:', e);
            }
            // Fallback: if nothing to prefetch, mark as ready
            setHeroImageLoaded(true);
        }
        prefetchHeroImage();
    }, []);

    // ─── 3. Wait for fonts ───
    useEffect(() => {
        if (typeof document !== 'undefined' && document.fonts) {
            document.fonts.ready.then(() => {
                setFontsLoaded(true);
            });
        } else {
            setFontsLoaded(true);
        }
    }, []);

    // ─── 4. Animation timer ───
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimationDone(true);
        }, STROKE_ANIMATION_MS + 500); // Stroke animation + buffer

        return () => clearTimeout(timer);
    }, []);

    // ─── 5. Progress bar (reflects real state) ───
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                let target = 10; // Base: fonts loading

                if (fontsLoadedRef.current) target += 15;     // fonts: +15 = 25
                if (logoLoadedRef.current) target += 25;      // logo: +25 = 50
                if (heroImageLoadedRef.current) target += 30;  // hero: +30 = 80
                if (animationDoneRef.current) target += 15;   // anim: +15 = 95

                // Smoothly approach target (never jump)
                const step = Math.max(1, Math.ceil((target - prev) * 0.15));
                const next = Math.min(prev + step, target);
                return Math.min(next, 95); // Cap at 95 until dismiss
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    // ─── 6. Fallback: MAX_WAIT prevents infinite loading ───
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!dismissedRef.current) {
                console.warn('Preloader: MAX_WAIT reached, forcing dismiss');
                dismissedRef.current = true;
                setProgress(100);
                setTimeout(() => setLoading(false), 300);
            }
        }, MAX_WAIT_MS);

        return () => clearTimeout(timer);
    }, []);

    // Handle logo image loaded
    const handleLogoLoad = useCallback(() => {
        setLogoLoaded(true);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    className="preloader"
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] }
                    }}
                >
                    {/* Lotus SVG - 7 petals blooming outward */}
                    <motion.svg
                        width="90"
                        height="65"
                        viewBox="0 0 70 50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            filter: 'drop-shadow(0 0 15px var(--gold-glow))',
                            marginBottom: '0px'
                        }}
                    >
                        {/* Center petal */}
                        <motion.path
                            d="M35 5 Q38 20 35 40 Q32 20 35 5"
                            fill="var(--gold)"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: 0.1, duration: 0.35, ease: "easeOut" }}
                            style={{ transformOrigin: '35px 40px' }}
                        />
                        {/* Left petal 1 */}
                        <motion.path
                            d="M35 40 Q25 25 22 8 Q30 22 35 40"
                            fill="var(--gold)"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.9 }}
                            transition={{ delay: 0.2, duration: 0.35, ease: "easeOut" }}
                            style={{ transformOrigin: '35px 40px' }}
                        />
                        {/* Right petal 1 */}
                        <motion.path
                            d="M35 40 Q45 25 48 8 Q40 22 35 40"
                            fill="var(--gold)"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.9 }}
                            transition={{ delay: 0.2, duration: 0.35, ease: "easeOut" }}
                            style={{ transformOrigin: '35px 40px' }}
                        />
                        {/* Left petal 2 */}
                        <motion.path
                            d="M35 40 Q18 28 12 12 Q22 26 35 40"
                            fill="var(--gold)"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.75 }}
                            transition={{ delay: 0.35, duration: 0.35, ease: "easeOut" }}
                            style={{ transformOrigin: '35px 40px' }}
                        />
                        {/* Right petal 2 */}
                        <motion.path
                            d="M35 40 Q52 28 58 12 Q48 26 35 40"
                            fill="var(--gold)"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.75 }}
                            transition={{ delay: 0.35, duration: 0.35, ease: "easeOut" }}
                            style={{ transformOrigin: '35px 40px' }}
                        />
                        {/* Left petal 3 - outer */}
                        <motion.path
                            d="M35 40 Q10 32 5 18 Q15 30 35 40"
                            fill="var(--gold)"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.6 }}
                            transition={{ delay: 0.5, duration: 0.35, ease: "easeOut" }}
                            style={{ transformOrigin: '35px 40px' }}
                        />
                        {/* Right petal 3 - outer */}
                        <motion.path
                            d="M35 40 Q60 32 65 18 Q55 30 35 40"
                            fill="var(--gold)"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.6 }}
                            transition={{ delay: 0.5, duration: 0.35, ease: "easeOut" }}
                            style={{ transformOrigin: '35px 40px' }}
                        />
                    </motion.svg>

                    {/* Website Logo - Zoom + Spin Animation */}
                    <motion.div
                        className="preloader-website-logo"
                        initial={{
                            opacity: 0,
                            scale: 0.1,
                            rotate: -180,
                            filter: 'blur(8px)'
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            rotate: 0,
                            filter: 'blur(0px)'
                        }}
                        transition={{
                            delay: 0.3,
                            duration: LOGO_ANIMATION_MS / 1000,
                            ease: [0.34, 1.56, 0.64, 1] // Custom spring-like ease
                        }}
                        style={{ marginBottom: '16px' }}
                    >
                        <Image
                            src="/images/logo.png"
                            alt="Logo"
                            width={180}
                            height={180}
                            style={{ objectFit: 'contain' }}
                            onLoad={handleLogoLoad}
                            priority
                        />
                    </motion.div>

                    {/* Brand name - Stroke Drawing Animation */}
                    <motion.div
                        className="preloader-logo"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                        style={{ width: '60%', maxWidth: '500px' }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 1731 417"
                            style={{ width: '100%', height: 'auto' }}
                        >
                            <g transform="translate(0,417) scale(0.100000,-0.100000)">
                                <motion.path
                                    d="M10638 3860 c-20 -12 -24 -35 -8 -45 6 -4 44 -8 85 -10 85 -4 268 -41 273 -56 2 -5 10 -9 18 -9 21 0 119 -52 199 -105 39 -26 109 -83 157 -127 84 -76 215 -237 258 -316 11 -20 30 -53 42 -72 60 -100 174 -346 230 -495 35 -93 180 -524 237 -705 71 -223 167 -482 230 -618 169 -367 371 -638 601 -804 75 -55 241 -139 319 -162 30 -9 103 -21 164 -27 90 -9 111 -8 118 3 21 32 5 42 -91 54 -52 7 -124 20 -160 29 -134 34 -318 150 -415 260 -84 97 -167 226 -245 385 -78 159 -204 485 -197 510 3 8 30 76 62 150 31 74 74 180 96 235 22 55 44 109 49 120 5 11 34 81 64 155 30 74 78 191 106 260 29 69 58 141 65 160 8 19 28 69 45 110 18 41 49 118 70 171 66 165 108 239 171 300 33 31 59 62 59 68 0 8 -47 11 -149 11 -83 0 -152 -4 -156 -9 -3 -5 10 -22 28 -38 56 -47 71 -77 64 -133 -3 -26 -11 -57 -16 -67 -6 -10 -31 -67 -56 -128 -25 -60 -52 -123 -60 -140 -8 -16 -28 -67 -45 -112 -29 -79 -54 -140 -70 -174 -4 -8 -20 -47 -35 -85 -15 -38 -38 -93 -51 -122 -13 -29 -24 -55 -24 -57 0 -3 -9 -24 -19 -48 -38 -82 -94 -219 -128 -312 -14 -38 -34 -88 -44 -110 -10 -22 -25 -57 -33 -78 -8 -20 -19 -37 -24 -37 -9 0 -32 43 -32 60 0 27 -264 737 -342 921 -56 132 -241 490 -282 546 -25 35 -46 67 -46 72 0 5 -4 11 -8 13 -4 2 -35 37 -67 78 -91 114 -251 269 -338 328 -43 29 -80 52 -84 52 -4 0 -14 6 -22 14 -20 17 -184 86 -231 98 -43 10 -220 39 -275 44 -22 2 -48 0 -57 -6z M4975 3725 c-22 -8 -48 -24 -57 -36 -21 -25 -24 -68 -4 -75 7 -3 29 4 48 16 28 16 41 18 62 10 15 -5 26 -17 26 -28 0 -10 -19 -38 -41 -62 -45 -47 -53 -85 -23 -107 25 -18 35 -16 41 7 3 10 33 38 68 60 58 38 64 45 75 91 10 43 10 53 -5 75 -19 29 -87 64 -125 63 -14 0 -43 -6 -65 -14z M14629 3623 c-36 -39 -115 -144 -128 -171 -10 -18 -9 -23 3 -28 22 -8 66 19 126 80 30 31 61 56 68 56 7 0 36 -21 63 -47 87 -82 165 -119 157 -73 -2 10 -39 62 -83 115 l-79 95 -51 0 c-43 0 -55 -4 -76 -27z M9955 3284 c-44 -8 -89 -19 -100 -24 -11 -5 -40 -17 -65 -27 -96 -38 -236 -120 -292 -172 -56 -51 -158 -171 -158 -186 0 -3 -13 -26 -29 -49 -48 -70 -89 -168 -105 -256 -9 -47 -16 -136 -16 -209 0 -122 19 -275 39 -316 6 -11 21 -45 34 -75 61 -142 192 -299 325 -389 86 -58 211 -116 307 -143 65 -18 107 -22 230 -22 126 -1 163 3 232 22 135 36 303 118 411 198 65 49 72 58 72 89 0 45 -16 85 -35 85 -8 0 -48 -34 -87 -76 -113 -119 -249 -206 -373 -239 -94 -25 -228 -30 -314 -11 -176 37 -394 190 -498 349 -43 66 -107 199 -132 276 -34 104 -44 186 -38 301 9 150 43 295 92 391 74 143 218 303 322 357 35 18 106 44 159 58 166 42 295 28 458 -49 109 -52 196 -118 285 -216 36 -39 68 -68 73 -63 4 4 9 56 10 116 2 104 1 109 -22 128 -61 49 -234 115 -380 144 -104 21 -306 25 -405 8z M2563 3283 c-20 -8 -15 -22 17 -54 16 -17 34 -45 39 -62 5 -18 9 -202 10 -409 2 -368 1 -378 -19 -398 -11 -11 -71 -58 -133 -104 -416 -309 -677 -443 -1042 -538 -111 -29 -133 -31 -300 -32 -99 -1 -205 2 -235 7 -151 21 -303 98 -409 207 -32 33 -69 82 -82 108 -19 38 -24 63 -24 132 0 74 4 92 28 138 68 130 220 230 439 291 89 25 235 41 365 41 54 0 104 4 112 9 8 5 11 16 7 26 -6 16 -22 17 -204 13 -184 -6 -333 -24 -387 -48 -11 -5 -38 -15 -60 -23 -66 -22 -176 -91 -247 -156 -48 -44 -76 -81 -100 -129 -31 -63 -33 -74 -33 -172 0 -97 2 -110 31 -170 17 -36 52 -91 78 -122 103 -126 290 -224 486 -253 180 -27 379 -17 590 30 102 22 329 99 416 140 177 85 437 245 623 385 44 33 85 60 90 60 16 0 15 -616 0 -661 -7 -19 -27 -50 -45 -69 -19 -20 -34 -39 -34 -43 0 -4 74 -7 165 -7 122 0 165 3 165 12 0 7 -16 29 -36 49 -19 20 -39 52 -43 70 -4 19 -7 204 -6 412 l0 378 25 20 c58 46 208 144 274 179 39 20 103 54 141 75 39 21 99 48 135 61 97 34 228 55 317 52 l78 -3 0 -480 0 -479 -35 -8 c-65 -15 -515 -9 -596 7 -15 4 -23 -1 -27 -15 -3 -13 1 -21 16 -26 44 -14 201 -22 421 -21 l229 0 0 -36 c-1 -21 -2 -62 -2 -92 -1 -48 -5 -60 -37 -95 -20 -21 -33 -44 -29 -50 8 -13 312 -14 320 0 3 5 -10 23 -30 41 -20 18 -40 49 -45 70 -6 20 -13 72 -16 115 -6 90 3 116 50 135 48 20 140 94 189 152 63 74 98 133 119 202 22 75 23 193 2 266 -24 80 -86 180 -149 237 -30 28 -90 67 -132 89 l-78 38 -3 160 c-3 197 7 253 54 301 19 19 32 39 29 44 -4 6 -70 10 -161 10 -148 0 -154 -1 -154 -20 0 -11 7 -23 15 -27 9 -3 25 -23 36 -44 18 -35 19 -56 17 -217 -3 -170 -4 -177 -23 -175 -11 1 -66 -2 -122 -7 -210 -19 -509 -121 -688 -234 -27 -18 -69 -45 -93 -59 -30 -20 -44 -24 -47 -15 -2 7 -3 159 -2 338 2 353 2 349 61 412 14 15 26 32 26 38 0 6 -51 10 -147 9 -82 0 -154 -3 -160 -6z m1462 -634 c80 -50 135 -112 178 -198 29 -59 32 -74 32 -156 0 -65 -6 -109 -22 -160 -25 -77 -40 -101 -128 -193 -63 -65 -138 -117 -155 -107 -11 7 -14 837 -3 848 13 14 35 6 98 -34z M4335 3280 c-3 -6 9 -25 27 -43 73 -70 110 -132 301 -497 39 -74 115 -216 169 -315 l98 -179 0 -343 c0 -204 -4 -352 -10 -368 -6 -15 -25 -43 -44 -63 -19 -20 -32 -40 -30 -44 7 -11 321 -10 328 0 3 5 -8 22 -25 38 -60 57 -59 50 -59 447 l0 364 46 89 c26 49 60 114 76 144 17 30 71 134 121 230 50 96 110 210 134 254 24 43 43 81 43 84 0 14 76 95 130 138 33 27 60 55 60 62 0 9 -39 12 -159 12 -104 0 -162 -4 -167 -11 -3 -6 6 -23 20 -38 29 -30 46 -78 46 -129 0 -39 -37 -129 -95 -232 -23 -41 -87 -163 -142 -270 -125 -243 -136 -263 -148 -262 -5 0 -36 51 -68 113 -68 130 -137 261 -177 334 -73 132 -148 286 -165 337 -17 53 -18 58 -2 100 9 24 17 47 17 51 0 11 -318 8 -325 -3z M6580 3277 c0 -8 9 -22 21 -33 12 -10 28 -32 38 -49 14 -27 16 -108 19 -805 2 -426 0 -795 -3 -820 -6 -36 -16 -53 -52 -88 -26 -23 -43 -46 -39 -50 4 -4 96 -9 204 -13 187 -5 202 -7 293 -37 99 -33 299 -131 378 -185 91 -62 310 -190 396 -232 50 -23 128 -53 175 -66 68 -19 111 -23 215 -24 167 0 242 18 403 98 115 56 150 87 101 87 -12 0 -63 -13 -113 -29 -109 -35 -255 -55 -339 -47 -75 7 -204 31 -267 50 -25 8 -79 27 -120 44 -73 29 -117 49 -365 167 -66 32 -156 74 -200 95 -44 21 -132 54 -195 73 -103 32 -150 43 -271 62 -27 4 -38 12 -43 28 -3 12 -6 384 -6 827 l0 805 24 50 c13 28 33 58 45 67 11 10 21 22 21 28 0 6 -59 10 -160 10 -127 0 -160 -3 -160 -13z M8239 3263 c-5 -16 -20 -55 -33 -88 -14 -33 -42 -109 -64 -170 -37 -102 -73 -196 -173 -450 -22 -55 -49 -127 -61 -160 -12 -33 -46 -121 -76 -195 -30 -74 -65 -164 -77 -200 -69 -195 -116 -311 -168 -419 -11 -24 -43 -65 -70 -92 -27 -27 -46 -53 -42 -59 7 -11 287 -15 298 -4 4 4 -16 32 -45 63 l-51 55 6 66 c3 36 10 77 16 90 26 62 140 359 152 395 7 22 17 46 22 53 7 9 85 12 332 12 246 0 325 -3 332 -12 6 -7 18 -38 28 -68 10 -30 47 -129 82 -220 86 -221 103 -269 103 -297 0 -31 -22 -72 -54 -102 -14 -13 -23 -28 -20 -32 3 -5 84 -9 180 -9 142 0 174 3 174 14 0 7 -11 21 -25 30 -34 22 -69 78 -99 156 -14 36 -43 115 -66 175 -23 61 -61 160 -85 220 -24 61 -59 155 -79 210 -20 55 -50 134 -66 175 -112 291 -174 457 -231 619 -22 63 -48 130 -58 150 -9 20 -23 55 -31 79 -7 23 -19 42 -27 42 -7 0 -18 -12 -24 -27z m14 -366 c22 -56 56 -147 77 -202 21 -55 63 -167 93 -250 31 -82 63 -166 71 -186 8 -20 12 -39 9 -43 -9 -9 -603 -7 -603 2 0 9 29 87 68 182 16 41 41 104 55 140 13 36 43 115 67 175 23 61 53 139 66 175 37 98 43 110 51 110 5 0 25 -46 46 -103z M13514 3278 c-4 -7 2 -18 15 -27 13 -8 35 -33 50 -55 l26 -41 3 -790 c3 -870 4 -847 -58 -893 -18 -14 -27 -28 -24 -37 5 -12 33 -15 158 -15 84 0 156 3 159 7 4 3 -10 25 -32 48 -28 30 -39 52 -43 86 -3 24 -5 395 -4 824 1 724 2 783 18 807 10 15 30 38 44 51 15 14 23 30 20 36 -10 16 -322 15 -332 -1z M14165 3280 c-4 -6 8 -25 26 -42 17 -18 38 -47 46 -65 11 -27 13 -177 13 -824 0 -752 -1 -793 -19 -827 -10 -21 -28 -46 -40 -56 -52 -47 -57 -46 522 -44 l542 3 9 40 c4 22 17 68 27 103 16 50 17 67 8 85 -10 18 -13 19 -18 6 -21 -58 -161 -160 -243 -178 -50 -11 -613 -10 -624 2 -11 11 -14 829 -4 842 6 7 82 12 205 14 236 3 294 -7 334 -56 14 -18 31 -33 37 -33 7 0 15 12 19 27 7 28 5 170 -3 191 -7 21 -38 13 -63 -17 -13 -15 -34 -33 -45 -39 -14 -7 -101 -12 -245 -12 -123 0 -229 -1 -235 0 -9 0 -11 105 -9 403 1 221 3 408 4 415 1 11 61 13 324 10 l322 -3 65 -32 c36 -18 77 -43 91 -55 14 -13 38 -44 53 -70 15 -27 31 -48 36 -48 16 0 18 29 5 91 -22 104 -35 152 -47 166 -8 10 -122 13 -549 13 -352 0 -540 -3 -544 -10z M15622 3213 c-28 -103 -37 -179 -24 -187 6 -4 19 6 28 21 30 49 118 128 169 153 46 23 63 25 231 28 l182 4 4 -34 c2 -18 3 -398 3 -843 -1 -739 -2 -813 -18 -841 -9 -18 -29 -41 -43 -51 -49 -36 -24 -43 141 -43 86 0 156 4 160 10 3 5 -10 23 -29 40 -19 18 -39 44 -45 58 -8 19 -10 272 -9 862 l3 835 170 3 c142 2 180 -1 227 -16 75 -23 139 -69 184 -132 33 -46 54 -62 54 -41 0 14 -51 234 -56 243 -3 4 -299 8 -658 8 l-653 0 -21 -77z M8199 1271 c-16 -17 -29 -40 -29 -54 0 -13 9 -36 21 -51 14 -18 30 -26 53 -26 35 0 70 26 81 60 14 45 -31 100 -81 100 -9 0 -29 -13 -45 -29z M14702 1285 c-31 -14 -52 -47 -52 -84 0 -10 12 -30 26 -45 34 -34 75 -34 109 -1 41 42 30 101 -23 129 -23 12 -32 12 -60 1z"
                                    pathLength="1"
                                    fill="none"
                                    stroke="var(--gold)"
                                    strokeWidth="30"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{
                                        strokeDasharray: 1,
                                        strokeDashoffset: 1,
                                        fillOpacity: 0,
                                    }}
                                    animate={{
                                        strokeDashoffset: 0,
                                        fillOpacity: 1,
                                        fill: 'var(--gold)',
                                    }}
                                    transition={{
                                        strokeDashoffset: {
                                            delay: 0.5,
                                            duration: 1.5,
                                            ease: [0.65, 0, 0.35, 1],
                                        },
                                        fillOpacity: {
                                            delay: 1.6,
                                            duration: 0.5,
                                            ease: 'easeOut',
                                        },
                                        fill: {
                                            delay: 1.6,
                                            duration: 0.5,
                                            ease: 'easeOut',
                                        },
                                    }}
                                />
                            </g>
                        </svg>
                    </motion.div>

                    {/* Progress bar */}
                    <motion.div
                        className="preloader-progress"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div
                            className="preloader-progress-bar"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

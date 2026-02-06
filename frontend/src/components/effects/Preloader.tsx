'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { SITE } from '@/lib/constants';

// Preloader timing configuration
const LOGO_ANIMATION_MS = 1800; // Logo spin+zoom animation duration
const MIN_DISPLAY_MS = 2200;    // Must be > LOGO_ANIMATION_MS to complete animation
const MAX_WAIT_MS = 4000;       // Maximum preloader duration

interface Settings {
    logo_url?: string;
}

export default function Preloader() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [pageReady, setPageReady] = useState(false);
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [settings, setSettings] = useState<Settings>({});
    const startTimeRef = useRef<number>(Date.now());

    // Check if page content is ready
    const checkPageReady = useCallback((): boolean => {
        if (typeof window === 'undefined') return false;
        return document.readyState === 'complete';
    }, []);

    // Fetch logo from settings
    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    for (const item of data.data) {
                        if (item.key === 'logo_url') {
                            setSettings({ logo_url: item.value });
                            break;
                        }
                    }
                }
            } catch (e) {
                console.error('Failed to fetch logo:', e);
            }
        }
        fetchSettings();
    }, []);

    // Wait for fonts to load before showing brand name
    useEffect(() => {
        if (typeof document !== 'undefined' && document.fonts) {
            document.fonts.ready.then(() => {
                setFontsLoaded(true);
            });
        } else {
            // Fallback for older browsers
            setFontsLoaded(true);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        startTimeRef.current = Date.now();

        const finishLoading = () => {
            if (!isMounted) return;

            setProgress(100);
            setPageReady(true);

            // Calculate remaining time to meet minimum display
            const elapsed = Date.now() - startTimeRef.current;
            const remainingMin = Math.max(0, MIN_DISPLAY_MS - elapsed);

            // Wait for minimum display time before hiding
            setTimeout(() => {
                if (isMounted) setLoading(false);
            }, remainingMin + 200); // +200ms for smooth exit
        };

        // Progress animation
        const progressInterval = setInterval(() => {
            if (isMounted) {
                setProgress(prev => Math.min(prev + 6, pageReady ? 100 : 90));
            }
        }, 80);

        // Listen for page load
        const handleLoad = () => {
            clearInterval(progressInterval);
            finishLoading();
        };

        // Fallback: max wait time
        const maxWaitTimer = setTimeout(() => {
            clearInterval(progressInterval);
            finishLoading();
        }, MAX_WAIT_MS);

        window.addEventListener('load', handleLoad);

        // Check if already loaded
        if (checkPageReady()) {
            handleLoad();
        }

        return () => {
            isMounted = false;
            clearInterval(progressInterval);
            clearTimeout(maxWaitTimer);
            window.removeEventListener('load', handleLoad);
        };
    }, [checkPageReady, pageReady]);

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
                    {settings.logo_url && (
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
                                src={settings.logo_url}
                                alt="Logo"
                                width={180}
                                height={72}
                                style={{ objectFit: 'contain' }}
                            />
                        </motion.div>
                    )}

                    {/* Brand name - only show after fonts loaded */}
                    {fontsLoaded && (
                        <motion.div
                            className="preloader-logo"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            {SITE.name}
                        </motion.div>
                    )}

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

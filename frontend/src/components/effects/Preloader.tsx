'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { SITE } from '@/lib/constants';

// Preloader timing configuration
const MIN_DISPLAY_MS = 1500; // Minimum time to show preloader (see animation)
const MAX_WAIT_MS = 3000;    // Maximum preloader duration

interface Settings {
    logo_url?: string;
}

export default function Preloader() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [pageReady, setPageReady] = useState(false);
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
                    {/* Lotus SVG */}
                    <motion.svg
                        width="80"
                        height="80"
                        viewBox="10 10 80 80"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            filter: 'drop-shadow(0 0 20px var(--gold-glow))',
                            willChange: 'transform, opacity'
                        }}
                    >
                        {/* Center petal */}
                        <motion.path
                            d="M50 15 C55 35, 55 55, 50 75 C45 55, 45 35, 50 15"
                            fill="var(--gold)"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            style={{ transformOrigin: '50px 45px' }}
                        />
                        {/* Left petals */}
                        <motion.path
                            d="M35 25 C48 40, 48 60, 42 80 C32 60, 28 40, 35 25"
                            fill="var(--gold)"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.85 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            style={{ transformOrigin: '38px 52px' }}
                        />
                        <motion.path
                            d="M20 35 C38 48, 42 68, 38 85 C22 68, 16 48, 20 35"
                            fill="var(--gold)"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.7 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            style={{ transformOrigin: '29px 60px' }}
                        />
                        {/* Right petals */}
                        <motion.path
                            d="M65 25 C52 40, 52 60, 58 80 C68 60, 72 40, 65 25"
                            fill="var(--gold)"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.85 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            style={{ transformOrigin: '62px 52px' }}
                        />
                        <motion.path
                            d="M80 35 C62 48, 58 68, 62 85 C78 68, 84 48, 80 35"
                            fill="var(--gold)"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.7 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            style={{ transformOrigin: '71px 60px' }}
                        />
                    </motion.svg>

                    {/* Website Logo - between lotus and text */}
                    {settings.logo_url && (
                        <motion.div
                            className="preloader-website-logo"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.35, duration: 0.5 }}
                        >
                            <Image
                                src={settings.logo_url}
                                alt="Logo"
                                width={100}
                                height={40}
                                style={{ objectFit: 'contain' }}
                            />
                        </motion.div>
                    )}

                    {/* Brand name */}
                    <motion.div
                        className="preloader-logo"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        {SITE.name}
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

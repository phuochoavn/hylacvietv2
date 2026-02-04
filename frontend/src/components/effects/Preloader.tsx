'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE } from '@/lib/constants';

export default function Preloader() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setLoading(false), 400);
                    return 100;
                }
                return prev + Math.random() * 15;
            });
        }, 80);

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    className="preloader"
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
                    }}
                >
                    {/* Lotus SVG */}
                    <motion.svg
                        width="100"
                        height="100"
                        viewBox="0 0 100 100"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        style={{ filter: 'drop-shadow(0 0 20px var(--gold-glow))' }}
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

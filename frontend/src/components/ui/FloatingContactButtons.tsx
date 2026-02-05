'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import '@/styles/floating-contact.css';

const FloatingContactButtons = () => {
    return (
        <div className="floating-contact-stack">
            {/* Zalo */}
            <motion.a
                href="https://zalo.me/0912503456"
                target="_blank"
                rel="noopener noreferrer"
                className="floating-btn zalo"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Chat Zalo"
            >
                <Image
                    src="/images/zalo-icon.png"
                    alt="Zalo"
                    width={28}
                    height={28}
                    unoptimized
                />
            </motion.a>

            {/* Messenger */}
            <motion.a
                href="https://m.me/hylacviet"
                target="_blank"
                rel="noopener noreferrer"
                className="floating-btn messenger"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Chat Messenger"
            >
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.13.26.35.27.57l.05 1.78c.02.62.67 1.03 1.22.77l1.99-.88c.17-.07.36-.09.55-.05.91.23 1.88.35 2.88.35 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.01 13.04l-2.54-2.71-4.96 2.71 5.46-5.79 2.6 2.71 4.9-2.71-5.46 5.79z" />
                </svg>
            </motion.a>

            {/* Hotline */}
            <motion.a
                href="tel:+84912503456"
                className="floating-btn phone"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Gọi Hotline"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
                </svg>
            </motion.a>
        </div>
    );
};

export default FloatingContactButtons;

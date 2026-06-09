'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/floating-contact.css';
import { SITE } from '@/lib/constants';

const FloatingContactButtons = () => {
    const [isVisible, setIsVisible] = useState(false);
    
    // Links
    const [zaloLink, setZaloLink] = useState(SITE.zalo);
    const [phoneLink, setPhoneLink] = useState(`tel:${SITE.phone.replace(/\s/g, '')}`);
    const [messengerLink, setMessengerLink] = useState('https://m.me/61586356173205');
    const [igDmLink, setIgDmLink] = useState('');

    // Toggles
    const [showZalo, setShowZalo] = useState(true);
    const [showMessenger, setShowMessenger] = useState(true);
    const [showPhone, setShowPhone] = useState(true);
    const [showIgDm, setShowIgDm] = useState(true);

    // Delay showing buttons until after page is fully loaded, and fetch contact settings
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 2000); // 2 seconds delay to wait for preloader to finish

        async function fetchSettings() {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    for (const item of data.data) {
                        // Links
                        if (item.key === 'zalo' && item.value) setZaloLink(item.value);
                        if (item.key === 'phone' && item.value) setPhoneLink(`tel:${item.value.replace(/\s/g, '')}`);
                        if (item.key === 'messenger' && item.value) setMessengerLink(item.value);
                        if (item.key === 'ig_dm' && item.value) setIgDmLink(item.value);
                        
                        // Toggles (Assume string 'false' means hide)
                        if (item.key === 'show_zalo_btn') setShowZalo(item.value !== 'false');
                        if (item.key === 'show_messenger_btn') setShowMessenger(item.value !== 'false');
                        if (item.key === 'show_phone_btn') setShowPhone(item.value !== 'false');
                        if (item.key === 'show_ig_dm_btn') setShowIgDm(item.value !== 'false');
                    }
                }
            } catch (e) {
                console.error('Failed to fetch contact settings:', e);
            }
        }
        fetchSettings();

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="floating-contact-stack"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                    {/* Instagram DM */}
                    {showIgDm && igDmLink && (
                        <motion.a
                            href={igDmLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="floating-btn ig_dm"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Chat Instagram"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </motion.a>
                    )}

                    {/* Zalo */}
                    {showZalo && (
                        <motion.a
                            href={zaloLink}
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
                    )}

                    {/* Messenger */}
                    {showMessenger && messengerLink && (
                        <motion.a
                            href={messengerLink}
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
                    )}

                    {/* Hotline */}
                    {showPhone && (
                        <motion.a
                            href={phoneLink}
                            className="floating-btn phone"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Gọi Hotline"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
                            </svg>
                        </motion.a>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FloatingContactButtons;

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NAV_LINKS, SITE } from '@/lib/constants';

interface Settings {
    logo_url?: string;
    site_name?: string;
}

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [settings, setSettings] = useState<Settings>({});

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch settings (logo, site name)
    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    const settingsMap: Settings = {};
                    for (const item of data.data) {
                        if (item.key === 'logo_url' || item.key === 'site_name') {
                            settingsMap[item.key as keyof Settings] = item.value;
                        }
                    }
                    setSettings(settingsMap);
                }
            } catch (e) {
                console.error('Failed to fetch settings:', e);
            }
        }
        fetchSettings();
    }, []);

    const siteName = settings.site_name || SITE.name;

    return (
        <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
            <div className="header-inner container">
                {/* Logo */}
                <Link href="/" className="header-logo">
                    {settings.logo_url ? (
                        <Image
                            src={settings.logo_url}
                            alt={siteName}
                            width={120}
                            height={40}
                            className="header-logo-img"
                            priority
                        />
                    ) : (
                        <span className="header-logo-text">{siteName}</span>
                    )}
                </Link>

                {/* Desktop Navigation */}
                <nav className="header-nav">
                    {NAV_LINKS.map((link) => (
                        <Link key={link.href} href={link.href} className="header-nav-link">
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* CTA Button */}
                <a href={SITE.zalo} target="_blank" rel="noopener" className="btn btn-outline header-cta">
                    Zalo
                </a>

                {/* Mobile Menu Button */}
                <button
                    className="header-menu-btn"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                <nav className="mobile-nav">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="mobile-nav-link"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <a href={SITE.zalo} target="_blank" rel="noopener" className="btn btn-primary mobile-cta">
                    Chat Zalo
                </a>
            </div>
        </header>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { NAV_LINKS, SITE } from '@/lib/constants';
import BrandLogoText from '@/components/core/BrandLogoText';
import ThemeToggle from '@/components/core/ThemeToggle';

interface Settings {
    logo_url?: string;
    site_name?: string;
}

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [settings, setSettings] = useState<Settings>({});
    const pathname = usePathname();

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

    // Check if link is active (exact match or starts with for nested routes)
    const isActiveLink = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname === href || pathname.startsWith(href + '/');
    };

    // Compute header class name
    const headerClassName = [
        'header',
        isScrolled ? 'header-scrolled' : '',
    ].filter(Boolean).join(' ');

    return (
        <>
            <header className={headerClassName}>
                <div className="header-inner container">
                    {/* Logo */}
                    <Link href="/" className="header-logo">
                        {settings.logo_url ? (
                            <Image
                                src={settings.logo_url}
                                alt={siteName}
                                width={140}
                                height={50}
                                className="header-logo-img"
                                priority
                            />
                        ) : (
                            <span className="header-logo-text"><BrandLogoText height={28} /></span>
                        )}
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="header-nav">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`header-nav-link ${isActiveLink(link.href) ? 'active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Theme Toggle + Mobile Menu Button */}
                    <div style={{ position: 'absolute', right: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ThemeToggle />
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
                </div>
            </header>

            {/* Mobile Menu - OUTSIDE header to avoid stacking context issues */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                {/* Mobile Menu Logo */}
                {settings.logo_url && (
                    <div className="mobile-menu-logo">
                        <Image
                            src={settings.logo_url}
                            alt={siteName}
                            width={120}
                            height={48}
                        />
                    </div>
                )}

                {/* Close Button */}
                <button
                    className="mobile-menu-close"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Đóng menu"
                />

                {/* Navigation Links */}
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

                {/* Footer Tagline */}
                <div className="mobile-menu-footer">
                    <ThemeToggle />
                    <div className="mobile-menu-divider" />
                    <span className="mobile-menu-tagline">Since 2026 • Hà Nội</span>
                </div>
            </div>
        </>
    );
}

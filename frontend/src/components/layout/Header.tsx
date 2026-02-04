'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NAV_LINKS, SITE } from '@/lib/constants';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
            <div className="header-inner container">
                {/* Logo */}
                <Link href="/" className="header-logo">
                    {SITE.name}
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

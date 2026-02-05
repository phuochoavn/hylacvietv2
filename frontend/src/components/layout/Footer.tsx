import Link from 'next/link';
import { SITE, NAV_LINKS, SOCIAL_LINKS } from '@/lib/constants';

export default function Footer() {
    return (
        <footer className="footer-luxury">
            <div className="container">
                {/* Centered Logo */}
                <div className="footer-center-brand">
                    <h3 className="footer-logo-luxury">{SITE.name}</h3>
                    <p className="footer-tagline-luxury">{SITE.tagline}</p>
                </div>

                {/* Links Row - Evenly spaced */}
                <div className="footer-links-row">
                    {/* Navigation Links */}
                    <div className="footer-col">
                        <h4>Khám Phá</h4>
                        <nav className="footer-nav">
                            {NAV_LINKS.map((link) => (
                                <Link key={link.href} href={link.href}>
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Vertical Divider */}
                    <div className="footer-divider-vertical" />

                    {/* Contact */}
                    <div className="footer-col">
                        <h4>Liên Hệ</h4>
                        <address className="footer-address">
                            <div className="footer-contact-item">
                                <svg className="footer-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                <span>{SITE.address}</span>
                            </div>
                            <div className="footer-contact-item">
                                <svg className="footer-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                                </svg>
                                <a href={`tel:${SITE.phone.replace(/\s/g, '')}`}>{SITE.phone}</a>
                            </div>
                            <div className="footer-contact-item">
                                <svg className="footer-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                            </div>
                        </address>
                    </div>

                    {/* Vertical Divider */}
                    <div className="footer-divider-vertical" />

                    {/* Social */}
                    <div className="footer-col">
                        <h4>Kết Nối</h4>
                        <div className="footer-social-links">
                            {SOCIAL_LINKS.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={link.name}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="footer-copyright">
                    <div className="copyright-decor">
                        <span className="decor-line" />
                        <span className="decor-diamond">◆</span>
                        <span className="decor-line" />
                    </div>
                    <p>© {new Date().getFullYear()} {SITE.name}</p>
                    <p className="copyright-sub">Crafted with dedication for Vietnamese heritage</p>
                </div>
            </div>
        </footer>
    );
}

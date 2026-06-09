import Link from 'next/link';
import { SITE, NAV_LINKS, SOCIAL_LINKS } from '@/lib/constants';
import BrandLogoText from '@/components/core/BrandLogoText';

const API_URL = process.env.API_URL || 'http://hylacviet-api:3000';

async function getContactSettings() {
    try {
        const res = await fetch(`${API_URL}/api/settings`, {
            next: { revalidate: 60 },
        });
        if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                const s: Record<string, string> = {};
                for (const item of data.data) {
                    s[item.key] = item.value;
                }
                return s;
            }
        }
    } catch (e) {
        console.error('Failed to fetch contact settings for Footer:', e);
    }
    return {};
}

export default async function Footer() {
    const s = await getContactSettings();

    const phone = s.phone || SITE.phone;
    const phoneLink = `tel:${phone.replace(/\s/g, '')}`;
    const email = s.email || SITE.email;
    const address = s.address || SITE.address;
    const tagline = s.site_tagline || SITE.tagline;

    return (
        <footer className="footer-luxury">
            <div className="container">
                {/* Centered Logo */}
                <div className="footer-center-brand">
                    <h3 className="footer-logo-luxury"><BrandLogoText height={40} /></h3>
                    <p className="footer-tagline-luxury">{tagline}</p>
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
                                <span>{address}</span>
                            </div>
                            <div className="footer-contact-item">
                                <svg className="footer-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                                </svg>
                                <a href={phoneLink}>{phone}</a>
                            </div>
                            <div className="footer-contact-item">
                                <svg className="footer-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                <a href={`mailto:${email}`}>{email}</a>
                            </div>
                        </address>
                    </div>

                    {/* Vertical Divider */}
                    <div className="footer-divider-vertical" />

                    {/* Social */}
                    <div className="footer-col">
                        <h4>Kết Nối</h4>
                        <div className="footer-social-links">
                            {s.facebook && <a href={s.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>}
                            {s.instagram && <a href={s.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
                            {s.zalo && <a href={s.zalo} target="_blank" rel="noopener noreferrer">Zalo</a>}
                            {!s.facebook && !s.instagram && !s.zalo && SOCIAL_LINKS.map((link) => (
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

                <div className="footer-bottom">
                    <p className="copyright">
                        © {new Date().getFullYear()} Hỷ Lạc Việt. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

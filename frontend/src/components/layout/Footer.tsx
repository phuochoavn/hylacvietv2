import Link from 'next/link';
import { SITE, NAV_LINKS, SOCIAL_LINKS } from '@/lib/constants';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand */}
                    <div className="footer-brand">
                        <h3 className="footer-logo">{SITE.name}</h3>
                        <p className="footer-tagline">{SITE.tagline}</p>
                        <p className="footer-description">
                            {SITE.description}
                        </p>
                    </div>

                    {/* Links */}
                    <div className="footer-links">
                        <h4>Liên kết</h4>
                        <nav>
                            {NAV_LINKS.map((link) => (
                                <Link key={link.href} href={link.href}>
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Contact */}
                    <div className="footer-contact">
                        <h4>Liên hệ</h4>
                        <address>
                            <p>📍 {SITE.address}</p>
                            <p>📞 <a href={`tel:${SITE.phone.replace(/\s/g, '')}`}>{SITE.phone}</a></p>
                            <p>✉️ <a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
                        </address>
                    </div>

                    {/* Social */}
                    <div className="footer-social">
                        <h4>Theo dõi</h4>
                        <div className="social-links">
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
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} {SITE.name}. Bảo lưu mọi quyền.</p>
                </div>
            </div>
        </footer>
    );
}

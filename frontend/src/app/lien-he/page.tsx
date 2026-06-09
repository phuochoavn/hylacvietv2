'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import '@/styles/contact.css';

function toRelativeUrl(url: string): string {
    if (!url) return url;
    try {
        const u = new URL(url);
        if (u.hostname.endsWith('hylacviet.vn')) return u.pathname + u.search;
    } catch { /* not a valid URL */ }
    return url;
}

import { SITE } from '@/lib/constants';

export default function ContactPage() {
    const [heroImage, setHeroImage] = useState('/images/craft-fabric.webp');
    const [showroomImage, setShowroomImage] = useState('/images/craft-final.webp');
    
    // Contact Info State
    const [address, setAddress] = useState(SITE.address);
    const [phone, setPhone] = useState(SITE.phone);
    const [zaloLink, setZaloLink] = useState(SITE.zalo);
    const [workingHours, setWorkingHours] = useState('8:00 - 20:00, Thứ 2 - Thứ 7');
    
    const [heroTitle, setHeroTitle] = useState('Ghé Thăm');
    const [heroSubtitle, setHeroSubtitle] = useState('Hỷ Lạc Việt Atelier');
    const [introText, setIntroText] = useState('Để có trải nghiệm trọn vẹn nhất, xin vui lòng đặt lịch hẹn trước.\nChúng tôi sẽ chuẩn bị trà bánh và các mẫu vải mới nhất để đón tiếp bạn.');

    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                if (data.success && data.data) {
                    const s: Record<string, string> = {};
                    for (const item of data.data) {
                        if (item.value) s[item.key] = item.value;
                    }
                    const hero = s.contact_hero_image || s.craft_step4_image || s.step4_image || s.story_image;
                    const showroom = s.contact_showroom_image || s.story_image_2 || s.craft_step3_image || s.step3_image;
                    if (hero) setHeroImage(toRelativeUrl(hero));
                    if (showroom) setShowroomImage(toRelativeUrl(showroom));
                    
                    if (s.address) setAddress(s.address);
                    if (s.phone) setPhone(s.phone);
                    if (s.zalo) setZaloLink(s.zalo);
                    if (s.working_hours) setWorkingHours(s.working_hours);
                    
                    if (s.contact_hero_title) setHeroTitle(s.contact_hero_title);
                    if (s.contact_hero_subtitle) setHeroSubtitle(s.contact_hero_subtitle);
                    if (s.contact_intro_text) setIntroText(s.contact_intro_text);
                }
            } catch (e) {
                console.error('Failed to fetch settings:', e);
            }
        }
        fetchSettings();
    }, []);

    return (
        <main className="contact-showroom">
            {/* HERO */}
            <section className="contact-hero contact-hero-ghost">
                <div className="contact-hero-bg">
                    <Image
                        src={heroImage}
                        alt=""
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                    <div className="contact-hero-ghost-overlay" />
                </div>

                <div className="contact-hero-content">
                    <span className="contact-overline">Lời Mời Đặc Biệt</span>
                    <h1 className="contact-title">{heroTitle}</h1>
                    <p className="contact-subtitle">
                        {heroSubtitle}
                    </p>
                    <div style={{ marginTop: '2rem', color: 'var(--gold)', opacity: 0.4, fontSize: '0.8rem', letterSpacing: '0.5em' }}>
                        ◆
                    </div>
                </div>
            </section>

            {/* INVITATION SECTION */}
            <section className="contact-invitation">
                <div className="invitation-grid">
                    {/* Left: Showroom Image */}
                    <div className="invitation-image-col">
                        <div className="invitation-image-frame">
                            <Image
                                src={showroomImage}
                                alt="Không gian Showroom"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <p className="invitation-image-caption">
                            Nơi nghệ thuật và truyền thống giao thoa
                        </p>
                    </div>

                    {/* Right: Contact Info */}
                    <div className="invitation-card">
                        <h2 className="invitation-heading">
                            {heroSubtitle.split(' ').slice(0, -1).join(' ')} <em>{heroSubtitle.split(' ').slice(-1)}</em>
                        </h2>
                        <div className="invitation-divider" />

                        <div className="invitation-details">
                            <div className="detail-item">
                                <span style={{ width: 24, height: 24, flexShrink: 0, color: 'var(--gold)', fontSize: '1.2rem' }}>📍</span>
                                <div className="detail-text">
                                    <span className="detail-label">Địa chỉ</span>
                                    <span className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{address}</span>
                                </div>
                            </div>

                            <div className="detail-item">
                                <span style={{ width: 24, height: 24, flexShrink: 0, color: 'var(--gold)', fontSize: '1.2rem' }}>📞</span>
                                <div className="detail-text">
                                    <span className="detail-label">Điện thoại</span>
                                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="detail-value">{phone}</a>
                                </div>
                            </div>

                            <div className="detail-item">
                                <span style={{ width: 24, height: 24, flexShrink: 0, color: 'var(--gold)', fontSize: '1.2rem' }}>🕐</span>
                                <div className="detail-text">
                                    <span className="detail-label">Đón khách</span>
                                    <span className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{workingHours}</span>
                                </div>
                            </div>
                        </div>

                        <p className="invitation-note" style={{ whiteSpace: 'pre-wrap' }}>
                            {introText}
                        </p>

                        <a
                            href={zaloLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="invitation-cta"
                        >
                            Đặt Lịch Hẹn Riêng
                        </a>
                    </div>
                </div>
            </section>

            {/* MAP SECTION */}
            <section className="contact-map-section">
                <div className="map-header">
                    <span className="contact-overline">Vị Trí</span>
                    <h2 className="map-title">Tìm Đến <em>Chúng Tôi</em></h2>
                </div>

                <div className="map-container">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096949438424!2d105.85!3d21.028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDAx&output=embed"
                        width="100%"
                        height="450"
                        style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(90%) sepia(20%) hue-rotate(10deg)' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Hỷ Lạc Việt Location"
                    />
                    <div className="map-overlay-gradient" />
                </div>

                <div className="map-cta-row">
                    <a
                        href="https://maps.google.com/?q=Ha+Noi+Vietnam"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="map-directions-btn"
                    >
                        📍 Mở Google Maps
                    </a>
                </div>
            </section>

            {/* CLOSING */}
            <section className="contact-closing">
                <div className="closing-content">
                    <p className="closing-text">
                        Chúng tôi mong được đón tiếp bạn tại Atelier.<br />
                        Mỗi vị khách là một câu chuyện — và chúng tôi háo hức được lắng nghe.
                    </p>
                    <div className="closing-signature">
                        <span className="signature-name">Hỷ Lạc Việt</span>
                        <span className="signature-tagline">Áo Dài & Pháp Phục Cao Cấp</span>
                    </div>
                </div>
            </section>
        </main>
    );
}

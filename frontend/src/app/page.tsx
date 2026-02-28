import Hero from '@/components/sections/Hero';
import BelowFoldSections from '@/components/sections/BelowFoldSections';
import '@/styles/hero.css';

// API URL for server-side fetch
const API_URL = process.env.API_URL || 'http://hylacviet-api:3000';

// Server-side fetch hero settings — eliminates client-side waterfall
async function getHeroSettings() {
    try {
        const res = await fetch(`${API_URL}/api/settings`, {
            next: { revalidate: 60 }, // ISR: refresh every 60s
        });
        if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                const settings: Record<string, string> = {};
                for (const item of data.data) {
                    settings[item.key] = item.value;
                }
                return settings;
            }
        }
    } catch (error) {
        console.error('Failed to fetch hero settings:', error);
    }
    return null;
}

export default async function HomePage() {
    const settings = await getHeroSettings();

    return (
        <>
            <Hero serverSettings={settings} />
            {/* Shape Divider - connects hero to content */}
            <div className="hero-shape-divider">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z" className="shape-fill-primary" />
                    <path d="M0,80 C200,140 400,20 600,80 C800,140 1000,20 1200,80 L1200,120 L0,120 Z" className="shape-fill-secondary" />
                </svg>
            </div>
            <BelowFoldSections />
        </>
    );
}

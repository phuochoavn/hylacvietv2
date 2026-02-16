import dynamic from 'next/dynamic';
import Hero from '@/components/sections/Hero';

// Lazy-load below-fold sections — they won't load JS until scrolled near
const BrandStory = dynamic(() => import('@/components/sections/BrandStory'), { ssr: true });
const Philosophy = dynamic(() => import('@/components/sections/Philosophy'), { ssr: true });
const ProductShowcase = dynamic(() => import('@/components/sections/ProductShowcase'), { ssr: true });
const Craftsmanship = dynamic(() => import('@/components/sections/Craftsmanship'), { ssr: true });
const MeasurementJourney = dynamic(() => import('@/components/sections/MeasurementJourney'), { ssr: true });
const ContactCTA = dynamic(() => import('@/components/sections/ContactCTA'), { ssr: true });

export default function HomePage() {
    return (
        <>
            <Hero />
            {/* Shape Divider - connects hero to content */}
            <div className="hero-shape-divider">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z" className="shape-fill-primary" />
                    <path d="M0,80 C200,140 400,20 600,80 C800,140 1000,20 1200,80 L1200,120 L0,120 Z" className="shape-fill-secondary" />
                </svg>
            </div>
            <div className="main-content">
                <BrandStory />
                <Philosophy />
                <ProductShowcase />
                <Craftsmanship />
                <MeasurementJourney />
                <ContactCTA />
            </div>
        </>
    );
}

import Hero from '@/components/sections/Hero';
import BrandStory from '@/components/sections/BrandStory';
import Philosophy from '@/components/sections/Philosophy';
import CategoryShowcase from '@/components/sections/CategoryShowcase';
import Craftsmanship from '@/components/sections/Craftsmanship';
import Testimonials from '@/components/sections/Testimonials';
import ContactCTA from '@/components/sections/ContactCTA';

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
                <CategoryShowcase />
                <Craftsmanship />
                <Testimonials />
                <ContactCTA />
            </div>
        </>
    );
}

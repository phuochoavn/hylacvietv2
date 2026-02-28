'use client';

import dynamic from 'next/dynamic';

// Lazy-load below-fold sections — ssr: false avoids bundling their JS for initial load
const BrandStory = dynamic(() => import('@/components/sections/BrandStory'), { ssr: false });
const Philosophy = dynamic(() => import('@/components/sections/Philosophy'), { ssr: false });
const ProductShowcase = dynamic(() => import('@/components/sections/ProductShowcase'), { ssr: false });
const Craftsmanship = dynamic(() => import('@/components/sections/Craftsmanship'), { ssr: false });
const MeasurementJourney = dynamic(() => import('@/components/sections/MeasurementJourney'), { ssr: false });
const ContactCTA = dynamic(() => import('@/components/sections/ContactCTA'), { ssr: false });

export default function BelowFoldSections() {
    return (
        <div className="main-content">
            <BrandStory />
            <Philosophy />
            <ProductShowcase />
            <Craftsmanship />
            <MeasurementJourney />
            <ContactCTA />
        </div>
    );
}

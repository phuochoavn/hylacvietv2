'use client';

import dynamic from 'next/dynamic';

// Below-fold sections — lazy-load JS but SSR the HTML for immediate scroll
const BrandStory = dynamic(() => import('@/components/sections/BrandStory'), { ssr: true });
const Philosophy = dynamic(() => import('@/components/sections/Philosophy'), { ssr: true });
const ProductShowcase = dynamic(() => import('@/components/sections/ProductShowcase'), { ssr: true });
const Craftsmanship = dynamic(() => import('@/components/sections/Craftsmanship'), { ssr: true });
const MeasurementJourney = dynamic(() => import('@/components/sections/MeasurementJourney'), { ssr: true });
const ContactCTA = dynamic(() => import('@/components/sections/ContactCTA'), { ssr: true });

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

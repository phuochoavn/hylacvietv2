'use client';

import dynamic from 'next/dynamic';

// Smart SSR: text-heavy sections SSR for scroll, image-heavy sections lazy for perf
const BrandStory = dynamic(() => import('@/components/sections/BrandStory'), { ssr: false });
const Philosophy = dynamic(() => import('@/components/sections/Philosophy'), { ssr: true });
const ProductShowcase = dynamic(() => import('@/components/sections/ProductShowcase'), { ssr: true });
const Craftsmanship = dynamic(() => import('@/components/sections/Craftsmanship'), { ssr: false });
const MeasurementJourney = dynamic(() => import('@/components/sections/MeasurementJourney'), { ssr: false });
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

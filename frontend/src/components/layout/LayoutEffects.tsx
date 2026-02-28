'use client';

import dynamic from 'next/dynamic';

// Lazy-load non-critical UI effects — don't block initial render
const ScrollProgress = dynamic(() => import('@/components/effects/ScrollProgress'), { ssr: false });
const CustomCursor = dynamic(() => import('@/components/effects/CustomCursor'), { ssr: false });
const FloatingContactButtons = dynamic(() => import('@/components/ui/FloatingContactButtons'), { ssr: false });
const SmoothScroll = dynamic(() => import('@/components/effects/SmoothScroll'), { ssr: false });

/**
 * Client wrapper for non-critical layout effects.
 * Lazy-loaded with ssr: false to avoid bundling their JS (~60KB framer-motion etc.)
 * in the initial payload.
 */
export default function LayoutEffects() {
    return (
        <>
            <ScrollProgress />
            <CustomCursor />
            <SmoothScroll />
            <FloatingContactButtons />
        </>
    );
}

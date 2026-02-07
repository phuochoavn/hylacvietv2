'use client';

interface BrandLogoTextProps {
    /** Height in pixels */
    height?: number;
    /** Additional CSS class */
    className?: string;
}

/**
 * "HỶ LẠC VIỆT" brand name rendered as SVG, traced from Cotta Free font.
 * Uses CSS mask-image so the SVG inherits color from parent `color` or
 * `background-color` property.
 */
export default function BrandLogoText({ height = 60, className = '' }: BrandLogoTextProps) {
    // aspect ratio from potrace SVG viewBox: 1731 x 417
    const aspectRatio = 1731 / 417;
    const width = height * aspectRatio;

    return (
        <span
            className={`brand-logo-text ${className}`}
            role="img"
            aria-label="Hỷ Lạc Việt"
            style={{
                display: 'inline-block',
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: 'currentColor',
                WebkitMaskImage: 'url(/images/brand-logo-text.svg)',
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskImage: 'url(/images/brand-logo-text.svg)',
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
            }}
        />
    );
}

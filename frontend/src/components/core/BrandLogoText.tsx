'use client';

import { useEffect, useRef, useState } from 'react';

interface BrandLogoTextProps {
    /** Height in pixels */
    height?: number;
    /** Additional CSS class */
    className?: string;
    /** Fill color (default: currentColor / inherited) */
    fill?: string;
    /** Stroke color for outline (default: none) */
    stroke?: string;
    /** Stroke width (default: 8) */
    strokeWidth?: number;
}

/**
 * "HỶ LẠC VIỆT" brand name rendered as inline SVG.
 * Supports dual fill + stroke for visibility on any background.
 * 
 * Usage:
 *   <BrandLogoText fill="#6B4226" stroke="#C9A227" />  // brown fill + gold outline
 *   <BrandLogoText className="text-brand-brown" />     // single color via CSS
 */
export default function BrandLogoText({
    height = 60,
    className = '',
    fill,
    stroke,
    strokeWidth = 8,
}: BrandLogoTextProps) {
    const aspectRatio = 1731 / 417;
    const width = height * aspectRatio;
    const [svgPath, setSvgPath] = useState<string>('');

    // Load SVG path data once
    useEffect(() => {
        fetch('/images/brand-logo-text.svg')
            .then(res => res.text())
            .then(text => {
                // Extract path d="" from SVG
                const match = text.match(/d="([^"]+)"/);
                if (match) {
                    setSvgPath(match[1]);
                }
            })
            .catch(() => { });
    }, []);

    // If no stroke specified, fall back to mask-image approach (single color)
    if (!stroke || !svgPath) {
        return (
            <span
                className={`brand-logo-text ${className}`}
                role="img"
                aria-label="Hỷ Lạc Việt"
                style={{
                    display: 'inline-block',
                    width: `${width}px`,
                    height: `${height}px`,
                    backgroundColor: fill || 'currentColor',
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

    // Dual color: inline SVG with fill + stroke
    return (
        <span
            className={`brand-logo-text ${className}`}
            role="img"
            aria-label="Hỷ Lạc Việt"
            style={{ display: 'inline-block', width: `${width}px`, height: `${height}px` }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1731 417"
                width={width}
                height={height}
                style={{ display: 'block' }}
            >
                <g transform="translate(0,417) scale(0.1,-0.1)">
                    {/* Stroke layer (behind) — gold outline */}
                    <path
                        d={svgPath}
                        fill="none"
                        stroke={stroke}
                        strokeWidth={strokeWidth * 10}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    />
                    {/* Fill layer (front) — brown fill */}
                    <path
                        d={svgPath}
                        fill={fill || 'currentColor'}
                        stroke="none"
                    />
                </g>
            </svg>
        </span>
    );
}

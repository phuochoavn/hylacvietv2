'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

/**
 * Image Gallery Slider — pure CSS crossfade transitions.
 * Replaces the previous Three.js WebGL LiquidSlider (~200KB savings).
 */

interface ImageSliderProps {
    images: string[];
    currentIndex: number;
    aspectRatio?: number;
    className?: string;
}

export default function ImageSlider({
    images,
    currentIndex,
    aspectRatio = 3 / 4,
    className = ''
}: ImageSliderProps) {
    const [prevIndex, setPrevIndex] = useState(currentIndex);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (currentIndex !== prevIndex) {
            setIsTransitioning(true);

            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setPrevIndex(currentIndex);
                setIsTransitioning(false);
            }, 600); // match CSS transition duration
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [currentIndex, prevIndex]);

    if (!images || images.length === 0) {
        return (
            <div className={`gallery-slider-placeholder ${className}`} style={{ aspectRatio }}>
                <p>Không có ảnh</p>
            </div>
        );
    }

    return (
        <div className={`gallery-slider ${className}`} style={{ aspectRatio }}>
            {images.map((src, idx) => (
                <div
                    key={idx}
                    className={`gallery-slide ${idx === currentIndex ? 'active' : ''
                        } ${idx === prevIndex && isTransitioning ? 'exiting' : ''}`}
                >
                    <Image
                        src={src}
                        alt={`Ảnh sản phẩm ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 95vw, 55vw"
                        style={{ objectFit: 'contain' }}
                        priority={idx === 0}
                    />
                </div>
            ))}
        </div>
    );
}

'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);
    const pos = useRef({ x: 0, y: 0 });
    const target = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // Skip on mobile/touch devices
        if (typeof window !== 'undefined' && 'ontouchstart' in window) return;

        const cursor = cursorRef.current;
        const dot = dotRef.current;
        if (!cursor || !dot) return;

        const handleMouseMove = (e: MouseEvent) => {
            target.current = { x: e.clientX, y: e.clientY };
            cursor.style.opacity = '1';
            dot.style.opacity = '1';
        };

        const handleMouseLeave = () => {
            cursor.style.opacity = '0';
            dot.style.opacity = '0';
        };

        // Smooth animation loop
        const lerp = (start: number, end: number, factor: number) => {
            return start + (end - start) * factor;
        };

        let animationId: number;
        const animate = () => {
            pos.current.x = lerp(pos.current.x, target.current.x, 0.15);
            pos.current.y = lerp(pos.current.y, target.current.y, 0.15);

            cursor.style.transform = `translate(${pos.current.x - 20}px, ${pos.current.y - 20}px)`;
            dot.style.transform = `translate(${target.current.x - 4}px, ${target.current.y - 4}px)`;

            animationId = requestAnimationFrame(animate);
        };
        animate();

        // Hover effect on interactive elements
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.matches('a, button, [data-cursor]')) {
                cursor.classList.add('active');
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.matches('a, button, [data-cursor]')) {
                cursor.classList.remove('active');
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);

        return () => {
            cancelAnimationFrame(animationId);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    return (
        <>
            <div ref={cursorRef} className="cursor" />
            <div ref={dotRef} className="cursor-dot" />
        </>
    );
}

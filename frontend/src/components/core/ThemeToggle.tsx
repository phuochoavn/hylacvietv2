'use client';
import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

export default function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const current = document.documentElement.getAttribute('data-theme') as Theme;
        if (current === 'dark' || current === 'light') {
            setTheme(current);
        }
    }, []);

    const toggleTheme = useCallback(() => {
        const next: Theme = theme === 'light' ? 'dark' : 'light';
        setTheme(next);
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    }, [theme]);

    if (!mounted) return <div style={{ width: 52, height: 28 }} />;

    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            title={isDark ? 'Chế độ sáng' : 'Chế độ tối'}
            style={{
                position: 'relative',
                width: 52,
                height: 28,
                borderRadius: 14,
                border: 'none',
                cursor: 'pointer',
                background: isDark
                    ? 'linear-gradient(135deg, #2a2420, #1a1614)'
                    : 'linear-gradient(135deg, #F0EBE3, #E8E0D4)',
                boxShadow: isDark
                    ? 'inset 0 1px 3px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)'
                    : 'inset 0 1px 3px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.8)',
                transition: 'background 0.3s ease, box-shadow 0.3s ease',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
            }}
        >
            {/* Sliding knob */}
            <span
                style={{
                    position: 'absolute',
                    top: 3,
                    left: isDark ? 27 : 3,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: isDark
                        ? 'linear-gradient(135deg, #c9a227, #8b7355)'
                        : 'linear-gradient(135deg, #FFFFFF, #F5F0E8)',
                    boxShadow: isDark
                        ? '0 2px 6px rgba(0,0,0,0.4), 0 0 8px rgba(201,162,39,0.3)'
                        : '0 2px 6px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
                    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease, box-shadow 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* Icon inside knob */}
                {isDark ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1a1614" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                )}
            </span>
        </button>
    );
}

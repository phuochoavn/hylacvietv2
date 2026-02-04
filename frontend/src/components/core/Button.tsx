import { ReactNode, ElementType } from 'react';
import Link from 'next/link';

interface ButtonProps {
    children: ReactNode;
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    href?: string;
    external?: boolean;
    className?: string;
    onClick?: () => void;
    type?: 'button' | 'submit';
    disabled?: boolean;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    href,
    external = false,
    className = '',
    onClick,
    type = 'button',
    disabled = false,
}: ButtonProps) {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const sizeClass = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : '';
    const classes = `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();

    // External link
    if (href && external) {
        return (
            <a
                href={href}
                className={classes}
                target="_blank"
                rel="noopener noreferrer"
            >
                {children}
            </a>
        );
    }

    // Internal link
    if (href) {
        return (
            <Link href={href} className={classes}>
                {children}
            </Link>
        );
    }

    // Button
    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

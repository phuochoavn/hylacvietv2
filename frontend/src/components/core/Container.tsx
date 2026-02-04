import { ReactNode } from 'react';

interface ContainerProps {
    children: ReactNode;
    className?: string;
    size?: 'default' | 'wide' | 'narrow';
}

export default function Container({
    children,
    className = '',
    size = 'default',
}: ContainerProps) {
    const sizeClass = {
        default: 'container',
        wide: 'container container-wide',
        narrow: 'container container-narrow',
    }[size];

    return (
        <div className={`${sizeClass} ${className}`}>
            {children}
        </div>
    );
}

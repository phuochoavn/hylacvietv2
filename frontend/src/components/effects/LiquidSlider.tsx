'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ============================================
// SILK DISTORTION SHADER - Vertex Shader
// ============================================
const vertexShader = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// ============================================
// SILK DISTORTION SHADER - Fragment Shader
// ============================================
const fragmentShader = `
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform sampler2D uDisplacement;
uniform float uProgress;
uniform float uIntensity;

varying vec2 vUv;

void main() {
    // Sample displacement texture
    vec4 displacement = texture2D(uDisplacement, vUv);
    
    // Calculate distortion based on progress
    float distortionStrength = sin(uProgress * 3.14159) * uIntensity;
    
    // Create silk-like wave distortion
    vec2 distortedUV1 = vec2(
        vUv.x + (displacement.r - 0.5) * distortionStrength * (1.0 - uProgress),
        vUv.y + (displacement.g - 0.5) * distortionStrength * (1.0 - uProgress)
    );
    
    vec2 distortedUV2 = vec2(
        vUv.x + (displacement.r - 0.5) * distortionStrength * uProgress,
        vUv.y + (displacement.g - 0.5) * distortionStrength * uProgress
    );
    
    // Sample both textures with distortion
    vec4 texture1 = texture2D(uTexture1, distortedUV1);
    vec4 texture2 = texture2D(uTexture2, distortedUV2);
    
    // Smooth blend using displacement map for organic transition
    float mixFactor = smoothstep(0.0, 1.0, uProgress + (displacement.r - 0.5) * 0.3);
    
    // Final mix
    gl_FragColor = mix(texture1, texture2, mixFactor);
}
`;

// ============================================
// DISPLACEMENT TEXTURE GENERATOR
// Creates silk/fluid noise pattern
// ============================================
function createDisplacementTexture(): THREE.DataTexture {
    const size = 256;
    const data = new Uint8Array(size * size * 4);

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const idx = (i * size + j) * 4;

            // Create organic noise pattern like silk folds
            const x = j / size;
            const y = i / size;

            // Multiple sine waves for silk-like pattern
            const noise1 = Math.sin(x * 12 + y * 8) * 0.5 + 0.5;
            const noise2 = Math.sin(x * 20 - y * 15) * 0.3 + 0.5;
            const noise3 = Math.cos(x * 8 + y * 25) * 0.2 + 0.5;

            const combined = (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2);

            const value = Math.floor(combined * 255);
            data[idx] = value;     // R
            data[idx + 1] = value; // G
            data[idx + 2] = value; // B
            data[idx + 3] = 255;   // A
        }
    }

    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.needsUpdate = true;
    return texture;
}

// ============================================
// IMAGE PLANE COMPONENT (Three.js Mesh)
// ============================================
interface ImagePlaneProps {
    texture1: THREE.Texture;
    texture2: THREE.Texture;
    progress: number;
    intensity?: number;
}

function ImagePlane({ texture1, texture2, progress, intensity = 0.3 }: ImagePlaneProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { viewport } = useThree();

    // Create displacement texture once
    const displacementTexture = useMemo(() => createDisplacementTexture(), []);

    // Create shader material
    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTexture1: { value: texture1 },
                uTexture2: { value: texture2 },
                uDisplacement: { value: displacementTexture },
                uProgress: { value: 0 },
                uIntensity: { value: intensity },
            },
            vertexShader,
            fragmentShader,
            transparent: true,
        });
    }, [texture1, texture2, displacementTexture, intensity]);

    // Store progress in ref to avoid re-creating shader
    const progressRef = useRef(progress);
    const lastProgress = useRef(progress);

    // Update uniforms and invalidate only when progress changes
    useFrame(({ invalidate }) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uProgress.value = progress;
            // Only re-render when progress actually changed
            if (lastProgress.current !== progress) {
                lastProgress.current = progress;
                invalidate();
            }
        }
    });

    // Calculate aspect ratio to fill container
    const scale = useMemo(() => {
        return [viewport.width, viewport.height, 1] as [number, number, number];
    }, [viewport.width, viewport.height]);

    return (
        <mesh ref={meshRef} scale={scale}>
            <planeGeometry args={[1, 1, 32, 32]} />
            <primitive object={shaderMaterial} ref={materialRef} attach="material" />
        </mesh>
    );
}

// ============================================
// MAIN LIQUID SLIDER COMPONENT
// ============================================
interface LiquidSliderProps {
    images: string[];
    currentIndex: number;
    aspectRatio?: number;
    className?: string;
}

export default function LiquidSlider({
    images,
    currentIndex,
    aspectRatio = 3 / 4,
    className = ''
}: LiquidSliderProps) {
    const [textures, setTextures] = useState<THREE.Texture[]>([]);
    const [progress, setProgress] = useState(0);
    const [previousIndex, setPreviousIndex] = useState(currentIndex);
    const animationRef = useRef<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile for simpler rendering (no WebGL shaking)
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Load textures
    useEffect(() => {
        const loader = new THREE.TextureLoader();
        const loadedTextures: THREE.Texture[] = [];

        images.forEach((src, idx) => {
            loader.load(src, (texture) => {
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                loadedTextures[idx] = texture;

                if (loadedTextures.filter(Boolean).length === images.length) {
                    setTextures([...loadedTextures]);
                }
            });
        });

        return () => {
            loadedTextures.forEach(t => t?.dispose());
        };
    }, [images]);

    // Animate transition when index changes
    useEffect(() => {
        if (currentIndex !== previousIndex && textures.length > 0) {
            // Cancel any ongoing animation
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }

            // Animate progress from 0 to 1
            const duration = 1400; // 1.4 seconds - luxury slow
            const startTime = performance.now();

            const animate = (time: number) => {
                const elapsed = time - startTime;
                const t = Math.min(elapsed / duration, 1);

                // Ease-in-out for smooth silk movement
                const eased = t < 0.5
                    ? 2 * t * t
                    : 1 - Math.pow(-2 * t + 2, 2) / 2;

                setProgress(eased);

                if (t < 1) {
                    animationRef.current = requestAnimationFrame(animate);
                } else {
                    setPreviousIndex(currentIndex);
                    setProgress(0);
                }
            };

            animationRef.current = requestAnimationFrame(animate);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [currentIndex, previousIndex, textures.length]);

    // Don't render until textures are loaded
    if (textures.length === 0 || !textures[previousIndex] || !textures[currentIndex]) {
        return (
            <div
                className={`liquid-slider-placeholder ${className}`}
                style={{ aspectRatio }}
            >
                <div className="liquid-loading">
                    <div className="liquid-loading-spinner" />
                </div>
            </div>
        );
    }

    // Mobile: Simple static image (no WebGL, no shaking)
    if (isMobile) {
        return (
            <div
                className={`liquid-slider-container ${className}`}
                style={{ aspectRatio }}
            >
                <img
                    src={images[currentIndex]}
                    alt={`Product image`}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                    }}
                />
            </div>
        );
    }

    return (
        <div
            className={`liquid-slider-container ${className}`}
            style={{ aspectRatio }}
        >
            <Canvas
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance'
                }}
                camera={{ position: [0, 0, 1], fov: 75 }}
                frameloop="demand"
            >
                <ImagePlane
                    texture1={textures[previousIndex]}
                    texture2={textures[currentIndex]}
                    progress={progress}
                    intensity={0.3}
                />
            </Canvas>
        </div>
    );
}

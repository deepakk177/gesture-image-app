import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere, PerspectiveCamera, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

// Fibonacci Sphere Algorithm for even distribution
const getFibonacciPoints = (count, radius = 5) => {
    const points = [];
    if (count <= 1) {
        if (count === 1) points.push(new THREE.Vector3(0, 0, radius));
        return points;
    }
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2; // y from 1 to -1
        const r = Math.sqrt(1 - y * y); // radius at y
        const theta = phi * i;

        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;

        points.push(new THREE.Vector3(x * radius, y * radius, z * radius));
    }
    return points;
};

const ImagePanel = ({ url, position }) => {
    const texture = useLoader(THREE.TextureLoader, url);
    const meshRef = useRef();

    useEffect(() => {
        return () => {
            if (texture) texture.dispose();
        };
    }, [texture]);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.lookAt(0, 0, 0);
            meshRef.current.rotateY(Math.PI);
        }
    });

    return (
        <mesh position={position} ref={meshRef}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={texture} side={THREE.DoubleSide} transparent opacity={0.9} />
        </mesh>
    );
};

const GlobeScene = () => {
    const groupRef = useRef();
    const images = useStore((state) => state.images);
    const rotation = useStore((state) => state.rotation);
    const rotationVelocity = useStore((state) => state.rotationVelocity);
    const zoom = useStore((state) => state.zoom);
    const setRotation = useStore((state) => state.setRotation);
    const setRotationVelocity = useStore((state) => state.setRotationVelocity);

    const points = useMemo(() => getFibonacciPoints(images.length, 4), [images.length]);

    // Lerp state
    const lerpRotation = useRef({ x: 0, y: 0 });
    const lerpZoom = useRef(1);

    useFrame((state, delta) => {
        // Apply physics damping (Phase 7 & 9)
        const damping = 0.92;
        const autoDrift = images.length === 0 ? 0.0005 : 0.0002;

        setRotationVelocity((prev) => ({
            x: prev.x * damping,
            y: prev.y * damping + autoDrift
        }));

        setRotation((prev) => ({
            x: prev.x + rotationVelocity.x,
            y: prev.y + rotationVelocity.y
        }));

        // Apply Lerp (Phase 7)
        lerpRotation.current.x = THREE.MathUtils.lerp(lerpRotation.current.x, rotation.x, 0.1);
        lerpRotation.current.y = THREE.MathUtils.lerp(lerpRotation.current.y, rotation.y, 0.1);
        lerpZoom.current = THREE.MathUtils.lerp(lerpZoom.current, zoom, 0.1);

        if (groupRef.current) {
            groupRef.current.rotation.x = lerpRotation.current.x;
            groupRef.current.rotation.y = lerpRotation.current.y;
            groupRef.current.scale.setScalar(lerpZoom.current);
        }
    });

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />

            <group ref={groupRef}>
                {images.map((url, i) => (
                    <Suspense key={`${url}-${i}`} fallback={null}>
                        <ImagePanel url={url} position={points[i]} />
                    </Suspense>
                ))}

                {/* Holographic Core */}
                <Sphere args={[3.8, 64, 64]}>
                    <meshPhongMaterial
                        color="#111"
                        transparent
                        opacity={0.3}
                        shininess={100}
                        emissive="#4f46e5"
                        emissiveIntensity={0.1}
                    />
                </Sphere>
            </group>

            {/* Empty State UI (Phase 10) */}
            {images.length === 0 && (
                <Html center>
                    <div className="flex flex-col items-center gap-6 text-center select-none pointer-events-none w-80 animate-in fade-in zoom-in duration-1000">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/30 animate-pulse" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-white font-black text-xl uppercase tracking-[0.4em] opacity-40">
                                Globe Empty
                            </h2>
                            <p className="text-indigo-400/30 text-[10px] uppercase font-bold tracking-widest">
                                Drag & Drop Images to Initialize Texture Sphere
                            </p>
                        </div>
                    </div>
                </Html>
            )}
        </>
    );
};

export default GlobeScene;

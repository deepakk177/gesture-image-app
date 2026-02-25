import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, GradientTexture, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { useStore } from '../../store/useStore';

const Globe = () => {
    const globeRef = useRef();
    const rotation = useStore((state) => state.rotation);
    const zoom = useStore((state) => state.zoom);

    useFrame((state, delta) => {
        if (globeRef.current) {
            // Basic auto-rotation for now if no gesture
            globeRef.current.rotation.y += delta * 0.1;
        }
    });

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <OrbitControls enablePan={false} enableZoom={true} minDistance={2} maxDistance={10} />

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />

            <Sphere ref={globeRef} args={[1.5, 64, 64]} scale={zoom}>
                <MeshDistortMaterial
                    distort={0.1}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                >
                    <GradientTexture
                        stops={[0, 0.5, 1]}
                        colors={['#4f46e5', '#9333ea', '#db2777']}
                    />
                </MeshDistortMaterial>
            </Sphere>

            {/* Atmospheric Glow */}
            <Sphere args={[1.6, 64, 64]}>
                <meshStandardMaterial
                    color="#4f46e5"
                    transparent
                    opacity={0.1}
                    side={2} // THREE.DoubleSide
                />
            </Sphere>
        </>
    );
};

export default Globe;

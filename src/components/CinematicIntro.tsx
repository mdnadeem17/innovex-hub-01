import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// --- Background Components ---

const MovingGrid = () => {
    const gridRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (gridRef.current) {
            // Move grid infinite scrolling effect
            gridRef.current.position.z = (state.clock.getElapsedTime() * 0.5) % 1;
        }
    });

    return (
        <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
            <planeGeometry args={[50, 50, 50, 50]} />
            <meshBasicMaterial
                color="#06b6d4"
                wireframe
                transparent
                opacity={0.15}
            />
        </mesh>
    );
};

const Particles = ({ count = 500 }) => {
    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 20;
            p[i * 3 + 1] = (Math.random() - 0.5) * 10;
            p[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return p;
    }, [count]);

    const ref = useRef<THREE.Points>(null);
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={points}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial size={0.03} color="#fbbf24" transparent opacity={0.6} sizeAttenuation />
        </points>
    );
};

// --- Quotes Data ---
const QUOTES = [
    "Engineering the Future of Intelligence",
    "Autonomous Innovation Begins Here",
    "Where Robotics Meets Intelligence",
    "Next Generation Technology Platform"
];

// --- Main Intro ---
const CinematicIntro = ({ onComplete }: { onComplete: () => void }) => {
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [exit, setExit] = useState(false);

    useEffect(() => {
        // Rotate quotes every 1.2s
        const quoteInterval = setInterval(() => {
            setQuoteIndex(prev => (prev + 1) % QUOTES.length);
        }, 1200);

        // Sequence: 3s total duration before exit starts
        const exitTimer = setTimeout(() => {
            setExit(true); // Trigger exit animation
        }, 3000);

        // Actual removal callback
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 3800); // Wait for exit animation to finish

        return () => {
            clearInterval(quoteInterval);
            clearTimeout(exitTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-black overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
                y: exit ? "-100%" : "0%" // Slide up exit
            }}
            transition={{
                duration: 1.5,
                ease: [0.22, 1, 0.36, 1] // Custom ease for premium feel
            }}
        >
            {/* 3D Background */}
            <div className="absolute inset-0 z-0 opacity-60">
                <Canvas dpr={[1, 1.5]}>
                    <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={60} />
                    <color attach="background" args={['#000']} />
                    <fog attach="fog" args={['#000', 2, 12]} />
                    <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade />
                    <MovingGrid />
                    <Particles count={window.innerWidth < 768 ? 300 : 800} />
                </Canvas>
            </div>

            {/* Foreground Text */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, letterSpacing: "0.1em" }}
                    animate={{ opacity: 1, scale: 1, letterSpacing: "0.15em" }}
                    transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                >
                    {/* Metallic Text Effect */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-600 drop-shadow-[0_0_25px_rgba(234,179,8,0.4)] text-center uppercase">
                        InnoveX Hub.in
                    </h1>
                    {/* Glow Underlay */}
                    <div className="absolute inset-x-0 -bottom-4 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-70 blur-sm" />
                </motion.div>

                <div className="h-16 mt-8 p-4 flex items-center justify-center overflow-hidden w-full">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={quoteIndex}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-cyan-400/80 font-mono text-xs md:text-sm tracking-[0.2em] uppercase text-center"
                        >
                            {QUOTES[quoteIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>

            {/* Vignette & scanlines */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-20" />
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] z-20" />

            {/* Skip button if needed, but 3s is short enough */}
            {!exit && (
                <button
                    onClick={() => setExit(true)}
                    className="absolute bottom-8 right-8 z-50 text-xs text-white/30 hover:text-white uppercase tracking-widest transition-colors font-mono"
                >
                    Skip
                </button>
            )}
        </motion.div>
    );
};

export default CinematicIntro;

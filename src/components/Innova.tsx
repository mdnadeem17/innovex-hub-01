import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Radio, Globe, Layout, Code2, Database, Terminal, Settings } from 'lucide-react';
import { Button } from './ui/button';

// --- Types ---
type SceneState = 'lab' | 'alert' | 'launch' | 'ascent' | 'orbit' | 'reveal' | 'finished';

// --- Robot Component ---
const Robot = ({ id, x, y, behavior, scene }: { id: number, x: number, y: number, behavior: 'working' | 'inspecting' | 'observing', scene: SceneState }) => {
    // Unique float for each robot
    const randomAngle = id * 72;

    return (
        <motion.div
            initial={{ x, y, opacity: 0 }}
            animate={
                scene === 'lab' ? {
                    x, y: y + (Math.random() * 8 - 4),
                    opacity: 1,
                    rotate: behavior === 'working' ? [0, 5, 0] : [0, -3, 0],
                } : scene === 'alert' ? {
                    x, y, scale: 1.1, rotate: 0,
                    // Freeze
                } : scene === 'launch' ? {
                    y: y - 30, // Slight lift before launch
                    scale: 0.9,
                    transition: { duration: 0.4, ease: "backOut" }
                } : scene === 'ascent' ? {
                    y: -1500, // Launch up
                    x: x * (0.2 + Math.random() * 0.4), // Converge slightly but with randomness
                    transition: { duration: 1 + Math.random() * 0.5, ease: "easeInOut", delay: Math.random() * 0.2 }
                } : scene === 'orbit' || scene === 'reveal' ? {
                    x: 0, y: 0, opacity: 1, rotate: 0
                } : {}
            }
            transition={{ duration: scene === 'alert' ? 0.2 : 2.5, ease: "easeInOut" }}
            className="absolute z-30"
            style={{ transformOrigin: 'center center' }}
        >
            <div className={`relative transition-all duration-300 ${scene === 'alert' ? 'drop-shadow-[0_0_25px_rgba(239,68,68,1)]' : ''}`}>

                {/* Robot Body */}
                <div className="relative group">
                    <div className={`w-10 h-10 rounded-full ${scene === 'alert' ? 'bg-slate-900 border-red-500' : 'bg-slate-900 border-cyan-400'} border-[3px] flex items-center justify-center relative overflow-hidden transition-colors duration-300 shadow-lg`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />

                        {/* Eye / Visor */}
                        <div className={`w-6 h-2 rounded-full ${scene === 'alert' ? 'bg-red-500 animate-pulse shadow-[0_0_15px_red]' : 'bg-cyan-300 shadow-[0_0_10px_cyan]'} transition-colors duration-200`} />
                    </div>

                    {/* Energy Jets (Launch only) */}
                    {(scene === 'launch' || scene === 'ascent' || scene === 'orbit' || scene === 'reveal') && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: scene === 'orbit' ? 60 : 100, opacity: 0.9 }}
                            className="absolute top-full left-1/2 -translate-x-1/2 w-4 bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent blur-[3px]"
                        />
                    )}
                </div>

                {/* Interaction Effects (Lab Only) */}
                {scene === 'lab' && behavior === 'working' && (
                    <motion.div
                        animate={{ height: [0, 50, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8 + Math.random(), repeat: Infinity, repeatDelay: Math.random() }}
                        className="absolute top-full left-1/2 w-[1px] bg-yellow-300 -translate-x-1/2 origin-top shadow-[0_0_5px_yellow]"
                    />
                )}
                {scene === 'lab' && behavior === 'inspecting' && (
                    <motion.div
                        animate={{ opacity: [0.1, 0.4, 0.1], scale: [0.8, 1.2, 0.8], rotate: [0, 90, 180] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 w-16 h-16 mb-2 border border-cyan-500/30 rounded-full flex items-center justify-center"
                    >
                        <div className="w-12 h-12 border border-cyan-500/20 rounded-full animate-spin-reverse" />
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

const CinematicIntro = ({ onComplete }: { onComplete: () => void }) => {
    const [scene, setScene] = useState<SceneState>('lab');
    const [textIndex, setTextIndex] = useState(0);

    // Main Timeline
    useEffect(() => {
        let mounted = true;
        const timeline = async () => {
            // 1. LAB (0s) - Camera moves in slowly
            await wait(5000);
            if (!mounted) return;
            setScene('alert');

            // 2. ALERT (5s) - Freeze, look at camera
            await wait(2500);
            if (!mounted) return;
            setScene('launch');

            // 3. LAUNCH (7.5s) - Energy buildup
            await wait(600);
            if (!mounted) return;
            setScene('ascent');

            // 4. ASCENT (8.1s) - Sky transition + Platform starts rising
            // Note: The digital platform rises simultaneously with the robots during the 'orbit' phase in our logic
            await wait(1200);
            if (!mounted) return;
            setScene('orbit');

            // 5. ORBIT/CONSTRUCTION (9.3s) - Interface builds
            await wait(5500);
            if (!mounted) return;
            setScene('reveal');

            // 6. REVEAL (14.8s) - Logo shine
            await wait(7000);
            if (!mounted) return;
            onComplete();
        };
        timeline();
        return () => { mounted = false; };
    }, [onComplete]);

    // Text Reveal Timing
    useEffect(() => {
        if (scene === 'reveal') {
            const interval = setInterval(() => {
                setTextIndex(prev => Math.min(prev + 1, 3));
            }, 1500);
            return () => clearInterval(interval);
        }
    }, [scene]);

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    return (
        <div className="fixed inset-0 z-[100] bg-black text-white overflow-hidden cursor-none select-none font-sans perspective-[1500px]">
            <Button
                variant="ghost"
                className="absolute top-6 right-6 z-[120] text-white/40 hover:text-white uppercase tracking-[0.2em] text-[10px] pointer-events-auto backdrop-blur-sm bg-black/20 hover:bg-black/40 border border-white/10"
                onClick={onComplete}
            >
                Skip Intro
            </Button>

            {/* --- LAB SCENE (CAMERA MOVES IN) --- */}
            <AnimatePresence>
                {(scene === 'lab' || scene === 'alert' || scene === 'launch') && (
                    <motion.div
                        key="lab-container"
                        initial={{ scale: 1, z: 0 }}
                        animate={{ scale: scene === 'lab' ? 1.1 : 1.1, z: scene === 'lab' ? 100 : 100 }}
                        transition={{ duration: 6, ease: "linear" }}
                        exit={{ y: 800, opacity: 0, scale: 0.8, transition: { duration: 1.2, ease: "easeInOut" } }}
                        className="absolute inset-0 flex items-center justify-center transform-style-3d"
                    >
                        {/* Background Ambiance */}
                        <div className="absolute inset-0 bg-slate-950">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/40 via-black to-black opacity-80" />
                            <div className="absolute bottom-0 w-full h-full bg-[linear-gradient(to_bottom,#3b82f6_1px,transparent_1px),linear-gradient(to_right,#3b82f6_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.03] [transform:perspective(500px)_rotateX(60deg)] origin-bottom" />
                        </div>

                        {/* WORKBENCH SURFACE */}
                        <motion.div
                            className="relative w-[800px] h-[400px] bg-slate-900/40 border border-slate-800 rounded-3xl backdrop-blur-sm shadow-[0_0_100px_-20px_rgba(56,189,248,0.1)] flex items-center justify-center transform-style-3d [transform:rotateX(25deg)_translateY(50px)]"
                        >
                            {/* Table Glow */}
                            <div className="absolute inset-0 bg-cyan-500/5 rounded-3xl overflow-hidden pointer-events-none">
                                <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                            </div>

                            {/* --- SCATTERED COMPONENTS (Specifics) --- */}

                            {/* Left: Circuit Board */}
                            <div className="absolute top-12 left-12 w-32 h-40 border border-emerald-500/30 bg-emerald-900/20 rounded p-2 grid grid-cols-4 gap-1 opacity-60">
                                {[...Array(12)].map((_, i) => <div key={i} className="bg-emerald-500/20 rounded-sm" />)}
                                <div className="absolute -right-4 top-4 w-8 h-8 border border-white/10 rounded-full animate-spin-slow" />
                            </div>

                            {/* Right: Holographic Schematics */}
                            <div className="absolute bottom-16 right-16 w-48 h-32 border-l-2 border-b-2 border-purple-500/30 bg-purple-900/10 skew-x-12 p-4">
                                <div className="w-full h-[1px] bg-purple-500/40 mb-2" />
                                <div className="w-2/3 h-[1px] bg-purple-500/40 mb-2" />
                                <div className="w-3/4 h-[1px] bg-purple-500/40" />
                                <Zap size={24} className="text-purple-400 absolute top-2 right-2 opacity-50" />
                            </div>

                            {/* Center: Main Processor */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-slate-950/80 border border-cyan-500/40 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                                <Cpu size={64} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                                <div className="absolute -inset-4 border border-dashed border-cyan-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
                            </div>

                            {/* Loose Wires / Tools */}
                            <div className="absolute bottom-10 left-32 opacity-40 rotate-45"><Settings size={32} className="text-slate-500" /></div>
                            <div className="absolute top-16 right-48 opacity-40 -rotate-12"><Radio size={28} className="text-blue-400" /></div>

                            {/* Active "Experimentation" Particles */}
                            {scene === 'lab' && (
                                <motion.div
                                    className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]"
                                    animate={{ opacity: [0, 1, 0], scale: [0, 2, 0], x: [0, 20, -20, 0], y: [0, -20, 20, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
                                />
                            )}

                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>

            {/* ROBOTS SWARM - Uncoupled from Lab Container to ensure smooth ascent */}
            <div className="absolute inset-0 pointer-events-none transform-style-3d z-40">
                <Robot id={1} x={-250} y={-80} behavior="working" scene={scene} /> {/* Assembler */}
                <Robot id={2} x={250} y={-40} behavior="inspecting" scene={scene} /> {/* Tester */}
                <Robot id={3} x={0} y={-250} behavior="observing" scene={scene} /> {/* Scanner */}
                <Robot id={4} x={-180} y={120} behavior="inspecting" scene={scene} /> {/* Mechanic */}
                <Robot id={5} x={200} y={150} behavior="working" scene={scene} /> {/* Builder */}
            </div>


            {/* --- SKY & INTERFACE (SIMULTANEOUS RISE) --- */}
            {(scene === 'ascent' || scene === 'orbit' || scene === 'reveal') && (
                <motion.div
                    key="sky-container"
                    className="absolute inset-0 overflow-hidden"
                >
                    {/* Parallax Sky Background */}
                    <motion.div
                        initial={{ y: '-40%' }}
                        animate={{ y: '0%' }}
                        transition={{ duration: 4, ease: "easeOut" }}
                        className="absolute inset-0 h-[140%] bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617]"
                    />

                    {/* Atmospheric Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent opacity-60" />

                    {/* Rising Light Particles */}
                    {(scene === 'ascent' || scene === 'orbit') && (
                        <div className="absolute inset-0 overflow-hidden">
                            {[...Array(40)].map((_, i) => (
                                <motion.div
                                    key={`particle-${i}`}
                                    className="absolute w-[2px] bg-gradient-to-t from-transparent via-cyan-300 to-transparent"
                                    initial={{ bottom: '-10%', left: `${10 + Math.random() * 80}%`, height: 20, opacity: 0 }}
                                    animate={{ bottom: '110%', height: 150, opacity: [0, 0.7, 0] }}
                                    transition={{ duration: 1.2 + Math.random(), delay: Math.random() * 0.5, repeat: Infinity }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Orbiting Robots around Interface */}
                    <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
                        {[0, 72, 144, 216, 288].map((deg, i) => (
                            <motion.div
                                key={`orbit-${i}`}
                                className="absolute"
                                initial={{ rotate: deg, scale: 0.2, opacity: 0 }}
                                animate={{
                                    rotate: deg + 360,
                                    scale: scene === 'reveal' ? 1.3 : 1.1,
                                    opacity: 1
                                }}
                                transition={{
                                    rotate: { duration: 14, repeat: Infinity, ease: "linear" },
                                    opacity: { duration: 0.5 },
                                    scale: { duration: 2 }
                                }}
                            >
                                <div className="translate-y-[-320px]">
                                    {/* Distant Robot with LONG Trail */}
                                    <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_15px_cyan]" />
                                    <div className="w-[2px] h-32 bg-gradient-to-t from-cyan-400/0 via-cyan-400 to-cyan-400 mx-auto -mt-1 blur-[1px]" />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* DIGITAL PLATFORM / WEBSITE RISING */}
                    <div className="absolute inset-0 flex items-center justify-center z-30">
                        <motion.div
                            className="relative w-[90vw] max-w-6xl aspect-[16/9] border border-cyan-500/30 rounded-2xl bg-slate-950/80 backdrop-blur-xl overflow-hidden shadow-[0_0_150px_-30px_rgba(6,182,212,0.3)]"
                            initial={{ y: 800, scale: 0.6, rotateX: 40, opacity: 0 }}
                            animate={{ y: 0, scale: scene === 'reveal' ? 0.95 : 0.85, rotateX: scene === 'reveal' ? 0 : 10, opacity: 1 }}
                            transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }} // smooth "rise" curve
                        >
                            {/* 1. Wireframe / Grid Formation */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f61a_1px,transparent_1px),linear-gradient(to_bottom,#3b82f61a_1px,transparent_1px)] bg-[size:32px_32px]" />

                            <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent"
                                animate={{ opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            />

                            {/* 2. UI Elements Assembling - No condition, just sequenced delays */}
                            <div className="absolute inset-0 p-8 flex flex-col gap-6">
                                {/* Navbar */}
                                <motion.div
                                    initial={{ y: -50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    className="h-20 border-b border-white/10 flex items-center px-6 justify-between"
                                >
                                    <div className="flex gap-4 items-center">
                                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 animate-pulse" />
                                        <div className="w-32 h-4 bg-white/10 rounded" />
                                    </div>
                                    <div className="flex gap-4">
                                        {[1, 2, 3, 4].map(n => <div key={n} className="w-20 h-4 bg-white/5 rounded" />)}
                                    </div>
                                </motion.div>

                                {/* Hero Content */}
                                <div className="flex-1 grid grid-cols-12 gap-6 items-center">
                                    <div className="col-span-7 space-y-6">
                                        <motion.div
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: "80%", opacity: 1 }}
                                            transition={{ delay: 1, duration: 1 }}
                                            className="h-16 bg-white/10 rounded-lg"
                                        />
                                        <motion.div
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: "100%", opacity: 1 }}
                                            transition={{ delay: 1.2, duration: 1 }}
                                            className="h-4 bg-white/5 rounded"
                                        />
                                        <motion.div
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: "90%", opacity: 1 }}
                                            transition={{ delay: 1.3, duration: 1 }}
                                            className="h-4 bg-white/5 rounded"
                                        />
                                        <div className="flex gap-4 pt-4">
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }} className="w-32 h-12 bg-cyan-600/20 rounded-lg border border-cyan-500/30" />
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.6 }} className="w-32 h-12 bg-white/5 rounded-lg border border-white/10" />
                                        </div>
                                    </div>

                                    {/* Right Side Visual */}
                                    <div className="col-span-5 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2),transparent)]" />
                                        <Globe size={64} className="text-white/20 animate-pulse-slow" />
                                    </div>
                                </div>
                            </div>

                            {/* --- FINAL REVEAL OVERLAY --- */}
                            <AnimatePresence>
                                {scene === 'reveal' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 1 }}
                                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md"
                                    >
                                        <motion.div
                                            initial={{ scale: 2, filter: 'blur(20px)', opacity: 0 }}
                                            animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="relative text-center"
                                        >
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full" />

                                            <motion.img
                                                src="/innovex-logo.png"
                                                alt="InnoveX"
                                                className="w-32 h-32 mx-auto mb-6 relative z-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                                                animate={{
                                                    filter: ["drop-shadow(0 0 10px rgba(6,182,212,0.5))", "drop-shadow(0 0 30px rgba(6,182,212,0.8))", "drop-shadow(0 0 10px rgba(6,182,212,0.5))"]
                                                }}
                                                transition={{ duration: 3, repeat: Infinity }}
                                                onError={(e) => e.currentTarget.style.display = 'none'}
                                            />

                                            <h1 className="text-6xl md:text-8xl font-bold font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-500 mb-8 relative z-10">
                                                INNOVEX
                                            </h1>
                                        </motion.div>

                                        {/* Voiceover Text - Synchronized */}
                                        <div className="h-24 flex flex-col items-center justify-center">
                                            {[
                                                "Innovation begins with curiosity.",
                                                "Built by intelligence.",
                                                "Powered by imagination.",
                                                "Welcome to the future."
                                            ].map((text, i) => (
                                                i === textIndex && (
                                                    <motion.p
                                                        key={i}
                                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -20, scale: 1.05 }}
                                                        transition={{ duration: 0.8 }}
                                                        className="text-blue-100/90 font-display tracking-[0.2em] text-lg md:text-2xl uppercase text-center drop-shadow-lg"
                                                    >
                                                        {text}
                                                    </motion.p>
                                                )
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </motion.div>
                    </div>

                </motion.div>
            )}

            {/* Cinematic Noise & Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay" />
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,black_110%)] opacity-80" />
        </div>
    );
};

export default CinematicIntro;

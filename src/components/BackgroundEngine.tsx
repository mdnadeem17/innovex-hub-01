import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BackgroundEngine = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#02050A]">
      {/* Base Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] opacity-20" />
      
      {/* Moving Neural Grid Overlay (simulated via animated background position) */}
      <motion.div 
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDIwaDQwTTIwIDB2NDAiIHN0cm9rZT0icmdiYSgyNTUsMjAwLDg3LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz4KPC9zdmc+')] opacity-30 mix-blend-screen"
        style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
        animate={{
          backgroundPosition: ['0px 0px', '40px 40px'],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 3,
        }}
      />

      {/* Mouse Follow Glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none mix-blend-screen hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(255,200,87,0.06) 0%, rgba(0,50,255,0.02) 40%, transparent 70%)',
          left: -300,
          top: -300,
          transform: 'translateZ(0)',
          willChange: 'transform, opacity'
        }}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{
          type: 'tween',
          ease: 'easeOut',
          duration: 0.5,
        }}
      />

      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Light Streaks */}
      <motion.div 
        className="absolute top-1/4 -left-1/4 w-[150%] h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent rotate-[-15deg] blur-[2px]"
        style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
        animate={{ opacity: [0, 1, 0], x: ['-50%', '50%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear', delay: 2 }}
      />
      <motion.div 
        className="absolute top-2/3 -left-1/4 w-[150%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent rotate-[10deg]"
        style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
        animate={{ opacity: [0, 1, 0], x: ['50%', '-50%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />

      {/* Ambient static glows */}
      <motion.div 
        style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[80px] mix-blend-screen" 
      />
      <motion.div 
        style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[80px] mix-blend-screen" 
      />
      <motion.div 
        style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[60px] mix-blend-screen hidden md:block" 
      />

      {/* Floating Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary rounded-full blur-[1px]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.1,
            transform: 'translateZ(0)',
            willChange: 'transform, opacity'
          }}
          animate={{
            y: [0, -100 - Math.random() * 100],
            x: [0, (Math.random() - 0.5) * 50],
            opacity: [0, Math.random() * 0.5 + 0.2, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 10,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundEngine;

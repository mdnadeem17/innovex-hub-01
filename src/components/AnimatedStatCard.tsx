import { motion, useInView, useAnimation, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface AnimatedStatCardProps {
  icon: LucideIcon;
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
}

const AnimatedStatCard = ({ icon: Icon, value, suffix = '', label, delay = 0 }: AnimatedStatCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  
  useEffect(() => {
    if (isInView) {
      const animation = animate(count, value, {
        duration: 2,
        delay: delay,
        ease: "easeOut"
      });
      return animation.stop;
    }
  }, [count, value, isInView, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group overflow-hidden rounded-2xl glass-premium p-6 border border-white/5 hover:border-primary/40 transition-all duration-500 shadow-xl hover:shadow-[0_0_30px_rgba(255,200,87,0.15)] flex flex-col items-center justify-center text-center"
    >
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-primary/20 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Floating particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/40 rounded-full"
          style={{ 
            left: `${15 + Math.random() * 70}%`, 
            top: `${15 + Math.random() * 70}%` 
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}

      <div className="relative z-10 p-3 rounded-xl bg-primary/10 border border-primary/20 mb-4 text-primary group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,200,87,0.3)] transition-all duration-300">
        <Icon size={24} />
      </div>

      <div className="relative z-10 flex items-center justify-center text-4xl md:text-5xl font-display font-bold text-white group-hover:text-primary transition-colors duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] mb-2">
        <motion.span>{rounded}</motion.span>
        {suffix && <span>{suffix}</span>}
      </div>

      <div className="relative z-10 text-xs md:text-sm text-muted-foreground uppercase tracking-widest font-display font-light">
        {label}
      </div>
    </motion.div>
  );
};

export default AnimatedStatCard;

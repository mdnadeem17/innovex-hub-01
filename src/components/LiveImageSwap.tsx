import { useState, useEffect } from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import ImageWithFallback from './ImageWithFallback';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  mainImage: string;
  itemId: string;
  type: 'project' | 'achievement' | 'participation';
  alt: string;
  className?: string;
}

const LiveImageSwap = ({ mainImage, itemId, type, alt, className = '' }: Props) => {
  const projectMemories = useQuery(api.memories.list, type === 'project' ? { project_id: itemId as Id<"projects"> } : "skip");
  const achievementMemories = useQuery(api.achievement_memories.list, type === 'achievement' ? { achievement_id: itemId as Id<"achievements"> } : "skip");
  const participationMemories = useQuery(api.participation_memories.list, type === 'participation' ? { participation_id: itemId as Id<"participations"> } : "skip");

  let memories: any[] = [];
  if (type === 'project') memories = projectMemories || [];
  if (type === 'achievement') memories = achievementMemories || [];
  if (type === 'participation') memories = participationMemories || [];

  const memoryImages = memories.filter(m => m.image_url && (!m.type || m.type === 'image')).map(m => m.image_url);
  
  // Create unique list of images, starting with the main one
  const allImages = Array.from(new Set([mainImage, ...memoryImages].filter(Boolean)));

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (allImages.length <= 1) return;
    
    // Add a slight random delay so multiple cards don't swap at the exact same millisecond
    const randomOffset = Math.random() * 1000;
    
    const timeout = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
      
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % allImages.length);
      }, 4000);
      
      return () => clearInterval(interval);
    }, randomOffset);
    
    return () => clearTimeout(timeout);
  }, [allImages.length]);

  if (allImages.length === 0) {
    return <ImageWithFallback src={mainImage} alt={alt} className={`object-cover object-top ${className}`} />;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <ImageWithFallback
            src={allImages[currentIndex]}
            alt={alt}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LiveImageSwap;

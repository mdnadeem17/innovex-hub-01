import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import LiveImageSwap from '@/components/LiveImageSwap';
import { useAuth } from '@/contexts/AuthContext';

export interface participation {
  _id: string;
  title: string;
  description: string;
  image_url: string;
  event_name: string;
  date: string;
  certificate_link?: string;
}

interface Props {
  participation: participation;
  onViewMore: (participation: participation) => void;
  index: number;
}

const getStartupStory = (title: string, desc: string) => {
  const t = (title + desc).toLowerCase();
  if (t.includes('hackathon')) return "Built under pressure. Ranked among top innovators.";
  if (t.includes('pitch') || t.includes('shark')) return "Pitching dreams before building empires.";
  if (t.includes('robot') || t.includes('line follower')) return "Machines followed lines. We followed vision.";
  if (t.includes('design') || t.includes('ui/ux')) return "Design isn’t art. It’s persuasion.";
  return "Ideas don’t wait for permission. Building the future.";
};

const getTechTags = (title: string, desc: string) => {
  const t = (title + desc).toLowerCase();
  const tags: string[] = [];
  if (t.includes('pitch') || t.includes('shark')) tags.push('STARTUP', 'PITCH EVENT');
  if (t.includes('robot') || t.includes('line follower')) tags.push('ROBOTICS');
  if (t.includes('ai') || t.includes('machine learning')) tags.push('AI');
  if (t.includes('national')) tags.push('NATIONAL LEVEL');
  if (t.includes('hackathon')) tags.push('48H BUILD');
  if (t.includes('top')) tags.push('TOP 5');
  if (tags.length === 0) tags.push('INNOVATION');
  return tags.slice(0, 3);
};

const participationCard = ({ participation, onViewMore, index }: Props) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleViewJourney = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/participations/${participation._id}/memories`);
  };

  const storyLine = getStartupStory(participation.title, participation.description);
  const techTags = getTechTags(participation.title, participation.description);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full bg-[#050B14]/80 backdrop-blur-xl border border-white/5 hover:border-primary/40 transition-all duration-500 shadow-2xl hover:shadow-[0_0_40px_rgba(255,200,87,0.15)]"
      onClick={() => onViewMore(participation)}
    >
      {/* Image with Cinematic Overlay */}
      <div className="relative overflow-hidden h-64 md:h-56 shrink-0">
        <div className="absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-[#050B14] to-transparent" />
        
        {/* Warm tint overlay */}
        <div className="absolute inset-0 z-10 bg-[#FFAA00]/10 mix-blend-overlay pointer-events-none" />

        <div className="w-full h-full transform transition-transform duration-1000 group-hover:scale-110">
          <LiveImageSwap
            mainImage={participation.image_url}
            itemId={participation._id}
            type="participation"
            alt={participation.title}
            className="w-full h-full"
          />
        </div>
        
        {/* Date Badge */}
        <div className="absolute top-4 right-4 z-20">
          <span className="text-[10px] uppercase tracking-widest text-primary/80 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-primary/20">
            {participation.date}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow relative z-20 -mt-6">
        {/* Tech Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {techTags.map(tag => (
            <span key={tag} className="text-[9px] font-display font-bold tracking-[0.2em] text-primary bg-primary/5 px-2 py-1 rounded border border-primary/20 shadow-[0_0_10px_rgba(255,200,87,0.1)]">
              {tag}
            </span>
          ))}
        </div>

        <h3 className="font-display text-lg tracking-wide text-white group-hover:text-primary transition-colors duration-300 leading-tight mb-2">
          {participation.title}
        </h3>
        
        <p className="text-[11px] text-muted-foreground font-display tracking-widest uppercase mb-4 opacity-70">
          {participation.event_name}
        </p>
        
        <div className="flex-grow flex flex-col justify-center my-2">
          <p className={`text-sm text-foreground/80 font-light italic border-l-2 border-primary/30 pl-4 py-1 transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
            "{storyLine}"
          </p>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="text-primary/70 hover:text-primary text-[10px] uppercase font-display tracking-widest flex items-center gap-1 mt-2 self-start transition-colors"
          >
            {isExpanded ? <><ChevronUp size={12} /> Show Less</> : <><ChevronDown size={12} /> Read More</>}
          </button>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-primary text-xs font-display font-bold tracking-widest uppercase transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(255,200,87,0.5)]">
            Explore Journey
            <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-2" />
          </div>

          {user && (
            <button
              onClick={handleViewJourney}
              className="px-4 py-1.5 rounded bg-primary/10 hover:bg-primary/20 text-primary text-[10px] uppercase font-display font-bold tracking-widest border border-primary/20 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,200,87,0.2)] flex items-center gap-1"
            >
              <Sparkles size={10} />
              Behind Build
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default participationCard;

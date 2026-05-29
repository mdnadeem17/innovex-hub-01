import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import LiveImageSwap from '@/components/LiveImageSwap';
import { useAuth } from '@/contexts/AuthContext';

export interface Achievement {
  _id: string;
  title: string;
  description: string;
  image_url: string;
  event_name: string;
  date: string;
  certificate_link?: string;
}

interface Props {
  achievement: Achievement;
  onViewMore: (achievement: Achievement) => void;
  index: number;
}

const AchievementCard = ({ achievement, onViewMore, index }: Props) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleViewJourney = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/achievements/${achievement._id}/memories`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group glass rounded-2xl overflow-hidden glow-box cursor-pointer gradient-border flex flex-col h-full"
      onClick={() => onViewMore(achievement)}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-64 md:h-48 shrink-0">
        <LiveImageSwap
          mainImage={achievement.image_url}
          itemId={achievement._id}
          type="achievement"
          alt={achievement.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-display text-sm tracking-wider text-primary">{achievement.title}</h3>
            <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded border border-white/10 whitespace-nowrap ml-2">
                {achievement.date}
            </span>
        </div>
        <p className="text-xs text-accent font-display tracking-wider mb-2">{achievement.event_name}</p>
        
        <div className="flex-grow flex flex-col mb-4">
          <p className={`text-sm text-muted-foreground transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
            {achievement.description}
          </p>
          {achievement.description && achievement.description.length > 80 && (
            <button 
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="text-primary/70 hover:text-primary text-[10px] uppercase font-display tracking-widest flex items-center gap-1 mt-2 self-start transition-colors"
            >
              {isExpanded ? <><ChevronUp size={12} /> Show Less</> : <><ChevronDown size={12} /> Read More</>}
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2 text-accent text-xs font-display tracking-wider group-hover:text-primary transition-colors">
            View Details
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>

          {user && (
            <button
              onClick={handleViewJourney}
              className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-display tracking-wider border border-primary/20 transition-all hover:scale-105"
            >
              View Journey
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementCard;

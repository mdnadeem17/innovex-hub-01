import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight } from 'lucide-react';
import type { Project } from '@/data/projects';
import LiveImageSwap from '@/components/LiveImageSwap';

interface Props {
  project: Project;
  onViewMore: (project: Project) => void;
  index: number;
}


const ProjectCard = ({ project, onViewMore, index }: Props) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleViewJourney = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/projects/${project.id}/memories`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.03, rotateX: 5, rotateY: -2 }}
      whileTap={{ scale: 0.95, rotateX: 0, rotateY: 0 }}
      className="group relative bg-[#050B14]/80 backdrop-blur-xl rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-primary/50 shadow-2xl hover:shadow-[0_0_50px_rgba(255,200,87,0.25)] transition-all duration-500 flex flex-col h-full animate-float"
      onClick={() => onViewMore(project)}
    >
      {/* Top Corner Shine */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors duration-700 z-0" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent" />

      {/* Image */}
      <div className="relative overflow-hidden h-48 shrink-0 border-b border-white/5 z-10">
        <div className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center gap-2 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-[pulse_2s_ease-in-out_infinite]" />
          <span className="text-[10px] font-display font-bold tracking-widest text-white uppercase">Building</span>
        </div>
        <LiveImageSwap
          mainImage={project.image_url}
          itemId={project.id}
          type="project"
          alt={project.title}
          className="w-full h-full brightness-125 group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-[#050B14]/40 to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow relative z-10">
        <h3 className="font-display font-bold text-xl tracking-wider text-white group-hover:text-primary transition-colors mb-2 leading-tight drop-shadow-md">{project.title}</h3>
        <p className="text-sm text-white/80 font-light line-clamp-2 mb-4 flex-grow leading-relaxed">{project.description}</p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2 text-accent text-xs font-display tracking-wider group-hover:text-primary transition-colors">
            View More
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

export default ProjectCard;

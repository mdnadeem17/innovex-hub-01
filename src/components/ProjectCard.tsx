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
      whileHover={{ y: -8 }}
      className="group glass rounded-2xl overflow-hidden glow-box cursor-pointer gradient-border flex flex-col h-full"
      onClick={() => onViewMore(project)}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48 shrink-0">
        <LiveImageSwap
          mainImage={project.image_url}
          itemId={project.id}
          type="project"
          alt={project.title}
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-display text-sm tracking-wider text-primary mb-2">{project.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">{project.description}</p>

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

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageWithFallback from '@/components/ImageWithFallback';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useAuth } from "@/contexts/AuthContext";

const SourceCodeSection = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  const isLink = code.trim().startsWith('http');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section>
      <h2 className="font-display text-sm tracking-widest text-primary/70 mb-3">SOURCE CODE</h2>
      {isLink ? (
        <a
          href={code}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors font-display text-sm tracking-wider"
        >
          View Source Repository <ExternalLink size={14} />
        </a>
      ) : (
        <div className="relative">
          <pre className="glass rounded-xl p-4 text-sm text-green-400 overflow-x-auto whitespace-pre-wrap break-words max-h-96">
            <code>{code}</code>
          </pre>
          <button
            type="button"
            onClick={handleCopy}
            className="absolute top-3 right-3 p-2 rounded-lg glass text-muted-foreground hover:text-primary transition-colors"
            aria-label="Copy source code"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      )}
    </section>
  );
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Safe ID check
  const projectId = id as Id<"projects">; // Casting to Convex ID type

  const project = useQuery(api.projects.get, projectId ? { id: projectId } : "skip");

  if (project === undefined) {
    return (
      <div className="pt-24 px-4 text-center min-h-screen flex items-center justify-center">
        <p className="font-display text-muted-foreground tracking-wider">Loading...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-24 px-4 text-center min-h-screen flex items-center justify-center">
        <div>
          <h1 className="font-display text-2xl gradient-text mb-4">Project Not Found</h1>
          <Button variant="glow" onClick={() => navigate('/projects')}>Back to Projects</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 min-h-screen">
      {/* Hero image */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <ImageWithFallback src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>

      <div className="container mx-auto max-w-3xl px-4 -mt-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors font-display text-xs tracking-wider"
          >
            <ArrowLeft size={16} /> Back to Projects
          </button>

          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white drop-shadow-lg">
              {project.title}
            </h1>

          </div>

          <div className="glass rounded-xl p-8 glow-box mb-8">
            <section className="mb-8">
              <h2 className="font-display text-sm tracking-widest text-primary/70 mb-3">DESCRIPTION</h2>
              <div className="font-body text-foreground/80 whitespace-pre-wrap break-words text-base leading-relaxed">{project.description}</div>
            </section>

            <div className="h-px bg-white/10 w-full mb-8" />

            {project.components && (
              <>
                <section className="mb-8">
                  <h2 className="font-display text-sm tracking-widest text-primary/70 mb-3">COMPONENTS</h2>
                  <div className="font-body text-foreground/80 whitespace-pre-wrap break-words text-base leading-relaxed">{project.components}</div>
                </section>
                <div className="h-px bg-white/10 w-full mb-8" />
              </>
            )}

            {project.video_link && project.video_link.trim() !== '' && (
              <>
                <section className="mb-8">
                  <h2 className="font-display text-sm tracking-widest text-primary/70 mb-3">VIDEO</h2>
                  <a
                    href={project.video_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors font-display text-sm tracking-wider"
                  >
                    Watch Video <ExternalLink size={14} />
                  </a>
                </section>
                <div className="h-px bg-white/10 w-full mb-8" />
              </>
            )}

            {project.source_code && (
              <SourceCodeSection code={project.source_code} />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetail;

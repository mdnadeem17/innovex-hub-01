import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageWithFallback from '@/components/ImageWithFallback';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useToast } from '@/hooks/use-toast';

const participationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const participationId = id as Id<"participations">;

  const participation = useQuery(api.participations.get, participationId ? { id: participationId } : "skip");

  if (participation === undefined) {
    return (
      <div className="pt-24 px-4 text-center min-h-screen flex items-center justify-center">
        <p className="font-display text-muted-foreground tracking-wider">Loading...</p>
      </div>
    );
  }

  if (!participation) {
    return (
      <div className="pt-24 px-4 text-center min-h-screen flex items-center justify-center">
        <div>
          <h1 className="font-display text-2xl gradient-text mb-4">participation Not Found</h1>
          <Button variant="glow" onClick={() => navigate('/participations')}>Back to participations</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 min-h-screen">
      {/* Hero image */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <ImageWithFallback src={participation.image_url} alt={participation.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>

      <div className="container mx-auto max-w-3xl px-4 -mt-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <button
            onClick={() => navigate('/participations')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors font-display text-xs tracking-wider"
          >
            <ArrowLeft size={16} /> Back to participations
          </button>

          <div className="flex flex-col mb-6">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white drop-shadow-lg mb-2">
              {participation.title}
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-accent font-display tracking-wider">
                {participation.event_name}
              </span>
              <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded border border-white/10">
                {participation.date}
              </span>
            </div>
          </div>

          <div className="glass rounded-xl p-8 glow-box mb-8">
            <section className="mb-8">
              <h2 className="font-display text-sm tracking-widest text-primary/70 mb-3">DETAILS</h2>
              <div className="font-body text-foreground/80 whitespace-pre-wrap break-words text-base leading-relaxed">{participation.description}</div>
            </section>

            <div className="h-px bg-white/10 w-full mb-8" />
            <section>
              <h2 className="font-display text-sm tracking-widest text-primary/70 mb-3">PROOF / CERTIFICATE</h2>
              {participation.certificate_link && participation.certificate_link.trim() !== '' ? (
                <a
                  href={participation.certificate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors font-display text-sm tracking-wider"
                >
                  View Certificate <ExternalLink size={14} />
                </a>
              ) : (
                <button
                  onClick={() => toast({ title: "Not Available", description: "Certificate is not uploaded for this participation." })}
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-display text-sm tracking-wider"
                >
                  View Certificate <ExternalLink size={14} />
                </button>
              )}
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default participationDetail;

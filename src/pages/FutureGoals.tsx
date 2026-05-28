import { motion } from 'framer-motion';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ImageWithFallback from '@/components/ImageWithFallback';

const FutureGoals = () => {
  const goals = useQuery(api.goals.list);

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text glow-text mb-4">
            Future Goals
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {"What we're building next at InnoveX Hub"}
          </p>
        </motion.div>

        <div className="space-y-16">
          {goals === undefined ? (
            <div className="text-center text-muted-foreground">Loading goals...</div>
          ) : goals.length === 0 ? (
            <div className="text-center text-muted-foreground">No future goals posted yet.</div>
          ) : (
            goals.map((goal, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={goal._id}
                  initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
                >
                  {goal.image_url && (
                    <div className="md:w-1/2 overflow-hidden rounded-2xl glass group">
                      <ImageWithFallback
                        src={goal.image_url}
                        alt={goal.text}
                        loading="lazy"
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className={goal.image_url ? 'md:w-1/2' : 'w-full'}>
                    <p className="text-foreground/70 leading-relaxed">{goal.text}</p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default FutureGoals;

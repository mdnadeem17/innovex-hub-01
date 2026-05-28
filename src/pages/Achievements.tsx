import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AchievementCard, { Achievement } from '@/components/AchievementCard';
import BecomeMemberModal from '@/components/BecomeMemberModal';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const Achievements = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [memberModal, setMemberModal] = useState(false);

  const convexAchievements = useQuery(api.achievements.list);
  const achievements = convexAchievements || [];

  const handleViewMore = (achievement: Achievement) => {
    if (role === 'guest') {
      setMemberModal(true);
    } else {
      navigate(`/achievements/${achievement._id}`);
    }
  };

  return (
    <div className="pt-20 md:pt-24 pb-16 px-4 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text glow-text mb-4">
            Wall of Fame
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Celebrating the milestones, awards, and victories of our collective
          </p>
        </motion.div>

        {convexAchievements === undefined ? (
           <div className="text-center text-muted-foreground">Loading achievements...</div>
        ) : achievements.length === 0 ? (
           <div className="text-center text-muted-foreground">No achievements yet. Check back soon!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {achievements.map((achievement: any, i: number) => (
              <AchievementCard key={achievement._id} achievement={achievement} onViewMore={handleViewMore} index={i} />
            ))}
          </div>
        )}
      </div>

      <BecomeMemberModal open={memberModal} onClose={() => setMemberModal(false)} />
    </div>
  );
};

export default Achievements;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ProjectCard from '@/components/ProjectCard';
import AchievementCard from '@/components/AchievementCard';
import BecomeMemberModal from '@/components/BecomeMemberModal';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import heroBg from '@/assets/hero-bg.jpg';
import { Rocket, Eye, Cpu, Heart } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';
import ParticipationCard from '@/components/ParticipationCard';

const ABOUT_SECTIONS = [
  {
    icon: Rocket,
    title: 'Our Mission',
    text: 'To create a space where engineering students can experiment, prototype, and build real-world solutions. We believe innovation starts when curiosity meets capability.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    text: 'A future where every aspiring engineer has access to a collaborative lab environment — where ideas are not just discussed, but built, tested, and launched.',
  },
  {
    icon: Cpu,
    title: 'What We Build',
    text: 'From autonomous robots and AI systems to custom PCBs and IoT networks — we tackle projects that push boundaries. Every build is a lesson, every failure is data.',
  },
  {
    icon: Heart,
    title: 'Why We Exist',
    text: "Because textbooks alone don't build engineers. We exist to bridge the gap between academic theory and hands-on creation. This is where builders belong.",
  },
];

const APPLY_MAILTO =
  'mailto:innovexhub01@gmail.com?subject=Membership Application&body=Name:%0ACollege Name:%0AUSN No / Reference ID:%0A%0AWhy do you want InnoveX Hub membership? (Minimum 100 words):%0A';

const Index = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [memberModal, setMemberModal] = useState(false);

  const projects = useQuery(api.projects.list);
  const achievements = useQuery(api.achievements.list);
  const participations = useQuery(api.participations.list);
  const goals = useQuery(api.goals.list);

  const handleViewMore = (projectId: string) => {
    if (role === 'guest') {
      setMemberModal(true);
    } else {
      navigate(`/projects/${projectId}`);
    }
  };

  const handleViewAchievement = (achievementId: string) => {
    if (role === 'guest') {
      setMemberModal(true);
    } else {
      navigate(`/achievements/${achievementId}`);
    }
  };

  const handleViewParticipation = (participationId: string) => {
    if (role === 'guest') {
      setMemberModal(true);
    } else {
      navigate(`/participations/${participationId}`);
    }
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Hero background image */}
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold gradient-text glow-text mb-2 leading-tight">
            InnoveX
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl font-display text-foreground/80 tracking-wider mb-6">
            Build to Innovate
          </p>

          {/* Animated underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-0.5 w-48 mx-auto mb-8"
            style={{
              background: 'linear-gradient(90deg, transparent, hsl(50, 100%, 83%), hsl(41, 100%, 50%), transparent)',
              transformOrigin: 'center',
            }}
          />

          <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Where engineering students turn bold ideas into real-world innovation.
            Welcome to the lab.
          </p>

          <Button
            variant="hero"
            size="lg"
            className="text-base px-10"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Projects
          </Button>
        </motion.div>
      </section>

      {/* Section divider */}
      <div className="section-divider" />

      {/* About Section */}
      <section id="about" className="py-12 md:py-24 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold gradient-text glow-text mb-4 leading-tight">
              Engineering Tomorrow
              <br />
              at InnoveX Hub
            </h2>
          </motion.div>

          {/* Vertical timeline */}
          <div className="relative">
            <div
              className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5"
              style={{
                background: 'linear-gradient(180deg, hsl(50, 100%, 83%, 0.5), hsl(41, 100%, 50%, 0.3), transparent)',
              }}
            />

            {ABOUT_SECTIONS.map((section, i) => {
              const Icon = section.icon;
              const isEven = i % 2 === 0;

              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`relative flex items-start gap-6 mb-16 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                    } flex-row`}
                >
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary glow-box z-10 mt-1" />

                  <div className={`ml-16 md:ml-0 md:w-5/12 ${isEven ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}>
                    <div className="glass rounded-xl p-6 glow-box">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon size={20} className="text-primary" />
                        </div>
                        <h3 className="font-display text-lg tracking-wider text-primary">{section.title}</h3>
                      </div>
                      <p className="text-foreground/70 leading-relaxed text-sm">{section.text}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Projects Section */}
      <section id="projects" className="py-12 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold gradient-text glow-text mb-4">
              Featured Projects
            </h2>
            <div className="relative inline-block max-w-2xl mx-auto mt-8 px-10 py-5 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl">
              <p className="text-lg md:text-xl text-foreground/80 font-light tracking-wide italic flex items-start justify-center gap-1">
                <span className="text-primary/60 font-serif text-2xl leading-none">"</span>
                Projects in progress. Revolution pending.
                <span className="text-primary/60 font-serif text-2xl leading-none">"</span>
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {projects === undefined ? (
              <div className="col-span-full text-center text-muted-foreground">Loading projects...</div>
            ) : projects.length === 0 ? (
              null
            ) : (
              projects.map((project, i) => (
                <ProjectCard
                  key={project._id}
                  project={{ ...project, id: project._id }}
                  onViewMore={() => handleViewMore(project._id)}
                  index={i}
                />
              ))
            )}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Achievements Section */}
      <section id="achievements" className="py-12 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold gradient-text glow-text mb-4">
              Featured Achievements
            </h2>
            <div className="relative inline-block max-w-2xl mx-auto mt-8 px-10 py-5 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl">
              <p className="text-lg md:text-xl text-foreground/80 font-light tracking-wide italic flex items-start justify-center gap-1">
                <span className="text-primary/60 font-serif text-2xl leading-none">"</span>
                The trophies can wait. We're building history.
                <span className="text-primary/60 font-serif text-2xl leading-none">"</span>
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {achievements === undefined ? (
              <div className="col-span-full text-center text-muted-foreground">Loading achievements...</div>
            ) : achievements.length === 0 ? (
              null
            ) : (
              achievements.slice(0, 4).map((achievement: any, i: number) => (
                <AchievementCard
                  key={achievement._id}
                  achievement={achievement}
                  onViewMore={() => handleViewAchievement(achievement._id)}
                  index={i}
                />
              ))
            )}
          </div>
          
          {achievements && achievements.length > 0 && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                className="border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                onClick={() => navigate('/achievements')}
              >
                View All Achievements
              </Button>
            </div>
          )}
        </div>
      </section>

      <div className="section-divider" />

      {/* Participations Section */}
      <section id="participations" className="py-12 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold gradient-text glow-text mb-4 uppercase">
              Our Participation
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Events and workshops our team has attended
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {participations === undefined ? (
              <div className="col-span-full text-center text-muted-foreground">Loading participations...</div>
            ) : participations.length === 0 ? (
              null
            ) : (
              participations.slice(0, 4).map((participation: any, i: number) => (
                <ParticipationCard
                  key={participation._id}
                  participation={participation}
                  onViewMore={() => handleViewParticipation(participation._id)}
                  index={i}
                />
              ))
            )}
          </div>
          
          {participations && participations.length > 0 && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                className="border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                onClick={() => navigate('/participations')}
              >
                View All Participations
              </Button>
            </div>
          )}
        </div>
      </section>

      <div className="section-divider" />

      {/* Future Goals Section */}
      <section id="goals" className="py-12 md:py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text glow-text mb-4">
              Future Goals
            </h2>
            <div className="relative inline-block max-w-2xl mx-auto mt-8 px-10 py-5 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl">
              <p className="text-lg md:text-xl text-foreground/80 font-light tracking-wide italic flex items-start justify-center gap-1">
                <span className="text-primary/60 font-serif text-2xl leading-none">"</span>
                Vision without execution is just hallucination.
                <span className="text-primary/60 font-serif text-2xl leading-none">"</span>
              </p>
            </div>
          </motion.div>

          <div className="space-y-16">
            {goals === undefined ? (
              <div className="text-center text-muted-foreground">Loading goals...</div>
            ) : goals.length === 0 ? (
              null
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
      </section>

      <div className="section-divider" />

      {/* Become Member Section */}
      <section id="become-member" className="py-12 md:py-24 px-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-strong rounded-2xl p-12 glow-box text-center max-w-lg mx-auto"
        >
          <h2 className="text-3xl font-display font-bold gradient-text glow-text mb-6">
            Join InnoveX Engineering Collective
          </h2>
          <p className="text-foreground/70 leading-relaxed mb-8">
            Become part of our innovation lab. Collaborate with fellow engineers,
            access exclusive projects, and build the technology of tomorrow.
          </p>
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}>
            <Button
              variant="hero"
              size="lg"
              className="px-10"
              onClick={() => { window.location.href = APPLY_MAILTO; }}
            >
              Apply Now
            </Button>
          </motion.div>
          <p className="text-xs text-muted-foreground mt-6">Applications reviewed within 48 hours</p>
        </motion.div>
      </section>

      <BecomeMemberModal open={memberModal} onClose={() => setMemberModal(false)} />
    </div>
  );
};

export default Index;

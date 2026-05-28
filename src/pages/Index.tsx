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
import { Rocket, Eye, Cpu, Heart, ArrowRight, Zap, Database, Code } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';
import ParticipationCard from '@/components/ParticipationCard';
import BackgroundEngine from '@/components/BackgroundEngine';

const ABOUT_SECTIONS = [
  {
    icon: Rocket,
    title: 'Ideas → Prototypes → Startups',
    text: 'We don’t just write code for grades. We build products, iterate rapidly, and scale solutions that have real-world impact.',
  },
  {
    icon: Cpu,
    title: 'Deep Tech & Hardware',
    text: 'From neural networks to custom PCBs. We tackle complex innovation challenges that push the boundaries of what student builders can achieve.',
  },
  {
    icon: Eye,
    title: 'Visionary Execution',
    text: 'Ideas are cheap. Execution is everything. We prioritize rapid prototyping, constant iteration, and shipping functional systems.',
  },
  {
    icon: Heart,
    title: 'Builder Ecosystem',
    text: 'Surround yourself with obsessive builders, designers, and founders. This is where the next generation of tech leaders collaborate.',
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
  const rawParticipations = useQuery(api.participations.list);
  
  const parseEventDate = (dateStr: string) => {
    if (!dateStr) return 0;
    let parsed = new Date(dateStr).getTime();
    if (!isNaN(parsed)) return parsed;
    
    const match = dateStr.match(/([a-zA-Z]+).*(20\d{2})/);
    if (match) {
      parsed = new Date(`${match[1]} 1, ${match[2]}`).getTime();
      if (!isNaN(parsed)) return parsed;
    }
    
    const yearMatch = dateStr.match(/(20\d{2})/);
    if (yearMatch) {
      return new Date(`Jan 1, ${yearMatch[1]}`).getTime();
    }
    return 0;
  };

  const participations = rawParticipations 
    ? [...rawParticipations].sort((a, b) => parseEventDate(b.date) - parseEventDate(a.date))
    : undefined;
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

  const targetKeywords = ['presidency', 'rv', 'gm university', 'gm', 'institute of technology'];
  let featuredParticipations: any[] = [];
  if (participations) {
    const matched = participations.filter(p => {
       const text = (p.title + ' ' + p.event_name).toLowerCase();
       return targetKeywords.some(kw => text.includes(kw));
    });
    // Fallback to latest 3 if we don't have enough matches
    featuredParticipations = matched.length >= 3 ? matched.slice(0, 3) : participations.slice(0, 3);
  }

  return (
    <div className="relative min-h-screen bg-transparent">
      <BackgroundEngine />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-start text-left max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-display font-bold tracking-widest uppercase mb-8 shadow-[0_0_15px_rgba(255,200,87,0.15)]">
              <Zap size={14} className="animate-pulse" />
              <span>Innovation Lab</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-[5rem] font-display font-bold text-white mb-6 leading-[1.1] tracking-tight uppercase">
              BUILDING <br />
              <span className="text-white/50">STUDENTS</span> <br />
              INTO <span className="text-primary drop-shadow-[0_0_30px_rgba(255,200,87,0.4)]">INNOVATORS</span>
            </h1>

            <p className="text-lg md:text-xl text-foreground/70 mb-10 max-w-xl leading-relaxed font-light">
              Where future founders are built. We don't just write code—we turn bold ideas into real-world startups, prototypes, and deep tech solutions.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setMemberModal(true)}
                className="group relative px-8 py-4 bg-primary text-[#050B14] font-display font-bold text-sm tracking-widest uppercase rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,200,87,0.4)] flex items-center gap-2"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10">Join The Team</span>
                <ArrowRight size={16} className="relative z-10 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="group px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/30 font-display font-bold text-sm tracking-widest uppercase rounded-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <span>Explore Builds</span>
              </button>
            </div>
            
            {/* Minimal Stats */}
            <div className="flex items-center gap-8 mt-16 pt-8 border-t border-white/10 w-full max-w-md">
              <div>
                <div className="text-3xl font-display font-bold text-white mb-1">50+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest">Active Builders</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="text-3xl font-display font-bold text-white mb-1">24</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest">Live Projects</div>
              </div>
            </div>
          </motion.div>

          {/* Right Floating Cards */}
          <div className="hidden lg:block relative h-[600px] w-full perspective-1000">
            {/* Card 1 */}
            {featuredParticipations[0] && (
              <motion.div
                animate={{ y: [0, -20, 0], rotateX: [10, 15, 10], rotateY: [-10, -5, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-20 w-72 h-48 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 cursor-pointer"
                onClick={() => handleViewParticipation(featuredParticipations[0]._id)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                <ImageWithFallback src={featuredParticipations[0].image_url} alt={featuredParticipations[0].title} className="w-full h-full object-cover mix-blend-overlay opacity-80" loading="lazy" />
                <div className="absolute bottom-4 left-4 z-20 pr-4">
                  <div className="text-[10px] font-display tracking-widest text-primary mb-1 uppercase line-clamp-1 drop-shadow-md">{featuredParticipations[0].event_name}</div>
                  <div className="text-sm font-display font-bold text-white line-clamp-2 leading-tight drop-shadow-md">{featuredParticipations[0].title}</div>
                </div>
              </motion.div>
            )}

            {/* Card 2 */}
            {featuredParticipations[1] && (
              <motion.div
                animate={{ y: [0, 30, 0], rotateX: [-10, -5, -10], rotateY: [15, 20, 15] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-52 right-64 w-80 h-52 rounded-2xl bg-white/5 backdrop-blur-md border border-primary/20 overflow-hidden shadow-[0_20px_50px_rgba(255,200,87,0.15)] z-30 cursor-pointer"
                onClick={() => handleViewParticipation(featuredParticipations[1]._id)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                <ImageWithFallback src={featuredParticipations[1].image_url} alt={featuredParticipations[1].title} className="w-full h-full object-cover mix-blend-overlay opacity-80" loading="lazy" />
                <div className="absolute bottom-4 left-4 z-20 pr-4">
                  <div className="text-[10px] font-display tracking-widest text-primary mb-1 uppercase line-clamp-1 drop-shadow-md">{featuredParticipations[1].event_name}</div>
                  <div className="text-sm font-display font-bold text-white line-clamp-2 leading-tight drop-shadow-md">{featuredParticipations[1].title}</div>
                </div>
              </motion.div>
            )}

            {/* Card 3 */}
            {featuredParticipations[2] && (
              <motion.div
                animate={{ y: [0, -15, 0], rotateZ: [-2, 2, -2] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-10 right-10 w-64 h-48 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl z-10 cursor-pointer"
                onClick={() => handleViewParticipation(featuredParticipations[2]._id)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                <ImageWithFallback src={featuredParticipations[2].image_url} alt={featuredParticipations[2].title} className="w-full h-full object-cover mix-blend-overlay opacity-80" loading="lazy" />
                <div className="absolute bottom-4 left-4 z-20 pr-4">
                  <div className="text-[10px] font-display tracking-widest text-primary mb-1 uppercase line-clamp-1 drop-shadow-md">{featuredParticipations[2].event_name}</div>
                  <div className="text-sm font-display font-bold text-white line-clamp-2 leading-tight drop-shadow-md">{featuredParticipations[2].title}</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 tracking-tight uppercase leading-tight">
              BUILDING <span className="text-primary drop-shadow-[0_0_20px_rgba(255,200,87,0.5)]">TOMORROW</span>
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

                  <div className={`ml-16 md:ml-0 md:w-5/12 ${isEven ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'} z-20`}>
                    <div className="bg-[#050B14]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/5 shadow-2xl hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(255,200,87,0.15)] transition-all duration-500 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                      <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(255,200,87,0.1)]">
                          <Icon size={24} className="text-primary" />
                        </div>
                        <h3 className="font-display font-bold text-lg tracking-wider text-white group-hover:text-primary transition-colors">{section.title}</h3>
                      </div>
                      <p className="text-foreground/60 leading-relaxed text-sm font-light relative z-10">{section.text}</p>
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 tracking-tight uppercase">
              FEATURED <span className="text-primary drop-shadow-[0_0_20px_rgba(255,200,87,0.5)]">PROJECTS</span>
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 tracking-tight uppercase">
              FEATURED <span className="text-primary drop-shadow-[0_0_20px_rgba(255,200,87,0.5)]">ACHIEVEMENTS</span>
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

      {/* Participations Section - Redesigned as The Building Years */}
      <section id="participations" className="relative py-20 md:py-32 px-4 bg-[#02050A] overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFAA00]/5 to-[#02050A]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 tracking-tight">
              THE <span className="text-primary drop-shadow-[0_0_20px_rgba(255,200,87,0.5)]">BUILDING</span> YEARS
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg font-light tracking-wide uppercase text-sm border-b border-primary/20 pb-6 inline-block">
              Every competition shaped the company we’re becoming.
            </p>
          </motion.div>

          {/* Stats Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 mb-24 max-w-5xl mx-auto"
          >
            {[
              { label: 'Competitions', value: '5+' },
              { label: 'Finales', value: '3' },
              { label: 'Startup Pitches', value: '2' },
              { label: 'Robotics Top', value: '1' },
              { label: 'Hours Built', value: '100+' }
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:border-primary/30 transition-all hover:bg-primary/[0.02] hover:-translate-y-1">
                <div className="font-display font-bold text-2xl md:text-3xl text-primary drop-shadow-[0_0_10px_rgba(255,200,87,0.4)] mb-1">{stat.value}</div>
                <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          <div className="relative">
            {participations === undefined ? (
              <div className="text-center text-muted-foreground">Loading timeline...</div>
            ) : participations.length === 0 ? (
              null
            ) : (
              <>
                {/* Vertical glowing line */}
                <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-10 bottom-10 w-0.5 bg-gradient-to-b from-transparent via-primary/30 to-transparent shadow-[0_0_15px_rgba(255,200,87,0.3)] hidden md:block" />
                
                {participations.map((participation: any, i: number) => {
                  const isEven = i % 2 === 0;
                  return (
                    <div key={participation._id} className={`relative flex items-center mb-24 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col gap-8 md:gap-16`}>
                      
                      {/* Timeline Dot */}
                      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#050B14] border-2 border-primary shadow-[0_0_15px_rgba(255,200,87,0.8)] z-20 hidden md:block" />
                      
                      {/* Empty side for year watermark */}
                      <div className={`hidden md:flex w-1/2 ${isEven ? 'justify-end pr-16 text-right' : 'justify-start pl-16 text-left'} items-center`}>
                        <span className="font-display font-bold text-6xl lg:text-[10rem] text-white/[0.03] select-none tracking-tighter leading-none">
                          {participation.date.match(/(20\d{2})/) ? participation.date.match(/(20\d{2})/)![1] : 'BLD'}
                        </span>
                      </div>

                      {/* Card side */}
                      <div className="w-full md:w-1/2 relative z-10 px-4 md:px-0">
                        <ParticipationCard
                          participation={participation}
                          onViewMore={() => handleViewParticipation(participation._id)}
                          index={i}
                        />
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-24"
          >
            <p className="font-display text-xl md:text-3xl text-white/50 italic font-light tracking-wider">
              "Still building. <span className="text-primary/70">Still early.</span>"
            </p>
          </motion.div>
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 tracking-tight uppercase">
              FUTURE <span className="text-primary drop-shadow-[0_0_20px_rgba(255,200,87,0.5)]">GOALS</span>
            </h2>
            <div className="relative inline-block max-w-2xl mx-auto mt-8 px-10 py-5 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl">
              <p className="text-lg md:text-xl text-foreground/80 font-light tracking-wide italic flex items-start justify-center gap-1">
                <span className="text-primary/60 font-serif text-2xl leading-none">"</span>
                Vision without execution is just hallucination.
                <span className="text-primary/60 font-serif text-2xl leading-none">"</span>
              </p>
            </div>
          </motion.div>

          <div className="relative pt-10">
            <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary/40 to-transparent shadow-[0_0_20px_rgba(255,200,87,0.3)] hidden md:block" />

            {goals === undefined ? (
              <div className="text-center text-muted-foreground">Loading roadmap...</div>
            ) : goals.length === 0 ? (
              null
            ) : (
              goals.map((goal, i) => {
                const isEven = i % 2 === 0;
                return (
                  <motion.div
                    key={goal._id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className={`relative flex items-center mb-24 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col gap-8 md:gap-16`}
                  >
                    {/* Glowing Node */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#050B14] border-2 border-primary shadow-[0_0_20px_rgba(255,200,87,1)] z-20 hidden md:flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    </div>

                    {/* Phase indicator (Empty Side) */}
                    <div className={`hidden md:flex w-1/2 ${isEven ? 'justify-end pr-16 text-right' : 'justify-start pl-16 text-left'} items-center`}>
                      <span className="font-display font-bold text-6xl text-white/5 select-none tracking-widest uppercase">
                        PHASE 0{i + 1}
                      </span>
                    </div>

                    {/* Content Card */}
                    <div className="w-full md:w-1/2 relative z-10">
                      <div className="bg-[#050B14]/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/5 shadow-2xl hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_0_40px_rgba(255,200,87,0.15)] transition-all duration-500 overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/15 transition-colors" />
                        
                        <div className="flex items-center gap-3 mb-6">
                          <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded text-primary text-[10px] font-display tracking-widest uppercase">
                            Milestone {i + 1}
                          </div>
                          <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
                        </div>

                        {goal.image_url && (
                          <div className="mb-6 overflow-hidden rounded-xl border border-white/5">
                            <ImageWithFallback
                              src={goal.image_url}
                              alt={goal.text}
                              loading="lazy"
                              className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                            />
                          </div>
                        )}
                        
                        <p className="text-foreground/80 leading-relaxed font-light">{goal.text}</p>
                      </div>
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
      <section id="become-member" className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-[100px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-[#050B14]/90 backdrop-blur-2xl rounded-3xl p-12 md:p-20 border border-primary/20 text-center max-w-4xl mx-auto shadow-[0_0_50px_rgba(255,200,87,0.1)] overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 uppercase tracking-tight">
            JOIN THE <span className="text-primary drop-shadow-[0_0_20px_rgba(255,200,87,0.5)]">COLLECTIVE</span>
          </h2>
          <p className="text-lg text-foreground/60 leading-relaxed mb-10 max-w-2xl mx-auto font-light">
            Become part of our innovation lab. Collaborate with fellow students across India,
            access exclusive projects, and build the technology of tomorrow.
          </p>
          
          <button
            onClick={() => { window.location.href = APPLY_MAILTO; }}
            className="group relative px-10 py-5 bg-primary text-[#050B14] font-display font-bold text-sm tracking-widest uppercase rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,200,87,0.4)] inline-flex items-center gap-3"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10">Apply For Membership</span>
            <Rocket size={16} className="relative z-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
          
          <p className="text-xs text-primary/50 mt-6 tracking-widest uppercase font-display">Applications reviewed within 48 hours</p>
        </motion.div>
      </section>

      <BecomeMemberModal open={memberModal} onClose={() => setMemberModal(false)} />
    </div>
  );
};

export default Index;

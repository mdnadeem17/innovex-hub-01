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
import { Rocket, Eye, Cpu, Heart, ArrowRight, Zap, Database, Code, Trophy, Users, Lightbulb } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';
import ParticipationCard from '@/components/ParticipationCard';
import BackgroundEngine from '@/components/BackgroundEngine';
import AnimatedStatCard from '@/components/AnimatedStatCard';

const ABOUT_SECTIONS = [
  {
    icon: Lightbulb,
    title: 'Ideas → Prototypes → Startups',
    text: 'We don’t just write code for grades. We build products, iterate rapidly, and scale solutions that have real-world impact.',
  },
  {
    icon: Cpu,
    title: 'Deep Tech & Hardware',
    text: 'From neural networks to custom PCBs. We tackle complex innovation challenges that push the boundaries of what student builders can achieve.',
  },
  {
    icon: Rocket,
    title: 'Visionary Execution',
    text: 'Ideas are cheap. Execution is everything. We prioritize rapid prototyping, constant iteration, and shipping functional systems.',
  },
  {
    icon: Users,
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
            <div className="relative inline-flex items-center justify-center mb-8 group">
              <div className="absolute inset-0 bg-primary/10 blur-[15px] rounded-full transition-all duration-500" />
              <div className="relative inline-flex items-center justify-center px-5 py-1 rounded-full bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(255,200,87,0.15)] backdrop-blur-sm">
                <span className="font-display font-semibold text-xs tracking-[2px] uppercase bg-gradient-to-r from-primary to-[#FFEAA7] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,200,87,0.4)]">
                  INNOVEX HUB
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[5rem] leading-[1.1] font-display font-bold text-white mb-6 tracking-tight uppercase">
              BUILDING <br />
              <span className="text-white/50">STUDENTS</span> <br />
              INTO <span className="text-primary drop-shadow-[0_0_30px_rgba(255,200,87,0.4)]">INNOVATORS</span>
            </h1>

            <p className="text-[18px] md:text-[22px] text-white/90 mb-10 w-[90%] max-w-xl leading-[1.8] font-cursive text-left tracking-[0.5px]">
              Where <span className="text-[#FFEAA7] font-medium drop-shadow-[0_0_12px_rgba(255,200,87,0.6)]">future founders</span> are built. We don't just write code—we turn <span className="text-[#FFEAA7] font-medium drop-shadow-[0_0_12px_rgba(255,200,87,0.6)]">bold ideas</span> into real-world <span className="text-[#FFEAA7] font-medium drop-shadow-[0_0_12px_rgba(255,200,87,0.6)]">startups</span>, prototypes, and <span className="text-[#FFEAA7] font-medium drop-shadow-[0_0_12px_rgba(255,200,87,0.6)]">deep tech</span> solutions.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setMemberModal(true)}
                className="group relative px-8 py-4 bg-primary text-[#050B14] font-display font-bold text-sm tracking-widest uppercase rounded-lg overflow-hidden transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_40px_rgba(255,200,87,0.6)] flex items-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative z-10">Join The Team</span>
                <ArrowRight size={16} className="relative z-10 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="group px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/30 font-display font-bold text-sm tracking-widest uppercase rounded-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                <span>Explore Builds</span>
              </button>
            </div>
            
            {/* Minimal Stats */}
            <div className="flex items-center gap-8 mt-16 pt-8 border-t border-white/10 w-full max-w-md">
              <div>
                <div className="text-3xl font-display font-bold text-white mb-1">26+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest">Active Builders</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="text-3xl font-display font-bold text-white mb-1">3+</div>
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
      <section id="about" className="py-12 md:py-20 px-4">
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
                        <div className="timeline-icon shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(255,200,87,0.1)] overflow-visible">
                          <Icon size={24} className="text-[#F5E6A3]" style={{ width: '24px', height: '24px', minWidth: '24px', minHeight: '24px', opacity: 1 }} />
                        </div>
                        <h3 className="font-display font-bold text-lg tracking-wider text-white group-hover:text-primary transition-colors">{section.title}</h3>
                      </div>
                      <p className="text-foreground/90 leading-relaxed text-sm font-light relative z-10">{section.text}</p>
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
      <section id="projects" className="py-12 md:py-20 px-4">
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
      <section id="achievements" className="py-12 md:py-20 px-4">
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
      <section id="participations" className="relative py-12 md:py-20 px-4 bg-[#02050A] overflow-hidden">
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
            className="text-center flex flex-col items-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight uppercase" style={{ marginBottom: '40px' }}>
              THE <span className="text-primary drop-shadow-[0_0_20px_rgba(255,200,87,0.5)]">BUILDING</span> YEARS
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg font-light tracking-wide uppercase text-sm" style={{ marginBottom: '32px' }}>
              Every competition shaped the company we’re becoming.
            </p>
            <div className="w-32 md:w-64 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" style={{ marginBottom: '40px' }} />
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 max-w-2xl mx-auto w-full"
            style={{ gap: '20px', marginBottom: '60px' }}
          >
            {[
              { label: 'Competitions', value: '5+' },
              { label: 'Finales', value: '3' },
              { label: 'Startup Pitches', value: '3' },
              { label: 'Robotics Top', value: '1' },
              { label: 'Hours Built', value: '100+', span: true }
            ].map((stat, i) => (
              <div key={i} className={`text-center py-6 px-4 rounded-xl bg-[#050B14]/40 border border-white/5 backdrop-blur-md hover:border-primary/40 transition-all hover:bg-[#050B14]/60 hover:-translate-y-1 shadow-lg cursor-default group ${stat.span ? 'col-span-2' : ''}`}>
                <div className="font-display font-bold text-3xl md:text-4xl text-white group-hover:text-primary transition-colors drop-shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:drop-shadow-[0_0_20px_rgba(255,200,87,0.5)] mb-2">{stat.value}</div>
                <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Transition Zone Timeline Start */}
          <div className="flex flex-col items-center w-full relative z-20" style={{ marginBottom: '40px' }}>
            <div className="w-6 h-6 rounded-full bg-[#050B14] border-2 border-primary shadow-[0_0_20px_rgba(255,200,87,0.8)] flex items-center justify-center relative">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            </div>
          </div>

          <div className="relative">
            {participations === undefined ? (
              <div className="text-center text-muted-foreground">Loading timeline...</div>
            ) : participations.length === 0 ? (
              null
            ) : (
              <>
                {/* Vertical glowing line */}
                <div className="absolute left-1/2 -translate-x-px top-[-80px] bottom-10 w-0.5 bg-gradient-to-b from-primary/30 via-primary/20 to-transparent shadow-[0_0_15px_rgba(255,200,87,0.2)] block" />
                
                {participations.map((participation: any, i: number) => {
                  const isEven = i % 2 === 0;
                  return (
                    <div key={participation._id} className={`relative flex items-center mb-28 md:mb-24 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col gap-8 md:gap-16`}>
                      
                      {/* Timeline Dot */}
                      <div className="absolute left-1/2 -translate-x-1/2 -top-14 md:top-auto w-4 h-4 rounded-full bg-[#050B14] border-2 border-primary shadow-[0_0_15px_rgba(255,200,87,0.8)] z-20 block" />
                      
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

      {/* Future Goals Section (Roadmap) */}
      <section id="goals" className="relative py-16 md:py-24 px-4 bg-[#050B14] overflow-hidden">
        {/* Glow lines background */}
        <div className="absolute inset-0 z-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 tracking-tight uppercase">
              THE <span className="text-primary drop-shadow-[0_0_20px_rgba(255,200,87,0.5)]">ROADMAP</span>
            </h2>
            <div className="relative inline-block max-w-2xl mx-auto mt-4 px-8 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
              <p className="text-sm md:text-base text-primary/80 font-display tracking-widest uppercase flex items-center justify-center gap-2">
                <Zap size={16} />
                Vision without execution is just hallucination
              </p>
            </div>
          </motion.div>

          <div className="relative">
            {/* Connecting Glow Line */}
            <div className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/40 to-transparent shadow-[0_0_20px_rgba(255,200,87,0.5)]" />

            {[
              { year: '2026', title: 'Launch Startup', desc: 'Transition from student projects to a registered entity. Secure initial funding and early adopters.' },
              { year: '2027', title: 'Build Innovation Lab', desc: 'Establish a physical hardware & deep-tech lab equipped with 3D printers, PCB milling, and AI workstations.' },
              { year: '2028', title: 'National Expansion', desc: 'Scale the builder ecosystem to top universities across India. Host the largest student-run deep-tech summit.' },
              { year: '2029', title: 'Research & Development Center', desc: 'Partner with industry giants to run dedicated R&D solving real-world corporate challenges.' },
              { year: '2030', title: 'Deep-Tech Products', desc: 'Launch proprietary hardware and AI products globally. Shift from a hub to a deep-tech conglomerate.' }
            ].map((milestone, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: isEven ? -50 : 50, y: 30 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`relative flex items-center mb-16 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col gap-6 md:gap-12 group`}
                >
                  {/* Glowing Node */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#050B14] border-2 border-primary shadow-[0_0_20px_rgba(255,200,87,1)] z-20 flex items-center justify-center mt-2 md:mt-0 transition-transform duration-500 group-hover:scale-125">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>

                  {/* Year Indicator */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'} pl-20 md:pl-0 pt-1 md:pt-0`}>
                    <span className="font-display font-bold text-5xl md:text-6xl text-white/10 group-hover:text-primary/20 transition-colors duration-500 tracking-tighter">
                      {milestone.year}
                    </span>
                  </div>

                  {/* Roadmap Card */}
                  <div className="w-full md:w-1/2 relative z-10 pl-20 md:pl-0 pr-4 md:pr-0">
                    <div className="glass-premium rounded-2xl p-6 border border-white/10 group-hover:border-primary/40 transition-all duration-500 group-hover:-translate-y-2 shadow-lg group-hover:shadow-[0_0_30px_rgba(255,200,87,0.2)] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] group-hover:bg-primary/20 transition-colors duration-500" />
                      <div className="relative z-10">
                        <h3 className="font-display text-xl font-bold text-white group-hover:text-primary transition-colors mb-2 tracking-wide">{milestone.title}</h3>
                        <p className="text-foreground/70 font-light text-sm leading-relaxed">{milestone.desc}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Social Proof Section */}
      <section className="py-[50px] bg-[#02050A] border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 max-w-3xl">
          <div className="text-center" style={{ marginBottom: '30px' }}>
            <h3 className="text-sm md:text-base font-display font-bold text-muted-foreground tracking-[0.1em] uppercase">
              Trusted By Builders, <br className="md:hidden"/> Innovators & Competitions
            </h3>
          </div>
          
          <div className="flex flex-wrap justify-center items-center" style={{ gap: '16px' }}>
            {[
              'Presidency University', 
              'GM University', 
              'SIT Tumakuru', 
              'TechNisium', 
              'Invicia'
            ].map((partner, i) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="px-4 py-3 md:px-6 md:py-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm grayscale hover:grayscale-0 hover:border-primary/40 hover:bg-[#050B14]/40 transition-all duration-300 cursor-default group shadow-sm hover:shadow-[0_0_20px_rgba(255,200,87,0.1)]"
              >
                <span className="font-display font-bold text-xs md:text-sm text-white/50 group-hover:text-primary transition-colors duration-300 group-hover:drop-shadow-[0_0_10px_rgba(255,200,87,0.5)] whitespace-nowrap">
                  {partner}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Become Member Section */}
      <section id="become-member" className="relative py-10 md:py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-[100px] pointer-events-none" />
        
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           {[...Array(12)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-2 h-2 bg-primary/30 rounded-full blur-[2px]"
               style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
               animate={{ y: [0, -40, 0], x: [0, Math.random() * 40 - 20, 0], opacity: [0.1, 0.6, 0.1] }}
               transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut' }}
             />
           ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative glass-premium rounded-3xl p-6 md:p-12 text-center max-w-4xl mx-auto shadow-[0_0_50px_rgba(255,200,87,0.15)] overflow-hidden group"
        >
          {/* Rotating Glowing Border */}
          <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,200,87,0.6)_360deg)] animate-border-spin opacity-50" />
          <div className="absolute inset-[2px] bg-[#050B14]/90 backdrop-blur-3xl rounded-[calc(1.5rem-2px)] z-0" />
          
          <div className="relative z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-[pulse_3s_ease-in-out_infinite]" />
          
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-3 md:mb-6 uppercase tracking-tight">
            JOIN THE <span className="text-primary drop-shadow-[0_0_20px_rgba(255,200,87,0.5)]">COLLECTIVE</span>
          </h2>
          <p className="text-sm md:text-lg text-foreground/80 leading-relaxed mb-6 md:mb-8 max-w-xl mx-auto font-light">
            Join India's next generation of builders. Collaborate, innovate, and launch real-world projects.
          </p>

          <div className="flex justify-center items-center gap-2 md:gap-8 mb-8 text-white font-display uppercase tracking-widest text-[9px] md:text-sm bg-white/5 border border-white/10 rounded-2xl py-4 md:py-6 backdrop-blur-sm">
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                <Zap size={14} className="text-primary hidden md:block" />
                <span className="text-xl md:text-3xl text-primary font-bold drop-shadow-[0_0_10px_rgba(255,200,87,0.5)]">26+</span>
              </div>
              <span className="text-foreground/50">Builders</span>
            </div>
            
            <div className="h-8 md:h-12 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
            
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                <Rocket size={14} className="text-primary hidden md:block" />
                <span className="text-xl md:text-3xl text-primary font-bold drop-shadow-[0_0_10px_rgba(255,200,87,0.5)]">3+</span>
              </div>
              <span className="text-foreground/50">Projects</span>
            </div>

            <div className="h-8 md:h-12 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                <Trophy size={14} className="text-primary hidden md:block" />
                <span className="text-xl md:text-3xl text-primary font-bold drop-shadow-[0_0_10px_rgba(255,200,87,0.5)]">0</span>
              </div>
              <span className="text-foreground/50">Wins</span>
            </div>
          </div>
          
          <button
            onClick={() => { window.location.href = APPLY_MAILTO; }}
            className="group relative px-8 py-4 bg-primary text-[#050B14] font-display font-bold text-xs md:text-sm tracking-widest uppercase rounded-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,200,87,0.4)] hover:shadow-[0_0_50px_rgba(255,200,87,0.8)] inline-flex items-center gap-3 w-full md:w-auto justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <span className="relative z-10">Apply For Membership</span>
            <Rocket size={14} className="relative z-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
          
          <p className="text-[10px] md:text-xs text-primary/60 mt-4 tracking-widest uppercase font-display drop-shadow-md">Applications reviewed within 48 hours</p>
          </div>
        </motion.div>
      </section>

      <BecomeMemberModal open={memberModal} onClose={() => setMemberModal(false)} />
    </div>
  );
};

export default Index;

import { Linkedin, Mail, Zap, Github, Instagram } from 'lucide-react';

const LINKEDIN_URL = 'https://www.linkedin.com/in/manjunatha-doddmani-a85013384/';
const NADEEM_LINKEDIN = 'https://www.linkedin.com/in/mohammed-nadeem-562600386';

const Footer = () => {
  return (
    <footer className="relative bg-[#02050A] pt-16 pb-8 px-4 overflow-hidden border-t border-transparent">
      {/* Top Glowing Divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_15px_rgba(255,200,87,0.5)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-primary blur-[6px] opacity-90 animate-[pulse_3s_ease-in-out_infinite]" />

      <div className="container mx-auto max-w-6xl flex flex-col items-center justify-center gap-12 relative z-10">
        
        {/* Brand */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <Zap size={24} className="text-primary" />
            <span className="font-display font-bold text-2xl tracking-widest uppercase text-white">INNOV<span className="text-primary drop-shadow-[0_0_10px_rgba(255,200,87,0.5)]">EX</span></span>
          </div>
          <p className="text-xs font-light tracking-widest text-white/60 uppercase">Engineering Tomorrow.</p>
          <div className="flex items-center gap-4 mt-2">
             <a href="https://github.com/innovexhub07-lab" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-primary transition-colors hover:drop-shadow-[0_0_10px_rgba(255,200,87,0.5)]"><Github size={18} /></a>
             <a href="#" className="text-white/40 hover:text-primary transition-colors hover:drop-shadow-[0_0_10px_rgba(255,200,87,0.5)]"><Linkedin size={18} /></a>
             <a href="#" className="text-white/40 hover:text-primary transition-colors hover:drop-shadow-[0_0_10px_rgba(255,200,87,0.5)]"><Instagram size={18} /></a>
          </div>
        </div>

        {/* Links & Builders */}
        <div className="flex flex-col items-center gap-5 w-full">
          
          {/* Builders Section */}
          <div className="flex flex-col items-center gap-3 w-full px-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-display font-bold text-[10px] md:text-xs tracking-[0.3em] text-primary uppercase drop-shadow-[0_0_8px_rgba(255,200,87,0.6)]">
                BUILDERS
              </span>
            </div>

            <div 
              className="flex flex-row items-center justify-center w-fit max-w-[95%] mx-auto"
              style={{
                flexWrap: 'nowrap',
                whiteSpace: 'nowrap',
                gap: '12px'
              }}
            >
              
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="flex flex-row items-center gap-[4px] md:gap-2 text-white/70 hover:text-white transition-colors group/link shrink-0 min-w-0">
                <Linkedin size={14} className="text-primary group-hover/link:drop-shadow-[0_0_10px_rgba(255,200,87,0.8)] transition-all shrink-0" />
                <span 
                  className="font-display font-bold uppercase bg-gradient-to-r from-primary to-[#FFEAA7] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,200,87,0.4)] group-hover/link:drop-shadow-[0_0_15px_rgba(255,200,87,0.8)] group-hover/link:brightness-125 transition-all truncate" 
                  style={{ fontSize: 'clamp(11px, 2.8vw, 14px)', letterSpacing: '0.5px' }}
                >
                  Manjunatha H O
                </span>
              </a>
              
              <span className="text-primary/40 font-bold px-1 shrink-0">•</span>
              
              <a href={NADEEM_LINKEDIN} target="_blank" rel="noopener noreferrer" className="flex flex-row items-center gap-[4px] md:gap-2 text-white/70 hover:text-white transition-colors group/link shrink-0 min-w-0">
                <Linkedin size={14} className="text-primary group-hover/link:drop-shadow-[0_0_10px_rgba(255,200,87,0.8)] transition-all shrink-0" />
                <span 
                  className="font-display font-bold uppercase bg-gradient-to-r from-primary to-[#FFEAA7] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,200,87,0.4)] group-hover/link:drop-shadow-[0_0_15px_rgba(255,200,87,0.8)] group-hover/link:brightness-125 transition-all truncate" 
                  style={{ fontSize: 'clamp(11px, 2.8vw, 14px)', letterSpacing: '0.5px' }}
                >
                  MD Nadeem
                </span>
              </a>

            </div>
          </div>
          
          <a href="mailto:innovexhub01@gmail.com" className="px-6 py-3 mt-4 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-white/60 hover:text-white transition-all flex items-center gap-2 text-xs tracking-widest font-display uppercase shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <Mail size={16} />
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

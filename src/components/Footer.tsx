import { Linkedin, Mail, Zap } from 'lucide-react';

const LINKEDIN_URL = 'https://www.linkedin.com/in/manjunatha-doddmani-a85013384/';
const NADEEM_LINKEDIN = 'https://www.linkedin.com/in/mohammed-nadeem-562600386';

const Footer = () => {
  return (
    <footer className="relative bg-[#02050A] pt-16 pb-8 px-4 overflow-hidden border-t border-transparent">
      {/* Top Glowing Divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-primary blur-[4px] opacity-70" />

      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-primary" />
            <span className="font-display font-bold text-xl tracking-widest uppercase text-white">INNOV<span className="text-primary drop-shadow-[0_0_10px_rgba(255,200,87,0.5)]">EX</span></span>
          </div>
          <p className="text-xs font-light tracking-widest text-white/40 uppercase">Building Students Into Innovators</p>
        </div>

        {/* Links */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="flex items-center gap-6">
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-primary transition-colors hover:drop-shadow-[0_0_10px_rgba(255,200,87,0.5)] flex items-center gap-2">
              <Linkedin size={16} />
              <span className="text-[10px] tracking-widest font-display uppercase">Manjunatha H D</span>
            </a>
            <a href={NADEEM_LINKEDIN} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-primary transition-colors hover:drop-shadow-[0_0_10px_rgba(255,200,87,0.5)] flex items-center gap-2">
              <Linkedin size={16} />
              <span className="text-[10px] tracking-widest font-display uppercase">MD Nadeem</span>
            </a>
          </div>
          
          <a href="mailto:innovexhub01@gmail.com" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-white/60 hover:text-white transition-all flex items-center gap-2 text-[10px] tracking-widest font-display uppercase">
            <Mail size={14} />
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Linkedin } from 'lucide-react';

const LINKEDIN_URL = 'https://www.linkedin.com/in/manjunatha-doddmani-a85013384/';

const Footer = () => {
  return (
    <footer className="relative z-10 glass-strong py-6 px-4">
      <div className="container mx-auto flex flex-col items-center justify-center gap-2">
        <p className="text-xs font-display tracking-wider text-muted-foreground">
          Developed by
        </p>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:text-accent transition-colors"
          >
            <Linkedin size={18} />
            <span className="font-display text-sm tracking-wider">Manjunatha H D</span>
          </a>
          <a
            href="https://www.linkedin.com/in/mohammed-nadeem-562600386"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:text-accent transition-colors"
          >
            <Linkedin size={18} />
            <span className="font-display text-sm tracking-wider">MD Nadeem</span>
          </a>
        </div>
        <div className="flex flex-col items-center gap-1 mt-4">
          <p className="text-xs font-display tracking-wider text-muted-foreground">
            Contact Information
          </p>
          <a
            href="mailto:innovexhub01@gmail.com"
            className="flex items-center gap-2 text-primary hover:text-accent transition-colors"
          >
            <span className="font-display text-xs tracking-wider">innovexhub01@gmail.com</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuth, Role } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
  label: string;
  path: string;
  anchor?: string;
  roles: Role[];
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'Home', path: '/', anchor: 'home', roles: ['guest', 'member', 'admin', 'demon'] },
  { label: 'About Us', path: '/', anchor: 'about', roles: ['guest', 'member', 'admin', 'demon'] },
  { label: 'Projects', path: '/', anchor: 'projects', roles: ['guest', 'member', 'admin', 'demon'] },
  { label: 'Achievements', path: '/', anchor: 'achievements', roles: ['guest', 'member', 'admin', 'demon'] },
  { label: 'Participations', path: '/', anchor: 'participations', roles: ['guest', 'member', 'admin', 'demon'] },
  { label: 'Add Project', path: '/add-project', roles: ['member', 'admin', 'demon'] },
  { label: 'Add Achievement', path: '/add-achievement', roles: ['member', 'admin', 'demon'] },
  { label: 'Add Participation', path: '/add-participation', roles: ['member', 'admin', 'demon'] },
  { label: 'Member Panel', path: '/member', roles: ['member', 'demon'] },
  { label: 'Admin Panel', path: '/admin', roles: ['admin', 'demon'] },
  { label: 'Future Goals', path: '/', anchor: 'goals', roles: ['guest', 'member', 'admin', 'demon'] },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

const SlideMenu = ({ open, onClose }: Props) => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const visibleItems = MENU_ITEMS.filter((item) => {
    if (item.label === 'Become Member') return role === 'guest';
    return item.roles.includes(role);
  });

  // Add Become Member for guests
  if (role === 'guest') {
    visibleItems.splice(2, 0, { label: 'Become Member', path: '/', anchor: 'become-member', roles: ['guest'] });
  }

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleMenuClick = (item: MenuItem) => {
    onClose();
    if (item.anchor) {
      if (location.pathname === '/') {
        // Already on home, just scroll
        setTimeout(() => {
          document.getElementById(item.anchor!)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        // Navigate to home first, then scroll after mount
        navigate('/');
        setTimeout(() => {
          document.getElementById(item.anchor!)?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    } else {
      navigate(item.path);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/60"
            onClick={onClose}
          />
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 80, mass: 1.2 }}
            className="fixed left-0 top-0 bottom-0 z-[70] w-72 glass-strong flex flex-col"
            style={{ borderRight: '1px solid hsla(50, 100%, 83%, 0.2)' }}
          >
            <div className="flex items-center justify-end p-4">
              <button onClick={onClose} className="text-primary hover:text-accent transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-1 px-4 pt-4">
              {visibleItems.map((item, i) => (
                <motion.button
                  key={item.path}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => handleMenuClick(item)}
                  className="text-left py-3 px-4 font-display text-sm tracking-widest text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
                >
                  {item.label}
                </motion.button>
              ))}
            </div>

            <div className="p-4 border-t border-border/20">
              <a href="mailto:innovexhub01@gmail.com" className="block text-sm text-primary hover:text-accent font-display tracking-wider mb-2">
                innovexhub01@gmail.com
              </a>
              <div className="text-xs text-muted-foreground font-display tracking-wider">
                InnoveX Hub © 2026
              </div>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};

export default SlideMenu;

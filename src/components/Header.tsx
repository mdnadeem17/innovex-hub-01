import { useState } from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import SlideMenu from './SlideMenu';
import LoginModal from './LoginModal';
import innovexLogo from '@/assets/innovex-logo.png';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="container mx-auto flex items-center justify-between h-14 md:h-[70px] px-4">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 text-primary hover:text-accent transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          <div className="absolute left-1/2 -translate-x-1/2 max-w-[60vw]">
            <img
              src={innovexLogo}
              alt="InnoveX Hub"
              className="h-12 md:h-14 lg:h-16 w-auto animate-logo-pulse transition-all duration-300 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]"
            />
          </div>

          <div>
            {user ? (
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/add-project')} className="hidden md:inline-flex">
                  Add Project
                </Button>
                <Button variant="glow" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button variant="glow" size="sm" onClick={() => setLoginOpen(true)}>
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <SlideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};

export default Header;

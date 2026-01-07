
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Language, Translations } from '../types';
import LanguageSelector from './LanguageSelector';

interface NavbarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  accentColor: string;
  t: Translations;
}

const Navbar: React.FC<NavbarProps> = ({ language, setLanguage, accentColor, t }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: t.home },
    { path: '/play', label: t.play },
    { path: '/learn', label: t.learn },
    { path: '/customize', label: t.customize },
    { path: '/credits', label: t.credits },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-game text-2xl shadow-lg transition-transform group-hover:scale-110 rotate-[-5deg]"
            style={{ backgroundColor: accentColor }}
          >
            T
          </div>
          <span className="font-game text-xl hidden sm:inline text-gray-800 tracking-tight">Ting-Ting</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-4">
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive(link.path)
                    ? 'text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                style={isActive(link.path) ? { backgroundColor: accentColor } : {}}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="h-6 w-[1px] bg-gray-200 mx-2 hidden md:block"></div>
          
          <LanguageSelector current={language} onChange={setLanguage} />
          
          {/* Mobile Nav Trigger (Simple version) */}
          <div className="md:hidden flex gap-2">
             <Link to="/play" className="p-2 bg-gray-100 rounded-lg">🎮</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

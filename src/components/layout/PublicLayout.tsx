import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';

export const PublicLayout: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/">
            <Logo size="md" variant={scrolled ? 'light' : 'light'} />
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/how-it-works" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">How It Works</Link>
            <Link to="/technology" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Technology</Link>
            <Link to="/stakeholders" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Stakeholders</Link>
            <Link to="/about" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">About</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link to="/login" className="hidden sm:block">
              <Button variant="primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo size="md" variant="dark" />
            <p className="text-sm text-gray-400 mt-2 text-center md:text-left max-w-sm">
              Making Every Food Journey Visible, Verifiable & Affordable
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-gray-800 text-sm text-center text-gray-500">
          &copy; 2026 INOVIX. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

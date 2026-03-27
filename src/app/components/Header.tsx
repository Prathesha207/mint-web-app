'use client'
import React, { useState } from 'react';
import { Home, Cpu, Eye, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavButton = ({ icon, isActive, to, tooltip }: { icon: React.ReactNode, isActive: boolean, to: string, tooltip: string }) => (
    <div className="relative group w-full">
      <Link
        to={to}
        className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-300 relative z-10 ${isActive
            ? 'bg-primary/10 text-primary border border-primary/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
            : 'text-glass-foreground hover:bg-white/5 hover:text-white border border-transparent'
          }`}
        aria-label={tooltip}
      >
        {icon}
      </Link>
      <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-md text-xs font-bold tracking-wider uppercase text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
        {tooltip}
      </div>
    </div>
  );

  const MobileNavButton = ({ icon, label, to, isActive }: { icon: React.ReactNode, label: string, to: string, isActive: boolean }) => (
    <Link
      to={to}
      onClick={() => setMobileMenuOpen(false)}
      className={`w-full text-left px-4 py-4 rounded-lg flex items-center gap-4 transition-all font-heading font-bold tracking-wider uppercase text-sm ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-glass-foreground hover:bg-white/5'
        }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <nav className="fixed left-0 top-0 h-full w-20 bg-background/80 backdrop-blur-2xl border-r border-white/5 z-50 hidden lg:flex flex-col items-center py-8 gap-8 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
        <Link to="/" className="font-heading text-primary text-2xl font-black tracking-tighter mb-4 relative group cursor-pointer">
          NN
          <div className="absolute inset-0 bg-primary/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        <div className="flex flex-col gap-4 w-full px-3">
          <NavButton
            icon={<Home size={22} />}
            isActive={isActive('/')}
            to="/"
            tooltip="Home"
          />
          <NavButton
            icon={<Cpu size={22} />}
            isActive={isActive('/training')}
            to="/training"
            tooltip="Training"
          />
          <NavButton
            icon={<Eye size={22} />}
            isActive={isActive('/inference')}
            to="/inference"
            tooltip="Inference"
          />
        </div>

        {/* ... keep existing code (settings section removed) ... */}
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/" className="font-heading text-primary text-xl font-black tracking-widest uppercase">Neural Nexus</Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pb-4 space-y-2 overflow-hidden bg-background/95 backdrop-blur-xl border-b border-white/10"
            >
              <MobileNavButton icon={<Home size={20} />} label="Home" to="/" isActive={isActive('/')} />
              <MobileNavButton icon={<Cpu size={20} />} label="Training" to="/training" isActive={isActive('/training')} />
              <MobileNavButton icon={<Eye size={20} />} label="Inference" to="/inference" isActive={isActive('/inference')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

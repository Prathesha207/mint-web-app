import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full px-6 py-8 border-t border-primary/20 bg-white/40">
      <div className="max-w-[120rem] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-glass-foreground text-xs font-paragraph uppercase tracking-widest">
          <p>&copy; 2026 Neural Nexus. All rights reserved.</p>
          <div className="flex gap-4">
            <span>SYS.STAT: ONLINE</span>
            <span className="text-accent-muted">LATENCY: 12ms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

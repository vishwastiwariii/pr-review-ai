import React from 'react';

function Footer() {
  return (
    <footer className="bg-surface w-full border-t border-[#0F172A]/10 mt-auto relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-center py-6 px-4 md:px-16 w-full max-w-7xl mx-auto">
        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
          © 2026 CodeFitsPR AI. All rights reserved.
        </p>
        <div className="flex gap-4 mt-3 md:mt-0 font-label-mono text-xs">
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <span className="text-[#0F172A]/20">|</span>
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

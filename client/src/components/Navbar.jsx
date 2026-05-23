import React from 'react';

function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl z-50 transition-all duration-300">
      <div className="flex justify-between items-center h-16 px-6 bg-white/70 backdrop-blur-md brutalist-border rounded-full shadow-lg">
        {/* Brand */}
        <a className="font-headline-md text-lg font-bold text-primary flex items-center gap-2" href="#">
          <span className="material-symbols-outlined fill-1 text-emerald-500">terminal</span>
          <span className="hidden sm:inline tracking-tight font-extrabold text-xl">CodeFitsPR <span className="text-emerald-500">AI</span></span>
        </a>
        
        {/* Actions & Repo */}
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/vishwastiwariii/pr-review-ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-emerald-500 transition-all p-1.5 flex items-center justify-center brutalist-border brutalist-shadow-hover rounded-full bg-white"
            aria-label="GitHub Repository"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
            </svg>
          </a>

          <div className="w-px h-5 bg-[#0F172A]/10 hidden sm:block"></div>
          
          <a 
            className="bg-primary text-on-primary font-label-mono text-[11px] uppercase tracking-wider px-4 py-2 brutalist-border brutalist-shadow-hover transition-transform hidden sm:flex items-center gap-1.5"
            href="https://github.com/apps/codefitspr-ai/installations/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="material-symbols-outlined text-[14px]">bolt</span> Install
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

import React from 'react';

function Hero({ isSimulating, startSimulation }) {
  return (
    <div className="space-y-4">
      <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
        <span className="w-2 h-2 bg-[#D1FAE5] inline-block brutalist-border"></span>
        Pull Request Intelligence
      </p>
      <h1 className="font-display text-headline-lg-mobile md:text-display text-primary leading-tight -mt-1">
        Automate Code Reviews. <br />
        <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">Ship Instantly.</span>
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mt-2 border-l-2 border-[#D1FAE5] pl-4 leading-relaxed">
        CodeFitsPR AI acts as your principal engineer. It automatically audits pull request files, spots security leaks, repairs logic flaws, and posts commit reviews back in seconds.
      </p>
      
      {/* CTAs */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <a 
          className="bg-primary text-on-primary font-label-mono text-label-mono px-6 py-2 flex items-center justify-center gap-2 brutalist-border brutalist-shadow-hover transition-transform uppercase tracking-wider text-xs" 
          href="https://github.com/apps/codefitspr-ai/installations/new"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="material-symbols-outlined text-[16px]">download</span>
          Install on GitHub
        </a>
        <button 
          onClick={startSimulation}
          disabled={isSimulating}
          className="bg-emerald-500 hover:bg-emerald-400 text-primary font-label-mono text-label-mono px-6 py-2 flex items-center justify-center gap-2 brutalist-border brutalist-shadow-hover transition-transform uppercase tracking-wider text-xs font-bold disabled:opacity-50 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] animate-pulse">play_circle</span>
          {isSimulating ? 'Analyzing...' : 'Simulate CodeReview'}
        </button>
      </div>
    </div>
  );
}

export default Hero;

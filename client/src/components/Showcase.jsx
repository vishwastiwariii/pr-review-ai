import React from 'react';

function Showcase() {
  return (
    <section className="w-full flex flex-col gap-6 z-10 relative">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 bg-[#fcd34d] inline-block brutalist-border"></span>
        <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-xs font-extrabold">Deep Integrations</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: GitHub Integration */}
        <div className="bg-surface-container-lowest brutalist-border flex flex-col h-full brutalist-shadow-hover transition-all">
          <div className="p-6 flex justify-between items-start border-b border-[#0F172A]/10">
            <h3 className="font-headline-md text-2xl font-bold text-emerald-600">GitHub App</h3>
            <div className="border border-[#0F172A]/20 w-8 h-8 flex items-center justify-center rounded-md hover:bg-emerald-500 hover:text-on-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </div>
          <div className="p-6 flex-grow flex flex-col gap-6">
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Install directly inside GitHub with one click. Get instant automated reviews and checks triggered right inside your pull requests.
            </p>
            <div className="bg-surface p-4 brutalist-border flex-grow relative overflow-hidden flex flex-col font-label-mono text-[10px] gap-3">
              {/* GitHub Mini-Header */}
              <div className="flex items-center justify-between border-b border-[#0F172A]/10 pb-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  <span className="font-bold text-slate-800">GitHub Marketplace</span>
                </div>
                <span className="bg-[#D1FAE5] text-[#15803d] px-1.5 py-0.5 rounded text-[8px] font-bold border border-[#15803d]/20">Active</span>
              </div>
              
              {/* Integration Visual */}
              <div className="flex items-center justify-around py-3 bg-surface-variant/30 brutalist-border rounded">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white brutalist-border">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                  </div>
                  <span className="text-[9px] text-slate-800 font-bold">GitHub</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-base font-bold text-emerald-600 animate-pulse">sync</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center brutalist-border">
                    <span className="material-symbols-outlined text-base text-white">smart_toy</span>
                  </div>
                  <span className="text-[9px] text-emerald-600 font-bold">PR Review AI</span>
                </div>
              </div>

              {/* Status Section */}
              <div className="flex flex-col gap-1 border-t border-[#0F172A]/10 pt-2">
                <div className="flex items-center justify-between text-[9px] font-bold text-slate-800 mb-1">
                  <span>GitHub Checks</span>
                  <span className="text-[#16a34a] flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[10px] font-bold">check_circle</span> Passed
                  </span>
                </div>
                <div className="bg-[#f8fafc] p-1.5 brutalist-border text-[8px] flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    <span>pr-review-ai / automated-review</span>
                  </div>
                  <span className="text-slate-400">Success in 12s</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap mt-2">
              <span className="text-[11px] font-label-mono bg-surface-container-highest px-3 py-1 text-emerald-600 brutalist-border rounded-full font-bold">Direct GitHub Integration</span>
              <span className="text-[11px] font-label-mono bg-surface-container-highest px-3 py-1 text-emerald-600 brutalist-border rounded-full font-bold">One-click Install</span>
            </div>
          </div>
        </div>

        {/* Card 2: AI Code Review */}
        <div className="bg-surface-container-lowest brutalist-border flex flex-col h-full brutalist-shadow-hover transition-all">
          <div className="p-6 flex justify-between items-start border-b border-[#0F172A]/10">
            <h3 className="font-headline-md text-2xl font-bold text-emerald-600">AI Code Review</h3>
            <div className="border border-[#0F172A]/20 w-8 h-8 flex items-center justify-center rounded-md hover:bg-emerald-500 hover:text-on-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </div>
          <div className="p-6 flex-grow flex flex-col gap-6">
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Cut review time by 80%. Full codebase context on every PR, no hallucinations.
            </p>
            <div className="bg-surface p-4 brutalist-border flex-grow flex flex-col font-label-mono text-[10px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-emerald-100 brutalist-border flex justify-center items-center">
                  <span className="material-symbols-outlined text-[12px] text-emerald-600">smart_toy</span>
                </div>
                <span className="text-xs font-label-caps font-bold">Bot</span>
              </div>
              <div className="bg-surface-variant p-2 text-xs font-body-md font-semibold brutalist-border mb-3">Logging PII in Plaintext</div>
              <div className="bg-error-container/40 border border-error/20 p-2 text-error mb-1 line-through">- logger.info(f"email: {`{email}`}")</div>
              <div className="bg-[#D1FAE5]/40 border border-[#294e3f]/20 p-2 text-[#294e3f] font-bold">+ Avoid PII logging; log only org</div>
            </div>
            <div className="flex gap-2 flex-wrap mt-2">
              <span className="text-[11px] font-label-mono bg-surface-container-highest px-3 py-1 text-emerald-600 brutalist-border rounded-full font-bold">Inline reviews</span>
              <span className="text-[11px] font-label-mono bg-surface-container-highest px-3 py-1 text-emerald-600 brutalist-border rounded-full font-bold">Sequence diagrams</span>
            </div>
          </div>
        </div>

        {/* Card 3: AI SAST */}
        <div className="bg-surface-container-lowest brutalist-border flex flex-col h-full brutalist-shadow-hover transition-all">
          <div className="p-6 flex justify-between items-start border-b border-[#0F172A]/10">
            <h3 className="font-headline-md text-2xl font-bold text-teal-600">Secure Deployment</h3>
            <div className="border border-[#0F172A]/20 w-8 h-8 flex items-center justify-center rounded-md hover:bg-teal-500 hover:text-on-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </div>
          <div className="p-6 flex-grow flex flex-col gap-6">
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Find and fix vulnerabilities before they reach production.
            </p>
            <div className="bg-surface p-4 brutalist-border flex-grow flex flex-col justify-center">
              <div className="flex justify-between items-center mb-4 border-b border-[#0F172A]/10 pb-2">
                <span className="text-xs font-label-caps font-bold text-teal-600 uppercase">Security Issues</span>
                <div className="flex gap-3 text-[10px] font-label-mono font-bold">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-500"></span> High</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-200"></span> Med</span>
                </div>
              </div>
              <div className="h-20 w-full flex items-end gap-1 mt-2 px-2">
                <div className="flex-1 bg-teal-200 h-[40%] brutalist-border"></div>
                <div className="flex-1 bg-teal-500 h-[90%] brutalist-border"></div>
                <div className="flex-1 bg-teal-200 h-[60%] brutalist-border"></div>
                <div className="flex-1 bg-teal-500 h-[30%] brutalist-border"></div>
                <div className="flex-1 bg-teal-200 h-[75%] brutalist-border"></div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap mt-2">
              <span className="text-[11px] font-label-mono bg-surface-container-highest px-3 py-1 text-teal-600 brutalist-border rounded-full font-bold">SAST</span>
              <span className="text-[11px] font-label-mono bg-surface-container-highest px-3 py-1 text-teal-600 brutalist-border rounded-full font-bold">SCA</span>
              <span className="text-[11px] font-label-mono bg-surface-container-highest px-3 py-1 text-teal-600 brutalist-border rounded-full font-bold">Secrets</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Showcase;

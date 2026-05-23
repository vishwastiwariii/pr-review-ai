import React from 'react';

function Showcase() {
  return (
    <section className="w-full flex flex-col gap-6 z-10 relative">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 bg-[#fcd34d] inline-block brutalist-border"></span>
        <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest text-xs font-extrabold">Deep Integrations</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: CLI & IDE */}
        <div className="bg-surface-container-lowest brutalist-border flex flex-col h-full brutalist-shadow-hover transition-all">
          <div className="p-6 flex justify-between items-start border-b border-[#0F172A]/10">
            <h3 className="font-headline-md text-2xl font-bold text-emerald-600">CLI &amp; IDE</h3>
            <div className="border border-[#0F172A]/20 w-8 h-8 flex items-center justify-center rounded-md hover:bg-emerald-500 hover:text-on-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </div>
          <div className="p-6 flex-grow flex flex-col gap-6">
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Security starts at your first keystroke, before a single line is committed.
            </p>
            <div className="bg-surface p-4 brutalist-border flex-grow relative overflow-hidden flex flex-col font-label-mono text-[10px]">
              <div className="font-label-mono text-label-caps bg-surface-variant p-2 brutalist-border mb-3 font-bold">/resolve-pr-comments</div>
              <div className="text-[9px] text-on-surface-variant mb-1 font-bold">Edit final_final_code.py</div>
              <div className="bg-error-container/40 border border-error/20 p-2 text-error mb-1 line-through">- return (dr == 2 and dc == 1) and (dr == 1 and dc == 2)</div>
              <div className="bg-[#D1FAE5]/40 border border-[#294e3f]/20 p-2 text-[#294e3f] font-bold mb-4">+ return (dr == 2 and dc == 1) or (dr == 1 and dc == 2)</div>
            </div>
            <div className="flex gap-2 flex-wrap mt-2">
              <span className="text-[11px] font-label-mono bg-surface-container-highest px-3 py-1 text-emerald-600 brutalist-border rounded-full font-bold">Zero context switch</span>
              <span className="text-[11px] font-label-mono bg-surface-container-highest px-3 py-1 text-emerald-600 brutalist-border rounded-full font-bold">All major IDEs</span>
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
            <h3 className="font-headline-md text-2xl font-bold text-teal-600">AI SAST</h3>
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

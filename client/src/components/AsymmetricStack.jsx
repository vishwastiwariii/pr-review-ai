import React from 'react';

function AsymmetricStack({ simulationStep, isSimulating }) {
  return (
    <div className="md:col-span-6 relative min-h-[600px] mt-12 md:mt-0 flex items-center justify-center">
      
      {/* PR Comment Bot Card (Top Layer, Offset Right) */}
      <div className="absolute right-2 md:right-6 top-4 z-30 bg-surface-container-lowest brutalist-border p-4 w-72 md:w-80 tech-shadow transform rotate-1 hover:rotate-0 transition-transform duration-300 cursor-pointer">
        <div className="flex items-center justify-between border-b border-[#0F172A]/10 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 brutalist-border flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-600 text-sm">smart_toy</span>
            </div>
            <div>
              <p className="font-label-mono text-label-caps font-bold">
                CodeFitsPR <span className="text-on-surface-variant font-normal">bot</span>
              </p>
              <p className="font-label-caps text-[9px] text-on-surface-variant">2 mins ago</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant text-sm hover:text-primary">more_horiz</span>
        </div>
        <p className="font-body-md text-sm text-on-surface mb-2 leading-relaxed">
          Potential SQL injection vulnerability in <code className="bg-[#D1FAE5] px-1 brutalist-border text-xs">user_query</code> parameter. Consider using prepared statements.
        </p>
        <div className="bg-surface-variant p-2 brutalist-border font-label-mono text-[10px] leading-relaxed">
          <p className="text-[#ba1a1a] line-through">- query = f"SELECT * FROM users WHERE id = {`{user_id}`}"</p>
          <p className="text-[#294e3f] font-bold">+ query = "SELECT * FROM users WHERE id = %s"</p>
        </div>
        <div className="mt-2 w-full bg-transparent border border-[#0F172A] text-on-surface font-label-caps py-1.5 hover:bg-[#D1FAE5] transition-colors flex items-center justify-center gap-1 cursor-pointer">
          <span className="material-symbols-outlined text-sm">check</span> Commit Suggestion
        </div>
      </div>

      {/* High Severity Security Badge (Middle Layer, Center Left) */}
      <div className="absolute left-2 md:left-6 top-[310px] z-20 bg-error-container text-on-error-container brutalist-border p-2 flex items-center gap-4 tech-shadow transform -rotate-2 hover:rotate-0 transition-transform duration-300 cursor-pointer">
        <span className="material-symbols-outlined text-[32px] animate-bounce">warning</span>
        <div>
          <p className="font-label-mono text-label-caps font-bold uppercase tracking-widest text-[#93000a]">High Severity</p>
          <p className="font-label-caps text-xs opacity-80">Authentication Bypass Detected</p>
        </div>
        <div className="ml-2 pl-2 border-l border-on-error-container/20">
          <p className="font-display text-2xl font-extrabold">1</p>
        </div>
      </div>

      {/* Code Context File diff card (Base Layer, Center Right) */}
      <div className="absolute right-6 md:right-12 bottom-4 z-10 bg-surface-container-lowest brutalist-border w-72 md:w-80 tech-shadow opacity-90 hover:opacity-100 transform rotate-2 hover:rotate-0 transition-all duration-300">
        <div className="border-b border-[#0F172A] p-2 flex justify-between items-center bg-surface-container-low">
          <p className="font-label-caps text-label-caps flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-emerald-500">folder</span> src/auth/middleware.ts
          </p>
        </div>
        <div className="p-4 font-label-mono text-[11px] text-on-surface-variant leading-relaxed">
          <p className="opacity-60">12  export const verifyToken = (req) =&gt; &#123;</p>
          <p className="opacity-60">13    const token = req.headers.auth;</p>
          
          {/* Bug line */}
          <div className={`-mx-4 px-4 border-y transition-all duration-300 ${
            simulationStep === 2 
            ? 'bg-error-container/30 border-[#ba1a1a]/30 text-[#ba1a1a] line-through opacity-80' 
            : 'bg-yellow-50 border-yellow-200 text-yellow-800'
          }`}>
            <p>14    if (token == null) return false;</p>
          </div>
          
          {/* Auto fix line */}
          <div className={`-mx-4 px-4 border-b border-[#294e3f]/30 bg-[#D1FAE5]/50 text-[#294e3f] transition-all duration-500 overflow-hidden ${
            simulationStep === 2 ? 'max-h-12 py-1 opacity-100' : 'max-h-0 opacity-0 py-0'
          }`}>
            <p className="font-bold">14    if (!token || typeof token !== 'string') return false;</p>
          </div>

          <p className="opacity-60">15    return jwt.verify(token, secret);</p>
          <p className="opacity-60">16  &#125;</p>
        </div>
      </div>

      {/* Connecting lines SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20">
        <path d="M 140 335 C 240 335, 180 440, 260 440" fill="transparent" stroke="#0F172A" strokeDasharray="4 4" strokeWidth="1"></path>
        <circle cx="140" cy="335" fill="#0F172A" r="4"></circle>
        <circle cx="260" cy="440" fill="#0F172A" r="4"></circle>
      </svg>

      {/* Loading/Analysing Overlay */}
      {simulationStep === 1 && (
        <div className="absolute inset-0 bg-[#FAFAFA]/75 backdrop-blur-sm z-40 flex flex-col justify-center items-center gap-4 brutalist-border brutalist-shadow">
          <span className="material-symbols-outlined text-emerald-500 text-5xl animate-spin">sync</span>
          <div className="text-center font-label-mono">
            <p className="font-bold uppercase tracking-wider text-xs">AI Review in Progress...</p>
            <p className="text-[10px] text-on-surface-variant mt-1">Analyzing code diffs, verifying signatures</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AsymmetricStack;

import React from 'react';

function SandboxForm({
  owner,
  setOwner,
  repo,
  setRepo,
  prNumber,
  setPrNumber,
  triggerStatus,
  triggerMessage,
  handleManualTrigger
}) {
  return (
    <div className="brutalist-border bg-surface-container-lowest p-4 max-w-md mt-12 tech-shadow">
      <div className="flex justify-between items-center border-b border-[#0F172A]/10 pb-2 mb-4">
        <div className="flex gap-2">
          <span className="w-3 h-3 rounded-full bg-error brutalist-border"></span>
          <span className="w-3 h-3 rounded-full bg-[#fcd34d] brutalist-border"></span>
          <span className="w-3 h-3 rounded-full bg-emerald-300 brutalist-border"></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-emerald-500 text-[14px]">terminal</span>
          <span className="font-label-caps text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant">Manual Trigger Sandbox</span>
        </div>
      </div>
      <form onSubmit={handleManualTrigger} className="space-y-3 font-label-mono text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-on-surface-variant font-bold mb-1 uppercase text-[10px]">Owner</label>
            <input 
              type="text" 
              value={owner} 
              onChange={(e) => setOwner(e.target.value)}
              className="w-full bg-[#f8f9ff] border border-[#0F172A]/20 p-2 focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-on-surface-variant font-bold mb-1 uppercase text-[10px]">Repository</label>
            <input 
              type="text" 
              value={repo} 
              onChange={(e) => setRepo(e.target.value)}
              className="w-full bg-[#f8f9ff] border border-[#0F172A]/20 p-2 focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <div>
          <label className="block text-on-surface-variant font-bold mb-1 uppercase text-[10px]">Pull Request Number</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              value={prNumber} 
              onChange={(e) => setPrNumber(e.target.value)}
              placeholder="e.g. 2"
              className="w-24 bg-[#f8f9ff] border border-[#0F172A]/20 p-2 focus:outline-none focus:border-primary"
            />
            <button 
              type="submit" 
              disabled={triggerStatus === 'submitting'}
              className="flex-grow bg-emerald-500 hover:bg-emerald-400 text-primary border border-[#0F172A] font-bold uppercase disabled:opacity-50 cursor-pointer"
            >
              {triggerStatus === 'submitting' ? 'Posting...' : 'Trigger Review'}
            </button>
          </div>
        </div>

        {triggerMessage && (
          <div className={`p-3 border mt-3 rounded text-[11px] leading-relaxed ${
            triggerStatus === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}>
            {triggerMessage}
          </div>
        )}
      </form>
    </div>
  );
}

export default SandboxForm;

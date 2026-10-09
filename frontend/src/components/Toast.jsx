import React from 'react';

export default function Toast({
  message,
  tone = 'phosphor', // phosphor | amber | signal | ice
  onDismiss,
}) {
  if (!message) return null;

  const toneBorders = {
    phosphor: 'border-[#3DFFA2] text-[#3DFFA2]',
    amber: 'border-[#FFB547] text-[#FFB547]',
    signal: 'border-[#FF5A1F] text-[#FF5A1F]',
    ice: 'border-[#BFE3FF] text-[#BFE3FF]',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-[#161B22] border px-4 py-2.5 rounded-[3px] hard-shadow reg-mark-card animate-fade-in text-xs font-mono-data border-[#8B98A9]/50">
      <span className={`w-2 h-2 rounded-full bg-current ${toneBorders[tone]}`} />
      <span className="text-white">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-[#8B98A9] hover:text-white ml-2 text-sm font-bold cursor-pointer"
        >
          ×
        </button>
      )}
    </div>
  );
}

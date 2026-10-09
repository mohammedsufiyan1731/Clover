import React from 'react';

export default function StatusStamp({
  label,
  tone = 'phosphor', // phosphor | amber | signal | steel | paper
  rotation = '-rotate-2',
  className = '',
}) {
  const toneStyles = {
    phosphor: 'border-[#3DFFA2] text-[#3DFFA2] bg-[#3DFFA2]/10',
    amber: 'border-[#FFB547] text-[#FFB547] bg-[#FFB547]/10',
    signal: 'border-[#FF5A1F] text-[#FF5A1F] bg-[#FF5A1F]/10',
    steel: 'border-[#8B98A9] text-[#8B98A9] bg-[#8B98A9]/10',
    paper: 'border-[#0E1116] text-[#0E1116] bg-white/40',
  };

  const selectedTone = toneStyles[tone] || toneStyles.phosphor;

  return (
    <span
      className={`stamp text-[10px] uppercase font-bold tracking-widest ${selectedTone} ${rotation} ${className}`}
    >
      {label}
    </span>
  );
}

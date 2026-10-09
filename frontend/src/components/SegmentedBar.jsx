import React from 'react';

export default function SegmentedBar({
  value = 50,
  max = 100,
  segments = 10,
  label = '',
  valueText = '',
  tone = 'signal', // signal | phosphor | amber | steel
  className = '',
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const activeSegments = Math.round((percentage / 100) * segments);

  const toneActiveStyles = {
    signal: 'bg-[#FF5A1F]',
    phosphor: 'bg-[#3DFFA2]',
    amber: 'bg-[#FFB547]',
    steel: 'bg-[#8B98A9]',
  };

  const activeColor = toneActiveStyles[tone] || toneActiveStyles.signal;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {(label || valueText) && (
        <div className="flex justify-between items-center text-xs font-mono-data">
          <span className="text-[#8B98A9] font-medium">{label}</span>
          <span className="text-white font-bold">{valueText || `${Math.round(percentage)}%`}</span>
        </div>
      )}
      <div className="flex gap-1 h-2.5">
        {Array.from({ length: segments }).map((_, idx) => {
          const isActive = idx < activeSegments;
          return (
            <div
              key={idx}
              className={`flex-1 rounded-[1px] transition-all duration-300 ${
                isActive
                  ? `${activeColor} shadow-[0_0_4px_rgba(0,0,0,0.5)]`
                  : 'bg-[#0E1116] border border-[#8B98A9]/20'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

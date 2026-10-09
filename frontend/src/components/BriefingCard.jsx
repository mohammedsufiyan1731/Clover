import React from 'react';

export default function BriefingCard({
  title,
  eyebrow,
  docId = 'APG-DOC-770',
  stamp,
  children,
  className = '',
  footer,
}) {
  return (
    <div
      className={`bg-[#F2EBDD] text-[#0E1116] p-4 md:p-5 rounded-[3px] border border-[#0E1116]/80 hard-shadow-paper relative reg-mark-card ${className}`}
    >
      <div className="flex justify-between items-start border-b border-[#0E1116]/20 pb-2.5 mb-3.5">
        <div>
          {eyebrow && (
            <div className="font-mono-data text-[9px] font-bold tracking-widest text-[#0E1116]/60 uppercase">
              {eyebrow}
            </div>
          )}
          {title && (
            <h3 className="font-heading text-lg font-bold text-[#0E1116] tracking-tight">
              {title}
            </h3>
          )}
        </div>
        {stamp}
      </div>

      <div className="text-xs text-[#0E1116]/85 font-sans leading-relaxed">
        {children}
      </div>

      <div className="mt-4 pt-2.5 border-t border-[#0E1116]/15 flex justify-between items-center font-mono-data text-[9px] text-[#0E1116]/60 uppercase">
        <span>{docId}</span>
        <span>{footer || 'STAMPED // FLIGHT OPS'}</span>
      </div>
    </div>
  );
}

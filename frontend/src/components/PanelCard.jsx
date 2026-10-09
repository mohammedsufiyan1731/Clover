import React from 'react';

export default function PanelCard({
  title,
  eyebrow,
  status,
  children,
  footer,
  className = '',
  scanlines = true,
  action,
}) {
  return (
    <div
      className={`bg-[#161B22] border border-[#8B98A9]/30 p-4 md:p-5 rounded-[3px] hard-shadow relative reg-mark-card ${
        scanlines ? 'scanlines' : ''
      } ${className}`}
    >
      {(title || eyebrow || action || status) && (
        <div className="flex justify-between items-start gap-2 mb-3.5 pb-2.5 border-b border-[#8B98A9]/20">
          <div>
            {eyebrow && (
              <span className="font-mono-data text-[10px] tracking-widest text-[#FF5A1F] uppercase font-bold block mb-0.5">
                {eyebrow}
              </span>
            )}
            {title && (
              <h3 className="font-heading text-base md:text-lg font-bold text-white tracking-tight">
                {title}
              </h3>
            )}
          </div>
          <div className="flex items-center gap-2">
            {status}
            {action}
          </div>
        </div>
      )}

      <div className="text-sm text-[#E2E8F0]">{children}</div>

      {footer && (
        <div className="mt-4 pt-3 border-t border-[#8B98A9]/15 flex justify-between items-center text-[10px] font-mono-data text-[#8B98A9]">
          {footer}
        </div>
      )}
    </div>
  );
}

import React from 'react';

export default function PageHeader({
  title,
  description,
  eyebrow = 'SYSTEM TELEMETRY',
  status = null,
  action = null,
  className = '',
}) {
  return (
    <div
      className={`border border-[#8B98A9]/30 bg-[#161B22] p-4 md:p-5 rounded-[3px] hard-shadow relative reg-mark-card mb-6 ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
        <div>
          {eyebrow && (
            <span className="font-mono-data text-[10px] tracking-widest text-[#FF5A1F] uppercase font-bold block mb-1">
              {eyebrow}
            </span>
          )}
          <h1 className="font-heading text-xl md:text-2xl font-bold text-white tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-xs md:text-sm text-[#8B98A9] mt-1.5 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {status}
          {action}
        </div>
      </div>
    </div>
  );
}

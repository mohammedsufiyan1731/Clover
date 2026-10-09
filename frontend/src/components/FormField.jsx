import React from 'react';

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  hint,
  required = false,
  disabled = false,
  rows = 3,
  className = '',
}) {
  const isTextarea = type === 'textarea';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <label
            htmlFor={name}
            className="font-mono-data text-[11px] font-bold text-[#8B98A9] uppercase tracking-wider"
          >
            {label} {required && <span className="text-[#FF5A1F]">*</span>}
          </label>
          {hint && <span className="text-[10px] font-mono-data text-[#8B98A9]/70">{hint}</span>}
        </div>
      )}

      {isTextarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className="w-full bg-[#0E1116] border border-[#8B98A9]/40 rounded-[2px] p-2.5 text-xs text-white placeholder-[#8B98A9]/50 focus:outline-none focus:border-[#BFE3FF] focus:ring-1 focus:ring-[#BFE3FF] transition-colors resize-y disabled:opacity-50"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-[#0E1116] border border-[#8B98A9]/40 rounded-[2px] py-2 px-3 text-xs text-white placeholder-[#8B98A9]/50 focus:outline-none focus:border-[#BFE3FF] focus:ring-1 focus:ring-[#BFE3FF] transition-colors disabled:opacity-50"
        />
      )}

      {error && (
        <div className="text-[11px] font-mono-data text-[#FF5A1F] flex items-center gap-1.5">
          <span>⚠</span> {error}
        </div>
      )}
    </div>
  );
}

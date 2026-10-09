import React from 'react';

export default function Button({
  children,
  variant = 'primary', // primary | secondary | quiet | destructive
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  icon = null,
  className = '',
}) {
  const baseStyles =
    'font-mono-data text-xs uppercase font-bold tracking-wider py-2.5 px-4 rounded-[3px] transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#BFE3FF] disabled:cursor-not-allowed select-none';

  let variantStyles = '';

  if (variant === 'primary') {
    variantStyles = disabled
      ? 'bg-[#161B22] text-[#8B98A9]/40 border border-[#8B98A9]/20'
      : 'bg-[#FF5A1F] hover:bg-[#E04E18] text-white border border-black hard-shadow-signal active:translate-x-[1px] active:translate-y-[1px]';
  } else if (variant === 'secondary') {
    variantStyles = disabled
      ? 'bg-[#161B22] text-[#8B98A9]/40 border border-[#8B98A9]/20'
      : 'bg-[#0E1116] hover:bg-[#1A202C] text-[#E2E8F0] border border-[#8B98A9]/50 hard-shadow active:translate-x-[1px] active:translate-y-[1px]';
  } else if (variant === 'destructive') {
    variantStyles = disabled
      ? 'bg-[#161B22] text-[#8B98A9]/40 border border-[#8B98A9]/20'
      : 'bg-[#0E1116] text-[#FF5A1F] border border-[#FF5A1F]/60 hover:bg-[#FF5A1F]/10 active:translate-x-[1px] active:translate-y-[1px]';
  } else if (variant === 'quiet') {
    variantStyles = 'bg-transparent text-[#8B98A9] hover:text-white hover:bg-[#161B22] border-transparent';
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 animate-spin text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>Processing...</span>
        </span>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}

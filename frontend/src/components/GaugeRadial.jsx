import React from 'react';

export default function GaugeRadial({
  value = 54,
  max = 100,
  label = 'LAUNCH READINESS',
  subLabel = 'Threshold to board: 70',
  tone = 'signal', // signal | phosphor | amber | steel
  size = 140,
  className = '',
}) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max(value / max, 0), 1);
  const strokeDashoffset = circumference - percentage * circumference;

  const toneColors = {
    signal: '#FF5A1F',
    phosphor: '#3DFFA2',
    amber: '#FFB547',
    steel: '#8B98A9',
  };

  const strokeColor = toneColors[tone] || toneColors.signal;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* SVG Gauge */}
        <svg
          className="w-full h-full -rotate-90 transform"
          viewBox="0 0 120 120"
        >
          {/* Tick marks backdrop */}
          <circle
            cx="60"
            cy="60"
            r="56"
            fill="none"
            stroke="#8B98A9"
            strokeWidth="1.5"
            strokeDasharray="2 6"
            opacity="0.3"
          />

          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#161B22"
            strokeWidth="9"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#8B98A9"
            strokeWidth="9"
            opacity="0.2"
          />

          {/* Active progress arc */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="9"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="butt"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="font-mono-data text-3xl font-bold tracking-tight text-white leading-none">
            {value}
          </div>
          <div className="font-mono-data text-[10px] text-[#8B98A9] font-medium mt-1">
            / {max}
          </div>
        </div>
      </div>

      {label && (
        <div className="font-mono-data text-[11px] font-bold uppercase tracking-wider text-white mt-2 text-center">
          {label}
        </div>
      )}
      {subLabel && (
        <div className="text-[10px] text-[#8B98A9] text-center mt-0.5">
          {subLabel}
        </div>
      )}
    </div>
  );
}

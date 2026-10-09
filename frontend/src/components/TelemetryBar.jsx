import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function TelemetryBar({
  workspace = 'STUDENT FLIGHT DECK',
  user = null,
  connectionState = 'NOMINAL',
}) {
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`UTC ${hours}:${mins}:${secs}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#161B22]/95 backdrop-blur-sm border-b border-[#8B98A9]/25 px-4 py-2.5 scanlines">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Connection Status */}
        <div className="flex items-center gap-3">
          <Link
            to="/mission-control"
            className="flex items-center gap-2 px-2 py-1 bg-[#0E1116] border border-[#8B98A9]/40 rounded-sm hover:border-[#FF5A1F] transition-colors"
          >
            {/* Apogee Orbit Glyph */}
            <div className="relative w-4 h-4 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#FF5A1F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3 L12 12 L18 15" />
              </svg>
              {/* Peak indicator dot */}
              <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#FF5A1F] rounded-full shadow-[0_0_4px_#FF5A1F]"></span>
            </div>
            <span className="font-heading font-bold text-xs tracking-wider text-white">
              apogee
            </span>
          </Link>

          {/* Connection status */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono-data tracking-tight">
            <span className="inline-block w-2 h-2 rounded-full bg-[#3DFFA2] animate-pulse shadow-[0_0_6px_#3DFFA2]"></span>
            <span className="text-[#3DFFA2] font-semibold">{connectionState}</span>
          </div>
        </div>

        {/* Center / User info */}
        {user && (
          <div className="hidden md:flex items-center gap-3 text-xs font-mono-data">
            <span className="text-[#8B98A9]">CALLSIGN:</span>
            <span className="text-white font-bold">{user.callsign || user.name}</span>
            <span className="text-[#8B98A9]">//</span>
            <span className="text-[#BFE3FF]">{user.batchId || 'CORE-OPS'}</span>
          </div>
        )}

        {/* Right Telemetry & UTC Time */}
        <div className="text-right flex flex-col items-end">
          <span className="text-[10px] font-mono-data tracking-widest text-[#BFE3FF] bg-[#0E1116] px-2 py-0.5 border border-[#8B98A9]/30 rounded-[2px]">
            {utcTime || 'UTC 14:32:08'}
          </span>
          <span className="text-[9px] font-mono-data text-[#8B98A9] tracking-wider uppercase mt-0.5">
            {workspace}
          </span>
        </div>
      </div>
    </header>
  );
}

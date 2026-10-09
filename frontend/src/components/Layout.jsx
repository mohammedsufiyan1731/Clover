import React from 'react';
import TelemetryBar from './TelemetryBar';
import Navbar from './Navbar';

export default function Layout({
  children,
  currentRole = 'student',
  currentUser = null,
  onRoleSwitch,
  onLogout,
  workspace = 'STUDENT FLIGHT DECK',
}) {
  return (
    <div className="min-h-screen bg-[#0E1116] text-[#E2E8F0] flex flex-col font-sans selection:bg-[#FF5A1F] selection:text-white">
      {/* Sticky top Telemetry Bar */}
      <TelemetryBar
        workspace={currentRole === 'student' ? 'STUDENT FLIGHT DECK' : 'COMMAND CENTER'}
        user={currentUser}
        connectionState="SYSTEMS NOMINAL"
      />

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Navigation rail */}
        <Navbar
          currentRole={currentRole}
          onRoleSwitch={onRoleSwitch}
          onLogout={onLogout}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-grid-pattern max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Analog Footer */}
      <footer className="border-t border-[#8B98A9]/20 bg-[#161B22] px-6 py-3 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-[10px] font-mono-data text-[#8B98A9] gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[#3DFFA2] font-bold">APOGEE</span>
          <span>//</span>
          <span>ANALOG MISSION CONTROL FOR PLACEMENT DRILLS</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-[#0E1116] px-2 py-0.5 border border-[#8B98A9]/30 rounded-[2px] text-[#BFE3FF]">
            DEMO ENVIRONMENT // VER 0.4.2
          </span>
          <span>STATION // SECTOR-07</span>
        </div>
      </footer>
    </div>
  );
}

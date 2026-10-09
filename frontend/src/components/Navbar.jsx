import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Compass,
  FileText,
  MessageSquareCode,
  FileCheck,
  Code2,
  PieChart,
  ShieldAlert,
  Palette,
  LogOut,
  Menu,
  X,
  UserCheck
} from 'lucide-react';

export default function Navbar({ currentRole = 'student', onRoleSwitch, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const studentLinks = [
    { to: '/mission-control', label: 'Mission Control', icon: Compass, id: 'S2' },
    { to: '/test-arena', label: 'Test Arena', icon: FileCheck, id: 'S3' },
    { to: '/interview-room', label: 'Interview Room', icon: MessageSquareCode, id: 'S5', badge: 'WOW' },
    { to: '/resume-lab', label: 'Resume Lab', icon: FileText, id: 'S6' },
    { to: '/code-lab', label: 'Code Lab', icon: Code2, id: 'S7' },
    { to: '/debrief', label: 'Debrief', icon: PieChart, id: 'S4' },
  ];

  const trainerLinks = [
    { to: '/command-center', label: 'Command Center', icon: ShieldAlert, id: 'S8' },
  ];

  const systemLinks = [
    { to: '/style-guide', label: 'Style Guide (S0)', icon: Palette, id: 'S0', badge: 'STITCH' },
  ];

  const navLinks = currentRole === 'student' ? [...studentLinks, ...systemLinks] : [...trainerLinks, ...studentLinks.slice(0, 2), ...systemLinks];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Top Navigation Toggle */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-[#161B22] border-b border-[#8B98A9]/20 text-xs font-mono-data">
        <span className="text-[#8B98A9] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3DFFA2]"></span>
          NAV // {currentRole.toUpperCase()}
        </span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded bg-[#0E1116] border border-[#8B98A9]/30 text-white cursor-pointer"
        >
          {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#161B22] border-b border-[#8B98A9]/30 p-3 space-y-1.5 z-30">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 text-xs font-mono-data rounded-[2px] transition-colors ${
                    isActive
                      ? 'bg-[#FF5A1F] text-white font-bold'
                      : 'text-[#8B98A9] hover:text-white hover:bg-[#0E1116]'
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <Icon size={14} />
                  <span>{link.label}</span>
                </div>
                <span className="text-[10px] opacity-75">{link.id}</span>
              </NavLink>
            );
          })}
        </div>
      )}

      {/* Desktop Left Rail Navigation */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#161B22] border-r border-[#8B98A9]/20 min-h-[calc(100vh-45px)] p-3 space-y-6 flex-shrink-0">
        <div>
          <div className="px-3 py-1 mb-2 font-mono-data text-[9px] text-[#8B98A9] uppercase tracking-widest border-b border-[#8B98A9]/15">
            PRIMARY FLIGHT DECK
          </div>
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3 py-2 text-xs font-mono-data rounded-[2px] transition-all border ${
                      isActive
                        ? 'bg-[#0E1116] text-[#FF5A1F] border-[#FF5A1F]/50 font-bold shadow-[2px_2px_0_#000]'
                        : 'text-[#8B98A9] hover:text-white hover:bg-[#0E1116] border-transparent'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={15} className="group-hover:text-white transition-colors" />
                    <span>{link.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {link.badge && (
                      <span className="text-[8px] px-1 py-0.2 bg-[#FF5A1F]/20 text-[#FF5A1F] border border-[#FF5A1F]/40 rounded-[2px] font-bold">
                        {link.badge}
                      </span>
                    )}
                    <span className="text-[9px] opacity-50">{link.id}</span>
                  </div>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Quick Role Switcher (Crucial for testing student vs trainer console) */}
        <div className="mt-auto pt-4 border-t border-[#8B98A9]/20">
          <div className="px-3 py-1 mb-2 font-mono-data text-[9px] text-[#8B98A9] uppercase tracking-widest">
            SIMULATION ROLE
          </div>
          <button
            onClick={() => {
              if (onRoleSwitch) onRoleSwitch(currentRole === 'student' ? 'trainer' : 'student');
              navigate(currentRole === 'student' ? '/command-center' : '/mission-control');
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono-data bg-[#0E1116] border border-[#8B98A9]/40 hover:border-[#3DFFA2] text-white rounded-[2px] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <UserCheck size={14} className="text-[#3DFFA2]" />
              <span className="uppercase">{currentRole}</span>
            </div>
            <span className="text-[9px] text-[#8B98A9]">SWITCH</span>
          </button>

          <NavLink
            to="/"
            onClick={onLogout}
            className="w-full flex items-center justify-between px-3 py-2 mt-2 text-xs font-mono-data text-[#8B98A9] hover:text-[#FF5A1F] hover:bg-[#0E1116] rounded-[2px] transition-colors"
          >
            <div className="flex items-center gap-2">
              <LogOut size={14} />
              <span>LOG OUT</span>
            </div>
            <span className="text-[9px]">S1</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}

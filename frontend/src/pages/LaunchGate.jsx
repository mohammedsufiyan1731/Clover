import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BriefingCard from '../components/BriefingCard';
import PanelCard from '../components/PanelCard';
import StatusStamp from '../components/StatusStamp';
import TelemetryBar from '../components/TelemetryBar';
import Button from '../components/Button';
import { LogIn, UserPlus, Sparkles, AlertTriangle, KeyRound, Radio } from 'lucide-react';

export default function LaunchGate({ onLogin }) {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('aarav.sharma@apogee.dev');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      const chosenRole =
        activeTab === 'login'
          ? email.includes('priya') || email.includes('trainer')
            ? 'trainer'
            : 'student'
          : role;

      if (onLogin) {
        onLogin(chosenRole);
      }

      if (chosenRole === 'trainer') {
        navigate('/command-center');
      } else {
        navigate('/mission-control');
      }
    }, 700);
  };

  const handleQuickPreset = (presetRole) => {
    if (presetRole === 'student') {
      setEmail('aarav.sharma@apogee.dev');
      setPassword('cadet-aarav-2027');
      setRole('student');
    } else {
      setEmail('priya.nair@apogee.dev');
      setPassword('controller-priya-2027');
      setRole('trainer');
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1116] text-[#E2E8F0] flex flex-col font-sans">
      {/* 1. TOP TELEMETRY BAR */}
      <TelemetryBar
        workspace="PUBLIC ACCESS // APOGEE"
        connectionState="SYSTEMS NOMINAL"
      />

      {/* Sub-ribbon status strip (From Stitch Screen) */}
      <div className="w-full bg-[#101d2a] px-4 py-1.5 border-b border-[#8B98A9]/20 flex items-center justify-between text-[10px] font-mono-data text-[#8B98A9]">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 bg-[#3DFFA2] animate-pulse rounded-full"></span>
          <span className="text-[#3DFFA2] uppercase font-bold tracking-wider">
            HANDSHAKE BEACON ONLINE
          </span>
          <span className="text-[#8B98A9] hidden sm:inline">// CHANNEL 12</span>
        </div>
        <div className="uppercase tracking-wider">
          DOWNLINK: <span className="text-[#BFE3FF] font-bold">8.421 GHz</span>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center p-3 md:p-8 bg-grid-pattern">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* 2. BRIEFING MISSION PAPER PANEL (Analog Technical Dossier) */}
          <div className="lg:col-span-7">
            <div
              className="relative w-full bg-[#F2EBDD] text-[#0E1116] p-5 md:p-7 rounded-[3px] border border-[#0E1116]/80 hard-shadow-paper reg-mark-card overflow-hidden"
            >
              {/* Header Index of Paper */}
              <div className="flex items-center justify-between border-b border-[#0E1116]/20 pb-2 mb-3">
                <span className="font-mono-data text-[9px] font-bold tracking-widest text-[#0E1116]/60 uppercase">
                  FORM-7B // BRIEFING DOSSIER
                </span>
                <span className="font-mono-data text-[9px] text-[#0E1116]/60 uppercase">
                  LOC: SUB-ORBITAL TESTBED
                </span>
              </div>

              {/* Rotated Ink Stamp */}
              <div className="flex justify-between items-start mb-3">
                <div
                  className="inline-block transform -rotate-2 border-2 border-[#521300] px-2 py-0.5 bg-white/40"
                  style={{ boxShadow: 'inset 0 0 0 1px #521300' }}
                >
                  <span className="font-mono-data text-[10px] text-[#521300] font-bold tracking-widest uppercase">
                    ★ PLACEMENT TRAINING // ONLINE
                  </span>
                </div>
                <span className="font-mono-data text-[11px] text-[#0E1116]/60 font-mono">
                  SER: 884-APG
                </span>
              </div>

              {/* Mission Briefing Title & Copy */}
              <h1 className="font-heading text-xl md:text-2xl text-[#0E1116] tracking-tight mb-2 uppercase font-bold leading-tight">
                Your next placement starts with a systems check.
              </h1>
              <p className="text-xs md:text-sm text-[#0E1116]/85 mb-4 leading-relaxed font-sans">
                Prepare with a clearer picture of your skills. Analyze your resume, practice technical mock interviews and diagnostic test batteries, then track your unified <strong>Launch Readiness Score</strong>.
              </p>

              {/* Analog Score Barometer / Linear Flight Readiness Visual */}
              <div className="bg-[#E4DBC8] p-3 rounded-[2px] border border-[#0E1116]/20 mb-4">
                <div className="flex items-center justify-between mb-1.5 font-mono-data text-[10px]">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-[#0E1116]"></span>
                    <span className="text-[#0E1116] font-bold uppercase tracking-wider">
                      LAUNCH READINESS SCORE BAROMETER
                    </span>
                  </div>
                  <span className="text-[#521300] font-bold tracking-wider">TARGET: 850 LRS</span>
                </div>

                {/* Linear Gauge Scale Visual */}
                <div className="relative w-full h-4 bg-[#D3C7AE] rounded-[1px] flex items-center px-1 my-1.5 border border-[#0E1116]/20">
                  {/* Scale ticks */}
                  <div className="absolute inset-0 flex justify-between px-2 items-center opacity-40 select-none">
                    <span className="w-0.5 h-2 bg-[#0E1116]"></span>
                    <span className="w-0.5 h-1 bg-[#0E1116]"></span>
                    <span className="w-0.5 h-2 bg-[#0E1116]"></span>
                    <span className="w-0.5 h-1 bg-[#0E1116]"></span>
                    <span className="w-0.5 h-3 bg-[#521300]"></span>
                    <span className="w-0.5 h-1 bg-[#0E1116]"></span>
                    <span className="w-0.5 h-2 bg-[#0E1116]"></span>
                  </div>
                  {/* Metric Fill Level */}
                  <div className="h-2 bg-[#007243] rounded-[1px]" style={{ width: '74%' }}></div>
                  {/* Needle Marker */}
                  <div className="absolute top-0 bottom-0 w-1 bg-[#521300]" style={{ left: '74%' }}></div>
                </div>

                <div className="flex justify-between items-center mt-1 text-[#0E1116] font-mono-data text-[10px]">
                  <span className="font-bold">CURRENT: 742 / NOMINAL</span>
                  <span className="text-[#0E1116]/70 uppercase">DELTA: +38 PTS THIS RUN</span>
                </div>
              </div>

              {/* Role Dispatch Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#0E1116]/15 font-mono-data text-[11px]">
                <div className="bg-white/60 p-2.5 rounded-[2px] border border-[#0E1116]/20">
                  <div className="text-[#521300] font-bold uppercase">CADET CONSOLE</div>
                  <div className="text-[#0E1116]/80 text-[10px] mt-0.5">
                    Adaptive Board, Code Lab sandbox, ATS line diff.
                  </div>
                </div>
                <div className="bg-white/60 p-2.5 rounded-[2px] border border-[#0E1116]/20">
                  <div className="text-[#0E1116] font-bold uppercase">TRAINER OPERATIONS</div>
                  <div className="text-[#0E1116]/80 text-[10px] mt-0.5">
                    Batch weak topics, cohort CSV export, drill scheduler.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. MISSION CONTROL ACCESS PANEL (Dark Structural Console) */}
          <div className="lg:col-span-5 space-y-4">
            <PanelCard
              eyebrow="SEC-04 // HANDSHAKE PORTAL"
              title="Console Clearance Access"
              status={<StatusStamp label="ENC: AES-GCM" tone="phosphor" />}
              footer="SESSION TOKEN ISSUED POST-AUTH // 2048-BIT TELEMETRY CIPHER"
            >
              {/* Tab Switcher */}
              <div className="grid grid-cols-2 gap-1 mb-3.5 bg-[#030f1c] p-0.5 rounded-[2px]">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`py-1.5 px-3 flex items-center justify-center gap-1.5 font-mono-data text-xs uppercase font-bold tracking-wider transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-[#1e2b39] text-[#3dffa2] border-b-2 border-[#3dffa2]'
                      : 'text-[#8B98A9] hover:text-white'
                  }`}
                >
                  <span className="w-1.5 h-1.5 bg-[#3dffa2]"></span>
                  <span>LOG IN</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className={`py-1.5 px-3 flex items-center justify-center gap-1.5 font-mono-data text-xs uppercase font-bold tracking-wider transition-all cursor-pointer ${
                    activeTab === 'signup'
                      ? 'bg-[#1e2b39] text-[#3dffa2] border-b-2 border-[#3dffa2]'
                      : 'text-[#8B98A9] hover:text-white'
                  }`}
                >
                  <span className="w-1.5 h-1.5 bg-[#8B98A9]"></span>
                  <span>SIGN UP</span>
                </button>
              </div>

              {/* Status Alert or Verifying Beacon */}
              {loading && (
                <div className="mb-3 px-3 py-2 bg-[#030f1c] border border-[#3dffa2]/40 rounded-[2px] flex items-center justify-between text-xs font-mono-data text-[#3dffa2]">
                  <div className="flex items-center gap-2">
                    <span className="animate-spin text-sm">✦</span>
                    <span>Verifying telemetry credentials…</span>
                  </div>
                  <span className="text-[10px] animate-pulse">[BEACON-TX]</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAuth} className="space-y-3.5">
                {activeTab === 'signup' && (
                  <div>
                    <label className="font-mono-data text-[10px] text-[#8B98A9] tracking-widest uppercase block mb-1">
                      OPERATOR FULL NAME
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Cadet Name"
                      required
                      className="w-full bg-[#030f1c] border border-[#8B98A9]/40 rounded-[2px] px-3 py-2 text-xs font-mono-data text-white placeholder-[#8B98A9]/50 focus:outline-none focus:border-[#BFE3FF]"
                    />
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-mono-data text-[10px] text-[#8B98A9] tracking-widest uppercase">
                      OPERATOR IDENTIFIER // EMAIL
                    </label>
                    <span className="font-mono-data text-[9px] text-[#3dffa2]">REQ // AUTH_ID</span>
                  </div>
                  <div className="relative bg-[#030f1c] border border-[#8B98A9]/40 rounded-[2px] flex items-center px-3 py-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operator@apogee.internal"
                      required
                      className="w-full bg-transparent font-mono-data text-xs text-white focus:outline-none placeholder-[#8B98A9]/40"
                    />
                    <span className="w-1.5 h-3.5 bg-[#3dffa2] animate-pulse ml-1 inline-block"></span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-mono-data text-[10px] text-[#8B98A9] tracking-widest uppercase">
                      CLEARANCE CIPHER // PASSWORD
                    </label>
                    <span className="font-mono-data text-[9px] text-[#ffb59e] hover:underline cursor-pointer">
                      RECOVERY KEY?
                    </span>
                  </div>
                  <div className="bg-[#030f1c] border border-[#8B98A9]/40 rounded-[2px] flex items-center px-3 py-2">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••••••"
                      required
                      className="w-full bg-transparent font-mono-data text-xs text-white tracking-widest focus:outline-none placeholder-[#8B98A9]/40"
                    />
                  </div>
                </div>

                {/* Station Role Toggle */}
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-1.5 font-mono-data text-[10px]">
                    <span className="text-[#8B98A9] uppercase tracking-widest">ASSIGNED STATION ROLE</span>
                    <span className="text-[#3dffa2] font-mono">
                      {role === 'student' ? 'CODE: 01-CAD' : 'CODE: 02-DIR'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`py-1.5 px-2.5 rounded-[2px] flex items-center justify-between font-mono-data text-[11px] uppercase cursor-pointer border ${
                        role === 'student'
                          ? 'bg-[#1e2b39] text-[#3dffa2] border-[#3dffa2] font-bold'
                          : 'bg-[#030f1c] text-[#8B98A9] border-[#8B98A9]/30'
                      }`}
                    >
                      <span>[STUDENT / CADET]</span>
                      <span className={`w-1.5 h-1.5 ${role === 'student' ? 'bg-[#3dffa2]' : 'bg-transparent'}`}></span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('trainer')}
                      className={`py-1.5 px-2.5 rounded-[2px] flex items-center justify-between font-mono-data text-[11px] uppercase cursor-pointer border ${
                        role === 'trainer'
                          ? 'bg-[#1e2b39] text-[#ffb547] border-[#ffb547] font-bold'
                          : 'bg-[#030f1c] text-[#8B98A9] border-[#8B98A9]/30'
                      }`}
                    >
                      <span>[TRAINER / FLIGHT DIR]</span>
                      <span className={`w-1.5 h-1.5 ${role === 'trainer' ? 'bg-[#ffb547]' : 'bg-transparent'}`}></span>
                    </button>
                  </div>
                </div>

                {/* Primary CTA Button with hard offset shadow */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#fd591e] hover:bg-[#e04e18] text-white font-mono-data text-xs font-bold py-3 px-4 uppercase tracking-wider flex items-center justify-between transition-transform active:translate-x-0.5 active:translate-y-0.5 rounded-[2px] cursor-pointer"
                  style={{ boxShadow: '2px 2px 0px 0px #030f1c' }}
                >
                  <span>{activeTab === 'login' ? 'Log in to Apogee' : 'Create Operator Account'}</span>
                  <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-[1px] tracking-widest text-[#BFE3FF]">
                    INITIATE SESSION ↵
                  </span>
                </button>
              </form>

              {/* Quick Preset Selector */}
              <div className="mt-4 pt-3 border-t border-[#8B98A9]/20 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono-data text-[#8B98A9]">
                  <span className="flex items-center gap-1">
                    <Sparkles size={11} className="text-[#FFB547]" />
                    QUICK DEMO PRESETS:
                  </span>
                  <span>INSTANT LOAD</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickPreset('student')}
                    className="p-1.5 text-[10px] font-mono-data bg-[#030f1c] border border-[#8B98A9]/40 hover:border-[#3DFFA2] text-white rounded-[2px] text-left cursor-pointer transition-colors"
                  >
                    <div className="text-[#3DFFA2] font-bold">Aarav Sharma</div>
                    <div className="text-[#8B98A9]">Cadet Access</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset('trainer')}
                    className="p-1.5 text-[10px] font-mono-data bg-[#030f1c] border border-[#8B98A9]/40 hover:border-[#FFB547] text-white rounded-[2px] text-left cursor-pointer transition-colors"
                  >
                    <div className="text-[#FFB547] font-bold">Priya Nair</div>
                    <div className="text-[#8B98A9]">Trainer Console</div>
                  </button>
                </div>
              </div>
            </PanelCard>

            {/* 4. TELEMETRY DIAGNOSTIC INDICATORS STRIP (From Stitch) */}
            <div className="w-full grid grid-cols-3 gap-1.5 font-mono-data text-[10px]">
              <div className="bg-[#030f1c] border border-[#8B98A9]/30 p-2 rounded-[2px]">
                <span className="text-[#8B98A9] block">NODE LATENCY</span>
                <span className="text-[#3dffa2] font-bold">14 MS [MIN]</span>
              </div>
              <div className="bg-[#030f1c] border border-[#8B98A9]/30 p-2 rounded-[2px]">
                <span className="text-[#8B98A9] block">INTERVIEW AI</span>
                <span className="text-[#3dffa2] font-bold">ONLINE // R9</span>
              </div>
              <div className="bg-[#030f1c] border border-[#8B98A9]/30 p-2 rounded-[2px]">
                <span className="text-[#8B98A9] block">TEST BATTERY</span>
                <span className="text-[#ffb59e] font-bold">STANDBY</span>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

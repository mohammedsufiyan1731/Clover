import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BriefingCard from '../components/BriefingCard';
import PanelCard from '../components/PanelCard';
import FormField from '../components/FormField';
import Button from '../components/Button';
import StatusStamp from '../components/StatusStamp';
import TelemetryBar from '../components/TelemetryBar';
import { LogIn, UserPlus, KeyRound, Sparkles } from 'lucide-react';

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
      const chosenRole = activeTab === 'login' 
        ? (email.includes('priya') || email.includes('trainer') ? 'trainer' : 'student')
        : role;

      if (onLogin) {
        onLogin(chosenRole);
      }

      if (chosenRole === 'trainer') {
        navigate('/command-center');
      } else {
        navigate('/mission-control');
      }
    }, 600);
  };

  const handleQuickPreset = (presetRole) => {
    if (presetRole === 'student') {
      setEmail('aarav.sharma@apogee.dev');
      setPassword('cadet-aarav-2027');
    } else {
      setEmail('priya.nair@apogee.dev');
      setPassword('controller-priya-2027');
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1116] text-[#E2E8F0] flex flex-col font-sans">
      <TelemetryBar
        workspace="PUBLIC ACCESS // APOGEE"
        connectionState="SYSTEMS NOMINAL"
      />

      <main className="flex-1 flex items-center justify-center p-4 md:p-8 bg-grid-pattern">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Paper Briefing Card */}
          <div className="lg:col-span-7">
            <BriefingCard
              docId="APG-AUTH-SPEC // REV 04.2"
              stamp={<StatusStamp label="ACCESS GATE" tone="signal" rotation="-rotate-1" />}
              footer="SECURITY PROTOCOL // ENCRYPTED"
              className="p-6 md:p-8"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-sm bg-[#0E1116] flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#FF5A1F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 3 L12 12 L18 15" />
                    </svg>
                  </div>
                  <span className="font-heading font-bold text-2xl text-[#0E1116] tracking-tight">
                    apogee
                  </span>
                  <span className="font-mono-data text-[10px] text-[#0E1116]/60 bg-black/10 px-2 py-0.5 rounded-[2px] ml-2">
                    FLIGHT OPS
                  </span>
                </div>

                <div className="border-l-2 border-[#FF5A1F] pl-3 py-0.5">
                  <div className="font-mono-data text-[11px] font-bold text-[#FF5A1F] uppercase tracking-wider">
                    MISSION BRIEF
                  </div>
                  <h2 className="font-heading text-xl md:text-2xl font-bold text-[#0E1116] leading-tight mt-0.5">
                    Your next placement starts with a systems check.
                  </h2>
                </div>

                <p className="text-xs md:text-sm text-[#0E1116]/80 leading-relaxed font-sans">
                  Prepare with a clearer picture of your skills. Analyze your resume against live job descriptions, practice adaptive mock interviews and tests, then track your unified <strong>Launch Readiness Score</strong>.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="bg-white/70 border border-[#0E1116]/20 p-3 rounded-[2px]">
                    <div className="font-mono-data text-[10px] text-[#0E1116]/60 uppercase font-bold">
                      STUDENT FLIGHT DECK
                    </div>
                    <div className="text-xs text-[#0E1116] font-semibold mt-0.5">
                      Target weaknesses, run drill codes, elevate orbit score.
                    </div>
                  </div>
                  <div className="bg-white/70 border border-[#0E1116]/20 p-3 rounded-[2px]">
                    <div className="font-mono-data text-[10px] text-[#0E1116]/60 uppercase font-bold">
                      TRAINER COMMAND
                    </div>
                    <div className="text-xs text-[#0E1116] font-semibold mt-0.5">
                      Batch-level gap telemetry, crew roster, and test authoring.
                    </div>
                  </div>
                </div>
              </div>
            </BriefingCard>
          </div>

          {/* Right Dark Access Panel */}
          <div className="lg:col-span-5">
            <PanelCard
              eyebrow="AUTHENTICATION PROTOCOL"
              title="Launch Gate Clearance"
              status={<StatusStamp label="GATE SECURED" tone="phosphor" />}
              footer="SESSION TOKEN ISSUED AFTER AUTHENTICATION"
            >
              {/* Tab Selector */}
              <div className="flex border border-[#8B98A9]/30 rounded-[2px] p-0.5 mb-5 bg-[#0E1116]">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-1.5 text-xs font-mono-data uppercase font-bold tracking-wider rounded-[2px] transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-[#FF5A1F] text-white hard-shadow-signal'
                      : 'text-[#8B98A9] hover:text-white'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className={`flex-1 py-1.5 text-xs font-mono-data uppercase font-bold tracking-wider rounded-[2px] transition-all cursor-pointer ${
                    activeTab === 'signup'
                      ? 'bg-[#FF5A1F] text-white hard-shadow-signal'
                      : 'text-[#8B98A9] hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleAuth} className="space-y-4">
                {activeTab === 'signup' && (
                  <FormField
                    label="Full Name"
                    name="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Cadet Name"
                    required
                  />
                )}

                <FormField
                  label="Official Email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@apogee.dev"
                  required
                />

                <FormField
                  label="Password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />

                {activeTab === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="font-mono-data text-[11px] font-bold text-[#8B98A9] uppercase tracking-wider">
                      Designated Role
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole('student')}
                        className={`p-2 text-xs font-mono-data border rounded-[2px] uppercase cursor-pointer ${
                          role === 'student'
                            ? 'bg-[#0E1116] border-[#3DFFA2] text-[#3DFFA2] font-bold'
                            : 'border-[#8B98A9]/30 text-[#8B98A9]'
                        }`}
                      >
                        Student
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('trainer')}
                        className={`p-2 text-xs font-mono-data border rounded-[2px] uppercase cursor-pointer ${
                          role === 'trainer'
                            ? 'bg-[#0E1116] border-[#FFB547] text-[#FFB547] font-bold'
                            : 'border-[#8B98A9]/30 text-[#8B98A9]'
                        }`}
                      >
                        Trainer
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="text-[11px] font-mono-data text-[#FF5A1F] bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 p-2 rounded-[2px]">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  icon={activeTab === 'login' ? <LogIn size={14} /> : <UserPlus size={14} />}
                  className="w-full mt-2"
                >
                  {activeTab === 'login' ? 'Log in to Apogee' : 'Create account'}
                </Button>
              </form>

              {/* Demo quick credential presets */}
              <div className="mt-5 pt-3.5 border-t border-[#8B98A9]/20 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono-data text-[#8B98A9]">
                  <span className="flex items-center gap-1">
                    <Sparkles size={11} className="text-[#FFB547]" />
                    QUICK DEMO PRESETS:
                  </span>
                  <span>CLICK TO FILL</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickPreset('student')}
                    className="p-1.5 text-[10px] font-mono-data bg-[#0E1116] border border-[#8B98A9]/40 hover:border-[#3DFFA2] text-white rounded-[2px] text-left cursor-pointer transition-colors"
                  >
                    <div className="text-[#3DFFA2] font-bold">Aarav Sharma</div>
                    <div className="text-[#8B98A9]">Student Role</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset('trainer')}
                    className="p-1.5 text-[10px] font-mono-data bg-[#0E1116] border border-[#8B98A9]/40 hover:border-[#FFB547] text-white rounded-[2px] text-left cursor-pointer transition-colors"
                  >
                    <div className="text-[#FFB547] font-bold">Priya Nair</div>
                    <div className="text-[#8B98A9]">Trainer Role</div>
                  </button>
                </div>
              </div>
            </PanelCard>
          </div>

        </div>
      </main>
    </div>
  );
}

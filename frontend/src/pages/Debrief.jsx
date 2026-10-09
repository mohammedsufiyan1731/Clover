import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import BriefingCard from '../components/BriefingCard';
import PanelCard from '../components/PanelCard';
import StatusStamp from '../components/StatusStamp';
import Button from '../components/Button';
import { mockDebriefData } from '../mocks/apogeeData';
import {
  Compass,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  PlaneTakeoff,
  RotateCcw,
  Zap,
} from 'lucide-react';

export default function Debrief() {
  const navigate = useNavigate();
  const debrief = mockDebriefData;

  const reviewQuestions = [
    {
      id: 'Q01',
      topic: 'SQL Basics',
      status: 'CORRECT',
      text: 'Which command retrieves all columns from the telemetry stream?',
      selected: '[A] SELECT *',
      validated: '[A] SELECT *',
      isCorrect: true,
    },
    {
      id: 'Q02',
      topic: 'SQL Basics',
      status: 'CORRECT',
      text: 'Identify the clause used to filter rows based on altitude > 100km.',
      selected: '[C] WHERE clause',
      validated: '[C] WHERE clause',
      isCorrect: true,
    },
    {
      id: 'Q03',
      topic: 'Joins',
      status: 'INCORRECT',
      text: 'Include all left table telemetry records regardless of right table link matches.',
      selected: '[B] INNER JOIN',
      validated: '[D] LEFT OUTER JOIN',
      isCorrect: false,
    },
    {
      id: 'Q04',
      topic: 'Joins',
      status: 'TIME EXCEEDED + INCORRECT',
      text: 'Generate a full Cartesian product of sensor readings and payload telemetry.',
      selected: '[A] FULL JOIN',
      validated: '[C] CROSS JOIN',
      latency: '01:42',
      limit: '00:45',
      delta: '+57s',
      isCorrect: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & REGISTRATION STRIP */}
      <div className="bg-[#101d2a] border border-[#8B98A9]/30 p-2.5 rounded-[2px] flex flex-wrap items-center justify-between text-[10px] font-mono-data text-[#8B98A9] gap-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3DFFA2] animate-pulse"></span>
          <span className="text-[#3DFFA2] font-bold">APOGEE // SYS: NOMINAL</span>
          <span>//</span>
          <span>CADET-784</span>
          <span>//</span>
          <span>EVAL ASSESSMENT</span>
        </div>
        <div className="flex items-center gap-2 text-[#BFE3FF]">
          <span>UTC 14:02:58</span>
          <span className="text-[#8B98A9]">//</span>
          <span className="text-[#FF5A1F] font-bold">POST-FLIGHT RECORD</span>
        </div>
      </div>

      <PageHeader
        eyebrow="POST-DRILL TELEMETRY ANALYSIS // SEC_OPS_POST_FLIGHT"
        title="DEBRIEF // TEST ATTEMPT"
        description="SQL Fundamentals Check · SPEC: FLIGHT-TEST-SQL-09 · Flight evaluation verified."
        status={
          <div className="shrink-0 -rotate-3 bg-[#1e2b39] border border-[#FF5A1F]/40 px-2.5 py-1 rounded shadow-[2px_2px_0px_#000] text-center font-mono-data">
            <div className="text-[10px] leading-tight text-[#FF5A1F] tracking-widest font-bold">
              DEBRIEF COMPLETE
            </div>
            <div className="text-[8px] leading-none text-[#8B98A9] mt-0.5">AUTH: OPS-SYS-7</div>
          </div>
        }
        action={
          <Button
            variant="primary"
            onClick={() => navigate('/mission-control')}
            icon={<Compass size={14} />}
          >
            Mission Control
          </Button>
        }
      />

      {/* 2. TOP RESULTS: ARCHIVAL MISSION PRINT & DUAL ORBIT RADAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Top Paper Result Card (Archival Mission Print) */}
        <div className="lg:col-span-6">
          <div className="relative bg-[#F2EBDD] text-[#0E1116] p-5 rounded-[3px] border border-[#0E1116]/80 hard-shadow-paper reg-mark-card overflow-hidden h-full flex flex-col justify-between">
            <div>
              {/* Perforation holes & Doc ID */}
              <div className="flex justify-between items-center pb-2 mb-3 border-b border-[#0E1116]/20 font-mono-data text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0E1116]/40"></span>
                  <span className="w-2 h-2 rounded-full bg-[#0E1116]/40"></span>
                  <span className="font-bold uppercase tracking-wider text-[#0E1116]/70">
                    FORM 88-AV // TELEMETRY SUMMARY
                  </span>
                </div>
                <span className="text-[#0E1116]/60">DOC_ID: 9028-SQL</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                {/* Score Index */}
                <div className="space-y-1">
                  <span className="font-mono-data text-[10px] uppercase tracking-wider text-[#0E1116]/70 font-bold block">
                    FLIGHT SCORE INDEX
                  </span>
                  <div className="flex items-baseline gap-1 font-mono-data">
                    <span className="text-4xl md:text-5xl font-bold tracking-tight text-[#0E1116]">
                      {debrief.score}
                    </span>
                    <span className="text-base text-[#0E1116]/60 font-bold">/ 100</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 bg-[#0E1116]/10 px-2 py-0.5 rounded w-fit font-mono-data text-[11px]">
                    <span className="font-bold text-[#0E1116]">{debrief.accuracyRatio} CORRECT</span>
                    <span className="text-[#0E1116]/70">(75.0% RAW)</span>
                  </div>
                </div>

                {/* Right: Analog Needle Gauge Dial SVG */}
                <div className="relative flex flex-col items-center shrink-0">
                  <svg className="w-24 h-20 overflow-visible" viewBox="0 0 100 80">
                    {/* Background Arc */}
                    <path
                      d="M 15,70 A 40,40 0 1,1 85,70"
                      fill="none"
                      stroke="#0E1116"
                      strokeLinecap="round"
                      strokeOpacity="0.15"
                      strokeWidth="4"
                    />
                    {/* Active Arc (72%) */}
                    <path
                      d="M 15,70 A 40,40 0 1,1 85,70"
                      fill="none"
                      stroke="#007243"
                      strokeDasharray="140"
                      strokeDashoffset="39"
                      strokeLinecap="round"
                      strokeWidth="4.5"
                    />
                    {/* Calibration Ticks */}
                    <circle
                      cx="50"
                      cy="50"
                      fill="none"
                      r="46"
                      stroke="#0E1116"
                      strokeDasharray="2, 6"
                      strokeOpacity="0.4"
                      strokeWidth="1"
                    />
                    {/* Needle Pivot & Arm */}
                    <g transform="rotate(45, 50, 50)">
                      <line
                        stroke="#0E1116"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        x1="50"
                        x2="50"
                        y1="50"
                        y2="16"
                      />
                      <polygon fill="#FF5A1F" points="50,12 47,20 53,20" />
                    </g>
                    <circle cx="50" cy="50" fill="#0E1116" r="4.5" />
                    <text fill="#0E1116" fontSize="7" opacity="0.6" x="12" y="77" fontFamily="monospace">0</text>
                    <text fill="#0E1116" fontSize="7" opacity="0.6" x="47" y="10" fontFamily="monospace">50</text>
                    <text fill="#0E1116" fontSize="7" opacity="0.6" x="82" y="77" fontFamily="monospace">100</text>
                  </svg>
                  <span className="font-mono-data text-[9px] font-bold text-[#0E1116] tracking-widest mt-1">
                    ACCURACY CALIBRATION
                  </span>
                </div>
              </div>
            </div>

            {/* Paper Footer Details */}
            <div className="mt-4 pt-2.5 border-t border-[#0E1116]/15 flex items-center justify-between font-mono-data text-xs text-[#0E1116]/80">
              <div className="flex items-center gap-1.5 text-[11px]">
                <span>ATTEMPT DURATION:</span>
                <span className="font-bold text-[#0E1116]">18M 42S</span>
              </div>
              <div className="bg-[#007243]/15 text-[#007243] px-2 py-0.5 rounded font-bold text-[10px]">
                STATUS: CERTIFIED
              </div>
            </div>
          </div>
        </div>

        {/* Right: Dual Orbit Radar Diagram SVG (YOUR ORBIT / BATCH ORBIT) */}
        <div className="lg:col-span-6">
          <PanelCard
            eyebrow="ORBITAL_METRICS // BATCH DYNAMICS"
            title="YOUR ORBIT / BATCH ORBIT"
            status={
              <span className="font-mono-data text-xs text-[#3DFFA2] font-bold">
                +4.0 PTS ABOVE BATCH
              </span>
            }
          >
            {/* Dual Orbit Radar Diagram SVG */}
            <div className="relative flex flex-col items-center justify-center py-1">
              <svg className="w-full h-36" viewBox="0 0 320 140">
                {/* Reticle Grid & Radial axes */}
                <line stroke="#849587" strokeDasharray="2,3" strokeOpacity="0.3" strokeWidth="0.5" x1="20" x2="300" y1="70" y2="70" />
                <line stroke="#849587" strokeDasharray="2,3" strokeOpacity="0.3" strokeWidth="0.5" x1="160" x2="160" y1="10" y2="130" />
                <circle cx="160" cy="70" fill="none" r="55" stroke="#849587" strokeOpacity="0.25" strokeWidth="0.75" />

                {/* Cohort Orbit Ring (Score 68) */}
                <ellipse cx="160" cy="70" fill="none" rx="90" ry="42" stroke="#bacbbc" strokeDasharray="4, 3" strokeOpacity="0.5" strokeWidth="1.2" />
                {/* Cohort Position Marker */}
                <g transform="translate(230, 52)">
                  <circle cx="0" cy="0" fill="#bacbbc" r="3" />
                  <line stroke="#bacbbc" strokeWidth="0.75" x1="0" x2="0" y1="-3" y2="-16" />
                  <text fill="#bacbbc" fontSize="9" fontWeight="600" x="4" y="-12" fontFamily="monospace">BATCH AVG: 68</text>
                </g>

                {/* User Orbit Path (Score 72 - Phosphor Green) */}
                <ellipse cx="160" cy="70" fill="none" rx="115" ry="52" stroke="#3DFFA2" strokeWidth="1.8" />
                {/* User Beacon Marker */}
                <g transform="translate(250, 42)">
                  <circle cx="0" cy="0" fill="#3DFFA2" r="4.5" className="animate-pulse" />
                  <circle cx="0" cy="0" fill="none" opacity="0.6" r="8" stroke="#3DFFA2" strokeWidth="0.8" />
                  <line stroke="#3DFFA2" strokeWidth="1" x1="0" x2="0" y1="-8" y2="-22" />
                  <text fill="#3DFFA2" fontSize="10" fontWeight="700" x="5" y="-16" fontFamily="monospace">CADET-784: 72</text>
                </g>

                {/* Center Celestial Origin */}
                <circle cx="160" cy="70" fill="#191c21" r="8" stroke="#3DFFA2" strokeWidth="1" />
                <circle cx="160" cy="70" fill="#3DFFA2" r="2.5" />
                <text fill="#849587" fontSize="7" letterSpacing="1" textAnchor="middle" x="160" y="86" fontFamily="monospace">ORIGIN_VEC</text>
              </svg>
            </div>

            {/* Orbit Readouts Bar */}
            <div className="grid grid-cols-2 gap-2 mt-2 bg-[#101d2a] p-2.5 rounded-[2px] font-mono-data">
              <div>
                <span className="text-[9px] text-[#8B98A9] uppercase block">RELATIVE APOGEE</span>
                <span className="text-xs text-[#3DFFA2] font-bold">+4.0 PTS ABOVE MEDIAN</span>
              </div>
              <div>
                <span className="text-[9px] text-[#8B98A9] uppercase block">COHORT TRAJECTORY</span>
                <span className="text-xs text-white font-bold">TOP 28TH PERCENTILE</span>
              </div>
            </div>
          </PanelCard>
        </div>

      </div>

      {/* 3. TOPIC BREAKDOWN & LATENCY OSCILLOSCOPE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Topic Breakdown Bars */}
        <div className="lg:col-span-6">
          <PanelCard
            eyebrow="MOD_DIAGNOSTICS // VECTORS"
            title="Topic Breakdown"
            status={<StatusStamp label="3 VECTORS MONITORED" tone="steel" />}
          >
            {/* Track Tick Scale */}
            <div className="flex justify-between px-0.5 text-[#8B98A9] text-[9px] font-mono-data mb-2 select-none">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>

            <div className="space-y-3 font-mono-data">
              {/* Topic 1: SQL Basics (83%) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-medium">SQL Basics</span>
                  <span className="text-[#3DFFA2] font-bold">83% [PASS]</span>
                </div>
                <div className="h-3 w-full bg-[#030f1c] rounded-[1px] overflow-hidden p-0.5 border border-[#8B98A9]/20">
                  <div className="h-full bg-[#3DFFA2] rounded-[1px]" style={{ width: '83%' }}></div>
                </div>
              </div>

              {/* Topic 2: Joins (50% - WEAK AREA) */}
              <div className="space-y-1.5 bg-[#1e2b39]/60 p-2.5 rounded-[2px] border border-[#FFB547]/30">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle size={14} className="text-[#FFB547]" />
                    <span className="text-[#FFB547] font-bold">Joins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#FFB547] font-bold">50%</span>
                    <span className="bg-[#FFB547]/20 text-[#FFB547] px-1.5 py-0.2 rounded text-[9px] font-bold uppercase">
                      WEAK AREA
                    </span>
                  </div>
                </div>
                <div className="h-3 w-full bg-[#030f1c] rounded-[1px] overflow-hidden p-0.5 relative border border-[#8B98A9]/20">
                  <div className="h-full bg-[#FFB547] rounded-[1px] relative" style={{ width: '50%' }}>
                    <div
                      className="absolute inset-0 opacity-25"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(45deg, #000 0px, #000 2px, transparent 2px, transparent 6px)',
                      }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[#8B98A9] text-[10px]">
                  <span>FAIL VECTOR: MULTI-TABLE ALIASING</span>
                  <span className="text-[#FFB547] font-bold">-18% VS TARGET</span>
                </div>
              </div>

              {/* Topic 3: Aggregation (67%) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-medium">Aggregation</span>
                  <span className="text-[#3DFFA2] font-bold">67% [STABLE]</span>
                </div>
                <div className="h-3 w-full bg-[#030f1c] rounded-[1px] overflow-hidden p-0.5 border border-[#8B98A9]/20">
                  <div className="h-full bg-[#3DFFA2] rounded-[1px]" style={{ width: '67%' }}></div>
                </div>
              </div>
            </div>
          </PanelCard>
        </div>

        {/* Latency & Oscilloscope Trace Strip SVG */}
        <div className="lg:col-span-6 space-y-4">
          <PanelCard
            eyebrow="TIME_SERIES // 1HZ SAMPLING"
            title="Latency & Oscilloscope Trace"
            status={<StatusStamp label="ANOMALY FLAGGED" tone="amber" />}
          >
            {/* Timeline Trace Strip SVG */}
            <div className="relative bg-[#030f1c] p-2 rounded-[2px] border border-[#8B98A9]/30 overflow-hidden">
              <svg className="w-full h-16" viewBox="0 0 300 70">
                <line stroke="#3b4a3f" strokeDasharray="3,3" strokeWidth="0.5" x1="0" x2="300" y1="18" y2="18" />
                <line stroke="#3b4a3f" strokeDasharray="3,3" strokeWidth="0.5" x1="0" x2="300" y1="36" y2="36" />
                <line stroke="#3b4a3f" strokeDasharray="3,3" strokeWidth="0.5" x1="0" x2="300" y1="54" y2="54" />
                {/* Target median baseline (38s) */}
                <line stroke="#849587" strokeDasharray="4,2" strokeWidth="1" x1="0" x2="300" y1="46" y2="46" />
                <text fill="#849587" fontSize="8" textAnchor="end" x="295" y="44" fontFamily="monospace">MEDIAN 00:38</text>
                {/* Oscilloscope wave */}
                <polyline
                  fill="none"
                  points="10,48 35,46 60,49 85,45 110,47 135,14 160,44 185,46 210,48 235,45 260,47 285,46"
                  stroke="#3DFFA2"
                  strokeWidth="1.75"
                />
                {/* Question 04 Spike Alert Node */}
                <circle cx="135" cy="14" fill="#FFB547" r="4.5" className="animate-pulse" />
                <circle cx="135" cy="14" fill="none" r="8" stroke="#FFB547" strokeDasharray="2,2" strokeWidth="1" />
                <text fill="#FFB547" fontSize="8" fontWeight="700" textAnchor="middle" x="135" y="9" fontFamily="monospace">Q04 SPIKE (01:42)</text>
              </svg>
            </div>

            {/* Spike Telemetry Callout Box */}
            <div className="flex items-start gap-2.5 mt-3 bg-[#1e2b39] p-2.5 rounded-[2px] text-xs font-mono-data border border-[#FFB547]/30">
              <Clock size={16} className="text-[#FFB547] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#FFB547] font-bold block uppercase text-[10px]">
                  COGNITIVE STALL IDENTIFIED
                </span>
                <p className="text-[#d6e4f6] text-[11px] mt-0.5 leading-snug">
                  <strong className="text-white">Question 04</strong> took <span className="text-[#FFB547] font-bold">01:42</span> — significantly slower than your median response cadence of <span className="text-[#3DFFA2] font-bold">00:38</span>.
                </p>
              </div>
            </div>
          </PanelCard>

          {/* Paper Recommendation Card (Flight Instructor Memo) */}
          <BriefingCard
            eyebrow="DIRECTIVE // FLIGHT INSTRUCTOR MEMO"
            title="Weak Areas to Revisit"
            docId="MEMO_REF: #404-J"
            stamp={<StatusStamp label="DIRECTIVE" tone="paper" />}
          >
            <div className="space-y-2 font-mono-data text-xs text-[#0E1116]">
              <p className="font-bold text-sm">
                &gt; "Review SQL joins, then retry a short practice set."
              </p>
              <p className="text-[11px] text-[#0E1116]/80 leading-relaxed font-sans">
                Syntactic confusion detected between Cartesian products and multi-table filtering. A focused 5-minute practice session will stabilize orbit before Flight Ops Exam II.
              </p>
              <button
                type="button"
                onClick={() => navigate('/resume-lab')}
                className="mt-2 w-full bg-[#0E1116] hover:bg-[#1a202c] text-[#F2EBDD] font-mono-data text-xs font-bold uppercase py-2 px-3 rounded-[2px] flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>Launch Joins Module Drill</span>
                <span className="text-[#3DFFA2]">-&gt;</span>
              </button>
            </div>
          </BriefingCard>
        </div>

      </div>

      {/* 4. QUESTION REVIEW LOG (DETAILED INSPECTION MATRIX) */}
      <PanelCard
        eyebrow="LOG_INSPECTION // POST-SUBMIT AUDIT"
        title="Question Review Log & Answer Keys"
        status={<StatusStamp label="UNLOCKED POST-TEST" tone="steel" />}
      >
        <div className="space-y-3 font-mono-data text-xs">
          {reviewQuestions.map((q) => (
            <div
              key={q.id}
              className={`p-3 rounded-[2px] space-y-1.5 border ${
                q.isCorrect
                  ? 'bg-[#101d2a] border-[#8B98A9]/20'
                  : 'bg-[#1e2b39] border-[#FF5A1F]/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      q.isCorrect ? 'bg-[#3DFFA2]' : 'bg-[#FF5A1F]'
                    }`}
                  ></span>
                  <span className="font-bold text-white">{q.id}</span>
                  <span className="text-[#8B98A9] text-[11px]">{q.topic}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    q.isCorrect
                      ? 'text-[#3DFFA2] bg-[#3DFFA2]/10'
                      : 'text-[#FF5A1F] bg-[#FF5A1F]/15'
                  }`}
                >
                  [{q.status}]
                </span>
              </div>

              <p className="text-[#d6e4f6] text-[11px] font-sans">{q.text}</p>

              {q.isCorrect ? (
                <div className="flex items-center gap-2 text-[11px] pt-1 text-[#8B98A9]">
                  <span>SELECTED: <strong className="text-[#3DFFA2]">{q.selected}</strong></span>
                  <span>•</span>
                  <span>VALIDATED: <strong className="text-[#3DFFA2]">{q.validated}</strong></span>
                </div>
              ) : (
                <div className="flex flex-col gap-0.5 text-[11px] pt-1 bg-[#030f1c] p-2 rounded-[2px]">
                  {q.latency && (
                    <div className="flex justify-between items-center text-[#8B98A9] text-[10px] pb-1 border-b border-[#8B98A9]/20">
                      <span>LATENCY: <strong className="text-[#FFB547]">{q.latency}</strong> (LIMIT: {q.limit})</span>
                      <span className="text-[#FF5A1F] font-bold">DELTA: {q.delta}</span>
                    </div>
                  )}
                  <span className="text-[#FF5A1F]">USER INPUT: {q.selected}</span>
                  <span className="text-[#3DFFA2]">FLIGHT KEY: {q.validated}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </PanelCard>

      {/* 5. MAIN CTA RETURN TO MISSION CONTROL */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => navigate('/mission-control')}
          className="w-full bg-[#FF5A1F] hover:bg-[#e04e18] text-white font-mono-data text-xs md:text-sm font-bold uppercase py-3.5 px-4 rounded-[2px] flex items-center justify-center gap-2 hard-shadow-signal active:translate-y-0.5 transition-transform cursor-pointer"
        >
          <PlaneTakeoff size={18} />
          <span>Return to Mission Control</span>
          <span className="text-[10px] opacity-80 font-mono ml-1">[&lt;- FLIGHT CONSOLE]</span>
        </button>
        <div className="flex items-center justify-center gap-2 mt-2 text-[#8B98A9] font-mono-data text-[10px]">
          <span>SESSION HASH: 89f4b-sql-784</span>
          <span>•</span>
          <span>APOGEE OS v4.2.1-PROD</span>
        </div>
      </div>
    </div>
  );
}

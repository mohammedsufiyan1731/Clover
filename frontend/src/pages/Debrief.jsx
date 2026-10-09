import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockDebriefData, sampleTestQuestions } from '../mocks/apogeeData';
import {
  Compass,
  Check,
  X,
  AlertTriangle,
  Timer,
  Terminal,
  Orbit,
  ArrowRight,
  PlaneTakeoff,
  CornerDownLeft,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function Debrief() {
  const navigate = useNavigate();
  const location = useLocation();
  const attemptState = location.state || {};
  const debrief = mockDebriefData;

  const score = attemptState.score !== undefined ? attemptState.score : debrief.score;
  const accuracyRatio = attemptState.accuracyRatio || debrief.accuracyRatio;
  const tabSwitches = attemptState.tabSwitches !== undefined ? attemptState.tabSwitches : 1;
  const isPassed = score >= 65;

  // Interactive state simulation mode from Stitch Screen (NORMAL, BUSY, ERROR)
  const [simulationState, setSimulationState] = useState('normal');

  // Interactive dispatch checklist
  const [checklist, setChecklist] = useState({
    audit: true,
    drill: false,
    pacing: false,
  });

  // Toggle full 12 questions vs 3 key highlights
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  // Key audit samples from Stitch design
  const keyAuditItems = [
    {
      id: 'Q01',
      code: 'BASIC_FILTER',
      status: 'CORRECT',
      selected: 'INNER JOIN',
      key: 'INNER JOIN',
      time: '00:32',
      topic: 'SQL Basics',
      isCorrect: true,
    },
    {
      id: 'Q04',
      code: 'JOIN_CARTESIAN',
      status: 'INCORRECT',
      selected: 'LEFT OUTER JOIN',
      key: 'CROSS JOIN',
      time: '01:42 (LATENCY SPIKE)',
      topic: 'Joins',
      isCorrect: false,
      latencySpike: true,
    },
    {
      id: 'Q08',
      code: 'GROUP_CLAUSE',
      status: 'CORRECT',
      selected: 'GROUP BY',
      key: 'GROUP BY',
      time: '00:41',
      topic: 'Aggregation',
      isCorrect: true,
    },
  ];

  // Needle angle for accuracy gauge (180deg semicircle: 0% -> 0deg, 100% -> 180deg)
  const gaugeAngle = (score / 100) * 180;

  return (
    <div className="space-y-6">
      {/* 1. TOP TELEMETRY & SUB-REGISTRATION RIBBON */}
      <section className="bg-[#101d2a] border border-[#8B98A9]/30 p-2.5 rounded-[2px] flex flex-wrap items-center justify-between text-[10px] font-mono-data text-[#8B98A9] gap-2 hard-shadow">
        <div className="flex items-center gap-2">
          <span className="text-[#3DFFA2] font-bold">+</span>
          <span className="text-[#D6E4F6] font-bold tracking-wider uppercase">
            SYS: PLACEMENT-DEBRIEF
          </span>
          <span className="text-[#8B98A9]/40">//</span>
          <span className="text-[#BFE3FF]">CADET-784</span>
          <span className="text-[#8B98A9]/40">//</span>
          <span>CHNL 04-A</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#3DFFA2] font-bold">
            <span className="w-1.5 h-1.5 bg-[#3DFFA2] animate-pulse inline-block"></span>
            <span className="phosphor-glow">UPLINK NOMINAL</span>
          </div>
          <span className="text-[#8B98A9]/40">//</span>
          <span className="text-[#BFE3FF]">UTC 14:32:09</span>
        </div>
      </section>

      {/* 2. DEBRIEF HEADER CARD & RUBBER STAMP */}
      <article className="relative bg-[#161B22] border border-[#8B98A9]/35 p-4 md:p-5 shadow-hard-2 reg-mark-card">
        {/* Mechanical corner registration ticks */}
        <span className="absolute -top-1.5 -left-1.5 text-[10px] text-[#8B98A9] font-bold leading-none select-none">+</span>
        <span className="absolute -top-1.5 -right-1.5 text-[10px] text-[#8B98A9] font-bold leading-none select-none">+</span>
        <span className="absolute -bottom-1.5 -left-1.5 text-[10px] text-[#8B98A9] font-bold leading-none select-none">+</span>
        <span className="absolute -bottom-1.5 -right-1.5 text-[10px] text-[#8B98A9] font-bold leading-none select-none">+</span>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="font-mono-data text-[10px] text-[#FF5A1F] font-bold tracking-widest flex items-center gap-1.5 uppercase">
              <span className="w-1.5 h-1.5 bg-[#FF5A1F] inline-block"></span>
              DEBRIEF // TEST ATTEMPT
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#E1E2E9] mt-1 tracking-tight">
              SQL Fundamentals Check
            </h1>
            <p className="font-mono-data text-xs text-[#8B98A9] mt-1">
              SESSION_UID: FL-9041-KILO-09 · SPEC: FLIGHT-TEST-SQL-09
            </p>
          </div>

          {/* Angled Rubber Stamp Badge (-4deg) */}
          <div className="self-start sm:self-center transform -rotate-[4deg] shrink-0">
            <div className={`border-2 px-3 py-1.5 text-center shadow-sm bg-[#0E1116] ${isPassed ? 'border-[#3DFFA2] text-[#3DFFA2]' : 'border-[#FFB547] text-[#FFB547]'}`}>
              <div className="text-[9px] font-mono-data tracking-wider leading-none uppercase font-bold">
                {isPassed ? 'STAMP VALID' : 'ACTION ADVISORY'}
              </div>
              <div className="text-xs font-heading font-bold tracking-widest leading-tight mt-0.5 whitespace-nowrap">
                {isPassed ? '[ DEBRIEF COMPLETE ]' : '[ REVIEW REQUIRED ]'}
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* 3. MAIN GRID: TOP PAPER CARD & DUAL ORBIT RADAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Top Paper Result Card (#F2EBDD printed archive paper) */}
        <div className="lg:col-span-6">
          <article className="relative bg-[#F2EBDD] text-[#12151B] p-5 shadow-paper border border-[#12151B]/40 rounded-[2px] h-full flex flex-col justify-between">
            {/* Dot-matrix perforation header border */}
            <div className="absolute top-0 left-0 right-0 h-1.5 perf-border opacity-70"></div>

            <div>
              <div className="flex justify-between items-center border-b border-[#12151B]/20 pb-2 pt-1 font-mono-data text-[10px]">
                <span className="tracking-widest text-[#12151B]/80 font-bold uppercase">
                  MANIFEST #SQ-0941 // FLIGHT CADET
                </span>
                <span className="bg-[#12151B] text-[#F2EBDD] px-2 py-0.5 font-bold uppercase">
                  ARCHIVE COPY
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                {/* Big Ink Score */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono-data text-[#12151B]/70 tracking-wider uppercase font-bold">
                    AGGREGATE RATING
                  </div>
                  <div className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-[#12151B] leading-none">
                    {score}{' '}
                    <span className="font-mono-data text-lg md:text-xl text-[#12151B]/60 font-normal">
                      / 100
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-[#12151B]/10 border border-[#12151B]/30 px-2 py-0.5 mt-2 rounded-[1px]">
                    <span className="w-2 h-2 rounded-full bg-[#12151B]"></span>
                    <span className="font-mono-data text-xs font-bold text-[#12151B]">
                      {accuracyRatio} correct
                    </span>
                  </div>
                </div>

                {/* Analog Mechanical Accuracy Dial Gauge */}
                <div className="w-32 h-28 relative flex flex-col items-center justify-end shrink-0">
                  <svg className="w-28 h-20 overflow-visible" viewBox="0 0 120 70">
                    {/* Gauge Track */}
                    <path
                      d="M 15 65 A 45 45 0 0 1 105 65"
                      fill="none"
                      stroke="#12151B"
                      strokeLinecap="round"
                      strokeOpacity="0.15"
                      strokeWidth="6"
                    />
                    {/* Segmented Ticks at 10% intervals */}
                    <line stroke="#12151B" strokeWidth="2" x1="15" x2="22" y1="65" y2="65" />
                    <line stroke="#12151B" strokeWidth="2" x1="22" x2="28" y1="42" y2="45" />
                    <line stroke="#12151B" strokeWidth="2" x1="38" x2="42" y1="24" y2="30" />
                    <line stroke="#12151B" strokeWidth="2" x1="60" x2="60" y1="18" y2="25" />
                    <line stroke="#12151B" strokeWidth="2" x1="82" x2="78" y1="24" y2="30" />
                    <line stroke="#12151B" strokeWidth="2" x1="98" x2="92" y1="42" y2="45" />
                    <line stroke="#12151B" strokeWidth="2" x1="105" x2="98" y1="65" y2="65" />

                    {/* Gauge Active Arc */}
                    <path
                      d="M 15 65 A 45 45 0 0 1 97 37"
                      fill="none"
                      stroke="#12151B"
                      strokeLinecap="round"
                      strokeWidth="6"
                    />

                    {/* Phosphor Signal Orange Needle */}
                    <g transform={`rotate(${-90 + (score / 100) * 180}, 60, 65)`}>
                      <polygon fill="#FF5A1F" points="60,63 58,65 92,34 62,65" />
                    </g>
                    <circle cx="60" cy="65" fill="#12151B" r="4" />
                  </svg>
                  <div className="text-[10px] font-mono-data text-[#12151B] font-bold tracking-widest mt-0.5">
                    ACCURACY: {score}%
                  </div>
                  <div className="text-[8px] font-mono-data text-[#12151B]/60 tracking-wider uppercase">
                    CALIBRATED TANK
                  </div>
                </div>
              </div>
            </div>

            {/* Micro barcode & auth footer */}
            <div className="mt-5 pt-2.5 border-t border-[#12151B]/20 flex justify-between items-center text-[10px] font-mono-data text-[#12151B]/70 font-bold">
              <div className="tracking-tighter font-mono">||||||| | ||||| |||| || |||</div>
              <span>OFFICIAL TELEMETRY PRINT</span>
            </div>
          </article>
        </div>

        {/* Right: Concentric Elliptical Orbit Diagram ("YOUR ORBIT / BATCH ORBIT") */}
        <div className="lg:col-span-6">
          <section className="relative bg-[#161B22] border border-[#8B98A9]/35 p-4 md:p-5 shadow-hard-2 rounded-[2px] reg-mark-card">
            <div className="flex items-center justify-between border-b border-[#8B98A9]/20 pb-2.5">
              <div className="flex items-center gap-1.5 font-mono-data">
                <Orbit size={16} className="text-[#BFE3FF]" />
                <span className="text-xs font-bold text-[#BFE3FF] tracking-wider uppercase">
                  YOUR ORBIT / BATCH ORBIT
                </span>
              </div>
              <span className="bg-[#3DFFA2]/15 text-[#3DFFA2] text-[10px] font-mono-data px-2 py-0.5 border border-[#3DFFA2]/40 font-bold">
                {score >= debrief.batchAverage
                  ? `+${score - debrief.batchAverage} PTS DELTA`
                  : `${score - debrief.batchAverage} PTS DELTA`}
              </span>
            </div>

            {/* Concentric Elliptical Orbit Diagram SVG */}
            <div className="relative py-2 mt-1 flex flex-col items-center">
              <svg className="w-full h-36" viewBox="0 0 320 140">
                {/* Center Core Planet Node */}
                <circle cx="160" cy="70" fill="#0E1116" r="14" stroke="#3E4652" strokeWidth="1.5" />
                <circle cx="160" cy="70" fill="#8B98A9" r="4" />
                <line stroke="#3E4652" strokeDasharray="2,2" strokeWidth="0.75" x1="160" x2="160" y1="35" y2="105" />
                <line stroke="#3E4652" strokeDasharray="2,2" strokeWidth="0.75" x1="110" x2="210" y1="70" y2="70" />

                {/* Batch Orbit (Dashed Steel #8B98A9) */}
                <ellipse cx="160" cy="70" fill="none" rx="95" ry="42" stroke="#8B98A9" strokeDasharray="4,4" strokeWidth="1.5" />
                <circle cx="75" cy="55" fill="#8B98A9" r="4.5" />
                <line stroke="#8B98A9" strokeWidth="1" x1="75" x2="48" y1="55" y2="35" />
                <circle cx="48" cy="35" fill="#8B98A9" r="2" />

                {/* Your Orbit (Solid Ice Blue #BFE3FF) */}
                <ellipse cx="160" cy="70" fill="none" rx="135" ry="54" stroke="#BFE3FF" strokeWidth="2" />
                <circle cx="265" cy="45" fill="#BFE3FF" r="5.5" />
                <circle cx="265" cy="45" fill="#0E1116" r="2" />
                <line stroke="#BFE3FF" strokeWidth="1" x1="265" x2="280" y1="45" y2="25" />
                <circle cx="280" cy="25" fill="#BFE3FF" r="2" />
              </svg>

              {/* Instrumented Callout Badges */}
              <div className="w-full grid grid-cols-2 gap-2 mt-1 font-mono-data">
                {/* Batch Average Callout */}
                <div className="bg-[#0E1116] border border-[#3E4652] p-2.5 relative">
                  <span className="absolute top-1 right-1.5 text-[#8B98A9] text-[9px] font-bold">+</span>
                  <div className="text-[10px] text-[#8B98A9] uppercase">BATCH AVERAGE</div>
                  <div className="text-lg font-bold text-[#8B98A9] leading-tight mt-0.5">
                    {debrief.batchAverage}.0
                  </div>
                  <div className="text-[9px] text-[#8B98A9]/80 mt-1 uppercase">
                    N=420 CADETS // DASHED
                  </div>
                </div>

                {/* Your Orbit Callout */}
                <div className="bg-[#0E1116] border border-[#BFE3FF]/50 p-2.5 relative shadow-hard-2">
                  <span className="absolute top-1 right-1.5 text-[#BFE3FF] text-[9px] font-bold">+</span>
                  <div className="text-[10px] text-[#BFE3FF] uppercase font-bold">YOUR ORBIT SCORE</div>
                  <div className="text-lg font-bold text-[#BFE3FF] leading-tight mt-0.5">
                    {score}.0
                  </div>
                  <div className="text-[9px] text-[#3DFFA2] mt-1 font-bold uppercase">
                    TOP 34% TIER // SOLID
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 4. TOPIC PERFORMANCE TELEMETRY MATRIX */}
      <section className="bg-[#161B22] border border-[#8B98A9]/35 p-4 md:p-5 shadow-hard-2 rounded-[2px] reg-mark-card">
        <div className="flex items-center justify-between border-b border-[#8B98A9]/20 pb-2.5 mb-3 font-mono-data">
          <div className="flex items-center gap-2">
            <span className="text-[#3DFFA2] text-xs font-bold">+</span>
            <h2 className="text-xs font-bold text-[#E1E2E9] tracking-widest uppercase">
              TOPIC TELEMETRY MATRIX
            </h2>
          </div>
          <span className="text-[10px] text-[#8B98A9]">ACCURACY_PCT</span>
        </div>

        <div className="space-y-4 font-mono-data">
          {/* 1. SQL Basics - 83% */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-bold text-[#E1E2E9]">SQL Basics</span>
              <span className="font-bold text-[#3DFFA2]">83% [NOMINAL]</span>
            </div>
            <div className="h-3 w-full bg-[#0E1116] border border-[#3E4652] p-0.5 flex gap-1">
              <div className="h-full bg-[#3DFFA2] w-[83%]"></div>
              <div className="h-full bg-[#1F2630] flex-1"></div>
            </div>
          </div>

          {/* 2. Joins - 50% (Amber Weak Area) */}
          <div className="bg-[#FFB547]/10 border border-[#FFB547]/40 p-3 rounded-[2px]">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-bold text-[#FFB547] flex items-center gap-2">
                Joins
                <span className="bg-[#FFB547] text-[#0E1116] text-[9px] px-1.5 py-0.5 font-bold uppercase leading-none inline-block">
                  ⚠ WEAK AREA
                </span>
              </span>
              <span className="font-bold text-[#FFB547]">50% [CAUTION]</span>
            </div>
            <div className="h-3 w-full bg-[#0E1116] border border-[#FFB547]/60 p-0.5 flex gap-1">
              <div className="h-full bg-[#FFB547] w-[50%]"></div>
              <div className="h-full bg-[#1F2630] flex-1"></div>
            </div>
            <p className="text-[11px] text-[#FFB547]/90 mt-2 font-mono-data">
              Latent mismatch identified on OUTER/CROSS mechanics.
            </p>
          </div>

          {/* 3. Aggregation - 67% */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-bold text-[#E1E2E9]">Aggregation</span>
              <span className="font-bold text-[#BFE3FF]">67% [STABLE]</span>
            </div>
            <div className="h-3 w-full bg-[#0E1116] border border-[#3E4652] p-0.5 flex gap-1">
              <div className="h-full bg-[#BFE3FF] w-[67%]"></div>
              <div className="h-full bg-[#1F2630] flex-1"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TIMING TELEMETRY PANEL (CHRONOMETER READOUT) */}
      <section className="bg-[#161B22] border border-[#8B98A9]/35 p-4 md:p-5 shadow-hard-2 rounded-[2px] reg-mark-card">
        <div className="flex items-center justify-between border-b border-[#8B98A9]/20 pb-2 mb-3 font-mono-data">
          <div className="flex items-center gap-1.5">
            <Timer size={15} className="text-[#FFB547]" />
            <span className="text-xs font-bold text-[#E1E2E9] tracking-wider uppercase">
              CHRONOMETER READOUT
            </span>
          </div>
          <span className="text-[10px] text-[#8B98A9]">DELTA: +01:04</span>
        </div>

        <div className="bg-[#0E1116] border border-[#3E4652] p-3.5">
          <p className="font-mono-data text-xs md:text-sm text-[#E1E2E9] leading-relaxed">
            Question 04 took <span className="text-[#FFB547] font-bold">01:42</span> — slower than your median of <span className="text-[#3DFFA2] font-bold">00:38</span>.
          </p>

          {/* Visual Pace Timeline with Delta Tick Indicator */}
          <div className="mt-4 font-mono-data">
            <div className="flex justify-between text-[10px] text-[#8B98A9] mb-1.5">
              <span>00:00 (FAST)</span>
              <span>MEDIAN [00:38]</span>
              <span>02:00 (SLOW)</span>
            </div>

            {/* Scale Line with Markers */}
            <div className="relative h-4 bg-[#191C21] border border-[#3E4652] w-full flex items-center">
              <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-40">
                <span className="text-[8px] text-[#8B98A9]">|</span>
                <span className="text-[8px] text-[#8B98A9]">|</span>
                <span className="text-[8px] text-[#8B98A9]">|</span>
                <span className="text-[8px] text-[#8B98A9]">|</span>
              </div>
              {/* Median Benchmark Marker (~31%) */}
              <div className="absolute left-[31%] top-0 bottom-0 w-1 bg-[#3DFFA2] z-10"></div>
              {/* Q04 Latency Spike Marker (~85%) */}
              <div className="absolute left-[85%] -top-1 -bottom-1 w-2.5 bg-[#FFB547] border border-[#0E1116] z-20"></div>
            </div>

            <div className="flex justify-between text-[10px] text-[#8B98A9] mt-2">
              <span className="text-[#3DFFA2] font-bold">▲ Your Benchmark</span>
              <span className="text-[#FFB547] font-bold">▲ Q04 Latency Spike</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PAPER RECOMMENDATION CARD (#F2EBDD printed directive) */}
      <section className="bg-[#F2EBDD] text-[#12151B] p-5 shadow-paper border border-[#12151B]/40 rounded-[2px] relative font-mono-data">
        <div className="border-b border-[#12151B]/20 pb-2 flex justify-between items-center text-[10px]">
          <span className="tracking-widest font-bold uppercase">
            MISSION DIRECTIVE // ADVISORY NOTE
          </span>
          <span className="text-[#12151B]/70">DISPATCH #88</span>
        </div>

        <div className="mt-3 space-y-3">
          <div className="bg-[#12151B]/5 border-l-2 border-[#12151B] p-2.5">
            <p className="text-sm font-bold leading-snug text-[#12151B]">
              DIRECTIVE: Review SQL joins, then retry a short practice set.
            </p>
          </div>

          {/* Dispatch Interactive Checklist */}
          <div className="space-y-2 pt-1 text-xs text-[#12151B]">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={checklist.audit}
                onChange={(e) => setChecklist({ ...checklist, audit: e.target.checked })}
                className="w-3.5 h-3.5 rounded-none border-[#12151B] text-[#FF5A1F] focus:ring-0 bg-[#F2EBDD]"
              />
              <span className={checklist.audit ? 'line-through opacity-70' : 'font-semibold'}>
                Audit Question 04 Venn mechanics
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={checklist.drill}
                onChange={(e) => setChecklist({ ...checklist, drill: e.target.checked })}
                className="w-3.5 h-3.5 rounded-none border-[#12151B] text-[#FF5A1F] focus:ring-0 bg-[#F2EBDD]"
              />
              <span className={checklist.drill ? 'line-through opacity-70' : 'font-semibold'}>
                Execute 5-question Join Drill (Module J-2)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={checklist.pacing}
                onChange={(e) => setChecklist({ ...checklist, pacing: e.target.checked })}
                className="w-3.5 h-3.5 rounded-none border-[#12151B] text-[#FF5A1F] focus:ring-0 bg-[#F2EBDD]"
              />
              <span className={checklist.pacing ? 'line-through opacity-70' : 'font-semibold'}>
                Re-verify aggregate group pacing
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* 7. ITEMIZED AUDIT LOG */}
      <section className="bg-[#161B22] border border-[#8B98A9]/35 p-4 md:p-5 shadow-hard-2 rounded-[2px] reg-mark-card">
        <div className="flex items-center justify-between border-b border-[#8B98A9]/20 pb-2.5 mb-3 font-mono-data">
          <span className="text-xs font-bold text-[#E1E2E9] tracking-wider uppercase">
            ITEMIZED AUDIT LOG
          </span>
          <button
            type="button"
            onClick={() => setShowAllQuestions(!showAllQuestions)}
            className="text-[10px] text-[#3DFFA2] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{showAllQuestions ? 'SHOW SUMMARY [3]' : 'VIEW ALL [12 ITEMS]'}</span>
            {showAllQuestions ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>

        {/* Primary 3 Highlight Items */}
        {!showAllQuestions ? (
          <div className="space-y-3 font-mono-data">
            {keyAuditItems.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-[2px] ${
                  item.isCorrect
                    ? 'bg-[#0E1116] border border-[#3DFFA2]/40'
                    : 'bg-[#0E1116] border-2 border-[#FFB547] shadow-hard-2'
                }`}
              >
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className={`font-bold ${item.isCorrect ? 'text-[#E1E2E9]' : 'text-[#FFB547]'}`}>
                    {item.id} // {item.code}
                  </span>
                  <span
                    className={`font-bold flex items-center gap-1 text-[11px] ${
                      item.isCorrect ? 'text-[#3DFFA2]' : 'text-[#FF5A1F]'
                    }`}
                  >
                    {item.isCorrect ? <Check size={13} /> : <X size={13} />}
                    {item.status}
                  </span>
                </div>

                <div className="text-xs space-y-0.5 text-[#8B98A9]">
                  <div>
                    SELECTED:{' '}
                    <span className={item.isCorrect ? 'text-[#3DFFA2]' : 'text-[#FF5A1F] font-bold'}>
                      {item.selected}
                    </span>
                  </div>
                  <div>
                    KEY: <span className="text-[#3DFFA2] font-bold">{item.key}</span>
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-[#1F2630] flex justify-between text-[10px] text-[#8B98A9]">
                  <span className={item.latencySpike ? 'text-[#FFB547] font-bold' : ''}>
                    TIME: {item.time}
                  </span>
                  <span>TOPIC: {item.topic}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Full 12 Questions View */
          <div className="space-y-3 font-mono-data">
            {sampleTestQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-[#0E1116] border border-[#8B98A9]/25 p-3 rounded-[2px] space-y-1.5 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-[#E1E2E9]">
                    Q{String(idx + 1).padStart(2, '0')} · {q.text}
                  </div>
                  <span className="text-[10px] text-[#8B98A9] bg-[#161B22] px-2 py-0.5 border border-[#8B98A9]/20">
                    {q.topic}
                  </span>
                </div>
                <div className="text-[#3DFFA2] flex items-center gap-1.5 font-bold pt-1">
                  <Check size={13} />
                  <span>KEY: {q.options[q.correctIndex]}</span>
                </div>
                <div className="text-[11px] text-[#8B98A9] bg-[#161B22] p-2 border-l-2 border-[#BFE3FF]">
                  {q.explanation}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 8. INTERACTIVE FLIGHT-OPS CONSOLE SIMULATION MODES */}
      <section className="bg-[#161B22] border border-[#8B98A9]/35 p-4 shadow-hard-2 rounded-[2px] font-mono-data">
        <div className="flex items-center justify-between border-b border-[#8B98A9]/20 pb-2 mb-3">
          <span className="text-[10px] text-[#8B98A9] uppercase tracking-wider font-bold">
            CONSOLE SIMULATION MODES
          </span>
          <span className="text-[9px] text-[#8B98A9]">[TOGGLE VIEW]</span>
        </div>

        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => setSimulationState('normal')}
            className={`flex-1 py-1.5 text-xs font-bold border transition-all cursor-pointer ${
              simulationState === 'normal'
                ? 'border-[#3DFFA2] bg-[#3DFFA2]/15 text-[#3DFFA2]'
                : 'border-[#3E4652] bg-[#0E1116] text-[#8B98A9] hover:text-white'
            }`}
          >
            NORMAL
          </button>
          <button
            type="button"
            onClick={() => setSimulationState('loading')}
            className={`flex-1 py-1.5 text-xs font-bold border transition-all cursor-pointer ${
              simulationState === 'loading'
                ? 'border-[#BFE3FF] bg-[#BFE3FF]/15 text-[#BFE3FF]'
                : 'border-[#3E4652] bg-[#0E1116] text-[#8B98A9] hover:text-white'
            }`}
          >
            BUSY STATE
          </button>
          <button
            type="button"
            onClick={() => setSimulationState('error')}
            className={`flex-1 py-1.5 text-xs font-bold border transition-all cursor-pointer ${
              simulationState === 'error'
                ? 'border-[#FFB547] bg-[#FFB547]/15 text-[#FFB547]'
                : 'border-[#3E4652] bg-[#0E1116] text-[#8B98A9] hover:text-white'
            }`}
          >
            NET WARN
          </button>
        </div>

        {/* Dynamic State Container */}
        <div>
          {simulationState === 'normal' && (
            <div className="p-3 bg-[#0E1116] border border-[#3E4652] text-xs text-[#3DFFA2] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#3DFFA2] inline-block"></span>
                <span>TELEMETRY STREAM LINKED</span>
              </span>
              <span className="text-[#8B98A9]">LATENCY: 18ms</span>
            </div>
          )}

          {simulationState === 'loading' && (
            <div className="p-3 bg-[#0E1116] border border-[#BFE3FF] space-y-2.5">
              <div className="flex items-center gap-2 text-[#BFE3FF] text-xs">
                <span className="inline-block w-3.5 h-3.5 border-2 border-[#BFE3FF] border-t-transparent rounded-full animate-spin"></span>
                <span>Calculating topic accuracy and batch comparison…</span>
              </div>
              <div className="w-full bg-[#191C21] h-1.5 overflow-hidden">
                <div className="bg-[#BFE3FF] h-full w-1/3 animate-pulse"></div>
              </div>
            </div>
          )}

          {simulationState === 'error' && (
            <div className="p-3 bg-[#0E1116] border-2 border-[#FFB547] text-[#FFB547] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <AlertTriangle size={15} />
                <span>INSTRUMENT CAUTION // PARTIAL SYNC</span>
              </div>
              <p className="text-xs text-[#E1E2E9]">
                Your score loaded, but the batch comparison is unavailable.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 9. MAIN CTA BUTTON (Tactile Signal Orange Action) */}
      <section className="pt-2 pb-6 font-mono-data">
        <button
          type="button"
          onClick={() => navigate('/mission-control')}
          className="w-full py-4 px-4 bg-[#FF5A1F] text-[#0E1116] font-heading font-bold tracking-wider text-sm uppercase border border-[#FF5A1F] shadow-hard-2 hover:bg-white hover:text-[#0E1116] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <span>Return to Mission Control</span>
          <CornerDownLeft size={16} />
        </button>
        <div className="text-center mt-2.5">
          <span className="text-[10px] text-[#8B98A9] tracking-widest uppercase">
            TRANSMISSION CHANNEL ID: TX-APOGEE-FINAL
          </span>
        </div>
      </section>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { currentUserStudent } from '../mocks/apogeeData';
import {
  Send,
  Zap,
  Bot,
  User,
  Timer,
  CheckCircle,
  FileText,
  AlertTriangle,
  RotateCcw,
  Compass,
  ArrowRight,
  Terminal,
  X,
  Sparkles,
} from 'lucide-react';

export default function InterviewRoom() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      speaker: 'interviewer',
      name: 'APOGEE // SYSTEM INTERVIEWER',
      text: 'Tell me about a project where you used Docker. What problem did it solve?',
      timecode: 'T+00:01:14',
      tag: 'INITIAL_PROMPT',
      weight: '1.0',
    },
    {
      id: 2,
      speaker: 'candidate',
      name: 'CANDIDATE // AARAV',
      text: 'I used Docker once.',
      timecode: 'T+00:01:52',
      gapTag: 'DEPTH GAP: 4 WORDS // MISSING OUTCOME',
      confidence: 'LOW',
    },
    {
      id: 3,
      speaker: 'interviewer',
      name: 'APOGEE // ADAPTIVE PROBE',
      text: 'What was the container running, and how did you start it?',
      timecode: 'T+00:02:08',
      isAdaptive: true,
      analysisTrigger: 'SPECIFICITY_DEFICIT',
      reasoning:
        'Detected passive usage statement without architecture details. Probing runtime commands & workload profile.',
    },
  ]);

  const [inputAnswer, setInputAnswer] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(2);
  const [totalQuestions] = useState(5);
  const [elapsedSeconds, setElapsedSeconds] = useState(128);
  const [showAbortModal, setShowAbortModal] = useState(false);
  const [showFinalReport, setShowFinalReport] = useState(false);
  const chatBottomRef = useRef(null);

  // UTC clock simulation
  const [utcTime, setUtcTime] = useState('14:27:08');
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setUtcTime(now.toTimeString().split(' ')[0]);
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendAnswer = (e) => {
    if (e) e.preventDefault();
    if (!inputAnswer.trim() || isTyping) return;

    const currentText = inputAnswer.trim();
    const candidateMsg = {
      id: Date.now(),
      speaker: 'candidate',
      name: 'CANDIDATE // AARAV',
      text: currentText,
      timecode: `T+00:0${Math.floor(elapsedSeconds / 60)}:${String(elapsedSeconds % 60).padStart(2, '0')}`,
      gapTag: currentText.length > 50 ? 'TECHNICAL SPECIFICATION DETECTED' : 'BREVITY DETECTED',
      confidence: currentText.length > 50 ? 'HIGH' : 'MODERATE',
    };

    setMessages((prev) => [...prev, candidateMsg]);
    setInputAnswer('');
    setIsTyping(true);

    // Adaptive reasoning response generator
    setTimeout(() => {
      setIsTyping(false);
      const nextIdx = questionIndex + 1;
      setQuestionIndex(Math.min(nextIdx, totalQuestions));

      let adaptiveReply = '';
      let trigger = '';
      let rationale = '';

      if (nextIdx === 3) {
        adaptiveReply =
          'You described the container runtime. How did you manage persistent state across container redeployments, and what volume mapping did you configure?';
        trigger = 'PERSISTENCE_ISOLATION';
        rationale = 'Evaluating stateful storage practices vs ephemeral container lifecycles.';
      } else if (nextIdx === 4) {
        adaptiveReply =
          'Now let’s look at network contracts: If your frontend container needs to communicate with your backend API, how did you configure the Docker network bridge or docker-compose DNS resolution?';
        trigger = 'NETWORK_TOPOLOGY_CHECK';
        rationale = 'Probing inter-service communication and internal bridge network discovery.';
      } else {
        adaptiveReply =
          'Excellent technical clarification. That completes our targeted containerization drill. Let’s review your telemetry scorecard and composite readiness delta.';
        trigger = 'EVALUATION_CONCLUDED';
        rationale = 'All diagnostic vectors probed. Generating comprehensive readiness scores.';
        setShowFinalReport(true);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          speaker: 'interviewer',
          name: 'APOGEE // ADAPTIVE PROBE',
          text: adaptiveReply,
          timecode: `T+00:0${Math.floor((elapsedSeconds + 10) / 60)}:${String((elapsedSeconds + 10) % 60).padStart(2, '0')}`,
          isAdaptive: true,
          analysisTrigger: trigger,
          reasoning: rationale,
        },
      ]);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendAnswer();
    } else if (e.key === 'Escape') {
      setInputAnswer('');
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-36 font-sans">
      {/* 1. TOP SUB-BAR NAVIGATION & CANDIDATE REGISTRATION */}
      <section className="bg-[#101d2a] border border-[#8B98A9]/25 px-3.5 py-2 rounded-[2px] flex items-center justify-between font-mono-data text-xs hard-shadow">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/mission-control')}
            className="px-2.5 py-1 border border-[#8B98A9]/40 text-[#F2EBDD] font-bold hover:border-[#FF5A1F] hover:text-[#FF5A1F] text-[10px] bg-[#161B22] rounded-[1px] transition-colors cursor-pointer"
          >
            ← ABORT / DASH
          </button>
          <span className="text-[#8B98A9] text-[10px]">
            CANDIDATE: <strong className="text-[#BFE3FF]">AARAV SHARMA (CADET-784)</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-[#FFB547]/15 text-[#FFB547] border border-[#FFB547]/30 rounded-[2px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB547] animate-pulse"></span>
            REC ACTIVE
          </span>
          <button
            type="button"
            onClick={() =>
              document.getElementById('report-drawer')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="text-[10px] text-[#BFE3FF] underline hover:text-[#FF5A1F] cursor-pointer"
          >
            SCORECARD ↓
          </button>
        </div>
      </section>

      {/* 2. HEADER TITLE CARD & APOGEE SETUP SUMMARY */}
      <section className="bg-[#161B22] p-4 md:p-5 border border-[#8B98A9]/30 rounded-[2px] hard-shadow crosshair-corner reg-mark-card">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 font-mono-data">
              <span className="text-[9px] uppercase bg-[#8B98A9]/20 text-[#BFE3FF] px-2 py-0.5 border border-[#8B98A9]/30 font-bold tracking-wider rounded-[1px]">
                SEC-04
              </span>
              <span className="text-[10px] text-[#3DFFA2] tracking-widest uppercase phosphor-glow">
                // FLIGHT-READY
              </span>
            </div>
            <h1 className="font-heading text-xl md:text-2xl font-bold text-[#F2EBDD] tracking-tight mt-1.5 uppercase flex items-center gap-2">
              Interview Room
            </h1>
            <p className="text-xs font-mono-data text-[#8B98A9] mt-0.5">
              Technical round // adaptive follow-ups enabled
            </p>
          </div>

          {/* Registration Mark Symbol */}
          <div className="w-8 h-8 flex items-center justify-center border border-[#8B98A9]/30 bg-[#0E1116] text-[#8B98A9] font-mono-data text-xs select-none">
            ⊕
          </div>
        </div>

        {/* SETUP SUMMARY STRIP */}
        <div className="mt-4 pt-3 border-t border-dashed border-[#8B98A9]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 font-mono-data text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#8B98A9] uppercase text-[10px] tracking-wider">SELECTED ROUND:</span>
            <span className="bg-[#FF5A1F] text-[#0E1116] px-2.5 py-0.5 font-bold tracking-wider uppercase rounded-[2px] text-[11px]">
              TECHNICAL
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
            <span className="text-[#8B98A9] uppercase tracking-wider text-[9px]">FOCUS KEYWORDS:</span>
            <span className="bg-[#1C222C] text-[#BFE3FF] px-2 py-0.5 border border-[#8B98A9]/30 rounded-[2px] font-medium">
              Docker
            </span>
            <span className="bg-[#1C222C] text-[#BFE3FF] px-2 py-0.5 border border-[#8B98A9]/30 rounded-[2px] font-medium">
              REST API
            </span>
            <span className="bg-[#1C222C] text-[#BFE3FF] px-2 py-0.5 border border-[#8B98A9]/30 rounded-[2px] font-medium">
              SQL JOINS
            </span>
            <span className="bg-[#1C222C] text-[#BFE3FF] px-2 py-0.5 border border-[#8B98A9]/30 rounded-[2px] font-medium">
              REDIS CACHE
            </span>
          </div>
        </div>
      </section>

      {/* 3. SESSION TELEMETRY STRIP (HUD METRICS) */}
      <section className="bg-[#161B22] border border-[#8B98A9]/30 p-3.5 rounded-[2px] font-mono-data text-xs hard-shadow">
        <div className="flex items-center justify-between pb-2 border-b border-[#8B98A9]/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#FFB547] rounded-full animate-ping"></span>
            <span className="font-bold text-[#F2EBDD] tracking-widest text-xs uppercase">
              SESSION TELEMETRY
            </span>
          </div>
          <span className="text-[#8B98A9] text-[10px] uppercase tracking-wider">METRICS HUD</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2.5">
          <div className="bg-[#0E1116] p-2.5 border border-[#8B98A9]/20 rounded-[2px]">
            <span className="text-[9px] text-[#8B98A9] uppercase block tracking-wider">ROUND</span>
            <span className="text-[#F2EBDD] font-bold text-xs">TECHNICAL // ADAPT</span>
          </div>
          <div className="bg-[#0E1116] p-2.5 border border-[#8B98A9]/20 rounded-[2px]">
            <span className="text-[9px] text-[#8B98A9] uppercase block tracking-wider">QUESTION INDEX</span>
            <span className="text-[#3DFFA2] font-bold text-xs phosphor-glow">
              0{questionIndex} / 0{totalQuestions}
            </span>
          </div>
          <div className="bg-[#0E1116] p-2.5 border border-[#8B98A9]/20 rounded-[2px]">
            <span className="text-[9px] text-[#8B98A9] uppercase block tracking-wider">CURRENT FOCUS</span>
            <span className="text-[#BFE3FF] font-bold text-xs">DOCKER // CONTAINERS</span>
          </div>
          <div className="bg-[#0E1116] p-2.5 border border-[#8B98A9]/20 rounded-[2px]">
            <span className="text-[9px] text-[#8B98A9] uppercase block tracking-wider">ENGINE STATUS</span>
            <span className="text-[#FFB547] font-bold text-[10px] amber-glow">
              {isTyping ? 'EVALUATING SYNTAX' : 'WAITING FOR RESPONSE'}
            </span>
          </div>
        </div>

        {/* Orbit Timeline Progress Graphic */}
        <div className="mt-3 pt-2.5 border-t border-[#8B98A9]/15 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((step) => {
              const isDone = step < questionIndex;
              const isCurrent = step === questionIndex;
              return (
                <React.Fragment key={step}>
                  <span
                    className={`w-3.5 h-3.5 font-bold text-[9px] flex items-center justify-center rounded-none font-mono-data ${
                      isCurrent
                        ? 'bg-[#FF5A1F] text-[#0E1116] shadow-hard-signal'
                        : isDone
                        ? 'bg-[#3DFFA2] text-[#0E1116]'
                        : 'border border-[#8B98A9]/40 text-[#8B98A9]'
                    }`}
                  >
                    {step}
                  </span>
                  {step < 5 && (
                    <span
                      className={`h-[1px] w-6 md:w-10 ${
                        isDone ? 'bg-[#3DFFA2]' : isCurrent ? 'bg-[#FF5A1F]' : 'bg-[#8B98A9]/30'
                      }`}
                    ></span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <span className="text-[10px] text-[#8B98A9] font-mono-data uppercase">
            TARGET: {Math.round((questionIndex / totalQuestions) * 100)}% DEPTH
          </span>
        </div>
      </section>

      {/* 4. MAIN CHAT FEED */}
      <section className="space-y-3.5 pt-1">
        {/* Diagnostic Badges */}
        <div className="flex items-center justify-between gap-2 px-1 font-mono-data text-[10px]">
          <span className="text-[#8B98A9] uppercase tracking-widest flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 bg-[#3DFFA2]"></span> LOG STREAM // CH-1
          </span>
          <span className="bg-[#161B22] text-[#8B98A9] border border-[#8B98A9]/30 px-2.5 py-0.5 uppercase tracking-wider rounded-[2px]">
            BASIC MODE — using practice bank
          </span>
        </div>

        {/* Messages List */}
        {messages.map((msg) => {
          if (msg.speaker === 'candidate') {
            return (
              <article
                key={msg.id}
                className="bg-[#161B22] border border-[#8B98A9]/30 rounded-[2px] p-4 ml-6 md:ml-12 hard-shadow"
              >
                <div className="flex items-center justify-between border-b border-[#8B98A9]/20 pb-1.5 mb-2 font-mono-data text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-[#BFE3FF] inline-block"></span>
                    <span className="font-bold text-[#BFE3FF] uppercase tracking-wider">
                      {msg.name}
                    </span>
                  </div>
                  <span className="text-[#8B98A9] text-[9px]">{msg.timecode}</span>
                </div>
                <p className="font-mono-data text-sm text-[#F2EBDD] leading-relaxed bg-[#0E1116]/80 p-3 border border-[#8B98A9]/20 rounded-[2px]">
                  &ldquo;{msg.text}&rdquo;
                </p>
                {/* Evaluation Micro-Tag */}
                <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono-data">
                  <span className="text-[#FFB547] flex items-center gap-1.5">
                    <AlertTriangle size={13} />
                    {msg.gapTag}
                  </span>
                  <span className="text-[#8B98A9]">CONFIDENCE: {msg.confidence}</span>
                </div>
              </article>
            );
          }

          if (msg.isAdaptive) {
            return (
              <article
                key={msg.id}
                className="bg-[#1C222C] border-2 border-[#FF5A1F] rounded-[2px] p-4 hard-shadow relative overflow-hidden"
                style={{ borderLeftWidth: '6px', borderLeftColor: '#FF5A1F' }}
              >
                {/* Large Background Watermark Stamp */}
                <div className="absolute -right-3 -top-2 rotate-6 opacity-15 pointer-events-none select-none font-mono-data text-3xl font-black text-[#FF5A1F] uppercase tracking-widest">
                  ADAPTIVE
                </div>

                <div className="flex items-center justify-between border-b border-[#8B98A9]/25 pb-1.5 mb-2 font-mono-data text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-[#FF5A1F] inline-block animate-pulse"></span>
                    <span className="font-bold text-[#FF5A1F] uppercase tracking-wider">
                      {msg.name}
                    </span>
                  </div>
                  <span className="text-[#FF5A1F] font-bold text-[9px]">{msg.timecode}</span>
                </div>

                {/* Follow-up notice micro-label */}
                <div className="mb-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#FF5A1F]/15 border border-[#FF5A1F]/40 text-[#FF5A1F] font-mono-data text-[10px] font-bold tracking-wider uppercase rounded-[2px]">
                  <Zap size={11} className="fill-[#FF5A1F]" />
                  <span>FOLLOW-UP GENERATED FROM YOUR ANSWER</span>
                </div>

                <p className="font-heading text-base md:text-lg font-bold text-[#F2EBDD] leading-snug">
                  &ldquo;{msg.text}&rdquo;
                </p>

                {/* Reasoning Trace */}
                <div className="mt-3 pt-2.5 border-t border-dashed border-[#8B98A9]/25 text-[10px] font-mono-data text-[#8B98A9] flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8B98A9] uppercase">ANALYSIS TRIGGER:</span>
                    <span className="text-[#BFE3FF] font-bold">{msg.analysisTrigger}</span>
                  </div>
                  <div className="text-[10px] text-[#8B98A9] italic">{msg.reasoning}</div>
                </div>
              </article>
            );
          }

          // Initial Interviewer Question
          return (
            <article
              key={msg.id}
              className="bg-[#1C222C] border border-[#8B98A9]/30 rounded-[2px] p-4 hard-shadow crosshair-corner"
            >
              <div className="flex items-center justify-between border-b border-[#8B98A9]/20 pb-1.5 mb-2 font-mono-data text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-[#8B98A9]/50 inline-block"></span>
                  <span className="font-bold text-[#8B98A9] uppercase tracking-wider">
                    {msg.name}
                  </span>
                </div>
                <span className="text-[#8B98A9] text-[9px]">{msg.timecode}</span>
              </div>
              <p className="font-heading text-base text-[#F2EBDD] leading-relaxed">
                {msg.text}
              </p>
              <div className="mt-2.5 pt-1.5 flex items-center justify-between border-t border-[#8B98A9]/15 text-[10px] font-mono-data text-[#8B98A9]">
                <span>TAG: <span className="text-[#BFE3FF]">{msg.tag}</span></span>
                <span>WEIGHT: {msg.weight}</span>
              </div>
            </article>
          );
        })}

        {/* Visible Typing & Engine State Indicator */}
        {isTyping && (
          <div className="bg-[#0E1116] border border-dashed border-[#8B98A9]/35 p-3 rounded-[2px] flex items-center gap-3 font-mono-data text-xs text-[#FFB547] animate-pulse">
            <div className="flex space-x-1.5">
              <div className="w-1.5 h-1.5 bg-[#FFB547] rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-[#FFB547] rounded-full animate-bounce delay-100"></div>
              <div className="w-1.5 h-1.5 bg-[#FFB547] rounded-full animate-bounce delay-200"></div>
            </div>
            <span>Reviewing your answer for a useful follow-up…</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </section>

      {/* 5. TELEMETRY SCORECARD PREVIEW (#report-drawer) */}
      <section id="report-drawer" className="mt-8 pt-5 border-t-2 border-[#8B98A9]/30 space-y-3.5">
        <div className="flex items-center justify-between font-mono-data">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border border-[#BFE3FF] flex items-center justify-center text-[10px] text-[#BFE3FF] font-bold">
              #
            </span>
            <h2 className="font-heading text-sm font-bold tracking-tight text-[#F2EBDD] uppercase">
              Telemetry Scorecard Preview
            </h2>
          </div>
          <span className="text-[10px] bg-[#161B22] px-2.5 py-0.5 border border-[#8B98A9]/30 text-[#3DFFA2] uppercase phosphor-glow font-bold">
            INTERIM EVAL
          </span>
        </div>

        {/* Printed Mission Paper Dossier Card */}
        <div className="bg-[#F2EBDD] text-[#0E1116] p-5 rounded-[2px] shadow-paper border border-[#0E1116] relative overflow-hidden font-sans">
          <div className="flex justify-between items-start border-b border-[#0E1116]/20 pb-2.5 font-mono-data">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[#0E1116]/70">
                MISSION EVALUATION RUN // FLT-942
              </div>
              <div className="font-heading font-bold text-base md:text-lg tracking-tight text-[#0E1116] uppercase">
                Technical Readiness Report
              </div>
            </div>
            <div className="border-2 border-[#FF5A1F] text-[#FF5A1F] text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider transform -rotate-[4deg]">
              PROVISIONAL
            </div>
          </div>

          {/* Metric Gauges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 my-4 font-mono-data text-xs">
            {/* Communication */}
            <div className="border border-[#0E1116]/25 bg-white/40 p-2.5">
              <div className="flex justify-between text-[11px] font-bold">
                <span>COMMUNICATION</span>
                <span className="text-[#0E1116]">6/10</span>
              </div>
              <div className="w-full bg-[#0E1116]/10 h-1.5 mt-1.5">
                <div className="bg-[#0E1116] h-1.5" style={{ width: '60%' }}></div>
              </div>
            </div>

            {/* Technical Depth */}
            <div className="border border-[#0E1116]/25 bg-white/40 p-2.5">
              <div className="flex justify-between text-[11px] font-bold">
                <span>TECH DEPTH</span>
                <span className="text-[#FF5A1F] font-bold">4/10</span>
              </div>
              <div className="w-full bg-[#0E1116]/10 h-1.5 mt-1.5">
                <div className="bg-[#FF5A1F] h-1.5" style={{ width: '40%' }}></div>
              </div>
            </div>

            {/* Problem Solving */}
            <div className="border border-[#0E1116]/25 bg-white/40 p-2.5">
              <div className="flex justify-between text-[11px] font-bold">
                <span>PROBLEM SOLVING</span>
                <span className="text-[#0E1116]">5/10</span>
              </div>
              <div className="w-full bg-[#0E1116]/10 h-1.5 mt-1.5">
                <div className="bg-[#0E1116] h-1.5" style={{ width: '50%' }}></div>
              </div>
            </div>

            {/* Structure of Answers */}
            <div className="border border-[#0E1116]/25 bg-white/40 p-2.5">
              <div className="flex justify-between text-[11px] font-bold">
                <span>STRUCTURE</span>
                <span className="text-[#0E1116]">5/10</span>
              </div>
              <div className="w-full bg-[#0E1116]/10 h-1.5 mt-1.5">
                <div className="bg-[#0E1116] h-1.5" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses Breakdown */}
          <div className="space-y-3 border-t border-[#0E1116]/20 pt-3 font-mono-data text-xs">
            <div>
              <div className="font-bold text-[11px] uppercase text-[#0E1116] flex items-center gap-1.5">
                <span className="text-[#3DFFA2] bg-[#0E1116] px-1.5 py-0.2 text-[9px] font-bold">OK</span>
                DEMONSTRATED STRENGTHS:
              </div>
              <ul className="list-disc list-inside text-xs text-[#0E1116]/80 mt-1 space-y-0.5">
                <li>&ldquo;You stayed on the question&rdquo;</li>
                <li>&ldquo;You identified a relevant tool&rdquo;</li>
              </ul>
            </div>

            <div className="mt-2.5">
              <div className="font-bold text-[11px] uppercase text-[#FF5A1F] flex items-center gap-1.5">
                <span className="text-white bg-[#FF5A1F] px-1.5 py-0.2 text-[9px] font-bold">WARN</span>
                CRITICAL VULNERABILITIES:
              </div>
              <ul className="list-disc list-inside text-xs text-[#0E1116]/80 mt-1 space-y-0.5">
                <li>&ldquo;Explain what the container ran&rdquo;</li>
                <li>&ldquo;Describe the outcome with a concrete example&rdquo;</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-dashed border-[#0E1116]/30 text-right font-mono-data text-[10px] text-[#0E1116]/70">
            RECALCULATES REAL-TIME AFTER EACH ANSWER TRANSMISSION
          </div>
        </div>
      </section>

      {/* 6. FIXED / DOCKED ANSWER CONSOLE */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-[#161B22] border-t-2 border-[#8B98A9]/35 shadow-[0_-8px_20px_rgba(0,0,0,0.7)]">
        <div className="max-w-4xl mx-auto p-3 space-y-2">
          {/* Top Meta Status Line */}
          <div className="flex items-center justify-between font-mono-data text-[10px] text-[#8B98A9] px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#FF5A1F] rounded-full animate-pulse"></span>
              INPUT PROTOCOL // ACTIVE CHAT
            </span>
            <span>ESC: CLEAR • ↵ ENTER: SEND</span>
          </div>

          {/* Textarea container */}
          <div className="relative">
            <textarea
              rows="2"
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value.slice(0, 500))}
              onKeyDown={handleKeyDown}
              placeholder="Write your answer… (e.g. It was running a Node.js API with a Postgres sidecar, started using docker-compose up -d)"
              className="w-full bg-[#0E1116] border border-[#8B98A9]/40 text-[#F2EBDD] font-mono-data text-xs p-3 rounded-[2px] focus:outline-none focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] placeholder-[#8B98A9]/50 resize-none"
            />
            <span className="absolute bottom-2.5 right-2.5 text-[9px] font-mono-data text-[#8B98A9]/70 select-none">
              {inputAnswer.length} / 500 CHARS
            </span>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-3 font-mono-data">
            {/* Secondary: End Interview (Triggers confirmation modal) */}
            <button
              type="button"
              onClick={() => setShowAbortModal(true)}
              className="flex-1 py-2.5 px-3 bg-[#0E1116] border border-[#8B98A9]/40 text-[#8B98A9] text-xs font-bold uppercase tracking-wider hover:text-[#F2EBDD] hover:border-[#8B98A9] active:translate-y-0.5 transition-all text-center rounded-[2px] hard-shadow cursor-pointer"
            >
              End interview
            </button>

            {/* Primary: Send Answer */}
            <button
              type="button"
              onClick={handleSendAnswer}
              disabled={!inputAnswer.trim() || isTyping}
              className={`flex-[2] py-2.5 px-4 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 rounded-[2px] hard-shadow transition-all cursor-pointer ${
                inputAnswer.trim() && !isTyping
                  ? 'bg-[#FF5A1F] text-[#0E1116] hover:brightness-110 active:translate-y-0.5'
                  : 'bg-[#FF5A1F]/40 text-[#0E1116]/60 cursor-not-allowed'
              }`}
            >
              <span>Send answer</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </footer>

      {/* 7. ABORT CONFIRMATION MODAL */}
      {showAbortModal && (
        <div className="fixed inset-0 z-50 bg-[#0E1116]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161B22] border-2 border-[#FF5A1F] max-w-sm w-full p-5 rounded-[2px] hard-shadow font-mono-data space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#8B98A9]/20 pb-2">
              <span className="text-[#FF5A1F] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle size={15} />
                ABORT INTERVIEW?
              </span>
              <button
                type="button"
                onClick={() => setShowAbortModal(false)}
                className="text-[#8B98A9] hover:text-[#F2EBDD] font-bold text-sm cursor-pointer"
              >
                &times;
              </button>
            </div>
            <p className="font-mono-data text-xs text-[#F2EBDD] leading-relaxed">
              Terminating will compute partial scores up to Question 0{questionIndex}. Your current follow-up answer will not be scored.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAbortModal(false)}
                className="flex-1 py-2 bg-[#0E1116] border border-[#8B98A9]/30 text-[#8B98A9] text-xs uppercase hover:text-[#F2EBDD] cursor-pointer"
              >
                Resume
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAbortModal(false);
                  navigate('/mission-control');
                }}
                className="flex-1 py-2 bg-[#FF5A1F] text-[#0E1116] font-bold text-xs uppercase hover:brightness-110 cursor-pointer"
              >
                Confirm Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

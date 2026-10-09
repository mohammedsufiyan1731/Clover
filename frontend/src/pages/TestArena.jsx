import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import StatusStamp from '../components/StatusStamp';
import { sampleTestQuestions } from '../mocks/apogeeData';
import {
  Timer,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Send,
  AlertTriangle,
  Radio,
  Grid,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export default function TestArena() {
  const navigate = useNavigate();
  const questions = sampleTestQuestions;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({ 0: 2 }); // Initial sample state: Q1 Option C selected
  const [timeLeft, setTimeLeft] = useState(18 * 60 + 42); // 18:42 countdown as specified in Stitch & design doc
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(1); // 1 previous detected as per Stitch prompt & copy
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);

  // Tab focus / switch detection (Focus Guard)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((prev) => prev + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSelectOption = (optIdx) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIdx]: optIdx,
    }));
  };

  const answeredIndices = Object.keys(answers).map(Number);
  const answeredCount = answeredIndices.length;
  const unansweredCount = questions.length - answeredCount;
  const unansweredIndices = questions
    .map((_, i) => i)
    .filter((i) => answers[i] === undefined);

  const handleSubmitTest = () => {
    setShowSubmitModal(false);
    
    // Calculate raw score based on correctIndex in sampleTestQuestions
    let correctCount = 0;
    const topicStats = {};

    questions.forEach((q, idx) => {
      const isCorrect = answers[idx] === q.correctIndex;
      if (isCorrect) correctCount++;

      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { total: 0, correct: 0 };
      }
      topicStats[q.topic].total += 1;
      if (isCorrect) topicStats[q.topic].correct += 1;
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);

    navigate('/debrief', {
      state: {
        score: calculatedScore,
        accuracyRatio: `${correctCount} / ${questions.length}`,
        answers,
        tabSwitches,
        timeRemaining: formatTime(timeLeft),
      },
    });
  };

  const currentQ = questions[currentIdx] || questions[0];
  const orbitProgress = (answeredCount / questions.length) * 100;
  // Calculate orbit satellite x coordinate from 40 to 460 based on progress
  const orbitSvgX = 40 + (orbitProgress / 100) * 420;
  const orbitSvgY = 48 - Math.sin((orbitProgress / 100) * Math.PI) * 30;

  return (
    <div className="space-y-6">
      {/* 1. FLIGHT STATUS RIBBON */}
      <section className="bg-[#101d2a] border border-[#8B98A9]/25 px-4 py-2 rounded-[2px] flex flex-wrap items-center justify-between text-xs font-mono-data text-[#8B98A9] hard-shadow">
        <div className="flex items-center gap-2">
          <span className="text-[#3DFFA2] font-bold tracking-widest text-[10px]">RACK: 04-ARENA</span>
          <span className="text-[#8B98A9]/40">|</span>
          <span className="text-[#D6E4F6] text-[10px] tracking-wider uppercase">
            TEST ARENA // FLIGHT-DECK EVALUATION
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#3DFFA2] font-bold text-[10px]">
            <span className="w-2 h-2 bg-[#3DFFA2] blink-status inline-block"></span>
            <span className="phosphor-glow">UPLINK NOMINAL</span>
          </div>
          <span className="text-[#8B98A9]/40 hidden sm:inline">|</span>
          <span className="text-[10px] text-[#BFE3FF] hidden sm:inline">CADET CONSOLE #7049</span>
        </div>
      </section>

      {/* 2. TEST SPECIFICATION HEADER CARD */}
      <article className="bg-[#161B22] border border-[#8B98A9]/35 p-5 relative hard-shadow reg-mark-card">
        {/* Corner registration crosshairs */}
        <span className="absolute top-1.5 left-2 text-[10px] font-mono-data text-[#8B98A9]/50 select-none">+</span>
        <span className="absolute top-1.5 right-2 text-[10px] font-mono-data text-[#8B98A9]/50 select-none">+</span>
        <span className="absolute bottom-1.5 left-2 text-[10px] font-mono-data text-[#8B98A9]/50 select-none">+</span>
        <span className="absolute bottom-1.5 right-2 text-[10px] font-mono-data text-[#8B98A9]/50 select-none">+</span>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="font-mono-data text-[10px] text-[#FFB547] font-bold tracking-widest uppercase mb-1">
              MODULE SPECIFICATION // SECTOR 02 // APG-TEST-402
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#D6E4F6] tracking-tight">
              SQL Fundamentals Check
            </h1>
            <div className="flex flex-wrap gap-2 mt-3 font-mono-data text-xs">
              <span className="bg-[#1E2B39] text-[#D6E4F6] px-2.5 py-0.5 border border-[#8B98A9]/30">
                TOPIC: <strong className="text-white">SQL</strong>
              </span>
              <span className="bg-[#1E2B39] text-[#D6E4F6] px-2.5 py-0.5 border border-[#8B98A9]/30">
                DURATION: <strong className="text-white">20 MINUTES</strong>
              </span>
              <span className="bg-[#1E2B39] text-[#D6E4F6] px-2.5 py-0.5 border border-[#8B98A9]/30">
                LOAD: <strong className="text-white">{questions.length} QUESTIONS</strong>
              </span>
            </div>
          </div>

          {/* Angled Stamped Badge */}
          <div className="self-start md:self-center">
            <div className="transform -rotate-2 border-2 border-[#3DFFA2] px-3 py-1.5 text-[#3DFFA2] font-mono-data text-xs font-bold tracking-widest bg-[#0E1116] hard-shadow phosphor-glow">
              [ IN PROGRESS // ORBIT-1 ]
            </div>
          </div>
        </div>
      </article>

      {/* 3. COCKPIT INSTRUMENT GAUGE: COUNTDOWN & TELEMETRY ARRAY */}
      <section className="bg-[#030F1C] border border-[#8B98A9]/35 p-3.5 relative hard-shadow">
        {/* Top Instrument Status Line */}
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#8B98A9]/20 font-mono-data">
          <div className="flex items-center gap-2">
            <Timer size={14} className="text-[#3DFFA2]" />
            <span className="text-xs font-bold text-[#D6E4F6] tracking-wider uppercase">
              LAUNCH-COUNTDOWN INSTRUMENT
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-[#8B98A9]">
            <span>
              SYNC: <strong className="text-[#3DFFA2]">OK</strong>
            </span>
            <span>
              SIGNAL: <strong className="text-[#3DFFA2]">NOMINAL</strong>
            </span>
          </div>
        </div>

        {/* Master Clock + 12-Segment LED Progress Array */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Master Clock Box */}
          <div className="md:col-span-5 bg-[#101D2A] border border-[#8B98A9]/30 p-3 flex items-center justify-between font-mono-data">
            <div>
              <div className="text-[10px] text-[#8B98A9] tracking-wider uppercase font-semibold">
                TIME REMAINING // T-MINUS
              </div>
              <div className="text-3xl md:text-4xl font-bold text-[#3DFFA2] tracking-widest phosphor-glow leading-none mt-1">
                {formatTime(timeLeft)}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#FFB547] block uppercase font-bold">PACING REC:</span>
              <span className="text-xs font-bold text-[#D6E4F6]">
                {timeLeft > 300 ? 'NOMINAL' : 'ACCELERATE'}
              </span>
            </div>
          </div>

          {/* 12-Segment Analog Notched Array */}
          <div className="md:col-span-7 bg-[#101D2A] border border-[#8B98A9]/30 p-3 font-mono-data">
            <div className="flex justify-between items-center text-[10px] mb-1.5">
              <span className="text-[#D6E4F6] uppercase font-semibold">QUESTION LOAD // TELEMETRY ARRAY</span>
              <span className="text-[#3DFFA2] font-bold">
                {String(currentIdx + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}{' '}
                (NOMINAL)
              </span>
            </div>

            {/* 12-segment grid */}
            <div className="grid grid-cols-12 gap-1 h-3.5 bg-[#030F1C] p-0.5 border border-[#8B98A9]/40">
              {questions.map((_, idx) => {
                const isCurrent = idx === currentIdx;
                const isAnswered = answers[idx] !== undefined;

                if (isCurrent) {
                  return (
                    <div
                      key={idx}
                      className="bg-[#FF5A1F] blink-status h-full border border-white/50 cursor-pointer"
                      title={`Q${idx + 1}: Current Active`}
                      onClick={() => setCurrentIdx(idx)}
                    />
                  );
                }
                if (isAnswered) {
                  return (
                    <div
                      key={idx}
                      className="bg-[#3DFFA2] h-full cursor-pointer hover:brightness-125"
                      title={`Q${idx + 1}: Answered`}
                      onClick={() => setCurrentIdx(idx)}
                    />
                  );
                }
                return (
                  <div
                    key={idx}
                    className="bg-[#FFB547]/20 border border-[#FFB547]/50 h-full cursor-pointer hover:bg-[#FFB547]/40"
                    title={`Q${idx + 1}: Unanswered`}
                    onClick={() => setCurrentIdx(idx)}
                  />
                );
              })}
            </div>

            <div className="flex justify-between text-[9px] text-[#8B98A9] mt-1">
              <span>TICK: 01</span>
              <span>TICK: 06</span>
              <span>TICK: {String(questions.length).padStart(2, '0')} (TARGET)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOCUS GUARD SECURITY BANNER & REAL-TIME UPLINK NOTICE */}
      <section className="border border-[#FFB547] bg-[#3E2600]/25 p-3 space-y-2 rounded-[2px]">
        <div className="flex items-start gap-2.5">
          <AlertTriangle size={18} className="text-[#FFB547] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-mono-data text-xs text-[#FFB547] font-bold tracking-wider uppercase flex items-center gap-2">
              <span>FOCUS GUARD: INTERRUPT DETECTOR ONLINE</span>
              {tabSwitches > 0 && (
                <span className="bg-[#FFB547] text-[#0E1116] px-1.5 py-0.2 rounded-[1px] text-[10px] font-bold">
                  {tabSwitches} INCIDENT(S)
                </span>
              )}
            </div>
            <p className="text-xs text-[#D6E4F6] leading-relaxed">
              {tabSwitches > 0
                ? `Tab switch detected (${tabSwitches} time(s)). Stay on this test console to avoid recording more telemetry interruptions in your debrief report.`
                : 'Console lock engaged. Stay on this tab to avoid recording unauthorized telemetry interruptions.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1.5 border-t border-[#8B98A9]/20 text-[10px] font-mono-data text-[#3DFFA2]">
          <span className="w-1.5 h-1.5 bg-[#3DFFA2] blink-status inline-block"></span>
          <span>Real-time uplink active: Telemetry answers are secured automatically at keystroke.</span>
        </div>
      </section>

      {/* 5. MAIN WORKSPACE: WARM PAPER DOSSIER + QUESTION PALETTE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Warm Printed Paper Mission Card */}
        <div className="lg:col-span-8 space-y-4">
          <article className="bg-[#F2EBDD] text-[#0E1116] p-5 md:p-6 paper-stack-shadow border border-[#8B98A9] relative rounded-[2px]">
            {/* Binder hole punch & dossier top strip */}
            <div className="flex items-center justify-between border-b-2 border-[#0E1116] pb-2.5 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full border border-[#0E1116] bg-[#0E1116]/10 shrink-0"></div>
                <span className="font-mono-data text-xs font-bold text-[#0E1116] uppercase tracking-wider">
                  APOGEE FLIGHT DOSSIER // SHEET {String(currentIdx + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="font-mono-data text-[10px] font-bold text-[#0E1116] tracking-widest">
                SYS.CODE: {currentQ.sysCode || '88-SQL-AGG'}
              </div>
            </div>

            {/* Corner registration crosshairs inside paper */}
            <span className="absolute top-2 left-2 text-[10px] font-mono-data text-[#0E1116] font-bold opacity-30 select-none">+</span>
            <span className="absolute top-2 right-2 text-[10px] font-mono-data text-[#0E1116] font-bold opacity-30 select-none">+</span>
            <span className="absolute bottom-2 left-2 text-[10px] font-mono-data text-[#0E1116] font-bold opacity-30 select-none">+</span>
            <span className="absolute bottom-2 right-2 text-[10px] font-mono-data text-[#0E1116] font-bold opacity-30 select-none">+</span>

            {/* Question Header & Prompt */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono-data text-xs font-bold text-[#FF5A1F] tracking-wider uppercase">
                  ITEM REF: {currentQ.refCode || `Q-${String(currentIdx + 1).padStart(2, '0')}`}
                </span>
                <span className="font-mono-data text-[10px] bg-[#0E1116] text-[#F2EBDD] px-2 py-0.5 font-bold uppercase">
                  PTS: {currentQ.points ? currentQ.points.toFixed(1) : '1.0'}
                </span>
              </div>

              <h2 className="font-heading text-lg md:text-xl font-bold text-[#0E1116] leading-snug tracking-tight">
                {currentQ.text}
              </h2>

              {currentQ.promptDescription && (
                <p className="text-xs text-[#0E1116]/80 mt-1.5 leading-relaxed font-sans">
                  {currentQ.promptDescription}
                </p>
              )}
            </div>

            {/* 4 Rectangular Answer Options */}
            <fieldset className="space-y-2.5">
              <legend className="sr-only">Answer options for current question</legend>
              {currentQ.options.map((optText, optIdx) => {
                const isSelected = answers[currentIdx] === optIdx;
                const letter = String.fromCharCode(65 + optIdx);
                const subLabel =
                  currentQ.optionLabels && currentQ.optionLabels[optIdx]
                    ? currentQ.optionLabels[optIdx]
                    : '';

                // Clean label string if option starts with "A. "
                const displayLabel = optText.startsWith(`${letter}. `)
                  ? optText.slice(3)
                  : optText;

                return (
                  <label
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`flex items-center p-3.5 border-2 cursor-pointer transition-all duration-100 rounded-[2px] ${
                      isSelected
                        ? 'border-[#0E1116] bg-[#0E1116] text-[#F2EBDD] hard-shadow ring-2 ring-[#FF5A1F] translate-x-1'
                        : 'border-[#0E1116]/30 bg-[#F2EBDD] text-[#0E1116] hover:border-[#0E1116] hover:bg-[#EAE2D3]'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question_${currentIdx}`}
                      checked={isSelected}
                      onChange={() => handleSelectOption(optIdx)}
                      className="sr-only"
                    />

                    {/* Option letter badge */}
                    <span
                      className={`font-mono-data text-xs font-bold w-7 h-7 flex items-center justify-center border mr-3 shrink-0 rounded-[1px] ${
                        isSelected
                          ? 'border-[#3DFFA2] bg-[#3DFFA2] text-[#0E1116]'
                          : 'border-[#0E1116] bg-transparent text-[#0E1116]'
                      }`}
                    >
                      {letter}
                    </span>

                    {/* Text & optional sub-label */}
                    <div className="flex flex-col">
                      <span
                        className={`font-mono-data text-xs md:text-sm font-bold ${
                          isSelected ? 'text-[#3DFFA2] phosphor-glow' : 'text-[#0E1116]'
                        }`}
                      >
                        {displayLabel}
                      </span>
                      {subLabel && (
                        <span
                          className={`font-mono-data text-[10px] uppercase tracking-wide mt-0.5 ${
                            isSelected ? 'text-[#F2EBDD]/80' : 'text-[#0E1116]/60'
                          }`}
                        >
                          {subLabel}
                        </span>
                      )}
                    </div>

                    {/* Selected Locked Tag */}
                    {isSelected && (
                      <div className="ml-auto flex items-center gap-1.5 shrink-0 pl-2">
                        <span className="font-mono-data text-[10px] text-[#3DFFA2] font-bold tracking-widest uppercase">
                          [LOCKED]
                        </span>
                        <CheckCircle2 size={16} className="text-[#3DFFA2]" />
                      </div>
                    )}
                  </label>
                );
              })}
            </fieldset>

            {/* Bottom Dossier Barcode & Authority Footer */}
            <div className="mt-6 pt-3 border-t-2 border-[#0E1116] flex flex-wrap items-center justify-between font-mono-data text-[10px] text-[#0E1116] font-bold">
              <div className="tracking-widest">BARCODE: ||||| | |||| || ||| |||||||</div>
              <div className="text-right">AUTHO: FLIGHT-DIRECTOR APOGEE-OPS</div>
            </div>
          </article>

          {/* Navigation Buttons Row */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="secondary"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              icon={<ArrowLeft size={14} />}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {currentIdx < questions.length - 1 ? (
                <Button
                  variant="secondary"
                  onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
                  icon={<ArrowRight size={14} />}
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => setShowSubmitModal(true)}
                  icon={<Send size={14} />}
                >
                  Submit Test
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Question Palette Matrix & Trajectory Plot */}
        <div className="lg:col-span-4 space-y-4">
          {/* Question Palette Matrix */}
          <section className="bg-[#161B22] border border-[#8B98A9]/35 p-4 relative hard-shadow reg-mark-card">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#8B98A9]/20 font-mono-data">
              <div className="flex items-center gap-2">
                <Grid size={15} className="text-[#3DFFA2]" />
                <span className="text-xs font-bold text-[#D6E4F6] uppercase tracking-wider">
                  QUESTION PALETTE [{questions.length} ITEMS]
                </span>
              </div>
              <span className="text-[10px] text-[#8B98A9]">CLICK TO JUMP</span>
            </div>

            {/* Matrix Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2">
              {questions.map((_, idx) => {
                const isCurrent = idx === currentIdx;
                const isAnswered = answers[idx] !== undefined;

                let btnClass = '';
                let dotClass = '';

                if (isCurrent) {
                  btnClass =
                    'border-2 border-[#FF5A1F] bg-[#1E2B39] text-[#FF5A1F] hard-shadow ring-1 ring-[#FF5A1F]';
                  dotClass = 'bg-[#FF5A1F]';
                } else if (isAnswered) {
                  btnClass =
                    'border border-[#3DFFA2]/60 bg-[#161B22] text-[#3DFFA2] hover:border-[#3DFFA2] hover:bg-[#3DFFA2]/10';
                  dotClass = 'bg-[#3DFFA2]';
                } else {
                  btnClass =
                    'border border-[#FFB547]/50 bg-[#0E1116] text-[#FFB547] hover:border-[#FF5A1F] hover:text-white';
                  dotClass = 'bg-[#FFB547]';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-10 rounded-[2px] font-mono-data text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${btnClass}`}
                  >
                    <span>{String(idx + 1).padStart(2, '0')}</span>
                    <span className={`w-1.5 h-1.5 rounded-[1px] mt-0.5 ${dotClass}`}></span>
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="space-y-1.5 mt-4 pt-3 border-t border-[#8B98A9]/20 font-mono-data text-[10px] text-[#8B98A9]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#3DFFA2] rounded-[1px] inline-block"></span>
                  <span>Answer Recorded</span>
                </div>
                <span className="font-bold text-[#3DFFA2]">{answeredCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 border border-[#FFB547] bg-[#0E1116] rounded-[1px] inline-block"></span>
                  <span>Unanswered Pending</span>
                </div>
                <span className="font-bold text-[#FFB547]">{unansweredCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 border border-[#FF5A1F] bg-[#1E2B39] rounded-[1px] inline-block"></span>
                  <span>Current Question</span>
                </div>
                <span className="font-bold text-[#FF5A1F]">Q-{String(currentIdx + 1).padStart(2, '0')}</span>
              </div>
            </div>

            {/* Submit Action in sidebar */}
            <Button
              variant="primary"
              onClick={() => setShowSubmitModal(true)}
              icon={<Send size={14} />}
              className="w-full mt-4"
            >
              Submit Test ({answeredCount}/{questions.length})
            </Button>
          </section>

          {/* Orbital Trajectory Telemetry Schematic Panel (Stitch Screen Feature) */}
          <section className="bg-[#161B22] border border-[#8B98A9]/35 p-3.5 relative hard-shadow">
            <div className="flex justify-between items-center mb-1.5 font-mono-data">
              <span className="text-[10px] text-[#D6E4F6] font-bold uppercase tracking-wider">
                TRAJECTORY PLOT // PERIGEE TO APOGEE
              </span>
              <span className="text-[10px] text-[#3DFFA2] font-bold">ALTITUDE: +412KM</span>
            </div>

            <div className="h-20 border border-[#8B98A9]/40 bg-[#030F1C] relative flex items-center justify-center overflow-hidden rounded-[2px]">
              {/* Center crosshair mark */}
              <span className="text-[#8B98A9]/40 font-mono-data text-xs font-bold select-none absolute">
                +
              </span>

              {/* Vector Orbit Arc */}
              <svg
                className="absolute inset-0 w-full h-full stroke-[#3DFFA2]/50 fill-none"
                preserveAspectRatio="none"
                viewBox="0 0 500 56"
              >
                <path d="M 0,48 Q 250,-10 500,48" strokeDasharray="4,4" strokeWidth="1.5" />
                {/* Dynamic satellite marker representing current progress */}
                <circle
                  cx={orbitSvgX}
                  cy={orbitSvgY}
                  r="5"
                  className="fill-[#FF5A1F] stroke-[#3DFFA2]"
                  strokeWidth="2"
                />
              </svg>

              <span className="absolute top-1 left-2 font-mono-data text-[9px] text-[#8B98A9]">
                PERIGEE: 185KM
              </span>
              <span className="absolute top-1 right-2 font-mono-data text-[9px] text-[#3DFFA2] font-bold">
                APOGEE: 412KM
              </span>
              <span className="absolute bottom-1 left-2 font-mono-data text-[9px] text-[#D6E4F6]/70">
                ORBIT COMPLETE: {Math.round(orbitProgress)}%
              </span>
            </div>
          </section>
        </div>
      </div>

      {/* 6. FLIGHT DISPATCH CONFIRMATION MODAL OVERLAY (High Fidelity Stitch Dialog) */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E1116]/85 backdrop-blur-none">
          <div className="bg-[#1E2B39] border-2 border-[#FFB547] w-full max-w-lg p-6 hard-shadow relative rounded-[2px] animate-in fade-in zoom-in-95 duration-150">
            {/* Crosshair corner ticks */}
            <span className="absolute top-1.5 left-2 font-mono-data text-xs text-[#FFB547] leading-none select-none">+</span>
            <span className="absolute top-1.5 right-2 font-mono-data text-xs text-[#FFB547] leading-none select-none">+</span>
            <span className="absolute bottom-1.5 left-2 font-mono-data text-xs text-[#FFB547] leading-none select-none">+</span>
            <span className="absolute bottom-1.5 right-2 font-mono-data text-xs text-[#FFB547] leading-none select-none">+</span>

            {/* Alert Caution Header Bar */}
            <div className="flex items-center justify-between pb-2.5 mb-4 border-b border-[#8B98A9]/30">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-[#FFB547]" />
                <span className="font-mono-data text-xs font-bold text-[#FFB547] tracking-widest uppercase">
                  FLIGHT DISPATCH CONFIRMATION
                </span>
              </div>
              <span className="font-mono-data text-[10px] bg-[#C68414] text-[#3E2600] px-2 py-0.5 font-bold uppercase rounded-[1px]">
                {unansweredCount > 0 ? 'ATTN REQUIRED' : 'READY TO TRANSMIT'}
              </span>
            </div>

            {/* Warning Message Body */}
            <div className="space-y-4 mb-6">
              {unansweredCount > 0 ? (
                <div className="p-3.5 bg-[#030F1C] border border-[#FFB547]/50 rounded-[2px]">
                  <div className="font-mono-data text-xs text-[#FFB547] font-bold mb-1 uppercase">
                    WARNING: {unansweredCount} QUESTION{unansweredCount > 1 ? 'S' : ''} REMAIN UNANSWERED
                  </div>
                  <p className="text-xs text-[#D6E4F6] font-mono-data">
                    Items{' '}
                    <strong className="text-[#FFB547]">
                      {unansweredIndices.map((i) => `Q-${String(i + 1).padStart(2, '0')}`).join(', ')}
                    </strong>{' '}
                    currently have no telemetry responses logged.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 bg-[#030F1C] border border-[#3DFFA2]/50 rounded-[2px]">
                  <div className="font-mono-data text-xs text-[#3DFFA2] font-bold mb-1 uppercase">
                    ALL 12 RESPONSES RECORDED
                  </div>
                  <p className="text-xs text-[#D6E4F6]">
                    Complete telemetry payload ready for validation by the scoring engine.
                  </p>
                </div>
              )}

              <p className="text-sm text-[#D6E4F6] leading-relaxed">
                Submit test anyway and finalize telemetry score? Once transmitted to Flight Operations, response records cannot be reopened or edited.
              </p>

              <div className="flex items-center justify-between font-mono-data text-xs text-[#8B98A9] pt-3 border-t border-[#8B98A9]/20">
                <span>TIME REMAINING: <strong className="text-white">{formatTime(timeLeft)}</strong></span>
                <span>PROGRESS: <strong className="text-[#3DFFA2]">{Math.round(orbitProgress)}%</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2.5 border border-[#8B98A9]/40 bg-[#161B22] text-[#D6E4F6] font-mono-data text-xs font-bold hover:border-[#3DFFA2] hover:text-[#3DFFA2] transition-colors rounded-[2px] cursor-pointer"
              >
                [ RETURN TO COCKPIT ]
              </button>

              <button
                type="button"
                onClick={handleSubmitTest}
                className="px-4 py-2.5 bg-[#FF5A1F] text-[#0E1116] border border-[#FF5A1F] font-mono-data text-xs font-bold hover:brightness-110 hard-shadow transition-all rounded-[2px] cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send size={13} />
                <span>[ CONFIRM SUBMISSION ]</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

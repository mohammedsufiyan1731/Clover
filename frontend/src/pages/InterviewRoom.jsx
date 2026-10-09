import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import BriefingCard from '../components/BriefingCard';
import PanelCard from '../components/PanelCard';
import StatusStamp from '../components/StatusStamp';
import SegmentedBar from '../components/SegmentedBar';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { mockInterviewRounds, currentUserStudent } from '../mocks/apogeeData';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Timer,
  CheckCircle,
  FileText,
  AlertTriangle,
  RotateCcw,
  Compass,
} from 'lucide-react';

export default function InterviewRoom() {
  const navigate = useNavigate();
  const [selectedRound, setSelectedRound] = useState('technical');
  const [useResumeGaps, setUseResumeGaps] = useState(true);
  const [status, setStatus] = useState('setup'); // setup | active | report
  const [messages, setMessages] = useState([]);
  const [inputAnswer, setInputAnswer] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showEndModal, setShowEndModal] = useState(false);
  const chatBottomRef = useRef(null);

  const focusKeywords = ['Docker', 'REST API', 'SQL joins', 'Redis Caching'];

  useEffect(() => {
    let interval;
    if (status === 'active') {
      interval = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const startInterview = () => {
    setStatus('active');
    setElapsedSeconds(0);
    setQuestionCount(1);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages([
        {
          id: 1,
          speaker: 'APOGEE INTERVIEWER',
          text: 'Welcome Cadet Aarav. We are conducting your Technical Evaluation round. Based on your target profile, tell me about a project where you used Docker or containerized a microservice. What specific engineering challenge did it solve?',
          timestamp: '14:30:02',
          isAdaptive: true,
        },
      ]);
    }, 1200);
  };

  const handleSendAnswer = (e) => {
    e.preventDefault();
    if (!inputAnswer.trim() || isTyping) return;

    const userMsg = {
      id: Date.now(),
      speaker: 'AARAV SHARMA',
      text: inputAnswer.trim(),
      timestamp: new Date().toLocaleTimeString('en-GB'),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputAnswer('');
    setIsTyping(true);

    // Adaptive follow-up simulation
    setTimeout(() => {
      setIsTyping(false);
      const nextQ = questionCount + 1;
      setQuestionCount(nextQ);

      let aiResponseText = '';
      if (nextQ === 2) {
        aiResponseText = `You mentioned containerization in your answer. What was the exact base image you selected, and how did you configure environment variables and volume mounts between your app and PostgreSQL?`;
      } else if (nextQ === 3) {
        aiResponseText = `Now let's examine your REST API contract design. When a client performs an idempotency check on a payment or job creation request, what HTTP headers and database locking mechanisms do you employ?`;
      } else {
        // Complete drill
        aiResponseText = `Good response. That concludes our 3-question targeted drill. Let's compile your comprehensive flight telemetry report.`;
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            speaker: 'APOGEE INTERVIEWER',
            text: aiResponseText,
            timestamp: new Date().toLocaleTimeString('en-GB'),
            isAdaptive: true,
          },
        ]);
        setTimeout(() => {
          setStatus('report');
        }, 1500);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          speaker: 'APOGEE INTERVIEWER',
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString('en-GB'),
          isAdaptive: true,
        },
      ]);
    }, 1400);
  };

  const formatElapsed = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="ADAPTIVE FLIGHT DRILL // WOW MODULE"
        title="INTERVIEW ROOM"
        description="Real-time simulated technical board with adaptive follow-ups rooted in candidate resume telemetry."
        status={
          status === 'active' ? (
            <StatusStamp label="SESSION LIVE" tone="phosphor" rotation="-rotate-1" />
          ) : status === 'report' ? (
            <StatusStamp label="REPORT COMPILED" tone="paper" rotation="rotate-2" />
          ) : (
            <StatusStamp label="READY FOR LAUNCH" tone="amber" />
          )
        }
      />

      {/* 1. SETUP STATE */}
      {status === 'setup' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-5">
            <PanelCard
              eyebrow="DRILL PROTOCOL SELECTION"
              title="Select Interview Round"
              status={<StatusStamp label="CHOOSE 1 OF 3" tone="steel" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {mockInterviewRounds.map((rnd) => {
                  const isSelected = selectedRound === rnd.id;
                  return (
                    <button
                      key={rnd.id}
                      onClick={() => setSelectedRound(rnd.id)}
                      className={`text-left p-4 rounded-[3px] border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0E1116] border-[#FF5A1F] text-white shadow-[0_0_8px_rgba(255,90,31,0.3)] hard-shadow-signal'
                          : 'bg-[#161B22] border-[#8B98A9]/30 text-[#8B98A9] hover:border-[#BFE3FF] hover:text-white'
                      }`}
                    >
                      <div className="font-mono-data text-xs font-bold text-white uppercase">
                        {rnd.name}
                      </div>
                      <div className="font-mono-data text-[10px] text-[#FF5A1F] mt-0.5">
                        {rnd.duration} · {rnd.questionsCount} Questions
                      </div>
                      <p className="text-xs text-[#8B98A9] mt-2 leading-relaxed">
                        {rnd.desc}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Resume Gaps Integration */}
              <div className="mt-5 p-3.5 bg-[#0E1116] border border-[#8B98A9]/30 rounded-[2px] space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-mono-data text-xs text-white">
                  <input
                    type="checkbox"
                    checked={useResumeGaps}
                    onChange={(e) => setUseResumeGaps(e.target.checked)}
                    className="accent-[#FF5A1F]"
                  />
                  <span>Base questions on my resume gaps (from Resume Lab)</span>
                </label>
                <div className="text-[11px] text-[#8B98A9] pl-5">
                  Focus keywords will be dynamically injected into board questioning:
                </div>
                <div className="flex flex-wrap gap-1.5 pl-5 pt-1">
                  {focusKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="bg-[#161B22] border border-[#FF5A1F]/40 text-[#FF5A1F] text-[10px] font-mono-data px-2 py-0.5 rounded-[2px]"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-[#8B98A9]/20 flex justify-end">
                <Button
                  variant="primary"
                  onClick={startInterview}
                  icon={<Sparkles size={14} />}
                  className="px-6 py-3 text-xs"
                >
                  Start Adaptive Interview
                </Button>
              </div>
            </PanelCard>
          </div>

          <div className="lg:col-span-4">
            <BriefingCard
              eyebrow="DRILL SPECIFICATION"
              title="Interview Board Ground Rules"
              docId="BOARD PROTOCOL // 09"
            >
              <ul className="space-y-2 text-xs text-[#0E1116] list-disc list-inside">
                <li>3 to 4 sequential questions calibrated to your chosen round.</li>
                <li>Adaptive AI interviewer parses your exact answer sentences to challenge assumptions.</li>
                <li>Real-time telemetry evaluates 4 core placement dimensions.</li>
                <li>Final debrief highlights strengths, critical gaps and rewrite ideas.</li>
              </ul>
            </BriefingCard>
          </div>
        </div>
      )}

      {/* 2. ACTIVE INTERVIEW CHAT STATE */}
      {status === 'active' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Chat Area */}
          <div className="lg:col-span-8 flex flex-col h-[580px] bg-[#161B22] border border-[#8B98A9]/30 rounded-[3px] hard-shadow relative reg-mark-card">
            
            {/* Chat Header */}
            <div className="p-3 border-b border-[#8B98A9]/20 flex justify-between items-center bg-[#0E1116]/80 text-xs font-mono-data">
              <div className="flex items-center gap-2">
                <Bot size={15} className="text-[#3DFFA2]" />
                <span className="text-white font-bold">APOGEE FLIGHT INTERVIEWER</span>
                <span className="text-[#8B98A9]">//</span>
                <span className="text-[#3DFFA2]">ADAPTIVE ACTIVE</span>
              </div>
              <Button
                variant="destructive"
                onClick={() => setShowEndModal(true)}
                className="py-1 px-2.5 text-[10px]"
              >
                End Session
              </Button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => {
                const isInterviewer = m.speaker.includes('INTERVIEWER');
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isInterviewer ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 font-mono-data text-[10px] text-[#8B98A9]">
                      <span>{m.speaker}</span>
                      <span>·</span>
                      <span>{m.timestamp}</span>
                      {m.isAdaptive && (
                        <span className="text-[#FF5A1F] border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-1 rounded-[1px]">
                          ADAPTIVE
                        </span>
                      )}
                    </div>
                    <div
                      className={`max-w-[85%] p-3.5 rounded-[2px] text-xs font-mono-data leading-relaxed ${
                        isInterviewer
                          ? 'bg-[#0E1116] border border-[#8B98A9]/40 text-[#E2E8F0]'
                          : 'bg-[#FF5A1F]/15 border border-[#FF5A1F]/60 text-white hard-shadow-signal'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex flex-col items-start space-y-1">
                  <div className="font-mono-data text-[10px] text-[#8B98A9]">
                    APOGEE INTERVIEWER · TYPING
                  </div>
                  <div className="bg-[#0E1116] border border-[#8B98A9]/40 p-3 rounded-[2px] flex items-center gap-2 text-xs font-mono-data text-[#8B98A9]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3DFFA2] animate-ping" />
                    <span>Analyzing your answer syntax and synthesizing follow-up...</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Formulation Bar */}
            <form onSubmit={handleSendAnswer} className="p-3 border-t border-[#8B98A9]/20 bg-[#0E1116]/90 flex gap-2">
              <textarea
                value={inputAnswer}
                onChange={(e) => setInputAnswer(e.target.value)}
                placeholder="Type your structured answer here (press Enter or Send)..."
                rows={2}
                className="flex-1 bg-[#161B22] border border-[#8B98A9]/40 rounded-[2px] p-2 text-xs text-white placeholder-[#8B98A9]/50 focus:outline-none focus:border-[#BFE3FF] resize-none font-mono-data"
              />
              <Button
                type="submit"
                variant="primary"
                disabled={!inputAnswer.trim() || isTyping}
                icon={<Send size={14} />}
                className="px-5 text-xs"
              >
                Send
              </Button>
            </form>
          </div>

          {/* Right Session Telemetry Panel */}
          <div className="lg:col-span-4 space-y-4">
            <PanelCard
              eyebrow="SESSION TELEMETRY"
              title="Board Diagnostics"
              status={<StatusStamp label="MONITORING" tone="phosphor" />}
            >
              <div className="space-y-4 text-xs font-mono-data">
                <div className="flex justify-between items-center py-1 border-b border-[#8B98A9]/15">
                  <span className="text-[#8B98A9]">ROUND TYPE:</span>
                  <span className="text-white font-bold uppercase">{selectedRound}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#8B98A9]/15">
                  <span className="text-[#8B98A9]">QUESTION PROGRESS:</span>
                  <span className="text-[#3DFFA2] font-bold">{questionCount} OF 3</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#8B98A9]/15">
                  <span className="text-[#8B98A9]">ELAPSED TIME:</span>
                  <span className="text-[#BFE3FF] font-bold">{formatElapsed(elapsedSeconds)}</span>
                </div>

                <div>
                  <span className="text-[#8B98A9] block mb-1.5">ACTIVE RESUME GAP TARGETS:</span>
                  <div className="flex flex-wrap gap-1">
                    {focusKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="bg-[#0E1116] border border-[#FF5A1F]/30 text-[#FF5A1F] text-[10px] px-2 py-0.5 rounded-[2px]"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 bg-[#0E1116] border border-[#8B98A9]/20 rounded-[2px] text-[11px] text-[#8B98A9]">
                  💡 <strong>Interviewer Tip:</strong> Structure answers using Situation, Task, Action, and Quantitative Result.
                </div>
              </div>
            </PanelCard>
          </div>

        </div>
      )}

      {/* 3. REPORT STATE */}
      {status === 'report' && (
        <div className="space-y-6">
          <BriefingCard
            eyebrow="DOCUMENT ID // APG-REP-804"
            title="Interview Performance Evaluation Report"
            docId="DRILL CANDIDATE // AARAV SHARMA"
            stamp={<StatusStamp label="SCORED" tone="paper" />}
            footer="EVALUATOR // AUTONOMOUS INTERVIEW ENGINE"
          >
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="bg-white/70 border border-[#0E1116]/25 p-3 rounded-[2px]">
                  <div className="font-mono-data text-[10px] text-[#0E1116]/60 uppercase font-bold">
                    Communication
                  </div>
                  <div className="font-mono-data text-2xl font-bold text-[#0E1116] mt-0.5">
                    6 <span className="text-xs text-[#0E1116]/60">/ 10</span>
                  </div>
                </div>
                <div className="bg-white/70 border border-[#0E1116]/25 p-3 rounded-[2px]">
                  <div className="font-mono-data text-[10px] text-[#0E1116]/60 uppercase font-bold">
                    Technical Depth
                  </div>
                  <div className="font-mono-data text-2xl font-bold text-[#FF5A1F] mt-0.5">
                    4 <span className="text-xs text-[#0E1116]/60">/ 10</span>
                  </div>
                </div>
                <div className="bg-white/70 border border-[#0E1116]/25 p-3 rounded-[2px]">
                  <div className="font-mono-data text-[10px] text-[#0E1116]/60 uppercase font-bold">
                    Problem Solving
                  </div>
                  <div className="font-mono-data text-2xl font-bold text-[#0E1116] mt-0.5">
                    5 <span className="text-xs text-[#0E1116]/60">/ 10</span>
                  </div>
                </div>
                <div className="bg-white/70 border border-[#0E1116]/25 p-3 rounded-[2px]">
                  <div className="font-mono-data text-[10px] text-[#0E1116]/60 uppercase font-bold">
                    Structure of Answers
                  </div>
                  <div className="font-mono-data text-2xl font-bold text-[#0E1116] mt-0.5">
                    5 <span className="text-xs text-[#0E1116]/60">/ 10</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#0E1116]/15">
                <div className="space-y-2">
                  <div className="font-mono-data text-xs font-bold text-[#0E1116] uppercase flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-[#0E1116]" />
                    Observed Strengths
                  </div>
                  <ul className="text-xs text-[#0E1116]/85 space-y-1 list-disc list-inside">
                    <li>You stayed relevant to the prompt and avoided wandering off-topic.</li>
                    <li>You correctly identified Docker compose as an orchestration aid.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="font-mono-data text-xs font-bold text-[#FF5A1F] uppercase flex items-center gap-1.5">
                    <AlertTriangle size={14} className="text-[#FF5A1F]" />
                    Critical Areas for Improvement
                  </div>
                  <ul className="text-xs text-[#0E1116]/85 space-y-1 list-disc list-inside">
                    <li>Explicitly explain what service was in the container (e.g. FastAPI / Redis).</li>
                    <li>State concrete architectural outcomes: latency improvement, memory caps, or port bindings.</li>
                  </ul>
                </div>
              </div>
            </div>
          </BriefingCard>

          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setStatus('setup')}
              icon={<RotateCcw size={14} />}
            >
              Re-run Drill
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/mission-control')}
              icon={<Compass size={14} />}
            >
              Return to Mission Control
            </Button>
          </div>
        </div>
      )}

      {/* End Session Confirmation Modal */}
      <Modal
        isOpen={showEndModal}
        title="Conclude Interview Drill Early?"
        description="Terminating the drill prematurely will generate an incomplete score report based solely on answered questions."
        confirmLabel="End & View Report"
        cancelLabel="Continue Drill"
        onConfirm={() => {
          setShowEndModal(false);
          setStatus('report');
        }}
        onClose={() => setShowEndModal(false)}
        confirmVariant="destructive"
      />
    </div>
  );
}

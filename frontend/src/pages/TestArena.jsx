import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import BriefingCard from '../components/BriefingCard';
import PanelCard from '../components/PanelCard';
import Button from '../components/Button';
import StatusStamp from '../components/StatusStamp';
import Modal from '../components/Modal';
import { sampleTestQuestions } from '../mocks/apogeeData';
import { Timer, CheckCircle, ArrowLeft, ArrowRight, Send, AlertTriangle } from 'lucide-react';

export default function TestArena() {
  const navigate = useNavigate();
  const questions = sampleTestQuestions;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [showSubmitModal, setShowSubmitModal] = useState(false);

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

  const handleSubmitTest = () => {
    setShowSubmitModal(false);
    navigate('/debrief');
  };

  const currentQ = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="STANDARDIZED ASSESSMENT SUITE // APG-TEST-402"
        title="TEST ARENA"
        description="SQL Fundamentals Check · 20 Minutes · 5 Questions · Time critical drill"
        status={<StatusStamp label="DRILL IN PROGRESS" tone="signal" rotation="-rotate-1" />}
      />

      {/* Countdown & Progress Telemetry Bar */}
      <div className="bg-[#161B22] border border-[#8B98A9]/30 p-3 rounded-[3px] hard-shadow flex flex-wrap items-center justify-between gap-3 font-mono-data text-xs">
        <div className="flex items-center gap-2 text-white">
          <div className="p-1.5 bg-[#FF5A1F]/15 border border-[#FF5A1F]/40 rounded-[2px] text-[#FF5A1F]">
            <Timer size={16} />
          </div>
          <div>
            <span className="text-[#8B98A9] text-[10px] uppercase block">TIME REMAINING</span>
            <span className="text-base font-bold text-white tracking-wider">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[#8B98A9] text-[10px] uppercase block">PROGRESS</span>
            <span className="text-white font-bold">
              {answeredCount} OF {questions.length} ANSWERED
            </span>
          </div>
          <div className="w-24 bg-[#0E1116] h-2 rounded-[1px] border border-[#8B98A9]/30 overflow-hidden">
            <div
              className="bg-[#3DFFA2] h-full transition-all duration-300"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Test Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left / Center: Question & Options */}
        <div className="lg:col-span-8 space-y-5">
          {/* Paper Question Card */}
          <BriefingCard
            eyebrow={`QUESTION ${String(currentIdx + 1).padStart(2, '0')} // ${String(questions.length).padStart(2, '0')}`}
            title={`Topic: ${currentQ.topic}`}
            docId="APOGEE SECURE DRILL EXAM"
            stamp={
              answers[currentIdx] !== undefined ? (
                <StatusStamp label="ANSWER SAVED" tone="paper" rotation="rotate-1" />
              ) : (
                <StatusStamp label="UNANSWERED" tone="signal" rotation="-rotate-1" />
              )
            }
          >
            <div className="text-sm md:text-base text-[#0E1116] font-semibold leading-relaxed py-2">
              {currentQ.text}
            </div>
          </BriefingCard>

          {/* Options Palette */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = answers[currentIdx] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-3.5 rounded-[3px] border text-xs md:text-sm font-mono-data transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#0E1116] border-[#FF5A1F] text-white shadow-[0_0_8px_rgba(255,90,31,0.25)] hard-shadow-signal translate-x-1'
                      : 'bg-[#161B22] border-[#8B98A9]/30 text-[#E2E8F0] hover:border-[#BFE3FF] hover:bg-[#1A202C]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-[2px] flex items-center justify-center font-bold text-xs ${
                        isSelected
                          ? 'bg-[#FF5A1F] text-white'
                          : 'bg-[#0E1116] text-[#8B98A9] border border-[#8B98A9]/30'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isSelected && (
                    <CheckCircle size={16} className="text-[#3DFFA2]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Nav Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#8B98A9]/20">
            <Button
              variant="secondary"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => i - 1)}
              icon={<ArrowLeft size={14} />}
            >
              Previous
            </Button>

            {currentIdx < questions.length - 1 ? (
              <Button
                variant="secondary"
                onClick={() => setCurrentIdx((i) => i + 1)}
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

        {/* Right Desktop: Question Navigation Palette */}
        <div className="lg:col-span-4">
          <PanelCard
            eyebrow="QUESTION PALETTE"
            title="Navigation Matrix"
            status={<StatusStamp label="INDEXED" tone="steel" />}
            footer="CLICK NUMERAL TO JUMP"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isAnswered = answers[idx] !== undefined;
                  const isCurrent = idx === currentIdx;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`p-2.5 rounded-[2px] font-mono-data text-xs font-bold transition-all border cursor-pointer ${
                        isCurrent
                          ? 'border-[#BFE3FF] text-[#BFE3FF] bg-[#0E1116] ring-1 ring-[#BFE3FF]'
                          : isAnswered
                          ? 'border-[#3DFFA2] text-[#3DFFA2] bg-[#3DFFA2]/10'
                          : 'border-[#8B98A9]/30 text-[#8B98A9] bg-[#0E1116] hover:text-white'
                      }`}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1.5 pt-3 border-t border-[#8B98A9]/20 text-[10px] font-mono-data text-[#8B98A9]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#3DFFA2] rounded-[1px]"></span>
                  <span>Answer Recorded</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#0E1116] border border-[#8B98A9]/40 rounded-[1px]"></span>
                  <span>Unanswered Question</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 border border-[#BFE3FF] rounded-[1px]"></span>
                  <span>Current Focus</span>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={() => setShowSubmitModal(true)}
                icon={<Send size={14} />}
                className="w-full mt-4"
              >
                Submit Test
              </Button>
            </div>
          </PanelCard>
        </div>

      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showSubmitModal}
        title="Submit Assessment Attempt?"
        description={
          unansweredCount > 0
            ? `Warning: ${unansweredCount} question(s) remain unanswered. You cannot change answers after confirmation.`
            : 'All questions have recorded answers. Submit now to calculate your topic accuracy and launch score contribution?'
        }
        confirmLabel="Confirm & Submit"
        cancelLabel="Return to Test"
        onConfirm={handleSubmitTest}
        onClose={() => setShowSubmitModal(false)}
        confirmVariant={unansweredCount > 0 ? 'destructive' : 'primary'}
      />
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import BriefingCard from '../components/BriefingCard';
import PanelCard from '../components/PanelCard';
import GaugeRadial from '../components/GaugeRadial';
import StatusStamp from '../components/StatusStamp';
import SegmentedBar from '../components/SegmentedBar';
import Button from '../components/Button';
import { mockDebriefData, sampleTestQuestions } from '../mocks/apogeeData';
import { Compass, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';

export default function Debrief() {
  const navigate = useNavigate();
  const debrief = mockDebriefData;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="POST-DRILL TELEMETRY ANALYSIS // APG-DEBRIEF-104"
        title={`DEBRIEF // ${debrief.testTitle.toUpperCase()}`}
        description={`Submitted: ${debrief.submittedAt} · Accuracy: ${debrief.accuracyRatio} · Flight evaluation complete.`}
        status={<StatusStamp label="DEBRIEF COMPLETE" tone="phosphor" rotation="rotate-1" />}
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

      {/* Top Row: Personal Score vs Batch Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Paper Score Briefing */}
        <div className="md:col-span-6">
          <BriefingCard
            eyebrow="TEST TELEMETRY RECORD"
            title="Attempt Score Summary"
            docId="SCORE CERTIFIED // APOGEE"
            stamp={<StatusStamp label="PASS // 72%" tone="paper" />}
            footer="MINIMUM BENCHMARK: 65%"
          >
            <div className="flex items-center justify-between gap-4 py-2">
              <div className="space-y-2">
                <div>
                  <div className="font-mono-data text-[10px] text-[#0E1116]/60 uppercase font-bold">
                    CANDIDATE RESULT
                  </div>
                  <div className="font-mono-data text-4xl font-bold text-[#0E1116] tracking-tight">
                    {debrief.score} <span className="text-base text-[#0E1116]/60">/ 100</span>
                  </div>
                </div>
                <div className="text-xs text-[#0E1116]/80">
                  Correct answers: <strong>{debrief.accuracyRatio}</strong>
                </div>
              </div>

              <div className="p-3 bg-white/70 border border-[#0E1116]/20 rounded-[2px] text-right">
                <div className="font-mono-data text-[10px] text-[#0E1116]/60 uppercase">
                  EFFICIENCY
                </div>
                <div className="font-mono-data text-lg font-bold text-[#0E1116] mt-0.5">
                  00:41 / Q
                </div>
                <div className="text-[10px] text-[#0E1116]/60">Median pacing</div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#0E1116]/15 text-xs text-[#0E1116]/85">
              Readiness delta: <strong>+4 points</strong> contributed to your overall Launch Readiness score.
            </div>
          </BriefingCard>
        </div>

        {/* Batch Orbit Comparison */}
        <div className="md:col-span-6">
          <PanelCard
            eyebrow="BATCH TELEMETRY // CSE-A 2027"
            title="Your Orbit / Batch Orbit"
            status={<StatusStamp label="ABOVE AVERAGE" tone="phosphor" />}
            footer="BASED ON 12 BATCH PEER ATTEMPTS"
          >
            <div className="space-y-3 py-1">
              <div className="flex items-center justify-between font-mono-data text-xs">
                <span className="text-[#8B98A9]">YOUR SCORE:</span>
                <span className="text-[#3DFFA2] font-bold text-base">{debrief.score} / 100</span>
              </div>
              <SegmentedBar
                label="Candidate Accuracy"
                value={debrief.score}
                max={100}
                tone="phosphor"
              />

              <div className="flex items-center justify-between font-mono-data text-xs pt-1">
                <span className="text-[#8B98A9]">BATCH AVERAGE:</span>
                <span className="text-[#BFE3FF] font-bold text-base">{debrief.batchAverage} / 100</span>
              </div>
              <SegmentedBar
                label="Batch Benchmark"
                value={debrief.batchAverage}
                max={100}
                tone="steel"
              />
            </div>
          </PanelCard>
        </div>

      </div>

      {/* Middle Row: Topic Accuracies + Recommendation */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Topic breakdown */}
        <div className="md:col-span-7">
          <PanelCard
            eyebrow="TOPIC-LEVEL BREAKDOWN"
            title="Syllabus Accuracy Telemetry"
            status={<StatusStamp label="DIAGNOSTIC" tone="steel" />}
          >
            <div className="space-y-4">
              {debrief.topicAccuracies.map((item, idx) => {
                const isWeak = item.accuracy < 60;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-mono-data">
                      <span className="text-white font-medium flex items-center gap-1.5">
                        {isWeak && <AlertCircle size={13} className="text-[#FFB547]" />}
                        {item.topic}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-[#8B98A9] text-[10px]">Peer: {item.batchAverage}%</span>
                        <span className={`font-bold ${isWeak ? 'text-[#FFB547]' : 'text-[#3DFFA2]'}`}>
                          {item.accuracy}%
                        </span>
                      </div>
                    </div>
                    <SegmentedBar
                      value={item.accuracy}
                      max={100}
                      tone={isWeak ? 'amber' : 'phosphor'}
                    />
                  </div>
                );
              })}
            </div>
          </PanelCard>
        </div>

        {/* Pacing & Recommendation */}
        <div className="md:col-span-5 space-y-4">
          <BriefingCard
            eyebrow="FLIGHT INSTRUCTOR FEEDBACK"
            title="Weak Areas to Revisit"
            stamp={<StatusStamp label="ATTENTION" tone="amber" />}
          >
            <p className="text-xs text-[#0E1116] leading-relaxed">
              {debrief.recommendation}
            </p>
            <div className="mt-3 pt-2 border-t border-[#0E1116]/15 flex items-center gap-2 text-[11px] text-[#0E1116]/80 font-mono-data">
              <Clock size={13} />
              <span>{debrief.timeNote}</span>
            </div>
          </BriefingCard>

          <Button
            variant="primary"
            onClick={() => navigate('/resume-lab')}
            className="w-full text-xs"
          >
            Proceed to Resume Lab Gaps →
          </Button>
        </div>

      </div>

      {/* Lower Row: Questions Review */}
      <PanelCard
        eyebrow="DETAILED AUDIT"
        title="Question Review & Answer Keys"
        status={<StatusStamp label="UNLOCKED POST-TEST" tone="steel" />}
      >
        <div className="space-y-4">
          {sampleTestQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-[#0E1116] border border-[#8B98A9]/25 p-3.5 rounded-[2px] space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="text-xs font-mono-data text-white font-bold">
                  Q{String(idx + 1).padStart(2, '0')} · {q.text}
                </div>
                <span className="text-[10px] font-mono-data text-[#8B98A9] bg-[#161B22] px-2 py-0.5 rounded-[2px] border border-[#8B98A9]/20">
                  {q.topic}
                </span>
              </div>

              <div className="text-xs font-mono-data text-[#3DFFA2] flex items-center gap-2">
                <CheckCircle2 size={13} />
                <span>Correct Option: {q.options[q.correctIndex]}</span>
              </div>

              <div className="text-[11px] text-[#8B98A9] bg-[#161B22] p-2 rounded-[2px] border-l-2 border-[#BFE3FF]">
                {q.explanation}
              </div>
            </div>
          ))}
        </div>
      </PanelCard>
    </div>
  );
}

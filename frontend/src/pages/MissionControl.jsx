import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import BriefingCard from '../components/BriefingCard';
import PanelCard from '../components/PanelCard';
import GaugeRadial from '../components/GaugeRadial';
import StatusStamp from '../components/StatusStamp';
import SegmentedBar from '../components/SegmentedBar';
import Button from '../components/Button';
import {
  assignedTests,
  currentUserStudent,
} from '../mocks/apogeeData';
import {
  Flame,
  ArrowRight,
  Award,
  PlayCircle,
  FileText,
  MessageSquareCode,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export default function MissionControl() {
  const navigate = useNavigate();
  const student = currentUserStudent;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        eyebrow="STUDENT FLIGHT DECK // SECTOR-07"
        title="MISSION CONTROL"
        description="Mission brief: close the largest skill gap before your next placement drive."
        status={<StatusStamp label="PRE-LAUNCH" tone="amber" rotation="-rotate-1" />}
      />

      {/* Top Main Row: Paper Launch Readiness + Next Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Warm Paper Launch Readiness Summary */}
        <div className="lg:col-span-7">
          <BriefingCard
            eyebrow="DOCUMENT ID // APG-DOC-770"
            title="Launch Readiness Summary"
            docId="FLIGHT CREW // AARAV SHARMA"
            stamp={<StatusStamp label="CADET TIER" tone="paper" rotation="rotate-2" />}
            footer="EVALUATION AUTHORITY // FLIGHT OPS"
            className="h-full flex flex-col justify-between"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Radial Gauge */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-2 bg-white/60 border border-[#0E1116]/20 rounded-[2px]">
                <GaugeRadial
                  value={student.readinessScore}
                  max={100}
                  label="READINESS SCORE"
                  subLabel="Threshold to Board: 70"
                  tone="signal"
                  size={140}
                />
              </div>

              {/* Breakdown Details */}
              <div className="md:col-span-7 space-y-3">
                <div>
                  <span className="font-mono-data text-[10px] text-[#0E1116]/70 uppercase font-bold tracking-wider">
                    COVERAGE STATUS
                  </span>
                  <div className="text-sm font-bold text-[#0E1116] mt-0.5">
                    Based on {student.areasIncluded}
                  </div>
                  <div className="text-xs text-[#0E1116]/75 mt-0.5">
                    Target Company Sector: High-Throughput Backend Engineering
                  </div>
                </div>

                <div className="space-y-2 pt-1 border-t border-[#0E1116]/15">
                  <SegmentedBar
                    label="Algorithmic Tests (DSA/SQL)"
                    value={72}
                    max={100}
                    tone="phosphor"
                    valueText="72%"
                  />
                  <SegmentedBar
                    label="Resume ATS Alignment"
                    value={61}
                    max={100}
                    tone="amber"
                    valueText="61%"
                  />
                  <SegmentedBar
                    label="Mock Board Interview"
                    value={30}
                    max={100}
                    tone="steel"
                    valueText="Pending Drill"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#0E1116]/15 text-[11px] text-[#0E1116]/80 flex items-center justify-between">
              <span>ESTIMATED GAIN AFTER RESUME FIX:</span>
              <span className="font-mono-data font-bold text-[#0E1116]">+7 PTS (→ 61/100)</span>
            </div>
          </BriefingCard>
        </div>

        {/* Right: Dark Recommended Next Action Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <PanelCard
            eyebrow="FLIGHT DIRECTOR DIRECTIVE"
            title="Recommended Next Action"
            status={<StatusStamp label="ACTION REQUIRED" tone="signal" />}
            footer="ESTIMATED IMPACT // +7 READINESS POINTS"
            className="h-full flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="bg-[#0E1116] border border-[#8B98A9]/30 p-3.5 rounded-[2px]">
                <div className="font-mono-data text-[10px] text-[#FF5A1F] uppercase font-bold tracking-wider mb-1">
                  CRITICAL DEFICIT IDENTIFIED
                </div>
                <div className="text-sm text-white font-medium leading-snug">
                  {student.nextAction}
                </div>
                <p className="text-xs text-[#8B98A9] mt-2 leading-relaxed">
                  Missing keywords detected: <strong>Docker</strong>, <strong>REST API</strong>, and <strong>SQL Joins</strong>. Resolving these closes the placement gap.
                </p>
              </div>

              {/* Primary CTA */}
              <Button
                variant="primary"
                onClick={() => navigate('/resume-lab')}
                icon={<ArrowRight size={14} />}
                className="w-full text-sm py-3"
              >
                Open Resume Lab
              </Button>

              {/* Secondary Fast Access */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#8B98A9]/20">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/test-arena')}
                  icon={<PlayCircle size={13} className="text-[#3DFFA2]" />}
                  className="text-[11px] py-2"
                >
                  Start Test
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/interview-room')}
                  icon={<MessageSquareCode size={13} className="text-[#BFE3FF]" />}
                  className="text-[11px] py-2"
                >
                  Practice AI
                </Button>
              </div>
            </div>
          </PanelCard>
        </div>

      </div>

      {/* Middle Row: Assigned Tests + Streak Patch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Assigned Tests DataTable */}
        <div className="lg:col-span-8">
          <PanelCard
            eyebrow="ASSESSMENT LOG"
            title="Assigned Placement Tests"
            status={<StatusStamp label="3 SCHEDULED" tone="steel" />}
            action={
              <Button
                variant="quiet"
                onClick={() => navigate('/test-arena')}
                className="text-[11px]"
              >
                View Arena →
              </Button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono-data border-collapse">
                <thead>
                  <tr className="border-b border-[#8B98A9]/20 text-[#8B98A9]">
                    <th className="py-2 px-3 uppercase tracking-wider">Test Identifier</th>
                    <th className="py-2 px-3 uppercase tracking-wider">Topic</th>
                    <th className="py-2 px-3 uppercase tracking-wider">Duration</th>
                    <th className="py-2 px-3 uppercase tracking-wider">Status</th>
                    <th className="py-2 px-3 text-right uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8B98A9]/15">
                  {assignedTests.map((t) => (
                    <tr key={t.id} className="hover:bg-[#0E1116] transition-colors">
                      <td className="py-3 px-3">
                        <div className="text-white font-bold">{t.title}</div>
                        <div className="text-[10px] text-[#8B98A9]">{t.id} · {t.questionCount} Questions</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="bg-[#0E1116] border border-[#8B98A9]/30 px-1.5 py-0.5 rounded-[2px] text-[#BFE3FF]">
                          {t.topic}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#E2E8F0]">{t.durationMinutes} min</td>
                      <td className="py-3 px-3">
                        {t.status === 'COMPLETED' ? (
                          <span className="text-[#3DFFA2] font-bold flex items-center gap-1">
                            ✓ {t.score}%
                          </span>
                        ) : (
                          <StatusStamp label="DUE" tone="signal" rotation="" />
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {t.status === 'COMPLETED' ? (
                          <button
                            onClick={() => navigate('/debrief')}
                            className="text-[#8B98A9] hover:text-white underline text-[11px] cursor-pointer"
                          >
                            Debrief →
                          </button>
                        ) : (
                          <Button
                            variant="primary"
                            onClick={() => navigate('/test-arena')}
                            className="py-1 px-2.5 text-[10px] ml-auto"
                          >
                            Begin
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PanelCard>
        </div>

        {/* Streak Patch & Orbit Badge */}
        <div className="lg:col-span-4">
          <PanelCard
            eyebrow="TELEMETRY TELEGRAPH"
            title="Flight Streak Patch"
            status={<StatusStamp label="ACTIVE STREAK" tone="phosphor" />}
            footer="NEXT REWARD // ORBIT SPECIALIST BADGE"
          >
            <div className="space-y-4">
              <div className="bg-[#0E1116] border border-[#FFB547]/40 p-4 rounded-[2px] flex items-center gap-3">
                <div className="p-2.5 bg-[#FFB547]/10 rounded-[2px] border border-[#FFB547]/50 text-[#FFB547]">
                  <Flame size={24} />
                </div>
                <div>
                  <div className="font-mono-data text-2xl font-bold text-white tracking-tight">
                    {student.streakCount} DAYS
                  </div>
                  <div className="text-[10px] font-mono-data text-[#8B98A9] uppercase">
                    IN ORBIT // DAILY DRILL COMPLETE
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-[#0E1116] border border-[#8B98A9]/25 p-2.5 rounded-[2px]">
                  <div className="font-mono-data text-[10px] text-[#8B98A9] uppercase">TOTAL POINTS</div>
                  <div className="font-mono-data text-lg font-bold text-[#3DFFA2] mt-0.5">
                    {student.points} PTS
                  </div>
                </div>
                <div className="bg-[#0E1116] border border-[#8B98A9]/25 p-2.5 rounded-[2px]">
                  <div className="font-mono-data text-[10px] text-[#8B98A9] uppercase">RANK IN BATCH</div>
                  <div className="font-mono-data text-lg font-bold text-[#BFE3FF] mt-0.5">
                    #{student.rank} / {student.batchTotal}
                  </div>
                </div>
              </div>

              <div className="border border-[#8B98A9]/20 p-2.5 rounded-[2px] flex items-center justify-between text-xs font-mono-data">
                <div className="flex items-center gap-2">
                  <Award size={15} className="text-[#FF5A1F]" />
                  <span className="text-white">RANK: {student.level}</span>
                </div>
                <span className="text-[#8B98A9]">TIER 1 DRILLS</span>
              </div>
            </div>
          </PanelCard>
        </div>

      </div>

      {/* Lower Row: Batch Orbit Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PanelCard
          eyebrow="BATCH COMPARISON // CSE-A 2027"
          title="Your Orbit / Batch Orbit"
          status={<StatusStamp label="SYNCED" tone="steel" />}
        >
          <div className="space-y-3">
            <p className="text-xs text-[#8B98A9] leading-relaxed">
              Comparison against 12 candidates in CSE-A 2027 based on 3 mandatory tests and preliminary resume indexing.
            </p>
            <div className="space-y-2">
              <SegmentedBar
                label="Your Launch Score (Aarav)"
                value={student.readinessScore}
                max={100}
                tone="signal"
                valueText="54"
              />
              <SegmentedBar
                label="Batch Average (CSE-A 2027)"
                value={58}
                max={100}
                tone="steel"
                valueText="58"
              />
              <SegmentedBar
                label="Batch Top Quartile Threshold"
                value={75}
                max={100}
                tone="phosphor"
                valueText="75"
              />
            </div>
          </div>
        </PanelCard>

        <PanelCard
          eyebrow="RECENT TELEMETRY STREAM"
          title="Activity Log"
          status={<StatusStamp label="REAL-TIME" tone="phosphor" />}
        >
          <ul className="space-y-2 text-xs font-mono-data text-[#8B98A9]">
            <li className="flex items-start gap-2 pb-2 border-b border-[#8B98A9]/15">
              <span className="text-[#3DFFA2] font-bold">14:12</span>
              <span>Completed Data Structures Sprint (Score: 72%)</span>
            </li>
            <li className="flex items-start gap-2 pb-2 border-b border-[#8B98A9]/15">
              <span className="text-[#FFB547] font-bold">11:05</span>
              <span>Assigned SQL Fundamentals Check by Ms. Priya Nair</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#8B98A9] font-bold">YEST</span>
              <span>Earned +40 PTS for 3-Day Daily Orbit Streak</span>
            </li>
          </ul>
        </PanelCard>
      </div>

    </div>
  );
}

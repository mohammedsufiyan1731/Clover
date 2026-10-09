import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import BriefingCard from '../components/BriefingCard';
import PanelCard from '../components/PanelCard';
import StatusStamp from '../components/StatusStamp';
import SegmentedBar from '../components/SegmentedBar';
import FormField from '../components/FormField';
import Button from '../components/Button';
import Modal from '../components/Modal';
import {
  mockCrewRoster,
  mockBatchWeakTopics,
  assignedTests,
} from '../mocks/apogeeData';
import {
  Users,
  BarChart3,
  FilePlus2,
  Download,
  Search,
  CheckCircle,
  AlertTriangle,
  Rocket,
  RefreshCw,
  Terminal,
  Clock,
  Layers,
  GraduationCap,
  ClipboardList,
} from 'lucide-react';

export default function CommandCenter() {
  const [activeTab, setActiveTab] = useState('tests'); // tests | batches | students
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [testName, setTestName] = useState('Backend Readiness Check');
  const [fieldTopic, setFieldTopic] = useState('Backend');
  const [duration, setDuration] = useState('25 minutes');
  const [selectedCohort, setSelectedCohort] = useState('CSE-A 2027');
  const [toastMessage, setToastMessage] = useState('');
  const [showSyncBanner, setShowSyncBanner] = useState(false);

  const roster = mockCrewRoster.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.weakTopics.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTest = (e) => {
    e.preventDefault();
    setShowAssignModal(false);
    setToastMessage(`Test "${testName}" successfully assigned to cohort ${selectedCohort}.`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Name,Batch,ReadinessScore,WeakTopics,LastActive\n' +
      mockCrewRoster
        .map((r) => `"${r.name}","${r.batch}",${r.score},"${r.weakTopics}","${r.lastActive}"`)
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'apogee_batch_cse_a_readiness.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. FLIGHT OPS HEADER & IDENTITY STRIP */}
      <div className="bg-[#101d2a] border border-[#8B98A9]/30 p-2.5 rounded-[2px] flex flex-wrap items-center justify-between text-[10px] font-mono-data text-[#8B98A9] gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-[#1e2b39] text-[#3DFFA2] px-1.5 py-0.5 rounded font-bold">APOGEE</span>
          <span>SYS_ID: APG-CC-90</span>
          <span>//</span>
          <span className="text-[#3DFFA2] font-semibold">AUTH: FLIGHT_DIR</span>
          <span>//</span>
          <span>LOC: BAY-01</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#FFB547]">CALLOUT:</span>
          <span className="text-white font-bold">PRIYA // TR-01</span>
          <span className="text-[#3DFFA2] flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3DFFA2] animate-pulse"></span>
            SYSTEMS NOMINAL
          </span>
        </div>
      </div>

      <PageHeader
        eyebrow="TRAINER OPERATIONS // FLIGHT COMMAND BAY-01"
        title="COMMAND CENTER"
        description="Crew status, assessment readiness and batch gaps for graduating engineering cohorts."
        status={<StatusStamp label="TELEM_UPLINK // LIVE" tone="phosphor" />}
        action={
          <Button
            variant="secondary"
            onClick={handleExportCSV}
            icon={<Download size={14} className="text-[#3DFFA2]" />}
            className="text-xs"
          >
            Export Readiness CSV
          </Button>
        }
      />

      {/* Optional Dismissible Sync Warning Alert (Direct from Stitch Screen) */}
      {showSyncBanner && (
        <div className="bg-[#293644] border border-[#ff5a1f]/40 p-3 rounded-[3px] flex items-start justify-between gap-3 text-xs font-mono-data">
          <div className="flex items-start gap-2 text-white">
            <AlertTriangle size={16} className="text-[#ff5a1f] shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#ff5a1f] text-black px-1 font-bold text-[9px] rounded-[1px]">
                  [ERR // 0x4B]
                </span>
                <span className="text-[#ffb59e] font-bold">SYNC_ROSTER_WARN</span>
              </div>
              <p className="text-[#d6e4f6] text-[11px] mt-0.5">
                Roster background sync delayed by 3.2s. Local cache active.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSyncBanner(false)}
            className="text-[10px] text-[#3DFFA2] border border-[#3DFFA2]/30 px-2 py-0.5 hover:bg-[#3DFFA2]/10 uppercase"
          >
            [DISMISS]
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-[#3DFFA2]/15 border border-[#3DFFA2] text-[#3DFFA2] font-mono-data text-xs rounded-[2px] flex items-center gap-2">
          <CheckCircle size={15} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. FLIGHT METRICS GRID ([MTR-01] TO [MTR-04] from Stitch) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Metric 1 */}
        <div className="bg-[#101d2a] border border-[#8B98A9]/30 p-3 rounded-[3px] flex flex-col justify-between hard-shadow">
          <div className="flex items-center justify-between text-[#8B98A9] font-mono-data text-[9px]">
            <span>[MTR-01]</span>
            <span>+</span>
          </div>
          <div className="my-1.5 flex items-baseline justify-between font-mono-data">
            <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">12</span>
            <Users size={18} className="text-[#3DFFA2]" />
          </div>
          <div className="font-mono-data text-[10px] text-[#8B98A9] uppercase tracking-wider">
            STUDENTS ENROLLED
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#101d2a] border border-[#8B98A9]/30 p-3 rounded-[3px] flex flex-col justify-between hard-shadow">
          <div className="flex items-center justify-between text-[#8B98A9] font-mono-data text-[9px]">
            <span>[MTR-02]</span>
            <span>+</span>
          </div>
          <div className="my-1.5 flex items-baseline justify-between font-mono-data">
            <span className="text-2xl md:text-3xl font-bold text-[#3DFFA2] tracking-tight">
              58<span className="text-xs text-[#8B98A9]">%</span>
            </span>
            <span className="text-[9px] text-[#3DFFA2] bg-[#14212e] px-1.5 py-0.5 rounded border border-[#3DFFA2]/30">
              MID-BAND
            </span>
          </div>
          <div>
            <div className="font-mono-data text-[9px] text-[#3DFFA2] select-none">[======.....]</div>
            <div className="font-mono-data text-[10px] text-[#8B98A9] uppercase tracking-wider mt-0.5">
              AVG READINESS
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#101d2a] border border-[#8B98A9]/30 p-3 rounded-[3px] flex flex-col justify-between hard-shadow">
          <div className="flex items-center justify-between text-[#8B98A9] font-mono-data text-[9px]">
            <span>[MTR-03]</span>
            <span>+</span>
          </div>
          <div className="my-1.5 flex items-baseline justify-between font-mono-data">
            <span className="text-2xl md:text-3xl font-bold text-[#FF5A1F] tracking-tight">03</span>
            <span className="bg-[#FF5A1F] text-black font-mono-data text-[9px] px-1 py-0.5 rounded uppercase font-bold tracking-widest animate-pulse">
              ALERT
            </span>
          </div>
          <div className="font-mono-data text-[10px] text-[#8B98A9] uppercase tracking-wider">
            BELOW THRESHOLD (&lt;50)
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#101d2a] border border-[#8B98A9]/30 p-3 rounded-[3px] flex flex-col justify-between hard-shadow">
          <div className="flex items-center justify-between text-[#8B98A9] font-mono-data text-[9px]">
            <span>[MTR-04]</span>
            <span>+</span>
          </div>
          <div className="my-1.5 flex items-baseline justify-between font-mono-data">
            <span className="text-2xl md:text-3xl font-bold text-[#FFB547] tracking-tight">04</span>
            <ClipboardList size={18} className="text-[#8B98A9]" />
          </div>
          <div className="font-mono-data text-[10px] text-[#8B98A9] uppercase tracking-wider">
            TESTS ASSIGNED
          </div>
        </div>
      </div>

      {/* 3. CONSOLE TAB NAVIGATION (Tests, Batches, Students) */}
      <div className="flex border-b border-[#8B98A9]/20 font-mono-data text-xs bg-[#101d2a] rounded-[2px] p-1 gap-1">
        <button
          onClick={() => setActiveTab('tests')}
          className={`py-2 px-4 rounded-[2px] font-bold cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === 'tests'
              ? 'bg-[#1e2b39] text-[#3DFFA2] border-b-2 border-[#3DFFA2]'
              : 'text-[#8B98A9] hover:text-white'
          }`}
        >
          <ClipboardList size={14} />
          <span>Tests & Directives</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`py-2 px-4 rounded-[2px] font-bold cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === 'students'
              ? 'bg-[#1e2b39] text-[#3DFFA2] border-b-2 border-[#3DFFA2]'
              : 'text-[#8B98A9] hover:text-white'
          }`}
        >
          <Users size={14} />
          <span>Crew Roster (12)</span>
        </button>

        <button
          onClick={() => setActiveTab('batches')}
          className={`py-2 px-4 rounded-[2px] font-bold cursor-pointer transition-all flex items-center gap-2 ${
            activeTab === 'batches'
              ? 'bg-[#1e2b39] text-[#3DFFA2] border-b-2 border-[#3DFFA2]'
              : 'text-[#8B98A9] hover:text-white'
          }`}
        >
          <Layers size={14} />
          <span>Batches & Cohorts</span>
        </button>
      </div>

      {/* 4. TAB CONTENT 1: TESTS & DIRECTIVES */}
      {activeTab === 'tests' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Primary Directive // Test Specification Form (Direct from Stitch) */}
          <div className="lg:col-span-7">
            <PanelCard
              eyebrow="PRIMARY DIRECTIVE // CFG_REV_2.4"
              title="Test Specification & Authoring"
              status={<StatusStamp label="READY" tone="steel" />}
            >
              <form onSubmit={handleCreateTest} className="space-y-4">
                {/* Input 1: Test Designation */}
                <div>
                  <div className="flex justify-between items-center text-[#8B98A9] font-mono-data text-[10px] mb-1">
                    <label className="uppercase tracking-wider font-bold">TEST DESIGNATION</label>
                    <span>[STR_UTF8]</span>
                  </div>
                  <div className="bg-[#030f1c] border border-[#8B98A9]/30 px-3 py-2 rounded-[2px] flex items-center gap-2">
                    <input
                      type="text"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      className="w-full bg-transparent text-white font-mono-data text-xs focus:outline-none"
                      required
                    />
                    <Terminal size={14} className="text-[#8B98A9]" />
                  </div>
                </div>

                {/* Field Topic and Chrono Window */}
                <div className="grid grid-cols-2 gap-3 font-mono-data text-xs">
                  <div>
                    <label className="text-[#8B98A9] text-[10px] uppercase tracking-wider block mb-1">
                      FIELD TOPIC
                    </label>
                    <select
                      value={fieldTopic}
                      onChange={(e) => setFieldTopic(e.target.value)}
                      className="w-full bg-[#030f1c] border border-[#8B98A9]/30 rounded-[2px] px-2.5 py-2 text-white text-xs focus:outline-none"
                    >
                      <option value="Backend">Backend Architecture</option>
                      <option value="SQL">SQL & Database Systems</option>
                      <option value="DSA">Data Structures & Algo</option>
                      <option value="System Design">System Design</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[#8B98A9] text-[10px] uppercase tracking-wider block mb-1">
                      CHRONO WINDOW
                    </label>
                    <div className="bg-[#030f1c] border border-[#8B98A9]/30 px-2.5 py-2 rounded-[2px] flex items-center justify-between text-[#FFB547]">
                      <span>{duration}</span>
                      <Clock size={14} className="text-[#8B98A9]" />
                    </div>
                  </div>
                </div>

                {/* CSV Telemetry Log Box */}
                <div className="bg-[#14212e] border border-[#8B98A9]/30 p-3 rounded-[3px] space-y-1.5 font-mono-data text-xs">
                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5 text-[#FFB547] font-bold">
                      <span>✦</span>
                      <span className="tracking-widest uppercase">CSV TELEMETRY LOG</span>
                    </div>
                    <span className="bg-[#293644] text-[#FFB547] px-1.5 py-0.2 rounded text-[9px] uppercase">
                      VALIDATED
                    </span>
                  </div>
                  <p className="text-[#d6e4f6] text-[11px] leading-snug">
                    <span className="text-[#3DFFA2] font-bold">22</span> questions added ·{' '}
                    <span className="text-[#FF5A1F] font-bold">2</span> rows rejected. Review the rejected rows before assigning.
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-[#8B98A9]/20 text-[10px] text-[#8B98A9]">
                    <span>FILE: CSE_BE_READINESS_V1.CSV</span>
                    <span className="text-[#FF5A1F] underline cursor-pointer">ERR_LOG [2]</span>
                  </div>
                </div>

                {/* Target Crew Cohort */}
                <div>
                  <div className="flex justify-between items-center text-[#8B98A9] font-mono-data text-[10px] mb-1">
                    <label className="uppercase tracking-wider">TARGET CREW COHORT</label>
                    <span className="text-[#3DFFA2]">[ACTIVE]</span>
                  </div>
                  <div className="bg-[#030f1c] border border-[#8B98A9]/30 px-3 py-2 rounded-[2px] flex items-center justify-between text-xs font-mono-data">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#3DFFA2]"></span>
                      <span className="text-white font-bold">{selectedCohort}</span>
                    </div>
                    <span className="text-[10px] text-[#8B98A9]">12 Cadets Tracked</span>
                  </div>
                </div>

                {/* Signal Orange Ignition Button */}
                <button
                  type="submit"
                  className="w-full bg-[#FF5A1F] hover:bg-[#e04e18] text-white font-mono-data text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-[2px] flex items-center justify-center gap-2 cursor-pointer hard-shadow-signal active:translate-x-0.5 active:translate-y-0.5 transition-transform"
                >
                  <Rocket size={16} />
                  <span>ASSIGN TEST PROTOCOL</span>
                </button>
              </form>
            </PanelCard>
          </div>

          {/* Tactical Split: Batch Weak Topics Deficiency Vector */}
          <div className="lg:col-span-5 space-y-4">
            <BriefingCard
              eyebrow="DEFICIENCY VECTOR // AGGREGATE"
              title="Batch Weak Topics"
              docId="BATCH CSE-A // 2027"
              stamp={<StatusStamp label="3 IDENTIFIED" tone="signal" />}
            >
              <div className="space-y-3 pt-1">
                {/* Item 1 */}
                <div className="bg-white/60 border border-[#0E1116]/20 p-2.5 rounded-[2px] space-y-1">
                  <div className="flex items-center justify-between font-mono-data text-xs">
                    <span className="font-bold text-[#0E1116]">Docker / Containers</span>
                    <span className="font-bold text-[#521300]">7 CADETS</span>
                  </div>
                  <div className="w-full bg-[#0E1116]/15 h-2 rounded-[1px] overflow-hidden">
                    <div className="bg-[#FF5A1F] h-full" style={{ width: '58.3%' }}></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono-data text-[#0E1116]/70">
                    <span>CRITICAL_MASS_EXCEEDED</span>
                    <span className="font-bold text-[#521300]">58.3% COHORT GAP</span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="bg-white/60 border border-[#0E1116]/20 p-2.5 rounded-[2px] space-y-1">
                  <div className="flex items-center justify-between font-mono-data text-xs">
                    <span className="font-bold text-[#0E1116]">SQL Joins</span>
                    <span className="font-bold text-[#521300]">6 CADETS</span>
                  </div>
                  <div className="w-full bg-[#0E1116]/15 h-2 rounded-[1px] overflow-hidden">
                    <div className="bg-[#FFB547] h-full" style={{ width: '50.0%' }}></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono-data text-[#0E1116]/70">
                    <span>MODERATE_REMEDIATION</span>
                    <span className="font-bold text-[#521300]">50.0% COHORT GAP</span>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="bg-white/60 border border-[#0E1116]/20 p-2.5 rounded-[2px] space-y-1">
                  <div className="flex items-center justify-between font-mono-data text-xs">
                    <span className="font-bold text-[#0E1116]">REST API Design</span>
                    <span className="font-bold text-[#0E1116]/80">4 CADETS</span>
                  </div>
                  <div className="w-full bg-[#0E1116]/15 h-2 rounded-[1px] overflow-hidden">
                    <div className="bg-[#3DFFA2] h-full" style={{ width: '33.3%' }}></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono-data text-[#0E1116]/70">
                    <span>NOMINAL_DEFICIENCY</span>
                    <span className="font-bold text-[#0E1116]">33.3% COHORT GAP</span>
                  </div>
                </div>
              </div>
            </BriefingCard>

            <PanelCard eyebrow="ACTIVE INVENTORY" title="Tests Live in Orbit">
              <div className="space-y-2.5 font-mono-data text-xs">
                {assignedTests.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 bg-[#030f1c] border border-[#8B98A9]/20 rounded-[2px] flex justify-between items-center"
                  >
                    <div>
                      <div className="text-white font-bold">{t.title}</div>
                      <div className="text-[10px] text-[#8B98A9]">{t.topic} · {t.durationMinutes} min</div>
                    </div>
                    <StatusStamp label={t.status} tone={t.status === 'DUE' ? 'signal' : 'phosphor'} />
                  </div>
                ))}
              </div>
            </PanelCard>
          </div>

        </div>
      )}

      {/* 5. TAB CONTENT 2: STUDENTS // CREW ROSTER TABLE (Matrix from Stitch) */}
      {activeTab === 'students' && (
        <PanelCard
          eyebrow="CREW ROSTER // CADET TELEMETRY MATRIX"
          title="Candidate Cohort Overview"
          status={<StatusStamp label="LIVE SCAN" tone="phosphor" />}
          action={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-2.5 text-[#8B98A9]" />
                <input
                  type="text"
                  placeholder="Filter candidate or gap..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#030f1c] border border-[#8B98A9]/30 rounded-[2px] pl-7 pr-2 py-1 text-xs text-white placeholder-[#8B98A9]/50 focus:outline-none focus:border-[#BFE3FF] font-mono-data"
                />
              </div>
            </div>
          }
        >
          <div className="overflow-x-auto space-y-2">
            {/* Table Header Bar */}
            <div className="grid grid-cols-12 gap-2 bg-[#1e2b39] px-3 py-1.5 rounded-[2px] text-[#8B98A9] font-mono-data text-[10px] uppercase tracking-wider">
              <span className="col-span-4">CADET / BATCH</span>
              <span className="col-span-2 text-center">SCORE</span>
              <span className="col-span-4">CRITICAL GAPS</span>
              <span className="col-span-2 text-right">STATUS</span>
            </div>

            {/* Cadet Rows */}
            <div className="space-y-1.5 font-mono-data text-xs">
              {roster.map((c) => {
                const isAlert = c.score < 50;
                const isHigh = c.score >= 70;
                return (
                  <div
                    key={c.id}
                    className="grid grid-cols-12 gap-2 items-center bg-[#030f1c] hover:bg-[#101d2a] px-3 py-2.5 rounded-[2px] border border-[#8B98A9]/20 transition-colors"
                  >
                    <div className="col-span-4 flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isAlert ? 'bg-[#FF5A1F] animate-ping' : isHigh ? 'bg-[#3DFFA2]' : 'bg-[#FFB547]'
                          }`}
                        ></span>
                        <span className="text-white font-bold truncate">{c.name}</span>
                      </div>
                      <span className="text-[10px] text-[#8B98A9]">{c.batch}</span>
                    </div>

                    <div className="col-span-2 text-center">
                      <span
                        className={`text-sm font-bold ${
                          isAlert ? 'text-[#FF5A1F]' : isHigh ? 'text-[#3DFFA2]' : 'text-[#FFB547]'
                        }`}
                      >
                        {c.score}
                      </span>
                      <span className="text-[10px] text-[#8B98A9]"> / 100</span>
                    </div>

                    <div className="col-span-4 flex flex-col min-w-0">
                      <span className="text-[#FFB547] text-[11px] truncate">{c.weakTopics}</span>
                      <span className="text-[9px] text-[#8B98A9] uppercase">ACTIVE: {c.lastActive}</span>
                    </div>

                    <div className="col-span-2 text-right">
                      {isAlert ? (
                        <span className="bg-[#FF5A1F] text-black text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                          WARN
                        </span>
                      ) : (
                        <span className="bg-[#1e2b39] text-[#3DFFA2] text-[9px] px-1.5 py-0.5 rounded uppercase font-bold">
                          NOMINAL
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Matrix Footer Readout */}
            <div className="flex items-center justify-between text-[#8B98A9] font-mono-data text-[10px] bg-[#101d2a] px-3 py-1.5 rounded-[2px] mt-2">
              <span className="uppercase tracking-widest">
                CADETS DISPLAYED: {roster.length} OF 12
              </span>
              <span className="text-[#3DFFA2] uppercase">TELEMETRY SCAN IDLE</span>
            </div>
          </div>
        </PanelCard>
      )}

      {/* 6. TAB CONTENT 3: BATCHES */}
      {activeTab === 'batches' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['CSE-A 2027', 'CSE-B 2027', 'ECE-A 2027'].map((bName, idx) => (
            <div
              key={idx}
              className="bg-[#101d2a] border border-[#8B98A9]/30 p-4 rounded-[3px] hard-shadow space-y-3 font-mono-data text-xs"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-[#8B98A9] uppercase">COHORT CLUSTER</span>
                  <div className="text-white font-bold text-base mt-0.5">{bName}</div>
                </div>
                <StatusStamp label={idx === 0 ? 'ACTIVE' : 'STANDBY'} tone={idx === 0 ? 'phosphor' : 'steel'} />
              </div>
              <div className="space-y-1 text-[#8B98A9] text-xs">
                <div>Enrolled: <strong>12 Cadets</strong></div>
                <div>Trainer: <strong>Ms. Priya Nair</strong></div>
                <div>Target Gate: <strong>Phase 1 Readiness</strong></div>
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedCohort(bName);
                  setActiveTab('tests');
                }}
                className="w-full text-xs py-1.5"
              >
                Select for Test Dispatch →
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Quick Assignment */}
      <Modal
        isOpen={showAssignModal}
        title="Schedule Targeted Batch Drill"
        description="This will assign the verified 'Backend Readiness Check' to all 12 cadets in CSE-A 2027."
        confirmLabel="Assign Immediately"
        cancelLabel="Cancel"
        onConfirm={() => {
          setShowAssignModal(false);
          setToastMessage('Targeted Drill assigned to CSE-A 2027.');
          setTimeout(() => setToastMessage(''), 4000);
        }}
        onClose={() => setShowAssignModal(false)}
      />
    </div>
  );
}

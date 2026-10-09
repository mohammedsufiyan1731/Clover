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
  Filter,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export default function CommandCenter() {
  const [activeTab, setActiveTab] = useState('roster'); // roster | tests | batches
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [newTestTitle, setNewTestTitle] = useState('');
  const [newTestTopic, setNewTestTopic] = useState('System Design');
  const [newTestDuration, setNewTestDuration] = useState('25');
  const [toastMessage, setToastMessage] = useState('');

  const roster = mockCrewRoster.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.weakTopics.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTest = (e) => {
    e.preventDefault();
    setShowAssignModal(false);
    setToastMessage(`Test "${newTestTitle}" assigned to CSE-A 2027.`);
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
      <PageHeader
        eyebrow="TRAINER OPERATIONS // CONSOLE MS. PRIYA NAIR"
        title="COMMAND CENTER"
        description="Crew status, assessment readiness and batch-level gaps for 2027 cohorts."
        status={<StatusStamp label="COHORT TELEMETRY SYNCED" tone="phosphor" />}
        action={
          <Button
            variant="secondary"
            onClick={handleExportCSV}
            icon={<Download size={14} />}
            className="text-xs"
          >
            Export Readiness CSV
          </Button>
        }
      />

      {/* Top Batch Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#161B22] border border-[#8B98A9]/30 p-3.5 rounded-[2px] hard-shadow">
          <div className="font-mono-data text-[10px] text-[#8B98A9] uppercase">SELECTED BATCH</div>
          <div className="font-mono-data text-xl font-bold text-white mt-1">CSE-A 2027</div>
          <div className="text-[10px] text-[#8B98A9] mt-0.5">12 Enrolled Cadets</div>
        </div>

        <div className="bg-[#161B22] border border-[#8B98A9]/30 p-3.5 rounded-[2px] hard-shadow">
          <div className="font-mono-data text-[10px] text-[#8B98A9] uppercase">AVG LAUNCH READINESS</div>
          <div className="font-mono-data text-xl font-bold text-[#3DFFA2] mt-1">58 / 100</div>
          <div className="text-[10px] text-[#8B98A9] mt-0.5">+4 delta this week</div>
        </div>

        <div className="bg-[#161B22] border border-[#8B98A9]/30 p-3.5 rounded-[2px] hard-shadow">
          <div className="font-mono-data text-[10px] text-[#8B98A9] uppercase">ASSIGNED TESTS</div>
          <div className="font-mono-data text-xl font-bold text-[#BFE3FF] mt-1">3 ACTIVE</div>
          <div className="text-[10px] text-[#8B98A9] mt-0.5">1 due tomorrow</div>
        </div>

        <div className="bg-[#161B22] border border-[#8B98A9]/30 p-3.5 rounded-[2px] hard-shadow">
          <div className="font-mono-data text-[10px] text-[#8B98A9] uppercase">BELOW PLACEMENT GATE</div>
          <div className="font-mono-data text-xl font-bold text-[#FF5A1F] mt-1">3 CANDIDATES</div>
          <div className="text-[10px] text-[#8B98A9] mt-0.5">&lt; 50 Readiness threshold</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-[#8B98A9]/20 font-mono-data text-xs">
        <button
          onClick={() => setActiveTab('roster')}
          className={`py-2 px-4 border-b-2 font-bold cursor-pointer transition-colors ${
            activeTab === 'roster'
              ? 'border-[#FF5A1F] text-[#FF5A1F]'
              : 'border-transparent text-[#8B98A9] hover:text-white'
          }`}
        >
          Crew Roster (12)
        </button>
        <button
          onClick={() => setActiveTab('tests')}
          className={`py-2 px-4 border-b-2 font-bold cursor-pointer transition-colors ${
            activeTab === 'tests'
              ? 'border-[#FF5A1F] text-[#FF5A1F]'
              : 'border-transparent text-[#8B98A9] hover:text-white'
          }`}
        >
          Test Management & Assignment
        </button>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-[#3DFFA2]/15 border border-[#3DFFA2] text-[#3DFFA2] font-mono-data text-xs rounded-[2px]">
          ✓ {toastMessage}
        </div>
      )}

      {/* 1. CREW ROSTER TAB */}
      {activeTab === 'roster' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Crew Table */}
          <div className="lg:col-span-8 space-y-4">
            <PanelCard
              eyebrow="COHORT ROSTER"
              title="Candidate Flight Telemetry"
              action={
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-2.5 top-2.5 text-[#8B98A9]" />
                    <input
                      type="text"
                      placeholder="Search name or gap..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-[#0E1116] border border-[#8B98A9]/30 rounded-[2px] pl-7 pr-2 py-1 text-xs text-white placeholder-[#8B98A9]/50 focus:outline-none focus:border-[#BFE3FF] font-mono-data"
                    />
                  </div>
                </div>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono-data border-collapse">
                  <thead>
                    <tr className="border-b border-[#8B98A9]/20 text-[#8B98A9]">
                      <th className="py-2.5 px-3 uppercase tracking-wider">Candidate</th>
                      <th className="py-2.5 px-3 uppercase tracking-wider">Readiness</th>
                      <th className="py-2.5 px-3 uppercase tracking-wider">Top Weak Topics</th>
                      <th className="py-2.5 px-3 uppercase tracking-wider">Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#8B98A9]/15">
                    {roster.map((c) => {
                      const isLow = c.score < 50;
                      return (
                        <tr key={c.id} className="hover:bg-[#0E1116] transition-colors">
                          <td className="py-2.5 px-3">
                            <div className="text-white font-bold">{c.name}</div>
                            <div className="text-[10px] text-[#8B98A9]">{c.batch}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`font-bold text-sm ${
                                isLow ? 'text-[#FF5A1F]' : 'text-[#3DFFA2]'
                              }`}
                            >
                              {c.score}
                            </span>
                            <span className="text-[10px] text-[#8B98A9]"> / 100</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-[#FFB547] text-[11px]">{c.weakTopics}</span>
                          </td>
                          <td className="py-2.5 px-3 text-[#8B98A9] text-[11px]">
                            {c.lastActive}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </PanelCard>
          </div>

          {/* Right Batch Weak Topics */}
          <div className="lg:col-span-4 space-y-4">
            <BriefingCard
              eyebrow="AGGREGATE DEFICIT"
              title="Batch Weak Topics"
              docId="BATCH CSE-A // 2027"
              stamp={<StatusStamp label="URGENT FOCUS" tone="signal" />}
            >
              <p className="text-xs text-[#0E1116]/80 mb-3 leading-relaxed">
                Aggregated from candidate assessment debriefs and resume indexing across all 12 cadets.
              </p>

              <div className="space-y-3">
                {mockBatchWeakTopics.map((topic, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-mono-data text-[#0E1116]">
                      <span className="font-bold">{topic.topic}</span>
                      <span>{topic.studentCount} cadets ({topic.percentage}%)</span>
                    </div>
                    <div className="w-full bg-[#0E1116]/20 h-2 rounded-[1px] overflow-hidden">
                      <div
                        className="bg-[#FF5A1F] h-full"
                        style={{ width: `${topic.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[#0E1116]/15">
                <Button
                  variant="primary"
                  onClick={() => setShowAssignModal(true)}
                  icon={<FilePlus2 size={13} />}
                  className="w-full text-xs"
                >
                  Create Targeted Drill Test
                </Button>
              </div>
            </BriefingCard>
          </div>

        </div>
      )}

      {/* 2. TESTS MANAGEMENT TAB */}
      {activeTab === 'tests' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <PanelCard
              eyebrow="TEST AUTHORING"
              title="Author New Placement Test"
              status={<StatusStamp label="READY" tone="steel" />}
            >
              <form onSubmit={handleCreateTest} className="space-y-4">
                <FormField
                  label="Test Title"
                  name="title"
                  value={newTestTitle}
                  onChange={(e) => setNewTestTitle(e.target.value)}
                  placeholder="e.g. Distributed Systems & Docker Drill"
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    label="Target Syllabus Topic"
                    name="topic"
                    value={newTestTopic}
                    onChange={(e) => setNewTestTopic(e.target.value)}
                  />
                  <FormField
                    label="Duration (Minutes)"
                    name="duration"
                    type="number"
                    value={newTestDuration}
                    onChange={(e) => setNewTestDuration(e.target.value)}
                  />
                </div>

                <div className="p-3 bg-[#0E1116] border border-[#8B98A9]/30 rounded-[2px] text-xs font-mono-data text-[#8B98A9] space-y-1">
                  <div className="text-white font-bold">CSV QUESTION INTAKE:</div>
                  <div>Upload standardized question pools (.csv) with columns:</div>
                  <div className="text-[#3DFFA2]">question, optionA, optionB, optionC, optionD, correctIndex, explanation</div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  icon={<FilePlus2 size={14} />}
                  className="w-full text-xs"
                >
                  Save & Publish to Batch CSE-A 2027
                </Button>
              </form>
            </PanelCard>
          </div>

          <div className="lg:col-span-5">
            <PanelCard
              eyebrow="ACTIVE CURRICULUM"
              title="Assigned Tests In Orbit"
              status={<StatusStamp label="LIVE" tone="phosphor" />}
            >
              <div className="space-y-3 font-mono-data text-xs">
                {assignedTests.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 bg-[#0E1116] border border-[#8B98A9]/20 rounded-[2px] flex justify-between items-center"
                  >
                    <div>
                      <div className="text-white font-bold">{t.title}</div>
                      <div className="text-[10px] text-[#8B98A9]">
                        {t.topic} · {t.durationMinutes} min · {t.questionCount} Questions
                      </div>
                    </div>
                    <StatusStamp label={t.status} tone={t.status === 'DUE' ? 'signal' : 'phosphor'} />
                  </div>
                ))}
              </div>
            </PanelCard>
          </div>
        </div>
      )}

      {/* Modal for Quick Assignment */}
      <Modal
        isOpen={showAssignModal}
        title="Schedule Targeted Batch Drill"
        description="This will assign a new mandatory 15-question drill on 'Docker & SQL Joins' to all 12 cadets in CSE-A 2027."
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

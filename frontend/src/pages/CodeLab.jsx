import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import BriefingCard from '../components/BriefingCard';
import PanelCard from '../components/PanelCard';
import StatusStamp from '../components/StatusStamp';
import Button from '../components/Button';
import { mockCodingProblems } from '../mocks/apogeeData';
import { Play, Send, CheckCircle2, XCircle, Code2, Terminal, Check } from 'lucide-react';

export default function CodeLab() {
  const problems = mockCodingProblems;
  const [selectedProblemIdx, setSelectedProblemIdx] = useState(0);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(problems[0].starterCode.python);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(problems[0].testCases);
  const [activeTab, setActiveTab] = useState('results'); // results | console

  const currentProb = problems[selectedProblemIdx];

  const handleProblemChange = (idx) => {
    setSelectedProblemIdx(idx);
    const p = problems[idx];
    setCode(language === 'python' ? p.starterCode.python : p.starterCode.javascript);
    setTestResults(p.testCases);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(lang === 'python' ? currentProb.starterCode.python : currentProb.starterCode.javascript);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setTestResults(currentProb.testCases);
    }, 700);
  };

  const handleCodeSubmit = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setTestResults(currentProb.testCases);
    }, 900);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="SANDBOX EXECUTOR // APG-SANDBOX-701"
        title="CODE LAB"
        description="Write, run and verify solutions against strict hidden placement test suites in a controlled environment."
        status={<StatusStamp label="RUNNER READY" tone="phosphor" rotation="rotate-1" />}
      />

      {/* Main Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Problem Spec */}
        <div className="lg:col-span-4 space-y-4">
          <BriefingCard
            eyebrow={`PROBLEM ${String(selectedProblemIdx + 1).padStart(2, '0')} // ${problems.length}`}
            title={currentProb.title}
            docId="ALGORITHMIC SPECIFICATION"
            stamp={<StatusStamp label={currentProb.difficulty} tone="phosphor" />}
          >
            <div className="space-y-4 text-xs">
              <p className="text-[#0E1116]/85 leading-relaxed font-sans">
                {currentProb.statement}
              </p>

              <div className="bg-white/70 border border-[#0E1116]/20 p-2.5 rounded-[2px] font-mono-data space-y-2">
                <div>
                  <span className="text-[10px] text-[#0E1116]/60 uppercase block font-bold">
                    SAMPLE INPUT:
                  </span>
                  <div className="text-[#0E1116] bg-black/5 p-1 rounded-[1px] mt-0.5">
                    {currentProb.sampleInput}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-[#0E1116]/60 uppercase block font-bold">
                    SAMPLE OUTPUT:
                  </span>
                  <div className="text-[#0E1116] bg-black/5 p-1 rounded-[1px] mt-0.5">
                    {currentProb.sampleOutput}
                  </div>
                </div>
              </div>

              {/* Problem Switcher */}
              <div className="pt-2 border-t border-[#0E1116]/15">
                <span className="font-mono-data text-[10px] text-[#0E1116]/60 uppercase font-bold block mb-1.5">
                  DRILL PROBLEM SET:
                </span>
                <div className="space-y-1.5">
                  {problems.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => handleProblemChange(idx)}
                      className={`w-full text-left p-2 rounded-[2px] font-mono-data text-xs flex justify-between items-center transition-colors cursor-pointer ${
                        idx === selectedProblemIdx
                          ? 'bg-[#0E1116] text-white font-bold'
                          : 'bg-white/50 text-[#0E1116] hover:bg-white'
                      }`}
                    >
                      <span>{p.title}</span>
                      <span className="text-[10px] opacity-75">{p.difficulty}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </BriefingCard>
        </div>

        {/* Center / Right: Code Editor & Execution Workbench */}
        <div className="lg:col-span-8 space-y-4">
          <PanelCard
            eyebrow="SOURCE EDITOR"
            title="Interactive Code Workspace"
            action={
              <div className="flex items-center gap-2">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-[#0E1116] border border-[#8B98A9]/40 text-xs font-mono-data text-white px-2 py-1 rounded-[2px] focus:outline-none focus:border-[#BFE3FF]"
                >
                  <option value="python">Python 3.11</option>
                  <option value="javascript">JavaScript ES2024</option>
                </select>
              </div>
            }
          >
            <div className="space-y-3">
              {/* Code Textarea Area */}
              <div className="relative font-mono-data">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={14}
                  spellCheck="false"
                  className="w-full bg-[#0E1116] border border-[#8B98A9]/40 rounded-[2px] p-3 text-xs text-[#3DFFA2] leading-relaxed font-mono-data focus:outline-none focus:border-[#BFE3FF] resize-y selection:bg-[#FF5A1F] selection:text-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-2 border-t border-[#8B98A9]/20">
                <div className="text-[10px] font-mono-data text-[#8B98A9]">
                  MEMORY LIMIT: 256MB // TIME LIMIT: 2000MS
                </div>
                <div className="flex items-center gap-2.5">
                  <Button
                    variant="secondary"
                    loading={isRunning}
                    onClick={handleRunCode}
                    icon={<Play size={13} className="text-[#3DFFA2]" />}
                    className="text-xs"
                  >
                    Run Code
                  </Button>
                  <Button
                    variant="primary"
                    loading={isRunning}
                    onClick={handleCodeSubmit}
                    icon={<Send size={13} />}
                    className="text-xs"
                  >
                    Submit Solution
                  </Button>
                </div>
              </div>
            </div>
          </PanelCard>

          {/* Execution & Test Cases Panel */}
          <PanelCard
            eyebrow="RUNTIME TELEMETRY"
            title="Verification Results"
            status={
              <span className="text-xs font-mono-data text-[#3DFFA2] font-bold">
                {testResults.filter((t) => t.passed).length} / {testResults.length} PASSED
              </span>
            }
          >
            <div className="space-y-2.5">
              {testResults.map((tc) => (
                <div
                  key={tc.id}
                  className="bg-[#0E1116] border border-[#8B98A9]/25 p-2.5 rounded-[2px] flex items-center justify-between text-xs font-mono-data"
                >
                  <div className="flex items-center gap-2.5">
                    {tc.passed ? (
                      <CheckCircle2 size={15} className="text-[#3DFFA2]" />
                    ) : (
                      <XCircle size={15} className="text-[#FF5A1F]" />
                    )}
                    <span className="text-white font-bold">{tc.id}</span>
                    <span className="text-[#8B98A9]">input: {tc.input}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#8B98A9] text-[11px]">{tc.runtime}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-[1px] font-bold ${
                        tc.passed
                          ? 'bg-[#3DFFA2]/15 text-[#3DFFA2]'
                          : 'bg-[#FF5A1F]/15 text-[#FF5A1F]'
                      }`}
                    >
                      {tc.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </PanelCard>
        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import BriefingCard from '../components/BriefingCard';
import PanelCard from '../components/PanelCard';
import GaugeRadial from '../components/GaugeRadial';
import StatusStamp from '../components/StatusStamp';
import FormField from '../components/FormField';
import Button from '../components/Button';
import { mockResumeAnalysis } from '../mocks/apogeeData';
import {
  UploadCloud,
  FileCheck2,
  Sparkles,
  ArrowRight,
  Check,
  X,
  Copy,
  CheckCircle,
  FileText,
} from 'lucide-react';

export default function ResumeLab() {
  const navigate = useNavigate();
  const [analyzed, setAnalyzed] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [jobDescription, setJobDescription] = useState(
    'Seeking Backend Engineering Intern with proficiency in Python, REST API development, Docker, SQL, and database indexing.'
  );
  const [fileName, setFileName] = useState('Aarav_Sharma_Resume_2026.pdf');
  const [copiedIdx, setCopiedIdx] = useState(null);

  const analysis = mockResumeAnalysis;

  const handleAnalyze = (e) => {
    e.preventDefault();
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 1200);
  };

  const copyRewrite = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="AUTOMATED ATS AUDIT & REWRITE // APG-RESUME-601"
        title="RESUME LAB"
        description="A precise review of your resume against target company job telemetry."
        status={
          analyzed ? (
            <StatusStamp label="ATS INDEXED" tone="amber" rotation="-rotate-1" />
          ) : (
            <StatusStamp label="INTAKE IDLE" tone="steel" />
          )
        }
      />

      {/* Input & Intake Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PDF Dropzone */}
        <div className="lg:col-span-6">
          <BriefingCard
            eyebrow="INTAKE SPECIFICATION"
            title="Resume Intake & Upload"
            docId="MIME: APPLICATION/PDF"
            stamp={<StatusStamp label="DROPZONE" tone="paper" />}
          >
            <div className="space-y-4">
              <div className="border-2 border-dashed border-[#0E1116]/40 rounded-[3px] p-6 text-center bg-white/50 hover:bg-white/80 transition-colors flex flex-col items-center justify-center cursor-pointer">
                <div className="p-3 bg-[#0E1116]/10 rounded-full text-[#0E1116] mb-2">
                  <UploadCloud size={24} />
                </div>
                <div className="font-mono-data text-xs font-bold text-[#0E1116]">
                  {fileName ? fileName : 'SELECT OR DROP RESUME PDF'}
                </div>
                <div className="text-[10px] text-[#0E1116]/60 mt-1">
                  Text-based PDFs only · Maximum size: 5MB
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono-data text-[#0E1116]/75 pt-1">
                <span>TARGET ROLE:</span>
                <span className="font-bold text-[#0E1116]">{analysis.jobTarget}</span>
              </div>
            </div>
          </BriefingCard>
        </div>

        {/* Job Description Target Form */}
        <div className="lg:col-span-6">
          <PanelCard
            eyebrow="JOB TELEMETRY PROFILE"
            title="Job Description Alignment"
            status={<StatusStamp label="TARGET: NOVAPAY" tone="steel" />}
          >
            <form onSubmit={handleAnalyze} className="space-y-4">
              <FormField
                label="Target Job Description or Requirements"
                name="jobDescription"
                type="textarea"
                rows={3}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste role responsibilities or company requirements here..."
              />

              <Button
                type="submit"
                variant="primary"
                loading={analyzing}
                icon={<Sparkles size={14} />}
                className="w-full text-xs"
              >
                Analyze Resume Against Role
              </Button>
            </form>
          </PanelCard>
        </div>

      </div>

      {/* Analysis Results */}
      {analyzed && (
        <div className="space-y-6">
          
          {/* Top Score + Keywords Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* ATS Score Radial */}
            <div className="lg:col-span-4">
              <BriefingCard
                eyebrow="EVALUATION METRIC"
                title="ATS Alignment Score"
                docId="ALGORITHM // ATS-V4"
                stamp={<StatusStamp label="PRE-INTERVIEW" tone="amber" />}
                className="h-full flex flex-col justify-between"
              >
                <div className="flex flex-col items-center justify-center py-2">
                  <GaugeRadial
                    value={analysis.atsScore}
                    max={100}
                    label="ATS MATCH RATING"
                    subLabel="Target Benchmark: 80+"
                    tone="amber"
                    size={135}
                  />
                  <p className="text-xs text-[#0E1116]/80 text-center mt-3">
                    Missing 4 critical keywords required by automated parsers for NovaPay.
                  </p>
                </div>
              </BriefingCard>
            </div>

            {/* Keyword Extraction */}
            <div className="lg:col-span-8">
              <PanelCard
                eyebrow="KEYWORD MATRIX EXTRACTION"
                title="Matched vs Missing Industry Terms"
                status={<StatusStamp label="PARSED" tone="phosphor" />}
                action={
                  <Button
                    variant="primary"
                    onClick={() => navigate('/interview-room')}
                    icon={<ArrowRight size={13} />}
                    className="text-[11px] py-1.5 px-3"
                  >
                    Interview me on these gaps
                  </Button>
                }
              >
                <div className="space-y-4">
                  <div>
                    <span className="font-mono-data text-[10px] text-[#FF5A1F] uppercase font-bold tracking-wider block mb-2">
                      MISSING KEYWORDS (CRITICAL PLACEMENT DEFICIT):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingKeywords.map((kw, idx) => (
                        <span
                          key={idx}
                          className="bg-[#0E1116] border border-[#FF5A1F] text-[#FF5A1F] text-xs font-mono-data px-2.5 py-1 rounded-[2px] flex items-center gap-1.5"
                        >
                          <X size={12} />
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#8B98A9]/20">
                    <span className="font-mono-data text-[10px] text-[#3DFFA2] uppercase font-bold tracking-wider block mb-2">
                      MATCHED KEYWORDS (VERIFIED IN RESUME):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {analysis.matchedKeywords.map((kw, idx) => (
                        <span
                          key={idx}
                          className="bg-[#0E1116] border border-[#3DFFA2]/40 text-[#3DFFA2] text-xs font-mono-data px-2.5 py-1 rounded-[2px] flex items-center gap-1.5"
                        >
                          <Check size={12} />
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </PanelCard>
            </div>

          </div>

          {/* Line-Level Diff & Rewrites */}
          <PanelCard
            eyebrow="ACTIONABLE REWRITES"
            title="Line-Level Impact Suggestions"
            status={<StatusStamp label="2 SUGGESTIONS" tone="steel" />}
          >
            <div className="space-y-4">
              {analysis.lineSuggestions.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#0E1116] border border-[#8B98A9]/30 rounded-[3px] p-4 space-y-2.5 font-mono-data text-xs"
                >
                  {/* Original line */}
                  <div className="flex items-start gap-2 bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 p-2.5 rounded-[2px] text-[#FF5A1F]">
                    <span className="font-bold select-none">- ORIGINAL:</span>
                    <span className="flex-1">{item.original}</span>
                  </div>

                  {/* Suggested line */}
                  <div className="flex items-start gap-2 bg-[#3DFFA2]/10 border border-[#3DFFA2]/40 p-2.5 rounded-[2px] text-[#3DFFA2]">
                    <span className="font-bold select-none">+ SUGGESTED:</span>
                    <span className="flex-1 text-white">{item.suggested}</span>
                    <button
                      onClick={() => copyRewrite(item.suggested, idx)}
                      className="p-1 rounded hover:bg-[#3DFFA2]/20 text-[#3DFFA2] cursor-pointer"
                      title="Copy to clipboard"
                    >
                      {copiedIdx === idx ? <CheckCircle size={14} /> : <Copy size={14} />}
                    </button>
                  </div>

                  <div className="text-[11px] text-[#8B98A9] pl-1">
                    💡 <strong>Rationale:</strong> {item.reason}
                  </div>
                </div>
              ))}
            </div>
          </PanelCard>

          {/* Sectional Feedback Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {analysis.sectionFeedback.map((sec, idx) => (
              <div
                key={idx}
                className="bg-[#161B22] border border-[#8B98A9]/30 p-3.5 rounded-[2px] hard-shadow"
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-mono-data text-xs font-bold text-white uppercase">
                    {sec.section}
                  </span>
                  <StatusStamp
                    label={sec.status}
                    tone={sec.status === 'NOMINAL' ? 'phosphor' : 'amber'}
                    className="text-[8px] py-0.5 px-1.5"
                  />
                </div>
                <p className="text-[11px] text-[#8B98A9] leading-relaxed">
                  {sec.note}
                </p>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}

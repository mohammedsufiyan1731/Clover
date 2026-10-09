import React from 'react';
import PageHeader from '../components/PageHeader';
import BriefingCard from '../components/BriefingCard';
import PanelCard from '../components/PanelCard';
import StatusStamp from '../components/StatusStamp';
import GaugeRadial from '../components/GaugeRadial';
import SegmentedBar from '../components/SegmentedBar';
import Button from '../components/Button';
import { ExternalLink, Palette, Sparkles, Check, ArrowRight } from 'lucide-react';

export default function StyleGuide() {
  const tokens = [
    { name: 'INK (Main Canvas)', hex: '#0E1116', role: 'Default canvas background' },
    { name: 'PANEL (Raised Surface)', hex: '#161B22', role: 'Raised cards, tables & consoles' },
    { name: 'PAPER (Mission Card)', hex: '#F2EBDD', role: 'Warm briefing sheet, dark ink text' },
    { name: 'SIGNAL (Primary Action)', hex: '#FF5A1F', role: 'One primary CTA per view' },
    { name: 'PHOSPHOR (OK / Nominal)', hex: '#3DFFA2', role: 'Healthy / live telemetry indicators' },
    { name: 'AMBER (Warning)', hex: '#FFB547', role: 'Caution markers and gap tags' },
    { name: 'STEEL (Muted / Border)', hex: '#8B98A9', role: 'Dividers, borders, muted data' },
    { name: 'ICE (Informational)', hex: '#BFE3FF', role: 'Rare highlights & focus outlines' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="GOOGLE STITCH EXPORT ANCHOR // REV 04.2"
        title="APOGEE FLIGHT OPERATIONS DESIGN SYSTEM"
        description="Analog Mission Control design tokens, typography specifications, component sheets, and visual anchor directly sourced from Stitch Screen 0becf176546f479dbce4a0f69bc8974d."
        status={<StatusStamp label="OPERATIONAL" tone="phosphor" rotation="-rotate-2" />}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/stitch-export/S0_apogee-analog-mission-control-style-guide.html"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0E1116] border border-[#8B98A9]/40 hover:border-[#FF5A1F] text-white rounded-[2px] text-xs font-mono-data"
            >
              <ExternalLink size={13} />
              <span>S0 Style Seed HTML</span>
            </a>
            <a
              href="/stitch-export/S1_console-handshake-access.html"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0E1116] border border-[#8B98A9]/40 hover:border-[#3DFFA2] text-white rounded-[2px] text-xs font-mono-data"
            >
              <ExternalLink size={13} />
              <span>S1 Handshake HTML</span>
            </a>
            <a
              href="/stitch-export/S4_debrief-test-attempt.html"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0E1116] border border-[#8B98A9]/40 hover:border-[#3DFFA2] text-white rounded-[2px] text-xs font-mono-data"
            >
              <ExternalLink size={13} />
              <span>S4 Debrief HTML</span>
            </a>
            <a
              href="/stitch-export/S8_apogee-flight-ops-command-center.html"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0E1116] border border-[#8B98A9]/40 hover:border-[#FFB547] text-white rounded-[2px] text-xs font-mono-data"
            >
              <ExternalLink size={13} />
              <span>S8 Command Center HTML</span>
            </a>
          </div>
        }
      />

      {/* 1. PALETTE TOKENS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#8B98A9]/20 pb-1.5 font-mono-data">
          <span className="text-xs font-bold text-[#8B98A9] uppercase tracking-widest">
            01 // COLOR TOKENS MATRIX
          </span>
          <span className="text-[10px] text-[#8B98A9]">EXACT HEX RATIOS</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {tokens.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#161B22] border border-[#8B98A9]/30 p-2.5 rounded-[2px] flex items-center gap-2.5 hard-shadow"
            >
              <div
                className="w-9 h-9 rounded-[2px] border border-black/40 flex-shrink-0"
                style={{ backgroundColor: t.hex }}
              />
              <div className="min-w-0">
                <div className="font-mono-data text-[11px] text-white font-bold truncate">
                  {t.name}
                </div>
                <div className="font-mono-data text-[10px] text-[#8B98A9]">
                  {t.hex}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. TYPOGRAPHY & RATIOS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#8B98A9]/20 pb-1.5 font-mono-data">
          <span className="text-xs font-bold text-[#8B98A9] uppercase tracking-widest">
            02 // TYPOGRAPHY SPECIFICATION
          </span>
          <span className="text-[10px] text-[#8B98A9]">SCALE & ROLES</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#161B22] border border-[#8B98A9]/30 p-4 rounded-[2px] space-y-2">
            <span className="font-mono-data text-[10px] text-[#8B98A9] uppercase block">
              HEADINGS // SPACE GROTESK
            </span>
            <div className="font-heading text-xl font-bold text-white">
              Orbital Insertion Sequence
            </div>
            <p className="text-xs text-[#8B98A9]">
              Clean geometric grotesk for strong section markers and landing anchors.
            </p>
          </div>

          <div className="bg-[#161B22] border border-[#8B98A9]/30 p-4 rounded-[2px] space-y-2">
            <span className="font-mono-data text-[10px] text-[#8B98A9] uppercase block">
              BODY COPY // INTER
            </span>
            <div className="text-sm text-[#E2E8F0]">
              Candidate evaluated through 4 simulated technical interviews and quantitative systems telemetry.
            </div>
            <p className="text-xs text-[#8B98A9]">
              High legibility neutral sans-serif designed for micro-reading.
            </p>
          </div>

          <div className="bg-[#161B22] border border-[#8B98A9]/30 p-4 rounded-[2px] space-y-2">
            <span className="font-mono-data text-[10px] text-[#8B98A9] uppercase block">
              DATA & TELEMETRY // JETBRAINS MONO
            </span>
            <div className="font-mono-data text-base font-bold text-[#3DFFA2]">
              UTC 14:32:08 // 54 / 100
            </div>
            <p className="text-xs text-[#8B98A9]">
              Tabular monospace numerals for clocks, logs, IDs, and gauges.
            </p>
          </div>
        </div>
      </section>

      {/* 3. BUTTONS & STAMPS SPEC */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#8B98A9]/20 pb-1.5 font-mono-data">
          <span className="text-xs font-bold text-[#8B98A9] uppercase tracking-widest">
            03 // BUTTONS & STAMP SPEC
          </span>
          <span className="text-[10px] text-[#8B98A9]">2-4PX CORNER RADIUS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PanelCard eyebrow="BUTTON STATES" title="Primary & Secondary Actions">
            <div className="space-y-3 pt-1">
              <Button variant="primary" icon={<ArrowRight size={14} />}>
                Primary Signal Action (#FF5A1F)
              </Button>
              <Button variant="secondary">
                Secondary Steel Action (#0E1116)
              </Button>
              <Button variant="destructive">
                Destructive Command Action
              </Button>
              <Button variant="secondary" disabled>
                Disabled Action (System Locked)
              </Button>
            </div>
          </PanelCard>

          <PanelCard eyebrow="STAMP BADGES" title="Angled Telemetry Stamps">
            <div className="flex flex-wrap gap-3 items-center pt-2">
              <StatusStamp label="NOMINAL" tone="phosphor" rotation="-rotate-2" />
              <StatusStamp label="OPERATIONAL" tone="phosphor" rotation="rotate-2" />
              <StatusStamp label="PRE-LAUNCH" tone="amber" rotation="-rotate-3" />
              <StatusStamp label="ACTION REQUIRED" tone="signal" rotation="rotate-1" />
              <StatusStamp label="DEBRIEF COMPLETE" tone="phosphor" rotation="-rotate-1" />
              <StatusStamp label="OFFICIAL RECORD" tone="paper" rotation="rotate-2" />
              <StatusStamp label="CADET TIER" tone="steel" rotation="rotate-0" />
            </div>
          </PanelCard>
        </div>
      </section>

      {/* 4. CARDS SPEC */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#8B98A9]/20 pb-1.5 font-mono-data">
          <span className="text-xs font-bold text-[#8B98A9] uppercase tracking-widest">
            04 // BRIEFING VS PANEL CARDS
          </span>
          <span className="text-[10px] text-[#8B98A9]">MATERIAL CONTRAST</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BriefingCard
            eyebrow="DOCUMENT ID // APG-DOC-770"
            title="Warm Briefing Card (#F2EBDD)"
            docId="DECK-3 // SECTOR-A"
            stamp={<StatusStamp label="OFFICIAL RECORD" tone="paper" />}
          >
            <p className="text-xs text-[#0E1116] leading-relaxed">
              Warm paper card with hard offset shadow and dark ink typography. Used for key mission briefs, score summaries, and flight crew records.
            </p>
          </BriefingCard>

          <PanelCard
            eyebrow="SURFACE ID // DECK-CONSOLE"
            title="Dark Console Panel (#161B22)"
            status={<StatusStamp label="OPERATIONAL" tone="phosphor" />}
            footer="CROSSHAIR REGISTRATION MARKS EMBEDDED"
          >
            <p className="text-xs text-[#8B98A9] leading-relaxed">
              Dark ink raised panel with scanline overlay and corner registration marks. Used for interactive forms, code workbench, and live telemetry feeds.
            </p>
          </PanelCard>
        </div>
      </section>
    </div>
  );
}

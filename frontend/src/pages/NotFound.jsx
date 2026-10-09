import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import BriefingCard from '../components/BriefingCard';
import Button from '../components/Button';
import StatusStamp from '../components/StatusStamp';
import { Compass, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-6">
      <BriefingCard
        eyebrow="ORBITAL TRAJECTORY LOST // 404"
        title="Unknown Flight Coordinates"
        docId="NAV ERROR // APG-404"
        stamp={<StatusStamp label="OFF COURSE" tone="signal" />}
      >
        <div className="space-y-4 py-2">
          <p className="text-sm text-[#0E1116] leading-relaxed">
            The requested console sector or mission telemetry could not be located in Apogee Mission Control.
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              onClick={() => navigate('/mission-control')}
              icon={<Compass size={14} />}
            >
              Return to Mission Control
            </Button>
          </div>
        </div>
      </BriefingCard>
    </div>
  );
}

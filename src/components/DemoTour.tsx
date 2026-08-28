import React, { useState } from 'react';
import {
  Sparkles,
  PlayCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  ArrowRight,
  Activity,
  Truck,
  Wrench,
  Radio,
  Flame,
} from 'lucide-react';

interface DemoTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onSelectVehicle127: () => void;
  onTriggerScheduleVehicle127: () => void;
}

export const DemoTour: React.FC<DemoTourProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onSelectVehicle127,
  onTriggerScheduleVehicle127,
}) => {
  if (!isOpen) return null;

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Step 1 — Fleet Operations Overview',
      summary: 'Connected fleets generate overwhelming telemetry volume.',
      detail:
        'Notice the KPIs: 50 vehicles, 48 active, 1,284 events/min, and 3 critical exceptions requiring attention. Fleet health score is 92/100.',
      actionLabel: 'Go to Live Fleet',
      onExecute: () => onNavigateTab('live_fleet'),
    },
    {
      title: 'Step 2 — Live Fleet Telemetry Stream',
      summary: 'MQTT Ingestion continuously collects sensor streams.',
      detail:
        'Watch incoming telemetry topics arriving over MQTT (broker.fleetive.internal:1883). Locate Vehicle V127 in the connected 50-unit telemetry grid.',
      actionLabel: 'Trigger V127 Overheating Anomaly',
      onExecute: () => onNavigateTab('live_fleet'),
    },
    {
      title: 'Step 3 — Trigger Anomaly Simulation',
      summary: 'Simulate thermal climb: 97°C → 101°C → 104°C → 105°C + Coolant Warning.',
      detail:
        'Watch as V127 exceeds calibrated baseline thresholds and broadcasts coolant diagnostic fault code DTC P0217.',
      actionLabel: 'Inspect AI Triage (AI Exceptions)',
      onExecute: () => onNavigateTab('exceptions'),
    },
    {
      title: 'Step 4 — AI Exception Created',
      summary: 'Vehicle V127 — Potential Cooling System Failure (Risk: 87%).',
      detail:
        'AI analyzes correlated sensor streams, computes transparent Risk Score (Severity × Probability × Business Impact), and prioritizes above background noise.',
      actionLabel: 'Open Exception Detail',
      onExecute: () => onSelectVehicle127(),
    },
    {
      title: 'Step 5 — Time-Series Sensor Charts & Event Timeline',
      summary: 'Root-cause timeline connects sensor data directly to AI decision.',
      detail:
        'Review the interactive temperature chart with shaded normal operating bands (85–95°C) and the step-by-step event timeline from 08:10 to 14:48.',
      actionLabel: 'Review AI Reasoning Panel',
      onExecute: () => {},
    },
    {
      title: 'Step 6 — AI Reasoning & Decision Support',
      summary: 'What happened → Why it matters → What could happen → Recommended action.',
      detail:
        'AI explains why the anomaly matters with 87% confidence, predicting downtime risk prevention and recommending a cooling inspection within 24 hours.',
      actionLabel: 'Schedule Inspection (Human-in-the-Loop)',
      onExecute: () => onTriggerScheduleVehicle127(),
    },
    {
      title: 'Step 7 — Human-in-the-Loop Approval',
      summary: 'AI never auto-executes high-impact changes without operator approval.',
      detail:
        'Review modal details: Target Vehicle V127, Priority High, Suggested timeframe Within 24h, Assigned to Maintenance Bay.',
      actionLabel: 'Confirm & Complete Loop',
      onExecute: () => onTriggerScheduleVehicle127(),
    },
    {
      title: 'Step 8 — Action Scheduled: Loop Complete',
      summary: 'DETECT → PRIORITIZE → EXPLAIN → RECOMMEND → ACT',
      detail:
        'The exception transitions to "Action Scheduled" and automatically logs into the Maintenance work queue with complete audit traceability.',
      actionLabel: 'Finish Tour',
      onExecute: () => onClose(),
    },
  ];

  const step = steps[currentStep];

  const handleNext = () => {
    step.onExecute();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-xl w-full px-4 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 text-white rounded-2xl border border-indigo-500/50 shadow-2xl p-5 backdrop-blur-md">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              3-Minute Interview Demo Walkthrough
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Close demo guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>{step.title}</span>
          </h3>
          <p className="text-xs text-indigo-200 font-semibold">{step.summary}</p>
          <p className="text-xs text-slate-300 leading-relaxed">{step.detail}</p>
        </div>

        {/* Stepper Footer Controls */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <div className="flex items-center gap-1">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentStep ? 'w-4 bg-indigo-500' : 'w-1 bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
          >
            <span>{step.actionLabel}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

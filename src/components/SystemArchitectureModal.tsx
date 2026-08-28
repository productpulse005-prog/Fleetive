import React from 'react';
import {
  X,
  Server,
  Radio,
  Cpu,
  Layers,
  Database,
  ShieldAlert,
  Sparkles,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  Code,
  Info,
} from 'lucide-react';

interface SystemArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemArchitectureModal: React.FC<SystemArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const architectureSteps = [
    {
      step: 1,
      title: 'Vehicle Sensors & Telematics Unit',
      subtitle: 'Edge Hardware Simulation',
      icon: Radio,
      color: 'from-blue-600 to-indigo-600',
      description:
        'Continuous sampling of CAN-bus parameters (engine temp, battery voltage, speed, RPM, fuel level, GPS, DTC fault codes, accelerometer G-forces).',
      tech: 'CAN Bus 2.0B • OBD-II • J1939 Telematics Unit',
    },
    {
      step: 2,
      title: 'MQTT Ingestion Broker',
      subtitle: 'High-Throughput IoT Transport',
      icon: Server,
      color: 'from-indigo-600 to-violet-600',
      description:
        'Vehicles publish JSON payloads over structured topics (vehicle/{id}/telemetry, vehicle/{id}/diagnostics, vehicle/{id}/safety) with QoS 1 reliability.',
      tech: 'EMQX / Mosquitto MQTT Broker • TLS 1.3 • Port 1883/8883',
    },
    {
      step: 3,
      title: 'Cloud Ingestion & Event Processing',
      subtitle: 'Stream Buffer & Partitioning',
      icon: Layers,
      color: 'from-violet-600 to-purple-600',
      description:
        'Incoming packet validation, schema conformance checking, timestamp indexing, and high-frequency streaming pipeline ingestion.',
      tech: 'Apache Kafka / GCP PubSub • Cloud Functions Consumer',
    },
    {
      step: 4,
      title: 'Time-Series & Telemetry Store',
      subtitle: 'High-Density Metric Storage',
      icon: Database,
      color: 'from-purple-600 to-pink-600',
      description:
        'Storage of continuous metric streams for historical baseline modeling and rapid windowed metric queries.',
      tech: 'TimescaleDB / InfluxDB / Bigtable • 30-Day Window Retention',
    },
    {
      step: 5,
      title: 'Anomaly Detection Engine',
      subtitle: 'Statistical & Rule-Based Filtering',
      icon: ShieldAlert,
      color: 'from-amber-600 to-orange-600',
      description:
        'Multi-variate baseline comparison: detects thermal climb gradients, cranking voltage sag, recurring DTC faults, and excessive idle deviation.',
      tech: 'Z-Score Analysis • Moving Average Drift • Telematics DTC Triager',
    },
    {
      step: 6,
      title: 'AI Reasoning & Prioritization',
      subtitle: 'LLM & Transparent Risk Scoring',
      icon: Sparkles,
      color: 'from-emerald-600 to-teal-600',
      description:
        'AI analyzes correlated sensor timelines, computes normalized Risk Score (Severity × Probability × Business Impact), explains root-cause, and suggests timeframe.',
      tech: 'Gemini 3.7 Flash + Deterministic Risk Scoring Model',
    },
    {
      step: 7,
      title: 'Fleetive Dispatcher Application',
      subtitle: 'Single Pane Operations Copilot',
      icon: Cpu,
      color: 'from-teal-600 to-cyan-600',
      description:
        'Presents ranked, explainable operational exceptions with sensor charts and one-click maintenance action workflows.',
      tech: 'React 19 • Tailwind CSS • Express API',
    },
    {
      step: 8,
      title: 'Human-in-the-Loop Operator Action',
      subtitle: 'Decisive Operational Triage',
      icon: UserCheck,
      color: 'from-cyan-600 to-blue-600',
      description:
        'Fleet manager approves inspection, dispatches driver coaching, or schedules terminal service with automated work order generation.',
      tech: 'Maintenance Queue • SMS/Email Webhooks • ERP Integration',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Fleetive System & Telematics Architecture
              </h2>
              <p className="text-xs text-slate-300">
                End-to-End Pipeline: Sensors → MQTT → Cloud Ingestion → Anomaly Detection → AI Copilot → Action
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg transition-colors"
            aria-label="Close architecture modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Architecture Pipeline Stepper */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Complete Operational Loop Architecture
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {architectureSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.step}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg bg-gradient-to-br ${step.color} text-white flex items-center justify-center text-xs font-bold shadow-xs`}
                        >
                          {step.step}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900 group-hover:text-indigo-700 transition-colors">
                            {step.title}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium">
                            {step.subtitle}
                          </div>
                        </div>
                      </div>
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>

                    <div className="pt-1.5 border-t border-slate-200/80 flex items-center gap-1.5 text-[10px] font-mono text-indigo-700">
                      <Code className="w-3 h-3 text-indigo-500" />
                      <span>{step.tech}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transparent Risk Score Formula Box */}
          <div className="bg-indigo-50/80 rounded-xl p-4 border border-indigo-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-indigo-950">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Prototype AI Risk Prioritization Formula</span>
            </div>
            <div className="font-mono text-xs font-bold text-indigo-900 bg-white p-2.5 rounded-lg border border-indigo-200">
              Risk Score (0–100) = Severity Weight × Failure Probability × Business Impact Weight
            </div>
            <p className="text-xs text-indigo-900 leading-relaxed">
              Every exception generated by Fleetive is scored transparently so fleet managers understand
              exact operational trade-offs without opaque &quot;black-box&quot; decisions.
            </p>
          </div>

          {/* Official Engineering Disclaimer */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <div className="font-bold">Prototype Architecture Note</div>
              <p className="leading-relaxed">
                This prototype simulates connected fleet telemetry and demonstrates the product architecture concept.
                Production implementations would require enterprise-grade security, reliability, device authentication,
                data governance and scalable infrastructure.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Simulated Fleet Pipeline: 50 Connected Vehicles • 1,284 Events/min
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            Close Architecture
          </button>
        </div>
      </div>
    </div>
  );
};

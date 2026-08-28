import React, { useState } from 'react';
import { Settings, Shield, Bell, Cpu, Sliders, CheckCircle2, RefreshCw, Server, ArrowRight, Radio } from 'lucide-react';

interface SettingsViewProps {
  onSaveSettings: () => void;
  onOpenArchitecture?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onSaveSettings, onOpenArchitecture }) => {
  const [thermalThreshold, setThermalThreshold] = useState(100);
  const [voltageThreshold, setVoltageThreshold] = useState(11.8);
  const [brakingGThreshold, setBrakingGThreshold] = useState(0.45);
  const [autoTriageCritical, setAutoTriageCritical] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    setSavedToast(true);
    onSaveSettings();
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-200 pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System & AI Settings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure autonomous telematics anomaly detection thresholds and alerting triggers
          </p>
        </div>

        {savedToast && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Settings saved
          </span>
        )}
      </div>

      {/* System Architecture Quick Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Telematics Pipeline & System Architecture</div>
            <div className="text-xs text-slate-400">
              Sensors → MQTT Broker → Cloud Ingestion → Anomaly Detection → AI Copilot → Operator Action
            </div>
          </div>
        </div>

        {onOpenArchitecture && (
          <button
            onClick={onOpenArchitecture}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shrink-0 transition-colors shadow-xs"
          >
            <span>Inspect Architecture Diagram</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Thresholds Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <span>Telemetry Anomaly Thresholds</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">
              Engine Overheat Alarm (°C)
            </label>
            <input
              type="number"
              value={thermalThreshold}
              onChange={(e) => setThermalThreshold(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold"
            />
            <span className="text-[11px] text-slate-400">Baseline default: 95°C</span>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">
              Low Battery Cranking (V)
            </label>
            <input
              type="number"
              step="0.1"
              value={voltageThreshold}
              onChange={(e) => setVoltageThreshold(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold"
            />
            <span className="text-[11px] text-slate-400">Baseline default: 12.2V</span>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">
              Harsh Deceleration Threshold (g)
            </label>
            <input
              type="number"
              step="0.05"
              value={brakingGThreshold}
              onChange={(e) => setBrakingGThreshold(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold"
            />
            <span className="text-[11px] text-slate-400">Standard safety: -0.40g</span>
          </div>
        </div>
      </div>

      {/* Autonomous Behavior */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
          <Cpu className="w-4 h-4 text-indigo-600" />
          <span>AI Copilot Autonomous Workflow</span>
        </div>

        <div className="space-y-4 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <div className="font-bold text-slate-800">Auto-Prioritize Critical Diagnostics</div>
              <div className="text-slate-500 text-[11px]">
                Immediately flag coolant, brake thermal, and battery sag events above 80% risk
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoTriageCritical}
              onChange={(e) => setAutoTriageCritical(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <div className="font-bold text-slate-800">Dispatch Notification Webhooks</div>
              <div className="text-slate-500 text-[11px]">
                Send instant alerts to on-duty fleet operations manager
              </div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
          </label>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

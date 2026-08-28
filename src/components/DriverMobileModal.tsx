import React, { useState } from 'react';
import {
  Smartphone,
  X,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Phone,
  Navigation,
  Clock,
  ShieldAlert,
  Thermometer,
  Gauge,
  Send,
  MessageSquare,
  Truck,
  Check,
} from 'lucide-react';
import { Exception, Vehicle } from '../types';

interface DriverMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  exception: Exception | null;
  vehicle: Vehicle | null;
  onAcknowledgeAlert?: (exceptionId: string) => void;
  onContactDispatcher?: (driverName: string, message: string) => void;
}

export const DriverMobileModal: React.FC<DriverMobileModalProps> = ({
  isOpen,
  onClose,
  exception,
  vehicle,
  onAcknowledgeAlert,
  onContactDispatcher,
}) => {
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [customReport, setCustomReport] = useState('');
  const [reportSent, setReportSent] = useState(false);

  if (!isOpen || !exception) return null;

  const vehicleName = vehicle ? `Vehicle ${vehicle.id} (${vehicle.makeModel})` : `Vehicle ${exception.vehicleId}`;
  const driverName = vehicle?.assignedDriver || 'Driver (Rajesh Kumar)';
  const opContext = exception.operationalContext;

  const handleAcknowledge = () => {
    setIsAcknowledged(true);
    if (onAcknowledgeAlert) {
      onAcknowledgeAlert(exception.id);
    }
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customReport.trim()) return;
    setReportSent(true);
    if (onContactDispatcher) {
      onContactDispatcher(driverName, customReport);
    }
    setTimeout(() => {
      setCustomReport('');
      setReportSent(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 rounded-[40px] p-4 shadow-2xl border-4 border-slate-700">
        {/* Smartphone Speaker & Camera Notch */}
        <div className="flex justify-center mb-3">
          <div className="w-28 h-4 bg-slate-950 rounded-full flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-800"></div>
            <div className="w-10 h-1.5 rounded-full bg-slate-800"></div>
          </div>
        </div>

        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Inner Mobile Screen */}
        <div className="bg-slate-950 rounded-[28px] overflow-hidden border border-slate-800 text-slate-100 flex flex-col h-[680px]">
          {/* Top Mobile Status Bar */}
          <div className="px-5 py-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/80 bg-slate-900/50">
            <span>Fleetive Driver Link</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>5G Connected</span>
              <span>14:48</span>
            </div>
          </div>

          {/* Scrollable Mobile Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Header: Driver Greeting & Active Vehicle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Logged in Driver</div>
                <div className="text-sm font-bold text-white">{driverName}</div>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-indigo-300 font-semibold flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-indigo-400" />
                V{exception.vehicleId}
              </span>
            </div>

            {/* In-Cab Vehicle Alert Banner */}
            <div
              className={`p-4 rounded-2xl border ${
                exception.severity === 'Critical'
                  ? 'bg-rose-950/70 border-rose-600/80 text-rose-100'
                  : 'bg-amber-950/70 border-amber-600/80 text-amber-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    exception.severity === 'Critical' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                  }`}
                >
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-rose-300">
                    High Priority Telematics Advisory
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-0.5">
                    Vehicle Alert: V{exception.vehicleId}
                  </h3>
                  <p className="text-xs text-slate-200 mt-1 font-medium leading-relaxed">
                    Potential vehicle issue detected.
                  </p>
                </div>
              </div>

              {/* Plain language in-cab message */}
              <div className="mt-3 p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 text-xs text-slate-200 leading-relaxed font-mono">
                {exception.id === 'exc-127'
                  ? '⚠️ "A cooling-system issue may be developing. Engine coolant temperature reached 105°C. Avoid heavy acceleration and report gauge status to dispatch."'
                  : exception.id === 'exc-084'
                  ? '⚠️ "Elevated deceleration g-forces detected near downtown intersection. Construction detour ahead; maintain 4-second gap distance."'
                  : `⚠️ "${exception.whatHappened}"`}
              </div>
            </div>

            {/* Operational Route Context */}
            {opContext && (
              <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Navigation className="w-3.5 h-3.5 text-indigo-400" />
                    Current Mission
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {opContext.slaStatus === 'on_track' ? '● SLA On Track' : '▲ SLA At Risk'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Route:</span>
                    <span className="font-semibold text-slate-200">{opContext.currentRoute}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Next Stop:</span>
                    <span className="font-semibold text-slate-200">{opContext.nextStop}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">ETA:</span>
                    <span className="font-mono font-bold text-white">{opContext.eta}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">SLA Deadline:</span>
                    <span className="font-mono font-bold text-indigo-300">{opContext.slaDeadline}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Driver Action Buttons */}
            <div className="space-y-2.5 pt-1">
              {isAcknowledged ? (
                <div className="w-full py-3 px-4 bg-emerald-950/80 border border-emerald-500/80 text-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Alert Acknowledged by Driver (14:48)</span>
                </div>
              ) : (
                <button
                  onClick={handleAcknowledge}
                  className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Acknowledge Alert</span>
                </button>
              )}

              <button
                onClick={() => setShowCallModal(true)}
                className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-indigo-400" />
                <span>Contact Fleet Operations (Dispatch)</span>
              </button>
            </div>

            {/* Quick Cab Telemetry Status Report */}
            <form onSubmit={handleSendReport} className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-2">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                <span>Quick Driver Notes / Gauge Reading:</span>
                {reportSent && <span className="text-emerald-400 text-[10px] font-bold">Sent to Dispatch!</span>}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customReport}
                  onChange={(e) => setCustomReport(e.target.value)}
                  placeholder="e.g. Temp gauge shows 104°C, coolant light is on"
                  className="flex-1 bg-slate-950 text-xs px-3 py-2 rounded-xl border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!customReport.trim()}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl disabled:opacity-40 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Smartphone Bottom Home Bar */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex justify-center">
            <div className="w-32 h-1 bg-slate-600 rounded-full"></div>
          </div>
        </div>

        {/* Dispatcher Voice Call Overlay */}
        {showCallModal && (
          <div className="absolute inset-0 bg-slate-950/95 rounded-[40px] p-8 flex flex-col items-center justify-center text-center space-y-5 animate-in fade-in">
            <div className="w-20 h-20 rounded-full bg-indigo-600/20 border-2 border-indigo-500 flex items-center justify-center animate-pulse">
              <Phone className="w-10 h-10 text-indigo-400" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-indigo-400">Connecting...</div>
              <h3 className="text-lg font-bold text-white mt-1">Fleet Operations Dispatch</h3>
              <p className="text-xs text-slate-400 mt-1">Direct Line: +1 (800) 555-FLEET</p>
            </div>
            <button
              onClick={() => setShowCallModal(false)}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-full transition-colors"
            >
              End Call
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  Wrench,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Truck,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { Exception } from '../types';

interface ScheduleActionModalProps {
  exception: Exception | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSchedule: (
    exceptionId: string,
    details: {
      timeframe: string;
      assignedTeam: string;
      notes: string;
      priority: string;
    }
  ) => void;
}

export const ScheduleActionModal: React.FC<ScheduleActionModalProps> = ({
  exception,
  isOpen,
  onClose,
  onConfirmSchedule,
}) => {
  if (!isOpen || !exception) return null;

  const [timeframe, setTimeframe] = useState(exception.suggestedTimeframe || 'Within 24 hours');
  const [assignedTeam, setAssignedTeam] = useState(exception.assignedTeam || 'Maintenance Team');
  const [priority, setPriority] = useState(exception.severity || 'High');
  const [notes, setNotes] = useState(
    `Proactive service order created by Fleetive AI Copilot for ${exception.title}. Refer to telematics diagnostic event history.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      onConfirmSchedule(exception.id, {
        timeframe,
        assignedTeam,
        notes,
        priority,
      });

      // Auto close after brief success confirmation preview
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1400);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {isSuccess ? (
          /* Success State */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Inspection Scheduled</h3>
              <p className="text-sm text-slate-600">
                Vehicle <strong className="font-semibold text-slate-900">{exception.vehicleId}</strong> has
                been added to the maintenance queue.
              </p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 font-medium">
              Status updated to: <strong>Action scheduled</strong>
            </div>
          </div>
        ) : (
          /* Form Content */
          <>
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {exception.title.toLowerCase().includes('coaching')
                      ? 'Schedule Driver Coaching'
                      : exception.title.toLowerCase().includes('route')
                      ? 'Dispatch Route Correction'
                      : 'Schedule Inspection'}
                  </h3>
                  <p className="text-xs text-slate-500">Autonomous workflow work order confirmation</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              {/* Vehicle & Issue Readonly Summary */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Vehicle
                  </span>
                  <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                    {exception.vehicleId}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Priority
                  </span>
                  <div className="mt-0.5">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        priority === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {priority}
                    </span>
                  </div>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Issue
                  </span>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">{exception.title}</div>
                </div>
              </div>

              {/* Suggested Timeframe */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Suggested Timeframe</label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="Immediate (Next 2 hours)">Immediate (Next 2 hours)</option>
                  <option value="Within 24 hours">Within 24 hours (Recommended)</option>
                  <option value="Within 48 hours">Within 48 hours</option>
                  <option value="Within 3 days">Within 3 days</option>
                  <option value="Next Routine Maintenance Interval">Next Routine Maintenance Interval</option>
                </select>
              </div>

              {/* Assigned Team */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Assigned Team / Workcenter</label>
                <select
                  value={assignedTeam}
                  onChange={(e) => setAssignedTeam(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="Maintenance Team">Maintenance Team (Main Depot)</option>
                  <option value="Depot Service Bay 4">Depot Service Bay 4 (Thermal Diagnostics)</option>
                  <option value="Driver Operations">Driver Operations / Safety Team</option>
                  <option value="Dispatch Operations">Dispatch Operations Team</option>
                  <option value="Roadside Rapid Response">Roadside Rapid Response Unit</option>
                </select>
              </div>

              {/* Service / Dispatch Notes */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Service Instructions / Dispatch Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Scheduling...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Schedule</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

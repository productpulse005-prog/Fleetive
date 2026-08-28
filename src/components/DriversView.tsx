import React from 'react';
import { Users, Shield, AlertTriangle, Phone, CheckCircle2, UserCheck } from 'lucide-react';
import { Driver } from '../types';

interface DriversViewProps {
  drivers: Driver[];
  onOpenCoaching: (driver: Driver) => void;
}

export const DriversView: React.FC<DriversViewProps> = ({ drivers, onOpenCoaching }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Driver Safety & Operations</h1>
        <p className="text-sm text-slate-500 mt-1">
          Telematics-derived driver behavior, safety scorecards, and AI coaching assignments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {drivers.map((driver) => {
          const isAtRisk = driver.safetyScore < 80;

          return (
            <div
              key={driver.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between ${
                isAtRisk ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    {driver.avatarInitials}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Safety Score</span>
                    <div
                      className={`text-lg font-black ${
                        driver.safetyScore >= 90
                          ? 'text-emerald-600'
                          : driver.safetyScore >= 80
                          ? 'text-indigo-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {driver.safetyScore}/100
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{driver.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">Assigned Vehicle {driver.assignedVehicleId}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px]">Harsh Braking</span>
                    <div className="font-semibold text-slate-800">{driver.harshBrakingRate}/100mi</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Speeding Flags</span>
                    <div className="font-semibold text-slate-800">{driver.speedingIncidents}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    driver.coachingStatus === 'Coaching Required'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {driver.coachingStatus}
                </span>

                <button
                  onClick={() => onOpenCoaching(driver)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Manage
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

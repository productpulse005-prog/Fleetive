import React from 'react';
import {
  Truck,
  AlertOctagon,
  AlertTriangle,
  WifiOff,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink,
  Radio,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Exception, FleetKPIs } from '../types';
import { trend7DaysData } from '../data/mockData';

interface OverviewProps {
  kpis: FleetKPIs;
  exceptions: Exception[];
  onSelectException: (exception: Exception) => void;
  onNavigateToExceptions: () => void;
  onNavigateToVehicles: () => void;
  onNavigateToLiveFleet?: () => void;
}

export const Overview: React.FC<OverviewProps> = ({
  kpis,
  exceptions,
  onSelectException,
  onNavigateToExceptions,
  onNavigateToVehicles,
  onNavigateToLiveFleet,
}) => {
  const criticalAndHigh = exceptions.filter(
    (e) => e.severity === 'Critical' || e.severity === 'High'
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Product Positioning Statement */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Telematics Intelligence</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Turn connected-vehicle data into operational decisions.
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Fleetive transforms high-volume vehicle telemetry and operational events into prioritized,
              explainable and actionable exceptions for fleet operators.
            </p>
          </div>

          {/* Workflow Stepper in Hero with Live Fleet Trigger */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-700/80 shrink-0 text-slate-300">
              <span className="text-slate-400">Sensors</span>
              <span className="text-slate-600">→</span>
              <span className="text-indigo-300 font-semibold">MQTT</span>
              <span className="text-slate-600">→</span>
              <span className="text-amber-300 font-semibold">AI Detection</span>
              <span className="text-slate-600">→</span>
              <span className="text-emerald-400 font-bold">Action</span>
            </div>

            {onNavigateToLiveFleet && (
              <button
                onClick={onNavigateToLiveFleet}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-300" />
                <span>Live Fleet Stream</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Good morning, Alex</h2>
          <p className="text-sm text-slate-500 mt-0.5">Here&apos;s what needs your attention today.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Last sync: 1 min ago • 250 connected vehicles</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Vehicles Total */}
        <button
          onClick={onNavigateToVehicles}
          className="text-left bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Vehicles
            </span>
            <Truck className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{kpis.totalVehicles}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <span>Class 6 & 8 fleet</span>
            <ArrowRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </button>

        {/* Active Vehicles */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Vehicles
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{kpis.activeVehicles}</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium flex items-center gap-1">
            <span>92.8% on active routes</span>
          </div>
        </div>

        {/* Critical Exceptions */}
        <button
          onClick={onNavigateToExceptions}
          className="text-left bg-rose-50/70 p-5 rounded-xl border border-rose-200 shadow-xs hover:border-rose-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-800">
              Critical Exceptions
            </span>
            <AlertOctagon className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-950 tracking-tight">
            {kpis.criticalExceptions}
          </div>
          <div className="text-[11px] text-rose-700 mt-1 font-semibold flex items-center gap-1">
            <span>Immediate action needed</span>
            <ArrowRight className="w-3 h-3 text-rose-600 transition-transform group-hover:translate-x-0.5" />
          </div>
        </button>

        {/* Vehicles At Risk */}
        <button
          onClick={onNavigateToVehicles}
          className="text-left bg-amber-50/70 p-5 rounded-xl border border-amber-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Vehicles At Risk
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-950 tracking-tight">
            {kpis.vehiclesAtRisk}
          </div>
          <div className="text-[11px] text-amber-700 mt-1 font-medium">
            <span>Telemetry drift detected</span>
          </div>
        </button>

        {/* Vehicles Offline */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Vehicles Offline
            </span>
            <WifiOff className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{kpis.vehiclesOffline}</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            <span>Depot service bays</span>
          </div>
        </div>
      </div>

      {/* Main Analytics Row: AI Fleet Health Card & 7-Day Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AI Fleet Health Card (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                AI Fleet Health Index
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                Stable
              </span>
            </div>

            <div className="mt-5 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {kpis.fleetHealthScore}
              </span>
              <span className="text-lg font-bold text-slate-400">/ 100</span>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${kpis.fleetHealthScore}%` }}
              ></div>
            </div>

            <p className="text-xs text-slate-600 mt-4 leading-relaxed font-medium">
              Overall fleet health is stable, but{' '}
              <strong className="text-rose-600 font-semibold">5 high-priority exceptions</strong>{' '}
              require attention before dispatch schedules are impacted.
            </p>
          </div>

          {/* Quick Anomaly Noise Reduction Stats */}
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-500" />
                Raw telematics events (24h)
              </span>
              <span className="font-semibold text-slate-800">4,820</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                AI-prioritized exceptions
              </span>
              <span className="font-bold text-indigo-600">{exceptions.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Noise reduction ratio
              </span>
              <span className="font-bold text-emerald-700">99.85%</span>
            </div>
          </div>
        </div>

        {/* 7-Day Trend Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Exceptions over the last 7 days
              </h3>
              <p className="text-xs text-slate-500">
                Breakdown by Critical, High, and Medium priority categories
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Critical
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> High
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span> Medium
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend7DaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="critical" name="Critical" fill="#f43f5e" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="high" name="High" fill="#f59e0b" radius={[0, 0, 0, 0]} stackId="a" />
                <Bar dataKey="medium" name="Medium" fill="#3b82f6" radius={[0, 0, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Prominent Section: High Priority Action Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Highest Priority AI Exceptions</h3>
            <p className="text-xs text-slate-500">
              Ranked by composite AI Risk Score (Severity × Probability × Impact)
            </p>
          </div>
          <button
            onClick={onNavigateToExceptions}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
          >
            <span>View all {exceptions.length} exceptions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {criticalAndHigh.slice(0, 3).map((exc) => (
            <div
              key={exc.id}
              onClick={() => onSelectException(exc)}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    Vehicle {exc.vehicleId}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        exc.severity === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {exc.severity}
                    </span>
                    <span className="text-xs font-extrabold text-slate-800 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                      {exc.riskScore}%
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {exc.title}
                </h4>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {exc.aiSummary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] font-medium text-slate-500">
                  Action: <span className="text-slate-800 font-semibold">{exc.suggestedTimeframe}</span>
                </div>
                <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Inspect <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

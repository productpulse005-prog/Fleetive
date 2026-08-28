import React from 'react';
import {
  BarChart3,
  Clock,
  ShieldCheck,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  DollarSign,
  AlertOctagon,
  Percent,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { productMetrics, trend7DaysData } from '../data/mockData';

export const AnalyticsView: React.FC = () => {
  const noiseReductionComparison = [
    { name: 'Raw Telematics', events: 4820, label: '4,820 Events' },
    { name: 'Anomaly Filter', events: 42, label: '42 Outliers' },
    { name: 'Prioritized Exceptions', events: 7, label: '7 Critical Actions' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header with Prototype Data disclaimer badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Operational AI Impact Analytics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Prototype Data
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Quantifying time saved, downtime avoided, and AI decision support accuracy
          </p>
        </div>
      </div>

      {/* Hero Headline KPI Card: Average time saved per dispatcher */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-8 border border-indigo-800/60 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Primary Fleet Efficiency KPI</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Estimated 2.7 hours saved per dispatcher / day
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            By automatically filtering 99.85% of benign telematics noise and structuring root-cause
            explanations, dispatchers make immediate maintenance and safety decisions without manual triage.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs flex flex-col items-center justify-center min-w-[200px] shrink-0">
          <span className="text-[11px] uppercase font-bold text-indigo-200">Noise Filtering</span>
          <span className="text-4xl font-black text-emerald-400 mt-1">99.85%</span>
          <span className="text-[11px] text-slate-300 mt-1">4,820 → 7 items</span>
        </div>
      </div>

      {/* 6 Core Product Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Critical Exceptions */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Critical Detected
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {productMetrics.criticalExceptionsDetected}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Past 30 days</div>
        </div>

        {/* Avg Time to Acknowledge */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Avg Triage Time
          </span>
          <div className="text-2xl font-black text-indigo-600 mt-1">
            {productMetrics.averageTimeToAcknowledge}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">-68% vs baseline</div>
        </div>

        {/* Exceptions Resolved */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Resolution Rate
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {productMetrics.exceptionsResolvedRate}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Closed within SLA</div>
        </div>

        {/* Predicted Downtime Avoided */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Downtime Avoided
          </span>
          <div className="text-xl font-black text-slate-900 mt-1">
            $148k
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">~312 vehicle hrs</div>
        </div>

        {/* False Positive Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            False Positive Rate
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {productMetrics.falsePositiveRate}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Audited monthly</div>
        </div>

        {/* AI Acceptance Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            AI Acceptance Rate
          </span>
          <div className="text-2xl font-black text-indigo-600 mt-1">
            {productMetrics.aiRecommendationAcceptanceRate}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Human approvals</div>
        </div>
      </div>

      {/* Visual Funnel Comparison Chart: Telematics Noise Reduction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Noise Reduction Pipeline Funnel
            </h3>
            <p className="text-xs text-slate-500">
              Daily telemetry volume transformed into actionable human decisions
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={noiseReductionComparison}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#334155' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="events" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Historical Exception Triage Volume
            </h3>
            <p className="text-xs text-slate-500">
              Critical vs high priority exceptions processed over the last 7 days
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend7DaysData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="critical" stroke="#f43f5e" strokeWidth={2.5} name="Critical" />
                <Line type="monotone" dataKey="high" stroke="#f59e0b" strokeWidth={2} name="High" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

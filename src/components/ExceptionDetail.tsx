import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Truck,
  AlertOctagon,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Phone,
  Wrench,
  Activity,
  Gauge,
  Zap,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  HelpCircle,
  ChevronRight,
  Info,
  Navigation,
  DollarSign,
  ThumbsUp,
  ThumbsDown,
  Check,
  Smartphone,
  Layers,
  MapPin,
  Flame,
  BatteryCharging,
  Users,
  Compass,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';
import { Exception, Vehicle, AIFeedback } from '../types';
import { DriverMobileModal } from './DriverMobileModal';

interface ExceptionDetailProps {
  exception: Exception;
  vehicle: Vehicle;
  onBack: () => void;
  onOpenScheduleModal: (exception: Exception) => void;
  onContactDriver: (exception: Exception) => void;
  onDismiss: (exceptionId: string) => void;
  onFeedbackSubmit?: (exceptionId: string, feedback: AIFeedback) => void;
}

export const ExceptionDetail: React.FC<ExceptionDetailProps> = ({
  exception,
  vehicle,
  onBack,
  onOpenScheduleModal,
  onContactDriver,
  onDismiss,
  onFeedbackSubmit,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'temp' | 'voltage' | 'rpm'>('temp');
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [liveAnalysis, setLiveAnalysis] = useState<{
    whatHappened?: string;
    whyItMatters?: string;
    whatCouldHappen?: string;
    whatShouldIDo?: string;
    recommendedAction?: string;
    confidence?: number;
    source?: string;
  } | null>(null);

  // Driver mobile preview modal
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);

  // AI Feedback state
  const [feedbackVote, setFeedbackVote] = useState<'helpful' | 'unhelpful' | null>(
    exception.aiFeedback?.isHelpful === true
      ? 'helpful'
      : exception.aiFeedback?.isHelpful === false
      ? 'unhelpful'
      : null
  );
  const [feedbackReason, setFeedbackReason] = useState<
    'Incorrect' | 'Already resolved' | 'Low priority' | 'Not actionable' | 'Other' | undefined
  >(exception.aiFeedback?.reason);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(!!exception.aiFeedback);
  const [feedbackNotes, setFeedbackNotes] = useState(exception.aiFeedback?.feedbackNotes || '');

  // Trigger Gemini / Deterministic re-analysis
  const handleLiveReanalyze = async () => {
    setIsReanalyzing(true);
    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exception,
          vehicle,
          sensorEvents: exception.sensorTimeline,
        }),
      });
      const data = await response.json();
      if (data.success && data.analysis) {
        setLiveAnalysis({
          ...data.analysis,
          source: data.source,
        });
      }
    } catch (err) {
      console.error('Re-analysis error:', err);
    } finally {
      setIsReanalyzing(false);
    }
  };

  const handleVote = (vote: 'helpful' | 'unhelpful') => {
    setFeedbackVote(vote);
    if (vote === 'helpful') {
      const payload: AIFeedback = {
        isHelpful: true,
        submittedAt: new Date().toISOString(),
      };
      setFeedbackSubmitted(true);
      if (onFeedbackSubmit) onFeedbackSubmit(exception.id, payload);
    }
  };

  const handleReasonSubmit = (reason: 'Incorrect' | 'Already resolved' | 'Low priority' | 'Not actionable' | 'Other') => {
    setFeedbackReason(reason);
    const payload: AIFeedback = {
      isHelpful: false,
      reason,
      feedbackNotes,
      submittedAt: new Date().toISOString(),
    };
    setFeedbackSubmitted(true);
    if (onFeedbackSubmit) onFeedbackSubmit(exception.id, payload);
  };

  const opContext = exception.operationalContext;
  const currentHappened = liveAnalysis?.whatHappened || exception.whatHappened || exception.aiSummary;
  const currentWhy = liveAnalysis?.whyItMatters || exception.whyItMatters;
  const currentWhat = liveAnalysis?.whatCouldHappen || exception.whatCouldHappen;
  const currentShouldDo = liveAnalysis?.whatShouldIDo || exception.whatShouldIDo || exception.recommendedAction;
  const currentRec = liveAnalysis?.recommendedAction || exception.recommendedAction;
  const currentConf = liveAnalysis?.confidence || exception.confidence;

  const impactDims = exception.impactDimensions || {
    safety: 'Medium',
    uptime: 'Critical',
    cost: 'High',
    efficiency: 'Medium',
  };

  const getImpactBadgeClass = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'High':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to AI Exceptions</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDriverModalOpen(true)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-indigo-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
            <span>Driver In-Cab View</span>
          </button>

          <span className="text-xs text-slate-500 font-mono">ID: {exception.id}</span>
        </div>
      </div>

      {/* Hero Header: Vehicle + AI Risk + Action */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono font-bold text-sm px-3 py-1 bg-slate-900 text-white rounded-lg flex items-center gap-2">
                <Truck className="w-4 h-4 text-slate-300" />
                Vehicle {exception.vehicleId}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
                {vehicle.makeModel} ({vehicle.type})
              </span>
              <span
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  exception.severity === 'Critical'
                    ? 'bg-rose-100 text-rose-800 border-rose-200'
                    : exception.severity === 'High'
                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                    : 'bg-blue-100 text-blue-800 border-blue-200'
                }`}
              >
                {exception.severity}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  exception.status === 'Action Scheduled'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {exception.status}
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              {exception.title}
            </h1>

            <p className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
              <span>Driver: <strong className="text-slate-800 font-semibold">{vehicle.assignedDriver}</strong></span>
              <span>•</span>
              <span>Location: <strong className="text-slate-800 font-semibold">{vehicle.currentLocation}</strong></span>
              <span>•</span>
              <span>Logged: {exception.createdAt}</span>
            </p>
          </div>

          {/* AI Risk Score Badge & Primary Action Button */}
          <div className="flex items-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
            {/* Risk Score Pill */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center min-w-[130px] border border-slate-800">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                AI Risk Score
              </span>
              <span className="text-3xl font-black text-rose-400 mt-0.5">
                {exception.riskScore}%
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 font-medium">Prioritized Action</span>
            </div>

            {/* Action CTA */}
            {exception.status === 'Action Scheduled' ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold">Inspection Scheduled</div>
                  <div className="text-[11px] text-emerald-700">In maintenance work queue</div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onOpenScheduleModal(exception)}
                className="px-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Wrench className="w-4 h-4" />
                <span>Schedule Inspection</span>
              </button>
            )}
          </div>
        </div>

        {/* Section 5: OPERATIONAL CONTEXT BANNER */}
        {opContext && (
          <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-xl p-4 border border-indigo-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <Navigation className="w-3.5 h-3.5 text-indigo-400" />
                <span>Operational Route Context</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-800/80 text-indigo-200 border border-indigo-700 font-mono">
                  {opContext.stopsRemaining} stops remaining
                </span>
              </div>
              <p className="text-xs md:text-sm font-semibold text-white">
                {exception.id === 'exc-127'
                  ? 'V127 is showing potential overheating while actively operating on a delivery route (Pune → Mumbai) with 2 stops remaining.'
                  : `Active on ${opContext.currentRoute} from ${opContext.origin} to ${opContext.destination}.`}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs shrink-0 bg-white/10 px-4 py-2 rounded-lg border border-white/10">
              <div>
                <span className="text-[10px] text-indigo-200 block">ETA</span>
                <span className="font-mono font-bold text-emerald-300">{opContext.eta}</span>
              </div>
              <div className="w-px h-6 bg-white/20"></div>
              <div>
                <span className="text-[10px] text-indigo-200 block">SLA Deadline</span>
                <span className="font-mono font-bold text-white">{opContext.slaDeadline}</span>
              </div>
              <div className="w-px h-6 bg-white/20"></div>
              <div>
                <span className="text-[10px] text-indigo-200 block">SLA Status</span>
                <span className="font-bold text-emerald-400">
                  {opContext.slaStatus === 'on_track' ? '● On Track' : '▲ Delayed'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 7: 4-DIMENSIONAL OPERATIONAL IMPACT GRID */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">4-Dimensional Operational Impact</h2>
          </div>
          <span className="text-[11px] text-slate-500">Evaluated by AI Exception Engine</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Safety */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Safety</span>
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getImpactBadgeClass(impactDims.safety)}`}>
                {impactDims.safety}
              </span>
              <span className="text-[10px] text-slate-500">Hazard buffer</span>
            </div>
          </div>

          {/* Uptime */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Uptime</span>
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getImpactBadgeClass(impactDims.uptime)}`}>
                {impactDims.uptime}
              </span>
              <span className="text-[10px] text-slate-500">Availability</span>
            </div>
          </div>

          {/* Cost */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Cost</span>
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getImpactBadgeClass(impactDims.cost)}`}>
                {impactDims.cost}
              </span>
              <span className="text-[10px] text-slate-500">Est. repair / SLA</span>
            </div>
          </div>

          {/* Efficiency */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Efficiency</span>
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getImpactBadgeClass(impactDims.efficiency)}`}>
                {impactDims.efficiency}
              </span>
              <span className="text-[10px] text-slate-500">Fuel & route</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: "WHY THIS MATTERS" (4-Part Plain-Language Explanations) & Section 8 (Timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Sensor Timeline (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Why did AI flag this?</h2>
              <p className="text-xs text-slate-500">Correlated telematics & diagnostic event sequence</p>
            </div>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>

          {/* Visual Event Timeline */}
          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {exception.sensorTimeline.map((event, idx) => {
              const isCrit = event.status === 'critical';
              const isWarn = event.status === 'warning';

              return (
                <div key={event.id || idx} className="relative group">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 border-white ring-2 ${
                      isCrit
                        ? 'bg-rose-600 ring-rose-300'
                        : isWarn
                        ? 'bg-amber-500 ring-amber-200'
                        : 'bg-emerald-500 ring-emerald-200'
                    }`}
                  ></div>

                  <div className="bg-slate-50 hover:bg-slate-100/80 transition-colors p-3 rounded-xl border border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {event.time}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          isCrit
                            ? 'bg-rose-100 text-rose-800'
                            : isWarn
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {event.value}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 mt-1">
                      {event.metric}
                    </div>
                    {event.notes && (
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                        {event.notes}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Section 6 - Structured 4-Part "Why This Matters" Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-indigo-100 p-6 shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header & Re-analyze */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">AI Reasoning & Root-Cause Breakdown</h2>
                  <p className="text-xs text-slate-500">Section 6: Explainable 4-part decision structure</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLiveReanalyze}
                  disabled={isReanalyzing}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  title="Run real-time Gemini re-analysis"
                >
                  <RotateCcw className={`w-3 h-3 ${isReanalyzing ? 'animate-spin text-indigo-600' : ''}`} />
                  <span>{isReanalyzing ? 'Analyzing...' : 'Re-analyze with AI'}</span>
                </button>

                <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Confidence: {currentConf}%
                </span>
              </div>
            </div>

            {/* Part 1: What happened? */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-600" />
                1. What happened?
              </h3>
              <p className="text-xs md:text-sm text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60 font-medium">
                {currentHappened}
              </p>
            </div>

            {/* Part 2: Why does it matter? */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-indigo-600" />
                2. Why does it matter?
              </h3>
              <p className="text-xs md:text-sm text-slate-800 leading-relaxed bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 font-medium">
                {currentWhy}
              </p>
            </div>

            {/* Part 3: What could happen? */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                3. What could happen?
              </h3>
              <p className="text-xs md:text-sm text-slate-800 leading-relaxed bg-rose-50/60 p-3 rounded-xl border border-rose-100 font-medium">
                {currentWhat}
              </p>
            </div>

            {/* Part 4: What should I do? */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                4. What should I do?
              </h3>
              <p className="text-xs md:text-sm text-slate-900 leading-relaxed bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 font-semibold">
                {currentShouldDo}
              </p>
            </div>
          </div>

          {/* Section 13: AI Feedback Loop (Was this recommendation useful?) */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Was this AI recommendation useful?
                </span>
                <span className="text-[11px] text-slate-500">
                  Continuous feedback tunes the anomaly prioritization engine
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVote('helpful')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    feedbackVote === 'helpful'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful</span>
                </button>

                <button
                  onClick={() => handleVote('unhelpful')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    feedbackVote === 'unhelpful'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>Not useful</span>
                </button>
              </div>
            </div>

            {/* If Unhelpful, prompt with reasons */}
            {feedbackVote === 'unhelpful' && !feedbackSubmitted && (
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 space-y-2 animate-in fade-in">
                <span className="text-xs font-bold text-rose-900 block">
                  Why was this recommendation not useful?
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(['Incorrect', 'Already resolved', 'Low priority', 'Not actionable', 'Other'] as const).map(
                    (reason) => (
                      <button
                        key={reason}
                        onClick={() => handleReasonSubmit(reason)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                          feedbackReason === reason
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {reason}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {feedbackSubmitted && (
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Thank you! Feedback recorded to improve Fleetive AI accuracy.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 10: RANKED NEXT-BEST ACTIONS */}
      {exception.nextBestActions && exception.nextBestActions.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Ranked Next-Best Actions</h2>
              <p className="text-xs text-slate-500">
                AI recommends prioritized operational steps while keeping the operator in control
              </p>
            </div>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exception.nextBestActions.map((action) => (
              <div
                key={action.rank}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                  action.rank === 1
                    ? 'bg-indigo-50/70 border-indigo-200 ring-1 ring-indigo-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                        action.rank === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-700'
                      }`}
                    >
                      {action.rank}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      {action.timeframe}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 leading-snug">{action.title}</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{action.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-medium">Role: {action.suggestedRole}</span>
                  <button
                    onClick={() => {
                      if (action.actionType === 'schedule_inspection') {
                        onOpenScheduleModal(exception);
                      } else if (action.actionType === 'contact_driver') {
                        setIsDriverModalOpen(true);
                      } else {
                        onOpenScheduleModal(exception);
                      }
                    }}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
                      action.rank === 1
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-white hover:bg-slate-200 text-slate-800 border border-slate-300'
                    }`}
                  >
                    <span>Execute</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 8: FLEET BASELINE COMPARISON & Section 11: DRIVER CONTEXT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Baseline Comparison (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Fleet Baseline Comparison</h2>
              <p className="text-xs text-slate-500">Contextual anomaly detection vs peer fleet averages</p>
            </div>
            <Gauge className="w-4 h-4 text-indigo-600" />
          </div>

          {exception.baselineComparison && exception.baselineComparison.length > 0 ? (
            <div className="space-y-3">
              {exception.baselineComparison.map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800">{item.metric}</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        item.deviationPct > 0
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {item.deviationPct > 0 ? `+${item.deviationPct}%` : `${item.deviationPct}%`} Deviation
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Vehicle Value:</span>
                      <strong className="text-slate-900 font-mono text-sm">{item.vehicleValue}</strong>
                    </div>
                    <div className="w-px h-6 bg-slate-300"></div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Fleet Average:</span>
                      <strong className="text-slate-700 font-mono text-sm">{item.fleetAverage}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-[11px] text-indigo-900 bg-indigo-50/60 p-2.5 rounded-lg font-medium">
                    AI Insight: &ldquo;{item.insight}&rdquo;
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No baseline deviations logged.</p>
          )}
        </div>

        {/* Driver Context / Environmental Safety Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Driver & Environmental Context</h2>
              <p className="text-xs text-slate-500">Responsible AI safety attribution</p>
            </div>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>

          {exception.driverContext ? (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-indigo-300 text-xs font-bold flex items-center justify-center">
                    {exception.driverContext.driverAvatar}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{exception.driverContext.driverName}</div>
                    <div className="text-[10px] text-slate-500">Harsh braking events: {exception.driverContext.harshBrakingCount} (Fleet avg: {exception.driverContext.fleetAvgHarshBraking})</div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 space-y-2">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                  Route Condition Context
                </span>
                <p className="text-xs text-amber-950 font-medium leading-relaxed">
                  {exception.driverContext.environmentalInsight}
                </p>
                <div className="text-[11px] text-amber-800 font-mono bg-white/70 p-2 rounded-md border border-amber-200">
                  📍 {exception.driverContext.routeLocationSummary}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-700 text-xs font-bold">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>Assigned Operator: {vehicle.assignedDriver}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Telematics indicates operational anomaly is hardware/system-related rather than driver behavioral habit.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sensor Data Chart (Recharts with Shaded Normal Operating Bands) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Interactive Telematics Sensor Telemetry
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Visualizing the link: <strong className="text-slate-700">sensor data → anomaly → AI insight</strong>
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setSelectedMetric('temp')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedMetric === 'temp'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Engine Temperature (°C)
            </button>
            <button
              onClick={() => setSelectedMetric('voltage')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedMetric === 'voltage'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Battery Voltage (V)
            </button>
            <button
              onClick={() => setSelectedMetric('rpm')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedMetric === 'rpm'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Engine RPM
            </button>
          </div>
        </div>

        {/* Metric Summary Legend / Range Indicators */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
              <span className="font-semibold text-slate-800">
                {selectedMetric === 'temp'
                  ? 'Engine Temperature'
                  : selectedMetric === 'voltage'
                  ? 'Battery Voltage'
                  : 'Engine RPM'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <span className="w-4 h-3 bg-emerald-100 border border-emerald-300 rounded-xs"></span>
              <span>
                Calibrated Normal Range:{' '}
                <strong>
                  {selectedMetric === 'temp'
                    ? '85°C – 95°C'
                    : selectedMetric === 'voltage'
                    ? '13.2V – 14.4V'
                    : '1,100 – 2,100 RPM'}
                </strong>
              </span>
            </div>
          </div>

          <div className="text-rose-700 font-bold flex items-center gap-1.5 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            <span>
              {selectedMetric === 'temp'
                ? 'Thermal excursion peaked at 107°C (+12°C above max threshold)'
                : selectedMetric === 'voltage'
                ? 'Cold-crank voltage dropped below 12.2V threshold'
                : 'RPM load within standard operating parameters'}
            </span>
          </div>
        </div>

        {/* Recharts Line Chart with Shaded Normal Operating Range */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={exception.timeSeriesData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis
                domain={
                  selectedMetric === 'temp'
                    ? [80, 115]
                    : selectedMetric === 'voltage'
                    ? [10, 16]
                    : [800, 3000]
                }
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                  border: 'none',
                }}
              />

              {/* Shaded Green Reference Area representing Normal Range */}
              {selectedMetric === 'temp' && (
                <ReferenceArea
                  y1={85}
                  y2={95}
                  stroke="#10b981"
                  strokeDasharray="3 3"
                  label={{ value: 'Normal Temp Range (85-95°C)', position: 'insideTopLeft', fill: '#047857', fontSize: 11 }}
                  {...({ fill: '#10b981', fillOpacity: 0.12 } as any)}
                />
              )}
              {selectedMetric === 'voltage' && (
                <ReferenceArea
                  y1={13.2}
                  y2={14.4}
                  stroke="#10b981"
                  strokeDasharray="3 3"
                  label={{ value: 'Normal Voltage (13.2-14.4V)', position: 'insideTopLeft', fill: '#047857', fontSize: 11 }}
                  {...({ fill: '#10b981', fillOpacity: 0.12 } as any)}
                />
              )}
              {selectedMetric === 'rpm' && (
                <ReferenceArea
                  y1={1100}
                  y2={2100}
                  stroke="#10b981"
                  strokeDasharray="3 3"
                  label={{ value: 'Standard RPM Band', position: 'insideTopLeft', fill: '#047857', fontSize: 11 }}
                  {...({ fill: '#10b981', fillOpacity: 0.12 } as any)}
                />
              )}

              {/* Critical Alert Line */}
              {selectedMetric === 'temp' && (
                <ReferenceLine
                  y={100}
                  stroke="#e11d48"
                  strokeDasharray="4 4"
                  label={{ value: 'Critical Alarm 100°C', position: 'right', fill: '#e11d48', fontSize: 11 }}
                />
              )}

              {/* Data line */}
              <Line
                type="monotone"
                dataKey={
                  selectedMetric === 'temp'
                    ? 'engineTemp'
                    : selectedMetric === 'voltage'
                    ? 'batteryVoltage'
                    : 'rpm'
                }
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ fill: '#4f46e5', r: 5, stroke: '#ffffff', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#4338ca' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Footer Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold">Vehicle {exception.vehicleId} • {exception.title}</div>
            <div className="text-xs text-slate-400">
              Assigned Team: <span className="text-slate-200 font-semibold">{exception.assignedTeam}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsDriverModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <span>Driver Alert</span>
          </button>

          <button
            onClick={() => onDismiss(exception.id)}
            className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-rose-950/60 border border-slate-700 text-slate-400 hover:text-rose-400 text-xs font-semibold rounded-xl transition-colors"
          >
            Dismiss
          </button>

          {exception.status !== 'Action Scheduled' && (
            <button
              onClick={() => onOpenScheduleModal(exception)}
              className="flex-1 sm:flex-none px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Schedule Inspection</span>
            </button>
          )}
        </div>
      </div>

      {/* Driver Mobile View Modal */}
      <DriverMobileModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
        exception={exception}
        vehicle={vehicle}
        onAcknowledgeAlert={(id) => {
          console.log('Driver acknowledged alert:', id);
        }}
      />
    </div>
  );
};

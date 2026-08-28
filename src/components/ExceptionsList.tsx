import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  Truck,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Phone,
  ArrowRight,
  HelpCircle,
  Layers,
  LayoutGrid,
  List,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Exception, ExceptionCategory, SeverityLevel, ExceptionStatus } from '../types';

interface ExceptionsListProps {
  exceptions: Exception[];
  onSelectException: (exception: Exception) => void;
  onOpenScheduleModal: (exception: Exception) => void;
  onContactDriver: (exception: Exception) => void;
  onDismissException: (exceptionId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const ExceptionsList: React.FC<ExceptionsListProps> = ({
  exceptions,
  onSelectException,
  onOpenScheduleModal,
  onContactDriver,
  onDismissException,
  searchQuery,
  onSearchChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'risk' | 'impact' | 'severity' | 'newest'>('risk');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

  // Filter options
  const filterTabs = [
    { id: 'All', label: 'All Exceptions' },
    { id: 'Critical', label: 'Critical' },
    { id: 'High', label: 'High' },
    { id: 'Medium', label: 'Medium' },
    { id: 'Safety', label: 'Safety' },
    { id: 'Maintenance', label: 'Maintenance' },
    { id: 'Operations', label: 'Operations' },
  ];

  const handleTabClick = (tabId: string) => {
    if (tabId === 'All') {
      setSelectedCategory('All');
      setSelectedSeverity('All');
    } else if (['Critical', 'High', 'Medium'].includes(tabId)) {
      setSelectedSeverity(tabId);
      setSelectedCategory('All');
    } else {
      setSelectedCategory(tabId);
      setSelectedSeverity('All');
    }
  };

  const activeTabId =
    selectedCategory !== 'All'
      ? selectedCategory
      : selectedSeverity !== 'All'
      ? selectedSeverity
      : 'All';

  // Filtered and sorted exceptions
  const filteredExceptions = useMemo(() => {
    return exceptions
      .filter((exc) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesVehicle = exc.vehicleId.toLowerCase().includes(q);
          const matchesTitle = exc.title.toLowerCase().includes(q);
          const matchesSummary = exc.aiSummary.toLowerCase().includes(q);
          const matchesTeam = exc.assignedTeam.toLowerCase().includes(q);
          if (!matchesVehicle && !matchesTitle && !matchesSummary && !matchesTeam) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'All' && exc.category !== selectedCategory) {
          return false;
        }

        // Severity filter
        if (selectedSeverity !== 'All' && exc.severity !== selectedSeverity) {
          return false;
        }

        // Status filter
        if (selectedStatus !== 'All' && exc.status !== selectedStatus) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'risk') {
          return b.riskScore - a.riskScore;
        }
        if (sortBy === 'impact') {
          return b.riskBreakdown.businessImpactWeight - a.riskBreakdown.businessImpactWeight;
        }
        if (sortBy === 'severity') {
          const weight: Record<SeverityLevel, number> = {
            Critical: 3,
            High: 2,
            Medium: 1,
            Low: 0,
          };
          return weight[b.severity] - weight[a.severity];
        }
        return b.id.localeCompare(a.id);
      });
  }, [exceptions, searchQuery, selectedCategory, selectedSeverity, selectedStatus, sortBy]);

  const activeCount = exceptions.filter((e) => e.status === 'Needs Attention').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Exceptions</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              {activeCount} Active
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            AI has identified <strong className="font-semibold text-slate-700">{exceptions.length} issues</strong> that
            may require action across 250 vehicles.
          </p>
        </div>

        {/* View Mode & Sorters */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          {/* Sorter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="risk">AI Risk Score (High → Low)</option>
              <option value="impact">Business Impact</option>
              <option value="severity">Severity Level</option>
            </select>
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => {
            const isActive = activeTabId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}

          {/* Status Sub-filter */}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Needs Attention">Needs Attention</option>
              <option value="Action Scheduled">Action Scheduled</option>
              <option value="Dismissed">Dismissed</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary if filtered */}
        {(selectedCategory !== 'All' || selectedSeverity !== 'All' || selectedStatus !== 'All' || searchQuery) && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Showing {filteredExceptions.length} of {exceptions.length} exceptions
            </span>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedSeverity('All');
                setSelectedStatus('All');
                onSearchChange('');
              }}
              className="text-indigo-600 hover:underline font-semibold ml-2"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Main List / Table */}
      {filteredExceptions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No exceptions match your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or clearing active severity and category filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedSeverity('All');
              setSelectedStatus('All');
              onSearchChange('');
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExceptions.map((exc) => {
            const isCritical = exc.severity === 'Critical';
            const isHigh = exc.severity === 'High';
            const isScheduled = exc.status === 'Action Scheduled';
            const isDismissed = exc.status === 'Dismissed';

            return (
              <div
                key={exc.id}
                className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                  isDismissed
                    ? 'border-slate-200 opacity-60 bg-slate-50/50'
                    : isScheduled
                    ? 'border-emerald-200 ring-1 ring-emerald-500/20'
                    : isCritical
                    ? 'border-rose-200/90 hover:border-rose-300'
                    : isHigh
                    ? 'border-amber-200/90 hover:border-amber-300'
                    : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                {/* Top Section */}
                <div className="p-5 space-y-3.5">
                  {/* Vehicle ID & Severity Pill */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-slate-900 text-white flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-slate-300" />
                        Vehicle {exc.vehicleId}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 px-2 py-0.5 bg-slate-100 rounded">
                        {exc.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isScheduled && (
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Action Scheduled
                        </span>
                      )}
                      {isDismissed && (
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                          Dismissed
                        </span>
                      )}
                      {!isScheduled && !isDismissed && (
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            isCritical
                              ? 'bg-rose-100 text-rose-800'
                              : isHigh
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {exc.severity}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <button
                    onClick={() => onSelectException(exc)}
                    className="text-left w-full group/title"
                  >
                    <h3 className="text-base font-bold text-slate-900 group-hover/title:text-indigo-600 transition-colors flex items-center justify-between">
                      <span>{exc.title}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover/title:text-indigo-600 group-hover/title:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </h3>
                  </button>

                  {/* AI Summary */}
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/90 p-3 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-800 mr-1">AI Summary:</span>
                    &ldquo;{exc.aiSummary}&rdquo;
                  </p>

                  {/* AI Risk Score Metric with Transparent Formula Breakdown */}
                  <div className="relative">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100/80">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="text-xs font-semibold text-slate-800">AI Risk Score</span>
                        <button
                          onClick={() =>
                            setActiveTooltipId(activeTooltipId === exc.id ? null : exc.id)
                          }
                          className="text-slate-400 hover:text-indigo-600 transition-colors"
                          title="View transparent formula calculation"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span
                          className={`text-lg font-black tracking-tight ${
                            exc.riskScore >= 80
                              ? 'text-rose-600'
                              : exc.riskScore >= 70
                              ? 'text-amber-600'
                              : 'text-indigo-600'
                          }`}
                        >
                          {exc.riskScore}%
                        </span>
                      </div>
                    </div>

                    {/* Popover Formula Breakdown */}
                    {activeTooltipId === exc.id && (
                      <div className="absolute top-full mt-2 left-0 right-0 z-20 bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-2 border border-slate-800 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between font-bold text-slate-200 border-b border-slate-800 pb-1">
                          <span>Decision Support Formula</span>
                          <button
                            onClick={() => setActiveTooltipId(null)}
                            className="text-slate-400 hover:text-white"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          {exc.riskBreakdown.formulaText}
                        </p>
                        <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] text-slate-400">
                          <div>Severity: {exc.riskBreakdown.severityWeight}</div>
                          <div>Prob: {exc.riskBreakdown.probability}%</div>
                          <div>Impact: {exc.riskBreakdown.businessImpactWeight}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Potential Impact */}
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Impact: </span>
                    <span className="text-slate-600">{exc.potentialImpact}</span>
                  </div>
                </div>

                {/* Recommended Action & Action Buttons Footer */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 space-y-3">
                  <div className="text-xs">
                    <span className="text-slate-500 font-medium">Recommended: </span>
                    <strong className="text-slate-800 font-semibold">{exc.recommendedAction}</strong>
                  </div>

                  {/* Action Button Group */}
                  <div className="flex items-center gap-2 pt-1">
                    {exc.status === 'Action Scheduled' ? (
                      <button
                        onClick={() => onSelectException(exc)}
                        className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>View Scheduled Details</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => onOpenScheduleModal(exc)}
                          className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-1.5"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {exc.title.toLowerCase().includes('coaching')
                              ? 'Schedule Coaching'
                              : exc.title.toLowerCase().includes('route')
                              ? 'Review Route'
                              : 'Schedule Inspection'}
                          </span>
                        </button>

                        <button
                          onClick={() => onContactDriver(exc)}
                          className="p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg transition-colors"
                          title="Contact Driver or Dispatch"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDismissException(exc.id)}
                          className="p-2 bg-white hover:bg-rose-50 hover:text-rose-600 border border-slate-200 text-slate-400 rounded-lg transition-colors text-xs font-semibold"
                          title="Dismiss Exception"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Dense Enterprise Table View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Exception Title</th>
                  <th className="py-3 px-4">AI Risk Score</th>
                  <th className="py-3 px-4">Recommended Action</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredExceptions.map((exc) => (
                  <tr
                    key={exc.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => onSelectException(exc)}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                      Vehicle {exc.vehicleId}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          exc.severity === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : exc.severity === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {exc.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{exc.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{exc.aiSummary}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold">
                      <span
                        className={`px-2 py-0.5 rounded ${
                          exc.riskScore >= 80
                            ? 'bg-rose-50 text-rose-700 font-extrabold'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        {exc.riskScore}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-semibold">
                      {exc.recommendedAction}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          exc.status === 'Action Scheduled'
                            ? 'bg-emerald-100 text-emerald-800'
                            : exc.status === 'Dismissed'
                            ? 'bg-slate-100 text-slate-500'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {exc.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {exc.status !== 'Action Scheduled' ? (
                          <button
                            onClick={() => onOpenScheduleModal(exc)}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold text-[11px]"
                          >
                            Act
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-bold">Done</span>
                        )}
                        <button
                          onClick={() => onSelectException(exc)}
                          className="p-1 hover:bg-slate-200 rounded text-slate-500"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

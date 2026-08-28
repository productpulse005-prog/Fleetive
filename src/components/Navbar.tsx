import React from 'react';
import {
  Sparkles,
  Activity,
  PlayCircle,
  Cpu,
  RefreshCw,
  Search,
  Bell,
  Server,
} from 'lucide-react';

interface NavbarProps {
  onStartTour: () => void;
  onRefreshTelemetry: () => void;
  onOpenArchitecture: () => void;
  isRefreshing: boolean;
  onSearchClick?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  unreadCount: number;
  onNotificationClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onStartTour,
  onRefreshTelemetry,
  onOpenArchitecture,
  isRefreshing,
  searchQuery,
  onSearchChange,
  unreadCount,
  onNotificationClick,
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Left side: Telematics processing metric pill & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search vehicle ID, driver, issue..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Telematics noise reduction pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/80 border border-indigo-100 text-[11px] text-indigo-900 font-medium whitespace-nowrap">
          <Activity className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
          <span>
            <strong className="font-semibold text-indigo-700">1,284</strong> events/min →{' '}
            <strong className="font-semibold text-indigo-700">3</strong> critical exceptions
          </span>
          <span className="bg-indigo-200/60 text-indigo-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
            -99.8% noise
          </span>
        </div>
      </div>

      {/* Right side: Demo Tour trigger, Architecture, Re-simulate button, AI Engine status, Notifications */}
      <div className="flex items-center gap-2.5">
        {/* System Architecture Button */}
        <button
          onClick={onOpenArchitecture}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          title="View IoT Telematics & AI Architecture"
        >
          <Server className="w-3.5 h-3.5 text-indigo-600" />
          <span>Architecture</span>
        </button>

        {/* 3-Minute Demo Tour Button */}
        <button
          onClick={onStartTour}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-semibold shadow-sm shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlayCircle className="w-4 h-4 text-indigo-200" />
          <span>3-Min Demo Tour</span>
        </button>

        {/* Re-simulate Telematics Stream */}
        <button
          onClick={onRefreshTelemetry}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors disabled:opacity-50"
          title="Poll latest sensor telematics stream"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
          <span className="hidden md:inline">Sync Stream</span>
        </button>

        {/* AI Engine Model Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-[11px] text-slate-600 font-medium">
          <Cpu className="w-3.5 h-3.5 text-slate-500" />
          <span>Gemini 3.7 Copilot</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            id="navbar-notification-btn"
            onClick={onNotificationClick}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors relative cursor-pointer"
            aria-label="View AI Exceptions"
            title="View AI Exceptions"
          >
            <Bell className="w-4 h-4" />
          </button>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white pointer-events-none"></span>
          )}
        </div>
      </div>
    </header>
  );
};

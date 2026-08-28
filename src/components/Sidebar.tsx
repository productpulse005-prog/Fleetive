import React from 'react';
import {
  LayoutDashboard,
  Radio,
  Sparkles,
  Truck,
  Users,
  Wrench,
  BarChart3,
  Settings,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  exceptionCount: number;
  criticalCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  exceptionCount,
  criticalCount,
}) => {
  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'live_fleet',
      label: 'Live Fleet',
      icon: Radio,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500 text-white animate-pulse',
    },
    {
      id: 'exceptions',
      label: 'AI Exceptions',
      icon: Sparkles,
      badge: exceptionCount,
      badgeColor: criticalCount > 0 ? 'bg-rose-500 text-white' : 'bg-indigo-500 text-white',
    },
    {
      id: 'vehicles',
      label: 'Vehicles',
      icon: Truck,
      badge: '50',
      badgeColor: 'bg-slate-700 text-slate-300',
    },
    {
      id: 'drivers',
      label: 'Drivers',
      icon: Users,
      badge: null,
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      icon: Wrench,
      badge: null,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 h-screen sticky top-0 text-slate-300 select-none z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-slate-100 tracking-tight">Fleetive</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Copilot
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">AI Telematics Operations</p>
          </div>
        </div>
      </div>

      {/* Live AI Status Pill */}
      <div className="mx-4 mt-3 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-medium text-slate-300">Live Telematics Stream</span>
        </div>
        <span className="text-[10px] text-emerald-400 font-semibold px-1.5 py-0.5 bg-emerald-500/10 rounded">
          Active
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Operations Hub
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section: Settings & User Profile */}
      <div className="p-3 border-t border-slate-800/80 space-y-1">
        <button
          onClick={() => onSelectTab('settings')}
          className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentTab === 'settings'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>

        {/* User Card */}
        <div className="mt-2 pt-2 border-t border-slate-800/60 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-semibold text-xs text-slate-200">
              AM
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-slate-200">Alex Morgan</div>
              <div className="text-[11px] text-slate-400">Fleet Operations Lead</div>
            </div>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-400" title="Dispatcher Role Verified" />
        </div>
      </div>
    </aside>
  );
};

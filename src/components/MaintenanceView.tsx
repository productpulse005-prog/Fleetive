import React from 'react';
import { Wrench, Clock, CheckCircle2, AlertOctagon, Plus, Truck, Calendar } from 'lucide-react';
import { ScheduledTask } from '../types';

interface MaintenanceViewProps {
  scheduledTasks: ScheduledTask[];
  onCompleteTask: (taskId: string) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  scheduledTasks,
  onCompleteTask,
}) => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Maintenance Work Queue</h1>
          <p className="text-sm text-slate-500 mt-1">
            Work orders scheduled proactively via Fleetive AI Exception Copilot
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
            {scheduledTasks.filter((t) => t.status === 'Pending').length} Pending Work Orders
          </span>
        </div>
      </div>

      {scheduledTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No scheduled work orders</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you confirm recommended actions from the AI Exceptions page, work orders appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Work Order / Issue</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Timeframe</th>
                  <th className="py-3.5 px-4">Assigned Team</th>
                  <th className="py-3.5 px-4">Scheduled At</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {scheduledTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      Vehicle {task.vehicleId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{task.title}</div>
                      <div className="text-[11px] text-slate-500">{task.notes}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          task.priority === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {task.suggestedTimeframe}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{task.assignedTeam}</td>
                    <td className="py-3.5 px-4 text-slate-500">{task.scheduledTime}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          task.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {task.status !== 'Completed' && (
                        <button
                          onClick={() => onCompleteTask(task.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-bold transition-colors"
                        >
                          Mark Completed
                        </button>
                      )}
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

import React, { useState } from 'react';
import {
  Truck,
  Search,
  Filter,
  ArrowUpDown,
  Gauge,
  Zap,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Navigation,
  TrendingUp,
  TrendingDown,
  X,
  Smartphone,
  Layers,
  Thermometer,
  BatteryCharging,
  Phone,
} from 'lucide-react';
import { Vehicle, Exception } from '../types';
import { DriverMobileModal } from './DriverMobileModal';

interface VehiclesViewProps {
  vehicles: Vehicle[];
  exceptions: Exception[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  onSelectExceptionForVehicle: (vehicleId: string) => void;
}

export const VehiclesView: React.FC<VehiclesViewProps> = ({
  vehicles,
  exceptions,
  onSelectVehicle,
  onSelectExceptionForVehicle,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);

  const filteredVehicles = vehicles.filter((v) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        v.id.toLowerCase().includes(q) ||
        v.makeModel.toLowerCase().includes(q) ||
        v.assignedDriver.toLowerCase().includes(q) ||
        v.vin.toLowerCase().includes(q) ||
        v.currentLocation.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (statusFilter !== 'all' && v.vehicleStatus !== statusFilter) {
      return false;
    }
    return true;
  });

  const activeExceptionForSelected = selectedVehicle
    ? exceptions.find((e) => e.vehicleId === selectedVehicle.id)
    : null;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Connected Fleet Vehicles</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time telematics status, operational route context, and AI exception intelligence
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search vehicle, driver, VIN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active ({vehicles.filter((v) => v.vehicleStatus === 'active').length})</option>
            <option value="at_risk">At Risk ({vehicles.filter((v) => v.vehicleStatus === 'at_risk').length})</option>
            <option value="offline">Offline ({vehicles.filter((v) => v.vehicleStatus === 'offline').length})</option>
            <option value="maintenance">In Maintenance ({vehicles.filter((v) => v.vehicleStatus === 'maintenance').length})</option>
          </select>
        </div>
      </div>

      {/* Vehicle Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Vehicle ID</th>
                <th className="py-3.5 px-4">Make & Model</th>
                <th className="py-3.5 px-4">Assigned Driver</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Engine Temp</th>
                <th className="py-3.5 px-4">Battery</th>
                <th className="py-3.5 px-4">Odometer</th>
                <th className="py-3.5 px-4">Current Route / Location</th>
                <th className="py-3.5 px-4 text-right">AI Exception</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredVehicles.map((vehicle) => {
                const vehicleException = exceptions.find((e) => e.vehicleId === vehicle.id);

                return (
                  <tr
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle)}
                    className={`hover:bg-slate-50/90 transition-colors cursor-pointer ${
                      selectedVehicle?.id === vehicle.id ? 'bg-indigo-50/50' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      Vehicle {vehicle.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{vehicle.makeModel}</div>
                      <div className="text-[10px] text-slate-400">{vehicle.type} • {vehicle.year}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{vehicle.assignedDriver}</div>
                      <div className="text-[10px] text-slate-400">{vehicle.driverPhone || '—'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          vehicle.vehicleStatus === 'at_risk'
                            ? 'bg-amber-100 text-amber-800'
                            : vehicle.vehicleStatus === 'offline'
                            ? 'bg-slate-200 text-slate-700'
                            : vehicle.vehicleStatus === 'maintenance'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {vehicle.vehicleStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {vehicle.engineTemp > 0 ? (
                        <span
                          className={`font-semibold ${
                            vehicle.engineTemp >= 100
                              ? 'text-rose-600 font-bold'
                              : vehicle.engineTemp > 95
                              ? 'text-amber-600'
                              : 'text-slate-700'
                          }`}
                        >
                          {vehicle.engineTemp}°C
                        </span>
                      ) : (
                        <span className="text-slate-400">Offline</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {vehicle.batteryVoltage > 0 ? (
                        <span
                          className={`font-semibold ${
                            vehicle.batteryVoltage < 12.0
                              ? 'text-rose-600 font-bold'
                              : 'text-slate-700'
                          }`}
                        >
                          {vehicle.batteryVoltage}V
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {vehicle.mileage.toLocaleString()} mi
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                      {vehicle.currentLocation}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {vehicleException ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectExceptionForVehicle(vehicle.id);
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] border border-rose-200 transition-colors"
                        >
                          <Sparkles className="w-3 h-3 text-rose-600" />
                          <span>{vehicleException.riskScore}% Risk</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-medium">Nominal</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Vehicle Drawer / Detail Card with Section 9 "What Changed?" */}
      {selectedVehicle && (
        <div className="bg-white rounded-2xl border border-indigo-200 p-6 shadow-sm space-y-6 animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-bold">
                V{selectedVehicle.id}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Vehicle {selectedVehicle.id} — {selectedVehicle.makeModel}
                </h2>
                <p className="text-xs text-slate-500">
                  VIN: {selectedVehicle.vin} • Driver: <strong>{selectedVehicle.assignedDriver}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDriverModalOpen(true)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                <span>Simulate In-Cab Driver Alert</span>
              </button>

              {activeExceptionForSelected && (
                <button
                  onClick={() => onSelectExceptionForVehicle(selectedVehicle.id)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>View AI Exception</span>
                </button>
              )}

              <button
                onClick={() => setSelectedVehicle(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Section 9: "WHAT CHANGED?" Period-Over-Period Comparison Card */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  What Changed? (Period-over-Period Telematics Comparison)
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Last 7 Days vs Prior 30-Day Baseline</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Engine Temp */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Engine Temperature</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-black text-rose-600">↑ 14%</span>
                  <TrendingUp className="w-4 h-4 text-rose-500" />
                </div>
                <span className="text-[10px] text-slate-500">105°C vs 92°C baseline</span>
              </div>

              {/* Diagnostic Events */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Diagnostic Events</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-black text-rose-600">↑ 300%</span>
                  <TrendingUp className="w-4 h-4 text-rose-500" />
                </div>
                <span className="text-[10px] text-slate-500">DTC P0217 & P0128 logged</span>
              </div>

              {/* Idle Time */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Idle Time</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-black text-emerald-600">↓ 4%</span>
                  <TrendingDown className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-[10px] text-slate-500">Optimized dwell cycles</span>
              </div>

              {/* Fuel Efficiency */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Fuel Efficiency</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-black text-amber-600">↓ 7%</span>
                  <TrendingDown className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-[10px] text-slate-500">6.4 vs 6.9 MPG target</span>
              </div>
            </div>

            {/* AI Summary for What Changed */}
            <div className="bg-indigo-50/70 p-3.5 rounded-lg border border-indigo-100 text-xs text-indigo-950 leading-relaxed font-medium">
              ✨ <strong>AI Change Summary:</strong> Vehicle {selectedVehicle.id} exhibited a 14% elevation in operating temperatures alongside a 300% surge in CAN-bus thermal warnings over the past 48 hours, signaling progressive coolant degradation rather than sudden load strain.
            </div>
          </div>
        </div>
      )}

      {/* Driver Mobile View Modal */}
      {selectedVehicle && (
        <DriverMobileModal
          isOpen={isDriverModalOpen}
          onClose={() => setIsDriverModalOpen(false)}
          exception={activeExceptionForSelected || exceptions[0]}
          vehicle={selectedVehicle}
        />
      )}
    </div>
  );
};

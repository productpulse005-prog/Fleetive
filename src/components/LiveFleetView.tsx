import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Radio,
  Wifi,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Flame,
  Search,
  Filter,
  Play,
  RotateCcw,
  ArrowRight,
  Truck,
  Cpu,
  Server,
  Layers,
  Clock,
  ChevronRight,
  Code,
  Copy,
  Check,
  Zap,
  Gauge,
  Thermometer,
  BatteryCharging,
  CornerDownRight,
  ExternalLink,
} from 'lucide-react';
import { Vehicle, Exception } from '../types';

interface LiveFleetViewProps {
  vehicles: Vehicle[];
  exceptions: Exception[];
  onSelectVehicle: (vehicleId: string) => void;
  onSelectException: (exception: Exception) => void;
  onOpenScheduleModal: (exception: Exception) => void;
  onOpenArchitecture: () => void;
}

interface SimulatedMqttMessage {
  id: string;
  topic: string;
  vehicleId: string;
  timestamp: string;
  type: 'telemetry' | 'diagnostics' | 'safety' | 'location';
  severity: 'normal' | 'warning' | 'critical';
  payload: Record<string, any>;
}

export const LiveFleetView: React.FC<LiveFleetViewProps> = ({
  vehicles,
  exceptions,
  onSelectVehicle,
  onSelectException,
  onOpenScheduleModal,
  onOpenArchitecture,
}) => {
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'at_risk' | 'offline'>('all');
  const [metricFilter, setMetricFilter] = useState<'all' | 'overheating' | 'battery' | 'safety'>('all');

  // Live Simulation Pipeline Counters
  const [eventsPerMin, setEventsPerMin] = useState(1284);
  const [processedPerMin, setProcessedPerMin] = useState(1271);
  const [isFeedPaused, setIsFeedPaused] = useState(false);
  const [copiedPayloadId, setCopiedPayloadId] = useState<string | null>(null);
  const [selectedMqttMessage, setSelectedMqttMessage] = useState<SimulatedMqttMessage | null>(null);

  // Overheating Interactive Scenario State
  const [overheatingStep, setOverheatingStep] = useState<number>(0);
  const [isSimulatingOverheat, setIsSimulatingOverheat] = useState<boolean>(false);
  const [simulationLogs, setSimulationLogs] = useState<
    { time: string; text: string; type: 'info' | 'warn' | 'crit' | 'ai'; metric?: string; val?: string }[]
  >([]);

  // MQTT Stream Messages List
  const [mqttMessages, setMqttMessages] = useState<SimulatedMqttMessage[]>([
    {
      id: 'mqtt-1',
      topic: 'vehicle/V127/telemetry',
      vehicleId: '127',
      timestamp: '10:41:02',
      type: 'telemetry',
      severity: 'normal',
      payload: {
        vehicle_id: 'V127',
        timestamp: '2026-08-27T10:41:02Z',
        engine_temp: 97,
        battery_voltage: 13.6,
        speed: 68,
        rpm: 1850,
        fuel_level: 64,
        engine_hours: 4218,
        idle: false,
      },
    },
    {
      id: 'mqtt-2',
      topic: 'vehicle/V084/safety',
      vehicleId: '084',
      timestamp: '10:41:00',
      type: 'safety',
      severity: 'critical',
      payload: {
        vehicle_id: 'V084',
        timestamp: '2026-08-27T10:41:00Z',
        event: 'harsh_braking',
        g_force: -0.52,
        speed_delta: 24,
        speed: 38,
        location: { lat: 37.7749, lon: -122.4194 },
      },
    },
    {
      id: 'mqtt-3',
      topic: 'vehicle/V052/diagnostics',
      vehicleId: '052',
      timestamp: '10:40:58',
      type: 'diagnostics',
      severity: 'warning',
      payload: {
        vehicle_id: 'V052',
        timestamp: '2026-08-27T10:40:58Z',
        dtc_code: 'P0562',
        description: 'System Voltage Low',
        battery_voltage: 11.2,
        cranking_sag_v: 9.8,
      },
    },
    {
      id: 'mqtt-4',
      topic: 'vehicle/V211/location',
      vehicleId: '211',
      timestamp: '10:40:55',
      type: 'location',
      severity: 'warning',
      payload: {
        vehicle_id: 'V211',
        timestamp: '2026-08-27T10:40:55Z',
        speed: 12,
        corridor: 'I-80 East',
        sla_delta_min: 38,
        route_progress_pct: 64.2,
      },
    },
    {
      id: 'mqtt-5',
      topic: 'vehicle/V173/telemetry',
      vehicleId: '173',
      timestamp: '10:40:50',
      type: 'telemetry',
      severity: 'normal',
      payload: {
        vehicle_id: 'V173',
        timestamp: '2026-08-27T10:40:50Z',
        engine_temp: 90,
        battery_voltage: 13.9,
        speed: 0,
        rpm: 680,
        idle: true,
        continuous_idle_min: 68,
      },
    },
  ]);

  // Set default selected message
  useEffect(() => {
    if (!selectedMqttMessage && mqttMessages.length > 0) {
      setSelectedMqttMessage(mqttMessages[0]);
    }
  }, [mqttMessages, selectedMqttMessage]);

  // Periodic pipeline stream generator
  useEffect(() => {
    if (isFeedPaused) return;

    const interval = setInterval(() => {
      // Fluctuate event rate
      setEventsPerMin((prev) => 1284 + Math.floor(Math.random() * 21) - 10);
      setProcessedPerMin((prev) => 1271 + Math.floor(Math.random() * 17) - 8);

      // Pick a random vehicle
      const randomVehicle = vehicles[Math.floor(Math.random() * vehicles.length)] || vehicles[0];
      if (!randomVehicle) return;

      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      const topics: ('telemetry' | 'diagnostics' | 'safety' | 'location')[] = [
        'telemetry',
        'telemetry',
        'telemetry',
        'location',
        'diagnostics',
      ];
      const selectedType = topics[Math.floor(Math.random() * topics.length)];

      let payload: Record<string, any> = {};
      let severity: 'normal' | 'warning' | 'critical' = 'normal';

      if (selectedType === 'telemetry') {
        const temp = 86 + Math.floor(Math.random() * 8);
        const volt = (13.4 + Math.random() * 0.8).toFixed(1);
        const speed = Math.floor(Math.random() * 75);
        payload = {
          vehicle_id: `V${randomVehicle.id}`,
          timestamp: now.toISOString(),
          engine_temp: temp,
          battery_voltage: parseFloat(volt),
          speed: speed,
          rpm: speed > 0 ? 1400 + speed * 12 : 720,
          fuel_level: Math.max(10, Math.floor(randomVehicle.fuelConsumption * 6)),
          engine_hours: randomVehicle.engineHours,
          idle: speed === 0,
        };
      } else if (selectedType === 'safety') {
        severity = Math.random() > 0.6 ? 'warning' : 'normal';
        payload = {
          vehicle_id: `V${randomVehicle.id}`,
          timestamp: now.toISOString(),
          event: severity === 'warning' ? 'harsh_cornering' : 'lane_departure_warning',
          g_force: severity === 'warning' ? 0.38 : 0.22,
          speed: 45,
        };
      } else if (selectedType === 'diagnostics') {
        payload = {
          vehicle_id: `V${randomVehicle.id}`,
          timestamp: now.toISOString(),
          can_bus_status: 'HEALTHY_0x00',
          dtc_active_count: 0,
          coolant_psi: 14.8,
        };
      } else {
        payload = {
          vehicle_id: `V${randomVehicle.id}`,
          timestamp: now.toISOString(),
          speed: 58,
          heading: 184,
          lat: (37.75 + Math.random() * 0.05).toFixed(4),
          lon: (-122.42 + Math.random() * 0.05).toFixed(4),
        };
      }

      const newMsg: SimulatedMqttMessage = {
        id: `mqtt-${Date.now()}-${Math.random().toString().slice(2, 6)}`,
        topic: `vehicle/V${randomVehicle.id}/${selectedType}`,
        vehicleId: randomVehicle.id,
        timestamp: timeStr,
        type: selectedType,
        severity,
        payload,
      };

      setMqttMessages((prev) => [newMsg, ...prev.slice(0, 19)]);
    }, 2800);

    return () => clearInterval(interval);
  }, [isFeedPaused, vehicles]);

  // Interactive Overheating Scenario Step-by-Step Execution
  const triggerOverheatingSimulation = () => {
    if (isSimulatingOverheat) return;
    setIsSimulatingOverheat(true);
    setOverheatingStep(1);
    setSimulationLogs([]);

    const stepsData = [
      {
        delay: 400,
        step: 1,
        time: '10:41:02',
        text: 'Vehicle V127 — Telemetry received: Engine temp 97°C (Nominal baseline: 85–95°C)',
        type: 'info' as const,
        metric: 'Engine Temp',
        val: '97°C',
      },
      {
        delay: 1800,
        step: 2,
        time: '10:41:05',
        text: 'Vehicle V127 — Thermal climb continues: Engine temp 101°C (Approaching alarm threshold)',
        type: 'warn' as const,
        metric: 'Engine Temp',
        val: '101°C',
      },
      {
        delay: 3200,
        step: 3,
        time: '10:41:08',
        text: 'Vehicle V127 — Excursion alert: Engine temp 104°C (Upper threshold breached)',
        type: 'crit' as const,
        metric: 'Engine Temp',
        val: '104°C',
      },
      {
        delay: 4500,
        step: 4,
        time: '10:41:10',
        text: 'Vehicle V127 — Coolant diagnostic warning broadcast: DTC P0217 (Engine Over-Temperature)',
        type: 'crit' as const,
        metric: 'Diagnostic DTC',
        val: 'P0217 Coolant',
      },
      {
        delay: 6000,
        step: 5,
        time: '10:41:12',
        text: '🚨 AI EXCEPTION CREATED: Vehicle V127 — Potential Cooling System Failure (Risk: 87%)',
        type: 'ai' as const,
        metric: 'AI Copilot Action',
        val: 'Schedule Inspection within 24h',
      },
    ];

    stepsData.forEach(({ delay, step, time, text, type, metric, val }) => {
      setTimeout(() => {
        setOverheatingStep(step);
        setSimulationLogs((prev) => [...prev, { time, text, type, metric, val }]);

        // Add special MQTT message to feed
        const specialMqtt: SimulatedMqttMessage = {
          id: `mqtt-sim-${Date.now()}-${step}`,
          topic: step === 4 ? 'vehicle/V127/diagnostics' : 'vehicle/V127/telemetry',
          vehicleId: '127',
          timestamp: time,
          type: step === 4 ? 'diagnostics' : 'telemetry',
          severity: step >= 3 ? 'critical' : 'warning',
          payload: {
            vehicle_id: 'V127',
            timestamp: `2026-08-27T${time}Z`,
            engine_temp: step === 1 ? 97 : step === 2 ? 101 : step === 3 ? 104 : 105,
            coolant_warning: step >= 4,
            dtc_code: step >= 4 ? 'P0217' : undefined,
            speed: 72,
            rpm: 2400,
          },
        };
        setMqttMessages((prev) => [specialMqtt, ...prev.slice(0, 19)]);
        setSelectedMqttMessage(specialMqtt);

        if (step === 5) {
          setIsSimulatingOverheat(false);
        }
      }, delay);
    });
  };

  const resetSimulation = () => {
    setOverheatingStep(0);
    setIsSimulatingOverheat(false);
    setSimulationLogs([]);
  };

  const handleCopyPayload = (msg: SimulatedMqttMessage) => {
    navigator.clipboard.writeText(JSON.stringify(msg.payload, null, 2));
    setCopiedPayloadId(msg.id);
    setTimeout(() => setCopiedPayloadId(null), 2000);
  };

  // Find V127 exception
  const v127Exception = exceptions.find((e) => e.vehicleId === '127') || exceptions[0];

  // Filtered vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.makeModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.assignedDriver.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'active' && v.vehicleStatus !== 'active') return false;
    if (statusFilter === 'at_risk' && v.vehicleStatus !== 'at_risk') return false;
    if (statusFilter === 'offline' && v.vehicleStatus !== 'offline') return false;

    if (metricFilter === 'overheating' && v.engineTemp < 95) return false;
    if (metricFilter === 'battery' && v.batteryVoltage >= 12.0) return false;
    if (metricFilter === 'safety' && v.harshBrakings < 2) return false;

    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner: Architecture & Pipeline Status */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Live Telemetry Pipeline • Simulated IoT Stream</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>Live Fleet Stream & Ingestion</span>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                MQTT Connected
              </span>
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Continuous IoT sensor telemetry collected via MQTT, processed through cloud stream ingestion,
              and triaged by the AI Anomaly Engine in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenArchitecture}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shadow-xs"
            >
              <Server className="w-4 h-4 text-indigo-400" />
              <span>View System Architecture</span>
            </button>

            <button
              onClick={() => setIsFeedPaused(!isFeedPaused)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                isFeedPaused
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>{isFeedPaused ? 'Resume Ingestion' : 'Pause Stream'}</span>
            </button>
          </div>
        </div>

        {/* Live Pipeline Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              <span>MQTT Broker</span>
            </div>
            <div className="text-sm font-bold text-slate-100 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Connected</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">broker.fleetive:1883</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-slate-400" />
              <span>Vehicles Online</span>
            </div>
            <div className="text-sm font-bold text-slate-100 mt-1">48 / 50</div>
            <div className="text-[10px] text-emerald-400 font-medium mt-0.5">96% fleet connected</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>Events Received</span>
            </div>
            <div className="text-sm font-bold text-indigo-300 mt-1 font-mono">{eventsPerMin.toLocaleString()} / min</div>
            <div className="text-[10px] text-slate-500 mt-0.5">QoS 1 Ingestion</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Events Processed</span>
            </div>
            <div className="text-sm font-bold text-emerald-300 mt-1 font-mono">{processedPerMin.toLocaleString()} / min</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Sub-50ms latency</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[11px] text-amber-400 font-medium flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Active Anomalies</span>
            </div>
            <div className="text-sm font-bold text-amber-300 mt-1">11</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Rule Engine + ML</div>
          </div>

          <div className="bg-rose-950/40 p-3 rounded-xl border border-rose-800/60">
            <div className="text-[11px] text-rose-300 font-medium flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              <span>Critical Exceptions</span>
            </div>
            <div className="text-sm font-bold text-rose-200 mt-1">3 Actionable</div>
            <div className="text-[10px] text-rose-400/80 mt-0.5">Triage required</div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
            Prototype Data • Realistic Telematics Simulator
          </span>
          <span>Flow: Sensors → MQTT → Cloud Ingestion → Anomaly Detection → AI Reasoning → Action</span>
        </div>
      </div>

      {/* Interactive Overheating Anomaly Simulator Box */}
      <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-sm p-6 space-y-5 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                Live Demo Simulation Console
              </span>
              <span className="text-xs font-semibold text-slate-500">Interview Walkthrough</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Vehicle V127 Overheating Scenario & Exception Trigger
            </h2>
            <p className="text-xs text-slate-500">
              Simulate an abnormal temperature surge to watch the complete end-to-end loop:
              <strong className="text-slate-800"> Telemetry → Anomaly → AI Reasoning → Action</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {overheatingStep === 0 ? (
              <button
                onClick={triggerOverheatingSimulation}
                disabled={isSimulatingOverheat}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Trigger V127 Thermal Anomaly</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={resetSimulation}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reset Demo</span>
                </button>
                {overheatingStep === 5 && (
                  <button
                    onClick={() => onOpenScheduleModal(v127Exception)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Schedule Inspection Now</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Step Progression Visualizer */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
          {[
            { step: 1, label: '09:15 / 10:41:02', metric: '97°C', desc: 'Mild Thermal Climb', icon: Thermometer },
            { step: 2, label: '09:20 / 10:41:05', metric: '101°C', desc: 'Target Band Breach', icon: Thermometer },
            { step: 3, label: '09:25 / 10:41:08', metric: '104°C', desc: 'High Temp Warning', icon: Flame },
            { step: 4, label: '09:26 / 10:41:10', metric: 'DTC P0217', desc: 'Coolant Diagnostic Alert', icon: AlertOctagon },
            { step: 5, label: '09:28 / 10:41:12', metric: 'AI Triage 87%', desc: 'Prioritized Exception', icon: Sparkles },
          ].map((s) => {
            const Icon = s.icon;
            const isCompleted = overheatingStep >= s.step;
            const isCurrent = overheatingStep === s.step;
            return (
              <div
                key={s.step}
                className={`p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-indigo-50/90 border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
                    : isCompleted
                    ? 'bg-slate-50 border-slate-300 text-slate-700'
                    : 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span>{s.label}</span>
                  {isCompleted && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  )}
                </div>
                <div className="font-bold text-sm text-slate-900 mt-1 flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${isCompleted ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{s.metric}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{s.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Live Simulation Execution Feed / Result */}
        {simulationLogs.length > 0 && (
          <div className="bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-xs space-y-2 border border-slate-800 animate-in fade-in">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="font-bold text-slate-200">Simulation Event Pipeline Log</span>
              </div>
              <span className="text-slate-500">Target: Vehicle V127 (Freightliner Cascadia)</span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {simulationLogs.map((log, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 p-1.5 rounded transition-all ${
                    log.type === 'ai'
                      ? 'bg-indigo-950/80 text-indigo-200 border border-indigo-700/50 font-sans'
                      : log.type === 'crit'
                      ? 'text-rose-400'
                      : log.type === 'warn'
                      ? 'text-amber-300'
                      : 'text-slate-300'
                  }`}
                >
                  <span className="text-slate-500 font-mono shrink-0">{log.time}</span>
                  <span className="text-slate-600">→</span>
                  <span className="flex-1 font-medium">{log.text}</span>
                  {log.val && (
                    <span className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] text-slate-300 shrink-0">
                      {log.val}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {overheatingStep === 5 && (
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
                <div className="text-xs text-indigo-300">
                  <strong>AI Copilot Reasoning:</strong> Thermal gradient + Coolant DTC signals imminent cooling system compromise (87% Risk).
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectException(v127Exception)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <span>View Exception Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onOpenScheduleModal(v127Exception)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <span>Schedule Inspection</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Split: Real-Time MQTT Inspector & 50-Vehicle Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Real-Time MQTT Stream Feed & JSON Payload Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-indigo-600 animate-pulse" />
                <h3 className="font-bold text-slate-900 text-sm">Real-Time MQTT Stream Feed</h3>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                Live Ingest
              </span>
            </div>

            {/* MQTT Messages List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {mqttMessages.map((msg) => {
                const isSelected = selectedMqttMessage?.id === msg.id;
                return (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedMqttMessage(msg)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-300 ring-1 ring-indigo-400'
                        : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-700 text-[11px]">
                          {msg.topic}
                        </span>
                        <span
                          className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                            msg.severity === 'critical'
                              ? 'bg-rose-100 text-rose-800'
                              : msg.severity === 'warning'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {msg.type}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Vehicle {msg.vehicleId} • {msg.payload.engine_temp ? `${msg.payload.engine_temp}°C` : ''} {msg.payload.battery_voltage ? `• ${msg.payload.battery_voltage}V` : ''} {msg.payload.event ? `• ${msg.payload.event}` : ''}
                      </div>
                    </div>

                    <div className="text-right font-mono text-[10px] text-slate-400 shrink-0">
                      {msg.timestamp}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Payload Viewer */}
            {selectedMqttMessage && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-slate-500" />
                    <span>Payload Inspector: {selectedMqttMessage.topic}</span>
                  </span>
                  <button
                    onClick={() => handleCopyPayload(selectedMqttMessage)}
                    className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                  >
                    {copiedPayloadId === selectedMqttMessage.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied JSON</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy JSON</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48">
                  <pre className="text-indigo-300">{JSON.stringify(selectedMqttMessage.payload, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 50-Vehicle Telemetry Stream Table (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Connected Fleet Telemetry (50 Units)</h3>
                <p className="text-xs text-slate-500">Live operational states and sensor parameters</p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
                  }`}
                >
                  All (50)
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    statusFilter === 'active' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'hover:text-slate-900'
                  }`}
                >
                  Active (48)
                </button>
                <button
                  onClick={() => setStatusFilter('at_risk')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    statusFilter === 'at_risk' ? 'bg-white text-rose-700 shadow-xs font-bold' : 'hover:text-slate-900'
                  }`}
                >
                  At Risk (7)
                </button>
              </div>
            </div>

            {/* Search Input & Metric Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search vehicle ID (e.g. 127), model, driver..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <select
                value={metricFilter}
                onChange={(e: any) => setMetricFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none"
              >
                <option value="all">All Telemetry Metrics</option>
                <option value="overheating">Elevated Temp (&gt;95°C)</option>
                <option value="battery">Low Battery (&lt;12.0V)</option>
                <option value="safety">Harsh Braking Spikes</option>
              </select>
            </div>

            {/* Vehicle Telemetry Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold sticky top-0 z-10">
                    <tr>
                      <th className="py-2.5 px-3">Vehicle</th>
                      <th className="py-2.5 px-3">Driver</th>
                      <th className="py-2.5 px-3">Engine Temp</th>
                      <th className="py-2.5 px-3">Battery</th>
                      <th className="py-2.5 px-3">Speed</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredVehicles.map((v) => {
                      const isV127 = v.id === '127';
                      const isOverheating = isV127 && overheatingStep >= 3 ? true : v.engineTemp >= 96;
                      const tempDisplay = isV127 && overheatingStep >= 3 ? (overheatingStep === 3 ? 104 : 105) : v.engineTemp;
                      const isLowBattery = v.batteryVoltage < 11.8;

                      return (
                        <tr
                          key={v.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isV127 && overheatingStep > 0 ? 'bg-indigo-50/40' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                            <div className="flex items-center gap-1.5">
                              <span>V{v.id}</span>
                              {v.activeExceptionsCount > 0 && (
                                <span className="w-2 h-2 rounded-full bg-rose-500" title="Active Exception"></span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-sans truncate max-w-[110px]">
                              {v.makeModel}
                            </div>
                          </td>

                          <td className="py-2.5 px-3 text-slate-700">
                            <div className="font-medium truncate max-w-[100px]">{v.assignedDriver}</div>
                          </td>

                          <td className="py-2.5 px-3 font-mono">
                            <span
                              className={`px-1.5 py-0.5 rounded font-bold ${
                                isOverheating
                                  ? 'bg-rose-100 text-rose-800 animate-pulse'
                                  : v.engineTemp > 93
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'text-slate-700'
                              }`}
                            >
                              {tempDisplay}°C
                            </span>
                          </td>

                          <td className="py-2.5 px-3 font-mono">
                            <span
                              className={`px-1.5 py-0.5 rounded font-bold ${
                                isLowBattery ? 'bg-rose-100 text-rose-800' : 'text-slate-700'
                              }`}
                            >
                              {v.batteryVoltage}V
                            </span>
                          </td>

                          <td className="py-2.5 px-3 font-mono text-slate-700">
                            {v.vehicleStatus === 'offline' ? '0 km/h' : `${Math.floor(v.fuelConsumption * 7)} km/h`}
                          </td>

                          <td className="py-2.5 px-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                v.vehicleStatus === 'active'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : v.vehicleStatus === 'at_risk'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {v.vehicleStatus === 'active'
                                ? 'Active'
                                : v.vehicleStatus === 'at_risk'
                                ? 'At Risk'
                                : 'Offline'}
                            </span>
                          </td>

                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => onSelectVehicle(v.id)}
                              className="text-indigo-600 hover:text-indigo-800 font-semibold text-[11px] inline-flex items-center gap-1"
                            >
                              <span>Inspect</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

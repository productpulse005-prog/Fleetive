export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type ExceptionCategory = 'Maintenance' | 'Safety' | 'Operations';
export type ExceptionStatus = 'Needs Attention' | 'Action Scheduled' | 'In Review' | 'Dismissed';
export type VehicleStatus = 'active' | 'at_risk' | 'offline' | 'maintenance';
export type ImpactLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface OperationalImpactDimensions {
  safety: ImpactLevel;
  uptime: ImpactLevel;
  cost: ImpactLevel;
  efficiency: ImpactLevel;
}

export interface OperationalContext {
  currentRoute: string;
  origin: string;
  destination: string;
  nextStop: string;
  stopsRemaining: number;
  eta: string;
  slaDeadline: string;
  slaStatus: 'on_track' | 'at_risk' | 'delayed';
  activeMission: string;
  lat: number;
  lng: number;
}

export interface BaselineComparison {
  metric: string;
  vehicleValue: string;
  fleetAverage: string;
  deviationPct: number; // e.g. +31
  insight: string;
}

export interface WhatChangedMetric {
  metric: string;
  currentValue: string;
  previousValue: string;
  changePct: number;
  direction: 'up' | 'down' | 'neutral';
  isAbnormal: boolean;
}

export interface NextBestAction {
  rank: number;
  title: string;
  description: string;
  actionType: 'schedule_inspection' | 'contact_driver' | 'reroute' | 'battery_check' | 'coach_driver' | 'review_delay';
  timeframe: string;
  suggestedRole: string;
}

export interface DriverSafetyContext {
  driverName: string;
  driverPhone: string;
  driverAvatar: string;
  harshBrakingCount: number;
  fleetAvgHarshBraking: number;
  environmentalInsight: string;
  routeLocationSummary: string;
  isEnvironmental: boolean;
}

export interface AIFeedback {
  isHelpful?: boolean;
  reason?: 'Incorrect' | 'Already resolved' | 'Low priority' | 'Not actionable' | 'Other';
  feedbackNotes?: string;
  submittedAt?: string;
}

export interface SensorEvent {
  id: string;
  time: string;
  timestamp: number;
  metric: string;
  value: number | string;
  unit?: string;
  status: 'normal' | 'warning' | 'critical';
  notes?: string;
}

export interface TimeSeriesDataPoint {
  time: string;
  timestamp: number;
  engineTemp: number;
  batteryVoltage: number;
  rpm: number;
  coolantPressure?: number;
  normalTempMin: number;
  normalTempMax: number;
  normalVoltMin: number;
  normalVoltMax: number;
  normalRpmMin: number;
  normalRpmMax: number;
}

export interface RiskBreakdown {
  severityWeight: number; // 0-100 (e.g., 90 for Critical)
  probability: number;    // 0-100 (e.g., 92%)
  businessImpactWeight: number; // 0-100 (e.g., 95% for high downtime)
  confidence: number;     // 0-100
  formulaText: string;
}

export interface Exception {
  id: string;
  vehicleId: string;
  title: string;
  category: ExceptionCategory;
  severity: SeverityLevel;
  riskScore: number; // 0-100
  riskBreakdown: RiskBreakdown;
  potentialImpact: string;
  aiSummary: string;
  
  // Explicit "What happened?", "Why does it matter?", "What could happen?", "What should I do?"
  whatHappened: string;
  whyItMatters: string;
  whatCouldHappen: string;
  whatShouldIDo: string;

  recommendedAction: string;
  suggestedTimeframe: string;
  assignedTeam: string;
  confidence: number;
  status: ExceptionStatus;
  createdAt: string;

  // New Enhanced Dimensions
  impactDimensions: OperationalImpactDimensions;
  operationalContext: OperationalContext;
  baselineComparison: BaselineComparison[];
  whatChanged: WhatChangedMetric[];
  whatChangedSummary: string;
  nextBestActions: NextBestAction[];
  driverContext?: DriverSafetyContext;
  aiFeedback?: AIFeedback;

  sensorTimeline: SensorEvent[];
  timeSeriesData: TimeSeriesDataPoint[];
  actionHistory?: {
    actionType: string;
    scheduledAt: string;
    notes?: string;
    assignedTo?: string;
    performedBy?: string;
  }[];
}

export interface Vehicle {
  id: string;
  vin: string;
  type: string;
  makeModel: string;
  year: number;
  mileage: number;
  engineTemp: number; // °C
  batteryVoltage: number; // V
  engineHours: number;
  fuelConsumption: number; // mpg or L/100km
  harshBrakings: number;
  speedingEvents: number;
  idlingHours: number;
  diagnosticEventsCount: number;
  lastMaintenanceDate: string;
  currentLocation: string;
  vehicleStatus: VehicleStatus;
  assignedDriver: string;
  driverPhone?: string;
  activeExceptionsCount: number;
  operationalContext?: OperationalContext;
}

export interface Driver {
  id: string;
  name: string;
  assignedVehicleId: string;
  safetyScore: number; // 0-100
  harshBrakingRate: number; // per 100 miles
  speedingIncidents: number;
  hoursDrivenThisWeek: number;
  coachingStatus: 'Up to Date' | 'Coaching Required' | 'Scheduled';
  phone: string;
  avatarInitials: string;
}

export interface FleetKPIs {
  totalVehicles: number;
  activeVehicles: number;
  criticalExceptions: number;
  vehiclesAtRisk: number;
  vehiclesOffline: number;
  fleetHealthScore: number;
  rawEventsToday: number;
  aiFilteredExceptions: number;
  noiseReductionPercentage: number;
}

export interface ScheduledTask {
  id: string;
  vehicleId: string;
  exceptionId: string;
  title: string;
  actionType: string;
  priority: SeverityLevel;
  suggestedTimeframe: string;
  assignedTeam: string;
  scheduledTime: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  notes?: string;
}

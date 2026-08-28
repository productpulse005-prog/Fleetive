import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Overview } from './components/Overview';
import { LiveFleetView } from './components/LiveFleetView';
import { ExceptionsList } from './components/ExceptionsList';
import { ExceptionDetail } from './components/ExceptionDetail';
import { ScheduleActionModal } from './components/ScheduleActionModal';
import { SystemArchitectureModal } from './components/SystemArchitectureModal';
import { VehiclesView } from './components/VehiclesView';
import { DriversView } from './components/DriversView';
import { MaintenanceView } from './components/MaintenanceView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { DemoTour } from './components/DemoTour';
import { ToastContainer, ToastMessage } from './components/Toast';
import {
  initialExceptions,
  mockVehicles,
  mockDrivers,
  initialFleetKPIs,
} from './data/mockData';
import { Exception, Vehicle, Driver, ScheduledTask, FleetKPIs } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [exceptions, setExceptions] = useState<Exception[]>(initialExceptions);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [kpis, setKpis] = useState<FleetKPIs>(initialFleetKPIs);
  const [selectedException, setSelectedException] = useState<Exception | null>(null);

  // Modal State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [modalTargetException, setModalTargetException] = useState<Exception | null>(null);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);

  // Search Query across app
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Telematics Refreshing indicator
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Demo Tour State
  const [isDemoTourOpen, setIsDemoTourOpen] = useState<boolean>(false);

  // Maintenance Work Queue
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([
    {
      id: 'task-init-1',
      vehicleId: '073',
      exceptionId: 'exc-prev-1',
      title: 'Routine 90-day brake caliper & rotor service',
      actionType: 'Scheduled Inspection',
      priority: 'Medium',
      suggestedTimeframe: 'Routine Maintenance',
      assignedTeam: 'Depot Maintenance Bay 2',
      scheduledTime: 'Yesterday, 16:30',
      status: 'In Progress',
      notes: 'Standard periodic heavy vehicle safety inspection.',
    },
  ]);

  const addToast = useCallback(
    (type: 'success' | 'warning' | 'info', title: string, message: string) => {
      const id = Date.now().toString() + Math.random().toString();
      setToasts((prev) => [...prev, { id, type, title, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Select Exception to view full detail
  const handleSelectException = (exception: Exception) => {
    setSelectedException(exception);
    setCurrentTab('exception_detail');
  };

  // Open Schedule Action Modal
  const handleOpenScheduleModal = (exception: Exception) => {
    setModalTargetException(exception);
    setIsScheduleModalOpen(true);
  };

  // Confirm schedule action
  const handleConfirmSchedule = (
    exceptionId: string,
    details: {
      timeframe: string;
      assignedTeam: string;
      notes: string;
      priority: string;
    }
  ) => {
    // 1. Update exception status to 'Action Scheduled'
    setExceptions((prev) =>
      prev.map((exc) => {
        if (exc.id === exceptionId) {
          return {
            ...exc,
            status: 'Action Scheduled',
            suggestedTimeframe: details.timeframe,
            assignedTeam: details.assignedTeam,
            actionHistory: [
              ...(exc.actionHistory || []),
              {
                actionType: 'Scheduled Inspection',
                scheduledAt: new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                notes: details.notes,
                assignedTo: details.assignedTeam,
                performedBy: 'Alex Morgan (Fleet Ops Lead)',
              },
            ],
          };
        }
        return exc;
      })
    );

    // If currently viewing this exception detail, update local state too
    if (selectedException && selectedException.id === exceptionId) {
      setSelectedException((prev) =>
        prev ? { ...prev, status: 'Action Scheduled' } : null
      );
    }

    // 2. Add to Maintenance Queue
    const targetExc = exceptions.find((e) => e.id === exceptionId);
    if (targetExc) {
      const newTask: ScheduledTask = {
        id: `task-${Date.now()}`,
        vehicleId: targetExc.vehicleId,
        exceptionId: targetExc.id,
        title: targetExc.title,
        actionType: 'Scheduled Inspection',
        priority: targetExc.severity,
        suggestedTimeframe: details.timeframe,
        assignedTeam: details.assignedTeam,
        scheduledTime: 'Just now',
        status: 'Pending',
        notes: details.notes,
      };
      setScheduledTasks((prev) => [newTask, ...prev]);

      addToast(
        'success',
        'Action Scheduled Successfully',
        `Vehicle ${targetExc.vehicleId} added to maintenance work queue assigned to ${details.assignedTeam}.`
      );
    }
  };

  // Contact Driver action
  const handleContactDriver = (exception: Exception) => {
    const vehicle = vehicles.find((v) => v.id === exception.vehicleId);
    const driverName = vehicle?.assignedDriver || 'Assigned Driver';
    const driverPhone = vehicle?.driverPhone || '+1 (555) 234-8910';

    addToast(
      'info',
      `Dispatch Call Initiated: ${driverName}`,
      `Connecting dispatcher console to Vehicle ${exception.vehicleId} cabin audio (${driverPhone}).`
    );
  };

  // Dismiss Exception
  const handleDismissException = (exceptionId: string) => {
    setExceptions((prev) =>
      prev.map((exc) => (exc.id === exceptionId ? { ...exc, status: 'Dismissed' } : exc))
    );
    if (selectedException && selectedException.id === exceptionId) {
      setSelectedException((prev) => (prev ? { ...prev, status: 'Dismissed' } : null));
    }
    addToast('info', 'Exception Dismissed', 'Exception marked as reviewed and dismissed.');
  };

  // AI Feedback submission handler
  const handleFeedbackSubmit = (exceptionId: string, feedback: import('./types').AIFeedback) => {
    setExceptions((prev) =>
      prev.map((exc) => (exc.id === exceptionId ? { ...exc, aiFeedback: feedback } : exc))
    );
    if (selectedException && selectedException.id === exceptionId) {
      setSelectedException((prev) => (prev ? { ...prev, aiFeedback: feedback } : null));
    }
  };

  // Sync / Refresh Telematics Stream
  const handleRefreshTelemetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setKpis((prev) => ({
        ...prev,
        rawEventsToday: prev.rawEventsToday + 34,
      }));
      addToast(
        'success',
        'Telematics Stream Synchronized',
        'Processed 34 new real-time telematics frames across 250 assets. All models nominal.'
      );
    }, 800);
  };

  // Complete maintenance task
  const handleCompleteMaintenanceTask = (taskId: string) => {
    setScheduledTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'Completed' } : t))
    );
    addToast('success', 'Work Order Completed', 'Task marked as verified and closed.');
  };

  // Get currently selected vehicle for detail
  const currentVehicleForDetail = selectedException
    ? vehicles.find((v) => v.id === selectedException.vehicleId) || vehicles[0]
    : vehicles[0];

  const criticalCount = exceptions.filter(
    (e) => e.severity === 'Critical' && e.status === 'Needs Attention'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab === 'exception_detail' ? 'exceptions' : currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'exceptions' && tab !== 'exception_detail') {
            setSelectedException(null);
          }
        }}
        exceptionCount={exceptions.filter((e) => e.status === 'Needs Attention').length}
        criticalCount={criticalCount}
      />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar
          onStartTour={() => setIsDemoTourOpen(true)}
          onRefreshTelemetry={handleRefreshTelemetry}
          onOpenArchitecture={() => setIsArchitectureOpen(true)}
          isRefreshing={isRefreshing}
          onSearchClick={() => {
            if (currentTab !== 'exceptions') setCurrentTab('exceptions');
          }}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (currentTab !== 'exceptions' && q.trim()) {
              setCurrentTab('exceptions');
            }
          }}
          unreadCount={criticalCount}
          onNotificationClick={() => {
            setCurrentTab('exceptions');
            setSelectedException(null);
          }}
        />

        <main className="flex-1 pb-16">
          {currentTab === 'overview' && (
            <Overview
              kpis={kpis}
              exceptions={exceptions}
              onSelectException={handleSelectException}
              onNavigateToExceptions={() => setCurrentTab('exceptions')}
              onNavigateToVehicles={() => setCurrentTab('vehicles')}
              onNavigateToLiveFleet={() => setCurrentTab('live_fleet')}
            />
          )}

          {currentTab === 'live_fleet' && (
            <LiveFleetView
              vehicles={vehicles}
              exceptions={exceptions}
              onSelectVehicle={(vehicleId) => {
                const exc = exceptions.find((e) => e.vehicleId === vehicleId);
                if (exc) {
                  handleSelectException(exc);
                } else {
                  const v = vehicles.find((item) => item.id === vehicleId);
                  addToast(
                    'info',
                    `Vehicle V${vehicleId} Telemetry`,
                    `${v?.makeModel || 'Unit'} is operating within nominal parameters.`
                  );
                }
              }}
              onSelectException={handleSelectException}
              onOpenScheduleModal={handleOpenScheduleModal}
              onOpenArchitecture={() => setIsArchitectureOpen(true)}
            />
          )}

          {currentTab === 'exceptions' && (
            <ExceptionsList
              exceptions={exceptions}
              onSelectException={handleSelectException}
              onOpenScheduleModal={handleOpenScheduleModal}
              onContactDriver={handleContactDriver}
              onDismissException={handleDismissException}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}

          {currentTab === 'exception_detail' && selectedException && (
            <ExceptionDetail
              exception={selectedException}
              vehicle={currentVehicleForDetail}
              onBack={() => setCurrentTab('exceptions')}
              onOpenScheduleModal={handleOpenScheduleModal}
              onContactDriver={handleContactDriver}
              onDismiss={handleDismissException}
              onFeedbackSubmit={handleFeedbackSubmit}
            />
          )}

          {currentTab === 'vehicles' && (
            <VehiclesView
              vehicles={vehicles}
              exceptions={exceptions}
              onSelectVehicle={(v) => {
                const exc = exceptions.find((e) => e.vehicleId === v.id);
                if (exc) {
                  handleSelectException(exc);
                } else {
                  addToast(
                    'info',
                    `Vehicle ${v.id} Selected`,
                    `${v.makeModel} is currently operating within nominal telemetry limits.`
                  );
                }
              }}
              onSelectExceptionForVehicle={(vehicleId) => {
                const exc = exceptions.find((e) => e.vehicleId === vehicleId);
                if (exc) {
                  handleSelectException(exc);
                }
              }}
            />
          )}

          {currentTab === 'drivers' && (
            <DriversView
              drivers={drivers}
              onOpenCoaching={(d) => {
                addToast(
                  'info',
                  `Driver Coaching: ${d.name}`,
                  `Opening proactive safety module for Vehicle ${d.assignedVehicleId}.`
                );
              }}
            />
          )}

          {currentTab === 'maintenance' && (
            <MaintenanceView
              scheduledTasks={scheduledTasks}
              onCompleteTask={handleCompleteMaintenanceTask}
            />
          )}

          {currentTab === 'analytics' && <AnalyticsView />}

          {currentTab === 'settings' && (
            <SettingsView
              onSaveSettings={() => {
                addToast(
                  'success',
                  'AI Triage Configuration Saved',
                  'Anomaly thresholds and autonomous workflow policies updated.'
                );
              }}
              onOpenArchitecture={() => setIsArchitectureOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Schedule Action Modal */}
      <ScheduleActionModal
        exception={modalTargetException}
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setModalTargetException(null);
        }}
        onConfirmSchedule={handleConfirmSchedule}
      />

      {/* System & Telematics Architecture Modal */}
      <SystemArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* 3-Minute Demo Guided Walkthrough Floating Controller */}
      <DemoTour
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onNavigateTab={(tab) => setCurrentTab(tab)}
        onSelectVehicle127={() => {
          const exc127 = exceptions.find((e) => e.vehicleId === '127');
          if (exc127) {
            handleSelectException(exc127);
          }
        }}
        onTriggerScheduleVehicle127={() => {
          const exc127 = exceptions.find((e) => e.vehicleId === '127');
          if (exc127) {
            handleOpenScheduleModal(exc127);
          }
        }}
      />

      {/* Enterprise Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}

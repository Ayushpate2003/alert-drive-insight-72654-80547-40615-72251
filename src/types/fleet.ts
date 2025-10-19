export interface Trip {
  id: string;
  driverId: string;
  startTime: Date;
  endTime: Date;
  distance: number;
  fatigueScore: number;
  stressLevel: number;
  route: string;
  status: 'completed' | 'ongoing' | 'scheduled';
}

export interface FleetDriver {
  id: string;
  name: string;
  email: string;
  vehicleId: string;
  status: 'active' | 'on-break' | 'off-duty';
  fatigueScore: number;
  stressLevel: number;
  lastUpdate: Date;
  totalTrips: number;
  alertLevel: 'normal' | 'warning' | 'critical';
}

export interface FleetAnalytics {
  totalDrivers: number;
  activeDrivers: number;
  criticalAlerts: number;
  averageFatigueScore: number;
  totalTripsToday: number;
  fleetSafetyScore: number;
}

export interface Alert {
  id: string;
  driverId: string;
  driverName: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: Date;
  acknowledged: boolean;
}

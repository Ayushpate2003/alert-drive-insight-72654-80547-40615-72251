export interface DriverStatus {
  driverId: string;
  name: string;
  fatigue: number; // 0-1
  stress: number; // 0-1
  steeringStability: number; // 0-1
  overallScore: number; // 0-1
  category: 'Safe' | 'Warning' | 'Critical' | 'Danger';
  timestamp: Date;
}

export interface MetricDataPoint {
  timestamp: Date;
  fatigue: number;
  stress: number;
  steeringStability: number;
}

export interface Trip {
  tripId: string;
  driverId: string;
  driverName: string;
  startTime: Date;
  endTime?: Date;
  route: string;
  avgFatigue: number;
  avgStress: number;
  maxFatigue: number;
  incidents: number;
  status: 'active' | 'completed' | 'interrupted';
}

export interface RAGRecommendation {
  id: string;
  driverId: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: Date;
  context?: string;
}

export interface SensorData {
  eyeBlinkRate: number;
  yawnCount: number;
  headDroop: number;
  heartRate: number;
  skinConductance: number;
  steeringAngle: number;
  laneDeviation: number;
}
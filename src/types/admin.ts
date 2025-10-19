import { UserRole } from './auth';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: Date;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: Date;
  ipAddress?: string;
}

export interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  activeSessions: number;
  databaseSize: string;
  systemHealth: number;
  cpuUsage: number;
  memoryUsage: number;
  apiCalls24h: number;
}

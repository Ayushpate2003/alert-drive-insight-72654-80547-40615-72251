import { useState, useEffect } from 'react';
import { SystemUser, AuditLog, SystemMetrics } from '@/types/admin';

export const useAdminData = () => {
  const [users, setUsers] = useState<SystemUser[]>([
    {
      id: '1',
      name: 'John Driver',
      email: 'driver@test.com',
      role: 'driver',
      status: 'active',
      lastLogin: new Date(Date.now() - 1000 * 60 * 30),
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Sarah Manager',
      email: 'manager@test.com',
      role: 'fleet_manager',
      status: 'active',
      lastLogin: new Date(Date.now() - 1000 * 60 * 15),
      createdAt: new Date('2024-01-10'),
    },
    {
      id: '3',
      name: 'Admin User',
      email: 'admin@test.com',
      role: 'admin',
      status: 'active',
      lastLogin: new Date(),
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '4',
      name: 'Mike Johnson',
      email: 'mike@test.com',
      role: 'driver',
      status: 'active',
      lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2),
      createdAt: new Date('2024-02-01'),
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: '1',
      userId: '2',
      userName: 'Sarah Manager',
      action: 'VIEW_FLEET_DASHBOARD',
      details: 'Accessed fleet analytics',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: '2',
      userId: '1',
      userName: 'John Driver',
      action: 'LOGIN',
      details: 'User logged in successfully',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: '3',
      userId: '3',
      userName: 'Admin User',
      action: 'UPDATE_USER_ROLE',
      details: 'Changed role for user Mike Johnson',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
  ]);

  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalUsers: 4,
    activeUsers: 4,
    activeSessions: 3,
    databaseSize: '2.4 GB',
    systemHealth: 98,
    cpuUsage: 0,
    memoryUsage: 0,
    apiCalls24h: 1247,
  });

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        cpuUsage: Math.round(15 + Math.random() * 25),
        memoryUsage: Math.round(45 + Math.random() * 15),
        systemHealth: Math.round(95 + Math.random() * 5),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: `log_${Date.now()}`,
      timestamp: new Date(),
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  return { users, setUsers, auditLogs, metrics, addAuditLog };
};

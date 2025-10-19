import { useState, useEffect } from 'react';
import { FleetDriver, FleetAnalytics, Alert } from '@/types/fleet';

export const useFleetData = () => {
  const [drivers, setDrivers] = useState<FleetDriver[]>([]);
  const [analytics, setAnalytics] = useState<FleetAnalytics>({
    totalDrivers: 0,
    activeDrivers: 0,
    criticalAlerts: 0,
    averageFatigueScore: 0,
    totalTripsToday: 0,
    fleetSafetyScore: 0,
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Initialize mock fleet data
    const mockDrivers: FleetDriver[] = [
      {
        id: 'D001',
        name: 'John Smith',
        email: 'john.smith@fleet.com',
        vehicleId: 'TRK-A101',
        status: 'active',
        fatigueScore: 0,
        stressLevel: 0,
        lastUpdate: new Date(),
        totalTrips: 145,
        alertLevel: 'normal',
      },
      {
        id: 'D002',
        name: 'Sarah Connor',
        email: 'sarah.connor@fleet.com',
        vehicleId: 'TRK-B202',
        status: 'active',
        fatigueScore: 0,
        stressLevel: 0,
        lastUpdate: new Date(),
        totalTrips: 167,
        alertLevel: 'normal',
      },
      {
        id: 'D003',
        name: 'Mike Johnson',
        email: 'mike.j@fleet.com',
        vehicleId: 'TRK-C303',
        status: 'active',
        fatigueScore: 0,
        stressLevel: 0,
        lastUpdate: new Date(),
        totalTrips: 98,
        alertLevel: 'normal',
      },
      {
        id: 'D004',
        name: 'Emily Davis',
        email: 'emily.d@fleet.com',
        vehicleId: 'TRK-D404',
        status: 'on-break',
        fatigueScore: 0,
        stressLevel: 0,
        lastUpdate: new Date(),
        totalTrips: 123,
        alertLevel: 'normal',
      },
    ];

    setDrivers(mockDrivers);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setDrivers((prevDrivers) =>
        prevDrivers.map((driver) => {
          const fatigue = Math.max(0, Math.min(100, 35 + Math.random() * 40 + Math.sin(Date.now() / 20000) * 15));
          const stress = Math.max(0, Math.min(100, 30 + Math.random() * 35));
          
          let alertLevel: 'normal' | 'warning' | 'critical' = 'normal';
          if (fatigue > 70 || stress > 70) alertLevel = 'critical';
          else if (fatigue > 55 || stress > 55) alertLevel = 'warning';

          return {
            ...driver,
            fatigueScore: Math.round(fatigue),
            stressLevel: Math.round(stress),
            lastUpdate: new Date(),
            alertLevel,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update analytics based on driver data
    const activeDrivers = drivers.filter((d) => d.status === 'active').length;
    const criticalCount = drivers.filter((d) => d.alertLevel === 'critical').length;
    const avgFatigue = drivers.length > 0
      ? drivers.reduce((sum, d) => sum + d.fatigueScore, 0) / drivers.length
      : 0;
    const safetyScore = 100 - avgFatigue;

    setAnalytics({
      totalDrivers: drivers.length,
      activeDrivers,
      criticalAlerts: criticalCount,
      averageFatigueScore: Math.round(avgFatigue),
      totalTripsToday: drivers.reduce((sum, d) => sum + Math.floor(Math.random() * 3), 0),
      fleetSafetyScore: Math.round(safetyScore),
    });

    // Generate alerts for critical drivers
    const criticalDriversList = drivers.filter((d) => d.alertLevel === 'critical');
    if (criticalDriversList.length > 0 && Math.random() > 0.7) {
      const driver = criticalDriversList[Math.floor(Math.random() * criticalDriversList.length)];
      setAlerts((prev) => [
        {
          id: `alert_${Date.now()}`,
          driverId: driver.id,
          driverName: driver.name,
          message: `${driver.name} has elevated fatigue level (${driver.fatigueScore}%). Recommend immediate rest break.`,
          severity: 'critical',
          timestamp: new Date(),
          acknowledged: false,
        },
        ...prev.slice(0, 9),
      ]);
    }
  }, [drivers]);

  return { drivers, analytics, alerts };
};

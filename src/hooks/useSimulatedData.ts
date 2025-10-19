import { useState, useEffect } from 'react';
import { DriverStatus, MetricDataPoint, RAGRecommendation } from '@/types/monitoring';

// Simulates real-time data - replace with actual WebSocket/API calls
export const useSimulatedData = () => {
  const [driverStatus, setDriverStatus] = useState<DriverStatus>({
    driverId: 'D001',
    name: 'John Smith',
    fatigue: 0.25,
    stress: 0.30,
    steeringStability: 0.85,
    overallScore: 0.77,
    category: 'Safe',
    timestamp: new Date(),
  });

  const [metricsHistory, setMetricsHistory] = useState<MetricDataPoint[]>([]);
  const [recommendations, setRecommendations] = useState<RAGRecommendation[]>([]);

  useEffect(() => {
    // Simulate real-time updates every 2 seconds
    const interval = setInterval(() => {
      // Generate realistic fluctuating values
      const time = Date.now();
      const fatigueBase = 0.3 + Math.sin(time / 30000) * 0.2;
      const stressBase = 0.25 + Math.cos(time / 20000) * 0.15;
      
      const newFatigue = Math.max(0, Math.min(1, fatigueBase + (Math.random() - 0.5) * 0.1));
      const newStress = Math.max(0, Math.min(1, stressBase + (Math.random() - 0.5) * 0.1));
      const newSteering = Math.max(0.5, Math.min(1, 0.8 - newFatigue * 0.3 + Math.random() * 0.1));

      const overallScore = (1 - newFatigue) * 0.6 + newSteering * 0.25 + (1 - newStress) * 0.15;
      
      let category: 'Safe' | 'Warning' | 'Critical' | 'Danger';
      if (overallScore >= 0.75) category = 'Safe';
      else if (overallScore >= 0.5) category = 'Warning';
      else if (overallScore >= 0.3) category = 'Critical';
      else category = 'Danger';

      setDriverStatus({
        driverId: 'D001',
        name: 'John Smith',
        fatigue: newFatigue,
        stress: newStress,
        steeringStability: newSteering,
        overallScore,
        category,
        timestamp: new Date(),
      });

      // Add to history
      setMetricsHistory(prev => {
        const newPoint: MetricDataPoint = {
          timestamp: new Date(),
          fatigue: newFatigue,
          stress: newStress,
          steeringStability: newSteering,
        };
        const updated = [...prev, newPoint];
        return updated.slice(-50); // Keep last 50 points
      });

      // Generate recommendations when fatigue is high
      if (newFatigue > 0.6 && Math.random() > 0.8) {
        const messages = [
          'Your fatigue level is elevated. Consider taking a 10-minute rest break within the next 15 km.',
          'Heart rate variability has decreased by 20%. Pull over safely when possible.',
          'Blink duration increased. Stay alert and avoid monotonous highway sections.',
          'Steering corrections are becoming more frequent. Time for a break.',
        ];
        
        setRecommendations(prev => [{
          id: `rec_${Date.now()}`,
          driverId: 'D001',
          message: messages[Math.floor(Math.random() * messages.length)],
          severity: newFatigue > 0.75 ? 'critical' : 'warning',
          timestamp: new Date(),
          context: 'Real-time monitoring detected elevated fatigue markers',
        }, ...prev.slice(0, 9)]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return {
    driverStatus,
    metricsHistory,
    recommendations,
  };
};
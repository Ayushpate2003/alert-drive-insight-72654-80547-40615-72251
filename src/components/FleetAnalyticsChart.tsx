import { Card } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

const fatigueData = [
  { name: 'Mon', avgFatigue: 32, incidents: 1 },
  { name: 'Tue', avgFatigue: 41, incidents: 2 },
  { name: 'Wed', avgFatigue: 38, incidents: 1 },
  { name: 'Thu', avgFatigue: 45, incidents: 3 },
  { name: 'Fri', avgFatigue: 52, incidents: 4 },
  { name: 'Sat', avgFatigue: 28, incidents: 0 },
  { name: 'Sun', avgFatigue: 25, incidents: 0 },
];

export const FleetAnalyticsChart = () => {
  return (
    <Card className="p-6 bg-card border-border">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        Fleet-Wide Analytics
      </h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Weekly Fatigue Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={fatigueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="avgFatigue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Safety Incidents by Day</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={fatigueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="incidents" fill="hsl(var(--destructive))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

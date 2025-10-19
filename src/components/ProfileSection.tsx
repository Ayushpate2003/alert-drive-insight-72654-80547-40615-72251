import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Car, Calendar, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

export const ProfileSection = () => {
  const { user } = useAuth();

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Driver Profile
        </h2>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{user?.name}</p>
            <Badge variant="secondary">{user?.role.replace('_', ' ').toUpperCase()}</Badge>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Email:</span>
            <span className="text-foreground font-medium">{user?.email}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Car className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Vehicle:</span>
            <span className="text-foreground font-medium">TRK-A101</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Member Since:</span>
            <span className="text-foreground font-medium">
              {user?.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-2">Performance Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-secondary/30">
              <p className="text-2xl font-bold text-foreground">145</p>
              <p className="text-xs text-muted-foreground">Total Trips</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/30">
              <p className="text-2xl font-bold text-[hsl(var(--success))]">92%</p>
              <p className="text-xs text-muted-foreground">Safety Score</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

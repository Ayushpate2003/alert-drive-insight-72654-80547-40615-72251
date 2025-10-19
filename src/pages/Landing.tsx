import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Activity, Brain, Eye, Gauge, Shield, TrendingUp, AlertTriangle, BarChart3, LogOut } from 'lucide-react';

const Landing = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated && user) {
      // Redirect based on role
      if (user.role === 'driver') navigate('/dashboard');
      else if (user.role === 'fleet_manager') navigate('/fleet');
      else if (user.role === 'admin') navigate('/admin');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header with Auth buttons */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            <span className="font-bold text-foreground">Driver Safety</span>
          </div>
          <div className="flex gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground mr-2 flex items-center">
                  Welcome, {user?.name}
                </span>
                <Button variant="outline" size="sm" onClick={handleGetStarted}>
                  Go to Dashboard
                </Button>
                <Button variant="ghost" size="sm" onClick={() => logout()}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Safety Monitoring</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Driver Fatigue Detection
              <span className="block text-primary mt-2">Real-Time AI Monitoring</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Advanced AI system that monitors driver fatigue and stress levels in real-time, 
              providing intelligent recommendations to prevent accidents and save lives.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200" 
                onClick={handleGetStarted}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 border-2 border-primary bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:shadow-xl hover:shadow-primary/20 transition-all duration-200"
              >
                <a href="#features">Learn More</a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-16 max-w-3xl mx-auto">
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="text-3xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground mt-1">Accuracy</div>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="text-3xl font-bold text-primary">&lt;100ms</div>
                <div className="text-sm text-muted-foreground mt-1">Response Time</div>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground mt-1">Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Advanced Monitoring Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our system combines multiple data sources and AI models to provide comprehensive safety monitoring
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FeatureCard
              icon={Eye}
              title="Facial Recognition"
              description="Real-time eye tracking, blink rate analysis, and yawn detection using computer vision"
            />
            <FeatureCard
              icon={Gauge}
              title="Steering Analysis"
              description="Monitor steering patterns and detect erratic behavior indicating drowsiness"
            />
            <FeatureCard
              icon={Activity}
              title="Wearable Integration"
              description="Heart rate, skin conductance, and stress level monitoring from wearable sensors"
            />
            <FeatureCard
              icon={Brain}
              title="AI-Powered RAG"
              description="Retrieval-augmented generation for personalized safety recommendations"
            />
            <FeatureCard
              icon={AlertTriangle}
              title="Smart Alerts"
              description="Intelligent warning system with severity-based notifications"
            />
            <FeatureCard
              icon={BarChart3}
              title="Analytics Dashboard"
              description="Comprehensive insights and historical trip data visualization"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our multi-layered approach ensures accurate fatigue detection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <ProcessStep
              number="1"
              title="Data Collection"
              description="Camera, steering, and wearable sensors capture real-time data"
            />
            <ProcessStep
              number="2"
              title="AI Analysis"
              description="Advanced models process and analyze driver behavior patterns"
            />
            <ProcessStep
              number="3"
              title="Score Calculation"
              description="Multi-factor algorithm computes overall driver safety score"
            />
            <ProcessStep
              number="4"
              title="Smart Alerts"
              description="RAG-based system generates personalized recommendations"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/10">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-8 md:p-12 bg-card border-primary/30 text-center">
            <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Enhance Driver Safety?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start monitoring driver fatigue in real-time with our AI-powered system
            </p>
            <Button size="lg" className="text-lg px-8" onClick={handleGetStarted}>
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Driver Fatigue Monitor. AI-Powered Safety System.</p>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="p-6 bg-card border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 group">
      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/30 transition-all duration-300">
        <Icon className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </Card>
  );
};

interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
}

const ProcessStep = ({ number, title, description }: ProcessStepProps) => {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-4 border-2 border-primary">
        {number}
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Landing;

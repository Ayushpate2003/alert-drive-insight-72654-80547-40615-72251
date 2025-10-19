import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Activity, Brain, Eye, Gauge, Shield, TrendingUp, AlertTriangle, BarChart3, LogOut, ArrowRight } from 'lucide-react';
import { NeuralBackground } from '@/components/NeuralBackground';
import { WireframeCar } from '@/components/WireframeCar';
import { useEffect, useRef, useState } from 'react';

const Landing = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => {
      if (observerRef.current) {
        observerRef.current.observe(section);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

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
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Neural Network Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background">
          <NeuralBackground />
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6 animate-pulse-glow">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Safety Monitoring</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="text-foreground">Driver Fatigue Detection</span>
                <span className="block text-primary mt-2 drop-shadow-[0_0_30px_rgba(0,191,255,0.5)]">
                  Real-Time AI Monitoring
                </span>
              </h1>
            
              <p className="text-lg md:text-xl text-muted-foreground mb-8 lg:max-w-xl">
                Advanced AI system that monitors driver fatigue and stress levels in real-time, 
                providing intelligent recommendations to prevent accidents and save lives.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Button 
                  size="lg" 
                  className="text-lg px-8 hover:scale-105 hover:shadow-2xl hover:shadow-primary/50 transition-all duration-200 drop-shadow-[0_0_20px_rgba(0,191,255,0.3)]" 
                  onClick={handleGetStarted}
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                  <ArrowRight className="ml-2 w-5 h-5" />
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
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-card/50 backdrop-blur border border-primary/30 hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
                  <div className="text-3xl font-bold text-primary drop-shadow-[0_0_10px_rgba(0,191,255,0.5)]">95%</div>
                  <div className="text-sm text-muted-foreground mt-1">Accuracy</div>
                </div>
                <div className="p-4 rounded-lg bg-card/50 backdrop-blur border border-primary/30 hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
                  <div className="text-3xl font-bold text-primary drop-shadow-[0_0_10px_rgba(0,191,255,0.5)]">&lt;100ms</div>
                  <div className="text-sm text-muted-foreground mt-1">Response Time</div>
                </div>
                <div className="p-4 rounded-lg bg-card/50 backdrop-blur border border-primary/30 hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
                  <div className="text-3xl font-bold text-primary drop-shadow-[0_0_10px_rgba(0,191,255,0.5)]">24/7</div>
                  <div className="text-sm text-muted-foreground mt-1">Monitoring</div>
                </div>
              </div>
            </div>

            {/* Right: Wireframe Car Animation */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent blur-3xl animate-pulse-glow" />
                <WireframeCar />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features" 
        data-animate 
        className="py-16 md:py-24 bg-secondary/30 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div 
            className={`text-center mb-12 transition-all duration-1000 ${
              isVisible['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
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
      <section 
        id="how-it-works" 
        data-animate 
        className="py-16 md:py-24 relative"
      >
        <div className="container mx-auto px-4">
          <div 
            className={`text-center mb-12 transition-all duration-1000 ${
              isVisible['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our multi-layered approach ensures accurate fatigue detection
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <ProcessStep
                number="1"
                title="Data Collection"
                description="Camera, steering, and wearable sensors capture real-time data"
                isVisible={isVisible['how-it-works']}
                delay={0}
              />
              <ProcessStep
                number="2"
                title="AI Analysis"
                description="Advanced models process and analyze driver behavior patterns"
                isVisible={isVisible['how-it-works']}
                delay={200}
              />
              <ProcessStep
                number="3"
                title="Score Calculation"
                description="Multi-factor algorithm computes overall driver safety score"
                isVisible={isVisible['how-it-works']}
                delay={400}
              />
              <ProcessStep
                number="4"
                title="Smart Alerts"
                description="RAG-based system generates personalized recommendations"
                isVisible={isVisible['how-it-works']}
                delay={600}
              />
            </div>

            {/* Animated data flow between steps */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-primary/20">
              {isVisible['how-it-works'] && (
                <div className="h-full w-1/4 bg-gradient-to-r from-transparent via-primary to-transparent animate-data-flow" />
              )}
            </div>
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
    <Card className="p-6 bg-card/50 backdrop-blur border-border hover:border-primary hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/50">
          <Icon className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform duration-300 drop-shadow-[0_0_5px_rgba(0,191,255,0.5)]" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </Card>
  );
};

interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
  isVisible?: boolean;
  delay?: number;
}

const ProcessStep = ({ number, title, description, isVisible, delay = 0 }: ProcessStepProps) => {
  return (
    <div 
      className={`text-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-4 border-2 border-primary hover:scale-110 hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 group">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping-slow" />
        <span className="relative z-10 drop-shadow-[0_0_5px_rgba(0,191,255,0.5)]">{number}</span>
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Landing;

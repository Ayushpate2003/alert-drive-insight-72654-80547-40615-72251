import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Activity,
  Brain,
  Eye,
  Gauge,
  Shield,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  LogOut,
  ArrowRight,
  Play,
  Users,
  Settings,
  Camera,
  Zap,
  Database,
  Github,
  Mail,
  ChevronRight,
  Star,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { NeuralBackground } from "@/components/NeuralBackground";
import { WireframeCar } from "@/components/WireframeCar";
import { useEffect, useRef, useState } from "react";
import { DashCamSubPages } from "@/components/DashCamSubPages";

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

    const sections = document.querySelectorAll("[data-animate]");
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
      if (user.role === "driver") navigate("/dashboard/driver");
      else if (user.role === "manager") navigate("/dashboard/manager");
      else if (user.role === "admin") navigate("/dashboard/admin");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center pt-16 md:pt-0">
        {/* Neural Network Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background">
          <NeuralBackground />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/20 border border-primary/30 mb-4 sm:mb-6 animate-pulse-glow">
                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-primary">
                  AI-Powered Safety Monitoring
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                <span className="text-foreground">
                  Smart Driver Safety & Fatigue Monitoring System
                </span>
                <span className="block text-primary mt-2 sm:mt-3 text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium drop-shadow-[0_0_20px_rgba(0,191,255,0.5)]">
                  (Powered by AI + RAG + DashCam)
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0">
                AI that protects drivers — real-time awareness, fatigue alerts,
                and safe-distance guidance.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 justify-center lg:justify-start mb-8 sm:mb-12">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base sm:text-lg px-4 sm:px-6 py-5 sm:py-6 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/50 transition-all duration-200 drop-shadow-[0_0_20px_rgba(0,191,255,0.3)]"
                  onClick={() => navigate("/login")}
                >
                  Driver Login / Dashboard
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base sm:text-lg px-4 sm:px-6 py-5 sm:py-6 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/50 transition-all duration-200"
                  onClick={() => navigate("/login")}
                >
                  Manager Portal
                </Button>
                <div className="sm:col-span-2">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full text-base sm:text-lg px-4 sm:px-6 py-5 sm:py-6 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/50 transition-all duration-200"
                    onClick={() => navigate("/login")}
                  >
                    Admin Console
                  </Button>
                </div>
                <div className="sm:col-span-2">
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full text-base sm:text-lg px-4 sm:px-6 py-5 sm:py-6 border-2 border-primary bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20 transition-all duration-200"
                  >
                    <a href="#demo" className="flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" />
                      Watch Demo Video
                    </a>
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-2xl mx-auto lg:mx-0">
                {[
                  { value: '95%', label: 'Accuracy' },
                  { value: '<100ms', label: 'Response Time' },
                  { value: '24/7', label: 'Monitoring' }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className="p-2 sm:p-3 md:p-4 rounded-lg bg-card/50 backdrop-blur border border-primary/20 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 text-center"
                  >
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary drop-shadow-[0_0_10px_rgba(0,191,255,0.5)]">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
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

      {/* 2. About System / Overview Page */}
      <section
        id="about"
        data-animate
        className="py-16 md:py-24 bg-secondary/30 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,191,255,0.1),transparent_70%)] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              isVisible["about"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 drop-shadow-[0_0_20px_rgba(0,191,255,0.5)]">
              About System / Overview
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explain the purpose, architecture, and safety impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <FeatureCard
              icon={Settings}
              title=" How It Works"
              description="Visual flowchart (camera + sensors → AI → RAG → alerts)"
            />
            <FeatureCard
              icon={Brain}
              title=" RAG Intelligence Explained"
              description="Simple breakdown of retrieval and advice generation"
            />
            <FeatureCard
              icon={Database}
              title=" Open-Source Stack"
              description="List of frameworks and tools (OpenCV, PyTorch, LangChain, etc.)"
            />
            <FeatureCard
              icon={TrendingUp}
              title=" Why It Matters"
              description="Accident prevention, fleet safety, personalized awareness"
            />
          </div>
        </div>
      </section>

      {/* 3. DashCam Intelligence Section */}
      <section
        id="dashcam"
        data-animate
        className="py-16 md:py-24 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(0,191,255,0.15),transparent_60%)] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              isVisible["dashcam"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 drop-shadow-[0_0_20px_rgba(0,191,255,0.5)]">
              ⚙️ How the DashCam Module Enhances the System
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the technical details and real-time capabilities of our AI-powered DashCam system.
            </p>
          </div>

          <DashCamSubPages />
        </div>
      </section>

      {/* Video Demo Section */}
      <section
        id="demo"
        data-animate
        className="py-16 md:py-24 bg-secondary/20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              isVisible["demo"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Live Demo Video
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Watch our AI-powered driver monitoring system in action.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden bg-card/50 backdrop-blur border border-primary/30 shadow-2xl shadow-primary/20">
              <video
                className="w-full h-auto"
                muted
                autoPlay
                loop
                playsInline
                poster="/placeholder.svg"
              >
                <source src="/video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Role-Based Access Section */}
      <section
        id="roles"
        data-animate
        className="py-16 md:py-24 bg-secondary/30 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,191,255,0.1),transparent_70%)] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              isVisible["roles"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 drop-shadow-[0_0_20px_rgba(0,191,255,0.5)]">
              Role-Based Access
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Clearly define who can use what and direct users to their portals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <RoleCard
              icon={Users}
              title="Driver Role"
              features={[
                "Live Dashboard",
                "Fatigue & Stress Monitor",
                "DashCam Feed",
                "Trip History & Alerts",
              ]}
              buttonText="Go to Portal"
            />
            <RoleCard
              icon={Settings}
              title="Manager Role"
              features={[
                "Fleet Overview Dashboard",
                "Driver Performance Analytics",
                "Trip Safety Reports",
                "Incident Review & Coaching",
              ]}
              buttonText="Go to Portal"
            />
            <RoleCard
              icon={Shield}
              title="Admin Role"
              features={[
                "User Management",
                "Model & System Monitoring",
                "Data & Privacy Controls",
                "AI Retraining & Deployment",
              ]}
              buttonText="Go to Portal"
            />
          </div>
        </div>
      </section>

      {/* 5. Key Features Section */}
      <section
        id="features"
        data-animate
        className="py-16 md:py-24 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,191,255,0.1),transparent_70%)] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              isVisible["features"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 drop-shadow-[0_0_20px_rgba(0,191,255,0.5)]">
              Key Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Highlight major components of your system in a visually engaging
              way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FeatureCard
              icon={Eye}
              title="Cabin Video Fatigue Detection"
              description="Real-time eye tracking, blink rate analysis, and yawn detection using computer vision"
            />
            <FeatureCard
              icon={Gauge}
              title="Steering Pattern Tracking"
              description="Monitor steering patterns and detect erratic behavior indicating drowsiness"
            />
            <FeatureCard
              icon={Activity}
              title="Wearable Stress Data Integration"
              description="Heart rate, skin conductance, and stress level monitoring from wearable sensors"
            />
            <FeatureCard
              icon={Camera}
              title="DashCam Speed & Distance Estimation (NEW)"
              description="Real-time object tracking and safe distance monitoring"
            />
            <FeatureCard
              icon={Brain}
              title="RAG-Based Personalized Suggestions"
              description="Retrieval-augmented generation for personalized safety recommendations"
            />
            <FeatureCard
              icon={BarChart3}
              title="Web Dashboard Visualization"
              description="Comprehensive insights and historical trip data visualization"
            />
            <FeatureCard
              icon={Shield}
              title="Edge + Privacy Layer"
              description="Secure data processing with privacy protection"
            />
          </div>
        </div>
      </section>

      {/* 6. Live Dashboard Preview Section */}
      <section
        id="dashboard-preview"
        data-animate
        className="py-16 md:py-24 bg-secondary/30 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,191,255,0.15),transparent_60%)] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              isVisible["dashboard-preview"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 drop-shadow-[0_0_20px_rgba(0,191,255,0.5)]">
              Live Dashboard Preview
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See the system in action with real-time monitoring dashboards for
              drivers, managers, and admins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <DashboardPreviewCard
              title="Driver Dashboard"
              description="Real-time fatigue monitoring, alerts, and trip data"
              features={[
                "Live camera feed with AI overlays",
                "Fatigue score & stress indicators",
                "DashCam distance alerts",
                "Trip history & safety reports",
              ]}
              buttonText="Try Demo Login"
            />
            <DashboardPreviewCard
              title="Manager Portal"
              description="Fleet-wide analytics and driver performance insights"
              features={[
                "Fleet overview with safety metrics",
                "Driver performance rankings",
                "Incident reports & coaching tools",
                "Real-time alerts dashboard",
              ]}
              buttonText="Try Demo Login"
            />
            <DashboardPreviewCard
              title="Admin Console"
              description="System monitoring, user management, and AI model controls"
              features={[
                "User & role management",
                "System health monitoring",
                "AI model retraining interface",
                "Data privacy & compliance tools",
              ]}
              buttonText="Try Demo Login"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        data-animate
        className="py-16 md:py-24 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,191,255,0.1),transparent_70%)] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              isVisible["how-it-works"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 drop-shadow-[0_0_20px_rgba(0,191,255,0.5)]">
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
                isVisible={isVisible["how-it-works"]}
                delay={0}
              />
              <ProcessStep
                number="2"
                title="AI Analysis"
                description="Advanced models process and analyze driver behavior patterns"
                isVisible={isVisible["how-it-works"]}
                delay={200}
              />
              <ProcessStep
                number="3"
                title="Score Calculation"
                description="Multi-factor algorithm computes overall driver safety score"
                isVisible={isVisible["how-it-works"]}
                delay={400}
              />
              <ProcessStep
                number="4"
                title="Smart Alerts"
                description="RAG-based system generates personalized recommendations"
                isVisible={isVisible["how-it-works"]}
                delay={600}
              />
            </div>

            {/* Animated data flow between steps */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-primary/20">
              {isVisible["how-it-works"] && (
                <div className="h-full w-1/4 bg-gradient-to-r from-transparent via-primary to-transparent animate-data-flow" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,191,255,0.1),transparent_70%)] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <Card className="max-w-4xl mx-auto p-8 md:p-12 bg-card border-primary/30 text-center">
            <Shield className="w-16 h-16 text-primary mx-auto mb-6 drop-shadow-[0_0_20px_rgba(0,191,255,0.5)]" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 drop-shadow-[0_0_20px_rgba(0,191,255,0.5)]">
              Ready to Enhance Driver Safety?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start monitoring driver fatigue in real-time with our AI-powered
              system
            </p>
            <Button
              size="lg"
              className="text-lg px-8 hover:shadow-2xl hover:shadow-primary/50 transition-all duration-200 drop-shadow-[0_0_20px_rgba(0,191,255,0.3)]"
              onClick={handleGetStarted}
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started"}
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
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
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

const ProcessStep = ({
  number,
  title,
  description,
  isVisible,
  delay = 0,
}: ProcessStepProps) => {
  return (
    <div
      className={`text-center transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-4 border-2 border-primary hover:scale-110 hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 group">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping-slow" />
        <span className="relative z-10 drop-shadow-[0_0_5px_rgba(0,191,255,0.5)]">
          {number}
        </span>
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

interface RoleCardProps {
  icon: any;
  title: string;
  features: string[];
  buttonText: string;
}

const RoleCard = ({
  icon: Icon,
  title,
  features,
  buttonText,
}: RoleCardProps) => {
  const navigate = useNavigate();
  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-border hover:border-primary hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/50">
          <Icon className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform duration-300 drop-shadow-[0_0_5px_rgba(0,191,255,0.5)]" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <ul className="text-muted-foreground text-sm mb-6 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        <Button
          size="sm"
          className="w-full hover:scale-105 transition-all duration-200"
          onClick={() => navigate("/login")}
        >
          {buttonText}
          <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

interface DashboardPreviewCardProps {
  title: string;
  description: string;
  features: string[];
  buttonText: string;
}

const DashboardPreviewCard = ({
  title,
  description,
  features,
  buttonText,
}: DashboardPreviewCardProps) => {
  const navigate = useNavigate();
  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-border hover:border-primary hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        <ul className="text-muted-foreground text-sm mb-6 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        <Button
          size="sm"
          className="w-full hover:scale-105 transition-all duration-200"
          onClick={() => navigate("/login")}
        >
          {buttonText}
          <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default Landing;

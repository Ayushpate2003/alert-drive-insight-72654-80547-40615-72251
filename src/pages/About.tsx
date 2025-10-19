import { Shield, Users, Target, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
              About SafeYatra
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Pioneering AI-powered driver monitoring to make roads safer for everyone
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                At SafeYatra, we're committed to revolutionizing road safety through cutting-edge AI technology. 
                Our mission is to prevent accidents before they happen by monitoring driver behavior in real-time 
                and providing instant alerts for fatigue, distraction, and other risk factors.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We believe that every journey should be safe, and with our advanced monitoring systems, 
                we're making that vision a reality for drivers and fleet managers worldwide.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <Shield className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Safety First</h3>
                <p className="text-sm text-muted-foreground">Preventing accidents through AI-powered monitoring</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <Users className="w-12 h-12 text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">Driver Focused</h3>
                <p className="text-sm text-muted-foreground">Supporting drivers with real-time assistance</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <Target className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Precision AI</h3>
                <p className="text-sm text-muted-foreground">Advanced algorithms for accurate detection</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <Award className="w-12 h-12 text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">Industry Leader</h3>
                <p className="text-sm text-muted-foreground">Trusted by fleets worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">24/7</div>
              <div className="text-muted-foreground">Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">&lt;100ms</div>
              <div className="text-muted-foreground">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">10k+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Technology</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-12">
            SafeYatra leverages state-of-the-art computer vision and machine learning algorithms 
            to analyze driver behavior in real-time. Our system detects fatigue, distraction, 
            and dangerous driving patterns with industry-leading accuracy.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-xl mb-3">Computer Vision</h3>
              <p className="text-muted-foreground">
                Advanced facial recognition and eye-tracking technology
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-xl mb-3">Machine Learning</h3>
              <p className="text-muted-foreground">
                Continuously improving AI models for better accuracy
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-xl mb-3">Real-Time Processing</h3>
              <p className="text-muted-foreground">
                Instant alerts with sub-100ms latency for immediate action
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

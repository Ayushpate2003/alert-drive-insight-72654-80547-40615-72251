import { Shield, Users, Target, Award } from 'lucide-react';
import { NeuralBackground } from '@/components/NeuralBackground';

const About = () => {
  return (
    <div className="min-h-screen relative dark" style={{ background: 'linear-gradient(to bottom, hsl(0, 0%, 0%), hsl(218, 64%, 10%))' }}>
      {/* Neural Background */}
      <div className="absolute inset-0 opacity-30">
        <NeuralBackground />
      </div>
      {/* Hero Section */}
      <section className="relative py-20 px-4 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold animate-fade-in" 
              style={{ 
                color: 'hsl(0, 0%, 100%)',
                textShadow: '0 0 20px hsl(199, 93%, 59%, 0.5)'
              }}>
              About <span style={{ color: 'hsl(199, 93%, 59%)' }}>SafeYatra</span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'hsl(228, 100%, 94%, 0.8)' }}>
              Pioneering AI-powered driver monitoring to make roads safer for everyone
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold" style={{ color: 'hsl(0, 0%, 100%)' }}>
                Our Mission
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: 'hsl(228, 100%, 94%, 0.8)' }}>
                At SafeYatra, we're committed to revolutionizing road safety through cutting-edge AI technology. 
                Our mission is to prevent accidents before they happen by monitoring driver behavior in real-time 
                and providing instant alerts for fatigue, distraction, and other risk factors.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: 'hsl(228, 100%, 94%, 0.8)' }}>
                We believe that every journey should be safe, and with our advanced monitoring systems, 
                we're making that vision a reality for drivers and fleet managers worldwide.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-lg p-6 transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: 'hsl(199, 93%, 59%, 0.1)',
                  border: '1px solid hsl(199, 93%, 59%, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'hsl(199, 93%, 59%, 0.15)';
                  e.currentTarget.style.boxShadow = '0 0 30px hsl(199, 93%, 59%, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'hsl(199, 93%, 59%, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                <Shield className="w-12 h-12 mb-4" style={{ color: 'hsl(199, 93%, 59%)' }} />
                <h3 className="font-semibold text-lg mb-2" style={{ color: 'hsl(0, 0%, 100%)' }}>Safety First</h3>
                <p className="text-sm" style={{ color: 'hsl(228, 100%, 94%, 0.7)' }}>Preventing accidents through AI-powered monitoring</p>
              </div>
              <div className="rounded-lg p-6 transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: 'hsl(199, 93%, 59%, 0.1)',
                  border: '1px solid hsl(199, 93%, 59%, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'hsl(199, 93%, 59%, 0.15)';
                  e.currentTarget.style.boxShadow = '0 0 30px hsl(199, 93%, 59%, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'hsl(199, 93%, 59%, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                <Users className="w-12 h-12 mb-4" style={{ color: 'hsl(199, 93%, 59%)' }} />
                <h3 className="font-semibold text-lg mb-2" style={{ color: 'hsl(0, 0%, 100%)' }}>Driver Focused</h3>
                <p className="text-sm" style={{ color: 'hsl(228, 100%, 94%, 0.7)' }}>Supporting drivers with real-time assistance</p>
              </div>
              <div className="rounded-lg p-6 transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: 'hsl(199, 93%, 59%, 0.1)',
                  border: '1px solid hsl(199, 93%, 59%, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'hsl(199, 93%, 59%, 0.15)';
                  e.currentTarget.style.boxShadow = '0 0 30px hsl(199, 93%, 59%, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'hsl(199, 93%, 59%, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                <Target className="w-12 h-12 mb-4" style={{ color: 'hsl(199, 93%, 59%)' }} />
                <h3 className="font-semibold text-lg mb-2" style={{ color: 'hsl(0, 0%, 100%)' }}>Precision AI</h3>
                <p className="text-sm" style={{ color: 'hsl(228, 100%, 94%, 0.7)' }}>Advanced algorithms for accurate detection</p>
              </div>
              <div className="rounded-lg p-6 transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: 'hsl(199, 93%, 59%, 0.1)',
                  border: '1px solid hsl(199, 93%, 59%, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'hsl(199, 93%, 59%, 0.15)';
                  e.currentTarget.style.boxShadow = '0 0 30px hsl(199, 93%, 59%, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'hsl(199, 93%, 59%, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                <Award className="w-12 h-12 mb-4" style={{ color: 'hsl(199, 93%, 59%)' }} />
                <h3 className="font-semibold text-lg mb-2" style={{ color: 'hsl(0, 0%, 100%)' }}>Industry Leader</h3>
                <p className="text-sm" style={{ color: 'hsl(228, 100%, 94%, 0.7)' }}>Trusted by fleets worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 relative z-10" style={{ backgroundColor: 'hsl(199, 93%, 59%, 0.05)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" 
                style={{ 
                  color: 'hsl(199, 93%, 59%)',
                  textShadow: '0 0 20px hsl(199, 93%, 59%, 0.5)'
                }}>95%</div>
              <div style={{ color: 'hsl(228, 100%, 94%, 0.7)' }}>Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" 
                style={{ 
                  color: 'hsl(199, 93%, 59%)',
                  textShadow: '0 0 20px hsl(199, 93%, 59%, 0.5)'
                }}>24/7</div>
              <div style={{ color: 'hsl(228, 100%, 94%, 0.7)' }}>Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" 
                style={{ 
                  color: 'hsl(199, 93%, 59%)',
                  textShadow: '0 0 20px hsl(199, 93%, 59%, 0.5)'
                }}>&lt;100ms</div>
              <div style={{ color: 'hsl(228, 100%, 94%, 0.7)' }}>Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" 
                style={{ 
                  color: 'hsl(199, 93%, 59%)',
                  textShadow: '0 0 20px hsl(199, 93%, 59%, 0.5)'
                }}>10k+</div>
              <div style={{ color: 'hsl(228, 100%, 94%, 0.7)' }}>Active Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ color: 'hsl(0, 0%, 100%)' }}>Our Technology</h2>
          <p className="text-lg max-w-3xl mx-auto mb-12" style={{ color: 'hsl(228, 100%, 94%, 0.8)' }}>
            SafeYatra leverages state-of-the-art computer vision and machine learning algorithms 
            to analyze driver behavior in real-time. Our system detects fatigue, distraction, 
            and dangerous driving patterns with industry-leading accuracy.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-lg p-6 transition-all duration-300 hover:scale-105"
              style={{ 
                backgroundColor: 'hsl(199, 93%, 59%, 0.1)',
                border: '1px solid hsl(199, 93%, 59%, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(199, 93%, 59%, 0.15)';
                e.currentTarget.style.boxShadow = '0 0 30px hsl(199, 93%, 59%, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(199, 93%, 59%, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <h3 className="font-semibold text-xl mb-3" style={{ color: 'hsl(0, 0%, 100%)' }}>Computer Vision</h3>
              <p style={{ color: 'hsl(228, 100%, 94%, 0.7)' }}>
                Advanced facial recognition and eye-tracking technology
              </p>
            </div>
            <div className="rounded-lg p-6 transition-all duration-300 hover:scale-105"
              style={{ 
                backgroundColor: 'hsl(199, 93%, 59%, 0.1)',
                border: '1px solid hsl(199, 93%, 59%, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(199, 93%, 59%, 0.15)';
                e.currentTarget.style.boxShadow = '0 0 30px hsl(199, 93%, 59%, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(199, 93%, 59%, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <h3 className="font-semibold text-xl mb-3" style={{ color: 'hsl(0, 0%, 100%)' }}>Machine Learning</h3>
              <p style={{ color: 'hsl(228, 100%, 94%, 0.7)' }}>
                Continuously improving AI models for better accuracy
              </p>
            </div>
            <div className="rounded-lg p-6 transition-all duration-300 hover:scale-105"
              style={{ 
                backgroundColor: 'hsl(199, 93%, 59%, 0.1)',
                border: '1px solid hsl(199, 93%, 59%, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(199, 93%, 59%, 0.15)';
                e.currentTarget.style.boxShadow = '0 0 30px hsl(199, 93%, 59%, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(199, 93%, 59%, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <h3 className="font-semibold text-xl mb-3" style={{ color: 'hsl(0, 0%, 100%)' }}>Real-Time Processing</h3>
              <p style={{ color: 'hsl(228, 100%, 94%, 0.7)' }}>
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

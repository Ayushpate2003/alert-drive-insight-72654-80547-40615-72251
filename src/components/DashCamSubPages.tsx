import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Gauge,
  AlertTriangle,
  Brain,
  Users,
  Play,
  BarChart3,
  Zap,
  ChevronLeft,
  ChevronRight,
  Eye,
  Target,
  TrendingUp,
  Activity,
  Car,
  MapPin,
  Clock,
  Shield,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Settings,
} from "lucide-react";

interface SubPage {
  id: string;
  title: string;
  icon: any;
  description: string;
  content: React.ReactNode;
  cta: {
    text: string;
    action: () => void;
  };
}

const DashCamSubPages = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const subPages: SubPage[] = [
    {
      id: "detection",
      title: "See What Your Car Sees",
      icon: Eye,
      description: "Real-time object detection and tracking with AI-powered computer vision",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">YOLOv8 / YOLOX Object Detection</h3>
              <div className="space-y-3 text-muted-foreground">
                <p>• <strong>Real-time Detection:</strong> Processes 30+ FPS with high accuracy</p>
                <p>• <strong>Multi-Class Recognition:</strong> Cars, trucks, motorcycles, pedestrians</p>
                <p>• <strong>Bounding Box Tracking:</strong> Precise object localization</p>
                <p>• <strong>DeepSORT Integration:</strong> Maintains object identity across frames</p>
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">Technical Specs</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Model: YOLOv8m</div>
                  <div>Accuracy: 95.2% mAP</div>
                  <div>FPS: 45+</div>
                  <div>Classes: 80+</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-secondary/30 rounded-lg p-6 border border-primary/20">
                <div className="text-center text-muted-foreground">
                  <Camera className="w-16 h-16 mx-auto mb-4 text-primary/50" />
                  <p className="text-sm">Live Detection Visualization</p>
                  <p className="text-xs mt-2">Real-time bounding boxes with tracking IDs</p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="bg-green-500/20 border border-green-500/50 rounded p-2 text-center">
                    <Car className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-xs font-mono">ID: 247</div>
                  </div>
                  <div className="bg-blue-500/20 border border-blue-500/50 rounded p-2 text-center">
                    <Car className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-xs font-mono">ID: 248</div>
                  </div>
                  <div className="bg-yellow-500/20 border border-yellow-500/50 rounded p-2 text-center">
                    <Car className="w-4 h-4 mx-auto mb-1" />
                    <div className="text-xs font-mono">ID: 249</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-lg border border-primary/20">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-primary" />
              <div>
                <h4 className="font-semibold text-primary">Lane Awareness</h4>
                <p className="text-sm text-muted-foreground">Tracks vehicle position relative to lane markings for enhanced safety monitoring</p>
              </div>
            </div>
          </div>
        </div>
      ),
      cta: {
        text: "Experience Live Tracking",
        action: () => console.log("Navigate to live tracking demo")
      }
    },
    {
      id: "estimation",
      title: "AI-Powered Speed & Distance Estimation",
      icon: Gauge,
      description: "Advanced computer vision algorithms for precise vehicle dynamics analysis",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Optical Flow + Time Delta Analysis</h3>
              <div className="space-y-3 text-muted-foreground">
                <p>• <strong>Pixel Displacement:</strong> Measures frame-to-frame movement</p>
                <p>• <strong>Time Correlation:</strong> Calculates velocity from displacement over time</p>
                <p>• <strong>Camera Calibration:</strong> Converts pixels to real-world distances</p>
                <p>• <strong>Radar Fusion:</strong> Combines with sensor data for higher precision</p>
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-3">Distance Calculation Formula</h4>
                <div className="font-mono text-sm bg-background p-3 rounded border">
                  Distance = (Focal_Length × Real_Height) / Pixel_Height
                  <br />
                  Velocity = (Displacement × Frame_Rate) / Time_Delta
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-secondary/30 rounded-lg p-6 border border-primary/20">
                <h4 className="font-semibold text-primary mb-4">Real-Time Metrics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Following Distance:</span>
                    <span className="font-mono text-primary">42.3m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Relative Speed:</span>
                    <span className="font-mono text-green-400">+2.1 km/h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Safe Gap Time:</span>
                    <span className="font-mono text-yellow-400">1.8s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Camera FPS:</span>
                    <span className="font-mono text-blue-400">30</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-transparent p-4 rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <div>
                    <h4 className="font-semibold text-blue-400">Optical Flow Visualization</h4>
                    <p className="text-sm text-muted-foreground">Real-time motion vectors showing pixel displacement patterns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      cta: {
        text: "View Real-Time Distance Analytics",
        action: () => console.log("Navigate to distance analytics")
      }
    },
    {
      id: "safety",
      title: "Smart Collision Prevention System",
      icon: Shield,
      description: "Intelligent alert system that prevents accidents before they happen",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Collision Risk Algorithm</h3>
              <div className="space-y-3 text-muted-foreground">
                <p>• <strong>Risk Assessment:</strong> Continuous evaluation of collision probability</p>
                <p>• <strong>Multi-Factor Analysis:</strong> Speed, distance, vehicle dynamics</p>
                <p>• <strong>Adaptive Thresholds:</strong> Context-aware alert triggering</p>
                <p>• <strong>RAG Integration:</strong> Personalized safety recommendations</p>
              </div>

              <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                <h4 className="font-semibold text-red-400 mb-2">Alert Logic</h4>
                <div className="font-mono text-sm space-y-1">
                  <div>{"IF (relative_speed > threshold) AND (distance < safe_gap)"}</div>
                  <div>THEN trigger "COLLISION RISK ALERT"</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Thresholds adapt based on road conditions and vehicle type
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-secondary/30 rounded-lg p-6 border border-primary/20">
                <h4 className="font-semibold text-primary mb-4">Alert Examples</h4>
                <div className="space-y-3">
                  <div className="bg-red-500/20 border border-red-500/50 rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="font-semibold text-red-400">COLLISION ALERT</span>
                    </div>
                    <p className="text-sm">"You're too close to the vehicle ahead. Reduce speed immediately."</p>
                  </div>

                  <div className="bg-yellow-500/20 border border-yellow-500/50 rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span className="font-semibold text-yellow-400">WARNING</span>
                    </div>
                    <p className="text-sm">"Maintain safe following distance. Vehicle ahead braking."</p>
                  </div>

                  <div className="bg-blue-500/20 border border-blue-500/50 rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-blue-400" />
                      <span className="font-semibold text-blue-400">RAG ADVICE</span>
                    </div>
                    <p className="text-sm">"When fatigue score exceeds 0.7, system issues stronger voice cues."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-transparent p-4 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <h4 className="font-semibold text-green-400">Proven Safety Impact</h4>
                <p className="text-sm text-muted-foreground">Reduces rear-end collisions by 60% through predictive warnings and driver coaching</p>
              </div>
            </div>
          </div>
        </div>
      ),
      cta: {
        text: "See How Alerts Work",
        action: () => console.log("Navigate to alert demonstration")
      }
    },
    {
      id: "fusion",
      title: "When Vision Meets Awareness",
      icon: Brain,
      description: "Seamless integration of DashCam data with the AI Fusion Engine",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Multi-Modal Data Fusion</h3>
              <div className="space-y-3 text-muted-foreground">
                <p>• <strong>Camera Input:</strong> Real-time object detection and tracking</p>
                <p>• <strong>Fusion Engine:</strong> Combines vision with sensor data</p>
                <p>• <strong>Driver State:</strong> Fatigue, stress, and attention levels</p>
                <p>• <strong>Context Awareness:</strong> Road conditions and traffic patterns</p>
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-3">Fusion Pipeline</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-blue-400" />
                    <span>DashCam → Object Detection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <span>Fusion Engine → Risk Assessment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <span>RAG → Personalized Alerts</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-secondary/30 rounded-lg p-6 border border-primary/20">
                <h4 className="font-semibold text-primary mb-4">Critical Risk Detection</h4>
                <div className="space-y-3">
                  <div className="bg-red-500/20 border border-red-500/50 rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="font-semibold text-red-400">HIGH RISK</span>
                    </div>
                    <p className="text-sm">Unsafe following + Drowsy driver detected</p>
                    <div className="text-xs text-muted-foreground mt-1">
                      Critical flag raised → Immediate intervention
                    </div>
                  </div>

                  <div className="bg-yellow-500/20 border border-yellow-500/50 rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-yellow-400" />
                      <span className="font-semibold text-yellow-400">MODERATE RISK</span>
                    </div>
                    <p className="text-sm">Close following distance + High fatigue</p>
                    <div className="text-xs text-muted-foreground mt-1">
                      Warning issued → Driver coaching
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-transparent p-4 rounded-lg border border-purple-500/20">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-purple-400" />
              <div>
                <h4 className="font-semibold text-purple-400">Real-Time Processing</h4>
                <p className="text-sm text-muted-foreground">{"All data streams processed in <50ms for instant safety responses"}</p>
              </div>
            </div>
          </div>
        </div>
      ),
      cta: {
        text: "Explore Fusion Dashboard",
        action: () => console.log("Navigate to fusion dashboard")
      }
    },
    {
      id: "roles",
      title: "Built for Every Role",
      icon: Users,
      description: "Tailored interfaces and insights for drivers, managers, and administrators",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-secondary/30 rounded-lg p-6 border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-blue-400" />
                <h4 className="text-lg font-semibold text-blue-400">Driver Role</h4>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <p>• Real-time visual alerts</p>
                <p>• Fatigue-linked warnings</p>
                <p>• DashCam distance alerts</p>
                <p>• Trip history & safety reports</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded border border-blue-500/20">
                <p className="text-xs text-blue-300">"Vehicle ahead braking. Maintain safe distance."</p>
              </div>
            </div>

            <div className="bg-secondary/30 rounded-lg p-6 border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-6 h-6 text-green-400" />
                <h4 className="text-lg font-semibold text-green-400">Manager Role</h4>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <p>• Live fleet safety dashboard</p>
                <p>• Driver performance analytics</p>
                <p>• Trip safety reports</p>
                <p>• Incident review & coaching</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded border border-green-500/20">
                <p className="text-xs text-green-300">Fleet Risk Score: 2.3/10</p>
              </div>
            </div>

            <div className="bg-secondary/30 rounded-lg p-6 border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
                <h4 className="text-lg font-semibold text-purple-400">Admin Role</h4>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <p>• Camera calibration tools</p>
                <p>• AI model retraining interface</p>
                <p>• Data privacy controls</p>
                <p>• System health monitoring</p>
              </div>
              <div className="bg-purple-500/10 p-3 rounded border border-purple-500/20">
                <p className="text-xs text-purple-300">Model Accuracy: 96.4%</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-lg border border-primary/20">
            <div className="flex items-center gap-3">
              <ExternalLink className="w-5 h-5 text-primary" />
              <div>
                <h4 className="font-semibold text-primary">Role-Based Access Control</h4>
                <p className="text-sm text-muted-foreground">Secure, personalized interfaces ensuring each user sees only relevant safety data and controls</p>
              </div>
            </div>
          </div>
        </div>
      ),
      cta: {
        text: "Go to Portals",
        action: () => console.log("Navigate to role portals")
      }
    },
    {
      id: "demo",
      title: "DashCam in Action",
      icon: Play,
      description: "Experience the live DashCam system with real-time detection overlays",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Live Detection Demo</h3>
              <div className="space-y-3 text-muted-foreground">
                <p>• <strong>YOLOv8 Overlay:</strong> Real-time bounding boxes on detected vehicles</p>
                <p>• <strong>Distance Metrics:</strong> Live calculation of following distances</p>
                <p>• <strong>Risk Assessment:</strong> Color-coded safety zones</p>
                <p>• <strong>Performance Stats:</strong> FPS and detection confidence</p>
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-3">Demo Features</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Live Video Feed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>YOLOv8 Detection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Distance Calculation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Risk Alerts</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-secondary/30 rounded-lg p-6 border border-primary/20">
                <h4 className="font-semibold text-primary mb-4">Live Metrics Panel</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Detection Status:</span>
                    <span className="font-mono text-green-400">ACTIVE</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Vehicles Detected:</span>
                    <span className="font-mono text-blue-400">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Safe Gap Status:</span>
                    <span className="font-mono text-yellow-400">WARNING</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Processing FPS:</span>
                    <span className="font-mono text-purple-400">28</span>
                  </div>
                </div>
              </div>

              <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <div>
                    <h4 className="font-semibold text-red-400">Live Alert</h4>
                    <p className="text-sm text-muted-foreground">"Too close to vehicle ahead. Maintain 2-second rule."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      cta: {
        text: "Watch Live Demo",
        action: () => console.log("Start live demo")
      }
    },
    {
      id: "analytics",
      title: "See the Data Behind the Drive",
      icon: BarChart3,
      description: "Comprehensive analytics and insights from DashCam safety data",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Safety Analytics Dashboard</h3>
              <div className="space-y-3 text-muted-foreground">
                <p>• <strong>Distance Trends:</strong> Following distance over time analysis</p>
                <p>• <strong>Fatigue Correlation:</strong> Safety metrics vs. driver fatigue</p>
                <p>• <strong>Risk Frequency:</strong> Collision risk events by time/route</p>
                <p>• <strong>Performance Heatmaps:</strong> Safety scores by geographic area</p>
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-3">Key Metrics</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>Avg Following Distance: <span className="font-mono text-primary">38.2m</span></div>
                  <div>Risk Events/Day: <span className="font-mono text-yellow-400">4.2</span></div>
                  <div>Safety Score: <span className="font-mono text-green-400">87%</span></div>
                  <div>Alert Response Time: <span className="font-mono text-blue-400">1.3s</span></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-secondary/30 rounded-lg p-6 border border-primary/20">
                <h4 className="font-semibold text-primary mb-4">Performance Visualization</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Distance Compliance</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '92%'}}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Risk Reduction</span>
                      <span>68%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '68%'}}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Alert Effectiveness</span>
                      <span>94%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: '94%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500/10 to-transparent p-4 rounded-lg border border-orange-500/20">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <div>
                <h4 className="font-semibold text-orange-400">Continuous Improvement</h4>
                <p className="text-sm text-muted-foreground">Analytics drive AI model retraining and safety protocol optimization</p>
              </div>
            </div>
          </div>
        </div>
      ),
      cta: {
        text: "View Full Analytics",
        action: () => console.log("Navigate to full analytics")
      }
    },
    {
      id: "future",
      title: "Next-Gen Driver Intelligence",
      icon: Zap,
      description: "Future enhancements and cutting-edge features in development",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary">Advanced Capabilities</h3>
              <div className="space-y-3 text-muted-foreground">
                <p>• <strong>Predictive Safety:</strong> Anticipate dangerous situations before they occur</p>
                <p>• <strong>Federated Learning:</strong> Privacy-preserving model updates across fleet</p>
                <p>• <strong>Mobile Integration:</strong> AI assistant on driver smartphones</p>
                <p>• <strong>5G Edge Computing:</strong> Ultra-low latency processing</p>
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-3">Upcoming Features</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>Continuous Learning Models (Q2 2025)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>5G-Enabled Real-Time Processing (Q3 2025)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <span>AI Mobile Assistant (Q4 2025)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg p-6 border border-primary/30">
                <h4 className="font-semibold text-primary mb-4">Neural Network Integration</h4>
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center">
                    <Brain className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Advanced neural networks connecting DashCam vision with driver behavior prediction
                  </p>
                </div>
              </div>

              <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <h4 className="font-semibold text-green-400">Proven Technology</h4>
                    <p className="text-sm text-muted-foreground">Built on battle-tested computer vision and machine learning frameworks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-500/10 to-transparent p-4 rounded-lg border border-cyan-500/20">
            <div className="flex items-center gap-3">
              <ExternalLink className="w-5 h-5 text-cyan-400" />
              <div>
                <h4 className="font-semibold text-cyan-400">Research Partnership</h4>
                <p className="text-sm text-muted-foreground">Collaborating with leading universities for next-generation driver safety AI</p>
              </div>
            </div>
          </div>
        </div>
      ),
      cta: {
        text: "Learn About Future Upgrades",
        action: () => console.log("Navigate to future features")
      }
    }
  ];

  const nextPage = () => {
    if (currentPage < subPages.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const currentSubPage = subPages[currentPage];
  const IconComponent = currentSubPage.icon;

  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Content Container with Slide Animation */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {subPages.map((subPage, index) => {
            const PageIcon = subPage.icon;
            return (
              <div key={index} className="w-full flex-shrink-0 px-4">
                <Card className="p-8 bg-card/50 backdrop-blur border-primary/30">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                      <PageIcon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {subPage.title}
                    </h3>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      {subPage.description}
                    </p>
                  </div>

                  <div className="mb-8">
                    {subPage.content}
                  </div>

                  <div className="text-center">
                    <Button
                      size="lg"
                      className="px-8 hover:scale-105 transition-all duration-200 drop-shadow-[0_0_10px_rgba(0,191,255,0.3)]"
                      onClick={subPage.cta.action}
                    >
                      {subPage.cta.text}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={prevPage}
          disabled={currentPage === 0}
          className="flex items-center gap-2 hover:scale-105 transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {/* Page Indicators */}
        <div className="flex items-center gap-3">
          {subPages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAnimating(true);
                setTimeout(() => {
                  setCurrentPage(index);
                  setIsAnimating(false);
                }, 150);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentPage
                  ? "bg-primary scale-125 shadow-lg shadow-primary/50"
                  : "bg-primary/30 hover:bg-primary/50 hover:scale-110"
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={nextPage}
          disabled={currentPage === subPages.length - 1}
          className="flex items-center gap-2 hover:scale-105 transition-all duration-200"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Page {currentPage + 1} of {subPages.length}
        </p>
      </div>
    </div>
  );
};

export { DashCamSubPages };
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import {
  Camera, Zap, Cpu, Shield, Rocket, Sparkles, Play, ArrowRight,
  Target, Database, BarChart3, CheckCircle, Settings, Upload, Video,
  Users, Monitor, Smartphone, Globe, Lock, Cloud, Server, Terminal,
  BrainCircuit, ShieldCheck, TrendingUp, Award, Sparkle, ChevronRight,
  Menu, X, Maximize2, AlertTriangle, Activity, Wifi, HardDrive, Clock,
  TargetIcon, Layers, FlaskConical, Code, GitBranch, CpuIcon,
  Eye, EyeOff, AlertCircle, Grid3x3, Box, GitCompare, RotateCw,
  Scan, LineChart, Factory, Cog, Package, CameraOff, ShieldAlert,
  CircuitBoard, Binary, Radar, Network, Focus, PlugIcon, Square,
  Settings2, VideoIcon, CameraIcon, UploadCloud, WifiOff,
  Fingerprint, QrCode, Barcode, Thermometer, Gauge,
  ClipboardCheck, FileCheck, AlertOctagon
} from 'lucide-react';

// Add 3D particle background component
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
    }> = [];

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#8b5cf6' : '#06b6d4'
      });
    }

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Draw connections
        particles.forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `${particle.color}20`;
            ctx.lineWidth = 0.3;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ opacity: 0.2 }}
    />
  );
};

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeDemo, setActiveDemo] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [videoSource, setVideoSource] = useState<'upload' | 'webcam' | 'mobile' | 'Neuron'>('upload');

  const sections = ['hero', 'features', 'anomalies', 'sources', 'demo', 'how', 'tech', 'cta'];

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Auto-rotate demo
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo(prev => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Updated features data for DIME
  const features = [
    {
      icon: Focus,
      title: 'Dynamic ROI Management',
      description: 'Draw rectangular & polygon ROIs with intelligent snapping tools',
      color: 'from-blue-500 to-cyan-500',
      points: ['Multi-ROI Support', 'Polygon & Rectangle', 'Auto-snap features', 'Nested ROIs']
    },
    {
      icon: AlertOctagon,
      title: 'Multi-Anomaly Detection',
      description: 'Detect foreign objects, missing components, motion differences, and sequence errors',
      color: 'from-purple-500 to-pink-500',
      points: ['Foreign Object', 'Object Missing', 'Motion Difference', 'Sequence Modeling']
    },
    {
      icon: CircuitBoard,
      title: 'Metrology & Measurement',
      description: 'Precision measurement and evaluation of industrial components',
      color: 'from-green-500 to-emerald-500',
      points: ['Dimensional Analysis', 'Tolerance Checking', 'Pattern Recognition', 'Quality Metrics']
    },
    {
      icon: Network,
      title: 'Multi-Source Input',
      description: 'Connect to any camera source or upload videos',
      color: 'from-yellow-500 to-orange-500',
      points: ['Web/Mobile Cam', 'Neuron-Camera', 'Video Upload', 'RTSP Streams']
    }
  ];

  // Anomaly types
  const anomalyTypes = [
    {
      icon: Package,
      title: 'Foreign Object',
      description: 'Detect unexpected objects in the scene',
      color: 'from-red-500 to-orange-500',
      examples: ['Extra tool', 'Debris', 'Contamination', 'Unwanted items']
    },
    {
      icon: EyeOff,
      title: 'Object Missing',
      description: 'Identify missing components in assemblies',
      color: 'from-blue-500 to-cyan-500',
      examples: ['Missing bolt', 'Absent component', 'Incomplete assembly', 'Part omission']
    },
    {
      icon: GitCompare,
      title: 'Motion Difference',
      description: 'Detect deviations from expected motion patterns',
      color: 'from-purple-500 to-pink-500',
      examples: ['Wrong sequence', 'Timing error', 'Path deviation', 'Speed anomaly']
    },
    {
      icon: RotateCw,
      title: 'Sequential Modeling',
      description: 'Validate process sequences and workflows',
      color: 'from-green-500 to-emerald-500',
      examples: ['Step skip', 'Order error', 'Procedure violation', 'Timing mismatch']
    }
  ];

  // Video sources
  const videoSources = [
    {
      icon: UploadCloud,
      title: 'Video Upload',
      description: 'Upload pre-recorded videos for analysis',
      color: 'from-blue-500 to-cyan-500',
      formats: ['MP4', 'AVI', 'MOV', 'MKV']
    },
    {
      icon: CameraIcon,
      title: 'Web Camera',
      description: 'Use laptop/desktop webcam for live analysis',
      color: 'from-purple-500 to-pink-500',
      resolutions: ['720p', '1080p', '4K']
    },
    {
      icon: Smartphone,
      title: 'Mobile Camera',
      description: 'Connect mobile devices via WiFi or USB',
      color: 'from-green-500 to-emerald-500',
      features: ['Remote monitoring', 'Multi-angle view', 'Mobile alerts']
    },
    {
      icon: CpuIcon,
      title: 'Neuron Camera',
      description: 'Intel Neuron-D with on-device AI processing',
      color: 'from-yellow-500 to-orange-500',
      capabilities: ['Spatial AI', 'Neural inference', 'Depth sensing']
    }
  ];

  // Steps data
  const steps = [
    { icon: Video, title: 'Source Setup', color: 'from-blue-500 to-cyan-500' },
    { icon: PlugIcon, title: 'Define ROIs', color: 'from-purple-500 to-pink-500' },
    { icon: BrainCircuit, title: 'Train Models', color: 'from-green-500 to-emerald-500' },
    { icon: Radar, title: 'Deploy & Monitor', color: 'from-yellow-500 to-orange-500' }
  ];

  // Tech stack
  const techStack = [
    { name: 'React', icon: '⚛️', color: 'text-cyan-400', description: 'Frontend Framework' },
    { name: 'TypeScript', icon: 'TS', color: 'text-blue-400', description: 'Type Safety' },
    { name: 'Python', icon: '🐍', color: 'text-yellow-400', description: 'Backend Logic' },
    { name: 'TensorFlow', icon: 'TF', color: 'text-orange-400', description: 'AI/ML Models' },
    { name: 'OpenCV', icon: 'CV', color: 'text-blue-500', description: 'Computer Vision' },
    { name: 'Neuron-D', icon: '🌳', color: 'text-green-400', description: 'Hardware AI' },
    { name: 'Docker', icon: '🐳', color: 'text-blue-300', description: 'Containerization' },
    { name: 'PostgreSQL', icon: '🐘', color: 'text-blue-600', description: 'Database' }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-950 overflow-x-hidden">
      {/* Enhanced Particle Background */}
      <ParticleBackground />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating 3D shapes */}
        <div className="absolute top-20 left-10 w-64 h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-blue-500/20 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-8 border-2 border-purple-500/20 rounded-full"
          />
        </div>

        {/* Gradient Orbs with enhanced effects */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />

        {/* Circuit board pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 origin-left"
        style={{ transform: `scaleX(${scrollProgress}%)` }} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-neutral-900/90 backdrop-blur-xl border-b border-neutral-800/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 group cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-full blur opacity-30"
                />
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-xl">
                  <CircuitBoard className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  DIME
                </h1>
                <p className="text-xs text-neutral-400">Dynamic Inspection Metrology & Evaluation</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'Anomalies', 'Sources', 'Demo', 'Technology'].map((item) => (
                <motion.button
                  key={item}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const element = document.getElementById(item.toLowerCase());
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-neutral-300 hover:text-white transition-colors text-sm font-medium px-3 py-1 rounded-lg hover:bg-neutral-800/50"
                >
                  {item}
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('/training', '_blank')}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg text-white font-semibold text-sm flex items-center space-x-2 hover:shadow-lg hover:shadow-blue-500/30"
              >
                <span>Launch Studio</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 bg-neutral-800 rounded-lg"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="pt-4 pb-6 space-y-4">
                  {['Features', 'Anomalies', 'Sources', 'Demo', 'Technology'].map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        const element = document.getElementById(item.toLowerCase());
                        element?.scrollIntoView({ behavior: 'smooth' });
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 bg-neutral-800/50 rounded-lg hover:bg-neutral-700/50"
                    >
                      {item}
                    </button>
                  ))}
                  <button
                    onClick={() => window.open('/dashboard', '_blank')}
                    className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg text-white font-semibold"
                  >
                    Launch Studio
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-40 pb-20 px-4 relative">
        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-32 right-20 w-6 h-6 bg-blue-500/30 rounded-full blur-sm"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute top-64 left-20 w-8 h-8 bg-purple-500/30 rounded-full blur-sm"
        />

        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-full border border-blue-500/30 mb-6"
              >
                <Sparkles className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-sm text-blue-300">Industrial AI Platform</span>
              </motion.div>

              <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  DIME
                </span>
                <span className="block text-white mt-2 text-5xl">Dynamic Inspection</span>
                <span className="block text-neutral-300 text-4xl mt-2">Metrology & Evaluation</span>
              </h1>

              <div className="text-2xl lg:text-3xl font-semibold mb-8 h-10">
                <Typewriter
                  options={{
                    strings: [
                      'Foreign Object Detection',
                      'Missing Component Analysis',
                      'Motion Pattern Validation',
                      'Sequential Process Monitoring'
                    ],
                    autoStart: true,
                    loop: true,
                    deleteSpeed: 30,
                    delay: 60,
                  }}
                />
              </div>


              <p className="text-neutral-300 text-xl mb-10 leading-relaxed max-w-2xl">
                Advanced computer vision platform for industrial inspection.
                Detect anomalies, validate processes, and ensure quality with
                AI-powered metrology and multi-source video analysis.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 mb-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open('/training', '_blank')}
                  className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl text-white font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <div className="relative flex items-center justify-center space-x-3">
                    <Rocket className="w-6 h-6" />
                    <span>Start Now</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-10 py-5 bg-neutral-800/50 rounded-2xl border border-neutral-700 text-white font-bold text-lg hover:bg-neutral-700/50 transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <Video className="w-5 h-5" />
                  <span>Watch Demo</span>
                </motion.button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8">
                {[
                  { value: '99.8%', label: 'Detection Accuracy', color: 'text-blue-400' },
                  { value: '18ms', label: 'Inference Time', color: 'text-green-400' },
                  { value: '∞', label: 'ROI Configurations', color: 'text-purple-400' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                    <div className="text-sm text-neutral-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - Interactive Demo */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: 20 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Glowing border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl blur-lg opacity-30" />

              <div className="relative bg-gradient-to-br from-neutral-900 via-black to-neutral-900 rounded-2xl p-8 border border-neutral-800/50 shadow-2xl overflow-hidden">
                {/* Demo Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="text-lg font-bold text-white">Live Inspection Panel</div>
                  </div>
                  <div className="px-3 py-1 bg-green-900/30 rounded-full border border-green-700/50">
                    <span className="text-sm text-green-400 flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
                      Active
                    </span>
                  </div>
                </div>

                {/* Video Feed Simulation */}
                <div className="relative h-80 bg-gradient-to-br from-neutral-900 to-black rounded-xl overflow-hidden mb-8">
                  {/* Simulated camera feed */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-cyan-900/10" />

                  {/* Grid overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />

                  {/* Multiple ROIs */}
                  <motion.div
                    animate={{
                      borderColor: ['#3b82f6', '#06b6d4', '#3b82f6'],
                      boxShadow: ['0 0 20px rgba(59, 130, 246, 0.3)', '0 0 30px rgba(6, 182, 212, 0.4)', '0 0 20px rgba(59, 130, 246, 0.3)']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-8 left-8 w-40 h-32 border-2 border-blue-500 rounded-lg bg-blue-500/10"
                  >
                    <div className="absolute -top-6 left-0 px-3 py-1 bg-blue-600 rounded-lg text-sm text-white font-semibold">
                      ROI #1
                    </div>
                  </motion.div>

                  {/* Polygon ROI */}
                  <motion.div
                    animate={{
                      pathLength: [0, 1, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute bottom-12 right-12 w-32 h-32 border-2 border-purple-500 rounded-full bg-purple-500/10"
                  >
                    <div className="absolute -top-8 right-0 px-3 py-1 bg-purple-600 rounded-lg text-sm text-white font-semibold">
                      ROI #2
                    </div>
                  </motion.div>

                  {/* Detected Anomaly */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                    className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-red-500/20 rounded-full border-2 border-red-500 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                      </div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-2 py-1 bg-red-600 rounded text-xs text-white">
                        Foreign Object
                      </div>
                    </div>
                  </motion.div>

                  {/* Stats Overlay */}
                  <div className="absolute bottom-4 left-4 bg-black/80 rounded-xl p-4 backdrop-blur-sm">
                    <div className="space-y-2">
                      <div className="text-sm text-neutral-300 flex justify-between">
                        <span>Processing:</span>
                        <span className="text-green-400 font-bold">32 FPS</span>
                      </div>
                      <div className="text-sm text-neutral-300 flex justify-between">
                        <span>Latency:</span>
                        <span className="text-blue-400 font-bold">18ms</span>
                      </div>
                      <div className="text-sm text-neutral-300 flex justify-between">
                        <span>ROIs:</span>
                        <span className="text-purple-400 font-bold">4 Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { value: '12', label: 'ROIs', color: 'text-blue-400', bg: 'bg-blue-500/20' },
                    { value: '3', label: 'Anomalies', color: 'text-red-400', bg: 'bg-red-500/20' },
                    { value: '98.7%', label: 'Accuracy', color: 'text-green-400', bg: 'bg-green-500/20' },
                    { value: '256', label: 'Frames', color: 'text-purple-400', bg: 'bg-purple-500/20' }
                  ].map((stat, index) => (
                    <div key={index} className={`p-4 rounded-xl border border-neutral-800/50 ${stat.bg}`}>
                      <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                      <div className="text-xs text-neutral-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Camera Icons */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40"
              >
                <Camera className="w-10 h-10 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-neutral-900/30 to-black/50" />

        <div className="container mx-auto relative">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-full border border-blue-500/30 mb-6">
              <Sparkle className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-sm text-blue-300">Core Capabilities</span>
            </div>

            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Advanced Inspection Features
              </span>
            </h2>
            <p className="text-neutral-400 text-xl max-w-3xl mx-auto">
              Comprehensive tools for industrial metrology, anomaly detection, and process validation
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="group relative"
              >
                {/* Animated background effect */}
                <motion.div
                  animate={{
                    opacity: hoveredFeature === index ? 0.3 : 0,
                    scale: hoveredFeature === index ? 1.1 : 1
                  }}
                  transition={{ duration: 0.3 }}
                  className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-3xl blur-xl`}
                />

                <div className="relative h-full bg-gradient-to-b from-neutral-900/80 to-black/80 rounded-2xl p-8 border border-neutral-800/50 hover:border-neutral-700/50 transition-all duration-300 backdrop-blur-sm">
                  {/* Icon with animation */}
                  <motion.div
                    animate={{ rotate: hoveredFeature === index ? 360 : 0 }}
                    transition={{ duration: 0.5 }}
                    className={`mb-6 w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/20`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-neutral-400 mb-6">{feature.description}</p>

                  {/* Feature Points */}
                  <ul className="space-y-3">
                    {feature.points.map((point, idx) => (
                      <motion.li
                        key={point}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + idx * 0.1 }}
                        className="flex items-center text-neutral-300"
                      >
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mr-3" />
                        {point}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Anomaly Types Section */}
      <section id="anomalies" className="py-24 px-4 bg-gradient-to-b from-neutral-900/50 to-black/50">
        <div className="container mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-full border border-red-500/30 mb-6">
              <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
              <span className="text-sm text-red-300">Anomaly Detection</span>
            </div>

            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Detect Multiple Anomalies
              </span>
            </h2>
            <p className="text-neutral-400 text-xl max-w-3xl mx-auto">
              Comprehensive detection of various industrial inspection anomalies
            </p>
          </motion.div>

          {/* Anomaly Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {anomalyTypes.map((anomaly, index) => (
              <motion.div
                key={anomaly.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${anomaly.color} rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500`} />

                <div className="relative bg-gradient-to-b from-neutral-900/80 to-black/80 rounded-2xl p-8 border border-neutral-800/50 hover:border-neutral-700/50 transition-all duration-300">
                  {/* Icon */}
                  <div className={`mb-6 w-16 h-16 bg-gradient-to-br ${anomaly.color} rounded-2xl flex items-center justify-center`}>
                    <anomaly.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4">{anomaly.title}</h3>
                  <p className="text-neutral-400 mb-6">{anomaly.description}</p>

                  {/* Examples */}
                  <div className="space-y-3">
                    <div className="text-sm text-neutral-500">Common Examples:</div>
                    {anomaly.examples.map((example) => (
                      <div key={example} className="flex items-center text-neutral-300">
                        <AlertCircle className="w-4 h-4 text-red-400 mr-3" />
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Sources Section */}
      <section id="sources" className="py-24 px-4">
        <div className="container mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-full border border-blue-500/30 mb-6">
              <Camera className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-sm text-blue-300">Multi-Source Support</span>
            </div>

            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Flexible Input Sources
              </span>
            </h2>
            <p className="text-neutral-400 text-xl max-w-3xl mx-auto">
              Connect any camera source for comprehensive inspection capabilities
            </p>
          </motion.div>

          {/* Source Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {videoSources.map((source, index) => (
              <motion.button
                key={source.title}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setVideoSource(['upload', 'webcam', 'mobile', 'Neuron'][index] as any)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${videoSource === ['upload', 'webcam', 'mobile', 'Neuron'][index]
                  ? `bg-gradient-to-r ${source.color} text-white`
                  : 'bg-neutral-800/50 text-neutral-400 hover:bg-neutral-700/50'
                  }`}
              >
                <div className="flex items-center space-x-2">
                  <source.icon className="w-5 h-5" />
                  <span>{source.title}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Source Details */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              key={videoSource}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-b from-neutral-900/80 to-black/80 rounded-2xl p-8 border border-neutral-800/50"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-14 h-14 bg-gradient-to-br ${videoSources.find(s => s.title.toLowerCase().includes(videoSource))?.color
                  } rounded-2xl flex items-center justify-center`}>
                  {/* {videoSources.find(s => s.title.toLowerCase().includes(videoSource))?.icon &&
                    React.createElement(videoSources.find(s => s.title.toLowerCase().includes(videoSource))!.icon, {
                      className: "w-8 h-8 text-white"
                    })} */}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {videoSources.find(s => s.title.toLowerCase().includes(videoSource))?.title}
                  </h3>
                  <p className="text-neutral-400">
                    {videoSources.find(s => s.title.toLowerCase().includes(videoSource))?.description}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <div className="text-lg font-semibold text-white mb-2">Key Features:</div>
                {videoSource === 'upload' && (
                  <>
                    <div className="flex items-center text-neutral-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      Support for multiple video formats
                    </div>
                    <div className="flex items-center text-neutral-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      Batch processing capabilities
                    </div>
                    <div className="flex items-center text-neutral-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      Cloud storage integration
                    </div>
                  </>
                )}
                {videoSource === 'webcam' && (
                  <>
                    <div className="flex items-center text-neutral-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      Real-time streaming
                    </div>
                    <div className="flex items-center text-neutral-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      Multiple camera support
                    </div>
                    <div className="flex items-center text-neutral-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      Resolution up to 4K
                    </div>
                  </>
                )}
                {videoSource === 'mobile' && (
                  <>
                    <div className="flex items-center text-neutral-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      WiFi and USB connectivity
                    </div>
                    <div className="flex items-center text-neutral-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      Remote monitoring
                    </div>
                    <div className="flex items-center text-neutral-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      Mobile app integration
                    </div>
                  </>
                )}
                {videoSource === 'Neuron' && (
                  <>
                    <div className="flex items-center text-neutral-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      On-device AI processing
                    </div>
                    <div className="flex items-center text-neutral-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      Depth sensing capabilities
                    </div>
                    <div className="flex items-center text-neutral-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      Neural inference acceleration
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Source Visualization */}
            <div className="relative">
              <div className="bg-gradient-to-b from-neutral-900/80 to-black/80 rounded-2xl p-6 border border-neutral-800/50">
                <div className="h-64 bg-black rounded-xl overflow-hidden">
                  {videoSource === 'upload' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <UploadCloud className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                        <div className="text-white font-semibold">Video Upload Interface</div>
                        <div className="text-neutral-400 text-sm">Drag & drop or browse files</div>
                      </div>
                    </div>
                  )}
                  {videoSource === 'webcam' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-900/20">
                      <div className="absolute inset-4 border-2 border-blue-500/50 rounded-lg" />
                      <div className="absolute top-4 left-4 text-blue-300">Live Webcam Feed</div>
                    </div>
                  )}
                  {videoSource === 'mobile' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-emerald-900/20">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Smartphone className="w-20 h-20 text-green-400" />
                      </div>
                    </div>
                  )}
                  {videoSource === 'Neuron' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 to-orange-900/20">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <CpuIcon className="w-20 h-20 text-yellow-400" />
                        <div className="text-center mt-4 text-yellow-300">Neuron Camera</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-24 px-4 bg-gradient-to-b from-neutral-900/50 to-black/50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Demo Controls */}
            <div>
              <h2 className="text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Interactive Demo
                </span>
              </h2>
              <p className="text-neutral-400 text-xl mb-8">
                Experience DIME's capabilities with our interactive demonstration
              </p>

              {/* Demo Modes */}
              <div className="grid grid-cols-4 gap-3 mb-8">
                {['ROI Setup', 'Training', 'Inference', 'Dashboard'].map((mode, index) => (
                  <motion.button
                    key={mode}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveDemo(index)}
                    className={`p-4 rounded-xl transition-all ${activeDemo === index
                      ? 'bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-2 border-blue-500/50'
                      : 'bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700/50'
                      }`}
                  >
                    <div className="font-semibold text-white text-sm">{mode}</div>
                  </motion.button>
                ))}
              </div>

              {/* Demo Description */}
              <div className="bg-gradient-to-b from-neutral-900/80 to-black/80 rounded-2xl p-8 border border-neutral-800/50 mb-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  {['ROI Configuration', 'Model Training', 'Live Inference', 'Analytics Dashboard'][activeDemo]}
                </h3>
                <p className="text-neutral-300 mb-6 text-lg">
                  {[
                    'Define regions of interest with precision drawing tools for targeted inspection',
                    'Train AI models on your specific datasets with automated pipeline optimization',
                    'Real-time anomaly detection with instant alerts and visual indicators',
                    'Monitor system performance, track metrics, and generate comprehensive reports'
                  ][activeDemo]}
                </p>
                <div className="space-y-4">
                  {[
                    ['Polygon Drawing', 'Multi-ROI Support', 'Auto-Snap Features'],
                    ['Dataset Management', 'AutoML Pipeline', 'Model Validation'],
                    ['Live Camera Feed', 'Real-time Alerts', 'Anomaly Classification'],
                    ['Performance Metrics', 'Live Logs', 'Export Analytics']
                  ][activeDemo].map((item) => (
                    <div key={item} className="flex items-center text-neutral-300">
                      <CheckCircle className="w-6 h-6 text-green-400 mr-4" />
                      <span className="text-lg">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('/dashboard', '_blank')}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl text-white font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300"
              >
                Try Live Demo
              </motion.button>
            </div>

            {/* Interactive Demo */}
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl blur-xl" />

              <div className="relative bg-gradient-to-b from-neutral-900/80 to-black/80 rounded-2xl p-8 border border-neutral-800/50">
                {/* Demo Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xl font-bold text-white">Live Preview</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="px-4 py-2 bg-green-900/30 rounded-lg border border-green-700/50">
                      <span className="text-sm text-green-400 font-semibold">Simulating</span>
                    </div>
                  </div>
                </div>

                {/* Animated Demo */}
                <div className="relative h-96 bg-black rounded-2xl overflow-hidden mb-8">
                  {/* Demo content based on active mode */}
                  {activeDemo === 0 && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-cyan-900/10" />
                      {/* Drawing animation */}
                      <motion.div
                        animate={{
                          d: [
                            "M 100 100 L 200 100 L 200 200 L 100 200 Z",
                            "M 100 100 L 250 100 L 250 250 L 100 250 Z",
                            "M 100 100 L 200 100 L 200 200 L 100 200 Z"
                          ]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      >
                        <svg width="300" height="300">
                          <polygon
                            points="100,100 200,100 200,200 100,200"
                            fill="rgba(59, 130, 246, 0.2)"
                            stroke="#3b82f6"
                            strokeWidth="2"
                          />
                        </svg>
                      </motion.div>
                      <div className="absolute bottom-8 left-8 text-blue-300 text-lg">
                        Drawing ROI Polygon...
                      </div>
                    </>
                  )}

                  {activeDemo === 1 && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-pink-900/10" />
                      {/* Training progress */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-24 h-24 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-6"
                        />
                        <div className="text-2xl text-purple-300 font-bold">Training Model</div>
                        <div className="text-neutral-400">Epoch 45/100 - Accuracy: 94.3%</div>
                      </div>
                    </>
                  )}

                  {activeDemo === 2 && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-orange-900/10" />
                      {/* Anomaly detection */}
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute top-1/3 left-1/3"
                      >
                        <div className="relative">
                          <div className="w-20 h-20 bg-red-500/20 rounded-full border-2 border-red-500 flex items-center justify-center">
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                          </div>
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-3 py-2 bg-red-600 rounded-lg text-sm text-white font-bold">
                            ANOMALY DETECTED
                          </div>
                        </div>
                      </motion.div>
                      <div className="absolute bottom-8 left-8 px-4 py-3 bg-red-600/80 rounded-xl">
                        <span className="text-lg font-bold text-white">Foreign Object Detected</span>
                      </div>
                    </>
                  )}

                  {activeDemo === 3 && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 to-emerald-900/10" />
                      {/* Dashboard charts */}
                      <div className="absolute inset-4">
                        {[30, 60, 90, 60, 30, 80, 40].map((height, i) => (
                          <motion.div
                            key={i}
                            animate={{ height: [10, height, 10] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                            className="absolute bottom-0 bg-gradient-to-t from-green-500 to-emerald-500 rounded-t-lg"
                            style={{
                              left: `${15 + i * 12}%`,
                              width: '8%'
                            }}
                          />
                        ))}
                      </div>
                      <div className="absolute bottom-8 right-8 text-lg text-neutral-400">
                        Real-time Metrics
                      </div>
                    </>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { value: activeDemo === 0 ? '4' : activeDemo === 1 ? '94%' : activeDemo === 2 ? '3' : '32', label: activeDemo === 0 ? 'ROIs' : activeDemo === 1 ? 'Accuracy' : activeDemo === 2 ? 'Alerts' : 'FPS', color: 'text-blue-400' },
                    { value: activeDemo === 0 ? 'Poly' : activeDemo === 1 ? '45' : activeDemo === 2 ? '18ms' : '99.8%', label: activeDemo === 0 ? 'Type' : activeDemo === 1 ? 'Epoch' : activeDemo === 2 ? 'Latency' : 'Uptime', color: 'text-green-400' },
                    { value: activeDemo === 0 ? '256' : activeDemo === 1 ? '1.2K' : activeDemo === 2 ? 'Real' : '24/7', label: activeDemo === 0 ? 'Frames' : activeDemo === 1 ? 'Images' : activeDemo === 2 ? 'Time' : 'Monitoring', color: 'text-purple-400' },
                    { value: activeDemo === 0 ? 'Active' : activeDemo === 1 ? 'Running' : activeDemo === 2 ? 'Live' : 'Stable', label: 'Status', color: 'text-yellow-400' }
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-neutral-800/30 rounded-xl">
                      <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                      <div className="text-sm text-neutral-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="py-24 px-4 bg-gradient-to-b from-neutral-900/50 to-black/50">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                How DIME Works
              </span>
            </h2>
            <p className="text-neutral-400 text-xl max-w-3xl mx-auto">
              Four-step process from setup to deployed AI inspection system
            </p>
          </div>

          <div className="relative">
            {/* Connection lines */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 transform -translate-y-1/2" />

            {/* Steps */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  onClick={() => setActiveStep(index)}
                  className={`relative cursor-pointer group ${activeStep === index ? 'z-10' : ''}`}
                >
                  {/* Step number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-neutral-900 to-black rounded-full border-2 border-neutral-800 flex items-center justify-center text-white font-bold text-2xl">
                    {index + 1}
                  </div>

                  <div className={`relative p-8 rounded-3xl border-2 transition-all duration-500 ${activeStep === index
                    ? `bg-gradient-to-b from-neutral-900/90 to-black/90 border-transparent`
                    : 'bg-gradient-to-b from-neutral-900/50 to-black/50 border-neutral-800/50 hover:border-neutral-700/50'
                    }`}>
                    {/* Hover effect */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${step.color} rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500 ${activeStep === index ? 'opacity-30' : ''
                      }`} />

                    <div className="relative flex flex-col items-center text-center">
                      {/* Icon */}
                      <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl`}>
                        <step.icon className="w-10 h-10 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                      <p className="text-neutral-400">
                        {[
                          'Connect cameras or upload videos for inspection',
                          'Define inspection areas with precision drawing tools',
                          'AI learns patterns and detects anomalies',
                          'Deploy for continuous monitoring and alerts'
                        ][index]}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Active Step Details */}
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16 bg-gradient-to-b from-neutral-900/80 to-black/80 rounded-3xl p-10 border border-neutral-800/50 shadow-2xl"
            >
              <div className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${steps[activeStep].color}/20 rounded-full mb-8`}>
                <span className="text-white font-bold text-lg">Step {activeStep + 1} Details</span>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-6">{steps[activeStep].title}</h3>
                  <p className="text-neutral-300 text-lg mb-8 leading-relaxed">
                    {[
                      'Setup your inspection system by connecting cameras or uploading videos. Configure resolution, frame rate, and streaming parameters to match your industrial requirements.',
                      'Use intuitive drawing tools to define Regions of Interest (ROIs). Create polygons or rectangles to focus AI attention on critical areas. Set up multiple ROIs for complex inspections.',
                      'Our AI automatically extracts features from annotated data, trains optimized models, and validates performance. Supports transfer learning and continuous improvement.',
                      'Deploy trained models for real-time inference. Monitor live feeds, receive instant alerts for anomalies, and analyze comprehensive reports.'
                    ][activeStep]}
                  </p>
                  <div className="space-y-4">
                    {[
                      ['Multiple Formats', 'Camera Integration', 'Stream Configuration'],
                      ['Polygon Tools', 'Multi-ROI Setup', 'Precision Controls'],
                      ['AutoML Pipeline', 'Model Optimization', 'Validation Suite'],
                      ['Live Monitoring', 'Alert System', 'Analytics Dashboard']
                    ][activeStep].map((item) => (
                      <div key={item} className="flex items-center text-neutral-300 text-lg">
                        <CheckCircle className="w-6 h-6 text-green-400 mr-4" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step Visualization */}
                <div className="relative h-80 bg-black rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`w-24 h-24 bg-gradient-to-br ${steps[activeStep].color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
                        {/* <steps[activeStep].icon className="w-12 h-12 text-white" /> */}
                      </div>
                      <div className="text-neutral-300 text-xl">
                        {[
                          'Configuring video sources...',
                          'Drawing inspection areas...',
                          'Training AI models...',
                          'Monitoring live feed...'
                        ][activeStep]}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="tech" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Technology Stack
              </span>
            </h2>
            <p className="text-neutral-400 text-xl max-w-3xl mx-auto">
              Built with cutting-edge technologies for industrial-grade performance and reliability
            </p>
          </div>

          {/* Tech Stack Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-16">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="group"
              >
                <div className="bg-gradient-to-b from-neutral-900/80 to-black/80 rounded-2xl p-6 border border-neutral-800/50 text-center hover:border-neutral-700/50 transition-all duration-300">
                  <div className={`text-4xl mb-4 ${tech.color}`}>{tech.icon}</div>
                  <div className="text-white font-bold text-lg mb-1">{tech.name}</div>
                  <div className="text-xs text-neutral-400">{tech.description}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Performance Metrics */}
          <div className="bg-gradient-to-b from-neutral-900/80 to-black/80 rounded-3xl p-10 border border-neutral-800/50">
            <h3 className="text-3xl font-bold text-white mb-10 text-center">Industrial Performance Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '99.95%', label: 'System Uptime', color: 'text-blue-400', icon: ShieldCheck },
                { value: '<18ms', label: 'Inference Latency', color: 'text-green-400', icon: Zap },
                { value: '10K+', label: 'FPS Processing', color: 'text-purple-400', icon: Activity },
                { value: 'PB Scale', label: 'Data Handling', color: 'text-yellow-400', icon: Database }
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-neutral-800 to-black rounded-2xl mb-4">
                    <metric.icon className={`w-8 h-8 ${metric.color}`} />
                  </div>
                  <div className={`text-4xl font-bold ${metric.color} mb-2`}>{metric.value}</div>
                  <div className="text-neutral-400 text-lg">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="cta" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="relative bg-gradient-to-br from-neutral-900 via-black to-neutral-900 rounded-3xl p-12 md:p-16 border border-neutral-800/50 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-32 -right-32 w-64 h-64 border-2 border-blue-500/20 rounded-full"
            />

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-full border border-blue-500/30 mb-8">
                <Rocket className="w-5 h-5 text-blue-400 mr-3" />
                <span className="text-lg text-blue-300 font-semibold">Ready for Production</span>
              </div>

              <h2 className="text-5xl lg:text-6xl font-bold mb-8">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Start Your Inspection Journey
                </span>
              </h2>

              <p className="text-neutral-300 text-xl max-w-2xl mx-auto mb-12">
                Join leading manufacturers using DIME for quality assurance,
                anomaly detection, and process optimization. Deploy AI-powered
                inspection in minutes, not months.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open('/dashboard', '_blank')}
                  className="px-12 py-6 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl text-white font-bold text-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center space-x-4"
                >
                  <Rocket className="w-7 h-7" />
                  <span>Start Training</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-6 bg-neutral-800/50 rounded-2xl border-2 border-neutral-700 text-white font-bold text-xl hover:bg-neutral-700/50 transition-all duration-300 flex items-center justify-center space-x-4"
                >
                  <Video className="w-6 h-6" />
                  <span>Watch Tutorial</span>
                </motion.button>
              </div>

              {/* <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">14-day</div>
                  <div className="text-neutral-400">Free Trial</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">No Code</div>
                  <div className="text-neutral-400">Setup Required</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
                  <div className="text-neutral-400">Enterprise Support</div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-neutral-800/50 bg-gradient-to-b from-black to-neutral-950">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-4 mb-8 lg:mb-0">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-full blur opacity-20"
                />
                <div className="relative w-14 h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                  <CircuitBoard className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  DIME
                </div>
                <p className="text-sm text-neutral-400">Dynamic Inspection Metrology & Evaluation</p>
                <p className="text-xs text-neutral-500 mt-1">© {new Date().getFullYear()} All rights reserved</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-8 mb-8 lg:mb-0">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">Documentation</a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">API Reference</a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">Contact Sales</a>
            </div>

            {/* Backend Status */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-neutral-400">
                Backend Status: <code className="ml-3 px-3 py-2 bg-neutral-800 rounded-lg text-green-300 font-mono">localhost:8000 ✅</code>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 z-40 p-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full shadow-2xl hover:shadow-blue-500/40 transition-all duration-300"
      >
        <ArrowRight className="w-6 h-6 text-white rotate-90" />
      </motion.button>

      {/* Mouse Trail Effect */}
      <div className="fixed top-0 left-0 w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full pointer-events-none z-40 mix-blend-screen"
        style={{
          transform: `translate(${mousePosition.x}vw, ${mousePosition.y}vh)`,
          transition: 'transform 0.1s ease-out'
        }} />
    </div>
  );
}
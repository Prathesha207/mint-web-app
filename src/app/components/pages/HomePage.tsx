import React from 'react';
import { 
  Activity, Camera, Hexagon, Eye, Terminal, Layers, Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// --- Canonical Data Sources ---
const HOME_FEATURES = [
  {
    title: 'Real-Time Training',
    description: 'Upload videos, define ROI regions, and train custom AI models with live feedback and terminal logs.',
    icon: <Activity className="w-8 h-8" />
  },
  {
    title: 'Multi-Source Input',
    description: 'Support for video uploads, phone cameras, and Oak cameras for flexible data collection.',
    icon: <Camera className="w-8 h-8" />
  },
  {
    title: 'Advanced ROI Tools',
    description: 'Draw precise rectangle or polygon regions of interest directly on your video frames.',
    icon: <Hexagon className="w-8 h-8" />
  },
  {
    title: 'Model Inference',
    description: 'Run trained models on new videos with adjustable detection thresholds and real-time overlays.',
    icon: <Eye className="w-8 h-8" />
  },
  {
    title: 'Debug Controls',
    description: 'Comprehensive debugging tools and terminal logs for monitoring training and inference processes.',
    icon: <Terminal className="w-8 h-8" />
  },
  {
    title: 'Professional Workspace',
    description: 'Single-page editing environment designed for efficiency and ease of use for all skill levels.',
    icon: <Layers className="w-8 h-8" />
  }
];

const HOME_STEPS = [
  {
    step: '01',
    title: 'Upload Training Data',
    description: 'Import your video files or connect live camera feeds to begin collecting training data.'
  },
  {
    step: '02',
    title: 'Define ROI & Train',
    description: 'Draw regions of interest on your frames and select training parameters to build your model.'
  },
  {
    step: '03',
    title: 'Run Inference',
    description: 'Deploy your trained model on new videos and see real-time detection results with overlays.'
  }
];

// --- Main Component ---
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-paragraph selection:bg-primary/30 selection:text-primary flex flex-col overflow-clip">
      {/* Global Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,240,255,0.03)_0%,_transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPC9zdmc+')] opacity-50 mix-blend-overlay" />
      </div>

      <Header />

      {/* Main Content */}
      <div className="flex-1 lg:ml-20 relative z-10 pt-16 lg:pt-0">
        <HomeContent />
      </div>

      <Footer />
    </div>
  );
}

// --- Section Contents ---

function HomeContent() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <div className="relative w-full min-h-screen flex items-center justify-center px-6 py-32 lg:py-0 overflow-hidden">
        {/* Dynamic Background Elements */}
        <motion.div style={{ y: y1, opacity: opacity1 }} className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] border border-primary/10 rounded-full absolute animate-[spin_60s_linear_infinite]" />
          <div className="w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] border border-secondary/10 rounded-full absolute animate-[spin_40s_linear_infinite_reverse]" />
          <div className="w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] border border-accent-muted/10 rounded-full absolute animate-[spin_20s_linear_infinite]" />
        </motion.div>

        <div className="max-w-[120rem] w-full mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-7 space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                System Online v2.0
              </div>
              <h1 className="font-heading text-6xl lg:text-8xl xl:text-9xl font-black text-white leading-[0.9] tracking-tighter uppercase">
                Neural <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-[gradient_4s_linear_infinite]">Nexus</span>
              </h1>
              <p className="text-lg lg:text-xl text-glass-foreground max-w-2xl font-paragraph leading-relaxed border-l-2 border-primary/50 pl-6">
                Advanced AI Vision Platform for Real-Time Object Detection and Model Training. Architect your neural networks in a professional, single-page workspace.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 pt-8">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading font-black tracking-widest uppercase text-sm px-10 py-8 rounded-none relative group overflow-hidden"
                >
                  <span className="relative z-10">Sign In to Workspace</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5 font-heading font-bold tracking-widest uppercase text-sm px-10 py-8 rounded-none"
                >
                  View Documentation
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="aspect-square relative rounded-2xl overflow-hidden border border-white/10 bg-black/50 backdrop-blur-sm p-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-50" />
                <Image
                  src="https://static.wixstatic.com/media/420216_aef749f3879d4d98a15c738a4162b154~mv2.png?originWidth=768&originHeight=768"
                  alt="AI Vision Interface"
                  width={800}
                  className="w-full h-full object-cover rounded-xl mix-blend-luminosity opacity-80"
                />
                {/* Decorative UI Overlays */}
                <div className="absolute top-8 left-8 w-32 h-32 border-t-2 border-l-2 border-primary/50" />
                <div className="absolute bottom-8 right-8 w-32 h-32 border-b-2 border-r-2 border-secondary/50" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-accent-muted/30" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-[1px] bg-accent-muted/30" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Platform Features */}
      <div className="w-full px-6 py-32 bg-black/40 border-y border-white/5 relative">
        <div className="max-w-[120rem] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="font-heading text-4xl lg:text-6xl font-black uppercase tracking-tighter">
                Platform <span className="text-primary">Capabilities</span>
              </h2>
              <p className="text-glass-foreground mt-4 font-paragraph max-w-xl">
                A comprehensive suite of tools engineered for precision and speed in AI model development.
              </p>
            </motion.div>
            <div className="hidden md:flex gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <div className="w-2 h-2 bg-secondary rounded-full" />
              <div className="w-2 h-2 bg-accent-muted rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {HOME_FEATURES.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, background: "rgba(255,255,255,0)" }}
                whileInView={{ opacity: 1 }}
                whileHover={{ background: "rgba(255,255,255,0.03)" }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background p-10 relative group overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                <div className="text-primary mb-6 transform group-hover:scale-110 group-hover:text-secondary transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4 uppercase tracking-wide text-white">
                  {feature.title}
                </h3>
                <p className="text-glass-foreground text-sm leading-relaxed font-paragraph">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Stack - Split Layout */}
      <div className="w-full px-6 py-32 relative overflow-hidden">
        <div className="max-w-[120rem] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1 relative aspect-[4/3] border border-white/10 bg-black/50 p-2"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-50" />
              <Image
                src="https://static.wixstatic.com/media/420216_23c93e9b7d64440c8cb14d91039aea62~mv2.png?originWidth=960&originHeight=704"
                alt="Architecture"
                width={1000}
                className="w-full h-full object-cover filter grayscale contrast-125 opacity-70"
              />
              <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-md border border-white/10 p-4 font-paragraph text-xs text-primary uppercase tracking-widest">
                SYS.ARCH.v2 // ACTIVE
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 space-y-12"
            >
              <div>
                <h2 className="font-heading text-4xl lg:text-6xl font-black uppercase tracking-tighter mb-6">
                  Powered by <br/><span className="text-secondary">Advanced AI</span>
                </h2>
                <p className="text-glass-foreground font-paragraph">
                  Our infrastructure is built on cutting-edge neural network architectures, optimized for both cloud and edge deployment.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { title: 'Neural Network Architecture', desc: 'State-of-the-art deep learning models optimized for real-time object detection and classification.' },
                  { title: 'Edge Computing Ready', desc: 'Deploy trained models on edge devices for low-latency inference without cloud dependency.' },
                  { title: 'Continuous Learning', desc: 'Iteratively improve model performance with new training data and fine-tuning capabilities.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="mt-1 text-secondary group-hover:text-primary transition-colors">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-bold uppercase tracking-wide text-white mb-2">{item.title}</h3>
                      <p className="text-glass-foreground text-sm font-paragraph">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Getting Started - Horizontal Scroll/Steps */}
      <div className="w-full px-6 py-32 bg-primary/5 border-y border-primary/10">
        <div className="max-w-[120rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="font-heading text-4xl lg:text-5xl font-black uppercase tracking-tighter">
              Deployment <span className="text-primary">Protocol</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            {HOME_STEPS.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative pt-8"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-background border-2 border-primary rounded-full flex items-center justify-center z-10 shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-8 text-center h-full hover:border-primary/30 transition-colors group">
                  <div className="text-6xl font-heading font-black text-white/5 mb-6 group-hover:text-primary/10 transition-colors">
                    {item.step}
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-4 uppercase tracking-wide text-white">
                    {item.title}
                  </h3>
                  <p className="text-glass-foreground text-sm font-paragraph">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section - Link to Training & Inference */}
      <div className="w-full px-6 py-32 relative overflow-hidden">
        <div className="max-w-[120rem] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/training" className="group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/30 p-12 h-full hover:border-secondary/50 transition-all"
              >
                <div className="text-secondary mb-6 group-hover:scale-110 transition-transform">
                  <Activity className="w-12 h-12" />
                </div>
                <h3 className="font-heading text-3xl font-black uppercase tracking-tighter text-white mb-4">
                  Training Module
                </h3>
                <p className="text-glass-foreground font-paragraph mb-6">
                  Upload videos, define ROI regions, and train custom AI models with advanced tools and real-time feedback.
                </p>
                <Button className="bg-secondary text-white hover:bg-secondary/90 font-heading uppercase tracking-widest">
                  Launch Training →
                </Button>
              </motion.div>
            </Link>

            <Link to="/inference" className="group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 p-12 h-full hover:border-primary/50 transition-all"
              >
                <div className="text-primary mb-6 group-hover:scale-110 transition-transform">
                  <Eye className="w-12 h-12" />
                </div>
                <h3 className="font-heading text-3xl font-black uppercase tracking-tighter text-white mb-4">
                  Inference Module
                </h3>
                <p className="text-glass-foreground font-paragraph mb-6">
                  Run trained models on new videos with adjustable thresholds and real-time detection overlays.
                </p>
                <Button className="bg-primary text-black hover:bg-primary/90 font-heading uppercase tracking-widest">
                  Launch Inference →
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

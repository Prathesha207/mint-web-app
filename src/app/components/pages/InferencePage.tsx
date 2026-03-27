import React, { useState } from 'react';
import { 
  Upload, Smartphone, Camera, 
  Play, SquareX, ChevronDown, 
  Activity, HelpCircle, Terminal, Database, CheckCircle2, Eye, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function InferencePage() {
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [inputSource, setInputSource] = useState<'upload' | 'phone' | 'oak' | 'live'>('upload');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [threshold, setThreshold] = useState(0.5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProcessed, setShowProcessed] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [showModelModal, setShowModelModal] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const AVAILABLE_MODELS = [
    { id: 'model-1', name: 'Object Detection v1.2', accuracy: '94.3%', date: '2026-03-08' },
    { id: 'model-2', name: 'Person Tracking v2.0', accuracy: '91.7%', date: '2026-03-05' },
    { id: 'model-3', name: 'Vehicle Detection v1.5', accuracy: '96.1%', date: '2026-03-01' }
  ];

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedVideo(url);
    }
  };

  const startInference = () => {
    setIsProcessing(true);
    setLogs([]);
    setShowTerminal(true);
    
    const logMessages = [
      '[SYS] Loading AI model weights...',
      '[OK] Model loaded successfully',
      '[PROC] Initializing frame buffer...',
      '[STAT] Frame 1/100: 3 objects detected',
      '[STAT] Frame 25/100: 5 objects detected',
      '[STAT] Frame 50/100: 4 objects detected',
      '[STAT] Frame 75/100: 6 objects detected',
      '[STAT] Frame 100/100: 3 objects detected',
      '[OK] Inference sequence completed!',
      '[SYS] Results ready for visual review.'
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < logMessages.length) {
        setLogs(prev => [...prev, logMessages[index]]);
        index++;
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        setShowProcessed(true);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-paragraph selection:bg-primary/30 selection:text-primary flex flex-col overflow-hidden">
      {/* Global Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(109,179,216,0.02)_0%,_transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMjMzIiBmaWxsLW9wYWNpdHk9IjAuMDMiLz4KPC9zdmc+')] opacity-50 mix-blend-overlay" />
      </div>

      <Header />

      {/* Main Content */}
      <div className="flex-1 lg:ml-20 relative z-10 pt-16 lg:pt-0 flex flex-col overflow-hidden">
        {/* Workspace Header with Top Navigation */}
        <header className="w-full border-b border-primary/20 bg-white/50 backdrop-blur-md px-4 py-2 flex justify-between items-center sticky top-0 z-40 h-16">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <h1 className="font-heading text-lg font-black uppercase tracking-widest text-foreground">
              Inference <span className="text-primary">Module</span>
            </h1>
          </div>
          
          {/* Input Source Tabs - Top Navigation */}
          <div className="flex gap-1 bg-white/30 border border-primary/20 p-1">
            <Button
              onClick={() => { setInputSource('upload'); setCameraActive(false); }}
              variant="ghost"
              size="sm"
              className={`rounded-none font-heading uppercase tracking-wider text-xs px-3 h-8 ${inputSource === 'upload' ? 'bg-primary/20 text-primary border-b-2 border-primary' : 'text-glass-foreground hover:text-foreground'}`}
            >
              <Upload className="w-3 h-3 mr-1" /> Upload
            </Button>
            <Button
              onClick={() => { setInputSource('phone'); setCameraActive(false); }}
              variant="ghost"
              size="sm"
              className={`rounded-none font-heading uppercase tracking-wider text-xs px-3 h-8 ${inputSource === 'phone' ? 'bg-primary/20 text-primary border-b-2 border-primary' : 'text-glass-foreground hover:text-foreground'}`}
            >
              <Smartphone className="w-3 h-3 mr-1" /> Phone
            </Button>
            <Button
              onClick={() => { setInputSource('oak'); setCameraActive(false); }}
              variant="ghost"
              size="sm"
              className={`rounded-none font-heading uppercase tracking-wider text-xs px-3 h-8 ${inputSource === 'oak' ? 'bg-primary/20 text-primary border-b-2 border-primary' : 'text-glass-foreground hover:text-foreground'}`}
            >
              <Camera className="w-3 h-3 mr-1" /> Oak
            </Button>
            <Button
              onClick={() => { setInputSource('live'); setCameraActive(!cameraActive); }}
              variant="ghost"
              size="sm"
              className={`rounded-none font-heading uppercase tracking-wider text-xs px-3 h-8 ${inputSource === 'live' ? 'bg-primary/20 text-primary border-b-2 border-primary' : 'text-glass-foreground hover:text-foreground'}`}
            >
              <Camera className="w-3 h-3 mr-1" /> Live
            </Button>
          </div>

          {uploadedVideo && (
            <div className="flex bg-white border border-primary/20 p-1">
              <Button
                onClick={() => setShowProcessed(false)}
                variant="ghost"
                size="sm"
                className={`rounded-none font-paragraph text-xs uppercase px-3 h-7 ${!showProcessed ? 'bg-primary/20 text-primary' : 'text-glass-foreground hover:text-foreground'}`}
              >
                Raw Feed
              </Button>
              <Button
                onClick={() => setShowProcessed(true)}
                variant="ghost"
                size="sm"
                disabled={isProcessing}
                className={`rounded-none font-paragraph text-xs uppercase px-3 h-7 ${showProcessed ? 'bg-primary text-white font-bold' : 'text-glass-foreground hover:text-foreground'}`}
              >
                Processed
              </Button>
            </div>
          )}

          <div className="font-paragraph text-xs text-glass-foreground uppercase tracking-widest hidden sm:block">
            INF-3391-Y
          </div>
        </header>

        {/* Main Layout */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Video Area */}
          <div className="flex-1 flex flex-col gap-0 p-2 overflow-y-auto lg:overflow-y-hidden">
            <div className="flex-1 bg-white border border-primary/20 relative flex flex-col overflow-hidden">
              <div className="absolute top-0 left-0 w-full p-2 flex justify-between items-center z-10 pointer-events-none text-xs">
                <div className="font-paragraph text-glass-foreground uppercase tracking-widest">
                  Viewport // {showProcessed ? 'INFERENCE_ACTIVE' : 'RAW_DATA'}
                </div>
              </div>

              {!uploadedVideo && inputSource === 'upload' ? (
                <label className="flex-1 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors group border-2 border-dashed border-primary/20 m-2">
                  <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                  <Eye className="w-10 h-10 text-primary/30 group-hover:text-primary transition-colors mb-2" />
                  <p className="font-heading uppercase tracking-widest text-glass-foreground group-hover:text-foreground transition-colors text-sm">Load Target Media</p>
                  <p className="font-paragraph text-xs text-glass-foreground/60 mt-1">MP4, AVI, MOV (Max 500MB)</p>
                </label>
              ) : (
                <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-white/80">
                  {uploadedVideo && inputSource === 'upload' ? (
                    <video 
                      src={uploadedVideo} 
                      controls 
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-12 h-12 text-primary/20 mx-auto mb-2" />
                        <p className="text-glass-foreground font-paragraph text-sm">{cameraActive ? 'Camera Active' : 'Camera Inactive'}</p>
                        {inputSource === 'live' && (
                          <Button
                            onClick={() => setCameraActive(!cameraActive)}
                            size="sm"
                            className={`mt-3 text-xs ${cameraActive ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'} text-white font-heading uppercase tracking-widest`}
                          >
                            {cameraActive ? 'Stop' : 'Start'} Camera
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Inference Overlays */}
                  <AnimatePresence>
                    {showProcessed && uploadedVideo && inputSource === 'upload' && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none"
                      >
                        {/* Scanning Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary/50 shadow-[0_0_15px_rgba(109,179,216,0.4)] animate-[scan_3s_ease-in-out_infinite]" />
                        
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4 bg-primary/20 border border-primary text-primary px-3 py-1 text-xs font-paragraph font-bold uppercase tracking-widest backdrop-blur-md flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                          Live Detection
                        </div>

                        {/* Simulated Bounding Boxes */}
                        <div className="absolute top-[30%] left-[20%] w-[25%] h-[40%] border-2 border-primary bg-primary/5">
                          <span className="absolute -top-6 left-[-2px] bg-primary text-white px-2 py-1 text-[10px] font-paragraph font-bold uppercase">
                            Person [0.94]
                          </span>
                          <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-primary" />
                          <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-primary" />
                        </div>
                        <div className="absolute top-[45%] right-[25%] w-[15%] h-[25%] border-2 border-accent-muted bg-accent-muted/5">
                          <span className="absolute -top-6 left-[-2px] bg-accent-muted text-white px-2 py-1 text-[10px] font-paragraph font-bold uppercase">
                            Object [0.87]
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Controls & Panels */}
          <div className="w-full lg:w-80 flex flex-col border-t lg:border-t-0 lg:border-l border-primary/20 bg-white/30 overflow-y-auto">
            
            {/* Configuration Panel */}
            <div className="bg-white/40 border-b border-primary/20 p-3 flex flex-col gap-3">
              
              {/* Model Selection */}
              <div>
                <label className="block font-heading text-xs uppercase tracking-widest text-glass-foreground mb-2">Active Model</label>
                <Button
                  onClick={() => setShowModelModal(true)}
                  variant="outline"
                  size="sm"
                  className="w-full bg-white border-primary/20 text-foreground hover:bg-white/80 hover:border-primary rounded-none justify-between font-paragraph text-xs h-9"
                >
                  {selectedModel ? AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name : 'Select Trained Model...'}
                  <ChevronDown className="w-3 h-3 text-primary" />
                </Button>
                {selectedModel && (
                  <div className="mt-2 flex justify-between text-xs font-paragraph text-glass-foreground">
                    <span>Confidence: <span className="text-accent-muted">{AVAILABLE_MODELS.find(m => m.id === selectedModel)?.accuracy}</span></span>
                    <span>{AVAILABLE_MODELS.find(m => m.id === selectedModel)?.date}</span>
                  </div>
                )}
              </div>

              {/* Threshold Slider */}
              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="block font-heading text-xs uppercase tracking-widest text-glass-foreground">Detection Threshold</label>
                  <span className="font-paragraph text-primary text-xs font-bold">{threshold.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="w-full h-1 bg-primary/20 rounded-none appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] font-paragraph text-glass-foreground/60 mt-2 uppercase">
                  <span>High Recall</span>
                  <span>High Precision</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-primary/20">
                <Button
                  onClick={startInference}
                  disabled={isProcessing || !uploadedVideo || !selectedModel}
                  className="w-full bg-primary text-white hover:bg-primary/90 font-heading font-black uppercase tracking-widest py-2 rounded-none text-xs shadow-[0_0_20px_rgba(109,179,216,0.2)] disabled:opacity-50 disabled:shadow-none transition-all"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-1 justify-center"><Activity className="w-3 h-3 animate-spin" /> Processing...</span>
                  ) : (
                    <span className="flex items-center gap-1 justify-center"><Play className="w-3 h-3 fill-current" /> Run Inference</span>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  disabled={!isProcessing}
                  size="sm"
                  className="w-full rounded-none border-destructive/50 text-destructive hover:bg-destructive/10 font-heading uppercase text-xs tracking-wider h-7"
                >
                  <SquareX className="w-3 h-3 mr-1" /> Terminate
                </Button>
              </div>
            </div>

            {/* Terminal Icon Button */}
            <button
              onClick={() => setShowTerminal(!showTerminal)}
              className="flex items-center justify-center gap-1 px-3 py-2 border border-primary/20 text-glass-foreground hover:text-foreground hover:border-primary/50 transition-all rounded-none font-heading text-xs uppercase tracking-widest mx-3 mt-2"
            >
              <Terminal className="w-3 h-3" /> Terminal
            </button>

            {/* Instructions Icon Button */}
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="flex items-center justify-center gap-1 px-3 py-2 border border-primary/20 text-glass-foreground hover:text-foreground hover:border-primary/50 transition-all rounded-none font-heading text-xs uppercase tracking-widest mx-3"
            >
              <HelpCircle className="w-3 h-3" /> Instructions
            </button>

            {/* Instructions Panel - Scrollable */}
            <AnimatePresence>
              {showInstructions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-primary/30 bg-primary/10 p-3 relative overflow-hidden mx-3 mb-3 mt-2 max-h-64 overflow-y-auto"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                  <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-1 sticky top-0 bg-primary/10">
                    <HelpCircle className="w-3 h-3" /> Inference Guide
                  </h3>
                  <ul className="space-y-2 text-xs font-paragraph text-glass-foreground pr-2">
                    <li className="flex gap-2"><span className="text-primary flex-shrink-0">01.</span> <span>Load target media (Upload/Cam).</span></li>
                    <li className="flex gap-2"><span className="text-primary flex-shrink-0">02.</span> <span>Select trained model.</span></li>
                    <li className="flex gap-2"><span className="text-primary flex-shrink-0">03.</span> <span>Adjust detection threshold.</span></li>
                    <li className="flex gap-2"><span className="text-primary flex-shrink-0">04.</span> <span>Run inference and view results.</span></li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Terminal Drawer - Right Side */}
        <AnimatePresence>
          {showTerminal && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '320px' }}
              exit={{ width: 0 }}
              className="border-l border-primary/20 bg-white flex flex-col absolute right-0 top-16 bottom-0 z-30 hidden lg:flex"
            >
              <div className="border-b border-primary/20 p-2 flex justify-between items-center bg-white/50">
                <span className="font-paragraph text-xs uppercase tracking-widest text-glass-foreground">Inference.Log</span>
                <button
                  onClick={() => setShowTerminal(false)}
                  className="text-glass-foreground hover:text-foreground transition-colors p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1 p-2 overflow-y-auto font-paragraph text-xs leading-relaxed space-y-1">
                {logs.length === 0 ? (
                  <div className="text-glass-foreground/40 italic">Awaiting model execution...</div>
                ) : (
                  <AnimatePresence>
                    {logs.map((log, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`${
                          log.includes('[OK]') ? 'text-accent-muted' :
                          log.includes('[STAT]') ? 'text-primary' :
                          log.includes('[ERR]') ? 'text-destructive' :
                          'text-glass-foreground'
                        }`}
                      >
                        <span className="opacity-50 mr-1">{`>`}</span>{log}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Model Selection Modal */}
      <AnimatePresence>
        {showModelModal && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-primary/30 p-6 max-w-2xl w-full relative overflow-hidden shadow-[0_0_50px_rgba(109,179,216,0.1)]"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/30 m-4 pointer-events-none" />
              
              <h2 className="font-heading text-xl font-black uppercase tracking-widest mb-6 text-foreground flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" /> Model Repository
              </h2>
              
              <div className="space-y-2 mb-6 max-h-[50vh] overflow-y-auto pr-2">
                {AVAILABLE_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model.id);
                      setShowModelModal(false);
                    }}
                    className={`w-full text-left p-3 border transition-all group relative overflow-hidden ${
                      selectedModel === model.id
                        ? 'border-primary bg-primary/10'
                        : 'border-primary/20 bg-white/50 hover:border-primary/50 hover:bg-white/80'
                    }`}
                  >
                    {selectedModel === model.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                    )}
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground group-hover:text-primary transition-colors">
                        {model.name}
                      </h3>
                      {selectedModel === model.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="flex gap-4 text-xs font-paragraph text-glass-foreground uppercase tracking-widest">
                      <span>Acc: <span className="text-accent-muted">{model.accuracy}</span></span>
                      <span>Build: {model.date}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={() => setShowModelModal(false)}
                  variant="outline"
                  size="sm"
                  className="rounded-none border-primary/20 text-foreground hover:bg-primary/10 font-heading uppercase tracking-widest px-6"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </div>
  );
}

import React, { useState, useRef } from 'react';
import {
  Upload, Smartphone, Camera,
  Square, Hexagon, Trash2, Play, SquareX,
  Pause, ChevronDown, AlertCircle, Terminal, Activity, HelpCircle, X
} from 'lucide-react';
import Header from '../Header';
import { Button } from '../ui/button';


export default function TrainingPage() {
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [inputSource, setInputSource] = useState<'upload' | 'phone' | 'oak' | 'live'>('upload');
  const [roiTool, setRoiTool] = useState<'rectangle' | 'polygon' | null>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [frames, setFrames] = useState(100);
  const [duration, setDuration] = useState(30);
  const [trainingType, setTrainingType] = useState<string>('');
  const [isTraining, setIsTraining] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const AVAILABLE_MODELS = [
    { id: 'model-1', name: 'YOLOv8 Object Detection' },
    { id: 'model-2', name: 'ResNet50 Classification' },
    { id: 'model-3', name: 'Mask R-CNN Segmentation' }
  ];

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedVideo(url);
    }
  };

  const toggleModelSelection = (modelId: string) => {
    setSelectedModels(prev =>
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const startTraining = () => {
    setIsTraining(true);
    setLogs([]);
    setShowTerminal(true);

    const logMessages = [
      '[SYS] Initializing training pipeline...',
      '[DATA] Loading video stream...',
      '[PROC] Processing ROI regions...',
      '[ARCH] Building neural network architecture...',
      '[EXEC] Starting training epoch 1/10...',
      '[STAT] Epoch 1: Loss=0.452, Accuracy=78.3%',
      '[STAT] Epoch 2: Loss=0.321, Accuracy=84.1%',
      '[STAT] Epoch 3: Loss=0.267, Accuracy=87.9%',
      '[OK] Training completed successfully!',
      '[SYS] Model saved to workspace.'
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < logMessages.length) {
        setLogs(prev => [...prev, logMessages[index]]);
        index++;
      } else {
        clearInterval(interval);
        setIsTraining(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-paragraph selection:bg-secondary/30 selection:text-secondary flex flex-col overflow-hidden">
      {/* Global Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(155,126,189,0.02)_0%,_transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMjMzIiBmaWxsLW9wYWNpdHk9IjAuMDMiLz4KPC9zdmc+')] opacity-50 mix-blend-overlay" />
      </div>

      <Header />

      {/* Main Content */}
      <div className="flex-1 lg:ml-20 relative z-10 pt-16 lg:pt-0 flex flex-col overflow-hidden">
        {/* Workspace Header with Top Navigation */}
        <header className="w-full border-b border-secondary/20 bg-white/50 backdrop-blur-md px-4 py-2 flex justify-between items-center sticky top-0 z-40 h-16">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <h1 className="font-heading text-lg font-black uppercase tracking-widest text-foreground">
              Training <span className="text-secondary">Module</span>
            </h1>
          </div>

          {/* Input Source Tabs - Top Navigation */}
          <div className="flex gap-1 bg-white/30 border border-secondary/20 p-1">
            <Button
              onClick={() => { setInputSource('upload'); setCameraActive(false); }}
              variant="ghost"
              size="sm"
              className={`rounded-none font-heading uppercase tracking-wider text-xs px-3 h-8 ${inputSource === 'upload' ? 'bg-secondary/20 text-secondary border-b-2 border-secondary' : 'text-glass-foreground hover:text-foreground'}`}
            >
              <Upload className="w-3 h-3 mr-1" /> Upload
            </Button>
            <Button
              onClick={() => { setInputSource('phone'); setCameraActive(false); }}
              variant="ghost"
              size="sm"
              className={`rounded-none font-heading uppercase tracking-wider text-xs px-3 h-8 ${inputSource === 'phone' ? 'bg-secondary/20 text-secondary border-b-2 border-secondary' : 'text-glass-foreground hover:text-foreground'}`}
            >
              <Smartphone className="w-3 h-3 mr-1" /> Phone
            </Button>
            <Button
              onClick={() => { setInputSource('oak'); setCameraActive(false); }}
              variant="ghost"
              size="sm"
              className={`rounded-none font-heading uppercase tracking-wider text-xs px-3 h-8 ${inputSource === 'oak' ? 'bg-secondary/20 text-secondary border-b-2 border-secondary' : 'text-glass-foreground hover:text-foreground'}`}
            >
              <Camera className="w-3 h-3 mr-1" /> Oak
            </Button>
            <Button
              onClick={() => { setInputSource('live'); setCameraActive(!cameraActive); }}
              variant="ghost"
              size="sm"
              className={`rounded-none font-heading uppercase tracking-wider text-xs px-3 h-8 ${inputSource === 'live' ? 'bg-secondary/20 text-secondary border-b-2 border-secondary' : 'text-glass-foreground hover:text-foreground'}`}
            >
              <Camera className="w-3 h-3 mr-1" /> Live
            </Button>
          </div>

          <div className="font-paragraph text-xs text-glass-foreground uppercase tracking-widest hidden sm:block">
            TRN-8842-X
          </div>
        </header>

        {/* Main Layout */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Video Area */}
          <div className="flex-1 flex flex-col gap-0 p-2 overflow-y-auto lg:overflow-y-hidden">
            <div className="flex-1 bg-white border border-secondary/20 relative flex flex-col overflow-hidden">
              {/* Canvas Header */}
              <div className="absolute top-0 left-0 w-full p-2 flex justify-between items-center z-10 pointer-events-none text-xs">
                <div className="font-paragraph text-glass-foreground uppercase tracking-widest">
                  Viewport // {inputSource.toUpperCase()}
                </div>
                {uploadedVideo && (
                  <div className="flex gap-1 pointer-events-auto">
                    <div className="px-2 py-1 bg-white/80 border border-secondary/20 text-xs font-paragraph text-foreground">1920x1080</div>
                    <div className="px-2 py-1 bg-white/80 border border-secondary/20 text-xs font-paragraph text-foreground">60FPS</div>
                  </div>
                )}
              </div>

              {!uploadedVideo && inputSource === 'upload' ? (
                <label className="flex-1 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/5 transition-colors group border-2 border-dashed border-secondary/20 m-2">
                  <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                  <Upload className="w-10 h-10 text-secondary/30 group-hover:text-secondary transition-colors mb-2" />
                  <p className="font-heading uppercase tracking-widest text-glass-foreground group-hover:text-foreground transition-colors text-sm">Initialize Data Stream</p>
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
                        <Camera className="w-12 h-12 text-secondary/20 mx-auto mb-2" />
                        <p className="text-glass-foreground font-paragraph text-sm">{cameraActive ? 'Camera Active' : 'Camera Inactive'}</p>
                        {inputSource === 'live' && (
                          <Button
                            onClick={() => setCameraActive(!cameraActive)}
                            size="sm"
                            className={`mt-3 text-xs ${cameraActive ? 'bg-destructive hover:bg-destructive/90' : 'bg-secondary hover:bg-secondary/90'} text-white font-heading uppercase tracking-widest`}
                          >
                            {cameraActive ? 'Stop' : 'Start'} Camera
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ROI Overlay */}
                  {roiTool && (
                    <div className="absolute inset-0 pointer-events-none border-[1px] border-secondary/30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNMCAwaDQwdjQwaC00MHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDAsIDI1NSwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')]" />
                  )}
                </div>
              )}

              {/* ROI Toolbar */}
              <div className="border-t border-secondary/20 bg-white/50 p-1 flex justify-center gap-1">
                <Button
                  onClick={() => setRoiTool('rectangle')}
                  variant="ghost"
                  size="sm"
                  className={`rounded-none font-paragraph text-xs uppercase h-7 px-2 ${roiTool === 'rectangle' ? 'bg-secondary text-white' : 'text-glass-foreground hover:text-foreground'}`}
                >
                  <Square className="w-3 h-3 mr-1" /> Rect
                </Button>
                <Button
                  onClick={() => setRoiTool('polygon')}
                  variant="ghost"
                  size="sm"
                  className={`rounded-none font-paragraph text-xs uppercase h-7 px-2 ${roiTool === 'polygon' ? 'bg-secondary text-white' : 'text-glass-foreground hover:text-foreground'}`}
                >
                  <Hexagon className="w-3 h-3 mr-1" /> Poly
                </Button>
                <div className="w-px h-4 bg-secondary/20 mx-1" />
                <Button
                  onClick={() => setRoiTool(null)}
                  variant="ghost"
                  size="sm"
                  className="rounded-none font-paragraph text-xs uppercase h-7 px-2 text-destructive hover:bg-destructive/20 hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3 mr-1" /> Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Controls & Panels */}
          <div className="w-full lg:w-80 flex flex-col border-t lg:border-t-0 lg:border-l border-secondary/20 bg-white/30 overflow-y-auto">

            {/* Configuration Panel */}
            <div className="bg-white/40 border-b border-secondary/20 p-3 flex flex-col gap-3">
              <div>
                <label className="block font-heading text-xs uppercase tracking-widest text-glass-foreground mb-1">Architecture Type</label>
                <div className="relative">
                  <select
                    value={trainingType}
                    onChange={(e) => setTrainingType(e.target.value)}
                    className="w-full bg-white border border-secondary/20 rounded-none px-2 py-2 text-foreground font-paragraph text-xs focus:border-secondary focus:outline-none appearance-none"
                  >
                    <option value="">Select Model Architecture...</option>
                    <option value="object-detection">YOLOv8 Object Detection</option>
                    <option value="classification">ResNet50 Classification</option>
                    <option value="segmentation">Mask R-CNN Segmentation</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-glass-foreground pointer-events-none" />
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <label className="block font-heading text-xs uppercase tracking-widest text-glass-foreground mb-2">Select Models</label>
                <div className="space-y-1">
                  {AVAILABLE_MODELS.map(model => (
                    <button
                      key={model.id}
                      onClick={() => toggleModelSelection(model.id)}
                      className={`w-full text-left px-2 py-1 border rounded-none text-xs font-paragraph transition-all ${selectedModels.includes(model.id)
                        ? 'bg-secondary/20 border-secondary text-secondary'
                        : 'border-secondary/20 text-glass-foreground hover:border-secondary/50'
                        }`}
                    >
                      <span className="mr-2">{selectedModels.includes(model.id) ? '✓' : '○'}</span>
                      {model.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recording Settings */}
              <div className="space-y-2 border-t border-secondary/20 pt-2">
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <label className="block font-heading text-xs uppercase tracking-widest text-glass-foreground">Frames</label>
                    <span className="font-paragraph text-secondary text-xs font-bold">{frames}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={frames}
                    onChange={(e) => setFrames(parseInt(e.target.value))}
                    className="w-full h-1 bg-secondary/20 rounded-none appearance-none cursor-pointer accent-secondary"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-end mb-1">
                    <label className="block font-heading text-xs uppercase tracking-widest text-glass-foreground">Duration (sec)</label>
                    <span className="font-paragraph text-secondary text-xs font-bold">{duration}s</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="300"
                    step="5"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full h-1 bg-secondary/20 rounded-none appearance-none cursor-pointer accent-secondary"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-secondary/20">
                <Button
                  onClick={startTraining}
                  disabled={isTraining || !uploadedVideo || !trainingType || selectedModels.length === 0}
                  className="w-full bg-secondary text-white hover:bg-secondary/80 font-heading font-black uppercase tracking-widest py-2 rounded-none text-xs shadow-[0_0_20px_rgba(155,126,189,0.2)] disabled:opacity-50 disabled:shadow-none transition-all"
                >
                  {isTraining ? (
                    <span className="flex items-center gap-1 justify-center"><Activity className="w-3 h-3 animate-spin" /> Compiling...</span>
                  ) : (
                    <span className="flex items-center gap-1 justify-center"><Play className="w-3 h-3 fill-current" /> Execute</span>
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    disabled={!isTraining}
                    size="sm"
                    className="rounded-none border-secondary/20 text-foreground hover:bg-secondary/10 font-heading uppercase text-xs tracking-wider h-7"
                  >
                    <Pause className="w-3 h-3 mr-1" /> Pause
                  </Button>
                  <Button
                    variant="outline"
                    disabled={!isTraining}
                    size="sm"
                    className="rounded-none border-destructive/50 text-destructive hover:bg-destructive/10 font-heading uppercase text-xs tracking-wider h-7"
                  >
                    <SquareX className="w-3 h-3 mr-1" /> Abort
                  </Button>
                </div>
              </div>
            </div>

            {/* Terminal Icon Button */}
            <button
              onClick={() => setShowTerminal(!showTerminal)}
              className="flex items-center justify-center gap-1 px-3 py-2 border border-secondary/20 text-glass-foreground hover:text-foreground hover:border-secondary/50 transition-all rounded-none font-heading text-xs uppercase tracking-widest mx-3 mt-2"
            >
              <Terminal className="w-3 h-3" /> Terminal
            </button>

            {/* Instructions Icon Button */}
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="flex items-center justify-center gap-1 px-3 py-2 border border-secondary/20 text-glass-foreground hover:text-foreground hover:border-secondary/50 transition-all rounded-none font-heading text-xs uppercase tracking-widest mx-3"
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
                  className="border-t border-secondary/30 bg-secondary/10 p-3 relative overflow-hidden mx-3 mb-3 mt-2 max-h-64 overflow-y-auto"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
                  <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-secondary mb-2 flex items-center gap-1 sticky top-0 bg-secondary/10">
                    <AlertCircle className="w-3 h-3" /> Protocol Guide
                  </h3>
                  <ul className="space-y-2 text-xs font-paragraph text-glass-foreground pr-2">
                    <li className="flex gap-2"><span className="text-secondary flex-shrink-0">01.</span> <span>Initialize data stream (Upload/Cam).</span></li>
                    <li className="flex gap-2"><span className="text-secondary flex-shrink-0">02.</span> <span>Define ROI using geometry tools.</span></li>
                    <li className="flex gap-2"><span className="text-secondary flex-shrink-0">03.</span> <span>Select neural architecture.</span></li>
                    <li className="flex gap-2"><span className="text-secondary flex-shrink-0">04.</span> <span>Execute training sequence.</span></li>
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
              className="border-l border-secondary/20 bg-white flex flex-col absolute right-0 top-16 bottom-0 z-30 hidden lg:flex"
            >
              <div className="border-b border-secondary/20 p-2 flex justify-between items-center bg-white/50">
                <span className="font-paragraph text-xs uppercase tracking-widest text-glass-foreground">System.Out</span>
                <button
                  onClick={() => setShowTerminal(false)}
                  className="text-glass-foreground hover:text-foreground transition-colors p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1 p-2 overflow-y-auto font-paragraph text-xs leading-relaxed space-y-1">
                {logs.length === 0 ? (
                  <div className="text-glass-foreground/40 italic">Awaiting execution command...</div>
                ) : (
                  <AnimatePresence>
                    {logs.map((log, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`${log.includes('[OK]') ? 'text-accent-muted' :
                          log.includes('[STAT]') ? 'text-secondary' :
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

      <Footer />
    </div>
  );
}

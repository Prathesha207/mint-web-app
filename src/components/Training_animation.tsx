// 'use client';
// import React, { useEffect, useState, useRef } from 'react';
// import './MLPipelineVisualizer.css';

// interface MLWorkflowVisualizerProps {
//   stage: 'preprocessing' | 'featureExtraction' | 'training' | 'analysis';
//   videoFile?: string;
//   progress?: number;
//   onStageComplete?: (stage: string) => void;
// }

// interface Frame {
//   id: number;
//   type: 'video' | 'image';
//   timestamp?: number;
//   processed: boolean;
//   features?: number[];
// }

// interface FeatureLayer {
//   name: string;
//   level: number;
//   activations: number[][];
//   kernelSize: number;
// }

// interface Neuron {
//   id: number;
//   layer: number;
//   position: { x: number; y: number };
//   activation: number;
//   connections: number[];
// }

// const MLWorkflowVisualizer: React.FC<MLWorkflowVisualizerProps> = ({
//   stage,
//   videoFile = 'sample_video.mp4',
//   progress = 0,
//   onStageComplete
// }) => {
//   const [activeStage, setActiveStage] = useState(stage);
//   const [frames, setFrames] = useState<Frame[]>([]);
//   const [extractedFrames, setExtractedFrames] = useState<number>(0);
//   const [featureLayers, setFeatureLayers] = useState<FeatureLayer[]>([]);
//   const [neurons, setNeurons] = useState<Neuron[]>([]);
//   const [dataFlow, setDataFlow] = useState<Array<{ id: number; path: string; progress: number }>>([]);
//   const [kernelPositions, setKernelPositions] = useState<Array<{ x: number; y: number; layer: number }>>([]);
//   const [modelMetrics, setModelMetrics] = useState({
//     accuracy: 0,
//     loss: 0,
//     precision: 0,
//     recall: 0
//   });
  
//   const containerRef = useRef<HTMLDivElement>(null);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const animationRef = useRef<number>();
//   const frameIntervalRef = useRef<NodeJS.Timeout>();

//   // Initialize component
//   useEffect(() => {
//     setActiveStage(stage);
//     initializeStage(stage);
    
//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//       if (frameIntervalRef.current) {
//         clearInterval(frameIntervalRef.current);
//       }
//     };
//   }, [stage]);

//   const initializeStage = (stage: MLWorkflowVisualizerProps['stage']) => {
//     switch (stage) {
//       case 'preprocessing':
//         initializePreprocessing();
//         break;
//       case 'featureExtraction':
//         initializeFeatureExtraction();
//         break;
//       case 'training':
//         initializeTraining();
//         break;
//       case 'analysis':
//         initializeAnalysis();
//         break;
//     }
//   };

//   // Stage 1: Video/Image Preprocessing
//   const initializePreprocessing = () => {
//     // Create initial frames
//     const initialFrames: Frame[] = Array.from({ length: 12 }, (_, i) => ({
//       id: i,
//       type: 'video',
//       timestamp: i * 0.5,
//       processed: false
//     }));
//     setFrames(initialFrames);
//     setExtractedFrames(0);

//     // Simulate frame extraction
//     let frameCount = 0;
//     frameIntervalRef.current = setInterval(() => {
//       if (frameCount < initialFrames.length) {
//         setFrames(prev => prev.map((frame, idx) => 
//           idx === frameCount ? { ...frame, processed: true } : frame
//         ));
//         setExtractedFrames(prev => prev + 1);
//         frameCount++;
//       } else {
//         clearInterval(frameIntervalRef.current);
//         if (onStageComplete) onStageComplete('preprocessing');
//       }
//     }, 500);
//   };

//   // Stage 2: Feature Extraction with WideResNet50 simulation
//   const initializeFeatureExtraction = () => {
//     // Create feature layers (simulating WideResNet50 architecture)
//     const layers: FeatureLayer[] = [
//       { name: 'Conv1', level: 1, activations: [], kernelSize: 7 },
//       { name: 'Layer1', level: 2, activations: [], kernelSize: 3 },
//       { name: 'Layer2', level: 3, activations: [], kernelSize: 3 },
//       { name: 'Layer3', level: 4, activations: [], kernelSize: 3 },
//       { name: 'AvgPool', level: 5, activations: [], kernelSize: 1 },
//     ];
//     setFeatureLayers(layers);

//     // Initialize kernel positions for convolution animation
//     const kernels: Array<{ x: number; y: number; layer: number }> = [];
//     layers.forEach(layer => {
//       for (let i = 0; i < 3; i++) {
//         kernels.push({
//           x: Math.random() * 80 + 10,
//           y: Math.random() * 60 + 20,
//           layer: layer.level
//         });
//       }
//     });
//     setKernelPositions(kernels);

//     // Animate kernel movement
//     const animateKernels = () => {
//       setKernelPositions(prev => prev.map(kernel => ({
//         ...kernel,
//         x: (kernel.x + Math.sin(Date.now() / 1000 + kernel.layer) * 2 + 100) % 100,
//         y: (kernel.y + Math.cos(Date.now() / 1000 + kernel.layer) * 1.5 + 100) % 100
//       })));
//     };

//     animationRef.current = requestAnimationFrame(animateKernels);
//   };

//   // Stage 3: Neural Network Training
//   const initializeTraining = () => {
//     // Create neural network structure
//     const newNeurons: Neuron[] = [];
//     const layers = [8, 16, 32, 16, 8]; // Neurons per layer
    
//     layers.forEach((neuronCount, layerIndex) => {
//       for (let i = 0; i < neuronCount; i++) {
//         const connections = layerIndex < layers.length - 1 
//           ? Array.from({ length: layers[layerIndex + 1] }, (_, j) => j)
//           : [];
        
//         newNeurons.push({
//           id: layerIndex * 100 + i,
//           layer: layerIndex,
//           position: {
//             x: (layerIndex / (layers.length - 1)) * 80 + 10,
//             y: (i / (neuronCount - 1)) * 80 + 10
//           },
//           activation: Math.random(),
//           connections
//         });
//       }
//     });
//     setNeurons(newNeurons);

//     // Initialize data flow
//     const initialDataFlow = newNeurons
//       .filter(n => n.layer === 0)
//       .map((neuron, idx) => ({
//         id: idx,
//         path: `M ${neuron.position.x} ${neuron.position.y}`,
//         progress: 0
//       }));
//     setDataFlow(initialDataFlow);

//     // Animate data flow through network
//     const animateDataFlow = () => {
//       setDataFlow(prev => prev.map(flow => {
//         const newProgress = (flow.progress + 0.01) % 1;
        
//         // Calculate path through network layers
//         let path = `M ${10} ${50 + flow.id * 5}`;
//         for (let i = 0; i < 5; i++) {
//           const x = 10 + i * 20;
//           const y = 50 + flow.id * 5 + Math.sin(x * 0.1 + newProgress * Math.PI * 2) * 10;
//           path += ` L ${x} ${y}`;
//         }
        
//         return { ...flow, progress: newProgress, path };
//       }));

//       // Update neuron activations
//       setNeurons(prev => prev.map(neuron => ({
//         ...neuron,
//         activation: (neuron.activation + Math.sin(Date.now() / 1000 + neuron.id) * 0.1) % 1
//       })));

//       animationRef.current = requestAnimationFrame(animateDataFlow);
//     };

//     animationRef.current = requestAnimationFrame(animateDataFlow);
//   };

//   // Stage 4: Model Analysis & Saving
//   const initializeAnalysis = () => {
//     // Simulate model evaluation
//     const evaluateModel = () => {
//       setModelMetrics(prev => ({
//         accuracy: Math.min(1, prev.accuracy + 0.01),
//         loss: Math.max(0.1, prev.loss - 0.005),
//         precision: Math.min(1, prev.precision + 0.008),
//         recall: Math.min(1, prev.recall + 0.007)
//       }));
//     };

//     const interval = setInterval(evaluateModel, 200);
    
//     return () => clearInterval(interval);
//   };

//   // Render stage-specific content
//   const renderStageContent = () => {
//     switch (activeStage) {
//       case 'preprocessing':
//         return (
//           <div className="stage-content preprocessing-stage">
//             <div className="video-processing-container">
//               <div className="video-display">
//                 <div className="video-placeholder">
//                   <div className="video-scan">
//                     <div className="scan-line"></div>
//                     <div className="scan-overlay"></div>
//                   </div>
//                   <div className="video-controls">
//                     <div className="play-button">▶</div>
//                     <div className="time-indicator">00:00 / 00:30</div>
//                   </div>
//                 </div>
//                 <div className="frame-extraction-info">
//                   <h4>Frame Extraction</h4>
//                   <div className="extraction-progress">
//                     <div 
//                       className="extraction-bar" 
//                       style={{ width: `${(extractedFrames / frames.length) * 100}%` }}
//                     ></div>
//                   </div>
//                   <div className="extraction-stats">
//                     <span>Frames: {extractedFrames}/{frames.length}</span>
//                     <span>Rate: 30 FPS</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="frames-grid">
//                 <h4>Extracted Frames</h4>
//                 <div className="frames-container">
//                   {frames.map((frame, idx) => (
//                     <div 
//                       key={frame.id} 
//                       className={`frame-item ${frame.processed ? 'processed' : 'pending'}`}
//                     >
//                       <div className="frame-content">
//                         {frame.processed ? (
//                           <div className="frame-preview">
//                             <div className="frame-image"></div>
//                             <div className="frame-meta">
//                               <span className="frame-time">{frame.timestamp?.toFixed(1)}s</span>
//                               <span className="frame-status">✓</span>
//                             </div>
//                           </div>
//                         ) : (
//                           <div className="frame-loading">
//                             <div className="loading-spinner"></div>
//                             <span>Extracting...</span>
//                           </div>
//                         )}
//                       </div>
//                       {frame.processed && (
//                         <div className="processing-effects">
//                           <div className="pixel-scan"></div>
//                           <div className="color-correction"></div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="preprocessing-pipeline">
//               <div className="pipeline-step">
//                 <div className="step-icon">🎬</div>
//                 <div className="step-label">Video Input</div>
//                 <div className="step-progress active"></div>
//               </div>
//               <div className="pipeline-arrow">→</div>
//               <div className="pipeline-step">
//                 <div className="step-icon">✂️</div>
//                 <div className="step-label">Frame Extraction</div>
//                 <div className="step-progress active"></div>
//               </div>
//               <div className="pipeline-arrow">→</div>
//               <div className="pipeline-step">
//                 <div className="step-icon">🎨</div>
//                 <div className="step-label">Color Correction</div>
//                 <div className="step-progress"></div>
//               </div>
//               <div className="pipeline-arrow">→</div>
//               <div className="pipeline-step">
//                 <div className="step-icon">📐</div>
//                 <div className="step-label">Resize & Normalize</div>
//                 <div className="step-progress"></div>
//               </div>
//             </div>
//           </div>
//         );

//       case 'featureExtraction':
//         return (
//           <div className="stage-content feature-extraction-stage">
//             <div className="feature-extraction-visualization">
//               <div className="input-frame">
//                 <div className="frame-grid">
//                   {Array.from({ length: 64 }).map((_, i) => (
//                     <div key={i} className="grid-cell">
//                       <div 
//                         className="cell-content"
//                         style={{
//                           backgroundColor: `hsl(${(i * 5) % 360}, 70%, ${40 + Math.sin(i * 0.3) * 20}%)`
//                         }}
//                       ></div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="grid-label">Input Frame (8×8)</div>
//               </div>

//               <div className="extraction-flow">
//                 <div className="convolution-animation">
//                   <h4>Convolution Kernels</h4>
//                   <div className="kernels-container">
//                     {kernelPositions.map((kernel, idx) => (
//                       <div
//                         key={idx}
//                         className="kernel"
//                         style={{
//                           left: `${kernel.x}%`,
//                           top: `${kernel.y}%`,
//                           animationDelay: `${idx * 0.1}s`
//                         }}
//                       >
//                         <div className="kernel-grid">
//                           {Array.from({ length: 9 }).map((_, i) => (
//                             <div key={i} className="kernel-cell"></div>
//                           ))}
//                         </div>
//                         <div className="kernel-trail"></div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="network-layers">
//                   <h4>WideResNet50 Layers</h4>
//                   <div className="layers-container">
//                     {featureLayers.map((layer, idx) => (
//                       <div key={layer.name} className="feature-layer">
//                         <div className="layer-header">
//                           <span className="layer-name">{layer.name}</span>
//                           <span className="layer-dim">3×3×256</span>
//                         </div>
//                         <div className="layer-visualization">
//                           <div className="activation-maps">
//                             {Array.from({ length: 8 }).map((_, i) => (
//                               <div 
//                                 key={i} 
//                                 className="activation-map"
//                                 style={{
//                                   animationDelay: `${idx * 0.2 + i * 0.1}s`,
//                                   opacity: 0.5 + Math.sin(Date.now() / 1000 + i) * 0.3
//                                 }}
//                               >
//                                 <div className="map-grid">
//                                   {Array.from({ length: 4 }).map((_, j) => (
//                                     <div key={j} className="map-cell"></div>
//                                   ))}
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                         <div className="layer-connector">
//                           <div className="connector-line"></div>
//                           <div className="connector-arrow">↓</div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="feature-output">
//                 <h4>Extracted Features</h4>
//                 <div className="feature-vectors">
//                   {Array.from({ length: 10 }).map((_, i) => (
//                     <div key={i} className="feature-vector">
//                       <div className="vector-label">Feature {i + 1}</div>
//                       <div className="vector-visual">
//                         <div 
//                           className="vector-bar"
//                           style={{
//                             height: `${40 + Math.sin(Date.now() / 500 + i) * 30}%`,
//                             background: `linear-gradient(to top, #00ff88, #00ccff)`
//                           }}
//                         ></div>
//                       </div>
//                       <div className="vector-value">
//                         {(0.5 + Math.sin(Date.now() / 1000 + i) * 0.3).toFixed(2)}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       case 'training':
//         return (
//           <div className="stage-content training-stage">
//             <div className="training-visualization">
//               <div className="neural-network-3d">
//                 <h4>Multi-Layer Perceptron</h4>
//                 <div className="network-container">
//                   {/* Input Layer */}
//                   <div className="network-layer input-layer">
//                     <div className="layer-title">Input Layer</div>
//                     <div className="neurons-container">
//                       {neurons.filter(n => n.layer === 0).map(neuron => (
//                         <div
//                           key={neuron.id}
//                           className="neuron"
//                           style={{
//                             left: `${neuron.position.x}%`,
//                             top: `${neuron.position.y}%`,
//                             opacity: 0.7 + neuron.activation * 0.3,
//                             transform: `scale(${0.8 + neuron.activation * 0.4})`
//                           }}
//                         >
//                           <div className="neuron-core"></div>
//                           <div 
//                             className="neuron-glow"
//                             style={{
//                               boxShadow: `0 0 ${10 + neuron.activation * 20}px rgba(0, 200, 255, ${0.3 + neuron.activation * 0.3})`
//                             }}
//                           ></div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Hidden Layers */}
//                   {[1, 2, 3].map(layerIdx => (
//                     <div key={layerIdx} className="network-layer hidden-layer">
//                       <div className="layer-title">Hidden Layer {layerIdx}</div>
//                       <div className="neurons-container">
//                         {neurons.filter(n => n.layer === layerIdx).map(neuron => (
//                           <div
//                             key={neuron.id}
//                             className="neuron"
//                             style={{
//                               left: `${neuron.position.x}%`,
//                               top: `${neuron.position.y}%`,
//                               opacity: 0.7 + neuron.activation * 0.3,
//                               transform: `scale(${0.8 + neuron.activation * 0.4})`
//                             }}
//                           >
//                             <div className="neuron-core"></div>
//                             <div 
//                               className="neuron-glow"
//                               style={{
//                                 boxShadow: `0 0 ${10 + neuron.activation * 20}px rgba(100, 255, 200, ${0.3 + neuron.activation * 0.3})`
//                               }}
//                             ></div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ))}

//                   {/* Output Layer */}
//                   <div className="network-layer output-layer">
//                     <div className="layer-title">Output Layer</div>
//                     <div className="neurons-container">
//                       {neurons.filter(n => n.layer === 4).map(neuron => (
//                         <div
//                           key={neuron.id}
//                           className="neuron"
//                           style={{
//                             left: `${neuron.position.x}%`,
//                             top: `${neuron.position.y}%`,
//                             opacity: 0.7 + neuron.activation * 0.3,
//                             transform: `scale(${0.8 + neuron.activation * 0.4})`
//                           }}
//                         >
//                           <div className="neuron-core"></div>
//                           <div 
//                             className="neuron-glow"
//                             style={{
//                               boxShadow: `0 0 ${10 + neuron.activation * 20}px rgba(255, 100, 200, ${0.3 + neuron.activation * 0.3})`
//                             }}
//                           ></div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Data Flow Visualization */}
//                 <svg className="data-flow-svg" width="100%" height="100%">
//                   {dataFlow.map((flow, idx) => (
//                     <path
//                       key={flow.id}
//                       d={flow.path}
//                       className="data-path"
//                       stroke="url(#gradient)"
//                       strokeWidth="2"
//                       fill="none"
//                       strokeDasharray="5,5"
//                     >
//                       <animate
//                         attributeName="stroke-dashoffset"
//                         from="100"
//                         to="0"
//                         dur="2s"
//                         repeatCount="indefinite"
//                       />
//                     </path>
//                   ))}
//                   <defs>
//                     <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                       <stop offset="0%" stopColor="#00ff88" />
//                       <stop offset="50%" stopColor="#00ccff" />
//                       <stop offset="100%" stopColor="#ff00ff" />
//                     </linearGradient>
//                   </defs>
//                 </svg>

//                 {/* Backpropagation Arrows */}
//                 <div className="backpropagation">
//                   {Array.from({ length: 5 }).map((_, i) => (
//                     <div
//                       key={i}
//                       className="backprop-arrow"
//                       style={{
//                         left: `${15 + i * 15}%`,
//                         animationDelay: `${i * 0.2}s`
//                       }}
//                     >
//                       ↶
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="training-metrics">
//                 <div className="metric-charts">
//                   <div className="metric-chart loss-chart">
//                     <h5>Loss Function</h5>
//                     <div className="chart-container">
//                       <div className="chart-line"></div>
//                       <div className="chart-points">
//                         {Array.from({ length: 20 }).map((_, i) => (
//                           <div
//                             key={i}
//                             className="chart-point"
//                             style={{
//                               left: `${i * 5}%`,
//                               bottom: `${10 + Math.sin(i * 0.5 + Date.now() / 2000) * 30}%`
//                             }}
//                           ></div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="metric-chart accuracy-chart">
//                     <h5>Accuracy</h5>
//                     <div className="chart-container">
//                       <div className="progress-ring">
//                         <svg width="100" height="100">
//                           <circle
//                             className="progress-ring-circle"
//                             stroke="#00ff88"
//                             strokeWidth="6"
//                             strokeLinecap="round"
//                             fill="transparent"
//                             r="40"
//                             cx="50"
//                             cy="50"
//                             style={{
//                               strokeDasharray: `${progress * 251.2} 251.2`
//                             }}
//                           />
//                         </svg>
//                         <div className="progress-text">{progress.toFixed(1)}%</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="training-stats">
//                   <div className="stat-item">
//                     <span className="stat-label">Epoch</span>
//                     <span className="stat-value">42</span>
//                   </div>
//                   <div className="stat-item">
//                     <span className="stat-label">Batch Size</span>
//                     <span className="stat-value">32</span>
//                   </div>
//                   <div className="stat-item">
//                     <span className="stat-label">Learning Rate</span>
//                     <span className="stat-value">0.001</span>
//                   </div>
//                   <div className="stat-item">
//                     <span className="stat-label">Optimizer</span>
//                     <span className="stat-value">Adam</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       case 'analysis':
//         return (
//           <div className="stage-content analysis-stage">
//             <div className="model-analysis-container">
//               <div className="model-evaluation">
//                 <h4>Model Performance</h4>
//                 <div className="evaluation-metrics">
//                   <div className="metric-display">
//                     <div className="metric-title">Accuracy</div>
//                     <div className="metric-value">{modelMetrics.accuracy.toFixed(3)}</div>
//                     <div className="metric-bar">
//                       <div 
//                         className="bar-fill"
//                         style={{ width: `${modelMetrics.accuracy * 100}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                   <div className="metric-display">
//                     <div className="metric-title">Loss</div>
//                     <div className="metric-value">{modelMetrics.loss.toFixed(3)}</div>
//                     <div className="metric-bar">
//                       <div 
//                         className="bar-fill loss"
//                         style={{ width: `${(1 - modelMetrics.loss) * 100}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                   <div className="metric-display">
//                     <div className="metric-title">Precision</div>
//                     <div className="metric-value">{modelMetrics.precision.toFixed(3)}</div>
//                     <div className="metric-bar">
//                       <div 
//                         className="bar-fill"
//                         style={{ width: `${modelMetrics.precision * 100}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                   <div className="metric-display">
//                     <div className="metric-title">Recall</div>
//                     <div className="metric-value">{modelMetrics.recall.toFixed(3)}</div>
//                     <div className="metric-bar">
//                       <div 
//                         className="bar-fill"
//                         style={{ width: `${modelMetrics.recall * 100}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="confusion-matrix">
//                   <h5>Confusion Matrix</h5>
//                   <div className="matrix-grid">
//                     {Array.from({ length: 16 }).map((_, i) => (
//                       <div key={i} className="matrix-cell">
//                         <div 
//                           className="cell-value"
//                           style={{
//                             backgroundColor: `rgba(0, 255, 136, ${0.1 + Math.sin(i * 0.5 + Date.now() / 1000) * 0.2})`
//                           }}
//                         >
//                           {Math.floor(Math.random() * 100)}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="model-saving">
//                 <h4>Model Serialization</h4>
//                 <div className="saving-animation">
//                   <div className="model-file">
//                     <div className="file-icon">📁</div>
//                     <div className="file-name">model_checkpoint_v2.1.4</div>
//                     <div className="file-format">.pth</div>
//                   </div>
                  
//                   <div className="saving-progress">
//                     <div className="progress-visual">
//                       <div className="data-stream">
//                         {Array.from({ length: 20 }).map((_, i) => (
//                           <div
//                             key={i}
//                             className="data-byte"
//                             style={{
//                               animationDelay: `${i * 0.1}s`,
//                               left: `${i * 5}%`
//                             }}
//                           >
//                             <div className="byte-bit"></div>
//                           </div>
//                         ))}
//                       </div>
//                       <div className="progress-bar">
//                         <div 
//                           className="progress-fill"
//                           style={{ width: `${progress}%` }}
//                         >
//                           <div className="progress-glow"></div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="progress-text">
//                       Saving model weights... {progress.toFixed(0)}%
//                     </div>
//                   </div>

//                   <div className="model-info">
//                     <div className="info-item">
//                       <span className="info-label">Model Size:</span>
//                       <span className="info-value">124.5 MB</span>
//                     </div>
//                     <div className="info-item">
//                       <span className="info-label">Parameters:</span>
//                       <span className="info-value">25.3M</span>
//                     </div>
//                     <div className="info-item">
//                       <span className="info-label">Framework:</span>
//                       <span className="info-value">PyTorch 1.9.0</span>
//                     </div>
//                     <div className="info-item">
//                       <span className="info-label">Saved At:</span>
//                       <span className="info-value">{new Date().toLocaleTimeString()}</span>
//                     </div>
//                   </div>

//                   <div className="save-complete">
//                     <div className="checkmark">✓</div>
//                     <div className="complete-text">Model Saved Successfully</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="model-deployment">
//               <h4>Deployment Ready</h4>
//               <div className="deployment-options">
//                 <div className="option">
//                   <div className="option-icon">☁️</div>
//                   <div className="option-label">Cloud API</div>
//                 </div>
//                 <div className="option">
//                   <div className="option-icon">📱</div>
//                   <div className="option-label">Mobile</div>
//                 </div>
//                 <div className="option">
//                   <div className="option-icon">🖥️</div>
//                   <div className="option-label">Edge Device</div>
//                 </div>
//                 <div className="option">
//                   <div className="option-icon">🌐</div>
//                   <div className="option-label">Web Service</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="ml-workflow-visualizer" ref={containerRef}>
//       <div className="workflow-header">
//         <h2>Deep Learning Pipeline</h2>
//         <div className="workflow-status">
//           <div className={`status-indicator ${activeStage}`}></div>
//           <span className="status-text">
//             {activeStage === 'preprocessing' && 'Processing Video Data'}
//             {activeStage === 'featureExtraction' && 'Extracting Features'}
//             {activeStage === 'training' && 'Training Neural Network'}
//             {activeStage === 'analysis' && 'Analyzing & Saving Model'}
//           </span>
//         </div>
//       </div>

//       <div className="stage-navigation">
//         {[
//           { id: 'preprocessing', label: 'Preprocessing', icon: '🎬' },
//           { id: 'featureExtraction', label: 'Feature Extraction', icon: '🔍' },
//           { id: 'training', label: 'Neural Network', icon: '🧠' },
//           { id: 'analysis', label: 'Model Analysis', icon: '📊' }
//         ].map((item, index) => (
//           <React.Fragment key={item.id}>
//             <div 
//               className={`nav-item ${activeStage === item.id ? 'active' : ''}`}
//               onClick={() => setActiveStage(item.id as any)}
//             >
//               <div className="nav-icon">{item.icon}</div>
//               <div className="nav-label">{item.label}</div>
//               <div className="nav-glow"></div>
//             </div>
//             {index < 3 && (
//               <div className="nav-connector">
//                 <div className="connector-line"></div>
//                 <div className="connector-arrow">→</div>
//               </div>
//             )}
//           </React.Fragment>
//         ))}
//       </div>

//       <div className="visualization-area">
//         {renderStageContent()}
//       </div>

//       <div className="workflow-footer">
//         <div className="system-info">
//           <div className="info-tag">
//             <span className="tag-label">GPU</span>
//             <span className="tag-value">NVIDIA RTX 3090</span>
//           </div>
//           <div className="info-tag">
//             <span className="tag-label">Memory</span>
//             <span className="tag-value">24GB VRAM</span>
//           </div>
//           <div className="info-tag">
//             <span className="tag-label">Framework</span>
//             <span className="tag-value">PyTorch 1.9</span>
//           </div>
//         </div>
//         <div className="live-indicator">
//           <div className="live-dot"></div>
//           <span>LIVE</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MLWorkflowVisualizer;




import React from 'react'

const MLWorkflowVisualizer = () => {
  return (
    <div>
      
    </div>
  )
}

export default MLWorkflowVisualizer

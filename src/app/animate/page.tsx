'use client';
import React, { useState, useEffect } from 'react';
import MLWorkflowVisualizer from '@/components/Training_animation';


const App: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<'preprocessing' | 'featureExtraction' | 'training' | 'analysis'>('preprocessing');
  const [progress, setProgress] = useState(0);

  // Simulate workflow progression
  useEffect(() => {
    const stages: Array<'preprocessing' | 'featureExtraction' | 'training' | 'analysis'> = [
      'preprocessing',
      'featureExtraction',
      'training',
      'analysis'
    ];
    
    let currentIndex = stages.indexOf(currentStage);
    let interval: NodeJS.Timeout;

    if (currentStage === 'training') {
      // Simulate training progress
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 100);
    } else {
      setProgress(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentStage]);

  const handleStageComplete = (stage: string) => {
    console.log(`Stage completed: ${stage}`);
    
    // Move to next stage
    const stages: Array<'preprocessing' | 'featureExtraction' | 'training' | 'analysis'> = [
      'preprocessing',
      'featureExtraction',
      'training',
      'analysis'
    ];
    
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex < stages.length - 1) {
      setTimeout(() => {
        setCurrentStage(stages[currentIndex + 1]);
      }, 2000);
    }
  };

  return (
    <div style={{
      padding: '20px',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <MLWorkflowVisualizer
        // stage={currentStage}
        // videoFile="sample_video.mp4"
        // progress={progress}
        // onStageComplete={handleStageComplete}
      />
      
      <div style={{
        marginTop: '30px',
        display: 'flex',
        gap: '15px'
      }}>
        <button
          onClick={() => setCurrentStage('preprocessing')}
          style={{
            background: currentStage === 'preprocessing' 
              ? 'linear-gradient(90deg, #00ff88, #00ccff)' 
              : 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          Preprocessing
        </button>
        <button
          onClick={() => setCurrentStage('featureExtraction')}
          style={{
            background: currentStage === 'featureExtraction' 
              ? 'linear-gradient(90deg, #00ccff, #ff00ff)' 
              : 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          Feature Extraction
        </button>
        <button
          onClick={() => setCurrentStage('training')}
          style={{
            background: currentStage === 'training' 
              ? 'linear-gradient(90deg, #ff00ff, #ffaa00)' 
              : 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          Training
        </button>
        <button
          onClick={() => setCurrentStage('analysis')}
          style={{
            background: currentStage === 'analysis' 
              ? 'linear-gradient(90deg, #ffaa00, #00ff88)' 
              : 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          Analysis
        </button>
      </div>
    </div>
  );
};

export default App;
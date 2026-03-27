// TrainingTab.jsx
import { useState, useEffect, useRef } from 'react';
import { Brain, Play, Pause, StopCircle, RefreshCw, Download, BarChart3, Clock, AlertCircle } from 'lucide-react';

const TrainingTab = ({ sessionName, rois, backendConnected }) => {
  const [trainingStatus, setTrainingStatus] = useState(null);
  const [trainingLogs, setTrainingLogs] = useState([]);
  const [isTraining, setIsTraining] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef(null);
  const logsEndRef = useRef(null);
  const BACKEND_URL = process.env.BACKEND_URL;
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [trainingLogs]);

  const startTraining = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/training/start/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionName,
          rois: rois.map(roi => ({
            id: roi.id,
            type: roi.type,
            points: roi.points,
            label: roi.label,
            color: roi.color
          })),
          frame_rate: 30,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setTrainingStatus({
          training_id: result.training_id,
          status: 'queued',
          progress: 0,
          message: 'Training queued'
        });
        setIsTraining(true);
        connectWebSocket(result.training_id);
      } else {
        alert('Failed to start training');
      }
    } catch (error) {
      console.error('Error starting training:', error);
      alert('Error connecting to training server');
    }
  };

  const stopTraining = async () => {
    if (trainingStatus?.training_id) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/training/${trainingStatus.training_id}/stop`, {
          method: 'POST',
        });
        if (response.ok) {
          setIsTraining(false);
          if (wsRef.current) {
            wsRef.current.close();
          }
        }
      } catch (error) {
        console.error('Error stopping training:', error);
      }
    }
  };

  const connectWebSocket = (trainingId) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(`wss://careful-purchased-represent-requires.trycloudflare.com/api/training/ws/${trainingId}`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'log') {
        setTrainingLogs(prev => [...prev, data.message]);
      } else if (data.type === 'initial_status' || data.type === 'status_update') {
        setTrainingStatus(prev => ({
          ...prev,
          ...data.data || data
        }));
        
        if (data.status === 'completed' || data.status === 'failed') {
          setIsTraining(false);
        }
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setWsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWsConnected(false);
    };

    wsRef.current = ws;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'queued': return 'text-yellow-500';
      case 'processing': return 'text-blue-500';
      case 'completed': return 'text-green-500';
      case 'failed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBgColor = (status) => {
    switch(status) {
      case 'queued': return 'bg-yellow-500/20';
      case 'processing': return 'bg-blue-500/20';
      case 'completed': return 'bg-green-500/20';
      case 'failed': return 'bg-red-500/20';
      default: return 'bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Training Status Card */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold flex items-center">
            <Brain className="w-4 h-4 mr-2 text-blue-400" />
            Training Status
          </h3>
          <div className="flex items-center space-x-2">
            <div className={`px-2 py-1 rounded text-xs ${wsConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {wsConnected ? 'Live Updates' : 'Disconnected'}
            </div>
          </div>
        </div>

        {trainingStatus ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-400">Status</div>
                <div className={`text-sm font-medium ${getStatusColor(trainingStatus.status)}`}>
                  {trainingStatus.status?.toUpperCase()}
                </div>
              </div>
              
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-400">Progress</div>
                <div className="text-sm font-medium">
                  {Math.round(trainingStatus.progress || 0)}%
                </div>
              </div>
              
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-400">Training ID</div>
                <div className="text-sm font-medium truncate" title={trainingStatus.training_id}>
                  {trainingStatus.training_id?.substring(0, 8)}...
                </div>
              </div>
            </div>

            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300"
                style={{ width: `${trainingStatus.progress || 0}%` }}
              />
            </div>

            <div className="text-sm text-gray-300">
              {trainingStatus.message || 'No message'}
            </div>

            <div className="flex space-x-2">
              {!isTraining && trainingStatus.status === 'completed' && (
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium">
                  <Download className="w-4 h-4 inline mr-2" />
                  Download Model
                </button>
              )}
              
              {isTraining && (
                <button 
                  onClick={stopTraining}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium"
                >
                  <StopCircle className="w-4 h-4 inline mr-2" />
                  Stop Training
                </button>
              )}
              
              {(!isTraining && !trainingStatus) && (
                <button 
                  onClick={startTraining}
                  disabled={rois.length === 0 || !backendConnected}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    rois.length === 0 || !backendConnected
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600'
                  }`}
                >
                  <Play className="w-4 h-4 inline mr-2" />
                  Start Training
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <div className="text-gray-500 mb-4">No training in progress</div>
            <button 
              onClick={startTraining}
              disabled={rois.length === 0 || !backendConnected}
              className={`px-6 py-3 rounded-lg text-sm font-medium ${
                rois.length === 0 || !backendConnected
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600'
              }`}
            >
              <Play className="w-4 h-4 inline mr-2" />
              Start New Training
            </button>
            <div className="text-xs text-gray-600 mt-2">
              {rois.length} ROI{rois.length !== 1 ? 's' : ''} ready for training
            </div>
          </div>
        )}
      </div>

      {/* Training Logs */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold flex items-center">
            <BarChart3 className="w-4 h-4 mr-2 text-green-400" />
            Training Logs
          </h3>
          <div className="text-xs text-gray-500">
            {trainingLogs.length} log entries
          </div>
        </div>

        <div className="bg-black rounded-lg p-4 h-64 overflow-y-auto font-mono text-xs">
          {trainingLogs.length === 0 ? (
            <div className="text-gray-600 italic h-full flex items-center justify-center">
              Training logs will appear here...
            </div>
          ) : (
            <div className="space-y-1">
              {trainingLogs.map((log, index) => {
                let className = "text-gray-300";
                if (log.includes("[ERROR]")) className = "text-red-400";
                if (log.includes("[SUCCESS]")) className = "text-green-400";
                if (log.includes("[PROGRESS]")) className = "text-blue-400";
                if (log.includes("[INFO]")) className = "text-cyan-400";
                if (log.includes("[WARNING]")) className = "text-yellow-400";
                
                return (
                  <div key={index} className={className}>
                    <span className="text-gray-500 mr-2">[{index.toString().padStart(4, '0')}]</span>
                    {log}
                  </div>
                );
              })}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="text-xs text-gray-500">
            Logs update in real-time
          </div>
          <button 
            onClick={() => setTrainingLogs([])}
            className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded"
          >
            Clear Logs
          </button>
        </div>
      </div>

      {/* Training Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="text-sm font-bold mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-yellow-400" />
            Training Session
          </div>
          <div className="space-y-2">
            <div>
              <div className="text-xs text-gray-400">Session ID</div>
              <div className="text-sm truncate">{sessionName}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">ROIs to Train</div>
              <div className="text-sm">{rois.length}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Backend Status</div>
              <div className={`text-sm ${backendConnected ? 'text-green-400' : 'text-red-400'}`}>
                {backendConnected ? 'Connected' : 'Disconnected'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="text-sm font-bold mb-3 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 text-cyan-400" />
            Training Notes
          </div>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Training uses collected frames from each ROI</li>
            <li>• Model is trained to recognize each ROI pattern</li>
            <li>• Progress updates in real-time via WebSocket</li>
            <li>• Logs show detailed training process</li>
            <li>• Model saved after successful completion</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrainingTab;
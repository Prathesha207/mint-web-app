export interface Point {
  x: number;
  y: number;
}

export interface ROI {
  id: string;
  type: 'rectangle' | 'polygon';
  points: Point[];
  label: string;
  color: string;
}

export interface CameraDevice {
  mxid: string;
  name: string;
  state: string;
}

export interface RemoteCameraSession {
  sessionId: string;
  connected: boolean;
  lastFrameTime: number;
  frameCount: number;
  deviceInfo?: string;
}

export type InputSource = 'upload' | 'camera' | 'oak' | 'remote';
export type PlaybackMode = 'video' | 'frames' | 'backend';
export type TrainingStatus = 'idle' | 'running' | 'completed' | 'failed';
export type ExtractionStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';
export type DrawingMode = 'rectangle' | 'polygon' | 'select';
export type OakCameraState = 'idle' | 'streaming' | 'error';
export type RemoteCameraStatus = 'disconnected' | 'connecting' | 'connected';
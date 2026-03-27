export interface Point {
  x: number;
  y: number;
}

export type TrainingType = 'anomaly' | 'sequential' | 'motion';

export interface ROI {
  training: TrainingType[];
  id: string;
  type: 'rectangle' | 'polygon';
  points: Point[];
  label: string;
  color: string;
}

export type PanelType = 'terminal' | 'instructions' | 'original' | null;

export type ToolbarDropdownId =
  | 'inputSource'
  | 'inferenceModel'
  | 'inferenceControls'
  | 'inferenceAdvanced'
  | 'inferenceStats';

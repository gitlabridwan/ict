export type RegionId = 'lab' | 'algorithm' | 'network' | 'security';

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
}

export interface Question {
  id: string;
  regionId: RegionId;
  stage: 'pre' | 'practice' | 'post';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  goal: string;
}

export interface HardwareItem {
  id: string;
  name: string;
  category: 'input' | 'processing' | 'output' | 'storage';
  description: string;
  detail: string;
  color: string;
  iconName: string;
}

export type BlockType = 'forward' | 'turn_left' | 'turn_right' | 'repeat' | 'if_obstacle';

export interface CodeBlock {
  id: string;
  type: BlockType;
  label: string;
  count?: number; // for repeat
  actionIfTrue?: BlockType; // for if_obstacle
  actionIfFalse?: BlockType;
}

export interface NetworkNode {
  id: string;
  name: string;
  type: 'pc' | 'switch' | 'router' | 'internet';
  label: string;
  description: string;
  x: number;
  y: number;
  z: number;
}

export interface NetworkConnection {
  fromId: string;
  toId: string;
}

export interface SecurityScenario {
  id: string;
  title: string;
  source: string;
  messageText: string;
  context: string;
  actions: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  reasons: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  redFlags: string[];
  recommendation: string;
}

export interface StudentProgress {
  studentName: string;
  hasSeenTutorial: boolean;
  preTestCompleted: boolean;
  preTestScore: number;
  preTestAnswers: Record<string, number>;
  postTestCompleted: boolean;
  postTestScore: number;
  postTestAnswers: Record<string, number>;
  completedRegions: Record<RegionId, boolean>;
  regionXP: Record<RegionId, number>;
  totalXP: number;
  practiceAnswers: Record<string, { attempts: number; isCorrect: boolean }>;
  algorithmBadges: Record<string, boolean>; // e.g. 'eff_challenge_1'
  firstAttemptScorePre: number | null;
  firstAttemptScorePost: number | null;
  historyScores: Array<{
    date: string;
    stage: 'pre' | 'post';
    score: number;
  }>;
}

export interface AppSettings {
  soundEnabled: boolean;
  graphicsQuality: 'high' | 'medium' | 'low';
  reduceMotion: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  use2DFallback: boolean;
}

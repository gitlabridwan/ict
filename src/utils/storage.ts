import { AppSettings, StudentProgress } from '../types/game';

const PROGRESS_STORAGE_KEY = 'jelajah_kota_digital_progress_v1';
const SETTINGS_STORAGE_KEY = 'jelajah_kota_digital_settings_v1';

export const DEFAULT_PROGRESS: StudentProgress = {
  studentName: '',
  hasSeenTutorial: false,
  preTestCompleted: false,
  preTestScore: 0,
  preTestAnswers: {},
  postTestCompleted: false,
  postTestScore: 0,
  postTestAnswers: {},
  completedRegions: {
    lab: false,
    algorithm: false,
    network: false,
    security: false
  },
  regionXP: {
    lab: 0,
    algorithm: 0,
    network: 0,
    security: 0
  },
  totalXP: 0,
  practiceAnswers: {},
  algorithmBadges: {},
  firstAttemptScorePre: null,
  firstAttemptScorePost: null,
  historyScores: []
};

export const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  graphicsQuality: 'high',
  reduceMotion: false,
  fontSize: 'normal',
  use2DFallback: false
};

export function loadStoredProgress(): StudentProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      completedRegions: {
        ...DEFAULT_PROGRESS.completedRegions,
        ...(parsed.completedRegions || {})
      },
      regionXP: {
        ...DEFAULT_PROGRESS.regionXP,
        ...(parsed.regionXP || {})
      }
    };
  } catch (e) {
    console.warn('Gagal memuat progres dari localStorage:', e);
    return DEFAULT_PROGRESS;
  }
}

export function saveStoredProgress(progress: StudentProgress) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Gagal menyimpan progres ke localStorage:', e);
  }
}

export function resetStoredProgress(): StudentProgress {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(PROGRESS_STORAGE_KEY);
    } catch (e) {
      console.warn('Gagal mereset progres:', e);
    }
  }
  return { ...DEFAULT_PROGRESS };
}

export function loadStoredSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(raw)
    };
  } catch (e) {
    console.warn('Gagal memuat pengaturan:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: AppSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Gagal menyimpan pengaturan:', e);
  }
}

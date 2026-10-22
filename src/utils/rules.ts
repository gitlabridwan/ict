import { CodeBlock, HardwareItem, NetworkConnection, RegionId } from '../types/game';
import { HARDWARE_ITEMS } from '../data/materials';
import { QUESTIONS } from '../data/questions';

export interface AlgorithmGridPosition {
  x: number;
  y: number;
  dir: 'N' | 'E' | 'S' | 'W'; // N = -y, S = +y, E = +x, W = -x
}

export interface AlgorithmMapConfig {
  width: number;
  height: number;
  startPos: AlgorithmGridPosition;
  targetPos: { x: number; y: number };
  obstacles: Array<{ x: number; y: number }>;
  parBlocks: number; // for efficiency badge
}

export interface SimulationStep {
  stepIndex: number;
  blockId: string;
  pos: AlgorithmGridPosition;
  actionDesc: string;
  hitObstacle?: boolean;
  hitBoundary?: boolean;
  reachedTarget?: boolean;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  finalPos: AlgorithmGridPosition;
  errorMessage?: string;
  isEfficient: boolean;
  totalCommandsExecuted: number;
}

/**
 * Hitung nilai tes dengan rumus: (jumlah jawaban benar / jumlah soal) * 100
 */
export function calculateTestScore(correctCount: number, totalQuestions: number): number {
  if (totalQuestions <= 0) return 0;
  const score = (correctCount / totalQuestions) * 100;
  return Math.round(score);
}

/**
 * Hitung skor tes berdasarkan daftar jawaban siswa dan ID soal
 */
export function evaluateTestAnswers(questionIds: string[], answers: Record<string, number>): {
  score: number;
  correctCount: number;
  totalQuestions: number;
  breakdown: Record<string, { isCorrect: boolean; selected: number; correct: number }>;
} {
  let correctCount = 0;
  const breakdown: Record<string, { isCorrect: boolean; selected: number; correct: number }> = {};

  const questionMap = new Map(QUESTIONS.map(q => [q.id, q]));

  for (const qId of questionIds) {
    const q = questionMap.get(qId);
    if (!q) continue;

    const studentAnswer = answers[qId] ?? -1;
    const isCorrect = studentAnswer === q.correctIndex;
    if (isCorrect) correctCount++;

    breakdown[qId] = {
      isCorrect,
      selected: studentAnswer,
      correct: q.correctIndex
    };
  }

  const score = calculateTestScore(correctCount, questionIds.length);
  return {
    score,
    correctCount,
    totalQuestions: questionIds.length,
    breakdown
  };
}

/**
 * Menghitung perolehan XP:
 * XP hanya diberikan pada saat penyelesaian pertama kali (first clear).
 * Nilai XP per wilayah: 250 XP (Total 4 wilayah = 1000 XP).
 */
export function calculateXPAward(currentCompleted: boolean, baseReward = 250): number {
  if (currentCompleted) {
    return 0; // Tidak menggandakan XP jika sudah pernah diselesaikan
  }
  return baseReward;
}

/**
 * Evaluasi pengelompokan perangkat keras di Wilayah 1 (Laboratorium)
 */
export function evaluateHardwareClassification(placements: Record<string, string>): {
  isComplete: boolean;
  correctCount: number;
  totalItems: number;
  incorrectItems: Array<{ id: string; name: string; placedCategory: string; correctCategory: string; explanation: string }>;
} {
  const hardwareMap = new Map(HARDWARE_ITEMS.map(h => [h.id, h]));
  let correctCount = 0;
  const incorrectItems: Array<{ id: string; name: string; placedCategory: string; correctCategory: string; explanation: string }> = [];

  const totalItems = HARDWARE_ITEMS.length;

  for (const item of HARDWARE_ITEMS) {
    const placedCategory = placements[item.id];
    if (!placedCategory) continue;

    if (placedCategory === item.category) {
      correctCount++;
    } else {
      let explanation = '';
      if (item.id === 'ram') {
        explanation = 'RAM adalah memori kerja sementara (volatile) yang menampung data aktif saat sistem beroperasi, bukan pemroses atau output.';
      } else if (item.id === 'ssd') {
        explanation = 'SSD adalah media penyimpanan permanen (non-volatile) tempat file dan sistem operasi tersimpan secara persisten.';
      } else if (item.id === 'cpu') {
        explanation = 'CPU adalah unit pemrosesan utama yang menjalankan instruksi, bukan penyimpan data ataupun perangkat masukan.';
      } else {
        explanation = `${item.name} berfungsi sebagai perangkat ${item.category}.`;
      }

      incorrectItems.push({
        id: item.id,
        name: item.name,
        placedCategory,
        correctCategory: item.category,
        explanation
      });
    }
  }

  const isComplete = correctCount === totalItems;
  return {
    isComplete,
    correctCount,
    totalItems,
    incorrectItems
  };
}

/**
 * Simulasi jalannya algoritma robot pada petak grid (Wilayah 2)
 */
export function simulateAlgorithmRun(
  commands: CodeBlock[],
  mapConfig: AlgorithmMapConfig
): SimulationResult {
  const directions: Array<'N' | 'E' | 'S' | 'W'> = ['N', 'E', 'S', 'W'];
  let currentPos: AlgorithmGridPosition = { ...mapConfig.startPos };
  const steps: SimulationStep[] = [];
  let success = false;
  let errorMessage: string | undefined = undefined;

  const isObstacle = (x: number, y: number) => {
    return mapConfig.obstacles.some(obs => obs.x === x && obs.y === y);
  };

  const getFrontPos = (pos: AlgorithmGridPosition): { x: number; y: number } => {
    let nx = pos.x;
    let ny = pos.y;
    if (pos.dir === 'N') ny -= 1;
    if (pos.dir === 'S') ny += 1;
    if (pos.dir === 'E') nx += 1;
    if (pos.dir === 'W') nx -= 1;
    return { x: nx, y: ny };
  };

  // Flat sequence expander for nested loops / conditionals
  interface ExecutableUnit {
    blockId: string;
    type: 'forward' | 'turn_left' | 'turn_right' | 'if_obstacle';
    actionIfTrue?: 'forward' | 'turn_left' | 'turn_right';
    actionIfFalse?: 'forward' | 'turn_left' | 'turn_right';
  }

  const flatUnits: ExecutableUnit[] = [];

  for (const cmd of commands) {
    if (cmd.type === 'repeat') {
      const times = Math.min(Math.max(cmd.count || 1, 1), 10);
      // default repeat forward or child
      for (let i = 0; i < times; i++) {
        flatUnits.push({ blockId: cmd.id, type: 'forward' });
      }
    } else if (cmd.type === 'if_obstacle') {
      flatUnits.push({
        blockId: cmd.id,
        type: 'if_obstacle',
        actionIfTrue: (cmd.actionIfTrue as 'forward' | 'turn_left' | 'turn_right') || 'turn_right',
        actionIfFalse: (cmd.actionIfFalse as 'forward' | 'turn_left' | 'turn_right') || 'forward'
      });
    } else {
      flatUnits.push({ blockId: cmd.id, type: cmd.type });
    }
  }

  let totalExecuted = 0;
  const maxSafeSteps = 60;

  for (let idx = 0; idx < flatUnits.length && totalExecuted < maxSafeSteps; idx++) {
    const unit = flatUnits[idx];
    totalExecuted++;

    let actionToExecute: 'forward' | 'turn_left' | 'turn_right' = 'forward';

    if (unit.type === 'if_obstacle') {
      const front = getFrontPos(currentPos);
      const obstacleAhead = isObstacle(front.x, front.y) ||
        front.x < 0 || front.x >= mapConfig.width ||
        front.y < 0 || front.y >= mapConfig.height;

      actionToExecute = (obstacleAhead ? unit.actionIfTrue : unit.actionIfFalse) || 'forward';
    } else {
      actionToExecute = unit.type;
    }

    if (actionToExecute === 'turn_left') {
      const curDirIdx = directions.indexOf(currentPos.dir);
      const newDir = directions[(curDirIdx + 3) % 4];
      currentPos = { ...currentPos, dir: newDir };
      steps.push({
        stepIndex: totalExecuted,
        blockId: unit.blockId,
        pos: { ...currentPos },
        actionDesc: 'Robot berbelok ke kiri 90°'
      });
    } else if (actionToExecute === 'turn_right') {
      const curDirIdx = directions.indexOf(currentPos.dir);
      const newDir = directions[(curDirIdx + 1) % 4];
      currentPos = { ...currentPos, dir: newDir };
      steps.push({
        stepIndex: totalExecuted,
        blockId: unit.blockId,
        pos: { ...currentPos },
        actionDesc: 'Robot berbelok ke kanan 90°'
      });
    } else if (actionToExecute === 'forward') {
      const front = getFrontPos(currentPos);

      // Check boundary
      if (front.x < 0 || front.x >= mapConfig.width || front.y < 0 || front.y >= mapConfig.height) {
        steps.push({
          stepIndex: totalExecuted,
          blockId: unit.blockId,
          pos: { ...currentPos },
          actionDesc: 'Robot terhenti: mencapai batas luar taman!',
          hitBoundary: true
        });
        errorMessage = `Langkah ke-${totalExecuted}: Robot mencapai batas luar taman. Periksa urutan langkah belok sebelum maju!`;
        break;
      }

      // Check obstacle
      if (isObstacle(front.x, front.y)) {
        steps.push({
          stepIndex: totalExecuted,
          blockId: unit.blockId,
          pos: { ...currentPos },
          actionDesc: 'Robot menabrak batu rintangan!',
          hitObstacle: true
        });
        errorMessage = `Langkah ke-${totalExecuted}: Robot menabrak rintangan pada petak (${front.x + 1}, ${front.y + 1}). Tambahkan perintah belok atau percabangan sebelum maju!`;
        break;
      }

      currentPos = { ...currentPos, x: front.x, y: front.y };
      const reachedTarget = currentPos.x === mapConfig.targetPos.x && currentPos.y === mapConfig.targetPos.y;

      steps.push({
        stepIndex: totalExecuted,
        blockId: unit.blockId,
        pos: { ...currentPos },
        actionDesc: `Robot maju ke petak (${currentPos.x + 1}, ${currentPos.y + 1})`,
        reachedTarget
      });

      if (reachedTarget) {
        success = true;
        break;
      }
    }
  }

  if (!success && !errorMessage) {
    errorMessage = 'Robot belum mencapai sel baterai target. Periksa kembali apakah jumlah langkah sudah cukup!';
  }

  const isEfficient = success && commands.length <= mapConfig.parBlocks;

  return {
    success,
    steps,
    finalPos: currentPos,
    errorMessage,
    isEfficient,
    totalCommandsExecuted: totalExecuted
  };
}

/**
 * Evaluasi topologi jaringan di Wilayah 3 (Pusat Jaringan)
 */
export function evaluateNetworkTopology(connections: NetworkConnection[]): {
  isLanConnected: boolean;
  isWanConnected: boolean;
  hasPcAConnected: boolean;
  hasPcBConnected: boolean;
  hasPcCConnected: boolean;
  hasSwitchToRouter: boolean;
  hasRouterToInternet: boolean;
  canSendLocalData: boolean;
  canSendInternetData: boolean;
} {
  const isConnected = (a: string, b: string) => {
    return connections.some(
      c => (c.fromId === a && c.toId === b) || (c.fromId === b && c.toId === a)
    );
  };

  const hasPcAConnected = isConnected('pc_a', 'switch');
  const hasPcBConnected = isConnected('pc_b', 'switch');
  const hasPcCConnected = isConnected('pc_c', 'switch');

  const isLanConnected = hasPcAConnected && hasPcBConnected && hasPcCConnected;
  const hasSwitchToRouter = isConnected('switch', 'router');
  const hasRouterToInternet = isConnected('router', 'internet');

  const canSendLocalData = hasPcAConnected && hasPcBConnected; // misal PC A ke PC B lewat switch
  const isWanConnected = isLanConnected && hasSwitchToRouter && hasRouterToInternet;
  const canSendInternetData = hasPcAConnected && hasSwitchToRouter && hasRouterToInternet;

  return {
    isLanConnected,
    isWanConnected,
    hasPcAConnected,
    hasPcBConnected,
    hasPcCConnected,
    hasSwitchToRouter,
    hasRouterToInternet,
    canSendLocalData,
    canSendInternetData
  };
}

export interface LearningRecommendation {
  overallMessage: string;
  gainScore: number;
  understoodTopics: string[];
  reviewTopics: string[];
  adviceList: string[];
}

/**
 * Membuat analisis rekomendasi belajar yang hati-hati dan suportif
 */
export function generateLearningRecommendation(
  preScore: number,
  postScore: number,
  preBreakdown: Record<string, { isCorrect: boolean }>,
  postBreakdown: Record<string, { isCorrect: boolean }>
): LearningRecommendation {
  const gainScore = postScore - preScore;

  // Evaluasi per wilayah
  const regionNames: Record<RegionId, string> = {
    lab: 'Perangkat Keras & Komponen Komputer',
    algorithm: 'Algoritma, Pemrograman & Debugging',
    network: 'Jaringan Komputer & Internet',
    security: 'Keamanan Digital & Etika Berinternet'
  };

  const understoodTopics: string[] = [];
  const reviewTopics: string[] = [];
  const adviceList: string[] = [];

  const regionPerformance: Record<RegionId, { correct: number; total: number }> = {
    lab: { correct: 0, total: 0 },
    algorithm: { correct: 0, total: 0 },
    network: { correct: 0, total: 0 },
    security: { correct: 0, total: 0 }
  };

  // Gabungkan hasil dari post test untuk analisis spesifik
  for (const [qId, result] of Object.entries(postBreakdown)) {
    const q = QUESTIONS.find(item => item.id === qId);
    if (!q) continue;
    regionPerformance[q.regionId].total++;
    if (result.isCorrect) {
      regionPerformance[q.regionId].correct++;
    }
  }

  for (const [regionId, stat] of Object.entries(regionPerformance) as Array<[RegionId, { correct: number; total: number }]>) {
    if (stat.total === 0) continue;
    const ratio = stat.correct / stat.total;
    if (ratio >= 0.7) {
      understoodTopics.push(regionNames[regionId]);
    } else {
      reviewTopics.push(regionNames[regionId]);
    }
  }

  let overallMessage = '';
  if (postScore >= 80) {
    overallMessage = 'Luar biasa! Kamu menunjukkan pemahaman yang sangat mendalam tentang materi Informatika dan berhasil memulihkan Kota Digital dengan sangat baik.';
  } else if (postScore >= 60) {
    overallMessage = 'Kerja bagus! Kamu sudah memahami sebagian besar konsep dasar Informatika dengan baik. Dengan sedikit latihan tambahan, kamu akan semakin mahir!';
  } else {
    overallMessage = 'Semangat penjelajah! Kamu telah berani mencoba dan belajar hal baru bersama robot BIT. Memahami teknologi memerlukan proses dan latihan berulang.';
  }

  if (gainScore > 0) {
    adviceList.push(`Selamat! Terjadi peningkatan nilai pemahaman sebesar +${gainScore} poin antara tes awal dan tes akhir.`);
  } else if (gainScore === 0) {
    adviceList.push('Nilai pemahamanmu stabil. Eksplorasi kembali simulasi interaktif untuk memperkuat daya nalarmu.');
  } else {
    adviceList.push('Beberapa pertanyaan pada tes akhir memerlukan ketelitian membaca konsep. Jangan ragu meninjau kembali ringkasan materi.');
  }

  if (reviewTopics.length > 0) {
    adviceList.push(`Disarankan untuk meninjau kembali materi: ${reviewTopics.join(', ')} menggunakan tombol "Ulangi Materi" di bawah.`);
  } else {
    adviceList.push('Kamu telah menguasai seluruh topik pembelajaran dengan sangat memuaskan!');
  }

  return {
    overallMessage,
    gainScore,
    understoodTopics,
    reviewTopics,
    adviceList
  };
}

/**
 * Format CSV download data
 */
export function generateCsvReport(data: {
  studentName: string;
  preScore: number;
  postScore: number;
  totalXP: number;
  completedRegions: string[];
  understoodTopics: string[];
  reviewTopics: string[];
  timestamp: string;
}): string {
  const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`;

  const rows = [
    ['Laporan Belajar', 'Jelajah Kota Digital - Informatika SMP'],
    ['Tanggal & Waktu', data.timestamp],
    ['Nama Siswa', data.studentName || 'Anonim (Penjelajah BIT)'],
    ['Nilai Tes Awal (Pre-test)', `${data.preScore}/100`],
    ['Nilai Tes Akhir (Post-test)', `${data.postScore}/100`],
    ['Peningkatan Nilai (Gain)', `${data.postScore - data.preScore} poin`],
    ['Total XP Permainan', `${data.totalXP} XP`],
    ['Wilayah Pulih', data.completedRegions.join('; ')],
    ['Materi Sudah Dipahami', data.understoodTopics.join('; ')],
    ['Materi Perlu Diulang', data.reviewTopics.join('; ') || 'Tidak ada']
  ];

  return rows.map(r => r.map(escapeCsv).join(',')).join('\n');
}

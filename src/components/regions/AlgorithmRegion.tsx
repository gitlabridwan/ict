import React, { useState, useEffect, useRef } from 'react';
import { BlockType, CodeBlock, RegionId } from '../../types/game';
import { REGIONS_META } from '../../data/materials';
import { QUESTIONS } from '../../data/questions';
import { AlgorithmMapConfig, simulateAlgorithmRun, SimulationStep } from '../../utils/rules';
import { sound } from '../../utils/audio';
import {
  Compass,
  Play,
  RotateCcw,
  StepForward,
  Square,
  Award,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Bot,
  BatteryCharging,
  Trash2
} from 'lucide-react';

interface AlgorithmRegionProps {
  onCompleteRegion: (regionId: RegionId) => void;
  onBackToMap: () => void;
  isCompleted: boolean;
}

const CHALLENGES: Array<{
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  config: AlgorithmMapConfig;
  initialBlocks?: CodeBlock[];
}> = [
  {
    id: 1,
    title: 'Tantangan 1: Struktur Urutan (Sequence)',
    subtitle: 'Rute Linear ke Baterai Daya',
    desc: 'Pandu Robot BIT melangkah maju dan berbelok menyusuri jalan setapak taman untuk mengisi daya baterai!',
    config: {
      width: 5,
      height: 5,
      startPos: { x: 0, y: 1, dir: 'E' },
      targetPos: { x: 3, y: 3 },
      obstacles: [{ x: 1, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
      parBlocks: 5
    }
  },
  {
    id: 2,
    title: 'Tantangan 2: Struktur Perulangan (Loop)',
    subtitle: 'Lintasan Lurus Panjang',
    desc: 'Baterai berada jauh di ujung lintasan lurus. Gunakan blok Ulangi (Loop) agar kodemu lebih ringkas dan hemat instruksi!',
    config: {
      width: 6,
      height: 4,
      startPos: { x: 0, y: 1, dir: 'E' },
      targetPos: { x: 5, y: 1 },
      obstacles: [{ x: 2, y: 0 }, { x: 2, y: 2 }, { x: 3, y: 0 }, { x: 3, y: 2 }],
      parBlocks: 1
    }
  },
  {
    id: 3,
    title: 'Tantangan 3: Percabangan & Debugging (If-Else)',
    subtitle: 'Menghindari Batu Rintangan',
    desc: 'Ada rute yang keliru dan terdapat batu penghalang di depan. Perbaiki (debug) atau gunakan logika percabangan untuk mencapai baterai!',
    config: {
      width: 5,
      height: 5,
      startPos: { x: 0, y: 2, dir: 'E' },
      targetPos: { x: 4, y: 0 },
      obstacles: [{ x: 2, y: 2 }, { x: 2, y: 1 }],
      parBlocks: 5
    },
    // intentionally buggy initial route for student to debug
    initialBlocks: [
      { id: 'bug_1', type: 'forward', label: 'Maju 1 langkah' },
      { id: 'bug_2', type: 'forward', label: 'Maju 1 langkah' } // hits obstacle at (2,2)
    ]
  }
];

export const AlgorithmRegion: React.FC<AlgorithmRegionProps> = ({
  onCompleteRegion,
  onBackToMap,
  isCompleted
}) => {
  const [activeTab, setActiveTab] = useState<'learn' | 'challenges' | 'practice' | 'summary'>('learn');
  const [challengeIdx, setChallengeIdx] = useState(0);

  const currentChallenge = CHALLENGES[challengeIdx];

  // Code editor state
  const [blocks, setBlocks] = useState<CodeBlock[]>(currentChallenge.initialBlocks || []);
  const [activeExecutingBlockId, setActiveExecutingBlockId] = useState<string | null>(null);

  // Simulation execution state
  const [robotPos, setRobotPos] = useState(currentChallenge.config.startPos);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationSteps, setSimulationSteps] = useState<SimulationStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [executionMessage, setExecutionMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [hasEarnedEfficiencyBadge, setHasEarnedEfficiencyBadge] = useState(false);

  // Practice state
  const practiceQuestions = QUESTIONS.filter(q => q.regionId === 'algorithm' && q.stage === 'practice');
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);

  // When switching challenges, reset position and blocks
  useEffect(() => {
    setBlocks(currentChallenge.initialBlocks ? [...currentChallenge.initialBlocks] : []);
    setRobotPos(currentChallenge.config.startPos);
    setExecutionMessage(null);
    setIsRunning(false);
    setActiveExecutingBlockId(null);
  }, [challengeIdx]);

  // Block management
  const addBlock = (type: BlockType) => {
    sound.playClick();
    const newId = `blk_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    let label = '';
    let count = undefined;
    let actionIfTrue: BlockType | undefined = undefined;
    let actionIfFalse: BlockType | undefined = undefined;

    switch (type) {
      case 'forward': label = 'Maju 1 langkah'; break;
      case 'turn_left': label = 'Belok Kiri 90°'; break;
      case 'turn_right': label = 'Belok Kanan 90°'; break;
      case 'repeat':
        label = 'Ulangi Maju';
        count = 4;
        break;
      case 'if_obstacle':
        label = 'JIKA ada halangan: Belok Kiri, JIKA TIDAK: Maju';
        actionIfTrue = 'turn_left';
        actionIfFalse = 'forward';
        break;
    }

    setBlocks(prev => [...prev, { id: newId, type, label, count, actionIfTrue, actionIfFalse }]);
  };

  const removeBlock = (id: string) => {
    sound.playClick();
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const resetCodeAndRobot = () => {
    sound.playClick();
    setIsRunning(false);
    setRobotPos(currentChallenge.config.startPos);
    setActiveExecutingBlockId(null);
    setExecutionMessage(null);
    setCurrentStepIdx(0);
  };

  // Run full simulation
  const handleRunProgram = () => {
    if (blocks.length === 0) return;
    sound.playStep();
    setIsRunning(true);
    setExecutionMessage(null);

    const result = simulateAlgorithmRun(blocks, currentChallenge.config);
    setSimulationSteps(result.steps);
    setCurrentStepIdx(0);

    // Playback steps one by one
    let step = 0;
    const interval = setInterval(() => {
      if (step < result.steps.length) {
        const cur = result.steps[step];
        setRobotPos(cur.pos);
        setActiveExecutingBlockId(cur.blockId);
        sound.playStep();
        step++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setActiveExecutingBlockId(null);

        if (result.success) {
          sound.playSuccess();
          if (result.isEfficient) {
            setHasEarnedEfficiencyBadge(true);
          }
          setExecutionMessage({
            text: `Hebat! Robot BIT berhasil mencapai baterai pengisian daya!${
              result.isEfficient ? ' 🌟 Kamu juga mendapatkan Lencana Efisiensi Algoritma!' : ''
            }`,
            type: 'success'
          });
        } else {
          sound.playError();
          setExecutionMessage({
            text: result.errorMessage || 'Robot belum mencapai tujuan.',
            type: 'error'
          });
        }
      }
    }, 450);
  };

  // Step-by-step execution for debugging
  const handleStepNext = () => {
    sound.playStep();
    const result = simulateAlgorithmRun(blocks, currentChallenge.config);
    if (currentStepIdx < result.steps.length) {
      const cur = result.steps[currentStepIdx];
      setRobotPos(cur.pos);
      setActiveExecutingBlockId(cur.blockId);
      setCurrentStepIdx(prev => prev + 1);

      if (cur.hitObstacle || cur.hitBoundary) {
        sound.playError();
        setExecutionMessage({
          text: result.errorMessage || 'Robot terhenti!',
          type: 'error'
        });
      } else if (cur.reachedTarget) {
        sound.playSuccess();
        setExecutionMessage({
          text: 'Langkah terakhir berhasil! Robot BIT mencapai baterai daya!',
          type: 'success'
        });
      } else {
        setExecutionMessage({
          text: `[Langkah ${currentStepIdx + 1}]: ${cur.actionDesc}`,
          type: 'info'
        });
      }
    } else {
      sound.playClick();
      setExecutionMessage({
        text: 'Semua instruksi sudah selesai dieksekusi.',
        type: 'info'
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">WILAYAH 2</span>
              {isCompleted && <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">PULIH 100%</span>}
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white">Taman Algoritma & Debugging</h1>
          </div>
        </div>

        <button
          onClick={onBackToMap}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-700 transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Kembali ke Peta
        </button>
      </div>

      {/* Navigation tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => { sound.playClick(); setActiveTab('learn'); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'learn' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          1. Pelajari Konsep
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('challenges'); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'challenges' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          2. Tantangan Coding Robot ({challengeIdx + 1}/3)
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('practice'); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'practice' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          3. Latihan Soal ({practiceQuestions.length})
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('summary'); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'summary' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          4. Simpulan & Nyata
        </button>
      </div>

      {/* TAB 1: LEARN */}
      {activeTab === 'learn' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Tiga Struktur Kontrol Algoritma & Seni Debugging
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Algoritma bukan sekadar baris kode yang kaku. Algoritma adalah cara berpikir logis dan sistematis untuk memandu komputer menyelesaikan misi langkah demi langkah.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">1. Urutan (Sequence)</span>
                <h3 className="text-base font-bold text-white mt-1">Langkah Demi Langkah</h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Perintah dijalankan satu per satu dari atas ke bawah. Urutan yang terbalik dapat menyebabkan robot salah arah atau menabrak rintangan!
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">2. Perulangan (Loop)</span>
                <h3 className="text-base font-bold text-white mt-1">Efisiensi Tanpa Lelah</h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Mengulangi instruksi berkali-kali secara otomatis. Daripada menulis "Maju" sebanyak 10 kali, cukup tulis: <em>Ulangi 10x [Maju]</em>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">3. Percabangan & Debugging</span>
                <h3 className="text-base font-bold text-white mt-1">Kondisi & Perbaikan Bug</h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Mengambil keputusan: <em>JIKA ada halangan MAKA belok, JIKA TIDAK MAKA maju</em>. Saat kode salah, kita melakukan <strong>Debugging</strong> untuk mencari titik kekeliruan.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => { sound.playClick(); setActiveTab('challenges'); }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                Mulai Tantangan Coding Robot
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CODING CHALLENGES */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          {/* Challenge Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div className="flex gap-2">
              {CHALLENGES.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => { sound.playClick(); setChallengeIdx(idx); }}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    challengeIdx === idx
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Tantangan {idx + 1}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-400">
              Target Efisiensi: ≤ {currentChallenge.config.parBlocks} blok kode
            </div>
          </div>

          {/* Challenge Info Banner */}
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
            <h2 className="text-base font-bold text-white">{currentChallenge.title}: {currentChallenge.subtitle}</h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">{currentChallenge.desc}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 3D-Like Grid Map (Visual Canvas) - 7 cols */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center">
              <span className="text-xs font-semibold text-slate-400 mb-4 self-start flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                Peta Petak Taman Algoritma
              </span>

              {/* Grid board */}
              <div
                className="grid gap-1.5 p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner"
                style={{
                  gridTemplateColumns: `repeat(${currentChallenge.config.width}, minmax(0, 1fr))`
                }}
              >
                {Array.from({ length: currentChallenge.config.height }).map((_, rIdx) => {
                  return Array.from({ length: currentChallenge.config.width }).map((_, cIdx) => {
                    const isRobotHere = robotPos.x === cIdx && robotPos.y === rIdx;
                    const isTargetHere = currentChallenge.config.targetPos.x === cIdx && currentChallenge.config.targetPos.y === rIdx;
                    const isObstacleHere = currentChallenge.config.obstacles.some(o => o.x === cIdx && o.y === rIdx);

                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl border flex flex-col items-center justify-center relative transition-all ${
                          isRobotHere
                            ? 'bg-cyan-500/20 border-cyan-400 shadow-md ring-2 ring-cyan-400/40 scale-105'
                            : isTargetHere
                            ? 'bg-amber-500/20 border-amber-400'
                            : isObstacleHere
                            ? 'bg-red-950/60 border-red-700/60'
                            : 'bg-slate-800/60 border-slate-700/50 hover:border-slate-600'
                        }`}
                      >
                        {/* Grid coordinate tiny label */}
                        <span className="absolute top-1 left-1.5 text-[9px] text-slate-500">
                          {cIdx + 1},{rIdx + 1}
                        </span>

                        {isRobotHere && (
                          <div className="flex flex-col items-center">
                            <span className="text-lg sm:text-xl">🤖</span>
                            <span className="text-[10px] font-bold text-cyan-300">
                              {robotPos.dir === 'E' ? '👉 Timur' : robotPos.dir === 'W' ? '👈 Barat' : robotPos.dir === 'N' ? '👆 Utara' : '👇 Selatan'}
                            </span>
                          </div>
                        )}

                        {isTargetHere && !isRobotHere && (
                          <div className="flex flex-col items-center">
                            <BatteryCharging className="w-6 h-6 text-amber-400 animate-bounce" />
                            <span className="text-[9px] font-bold text-amber-300">Baterai</span>
                          </div>
                        )}

                        {isObstacleHere && !isRobotHere && (
                          <div className="flex flex-col items-center">
                            <span className="text-lg">🪨</span>
                            <span className="text-[9px] text-red-400 font-semibold">Batu</span>
                          </div>
                        )}
                      </div>
                    );
                  });
                })}
              </div>

              {/* Execution status message */}
              {executionMessage && (
                <div
                  className={`mt-4 w-full p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-3 ${
                    executionMessage.type === 'success'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : executionMessage.type === 'error'
                      ? 'bg-red-950/80 border-red-500 text-red-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300'
                  }`}
                >
                  {executionMessage.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  )}
                  <div>{executionMessage.text}</div>
                </div>
              )}
            </div>

            {/* Code Block Builder - 5 cols */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 mb-2 block">
                  1. Pilih Blok Instruksi untuk Ditambahkan:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addBlock('forward')}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white text-left transition-all"
                  >
                    + Maju 1 Langkah
                  </button>
                  <button
                    onClick={() => addBlock('turn_left')}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white text-left transition-all"
                  >
                    + Belok Kiri 90°
                  </button>
                  <button
                    onClick={() => addBlock('turn_right')}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white text-left transition-all"
                  >
                    + Belok Kanan 90°
                  </button>
                  <button
                    onClick={() => addBlock('repeat')}
                    className="p-2 rounded-xl bg-blue-900/40 hover:bg-blue-800/50 border border-blue-500/50 text-xs font-semibold text-blue-200 text-left transition-all"
                  >
                    + Ulangi (Loop)
                  </button>
                  <button
                    onClick={() => addBlock('if_obstacle')}
                    className="p-2 rounded-xl bg-amber-900/40 hover:bg-amber-800/50 border border-amber-500/50 text-xs font-semibold text-amber-200 text-left transition-all col-span-2"
                  >
                    + Percabangan (JIKA Ada Halangan)
                  </button>
                </div>

                {/* Code Workspace Stack */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400">
                      2. Urutan Baris Kode ({blocks.length} blok):
                    </span>
                    <button
                      onClick={() => { sound.playClick(); setBlocks([]); }}
                      className="text-[11px] text-red-400 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus Semua
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                    {blocks.length === 0 ? (
                      <div className="p-6 text-center border-2 border-dashed border-slate-800 rounded-xl text-xs text-slate-500">
                        Belum ada kode. Klik tombol instruksi di atas untuk mulai memprogram robot BIT!
                      </div>
                    ) : (
                      blocks.map((block, bIdx) => {
                        const isExecuting = activeExecutingBlockId === block.id;
                        return (
                          <div
                            key={block.id}
                            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                              isExecuting
                                ? 'bg-cyan-500/30 border-cyan-400 ring-2 ring-cyan-400/50 scale-102'
                                : block.type === 'repeat'
                                ? 'bg-blue-950/60 border-blue-500/40 text-blue-200'
                                : block.type === 'if_obstacle'
                                ? 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                                : 'bg-slate-800/90 border-slate-700 text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded bg-slate-900/90 text-slate-400 font-mono text-[10px] flex items-center justify-center">
                                {bIdx + 1}
                              </span>
                              <span className="font-medium">{block.label}</span>
                            </div>

                            <button
                              onClick={() => removeBlock(block.id)}
                              className="text-slate-400 hover:text-red-400 p-1"
                              title="Hapus baris ini"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Execution Controls */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2">
                <button
                  onClick={handleRunProgram}
                  disabled={isRunning || blocks.length === 0}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                    isRunning || blocks.length === 0
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  Jalankan
                </button>

                <button
                  onClick={handleStepNext}
                  disabled={isRunning || blocks.length === 0}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
                  title="Eksekusi satu langkah untuk debugging"
                >
                  <StepForward className="w-4 h-4 text-cyan-400" />
                  Langkah Berikut
                </button>

                <button
                  onClick={resetCodeAndRobot}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700"
                  title="Kembalikan robot ke posisi awal"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Next challenge / Practice button */}
          <div className="flex justify-end gap-3 pt-2">
            {challengeIdx < CHALLENGES.length - 1 ? (
              <button
                onClick={() => { sound.playClick(); setChallengeIdx(prev => prev + 1); }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all flex items-center gap-2"
              >
                Lanjut ke Tantangan {challengeIdx + 2}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => { sound.playClick(); setActiveTab('practice'); }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25"
              >
                Lanjut ke Latihan Soal Algoritma
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PRACTICE */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                Latihan Soal Wilayah 2 • Soal {practiceIndex + 1} dari {practiceQuestions.length}
              </span>
              <span className="text-xs text-slate-400">
                Nilai Latihan: {practiceScore}/{practiceQuestions.length}
              </span>
            </div>

            {(() => {
              const q = practiceQuestions[practiceIndex];
              return (
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                    {q.question}
                  </h3>

                  <div className="space-y-2.5">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selectedAnswer === oIdx;
                      let optionClasses = 'border-slate-800 bg-slate-950/80 hover:border-slate-600 text-slate-200';
                      if (hasCheckedAnswer) {
                        if (oIdx === q.correctIndex) {
                          optionClasses = 'border-emerald-500 bg-emerald-500/20 text-emerald-200 font-semibold';
                        } else if (isSelected) {
                          optionClasses = 'border-red-500 bg-red-500/20 text-red-200';
                        }
                      } else if (isSelected) {
                        optionClasses = 'border-emerald-500 bg-emerald-500/20 text-white font-semibold';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={hasCheckedAnswer}
                          onClick={() => { sound.playClick(); setSelectedAnswer(oIdx); }}
                          className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${optionClasses}`}
                        >
                          <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {hasCheckedAnswer && (
                    <div
                      className={`p-4 rounded-xl border text-xs sm:text-sm ${
                        selectedAnswer === q.correctIndex
                          ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
                          : 'bg-amber-950/70 border-amber-500/60 text-amber-200'
                      }`}
                    >
                      <p className="font-bold mb-1">
                        {selectedAnswer === q.correctIndex ? '✓ Analisis Logikamu Tepat!' : '✗ Kurang Tepat, Perhatikan Polanya!'}
                      </p>
                      <p className="text-xs leading-relaxed">{q.explanation}</p>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    {!hasCheckedAnswer ? (
                      <button
                        onClick={() => {
                          if (selectedAnswer === null) return;
                          setHasCheckedAnswer(true);
                          if (selectedAnswer === q.correctIndex) {
                            sound.playSuccess();
                            setPracticeScore(prev => prev + 1);
                          } else {
                            sound.playError();
                          }
                        }}
                        disabled={selectedAnswer === null}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                          selectedAnswer !== null
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Periksa Jawaban
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          sound.playClick();
                          setSelectedAnswer(null);
                          setHasCheckedAnswer(false);
                          if (practiceIndex < practiceQuestions.length - 1) {
                            setPracticeIndex(prev => prev + 1);
                          } else {
                            setActiveTab('summary');
                            onCompleteRegion('algorithm');
                          }
                        }}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25"
                      >
                        {practiceIndex < practiceQuestions.length - 1 ? 'Soal Berikutnya' : 'Selesaikan Wilayah 2'}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* TAB 4: SUMMARY */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase">Luar Biasa! Wilayah Pulih</span>
                <h2 className="text-lg sm:text-xl font-bold text-white">Wilayah 2: Taman Algoritma Pulih 100%!</h2>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Ringkasan Konsep Utama</span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {REGIONS_META.algorithm.summary}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Penerapan Nyata Sehari-Hari</span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {REGIONS_META.algorithm.realWorldExample}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Pertanyaan Refleksi Siswa</span>
              <p className="text-xs sm:text-sm text-slate-300 italic">
                "{REGIONS_META.algorithm.reflectionQuestion}"
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => { sound.playClick(); setActiveTab('challenges'); }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium border border-slate-700 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Coba Ulangi Tantangan Coding
              </button>

              <button
                onClick={onBackToMap}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
              >
                Kembali ke Peta Kota
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

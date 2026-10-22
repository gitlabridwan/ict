import React, { useState } from 'react';
import { HardwareItem, RegionId } from '../../types/game';
import { HARDWARE_ITEMS, REGIONS_META } from '../../data/materials';
import { QUESTIONS } from '../../data/questions';
import { evaluateHardwareClassification } from '../../utils/rules';
import { sound } from '../../utils/audio';
import {
  Cpu,
  Keyboard,
  Mouse,
  Mic,
  Layers,
  HardDrive,
  Tv,
  Printer,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Play
} from 'lucide-react';

interface LabRegionProps {
  onCompleteRegion: (regionId: RegionId) => void;
  onBackToMap: () => void;
  isCompleted: boolean;
}

const CATEGORIES = [
  { id: 'input', label: 'Input (Masukan)', desc: 'Memasukkan data/perintah ke komputer', color: 'border-blue-500 bg-blue-500/10 text-blue-400' },
  { id: 'processing', label: 'Pemrosesan (Process)', desc: 'Mengolah instruksi dan menghitung logika', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400' },
  { id: 'storage', label: 'Penyimpanan (Storage)', desc: 'Menyimpan data (sementara/tetap)', color: 'border-amber-500 bg-amber-500/10 text-amber-400' },
  { id: 'output', label: 'Output (Keluaran)', desc: 'Menampilkan hasil pengolahan ke pengguna', color: 'border-pink-500 bg-pink-500/10 text-pink-400' }
] as const;

export const LabRegion: React.FC<LabRegionProps> = ({
  onCompleteRegion,
  onBackToMap,
  isCompleted
}) => {
  const [activeTab, setActiveTab] = useState<'learn' | 'classify' | 'simulation' | 'practice' | 'summary'>('learn');

  // Classification state
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ReturnType<typeof evaluateHardwareClassification> | null>(null);

  // Simulation state: Type -> CPU Process -> Monitor Output -> SSD Save
  const [simText, setSimText] = useState('Selamat Datang di Kota Digital!');
  const [simStep, setSimStep] = useState<0 | 1 | 2 | 3>(0);
  const [isSimulating, setIsSimulating] = useState(false);

  // Practice questions state (3 questions for Wilayah 1)
  const practiceQuestions = QUESTIONS.filter(q => q.regionId === 'lab' && q.stage === 'practice');
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Keyboard': return <Keyboard className="w-5 h-5" />;
      case 'Mouse': return <Mouse className="w-5 h-5" />;
      case 'Mic': return <Mic className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'HardDrive': return <HardDrive className="w-5 h-5" />;
      case 'Tv': return <Tv className="w-5 h-5" />;
      case 'Printer': return <Printer className="w-5 h-5" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };

  const handleSelectItem = (itemId: string) => {
    sound.playClick();
    setSelectedItemId(itemId === selectedItemId ? null : itemId);
  };

  const handlePlaceItem = (categoryId: string) => {
    if (!selectedItemId) return;
    sound.playClick();
    setPlacements(prev => ({ ...prev, [selectedItemId]: categoryId }));
    setSelectedItemId(null);
    setValidationResult(null);
  };

  const handleCheckClassification = () => {
    const result = evaluateHardwareClassification(placements);
    setValidationResult(result);
    if (result.isComplete) {
      sound.playSuccess();
    } else {
      sound.playError();
    }
  };

  const handleResetClassification = () => {
    sound.playClick();
    setPlacements({});
    setSelectedItemId(null);
    setValidationResult(null);
  };

  // Simulation flow handler
  const runSimulation = () => {
    if (!simText.trim()) return;
    setIsSimulating(true);
    setSimStep(0);
    sound.playStep();

    setTimeout(() => {
      setSimStep(1); // CPU Processing
      sound.playStep();
      setTimeout(() => {
        setSimStep(2); // Monitor Output
        sound.playStep();
        setTimeout(() => {
          setSimStep(3); // SSD Save
          sound.playSuccess();
          setIsSimulating(false);
        }, 1200);
      }, 1200);
    }, 1000);
  };

  // Practice handler
  const handleCheckPractice = () => {
    if (selectedAnswer === null) return;
    setHasCheckedAnswer(true);
    const currQ = practiceQuestions[practiceIndex];
    if (selectedAnswer === currQ.correctIndex) {
      sound.playSuccess();
      setPracticeScore(prev => prev + 1);
    } else {
      sound.playError();
    }
  };

  const handleNextPractice = () => {
    sound.playClick();
    setSelectedAnswer(null);
    setHasCheckedAnswer(false);
    if (practiceIndex < practiceQuestions.length - 1) {
      setPracticeIndex(prev => prev + 1);
    } else {
      setActiveTab('summary');
      onCompleteRegion('lab');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-blue-500/30 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">WILAYAH 1</span>
              {isCompleted && <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">PULIH 100%</span>}
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white">Laboratorium Komputer</h1>
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

      {/* Navigation tabs following the pedagogical model: Amati -> Pelajari -> Coba -> Umpan Balik -> Simpulkan */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => { sound.playClick(); setActiveTab('learn'); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'learn' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          1. Pelajari Konsep
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('classify'); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'classify' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          2. Tantangan Kelompokkan
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('simulation'); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulation' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          3. Simulasi Siklus IPO-S
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('practice'); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'practice' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          4. Latihan Soal ({practiceQuestions.length})
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('summary'); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'summary' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          5. Simpulan & Nyata
        </button>
      </div>

      {/* TAB 1: LEARN (PELAJARI) */}
      {activeTab === 'learn' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Siklus Pemrosesan Komputer: Input - Process - Output - Storage
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Komputer adalah sistem elektronik yang menerima data masukan (Input), memprosesnya secara cerdas dengan CPU (Processing), menampilkan hasilnya kepada kita (Output), dan menyimpannya agar tidak hilang (Storage).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Perangkat Input</span>
                <h3 className="text-base font-bold text-white mt-1">Keyboard, Mouse, & Mikrofon</h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Menjembatani manusia dengan komputer untuk memasukkan huruf, angka, klik perintah, serta rekaman suara.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Unit Pemrosesan</span>
                <h3 className="text-base font-bold text-white mt-1">CPU (Central Processing Unit)</h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Otak komputer yang mengeksekusi jutaan baris kode per detik, melakukan perhitungan matematika dan logika instruksi program.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Perbedaan Penting Penyimpanan</span>
                <h3 className="text-base font-bold text-white mt-1">RAM (Sementara) vs SSD (Tetap)</h3>
                <div className="mt-2 space-y-1 text-xs text-slate-300">
                  <p><strong>• RAM:</strong> Memori kerja super cepat. Bersifat <em>Volatile</em> (data langsung terhapus jika komputer mati).</p>
                  <p><strong>• SSD:</strong> Media simpan persisten. Bersifat <em>Non-Volatile</em> (file tugas, foto, dan sistem tetap aman walau tanpa daya).</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-pink-950/40 border border-pink-500/30">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Perangkat Output</span>
                <h3 className="text-base font-bold text-white mt-1">Monitor & Printer</h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Menampilkan hasil olahan komputer kepada panca indera manusia: monitor menampilkan visual piksel di layar, sedangkan printer mencetak fisik di kertas.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => { sound.playClick(); setActiveTab('classify'); }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                Mulai Tantangan Mengelompokkan
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLASSIFY CHALLENGE */}
      {activeTab === 'classify' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">Tantangan: Letakkan 8 Perangkat ke Wadah yang Tepat</h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Cara: Klik salah satu perangkat di bawah, lalu klik kotak kategori tujuannya.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleResetClassification}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
                >
                  Reset Pilihan
                </button>
              </div>
            </div>

            {/* List of 8 Hardware Items */}
            <div className="mb-6">
              <span className="text-xs font-semibold text-slate-400 mb-2 block">Daftar Perangkat di Meja Laboratorium:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {HARDWARE_ITEMS.map(item => {
                  const placedIn = placements[item.id];
                  const isSelected = selectedItemId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectItem(item.id)}
                      className={`p-3 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'border-blue-400 bg-blue-500/20 ring-2 ring-blue-500/50'
                          : placedIn
                          ? 'border-slate-700 bg-slate-800/40 opacity-75'
                          : 'border-slate-700/80 bg-slate-800/90 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="p-1.5 rounded-lg bg-slate-700/70 text-blue-400">
                          {getIcon(item.iconName)}
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-white truncate">{item.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
                      {placedIn && (
                        <span className="mt-2 inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                          Diposisikan: {placedIn}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4 Category Drop Zones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CATEGORIES.map(cat => {
                const assignedItems = HARDWARE_ITEMS.filter(item => placements[item.id] === cat.id);
                return (
                  <div
                    key={cat.id}
                    onClick={() => handlePlaceItem(cat.id)}
                    className={`p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer min-h-[160px] flex flex-col justify-between ${
                      selectedItemId ? 'hover:scale-[1.02] border-blue-400 bg-blue-500/5' : ''
                    } ${cat.color}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-sm text-white">{cat.label}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
                          {assignedItems.length}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-3">{cat.desc}</p>

                      {/* Placed items list */}
                      <div className="space-y-1.5">
                        {assignedItems.map(item => (
                          <div
                            key={item.id}
                            className="p-1.5 px-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-xs text-white flex items-center justify-between"
                          >
                            <span>{item.name}</span>
                            <span className="text-[10px] text-blue-400 font-medium">{item.iconName}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedItemId && (
                      <div className="mt-3 text-center py-1.5 rounded-lg bg-blue-600/30 border border-blue-500/50 text-[11px] font-semibold text-blue-200">
                        Klik untuk tempatkan di sini 📥
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Validation Feedback */}
            {validationResult && (
              <div
                className={`mt-6 p-4 rounded-xl border ${
                  validationResult.isComplete
                    ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
                    : 'bg-amber-950/70 border-amber-500/60 text-amber-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {validationResult.isComplete ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-2 text-xs sm:text-sm">
                    <p className="font-bold">
                      {validationResult.isComplete
                        ? 'Hebat! Seluruh 8 perangkat berhasil kamu kelompokkan dengan tepat!'
                        : `Terdapat ${validationResult.incorrectItems.length} perangkat yang belum sesuai penempatannya (${validationResult.correctCount}/${validationResult.totalItems} benar).`}
                    </p>

                    {validationResult.incorrectItems.map(inc => (
                      <p key={inc.id} className="text-xs text-amber-300">
                        <strong>• {inc.name}:</strong> {inc.explanation}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Terisi: {Object.keys(placements).length} dari 8 perangkat
              </span>

              <div className="flex gap-3">
                <button
                  onClick={handleCheckClassification}
                  disabled={Object.keys(placements).length < 8}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    Object.keys(placements).length >= 8
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Periksa Pengelompokan
                </button>

                {validationResult?.isComplete && (
                  <button
                    onClick={() => { sound.playClick(); setActiveTab('simulation'); }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25"
                  >
                    Lanjut ke Simulasi IPO-S
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SIMULATION (SIMULASI SIKLUS IPO-S) */}
      {activeTab === 'simulation' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Play className="w-5 h-5 text-blue-400" />
              Simulasi Siklus Lengkap: Ketik → Olah → Tampil → Simpan
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
              Ketikkan pesan apa saja di bawah, lalu amati perjalanan datamu mengalir melewati siklus Input, CPU, Monitor, hingga media penyimpanan SSD!
            </p>

            {/* Input field */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={simText}
                onChange={e => setSimText(e.target.value)}
                maxLength={40}
                placeholder="Tulis kalimat di sini..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={runSimulation}
                disabled={isSimulating || !simText.trim()}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  isSimulating || !simText.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                }`}
              >
                <Play className="w-4 h-4" />
                Jalankan Siklus
              </button>
            </div>

            {/* 4 Pipeline Stages */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Stage 1: Input */}
              <div className={`p-4 rounded-xl border transition-all ${
                simStep >= 0 && isSimulating && simStep === 0
                  ? 'border-blue-400 bg-blue-500/20 scale-105'
                  : 'border-slate-800 bg-slate-950/60'
              }`}>
                <div className="flex items-center gap-2 mb-2 text-blue-400">
                  <Keyboard className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase">1. Input</span>
                </div>
                <p className="text-xs text-white font-medium">Keyboard Menerima Ketikan</p>
                <p className="text-[11px] text-slate-400 mt-1">"{simText}"</p>
              </div>

              {/* Stage 2: Processing */}
              <div className={`p-4 rounded-xl border transition-all ${
                simStep === 1
                  ? 'border-emerald-400 bg-emerald-500/20 scale-105'
                  : 'border-slate-800 bg-slate-950/60'
              }`}>
                <div className="flex items-center gap-2 mb-2 text-emerald-400">
                  <Cpu className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase">2. Processing</span>
                </div>
                <p className="text-xs text-white font-medium">CPU Mengolah Kode</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {simStep >= 1 ? `Binary/ASCII (${simText.length * 8} bits)` : 'Menunggu input...'}
                </p>
              </div>

              {/* Stage 3: Output */}
              <div className={`p-4 rounded-xl border transition-all ${
                simStep === 2
                  ? 'border-pink-400 bg-pink-500/20 scale-105'
                  : 'border-slate-800 bg-slate-950/60'
              }`}>
                <div className="flex items-center gap-2 mb-2 text-pink-400">
                  <Tv className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase">3. Output</span>
                </div>
                <p className="text-xs text-white font-medium">Monitor Menampilkan Piksel</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {simStep >= 2 ? `Render layar: "${simText}"` : 'Layar pasif'}
                </p>
              </div>

              {/* Stage 4: Storage */}
              <div className={`p-4 rounded-xl border transition-all ${
                simStep === 3
                  ? 'border-amber-400 bg-amber-500/20 scale-105'
                  : 'border-slate-800 bg-slate-950/60'
              }`}>
                <div className="flex items-center gap-2 mb-2 text-amber-400">
                  <HardDrive className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase">4. Storage</span>
                </div>
                <p className="text-xs text-white font-medium">SSD Menyimpan Tetap</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {simStep === 3 ? 'Tersimpan aman di flash disk!' : 'Belum disimpan'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => { sound.playClick(); setActiveTab('practice'); }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                Lanjut ke Latihan Soal
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRACTICE QUESTIONS */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300">
                Latihan Soal Wilayah 1 • Soal {practiceIndex + 1} dari {practiceQuestions.length}
              </span>
              <span className="text-xs text-slate-400">
                Nilai Latihan: {practiceScore}/{practiceQuestions.length}
              </span>
            </div>

            {/* Current Question */}
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
                        optionClasses = 'border-blue-500 bg-blue-500/20 text-white font-semibold';
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

                  {/* Feedback Explanation */}
                  {hasCheckedAnswer && (
                    <div
                      className={`p-4 rounded-xl border text-xs sm:text-sm ${
                        selectedAnswer === q.correctIndex
                          ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
                          : 'bg-amber-950/70 border-amber-500/60 text-amber-200'
                      }`}
                    >
                      <p className="font-bold mb-1">
                        {selectedAnswer === q.correctIndex ? '✓ Jawabanmu Tepat Sekali!' : '✗ Kurang Tepat, Jangan Khawatir!'}
                      </p>
                      <p className="text-xs leading-relaxed">{q.explanation}</p>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    {!hasCheckedAnswer ? (
                      <button
                        onClick={handleCheckPractice}
                        disabled={selectedAnswer === null}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                          selectedAnswer !== null
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Periksa Jawaban
                      </button>
                    ) : (
                      <button
                        onClick={handleNextPractice}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25"
                      >
                        {practiceIndex < practiceQuestions.length - 1 ? 'Soal Berikutnya' : 'Selesaikan Wilayah 1'}
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

      {/* TAB 5: SUMMARY & REAL-WORLD EXAMPLE */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase">Selamat! Misi Selesai</span>
                <h2 className="text-lg sm:text-xl font-bold text-white">Wilayah 1: Laboratorium Komputer Pulih!</h2>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Ringkasan Konsep Utama</span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {REGIONS_META.lab.summary}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 space-y-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Penerapan Nyata Sehari-Hari</span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {REGIONS_META.lab.realWorldExample}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Pertanyaan Refleksi Siswa</span>
              <p className="text-xs sm:text-sm text-slate-300 italic">
                "{REGIONS_META.lab.reflectionQuestion}"
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => { sound.playClick(); setActiveTab('classify'); }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium border border-slate-700 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Coba Ulangi Tantangan
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

import React, { useState } from 'react';
import { RegionId, SecurityScenario } from '../../types/game';
import { REGIONS_META, SECURITY_SCENARIOS } from '../../data/materials';
import { QUESTIONS } from '../../data/questions';
import { sound } from '../../utils/audio';
import {
  ShieldCheck,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Lock,
  Eye,
  KeyRound,
  Sparkles,
  Info
} from 'lucide-react';

interface SecurityRegionProps {
  onCompleteRegion: (regionId: RegionId) => void;
  onBackToMap: () => void;
  isCompleted: boolean;
}

export const SecurityRegion: React.FC<SecurityRegionProps> = ({
  onCompleteRegion,
  onBackToMap,
  isCompleted
}) => {
  const [activeTab, setActiveTab] = useState<'learn' | 'scenarios' | 'password_lab' | 'practice' | 'summary'>('learn');

  // Scenarios state
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [selectedReasonId, setSelectedReasonId] = useState<string | null>(null);
  const [scenarioFeedback, setScenarioFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [completedScenarios, setCompletedScenarios] = useState<Record<string, boolean>>({});

  // Fictitious password strength tester state (strictly with fictitious examples)
  const [samplePassword, setSamplePassword] = useState('Kucing#Biru2026!');
  const fictitiousPresets = [
    { label: '12345678 (Sangat Lemah)', val: '12345678' },
    { label: 'namasendiri2012 (Lemah)', val: 'budi2012' },
    { label: 'Kucing#Biru2026! (Sangat Kuat)', val: 'Kucing#Biru2026!' },
    { label: 'Bintang*Di$Langit89 (Kuat - Passphrase)', val: 'Bintang*Di$Langit89' }
  ];

  // Practice state
  const practiceQuestions = QUESTIONS.filter(q => q.regionId === 'security' && q.stage === 'practice');
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);

  const currentScenario = SECURITY_SCENARIOS[scenarioIdx];

  const handleEvaluateScenario = () => {
    if (!selectedActionId || !selectedReasonId) return;

    const action = currentScenario.actions.find(a => a.id === selectedActionId);
    const reason = currentScenario.reasons.find(r => r.id === selectedReasonId);

    const isActionCorrect = action?.isCorrect ?? false;
    const isReasonCorrect = reason?.isCorrect ?? false;
    const allCorrect = isActionCorrect && isReasonCorrect;

    if (allCorrect) {
      sound.playSuccess();
      setCompletedScenarios(prev => ({ ...prev, [currentScenario.id]: true }));
      setScenarioFeedback({
        isCorrect: true,
        text: `Tepat sekali! ${currentScenario.recommendation}`
      });
    } else {
      sound.playError();
      setScenarioFeedback({
        isCorrect: false,
        text: 'Tindakan atau alasanmu belum tepat. Perhatikan tanda bahaya (red flags) pada pesan tersebut dan coba lagi!'
      });
    }
  };

  const handleNextScenario = () => {
    sound.playClick();
    setSelectedActionId(null);
    setSelectedReasonId(null);
    setScenarioFeedback(null);
    if (scenarioIdx < SECURITY_SCENARIOS.length - 1) {
      setScenarioIdx(prev => prev + 1);
    } else {
      setActiveTab('password_lab');
    }
  };

  // Compute password score for the fictitious preset
  const computeFictitiousScore = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score += 25;
    if (pw.length >= 12) score += 15;
    if (/[A-Z]/.test(pw)) score += 20;
    if (/[a-z]/.test(pw)) score += 15;
    if (/[0-9]/.test(pw)) score += 15;
    if (/[^A-Za-z0-9]/.test(pw)) score += 10;
    return Math.min(score, 100);
  };

  const pwScore = computeFictitiousScore(samplePassword);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">WILAYAH 4</span>
              {isCompleted && <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">PULIH 100%</span>}
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white">Benteng Keamanan & Etika Digital</h1>
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
            activeTab === 'learn' ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          1. Pelajari Konsep
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('scenarios'); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'scenarios' ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          2. Terminal Investigasi Kasus ({scenarioIdx + 1}/5)
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('password_lab'); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'password_lab' ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          3. Lab Kata Sandi & 2FA
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('practice'); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'practice' ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          4. Latihan Soal ({practiceQuestions.length})
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('summary'); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'summary' ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          5. Simpulan & Nyata
        </button>
      </div>

      {/* TAB 1: LEARN */}
      {activeTab === 'learn' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Benteng Siber: Melindungi Diri & Menjadi Warga Digital yang Bijak
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Dunia digital membuka pintu ilmu yang luas, tetapi juga menuntut kehati-hatian. Keamanan siber tidak hanya soal aplikasi antivirus, melainkan sikap kritis dalam menyikapi pesan serta menghargai orang lain.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Waspada Phishing & OTP</span>
                <h3 className="text-base font-bold text-white mt-1">Umpan Palsu Peretas</h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Phishing adalah modus penipuan dengan menyamar sebagai pihak resmi. <strong>Kuncinya:</strong> Pihak resmi tidak pernah meminta kata sandi atau kode OTP melalui pesan chat atau panggilan telepon!
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Perlindungan Ganda</span>
                <h3 className="text-base font-bold text-white mt-1">2FA (Autentikasi Dua Faktor)</h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  2FA memberikan perlindungan lapis kedua: selain kata sandi, dibutuhkan verifikasi tambahan (misalnya notifikasi di ponselmu). Jika kata sandimu bocor, akun tetap tidak bisa dibuka orang lain.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Privasi & Jejak Digital</span>
                <h3 className="text-base font-bold text-white mt-1">Hormati Batasan Pribadi</h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Foto dan data pribadi orang lain tidak boleh disebar tanpa izin. Ingat bahwa jejak digital (digital footprint) bersifat abadi dan sulit dihapus sepenuhnya dari internet.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-pink-950/40 border border-pink-500/30">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Netiket & Etika Digital</span>
                <h3 className="text-base font-bold text-white mt-1">Stop Perundungan Siber (Cyberbullying)</h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Di balik layar ada manusia nyata dengan perasaan. Berkomunikasilah secara santun, jangan mengejek di grup media sosial, dan jadilah pembela (upstander) jika ada teman yang dirundung.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => { sound.playClick(); setActiveTab('scenarios'); }}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                Mulai Investigasi Kasus
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TERMINAL INVESTIGASI KASUS */}
      {activeTab === 'scenarios' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300">
                  Kasus {scenarioIdx + 1} dari {SECURITY_SCENARIOS.length}: {currentScenario.title}
                </span>
                <p className="text-xs text-slate-400 mt-1">Sumber: {currentScenario.source}</p>
              </div>
              <div className="flex gap-2">
                {SECURITY_SCENARIOS.map((sc, sIdx) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      sound.playClick();
                      setScenarioIdx(sIdx);
                      setSelectedActionId(null);
                      setSelectedReasonId(null);
                      setScenarioFeedback(null);
                    }}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      scenarioIdx === sIdx
                        ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400'
                        : completedScenarios[sc.id]
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {sIdx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Fictitious Incoming Message Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-3 mb-6">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span className="font-mono text-amber-400">[Pesan Digital Masuk]</span>
                <span className="text-slate-500">Konteks: {currentScenario.context}</span>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-yellow-200">
                "{currentScenario.messageText}"
              </div>

              {/* Red flags disclosure */}
              <div className="pt-2">
                <span className="text-xs font-bold text-red-400 flex items-center gap-1.5 mb-1.5">
                  <AlertTriangle className="w-4 h-4" /> Tanda Bahaya (Red Flags) yang Perlu Diwaspadai:
                </span>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                  {currentScenario.redFlags.map((flag, fIdx) => (
                    <li key={fIdx}>{flag}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step 1: Choose Action */}
            <div className="space-y-4 mb-6">
              <span className="text-xs font-bold uppercase text-amber-400 tracking-wider block">
                Langkah 1: Pilih Tindakan yang Paling Tepat & Aman
              </span>
              <div className="space-y-2">
                {currentScenario.actions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => { sound.playClick(); setSelectedActionId(action.id); }}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${
                      selectedActionId === action.id
                        ? 'border-amber-400 bg-amber-500/20 text-white font-semibold'
                        : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                      {selectedActionId === action.id && <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />}
                    </span>
                    <span>{action.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Choose Reason */}
            <div className="space-y-4 mb-6">
              <span className="text-xs font-bold uppercase text-amber-400 tracking-wider block">
                Langkah 2: Jelaskan Alasan Mengapa Tindakan Tersebut Dipilih
              </span>
              <div className="space-y-2">
                {currentScenario.reasons.map(reason => (
                  <button
                    key={reason.id}
                    onClick={() => { sound.playClick(); setSelectedReasonId(reason.id); }}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${
                      selectedReasonId === reason.id
                        ? 'border-amber-400 bg-amber-500/20 text-white font-semibold'
                        : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                      {selectedReasonId === reason.id && <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />}
                    </span>
                    <span>{reason.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback */}
            {scenarioFeedback && (
              <div
                className={`p-4 rounded-xl border text-xs sm:text-sm mb-6 flex items-start gap-3 ${
                  scenarioFeedback.isCorrect
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                    : 'bg-red-950/80 border-red-500 text-red-200'
                }`}
              >
                {scenarioFeedback.isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                )}
                <div>{scenarioFeedback.text}</div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handleEvaluateScenario}
                disabled={!selectedActionId || !selectedReasonId}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  selectedActionId && selectedReasonId
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Verifikasi Keputusan Investigasi
              </button>

              {scenarioFeedback?.isCorrect && (
                <button
                  onClick={handleNextScenario}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25"
                >
                  {scenarioIdx < SECURITY_SCENARIOS.length - 1 ? 'Kasus Berikutnya' : 'Lanjut ke Lab Kata Sandi'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LAB KATA SANDI & 2FA */}
      {activeTab === 'password_lab' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-400" />
              Latihan Analisis Kekuatan Kata Sandi Fiktif
            </h2>

            {/* Safety Warning as instructed by prompt */}
            <div className="p-3.5 rounded-xl bg-blue-950/60 border border-blue-500/40 text-xs text-blue-200 flex items-start gap-2.5 mb-6">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong>Perhatian Keamanan Penting:</strong> Gunakan contoh kata sandi fiktif yang disediakan aplikasi di bawah ini.
                <em> JANGAN PERNAH mengetikkan kata sandi asli akun pribadimu di situs atau aplikasi apa pun untuk tujuan uji coba!</em>
              </div>
            </div>

            {/* Presets buttons */}
            <div className="space-y-2 mb-6">
              <span className="text-xs font-semibold text-slate-400">Pilih Contoh Kata Sandi Fiktif untuk Dianalisis:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {fictitiousPresets.map(preset => (
                  <button
                    key={preset.val}
                    onClick={() => { sound.playClick(); setSamplePassword(preset.val); }}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      samplePassword === preset.val
                        ? 'border-amber-400 bg-amber-500/20 text-white font-bold'
                        : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Evaluation Meter */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Contoh yang Dianalisis: "{samplePassword}"</span>
                <span className={`font-bold ${pwScore >= 80 ? 'text-emerald-400' : pwScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                  Skor Kekuatan: {pwScore}/100
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    pwScore >= 80 ? 'bg-emerald-500' : pwScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${pwScore}%` }}
                />
              </div>

              {/* Checklist criteria */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                <div className={`flex items-center gap-2 ${samplePassword.length >= 8 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span>{samplePassword.length >= 8 ? '✓' : '✗'}</span>
                  <span>Minimal 8-12 karakter ({samplePassword.length} karakter)</span>
                </div>
                <div className={`flex items-center gap-2 ${/[A-Z]/.test(samplePassword) && /[a-z]/.test(samplePassword) ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span>{/[A-Z]/.test(samplePassword) && /[a-z]/.test(samplePassword) ? '✓' : '✗'}</span>
                  <span>Kombinasi Huruf Besar & Kecil</span>
                </div>
                <div className={`flex items-center gap-2 ${/[0-9]/.test(samplePassword) ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span>{/[0-9]/.test(samplePassword) ? '✓' : '✗'}</span>
                  <span>Memuat Angka (0-9)</span>
                </div>
                <div className={`flex items-center gap-2 ${/[^A-Za-z0-9]/.test(samplePassword) ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span>{/[^A-Za-z0-9]/.test(samplePassword) ? '✓' : '✗'}</span>
                  <span>Memuat Simbol Khusus (#, $, @, !, *)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => { sound.playClick(); setActiveTab('practice'); }}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                Lanjut ke Latihan Soal Keamanan
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRACTICE */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300">
                Latihan Soal Wilayah 4 • Soal {practiceIndex + 1} dari {practiceQuestions.length}
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
                        optionClasses = 'border-amber-500 bg-amber-500/20 text-white font-semibold';
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
                        {selectedAnswer === q.correctIndex ? '✓ Sikap Bijakmu Tepat Sekali!' : '✗ Kurang Tepat, Perhatikan Aspek Etika & Keamanan!'}
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
                            ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/25'
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
                            onCompleteRegion('security');
                          }
                        }}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25"
                      >
                        {practiceIndex < practiceQuestions.length - 1 ? 'Soal Berikutnya' : 'Selesaikan Wilayah 4'}
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

      {/* TAB 5: SUMMARY */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase">Misi Berhasil</span>
                <h2 className="text-lg sm:text-xl font-bold text-white">Wilayah 4: Benteng Keamanan Digital Pulih 100%!</h2>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Ringkasan Konsep Utama</span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {REGIONS_META.security.summary}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 space-y-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Penerapan Nyata Sehari-Hari</span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {REGIONS_META.security.realWorldExample}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Pertanyaan Refleksi Siswa</span>
              <p className="text-xs sm:text-sm text-slate-300 italic">
                "{REGIONS_META.security.reflectionQuestion}"
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => { sound.playClick(); setActiveTab('scenarios'); }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium border border-slate-700 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Coba Ulangi Investigasi
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

import React from 'react';
import { RegionId, StudentProgress } from '../../types/game';
import { REGIONS_META } from '../../data/materials';
import { generateCsvReport, generateLearningRecommendation } from '../../utils/rules';
import { sound } from '../../utils/audio';
import {
  FileText,
  Download,
  RotateCcw,
  Award,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  MapPin,
  Sparkles
} from 'lucide-react';

interface ReportViewProps {
  progress: StudentProgress;
  onNavigateToRegion: (regionId: RegionId) => void;
  onRetakePostTest: () => void;
  onBackToMap: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  progress,
  onNavigateToRegion,
  onRetakePostTest,
  onBackToMap
}) => {
  // Generate recommendations
  const recommendation = generateLearningRecommendation(
    progress.preTestScore,
    progress.postTestScore,
    Object.fromEntries(Object.keys(progress.preTestAnswers).map(k => [k, { isCorrect: true }])),
    Object.fromEntries(Object.keys(progress.postTestAnswers).map(k => [k, { isCorrect: true }]))
  );

  const completedRegionNames = (Object.keys(progress.completedRegions) as RegionId[])
    .filter(r => progress.completedRegions[r])
    .map(r => REGIONS_META[r].name);

  const handleDownloadCsv = () => {
    sound.playSuccess();
    const csvContent = generateCsvReport({
      studentName: progress.studentName,
      preScore: progress.preTestScore,
      postScore: progress.postTestScore,
      totalXP: progress.totalXP,
      completedRegions: completedRegionNames,
      understoodTopics: recommendation.understoodTopics,
      reviewTopics: recommendation.reviewTopics,
      timestamp: new Date().toLocaleString('id-ID')
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan_belajar_${progress.studentName || 'siswa'}_kota_digital.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            Laporan Hasil Belajar Siswa
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Penjelajah: {progress.studentName || 'Siswa Hebat BIT'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Mata Pelajaran: Informatika SMP (Kelas VII–IX) • Media Jelajah Kota Digital
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDownloadCsv}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Unduh Hasil (CSV)
          </button>
        </div>
      </div>

      {/* Score Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pre-Test Score */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Nilai Tes Awal (Pre-test)</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">
            {progress.preTestScore} <span className="text-sm font-normal text-slate-500">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400">Pemetaan awal sebelum petualangan.</p>
        </div>

        {/* Post-Test Score */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/40 space-y-1">
          <span className="text-xs text-emerald-400 font-medium">Nilai Tes Akhir (Post-test)</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
            {progress.postTestScore} <span className="text-sm font-normal text-slate-500">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-300">
            {progress.postTestScore - progress.preTestScore >= 0 ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Peningkatan: +{progress.postTestScore - progress.preTestScore} Poin
              </span>
            ) : (
              <span>Hasil evaluasi akhir.</span>
            )}
          </p>
        </div>

        {/* Game XP Award */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/40 space-y-1">
          <span className="text-xs text-amber-400 font-medium">Total XP Petualangan</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
            {progress.totalXP} <span className="text-sm font-normal text-slate-500">XP</span>
          </div>
          <p className="text-[11px] text-slate-400">Terpisah dari nilai tes akademis.</p>
        </div>
      </div>

      {/* Region Completion Progress */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-cyan-400" />
          Status Pemulihan Wilayah Kota Digital
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.keys(REGIONS_META) as RegionId[]).map(rId => {
            const meta = REGIONS_META[rId];
            const isDone = progress.completedRegions[rId];
            return (
              <div
                key={rId}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  isDone ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div>
                  <h3 className="font-bold text-sm text-white">{meta.name}</h3>
                  <span className="text-xs text-slate-400">{meta.badgeTitle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    isDone ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isDone ? 'PULIH 100%' : 'BELUM SELESAI'}
                  </span>
                  <button
                    onClick={() => onNavigateToRegion(rId)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                    title="Buka Wilayah"
                  >
                    Buka
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Learning Recommendation & Analysis */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-400" />
          Analisis Capaian Pembelajaran & Saran Belajar
        </h2>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {recommendation.overallMessage}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Understood topics */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Materi yang Sudah Dipahami Baik:
            </span>
            {recommendation.understoodTopics.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                {recommendation.understoodTopics.map((top, idx) => (
                  <li key={idx}>{top}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">Disarankan memperkuat konsep dasar di semua wilayah.</p>
            )}
          </div>

          {/* Topics to review */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Materi yang Perlu Dipelajari Kembali:
            </span>
            {recommendation.reviewTopics.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                {recommendation.reviewTopics.map((top, idx) => (
                  <li key={idx}>{top}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-emerald-300 font-medium">
                Semua topik pembelajaran telah dikuasai dengan sangat memuaskan!
              </p>
            )}
          </div>
        </div>

        {/* Advice list */}
        <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-1.5 text-xs text-slate-300">
          <span className="font-bold text-blue-400 uppercase tracking-wider block">Catatan Rekomendasi Guru:</span>
          {recommendation.adviceList.map((adv, idx) => (
            <p key={idx}>• {adv}</p>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <button
          onClick={onRetakePostTest}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium border border-slate-700 flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Uji Coba Ulang Tes Akhir
        </button>

        <button
          onClick={onBackToMap}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
        >
          Kembali ke Peta Kota
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { QUESTIONS } from '../../data/questions';
import { evaluateTestAnswers } from '../../utils/rules';
import { sound } from '../../utils/audio';
import {
  Award,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ClipboardCheck,
  Sparkles
} from 'lucide-react';

interface PostTestViewProps {
  onComplete: (score: number, answers: Record<string, number>) => void;
  studentName: string;
}

export const PostTestView: React.FC<PostTestViewProps> = ({ onComplete, studentName }) => {
  const postQuestions = QUESTIONS.filter(q => q.stage === 'post');

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testResult, setTestResult] = useState<ReturnType<typeof evaluateTestAnswers> | null>(null);

  const currentQ = postQuestions[currentIdx];

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (isSubmitted) return;
    sound.playClick();
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmit = () => {
    sound.playCelebrate();
    const result = evaluateTestAnswers(postQuestions.map(q => q.id), answers);
    setTestResult(result);
    setIsSubmitted(true);
  };

  const handleProceedToReport = () => {
    sound.playClick();
    if (testResult) {
      onComplete(testResult.score, answers);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Tahap Evaluasi Akhir</span>
            <h1 className="text-lg sm:text-xl font-bold text-white">Tes Akhir (Post-Test) Pemahaman Konsep</h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Hebat, <strong>{studentName || 'Penjelajah Muda'}</strong>! Kamu telah menjelajahi wilayah-wilayah Kota Digital. Tes akhir ini terdiri dari 8 soal (2 soal untuk setiap wilayah) untuk mengukur penguasaan konsep yang telah kamu pelajari.
        </p>
      </div>

      {!isSubmitted ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          {/* Question Index Progress */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              Soal {currentIdx + 1} dari {postQuestions.length}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {postQuestions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                return (
                  <button
                    key={q.id}
                    onClick={() => { sound.playClick(); setCurrentIdx(idx); }}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      currentIdx === idx
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                        : isAnswered
                        ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Content */}
          <div className="space-y-4">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-emerald-300 inline-block">
              Tujuan: {currentQ.goal}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.question}
            </h2>

            <div className="space-y-2.5">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = answers[currentQ.id] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(currentQ.id, oIdx)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/20 text-white font-semibold shadow-md'
                        : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => { sound.playClick(); setCurrentIdx(prev => Math.max(0, prev - 1)); }}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs sm:text-sm font-medium border border-slate-700"
            >
              Sebelumnya
            </button>

            {currentIdx < postQuestions.length - 1 ? (
              <button
                onClick={() => { sound.playClick(); setCurrentIdx(prev => prev + 1); }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                Selanjutnya
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < postQuestions.length}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                  Object.keys(answers).length >= postQuestions.length
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Kumpulkan Jawaban Tes Akhir
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Explanations after post test */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-300 uppercase">Hasil Tes Akhir</span>
              <h2 className="text-xl font-bold text-white">Nilai: {testResult?.score} / 100</h2>
              <p className="text-xs text-slate-300 mt-1">
                Benar {testResult?.correctCount} dari {testResult?.totalQuestions} soal.
              </p>
            </div>
            <Award className="w-9 h-9 text-yellow-400" />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Pembahasan Lengkap Seluruh Soal:
            </h3>

            {postQuestions.map((q, idx) => {
              const breakdown = testResult?.breakdown[q.id];
              const isCorrect = breakdown?.isCorrect ?? false;
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2 ${
                    isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/40'
                      : 'bg-amber-950/40 border-amber-500/40'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold text-white">
                        {idx + 1}. {q.question}
                      </p>
                      <p className="text-xs text-slate-300 mt-1">
                        Jawabanmu: <strong className={isCorrect ? 'text-emerald-300' : 'text-amber-300'}>{q.options[answers[q.id]]}</strong>
                        {!isCorrect && (
                          <span> (Kunci: <strong className="text-emerald-300">{q.options[q.correctIndex]}</strong>)</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <strong>💡 Pembahasan:</strong> {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleProceedToReport}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
            >
              Buka Laporan Hasil Belajar
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

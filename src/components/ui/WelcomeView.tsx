import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import {
  Bot,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Compass,
  Network,
  HelpCircle,
  Play
} from 'lucide-react';

interface WelcomeViewProps {
  initialName: string;
  onStart: (name: string) => void;
  hasPreTestCompleted: boolean;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  initialName,
  onStart,
  hasPreTestCompleted
}) => {
  const [name, setName] = useState(initialName || '');
  const [showTutorial, setShowTutorial] = useState(false);

  const handleStartGame = () => {
    sound.playSuccess();
    onStart(name.trim() || 'Penjelajah BIT');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-8 animate-fade-in my-auto">
      {/* Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/70 border border-blue-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* BIT Robot Avatar Mascot */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-blue-600 via-cyan-400 to-emerald-400 p-1 shadow-2xl shadow-cyan-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex flex-col items-center justify-center p-3">
                <span className="text-4xl sm:text-5xl">🤖</span>
                <span className="text-xs font-bold text-cyan-300 mt-1">BIT Robot</span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 mt-2 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700">
              Pemandu Kotamu
            </span>
          </div>

          {/* Title & Synopsis */}
          <div className="space-y-3 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              Game Pembelajaran Informatika SMP
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              JELAJAH KOTA DIGITAL
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Kota Digital sedang kehilangan daya! Bersama robot cerdas <strong>BIT</strong>, jelajahi 4 wilayah ilmu komputer: Laboratorium Komputer, Taman Algoritma, Pusat Jaringan, dan Benteng Keamanan Digital untuk memulihkan seluruh sistem kota.
            </p>

            {/* Name Input Form */}
            <div className="pt-3 max-w-md">
              <label htmlFor="student-name-input" className="block text-xs font-semibold text-slate-300 mb-1.5 text-left">
                Masukkan Nama Panggilanmu (Opsional):
              </label>
              <div className="flex gap-2">
                <input
                  id="student-name-input"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={25}
                  placeholder="Contoh: Rian, Siti, atau Budi"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={handleStartGame}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Mulai</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-blue-500/30 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-white">1. Lab Komputer</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Input, CPU, RAM vs SSD, Output visual.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-white">2. Taman Algoritma</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Urutan, perulangan, percabangan, & debugging.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-white">3. Pusat Jaringan</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">LAN mandiri, Switch, Router, paket data.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-white">4. Benteng Keamanan</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Phishing, OTP, 2FA, password, etika digital.</p>
          </div>
        </div>
      </div>

      {/* Tutorial / Help disclosure */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <button
          onClick={() => { sound.playClick(); setShowTutorial(!showTutorial); }}
          className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-slate-300 hover:text-white"
        >
          <div className="flex items-center gap-2 text-cyan-400">
            <HelpCircle className="w-4 h-4" />
            <span>Petunjuk Kontrol & Cara Bermain</span>
          </div>
          <span className="text-xs text-slate-500">{showTutorial ? 'Tutup ▲' : 'Buka ▼'}</span>
        </button>

        {showTutorial && (
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <strong className="text-white block mb-1">🖱️ Interaksi Peta 3D:</strong>
              Klik atau sentuh gedung portal untuk masuk ke wilayah materi. Geser untuk memutar pulau.
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <strong className="text-white block mb-1">🎯 Alur Belajar:</strong>
              Ikuti pola: <em>Amati → Pelajari → Coba Tantangan → Umpan Balik → Simpulkan</em> di setiap wilayah.
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <strong className="text-white block mb-1">📊 Tes & Laporan:</strong>
              Selesaikan Tes Awal (4 soal), tantangan wilayah, dan Tes Akhir (8 soal) untuk mengunduh laporan hasil belajar.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

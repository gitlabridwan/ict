import React, { useState } from 'react';
import { AppSettings } from '../../types/game';
import { sound } from '../../utils/audio';
import {
  Settings,
  Volume2,
  VolumeX,
  Monitor,
  Type,
  Eye,
  RotateCcw,
  AlertTriangle,
  X,
  HardDrive
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetProgress
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleToggleSound = () => {
    sound.playClick();
    const updated = !settings.soundEnabled;
    sound.setMuted(!updated);
    onUpdateSettings({ ...settings, soundEnabled: updated });
  };

  const handleQualityChange = (q: 'high' | 'medium' | 'low') => {
    sound.playClick();
    onUpdateSettings({ ...settings, graphicsQuality: q });
  };

  const handleFontSizeChange = (size: 'normal' | 'large' | 'xlarge') => {
    sound.playClick();
    onUpdateSettings({ ...settings, fontSize: size });
  };

  const handleToggleReduceMotion = () => {
    sound.playClick();
    onUpdateSettings({ ...settings, reduceMotion: !settings.reduceMotion });
  };

  const handleToggle2D = () => {
    sound.playClick();
    onUpdateSettings({ ...settings, use2DFallback: !settings.use2DFallback });
  };

  const handleConfirmReset = () => {
    sound.playError();
    onResetProgress();
    setShowConfirmReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={() => { sound.playClick(); onClose(); }}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          aria-label="Tutup Pengaturan"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Pengaturan & Aksesibilitas</h2>
            <p className="text-xs text-slate-400">Sesuaikan kenyamanan tampilan dan suara untuk perangkatmu</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
              <div>
                <span className="font-bold text-white block">Efek Suara Permainan</span>
                <span className="text-xs text-slate-400">Efek klik, keberhasilan, dan notifikasi</span>
              </div>
            </div>
            <button
              onClick={handleToggleSound}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                settings.soundEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {settings.soundEnabled ? 'Aktif' : 'Mati'}
            </button>
          </div>

          {/* Graphics Quality */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2">
                <Monitor className="w-4 h-4 text-cyan-400" />
                Kualitas Grafis 3D
              </span>
              <span className="text-[11px] text-slate-400 capitalize">{settings.graphicsQuality}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {(['low', 'medium', 'high'] as const).map(q => (
                <button
                  key={q}
                  onClick={() => handleQualityChange(q)}
                  className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                    settings.graphicsQuality === q
                      ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {q === 'low' ? 'Rendah (Hemat)' : q === 'medium' ? 'Sedang' : 'Tinggi (Halus)'}
                </button>
              ))}
            </div>
          </div>

          {/* 2D Fallback View Option */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div>
              <span className="font-bold text-white block">Mode Peta Sederhana (Non-3D)</span>
              <span className="text-xs text-slate-400">Cocok untuk komputer sekolah dengan kartu grafis minim</span>
            </div>
            <button
              onClick={handleToggle2D}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                settings.use2DFallback ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {settings.use2DFallback ? '2D Aktif' : '3D Standar'}
            </button>
          </div>

          {/* Text Size Accessibility */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2">
                <Type className="w-4 h-4 text-purple-400" />
                Ukuran Teks Materi
              </span>
              <span className="text-[11px] text-slate-400 capitalize">{settings.fontSize}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {(['normal', 'large', 'xlarge'] as const).map(sz => (
                <button
                  key={sz}
                  onClick={() => handleFontSizeChange(sz)}
                  className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                    settings.fontSize === sz
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {sz === 'normal' ? 'Normal' : sz === 'large' ? 'Besar' : 'Ekstra Besar'}
                </button>
              ))}
            </div>
          </div>

          {/* Reduce Motion */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-amber-400" />
              <div>
                <span className="font-bold text-white block">Kurangi Animasi (Reduce Motion)</span>
                <span className="text-xs text-slate-400">Meringankan efek transisi yang cepat</span>
              </div>
            </div>
            <button
              onClick={handleToggleReduceMotion}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                settings.reduceMotion ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {settings.reduceMotion ? 'Aktif' : 'Nonaktif'}
            </button>
          </div>

          {/* LocalStorage Note */}
          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
            <HardDrive className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Keterangan Penyimpanan:</strong> Progres belajar, nilai tes, dan XP tersimpan secara otomatis di peramban (browser) dan perangkat ini.
            </span>
          </div>

          {/* Reset Progress Section */}
          <div className="pt-2 border-t border-slate-800">
            {!showConfirmReset ? (
              <button
                onClick={() => { sound.playClick(); setShowConfirmReset(true); }}
                className="w-full py-2.5 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-800/40 text-red-300 text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Seluruh Progres Belajar
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-red-950/60 border border-red-600 space-y-3">
                <div className="flex items-center gap-2 text-red-300 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  Konfirmasi Reset Progres: Apakah kamu yakin?
                </div>
                <p className="text-[11px] text-red-200 leading-relaxed">
                  Semua catatan nilai tes awal, tes akhir, wilayah yang sudah pulih, dan XP akan dikembalikan ke awal.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => { sound.playClick(); setShowConfirmReset(false); }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmReset}
                    className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md"
                  >
                    Ya, Reset Sekarang
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

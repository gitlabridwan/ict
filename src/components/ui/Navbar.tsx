import React from 'react';
import { sound } from '../../utils/audio';
import {
  Sparkles,
  Settings,
  GraduationCap,
  Volume2,
  VolumeX,
  Map,
  FileText,
  ClipboardCheck,
  Bot
} from 'lucide-react';

interface NavbarProps {
  studentName: string;
  totalXP: number;
  currentView: string;
  onNavigate: (view: any) => void;
  onOpenTeacherGuide: () => void;
  onOpenSettings: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  canTakePostTest: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  studentName,
  totalXP,
  currentView,
  onNavigate,
  onOpenTeacherGuide,
  onOpenSettings,
  soundEnabled,
  onToggleSound,
  canTakePostTest
}) => {
  return (
    <header className="w-full bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-4 py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div
          onClick={() => { sound.playClick(); onNavigate('hub'); }}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>JELAJAH KOTA DIGITAL</span>
            </h1>
            <span className="text-[10px] font-medium text-slate-400 block -mt-0.5">
              Informatika SMP Kelas VII–IX
            </span>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Student Profile & XP Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="text-slate-400">Siswa:</span>
            <strong className="text-white max-w-[100px] truncate">{studentName || 'Penjelajah'}</strong>
            <span className="w-px h-3.5 bg-slate-800 mx-0.5" />
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{totalXP} XP</span>
            </div>
          </div>

          {/* Hub Navigation Button (if not on hub) */}
          {currentView !== 'hub' && currentView !== 'welcome' && (
            <button
              onClick={() => { sound.playClick(); onNavigate('hub'); }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <Map className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Peta Kota</span>
            </button>
          )}

          {/* Post Test Quick Button */}
          <button
            onClick={() => { sound.playClick(); onNavigate('post_test'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentView === 'post_test'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Tes Akhir</span>
          </button>

          {/* Report View Button */}
          <button
            onClick={() => { sound.playClick(); onNavigate('report'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentView === 'report'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Laporan</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
            title={soundEnabled ? 'Matikan Efek Suara' : 'Nyalakan Efek Suara'}
            aria-label="Pengaturan Suara"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Teacher Guide Button */}
          <button
            onClick={() => { sound.playClick(); onOpenTeacherGuide(); }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-1 text-xs"
            title="Buka Panduan Guru"
            aria-label="Panduan Guru"
          >
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span className="hidden md:inline font-medium">Guru</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => { sound.playClick(); onOpenSettings(); }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
            title="Pengaturan Tampilan"
            aria-label="Pengaturan"
          >
            <Settings className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>
    </header>
  );
};

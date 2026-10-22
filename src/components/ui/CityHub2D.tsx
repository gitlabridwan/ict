import React from 'react';
import { RegionId } from '../../types/game';
import { REGIONS_META } from '../../data/materials';
import { sound } from '../../utils/audio';
import { Cpu, Compass, Network, ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';

interface CityHub2DProps {
  completedRegions: Record<RegionId, boolean>;
  onSelectRegion: (regionId: RegionId) => void;
}

export const CityHub2D: React.FC<CityHub2DProps> = ({ completedRegions, onSelectRegion }) => {
  const getIcon = (id: RegionId) => {
    switch (id) {
      case 'lab': return <Cpu className="w-8 h-8 text-blue-400" />;
      case 'algorithm': return <Compass className="w-8 h-8 text-emerald-400" />;
      case 'network': return <Network className="w-8 h-8 text-purple-400" />;
      case 'security': return <ShieldCheck className="w-8 h-8 text-amber-400" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
        <h2 className="text-base sm:text-lg font-bold text-white">Peta Wilayah Kota Digital (Mode 2D Sederhana)</h2>
        <p className="text-xs text-slate-400 mt-1">
          Akses cepat 4 wilayah materi pembelajaran untuk kelancaran perangkat sekolah.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(Object.keys(REGIONS_META) as RegionId[]).map(rId => {
          const meta = REGIONS_META[rId];
          const isDone = completedRegions[rId];

          return (
            <div
              key={rId}
              onClick={() => { sound.playClick(); onSelectRegion(rId); }}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer shadow-xl flex flex-col justify-between ${
                isDone
                  ? 'bg-emerald-950/40 border-emerald-500/50 hover:border-emerald-400'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-slate-800/80">
                    {getIcon(rId)}
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    isDone ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isDone ? 'PULIH 100%' : 'BELUM SELESAI'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{meta.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{meta.shortDesc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-cyan-400">
                <span>Masuk ke Wilayah</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

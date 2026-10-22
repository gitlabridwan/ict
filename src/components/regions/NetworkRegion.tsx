import React, { useState } from 'react';
import { NetworkConnection, RegionId } from '../../types/game';
import { REGIONS_META } from '../../data/materials';
import { QUESTIONS } from '../../data/questions';
import { evaluateNetworkTopology } from '../../utils/rules';
import { sound } from '../../utils/audio';
import {
  Network,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Send,
  Monitor,
  Radio,
  Globe,
  Sparkles,
  Info
} from 'lucide-react';

interface NetworkRegionProps {
  onCompleteRegion: (regionId: RegionId) => void;
  onBackToMap: () => void;
  isCompleted: boolean;
}

interface NodeItem {
  id: string;
  name: string;
  role: string;
  type: 'pc' | 'switch' | 'router' | 'internet';
  desc: string;
  x: number; // percentage
  y: number; // percentage
}

const NODES: NodeItem[] = [
  { id: 'pc_a', name: 'Komputer Siswa A', role: 'Klien LAN', type: 'pc', desc: 'Komputer meja di baris depan laboratorium.', x: 18, y: 22 },
  { id: 'pc_b', name: 'Komputer Siswa B', role: 'Klien LAN', type: 'pc', desc: 'Komputer meja di baris tengah laboratorium.', x: 18, y: 50 },
  { id: 'pc_c', name: 'Komputer Siswa C', role: 'Klien LAN', type: 'pc', desc: 'Komputer meja di baris belakang laboratorium.', x: 18, y: 78 },
  { id: 'switch', name: 'Switch Laboratorium', role: 'Penghubung LAN', type: 'switch', desc: 'Meneruskan paket data antar-perangkat di dalam satu ruangan sekolah.', x: 48, y: 50 },
  { id: 'router', name: 'Router Gerbang Sekolah', role: 'Gateway Antarjaringan', type: 'router', desc: 'Menghubungkan jaringan lokal sekolah dengan jaringan luar.', x: 74, y: 50 },
  { id: 'internet', name: 'Internet / Cloud Server', role: 'Jaringan Global', type: 'internet', desc: 'Jaringan raksasa dari jutaan jaringan komputer di seluruh dunia.', x: 92, y: 50 }
];

export const NetworkRegion: React.FC<NetworkRegionProps> = ({
  onCompleteRegion,
  onBackToMap,
  isCompleted
}) => {
  const [activeTab, setActiveTab] = useState<'learn' | 'topology' | 'simulation' | 'practice' | 'summary'>('learn');

  // Cable connection state
  const [connections, setConnections] = useState<NetworkConnection[]>([
    // Start with empty cables or 1 PC connected
  ]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Packet animation state
  const [packetState, setPacketState] = useState<{
    isSending: boolean;
    mode: 'local' | 'internet';
    currentHopIndex: number;
    path: string[];
    logText: string;
  }>({
    isSending: false,
    mode: 'local',
    currentHopIndex: -1,
    path: [],
    logText: 'Siap mengirim paket data uji coba.'
  });

  // Practice state
  const practiceQuestions = QUESTIONS.filter(q => q.regionId === 'network' && q.stage === 'practice');
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);

  const topology = evaluateNetworkTopology(connections);

  const handleNodeClick = (nodeId: string) => {
    sound.playClick();
    if (!selectedNodeId) {
      setSelectedNodeId(nodeId);
      return;
    }

    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
      return;
    }

    // Connect selectedNodeId with nodeId
    const exists = connections.some(
      c => (c.fromId === selectedNodeId && c.toId === nodeId) || (c.fromId === nodeId && c.toId === selectedNodeId)
    );

    if (exists) {
      // Toggle disconnect
      setConnections(prev =>
        prev.filter(
          c => !((c.fromId === selectedNodeId && c.toId === nodeId) || (c.fromId === nodeId && c.toId === selectedNodeId))
        )
      );
    } else {
      setConnections(prev => [...prev, { fromId: selectedNodeId, toId: nodeId }]);
      sound.playSuccess();
    }
    setSelectedNodeId(null);
  };

  const handleQuickConnectAll = () => {
    sound.playClick();
    setConnections([
      { fromId: 'pc_a', toId: 'switch' },
      { fromId: 'pc_b', toId: 'switch' },
      { fromId: 'pc_c', toId: 'switch' },
      { fromId: 'switch', toId: 'router' },
      { fromId: 'router', toId: 'internet' }
    ]);
  };

  const handleResetCables = () => {
    sound.playClick();
    setConnections([]);
    setSelectedNodeId(null);
  };

  // Packet data transmission simulation
  const triggerSendPacket = (mode: 'local' | 'internet') => {
    if (packetState.isSending) return;

    if (mode === 'local' && !topology.canSendLocalData) {
      sound.playError();
      setPacketState(prev => ({
        ...prev,
        logText: 'Gagal: Sambungkan Komputer Siswa A dan Komputer Siswa B ke Switch terlebih dahulu!'
      }));
      return;
    }

    if (mode === 'internet' && !topology.canSendInternetData) {
      sound.playError();
      setPacketState(prev => ({
        ...prev,
        logText: 'Gagal: Komputer harus terhubung ke Switch, Switch ke Router, dan Router ke Internet!'
      }));
      return;
    }

    const path = mode === 'local'
      ? ['pc_a', 'switch', 'pc_b']
      : ['pc_a', 'switch', 'router', 'internet'];

    setPacketState({
      isSending: true,
      mode,
      currentHopIndex: 0,
      path,
      logText: `Paket data mulai dikirim dari ${NODES.find(n => n.id === path[0])?.name}...`
    });

    sound.playStep();

    let hop = 0;
    const interval = setInterval(() => {
      hop++;
      if (hop < path.length) {
        sound.playStep();
        const nodeName = NODES.find(n => n.id === path[hop])?.name;
        setPacketState(prev => ({
          ...prev,
          currentHopIndex: hop,
          logText: `Paket tiba di ${nodeName} (${
            path[hop] === 'switch' ? 'Meneruskan ke alamat lokal penerima' : path[hop] === 'router' ? 'Mengarahkan paket ke luar jaringan' : 'Tiba di tujuan!'
          })`
        }));
      } else {
        clearInterval(interval);
        sound.playSuccess();
        setPacketState(prev => ({
          ...prev,
          isSending: false,
          currentHopIndex: path.length - 1,
          logText: mode === 'local'
            ? 'Sukses! Komputer A dan B berhasil bertukar data secara lokal (LAN) TANPA internet!'
            : 'Sukses! Paket data berhasil melintasi Switch & Router menuju Cloud Server Internet!'
        }));
      }
    }, 1100);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-purple-500/30 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">WILAYAH 3</span>
              {isCompleted && <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">PULIH 100%</span>}
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white">Pusat Jaringan & Transmisi Data</h1>
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
            activeTab === 'learn' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          1. Pelajari Konsep
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('topology'); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'topology' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          2. Sambungkan Kabel Jaringan
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('simulation'); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'simulation' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          3. Kirim Paket Data
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('practice'); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'practice' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          4. Latihan Soal ({practiceQuestions.length})
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('summary'); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'summary' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-slate-800/80 text-slate-400 hover:text-white'
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
              <Sparkles className="w-5 h-5 text-purple-400" />
              Bagaimana Komputer di Seluruh Dunia Saling Terhubung?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Saat kamu mengirim foto atau berkas, komputer tidak mengirimkannya sekaligus sebagai satu gumpalan besar. Data dipecah menjadi unit-unit kecil yang disebut <strong>Paket Data</strong>, yang melintasi kabel atau gelombang nirkabel.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Peran Switch</span>
                <h3 className="text-base font-bold text-white mt-1">Pengatur Lalu Lintas Jaringan Lokal (LAN)</h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Switch menghubungkan berbagai komputer di dalam satu ruangan atau gedung sekolah. <em>Penting:</em> Dua komputer yang terhubung ke Switch yang sama dapat saling bertukar tugas dan printer <strong>tanpa memerlukan koneksi internet sama sekali!</strong>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Peran Router</span>
                <h3 className="text-base font-bold text-white mt-1">Gerbang Antar-Jaringan (Gateway)</h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Jika komputer di sekolah ingin membuka situs luar negeri atau YouTube, Switch tidak bisa melakukannya sendiri. Router berfungsi meneruskan paket data keluar dari jaringan sekolah menuju jaringan penyedia internet global.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Apa itu Internet?</span>
                <h3 className="text-base font-bold text-white mt-1">"Jaringan dari Banyak Jaringan"</h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Internet (Interconnected Network) bukanlah satu komputer raksasa milik satu orang, melainkan jutaan jaringan lokal, kampus, dan instansi yang saling bersepakat berkomunikasi menggunakan aturan standar yang sama (protokol TCP/IP).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Catatan Edukatif</span>
                <h3 className="text-base font-bold text-white mt-1">Penyederhanaan Model Belajar</h3>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Animasi paket data dan sambungan di simulator ini adalah bentuk penyederhanaan visual untuk mempermudah siswa memahami rute data nyata.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => { sound.playClick(); setActiveTab('topology'); }}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
              >
                Mulai Menyambungkan Kabel
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOPOLOGY BUILDER */}
      {activeTab === 'topology' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Tantangan: Bangun Topologi Jaringan Sekolah
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Cara: Klik titik perangkat pertama, lalu klik titik perangkat kedua untuk menyambungkan kabel LAN (kuning).
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleQuickConnectAll}
                  className="px-3 py-1.5 rounded-lg bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-xs font-medium border border-purple-500/50"
                >
                  Sambung Cepat
                </button>
                <button
                  onClick={handleResetCables}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
                >
                  Lepas Semua Kabel
                </button>
              </div>
            </div>

            {/* Interactive Canvas Diagram */}
            <div className="relative w-full h-[380px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden select-none">
              {/* SVG Cables */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {connections.map((c, idx) => {
                  const nodeA = NODES.find(n => n.id === c.fromId);
                  const nodeB = NODES.find(n => n.id === c.toId);
                  if (!nodeA || !nodeB) return null;

                  return (
                    <line
                      key={`${c.fromId}-${c.toId}-${idx}`}
                      x1={`${nodeA.x}%`}
                      y1={`${nodeA.y}%`}
                      x2={`${nodeB.x}%`}
                      y2={`${nodeB.y}%`}
                      stroke="#fbbf24"
                      strokeWidth="3.5"
                      strokeDasharray="6,4"
                      className="animate-pulse"
                    />
                  );
                })}
              </svg>

              {/* Node objects placed on percentage positions */}
              {NODES.map(node => {
                const isSelected = selectedNodeId === node.id;
                let bgBorder = 'border-slate-700 bg-slate-900/90 text-white';
                if (node.type === 'switch') bgBorder = 'border-purple-500/60 bg-purple-950/90 text-purple-200';
                if (node.type === 'router') bgBorder = 'border-blue-500/60 bg-blue-950/90 text-blue-200';
                if (node.type === 'internet') bgBorder = 'border-cyan-500/60 bg-cyan-950/90 text-cyan-200';

                return (
                  <div
                    key={node.id}
                    onClick={() => handleNodeClick(node.id)}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-2xl border-2 transition-all cursor-pointer shadow-lg flex flex-col items-center justify-center min-w-[110px] sm:min-w-[130px] ${bgBorder} ${
                      isSelected
                        ? 'ring-4 ring-yellow-400 border-yellow-400 scale-110 z-20'
                        : 'hover:scale-105 z-10'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-slate-800/80 mb-1">
                      {node.type === 'pc' && <Monitor className="w-5 h-5 text-blue-400" />}
                      {node.type === 'switch' && <Network className="w-5 h-5 text-purple-400" />}
                      {node.type === 'router' && <Radio className="w-5 h-5 text-emerald-400" />}
                      {node.type === 'internet' && <Globe className="w-5 h-5 text-cyan-400" />}
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-center leading-tight">{node.name}</span>
                    <span className="text-[9px] text-slate-400 text-center mt-0.5">{node.role}</span>
                  </div>
                );
              })}

              {/* Hint bottom overlay */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-800 pointer-events-none">
                <span>Kabel Terpasang: {connections.length} sambungan</span>
                <span className="text-yellow-400">
                  {selectedNodeId ? `Pilih perangkat kedua untuk menyambung dengan ${NODES.find(n => n.id === selectedNodeId)?.name}!` : 'Klik salah satu perangkat untuk mulai menyambung.'}
                </span>
              </div>
            </div>

            {/* Topology Status Checklist */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
                topology.isLanConnected
                  ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400'
              }`}>
                {topology.isLanConnected ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4" />}
                <span>Jaringan Lokal (LAN): Seluruh PC terhubung ke Switch</span>
              </div>

              <div className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
                topology.isWanConnected
                  ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400'
              }`}>
                {topology.isWanConnected ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4" />}
                <span>Akses Internet: Switch terhubung ke Router, dan Router ke Internet</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => { sound.playClick(); setActiveTab('simulation'); }}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
              >
                Lanjut ke Simulasi Kirim Data
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PACKET SIMULATION */}
      {activeTab === 'simulation' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Send className="w-5 h-5 text-purple-400" />
              Simulasi Pengiriman Paket Data Real-Time
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
              Uji coba dua skenario pengiriman untuk membuktikan perbedaan lalu lintas lokal (LAN) dan lalu lintas internet global (WAN):
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => triggerSendPacket('local')}
                disabled={packetState.isSending}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <Send className="w-4 h-4" />
                1. Kirim Data Lokal (PC A ke PC B via Switch)
              </button>

              <button
                onClick={() => triggerSendPacket('internet')}
                disabled={packetState.isSending}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-500/20"
              >
                <Globe className="w-4 h-4" />
                2. Kirim Data Internet (PC A ke Cloud via Router)
              </button>
            </div>

            {/* Transmission Log Monitor Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-500 border-b border-slate-800 pb-2">
                <span>[Terminal Monitor Jaringan]</span>
                <span className={packetState.isSending ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}>
                  {packetState.isSending ? 'TRANSMISI AKTIF...' : 'STANDBY'}
                </span>
              </div>
              <p className="text-slate-200">{packetState.logText}</p>

              {/* Hop visualizer */}
              {packetState.path.length > 0 && (
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  {packetState.path.map((nodeId, idx) => {
                    const node = NODES.find(n => n.id === nodeId);
                    const isPassed = idx <= packetState.currentHopIndex;
                    const isCurrent = idx === packetState.currentHopIndex;
                    return (
                      <React.Fragment key={nodeId}>
                        <div
                          className={`px-3 py-1 rounded-lg border text-[11px] font-sans font-bold flex items-center gap-1.5 ${
                            isCurrent
                              ? 'bg-yellow-400 text-slate-950 border-yellow-300 scale-105 shadow-md shadow-yellow-400/30'
                              : isPassed
                              ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                              : 'bg-slate-900 border-slate-800 text-slate-500'
                          }`}
                        >
                          <span>{node?.name}</span>
                        </div>
                        {idx < packetState.path.length - 1 && (
                          <span className="text-slate-600 font-bold">➔</span>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Educational Disclaimer */}
            <div className="mt-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
              <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong>Catatan Edukatif:</strong> Animasi perjalanan paket di atas merupakan representasi dan penyederhanaan pedagogis konsep jaringan untuk membantu pemahaman siswa. Dalam jaringan nyata, jutaan paket data bergerak mendekati kecepatan cahaya dan diatur oleh protokol TCP/IP.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => { sound.playClick(); setActiveTab('practice'); }}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
              >
                Lanjut ke Latihan Soal Jaringan
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
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300">
                Latihan Soal Wilayah 3 • Soal {practiceIndex + 1} dari {practiceQuestions.length}
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
                        optionClasses = 'border-purple-500 bg-purple-500/20 text-white font-semibold';
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
                        {selectedAnswer === q.correctIndex ? '✓ Analisis Jaringanmu Benar!' : '✗ Belum Tepat, Ingat Kembali Peran Switch vs Router!'}
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
                            ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/25'
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
                            onCompleteRegion('network');
                          }
                        }}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25"
                      >
                        {practiceIndex < practiceQuestions.length - 1 ? 'Soal Berikutnya' : 'Selesaikan Wilayah 3'}
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
          <div className="bg-slate-900/90 border border-purple-500/40 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase">Selamat! Misi Selesai</span>
                <h2 className="text-lg sm:text-xl font-bold text-white">Wilayah 3: Pusat Jaringan Pulih 100%!</h2>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Ringkasan Konsep Utama</span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {REGIONS_META.network.summary}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-2">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Penerapan Nyata Sehari-Hari</span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {REGIONS_META.network.realWorldExample}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Pertanyaan Refleksi Siswa</span>
              <p className="text-xs sm:text-sm text-slate-300 italic">
                "{REGIONS_META.network.reflectionQuestion}"
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => { sound.playClick(); setActiveTab('topology'); }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium border border-slate-700 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Coba Ulangi Topologi Jaringan
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

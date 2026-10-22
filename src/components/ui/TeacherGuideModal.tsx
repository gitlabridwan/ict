import React from 'react';
import { sound } from '../../utils/audio';
import {
  GraduationCap,
  Clock,
  BookOpen,
  ListOrdered,
  MessageCircleQuestion,
  X,
  FileCheck2,
  Lightbulb
} from 'lucide-react';

interface TeacherGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto space-y-6">
        {/* Close Button */}
        <button
          onClick={() => { sound.playClick(); onClose(); }}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          aria-label="Tutup Panduan Guru"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Modul Pedagogis</span>
            <h2 className="text-xl font-bold text-white">Panduan Guru: Jelajah Kota Digital</h2>
          </div>
        </div>

        {/* 1. Alokasi Waktu & Sasaran */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
            <Clock className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <span className="text-slate-400 block">Perkiraan Durasi Belajar</span>
              <strong className="text-white text-sm">30 – 40 Menit</strong> (Dapat dipecah per wilayah)
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-slate-400 block">Sasaran Siswa</span>
              <strong className="text-white text-sm">SMP Kelas VII, VIII, atau IX</strong>
            </div>
          </div>
        </div>

        {/* 2. Tujuan Pembelajaran */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            Tujuan Pembelajaran (Learning Objectives):
          </h3>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800 leading-relaxed">
            <li>Siswa mampu <strong>mengelompokkan perangkat komputer</strong> berdasarkan fungsinya (Input, Pemrosesan, Output, Penyimpanan) serta membedakan RAM dan SSD secara akurat.</li>
            <li>Siswa mampu <strong>menyusun algoritma instruksi</strong> dengan konsep urutan (sequence), perulangan (loop), percabangan (conditional), dan melakukan perbaikan kesalahan (debugging).</li>
            <li>Siswa mampu <strong>menjelaskan peran dasar perangkat jaringan</strong> (Switch pada jaringan lokal dan Router antarjaringan) serta memahami cara kerja perjalanan paket data.</li>
            <li>Siswa mampu <strong>menentukan tindakan aman dan beretika</strong> dalam menghadapi phishing, kode OTP, kata sandi, privasi, serta mencegah perundungan siber (cyberbullying).</li>
          </ul>
        </div>

        {/* 3. Langkah Penggunaan di Kelas */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-blue-400" />
            Sintaks Pembelajaran di Kelas:
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <strong className="text-blue-400">1. Pendahuluan (5 Menit):</strong> Guru memotivasi siswa dengan cerita kota digital yang kehilangan energi, meminta siswa memasukkan nama panggilan, dan mengerjakan 4 soal tes awal (pre-test) secara mandiri.
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <strong className="text-emerald-400">2. Eksplorasi Mandiri (20–25 Menit):</strong> Siswa menjelajahi 4 wilayah secara berurutan atau acak. Di setiap wilayah terdapat siklus: <em>Amati → Pelajari → Coba Tantangan → Umpan Balik → Simpulkan</em>.
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <strong className="text-purple-400">3. Evaluasi & Refleksi (10 Menit):</strong> Siswa mengerjakan tes akhir (8 soal), mengunduh laporan hasil dalam format CSV untuk diserahkan ke guru, dan melakukan diskusi refleksi bersama.
            </div>
          </div>
        </div>

        {/* 4. Cara Membaca Hasil & Rubrik */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            Cara Membaca Hasil Belajar Siswa:
          </h3>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
            <p><strong>• Pemisahan XP dan Nilai:</strong> XP petualangan berfungsi sebagai gamifikasi motivasi yang tidak menggandakan poin saat replay. Nilai tes dihitung murni secara akademis: (Jumlah Jawaban Benar / Jumlah Soal) × 100.</p>
            <p><strong>• Peningkatan Nilai (Gain Score):</strong> Bandingkan nilai tes awal dan tes akhir siswa untuk melihat efektivitas pembelajaran interaktif.</p>
            <p><strong>• Rekomendasi Adaptif:</strong> Laporan hasil memberikan analisis topik yang sudah dipahami dan topik yang perlu diulang secara objektif dan suportif.</p>
          </div>
        </div>

        {/* 5. Pertanyaan Refleksi Siswa */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageCircleQuestion className="w-4 h-4 text-pink-400" />
            Pertanyaan Pemantik Diskusi & Refleksi Pasca Bermain:
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-pink-950/30 border border-pink-500/30 text-slate-200">
              💬 <em>"Konsep apa yang paling banyak kamu gunakan untuk menyelesaikan tantangan coding robot BIT?"</em>
            </div>
            <div className="p-3 rounded-xl bg-pink-950/30 border border-pink-500/30 text-slate-200">
              💬 <em>"Kesalahan apa yang sempat terjadi saat robot menabrak rintangan, dan bagaimana kamu memperbaikinya (debugging)?"</em>
            </div>
            <div className="p-3 rounded-xl bg-pink-950/30 border border-pink-500/30 text-slate-200">
              💬 <em>"Bagaimana konsep Switch dan Router atau keamanan kata sandi diterapkan dalam aktivitas sehari-harimu di rumah atau sekolah?"</em>
            </div>
          </div>
        </div>

        {/* Close footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-blue-500/25"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};

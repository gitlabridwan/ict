import { HardwareItem, RegionId, SecurityScenario } from '../types/game';

export interface RegionMeta {
  id: RegionId;
  name: string;
  badgeTitle: string;
  icon: string;
  themeColor: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  shortDesc: string;
  learningGoals: string[];
  summary: string;
  realWorldExample: string;
  reflectionQuestion: string;
}

export const REGIONS_META: Record<RegionId, RegionMeta> = {
  lab: {
    id: 'lab',
    name: 'Wilayah 1: Laboratorium Komputer',
    badgeTitle: 'Pakar Perangkat Keras',
    icon: 'Cpu',
    themeColor: '#3b82f6', // Biru
    accentBg: 'bg-blue-500/10',
    accentBorder: 'border-blue-500',
    accentText: 'text-blue-500',
    shortDesc: 'Pelajari peran perangkat Input, Pemrosesan, Output, dan Penyimpanan dalam sistem komputer.',
    learningGoals: [
      'Mengelompokkan perangkat komputer berdasarkan fungsinya secara tepat.',
      'Memahami CPU sebagai unit pemroses instruksi utama.',
      'Membedakan RAM sebagai memori kerja sementara dan SSD sebagai media simpan permanen.'
    ],
    summary: 'Sistem komputer bekerja melalui siklus IPO-S (Input - Process - Output - Storage). Data dimasukkan lewat perangkat input (misalnya keyboard/mouse), diproses oleh CPU menggunakan RAM sebagai ruang kerja aktif, ditampilkan hasilnya melalui output (monitor/printer), dan disimpan aman ke SSD/harddisk.',
    realWorldExample: 'Saat kamu mengetik pesan di aplikasi obrolan ponsel, layar sentuh menerima ketikanmu (Input), prosesor mengolah teks dan emoji (Processing), layar menampilkan balon obrolanmu (Output), dan riwayat pesan disimpan di penyimpanan ponsel (Storage).',
    reflectionQuestion: 'Apa yang akan terjadi pada dokumen yang sedang kamu ketik jika tiba-tiba komputer kehilangan daya sebelum kamu menekan tombol Simpan?'
  },
  algorithm: {
    id: 'algorithm',
    name: 'Wilayah 2: Taman Algoritma',
    badgeTitle: 'Master Algoritma & Debugging',
    icon: 'Compass',
    themeColor: '#10b981', // Hijau Toska
    accentBg: 'bg-emerald-500/10',
    accentBorder: 'border-emerald-500',
    accentText: 'text-emerald-500',
    shortDesc: 'Susun instruksi langkah demi langkah, manfaatkan perulangan, dan perbaiki kode yang salah (debugging).',
    learningGoals: [
      'Menyusun urutan instruksi logis untuk memandu robot BIT ke tujuan.',
      'Menggunakan perulangan (loop) untuk menyederhanakan kode berulang.',
      'Menerapkan percabangan (kondisi) dan melakukan debugging saat terjadi kesalahan jalur.'
    ],
    summary: 'Algoritma adalah deretan langkah terurut dan logis untuk menyelesaikan suatu masalah. Tiga struktur dasar kontrol adalah Urutan (Sequence), Perulangan (Looping), dan Percabangan (Conditional). Jika robot tidak sampai ke tujuan, kita melakukan proses Debugging untuk menemukan dan memperbaiki letak kekeliruan.',
    realWorldExample: 'Aplikasi navigasi peta (GPS) menggunakan algoritma pencarian rute tercepat. Jika jalan utama macet (percabangan kondisi), aplikasi otomatis mengarahkanmu ke jalan alternatif yang lancar.',
    reflectionQuestion: 'Mengapa menulis perintah menggunakan perulangan lebih baik dibandingkan menuliskan langkah maju secara berulang-ulang?'
  },
  network: {
    id: 'network',
    name: 'Wilayah 3: Pusat Jaringan',
    badgeTitle: 'Insinyur Jaringan Digital',
    icon: 'Network',
    themeColor: '#8b5cf6', // Ungu
    accentBg: 'bg-purple-500/10',
    accentBorder: 'border-purple-500',
    accentText: 'text-purple-500',
    shortDesc: 'Ketahui bagaimana komputer saling terhubung melalui Switch, Router, hingga jaringan global Internet.',
    learningGoals: [
      'Menjelaskan perbedaan peran Switch pada jaringan lokal (LAN) dan Router antarjaringan.',
      'Memahami bahwa jaringan lokal dapat bertukar data tanpa bergantung pada internet.',
      'Mengamati bagaimana paket data mengalir dari pengirim ke penerima.'
    ],
    summary: 'Switch bertindak seperti pengatur lalu lintas di dalam satu ruangan (LAN), menghubungkan komputer secara lokal. Router bertindak seperti gerbang tol antar-kota yang menghubungkan jaringan lokal ke jaringan luar (Internet). Paket data adalah potongan kecil informasi yang dikirimkan melewati jalur jaringan.',
    realWorldExample: 'Di laboratorium sekolah, guru dapat membagikan file modul ujian ke seluruh komputer siswa melalui Switch lokal, meskipun saat itu kuota internet sekolah sedang terputus!',
    reflectionQuestion: 'Kapan sebuah komputer hanya membutuhkan Switch, dan kapan komputer tersebut memerlukan Router?'
  },
  security: {
    id: 'security',
    name: 'Wilayah 4: Benteng Keamanan Digital',
    badgeTitle: 'Ksatria Keamanan Siber',
    icon: 'ShieldCheck',
    themeColor: '#f59e0b', // Kuning/Amber
    accentBg: 'bg-amber-500/10',
    accentBorder: 'border-amber-500',
    accentText: 'text-amber-500',
    shortDesc: 'Kenali ancaman phishing, buat kata sandi kokoh, aktifkan 2FA, dan terapkan etika berkomunikasi digital.',
    learningGoals: [
      'Mengenali tanda bahaya pesan palsu (phishing) dan menjaga kerahasiaan OTP/kata sandi.',
      'Memahami pentingnya Autentikasi Dua Faktor (2FA) dan kombinasi kata sandi kuat.',
      'Menunjukkan sikap santun, melindungi privasi sesama, serta mencegah cyberbullying di dunia maya.'
    ],
    summary: 'Keamanan digital bukan hanya tentang teknologi canggih, melainkan kebiasaan berpikir kritis pengguna. Waspadai tawaran instan yang meminta data rahasia, jangan gunakan kata sandi yang sama di banyak akun, dan selalu jaga kesantunan serta privasi orang lain di internet.',
    realWorldExample: 'Sama seperti memakai kunci ganda pada gerbang rumah (gembok fisik dan kunci pintu), Autentikasi Dua Faktor (2FA) memastikan akunmu tidak bisa dibobol orang asing walaupun kata sandimu sempat diketahui orang lain.',
    reflectionQuestion: 'Tindakan apa yang akan kamu lakukan jika melihat ada teman yang diejek di grup media sosial sekolah?'
  }
};

// 8 Objek Laboratorium Komputer
export const HARDWARE_ITEMS: HardwareItem[] = [
  {
    id: 'keyboard',
    name: 'Keyboard',
    category: 'input',
    description: 'Papan tombol ketik untuk memasukkan huruf, angka, dan perintah.',
    detail: 'Perangkat input utama yang mengirimkan kode karakter ketika tombol ditekan oleh jari pengguna.',
    color: '#0284c7',
    iconName: 'Keyboard'
  },
  {
    id: 'mouse',
    name: 'Mouse',
    category: 'input',
    description: 'Perangkat penunjuk untuk menggerakkan kursor dan memilih objek di layar.',
    detail: 'Mendeteksi gerakan dua dimensi pada alas meja dan menerjemahkannya menjadi perpindahan kursor di layar komputer.',
    color: '#0284c7',
    iconName: 'Mouse'
  },
  {
    id: 'mic',
    name: 'Mikrofon',
    category: 'input',
    description: 'Menangkap suara gelombang akustik menjadi sinyal audio digital.',
    detail: 'Digunakan untuk merekam suara, panggilan audio, atau memberikan perintah suara ke komputer.',
    color: '#0284c7',
    iconName: 'Mic'
  },
  {
    id: 'cpu',
    name: 'CPU (Processor)',
    category: 'processing',
    description: 'Otak komputer yang mengeksekusi instruksi dan menghitung logika sistem.',
    detail: 'Menjalankan instruksi dari program (fetch-decode-execute), mengendalikan aliran data, dan mengoordinasikan seluruh komponen.',
    color: '#10b981',
    iconName: 'Cpu'
  },
  {
    id: 'ram',
    name: 'RAM (Memori Kerja)',
    category: 'storage', // or processing/memory - prompt specifies: "RAM merupakan memori kerja sementara. SSD menyimpan data secara persisten. Bedakan RAM dan SSD dengan jelas." We categorize RAM as temporary memory / storage with explicit note!
    description: 'Memori kerja berkecepatan tinggi yang menyimpan data sementara saat komputer aktif.',
    detail: 'Bersifat Volatile: semua data di dalamnya akan terhapus otomatis begitu komputer dimatikan atau kehilangan daya listrik.',
    color: '#f59e0b',
    iconName: 'Layers'
  },
  {
    id: 'ssd',
    name: 'SSD (Penyimpanan Tetap)',
    category: 'storage',
    description: 'Media penyimpanan sekunder untuk menyimpan sistem operasi dan berkas secara permanen.',
    detail: 'Bersifat Non-Volatile: data tetap aman tersimpan di dalam chip flash walau komputer dimatikan.',
    color: '#f59e0b',
    iconName: 'HardDrive'
  },
  {
    id: 'monitor',
    name: 'Monitor',
    category: 'output',
    description: 'Layar visual untuk menampilkan teks, gambar, dan antarmuka hasil pemrosesan.',
    detail: 'Mengubah sinyal video dari kartu grafis menjadi tampilan piksel warna yang dapat dilihat langsung oleh mata pengguna.',
    color: '#ec4899',
    iconName: 'Tv'
  },
  {
    id: 'printer',
    name: 'Printer',
    category: 'output',
    description: 'Perangkat cetak yang menghasilkan salinan dokumen fisik di atas kertas.',
    detail: 'Menerima data digital dari komputer lalu menyemprotkan tinta atau toner untuk mencetak teks dan gambar pada media kertas.',
    color: '#ec4899',
    iconName: 'Printer'
  }
];

// Wilayah 4: 5 Skenario Keamanan Digital
export const SECURITY_SCENARIOS: SecurityScenario[] = [
  {
    id: 'sec_1',
    title: 'Skenario 1: Pesan Hadiah Diamond Game',
    source: 'Pesan Singkat (SMS / Chat)',
    context: 'Kamu menerima pesan WhatsApp dari akun bernomor acak: "Selamat! Akunmu terpilih memenangkan 10.000 Diamond Game. Segera klaim hadiahmu sebelum 1 jam dengan mengirimkan username dan kata sandi akunmu ke nomor ini!"',
    messageText: 'SELAMAT! Anda menang 10.000 Diamond. Balas pesan ini dengan KATA SANDI akun Anda untuk verifikasi klaim hadiah!',
    redFlags: [
      'Meminta informasi rahasia (kata sandi) yang tidak pernah diminta oleh pengembang resmi.',
      'Menciptakan rasa panik / terburu-buru ("sebelum 1 jam").',
      'Pengirim menggunakan nomor telepon pribadi yang tidak terverifikasi.'
    ],
    actions: [
      { id: 'act_1a', text: 'Abaikan pesan, jangan berikan kata sandi, dan laporkan kontak sebagai spam.', isCorrect: true },
      { id: 'act_1b', text: 'Kirimkan kata sandi sekarang juga karena hadiah diamond sangat langka.', isCorrect: false },
      { id: 'act_1c', text: 'Minta teman mengirimkan kata sandi mereka sebagai gantinya.', isCorrect: false }
    ],
    reasons: [
      { id: 'res_1a', text: 'Kata sandi bersifat rahasia mutlak dan pengembang resmi tidak akan pernah meminta kata sandi pengguna.', isCorrect: true },
      { id: 'res_1b', text: 'Agar diamond langsung masuk ke akun tanpa perlu membeli.', isCorrect: false },
      { id: 'res_1c', text: 'Karena nomor pengirim memiliki foto profil robot.', isCorrect: false }
    ],
    recommendation: 'Jika menerima iming-iming hadiah mencurigakan, selalu verifikasi lewat kanal resmi dan jangan pernah membagikan password atau token otentikasi kepada siapa pun!'
  },
  {
    id: 'sec_2',
    title: 'Skenario 2: Permintaan Kode OTP',
    source: 'Panggilan Telepon / Pesan',
    context: 'Seseorang meneleponmu mengaku sebagai customer service aplikasi ojek online / belanja: "Halo Dik, kami salah memasukkan nomor dan kode 6 angka (OTP) terkirim ke ponsel adik. Tolong bacakan kodenya sekarang ya!"',
    messageText: 'Kode OTP Rahasia Anda adalah: 849-210. JANGAN BAGIKAN KODE INI KEPADA SIAPA PUN TERMASUK PIHAK APLIKASI.',
    redFlags: [
      'Pesan SMS sudah bertuliskan secara tegas: JANGAN BAGIKAN KODE INI.',
      'Pelaku memanfaatkan alasan "salah kirim" untuk membajak akun korban.',
      'Kode OTP adalah kunci akses masuk instan ke akunmu.'
    ],
    actions: [
      { id: 'act_2a', text: 'Tolak dengan tegas dan jangan beritahu 6 angka OTP tersebut kepada penelpon.', isCorrect: true },
      { id: 'act_2b', text: 'Beri tahu kodenya karena kasihan penelpon mengaku salah nomor.', isCorrect: false },
      { id: 'act_2c', text: 'Tuliskan kode OTP di status WhatsApp.', isCorrect: false }
    ],
    reasons: [
      { id: 'res_2a', text: 'Kode OTP adalah kunci verifikasi rahasia satu kali pakai untuk mengamankan akun dari pembajakan.', isCorrect: true },
      { id: 'res_2b', text: 'Karena customer service berhak mengetahui semua kode pengguna.', isCorrect: false },
      { id: 'res_2c', text: 'Supaya pulsa ponsel tidak berkurang.', isCorrect: false }
    ],
    recommendation: 'Kode OTP ibarat kunci rumah. Memberikan kode OTP sama saja dengan menyerahkan kunci rumahmu kepada orang asing yang mencurigakan!'
  },
  {
    id: 'sec_3',
    title: 'Skenario 3: Penyebaran Foto Tanpa Izin',
    source: 'Grup WhatsApp / Media Sosial',
    context: 'Saat istirahat jam pelajaran, seorang teman memotret teman lain yang sedang tersedak minuman hingga wajahnya terlihat aneh. Ia mengajakmu mengunggah foto itu ke media sosial sekolah untuk bahan lelucon.',
    messageText: '"Lihat nih foto muka si Doni lagi keselek! Lucu banget, ayo kita bikin meme terus posting di Instagram kelas biar viral!"',
    redFlags: [
      'Mengambil dan mempublikasikan foto pribadi orang lain tanpa izin (pelanggaran privasi).',
      'Berpotensi mempermalukan orang lain dan menimbulkan cyberbullying (perundungan siber).',
      'Jejak digital sulit dihapus begitu tersebar ke publik.'
    ],
    actions: [
      { id: 'act_3a', text: 'Menolak ajakan tersebut dan menasihati teman agar menghapus foto karena melanggar privasi.', isCorrect: true },
      { id: 'act_3b', text: 'Ikut membagikan ke seluruh media sosial agar akun kelas mendapat banyak like.', isCorrect: false },
      { id: 'act_3c', text: 'Menambahkan kata-kata ejekan baru agar semakin lucu.', isCorrect: false }
    ],
    reasons: [
      { id: 'res_3a', text: 'Setiap individu berhak atas privasi diri, dan mempublikasikan foto tanpa izin dapat merugikan serta menyakiti perasaan teman.', isCorrect: true },
      { id: 'res_3b', text: 'Supaya kita terkenal sebagai pembuat lelucon terbaik di sekolah.', isCorrect: false },
      { id: 'res_3c', text: 'Karena foto lucu otomatis menjadi milik umum.', isCorrect: false }
    ],
    recommendation: 'Selalu terapkan prinsip "Pikir Dahulu Sebelum Membagikan" (Think Before You Share). Hormati batasan dan perasaan orang lain di ruang digital.'
  },
  {
    id: 'sec_4',
    title: 'Skenario 4: Etika Berkomunikasi di Grup Kelas',
    source: 'Forum Diskusi Daring Sekolah',
    context: 'Seorang teman kesulitan menjawab tugas di grup kelas. Siswa lain kemudian membalas dengan kalimat menghina: "Dasar bodoh, soal semudah ini saja tidak bisa!"',
    messageText: 'Komentar kasar di grup: "Kamu payah banget, nggak usah sekolah aja sekalian!"',
    redFlags: [
      'Pelanggaran netiket (etika berkomunikasi di internet).',
      'Ujaran perundungan dan kata-kata yang menjatuhkan mental orang lain.',
      'Menciptakan lingkungan belajar digital yang tidak aman dan tidak bersahabat.'
    ],
    actions: [
      { id: 'act_4a', text: 'Mengingatkan secara sopan untuk menggunakan bahasa yang santun dan membantu teman yang kesulitan.', isCorrect: true },
      { id: 'act_4b', text: 'Membalas dengan kata makian yang lebih pedas agar terjadi pertengkaran ramai.', isCorrect: false },
      { id: 'act_4c', text: 'Mengirimkan stiker tertawa untuk menyemangati si penghina.', isCorrect: false }
    ],
    reasons: [
      { id: 'res_4a', text: 'Ruang digital harus dijaga agar tetap sehat, saling menghargai, dan mendukung satu sama lain dalam belajar.', isCorrect: true },
      { id: 'res_4b', text: 'Karena di media sosial kita bebas menghina siapa saja tanpa aturan.', isCorrect: false },
      { id: 'res_4c', text: 'Agar orang yang dihina merasa semakin terpojok.', isCorrect: false }
    ],
    recommendation: 'Jadilah upstander yang positif. Gunakan kalimat santun, bangun empati, dan bantu teman yang membutuhkan di setiap platform diskusi.'
  },
  {
    id: 'sec_5',
    title: 'Skenario 5: Manajemen Kata Sandi',
    source: 'Pengaturan Akun Siswa',
    context: 'Eko menggunakan kata sandi yang sama persis ("eko123") untuk akun email belajar, akun game online, akun media sosial, dan akun perpustakaan sekolah agar tidak lupa.',
    messageText: 'Password untuk semua akun: "eko123". Mudah diingat, tapi apakah aman?',
    redFlags: [
      'Menggunakan kata sandi lemah (nama diri + angka berurutan).',
      'Menggunakan satu kata sandi yang sama untuk semua layanan (Credential Reuse).',
      'Jika satu akun bocor, seluruh akun lainnya otomatis ikut terancam dibobol!'
    ],
    actions: [
      { id: 'act_5a', text: 'Ganti dengan kata sandi unik berbeda untuk tiap akun, buat kombinasi huruf-angka-simbol, dan aktifkan 2FA.', isCorrect: true },
      { id: 'act_5b', text: 'Tetap gunakan "eko123" karena mengubah kata sandi hanya membuang waktu.', isCorrect: false },
      { id: 'act_5c', text: 'Ganti menjadi "123456" agar lebih mudah diketik di ponsel teman.', isCorrect: false }
    ],
    reasons: [
      { id: 'res_5a', text: 'Kata sandi yang berbeda dan kuat membatasi risiko peretasan berantai jika salah satu layanan mengalami kebocoran data.', isCorrect: true },
      { id: 'res_5b', text: 'Karena peretas tidak tertarik pada akun siswa.', isCorrect: false },
      { id: 'res_5c', text: 'Supaya kita tidak perlu mencatat kata sandi.', isCorrect: false }
    ],
    recommendation: 'Gunakan frasa sandi (passphrase) yang unik, panjang, dan mudah diingat oleh dirimu sendiri (contoh: "Kucing#Makan$Bakso26!"), serta manfaatkan pengelola kata sandi atau catatan aman!'
  }
];

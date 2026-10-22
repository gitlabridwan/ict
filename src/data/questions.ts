import { Question } from '../types/game';

export const QUESTIONS: Question[] = [
  // ==========================================
  // WILAYAH 1: LABORATORIUM KOMPUTER (6 SOAL)
  // ==========================================
  // 1. Pre-Test (Wilayah 1)
  {
    id: 'q_pre_lab',
    regionId: 'lab',
    stage: 'pre',
    question: 'Di laboratorium sekolah, Budi mengetik naskah tugas di komputer. Perangkat manakah yang berfungsi memasukkan karakter huruf ke dalam sistem komputer?',
    options: ['Monitor', 'Keyboard', 'Speaker', 'Printer'],
    correctIndex: 1,
    explanation: 'Keyboard adalah perangkat masukan (input) yang digunakan untuk memasukkan data berupa karakter, huruf, angka, dan perintah ke dalam komputer.',
    goal: 'Mengelompokkan perangkat komputer berdasarkan fungsinya (Input, Pemrosesan, Output, Penyimpanan).'
  },
  // 2. Practice (Wilayah 1 - Soal 1)
  {
    id: 'q_prac_lab_1',
    regionId: 'lab',
    stage: 'practice',
    question: 'Saat komputer dimatikan secara mendadak, data aplikasi yang belum sempat disimpan akan hilang dari memori. Komponen manakah yang bekerja sebagai memori kerja sementara tersebut?',
    options: ['RAM (Random Access Memory)', 'SSD (Solid State Drive)', 'Flashdisk', 'Harddisk'],
    correctIndex: 0,
    explanation: 'RAM bersifat volatile (sementara), yaitu hanya menyimpan data dan instruksi selama komputer mendapatkan daya listrik. Untuk penyimpanan permanen digunakan media seperti SSD atau Harddisk.',
    goal: 'Membedakan karakteristik dan fungsi RAM sebagai memori sementara dan SSD sebagai media penyimpanan tetap.'
  },
  // 3. Practice (Wilayah 1 - Soal 2)
  {
    id: 'q_prac_lab_2',
    regionId: 'lab',
    stage: 'practice',
    question: 'Komponen yang sering disebut sebagai "otak komputer" karena bertugas mengeksekusi instruksi program dan melakukan perhitungan logika adalah...',
    options: ['Monitor', 'CPU (Central Processing Unit)', 'Keyboard', 'Power Supply'],
    correctIndex: 1,
    explanation: 'CPU (Processor) berfungsi menjalankan instruksi perangkat lunak, memproses data, serta mengendalikan operasi seluruh sistem komputer.',
    goal: 'Memahami peran CPU sebagai pusat pemrosesan instruksi dalam sistem komputer.'
  },
  // 4. Practice (Wilayah 1 - Soal 3)
  {
    id: 'q_prac_lab_3',
    regionId: 'lab',
    stage: 'practice',
    question: 'Manakah di bawah ini yang seluruh anggotanya merupakan perangkat keluaran (output)?',
    options: [
      'Monitor, Printer, Speaker',
      'Keyboard, Mouse, Mikrofon',
      'CPU, RAM, Motherboard',
      'SSD, Flashdisk, Scanner'
    ],
    correctIndex: 0,
    explanation: 'Monitor (tampilan visual), Printer (cetakan fisik), dan Speaker (keluaran suara) semuanya berfungsi menampilkan hasil pemrosesan komputer kepada pengguna.',
    goal: 'Mengidentifikasi kelompok perangkat keluaran (output).'
  },
  // 5. Post-Test (Wilayah 1 - Soal 1)
  {
    id: 'q_post_lab_1',
    regionId: 'lab',
    stage: 'post',
    question: 'Rani merekam suaranya untuk tugas podcast sekolah. Perangkat keras yang digunakan untuk menangkap gelombang suara menjadi sinyal digital pada komputer adalah...',
    options: ['Speaker', 'Mikrofon', 'Webcam', 'Sound Card'],
    correctIndex: 1,
    explanation: 'Mikrofon berfungsi sebagai perangkat input suara yang mengubah getaran suara menjadi data sinyal digital agar dapat diproses oleh komputer.',
    goal: 'Mengelompokkan perangkat komputer berdasarkan fungsinya (Input).'
  },
  // 6. Post-Test (Wilayah 1 - Soal 2)
  {
    id: 'q_post_lab_2',
    regionId: 'lab',
    stage: 'post',
    question: 'Mengapa komputer memerlukan SSD di samping adanya RAM?',
    options: [
      'Karena RAM hanya dapat menampilkan grafik ke layar monitor.',
      'Karena RAM menyimpan data secara sementara saat komputer menyala, sedangkan SSD menyimpan file secara permanen walaupun komputer mati.',
      'Karena SSD bertugas menghitung instruksi aritmatika sedangkan RAM mencetak dokumen.',
      'Karena RAM tidak dapat terhubung ke motherboard tanpa kabel LAN.'
    ],
    correctIndex: 1,
    explanation: 'RAM adalah memori kerja berkecepatan tinggi yang bersifat sementara (volatile), sedangkan SSD adalah media penyimpanan sekunder yang menyimpan sistem operasi dan berkas secara persisten (non-volatile).',
    goal: 'Membedakan RAM dan SSD dengan jelas serta memahami fungsi penyimpanan.'
  },

  // ==========================================
  // WILAYAH 2: TAMAN ALGORITMA (6 SOAL)
  // ==========================================
  // 7. Pre-Test (Wilayah 2)
  {
    id: 'q_pre_algo',
    regionId: 'algorithm',
    stage: 'pre',
    question: 'Dalam menyusun algoritma robot, perintah yang dieksekusi langkah demi langkah dari atas ke bawah secara berurutan disebut struktur...',
    options: ['Urutan (Sequence)', 'Perulangan (Loop)', 'Percabangan (Selection)', 'Acak (Random)'],
    correctIndex: 0,
    explanation: 'Struktur urutan (sequence) menjalankan instruksi satu per satu secara linear sesuai baris kode yang dituliskan dari awal hingga akhir.',
    goal: 'Menyusun algoritma sederhana menggunakan urutan, percabangan, dan perulangan.'
  },
  // 8. Practice (Wilayah 2 - Soal 1)
  {
    id: 'q_prac_algo_1',
    regionId: 'algorithm',
    stage: 'practice',
    question: 'Jika robot BIT harus melangkah maju sebanyak 10 kali di lintasan lurus, struktur kode manakah yang paling efisien daripada menuliskan perintah "Maju 1 langkah" sebanyak sepuluh kali?',
    options: [
      'Struktur Perulangan (Looping)',
      'Struktur Percabangan (If-Else)',
      'Struktur Input Manual',
      'Struktur Matikan Daya'
    ],
    correctIndex: 0,
    explanation: 'Perulangan (Loop/Iterasi) memungkinkan instruksi yang sama diulang berkali-kali secara otomatis tanpa perlu menulis baris kode berulang.',
    goal: 'Menerapkan konsep perulangan untuk efisiensi kode algoritma.'
  },
  // 9. Practice (Wilayah 2 - Soal 2)
  {
    id: 'q_prac_algo_2',
    regionId: 'algorithm',
    stage: 'practice',
    question: 'Perhatikan logika berikut: "JIKA ada batu di depan robot MAKA belok kanan, JIKA TIDAK MAKA jalan terus". Logika ini menerapkan struktur apa?',
    options: ['Percabangan (Kondisional/Branching)', 'Perulangan tak terbatas', 'Urutan tanpa syarat', 'Prosedur penyimpanan'],
    correctIndex: 0,
    explanation: 'Percabangan (Conditional/If-Else) memungkinkan program mengambil keputusan berbeda berdasarkan kondisi tertentu yang dipenuhi.',
    goal: 'Menganalisis penggunaan percabangan (kondisi) dalam algoritma.'
  },
  // 10. Practice (Wilayah 2 - Soal 3)
  {
    id: 'q_prac_algo_3',
    regionId: 'algorithm',
    stage: 'practice',
    question: 'Ketika robot bergerak tidak sesuai rencana dan menabrak dinding, tindakan mencari letak kesalahan pada baris perintah dan memperbaikinya disebut proses...',
    options: ['Debugging', 'Formatting', 'Browsing', 'Downloading'],
    correctIndex: 0,
    explanation: 'Debugging adalah proses mengidentifikasi, menganalisis, dan memperbaiki kesalahan (bug) pada program agar berjalan sesuai tujuan yang diinginkan.',
    goal: 'Memahami proses debugging dalam memecahkan masalah pemrograman.'
  },
  // 11. Post-Test (Wilayah 2 - Soal 1)
  {
    id: 'q_post_algo_1',
    regionId: 'algorithm',
    stage: 'post',
    question: 'Siswa ingin membuat algoritma lampu lalu lintas: "Lampu Merah menyala selama 60 detik, lalu Kuning 5 detik, lalu Hijau 45 detik, lalu kembali ke Merah". Struktur kontrol apa saja yang digunakan?',
    options: [
      'Urutan instruksi dan perulangan siklus',
      'Hanya percabangan tanpa urutan',
      'Hanya perulangan tanpa urutan waktu',
      'Penyimpanan permanen di harddisk'
    ],
    correctIndex: 0,
    explanation: 'Urutan digunakan untuk menyalakan warna lampu sesuai urutan waktu, dan perulangan digunakan agar siklus lampu terus berulang selama sistem aktif.',
    goal: 'Mengombinasikan struktur urutan dan perulangan dalam algoritma pemecahan masalah.'
  },
  // 12. Post-Test (Wilayah 2 - Soal 2)
  {
    id: 'q_post_algo_2',
    regionId: 'algorithm',
    stage: 'post',
    question: 'Robot BIT terjebak di jalan buntu karena langkah ke-3 salah belok. Apa langkah debugging yang paling tepat dilakukan?',
    options: [
      'Menghapus seluruh program dan membuat kode acak tanpa membaca jalur.',
      'Menghentikan eksekusi, memeriksa jalurnya di petak, lalu mengubah arah belok pada langkah ke-3.',
      'Mematikan layar komputer dan memulai dari tes awal.',
      'Menambahkan 10 langkah maju baru setelah menabrak.'
    ],
    correctIndex: 1,
    explanation: 'Debugging yang sistematis dilakukan dengan melacak titik di mana kesalahan terjadi, memahami penyebabnya, dan merevisi instruksi terkait secara tepat.',
    goal: 'Menunjukkan kemampuan melakukan debugging secara logis.'
  },

  // ==========================================
  // WILAYAH 3: PUSAT JARINGAN (6 SOAL)
  // ==========================================
  // 13. Pre-Test (Wilayah 3)
  {
    id: 'q_pre_net',
    regionId: 'network',
    stage: 'pre',
    question: 'Perangkat jaringan yang berfungsi menghubungkan beberapa komputer dalam satu ruangan laboratorium sekolah (jaringan lokal / LAN) adalah...',
    options: ['Switch', 'Webcam', 'Proyektor', 'Stabilizer'],
    correctIndex: 0,
    explanation: 'Switch bertugas menerima dan meneruskan paket data antar-perangkat dalam jaringan lokal (LAN) yang sama menggunakan alamat fisik perangkat (MAC address).',
    goal: 'Menjelaskan fungsi dasar perangkat jaringan komputer.'
  },
  // 14. Practice (Wilayah 3 - Soal 1)
  {
    id: 'q_prac_net_1',
    regionId: 'network',
    stage: 'practice',
    question: 'Apa peran utama perangkat Router di laboratorium komputer sekolah?',
    options: [
      'Menghubungkan jaringan lokal sekolah ke jaringan luar atau internet dengan memilih rute data terbaik',
      'Mencetak naskah ujian ke atas kertas secara nirkabel',
      'Menyimpan file video guru secara permanen seperti harddisk',
      'Membersihkan debu pada kabel LAN'
    ],
    correctIndex: 0,
    explanation: 'Router berfungsi menghubungkan dua atau lebih jaringan yang berbeda (misalnya LAN sekolah dengan WAN/Internet) dan menentukan rute perjalanan paket data.',
    goal: 'Membedakan fungsi Switch dan Router dalam jaringan komputer.'
  },
  // 15. Practice (Wilayah 3 - Soal 2)
  {
    id: 'q_prac_net_2',
    regionId: 'network',
    stage: 'practice',
    question: 'Dua komputer di ruang kelas terhubung ke Switch yang sama tanpa koneksi internet. Apakah kedua komputer tersebut dapat saling berkirim file tugas?',
    options: [
      'Bisa, karena jaringan lokal (LAN) sudah cukup untuk komunikasi antar-komputer lokal tanpa harus tersambung ke internet',
      'Tidak bisa, karena seluruh pertukaran data wajib melewati satelit luar angkasa',
      'Hanya bisa jika kedua komputer memiliki merek yang persis sama',
      'Hanya bisa jika menggunakan kabel listrik rumah tangga'
    ],
    correctIndex: 0,
    explanation: 'Jaringan lokal (LAN) memungkinkan komunikasi dan berbagi sumber daya antar-perangkat lokal secara mandiri tanpa memerlukan akses ke internet global.',
    goal: 'Memahami bahwa jaringan lokal dapat berfungsi secara mandiri tanpa internet.'
  },
  // 16. Practice (Wilayah 3 - Soal 3)
  {
    id: 'q_prac_net_3',
    regionId: 'network',
    stage: 'practice',
    question: 'Dalam transmisi data di jaringan, informasi dipecah menjadi bagian-bagian kecil yang dikirimkan melalui kabel atau sinyal nirkabel. Bagian kecil ini disebut...',
    options: ['Paket Data', 'Baterai Listrik', 'Pixel Gambar', 'Cache CPU'],
    correctIndex: 0,
    explanation: 'Data yang dikirimkan melalui jaringan dipecah menjadi unit-unit kecil yang disebut paket data (data packets), yang masing-masing memuat alamat asal, tujuan, dan muatan pesan.',
    goal: 'Menjelaskan konsep perjalanan paket data dalam jaringan.'
  },
  // 17. Post-Test (Wilayah 3 - Soal 1)
  {
    id: 'q_post_net_1',
    regionId: 'network',
    stage: 'post',
    question: 'Perbedaan utama antara Switch dan Router adalah...',
    options: [
      'Switch menghubungkan perangkat dalam satu jaringan lokal (LAN), sedangkan Router menghubungkan antar-jaringan yang berbeda (misalnya LAN ke Internet)',
      'Switch hanya digunakan untuk internet nirkabel, sedangkan Router hanya memakai kabel serat optik',
      'Router adalah perangkat output suara, sedangkan Switch adalah memori penyimpanan',
      'Switch berfungsi menyimpan file, sedangkan Router mematikan komputer'
    ],
    correctIndex: 0,
    explanation: 'Switch beroperasi pada jaringan lokal untuk menghubungkan stasiun kerja, sedangkan Router menjadi gerbang (gateway) antar-jaringan berbeda.',
    goal: 'Menjelaskan fungsi dasar perangkat jaringan dan membedakan peran Switch dan Router.'
  },
  // 18. Post-Test (Wilayah 3 - Soal 2)
  {
    id: 'q_post_net_2',
    regionId: 'network',
    stage: 'post',
    question: 'Mengapa internet sering didefinisikan sebagai "jaringan dari jaringan" (network of networks)?',
    options: [
      'Karena internet terdiri dari jutaan jaringan lokal, regional, dan global yang saling terhubung melalui protokol komunikasi standar',
      'Karena internet diciptakan hanya dari satu komputer super besar di satu negara',
      'Karena kabel internet disambung melingkar seperti cincin tanpa router',
      'Karena internet hanya bekerja pada komputer tanpa sistem operasi'
    ],
    correctIndex: 0,
    explanation: 'Internet adalah interkoneksi masif dari berbagai jaringan lokal dan publik di seluruh dunia yang saling terhubung menggunakan protokol TCP/IP.',
    goal: 'Menjelaskan konsep jaringan internet dan keterhubungannya.'
  },

  // ==========================================
  // WILAYAH 4: BENTENG KEAMANAN DIGITAL (6 SOAL)
  // ==========================================
  // 19. Pre-Test (Wilayah 4)
  {
    id: 'q_pre_sec',
    regionId: 'security',
    stage: 'pre',
    question: 'Kamu menerima pesan WhatsApp dari nomor asing yang mengaku panitia game berhadiah dan meminta kamu mengirimkan kata sandi serta kode OTP akunmu. Apa tindakan paling aman?',
    options: [
      'Segera menolak dan mengabaikan pesan, serta tidak pernah membagikan kode OTP atau kata sandi kepada siapa pun',
      'Langsung memberikan kata sandi karena hadiahnya sangat menggiurkan',
      'Mengirimkan kode OTP asalkan orang tersebut berjanji merahasiakannya',
      'Membagikan pesan tersebut ke seluruh teman sekelas agar ikut mencoba'
    ],
    correctIndex: 0,
    explanation: 'Kode OTP (One-Time Password) dan kata sandi bersifat rahasia pribadi. Layanan resmi tidak pernah meminta kode OTP atau password melalui pesan obrolan.',
    goal: 'Menentukan tindakan yang tepat untuk menjaga keamanan dan etika digital.'
  },
  // 20. Practice (Wilayah 4 - Soal 1)
  {
    id: 'q_prac_sec_1',
    regionId: 'security',
    stage: 'practice',
    question: 'Tindakan penipuan digital yang memancing korban agar memberikan data rahasia (seperti username, password, atau nomor rekening) melalui situs atau surel palsu dikenal dengan istilah...',
    options: ['Phishing', 'Streaming', 'Coding', 'Rendering'],
    correctIndex: 0,
    explanation: 'Phishing adalah upaya rekayasa sosial untuk memperoleh informasi sensitif dengan menyamar sebagai pihak tepercaya dalam komunikasi elektronik.',
    goal: 'Mengenali bentuk ancaman phishing dan cara menghindarinya.'
  },
  // 21. Practice (Wilayah 4 - Soal 2)
  {
    id: 'q_prac_sec_2',
    regionId: 'security',
    stage: 'practice',
    question: 'Apa fungsi utama dari Autentikasi Dua Faktor (2FA / Two-Factor Authentication) pada akun media sosial atau email?',
    options: [
      'Memberikan lapisan keamanan tambahan, sehingga jika kata sandi bocor, akun tetap terlindungi oleh kode verifikasi kedua',
      'Mempercepat kecepatan koneksi internet saat mengunduh gambar',
      'Menggandakan kapasitas memori penyimpanan di komputer',
      'Menghapus seluruh pesan yang diterima secara otomatis'
    ],
    correctIndex: 0,
    explanation: '2FA mewajibkan dua bukti identitas (misalnya: sesuatu yang kamu tahu seperti password, dan sesuatu yang kamu miliki seperti kode di ponsel), sehingga meningkatkan perlindungan akun.',
    goal: 'Menjelaskan manfaat autentikasi dua faktor (2FA).'
  },
  // 22. Practice (Wilayah 4 - Soal 3)
  {
    id: 'q_prac_sec_3',
    regionId: 'security',
    stage: 'practice',
    question: 'Seorang teman mengambil foto temannya yang sedang tertidur di kelas dengan pose lucu, lalu ingin mengunggahnya ke media sosial tanpa izin. Bagaimana etika digital yang benar?',
    options: [
      'Menegur teman dan tidak mengunggahnya, karena setiap orang berhak atas privasi dan foto seseorang tidak boleh dipublikasikan tanpa persetujuannya',
      'Mendukung pengunggahan agar akun tersebut mendapat banyak pengikut',
      'Menambahkan tulisan ejekan agar semakin ramai dikomentari orang lain',
      'Menjual foto tersebut ke forum online'
    ],
    correctIndex: 0,
    explanation: 'Etika digital dan perlindungan privasi mengharuskan kita menghormati hak orang lain, tidak mengunggah dokumentasi pribadi tanpa izin, serta mencegah potensi cyberbullying.',
    goal: 'Menerapkan etika berkomunikasi dan menjaga privasi di ruang digital.'
  },
  // 23. Post-Test (Wilayah 4 - Soal 1)
  {
    id: 'q_post_sec_1',
    regionId: 'security',
    stage: 'post',
    question: 'Manakah kombinasi kata sandi berikut yang paling kuat dan aman untuk melindungi akun siswa?',
    options: [
      'K3n@r1#B1ru!2026 (kombinasi huruf besar, kecil, angka, simbol, serta tidak menggunakan data pribadi mudah tebak)',
      '12345678 (hanya deret angka berurutan)',
      'passwordku (kata umum tanpa variasi)',
      'namasendiri2012 (menggunakan nama dan tahun lahir yang mudah diketahui orang lain)'
    ],
    correctIndex: 0,
    explanation: 'Kata sandi kuat terdiri dari minimal 8-12 karakter, memadukan huruf besar, huruf kecil, angka, dan karakter khusus, serta tidak memuat informasi pribadi yang mudah ditebak.',
    goal: 'Membuat dan mengevaluasi kekuatan kata sandi yang aman.'
  },
  // 24. Post-Test (Wilayah 4 - Soal 2)
  {
    id: 'q_post_sec_2',
    regionId: 'security',
    stage: 'post',
    question: 'Di sebuah grup obrolan kelas, ada siswa yang mengirimkan pesan bernada mengejek fisik teman lain secara berulang-ulang. Sebagai warga digital yang bertanggung jawab, apa yang sebaiknya kamu lakukan?',
    options: [
      'Membela korban secara santun, mengajak teman lain untuk menghentikan perundungan, dan melaporkan kejadian kepada guru atau pihak sekolah jika berlanjut',
      'Ikut mengirimkan stiker tertawa agar tidak dijauhi oleh pelaku perundungan',
      'Membalas dengan kata-kata kasar yang lebih menghina agar terjadi keributan besar',
      'Merekam layar dan menyebarkannya ke akun gosip luar sekolah'
    ],
    correctIndex: 0,
    explanation: 'Sebagai warga digital yang bijak (upstander), kita wajib bersikap empati, menolak cyberbullying, mendukung korban secara positif, dan melapor kepada otoritas yang tepat secara bertanggung jawab.',
    goal: 'Menunjukkan sikap etis dan bertanggung jawab dalam bermedia digital.'
  }
];

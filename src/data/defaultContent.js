export const defaultContent = {
  brand: {
    name: 'SMP Shafa Wafa',
    shortName: 'Shafa Wafa',
    tagline: 'Berilmu, Beradab, Bertumbuh',
    subLocation: 'Tegalagung, Semanding, Tuban',
    logoUrl: '/images/logo.jpeg',
    faviconUrl: '/images/logo.jpeg',
  },
  theme: {
    primary: '#0b513b',
    primaryDark: '#073b2b',
    accent: '#d9a52b',
    surface: '#f7f6f0',
    text: '#182720',
  },
  header: {
    navItems: [
      { label: 'Tentang', target: 'tentang' },
      { label: 'Program', target: 'program' },
      { label: 'Keseharian', target: 'keseharian' },
      { label: 'Fasilitas', target: 'fasilitas' },
      { label: 'Gedung 3D', target: 'gedung-3d' },
      { label: 'Galeri', target: 'galeri' },
    ],
    ctaLabel: 'Info SPMB',
  },
  sectionOrder: ['about', 'values', 'program', 'routine', 'facilities', 'campus3d', 'leadership', 'testimonials', 'gallery', 'admissions', 'faq', 'location'],
  sectionVisibility: {
    about: true,
    values: true,
    program: true,
    routine: true,
    facilities: true,
    campus3d: true,
    leadership: true,
    testimonials: true,
    gallery: true,
    admissions: true,
    faq: true,
    location: true,
    floatingWa: true,
  },
  announcement: {
    visible: true,
    pill: 'Tahun Ajaran 2027/2028',
    eyebrow: 'INFORMASI PENERIMAAN',
    title: 'Penerimaan Santri Baru Tahun Ajaran 2027/2028',
    body: 'Pendaftaran Santri Baru (SPMB) SMP Shafa Wafa Tahun Ajaran 2027/2028 resmi dibuka melalui layanan konsultasi WhatsApp panitia.',
    statusLabel: 'Pendaftaran Dibuka',
  },
  hero: {
    badge: 'Pondok Pesantren & Sekolah Menengah Pertama',
    eyebrow: 'Pendidikan formal dalam lingkungan pesantren',
    title: 'Tumbuh dalam ilmu.\nKuat dalam adab.',
    description: 'Institusi pendidikan menengah pertama berkualitas di bawah naungan Pondok Pesantren Shafa Wafa Tuban, memadukan kurikulum nasional, pendalaman adab & diniyah, penguasaan dwi-bahasa, serta teknologi modern.',
    primaryLabel: 'Informasi SPMB',
    primaryTarget: 'spmb',
    secondaryLabel: 'Jelajahi Program',
    secondaryTarget: 'program',
    imageUrl: '/images/masterplan.webp',
    imageAlt: 'Masterplan Kawasan Sekolah Terpadu Shafa Wafa',
    imageCaption: 'Masterplan Kawasan Sekolah Terpadu SMP Shafa Wafa — Tegalagung, Semanding, Kab. Tuban',
    floatingLabel: 'Tahun Ajaran Perdana',
    floatingValue: '2027 / 2028',
    affiliation: 'Afiliasi Ponpes Ahlus-Shafa Wal-Wafa Tuban',
  },
  metrics: [
    { value: '2027/2028', label: 'Tahun Ajaran Perdana', caption: 'Penerimaan Angkatan I' },
    { value: '56 Santri', label: 'Daya Tampung Perdana', caption: 'Seleksi Terkurasi' },
    { value: '2 Rombel', label: 'Rombongan Belajar', caption: 'Kelas Putra & Putri Terpisah' },
    { value: '28 Santri', label: 'Rasio Ideal', caption: 'Kapasitas Maksimal per Kelas' },
  ],
  metricsNote: '*Penyelenggaraan pendidikan diselaraskan dengan standar ketercapaian mutu Dikdasmen dan kurikulum pesantren.',
  about: {
    eyebrow: 'Tentang Shafa Wafa',
    title: 'Menjaga Nilai Salaf, Memeluk Kemajuan Zaman',
    paragraphs: [
      'Hadir di bumi religius Tegalagung, Semanding, Kabupaten Tuban, SMP Shafa Wafa diinisiasi sebagai jawaban atas kerinduan para orang tua terhadap pendidikan komprehensif. Kami menyatukan standar kurikulum nasional tingkat menengah dengan atmosfer kepesantrenan Ahlus-Shafa Wal-Wafa.',
      'Fokus kami tidak semata-mata pada kecemerlangan nilai ujian, melainkan pembangunan karakter adabiyyah santri: kejujuran nurani, ketawadukan sikap, kemandirian jiwa, dan kecakapan literasi masa depan.',
    ],
    imageUrl: '/images/campus-gate-detail.webp',
    imageAlt: 'Arsitektur gedung pendidikan di kawasan sekolah pesantren',
    note: 'Penyelenggaraan pendidikan SMP Shafa Wafa mengintegrasikan kurikulum nasional dan nilai luhur pesantren.',
    features: [
      { icon: 'scale', title: 'Keseimbangan Total', description: 'Sintesis kurikulum Dikdasmen dengan penguatan muatan lokal diniyah, tahsin, dan fiqih aplikatif harian.' },
      { icon: 'heart-handshake', title: 'Keteladanan Berkelanjutan', description: 'Pendidik yang hadir tidak sekadar mengajar, melainkan mendampingi langsung tumbuh kembang santri.' },
      { icon: 'trees', title: 'Lingkungan Asri & Terbuka', description: 'Kawasan hijau Semanding yang tenang, jauh dari kebisingan kota, sangat kondusif untuk belajar dan tilawah.' },
      { icon: 'shield-check', title: 'Integritas Legal Formal', description: 'Beroperasi sesuai regulasi Kemendikbudristek dan Kemenag secara akuntabel demi masa depan santri.' },
    ],
  },
  values: [
    {
      pillar: 'PILAR I',
      icon: 'book-open',
      title: 'Ilmu & Literasi',
      description: 'Membangun pondasi akademik yang kokoh melalui budaya membaca analitis, riset dasar sederhana, dan nalar kritis santri.',
      highlight: 'Riset Mandiri & Perpustakaan',
    },
    {
      pillar: 'PILAR II',
      icon: 'heart-handshake',
      title: 'Agama & Adab',
      description: 'Penanaman akhlaqul karimah di atas ilmu, kedisiplinan ibadah jamaah, tahsin tartil bersanad, dan hafalan terstruktur.',
      highlight: 'Tahfidz & Adab Salafiyah',
    },
    {
      pillar: 'PILAR III',
      icon: 'languages',
      title: 'Bahasa Arab & Inggris',
      description: 'Pembiasaan percakapan dwibahasa aktif guna membuka jendela khazanah Islam klasik sekaligus ilmu pengetahuan global.',
      highlight: 'Bilingual Daily Immersion',
    },
    {
      pillar: 'PILAR IV',
      icon: 'cpu',
      title: 'Smart Technology',
      description: 'Pemanfaatan teknologi tepat guna dalam kelas interaktif, komputasi etis, dan sistem pembelajaran digital santri.',
      highlight: 'Smart Class & Digital Ethics',
    },
  ],
  program: {
    eyebrow: 'Kurikulum & Pembelajaran Terpadu',
    title: 'Program Unggulan Akademik & Pesantren',
    description: 'Sinergi harmonis antara kurikulum standar nasional dan kurikulum kepesantrenan khas Shafa Wafa yang aplikatif.',
    items: [
      {
        tag: 'Kurikulum Nasional',
        icon: 'graduation-cap',
        title: 'Pembelajaran Formal Terintegrasi',
        description: 'Penerapan kurikulum nasional yang diperkaya dengan contextual learning, bimbingan olimpiade sains terstruktur, serta eksplorasi literasi ilmiah santri.',
        bullets: ['Penguatan literasi sains, numerasi, dan logika berpikir', 'Pembelajaran berbasis proyek & kepedulian sosial'],
      },
      {
        tag: 'Diniyah & Pesantren',
        icon: 'book-open',
        title: 'Penguatan Diniyah & Tahsin Tartil',
        description: 'Program pendalaman dasar-dasar kitab kuning, tahsin Al-Qur\'an berkaidah tajwid, dan setoran hafalan harian yang terarah tanpa membebani santri.',
        bullets: ['Target tahfidz bertahap juz 30 & juz pilihan', 'Praktek ubudiyah dan pembinaan adab harian'],
      },
      {
        tag: 'Bilingual Immersion',
        icon: 'languages',
        title: 'Kemahiran Bahasa Arab & Inggris',
        description: 'Program akselerasi percakapan aktif melalui Muhadatsah pagi, English Morning Talk, dan lingkungan asrama secara berjenjang dan menyenangkan.',
        bullets: ['Latihan kosakata harian dan percakapan tematik', 'Klub literasi bahasa dan pidato santri'],
      },
      {
        tag: 'Digital Intelligence',
        icon: 'laptop',
        title: 'Literasi Digital & Komputasi Santri',
        description: 'Pengenalan computational thinking dasar, pemanfaatan perangkat digital untuk pembelajaran kreatif, dan edukasi mendalam mengenai adab berinternet yang sehat.',
        bullets: ['Laboratorium komputer interaktif berfilter aman', 'Karya digital santri (infografis, karya tulis, dan logika komputasi)'],
      },
    ],
  },
  facilities: {
    eyebrow: 'Infrastruktur Sekolah',
    title: 'Fasilitas Terpadu Sekolah & Pesantren',
    description: 'Penataan sarana dirancang ramah anak, asri, aman, dan menyatu dalam kawasan sekolah yang teratur.',
    statusBadge: 'Standar Fasilitas Terpadu & Modern',
    imageUrl: '/images/campus-gate-detail.webp',
    imageAlt: 'Visual arsitektur kawasan sekolah SMP Shafa Wafa',
    items: [
      {
        title: 'Gedung Kelas Smart Class',
        description: 'Gedung 3 lantai dengan tata ruang ergonomis, proyektor interaktif, sirkulasi udara alami khas tropis, dan kapasitas ideal 28 siswa.',
        status: 'Tersedia Lengkap',
        note: 'Gedung 3 Lantai • Ber-AC & Multimedia',
        icon: 'school',
      },
      {
        title: 'Masjid Jami\' Shafa Wafa',
        description: 'Pusat spiritual dan sentra kegiatan ubudiyah santri, halaqah Qur\'an, kajian fiqih, serta shalat fardhu berjamaah bersama para asatidz.',
        status: 'Sentra Ibadah',
        note: 'Pusat Ibadah & Halaqah Santri',
        icon: 'mosque',
      },
      {
        title: 'Perpustakaan & Resource Center',
        description: 'Koleksi literatur Islam klasik (kutubut turats), buku teks nasional, ensiklopedia umum, dan terminal komputer e-library untuk literasi digital.',
        status: 'Tersedia Lengkap',
        note: 'Pustaka Kitab & E-Library',
        icon: 'library',
      },
      {
        title: 'Asrama Santri & Dining Hall',
        description: 'Kamar santri bersih dan aman dengan ventilasi sehat, didampingi pembina asrama (musyrif/musyrifah), serta ruang makan higienis berstandar gizi.',
        status: 'Modern & Asri',
        note: 'Asrama Terpisah Putra & Putri',
        icon: 'hotel',
      },
      {
        title: 'Lapangan Olahraga & RTH',
        description: 'Sarana kebugaran santri (futsal, basket, bulutangkis) serta ruang terbuka hijau untuk kenyamanan dan kesehatan santri.',
        status: 'Aktif & Sehat',
        note: 'Futsal, Basket & Area Hijau',
        icon: 'sports',
      },
      {
        title: 'Masterplan Kawasan Sekolah',
        description: 'Seluruh rancangan sarana mengusung konsep ramah lingkungan, aman bagi anak, dan menyatu dalam satu kawasan sekolah yang tertata.',
        status: 'Kawasan Terpadu',
        note: 'Kawasan Semanding - Tuban',
        icon: 'architecture',
      },
    ],
  },
  campus3d: {
    visible: true,
    eyebrow: 'Visualisasi Ruang',
    title: 'Visualisasi 3D Arsitektur Gedung Sekolah',
    description: 'Simulasi tata ruang kawasan sekolah terpadu SMP Shafa Wafa Tegalagung Tuban. Jelajahi arsitektur gedung 3 lantai bernuansa Nusantara dan Islami.',
    disclaimer: 'Visualisasi 3D menampilkan konsep tata massa dan arsitektural gedung sekolah SMP Shafa Wafa Tuban.',
  },
  leadership: {
    visible: true,
    eyebrow: 'Sambutan Khidmat',
    title: 'Menyiapkan Generasi yang Kokoh Spiritual, Luas Wawasan, dan Santun Berperilaku',
    name: 'KH. M. Miftahul Ulum, S.Si., M.Pd.',
    role: 'Ketua Umum Yayasan Pesantren Ahlus-Shafa Wal-Wafa',
    quote: 'Keberhasilan pendidikan santri bukan semata-mata diukur dari kemampuannya menjawab lembar ujian, melainkan dari bagaimana ia membungkukkan badan ketika menyapa sesama, menghormati orang tua dan gurunya, serta teguh mengamalkan ilmunya untuk kemaslahatan umat.',
    bio: 'Pondok Pesantren Ahlus-Shafa Wal-Wafa mendirikan SMP Shafa Wafa sebagai wujud khidmah dalam dunia pendidikan formal. Kami meyakini bahwa perpaduan antara sanad keilmuan pesantren yang luhur dan kurikulum sains modern akan melahirkan pribadi yang berkarakter kuat di era global.',
    staffNoteTitle: 'Informasi Tim Pendidik & Tenaga Kependidikan',
    staffNote: 'Dewan asatidz dan staf akademik terdiri dari lulusan perguruan tinggi dan pondok pesantren terkemuka dengan kualifikasi linear, integritas akhlak, serta sanad keilmuan yang jelas.',
    imageUrl: '/images/ketua-yayasan.webp',
    imageAlt: 'Foto KH. M. Miftahul Ulum, S.Si., M.Pd., Ketua Umum Yayasan Pesantren Ahlus-Shafa Wal-Wafa',
  },
  admissions: {
    visible: true,
    pill: 'Penerimaan Santri Baru (SPMB)',
    eyebrow: 'SPMB SMP SHAFA WAFA',
    title: 'Pendaftaran Santri Baru Tahun Ajaran 2027/2028',
    description: 'SMP Shafa Wafa menerima pendaftaran santri baru untuk jenjang Sekolah Menengah Pertama berbasis pesantren. Dapatkan bimbingan akademik unggul dan penanaman adab islami.',
    academicYear: '2027/2028',
    status: 'buka',
    officialRegistrationOpen: true,
    interestFormEnabled: false,
    directToWhatsapp: true,
    whatsappNumber: '',
    whatsappMessage: "Assalamu'alaikum Panitia SPMB SMP Shafa Wafa, saya ingin informasi mengenai pendaftaran santri baru.",
    ctaLabel: 'Konsultasi SPMB via WhatsApp',
    targetStudents: 56,
    targetGroups: 2,
    targetStudentsPerClass: 28,
    statusNote: 'Layanan informasi pendaftaran santri baru dilayani langsung oleh panitia SPMB melalui WhatsApp resmi sekolah.',
    officialUrl: '',
    contactLabel: 'Konsultasi Pertanyaan',
  },
  faq: {
    eyebrow: 'Pertanyaan Umum',
    title: 'Keterbukaan Informasi & Tanya Jawab',
    subtitle: 'Jawaban lugas dan transparan mengenai sistem pendidikan, kurikulum, serta pendaftaran santri baru SMP Shafa Wafa.',
    items: [
      {
        question: 'Kapan pendaftaran santri baru (SPMB) SMP Shafa Wafa dibuka?',
        answer: 'Pendaftaran santri baru untuk Tahun Ajaran 2027/2028 saat ini telah dibuka. Calon wali santri dapat langsung menghubungi Panitia SPMB melalui WhatsApp resmi untuk konsultasi persyaratan, kuota rombel, dan prosedur pendaftaran.',
      },
      {
        question: 'Bagaimana cara mendaftar santri baru di SMP Shafa Wafa?',
        answer: 'Pendaftaran dapat dilakukan dengan mudah melalui tombol WhatsApp resmi yang tersedia di portal ini. Panitia akan mendampingi proses pengisian data calon santri dan memberikan petunjuk teknis pendaftaran.',
      },
      {
        question: 'Bagaimana model kurikulum dan jadwal harian santri?',
        answer: 'Kurikulum memadukan standar nasional tingkat SMP di pagi hari dengan kurikulum Madrasah Diniyah Pesantren di sore dan malam hari, meliputi tahsin tartil Al-Qur\'an, pembelajaran formal terintegrasi, kajian kitab salaf, dan halaqah tahfidz.',
      },
      {
        question: 'Apakah seluruh santri wajib tinggal di asrama (pesantren)?',
        answer: 'Ya, sistem pendidikan mengutamakan pola boarding school (pesantren terpadu) agar pembentukan adab, kedisiplinan ibadah berjamaah, dan pembiasaan percakapan dwibahasa (Arab & Inggris) dapat berlangsung intensif dan terkawal 24 jam.',
      },
      {
        question: 'Bagaimana informasi mengenai rincian biaya pendidikan?',
        answer: 'Rincian biaya pendidikan disampaikan secara transparan dan jelas oleh Panitia SPMB saat konsultasi. Segala komunikasi dan konfirmasi pembayaran dilakukan hanya melalui saluran resmi Yayasan Pondok Pesantren Shafa Wafa.',
      },
    ],
  },
  dailyRoutine: {
    visible: true,
    eyebrow: 'RITME KEHIDUPAN SANTRI',
    title: 'Keseharian Terarah & Penuh Keberkahan',
    description: 'Setiap detik waktu santri ditata secara seimbang antara ibadah ubudiyah, penguatan hafalan Al-Qur\'an, pembelajaran akademik formal, olahraga, dan istirahat yang berkualitas.',
    items: [
      {
        time: '03.45 - 05.15',
        period: 'Dini Hari & Subuh',
        title: 'Qiyamul Lail & Shalat Subuh Berjamaah',
        activity: 'Bangun pagi, shalat tahajud, dzikir pagi ma\'tsurat, shalat subuh berjamaah di masjid, dan pembacaan wirid santri.',
        tag: 'Ubudiyah',
      },
      {
        time: '05.30 - 06.30',
        period: 'Pagi Hari',
        title: 'Halaqah Tahfidz & Tahsin Al-Qur\'an',
        activity: 'Setoran hafalan baru (ziyadah) dan pengulangan berkala (muraja\'ah) didampingi ustadz muhaffidz dengan sanad muttashil.',
        tag: 'Tahfidz',
      },
      {
        time: '06.30 - 07.15',
        period: 'Persiapan',
        title: 'Sarapan Sehat, Piket Adab & Apel Pagi',
        activity: 'Sarapan bergizi seimbang di ruang makan santri, pembiasaan menjaga kebersihan kamar, dan pengarahan kedisiplinan.',
        tag: 'Karakter',
      },
      {
        time: '07.15 - 15.00',
        period: 'Siang Hari',
        title: 'KBM Kurikulum Formal SMP & Dwi-Bahasa',
        activity: 'Pembelajaran nasional terintegrasi IPA, Matematika, Coding & Informatika, Bahasa Arab-Inggris aktif, diselingi shalat Zhuhur berjamaah.',
        tag: 'Akademik',
      },
      {
        time: '15.30 - 17.00',
        period: 'Sore Hari',
        title: 'Shalat Ashar, Olahraga Mandiri & Ekstrakurikuler',
        activity: 'Memanah, futsal, beladiri, klub sains, serta rihlah santai di area terbuka hijau sekolah yang asri.',
        tag: 'Kebugaran',
      },
      {
        time: '18.00 - 20.00',
        period: 'Malam Hari',
        title: 'Maghrib, Kajian Kitab Salaf & Shalat Isya',
        activity: 'Kajian kitab adab ta\'lim muta\'allim, aqidah, fikih ibadah dasar, dan tadarus Al-Qur\'an hingga Isya berjamaah.',
        tag: 'Diniyah',
      },
      {
        time: '20.00 - 21.30',
        period: 'Malam Hari',
        title: 'Belajar Terbimbing & Istirahat Malam',
        activity: 'Penyelesaian tugas akademik dengan bimbingan wali asrama, adab tidur sunnah nabawiyah, dan istirahat penuh pada pukul 21.30.',
        tag: 'Kemandirian',
      },
    ],
  },
  testimonials: {
    visible: true,
    eyebrow: 'SUARA WALI & ENDORSEMENT',
    title: 'Kepercayaan & Harapan bagi Generasi Qur\'ani',
    description: 'Refleksi dan apresiasi para pendidik, tokoh pesantren, serta calon wali santri terhadap ekosistem pendidikan terpadu di SMP Shafa Wafa.',
    items: [
      {
        quote: 'Perpaduan antara adab pesantren salaf dan literasi digital adalah jawaban paling tepat untuk membentengi generasi muda kita hari ini. Shafa Wafa hadir dengan visi yang sangat jernih.',
        author: 'Drs. H. M. Fauzi, M.Pd.I',
        role: 'Pemerhati Pendidikan Pesantren Jawa Timur',
        location: 'Tuban',
      },
      {
        quote: 'Kapasitas kelas yang dibatasi hanya 28 santri per rombel membuat perhatian guru ke setiap anak sangat personal. Ini yang membuat kami sebagai wali murid merasa tenang dan yakin.',
        author: 'Hj. Siti Rahmawati, S.E.',
        role: 'Calon Wali Santri Angkatan Perdana',
        location: 'Bojonegoro',
      },
      {
        quote: 'Pondok pesantren dengan masterplan hijau, gedung modern, dan kurikulum dwi-bahasa yang terukur. Lingkungan Semanding yang tenang sangat ideal untuk santri fokus menghafal Al-Qur\'an.',
        author: 'Ust. Ahmad Baihaqi, Lc.',
        role: 'Konsultan Kurikulum Diniyah Terpadu',
        location: 'Surabaya',
      },
    ],
  },
  gallery: {
    visible: true,
    eyebrow: 'GALERI & DOKUMENTASI',
    title: 'Potret Kawasan & Aktivitas Santri',
    description: 'Dokumentasi visual lingkungan sekolah terpadu, sarana kepesantrenan, dan pembiasaan adab harian santri SMP Shafa Wafa Tuban.',
    items: [
      {
        imageUrl: '/images/masterplan.webp',
        title: 'Masterplan Kawasan Sekolah Terpadu',
        category: 'Kawasan',
        featured: true,
      },
      {
        imageUrl: '/images/campus-concept.webp',
        title: 'Lanskap Lingkungan & Asrama Asri',
        category: 'Lingkungan',
        featured: true,
      },
      {
        imageUrl: '/images/campus-gate-detail.webp',
        title: 'Gerbang Utama & Arsitektur Nusantara',
        category: 'Fasilitas',
        featured: true,
      },
      {
        imageUrl: '/images/logo.jpeg',
        title: 'Identitas Resmi SMP Shafa Wafa Tuban',
        category: 'Identitas',
        featured: false,
      },
    ],
  },
  floatingWa: {
    visible: true,
    label: 'Tanya Panitia SPMB',
    message: 'Assalamu\'alaikum Panitia SPMB SMP Shafa Wafa, saya ingin berkonsultasi mengenai pendaftaran santri baru.',
  },
  contact: {
    eyebrow: 'Aksesibilitas Wilayah',
    title: 'Lokasi Sekolah Shafa Wafa',
    description: 'Terletak strategis di kawasan asri Semanding, Kabupaten Tuban. Lingkungan yang tenang dan sejuk memberikan kenyamanan maksimal bagi santri dalam menghafal Al-Qur\'an dan menuntut ilmu.',
    address: 'Jl. Tegalagung, Kec. Semanding, Kab. Tuban, Jawa Timur 62381',
    proximity: '± 15 menit dari Alun-alun & Pusat Kota Tuban',
    mapUrl: 'https://www.google.com/maps?q=-6.9198125,112.0483906',
    mapEmbedUrl: 'https://maps.google.com/maps?q=-6.9198125,112.0483906&t=&z=15&ie=UTF8&iwloc=&output=embed',
    phone: '',
    whatsapp: '',
    email: 'admin@shafawafa.sch.id',
    instagram: '',
    note: 'Kanal kontak resmi sekolah dan informasi pendaftaran santri baru.',
  },
  footer: {
    copyright: 'SMP Shafa Wafa Tegalagung Tuban',
    tagline: 'Lembaga pendidikan menengah pertama berbasis nilai-nilai Islam komprehensif, kepesantrenan kontemporer, dan integritas akademik di bawah naungan Pondok Pesantren Shafa Wafa Tuban.',
    note: 'Portal Informasi Resmi SMP Shafa Wafa Tegalagung, Semanding, Kabupaten Tuban. Berkomitmen menghadirkan pendidikan menengah pertama berbasis nilai pesantren dan kurikulum nasional.',
  },
  siteMeta: {
    title: 'SMP Shafa Wafa | Berilmu, Beradab, Bertumbuh',
    description: 'SMP Shafa Wafa — pendidikan formal dalam lingkungan pesantren dengan penguatan agama, adab, bahasa, dan teknologi. Tegalagung, Semanding, Tuban.',
  },
};

export function mergeContent(base, incoming) {
  if (!incoming || typeof incoming !== 'object') return incoming ?? base;
  if (Array.isArray(incoming)) return incoming;
  const result = { ...(base && typeof base === 'object' && !Array.isArray(base) ? base : {}) };
  for (const [key, value] of Object.entries(incoming)) {
    result[key] = key in result ? mergeContent(result[key], value) : value;
  }

  // Ensure newly added sections exist in sectionOrder
  if (Array.isArray(base?.sectionOrder)) {
    const currentOrder = Array.isArray(result.sectionOrder) ? result.sectionOrder : base.sectionOrder;
    const missingKeys = base.sectionOrder.filter((k) => !currentOrder.includes(k));
    if (missingKeys.length > 0) {
      result.sectionOrder = [...currentOrder, ...missingKeys];
    }
  }

  // Ensure default sectionVisibility keys exist
  if (base?.sectionVisibility) {
    result.sectionVisibility = { ...base.sectionVisibility, ...(result.sectionVisibility || {}) };
  }

  // Ensure default header navigation items exist
  if (Array.isArray(base?.header?.navItems) && Array.isArray(result?.header?.navItems)) {
    const seen = new Set();
    result.header.navItems = result.header.navItems.filter((item) => {
      if (!item || item.target === 'kampus-3d' || item.target === 'gedung-3d' || item.label?.toLowerCase().includes('kampus')) return false;
      if (seen.has(item.target)) return false;
      seen.add(item.target);
      return true;
    });

    const existingTargets = new Set(result.header.navItems.map((n) => n.target));
    const missingNav = base.header.navItems.filter((item) => !existingTargets.has(item.target));
    if (missingNav.length > 0) {
      result.header.navItems = [...result.header.navItems, ...missingNav];
    }

    const baseOrderMap = new Map(base.header.navItems.map((item, idx) => [item.target, idx]));
    result.header.navItems.sort((a, b) => {
      const orderA = baseOrderMap.has(a.target) ? baseOrderMap.get(a.target) : 999;
      const orderB = baseOrderMap.has(b.target) ? baseOrderMap.get(b.target) : 999;
      return orderA - orderB;
    });
  }

  // Ensure fallback defaults for sections if absent in incoming
  ['dailyRoutine', 'gallery', 'testimonials', 'floatingWa'].forEach((mod) => {
    if (base?.[mod] && !result[mod]) {
      result[mod] = base[mod];
    }
  });

  return result;
}

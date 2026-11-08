# Prompt Google Antigravity — Implementasi website

Proyek ini sudah memiliki starter code. Buka root project `D:\Code\SMP-ShafaWafa`, baca `README.md`, `docs/CONTENT-REVIEW.md`, dan `firestore.rules` terlebih dahulu. Gunakan desain prototype Google Stitch sebagai sumber tampilan; jangan menghapus guardrails data dan keamanan yang sudah dibuat.

## Tugas implementasi

Lanjutkan proyek landing page SMP Shafa Wafa dengan stack yang sudah dipilih:
- Vite + React + JavaScript + CSS biasa.
- Firebase Authentication Email/Password untuk admin.
- Cloud Firestore untuk dokumen konten dan data minat awal.
- Three.js untuk model kampus konseptual.
- GitHub Actions + GitHub Pages untuk deployment statis.

Jangan menambahkan backend Node/Express yang harus selalu hidup, Firebase Storage wajib, CMS SaaS, atau dependensi besar yang tidak diperlukan. Situs harus bekerja pada sub-path GitHub Pages serta fallback dengan konten lokal jika Firebase belum dikonfigurasi.

## UX publik

Implementasikan desain hasil Stitch dengan tema hijau `#0B513B`, hijau gelap `#073B2B`, emas `#D9A52B`, background hangat, heading Manrope, body DM Sans. Pertahankan responsive desktop/mobile, aksesibilitas keyboard, CTA SPMB, FAQ, kontak opsional, profil ketua yayasan, dan label status “Tahap persiapan”. Jangan mengarang kontak, tarif, akreditasi, jadwal resmi, guru/staf, atau keputusan perizinan.

## CMS

CMS publik berada pada query route `?page=admin`; halaman SPMB di `?page=spmb`. Ini disengaja agar deep-link tidak membutuhkan rewrite server pada GitHub Pages.

- Pertahankan login admin via Firebase Auth.
- Admin hanya boleh masuk apabila `admins/{uid}` ada dan `active == true`.
- Editor visual mengubah properti utama.
- Editor JSON memampukan admin mengubah keseluruhan konten, daftar kartu, metadata, tema, `sectionOrder`, dan `sectionVisibility`.
- Validasi JSON sebelum save; tampilkan pesan sukses/error yang nyata.
- Tab pendataan minat memuat data yang hanya boleh dibaca admin dan menyediakan CSV export.
- Semua konten harus tersimpan ke `siteContent/public`; website publik membaca dokumen ini dengan konten lokal sebagai fallback.
- Jangan membuat fitur registrasi akun admin publik.
- Jangan longgarkan `firestore.rules` menjadi `allow read, write: if true` atau `if request.auth != null` untuk semua dokumen.

## Form SPMB

Saat ini buat **form pendataan minat awal**, bukan alur pendaftaran resmi. Validasi input, minimalkan data pribadi, buat status loading/sukses/gagal, cegah pengiriman honeypot sederhana, dan jaga aturan Firestore agar pengunjung hanya bisa membuat entri yang tervalidasi. Jika Firebase belum dikonfigurasi, jelaskan bahwa form online belum aktif. Jangan menyatakan bahwa formulir ini adalah bukti pendaftaran.

## Three.js

Tinjau `src/components/Campus3D.jsx`. Model harus ringan, drag/rotate/zoom/reset bekerja, cleanup renderer/observer saat unmount, dan Three.js hanya di-load saat bagian kampus mendekati viewport. Tata massa bangunan mengikuti pendekatan site plan secara kasar; selalu pertahankan disclaimer bahwa model adalah konsep, bukan model teknik presisi. Jangan menyatakan dimensi, bentuk final, atau kapasitas ruang akurat sebelum ada berkas CAD/BIM terverifikasi.

Catatan khusus: title block pada `PONDOK TUBAN N2.pdf` yang dilampirkan bertuliskan “Pesantren MTs-MA Ikhwanus Shafa”. Konfirmasi terlebih dahulu bahwa lembar tersebut memang acuan lokasi SMP Shafa Wafa. Sampai terkonfirmasi, jangan menampilkan lembar mentah tersebut sebagai site plan resmi. Jika tersedia CAD/BIM final, buat komponen loader GLB/GLTF sebagai pengganti model prosedural.

## Firebase dan GitHub Pages

- Pertahankan penggunaan environment variables `VITE_FIREBASE_*`.
- Build GitHub Pages harus menghitung base path repository dengan benar.
- Variabel Firebase web config harus dipasang pada GitHub Actions Variables agar website terdeploy terhubung ke Firestore.
- Pastikan `resolveAssetUrl()` tetap menyelesaikan aset lokal berdasarkan `import.meta.env.BASE_URL`.
- Jangan menaruh service-account JSON, secret admin, atau private API key di `VITE_*` atau bundle publik.

## Verifikasi yang wajib dilakukan

1. Jalankan `npm install` dan `npm run build`.
2. Periksa Console browser untuk error.
3. Uji desktop dan lebar mobile 390 px.
4. Uji website dalam mode tanpa Firebase: konten fallback harus tampil dan form harus memberi peringatan, bukan macet.
5. Setelah Firebase disiapkan, uji akun non-admin ditolak, admin diizinkan, perubahan konten tersimpan, pengunjung dapat membaca konten publik, dan pengunjung tak bisa membaca daftar minat.
6. Uji submit minat dan export CSV.
7. Uji model 3D menggunakan mouse dan touch, termasuk resize dan reset view.
8. Laporkan issue yang benar-benar ditemukan beserta file yang diubah. Jangan menyatakan fitur lolos pengujian jika belum dijalankan.

# Prompt Google Stitch — Website SMP Shafa Wafa

Salin prompt berikut ke Google Stitch. Buat prototype multi-screen yang terhubung agar alur dari landing page ke SPMB dan CMS mudah diuji. Gunakan foto dan visual referensi yang saya unggah jika tersedia pada canvas. Jika tidak, gunakan placeholder arsitektur yang netral dan tandai sebagai visual konsep.

---

Rancang sebuah website sekolah bernama **SMP Shafa Wafa**, sekolah menengah pertama swasta yang direncanakan hadir dalam lingkungan Pondok Pesantren Shafa Wafa di Tegalagung, Semanding, Tuban, Jawa Timur. Website sedang disiapkan sebelum angkatan pertama, dengan target tahun ajaran 2027/2028 yang masih bersifat rencana. Saat ini organisasi guru dan staf belum ditetapkan; hanya profil Ketua Umum Yayasan yang boleh ditampilkan.

## Tujuan UX

1. Membangun kepercayaan calon wali murid dan memperkenalkan sekolah.
2. Menjelaskan rancangan pendekatan pendidikan: pembelajaran formal, agama dan adab, bahasa Arab dan Inggris, serta teknologi.
3. Membawa pengunjung ke halaman SPMB dengan status persiapan yang jujur.
4. Menyediakan prototype CMS yang nantinya dapat mengubah seluruh konten tanpa edit kode.
5. Memperlihatkan konsep kampus lewat area 3D interaktif yang nantinya diimplementasikan dengan Three.js.

## Visual identity

- Gaya: modern Islamic school, rapi, hangat, premium, menenangkan, kredibel, ramah keluarga; bukan gaya startup SaaS dan bukan poster promosi yang penuh ornamen.
- Warna utama hijau hutan `#0B513B`, hijau gelap `#073B2B`, aksen emas `#D9A52B`, putih hangat `#FBFAF7`, latar sekunder `#F7F6F0`.
- Typography: Manrope untuk heading, DM Sans untuk body. Pastikan hierarchy tegas dan isi mudah dibaca.
- Gunakan ruang kosong cukup luas, garis tipis, card radius 10–16 px, ikon outline, foto arsitektur besar, dan aksen emas seperlunya.
- Mobile-first, responsive pada lebar 390 px dan desktop 1440 px. Header sticky, menu mobile sederhana, tombol CTA jelas, fokus keyboard terlihat, kontras teks memadai.
- Hindari animasi berlebihan, carousel otomatis, glassmorphism kuat, gradient neon pada seluruh halaman, dan kartu yang terlalu padat.

## Screen 1 — Landing page desktop + mobile

Susun bagian dalam urutan:
1. Header: logo/wordmark SMP Shafa Wafa, menu Tentang, Program, Fasilitas, Kampus 3D, tombol “Info SPMB”.
2. Announcement strip: “Persiapan Tahun Ajaran 2027/2028”; jelaskan jadwal resmi akan diumumkan setelah dikonfirmasi.
3. Hero two-column: eyebrow “Pendidikan formal dalam lingkungan pesantren”; headline “Tumbuh dalam ilmu. Kuat dalam adab.”; deskripsi singkat yang hangat; CTA “Jelajahi program” dan “Informasi SPMB”; ilustrasi/foto arsitektur konsep di kanan.
4. Metric strip: target tahun ajaran 2027/2028, target 56 peserta didik awal, dua rombongan belajar, rencana 28 siswa per kelas. Beri penanda bahwa angka merupakan rencana.
5. Tentang sekolah: latar belakang, konteks pesantren, visual site/campus.
6. Nilai: ilmu dan literasi, agama dan adab, bahasa Arab & Inggris, teknologi.
7. Program: pembelajaran formal, bahasa, teknologi.
8. Fasilitas: daftar fasilitas berstatus “Direncanakan”; jangan mengeklaim siap digunakan.
9. Kampus 3D: viewport panorama kampus, panel kecil instruksi “Putar · Geser · Perbesar”, disclaimer visual konseptual.
10. Profil Ketua Umum Yayasan: sediakan ruang portrait formal, nama “KH. M. Miftahul Ulum, S.Si., M.Pd.” dan jabatan “Ketua Umum Yayasan Pesantren Ahlus-Shafa Wal-Wafa”. Jangan menambahkan guru/staf fiktif.
11. SPMB CTA: tahun ajaran target, status “Tahap persiapan”, CTA “Info & pendataan minat”.
12. FAQ: kapan dibuka, apakah pendaftaran resmi sudah dibuka, program, biaya, informasi asrama.
13. Footer: lokasi Tuban, tautan peta, placeholder kontak yang bisa diisi admin, tautan CMS tidak mencolok.

## Screen 2 — Halaman SPMB

Buat landing page kedua dengan hero hijau gelap, badge status persiapan, ringkasan target awal, lalu layout dua kolom: informasi prosedur dan kartu formulir minat awal. Isian formulir: nama wali, nama calon siswa, nomor WhatsApp, asal sekolah opsional, pilihan membutuhkan informasi asrama, pesan opsional, persetujuan penggunaan data. Beri disclaimer jelas: “Formulir minat awal bukan pendaftaran resmi dan tidak menjamin penerimaan.” Sediakan state untuk loading, sukses, gagal, dan form belum aktif. Jangan menampilkan tarif atau jadwal yang belum disahkan.

## Screen 3 — CMS Login

Halaman login admin formal dengan panel hijau gelap dan form email/kata sandi. Tidak ada registrasi admin publik. Tampilkan pesan jika Firebase belum disiapkan atau akun belum memiliki otorisasi.

## Screen 4 — CMS Dashboard + editor konten

Buat dashboard admin desktop dengan sidebar: Ringkasan, Konten utama, Semua konten (JSON), Pendataan minat, Keluar CMS. Gaya utilitarian, mudah dipakai, tidak lebih menonjol daripada website publik.
- Dashboard menampilkan status konfigurasi konten, tahun ajaran target, target peserta didik, shortcut edit konten.
- Form editor visual untuk nama sekolah, tagline, warna tema, hero, gambar/URL gambar, announcement, status SPMB, profil ketua yayasan, kontak, dan visibilitas bagian.
- Editor lanjutan JSON agar seluruh daftar program, fasilitas, FAQ, urutan section, navigasi, metadata, dan teks footer dapat dikustomisasi.
- Tabel pendataan minat dengan nama wali, calon siswa, WhatsApp, sekolah asal, kebutuhan asrama, waktu masuk, dan export CSV.
- Beri penekanan pada privasi: data minat hanya diakses admin berwenang.

## Interaksi prototype

- CTA “Info SPMB” pada header dan hero membuka Screen 2.
- Navigasi section melakukan scroll ke bagian yang sesuai.
- Card FAQ bisa membuka/tutup.
- CMS sidebar berpindah antar Screen 3–4 atau tab dashboard.
- Form punya state validasi dan sukses, namun beri label prototype bila tidak terhubung backend.
- Kontrol Kampus 3D harus terlihat dapat berinteraksi; di tahap desain boleh gunakan mock viewport.

## Konten dan guardrails

Jangan mengarang akreditasi, izin operasional, testimoni, peringkat, daftar guru/staf, nomor WhatsApp, email, biaya pendidikan, beasiswa, atau tanggal SPMB resmi. Nyatakan kapasitas, fasilitas, dan target sebagai rencana. Jangan menampilkan denah yang judulnya tidak cocok sebagai denah resmi tanpa konfirmasi. Hindari penggunaan Lorem Ipsum.

Hasilkan high-fidelity UI, komponen konsisten, screen desktop dan mobile, lalu tautkan prototipe antar-screen. Buat keputusan desain yang masuk akal tanpa bertanya untuk hal yang bisa dijadikan placeholder.

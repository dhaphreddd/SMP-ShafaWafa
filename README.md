# SMP Shafa Wafa — website + CMS

Starter project landing page sekolah dengan halaman informasi SPMB, CMS berbasis Firebase, dan visualisasi 3D arsitektur gedung sekolah.

## Stack

- **Vite + React** untuk antarmuka SPA yang ringan.
- **CSS biasa** (tanpa Tailwind runtime) untuk memudahkan modifikasi desain dan menjaga dependensi tetap ringkas.
- **Firebase Authentication** untuk login admin.
- **Cloud Firestore** untuk konten website dan data pendataan minat.
- **Three.js** untuk model 3D gedung sekolah yang dimuat dinamis pada perangkat desktop (otomatis dinonaktifkan di mobile untuk menghemat daya dan memori).
- **GitHub Pages + GitHub Actions** untuk build dan deployment statis.

> Front-end di-host di GitHub Pages. Firebase menjadi layanan backend terkelola. Jangan menaruh private key/service-account di kode client.

## Menjalankan di Antigravity IDE

1. Ekstrak ZIP lalu buka folder `smp-shafa-wafa-web` sebagai workspace.
2. Pastikan Node.js 22 atau versi LTS yang kompatibel sudah terpasang.
3. Salin `.env.example` menjadi `.env.local`.
4. Isi variabel `VITE_FIREBASE_*` dari **Firebase Console → Project settings → Your apps → Web app config**.
5. Buka terminal proyek, jalankan:

   ```bash
   npm install
   npm run dev
   ```

6. Buka alamat lokal yang ditampilkan Vite, biasanya `http://localhost:5173`.
7. Uji build produksi lokal dengan `npm run build`, kemudian `npm run preview`.

Jika Firebase belum diatur, landing page tetap bisa dilihat dengan konten bawaan. Form minat online dan CMS memerlukan Firebase.

## Setup Firebase

### 1. Buat proyek dan aplikasi Web

- Buat proyek Firebase baru.
- Tambahkan aplikasi Web dan salin konfigurasi ke `.env.local`.
- Aktifkan **Authentication → Sign-in method → Email/Password**.
- Buat database **Cloud Firestore**.
- Di bagian **Firestore → Rules**, tempel isi `firestore.rules` lalu Publish.

Rule di proyek ini membatasi baca konten publik hanya pada dokumen `siteContent/public`, melindungi data calon wali murid, dan mewajibkan dokumen admin eksplisit dengan `active: true`.

### 2. Buat akun admin pertama

1. Tambahkan pengguna melalui **Authentication → Users → Add user**. Jangan menyediakan form registrasi admin publik.
2. Salin UID akun itu.
3. Di **Firestore → Data**, buat collection `admins`.
4. Buat dokumen dengan **Document ID sama persis dengan UID** dan isi field Boolean `active: true`.
5. Buka website dengan parameter `?page=admin`, misalnya `http://localhost:5173/?page=admin`, lalu masuk menggunakan akun tersebut.

CMS tidak dapat mengangkat akun sendiri menjadi admin. Penambahan/pencabutan admin dilakukan melalui Firebase Console oleh pemilik proyek.

### 3. Koleksi yang digunakan

- `siteContent/public`: satu dokumen konfigurasi seluruh konten situs; array seperti program, fasilitas, navigasi, dan FAQ dapat diubah melalui editor JSON.
- `spmbLeads/{autoId}`: formulir minat awal calon wali murid.
- `admins/{uid}`: daftar UID admin yang diotorisasi.

Formulir minat hanya meminta nama wali, nama calon siswa, nomor WhatsApp, asal sekolah opsional, minat informasi asrama, dan pesan opsional. Data minat bukan pendaftaran resmi. Untuk deployment publik, pertimbangkan mengaktifkan **Firebase App Check**, menambahkan mekanisme anti-spam yang sesuai, dan meninjau kebijakan privasi sebelum membuka formulir kepada publik.

## Deploy ke GitHub Pages

1. Buat repository GitHub dan push seluruh isi folder ini ke branch `main`.
2. Buka **Settings → Secrets and variables → Actions → Variables**, kemudian buat enam repository variables berikut dari Firebase Web App config:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
3. Buka **Settings → Pages** dan pilih **GitHub Actions** sebagai source.
4. Push commit ke `main` atau jalankan workflow **Deploy SMP Shafa Wafa to GitHub Pages** secara manual.
5. Periksa tab **Actions** sampai job deployment sukses.

Workflow otomatis menyesuaikan base path untuk URL project Pages seperti `username.github.io/nama-repo/`. Jika menggunakan custom domain yang melayani situs pada root domain, ubah `BASE_PATH` di `.github/workflows/deploy.yml` menjadi `/` atau sesuaikan strategi domainnya.

Konfigurasi Firebase web dapat terlihat di bundle publik. Itu normal untuk Firebase Web SDK; **keamanan harus dijaga dengan Firestore Rules, App Check, dan pengelolaan akun admin**, bukan dengan mengandalkan rahasia pada kode front-end.

## CMS

Buka `/?page=admin` di lokal atau URL Pages dengan query yang sama.

- **Konten utama**: identitas sekolah, warna, hero, pengumuman, status SPMB, foto/URL, profil ketua yayasan, dan kontak.
- **Semua konten (JSON)**: kontrol yang lebih lengkap atas `sectionOrder`, `sectionVisibility`, menu navigasi, metrik, daftar program, fasilitas, FAQ, footer, metadata, dan semua teks lain.
- **Pendataan minat**: melihat 150 entri terbaru dan mengekspornya ke CSV.

Untuk memakai gambar baru, letakkan file di `public/images/`, commit, dan deploy ulang. Sesuaikan `imageUrl` terkait lewat CMS ke `/images/nama-file.jpg` atau URL gambar publik. Gambar eksternal perlu mengizinkan akses publik dan sebaiknya memakai HTTPS. CMS menyunting lokasi/URL aset; starter ini tidak meng-upload file ke Firebase Storage.

Perubahan CMS disimpan ke Firestore dan akan menjadi sumber konten publik. Sebelum formulir minat diaktifkan, simpan konfigurasi website dari CMS agar aturan Firestore membaca status aktif yang sama. Perubahan kode/CSS tetap dilakukan melalui Antigravity lalu dideploy lewat GitHub.

## Sebelum mengaktifkan formulir minat

- Login sebagai admin, tinjau konten, dan simpan konfigurasi ke Firestore setidaknya sekali.
- Aktifkan formulir minat dari CMS hanya setelah ada kanal tindak lanjut dan pemberitahuan privasi yang disetujui. Secara default, formulir dinonaktifkan.
- Jika rules sudah dipasang dan form tetap belum dapat mengirim, pastikan `admissions.interestFormEnabled` tersimpan sebagai nilai Boolean `true` pada `siteContent/public`.

## Model kampus 3D

Komponen `src/components/Campus3D.jsx` membuat model blok 3D langsung dengan Three.js agar tidak memerlukan file model GLB besar. Pengunjung dapat memutar, menggeser, dan memperbesar model. Modul Three.js dipisah ke chunk tersendiri dan baru dimuat saat bagian itu mendekati viewport.

Model tersebut **konseptual, bukan salinan ukuran/denah teknik yang presisi**. Lembar site plan pada `PONDOK TUBAN N2.pdf` yang diberikan memiliki title block bertuliskan *Pesantren MTs-MA Ikhwanus Shafa*, sehingga kesesuaiannya terhadap rancangan SMP Shafa Wafa perlu dikonfirmasi sebelum model atau gambar denah dipublikasikan sebagai representasi resmi. Untuk akurasi lebih tinggi, ganti konstruksi prosedural ini dengan model GLB/GLTF yang dihasilkan dari file CAD/BIM yang telah disetujui.

## Catatan sebelum website resmi dipublikasikan

- Proposal menyebut target awal tahun ajaran **2027/2028**, dua rombongan belajar kelas VII, dan 56 peserta didik sebagai **rencana**, bukan angka penerimaan final.
- Status pendaftaran resmi secara default **belum dibuka**. Ubah hanya setelah status izin, jadwal, dan ketentuan dikonfirmasi pihak penyelenggara.
- Biaya, jadwal, persyaratan, nomor kontak, dan kanal media sosial dibiarkan belum diklaim bila belum tersedia.
- Guru dan staf tidak ditampilkan sebagai daftar aktual sebelum nama/personel ditetapkan.
- Pastikan izin penggunaan foto ketua yayasan dan materi visual sebelum dipublikasikan.

## Struktur ringkas

```text
src/
  App.jsx                    Landing page + navigasi query-based
  data/defaultContent.js     Konten awal yang dapat diubah di CMS
  lib/firebase.js            Firebase Auth + Firestore
  lib/content.js             Baca/simpan konten dan formulir minat
  pages/Spmb.jsx             Halaman SPMB / minat awal
  pages/Admin.jsx            CMS admin
  components/Campus3D.jsx    Model konseptual Three.js
  styles.css                 Design system dan responsive layout
public/images/               Aset visual awal
firestore.rules              Keamanan data Firestore
.github/workflows/deploy.yml Build & deploy GitHub Pages
```

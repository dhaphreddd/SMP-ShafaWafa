# Checklist sebelum website dipublikasikan

## Fakta dan materi

- [ ] Konfirmasikan status izin dan redaksi yang boleh dipublikasikan terkait pembukaan SMP.
- [ ] Pastikan target 2027/2028, 56 siswa, dua rombongan belajar, dan 28 siswa per rombel masih sesuai arahan terbaru.
- [ ] Dapatkan persetujuan penggunaan foto Ketua Umum Yayasan dan ilustrasi arsitektur.
- [ ] Konfirmasikan apakah berkas site plan yang diberikan benar-benar berlaku untuk SMP Shafa Wafa; berkas `PONDOK TUBAN N2.pdf` memiliki title block yang menyebut pesantren MTs-MA Ikhwanus Shafa.
- [ ] Lengkapi kanal telepon/WhatsApp/email/media sosial hanya jika sudah menjadi kanal resmi.
- [ ] Jangan mengumumkan biaya, beasiswa, jadwal SPMB, akreditasi, atau personel yang belum ditetapkan.

## Firebase dan privasi

- [ ] Isi konfigurasi Firebase lokal dan variabel GitHub Actions dengan Web App config yang benar.
- [ ] Aktifkan Email/Password Authentication.
- [ ] Pasang dan publikasikan `firestore.rules`.
- [ ] Buat admin melalui Firebase Authentication lalu buat `admins/{uid}` dengan Boolean `active: true`.
- [ ] Login ke CMS dan simpan konfigurasi publik ke `siteContent/public` minimal sekali.
- [ ] Tinjau kebijakan privasi, tujuan pendataan, siapa yang boleh mengakses data minat, dan masa retensi/penghapusan data.
- [ ] Aktifkan `admissions.interestFormEnabled` hanya setelah formulir benar-benar siap. Default proyek adalah `false`.
- [ ] Pertimbangkan Firebase App Check dan proteksi anti-spam sebelum mengundang publik.
- [ ] Lakukan pengujian create lead sebagai pengunjung dan baca/export data hanya dari akun admin.
- [ ] Hapus data uji yang tidak diperlukan sebelum publikasi.

## GitHub Pages dan pengalaman pengguna

- [ ] Pastikan repository memakai branch `main` dan Pages source adalah **GitHub Actions**.
- [ ] Periksa hasil workflow pada tab Actions.
- [ ] Uji URL project Pages dengan path repository, termasuk `?page=spmb` dan `?page=admin`.
- [ ] Uji tampilan ponsel, navigasi, CTA, validasi formulir, FAQ, dan semua tautan.
- [ ] Uji tampilan 3D di browser/perangkat dengan WebGL dan pastikan situs tetap informatif saat 3D gagal dimuat.
- [ ] Uji semua foto/URL dari CMS setelah deployment.
- [ ] Jelaskan kepada pengelola bahwa perubahan konten CMS disimpan di Firestore, sedangkan file gambar baru/CSS/komponen kode harus dideploy melalui GitHub.

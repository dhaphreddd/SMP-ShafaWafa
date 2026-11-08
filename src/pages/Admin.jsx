import React, { useEffect, useState } from 'react';
import {
  BookOpen, Building2, Check, CheckCircle2, CircleAlert,
  Eye, Image as ImageIcon, LayoutDashboard, LockKeyhole,
  LogOut, Save, Settings2, ShieldCheck, Users, LoaderCircle, Sparkles,
  MessageCircle, HelpCircle, GraduationCap, MapPin,
  ExternalLink, SlidersHorizontal, Clock, Quote,
  Plus, Trash2, ChevronUp, ChevronDown, RotateCcw,
} from 'lucide-react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore/lite';
import { defaultContent } from '../data/defaultContent';
import { firebaseReady } from '../lib/firebase-config';
import { auth } from '../lib/firebase-auth';
import { db } from '../lib/firebase';
import { saveSiteContent } from '../lib/content';
import { resolveAssetUrl } from '../lib/assets';
import '../admin.css';

const clone = (value) => JSON.parse(JSON.stringify(value));

function setAtPath(object, path, value) {
  const keys = path.split('.');
  const result = clone(object);
  let cursor = result;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i];
    cursor[key] = Array.isArray(cursor[key]) ? [...cursor[key]] : { ...(cursor[key] || {}) };
    cursor = cursor[key];
  }
  cursor[keys[keys.length - 1]] = value;
  return result;
}

function Field({ label, value, onChange, type = 'text', note, rows = 3, placeholder = '' }) {
  return (
    <label className="cms-field">
      <span className="cms-field-label">{label}</span>
      {type === 'textarea' ? (
        <textarea
          rows={rows}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value ?? ''}
          onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          placeholder={placeholder}
        />
      )}
      {note && <small className="cms-field-note">{note}</small>}
    </label>
  );
}

function SwitchField({ label, checked, onChange, note }) {
  return (
    <label className="cms-switch-row">
      <div className="cms-switch-copy">
        <strong>{label}</strong>
        {note && <small>{note}</small>}
      </div>
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(e) => onChange(e.target.checked)}
      />
      <i className="switch-track" />
    </label>
  );
}

function LoginScreen({ onNavigate, externalError = '' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(externalError);

  useEffect(() => {
    if (externalError) setError(externalError);
  }, [externalError]);

  const login = async (event) => {
    event.preventDefault();
    if (!firebaseReady || !auth) {
      setError('Firebase belum dikonfigurasi. Lengkapi variabel lingkungan VITE_FIREBASE_* di GitHub Secrets atau .env.local.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      const messages = {
        'auth/invalid-credential': 'Email atau kata sandi tidak sesuai.',
        'auth/user-not-found': 'Akun admin belum terdaftar di Firebase.',
        'auth/wrong-password': 'Kata sandi tidak sesuai.',
        'auth/too-many-requests': 'Terlalu banyak percobaan masuk. Coba lagi beberapa saat lagi.',
        'auth/invalid-email': 'Format email belum benar.',
      };
      setError(messages[err.code] || err.message || 'Gagal masuk. Periksa konfigurasi Firebase Authentication.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login-shell">
      <div className="admin-login-art">
        <div className="login-art-bg-pattern" aria-hidden="true" />
        <div className="login-art-content">
          <div className="login-brand-badge">
            <ShieldCheck size={28} className="text-gold" />
            <div>
              <h3>SMP SHAFA WAFA</h3>
              <small>Tegalagung, Semanding, Tuban</small>
            </div>
          </div>
          <h1>Pengelolaan Konten Sekolah Terpadu</h1>
          <p>
            Portal khusus administrator Yayasan Pondok Pesantren Shafa Wafa untuk mengelola seluruh teks, kurikulum, galeri, kontak, dan alur pendaftaran santri baru.
          </p>
          <div className="login-art-feature-card">
            <Sparkles size={20} className="text-gold" />
            <div>
              <strong>CMS Berbasis Cloud</strong>
              <p>Perubahan data langsung tersinkronisasi dan tampil resmi di website publik.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-login-panel">
        <div className="admin-login-card">
          <div className="login-card-head">
            <span className="login-pill">Portal Administrator</span>
            <h2>Masuk ke Akun Admin</h2>
            <p>Masukkan email dan kata sandi yang telah diotorisasi.</p>
          </div>

          {error && (
            <div className="cms-alert cms-alert-error" role="alert">
              <CircleAlert size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={login} className="admin-login-form">
            <label className="cms-field">
              <span className="cms-field-label">Email Administrator</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shafawafa.sch.id"
                disabled={busy}
              />
            </label>

            <label className="cms-field">
              <div className="field-label-row">
                <span className="cms-field-label">Kata Sandi</span>
                <button
                  type="button"
                  className="password-toggle-link"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex="-1"
                >
                  {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                disabled={busy}
              />
            </label>

            <button
              type="submit"
              className="button button-primary button-large login-submit-btn"
              disabled={busy}
            >
              {busy ? (
                <>
                  <LoaderCircle className="spin-icon" size={18} />
                  <span>Memeriksa Akses...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Panel CMS</span>
                  <LockKeyhole size={16} />
                </>
              )}
            </button>
          </form>

          <div className="login-card-footer">
            <button
              type="button"
              className="back-home-link"
              onClick={() => onNavigate('home')}
            >
              ← Kembali ke Beranda Sekolah
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const cmsMenus = [
  { id: 'brand', label: '1. Identitas & Header', icon: Sparkles },
  { id: 'hero', label: '2. Hero Banner & Metrik', icon: LayoutDashboard },
  { id: 'about', label: '3. Tentang & 4 Pilar', icon: BookOpen },
  { id: 'program', label: '4. Program & Kurikulum', icon: GraduationCap },
  { id: 'routine', label: '5. Keseharian Santri', icon: Clock },
  { id: 'facilities', label: '6. Fasilitas & 3D', icon: Building2 },
  { id: 'leadership', label: '7. Sambutan Pimpinan', icon: Users },
  { id: 'testimonials', label: '8. Kata Tokoh / Testimoni', icon: Quote },
  { id: 'gallery', label: '9. Galeri Foto & Kegiatan', icon: ImageIcon },
  { id: 'admissions', label: '10. SPMB & WhatsApp', icon: MessageCircle },
  { id: 'faq', label: '11. FAQ, Kontak & Lokasi', icon: HelpCircle },
  { id: 'visibility', label: '12. Urutan & Visibilitas Modul', icon: SlidersHorizontal },
];

const SECTION_METADATA = {
  about: { label: 'Tentang Shafa Wafa', desc: 'Latar belakang filosofis, pengantar & profil sekolah', menuId: 'about' },
  values: { label: '4 Pilar Nilai Keunggulan', desc: 'Pondasi filosofis dan karakter santri', menuId: 'about' },
  program: { label: 'Program Unggulan Akademik & Pesantren', desc: 'Kurikulum terpadu & muatan diniyah pesantren', menuId: 'program' },
  routine: { label: 'Jadwal Keseharian Santri (Ritme 24 Jam)', desc: 'Rutinitas santri terarah dari bangun hingga tidur', menuId: 'routine' },
  facilities: { label: 'Rancangan Fasilitas Terpadu', desc: 'Katalog sarana belajar, laboratorium & asrama santri', menuId: 'facilities' },
  campus3d: { label: 'Visual 3D Arsitektur Gedung Sekolah', desc: 'Model 3D interaktif masterplan kawasan terpadu', menuId: 'facilities' },
  leadership: { label: 'Sambutan Pimpinan Yayasan', desc: 'Pesan amanah dan komitmen ketua umum yayasan', menuId: 'leadership' },
  testimonials: { label: 'Kata Tokoh & Testimoni Wali Santri', desc: 'Ulasan kepercayaan, endorsement & suara wali', menuId: 'testimonials' },
  gallery: { label: 'Galeri Foto & Dokumentasi Sekolah', desc: 'Potret foto kawasan dan aktivitas santri', menuId: 'gallery' },
  admissions: { label: 'Banner CTA SPMB & WhatsApp', desc: 'Ajakan pendaftaran & konsultasi panitia penerimaan', menuId: 'admissions' },
  faq: { label: 'Keterbukaan Informasi & FAQ', desc: 'Daftar tanya jawab umum seputar sekolah & pendaftaran', menuId: 'faq' },
  location: { label: 'Akses & Lokasi Sekolah (Google Maps)', desc: 'Peta rute interaktif & alamat terpadu Semanding Tuban', menuId: 'faq' },
};

export default function AdminPage({ onNavigate, onContentSaved }) {
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [content, setContent] = useState(defaultContent);
  const [activeMenu, setActiveMenu] = useState('brand');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!auth) {
      setAuthChecked(true);
      return undefined;
    }
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setAuthorized(false);
        setAuthChecked(true);
        return;
      }
      try {
        const adminDoc = await getDoc(doc(db, 'admins', nextUser.uid));
        if (adminDoc.exists() && adminDoc.data()?.active === true) {
          setAuthorized(true);
          setError('');
        } else {
          setAuthorized(false);
          setError(
            `Akun (${nextUser.email}) berhasil masuk, namun belum diotorisasi sebagai admin. Buat dokumen admins/${nextUser.uid} dengan field active: true di Firebase Console.`
          );
        }
      } catch (err) {
        setAuthorized(false);
        setError('Pemeriksaan hak akses gagal. Pastikan Firestore Rules terpasang dan koleksi admins telah dibuat.');
      } finally {
        setAuthChecked(true);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authorized) return;
    let active = true;
    import('../lib/content')
      .then(({ loadSiteContent }) => loadSiteContent())
      .then((result) => {
        if (!active) return;
        const next = clone(result.content);
        setContent(next);
        if (result.source !== 'firebase') {
          setSuccess('Konten lokal sedang aktif. Simpan perubahan untuk mempublikasikannya ke Firestore.');
        }
      })
      .catch(() => setError('Gagal memuat konten dari Firestore.'));
    return () => {
      active = false;
    };
  }, [authorized]);

  const changePaths = (changes) => {
    const next = changes.reduce((current, [path, value]) => setAtPath(current, path, value), content);
    setContent(next);
    setSuccess('');
    setError('');
  };
  const changePath = (path, value) => changePaths([[path, value]]);

  const addArrayItem = (path, defaultItem) => {
    const list = [...(path.split('.').reduce((o, k) => o?.[k], content) || []), defaultItem];
    changePath(path, list);
  };

  const removeArrayItem = (path, index) => {
    const list = [...(path.split('.').reduce((o, k) => o?.[k], content) || [])];
    list.splice(index, 1);
    changePath(path, list);
  };

  const moveSection = (index, direction) => {
    const rawOrder = Array.isArray(content.sectionOrder) && content.sectionOrder.length > 0
      ? content.sectionOrder
      : defaultContent.sectionOrder;
    const currentOrder = [
      ...rawOrder,
      ...defaultContent.sectionOrder.filter((k) => !rawOrder.includes(k)),
    ];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;
    const item = currentOrder[index];
    currentOrder.splice(index, 1);
    currentOrder.splice(targetIndex, 0, item);
    changePath('sectionOrder', currentOrder);
  };

  const resetSectionOrder = () => {
    changePath('sectionOrder', [...defaultContent.sectionOrder]);
  };

  const toggleSectionVisibility = (key, value) => {
    const dualKeys = {
      routine: 'dailyRoutine.visible',
      campus3d: 'campus3d.visible',
      leadership: 'leadership.visible',
      testimonials: 'testimonials.visible',
      gallery: 'gallery.visible',
      admissions: 'admissions.visible',
      floatingWa: 'floatingWa.visible',
    };
    const paths = [[`sectionVisibility.${key}`, value]];
    if (dualKeys[key]) {
      paths.push([dualKeys[key], value]);
    }
    changePaths(paths);
  };

  const isSectionVisible = (key) => {
    if (content.sectionVisibility?.[key] === false) return false;
    if (key === 'routine' && content.dailyRoutine?.visible === false) return false;
    if (key === 'campus3d' && content.campus3d?.visible === false) return false;
    if (key === 'leadership' && content.leadership?.visible === false) return false;
    if (key === 'testimonials' && content.testimonials?.visible === false) return false;
    if (key === 'gallery' && content.gallery?.visible === false) return false;
    if (key === 'admissions' && content.admissions?.visible === false) return false;
    if (key === 'floatingWa' && content.floatingWa?.visible === false) return false;
    return true;
  };

  const validateContent = (candidate) => {
    const requiredObjects = [
      'brand', 'theme', 'header', 'hero', 'about', 'program',
      'facilities', 'campus3d', 'leadership', 'admissions', 'faq', 'contact', 'footer', 'siteMeta',
    ];
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
      throw new Error('Konten harus berupa objek JSON.');
    }
    const missingObjects = requiredObjects.filter(
      (key) => !candidate[key] || typeof candidate[key] !== 'object' || Array.isArray(candidate[key])
    );
    if (missingObjects.length) {
      throw new Error(`Struktur konten belum lengkap. Objek yang kurang: ${missingObjects.join(', ')}.`);
    }
    if (!candidate.brand.name?.trim() || !candidate.hero.title?.trim() || !candidate.admissions.academicYear) {
      throw new Error('Nama sekolah, judul hero, dan tahun ajaran target tidak boleh kosong.');
    }
  };

  const save = async () => {
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      validateContent(content);
      await saveSiteContent(content, user.uid);
      const next = clone(content);
      setContent(next);
      setSuccess('Perubahan konfigurasi tersimpan di Firestore! Website publik langsung membaca konten terbaru.');
      onContentSaved?.(next);
    } catch (err) {
      setError(err.message || 'Perubahan gagal disimpan ke Firestore.');
    } finally {
      setBusy(false);
    }
  };

  if (!firebaseReady) {
    return (
      <div className="admin-unconfigured">
        <div className="admin-unconfigured-card">
          <CircleAlert size={48} className="text-gold" />
          <h2>Firebase Belum Diatur</h2>
          <p>
            Konfigurasi Firebase belum diisi di file <code>.env.local</code>.
          </p>
          <button className="button button-primary" onClick={() => onNavigate('home')}>
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  if (!authChecked) {
    return (
      <div className="admin-auth-loading">
        <LoaderCircle size={36} className="spin-icon" />
        <p>Memeriksa sesi administrator...</p>
      </div>
    );
  }

  if (!user || !authorized) return <LoginScreen onNavigate={onNavigate} externalError={error} />;

  const currentMenu = cmsMenus.find((m) => m.id === activeMenu) || cmsMenus[0];

  return (
    <div className="cms-app">
      {/* Sidebar: 12 Clean CMS Menus */}
      <aside className="cms-sidebar">
        <div className="cms-sidebar-header">
          <div className="cms-brand-row">
            <img
              src={resolveAssetUrl(content.brand?.logoUrl || '/images/logo.jpeg')}
              alt="Logo SMP Shafa Wafa"
              className="cms-logo-img"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="cms-brand-text">
              <strong>CMS SHAFA</strong>
              <small>Panel Kustomisasi</small>
            </div>
          </div>
          <div className="cms-phase-badge">
            <span className="pulse-dot" />
            <span>Kanal Administrator</span>
          </div>
        </div>

        <nav className="cms-nav">
          <div className="cms-nav-group-label">KONTEN & MODUL WEBSITE</div>
          {cmsMenus.map((item) => {
            const Icon = item.icon;
            const active = activeMenu === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`cms-nav-item ${active ? 'is-active' : ''}`}
                onClick={() => {
                  setActiveMenu(item.id);
                  setError('');
                  setSuccess('');
                }}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="cms-sidebar-bottom">
          <div className="cms-user-profile">
            <span className="user-avatar">{(user.email || 'A').slice(0, 1).toUpperCase()}</span>
            <div className="user-info">
              <strong>{user.email}</strong>
              <small>Administrator</small>
            </div>
          </div>

          <button
            className="button button-outline button-small cms-logout-btn"
            onClick={() => signOut(auth)}
          >
            <LogOut size={14} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main CMS Content */}
      <main className="cms-main">
        {/* Top Action Header */}
        <header className="cms-topbar">
          <div className="cms-topbar-left">
            <span className="cms-breadcrumb">CMS / {currentMenu.label}</span>
            <h1>{currentMenu.label}</h1>
          </div>
          <div className="cms-topbar-actions">
            <button type="button" className="button button-outline" onClick={() => onNavigate('home')}>
              <Eye size={16} />
              <span>Lihat Live Website</span>
            </button>
            <button
              type="button"
              className="button button-primary"
              onClick={save}
              disabled={busy}
            >
              {busy ? <LoaderCircle className="spin-icon" size={16} /> : <Save size={16} />}
              <span>{busy ? 'Menyimpan...' : 'Simpan Semua Perubahan'}</span>
            </button>
          </div>
        </header>

        <div className="cms-content-area">
          {error && (
            <div className="cms-alert cms-alert-error">
              <CircleAlert size={20} />
              <span>{error}</span>
              <button className="alert-close-btn" onClick={() => setError('')} aria-label="Tutup pesan">×</button>
            </div>
          )}

          {success && (
            <div className="cms-alert cms-alert-success">
              <CheckCircle2 size={20} />
              <span>{success}</span>
              <button className="alert-close-btn" onClick={() => setSuccess('')} aria-label="Tutup pesan">×</button>
            </div>
          )}

          <div className="cms-editor-fullwidth">

            {/* 1. BRAND & HEADER */}
            {activeMenu === 'brand' && (
              <div className="cms-subpanel">
                <div className="cms-subpanel-head">Identitas Sekolah & Navigasi Header</div>
                <div className="cms-dual-fields">
                  <Field
                    label="Nama Lengkap Lembaga"
                    value={content.brand?.name}
                    onChange={(v) => changePath('brand.name', v)}
                    placeholder="SMP Shafa Wafa"
                  />
                  <Field
                    label="Nama Pendek / Panggilan"
                    value={content.brand?.shortName}
                    onChange={(v) => changePath('brand.shortName', v)}
                    placeholder="Shafa Wafa"
                  />
                </div>
                <Field
                  label="Slogan / Tagline Institusi"
                  value={content.brand?.tagline}
                  onChange={(v) => changePath('brand.tagline', v)}
                  placeholder="Berilmu, Beradab, Bertumbuh"
                />
                <Field
                  label="Keterangan Wilayah / Sub-lokasi"
                  value={content.brand?.subLocation}
                  onChange={(v) => changePath('brand.subLocation', v)}
                  placeholder="Tegalagung, Semanding, Tuban"
                />
                <div className="cms-dual-fields">
                  <Field
                    label="Path / URL Gambar Logo"
                    value={content.brand?.logoUrl}
                    onChange={(v) => changePath('brand.logoUrl', v)}
                    placeholder="/images/logo.jpeg"
                  />
                  <Field
                    label="Teks Tombol CTA di Header"
                    value={content.header?.ctaLabel}
                    onChange={(v) => changePath('header.ctaLabel', v)}
                    placeholder="Info SPMB"
                  />
                </div>

                <div className="cms-subpanel" style={{ marginTop: '16px', background: '#f5f7f6' }}>
                  <div className="cms-subpanel-head">Pita Pengumuman Atas (Announcement Bar)</div>
                  <SwitchField
                    label="Tampilkan Pita Pengumuman di Bagian Teratas"
                    checked={content.announcement?.visible !== false}
                    onChange={(v) => changePath('announcement.visible', v)}
                  />
                  <Field
                    label="Label Pill / Status Singkat"
                    value={content.announcement?.pill}
                    onChange={(v) => changePath('announcement.pill', v)}
                    placeholder="Tahun Ajaran 2027/2028"
                  />
                  <Field
                    label="Isi Pesan Pengumuman"
                    type="textarea"
                    rows={2}
                    value={content.announcement?.body}
                    onChange={(v) => changePath('announcement.body', v)}
                  />
                  <Field
                    label="Label Status di Kanan"
                    value={content.announcement?.statusLabel}
                    onChange={(v) => changePath('announcement.statusLabel', v)}
                    placeholder="Pendaftaran Dibuka"
                  />
                </div>
              </div>
            )}

            {/* 2. HERO BANNER & METRIK */}
            {activeMenu === 'hero' && (
              <div className="cms-subpanel">
                <div className="cms-subpanel-head">Hero Banner & Metrik Keunggulan</div>
                <Field
                  label="Label Badge Paling Atas"
                  value={content.hero?.badge}
                  onChange={(v) => changePath('hero.badge', v)}
                  placeholder="Pondok Pesantren & Sekolah Menengah Pertama"
                />
                <Field
                  label="Subjudul / Eyebrow"
                  value={content.hero?.eyebrow}
                  onChange={(v) => changePath('hero.eyebrow', v)}
                  placeholder="Pendidikan formal dalam lingkungan pesantren"
                />
                <Field
                  label="Judul Utama Hero (Gunakan Enter untuk baris baru)"
                  type="textarea"
                  rows={2}
                  value={content.hero?.title}
                  onChange={(v) => changePath('hero.title', v)}
                  placeholder="Tumbuh dalam ilmu.&#10;Kuat dalam adab."
                />
                <Field
                  label="Deskripsi Paragraf Hero"
                  type="textarea"
                  rows={3}
                  value={content.hero?.description}
                  onChange={(v) => changePath('hero.description', v)}
                />
                <div className="cms-dual-fields">
                  <Field
                    label="Label Tombol Utama Hero"
                    value={content.hero?.primaryLabel}
                    onChange={(v) => changePath('hero.primaryLabel', v)}
                    placeholder="Informasi SPMB"
                  />
                  <Field
                    label="Label Tombol Sekunder Hero"
                    value={content.hero?.secondaryLabel}
                    onChange={(v) => changePath('hero.secondaryLabel', v)}
                    placeholder="Jelajahi Program"
                  />
                </div>
                <Field
                  label="URL / Path Gambar Masterplan Kawasan"
                  value={content.hero?.imageUrl}
                  onChange={(v) => changePath('hero.imageUrl', v)}
                  placeholder="/images/masterplan.jpeg"
                  note="Ditampilkan secara utuh dan responsif di samping kanan hero banner."
                />
                <Field
                  label="Teks Afiliasi di Kartu Identitas"
                  value={content.hero?.affiliation}
                  onChange={(v) => changePath('hero.affiliation', v)}
                  placeholder="Afiliasi Ponpes Ahlus-Shafa Wal-Wafa Tuban"
                />

                <div className="cms-subpanel" style={{ marginTop: '16px', background: '#f5f7f6' }}>
                  <div className="cms-subpanel-head">4 Kartu Metrik Keunggulan</div>
                  <Field
                    label="Catatan Kaki di Bawah Kartu Metrik"
                    type="textarea"
                    rows={2}
                    value={content.metricsNote}
                    onChange={(v) => changePath('metricsNote', v)}
                    placeholder="*Seluruh fasilitas dan kurikulum dirancang terpadu untuk keunggulan santri..."
                  />
                  {(content.metrics || []).slice(0, 4).map((metric, idx) => (
                    <div className="cms-subpanel" key={idx} style={{ background: '#ffffff', marginTop: '8px' }}>
                      <div className="cms-dual-fields">
                        <Field
                          label={`Nilai Angka #${idx + 1}`}
                          value={metric.value}
                          onChange={(v) => changePath(`metrics.${idx}.value`, v)}
                          placeholder="2027/2028 atau 56 Santri"
                        />
                        <Field
                          label={`Label Judul #${idx + 1}`}
                          value={metric.label}
                          onChange={(v) => changePath(`metrics.${idx}.label`, v)}
                          placeholder="Tahun Perdana"
                        />
                      </div>
                      <Field
                        label="Keterangan Singkat"
                        value={metric.caption}
                        onChange={(v) => changePath(`metrics.${idx}.caption`, v)}
                        placeholder="Penerimaan Dibuka"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. TENTANG KAMI & 4 PILAR */}
            {activeMenu === 'about' && (
              <div className="cms-subpanel">
                <div className="cms-subpanel-head">Tentang Shafa Wafa & 4 Pilar Nilai</div>
                <Field
                  label="Subjudul / Eyebrow"
                  value={content.about?.eyebrow}
                  onChange={(v) => changePath('about.eyebrow', v)}
                  placeholder="Tentang Shafa Wafa"
                />
                <Field
                  label="Judul Utama Tentang Kami"
                  value={content.about?.title}
                  onChange={(v) => changePath('about.title', v)}
                  placeholder="Menjaga Nilai Salaf, Memeluk Kemajuan Zaman"
                />
                <Field
                  label="Paragraf Narasi 1"
                  type="textarea"
                  rows={3}
                  value={(content.about?.paragraphs || [])[0]}
                  onChange={(v) => changePath('about.paragraphs.0', v)}
                />
                <Field
                  label="Paragraf Narasi 2"
                  type="textarea"
                  rows={3}
                  value={(content.about?.paragraphs || [])[1]}
                  onChange={(v) => changePath('about.paragraphs.1', v)}
                />

                <h5 style={{ margin: '16px 0 6px', fontSize: '13px', color: 'var(--primary-dark)' }}>
                  4 Kartu Nilai Tambah / Keunggulan
                </h5>
                {(content.about?.features || []).slice(0, 4).map((feat, idx) => (
                  <div className="cms-subpanel" key={idx} style={{ background: '#f5f7f6', marginTop: '6px' }}>
                    <div className="cms-subpanel-head">
                      <strong>Keunggulan #{idx + 1}</strong>
                    </div>
                    <Field
                      label="Judul Keunggulan"
                      value={feat.title}
                      onChange={(v) => changePath(`about.features.${idx}.title`, v)}
                    />
                    <Field
                      label="Deskripsi Keunggulan"
                      type="textarea"
                      rows={2}
                      value={feat.description}
                      onChange={(v) => changePath(`about.features.${idx}.description`, v)}
                    />
                  </div>
                ))}

                <h5 style={{ margin: '16px 0 6px', fontSize: '13px', color: 'var(--primary-dark)' }}>
                  4 Pilar Nilai Filosofis (Values)
                </h5>
                {(content.values || []).slice(0, 4).map((val, idx) => (
                  <div className="cms-subpanel" key={idx} style={{ background: '#f5f7f6', marginTop: '6px' }}>
                    <div className="cms-subpanel-head">
                      <strong>Pilar #{idx + 1}: {val.title}</strong>
                    </div>
                    <div className="cms-dual-fields">
                      <Field
                        label="Label Pilar"
                        value={val.pillar}
                        onChange={(v) => changePath(`values.${idx}.pillar`, v)}
                        placeholder={`PILAR 0${idx + 1}`}
                      />
                      <Field
                        label="Judul Nilai"
                        value={val.title}
                        onChange={(v) => changePath(`values.${idx}.title`, v)}
                      />
                    </div>
                    <Field
                      label="Uraian Nilai Filosofis"
                      type="textarea"
                      rows={2}
                      value={val.description}
                      onChange={(v) => changePath(`values.${idx}.description`, v)}
                    />
                    <Field
                      label="Sorotan / Highlight Bawah"
                      value={val.highlight}
                      onChange={(v) => changePath(`values.${idx}.highlight`, v)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 4. PROGRAM & KURIKULUM */}
            {activeMenu === 'program' && (
              <div className="cms-subpanel">
                <div className="cms-subpanel-head">Program Unggulan Akademik & Kepesantrenan</div>
                <Field
                  label="Subjudul / Eyebrow"
                  value={content.program?.eyebrow}
                  onChange={(v) => changePath('program.eyebrow', v)}
                  placeholder="Rancangan Kurikulum"
                />
                <Field
                  label="Judul Bagian Program"
                  value={content.program?.title}
                  onChange={(v) => changePath('program.title', v)}
                />
                <Field
                  label="Deskripsi Pengantar"
                  type="textarea"
                  rows={2}
                  value={content.program?.description}
                  onChange={(v) => changePath('program.description', v)}
                />

                <h5 style={{ margin: '14px 0 6px', fontSize: '13px', color: 'var(--primary-dark)' }}>
                  4 Kartu Program Pendidikan
                </h5>
                {(content.program?.items || []).slice(0, 4).map((item, idx) => (
                  <div className="cms-subpanel" key={idx} style={{ background: '#f5f7f6', marginTop: '6px' }}>
                    <div className="cms-subpanel-head">
                      <strong>Program #{idx + 1}: {item.title}</strong>
                    </div>
                    <div className="cms-dual-fields">
                      <Field
                        label="Nama Program"
                        value={item.title}
                        onChange={(v) => changePath(`program.items.${idx}.title`, v)}
                      />
                      <Field
                        label="Label Sorotan"
                        value={item.highlight}
                        onChange={(v) => changePath(`program.items.${idx}.highlight`, v)}
                        placeholder="Kurikulum Inti"
                      />
                    </div>
                    <Field
                      label="Deskripsi Program"
                      type="textarea"
                      rows={2}
                      value={item.description}
                      onChange={(v) => changePath(`program.items.${idx}.description`, v)}
                    />
                    <div className="cms-dual-fields">
                      <Field
                        label="Poin Keunggulan 1"
                        value={(item.bullets || [])[0]}
                        onChange={(v) => changePath(`program.items.${idx}.bullets.0`, v)}
                      />
                      <Field
                        label="Poin Keunggulan 2"
                        value={(item.bullets || [])[1]}
                        onChange={(v) => changePath(`program.items.${idx}.bullets.1`, v)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. KESEHARIAN SANTRI */}
            {activeMenu === 'routine' && (
              <div className="cms-subpanel">
                <div className="cms-subpanel-head">Jadwal Keseharian Santri (Ritme 24 Jam)</div>
                <SwitchField
                  label="Tampilkan Bagian Keseharian Santri"
                  checked={content.dailyRoutine?.visible !== false}
                  onChange={(v) => changePath('dailyRoutine.visible', v)}
                />
                <Field
                  label="Subjudul / Eyebrow"
                  value={content.dailyRoutine?.eyebrow}
                  onChange={(v) => changePath('dailyRoutine.eyebrow', v)}
                  placeholder="RITME KEHIDUPAN SANTRI"
                />
                <Field
                  label="Judul Bagian Rutinitas"
                  value={content.dailyRoutine?.title}
                  onChange={(v) => changePath('dailyRoutine.title', v)}
                />
                <Field
                  label="Deskripsi Pengantar"
                  type="textarea"
                  rows={2}
                  value={content.dailyRoutine?.description}
                  onChange={(v) => changePath('dailyRoutine.description', v)}
                />

                <h5 style={{ margin: '14px 0 6px', fontSize: '13px', color: 'var(--primary-dark)' }}>
                  Daftar Agenda Rutinitas Santri
                </h5>
                {(content.dailyRoutine?.items || []).map((item, idx) => (
                  <div className="cms-subpanel" key={idx} style={{ background: '#f5f7f6', marginTop: '6px' }}>
                    <div className="cms-subpanel-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>Agenda #{idx + 1}: {item.time} ({item.period})</strong>
                      {(content.dailyRoutine?.items || []).length > 1 && (
                        <button
                          type="button"
                          className="btn-remove-item"
                          onClick={() => removeArrayItem('dailyRoutine.items', idx)}
                        >
                          <Trash2 size={13} />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>
                    <div className="cms-dual-fields">
                      <Field
                        label="Rentang Waktu"
                        value={item.time}
                        onChange={(v) => changePath(`dailyRoutine.items.${idx}.time`, v)}
                        placeholder="04.00 - 05.30"
                      />
                      <Field
                        label="Periode Waktu"
                        value={item.period}
                        onChange={(v) => changePath(`dailyRoutine.items.${idx}.period`, v)}
                        placeholder="Pagi Hari / Malam Hari"
                      />
                    </div>
                    <div className="cms-dual-fields">
                      <Field
                        label="Judul Agenda"
                        value={item.title}
                        onChange={(v) => changePath(`dailyRoutine.items.${idx}.title`, v)}
                      />
                      <Field
                        label="Label Kategori (Tag)"
                        value={item.tag}
                        onChange={(v) => changePath(`dailyRoutine.items.${idx}.tag`, v)}
                        placeholder="Ubudiyah / Akademik"
                      />
                    </div>
                    <Field
                      label="Uraian Aktivitas"
                      type="textarea"
                      rows={2}
                      value={item.activity}
                      onChange={(v) => changePath(`dailyRoutine.items.${idx}.activity`, v)}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-add-item"
                  onClick={() =>
                    addArrayItem('dailyRoutine.items', {
                      time: '16.00 - 17.00',
                      period: 'Sore Hari',
                      title: 'Agenda Baru',
                      activity: 'Deskripsi aktivitas santri...',
                      tag: 'Aktivitas',
                    })
                  }
                >
                  <Plus size={16} />
                  <span>Tambah Agenda Waktu Baru</span>
                </button>
              </div>
            )}

            {/* 6. FASILITAS & 3D */}
            {activeMenu === 'facilities' && (
              <div className="cms-subpanel">
                <div className="cms-subpanel-head">Rancangan Fasilitas Terpadu & Visual 3D</div>
                <Field
                  label="Subjudul / Eyebrow"
                  value={content.facilities?.eyebrow}
                  onChange={(v) => changePath('facilities.eyebrow', v)}
                  placeholder="Infrastruktur Sekolah"
                />
                <Field
                  label="Judul Bagian Fasilitas"
                  value={content.facilities?.title}
                  onChange={(v) => changePath('facilities.title', v)}
                />
                <Field
                  label="Deskripsi Pengantar"
                  type="textarea"
                  rows={2}
                  value={content.facilities?.description}
                  onChange={(v) => changePath('facilities.description', v)}
                />
                <Field
                  label="Badge Status Kawasan"
                  value={content.facilities?.statusBadge}
                  onChange={(v) => changePath('facilities.statusBadge', v)}
                  placeholder="Status Resmi: Beroperasi Penuh"
                />

                <h5 style={{ margin: '14px 0 6px', fontSize: '13px', color: 'var(--primary-dark)' }}>
                  Daftar Kartu Fasilitas
                </h5>
                {(content.facilities?.items || []).slice(0, 6).map((item, idx) => (
                  <div className="cms-subpanel" key={idx} style={{ background: '#f5f7f6', marginTop: '6px' }}>
                    <div className="cms-subpanel-head">
                      <strong>Fasilitas #{idx + 1}: {item.title}</strong>
                    </div>
                    <div className="cms-dual-fields">
                      <Field
                        label="Nama Fasilitas"
                        value={item.title}
                        onChange={(v) => changePath(`facilities.items.${idx}.title`, v)}
                      />
                      <Field
                        label="Status Kesiapan"
                        value={item.status}
                        onChange={(v) => changePath(`facilities.items.${idx}.status`, v)}
                        placeholder="Tersedia Lengkap"
                      />
                    </div>
                    <Field
                      label="Catatan / Target Realisasi"
                      value={item.note}
                      onChange={(v) => changePath(`facilities.items.${idx}.note`, v)}
                      placeholder="Sentra Ibadah & Pembinaan Santri"
                    />
                    <Field
                      label="Deskripsi Fasilitas"
                      type="textarea"
                      rows={2}
                      value={item.description}
                      onChange={(v) => changePath(`facilities.items.${idx}.description`, v)}
                    />
                  </div>
                ))}

                <div className="cms-subpanel" style={{ marginTop: '16px', background: '#f5f7f6' }}>
                  <div className="cms-subpanel-head">Visual 3D Arsitektur Gedung Sekolah</div>
                  <SwitchField
                    label="Tampilkan Visual 3D Gedung Sekolah (Desktop)"
                    checked={content.campus3d?.visible !== false}
                    onChange={(v) => changePath('campus3d.visible', v)}
                    note="Di perangkat ponsel, visual 3D otomatis diganti kartu arsitektur ringan agar hemat kuota & memori."
                  />
                  <Field
                    label="Subjudul / Eyebrow"
                    value={content.campus3d?.eyebrow}
                    onChange={(v) => changePath('campus3d.eyebrow', v)}
                    placeholder="Eksplorasi Ruang Visual"
                  />
                  <Field
                    label="Judul Tur 3D"
                    value={content.campus3d?.title}
                    onChange={(v) => changePath('campus3d.title', v)}
                  />
                  <Field
                    label="Deskripsi Pengantar"
                    type="textarea"
                    rows={2}
                    value={content.campus3d?.description}
                    onChange={(v) => changePath('campus3d.description', v)}
                  />
                  <Field
                    label="Catatan / Disclaimer Arsitektural"
                    type="textarea"
                    rows={2}
                    value={content.campus3d?.disclaimer}
                    onChange={(v) => changePath('campus3d.disclaimer', v)}
                  />
                </div>
              </div>
            )}

            {/* 7. SAMBUTAN PIMPINAN */}
            {activeMenu === 'leadership' && (
              <div className="cms-subpanel">
                <div className="cms-subpanel-head">Sambutan Pimpinan Yayasan & Profil</div>
                <SwitchField
                  label="Tampilkan Bagian Sambutan Pimpinan"
                  checked={content.leadership?.visible !== false}
                  onChange={(v) => changePath('leadership.visible', v)}
                />
                <Field
                  label="Subjudul / Eyebrow"
                  value={content.leadership?.eyebrow}
                  onChange={(v) => changePath('leadership.eyebrow', v)}
                  placeholder="Sambutan Khidmat"
                />
                <Field
                  label="Judul Bagian Sambutan"
                  value={content.leadership?.title}
                  onChange={(v) => changePath('leadership.title', v)}
                />
                <div className="cms-dual-fields">
                  <Field
                    label="Nama Lengkap Pimpinan"
                    value={content.leadership?.name}
                    onChange={(v) => changePath('leadership.name', v)}
                  />
                  <Field
                    label="Jabatan / Peran di Yayasan"
                    value={content.leadership?.role}
                    onChange={(v) => changePath('leadership.role', v)}
                    placeholder="Ketua Umum Yayasan Shafa Wafa"
                  />
                </div>
                <Field
                  label="Kutipan Sambutan Utama (Quote)"
                  type="textarea"
                  rows={2}
                  value={content.leadership?.quote}
                  onChange={(v) => changePath('leadership.quote', v)}
                />
                <Field
                  label="Uraian Sambutan / Biografi Lengkap"
                  type="textarea"
                  rows={4}
                  value={content.leadership?.bio}
                  onChange={(v) => changePath('leadership.bio', v)}
                />
                <Field
                  label="Path / URL Foto Pimpinan"
                  value={content.leadership?.imageUrl}
                  onChange={(v) => changePath('leadership.imageUrl', v)}
                  placeholder="/images/ketua-yayasan.webp"
                  note="Ukuran foto ditampilkan kompak di samping teks sambutan."
                />
                <Field
                  label="Judul Informasi Tenaga Pendidik"
                  value={content.leadership?.staffNoteTitle}
                  onChange={(v) => changePath('leadership.staffNoteTitle', v)}
                  placeholder="Informasi Tim Pendidik & Tenaga Kependidikan"
                />
                <Field
                  label="Penjelasan Kesiapan Guru & Asatidz"
                  type="textarea"
                  rows={3}
                  value={content.leadership?.staffNote}
                  onChange={(v) => changePath('leadership.staffNote', v)}
                />
              </div>
            )}

            {/* 8. TESTIMONI & KATA TOKOH */}
            {activeMenu === 'testimonials' && (
              <div className="cms-subpanel">
                <div className="cms-subpanel-head">Kata Tokoh & Testimoni Wali Santri</div>
                <SwitchField
                  label="Tampilkan Bagian Testimoni di Landing Page"
                  checked={content.testimonials?.visible !== false}
                  onChange={(v) => changePath('testimonials.visible', v)}
                />
                <Field
                  label="Subjudul / Eyebrow"
                  value={content.testimonials?.eyebrow}
                  onChange={(v) => changePath('testimonials.eyebrow', v)}
                  placeholder="SUARA WALI & ENDORSEMENT"
                />
                <Field
                  label="Judul Bagian Testimoni"
                  value={content.testimonials?.title}
                  onChange={(v) => changePath('testimonials.title', v)}
                />
                <Field
                  label="Deskripsi Pengantar"
                  type="textarea"
                  rows={2}
                  value={content.testimonials?.description}
                  onChange={(v) => changePath('testimonials.description', v)}
                />

                <h5 style={{ margin: '14px 0 6px', fontSize: '13px', color: 'var(--primary-dark)' }}>
                  Daftar Kutipan Tokoh & Wali Santri
                </h5>
                {(content.testimonials?.items || []).map((item, idx) => (
                  <div className="cms-subpanel" key={idx} style={{ background: '#f5f7f6', marginTop: '6px' }}>
                    <div className="cms-subpanel-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>Kutipan #{idx + 1}: {item.author || '(Nama Tokoh)'}</strong>
                      {(content.testimonials?.items || []).length > 1 && (
                        <button
                          type="button"
                          className="btn-remove-item"
                          onClick={() => removeArrayItem('testimonials.items', idx)}
                        >
                          <Trash2 size={13} />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>
                    <Field
                      label="Teks Kutipan / Testimoni"
                      type="textarea"
                      rows={2}
                      value={item.quote}
                      onChange={(v) => changePath(`testimonials.items.${idx}.quote`, v)}
                    />
                    <div className="cms-dual-fields">
                      <Field
                        label="Nama Tokoh / Wali Murid"
                        value={item.author}
                        onChange={(v) => changePath(`testimonials.items.${idx}.author`, v)}
                      />
                      <Field
                        label="Jabatan / Keterangan"
                        value={item.role}
                        onChange={(v) => changePath(`testimonials.items.${idx}.role`, v)}
                        placeholder="Calon Wali Santri / Pemerhati Pendidikan"
                      />
                    </div>
                    <Field
                      label="Asal Wilayah / Domisili"
                      value={item.location}
                      onChange={(v) => changePath(`testimonials.items.${idx}.location`, v)}
                      placeholder="Tuban / Bojonegoro / Surabaya"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-add-item"
                  onClick={() =>
                    addArrayItem('testimonials.items', {
                      quote: 'Kesan dan harapan positif terhadap pendidikan SMP Shafa Wafa...',
                      author: 'Nama Tokoh / Wali',
                      role: 'Wali Santri',
                      location: 'Tuban',
                    })
                  }
                >
                  <Plus size={16} />
                  <span>Tambah Kutipan Baru</span>
                </button>
              </div>
            )}

            {/* 9. GALERI FOTO & KEGIATAN */}
            {activeMenu === 'gallery' && (
              <div className="cms-subpanel">
                <div className="cms-subpanel-head">Galeri Foto & Dokumentasi Sekolah</div>
                <SwitchField
                  label="Tampilkan Bagian Galeri di Landing Page"
                  checked={content.gallery?.visible !== false}
                  onChange={(v) => changePath('gallery.visible', v)}
                />
                <Field
                  label="Subjudul / Eyebrow"
                  value={content.gallery?.eyebrow}
                  onChange={(v) => changePath('gallery.eyebrow', v)}
                  placeholder="GALERI & DOKUMENTASI"
                />
                <Field
                  label="Judul Bagian Galeri"
                  value={content.gallery?.title}
                  onChange={(v) => changePath('gallery.title', v)}
                  placeholder="Potret Kawasan & Aktivitas Santri"
                />
                <Field
                  label="Deskripsi Pengantar Galeri"
                  type="textarea"
                  rows={2}
                  value={content.gallery?.description}
                  onChange={(v) => changePath('gallery.description', v)}
                />

                <div style={{ margin: '12px 0 16px', padding: '12px 14px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', fontSize: '12.5px', color: '#065f46', lineHeight: 1.55 }}>
                  <strong style={{ display: 'block', marginBottom: '4px' }}>💡 Mendukung Link Google Drive Publik:</strong>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li>Salin & tempel langsung link berbagi dari Google Drive (contoh: <code>https://drive.google.com/file/d/1aBcDe.../view?usp=sharing</code>).</li>
                    <li>Sistem otomatis mengonversi ke tautan CDN gambar tanpa perlu disimpan di server lokal.</li>
                    <li><em>Penting:</em> Pastikan akses Google Drive disetel ke <strong>"Siapa saja yang memiliki link"</strong> (Anyone with the link).</li>
                  </ul>
                </div>

                <h5 style={{ margin: '14px 0 6px', fontSize: '13px', color: 'var(--primary-dark)' }}>
                  Daftar Foto Dokumentasi ({(content.gallery?.items || []).length} Foto)
                </h5>
                {(content.gallery?.items || []).map((item, idx) => (
                  <div className="cms-subpanel" key={idx} style={{ background: '#f5f7f6', marginTop: '6px' }}>
                    <div className="cms-subpanel-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>Foto #{idx + 1}: {item.title || '(Tanpa Judul)'}</strong>
                      {(content.gallery?.items || []).length > 1 && (
                        <button
                          type="button"
                          className="btn-remove-item"
                          onClick={() => removeArrayItem('gallery.items', idx)}
                        >
                          <Trash2 size={13} />
                          <span>Hapus Foto</span>
                        </button>
                      )}
                    </div>

                    {item.imageUrl && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '6px 0 10px', padding: '8px', background: '#ffffff', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                        <img
                          src={resolveAssetUrl(item.imageUrl)}
                          alt={item.title || 'Pratinjau'}
                          referrerPolicy="no-referrer"
                          style={{ width: '84px', height: '56px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #d1d5db', background: '#f3f4f6' }}
                          onError={(e) => {
                            const match = item.imageUrl && item.imageUrl.match(/[-\w]{25,}/);
                            if (match && !e.currentTarget.dataset.fallbackTried) {
                              e.currentTarget.dataset.fallbackTried = 'true';
                              e.currentTarget.src = `https://lh3.googleusercontent.com/d/${match[0]}=w1600`;
                            } else {
                              e.currentTarget.style.display = 'none';
                            }
                          }}
                        />
                        <div style={{ fontSize: '12px', color: '#4b5563' }}>
                          <span style={{ fontWeight: 600 }}>Pratinjau Foto #{idx + 1}</span>
                          <span style={{ display: 'block', fontSize: '11px', color: item.imageUrl.includes('drive.google.com') ? '#059669' : '#6b7280' }}>
                            {item.imageUrl.includes('drive.google.com') ? '✓ Terdeteksi sebagai link Google Drive' : 'Sumber gambar URL / berkas'}
                          </span>
                        </div>
                      </div>
                    )}

                    <Field
                      label="Link Google Drive Publik / Path Gambar"
                      value={item.imageUrl}
                      onChange={(v) => changePath(`gallery.items.${idx}.imageUrl`, v)}
                      placeholder="https://drive.google.com/file/d/.../view atau /images/masterplan.jpeg"
                    />
                    <div className="cms-dual-fields">
                      <Field
                        label="Judul / Keterangan Foto"
                        value={item.title}
                        onChange={(v) => changePath(`gallery.items.${idx}.title`, v)}
                        placeholder="Contoh: Gedung Pembelajaran Terpadu"
                      />
                      <Field
                        label="Kategori Foto"
                        value={item.category}
                        onChange={(v) => changePath(`gallery.items.${idx}.category`, v)}
                        placeholder="Kawasan / Fasilitas / Lingkungan"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-add-item"
                  onClick={() =>
                    addArrayItem('gallery.items', {
                      imageUrl: '/images/masterplan.jpeg',
                      title: 'Foto Dokumentasi Baru',
                      category: 'Kawasan',
                    })
                  }
                >
                  <Plus size={16} />
                  <span>Tambah Foto ke Galeri</span>
                </button>
              </div>
            )}

            {/* 10. SPMB & WHATSAPP */}
            {activeMenu === 'admissions' && (
              <div className="cms-subpanel">
                <div className="cms-subpanel-head">Pengaturan SPMB & Kanal WhatsApp Panitia</div>
                <SwitchField
                  label="Tampilkan Banner CTA SPMB di Landing Page"
                  checked={content.admissions?.visible !== false}
                  onChange={(v) => changePath('admissions.visible', v)}
                />

                <div className="cms-subpanel" style={{ marginTop: '12px', background: '#f5f7f6' }}>
                  <div className="cms-subpanel-head">Penerimaan & WhatsApp Panitia</div>
                  <SwitchField
                    label="Arahkan Pendaftaran Langsung ke WhatsApp Panitia"
                    checked={content.admissions?.directToWhatsapp !== false}
                    onChange={(v) => changePath('admissions.directToWhatsapp', v)}
                    note="Jika aktif, klik tombol SPMB langsung membuka chat WhatsApp ke nomor resmi panitia."
                  />
                  <Field
                    label="Nomor WhatsApp Resmi Panitia SPMB"
                    value={content.admissions?.whatsappNumber}
                    onChange={(v) => changePath('admissions.whatsappNumber', v)}
                    placeholder="Contoh: 628123456789 (format 62 tanpa spasi/tanda hubung)"
                  />
                  <Field
                    label="Template Pesan WhatsApp Awal"
                    type="textarea"
                    rows={2}
                    value={content.admissions?.whatsappMessage}
                    onChange={(v) => changePath('admissions.whatsappMessage', v)}
                  />
                  <SwitchField
                    label="Tampilkan Formulir Pendaftaran Online"
                    checked={Boolean(content.admissions?.interestFormEnabled)}
                    onChange={(v) => changePath('admissions.interestFormEnabled', v)}
                    note="Menampilkan formulir isian registrasi santri baru."
                  />
                </div>

                <div className="cms-dual-fields" style={{ marginTop: '12px' }}>
                  <Field
                    label="Tahun Ajaran"
                    value={content.admissions?.academicYear}
                    onChange={(v) => changePath('admissions.academicYear', v)}
                    placeholder="2027/2028"
                  />
                  <Field
                    label="Status SPMB"
                    value={content.admissions?.status}
                    onChange={(v) => changePath('admissions.status', v)}
                    placeholder="dibuka"
                  />
                </div>

                <div className="cms-dual-fields">
                  <Field
                    label="Target Total Santri Baru"
                    type="number"
                    value={content.admissions?.targetStudents}
                    onChange={(v) => changePath('admissions.targetStudents', v)}
                  />
                  <Field
                    label="Kapasitas Maksimal per Rombel"
                    type="number"
                    value={content.admissions?.targetStudentsPerClass}
                    onChange={(v) => changePath('admissions.targetStudentsPerClass', v)}
                  />
                </div>

                <Field
                  label="Label Pill / Eyebrow Banner SPMB"
                  value={content.admissions?.pill}
                  onChange={(v) => changePath('admissions.pill', v)}
                  placeholder="Penerimaan Santri Baru Tahun Ajaran 2027/2028"
                />
                <Field
                  label="Judul Utama Bagian SPMB"
                  value={content.admissions?.title}
                  onChange={(v) => changePath('admissions.title', v)}
                />
                <Field
                  label="Deskripsi Pengantar SPMB"
                  type="textarea"
                  rows={3}
                  value={content.admissions?.description}
                  onChange={(v) => changePath('admissions.description', v)}
                />
                <div className="cms-dual-fields">
                  <Field
                    label="Label Tombol Utama SPMB"
                    value={content.admissions?.ctaLabel}
                    onChange={(v) => changePath('admissions.ctaLabel', v)}
                    placeholder="Konsultasi SPMB via WhatsApp"
                  />
                  <Field
                    label="Label Tombol Sekunder SPMB"
                    value={content.admissions?.contactLabel}
                    onChange={(v) => changePath('admissions.contactLabel', v)}
                    placeholder="Konsultasi Pertanyaan"
                  />
                </div>
                <Field
                  label="Catatan Kaki Status SPMB"
                  value={content.admissions?.statusNote}
                  onChange={(v) => changePath('admissions.statusNote', v)}
                />

                <div className="cms-subpanel" style={{ marginTop: '16px', background: '#f5f7f6' }}>
                  <div className="cms-subpanel-head">Tombol Melayang WhatsApp (Floating Button)</div>
                  <SwitchField
                    label="Aktifkan Tombol Melayang WhatsApp di Pojok Kanan Bawah"
                    checked={content.floatingWa?.visible !== false}
                    onChange={(v) => changePath('floatingWa.visible', v)}
                  />
                  <Field
                    label="Label Teks Tombol (Muncul di Desktop)"
                    value={content.floatingWa?.label}
                    onChange={(v) => changePath('floatingWa.label', v)}
                    placeholder="Tanya Panitia SPMB"
                  />
                  <Field
                    label="Template Pesan WhatsApp Awal"
                    type="textarea"
                    rows={2}
                    value={content.floatingWa?.message}
                    onChange={(v) => changePath('floatingWa.message', v)}
                  />
                </div>
              </div>
            )}

            {/* 11. FAQ, KONTAK & LOKASI */}
            {activeMenu === 'faq' && (
              <div className="cms-subpanel">
                <div className="cms-subpanel-head">FAQ, Kontak Resmi & Lokasi Sekolah</div>
                <Field
                  label="Subjudul / Eyebrow FAQ"
                  value={content.faq?.eyebrow}
                  onChange={(v) => changePath('faq.eyebrow', v)}
                  placeholder="Pertanyaan Umum"
                />
                <Field
                  label="Judul Bagian FAQ"
                  value={content.faq?.title}
                  onChange={(v) => changePath('faq.title', v)}
                />
                <Field
                  label="Deskripsi Pengantar FAQ"
                  type="textarea"
                  rows={2}
                  value={content.faq?.subtitle}
                  onChange={(v) => changePath('faq.subtitle', v)}
                />

                <h5 style={{ margin: '14px 0 6px', fontSize: '13px', color: 'var(--primary-dark)' }}>
                  Daftar Pertanyaan & Jawaban
                </h5>
                {(content.faq?.items || []).map((item, idx) => (
                  <div className="cms-subpanel" key={idx} style={{ background: '#f5f7f6', marginTop: '6px' }}>
                    <div className="cms-subpanel-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>FAQ #{idx + 1}</strong>
                      {(content.faq?.items || []).length > 1 && (
                        <button
                          type="button"
                          className="btn-remove-item"
                          onClick={() => removeArrayItem('faq.items', idx)}
                        >
                          <Trash2 size={13} />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>
                    <Field
                      label="Pertanyaan"
                      value={item.question}
                      onChange={(v) => changePath(`faq.items.${idx}.question`, v)}
                    />
                    <Field
                      label="Jawaban Lengkap"
                      type="textarea"
                      rows={3}
                      value={item.answer}
                      onChange={(v) => changePath(`faq.items.${idx}.answer`, v)}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-add-item"
                  onClick={() =>
                    addArrayItem('faq.items', {
                      question: 'Pertanyaan baru mengenai sekolah...',
                      answer: 'Jawaban penjelasan resmi...',
                    })
                  }
                >
                  <Plus size={16} />
                  <span>Tambah Pertanyaan Baru</span>
                </button>

                <div className="cms-subpanel" style={{ marginTop: '16px', background: '#f5f7f6' }}>
                  <div className="cms-subpanel-head">Kontak Lembaga & Lokasi Sekolah</div>
                  <Field
                    label="Alamat Lengkap Institusi"
                    type="textarea"
                    rows={2}
                    value={content.contact?.address}
                    onChange={(v) => changePath('contact.address', v)}
                    placeholder="Jl. Tegalagung, Kec. Semanding, Kab. Tuban, Jawa Timur 62381"
                  />
                  <Field
                    label="Jarak Tempuh / Proximity"
                    value={content.contact?.proximity}
                    onChange={(v) => changePath('contact.proximity', v)}
                    placeholder="± 15 menit dari Alun-alun & Pusat Kota Tuban"
                  />
                  <Field
                    label="Email Resmi Sekolah"
                    type="email"
                    value={content.contact?.email}
                    onChange={(v) => changePath('contact.email', v)}
                    placeholder="admin@shafawafa.sch.id"
                  />
                  <Field
                    label="Nomor WhatsApp Utama Sekolah"
                    value={content.contact?.whatsapp}
                    onChange={(v) => changePath('contact.whatsapp', v)}
                    placeholder="Contoh: 628123456789"
                  />
                  <Field
                    label="URL Tautan Google Maps"
                    value={content.contact?.mapUrl}
                    onChange={(v) => changePath('contact.mapUrl', v)}
                    placeholder="https://www.google.com/maps?q=-6.9198125,112.0483906"
                  />
                  <Field
                    label="URL Embed Peta Google Maps (Opsional)"
                    value={content.contact?.mapEmbedUrl}
                    onChange={(v) => changePath('contact.mapEmbedUrl', v)}
                    placeholder="Biarkan kosong untuk otomatis dari tautan atau alamat di atas"
                  />
                </div>

                <div className="cms-subpanel" style={{ marginTop: '16px', background: '#f5f7f6' }}>
                  <div className="cms-subpanel-head">Footer & SEO Meta</div>
                  <Field
                    label="Tagline / Ringkasan Footer"
                    type="textarea"
                    rows={2}
                    value={content.footer?.tagline}
                    onChange={(v) => changePath('footer.tagline', v)}
                  />
                  <Field
                    label="Teks Hak Cipta (Copyright)"
                    value={content.footer?.copyright}
                    onChange={(v) => changePath('footer.copyright', v)}
                    placeholder="SMP Shafa Wafa Tegalagung Tuban"
                  />
                  <Field
                    label="Catatan Keterbukaan Publik Footer"
                    type="textarea"
                    rows={2}
                    value={content.footer?.note}
                    onChange={(v) => changePath('footer.note', v)}
                  />
                  <div className="cms-dual-fields">
                    <Field
                      label="Judul Tab Browser (SEO Title)"
                      value={content.siteMeta?.title}
                      onChange={(v) => changePath('siteMeta.title', v)}
                    />
                    <Field
                      label="Deskripsi Meta SEO"
                      type="textarea"
                      rows={2}
                      value={content.siteMeta?.description}
                      onChange={(v) => changePath('siteMeta.description', v)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 12. URUTAN & VISIBILITAS MODUL */}
            {activeMenu === 'visibility' && (
              <div className="cms-subpanel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div className="cms-subpanel-head" style={{ marginBottom: '2px' }}>
                      Urutan Tampilan & Visibilitas Modul Landing Page
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                      Susunan kartu di bawah ini menentukan urutan seksi di landing page dari atas ke bawah. Gunakan tombol panah <strong>⬆️ Naikkan</strong> dan <strong>⬇️ Turunkan</strong> untuk mengubah urutan tampilan sesuai alur yang Anda inginkan.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="button button-outline"
                    style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onClick={resetSectionOrder}
                    title="Kembalikan susunan modul ke urutan standar sekolah"
                  >
                    <RotateCcw size={14} />
                    <span>Reset Urutan Standar</span>
                  </button>
                </div>

                {(() => {
                  const rawOrder = Array.isArray(content.sectionOrder) && content.sectionOrder.length > 0
                    ? content.sectionOrder
                    : defaultContent.sectionOrder;
                  const currentOrder = [
                    ...rawOrder,
                    ...defaultContent.sectionOrder.filter((k) => !rawOrder.includes(k)),
                  ];

                  return (
                    <div className="cms-module-order-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {currentOrder.map((key, idx) => {
                        const meta = SECTION_METADATA[key] || {
                          label: `Seksi: ${key}`,
                          desc: 'Modul konten landing page',
                          menuId: 'brand',
                        };
                        const visible = isSectionVisible(key);

                        return (
                          <div
                            key={key}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px 14px',
                              background: visible ? '#ffffff' : '#f9fafb',
                              border: `1px solid ${visible ? '#e2e8f0' : '#e5e7eb'}`,
                              borderRadius: '8px',
                              opacity: visible ? 1 : 0.65,
                              gap: '12px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                              <span
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '6px',
                                  background: visible ? 'var(--primary, #0b513b)' : '#9ca3af',
                                  color: '#ffffff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 700,
                                  fontSize: '13px',
                                  flexShrink: 0,
                                }}
                              >
                                #{idx + 1}
                              </span>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <strong style={{ fontSize: '13.5px', color: visible ? 'var(--text, #182720)' : '#6b7280' }}>
                                    {meta.label}
                                  </strong>
                                  {!visible && (
                                    <span style={{ fontSize: '11px', padding: '1px 6px', background: '#fee2e2', color: '#991b1b', borderRadius: '4px', fontWeight: 600 }}>
                                      Disembunyikan
                                    </span>
                                  )}
                                </div>
                                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {meta.desc}
                                </p>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                              <button
                                type="button"
                                onClick={() => setActiveMenu(meta.menuId)}
                                style={{
                                  background: '#f1f5f9',
                                  border: '1px solid #cbd5e1',
                                  borderRadius: '6px',
                                  padding: '5px 10px',
                                  fontSize: '12px',
                                  color: '#334155',
                                  cursor: 'pointer',
                                  fontWeight: 500,
                                }}
                                title={`Buka formulir edit ${meta.label}`}
                              >
                                Edit Konten
                              </button>

                              <button
                                type="button"
                                onClick={() => moveSection(idx, -1)}
                                disabled={idx === 0}
                                style={{
                                  background: idx === 0 ? '#f3f4f6' : '#ffffff',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  padding: '5px 8px',
                                  cursor: idx === 0 ? 'not-allowed' : 'pointer',
                                  color: idx === 0 ? '#9ca3af' : 'var(--primary-dark, #073b2b)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                                title="Pindahkan ke atas"
                                aria-label={`Pindahkan ${meta.label} ke atas`}
                              >
                                <ChevronUp size={16} />
                              </button>

                              <button
                                type="button"
                                onClick={() => moveSection(idx, 1)}
                                disabled={idx === currentOrder.length - 1}
                                style={{
                                  background: idx === currentOrder.length - 1 ? '#f3f4f6' : '#ffffff',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  padding: '5px 8px',
                                  cursor: idx === currentOrder.length - 1 ? 'not-allowed' : 'pointer',
                                  color: idx === currentOrder.length - 1 ? '#9ca3af' : 'var(--primary-dark, #073b2b)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                                title="Pindahkan ke bawah"
                                aria-label={`Pindahkan ${meta.label} ke bawah`}
                              >
                                <ChevronDown size={16} />
                              </button>

                              <label
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  marginLeft: '4px',
                                  cursor: 'pointer',
                                  padding: '4px 6px',
                                }}
                                title="Tampilkan atau sembunyikan di landing page"
                              >
                                <input
                                  type="checkbox"
                                  checked={visible}
                                  onChange={(e) => toggleSectionVisibility(key, e.target.checked)}
                                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary, #0b513b)', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '12px', color: visible ? '#059669' : '#6b7280', fontWeight: 600, minWidth: '42px' }}>
                                  {visible ? 'Aktif' : 'Off'}
                                </span>
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                <div style={{ marginTop: '20px', padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                  <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block', marginBottom: '8px' }}>
                    Modul Tetap & Fitur Khusus Website
                  </strong>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', fontSize: '12.5px' }}>
                    <div style={{ padding: '8px 12px', background: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>Identitas & Header</span>
                      <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '11.5px' }}>Selalu berada di puncak halaman (Top Bar, Navigasi & Running Ribbon)</p>
                    </div>
                    <div style={{ padding: '8px 12px', background: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>Hero Banner & Metrik</span>
                      <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '11.5px' }}>Selalu mengawali konten utama (Judul Utama & Angka Kunci Daya Tampung)</p>
                    </div>
                    <div style={{ padding: '8px 12px', background: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>Footer & Hak Cipta</span>
                      <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '11.5px' }}>Selalu berada di dasar halaman (Legalitas, Akreditasi & Tautan Kontak)</p>
                    </div>
                    <div style={{ padding: '8px 12px', background: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>Tombol Melayang WhatsApp</span>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={isSectionVisible('floatingWa')}
                            onChange={(e) => toggleSectionVisibility('floatingWa', e.target.checked)}
                            style={{ width: '15px', height: '15px', accentColor: 'var(--primary, #0b513b)' }}
                          />
                          <span style={{ fontSize: '11.5px', fontWeight: 600, color: isSectionVisible('floatingWa') ? '#059669' : '#6b7280' }}>
                            {isSectionVisible('floatingWa') ? 'Aktif' : 'Off'}
                          </span>
                        </label>
                      </div>
                      <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '11.5px' }}>Widget konsultasi cepat di pojok kanan bawah layar</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Action Footer Bar */}
            <div className="cms-save-footer">
              <span>Perubahan otomatis tersinkronisasi ke Firestore.</span>
              <button
                type="button"
                className="button button-primary"
                onClick={save}
                disabled={busy}
              >
                {busy ? <LoaderCircle className="spin-icon" size={16} /> : <Save size={16} />}
                <span>{busy ? 'Menyimpan...' : 'Simpan Semua Perubahan'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

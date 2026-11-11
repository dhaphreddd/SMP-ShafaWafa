import React, { useState } from 'react';
import {
  ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, CircleAlert, ClipboardList,
  ExternalLink, LockKeyhole, MapPin, ShieldCheck, Users, Milestone, MessageCircle,
  HelpCircle, Sparkles, Check, RefreshCw, Send, Info,
} from 'lucide-react';
import { defaultContent } from '../data/defaultContent';
import { submitInterestLead } from '../lib/content';
import { firebaseReady } from '../lib/firebase-config';
import { resolveAssetUrl } from '../lib/assets';

export default function SpmbPage({ content, onNavigate }) {
  const data = content.admissions || defaultContent.admissions;
  const brand = content.brand || defaultContent.brand;
  const contact = content.contact || defaultContent.contact;

  const [form, setForm] = useState({
    parentName: '',
    studentName: '',
    phone: '',
    currentSchool: '',
    needsDorm: 'ya', // 'ya', 'tidak', 'belum-tahu'
    message: '',
  });
  const [agreement, setAgreement] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);
  const [submittedLead, setSubmittedLead] = useState(null);

  const update = (key, value) => setForm((old) => ({ ...old, [key]: value }));

  // Guard: if form is disabled or offline
  const formDisabled = !data.interestFormEnabled || !firebaseReady;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNotice(null);

    // Simple honeypot anti-spam
    if (event.currentTarget.website?.value) return;

    if (!agreement) {
      setNotice({ type: 'error', text: 'Silakan centang persetujuan keabsahan data terlebih dahulu.' });
      return;
    }

    if (!firebaseReady) {
      setNotice({
        type: 'error',
        text: 'Layanan pendaftaran online sedang dalam sinkronisasi. Silakan hubungi langsung panitia SPMB via WhatsApp.',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await submitInterestLead({
        parentName: form.parentName,
        studentName: form.studentName,
        phone: form.phone,
        currentSchool: form.currentSchool,
        needsDorm: form.needsDorm,
        message: form.message,
      });

      const ticketNumber = `SW-2027-PM-${(result?.id || Math.random().toString(36).substring(2, 8)).slice(0, 6).toUpperCase()}`;
      setSubmittedLead({
        ticketNumber,
        parentName: form.parentName,
        studentName: form.studentName,
        phone: form.phone,
        currentSchool: form.currentSchool,
        needsDorm: form.needsDorm,
        submittedAt: new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }),
      });
      setForm({ parentName: '', studentName: '', phone: '', currentSchool: '', needsDorm: 'ya', message: '' });
      setAgreement(false);
    } catch (error) {
      setNotice({ type: 'error', text: error.message || 'Pengiriman belum berhasil. Silakan coba kembali.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedLead(null);
    setNotice(null);
  };

  return (
    <div className="spmb-page">
      {/* Top Header */}
      <header className="spmb-topbar">
        <div className="container spmb-topbar-inner">
          <button className="back-link" onClick={() => onNavigate('home')}>
            <ArrowLeft size={18} />
            <span>Kembali ke Website</span>
          </button>
          <div className="spmb-topbar-brand">
            <img
              src={resolveAssetUrl(brand.logoUrl || '/images/logo.jpeg')}
              alt={`Logo ${brand.name}`}
              className="spmb-topbar-logo"
            />
            <span>{brand.name || 'SMP Shafa Wafa'}</span>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="spmb-hero-section">
        <div className="spmb-hero-glow" aria-hidden="true" />
        <div className="container spmb-hero-container">
          <div className="spmb-hero-header">
            <div className="spmb-status-pill">
              <span className="spmb-pulse-dot" />
              <span>Penerimaan Santri Baru (SPMB)</span>
              <span className="pill-separator">•</span>
              <small>Kanal Resmi Sekolah</small>
            </div>
            <h1>Penerimaan Santri Baru (SPMB)</h1>
            <p className="spmb-hero-subtitle">
              Tahun Ajaran {data.academicYear || '2027/2028'} — Tegalagung, Semanding, Tuban
            </p>
          </div>

          <div className="spmb-hero-metrics">
            <div className="spmb-metric-tile">
              <small>Daya Tampung</small>
              <strong>{data.targetStudents || 56} Santri</strong>
              <span>Angkatan Perdana</span>
            </div>
            <div className="spmb-metric-tile">
              <small>Kapasitas Kelas</small>
              <strong>{data.targetGroups || 2} Rombel @ {data.targetStudentsPerClass || 28}</strong>
              <span>Putra & Putri Terpisah</span>
            </div>
            <div className="spmb-metric-tile">
              <small>Konsultasi WhatsApp</small>
              <strong className="text-free">Buka 24 Jam</strong>
              <span>Respon Cepat Panitia</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dual Column */}
      <main className="container spmb-layout-grid">
        {/* Left Column: Guidance, Roadmap, Quota & Official Guardrails */}
        <div className="spmb-left-column">
          {/* Roadmap SPMB Timeline */}
          <div className="spmb-card">
            <div className="spmb-card-header">
              <div className="header-title-row">
                <Milestone size={22} className="text-emerald" />
                <h2>Alur Penerimaan Santri Baru 2027/2028</h2>
              </div>
              <span className="badge-steps">4 Tahapan Terpadu</span>
            </div>
            <p className="spmb-card-desc">
              Penyelenggaraan penerimaan santri baru dilaksanakan secara terpadu dan profesional untuk menjamin pelayanan pendidikan terbaik bagi calon santri dan wali murid.
            </p>

            <div className="spmb-timeline">
              <div className="timeline-item is-active">
                <div className="timeline-dot">1</div>
                <div className="timeline-content">
                  <div className="timeline-head">
                    <strong>Tahap 1: Konsultasi & Pendaftaran</strong>
                    <span className="badge-active">Aktif Saat Ini</span>
                  </div>
                  <p>
                    Penghubungan awal melalui WhatsApp resmi Panitia SPMB untuk konsultasi program, pendataan awal calon santri, dan pengisian formulir.
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot">2</div>
                <div className="timeline-content">
                  <div className="timeline-head">
                    <strong>Tahap 2: Sosialisasi & Temu Wali Santri</strong>
                  </div>
                  <p>
                    Pemaparan kurikulum terpadu nasional-kepesantrenan, tur sarana prasarana sekolah, dan audiensi terbuka bersama pengasuh pondok.
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot">3</div>
                <div className="timeline-content">
                  <div className="timeline-head">
                    <strong>Tahap 3: Verifikasi Berkas & Administrasi</strong>
                    <span className="badge-pending">Tahap Lanjutan</span>
                  </div>
                  <p>
                    Verifikasi kelengkapan berkas akademik, raport, dan data kependudukan santri oleh tim administrasi sekolah.
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot">4</div>
                <div className="timeline-content">
                  <div className="timeline-head">
                    <strong>Tahap 4: Asesmen Minat, Tahfidz & Asrama</strong>
                  </div>
                  <p>
                    Pemetaan kemampuan tilawah Al-Qur'an, potensi akademik, serta orientasi kesiapan tinggal di asrama pesantren.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Ratio & Quota */}
          <div className="spmb-card spmb-card-highlight">
            <div className="spmb-ratio-header">
              <div>
                <span className="eyebrow-mini">PRINSIP MUTU PEMBELAJARAN</span>
                <h3>Rasio Ideal: 1 Guru untuk 14 Santri</h3>
              </div>
              <div className="ratio-icon-box">
                <Users size={24} />
              </div>
            </div>
            <p>
              Demi menjaga kedalaman talaqqi Al-Qur'an dan pemahaman sains modern, SMP Shafa Wafa membatasi kuota angkatan perdana hanya <strong>56 santri</strong> yang terbagi ke dalam 2 rombel (Rombel Putra & Rombel Putri).
            </p>
            <div className="ratio-visual-bar">
              <div className="ratio-bar-track">
                <div className="ratio-bar-fill-a" style={{ width: '50%' }} title="Rombel Putra (28 Santri)" />
                <div className="ratio-bar-fill-b" style={{ width: '50%' }} title="Rombel Putri (28 Santriwati)" />
              </div>
              <div className="ratio-legend">
                <span><span className="legend-dot dot-a" /> Rombel A (Putra): 28 Kursi</span>
                <span><span className="legend-dot dot-b" /> Rombel B (Putri): 28 Kursi</span>
              </div>
            </div>
          </div>

          {/* Official Guardrails Warning */}
          <div className="spmb-card spmb-card-alert">
            <div className="alert-header">
              <ShieldCheck size={22} className="text-gold" />
              <h3>Informasi Resmi bagi Calon Wali Santri</h3>
            </div>
            <p>
              Seluruh proses pendaftaran dan informasi pembiayaan disampaikan secara transparan hanya melalui kanal resmi Yayasan Pondok Pesantren Shafa Wafa Tuban.
            </p>
            <div className="alert-feature">
              <Check size={16} />
              <span>Bebas Pungutan Liar & Calo Administrasi</span>
            </div>
          </div>

          {/* Support / Help Box */}
          <div className="spmb-card spmb-support-card">
            <div className="support-info">
              <div className="support-icon">
                <MessageCircle size={22} />
              </div>
              <div>
                <strong>Pusat Bantuan & Konsultasi</strong>
                <small>Layanan Informasi SPMB Yayasan Shafa Wafa</small>
              </div>
            </div>
            {contact.whatsapp ? (
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="button button-outline"
              >
                <span>WhatsApp Admin</span>
                <ExternalLink size={14} />
              </a>
            ) : (
              <span className="support-status">Hubungi Panitia SPMB</span>
            )}
          </div>
        </div>

        {/* Right Column: Form or Success Card */}
        <div className="spmb-right-column">
          <div className="spmb-form-card">
            <div className="form-card-top-accent" />

            {submittedLead ? (
              /* Success State: Ticket Card */
              <div className="spmb-success-view">
                <div className="success-banner">
                  <CheckCircle2 size={36} className="text-gold" />
                  <div>
                    <h3>Pendaftaran Berhasil Dikirimkan!</h3>
                    <p>Jazakumullah khairan katsiran telah mendaftarkan calon santri. Panitia akan segera menghubungi Anda.</p>
                  </div>
                </div>

                <div className="ticket-slip">
                  <div className="ticket-slip-head">
                    <div>
                      <small>Nomor Pendaftaran</small>
                      <strong>{submittedLead.ticketNumber}</strong>
                    </div>
                    <span className="ticket-badge">Registrasi SPMB</span>
                  </div>

                  <div className="ticket-details-grid">
                    <div>
                      <small>Calon Wali Murid</small>
                      <span>{submittedLead.parentName}</span>
                    </div>
                    <div>
                      <small>Calon Siswa</small>
                      <span>{submittedLead.studentName}</span>
                    </div>
                    <div>
                      <small>Nomor WhatsApp</small>
                      <span>{submittedLead.phone}</span>
                    </div>
                    <div>
                      <small>Peminatan Asrama</small>
                      <span>{submittedLead.needsDorm === 'ya' ? 'Wajib Asrama' : submittedLead.needsDorm === 'tidak' ? 'Non-Asrama' : 'Mempertimbangkan'}</span>
                    </div>
                    {submittedLead.currentSchool && (
                      <div className="col-span-full">
                        <small>Asal Sekolah</small>
                        <span>{submittedLead.currentSchool}</span>
                      </div>
                    )}
                    <div className="col-span-full">
                      <small>Waktu Pencatatan</small>
                      <span>{submittedLead.submittedAt}</span>
                    </div>
                  </div>

                  <div className="ticket-fineprint">
                    <Info size={15} />
                    <span>Simpan nomor referensi pendaftaran di atas untuk konfirmasi kepada Panitia SPMB.</span>
                  </div>
                </div>

                <div className="success-actions">
                  <button className="button button-primary" onClick={handleReset}>
                    <RefreshCw size={16} />
                    <span>Kirim Formulir Lain</span>
                  </button>
                  <button className="button button-outline" onClick={() => onNavigate('home')}>
                    <ArrowLeft size={16} />
                    <span>Kembali ke Beranda</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Form or WhatsApp View */
              <div className="spmb-form-view">
                {/* Dedicated WhatsApp Direct Card */}
                {data.directToWhatsapp !== false && (
                  <div className="spmb-whatsapp-direct-card">
                    <div className="spmb-whatsapp-icon-circle">
                      <MessageCircle size={28} />
                    </div>
                    <h3>Pendaftaran & Konsultasi Langsung via WhatsApp</h3>
                    <p>
                      Pendaftaran dan konsultasi informasi santri baru dilayani langsung oleh Panitia SPMB melalui kanal WhatsApp resmi sekolah.
                    </p>
                    {(() => {
                      const waNum = data.whatsappNumber || contact.whatsapp || '';
                      const clean = waNum.replace(/\D/g, '');
                      const msg = data.whatsappMessage || "Assalamu'alaikum Panitia SPMB SMP Shafa Wafa, saya ingin informasi mengenai pendaftaran santri baru.";
                      const url = clean ? `https://wa.me/${clean}?text=${encodeURIComponent(msg)}` : null;
                      return url ? (
                        <div className="wa-direct-actions">
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="wa-direct-btn"
                          >
                            <MessageCircle size={18} />
                            <span>Hubungi Panitia SPMB di WhatsApp</span>
                            <ArrowRight size={16} />
                          </a>
                          <span className="wa-number-badge">Nomor Resmi: <strong>{waNum}</strong></span>
                        </div>
                      ) : (
                        <div className="inline-notice notice-neutral">
                          <CircleAlert size={18} />
                          <span>Nomor WhatsApp panitia dapat disesuaikan pada Portal CMS Admin.</span>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {data.interestFormEnabled && (
                  <>
                    <div className="form-title-block">
                      <div className="title-row">
                        <h3>Formulir Registrasi Santri Baru</h3>
                        <span className="badge-free">Online</span>
                      </div>
                      <p>Lengkapi data wali murid dan calon peserta didik di bawah ini untuk pendaftaran online.</p>
                    </div>

                    {!firebaseReady && (
                      <div className="inline-notice notice-neutral">
                        <CircleAlert size={18} />
                        <span>Layanan pendaftaran online terhubung langsung dengan sistem database sekolah.</span>
                      </div>
                    )}
                  </>
                )}

                {!data.interestFormEnabled && data.directToWhatsapp === false && (
                  <div className="inline-notice notice-neutral">
                    <CircleAlert size={18} />
                    <span>Layanan pendaftaran online sedang dalam sinkronisasi sistem.</span>
                  </div>
                )}

                {notice && (
                  <div
                    role="status"
                    className={`inline-notice ${notice.type === 'success' ? 'notice-success' : 'notice-error'}`}
                  >
                    {notice.type === 'success' ? <CheckCircle2 size={18} /> : <CircleAlert size={18} />}
                    <span>{notice.text}</span>
                  </div>
                )}

                {data.interestFormEnabled && (

                <form onSubmit={handleSubmit} className="spmb-form">
                  {/* Honeypot field for bot prevention */}
                  <input
                    className="honeypot"
                    type="text"
                    name="website"
                    tabIndex="-1"
                    autoComplete="off"
                    aria-hidden="true"
                    disabled={formDisabled || loading}
                  />

                  {/* Field 1: Nama Wali */}
                  <div className="form-group">
                    <label htmlFor="spmb-parent-name">
                      Nama Lengkap Wali Murid / Orang Tua <span className="req">*</span>
                    </label>
                    <input
                      id="spmb-parent-name"
                      name="parentName"
                      required
                      maxLength={100}
                      autoComplete="name"
                      placeholder="Contoh: H. Ahmad Fauzi, S.Pd."
                      value={form.parentName}
                      onChange={(e) => update('parentName', e.target.value)}
                      disabled={formDisabled || loading}
                    />
                  </div>

                  {/* Field 2: Nama Siswa */}
                  <div className="form-group">
                    <label htmlFor="spmb-student-name">
                      Nama Lengkap Calon Siswa / Santri <span className="req">*</span>
                    </label>
                    <input
                      id="spmb-student-name"
                      name="studentName"
                      required
                      maxLength={100}
                      placeholder="Contoh: Muhammad Rayhan Shidqi"
                      value={form.studentName}
                      onChange={(e) => update('studentName', e.target.value)}
                      disabled={formDisabled || loading}
                    />
                  </div>

                  {/* Field 3: WhatsApp */}
                  <div className="form-group">
                    <label htmlFor="spmb-phone">
                      Nomor WhatsApp Aktif <span className="req">*</span>
                      <small>Digunakan untuk undangan sosialisasi</small>
                    </label>
                    <input
                      id="spmb-phone"
                      name="phone"
                      type="tel"
                      required
                      maxLength={24}
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="Contoh: 08xxxxxxxxxx"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      disabled={formDisabled || loading}
                    />
                  </div>

                  {/* Field 4: Asal Sekolah */}
                  <div className="form-group">
                    <label htmlFor="spmb-school">
                      Asal Sekolah SD / MI
                      <small>Opsional</small>
                    </label>
                    <input
                      id="spmb-school"
                      name="currentSchool"
                      maxLength={160}
                      placeholder="Contoh: MI Muhammadiyah 1 Tuban"
                      value={form.currentSchool}
                      onChange={(e) => update('currentSchool', e.target.value)}
                      disabled={formDisabled || loading}
                    />
                  </div>

                  {/* Field 5: Peminatan Asrama */}
                  <div className="form-group">
                    <label>
                      Peminatan Tinggal Asrama Santri <span className="req">*</span>
                    </label>
                    <div className="spmb-radio-grid">
                      <label className={`radio-card ${form.needsDorm === 'ya' ? 'is-selected' : ''}`}>
                        <input
                          type="radio"
                          name="needsDorm"
                          value="ya"
                          checked={form.needsDorm === 'ya'}
                          onChange={(e) => update('needsDorm', e.target.value)}
                          disabled={formDisabled || loading}
                        />
                        <div className="radio-content">
                          <strong>Wajib Asrama</strong>
                          <small>Mukim Penuh Pesantren</small>
                        </div>
                      </label>

                      <label className={`radio-card ${form.needsDorm === 'belum-tahu' ? 'is-selected' : ''}`}>
                        <input
                          type="radio"
                          name="needsDorm"
                          value="belum-tahu"
                          checked={form.needsDorm === 'belum-tahu'}
                          onChange={(e) => update('needsDorm', e.target.value)}
                          disabled={formDisabled || loading}
                        />
                        <div className="radio-content">
                          <strong>Mempertimbangkan</strong>
                          <small>Menunggu Sosialisasi</small>
                        </div>
                      </label>

                      <label className={`radio-card ${form.needsDorm === 'tidak' ? 'is-selected' : ''}`}>
                        <input
                          type="radio"
                          name="needsDorm"
                          value="tidak"
                          checked={form.needsDorm === 'tidak'}
                          onChange={(e) => update('needsDorm', e.target.value)}
                          disabled={formDisabled || loading}
                        />
                        <div className="radio-content">
                          <strong>Non-Asrama</strong>
                          <small>Jika Tersedia Jalur</small>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Field 6: Catatan / Pertanyaan */}
                  <div className="form-group">
                    <label htmlFor="spmb-message">
                      Catatan atau Pertanyaan Tambahan
                      <small>Opsional</small>
                    </label>
                    <textarea
                      id="spmb-message"
                      name="message"
                      maxLength={800}
                      rows={3}
                      placeholder="Tuliskan harapan khusus, riwayat tahfidz yang telah dicapai anak, atau pertanyaan..."
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      disabled={formDisabled || loading}
                    />
                  </div>

                  {/* Field 7: Persetujuan */}
                  <div className="agreement-block">
                    <label className="agreement-label">
                      <input
                        type="checkbox"
                        required
                        checked={agreement}
                        onChange={(e) => setAgreement(e.target.checked)}
                        disabled={formDisabled || loading}
                      />
                      <span>
                        Saya menyatakan bahwa seluruh data yang diisikan adalah benar dan valid untuk proses pendaftaran santri baru SMP Shafa Wafa.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="button button-primary button-large form-submit-btn"
                    disabled={formDisabled || loading || !agreement}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-mini" />
                        <span>Mengirimkan Pendaftaran...</span>
                      </>
                    ) : (
                      <>
                        <span>Kirim Pendaftaran Santri Baru</span>
                        <Send size={18} />
                      </>
                    )}
                  </button>

                  <p className="privacy-fineprint">
                    <LockKeyhole size={14} />
                    <span>Data santri dan wali terlindungi aman dan digunakan secara resmi oleh panitia SPMB SMP Shafa Wafa.</span>
                  </p>
                </form>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="spmb-footer">
        <div className="container spmb-footer-inner">
          <span>© {new Date().getFullYear()} {brand.name || 'SMP Shafa Wafa'}. Seluruh hak cipta dilindungi.</span>
          <button onClick={() => onNavigate('admin')} className="admin-shortcut">
            <LockKeyhole size={13} />
            <span>Portal CMS Admin</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

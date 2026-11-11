import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import {
  ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Building2, CalendarDays, CheckCircle2,
  ChevronDown, ChevronLeft, ChevronRight, Cpu, GraduationCap, HeartHandshake, Languages, Laptop, MapPin, Menu,
  MessageCircle, ShieldCheck, Sparkles, Users, X, Mail, Phone, Instagram, ExternalLink,
  Compass, CircleHelp, Scale, Trees, Library, Hotel, Trophy,
  Clock, Check, Info, FileText, Lock, Eye, Radio, Smartphone, Monitor, ArrowUp, Quote, Image as ImageIcon,
} from 'lucide-react';
import { defaultContent } from '../data/defaultContent';
import { resolveAssetUrl } from '../lib/assets';

const Campus3D = lazy(() => import('./Campus3D.jsx'));

const iconMap = {
  'book-open': BookOpen,
  'heart-handshake': HeartHandshake,
  languages: Languages,
  cpu: Cpu,
  'graduation-cap': GraduationCap,
  laptop: Laptop,
  building: Building2,
  users: Users,
  scale: Scale,
  trees: Trees,
  'shield-check': ShieldCheck,
  school: Building2,
  mosque: Building2,
  library: Library,
  hotel: Hotel,
  sports: Trophy,
  architecture: Compass,
};

function IconFor({ name, size = 22, className = '' }) {
  const Icon = iconMap[name] || Sparkles;
  return <Icon size={size} strokeWidth={1.8} className={className} aria-hidden="true" />;
}

export function MobileCardSlider({ children, interval = 2000, className = '' }) {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  const touchStartX = useRef(0);
  const childArray = React.Children.toArray(children);
  const count = childArray.length;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile || count <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % count);
    }, interval);
    return () => clearInterval(timer);
  }, [isMobile, count, interval, isPaused]);

  if (!isMobile || count <= 1) {
    return <div className={className}>{children}</div>;
  }

  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    setIsPaused(false);
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setActive((prev) => (prev + 1) % count);
      } else {
        setActive((prev) => (prev - 1 + count) % count);
      }
    }
  };

  return (
    <div
      className={`mobile-slider-container ${className ? `${className}-slider` : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mobile-slider-track-wrap">
        <div
          className="mobile-slider-track"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {childArray.map((child, idx) => (
            <div className="mobile-slider-item" key={idx}>
              {child}
            </div>
          ))}
        </div>
      </div>
      <div className="mobile-slider-dots">
        {childArray.map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`mobile-slider-dot ${active === idx ? 'is-active' : ''}`}
            onClick={() => setActive(idx)}
            aria-label={`Pindah ke slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export function PageBanner({ title, subtitle, breadcrumb, onNavigate }) {
  return (
    <div className="page-hero-banner">
      <div className="page-hero-pattern" aria-hidden="true" />
      <div className="container page-hero-container">
        <nav className="page-breadcrumb" aria-label="Navigasi Halaman">
          <button type="button" className="breadcrumb-link" onClick={() => onNavigate && onNavigate('home')}>
            Beranda
          </button>
          <ChevronRight size={13} className="breadcrumb-separator" />
          <span className="breadcrumb-current">{breadcrumb}</span>
        </nav>
        <h1 className="page-hero-title">{title}</h1>
        {subtitle && <p className="page-hero-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

export function Brand({ content, compact = false }) {
  const logoSrc = resolveAssetUrl(content.brand?.logoUrl || '/images/logo.jpeg');
  return (
    <div className={`brand ${compact ? 'brand-compact' : ''}`}>
      <div className="brand-logo-frame">
        <img
          className="brand-logo"
          src={logoSrc}
          alt={`Logo ${content.brand?.name || 'SMP Shafa Wafa'}`}
          width="44"
          height="44"
          decoding="async"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'grid';
          }}
        />
        <div className="brand-mark-fallback" style={{ display: 'none' }} aria-hidden="true">
          <BookOpen size={18} />
        </div>
      </div>
      <div className="brand-copy">
        <strong>{content.brand?.name || 'SMP SHAFA WAFA'}</strong>
        <small>{content.brand?.subLocation || content.brand?.tagline || 'Tegalagung, Semanding, Tuban'}</small>
      </div>
    </div>
  );
}

export function Header({ content, onNavigate, currentPage = 'home' }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { target: 'home', label: 'Beranda' },
    { target: 'tentang', label: 'Profil' },
    { target: 'program', label: 'Program' },
    { target: 'fasilitas', label: 'Fasilitas' },
    { target: 'galeri', label: 'Galeri' },
  ];

  const handleNavClick = (target) => {
    setMenuOpen(false);
    if (onNavigate) {
      onNavigate(target);
    }
  };

  return (
    <header className="site-header">
      {/* Top Announcement Ribbon */}
      {content.announcement?.visible && (
        <div className="announcement-ribbon">
          <div className="container announcement-ribbon-inner">
            <div className="announcement-ribbon-left">
              <span className="ribbon-pill">
                <span className="ribbon-pulse" />
                {content.announcement.pill || 'Tahun Ajaran 2027/2028'}
              </span>
              <p className="ribbon-text">{content.announcement.body}</p>
            </div>
            <div className="announcement-ribbon-right">
              <span className="ribbon-status">
                <ShieldCheck size={14} />
                {content.announcement.statusLabel || 'Pendaftaran Dibuka'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="container header-main-inner">
        <button
          type="button"
          className="brand-button"
          onClick={() => onNavigate && onNavigate('home')}
        >
          <Brand content={content} />
        </button>

        <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Navigasi utama">
          {navItems.map((item) => {
            const isActive = currentPage === item.target;
            return (
              <button
                key={item.target}
                type="button"
                className={`nav-link ${isActive ? 'is-active' : ''}`}
                onClick={() => handleNavClick(item.target)}
              >
                {item.label}
              </button>
            );
          })}
          <button
            type="button"
            className="nav-mobile-cta"
            onClick={() => {
              setMenuOpen(false);
              if (onNavigate) onNavigate('spmb');
            }}
          >
            {content.header?.ctaLabel || 'Daftar SPMB Online'}
          </button>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="button button-gold header-cta"
            onClick={() => onNavigate && onNavigate('spmb')}
          >
            <span>{content.header?.ctaLabel || 'Daftar SPMB'}</span>
            <ArrowUpRight size={16} />
          </button>
          <button
            type="button"
            className="menu-toggle"
            aria-label={menuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export function Hero({ content, onNavigate }) {
  const hero = content.hero || {};
  const brand = content.brand || {};
  const masterplanSrc = resolveAssetUrl(hero.imageUrl || '/images/masterplan.webp');
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="hero-cinematic" id="beranda">
      <div
        className="hero-cinematic-bg"
        style={{ backgroundImage: `url(${masterplanSrc})` }}
        aria-hidden="true"
      />
      <div className="hero-cinematic-overlay" aria-hidden="true" />

      <div className="container hero-cinematic-container">
        <div className="hero-cinematic-content">
          <div className="hero-badge-pill">
            <span className="hero-badge-dot" />
            <span>{hero.badge || hero.eyebrow || 'PONDOK PESANTREN & SMP TERPADU'}</span>
          </div>

          <h1 className="hero-cinematic-title">
            <span className="title-main">{brand.name || 'SMP SHAFA WAFA'}</span>
            <span className="title-sub">Islamic Boarding School</span>
          </h1>

          <p className="hero-cinematic-desc">
            {hero.description ||
              "Membentuk Generasi Qur'ani yang Beradab Luhur, Cerdas Berilmu, dan Berwawasan Global di Bawah Naungan Pesantren Modern Shafa Wafa Tuban."}
          </p>

          <div className="hero-cinematic-btns">
            <button
              type="button"
              className="button button-gold button-large"
              onClick={() => onNavigate && onNavigate('spmb')}
            >
              <span>{hero.primaryLabel || 'Daftar SPMB Online'}</span>
              <ArrowRight size={18} />
            </button>
            <button
              type="button"
              className="button button-outline-light button-large"
              onClick={() => {
                if (onNavigate) onNavigate('program');
                else document.getElementById('program')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>{hero.secondaryLabel || 'Lihat Program'}</span>
              <ArrowDown size={18} />
            </button>
          </div>

          <div className="hero-cinematic-trust">
            <a
              href="https://shafawafa.my.id"
              target="_blank"
              rel="noopener noreferrer"
              className="trust-pill trust-pill-link"
              title="Kunjungi Website Utama Yayasan Pondok Pesantren Ahlus-Shafa Wal-Wafa"
            >
              <ShieldCheck size={15} />
              <span>{hero.affiliation || 'Afiliasi Ponpes Ahlus-Shafa Wal-Wafa Tuban'}</span>
              <ExternalLink size={13} className="trust-external-icon" />
            </a>
            <div
              className="trust-pill"
              onClick={() => setShowModal(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setShowModal(true)}
            >
              <Eye size={15} />
              <span>Lihat Masterplan Kawasan</span>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="gallery-lightbox" onClick={() => setShowModal(false)} role="dialog" aria-modal="true">
          <div className="lightbox-topbar" onClick={(e) => e.stopPropagation()}>
            <span className="lightbox-counter">Masterplan Kawasan Sekolah Terpadu</span>
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setShowModal(false)}
              aria-label="Tutup pratinjau masterplan"
            >
              <X size={22} />
            </button>
          </div>
          <div className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-media-wrap">
              <img
                src={masterplanSrc}
                alt="Masterplan Kawasan Sekolah Terpadu SMP Shafa Wafa"
                className="lightbox-img"
              />
              <div className="lightbox-caption">
                <span className="lightbox-badge">Masterplan Terpadu</span>
                <h3 className="lightbox-title">Kawasan Sekolah & Pesantren Shafa Wafa Tuban</h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function Metrics({ items, note }) {
  if (!items || !items.length) return null;
  return (
    <section className="metrics-section">
      <div className="container">
        <div className="metrics-grid">
          {items.map((item, i) => (
            <div className="metric-card" key={`${item.label}-${i}`}>
              <span className="metric-tag">{item.label}</span>
              <strong className="metric-value">{item.value}</strong>
              <span className="metric-caption">{item.caption || item.label}</span>
            </div>
          ))}
        </div>
        {note && <p className="metrics-note">{note}</p>}
      </div>
    </section>
  );
}

export function About({ data, onNavigate, isSummary = false }) {
  if (!data) return null;
  const features = data.features || [
    { icon: 'scale', title: 'Keseimbangan Total', description: 'Sintesis kurikulum Dikdasmen dengan penguatan muatan lokal diniyah, tahsin, dan fiqih aplikatif harian.' },
    { icon: 'heart-handshake', title: 'Keteladanan Berkelanjutan', description: 'Pendidik mendampingi langsung tumbuh kembang dan pembiasaan adab santri.' },
    { icon: 'trees', title: 'Lingkungan Asri & Terbuka', description: 'Kawasan hijau Tuban yang tenang, kondusif untuk tilawah dan pembelajaran mendalam.' },
    { icon: 'shield-check', title: 'Integritas Legal Formal', description: 'Beroperasi sesuai regulasi Kemendikbudristek dan Kemenag secara akuntabel demi masa depan santri.' },
  ];

  return (
    <section className="section section-about" id="tentang">
      <div className="container about-grid">
        <div className="about-copy">
          <span className="eyebrow">
            <span className="eyebrow-line" />
            {data.eyebrow || 'Tentang Shafa Wafa'}
          </span>
          <h2>{data.title}</h2>
          <div className="gold-accent-bar" />
          {(data.paragraphs || []).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          {isSummary && onNavigate && (
            <div className="section-cta-wrap">
              <button
                type="button"
                className="button button-primary button-large"
                onClick={() => onNavigate('tentang')}
              >
                <span>Lihat Visi Misi & Profil Lengkap</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>

        <MobileCardSlider className="about-features-grid" interval={2000}>
          {features.map((feat, i) => (
            <article className="about-feature-card" key={i}>
              <div className="feature-icon-wrap">
                <IconFor name={feat.icon} size={22} />
              </div>
              <h3>{feat.title}</h3>
              <p>{feat.description}</p>
            </article>
          ))}
        </MobileCardSlider>
      </div>
    </section >
  );
}

export function Values({ items }) {
  if (!items || !items.length) return null;
  return (
    <section className="section values-section">
      <div className="container">
        <div className="section-heading text-center">
          <span className="eyebrow">
            <span className="eyebrow-line" />
            Pondasi Filosofis
            <span className="eyebrow-line" />
          </span>
          <h2>4 Pilar Nilai Keunggulan</h2>
          <p>
            Prinsip utama yang melandasi pembentukan kurikulum, tata tertib, dan interaksi sehari-hari di SMP Shafa Wafa.
          </p>
        </div>

        <MobileCardSlider className="values-bento-grid" interval={1000}>
          {items.map((item, i) => (
            <article className="value-bento-card" key={`${item.title}-${i}`}>
              <div className="value-card-top">
                <div className="value-icon-box">
                  <IconFor name={item.icon} size={24} />
                </div>
                <span className="value-pillar-tag">{item.pillar || `PILAR 0${i + 1}`}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <div className="value-card-footer">
                <CheckCircle2 size={16} />
                <span>{item.highlight || item.title}</span>
              </div>
            </article>
          ))}
        </MobileCardSlider>
      </div>
    </section>
  );
}

export function Program({ data, onNavigate, isSummary = false }) {
  if (!data) return null;
  return (
    <section className="section program-section" id="program">
      <div className="container">
        <div className="section-heading text-center">
          <span className="eyebrow">
            <span className="eyebrow-line" />
            {data.eyebrow || 'PROGRAM PENDIDIKAN'}
            <span className="eyebrow-line" />
          </span>
          <h2>{data.title}</h2>
          <p>{data.description}</p>
        </div>

        <MobileCardSlider className="program-grid" interval={1000}>
          {(data.items || []).map((item, i) => (
            <article className="program-card" key={`${item.title}-${i}`}>
              <div className="program-card-head">
                <span className="program-icon-badge">
                  <IconFor name={item.icon} size={22} />
                </span>
                <span className="program-tag">{item.tag || `0${i + 1}`}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {item.bullets && item.bullets.length > 0 && (
                <ul className="program-bullets">
                  {item.bullets.map((b, bi) => (
                    <li key={bi}>
                      <span className="bullet-dot" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </MobileCardSlider>

        {isSummary && onNavigate && (
          <div className="section-cta-center">
            <button
              type="button"
              className="button button-outline button-large"
              onClick={() => onNavigate('program')}
            >
              <span>Lihat Detail Kurikulum & Keseharian 24 Jam</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export function Facilities({ data, onNavigate, isSummary = false }) {
  if (!data) return null;
  return (
    <section className="section facilities-section" id="fasilitas">
      <div className="container">
        <div className="section-heading text-center">
          <span className="eyebrow">
            <span className="eyebrow-line" />
            {data.eyebrow || 'INFRASTRUKTUR SEKOLAH'}
            <span className="eyebrow-line" />
          </span>
          <h2>{data.title || 'Fasilitas Terpadu Sekolah & Pesantren'}</h2>
          <p>{data.description || 'Sarana dan prasarana terpadu untuk menunjang kenyamanan belajar, tahfidz, dan pembinaan karakter santri.'}</p>
        </div>

        <MobileCardSlider className="facilities-grid" interval={1000}>
          {(data.items || []).map((item, i) => (
            <article className="facility-card" key={`${item.title}-${i}`}>
              <div className="facility-card-top">
                <span className="facility-icon">
                  <IconFor name={item.icon || 'building'} size={24} />
                </span>
                <span className="status-pill-mini">{item.status || 'Tersedia Lengkap'}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="facility-card-footer">
                <small>{item.note || 'Fasilitas Terpadu SMP Shafa Wafa'}</small>
              </div>
            </article>
          ))}
        </MobileCardSlider>

        {isSummary && onNavigate && (
          <div className="section-cta-center">
            <button
              type="button"
              className="button button-outline button-large"
              onClick={() => onNavigate('fasilitas')}
            >
              <span>Jelajahi Seluruh Fasilitas & Kawasan 3D</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section >
  );
}

export function CampusSection({ data }) {
  const sectionRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
    }
    return false;
  });

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Only set up 3D intersection observer on desktop
    if (isMobile) return undefined;
    const node = sectionRef.current;
    if (!node || !data?.visible || shouldLoad) return undefined;
    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '360px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [data?.visible, shouldLoad, isMobile]);

  if (!data?.visible) return null;

  return (
    <section className="section campus-section" id="gedung-3d" ref={sectionRef}>
      {/* Anchor alias so older links pointing to #kampus-3d scroll here smoothly */}
      <span id="kampus-3d" style={{ position: 'relative', top: '-70px', display: 'block' }} aria-hidden="true" />
      <div className="container">
        <div className="section-heading text-center campus-heading-center">
          <span className="eyebrow eyebrow-light">
            <span className="eyebrow-line" />
            {data.eyebrow || 'Visualisasi Ruang'}
            <span className="eyebrow-line" />
          </span>
          <h2>{data.title || 'Visualisasi 3D Arsitektur Gedung Sekolah'}</h2>
          <p>{data.description}</p>
        </div>

        <div className="campus-badge-center">
          <div className="campus-badge">
            <span className="campus-badge-icon">
              {isMobile ? <Smartphone size={22} /> : <Compass size={22} />}
            </span>
            <div>
              <strong>{isMobile ? 'Tampilan Ringan Mobile' : 'Mode Eksplorasi 3D'}</strong>
              <small>{isMobile ? 'Dioptimalkan untuk kecepatan koneksi' : 'Geser • Putar • Perbesar • Siang/Malam'}</small>
            </div>
          </div>
        </div>

        {/* Responsive conditional rendering: Skip Three.js completely on mobile */}
        {isMobile ? (
          <div className="mobile-architecture-card">
            <div className="mobile-arch-media">
              <img
                src={resolveAssetUrl('/images/masterplan.jpeg')}
                alt="Arsitektur Gedung Sekolah SMP Shafa Wafa"
                width="1103"
                height="872"
                loading="lazy"
                decoding="async"
                className="mobile-arch-img"
              />
              <div className="mobile-arch-badge">
                <Building2 size={16} />
                <span>Gedung Sekolah 3 Lantai</span>
              </div>
            </div>
            <div className="mobile-arch-content">
              <h3>Konsep Arsitektur Nusantara & Islami</h3>
              <p>
                Gedung sekolah SMP Shafa Wafa mengadopsi struktur 3 lantai dengan atap limasan ganda Nusantara, batuan andesit kokoh, dan aksen relief Islami yang asri serta ramah sirkulasi udara tropis.
              </p>
              <div className="mobile-3d-hint">
                <Monitor size={16} />
                <span>Simulasi interaktif 3D 360° aktif pada layar Desktop / Komputer.</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="campus-canvas-wrap">
            {shouldLoad ? (
              <Suspense
                fallback={
                  <div className="campus-loading">
                    <span className="spinner" />
                    Menyiapkan visualisasi 3D gedung sekolah...
                  </div>
                }
              >
                <Campus3D />
              </Suspense>
            ) : (
              <div className="campus-loading campus-poster">
                <img
                  src={resolveAssetUrl('/images/masterplan.jpeg')}
                  alt="Pratinjau arsitektur gedung sekolah Shafa Wafa"
                  width="1103"
                  height="872"
                  loading="lazy"
                  decoding="async"
                />
                <div className="campus-poster-overlay">
                  <strong>Model 3D Gedung Sekolah</strong>
                  <span>Gulir mendekati bagian ini untuk memulai interaksi 3D.</span>
                </div>
              </div>
            )}
          </div>
        )}

        <p className="campus-disclaimer">
          <CircleHelp size={16} />
          {data.disclaimer}
        </p>
      </div>
    </section>
  );
}

export function Leadership({ data }) {
  if (!data?.visible) return null;

  return (
    <section className="section leadership-section" id="penyelenggara">
      <div className="container leadership-grid">
        <div className="leader-photo-area">
          <div className="leader-photo-frame">
            <img
              src={resolveAssetUrl(data.imageUrl || '/images/ketua-yayasan.webp')}
              alt={data.imageAlt || `Foto ${data.name}`}
              width="220"
              height="250"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="leader-photo"
              onError={(e) => {
                const match = data.imageUrl && data.imageUrl.match(/[-\w]{25,}/);
                if (match && !e.currentTarget.dataset.fallbackTried) {
                  e.currentTarget.dataset.fallbackTried = 'true';
                  e.currentTarget.src = `https://lh3.googleusercontent.com/d/${match[0]}=w1600`;
                }
              }}
            />
            <div className="leader-photo-caption">
              <strong>{data.name}</strong>
              <small>{data.role}</small>
            </div>
          </div>
        </div>

        <div className="leadership-copy">
          <span className="eyebrow">
            <span className="eyebrow-line" />
            {data.eyebrow || 'Sambutan Khidmat'}
          </span>
          <h2>{data.title}</h2>
          <div className="gold-accent-bar" />
          <blockquote className="leader-quote">
            “{data.quote}”
          </blockquote>
          <p>{data.bio}</p>

          {data.staffNote && (
            <div className="leader-transparency-card">
              <Users size={20} className="transparency-icon" />
              <div>
                <strong>{data.staffNoteTitle || 'Informasi Tim Pendidik & Tenaga Kependidikan'}</strong>
                <p>{data.staffNote}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function AdmissionsCTA({ data, onNavigate }) {
  if (!data?.visible) return null;
  return (
    <section className="section admissions-cta" id="spmb-info">
      <div className="container">
        <div className="admissions-card">
          <div className="admissions-pattern" aria-hidden="true" />
          <div className="admissions-content">
            <span className="admissions-pill">
              <span className="admissions-pill-dot" />
              {data.pill || 'Penerimaan Santri Baru (SPMB)'}
            </span>
            <h2>{data.title}</h2>
            <p>{data.description}</p>
            <div className="admissions-pills">
              <span>
                <CalendarDays size={16} />
                Tahun Ajaran {data.academicYear}
              </span>
              <span>
                <Users size={16} />
                Target Awal {data.targetStudents} Santri
              </span>
            </div>
            <div className="admissions-actions">
              <button
                className="button button-gold button-large"
                onClick={() => onNavigate && onNavigate('spmb')}
              >
                <span>{data.ctaLabel || 'Konsultasi SPMB via WhatsApp'}</span>
                <ArrowRight size={18} />
              </button>
              <button
                className="button button-outline-light button-large"
                onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span>{data.contactLabel || 'Konsultasi Pertanyaan'}</span>
              </button>
            </div>
            <small className="admissions-fineprint">{data.statusNote}</small>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FAQ({ data }) {
  if (!data) return null;
  return (
    <section className="section faq-section" id="faq">
      <div className="container">
        <div className="section-heading text-center">
          <span className="eyebrow">
            <span className="eyebrow-line" />
            {data.eyebrow || 'PERTANYAAN UMUM'}
            <span className="eyebrow-line" />
          </span>
          <h2>{data.title || 'Keterbukaan Informasi & Tanya Jawab'}</h2>
          <p>{data.subtitle || 'Jawaban lugas dan transparan mengenai sistem pendidikan, kurikulum, serta pendaftaran santri baru SMP Shafa Wafa.'}</p>
        </div>

        <div className="faq-wrap-center">
          <div className="faq-list">
            {(data.items || []).map((item, i) => (
              <details className="faq-item" key={`${item.question}-${i}`}>
                <summary>
                  <span>{item.question}</span>
                  <ChevronDown size={20} className="faq-chevron" />
                </summary>
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function getMapEmbedUrl(data) {
  if (!data) return '';
  if (data.mapEmbedUrl) return data.mapEmbedUrl;
  const raw = data.mapUrl || '';
  if (raw.includes('output=embed') || raw.includes('/maps/embed')) {
    return raw;
  }
  try {
    const url = new URL(raw);
    const q = url.searchParams.get('q');
    if (q) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
  } catch {
    // ignore
  }
  const query = data.address || '-6.9198125,112.0483906';
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

export function LocationSection({ data }) {
  if (!data) return null;
  return (
    <section className="section location-section" id="lokasi">
      <div className="container">
        <div className="section-heading text-center">
          <span className="eyebrow">
            <span className="eyebrow-line" />
            {data.eyebrow || 'AKSESIBILITAS WILAYAH'}
            <span className="eyebrow-line" />
          </span>
          <h2>{data.title || 'Akses & Lokasi SMP Shafa Wafa'}</h2>
          <p>{data.description}</p>
        </div>

        <div className="location-grid">
          <div className="location-copy">
            <h3>Peta Kampus & Titik Kunjungan</h3>
            <p className="location-desc-sub">
              Terletak di kawasan asri dan tenang Kabupaten Tuban, terjangkau dari jalur arteri utama dengan aksesibilitas kendaraan yang nyaman.
            </p>
            <div className="location-points">
              <div className="location-point">
                <MapPin size={20} />
                <span>{data.address}</span>
              </div>
              {data.proximity && (
                <div className="location-point">
                  <Clock size={20} />
                  <span>{data.proximity}</span>
                </div>
              )}
            </div>
            {data.mapUrl && (
              <a
                href={data.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="button button-gold location-button"
              >
                <span>Buka di Google Maps</span>
                <ExternalLink size={16} />
              </a>
            )}
          </div>

        <div className="location-map-card">
          <iframe
            title="Peta Lokasi Google Maps SMP Shafa Wafa"
            src={getMapEmbedUrl(data)}
            className="location-map-iframe"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className="location-map-floating-bar">
            <div className="location-map-label">
              <MapPin size={15} />
              <span>SMP Shafa Wafa • Tuban</span>
            </div>
            {data.mapUrl && (
              <a
                href={data.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="location-map-direct"
                title="Buka rute di Google Maps"
              >
                <span>Buka Rute</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}

export function Footer({ content, onNavigate }) {
  const brand = content.brand || defaultContent.brand;
  const footer = content.footer || defaultContent.footer;
  const contact = content.contact || defaultContent.contact;

  return (
    <footer className="site-footer">
      <div className="container footer-main-grid">
        <div className="footer-col-brand">
          <Brand content={content} />
          <p className="footer-brand-desc">{footer.tagline || brand.tagline}</p>
          <div className="footer-contact-mini">
            <p><MapPin size={16} />{contact.address}</p>
            {contact.email && <p><Mail size={16} />{contact.email}</p>}
          </div>
        </div>

        <div className="footer-col-nav">
          <h3>Navigasi Akademik</h3>
          <ul className="footer-nav-list">
            <li>
              <button type="button" onClick={() => onNavigate ? onNavigate('home') : window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Beranda Utama
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate && onNavigate('tentang')}>
                Profil & Visi Misi
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate && onNavigate('program')}>
                Kurikulum & Program
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate && onNavigate('fasilitas')}>
                Fasilitas & Kampus 3D
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate && onNavigate('galeri')}>
                Galeri Foto & Dokumentasi
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigate && onNavigate('spmb')}>
                Penerimaan Santri Baru (SPMB)
              </button>
            </li>
          </ul>
        </div>

        <div className="footer-col-info">
          <h3>Keterbukaan Informasi</h3>
          <div className="footer-info-box">
            <div className="footer-info-title">
              <Info size={16} />
              <span>Pemberitahuan Resmi</span>
            </div>
            <p>{footer.note}</p>
          </div>
        </div>
      </div>

      <div className="container footer-bottom-bar">
        <span>© {new Date().getFullYear()} {footer.copyright || brand.name}. Hak Cipta Dilindungi.</span>
        <div className="footer-bottom-actions">
          <button className="cms-portal-link" onClick={() => onNavigate && onNavigate('admin')}>
            <Lock size={14} />
            <span>Portal CMS Admin</span>
          </button>
        </div>
      </div>
    </footer>
  );
}

export function DailyRoutine({ data }) {
  const routine = data || defaultContent.dailyRoutine;
  if (!routine || routine.visible === false) return null;
  return (
    <section className="section daily-routine-section" id="keseharian">
      <div className="container">
        <div className="section-heading text-center">
          <span className="eyebrow">
            <span className="eyebrow-line" />
            {routine.eyebrow || 'RITME KEHIDUPAN SANTRI'}
            <span className="eyebrow-line" />
          </span>
          <h2>{routine.title || 'Keseharian Terarah & Penuh Keberkahan'}</h2>
          <p>{routine.description}</p>
        </div>

        <div className="routine-timeline-grid">
          {(routine.items || []).map((item, idx) => (
            <article className="routine-card" key={idx}>
              <div className="routine-card-head">
                <div className="routine-time-badge">
                  <Clock size={13} />
                  <span>{item.time}</span>
                </div>
                {item.tag && <span className="routine-tag">{item.tag}</span>}
              </div>
              <span className="routine-period">{item.period}</span>
              <h3>{item.title}</h3>
              <p>{item.activity}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials({ data }) {
  const testimonials = data || defaultContent.testimonials;
  if (!testimonials || testimonials.visible === false) return null;
  return (
    <section className="section testimonials-section" id="testimoni">
      <div className="container">
        <div className="section-heading text-center">
          <span className="eyebrow">
            <span className="eyebrow-line" />
            {testimonials.eyebrow || 'SUARA WALI & ENDORSEMENT'}
            <span className="eyebrow-line" />
          </span>
          <h2>{testimonials.title || "Kepercayaan & Harapan bagi Generasi Qur'ani"}</h2>
          <p>{testimonials.description}</p>
        </div>

        <MobileCardSlider className="testimonials-grid" interval={2000}>
          {(testimonials.items || []).map((item, idx) => (
            <article className="testimonial-card" key={idx}>
              <div className="testimonial-quote-icon">
                <Quote size={24} />
              </div>
              <p className="testimonial-quote-text">“{item.quote}”</p>
              <div className="testimonial-author-block">
                <div className="testimonial-avatar">
                  <span>{item.author ? item.author.charAt(0) : 'W'}</span>
                </div>
                <div>
                  <strong>{item.author}</strong>
                  <small>{item.role}{item.location ? ` • ${item.location}` : ''}</small>
                </div>
              </div>
            </article>
          ))}
        </MobileCardSlider>
      </div>
    </section >
  );
}

export function GallerySection({ data, onNavigate, isSummary = false }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Semua');

  const gallery = data || defaultContent.gallery;
  if (!gallery || gallery.visible === false) return null;
  const items = gallery.items || [];
  if (!items.length) return null;

  // Curated/featured photos for Beranda
  const featuredItems = items.filter((it) => it.featured === true);
  const curatedItems = featuredItems.length > 0 ? featuredItems : items.slice(0, 4);

  const categories = ['Semua', ...new Set(items.map((it) => it.category).filter(Boolean))];
  const filteredItems = activeCategory === 'Semua' ? items : items.filter((it) => it.category === activeCategory);
  const displayItems = isSummary ? curatedItems : filteredItems;

  useEffect(() => {
    if (lightboxIndex !== null) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setLightboxIndex(null);
        else if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev > 0 ? prev - 1 : displayItems.length - 1));
        else if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev < displayItems.length - 1 ? prev + 1 : 0));
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = prevOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [lightboxIndex, displayItems.length]);

  const activeItem = lightboxIndex !== null ? displayItems[lightboxIndex] : null;

  const showPrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : displayItems.length - 1));
  };

  const showNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev < displayItems.length - 1 ? prev + 1 : 0));
  };

  return (
    <section className="section gallery-section" id="galeri">
      <div className="container">
        <div className="section-heading text-center">
          <span className="eyebrow">
            <span className="eyebrow-line" />
            {gallery.eyebrow || 'GALERI & DOKUMENTASI'}
            <span className="eyebrow-line" />
          </span>
          <h2>{gallery.title || 'Potret Kawasan & Aktivitas Santri'}</h2>
          <p>
            {isSummary
              ? 'Dokumentasi pilihan lingkungan sekolah terpadu dan pembiasaan adab harian santri SMP Shafa Wafa Tuban.'
              : gallery.description}
          </p>
        </div>

        {/* Filter bar is only displayed on the full gallery page */}
        {!isSummary && categories.length > 2 && (
          <div className="gallery-filter-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`gallery-filter-btn ${activeCategory === cat ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {isSummary ? (
          <MobileCardSlider className="gallery-grid" interval={2000}>
            {displayItems.map((item, idx) => (
              <div
                className="gallery-card"
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setLightboxIndex(idx)}
              >
                <div className="gallery-media">
                  <img
                    src={resolveAssetUrl(item.imageUrl)}
                    alt={item.title || 'Foto Dokumentasi'}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="gallery-img"
                    onError={(e) => {
                      const match = item.imageUrl && item.imageUrl.match(/[-\w]{25,}/);
                      if (match && !e.currentTarget.dataset.fallbackTried) {
                        e.currentTarget.dataset.fallbackTried = 'true';
                        e.currentTarget.src = `https://lh3.googleusercontent.com/d/${match[0]}=w1600`;
                      }
                    }}
                  />
                  <div className="gallery-overlay">
                    {item.category && <span className="gallery-badge">{item.category}</span>}
                    <div className="gallery-card-info">
                      <h3>{item.title}</h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </MobileCardSlider>
        ) : (
          <div className="gallery-grid">
            {displayItems.map((item, idx) => (
              <div
                className="gallery-card"
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setLightboxIndex(idx)}
              >
                <div className="gallery-media">
                  <img
                    src={resolveAssetUrl(item.imageUrl)}
                    alt={item.title || 'Foto Dokumentasi'}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="gallery-img"
                    onError={(e) => {
                      const match = item.imageUrl && item.imageUrl.match(/[-\w]{25,}/);
                      if (match && !e.currentTarget.dataset.fallbackTried) {
                        e.currentTarget.dataset.fallbackTried = 'true';
                        e.currentTarget.src = `https://lh3.googleusercontent.com/d/${match[0]}=w1600`;
                      }
                    }}
                  />
                  <div className="gallery-overlay">
                    {item.category && <span className="gallery-badge">{item.category}</span>}
                    <div className="gallery-card-info">
                      <h3>{item.title}</h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isSummary && onNavigate && (
          <div className="section-cta-center">
            <button
              type="button"
              className="button button-gold button-large"
              onClick={() => onNavigate('galeri')}
            >
              <span>Buka Galeri Foto Lengkap ({items.length} Foto)</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Minimalist & Elegant Fullscreen Lightbox Modal ala Ar-Rohmah */}
        {activeItem && (
          <div
            className="gallery-lightbox"
            onClick={() => setLightboxIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Tampilan Foto Layar Penuh"
          >
            <div className="lightbox-topbar" onClick={(e) => e.stopPropagation()}>
              <span className="lightbox-counter">
                {lightboxIndex + 1} / {displayItems.length}
              </span>
              <button
                type="button"
                className="lightbox-close-btn"
                onClick={() => setLightboxIndex(null)}
                aria-label="Tutup pratinjau foto"
              >
                <X size={22} />
              </button>
            </div>

            <div className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
              {displayItems.length > 1 && (
                <button
                  type="button"
                  className="lightbox-nav-btn lightbox-nav-prev"
                  onClick={showPrev}
                  aria-label="Foto sebelumnya"
                >
                  <ChevronLeft size={28} />
                </button>
              )}

              <div className="lightbox-media-wrap">
                <img
                  src={resolveAssetUrl(activeItem.imageUrl)}
                  alt={activeItem.title || 'Foto Galeri'}
                  referrerPolicy="no-referrer"
                  className="lightbox-img"
                  onError={(e) => {
                    const match = activeItem.imageUrl && activeItem.imageUrl.match(/[-\w]{25,}/);
                    if (match && !e.currentTarget.dataset.fallbackTried) {
                      e.currentTarget.dataset.fallbackTried = 'true';
                      e.currentTarget.src = `https://lh3.googleusercontent.com/d/${match[0]}=w1600`;
                    }
                  }}
                />
                <div className="lightbox-caption">
                  {activeItem.category && <span className="lightbox-badge">{activeItem.category}</span>}
                  <h3 className="lightbox-title">{activeItem.title}</h3>
                </div>
              </div>

              {displayItems.length > 1 && (
                <button
                  type="button"
                  className="lightbox-nav-btn lightbox-nav-next"
                  onClick={showNext}
                  aria-label="Foto selanjutnya"
                >
                  <ChevronRight size={28} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function FloatingWhatsApp({ content }) {
  const floatingWa = content.floatingWa || defaultContent.floatingWa;
  const contact = content.contact || defaultContent.contact;
  const isVisible = content.sectionVisibility?.floatingWa !== false && floatingWa.visible !== false;

  const rawPhone = floatingWa.phoneNumber || contact.whatsapp || '';
  const cleanPhone = rawPhone.replace(/\D/g, '');
  if (!isVisible || !cleanPhone) return null;

  const defaultMsg = encodeURIComponent(
    floatingWa.message || "Assalamu'alaikum Panitia SPMB SMP Shafa Wafa, saya ingin berkonsultasi mengenai pendaftaran santri baru."
  );
  const waUrl = `https://wa.me/${cleanPhone}?text=${defaultMsg}`;

  return (
    <aside className="floating-wa-container" aria-label="Kontak Cepat WhatsApp">
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        className="floating-wa-btn"
        title="Konsultasi langsung via WhatsApp Panitia SPMB"
      >
        <span className="floating-wa-pulse" aria-hidden="true" />
        <MessageCircle size={22} />
        <span className="floating-wa-label">{floatingWa.label || 'Tanya Panitia SPMB'}</span>
      </a>
    </aside>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      className="back-to-top-btn"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      title="Kembali ke atas"
      aria-label="Kembali ke atas halaman"
    >
      <ArrowUp size={18} />
    </button>
  );
}

export default function HomeView({ content, onNavigate, page = 'home' }) {
  if (page === 'tentang') {
    return (
      <div className="home-view-wrapper page-subpage">
        <Header content={content} onNavigate={onNavigate} currentPage="tentang" />
        <main>
          <PageBanner
            title="Profil & Visi Misi Sekolah"
            subtitle="Mengenal Sejarah, Prinsip Nilai Luhur, dan Pengasuh Pondok Pesantren Shafa Wafa Tuban"
            breadcrumb="Profil Sekolah"
            onNavigate={onNavigate}
          />
          <About data={content.about} />
          <Values items={content.values || []} />
          <Leadership data={content.leadership} />
          <AdmissionsCTA data={content.admissions} onNavigate={onNavigate} />
        </main>
        <Footer content={content} onNavigate={onNavigate} />
        <FloatingWhatsApp content={content} />
        <BackToTop />
      </div>
    );
  }

  if (page === 'program') {
    return (
      <div className="home-view-wrapper page-subpage">
        <Header content={content} onNavigate={onNavigate} currentPage="program" />
        <main>
          <PageBanner
            title="Program Pendidikan & Kurikulum"
            subtitle="Pendidikan Formal Terpadu dengan Penguatan Adab, Tahfidz Al-Qur'an, Dwi-Bahasa, dan Kemandirian Santri"
            breadcrumb="Program Pendidikan"
            onNavigate={onNavigate}
          />
          <Program data={content.program} />
          <DailyRoutine data={content.dailyRoutine} />
          <AdmissionsCTA data={content.admissions} onNavigate={onNavigate} />
        </main>
        <Footer content={content} onNavigate={onNavigate} />
        <FloatingWhatsApp content={content} />
        <BackToTop />
      </div>
    );
  }

  if (page === 'fasilitas') {
    return (
      <div className="home-view-wrapper page-subpage">
        <Header content={content} onNavigate={onNavigate} currentPage="fasilitas" />
        <main>
          <PageBanner
            title="Fasilitas Kampus & Infrastruktur"
            subtitle="Sarana Penunjang Pendidikan Lengkap: Masjid, Asrama, Ruang Belajar, dan Digital Twin 3D Kawasan Pesantren"
            breadcrumb="Fasilitas Sekolah"
            onNavigate={onNavigate}
          />
          <Facilities data={content.facilities} />
          <CampusSection data={content.campus3d} />
          <AdmissionsCTA data={content.admissions} onNavigate={onNavigate} />
        </main>
        <Footer content={content} onNavigate={onNavigate} />
        <FloatingWhatsApp content={content} />
        <BackToTop />
      </div>
    );
  }

  if (page === 'galeri') {
    return (
      <div className="home-view-wrapper page-subpage">
        <Header content={content} onNavigate={onNavigate} currentPage="galeri" />
        <main>
          <PageBanner
            title="Galeri Foto & Dokumentasi Aktivitas"
            subtitle="Dokumentasi Visual Kegiatan Belajar Mengajar, Pembiasaan Harian, Prestasi, dan Sarana Prasarana Santri"
            breadcrumb="Galeri Dokumentasi"
            onNavigate={onNavigate}
          />
          <GallerySection data={content.gallery} isSummary={false} />
          <AdmissionsCTA data={content.admissions} onNavigate={onNavigate} />
        </main>
        <Footer content={content} onNavigate={onNavigate} />
        <FloatingWhatsApp content={content} />
        <BackToTop />
      </div>
    );
  }

  // Default: Homepage (Ar-Rohmah Putra Executive Summary Model)
  return (
    <div className="home-view-wrapper page-home">
      <Header content={content} onNavigate={onNavigate} currentPage="home" />
      <main>
        <Hero content={content} onNavigate={onNavigate} />
        <Metrics items={content.metrics || []} note={content.metricsNote} />
        <About data={content.about} onNavigate={onNavigate} isSummary={true} />
        <Values items={content.values || []} />
        <Program data={content.program} onNavigate={onNavigate} isSummary={true} />
        <Facilities data={content.facilities} onNavigate={onNavigate} isSummary={true} />
        <Testimonials data={content.testimonials} />
        <GallerySection data={content.gallery} onNavigate={onNavigate} isSummary={true} />
        <AdmissionsCTA data={content.admissions} onNavigate={onNavigate} />
        <FAQ data={content.faq} />
        <LocationSection data={content.contact} />
      </main>
      <Footer content={content} onNavigate={onNavigate} />
      <FloatingWhatsApp content={content} />
      <BackToTop />
    </div>
  );
}

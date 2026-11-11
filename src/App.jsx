import React, { Suspense, lazy, useEffect, useState } from 'react';
import { defaultContent } from './data/defaultContent';
import { loadSiteContent } from './lib/content';
import { firebaseReady } from './lib/firebase-config';
import { resolveAssetUrl } from './lib/assets';
import HomeView from './components/HomeView.jsx';

const AdminPage = lazy(() => import('./pages/Admin.jsx'));
const SpmbPage = lazy(() => import('./pages/Spmb.jsx'));

export default function App() {
  const [content, setContent] = useState(defaultContent);
  const [contentLoading, setContentLoading] = useState(true);
  const [page, setPage] = useState(() => new URLSearchParams(window.location.search).get('page') || 'home');
  const [contentSource, setContentSource] = useState('local');

  useEffect(() => {
    let active = true;
    loadSiteContent()
      .then((result) => {
        if (active) {
          setContent(result.content);
          setContentSource(result.source);
        }
      })
      .finally(() => {
        if (active) setContentLoading(false);
      });

    const onPop = () => setPage(new URLSearchParams(window.location.search).get('page') || 'home');
    window.addEventListener('popstate', onPop);
    return () => {
      active = false;
      window.removeEventListener('popstate', onPop);
    };
  }, []);

  useEffect(() => {
    document.title = content.siteMeta?.title || content.brand?.name || 'SMP Shafa Wafa';
    const meta = document.querySelector('meta[name="description"]');
    if (meta && content.siteMeta?.description) meta.setAttribute('content', content.siteMeta.description);
    Object.entries(content.theme || {}).forEach(([key, value]) =>
      document.documentElement.style.setProperty(`--${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`, value)
    );
    if (content.brand?.faviconUrl) {
      let favicon = document.querySelector('link[rel~="icon"]');
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = resolveAssetUrl(content.brand.faviconUrl);
    }
  }, [content]);

  const navigate = (nextPage) => {
    const url = new URL(window.location.href);
    if (nextPage === 'home') url.searchParams.delete('page');
    else url.searchParams.set('page', nextPage);
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleContentSaved = (nextContent) => {
    setContent(nextContent);
    setContentSource('firebase');
  };

  if (page === 'admin') {
    return (
      <Suspense fallback={<div className="route-loading">Memuat Portal CMS...</div>}>
        <AdminPage onNavigate={navigate} onContentSaved={handleContentSaved} />
      </Suspense>
    );
  }

  if (page === 'spmb') {
    return (
      <Suspense fallback={<div className="route-loading">Memuat Halaman SPMB...</div>}>
        <SpmbPage content={content} onNavigate={navigate} />
      </Suspense>
    );
  }

  return (
    <>
      <HomeView content={content} onNavigate={navigate} page={page} />
      {contentLoading && (
        <div className="quiet-loader" aria-label="Memuat konten">
          <span />
        </div>
      )}
    </>
  );
}

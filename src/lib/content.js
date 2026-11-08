import { defaultContent, mergeContent } from '../data/defaultContent';
import { firebaseReady } from './firebase-config';

async function getFirestoreServices() {
  const [{ doc, getDoc, setDoc, serverTimestamp, collection, addDoc, getDocs, query, orderBy, limit }, { db }] = await Promise.all([
    import('firebase/firestore/lite'),
    import('./firebase'),
  ]);
  if (!db) throw new Error('Firestore belum tersedia. Periksa konfigurasi Firebase.');
  return { doc, getDoc, setDoc, serverTimestamp, collection, addDoc, getDocs, query, orderBy, limit, db };
}

export async function loadSiteContent() {
  if (!firebaseReady) return { content: defaultContent, source: 'local' };
  try {
    const { doc, getDoc, db } = await getFirestoreServices();
    const snapshot = await getDoc(doc(db, 'siteContent', 'public'));
    if (!snapshot.exists() || !snapshot.data()?.content) return { content: defaultContent, source: 'default' };
    return { content: mergeContent(defaultContent, snapshot.data().content), source: 'firebase' };
  } catch (error) {
    console.warn('Konten Firestore tidak dapat dibaca; menggunakan konten bawaan.', error);
    return { content: defaultContent, source: 'local' };
  }
}

export async function saveSiteContent(content, uid) {
  if (!firebaseReady) throw new Error('Firebase belum dikonfigurasi. Lengkapi variabel VITE_FIREBASE_* terlebih dahulu.');
  if (!uid) throw new Error('Sesi admin tidak valid. Silakan masuk kembali.');
  const { doc, setDoc, serverTimestamp, db } = await getFirestoreServices();
  await setDoc(doc(db, 'siteContent', 'public'), { content, updatedAt: serverTimestamp(), updatedBy: uid });
}

export async function submitInterestLead(payload) {
  if (!firebaseReady) throw new Error('Pendataan online belum aktif. Silakan hubungi pihak yayasan melalui kanal resmi.');
  const record = {
    parentName: String(payload.parentName || '').trim(),
    studentName: String(payload.studentName || '').trim(),
    phone: String(payload.phone || '').trim(),
    currentSchool: String(payload.currentSchool || '').trim(),
    needsDorm: ['ya', 'tidak', 'belum-tahu'].includes(payload.needsDorm) ? payload.needsDorm : 'belum-tahu',
    message: String(payload.message || '').trim(),
    source: 'website-interest-form',
    createdAt: null,
  };
  if (!record.parentName || !record.studentName || !record.phone) throw new Error('Lengkapi nama wali, nama calon peserta didik, dan nomor WhatsApp.');
  if (record.parentName.length > 100 || record.studentName.length > 100 || record.phone.length > 24 || record.currentSchool.length > 160 || record.message.length > 800) {
    throw new Error('Ada isian yang melebihi batas karakter. Periksa kembali formulir.');
  }
  const digits = record.phone.replace(/[^\d]/g, '');
  if (digits.length < 8 || digits.length > 16) throw new Error('Nomor WhatsApp tampaknya belum valid.');
  const { collection, addDoc, serverTimestamp, db } = await getFirestoreServices();
  record.createdAt = serverTimestamp();
  const docRef = await addDoc(collection(db, 'spmbLeads'), record);
  return { id: docRef.id, ...record };
}

export async function loadInterestLeads() {
  if (!firebaseReady) throw new Error('Firebase belum dikonfigurasi.');
  const { collection, getDocs, query, orderBy, limit, db } = await getFirestoreServices();
  const q = query(collection(db, 'spmbLeads'), orderBy('createdAt', 'desc'), limit(150));
  const snap = await getDocs(q);
  return snap.docs.map((item) => ({ id: item.id, ...item.data() }));
}

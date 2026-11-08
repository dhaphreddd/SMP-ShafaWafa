import assert from 'node:assert/strict';
import { resolveAssetUrl } from '../src/lib/assets.js';
import { defaultContent, mergeContent } from '../src/data/defaultContent.js';

// Test 1: resolveAssetUrl
assert.equal(resolveAssetUrl(''), '');
assert.equal(resolveAssetUrl('https://example.com/logo.png'), 'https://example.com/logo.png');
assert.equal(
  resolveAssetUrl('https://drive.google.com/file/d/1ABCXYZ_123/view'),
  'https://drive.google.com/thumbnail?id=1ABCXYZ_123&sz=w1600'
);
assert.match(resolveAssetUrl('/images/logo.jpeg'), /images\/logo\.jpeg$/);

// Test 2: mergeContent
const incoming = {
  brand: { name: 'SMP Shafa Wafa Unggulan' },
  admissions: { targetStudents: 60 },
};
const merged = mergeContent(defaultContent, incoming);
assert.equal(merged.brand.name, 'SMP Shafa Wafa Unggulan');
assert.equal(merged.brand.tagline, defaultContent.brand.tagline);
assert.equal(merged.admissions.targetStudents, 60);
assert.equal(merged.admissions.targetGroups, defaultContent.admissions.targetGroups);
assert.ok(Array.isArray(merged.sectionOrder) && merged.sectionOrder.length >= defaultContent.sectionOrder.length);

console.log('✓ Semua tes smoke verifikasi logika berhasil lulus.');


import { continualLearningCitationEvidence } from '../src/content/learning/continual-learning-llm/citationEvidence.ts';

const ENTITY_MAP = new Map([
  ['amp', '&'],
  ['apos', "'"],
  ['gt', '>'],
  ['lt', '<'],
  ['nbsp', ' '],
  ['quot', '"'],
  ['rsquo', '’'],
  ['ndash', '–'],
  ['mdash', '—'],
]);

function decodeHtmlEntities(value) {
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, body) => {
    if (body.startsWith('#x')) return String.fromCodePoint(Number.parseInt(body.slice(2), 16));
    if (body.startsWith('#')) return String.fromCodePoint(Number.parseInt(body.slice(1), 10));
    return ENTITY_MAP.get(body.toLowerCase()) ?? entity;
  });
}

function htmlToSearchableText(html) {
  return decodeHtmlEntities(html)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasHtmlAnchor(html, hash) {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\bid=["']${escaped}["']`).test(html);
}

async function auditEvidence(evidence) {
  if (evidence.automatedAudit?.status === 'manual-required') {
    return { status: 'manual-required', message: evidence.automatedAudit.reason };
  }
  const target = new URL(evidence.verificationUrl);
  const response = await fetch(`${target.origin}${target.pathname}${target.search}`, {
    headers: { 'user-agent': 'TorchViz-3D citation evidence audit/1.0' },
    redirect: 'follow',
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();
  if (evidence.targetPrecision === 'html-anchor' && (!target.hash || !hasHtmlAnchor(html, target.hash))) {
    throw new Error(`missing HTML anchor ${target.hash || '<empty>'}`);
  }
  const searchableText = htmlToSearchableText(html);
  if (!searchableText.includes(evidence.searchText)) {
    throw new Error(`searchText drift: ${JSON.stringify(evidence.searchText)}`);
  }
  return { status: 'verified' };
}

const results = await Promise.allSettled(continualLearningCitationEvidence.map(auditEvidence));
let failures = 0;
for (const [index, result] of results.entries()) {
  if (result.status === 'fulfilled') {
    if (result.value.status === 'manual-required') {
      console.log(`◇ ${continualLearningCitationEvidence[index].id}: manual review required — ${result.value.message}`);
    } else {
      console.log(`✓ ${continualLearningCitationEvidence[index].id}: verified`);
    }
    continue;
  }
  failures += 1;
  const evidence = continualLearningCitationEvidence[index];
  console.error(`✗ ${evidence.id}: ${result.reason instanceof Error ? result.reason.message : String(result.reason)}`);
}

if (failures > 0) {
  console.error(`\n${failures} evidence target(s) need manual review. The audit never rewrites approved excerpts.`);
  process.exitCode = 1;
} else {
  console.log(`\nVerified ${results.length} reviewed evidence target(s).`);
}

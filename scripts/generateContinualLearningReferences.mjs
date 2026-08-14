import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const SURVEY_ARXIV_ID = '2404.16789v3';
const SURVEY_SOURCE_URL = `https://export.arxiv.org/e-print/${SURVEY_ARXIV_ID}`;
const TAUGHT_SURVEY_SECTION_ROOTS = ['S1', 'S2.SS2', 'S3', 'S4', 'S5', 'S6', 'S7'];
const ARXIV_ID_OVERRIDES = {
  petroni2019language: '1909.01066', ramsauer2021hopfield: '2008.02217', zhou2020pre: '2011.07956',
  amba2021dynamic: '2106.06297', dhingra2022time: '2106.15110', gururangan2022demix: '2108.05036',
  jang2022towards: '2110.03215', qin2021lfpt5: '2110.07298', jin2022lifelong: '2110.08534',
  ke2021achieve: '2112.02706', mehta2023empirical: '2112.09153', yin2022contintin: '2203.08512',
  cossu2022continual: '2205.09357', scialom2022fine: '2205.12393', attanasio2023worth: '2210.07365',
  hartvigsen2023aging: '2211.11031', yan2023af: '2211.11363', hase2023does: '2301.04213',
  wang2024comprehensive: '2302.00487', Zhang2023xuanyuan: '2305.12002', chen2023lifelong: '2305.12281',
  winata2023overcoming: '2305.16252', deng2023learning: '2306.05064', gupta2023continual: '2308.04014',
  rozière2024code: '2308.12950', lin2024mitigating: '2309.06256', cheng2024adapting: '2309.09530',
  zhai2023investigating: '2309.10313', li2023cfgpt: '2309.10654', lu2023ibcl: '2310.02995',
  chen2024parameterizing: '2310.04801', wang2023trace: '2310.06762', shi2024unified: '2310.12244',
  wang2023orthogonal: '2310.14152', guo2023continuous: '2311.00204', xie2023efficient: '2311.08545',
  he2023continual: '2311.16206', wistuba2023: '2311.17601', zheng2023learn: '2312.07887',
  lin2023geogalactica: '2401.00434', wu2024llama: '2401.02415', li2024examining: '2401.03129',
  zhao2024sapt: '2401.08295', zheng2024antiforgetting: '2401.09181', jin2024model: '2402.01865',
  hu2024wilke: '2402.10987', zhu2024model: '2402.12048', huang2024mitigating: '2403.01244',
  colombo2024saullm7b: '2403.03883', paul2024ircoder: '2403.03894', chen2024coin: '2403.08350',
  yang2024reawakening: '2403.09613', he2024dont: '2403.10056', zhao2024reconstruct: '2403.11373',
};
const CANONICAL_IDENTITY_OVERRIDES = {
  agarwal2024structured: { arxivId: '2401.10716', url: 'https://arxiv.org/abs/2401.10716' },
  bai2023enhancing: { arxivId: '2205.12186', url: 'https://arxiv.org/abs/2205.12186' },
  biderman2023pythia: { arxivId: '2304.01373', url: 'https://arxiv.org/abs/2304.01373' },
  bornschein2024transformers: { arxivId: '2403.01554', url: 'https://arxiv.org/abs/2403.01554' },
  chen2018lifelong: { year: 2018, doi: '10.2200/S00832ED1V01Y201802AIM037', url: 'https://doi.org/10.2200/S00832ED1V01Y201802AIM037' },
  liu2022few: { arxivId: '2205.05638', url: 'https://arxiv.org/abs/2205.05638' },
  lomonaco2020rehearsalfree: { doi: '10.1109/CVPRW50498.2020.00131', url: 'https://openaccess.thecvf.com/content_CVPRW_2020/html/w15/Lomonaco_Rehearsal-Free_Continual_Learning_Over_Small_Non-I.I.D._Batches_CVPRW_2020_paper.html' },
  lozhkov2024starcoder: { arxivId: '2402.19173', url: 'https://arxiv.org/abs/2402.19173' },
  luo2023investigating: { arxivId: '2305.05968', url: 'https://arxiv.org/abs/2305.05968' },
  luo2023wizardcoder: { arxivId: '2306.08568', url: 'https://arxiv.org/abs/2306.08568' },
  ma2023ecomgptct: { arxivId: '2312.15696', url: 'https://arxiv.org/abs/2312.15696' },
  mcclelland1995there: { doi: '10.1037/0033-295X.102.3.419', url: 'https://doi.org/10.1037/0033-295X.102.3.419' },
  meng2022locating: { arxivId: '2202.05262', url: 'https://arxiv.org/abs/2202.05262' },
  mitchell2022memory: { arxivId: '2206.06520', url: 'https://proceedings.mlr.press/v162/mitchell22a.html' },
  ni2023continual: { arxivId: '2305.07437', url: 'https://proceedings.mlr.press/v202/ni23c.html' },
  nijkamp2022codegen: { arxivId: '2203.13474', url: 'https://arxiv.org/abs/2203.13474' },
  pallier2003brain: { doi: '10.1093/cercor/13.2.155', url: 'https://doi.org/10.1093/cercor/13.2.155' },
  pentina2016theoretical: { url: 'https://jmlr.org/papers/v17/15-242.html' },
  prabhu2023computationally: { arxivId: '2303.11165', url: 'https://arxiv.org/abs/2303.11165' },
  prabhu2023online: { arxivId: '2305.09253', url: 'https://arxiv.org/abs/2305.09253' },
  radford2019language: { url: 'https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf' },
  radford2021learning: { arxivId: '2103.00020', url: 'https://arxiv.org/abs/2103.00020' },
  rafailov2024direct: { arxivId: '2305.18290', url: 'https://arxiv.org/abs/2305.18290' },
  raffel2020exploring: { arxivId: '1910.10683', url: 'https://jmlr.org/papers/v21/20-074.html' },
  rebuffi2017icarl: { arxivId: '1611.07725', url: 'https://arxiv.org/abs/1611.07725' },
  ritter2018online: { arxivId: '1805.07810', url: 'https://arxiv.org/abs/1805.07810' },
  rongali2021continual: { arxivId: '2004.02288', url: 'https://arxiv.org/abs/2004.02288' },
  schwarz2018progress: { url: 'https://proceedings.mlr.press/v80/schwarz18a.html' },
  soldaini2024dolma: { arxivId: '2402.00159', url: 'https://arxiv.org/abs/2402.00159' },
  song2023conpet: { arxivId: '2309.14763', url: 'https://arxiv.org/abs/2309.14763' },
  song2024code: { arxivId: '2402.13013', url: 'https://arxiv.org/abs/2402.13013' },
  sun2024survey: { arxivId: '2403.14734', url: 'https://arxiv.org/abs/2403.14734' },
  tao2022can: { arxivId: '2303.01081', url: 'https://arxiv.org/abs/2303.01081' },
  van2022three: { doi: '10.1038/s42256-022-00568-3', url: 'https://www.nature.com/articles/s42256-022-00568-3' },
  verwimp2024continual: { arxivId: '2311.11908', url: 'https://arxiv.org/abs/2311.11908' },
  wang2021codet5: { arxivId: '2109.00859', url: 'https://arxiv.org/abs/2109.00859' },
  wang2022coscl: { arxivId: '2207.06543', url: 'https://arxiv.org/abs/2207.06543' },
  wang2022dualprompt: { arxivId: '2112.10003', url: 'https://arxiv.org/abs/2112.10003' },
  wang2022learning: { arxivId: '2112.08654', url: 'https://arxiv.org/abs/2112.08654' },
  wang2022sparcl: { arxivId: '2209.09476', url: 'https://arxiv.org/abs/2209.09476' },
  wang2023codet5plus: { arxivId: '2305.07922', url: 'https://arxiv.org/abs/2305.07922' },
  wang2024inscl: { arxivId: '2403.11435', url: 'https://arxiv.org/abs/2403.11435' },
  wei2022chain: { arxivId: '2201.11903', url: 'https://arxiv.org/abs/2201.11903' },
  wu2019large: { arxivId: '1905.13260', url: 'https://arxiv.org/abs/1905.13260' },
  wu2021pretrained: { url: 'https://openreview.net/forum?id=figzpGMrdD' },
  wu2024continual: { arxivId: '2402.01364', url: 'https://arxiv.org/abs/2402.01364' },
  xie2024data: { year: 2023, arxivId: '2302.03169', url: 'https://arxiv.org/abs/2302.03169' },
  yang2024moral: { arxivId: '2402.11260', url: 'https://arxiv.org/abs/2402.11260' },
  yao2024tree: { arxivId: '2305.10601', url: 'https://arxiv.org/abs/2305.10601' },
  zhangcppo: { year: 2024, url: 'https://openreview.net/forum?id=86zAUE80pP' },
  zheng2023preventing: { arxivId: '2303.06628', url: 'https://arxiv.org/abs/2303.06628' },
};
const outputPath = path.resolve('src/content/learning/continual-learning-llm/papers.generated.ts');
const previousRecords = readPreviousRecords(outputPath);
const temporaryRoot = mkdtempSync(path.join(tmpdir(), 'torchviz-cl-references-'));

try {
  const archivePath = path.join(temporaryRoot, 'survey.tar');
  const htmlPath = path.join(temporaryRoot, 'survey.html');
  execFileSync('curl', ['-L', '--fail', '--silent', '--show-error', SURVEY_SOURCE_URL, '-o', archivePath]);
  execFileSync('curl', ['-L', '--fail', '--silent', '--show-error', `https://arxiv.org/html/${SURVEY_ARXIV_ID}`, '-o', htmlPath]);
  execFileSync('tar', ['-xf', archivePath, '-C', temporaryRoot]);
  const bibliography = readFileSync(path.join(temporaryRoot, 'main.bib'), 'utf8');
  const latex = readFileSync(path.join(temporaryRoot, 'main-csur.tex'), 'utf8');
  const html = readFileSync(htmlPath, 'utf8');
  const externalLinksByPaperId = collectBibliographyLinks(html);
  const entries = parseBibtex(bibliography);
  const directReferencesBySection = collectSectionReferences(latex);
  const referencesBySection = includeDescendantReferences(directReferencesBySection);
  const citedIds = new Set(TAUGHT_SURVEY_SECTION_ROOTS.flatMap((sectionId) => referencesBySection[sectionId] ?? []));
  const taughtDirectReferences = filterSectionReferences(directReferencesBySection, citedIds);
  const taughtReferences = filterSectionReferences(referencesBySection, citedIds);
  const missingIds = [...citedIds].filter((id) => !entries.has(id)).sort();
  if (missingIds.length) throw new Error(`Survey citations missing from bibliography: ${missingIds.join(', ')}`);

  const records = await mapWithConcurrency([...citedIds].sort(), 2, async (id) => {
    let record = toPaperRecord(id, entries.get(id), externalLinksByPaperId.get(id) ?? []);
    const previous = previousRecords.get(id);
    if (record.url.includes('scholar.google.com') && previous && !previous.url.includes('scholar.google.com')) {
      record = compact({ ...record, year: record.year ?? previous.year, doi: previous.doi, arxivId: previous.arxivId, url: previous.url });
    }
    return record.url.includes('scholar.google.com') ? resolveCanonicalIdentity(record) : record;
  });
  const source = `// Generated by scripts/generateContinualLearningReferences.mjs from arXiv:${SURVEY_ARXIV_ID}.\n`
    + `// Do not hand-edit bibliographic records or survey section coverage.\n\n`
    + `export type ContinualLearningPaperKind = 'article' | 'book' | 'incollection' | 'inproceedings' | 'misc' | 'phdthesis' | 'techreport' | 'unknown';\n\n`
    + `export type ContinualLearningPaper = {\n`
    + `  id: string;\n  title: string;\n  authors: string[];\n  year: number | null;\n`
    + `  venue?: string;\n  doi?: string;\n  arxivId?: string;\n  url: string;\n  kind: ContinualLearningPaperKind;\n};\n\n`
    + `export const continualLearningPapers = ${JSON.stringify(records, null, 2)} as const satisfies readonly ContinualLearningPaper[];\n\n`
    + `export const surveyDirectReferenceIdsBySection = ${JSON.stringify(sortObject(taughtDirectReferences), null, 2)} as const;\n\n`
    + `export const surveyReferenceIdsBySection = ${JSON.stringify(sortObject(taughtReferences), null, 2)} as const;\n`;
  writeFileSync(outputPath, source);
  process.stdout.write(`Generated ${records.length} papers across ${Object.keys(taughtReferences).length} taught survey sections at ${outputPath}\n`);
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}

function parseBibtex(source) {
  const entries = new Map();
  const entryPattern = /^@(article|book|incollection|inproceedings|misc|phdthesis)\s*\{\s*([^,\r\n]+),/gim;
  for (const match of source.matchAll(entryPattern)) {
    const start = match.index + match[0].length;
    let depth = 1;
    let index = start;
    for (; index < source.length && depth > 0; index += 1) {
      if (source[index] === '{') depth += 1;
      else if (source[index] === '}') depth -= 1;
    }
    const body = source.slice(start, index - 1);
    const supportedKinds = new Set(['article', 'book', 'incollection', 'inproceedings', 'misc', 'phdthesis', 'techreport']);
    const normalizedKind = match[1].toLowerCase();
    entries.set(match[2].trim(), { kind: supportedKinds.has(normalizedKind) ? normalizedKind : 'unknown', fields: parseFields(body) });
  }
  return entries;
}

function parseFields(body) {
  const fields = {};
  let index = 0;
  while (index < body.length) {
    const fieldMatch = body.slice(index).match(/(?:^|,)\s*([A-Za-z][A-Za-z0-9_-]*)\s*=\s*/);
    if (!fieldMatch) break;
    index += fieldMatch.index + fieldMatch[0].length;
    const key = fieldMatch[1].toLowerCase();
    const opener = body[index];
    if (opener === '{' || opener === '"') {
      const closer = opener === '{' ? '}' : '"';
      let depth = opener === '{' ? 1 : 0;
      const valueStart = index + 1;
      index += 1;
      for (; index < body.length; index += 1) {
        if (opener === '{' && body[index] === '{') depth += 1;
        if (body[index] !== closer) continue;
        if (opener === '"' || --depth === 0) break;
      }
      fields[key] = body.slice(valueStart, index).trim();
      index += 1;
    } else {
      const end = body.indexOf(',', index);
      fields[key] = body.slice(index, end < 0 ? body.length : end).trim();
      index = end < 0 ? body.length : end;
    }
  }
  return fields;
}

function collectSectionReferences(source) {
  const sectionRefs = {};
  const counters = [0, 0, 0];
  const stack = [];
  const lines = source.split(/\r?\n/).filter((line) => !line.trimStart().startsWith('%'));
  for (const line of lines) {
    const heading = line.match(/^\\(section|subsection|subsubsection)\*?\{/);
    if (heading) {
      const level = { section: 0, subsection: 1, subsubsection: 2 }[heading[1]];
      counters[level] += 1;
      for (let index = level + 1; index < counters.length; index += 1) counters[index] = 0;
      stack.length = level;
      stack[level] = `S${counters.slice(0, level + 1).join('.SS').replace('S1.SS', 'S1.SS')}`;
      const sectionId = level === 0
        ? `S${counters[0]}`
        : level === 1
          ? `S${counters[0]}.SS${counters[1]}`
          : `S${counters[0]}.SS${counters[1]}.SSS${counters[2]}`;
      stack[level] = sectionId;
      sectionRefs[sectionId] ??= new Set();
    }
    const ids = [...line.matchAll(/\\cite\w*\s*(?:\[[^\]]*\]\s*)?\{([^}]+)\}/g)]
      .flatMap((match) => match[1].split(',').map((id) => id.trim()).filter(Boolean));
    if (!ids.length) continue;
    const sectionId = stack.at(-1);
    if (!sectionId) continue;
    sectionRefs[sectionId] ??= new Set();
    ids.forEach((id) => sectionRefs[sectionId].add(id));
  }
  return Object.fromEntries(Object.entries(sectionRefs).map(([id, values]) => [id, [...values].sort()]));
}

function includeDescendantReferences(directReferences) {
  return Object.fromEntries(Object.keys(directReferences).map((sectionId) => {
    const prefix = `${sectionId}.`;
    const ids = Object.entries(directReferences)
      .filter(([candidate]) => candidate === sectionId || candidate.startsWith(prefix))
      .flatMap(([, values]) => values);
    return [sectionId, [...new Set(ids)].sort()];
  }));
}

function filterSectionReferences(references, citedIds) {
  return Object.fromEntries(Object.entries(references)
    .filter(([sectionId]) => TAUGHT_SURVEY_SECTION_ROOTS.some((root) => sectionId === root || sectionId.startsWith(`${root}.`)))
    .map(([sectionId, paperIds]) => [sectionId, paperIds.filter((paperId) => citedIds.has(paperId))]));
}

function toPaperRecord(id, entry, externalLinks) {
  const fields = entry.fields;
  const doi = clean(fields.doi).replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '');
  const explicitUrl = clean(fields.url);
  const externalArxivUrl = externalLinks.find((url) => /arxiv\.org\/(?:abs|pdf)\//i.test(url));
  const externalDoiUrl = externalLinks.find((url) => /doi\.org\//i.test(url));
  const arxivId = ARXIV_ID_OVERRIDES[id] ?? extractArxivId(fields, [explicitUrl, externalArxivUrl].filter(Boolean).join(' '));
  const venue = clean(fields.journal ?? fields.booktitle ?? fields.publisher ?? fields.institution ?? fields.school);
  const yearValue = Number(clean(fields.year));
  return compact({
    id,
    title: clean(fields.title) || id,
    authors: splitAuthors(fields.author),
    year: Number.isInteger(yearValue) ? yearValue : null,
    venue,
    doi,
    arxivId,
    url: doi ? `https://doi.org/${doi}` : explicitUrl || externalDoiUrl || (arxivId ? `https://arxiv.org/abs/${arxivId}` : externalLinks[0]) || `https://scholar.google.com/scholar?q=${encodeURIComponent(clean(fields.title) || id)}`,
    kind: entry.kind,
    ...(CANONICAL_IDENTITY_OVERRIDES[id] ?? {}),
  });
}

async function resolveCanonicalIdentity(record) {
  try {
    const endpoint = new URL('https://api.openalex.org/works');
    endpoint.searchParams.set('search', record.title);
    endpoint.searchParams.set('per-page', '5');
    const response = await fetchWithRetry(endpoint, 3);
    if (!response.ok) return record;
    const payload = await response.json();
    const normalizedTitle = normalizeTitle(record.title);
    const match = payload.results?.find((candidate) => {
      if (normalizeTitle(candidate.title ?? '') !== normalizedTitle) return false;
      return !record.year || !candidate.publication_year || Math.abs(candidate.publication_year - record.year) <= 1;
    });
    if (!match) return record;
    const doi = String(match.doi ?? '').replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '');
    const locations = [match.primary_location, ...(match.locations ?? [])].filter(Boolean);
    const arxivUrl = locations.map((location) => location.landing_page_url).find((url) => /arxiv\.org\/abs\//i.test(url ?? ''));
    const arxivId = arxivUrl?.match(/arxiv\.org\/abs\/([^?#/]+)/i)?.[1];
    const primaryUrl = locations.map((location) => location.landing_page_url).find((url) => /^https?:\/\//i.test(url ?? ''));
    return compact({
      ...record,
      year: record.year ?? match.publication_year ?? null,
      doi,
      arxivId,
      url: doi ? `https://doi.org/${doi}` : arxivUrl || primaryUrl || record.url,
    });
  } catch {
    return record;
  }
}

async function fetchWithRetry(url, attempts) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const response = await fetch(url, { headers: { 'User-Agent': 'TorchViz-3D citation generator' } });
    if (response.status !== 429 || attempt === attempts - 1) return response;
    await new Promise((resolve) => setTimeout(resolve, 750 * (attempt + 1)));
  }
  throw new Error('unreachable');
}

function readPreviousRecords(filePath) {
  if (!existsSync(filePath)) return new Map();
  try {
    const source = readFileSync(filePath, 'utf8');
    const serialized = source.match(/export const continualLearningPapers = (\[[\s\S]*?\]) as const satisfies/)?.[1];
    const records = serialized ? JSON.parse(serialized) : [];
    return new Map(records.map((record) => [record.id, record]));
  } catch {
    return new Map();
  }
}

async function mapWithConcurrency(values, concurrency, mapper) {
  const results = new Array(values.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(values[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, worker));
  return results;
}

function normalizeTitle(value) {
  return value.normalize('NFKD').replace(/[^a-z0-9]+/gi, ' ').trim().toLowerCase();
}

function collectBibliographyLinks(html) {
  const bibliographyIdByPaperId = new Map();
  for (const match of html.matchAll(/<a href="#(bib\.bib\d+)"[^>]*>([^<]+)<\/a>/g)) {
    bibliographyIdByPaperId.set(decodeHtml(match[2]).trim(), match[1]);
  }
  const linksByBibliographyId = new Map();
  for (const match of html.matchAll(/<li id="(bib\.bib\d+)"[\s\S]*?<\/li>/g)) {
    const links = [...match[0].matchAll(/href="(https?:[^"#]+)"/g)].map((item) => decodeHtml(item[1]));
    linksByBibliographyId.set(match[1], [...new Set(links)]);
  }
  return new Map([...bibliographyIdByPaperId].map(([paperId, bibliographyId]) => [paperId, linksByBibliographyId.get(bibliographyId) ?? []]));
}

function decodeHtml(value) {
  return value.replaceAll('&amp;', '&').replaceAll('&#x2F;', '/').replaceAll('&#47;', '/');
}

function extractArxivId(fields, url) {
  const candidates = [fields.eprint, fields.arxiv, fields.journal, fields.doi, url].filter(Boolean).join(' ');
  return candidates.match(/(?:arXiv[.:/]\s*|arxiv\.org\/(?:abs|pdf)\/|abs\/)(\d{4}\.\d{4,5}(?:v\d+)?)/i)?.[1];
}

function splitAuthors(value = '') {
  return value.split(/\s+and\s+/i).map(clean).filter(Boolean);
}

function clean(value = '') {
  return value
    .replace(/[{}]/g, '')
    .replace(/\\&/g, '&')
    .replace(/\\text(?:tt|it|bf)\s*/g, '')
    .replace(/\\["'`^~=.]\s*([A-Za-z])/g, '$1')
    .replace(/\\[A-Za-z]+\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function compact(value) {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== ''));
}

function sortObject(value) {
  return Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right)));
}

import type { LearningDomain, LearningLesson, LearningTrack } from '../types.ts';
import { buildPlaceholderContent, type LearningChapterSeed } from './seed.ts';

const chapters: LearningChapterSeed[] = [
  {
    id: 'python-fundamentals',
    textKey: 'pythonFundamentals',
    lessonIds: [
      'python-data-types-variables',
      'python-strings',
      'python-collections',
      'python-control-flow',
    ],
  },
  {
    id: 'python-functions',
    textKey: 'pythonFunctions',
    lessonIds: [
      'defining-functions',
      'function-arguments',
      'default-args-varargs-kwargs',
      'return-values-unpacking',
      'lambda-recursion-docstrings',
    ],
  },
  {
    id: 'python-oop',
    textKey: 'pythonOop',
    lessonIds: [
      'classes-instances-init',
      'methods-self-variables',
      'inheritance-super-overriding',
      'dunder-methods',
      'property-static-class-methods',
      'abstract-classes-abc',
    ],
  },
  {
    id: 'pythonic-code-idioms',
    textKey: 'pythonicCodeIdioms',
    lessonIds: [
      'comprehensions',
      'generator-expressions',
      'map-filter-reduce',
      'unpacking-patterns',
      'any-all-sorted-key',
      'collections-module',
    ],
  },
  {
    id: 'file-io-data-handling',
    textKey: 'fileIoDataHandling',
    lessonIds: [
      'text-files-context-managers',
      'csv-module',
      'json-load-dump',
      'pickle-serialization',
      'os-module-paths-dirs',
      'pathlib-paths',
      'glob-pattern-matching',
    ],
  },
  {
    id: 'error-handling-debugging',
    textKey: 'errorHandlingDebugging',
    lessonIds: [
      'try-except-finally',
      'specific-exceptions',
      'raising-exceptions',
      'custom-exception-classes',
      'logging-levels',
      'pdb-breakpoint',
      'reading-tracebacks',
    ],
  },
  {
    id: 'performance-memory',
    textKey: 'performanceMemory',
    lessonIds: [
      'generators-yield',
      'itertools-module',
      'timeit-cprofile',
      'shallow-deep-copy',
      'vectorization-over-loops',
    ],
  },
  {
    id: 'numpy-for-ai',
    textKey: 'numpyForAi',
    lessonIds: [
      'numpy-array-creation',
      'numpy-shape-ndim-dtype',
      'numpy-reshape-flatten-ravel',
      'numpy-stacking',
      'numpy-boolean-indexing-where',
      'numpy-broadcasting',
      'numpy-dot-matmul',
      'numpy-linalg',
      'numpy-aggregations-axis',
      'numpy-random',
    ],
  },
  {
    id: 'pandas-data-work',
    textKey: 'pandasDataWork',
    lessonIds: [
      'pandas-dataframes-series',
      'pandas-inspection',
      'pandas-loc-iloc',
      'pandas-boolean-filtering',
      'pandas-missing-values',
      'pandas-groupby-agg-pivot',
      'pandas-reshape-merge',
      'pandas-date-parsing',
    ],
  },
  {
    id: 'code-quality-project-structure',
    textKey: 'codeQualityProjectStructure',
    lessonIds: [
      'virtual-environments',
      'requirements-pip-freeze',
      'modular-code-packages',
      'init-py-packages',
      'type-hints',
      'dataclasses',
      'pytest-unit-tests',
      'ruff-black-formatting',
    ],
  },
  {
    id: 'python-ai-workflows',
    textKey: 'pythonAiWorkflows',
    lessonIds: [
      'jupyter-notebooks',
      'google-colab-gpu',
      'tqdm-progress-bars',
      'argparse-cli',
      'hydra-yaml-configs',
      'dotenv-api-keys',
      'seeding-reproducibility',
      'saving-loading-models',
    ],
  },
  {
    id: 'async-python-ai-apis',
    textKey: 'asyncPythonAiApis',
    lessonIds: [
      'async-await-syntax',
      'asyncio-event-loop',
      'aiohttp-ai-api-calls',
      'asyncio-gather-concurrency',
      'httpx-async-client',
      'streaming-llm-responses',
    ],
  },
];

const programmingFoundationContent = buildPlaceholderContent({
  domainId: 'programming-foundation',
  domainTextKey: 'programmingFoundation',
  domainStatus: 'active',
  chapters,
  sectionKinds: ['theory', 'code'],
});

export const programmingFoundationDomain: LearningDomain = programmingFoundationContent.domain;
export const programmingFoundationTracks: LearningTrack[] = programmingFoundationContent.tracks;
export const programmingFoundationLessons: LearningLesson[] = programmingFoundationContent.lessons;

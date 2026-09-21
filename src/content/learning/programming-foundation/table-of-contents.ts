import type { LearningTableOfContents, LearningTocTrackSeed } from '../../../core/learning/types.ts';

const chapters: LearningTocTrackSeed[] = [
  {
    id: 'python-fundamentals',
    text: {
      title: { en: "1.1 Python Fundamentals", vi: "1.1 Python Fundamentals" },
      description: { en: "Types, strings, collections, and control flow.", vi: "Kiểu dữ liệu, string, collection và control flow." },
    },
    lessonIds: [
      'python-data-types-variables',
      'python-strings',
      'python-collections',
      'python-control-flow',
    ],
  },
  {
    id: 'python-functions',
    text: {
      title: { en: "1.2 Functions", vi: "1.2 Functions" },
      description: { en: "Function definitions, arguments, returns, lambdas, recursion, and docstrings.", vi: "Định nghĩa hàm, arguments, return, lambda, recursion và docstring." },
    },
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
    text: {
      title: { en: "1.3 Object-Oriented Programming", vi: "1.3 Object-Oriented Programming" },
      description: { en: "Classes, methods, inheritance, dunder methods, decorators, and ABCs.", vi: "Class, method, inheritance, dunder method, decorator và ABC." },
    },
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
    text: {
      title: { en: "1.4 Pythonic Code & Idioms", vi: "1.4 Pythonic Code & Idioms" },
      description: { en: "Comprehensions, generators, unpacking, sorting, and collections utilities.", vi: "Comprehension, generator, unpacking, sorting và tiện ích collections." },
    },
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
    text: {
      title: { en: "1.5 File I/O & Data Handling", vi: "1.5 File I/O & Data Handling" },
      description: { en: "Text, CSV, JSON, pickle, paths, directories, and glob patterns.", vi: "Text, CSV, JSON, pickle, path, folder và glob pattern." },
    },
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
    text: {
      title: { en: "1.6 Error Handling & Debugging", vi: "1.6 Error Handling & Debugging" },
      description: { en: "Exceptions, logging, breakpoints, and traceback reading.", vi: "Exception, logging, breakpoint và đọc traceback." },
    },
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
    text: {
      title: { en: "1.7 Performance & Memory", vi: "1.7 Performance & Memory" },
      description: { en: "Generators, itertools, profiling, copies, and vectorization.", vi: "Generator, itertools, profiling, copy và vectorization." },
    },
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
    text: {
      title: { en: "1.8 NumPy", vi: "1.8 NumPy" },
      description: { en: "Arrays, shapes, reshaping, broadcasting, matrix math, aggregation, and randomness.", vi: "Array, shape, reshape, broadcasting, ma trận, aggregation và random." },
    },
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
    text: {
      title: { en: "1.9 Pandas", vi: "1.9 Pandas" },
      description: { en: "DataFrames, indexing, filtering, missing values, groupby, reshaping, and dates.", vi: "DataFrame, indexing, filtering, missing value, groupby, reshape và ngày tháng." },
    },
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
    text: {
      title: { en: "1.10 Code Quality & Project Structure", vi: "1.10 Code Quality & Project Structure" },
      description: { en: "Environments, requirements, modules, typing, dataclasses, tests, linting, and formatting.", vi: "Environment, requirements, module, typing, dataclass, test, lint và format." },
    },
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
    text: {
      title: { en: "1.11 Python for AI Workflows", vi: "1.11 Python for AI Workflows" },
      description: { en: "Notebooks, Colab, tqdm, CLI args, configs, dotenv, seeds, and model persistence.", vi: "Notebook, Colab, tqdm, CLI args, config, dotenv, seed và lưu model." },
    },
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
    text: {
      title: { en: "1.12 Async Python", vi: "1.12 Async Python" },
      description: { en: "async/await, event loops, async HTTP, concurrency, httpx, and streaming LLM responses.", vi: "async/await, event loop, async HTTP, concurrency, httpx và streaming LLM." },
    },
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

export const learningTableOfContents = {
  id: 'programming-foundation',
  text: {
    title: { en: "Programming", vi: "Programming" },
    description: { en: "Build the Python fluency needed for AI work: functions, classes, files, debugging, NumPy-style arrays, project structure, async API calls, and clean code habits that make model experiments reliable.", vi: "Xây nền Python cho công việc AI: function, class, file, debugging, array kiểu NumPy, cấu trúc project, async API call và thói quen code sạch để thử nghiệm model đáng tin cậy." },
  },
  status: 'placeholder',
  chapters,
  sectionKinds: ['theory', 'code'],
} satisfies LearningTableOfContents;

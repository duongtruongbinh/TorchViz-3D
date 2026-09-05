import {
  Check,
  Code2,
  DatabaseBackup,
  Dna,
  GitFork,
  ListFilter,
  Monitor,
  Terminal,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import 'katex/dist/katex.min.css';
import {
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';
import { InlineMath, BlockMath, MathInline, MathDisplay, EquationCallout, renderMathToString } from './math';
import type { LearningLessonExtra } from './authoredTypes';
import type { LearningLessonEntryPoint } from '../../core/learning/types';
import { getStrings, type Language } from '../../lib/localization';
import type { LearningCitationEvidence, LearningCitationLinkOnlyException } from '../../core/learning/citationEvidence';
import { indexLearningReferences } from '../../core/learning/referenceIndex';
import type { SHARED_LEARNING_MDX_COMPONENT_NAMES } from '../../core/learning/mdxContract';
import QuizBlock, { type QuizQuestionState } from './lesson/QuizBlock';
import { CodeBlock } from './code/CodeBlock';
import { CodeLabStep } from './code/CodeLabStep';
import { InteractiveStepper } from './shell/InteractiveStepper';
import { cx, type getLearningLabTheme, type LearningSemanticTone } from './theme';
import { Mermaid, MermaidDiagram } from './MermaidDiagram';
import { Flowchart } from './Flowchart';

export type LearningThemeClasses = ReturnType<typeof getLearningLabTheme>;
export type LearningReferencePaper = {
  id: string;
  title: string;
  authors: readonly string[];
  year: number | null;
  venue?: string;
  url: string;
};
// MDX intentionally composes components with different authored prop contracts.
// Each concrete map is checked against its canonical component-name union.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LearningMdxComponent = ComponentType<any>;

const LearningMdxThemeContext = createContext<LearningThemeClasses | null>(null);
const LearningMdxLessonContext = createContext<{
  domainId: string;
  lessonId: string;
  language: Language;
  pageIndex: number;
  entryPoints: readonly LearningLessonEntryPoint[];
  referencePapers?: readonly LearningReferencePaper[];
  referenceIndexByPaperId: ReadonlyMap<string, number>;
  citationEvidence?: readonly LearningCitationEvidence[];
  citationLinkOnlyExceptions?: readonly LearningCitationLinkOnlyException[];
  activeCitationEvidenceId: string | null;
  setActiveCitationEvidenceId: (evidenceId: string | null) => void;
  featuredReferenceIds?: readonly string[];
  referenceCourseAnalysis?: string;
  quizQuestionStates?: Record<string, QuizQuestionState>;
  onQuizQuestionStateChange?: (questionId: string, state: QuizQuestionState) => void;
} | null>(null);

export function LearningMdxThemeProvider({ children, themeClasses }: { children: ReactNode; themeClasses: LearningThemeClasses }) {
  return <LearningMdxThemeContext.Provider value={themeClasses}>{children}</LearningMdxThemeContext.Provider>;
}

export function LearningMdxLessonProvider({
  children,
  domainId,
  lessonId,
  language,
  pageIndex,
  entryPoints = [],
  referencePapers,
  citationEvidence,
  citationLinkOnlyExceptions,
  featuredReferenceIds,
  referenceCourseAnalysis,
  quizQuestionStates,
  onQuizQuestionStateChange,
}: {
  children: ReactNode;
  domainId: string;
  lessonId: string;
  language: Language;
  pageIndex: number;
  entryPoints?: readonly LearningLessonEntryPoint[];
  referencePapers?: readonly LearningReferencePaper[];
  citationEvidence?: readonly LearningCitationEvidence[];
  citationLinkOnlyExceptions?: readonly LearningCitationLinkOnlyException[];
  featuredReferenceIds?: readonly string[];
  referenceCourseAnalysis?: string;
  quizQuestionStates?: Record<string, QuizQuestionState>;
  onQuizQuestionStateChange?: (questionId: string, state: QuizQuestionState) => void;
}) {
  const [activeCitationEvidenceId, setActiveCitationEvidenceId] = useState<string | null>(null);
  const indexedReferences = useMemo(
    () => indexLearningReferences(referencePapers ?? [], featuredReferenceIds ?? []),
    [featuredReferenceIds, referencePapers],
  );
  return (
    <LearningMdxLessonContext.Provider
      value={{
        domainId,
        lessonId,
        language,
        pageIndex,
        entryPoints,
        referencePapers: indexedReferences.ordered,
        referenceIndexByPaperId: indexedReferences.indexById,
        citationEvidence,
        citationLinkOnlyExceptions,
        activeCitationEvidenceId,
        setActiveCitationEvidenceId,
        featuredReferenceIds,
        referenceCourseAnalysis,
        quizQuestionStates,
        onQuizQuestionStateChange,
      }}
    >
      {children}
    </LearningMdxLessonContext.Provider>
  );
}

export function useLearningMdxTheme(): LearningThemeClasses {
  const themeClasses = useContext(LearningMdxThemeContext);
  if (!themeClasses) throw new Error('Learning MDX components require LearningMdxThemeProvider.');
  return themeClasses;
}

export function useLearningMdxLesson() {
  const lessonContext = useContext(LearningMdxLessonContext);
  if (!lessonContext) throw new Error('Learning MDX components require LearningMdxLessonProvider.');
  return lessonContext;
}

export function RequirementsGrid({ children }: { children?: ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{children}</div>;
}

const REQUIREMENT_ICONS: Record<string, LucideIcon> = { code: Code2, monitor: Monitor, terminal: Terminal, wrench: Wrench };
const REQUIREMENT_CARD_PALETTES: Record<string, { lightTop: string; lightIcon: string; darkTop: string; darkIcon: string }> = {
  monitor: {
    lightTop: 'bg-[#AABBD8]',
    lightIcon: 'bg-[#EFF4FF] text-[#3C5680]',
    darkTop: 'bg-[#263B5B]',
    darkIcon: 'bg-[#172A43] text-[#BFD3F2]',
  },
  code: {
    lightTop: 'bg-[#B9CBE8]',
    lightIcon: 'bg-[#EEF5FF] text-[#315D91]',
    darkTop: 'bg-[#243B5B]',
    darkIcon: 'bg-[#172A43] text-[#B9D8FF]',
  },
  terminal: {
    lightTop: 'bg-[#A7C8CF]',
    lightIcon: 'bg-[#ECFBFD] text-[#32636C]',
    darkTop: 'bg-[#1F424B]',
    darkIcon: 'bg-[#16333A] text-[#B5E5EC]',
  },
  wrench: {
    lightTop: 'bg-[#C3B8DF]',
    lightIcon: 'bg-[#F5F0FF] text-[#62518C]',
    darkTop: 'bg-[#392E56]',
    darkIcon: 'bg-[#2A2142] text-[#D7CCF5]',
  },
};

export function RequirementCard({ children, icon = 'wrench', name, role }: { children?: ReactNode; icon?: string; name: string; role: string }) {
  const themeClasses = useLearningMdxTheme();
  const Icon = REQUIREMENT_ICONS[icon] ?? Wrench;
  const visualPalette = REQUIREMENT_CARD_PALETTES[icon] ?? REQUIREMENT_CARD_PALETTES.wrench;
  const palette = themeClasses.isLight
    ? { card: 'border-[#205089]/12 bg-white', top: visualPalette.lightTop, icon: `border border-black/5 shadow-[0_12px_24px_rgba(30,42,56,0.12)] ${visualPalette.lightIcon}` }
    : { card: 'border-[#A8B8C8]/14 bg-[#121A24]/36', top: visualPalette.darkTop, icon: `border border-white/10 shadow-[0_12px_24px_rgba(0,0,0,0.20)] ${visualPalette.darkIcon}` };
  return (
    <section className={cx('grid h-full min-h-[25.625rem] grid-rows-[150px_minmax(0,1fr)] overflow-hidden rounded-lg border shadow-[inset_0_1px_0_rgba(255,255,255,0.54)]', palette.card)}>
      <div className={cx('grid place-items-center border-b', palette.top, themeClasses.isLight ? 'border-black/5' : 'border-white/10')}>
        <div className={cx('grid h-16 w-16 place-items-center rounded-2xl', palette.icon)}><Icon className="h-8 w-8" strokeWidth={1.8} aria-hidden="true" /></div>
      </div>
      <div className="grid content-start gap-3 p-4">
        <div><h3 className={cx('text-base font-black leading-6', themeClasses.titleText)}>{name}</h3><p className={cx('mt-0.5 text-sm font-semibold leading-6', themeClasses.mutedText)}>{role}</p></div>
        <div className={cx('grid gap-2 text-sm leading-6 [&_a]:font-black [&_a]:text-[#205089] [&_p]:min-w-0 [&_code]:block [&_code]:break-words [&_code]:rounded-lg [&_code]:bg-[#0B1220] [&_code]:px-3 [&_code]:py-2 [&_code]:text-xs [&_code]:text-[#E5EEF8]', themeClasses.bodyText)}>{children}</div>
      </div>
    </section>
  );
}

type CourseCardItem = {
  title: string;
  example: string;
  takeaway: string;
  visual?: 'gradient-update' | 'embedding-clusters';
};

function CourseCardVisual({ visual, isLight }: {
  visual: NonNullable<CourseCardItem['visual']>;
  isLight: boolean;
}) {
  const palette = visual === 'gradient-update'
    ? (isLight
        ? 'border-[#A89CCB]/24 bg-[#F8F6FC] text-[#7466A4]'
        : 'border-[#B9A9E3]/20 bg-[#B9A9E3]/6 text-[#C8BCEF]')
    : (isLight
        ? 'border-[#68AAA2]/24 bg-[#F2FAF8] text-[#2D7E75]'
        : 'border-[#79C5BB]/20 bg-[#79C5BB]/6 text-[#9EDDD5]');

  return (
    <div className={cx('grid h-20 place-items-center border-b', palette)} aria-hidden="true">
      {visual === 'gradient-update' ? (
        <svg viewBox="0 0 112 56" className="h-14 w-28" fill="none" aria-hidden="true">
          <circle cx="38" cy="42" r="3.5" fill="currentColor" />
          <path d="M38 42 75 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.38" />
          <path d="m69 13 7-1-2 7" fill="currentColor" opacity="0.38" />
          <path d="M38 42h49" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <path d="m82 37 7 5-7 5" fill="currentColor" />
          <path d="M75 13v29" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 4" opacity="0.45" />
          <path d="M69 36v6h6" stroke="currentColor" strokeWidth="1.4" opacity="0.65" />
        </svg>
      ) : (
        <svg viewBox="0 0 112 56" className="h-14 w-28" fill="none" aria-hidden="true">
          <ellipse cx="34" cy="28" rx="22" ry="18" stroke="currentColor" strokeWidth="1.4" opacity="0.22" />
          <ellipse cx="79" cy="28" rx="21" ry="18" stroke="currentColor" strokeWidth="1.4" opacity="0.22" />
          <g fill="currentColor">
            <circle cx="24" cy="22" r="3.5" />
            <circle cx="38" cy="18" r="3.5" opacity="0.72" />
            <circle cx="31" cy="34" r="3.5" opacity="0.82" />
            <circle cx="44" cy="31" r="3.5" opacity="0.55" />
            <circle cx="70" cy="20" r="3.5" opacity="0.58" />
            <circle cx="84" cy="18" r="3.5" />
            <circle cx="74" cy="34" r="3.5" opacity="0.78" />
            <circle cx="89" cy="32" r="3.5" opacity="0.68" />
          </g>
        </svg>
      )}
    </div>
  );
}

export function CourseCards({ ariaLabel, exampleLabel = '', takeawayLabel = '', items, spotlight = false, singleColumn = false, threeColumns = false, featureFirst = false, numbered = true }: {
  ariaLabel: string;
  exampleLabel?: string;
  takeawayLabel?: string;
  items: CourseCardItem[];
  spotlight?: boolean;
  singleColumn?: boolean;
  threeColumns?: boolean;
  featureFirst?: boolean;
  numbered?: boolean;
}) {
  const themeClasses = useLearningMdxTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const border = themeClasses.isLight ? 'border-[#205089]/14' : 'border-[#A8B8C8]/18';
  const titleBand = themeClasses.isLight ? 'bg-[#EAF2FA]' : 'bg-[#A8D4FF]/9';
  return (
    <ol className={cx('my-6 grid gap-3', !singleColumn && 'sm:grid-cols-2', threeColumns && 'lg:grid-cols-3')} aria-label={ariaLabel} onMouseLeave={spotlight ? () => setActiveIndex(0) : undefined}>
      {items.map((item, index) => {
        const isPositive = featureFirst && index === 0;
        const isRisk = featureFirst && (index === 1 || index === 2);
        const semanticBorder = isPositive
          ? themeClasses.semantic.success.border
          : isRisk
            ? themeClasses.semantic.danger.border
            : border;
        const semanticTitleBand = isPositive
          ? (themeClasses.isLight ? 'bg-emerald-100/80' : 'bg-emerald-950/60')
          : isRisk
            ? (themeClasses.isLight ? 'bg-rose-100/80' : 'bg-rose-950/60')
            : titleBand;
        return (
          <li
            key={item.title}
            onMouseEnter={spotlight ? () => setActiveIndex(index) : undefined}
            className={cx(
              'grid h-full overflow-hidden rounded-xl border transition-[opacity,transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(25,55,85,0.12)] motion-reduce:transform-none',
              item.visual ? 'grid-rows-[auto_auto_1fr]' : 'grid-rows-[auto_1fr]',
              featureFirst && index === 0 && 'sm:row-span-2',
              featureFirst && index === items.length - 1 && 'sm:col-span-2',
              spotlight && (activeIndex === index ? 'opacity-100' : 'opacity-45'),
              semanticBorder,
            )}
          >
            <div className={cx('grid min-h-20 items-center gap-3 border-b px-4 py-3', numbered ? 'grid-cols-[2rem_1fr]' : 'grid-cols-1', semanticBorder, semanticTitleBand)}>
              {numbered && <span className="grid size-8 place-items-center rounded-full bg-[#205089] text-sm font-black text-white">{index + 1}</span>}
              <h3 className={cx('text-base font-black leading-6 text-balance', themeClasses.titleText)}>{item.title}</h3>
            </div>
            {item.visual ? <CourseCardVisual visual={item.visual} isLight={themeClasses.isLight} /> : null}
            <dl className="grid content-start gap-4 p-4 text-sm leading-6">
              {item.example ? (
                <div>
                  {exampleLabel ? <dt className={cx('font-black', themeClasses.titleText)}>{exampleLabel}</dt> : null}
                  <dd className={cx(exampleLabel && 'mt-1', themeClasses.bodyText)}>{item.example}</dd>
                </div>
              ) : null}
              {item.takeaway ? (
                <div>
                  {takeawayLabel ? <dt className={cx('font-black', themeClasses.titleText)}>{takeawayLabel}</dt> : null}
                  <dd className={cx(takeawayLabel && 'mt-1', themeClasses.bodyText)}>{item.takeaway}</dd>
                </div>
              ) : null}
            </dl>
          </li>
        );
      })}
    </ol>
  );
}

type EvidenceCardItem = {
  eyebrow: string;
  value: string;
  label: string;
  insight: string;
  takeaway?: string;
  tone?: LearningSemanticTone;
};

export function EvidenceCards({ ariaLabel, insightLabel, items, singleColumn = false }: { ariaLabel: string; insightLabel?: string; items: EvidenceCardItem[]; singleColumn?: boolean }) {
  const themeClasses = useLearningMdxTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const border = themeClasses.isLight ? 'border-[#205089]/14' : 'border-[#A8B8C8]/18';
  const surface = themeClasses.isLight ? 'bg-[#F8FAFC]' : 'bg-[#121A24]/42';
  return (
    <ol className={cx('my-6 grid gap-3', !singleColumn && 'sm:grid-cols-2')} aria-label={ariaLabel} onMouseLeave={() => setActiveIndex(0)}>
      {items.map((item, index) => {
        const toneStyle = themeClasses.semantic[item.tone ?? 'primary'] ?? themeClasses.semantic.primary;
        const barColor = toneStyle.indicator;
        const valueColor = toneStyle.strongText;
        return (
          <li
            key={`${item.eyebrow}-${item.value}`}
            onMouseEnter={() => setActiveIndex(index)}
            className={cx(
              'relative overflow-hidden rounded-xl border transition-[opacity,transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(25,55,85,0.12)] motion-reduce:transform-none',
              activeIndex === index ? 'opacity-100' : 'opacity-45',
              border,
              surface,
            )}
          >
            <span className={cx('absolute inset-y-0 left-0 w-1', barColor)} aria-hidden="true" />
            <div className="grid h-full content-start px-5 py-4 pl-6">
              <p className={cx('text-[0.68rem] font-black uppercase tracking-[0.14em]', themeClasses.mutedText)}>{item.eyebrow}</p>
              <strong className={cx('mt-2 block text-[1.75rem] font-black leading-tight tracking-[-0.035em] tabular-nums sm:text-[1.9rem]', valueColor)}>{item.value}</strong>
              <p className={cx('mt-1 text-sm font-bold leading-5', themeClasses.titleText)}>{item.label}</p>
              <div className={cx('mt-4 border-t pt-3 text-sm leading-6', border, themeClasses.bodyText)}>
                <p>
                  {insightLabel && <strong className={cx('mr-1.5 font-black', valueColor)}>{insightLabel}</strong>}
                  {item.insight}
                </p>
                {item.takeaway ? (
                  <p className="mt-2.5">
                    <strong className={cx('mr-1.5 font-black', valueColor)}>Bài học rút ra:</strong>
                    {item.takeaway}
                  </p>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function LessonNote({
  children,
  tone = 'default',
}: {
  children?: ReactNode;
  tone?: 'default' | 'warning' | 'tip' | 'info' | 'success';
}) {
  const themeClasses = useLearningMdxTheme();
  const isWarning = tone === 'warning';
  const isSuccess = tone === 'success';

  const toneClasses = isWarning
    ? cx(themeClasses.semantic.warning.border, themeClasses.semantic.warning.surface)
    : isSuccess
      ? cx(themeClasses.semantic.success.border, themeClasses.semantic.success.surface)
      : cx(
        themeClasses.isLight ? 'border-[#2F6B55]/18 bg-[#F1F8F4]' : 'border-[#A8D4FF]/25 bg-[#A8D4FF]/10',
      );

  return (
    <div
      className={cx(
        'mt-5 grid rounded-lg border px-4 py-3 text-sm leading-6 font-normal',
        themeClasses.bodyText,
        '[&_p]:!text-inherit [&_li]:!text-inherit [&_ol]:grid [&_ol]:list-decimal [&_ol]:gap-2 [&_ol]:pl-5 [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-2 [&_ul]:pl-5',
        toneClasses,
      )}
    >
      {children}
    </div>
  );
}

// Auto-glob all lesson image assets in src/assets/learning/
const LESSON_IMAGE_LOADERS = import.meta.glob('../../assets/learning/**/*.{png,jpg,jpeg,webp,svg}', {
  import: 'default',
  query: '?url',
}) as Record<string, () => Promise<string>>;

export function LessonImage({
  assetPath,
  alt,
  caption,
  aspectRatio = '16 / 9',
}: {
  assetPath: string;
  alt: string;
  caption?: string;
  aspectRatio?: string;
}) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  const strings = getStrings(language).learningLab;
  const normalizedPath = assetPath.replace(/^\/+/, '');
  const [loadState, setLoadState] = useState<{ key: string; status: 'loading' | 'success' | 'error'; src?: string } | null>(null);
  const [retryVersion, setRetryVersion] = useState(0);
  const loadImage = Object.entries(LESSON_IMAGE_LOADERS)
    .find(([modulePath]) => modulePath.endsWith(`/assets/learning/${normalizedPath}`))?.[1];
  const requestKey = `${normalizedPath}/${retryVersion}`;

  useEffect(() => {
    if (!loadImage) {
      setLoadState({ key: requestKey, status: 'error' });
      return;
    }
    let isActive = true;
    setLoadState({ key: requestKey, status: 'loading' });
    void loadImage()
      .then((imageUrl) => {
        if (isActive) setLoadState({ key: requestKey, status: 'success', src: imageUrl });
      })
      .catch((error: unknown) => {
        console.error(`Learning Lab image failed to load: ${normalizedPath}`, error);
        if (isActive) setLoadState({ key: requestKey, status: 'error' });
      });
    return () => {
      isActive = false;
    };
  }, [loadImage, normalizedPath, requestKey]);

  const currentState = loadState?.key === requestKey ? loadState : null;
  if (!currentState || currentState.status === 'loading') {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label={alt}
        className={cx(
          'my-6 w-full animate-pulse rounded-lg motion-reduce:animate-none',
          themeClasses.isLight ? 'bg-[#B8C8DA]/45' : 'bg-[#A8B8C8]/12',
        )}
        style={{ aspectRatio }}
      />
    );
  }
  if (currentState.status === 'error') {
    return (
      <div
        role="alert"
        aria-label={alt}
        className={cx('my-6 grid w-full place-content-center justify-items-center gap-3 rounded-lg border p-5 text-center', themeClasses.surface.unavailable, themeClasses.mutedText)}
        style={{ aspectRatio }}
      >
        <p className="text-sm font-bold">{strings.imageLoadError}</p>
        {loadImage ? (
          <button type="button" onClick={() => setRetryVersion((current) => current + 1)} className={cx('min-h-10 px-4 text-xs font-black', themeClasses.radius.button, themeClasses.button.secondary, themeClasses.focusRing)}>
            {strings.retry}
          </button>
        ) : null}
      </div>
    );
  }
  return (
    <figure className="my-6 grid justify-items-center gap-2">
      <div
        className="w-full overflow-hidden rounded-xl border shadow-sm"
        style={{
          borderColor: themeClasses.isLight ? 'rgba(32,80,137,0.12)' : 'rgba(168,212,255,0.14)',
          aspectRatio,
        }}
      >
        <img
          src={currentState.src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="block h-full w-full object-contain"
        />
      </div>
      {caption && (
        <figcaption className={cx('text-center text-sm leading-5', themeClasses.mutedText)}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

type ConceptVisual =
    | 'database'
    | 'two-term-loss'
    | 'neural-network'
    | 'solution'
    | 'space'
    | 'objective'
    | 'constraints'
    | 'first-order'
    | 'second-order'
    | 'zero-order'
    | 'evaluation'
    | 'selection'
    | 'crossover'
    | 'mutation'
    | 'population'
    | 'fitness-score'
    | 'selective-inheritance'
    | 'encoding'
    | 'evolution-strategy'
    | 'quality-diversity'
    | 'combinatorial'
    | 'optimization-landscape'
    | 'genetic-algorithm'
    | 'genetic-programming'
    | 'dna'
    | 'binary-vector'
    | 'feasible-decode'
    | 'decode'
    | 'real-vector'
    | 'permutation'
    | 'tree-graph';

type ConceptFlowItem = {
  title: string;
  detail?: string;
  formula?: string;
  math?: string;
  visual?: ConceptVisual;
  tone?: 'blue' | 'amber' | 'teal' | 'violet' | 'neutral';
};

export function ConceptFlow({ ariaLabel, items }: { ariaLabel: string; items: ConceptFlowItem[] }) {
  const themeClasses = useLearningMdxTheme();
  return (
    <figure className="my-6 min-w-0 max-w-full" aria-label={ariaLabel}>
      <ol className="flex w-full list-none items-stretch gap-3 overflow-x-auto !pl-0 pb-1 sm:gap-4">
        {items.map((item, index) => {
          const cleanTitle = item.title.replace(/^\d+[.:-]\s*/, '');
          const formula = item.formula ?? item.math;
          return (
            <li
              key={`${item.title}-${index}`}
              className={cx(
                'flex min-w-[10.5rem] flex-1 basis-0 flex-col rounded-lg border p-4 shadow-xs transition-colors',
                themeClasses.isLight
                  ? 'border-[#B8C8DA]/85 bg-white hover:border-[#205089]/60'
                  : 'border-white/15 bg-white/5 hover:border-[#A8D4FF]/55',
              )}
            >
              <div className="mb-2.5 flex items-center justify-between">
                <span className={cx(
                  'inline-flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-xs',
                  themeClasses.isLight ? 'bg-[#205089] text-white' : 'bg-[#A8D4FF] text-[#0B1726]',
                )}>
                  {index + 1}
                </span>
              </div>
              {item.visual ? (
                <div className="mb-2 flex items-center justify-center">
                  <ConceptHierarchyVisual
                    visual={item.visual}
                    tone={item.tone ?? 'blue'}
                    isLight={themeClasses.isLight}
                  />
                </div>
              ) : null}
              <strong className={cx('block text-sm font-bold leading-snug sm:text-base', themeClasses.titleText)}>
                {renderContentWithMath(cleanTitle)}
              </strong>
              {item.detail ? (
                <p className={cx('mt-2.5 whitespace-pre-line text-xs leading-relaxed sm:text-sm', themeClasses.bodyText)}>
                  {renderContentWithMath(item.detail)}
                </p>
              ) : null}
              {formula ? (
                <div className={cx(
                  'mt-auto border-t pt-4 text-center text-base font-semibold sm:text-lg',
                  themeClasses.isLight ? 'border-[#B8C8DA]/40 text-[#0F172A]' : 'border-white/15 text-white',
                )}>
                  <InlineMath formula={formula.replace(/^\$+|\$+$/g, '')} />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

type ConceptHierarchyDeepConnection = {
  parents: number[];
  children: ConceptHierarchyNode[];
};

type ConceptHierarchyNode = {
  title: ReactNode;
  detail?: ReactNode;
  problem?: ReactNode;
  example?: ReactNode;
  examplePrefix?: string;
  tone?: 'blue' | 'amber' | 'teal' | 'violet' | 'neutral';
  visual?: ConceptVisual;
  muted?: boolean;
  align?: 'left' | 'center';
  children?: ConceptHierarchyNode[];
  nodes?: ConceptHierarchyNode[];
  deepConnections?: ConceptHierarchyDeepConnection[];
};

function ConceptHierarchyVisual({ visual, tone, isLight }: {
  visual: NonNullable<ConceptHierarchyNode['visual']>;
  tone: NonNullable<ConceptHierarchyNode['tone']>;
  isLight: boolean;
}) {
  const visualTones = isLight ? {
    blue: 'text-[#3F7DB1]',
    amber: 'text-[#A0752B]',
    teal: 'text-[#2D7E75]',
    violet: 'text-[#7466A4]',
    neutral: 'text-[#52677F]',
  } : {
    blue: 'text-[#9BCDF2]',
    amber: 'text-[#F2CA7B]',
    teal: 'text-[#9EDDD5]',
    violet: 'text-[#C8BCEF]',
    neutral: 'text-[#B8C8DA]',
  };
  const termSurface = isLight ? 'border-current/22 bg-white/70' : 'border-current/25 bg-white/5';
  const formulas: Partial<Record<NonNullable<ConceptHierarchyNode['visual']>, string>> = {
    solution: '\\boldsymbol{\\theta}',
    space: '\\Omega = \\{\\theta\\}',
    objective: 'f(\\theta)',
    constraints: 'g_i(\\theta) \\le 0',
    'first-order': '\\nabla f(\\theta)',
    'second-order': '\\mathbf H = \\begin{bmatrix} f_{11} & f_{12} \\\\ f_{21} & f_{22} \\end{bmatrix}',
    'zero-order': '\\theta \\mapsto f(\\theta)',
    evaluation: 'x_i \\mapsto f(x_i)',
    crossover: '10|11 + 01|00 \\rightarrow 10|00',
    mutation: '1010 \\rightarrow 1110',
    'binary-vector': '\\mathbf g \\in \\{0,1\\}^{D}',
    'feasible-decode': '\\operatorname{decode}(g) \\in \\Omega',
    decode: 'g \\xrightarrow{\\text{decode}} x',
    'real-vector': '\\mathbf{x} \\in \\mathbb{R}^{D}',
    permutation: '\\pi = [3,1,4,2]',
  };
  const icons: Partial<Record<NonNullable<ConceptHierarchyNode['visual']>, LucideIcon>> = {
    dna: Dna,
    'tree-graph': GitFork,
  };
  const formula = formulas[visual];
  const Icon = icons[visual];

  return (
    <div className={cx('grid min-h-16 place-items-center', visualTones[tone])} aria-hidden="true">
      {visual === 'database' ? <DatabaseBackup className="size-10" strokeWidth={1.65} /> : null}
      {visual === 'two-term-loss' ? (
        <div className="flex items-center justify-center gap-2 font-mono text-xs font-bold">
          <span className={cx('rounded-md border px-2.5 py-1.5', termSurface)}>
            <InlineMath formula="L_{\mathrm{new}}" />
          </span>
          <span className="text-base font-black">+</span>
          <span className={cx('rounded-md border px-2.5 py-1.5', termSurface)}>
            <InlineMath formula="\lambda L_{\mathrm{keep}}" />
          </span>
        </div>
      ) : null}
      {visual === 'neural-network' ? (
        <svg viewBox="0 0 104 56" className="h-14 w-24" fill="none" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="1.4" opacity="0.35">
            {[14, 42].flatMap((inputY) => [8, 28, 48].map((hiddenY) => (
              <line key={`in-${inputY}-${hiddenY}`} x1="12" y1={inputY} x2="52" y2={hiddenY} />
            )))}
            {[8, 28, 48].flatMap((hiddenY) => [18, 38].map((outputY) => (
              <line key={`out-${hiddenY}-${outputY}`} x1="52" y1={hiddenY} x2="92" y2={outputY} />
            )))}
          </g>
          <g fill="currentColor">
            <circle cx="12" cy="14" r="4" />
            <circle cx="12" cy="42" r="4" />
            <circle cx="52" cy="8" r="4" />
            <circle cx="52" cy="28" r="4" />
            <circle cx="52" cy="48" r="4" />
            <circle cx="92" cy="18" r="4" />
            <circle cx="92" cy="38" r="4" />
          </g>
        </svg>
      ) : null}
      {visual === 'selection' ? (
        <div className="flex items-center gap-1.5">
          <span className={cx('rounded-md border px-2 py-1 text-xs font-bold opacity-45', termSurface)}>0.31</span>
          <span className={cx('rounded-md border px-2 py-1 text-xs font-bold', termSurface)}>0.92</span>
          <ListFilter className="ml-0.5 size-5" strokeWidth={1.8} />
        </div>
      ) : null}
      {isSemanticConceptVisual(visual) ? <SemanticConceptSvg visual={visual} /> : null}
      {formula ? (
        <div
          className={cx(
            'max-w-full px-1 text-center font-semibold whitespace-nowrap [&_.katex]:whitespace-nowrap [&_.katex-html]:whitespace-nowrap',
            visual === 'second-order' ? 'text-sm sm:text-base' : visual === 'crossover' ? 'text-xs sm:text-sm' : 'text-base sm:text-lg',
          )}
        >
          <InlineMath formula={formula} />
        </div>
      ) : null}
      {Icon ? <Icon className="size-10" strokeWidth={1.65} /> : null}
    </div>
  );
}

type ConceptHierarchyDensity = 'default' | 'compact';
type ConceptHierarchyTone = NonNullable<ConceptHierarchyNode['tone']>;
type ConceptHierarchyToneClasses = Record<ConceptHierarchyTone, string>;

type SemanticConceptVisual = Extract<ConceptVisual,
  | 'population'
  | 'fitness-score'
  | 'selective-inheritance'
  | 'encoding'
  | 'evolution-strategy'
  | 'quality-diversity'
  | 'combinatorial'
  | 'optimization-landscape'
  | 'genetic-algorithm'
  | 'genetic-programming'
>;

const SEMANTIC_CONCEPT_VISUALS = new Set<ConceptVisual>([
  'population',
  'fitness-score',
  'selective-inheritance',
  'encoding',
  'evolution-strategy',
  'quality-diversity',
  'combinatorial',
  'optimization-landscape',
  'genetic-algorithm',
  'genetic-programming',
]);

function isSemanticConceptVisual(visual: ConceptVisual): visual is SemanticConceptVisual {
  return SEMANTIC_CONCEPT_VISUALS.has(visual);
}

function SemanticConceptSvg({ visual }: { visual: SemanticConceptVisual }) {
  const svgClass = 'h-16 w-28 overflow-visible';

  if (visual === 'population') {
    return (
      <svg viewBox="0 0 112 64" className={svgClass} fill="none" aria-hidden="true">
        <ellipse cx="56" cy="32" rx="45" ry="24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.28" />
        <g fill="currentColor" stroke="white" strokeWidth="2">
          <circle cx="25" cy="23" r="5" opacity="0.48" />
          <circle cx="44" cy="16" r="4" opacity="0.72" />
          <circle cx="68" cy="20" r="6" opacity="0.9" />
          <circle cx="88" cy="27" r="4.5" opacity="0.58" />
          <circle cx="31" cy="43" r="6" opacity="0.82" />
          <circle cx="54" cy="37" r="4.5" opacity="0.42" />
          <circle cx="76" cy="44" r="5.5" opacity="0.68" />
        </g>
      </svg>
    );
  }

  if (visual === 'fitness-score') {
    return (
      <svg viewBox="0 0 112 64" className={svgClass} fill="none" aria-hidden="true">
        <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <circle cx="18" cy="14" r="5" fill="currentColor" opacity="0.38" />
          <circle cx="18" cy="32" r="5" fill="currentColor" opacity="0.62" />
          <circle cx="18" cy="50" r="5" fill="currentColor" opacity="0.9" />
          <path d="M29 14H51M29 32H70M29 50H91" opacity="0.3" />
          <path d="M45 11V17M64 29V35M85 47V53" />
          <path d="m94 46 3 3 6-7" strokeWidth="2.4" />
        </g>
      </svg>
    );
  }

  if (visual === 'selective-inheritance') {
    return (
      <svg viewBox="0 0 112 64" className={svgClass} fill="none" aria-hidden="true">
        <g fill="currentColor">
          <circle cx="22" cy="11" r="4" opacity="0.25" />
          <circle cx="39" cy="11" r="4" opacity="0.75" />
          <circle cx="56" cy="11" r="4" opacity="0.3" />
          <circle cx="73" cy="11" r="4" opacity="0.9" />
          <circle cx="90" cy="11" r="4" opacity="0.42" />
        </g>
        <path d="M23 21H89L67 39V46H45V39L23 21Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" opacity="0.75" />
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M40 55h8m4 0h8m4 0h8" opacity="0.72" />
          <path d="M40 60h8m4 0h8m4 0h8" opacity="0.38" />
        </g>
      </svg>
    );
  }

  if (visual === 'encoding') {
    return (
      <svg viewBox="0 0 112 64" className={svgClass} fill="none" aria-hidden="true">
        <g stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <rect x="5" y="13" width="16" height="10" rx="2" opacity="0.4" />
          <rect x="5" y="27" width="22" height="10" rx="2" opacity="0.75" />
          <rect x="5" y="41" width="13" height="10" rx="2" opacity="0.55" />
          <path d="M31 32h9m-3-3 3 3-3 3" />
          {[0, 1, 2, 3].map((index) => (
            <rect key={index} x={46 + index * 11} y="25" width="8" height="14" rx="1.5" fill="currentColor" opacity={index === 0 || index === 2 ? 0.82 : 0.12} />
          ))}
          <path d="M91 32h8m-3-3 3 3-3 3" />
          <rect x="103" y="20" width="5" height="10" rx="1" fill="currentColor" opacity="0.82" />
          <rect x="103" y="34" width="5" height="10" rx="1" fill="currentColor" opacity="0.82" />
        </g>
      </svg>
    );
  }

  if (visual === 'evolution-strategy') {
    return (
      <svg viewBox="0 0 112 64" className={svgClass} fill="none" aria-hidden="true">
        <ellipse cx="48" cy="34" rx="32" ry="20" transform="rotate(-15 48 34)" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.35" />
        <g fill="currentColor">
          <circle cx="25" cy="40" r="3" opacity="0.35" />
          <circle cx="35" cy="24" r="3.5" opacity="0.5" />
          <circle cx="46" cy="45" r="3" opacity="0.55" />
          <circle cx="58" cy="18" r="3" opacity="0.68" />
          <circle cx="67" cy="35" r="4" opacity="0.82" />
          <circle cx="48" cy="34" r="5" />
          <circle cx="86" cy="20" r="5" opacity="0.9" />
        </g>
        <path d="M57 30 78 22m-4-3 4 3-3 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (visual === 'quality-diversity') {
    const cells = [0.18, 0.72, 0.32, 0.88, 0.46, 0.58, 0.9, 0.24, 0.66, 0.38, 0.8, 0.52];
    return (
      <svg viewBox="0 0 112 64" className={svgClass} fill="none" aria-hidden="true">
        <g stroke="currentColor" strokeWidth="1.2">
          {cells.map((opacity, index) => {
            const column = index % 4;
            const row = Math.floor(index / 4);
            return (
              <rect
                key={index}
                x={22 + column * 18}
                y={7 + row * 17}
                width="14"
                height="13"
                rx="2"
                fill="currentColor"
                opacity={opacity}
              />
            );
          })}
        </g>
        <path d="M20 58H96M20 58V5" stroke="currentColor" strokeWidth="1.4" opacity="0.32" />
      </svg>
    );
  }

  if (visual === 'combinatorial') {
    return (
      <svg viewBox="0 0 112 64" className={svgClass} fill="none" aria-hidden="true">
        <path d="M18 43 35 16 58 24 86 12 94 46 63 52 18 43Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M35 16 63 52M58 24 94 46" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 4" opacity="0.22" />
        <g fill="white" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="43" r="5" />
          <circle cx="35" cy="16" r="5" />
          <circle cx="58" cy="24" r="5" />
          <circle cx="86" cy="12" r="5" />
          <circle cx="94" cy="46" r="5" />
          <circle cx="63" cy="52" r="5" />
        </g>
      </svg>
    );
  }

  if (visual === 'optimization-landscape') {
    return (
      <svg viewBox="0 0 112 64" className={svgClass} fill="none" aria-hidden="true">
        <path d="M7 16C21 16 24 49 39 49S55 23 68 23s15 25 37 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <g fill="currentColor">
          <circle cx="21" cy="27" r="3.5" opacity="0.42" />
          <circle cx="39" cy="49" r="4.5" />
          <circle cx="68" cy="23" r="3.5" opacity="0.65" />
          <circle cx="91" cy="42" r="3.5" opacity="0.32" />
        </g>
        <path d="M39 9v28m-4-4 4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.72" />
      </svg>
    );
  }

  if (visual === 'genetic-algorithm') {
    const cells = [0, 1, 2, 3, 4, 5];
    return (
      <svg viewBox="0 0 112 64" className={svgClass} fill="none" aria-hidden="true">
        {cells.map((index) => (
          <rect key={`top-${index}`} x={18 + index * 13} y="8" width="9" height="11" rx="1.5" fill="currentColor" opacity={index < 3 ? 0.82 : 0.24} />
        ))}
        {cells.map((index) => (
          <rect key={`middle-${index}`} x={18 + index * 13} y="25" width="9" height="11" rx="1.5" fill="currentColor" opacity={index < 3 ? 0.24 : 0.82} />
        ))}
        <path d="M56 5v34" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.45" />
        <path d="M56 39v7m-3-3 3 3 3-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        {cells.map((index) => (
          <rect key={`bottom-${index}`} x={18 + index * 13} y="50" width="9" height="11" rx="1.5" fill="currentColor" opacity={0.82} />
        ))}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 112 64" className={svgClass} fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d="M24 10v10M24 20 13 32M24 20l11 12M13 32l-7 12M13 32l7 12M35 32l-6 12M35 32l8 12" />
        <circle cx="24" cy="8" r="4" fill="currentColor" />
        <circle cx="13" cy="32" r="3.5" fill="white" />
        <circle cx="35" cy="32" r="3.5" fill="white" />
        <circle cx="6" cy="46" r="3" fill="currentColor" opacity="0.4" />
        <circle cx="20" cy="46" r="3" fill="currentColor" opacity="0.62" />
        <circle cx="29" cy="46" r="3" fill="currentColor" opacity="0.78" />
        <circle cx="43" cy="46" r="3" fill="currentColor" />
        <path d="M61 51C71 46 79 37 88 25c5-7 10-11 18-14" strokeWidth="2" />
      </g>
      <g fill="currentColor">
        <circle cx="65" cy="48" r="3" opacity="0.35" />
        <circle cx="73" cy="40" r="3" opacity="0.5" />
        <circle cx="82" cy="34" r="3" opacity="0.68" />
        <circle cx="91" cy="22" r="3.5" opacity="0.84" />
        <circle cx="103" cy="13" r="4" />
        <circle cx="94" cy="43" r="2.5" opacity="0.2" />
      </g>
    </svg>
  );
}

function conceptHierarchyGridStyle(count: number) {
  return {
    '--concept-hierarchy-columns': Math.max(count, 1),
  } as CSSProperties;
}

function conceptHierarchyRailStyle(count: number) {
  return { marginInline: `${50 / Math.max(count, 1)}%` };
}

function renderContentWithMath(content: ReactNode): ReactNode {
  if (typeof content !== 'string') return content;
  if (!/\$([^$]+)\$|\\\((.+?)\\\)/.test(content)) return content;
  const regex = /(\$([^$]+)\$|\\\((.+?)\\\))/g;

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  content.replace(regex, (match, _p1, math1, math2, offset) => {
    if (offset > lastIndex) {
      parts.push(content.slice(lastIndex, offset));
    }
    const formula = (math1 || math2 || '').trim();
    const html = renderMathToString(formula, { displayMode: false });
    parts.push(
      <span
        key={offset}
        className="inline-block px-0.5 align-baseline text-inherit [&_.katex]:text-inherit [&_.katex-html]:text-inherit"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
    lastIndex = offset + match.length;
    return match;
  });
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }
  return parts;
}

const toneHeaderTints: Record<ConceptHierarchyTone, string> = {
  blue: 'border-b border-[#79A9D1]/30 bg-[#F0F6FB] text-[#1A4B7C]',
  amber: 'border-b border-[#D6AE65]/35 bg-[#FDF8EE] text-[#875C16]',
  teal: 'border-b border-[#68AAA2]/35 bg-[#F0F8F6] text-[#1C685E]',
  violet: 'border-b border-[#A89CCB]/35 bg-[#F5F2FB] text-[#594883]',
  neutral: 'border-b border-[#B8C8DA]/50 bg-[#F8FAFC] text-[#1E293B]',
};

const toneBorderHover: Record<ConceptHierarchyTone, string> = {
  blue: 'hover:border-[#205089]/45 hover:shadow-[0_8px_20px_rgba(32,80,137,0.09)]',
  amber: 'hover:border-[#D6AE65]/80 hover:shadow-[0_8px_20px_rgba(180,126,36,0.09)]',
  teal: 'hover:border-[#68AAA2]/80 hover:shadow-[0_8px_20px_rgba(35,119,108,0.09)]',
  violet: 'hover:border-[#A89CCB]/80 hover:shadow-[0_8px_20px_rgba(102,85,147,0.09)]',
  neutral: 'hover:border-[#205089]/35 hover:shadow-[0_8px_20px_rgba(32,80,137,0.07)]',
};

const darkHeaderTints: Record<ConceptHierarchyTone, string> = {
  blue: 'border-b border-[#7FB4E5]/20 bg-[#7FB4E5]/10 text-[#CBE5FF]',
  amber: 'border-b border-[#F0BE62]/20 bg-[#F0BE62]/10 text-[#FFE0A0]',
  teal: 'border-b border-[#79C5BB]/20 bg-[#79C5BB]/10 text-[#BDEBE5]',
  violet: 'border-b border-[#B9A9E3]/20 bg-[#B9A9E3]/10 text-[#DDD3F7]',
  neutral: 'border-b border-[#A8D4FF]/15 bg-[#172232] text-[#F4EFE6]',
};

function ConceptHierarchyNodeCard({
  node,
  fallbackTone,
  level,
  density,
  toneClasses,
  bodyText,
  isLight,
}: {
  node: ConceptHierarchyNode;
  fallbackTone: ConceptHierarchyTone;
  level: 'primary' | 'nested' | 'deep';
  density: ConceptHierarchyDensity;
  toneClasses: ConceptHierarchyToneClasses;
  bodyText: string;
  isLight: boolean;
}) {
  const tone = node.tone ?? fallbackTone;
  const description = node.detail ?? node.problem;
  const compact = density === 'compact';
  const hasContent = Boolean(description || node.visual);

  let mainText: ReactNode = description;
  let exampleText: ReactNode = node.example;
  let examplePrefix = node.examplePrefix ?? 'Ví dụ';

  if (!exampleText && typeof description === 'string') {
    const match = description.match(/^([\s\S]*?)(?:[\.\;]\s*|\n+|(?:^|\s+)(?=(?:Ví dụ|Example|Tiêu biểu)\s*:))(Ví dụ|Example|Tiêu biểu)\s*:\s*([\s\S]+)$/i);
    if (match) {
      const rawMain = match[1].trim();
      mainText = rawMain ? (rawMain.endsWith('.') ? rawMain : rawMain + '.') : '';
      examplePrefix = match[2];
      exampleText = match[3].trim();
    }
  }

  const titleClass = compact
    ? 'text-xs font-bold leading-tight'
    : level === 'primary'
      ? 'text-sm font-bold leading-snug sm:text-base'
      : 'text-sm font-bold leading-5';

  if (!hasContent) {
    const cardClass = compact
      ? level === 'primary'
        ? 'min-h-10 rounded-lg px-2.5 py-1.5 sm:min-h-11 sm:px-3 sm:py-2'
        : level === 'nested'
          ? 'min-h-9 rounded-lg px-2 py-1 sm:min-h-9.5 sm:px-2.5 sm:py-1.5'
          : 'min-h-8.5 rounded-lg px-1.5 py-1'
      : level === 'primary'
        ? 'min-h-[3.25rem] rounded-xl px-3 py-2.5'
        : 'min-h-12 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5';

    return (
      <div className={cx('flex flex-col items-stretch', node.muted && 'opacity-35 grayscale')}>
        <div
          className={cx(
            'flex w-full flex-col items-center justify-center border text-center transition-all duration-200 ease-out hover:-translate-y-0.5',
            cardClass,
            toneClasses[tone],
          )}
        >
          <strong className={titleClass}>{renderContentWithMath(node.title)}</strong>
        </div>
      </div>
    );
  }

  return (
    <div className={cx('flex h-full flex-col items-stretch', node.muted && 'opacity-35 grayscale')}>
      <div
        className={cx(
          'group flex h-full w-full flex-col overflow-hidden rounded-xl border border-[#B8C8DA]/70 bg-white shadow-[0_2px_8px_rgba(32,80,137,0.04)] transition-all duration-200 ease-out hover:-translate-y-0.5',
          isLight ? toneBorderHover[tone] : 'hover:border-[#A8D4FF]/40',
        )}
      >
        <div
          className={cx(
            'flex w-full items-center px-3.5 py-2.5 transition-colors',
            node.align === 'center' ? 'justify-center text-center' : 'justify-start text-left',
            isLight ? toneHeaderTints[tone] : darkHeaderTints[tone],
          )}
        >
          <strong className={cx(titleClass, 'tracking-tight')}>{renderContentWithMath(node.title)}</strong>
        </div>

        <div className={cx('flex flex-1 flex-col justify-start', compact ? 'p-3' : 'p-3.5 sm:p-4')}>
          {node.visual ? (
            <div className="my-1.5 flex items-center justify-center py-1 transition-transform duration-200 group-hover:scale-[1.03]">
              <ConceptHierarchyVisual visual={node.visual} tone={tone} isLight={isLight} />
            </div>
          ) : null}

          {mainText ? (
            <p
              className={cx(
                compact ? 'text-xs leading-relaxed' : 'text-xs sm:text-sm leading-relaxed',
                'text-pretty mb-2',
                node.align === 'center' ? 'text-center' : 'text-left',
                bodyText,
              )}
            >
              {renderContentWithMath(mainText)}
            </p>
          ) : null}

          {exampleText ? (
            <div className="mt-auto pt-2.5 border-t border-[#B8C8DA]/45 text-xs sm:text-sm leading-relaxed text-[#475569]">
              <span className="font-bold text-[#1E293B]">{examplePrefix}:</span>{' '}
              {renderContentWithMath(exampleText)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ConceptHierarchyConnections({
  connections,
  parentCount,
  fallbackTone,
  density,
  connector,
  toneClasses,
  bodyText,
  isLight,
}: {
  connections?: ConceptHierarchyDeepConnection[];
  parentCount: number;
  fallbackTone: ConceptHierarchyTone;
  density: ConceptHierarchyDensity;
  connector: string;
  toneClasses: ConceptHierarchyToneClasses;
  bodyText: string;
  isLight: boolean;
}) {
  if (!connections?.length || parentCount < 1) return null;

  return connections.map((connection, connectionIndex) => {
    const parents = [...new Set(connection.parents)]
      .filter((index) => Number.isInteger(index) && index >= 0 && index < parentCount)
      .sort((left, right) => left - right);
    if (!parents.length || !connection.children.length) return null;

    const firstCenter = (((parents[0] ?? 0) + 0.5) / parentCount) * 100;
    const lastCenter = (((parents[parents.length - 1] ?? parents[0] ?? 0) + 0.5) / parentCount) * 100;
    const midpoint = (firstCenter + lastCenter) / 2;

    return (
      <div key={connectionIndex} className={cx('relative w-full', density === 'compact' ? 'mt-2' : 'mt-3')}>
        {parents.map((parentIndex) => (
          <span
            key={parentIndex}
            className={cx('absolute -top-2 hidden w-px sm:block', density === 'compact' ? 'h-3.5' : 'h-5', connector)}
            style={{
              left: `${((parentIndex + 0.5) / parentCount) * 100}%`,
              transform: 'translateX(-50%)',
            }}
            aria-hidden="true"
          />
        ))}
        <span
          className={cx('absolute hidden h-px sm:block', density === 'compact' ? 'top-1.5' : 'top-2.5', connector)}
          style={{ left: `${firstCenter}%`, width: `${lastCenter - firstCenter}%` }}
          aria-hidden="true"
        />
        <span
          className={cx('absolute hidden w-px sm:block', density === 'compact' ? 'top-1.5 h-3.5' : 'top-2.5 h-5', connector)}
          style={{ left: `${midpoint}%`, transform: 'translateX(-50%)' }}
          aria-hidden="true"
        />
        <div className={density === 'compact' ? 'pt-5' : 'pt-7'}>
          <span className={cx('mx-auto block w-px sm:hidden', density === 'compact' ? 'h-2.5' : 'h-5', connector)} aria-hidden="true" />
          <span className={cx('hidden h-px sm:block', connector)} style={conceptHierarchyRailStyle(connection.children.length)} aria-hidden="true" />
          <ul
            className="m-0 grid list-none gap-0 p-0 sm:grid-cols-[repeat(var(--concept-hierarchy-columns),minmax(0,1fr))]"
            style={conceptHierarchyGridStyle(connection.children.length)}
          >
            {connection.children.map((child, childIndex) => (
              <li key={childIndex} className={cx('m-0 flex min-w-0 list-none flex-col items-stretch p-0', density === 'compact' ? 'sm:px-1' : 'sm:px-2')}>
                <span className={cx('mx-auto block w-px', density === 'compact' ? 'h-2' : 'h-5', connector)} aria-hidden="true" />
                <ConceptHierarchyNodeCard
                  node={child}
                  fallbackTone={fallbackTone}
                  level="deep"
                  density={density}
                  toneClasses={toneClasses}
                  bodyText={bodyText}
                  isLight={isLight}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  });
}

export function ConceptHierarchy({ ariaLabel, root, children, nodes, connections, density = 'default' }: {
  ariaLabel: string;
  root: ConceptHierarchyNode;
  children?: ConceptHierarchyNode[];
  nodes?: ConceptHierarchyNode[];
  connections?: ConceptHierarchyDeepConnection[];
  density?: ConceptHierarchyDensity;
}) {
  const themeClasses = useLearningMdxTheme();
  const childNodes = children ?? nodes ?? [];
  const compact = density === 'compact';
  const connector = themeClasses.isLight ? 'bg-[#205089]/28' : 'bg-[#A8D4FF]/28';
  const rootSurface = themeClasses.isLight
    ? cx('border-[#205089] bg-[#205089] text-white', compact ? 'shadow-[0_4px_12px_rgba(32,80,137,0.15)]' : 'shadow-[0_10px_24px_rgba(32,80,137,0.18)]')
    : cx('border-[#A8D4FF] bg-[#A8D4FF] text-[#0B1726]', compact ? 'shadow-[0_4px_12px_rgba(0,0,0,0.2)]' : 'shadow-[0_10px_24px_rgba(0,0,0,0.24)]');
  const darkShadow = compact ? 'shadow-[0_4px_12px_rgba(0,0,0,0.15)]' : 'shadow-[0_10px_24px_rgba(0,0,0,0.18)]';
  const childNodeTones: ConceptHierarchyToneClasses = themeClasses.isLight ? {
    blue: cx('border-[#79A9D1]/60 bg-[#EAF4FB] text-[#1F5C88]', compact ? 'shadow-[0_2px_8px_rgba(63,125,177,0.06)]' : 'shadow-[0_8px_18px_rgba(63,125,177,0.08)]'),
    amber: cx('border-[#D6AE65]/65 bg-[#FFF8E8] text-[#805B1D]', compact ? 'shadow-[0_2px_8px_rgba(160,117,43,0.06)]' : 'shadow-[0_8px_18px_rgba(160,117,43,0.08)]'),
    teal: cx('border-[#68AAA2]/60 bg-[#ECF8F6] text-[#216B63]', compact ? 'shadow-[0_2px_8px_rgba(45,126,117,0.06)]' : 'shadow-[0_8px_18px_rgba(45,126,117,0.08)]'),
    violet: cx('border-[#A89CCB]/60 bg-[#F4F1FB] text-[#62558B]', compact ? 'shadow-[0_2px_8px_rgba(98,85,139,0.06)]' : 'shadow-[0_8px_18px_rgba(98,85,139,0.08)]'),
    neutral: cx('border-[#205089]/16 bg-[#F5F8FC] text-[#172A43]', compact ? 'shadow-[0_2px_8px_rgba(32,80,137,0.05)]' : 'shadow-[0_8px_18px_rgba(32,80,137,0.07)]'),
  } : {
    blue: cx('border-[#7FB4E5]/32 bg-[#7FB4E5]/10 text-[#CBE5FF]', darkShadow),
    amber: cx('border-[#F0BE62]/32 bg-[#F0BE62]/10 text-[#FFE0A0]', darkShadow),
    teal: cx('border-[#79C5BB]/32 bg-[#79C5BB]/10 text-[#BDEBE5]', darkShadow),
    violet: cx('border-[#B9A9E3]/32 bg-[#B9A9E3]/10 text-[#DDD3F7]', darkShadow),
    neutral: cx('border-[#A8D4FF]/18 bg-[#172232] text-[#F4EFE6]', darkShadow),
  };
  const nodesWithChildrenCount = childNodes.filter((node) => (node.children?.length ?? 0) > 0 || (node.nodes?.length ?? 0) > 0).length;

  return (
    <figure className={cx('w-full max-w-full overflow-x-auto', compact ? 'my-4' : 'my-6')} aria-label={ariaLabel}>
      <div className="flex justify-center">
        <div className={cx(
          'relative z-10 max-w-full border text-center',
          compact ? 'rounded-lg px-3.5 py-1.5 sm:max-w-xl sm:px-5' : 'rounded-xl px-4 py-3 sm:max-w-3xl sm:px-6',
          rootSurface,
        )}>
          <strong className={cx('block', compact ? 'text-xs font-bold leading-snug sm:text-sm' : 'text-base font-black leading-6')}>{renderContentWithMath(root.title)}</strong>
          {root.detail ? <span className={cx('block text-pretty opacity-85', compact ? 'mt-0.5 text-xs leading-4' : 'mt-1 text-sm leading-5')}>{renderContentWithMath(root.detail)}</span> : null}
        </div>
      </div>

      {childNodes.length ? (
        <>
          <span className={cx('mx-auto block w-px', compact ? 'h-3.5' : 'h-5', connector)} aria-hidden="true" />
          <span className={cx('hidden h-px sm:block', connector)} style={conceptHierarchyRailStyle(childNodes.length)} aria-hidden="true" />
          <ul
            className="m-0 grid list-none gap-0 p-0 sm:grid-cols-[repeat(var(--concept-hierarchy-columns),minmax(0,1fr))]"
            style={conceptHierarchyGridStyle(childNodes.length)}
          >
            {childNodes.map((child, index) => {
              const nestedChildren = child.children ?? child.nodes ?? [];
              const isSingleExpandingNode = !connections?.length && nodesWithChildrenCount === 1;

              return (
                <li key={index} className={cx('m-0 flex min-w-0 list-none flex-col items-stretch p-0', compact ? 'sm:px-1.5' : 'sm:px-2')}>
                  <span className={cx('mx-auto block w-px', compact ? 'h-3' : 'h-5', connector)} aria-hidden="true" />
                  <ConceptHierarchyNodeCard
                    node={child}
                    fallbackTone="neutral"
                    level="primary"
                    density={density}
                    toneClasses={childNodeTones}
                    bodyText={themeClasses.bodyText}
                    isLight={themeClasses.isLight}
                  />

                  {nestedChildren.length ? (
                    <div
                      className={cx('sm:relative', compact ? 'mt-2 sm:mt-2.5' : 'mt-1')}
                      style={isSingleExpandingNode && childNodes.length > 1 ? {
                        width: `${childNodes.length * 100}%`,
                        transform: `translateX(-${(index / childNodes.length) * 100}%)`,
                      } : undefined}
                    >
                      <span
                        className={cx('hidden w-px sm:block', compact ? 'h-3.5' : 'h-5', connector)}
                        style={isSingleExpandingNode && childNodes.length > 1 ? {
                          marginLeft: `${((index + 0.5) / childNodes.length) * 100}%`,
                          transform: 'translateX(-50%)',
                        } : {
                          marginLeft: '50%',
                          transform: 'translateX(-50%)',
                        }}
                        aria-hidden="true"
                      />
                      <span className={cx('hidden h-px sm:block', connector)} style={conceptHierarchyRailStyle(nestedChildren.length)} aria-hidden="true" />
                      <ul
                        className="m-0 grid list-none gap-0 p-0 sm:grid-cols-[repeat(var(--concept-hierarchy-columns),minmax(0,1fr))]"
                        style={conceptHierarchyGridStyle(nestedChildren.length)}
                      >
                        {nestedChildren.map((nestedChild, nestedIndex) => {
                          const deepChildren = nestedChild.children ?? nestedChild.nodes ?? [];

                          return (
                            <li key={nestedIndex} className={cx('m-0 flex min-w-0 list-none flex-col items-stretch p-0', compact ? 'sm:px-1.5' : 'sm:px-2')}>
                              <span className={cx('mx-auto block w-px', compact ? 'h-2.5' : 'h-5', connector)} aria-hidden="true" />
                              <ConceptHierarchyNodeCard
                                node={nestedChild}
                                fallbackTone={child.tone ?? 'neutral'}
                                level="nested"
                                density={density}
                                toneClasses={childNodeTones}
                                bodyText={themeClasses.bodyText}
                                isLight={themeClasses.isLight}
                              />

                              {deepChildren.length ? (
                                <div className={cx('w-full', compact ? 'mt-1' : 'mt-2')}>
                                  <span className={cx('mx-auto block w-px', compact ? 'h-2.5' : 'h-5', connector)} aria-hidden="true" />
                                  <span className={cx('hidden h-px sm:block', connector)} style={conceptHierarchyRailStyle(deepChildren.length)} aria-hidden="true" />
                                  <ul
                                    className="m-0 grid list-none gap-0 p-0 sm:grid-cols-[repeat(var(--concept-hierarchy-columns),minmax(0,1fr))]"
                                    style={conceptHierarchyGridStyle(deepChildren.length)}
                                  >
                                    {deepChildren.map((deepChild, deepIndex) => (
                                      <li key={deepIndex} className={cx('m-0 flex min-w-0 list-none flex-col items-stretch p-0', compact ? 'sm:px-1' : 'sm:px-2')}>
                                        <span className={cx('mx-auto block w-px', compact ? 'h-2' : 'h-5', connector)} aria-hidden="true" />
                                        <ConceptHierarchyNodeCard
                                          node={deepChild}
                                          fallbackTone={nestedChild.tone ?? child.tone ?? 'neutral'}
                                          level="deep"
                                          density={density}
                                          toneClasses={childNodeTones}
                                          bodyText={themeClasses.bodyText}
                                          isLight={themeClasses.isLight}
                                        />
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : null}
                            </li>
                          );
                        })}
                      </ul>

                      <ConceptHierarchyConnections
                        connections={child.deepConnections}
                        parentCount={nestedChildren.length}
                        fallbackTone={child.tone ?? 'neutral'}
                        density={density}
                        connector={connector}
                        toneClasses={childNodeTones}
                        bodyText={themeClasses.bodyText}
                        isLight={themeClasses.isLight}
                      />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>

          <ConceptHierarchyConnections
            connections={connections}
            parentCount={childNodes.length}
            fallbackTone="neutral"
            density={density}
            connector={connector}
            toneClasses={childNodeTones}
            bodyText={themeClasses.bodyText}
            isLight={themeClasses.isLight}
          />
        </>
      ) : null}
    </figure>
  );
}

type ExperimentChecklistItem = {
  title: string;
  action: string;
  check: string;
};

export function ExperimentChecklist({ ariaLabel, items }: {
  ariaLabel: string;
  items: ExperimentChecklistItem[];
}) {
  const themeClasses = useLearningMdxTheme();
  const border = themeClasses.isLight ? 'border-[#205089]/14' : 'border-[#A8B8C8]/18';
  const marker = themeClasses.isLight
    ? 'border-[#205089]/28 bg-[#EAF2FA] text-[#205089]'
    : 'border-[#A8D4FF]/28 bg-[#A8D4FF]/10 text-[#A8D4FF]';
  const label = themeClasses.isLight ? 'text-[#205089]' : 'text-[#A8D4FF]';

  return (
    <ol className={cx('my-6 overflow-hidden rounded-xl border', border)} aria-label={ariaLabel}>
      {items.map((item, index) => (
        <li
          key={`${item.title}-${index}`}
          className={cx(
            'grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3 px-4 py-4 sm:grid-cols-[2.75rem_minmax(9rem,0.55fr)_minmax(0,1.65fr)] sm:gap-4 sm:px-5',
            index > 0 && `border-t ${border}`,
          )}
        >
          <span className={cx('grid size-10 place-items-center rounded-lg border', marker)} aria-hidden="true">
            <Check className="size-5" strokeWidth={2.6} />
          </span>
          <div className="min-w-0 pt-0.5">
            <span className={cx('block text-[0.68rem] font-black uppercase tracking-[0.12em]', label)}>Bước {index + 1}</span>
            <strong className={cx('mt-1 block text-base font-black leading-6 text-balance', themeClasses.titleText)}>{item.title}</strong>
          </div>
          <dl className="col-start-2 grid min-w-0 gap-2 text-sm leading-5 sm:col-start-3 sm:grid-cols-2 sm:gap-4">
            <div>
              <dt className={cx('font-black', label)}>Thực hiện</dt>
              <dd className={cx('mt-0.5 text-pretty', themeClasses.bodyText)}>{item.action}</dd>
            </div>
            <div>
              <dt className={cx('font-black', label)}>Kiểm tra</dt>
              <dd className={cx('mt-0.5 text-pretty', themeClasses.bodyText)}>{item.check}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ol>
  );
}

type SelfCheckListItem = {
  id: string;
  label: string;
  detail?: string;
};

export function SelfCheckList({ ariaLabel, items }: {
  ariaLabel: string;
  items: SelfCheckListItem[];
}) {
  const themeClasses = useLearningMdxTheme();
  const { domainId, lessonId, pageIndex } = useLearningMdxLesson();
  const storageKey = `learning-self-check:${domainId}:${lessonId}:${pageIndex}`;
  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = JSON.parse(window.localStorage.getItem(storageKey) ?? '[]');
      return Array.isArray(stored) ? stored.filter((id): id is string => typeof id === 'string') : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(checkedIds));
    } catch {
      // Keep the checklist usable when browser storage is unavailable.
    }
  }, [checkedIds, storageKey]);

  const checkedCount = items.filter((item) => checkedIds.includes(item.id)).length;
  const checkedSurface = themeClasses.isLight
    ? 'bg-[#EDF8F3]'
    : 'bg-[#7ED7B5]/10';
  const idleSurface = themeClasses.isLight
    ? 'bg-[#F8FAFC]/65 hover:bg-[#F1F6FA]'
    : 'bg-white/[0.025] hover:bg-white/[0.05]';
  const progressColor = themeClasses.isLight ? 'text-[#205089]' : 'text-[#A8D4FF]';

  return (
    <section className="my-6" aria-label={ariaLabel}>
      <div className="mb-2 flex items-center justify-between gap-4 px-1 py-2">
        <strong className={cx('text-sm font-black', themeClasses.titleText)}>Tự kiểm tra</strong>
        <span className={cx('text-xs font-black tabular-nums', progressColor)} aria-live="polite">
          Đã hiểu {checkedCount}/{items.length}
        </span>
      </div>
      <ul className="m-0 grid list-none gap-1.5 p-0">
        {items.map((item) => {
          const isChecked = checkedIds.includes(item.id);
          return (
            <li key={item.id} className="m-0 list-none p-0">
              <label className={cx(
                'flex cursor-pointer items-start gap-3 rounded-lg px-3.5 py-3 transition-colors sm:px-4',
                isChecked ? checkedSurface : idleSurface,
              )}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => setCheckedIds((current) => (
                    current.includes(item.id)
                      ? current.filter((id) => id !== item.id)
                      : [...current, item.id]
                  ))}
                  className="mt-1 size-4 shrink-0 cursor-pointer accent-[#205089]"
                />
                <span className="min-w-0">
                  <strong className={cx('block text-sm font-black leading-6 text-pretty', themeClasses.titleText)}>{item.label}</strong>
                  {item.detail ? <span className={cx('mt-0.5 block text-sm leading-5 text-pretty', themeClasses.bodyText)}>{item.detail}</span> : null}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

type ComparisonMatrixCell = string | string[];
type ComparisonMatrixRow = { label: string; values: ComparisonMatrixCell[]; highlightedColumn?: number };

export function PaperTradeoff({ advantages, limitations, neutralText = false }: {
  advantages: string[];
  limitations: string[];
  neutralText?: boolean;
}) {
  const themeClasses = useLearningMdxTheme();
  return (
    <div className="my-4 grid gap-3 sm:grid-cols-2">
      <section className={cx('rounded-xl border p-4', themeClasses.semantic.success.border, themeClasses.semantic.success.surface)}>
        <h4 className={cx('text-sm font-black', neutralText ? themeClasses.titleText : themeClasses.semantic.success.strongText)}>Ưu điểm</h4>
        <ul className={cx('mt-3 grid list-disc gap-2 pl-5 text-sm leading-6', themeClasses.bodyText)}>
          {advantages.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
      <section className={cx('rounded-xl border p-4', themeClasses.semantic.danger.border, themeClasses.semantic.danger.surface)}>
        <h4 className={cx('text-sm font-black', neutralText ? themeClasses.titleText : themeClasses.semantic.danger.strongText)}>Hạn chế</h4>
        <ul className={cx('mt-3 grid list-disc gap-2 pl-5 text-sm leading-6', themeClasses.bodyText)}>
          {limitations.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
    </div>
  );
}

export function ComparisonMatrix({ ariaLabel, columns, rows, rowHeaderLabel = 'Tiêu chí', compactRowHeader = false }: {
  ariaLabel: string;
  columns: string[];
  rows: ComparisonMatrixRow[];
  rowHeaderLabel?: string;
  compactRowHeader?: boolean;
}) {
  const themeClasses = useLearningMdxTheme();
  const border = themeClasses.isLight ? 'border-[#205089]/14' : 'border-[#A8B8C8]/18';
  return (
    <div className={cx('my-6 overflow-x-auto rounded-xl border', border)}>
      <table className="!my-0 w-full min-w-[36rem] !border-0 border-collapse text-left text-sm leading-5 [&_td]:!border-b-0 [&_th]:!border-b-0">
        <caption className="sr-only">{ariaLabel}</caption>
        <thead className={themeClasses.isLight ? 'bg-[#EFF4FA] text-[#123B68]' : 'bg-[#121A24] text-[#D7EAFE]'}>
          <tr>
            <th scope="col" className={cx('px-4 py-3 font-black', compactRowHeader ? 'w-16 text-center' : 'w-[26%]')}>{rowHeaderLabel}</th>
            {columns.map((column) => <th key={column} scope="col" className="px-4 py-3 font-black">{column}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${row.label}-${rowIndex}`} className={cx('border-t align-top', border)}>
              <th scope="row" className={cx('px-4 py-3 font-black', compactRowHeader && 'text-center tabular-nums', themeClasses.titleText)}>{row.label}</th>
              {columns.map((_, columnIndex) => {
                const value = row.values[columnIndex];
                return (
                  <td
                    key={`${row.label}-${columnIndex}`}
                    className={cx(
                      'px-4 py-3',
                      row.highlightedColumn === columnIndex
                        ? themeClasses.isLight ? 'bg-[#205089]/7 font-semibold text-[#123B68]' : 'bg-[#A8D4FF]/8 font-semibold text-[#D7EAFE]'
                        : themeClasses.bodyText,
                    )}
                  >
                    {Array.isArray(value) ? (
                      <ul className="grid list-disc gap-1.5 pl-4 marker:text-[#205089]">
                        {value.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    ) : value ?? '—'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type DatasetCompositionSegment = {
  label: string;
  value: number;
  valueLabel: string;
  detail?: string;
  tone?: 'primary' | 'accent' | 'neutral';
};

export function DatasetComposition({ ariaLabel, segments, totalLabel }: {
  ariaLabel: string;
  segments: DatasetCompositionSegment[];
  totalLabel: string;
}) {
  const themeClasses = useLearningMdxTheme();
  const total = Math.max(segments.reduce((sum, segment) => sum + Math.max(0, segment.value), 0), 1);
  return (
    <figure className="my-6" aria-label={ariaLabel}>
      <div className={cx('overflow-hidden rounded-xl border p-4', themeClasses.isLight ? 'border-[#205089]/14 bg-[#F8FAFC]' : 'border-[#A8B8C8]/18 bg-[#121A24]/42')}>
        <div className="flex items-center justify-between gap-4 text-sm">
          <strong className={themeClasses.titleText}>Thành phần batch</strong>
          <span className={cx('font-semibold tabular-nums', themeClasses.mutedText)}>{totalLabel}</span>
        </div>
        <div className={cx('mt-4 flex h-11 overflow-hidden rounded-lg', themeClasses.isLight ? 'bg-[#DCE6F1]' : 'bg-[#26384E]')}>
          {segments.map((segment) => (
            <div
              key={segment.label}
              className={cx('min-w-2 transition-[width] duration-200 motion-reduce:transition-none', themeClasses.semantic[segment.tone ?? 'neutral'].indicator)}
              style={{ width: `${(Math.max(0, segment.value) / total) * 100}%` }}
              aria-hidden="true"
            />
          ))}
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {segments.map((segment) => (
            <div key={segment.label} className="grid grid-cols-[auto_1fr_auto] items-start gap-x-2">
              <span className={cx('mt-1.5 size-2.5 rounded-sm', themeClasses.semantic[segment.tone ?? 'neutral'].indicator)} aria-hidden="true" />
              <dt className={cx('text-sm font-black leading-5', themeClasses.titleText)}>{segment.label}</dt>
              <dd className={cx('text-sm font-black leading-5 tabular-nums', themeClasses.titleText)}>{segment.valueLabel}</dd>
              {segment.detail ? <dd className={cx('col-start-2 col-end-4 mt-0.5 text-sm leading-5', themeClasses.mutedText)}>{segment.detail}</dd> : null}
            </div>
          ))}
        </dl>
      </div>
    </figure>
  );
}

type MetricBarItem = {
  label: string;
  value: number;
  valueLabel: string;
  detail?: string;
  tone?: LearningSemanticTone;
  shadeByValue?: boolean;
  baselineValue?: number;
  dividerAfter?: boolean;
  placeholder?: boolean;
};

export function MetricBars({ ariaLabel, items, max = 100, columns = 1 }: {
  ariaLabel: string;
  items: MetricBarItem[];
  max?: number;
  columns?: 1 | 2 | 3;
}) {
  const themeClasses = useLearningMdxTheme();
  const safeMax = Math.max(max, 1);
  return (
    <figure className="my-6" aria-label={ariaLabel}>
      <ol className={cx('grid gap-4', columns === 2 && 'sm:grid-cols-2', columns === 3 && 'sm:grid-cols-3')}>
        {items.map((item, index) => {
          const width = Math.min(100, Math.max(0, item.value) / safeMax * 100);
          const baselineWidth = item.baselineValue === undefined
            ? 0
            : Math.min(width, Math.max(0, item.baselineValue) / safeMax * 100);
          const gainWidth = Math.max(0, width - baselineWidth);
          const opacity = item.shadeByValue ? 0.15 + width / 100 * 0.85 : 1;
          const toneIndicator = (themeClasses.semantic[item.tone as keyof typeof themeClasses.semantic] ?? themeClasses.semantic.neutral).indicator;
          return (
            <li
              key={`${item.label}-${index}`}
              aria-hidden={item.placeholder || undefined}
              className={cx(
                'grid gap-2',
                item.dividerAfter && 'mb-2 border-b pb-6',
                item.dividerAfter && (themeClasses.isLight ? 'border-[#205089]/14' : 'border-[#A8B8C8]/18'),
              )}
            >
              {item.placeholder ? null : (
                <>
                  <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0">
                      <div className={cx('text-sm font-black leading-5', themeClasses.titleText)}>{item.label}</div>
                      {item.detail ? <div className={cx('mt-0.5 text-sm leading-5', themeClasses.mutedText)}>{item.detail}</div> : null}
                    </div>
                    <span className={cx('shrink-0 text-base font-black tabular-nums', themeClasses.titleText)}>{item.valueLabel}</span>
                  </div>
                  <div className={cx('h-3 overflow-hidden rounded-full', themeClasses.isLight ? 'bg-[#DCE6F1]' : 'bg-[#26384E]')}>
                    {item.baselineValue === undefined ? (
                      <div
                        className={cx('h-full rounded-full transition-[width,opacity] duration-200 motion-reduce:transition-none', toneIndicator)}
                        style={{ width: `${width}%`, opacity }}
                        aria-hidden="true"
                      />
                    ) : (
                      <div className="flex h-full" aria-hidden="true">
                        <div
                          className={cx('h-full transition-[width] duration-200 motion-reduce:transition-none', themeClasses.semantic.neutral.indicator)}
                          style={{ width: `${baselineWidth}%` }}
                        />
                        <div
                          className={cx('h-full transition-[width] duration-200 motion-reduce:transition-none', themeClasses.semantic.success.indicator)}
                          style={{ width: `${gainWidth}%` }}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

type ConceptSpectrumItem = { label: string; detail?: string };

export function ConceptSpectrum({ ariaLabel, items }: { ariaLabel: string; items: ConceptSpectrumItem[] }) {
  const themeClasses = useLearningMdxTheme();
  return (
    <figure className="my-6" aria-label={ariaLabel}>
      <div className={cx('h-1.5 rounded-full', themeClasses.isLight ? 'bg-[#205089]/18' : 'bg-[#A8D4FF]/20')} aria-hidden="true" />
      <ol className="mt-3 grid gap-4 sm:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="min-w-0">
            <div className={cx('text-sm font-black leading-5', themeClasses.titleText)}>{item.label}</div>
            {item.detail ? <div className={cx('mt-1 text-sm leading-5', themeClasses.mutedText)}>{item.detail}</div> : null}
          </li>
        ))}
      </ol>
    </figure>
  );
}

export function ExtraFrame({ title, children, themeClasses, customTitle }: {
  title: string;
  children: ReactNode;
  themeClasses: LearningThemeClasses;
  customTitle?: ReactNode;
}) {
  return (
    <div className="py-1">
      <div className={cx('mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide', themeClasses.eyebrowText)}>
        {customTitle ?? <span>{title}</span>}
      </div>
      {children}
    </div>
  );
}

function MdxParagraph({ children }: { children?: ReactNode }) {
  const themeClasses = useLearningMdxTheme();
  return <p className={cx('text-base leading-[1.625rem]', themeClasses.bodyText)}>{children}</p>;
}

function MdxLink({ children, href }: { children?: ReactNode; href?: string }) {
  const themeClasses = useLearningMdxTheme();
  const isNumericCitation = typeof children === 'string' && /^\[\d+\]$/.test(children.trim());
  if (isNumericCitation) {
    return <a href={href} target="_blank" rel="noreferrer" className={cx('underline-offset-2 transition-colors hover:underline', themeClasses.focusRing, themeClasses.isLight ? 'text-[#2F78B7]' : 'text-[#9CC7EF]')}>{children}</a>;
  }
  return <a href={href} target="_blank" rel="noreferrer" className={cx('inline-flex min-h-9 items-center rounded-lg border px-3 text-xs font-black leading-5 transition-colors', themeClasses.focusRing, themeClasses.isLight ? 'border-[#205089]/14 bg-[#F8FAFC] text-[#123B68] hover:bg-[#EEF4FA]' : 'border-[#A8B8C8]/16 bg-[#A8B8C8]/7 text-[#F2F6FA] hover:bg-[#A8B8C8]/11')}>{children}</a>;
}

type AuthoredQuizQuestion = Omit<Extract<LearningLessonExtra, { kind: 'quiz' }>['questions'][number], 'title' | 'prompt' | 'options' | 'categories' | 'success' | 'error' | 'completeLabel'> & {
  title: string;
  prompt: string;
  options: Array<{ id: string; label: string; isCorrect?: boolean; categoryId?: string }>;
  categories?: Array<{ id: string; label: string }>;
  success: string;
  error: string;
  completeLabel?: string;
};

export function MdxQuiz({ id, questions }: { id: string; questions: AuthoredQuizQuestion[] }) {
  const themeClasses = useLearningMdxTheme();
  const lessonContext = useLearningMdxLesson();
  const question = questions[lessonContext.pageIndex];
  if (!question) return null;
  const localized = (value: string) => ({ en: value, vi: value });
  const extra: Extract<LearningLessonExtra, { kind: 'quiz' }> = {
    kind: 'quiz', id, sectionRefId: id, title: localized('Quiz kiểm tra nhanh'),
    questions: [{
      ...question,
      title: localized(question.title), prompt: localized(question.prompt),
      options: question.options.map((option) => ({ ...option, label: localized(option.label) })),
      categories: question.categories?.map((category) => ({ ...category, label: localized(category.label) })),
      success: localized(question.success), error: localized(question.error),
      completeLabel: question.completeLabel ? localized(question.completeLabel) : undefined,
    }],
  };
  return <QuizBlock extra={extra} language={lessonContext.language} quizQuestionStates={lessonContext.quizQuestionStates} themeClasses={themeClasses} onQuizQuestionStateChange={lessonContext.onQuizQuestionStateChange} />;
}

export function MdxPage({ children, page }: { children?: ReactNode; page: number }) {
  return useLearningMdxLesson().pageIndex === page ? children : null;
}

export { InlineMath, BlockMath, MathInline, MathDisplay, EquationCallout };

function extractTextFromNode(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractTextFromNode).join('');
  if (isValidElement(node) && node.props && (node.props as { children?: ReactNode }).children) {
    return extractTextFromNode((node.props as { children?: ReactNode }).children);
  }
  return '';
}

function MdxCode({ children, className }: { children?: ReactNode; className?: string }) {
  const themeClasses = useLearningMdxTheme();
  if (className) return <code className={className}>{children}</code>;

  return (
    <code
      className={cx(
        'mx-0.5 inline rounded-md px-1.5 py-0.5 font-mono text-[0.86em] font-semibold leading-none box-decoration-clone',
        themeClasses.isLight
          ? 'bg-[#EAF2FA] !text-[#174A7E] ring-1 ring-inset ring-[#205089]/12'
          : 'bg-[#A8D4FF]/10 !text-[#CBE5FF] ring-1 ring-inset ring-[#A8D4FF]/18',
      )}
    >
      {children}
    </code>
  );
}

function MdxPre({ children }: { children?: ReactNode }) {
  const themeClasses = useLearningMdxTheme();

  if (!isValidElement(children)) {
    return <pre>{children}</pre>;
  }

  const codeElement = children as ReactElement<{ className?: string; children?: ReactNode }>;
  const codeClassName = codeElement.props?.className;

  if (typeof codeClassName === 'string') {
    const rawText = extractTextFromNode(codeElement.props?.children).replace(/\n$/, '');
    if (/^language-mermaid(?:$|\s)/.test(codeClassName)) {
      return <MermaidDiagram chart={rawText} />;
    }
    if (/^language-(?:output|text|plain)(?:$|\s)/.test(codeClassName)) {
      return <CodeBlock code={rawText} variant="output" copyable={false} themeClasses={themeClasses} />;
    }
    if (/^language-/.test(codeClassName)) {
      return <CodeBlock code={rawText} variant="code" showLineNumbers themeClasses={themeClasses} />;
    }
  }

  return <pre>{children}</pre>;
}

const sharedAuthoredMdxComponents = {
  LessonNote,
  LessonImage,
  MdxQuiz,
  MdxPage,
  RequirementCard,
  RequirementsGrid,
  CourseCards,
  EvidenceCards,
  ConceptFlow,
  ConceptHierarchy,
  ExperimentChecklist,
  SelfCheckList,
  ComparisonMatrix,
  PaperTradeoff,
  DatasetComposition,
  MetricBars,
  ConceptSpectrum,
  InlineMath,
  BlockMath,
  EquationCallout,
  CodeLabStep,
  InteractiveStepper,
  Mermaid,
  MermaidDiagram,
  Flowchart,
} satisfies Record<typeof SHARED_LEARNING_MDX_COMPONENT_NAMES[number], LearningMdxComponent>;

export { Mermaid, MermaidDiagram, Flowchart };

export const sharedLearningMdxComponents = {
  a: MdxLink,
  code: MdxCode,
  p: MdxParagraph,
  pre: MdxPre,
  ...sharedAuthoredMdxComponents,
};

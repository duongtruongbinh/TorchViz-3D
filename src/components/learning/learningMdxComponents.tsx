import { Check, Code2, DatabaseBackup, Monitor, Terminal, Wrench, type LucideIcon } from 'lucide-react';
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
import { InlineMath, BlockMath, MathInline, MathDisplay, EquationCallout } from './math';
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
        <svg viewBox="0 0 112 56" className="h-14 w-28" fill="none">
          <circle cx="38" cy="42" r="3.5" fill="currentColor" />
          <path d="M38 42 75 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.38" />
          <path d="m69 13 7-1-2 7" fill="currentColor" opacity="0.38" />
          <path d="M38 42h49" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <path d="m82 37 7 5-7 5" fill="currentColor" />
          <path d="M75 13v29" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 4" opacity="0.45" />
          <path d="M69 36v6h6" stroke="currentColor" strokeWidth="1.4" opacity="0.65" />
        </svg>
      ) : (
        <svg viewBox="0 0 112 56" className="h-14 w-28" fill="none">
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

export function CourseCards({ ariaLabel, exampleLabel, takeawayLabel, items, spotlight = false, singleColumn = false, threeColumns = false, featureFirst = false, numbered = true }: {
  ariaLabel: string;
  exampleLabel: string;
  takeawayLabel: string;
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
              <div>
                <dt className={cx('font-black', themeClasses.titleText)}>{exampleLabel}</dt>
                <dd className={cx('mt-1', themeClasses.bodyText)}>{item.example}</dd>
              </div>
              <div>
                <dt className={cx('font-black', themeClasses.titleText)}>{takeawayLabel}</dt>
                <dd className={cx('mt-1', themeClasses.bodyText)}>{item.takeaway}</dd>
              </div>
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

export function LessonNote({ children, tone = 'default' }: { children?: ReactNode; tone?: 'default' | 'warning' }) {
  const themeClasses = useLearningMdxTheme();
  const isWarning = tone === 'warning';
  return (
    <div
      className={cx(
        'mt-5 grid rounded-lg border px-4 py-3 text-sm leading-6 [&_p]:!text-inherit [&_ol]:grid [&_ol]:list-decimal [&_ol]:gap-2 [&_ol]:pl-5 [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-2 [&_ul]:pl-5',
        isWarning
          ? cx(themeClasses.semantic.warning.border, themeClasses.semantic.warning.surface, 'font-normal', themeClasses.semantic.warning.text)
          : cx(
            'gap-2 font-semibold',
            themeClasses.isLight ? 'border-[#2F6B55]/18' : 'border-[#A8D4FF]/25',
            themeClasses.sectionAccent.note,
          ),
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

type ConceptFlowItem = { title: string; detail?: string };

export function ConceptFlow({ ariaLabel, items }: { ariaLabel: string; items: ConceptFlowItem[] }) {
  const themeClasses = useLearningMdxTheme();
  return (
    <figure className="my-6" aria-label={ariaLabel}>
      <ol className="grid gap-0 sm:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.title}-${index}`} className="grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] gap-3 sm:block">
              <div className="flex h-full flex-col items-center sm:h-auto sm:flex-row">
                <span
                  className={cx(
                    'grid size-8 shrink-0 place-items-center rounded-full text-sm font-black tabular-nums',
                    themeClasses.isLight
                      ? 'bg-[#205089] text-white shadow-[0_0_0_4px_rgba(32,80,137,0.10)]'
                      : 'bg-[#A8D4FF] text-[#0B1726] shadow-[0_0_0_4px_rgba(168,212,255,0.10)]',
                  )}
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                {!isLast ? (
                  <span
                    className={cx(
                      'w-0.5 flex-1 sm:h-0.5 sm:w-auto',
                      themeClasses.isLight ? 'bg-[#205089]/22' : 'bg-[#A8D4FF]/24',
                    )}
                    aria-hidden="true"
                  />
                ) : null}
              </div>
              <div className={cx('min-w-0 pb-6 pt-1 sm:pb-0 sm:pt-4', !isLast && 'sm:pr-6')}>
                <strong className={cx('block text-base font-black leading-6 text-balance', themeClasses.titleText)}>{item.title}</strong>
                {item.detail ? <span className={cx('mt-1 block text-sm leading-6 text-pretty', themeClasses.mutedText)}>{item.detail}</span> : null}
              </div>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

type ConceptHierarchyNode = {
  title: ReactNode;
  detail?: ReactNode;
  problem?: ReactNode;
  tone?: 'blue' | 'amber' | 'teal' | 'violet' | 'neutral';
  visual?: 'database' | 'two-term-loss' | 'neural-network';
  muted?: boolean;
  align?: 'left' | 'center';
  children?: ConceptHierarchyNode[];
  nodes?: ConceptHierarchyNode[];
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

  return (
    <div className={cx('grid min-h-16 place-items-center', visualTones[tone])} aria-hidden="true">
      {visual === 'database' ? <DatabaseBackup className="size-10" strokeWidth={1.65} /> : null}
      {visual === 'two-term-loss' ? (
        <div className="flex items-center justify-center gap-2 font-mono text-xs font-bold">
          <span className={cx('rounded-md border px-2.5 py-1.5', termSurface)}>L<sub>new</sub></span>
          <span className="text-base font-black">+</span>
          <span className={cx('rounded-md border px-2.5 py-1.5', termSurface)}>λL<sub>keep</sub></span>
        </div>
      ) : null}
      {visual === 'neural-network' ? (
        <svg viewBox="0 0 104 56" className="h-14 w-24" fill="none">
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
    </div>
  );
}

export function ConceptHierarchy({ ariaLabel, root, children, nodes }: {
  ariaLabel: string;
  root: ConceptHierarchyNode;
  children?: ConceptHierarchyNode[];
  nodes?: ConceptHierarchyNode[];
}) {
  const themeClasses = useLearningMdxTheme();
  const childNodes = children ?? nodes ?? [];
  const connector = themeClasses.isLight ? 'bg-[#205089]/28' : 'bg-[#A8D4FF]/28';
  const rootSurface = themeClasses.isLight
    ? 'border-[#205089] bg-[#205089] text-white shadow-[0_10px_24px_rgba(32,80,137,0.18)]'
    : 'border-[#A8D4FF] bg-[#A8D4FF] text-[#0B1726] shadow-[0_10px_24px_rgba(0,0,0,0.24)]';
  const childNodeTones = themeClasses.isLight ? {
    blue: 'border-[#79A9D1]/60 bg-[#EAF4FB] text-[#1F5C88] shadow-[0_8px_18px_rgba(63,125,177,0.08)]',
    amber: 'border-[#D6AE65]/65 bg-[#FFF8E8] text-[#805B1D] shadow-[0_8px_18px_rgba(160,117,43,0.08)]',
    teal: 'border-[#68AAA2]/60 bg-[#ECF8F6] text-[#216B63] shadow-[0_8px_18px_rgba(45,126,117,0.08)]',
    violet: 'border-[#A89CCB]/60 bg-[#F4F1FB] text-[#62558B] shadow-[0_8px_18px_rgba(98,85,139,0.08)]',
    neutral: 'border-[#205089]/16 bg-[#F5F8FC] text-[#172A43] shadow-[0_8px_18px_rgba(32,80,137,0.07)]',
  } : {
    blue: 'border-[#7FB4E5]/32 bg-[#7FB4E5]/10 text-[#CBE5FF] shadow-[0_10px_24px_rgba(0,0,0,0.18)]',
    amber: 'border-[#F0BE62]/32 bg-[#F0BE62]/10 text-[#FFE0A0] shadow-[0_10px_24px_rgba(0,0,0,0.18)]',
    teal: 'border-[#79C5BB]/32 bg-[#79C5BB]/10 text-[#BDEBE5] shadow-[0_10px_24px_rgba(0,0,0,0.18)]',
    violet: 'border-[#B9A9E3]/32 bg-[#B9A9E3]/10 text-[#DDD3F7] shadow-[0_10px_24px_rgba(0,0,0,0.18)]',
    neutral: 'border-[#A8D4FF]/18 bg-[#172232] text-[#F4EFE6] shadow-[0_10px_24px_rgba(0,0,0,0.18)]',
  };
  const columnStyle = {
    '--concept-hierarchy-columns': Math.max(childNodes.length, 1),
  } as CSSProperties;
  const railStyle = {
    marginInline: `${50 / Math.max(childNodes.length, 1)}%`,
  };

  return (
    <figure className="my-6 w-full max-w-full overflow-x-auto" aria-label={ariaLabel}>
      <div className="flex justify-center">
        <div className={cx('relative z-10 max-w-full rounded-xl border px-4 py-3 text-center sm:max-w-3xl sm:px-6', rootSurface)}>
          <strong className="block text-base font-black leading-6">{root.title}</strong>
          {root.detail ? <span className="mt-1 block text-sm leading-5 text-pretty opacity-85">{root.detail}</span> : null}
        </div>
      </div>

      {childNodes.length ? (
        <>
          <span className={cx('mx-auto block h-5 w-px', connector)} aria-hidden="true" />
          <span className={cx('hidden h-px sm:block', connector)} style={railStyle} aria-hidden="true" />
          <ul
            className="m-0 grid list-none gap-0 p-0 sm:grid-cols-[repeat(var(--concept-hierarchy-columns),minmax(0,1fr))]"
            style={columnStyle}
          >
            {childNodes.map((child, index) => {
              const nestedChildren = child.children ?? [];
              const nestedColumnStyle = {
                '--concept-hierarchy-columns': Math.max(nestedChildren.length, 1),
              } as CSSProperties;
              const nestedRailStyle = {
                marginInline: `${50 / Math.max(nestedChildren.length, 1)}%`,
              };
              const description = child.detail ?? child.problem;

              return (
                <li key={index} className="m-0 flex min-w-0 list-none flex-col items-stretch p-0 sm:px-2">
                  <div className={cx('flex flex-col items-stretch', child.muted && 'opacity-35 grayscale')}>
                    <span className={cx('mx-auto block h-5 w-px', connector)} aria-hidden="true" />
                    <div className={cx('flex min-h-[4.25rem] w-full flex-col items-center justify-center rounded-xl border px-3 py-3 text-center', childNodeTones[child.tone ?? 'neutral'])}>
                      <strong className="text-sm font-black leading-snug sm:text-base">{child.title}</strong>
                    </div>
                    {child.visual ? <ConceptHierarchyVisual visual={child.visual} tone={child.tone ?? 'neutral'} isLight={themeClasses.isLight} /> : null}
                    {description ? (
                      <p className={cx(
                        child.visual ? 'mt-1' : 'mt-2.5',
                        'px-1 text-sm leading-relaxed text-pretty',
                        child.align === 'center' ? 'text-center' : 'text-left',
                        themeClasses.bodyText
                      )}>
                        {description}
                      </p>
                    ) : null}
                  </div>

                  {nestedChildren.length ? (
                    <div className="mt-1 sm:w-[200%] sm:-translate-x-1/4">
                      <span className={cx('mx-auto block h-5 w-px', connector)} aria-hidden="true" />
                      <span className={cx('hidden h-px sm:block', connector)} style={nestedRailStyle} aria-hidden="true" />
                      <ul
                        className="m-0 grid list-none gap-0 p-0 sm:grid-cols-[repeat(var(--concept-hierarchy-columns),minmax(0,1fr))]"
                        style={nestedColumnStyle}
                      >
                        {nestedChildren.map((nestedChild, nestedIndex) => (
                          <li key={`${nestedChild.title}-${nestedIndex}`} className={cx('m-0 min-w-0 list-none p-0 sm:px-2', nestedChild.muted && 'opacity-35 grayscale')}>
                            <span className={cx('mx-auto block h-5 w-px', connector)} aria-hidden="true" />
                            <div className={cx('flex min-h-14 w-full flex-col items-center justify-center rounded-xl border px-3 py-2 text-center sm:px-4 sm:py-3', childNodeTones[nestedChild.tone ?? child.tone ?? 'neutral'])}>
                              <strong className="text-sm font-black leading-5">{nestedChild.title}</strong>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
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
          const toneIndicator = themeClasses.semantic[item.tone ?? 'neutral'].indicator;
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


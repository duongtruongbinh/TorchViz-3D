import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  size,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { BookOpen, Check, Code2, Copy, ExternalLink, Monitor, Terminal, Wrench, type LucideIcon } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { createContext, isValidElement, useContext, useEffect, useId, useMemo, useRef, useState, type ComponentType, type ReactElement, type ReactNode } from 'react';
import { InlineMath, BlockMath, MathInline, MathDisplay, EquationCallout } from './math';
import type { LearningLessonExtra } from './authoredTypes';
import type { LearningLessonEntryPoint } from '../../core/learning/types';
import { getStrings, type Language } from '../../lib/localization';
import { citationEvidenceTargetLabel, type LearningCitationEvidence, type LearningCitationLinkOnlyException } from '../../core/learning/citationEvidence';
import { indexLearningReferences } from '../../core/learning/referenceIndex';
import { SHARED_LEARNING_MDX_COMPONENT_NAMES } from '../../core/learning/mdxContract';
import QuizBlock, { type QuizQuestionState } from './lesson/QuizBlock';
import { CodeBlock } from './code/CodeBlock';
import { cx, getLearningLabTheme } from './theme';

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

export function LearningMdxLessonProvider({ children, domainId, lessonId, language, pageIndex, entryPoints = [], referencePapers, citationEvidence, citationLinkOnlyExceptions, featuredReferenceIds, referenceCourseAnalysis, quizQuestionStates, onQuizQuestionStateChange }: {
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
  return <LearningMdxLessonContext.Provider value={{ domainId, lessonId, language, pageIndex, entryPoints, referencePapers: indexedReferences.ordered, referenceIndexByPaperId: indexedReferences.indexById, citationEvidence, citationLinkOnlyExceptions, activeCitationEvidenceId, setActiveCitationEvidenceId, featuredReferenceIds, referenceCourseAnalysis, quizQuestionStates, onQuizQuestionStateChange }}>{children}</LearningMdxLessonContext.Provider>;
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
        {/* `[&_p]:min-w-0` overrides the default `min-width: auto` of grid items
            so `<p>` can shrink below the intrinsic width of long inline code (e.g. URLs).
            `[&_code]:break-words` then lets that code wrap mid-word to fit the card.
            Without both, a long URL forces the grid column — and the card — wider. */}
        <div className={cx('grid gap-2 text-sm leading-6 [&_a]:font-black [&_a]:text-[#205089] [&_p]:min-w-0 [&_code]:block [&_code]:break-words [&_code]:rounded-lg [&_code]:bg-[#0B1220] [&_code]:px-3 [&_code]:py-2 [&_code]:text-xs [&_code]:text-[#E5EEF8]', themeClasses.bodyText)}>{children}</div>
      </div>
    </section>
  );
}

type CourseCardItem = {
  title: string;
  example: string;
  takeaway: string;
};

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
  const label = themeClasses.isLight ? 'text-[#205089]' : 'text-[#A8D4FF]';
  return (
    <ol className={cx('my-6 grid gap-3', !singleColumn && 'sm:grid-cols-2', threeColumns && 'lg:grid-cols-3')} aria-label={ariaLabel} onMouseLeave={spotlight ? () => setActiveIndex(0) : undefined}>
      {items.map((item, index) => {
        const isPositive = featureFirst && index === 0;
        const isRisk = featureFirst && (index === 1 || index === 2);
        const semanticBorder = isPositive
          ? 'border-emerald-300/80'
          : isRisk
            ? 'border-rose-300/80'
            : border;
        const semanticSurface = isPositive
          ? 'bg-emerald-50/70'
          : isRisk
            ? 'bg-rose-50/70'
            : undefined;
        const semanticTitleBand = isPositive
          ? 'bg-emerald-100/80'
          : isRisk
            ? 'bg-rose-100/80'
            : titleBand;
        const semanticLabel = isPositive
          ? 'text-emerald-800'
          : isRisk
            ? 'text-rose-800'
            : label;
        return (
          <li
            key={item.title}
            onMouseEnter={spotlight ? () => setActiveIndex(index) : undefined}
            className={cx(
              'grid h-full grid-rows-[auto_1fr] overflow-hidden rounded-xl border transition-[opacity,transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(25,55,85,0.12)] motion-reduce:transform-none',
              featureFirst && index === 0 && 'sm:row-span-2',
              featureFirst && index === items.length - 1 && 'sm:col-span-2',
              spotlight && (activeIndex === index ? 'opacity-100' : 'opacity-45'),
              semanticBorder,
              semanticSurface,
            )}
          >
            <div className={cx('grid min-h-20 items-center gap-3 border-b px-4 py-3', numbered ? 'grid-cols-[2rem_1fr]' : 'grid-cols-1', semanticBorder, semanticTitleBand)}>
              {numbered && <span className="grid size-8 place-items-center rounded-full bg-[#205089] text-sm font-black text-white">{index + 1}</span>}
              <h3 className={cx('text-base font-black leading-6 text-balance', themeClasses.titleText)}>{item.title}</h3>
            </div>
            <dl className="grid content-start gap-4 p-4 text-sm leading-6">
              <div>
                <dt className={cx('font-black', semanticLabel)}>{exampleLabel}</dt>
                <dd className={cx('mt-1', themeClasses.bodyText)}>{item.example}</dd>
              </div>
              <div>
                <dt className={cx('font-black', semanticLabel)}>{takeawayLabel}</dt>
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
  tone?: 'primary' | 'success' | 'danger' | 'accent' | 'neutral';
};

const EVIDENCE_CARD_TONES = {
  primary: {
    lightBar: 'bg-[#123B68]',
    darkBar: 'bg-[#65B5F0]',
    lightValue: 'text-[#0A3A6A]',
    darkValue: 'text-[#9ED4FF]',
  },
  success: {
    lightBar: 'bg-[#1F6240]',
    darkBar: 'bg-[#55C989]',
    lightValue: 'text-[#07351F]',
    darkValue: 'text-[#86E8B0]',
  },
  danger: {
    lightBar: 'bg-[#963333]',
    darkBar: 'bg-[#F26F6F]',
    lightValue: 'text-[#5E1212]',
    darkValue: 'text-[#FF9D9D]',
  },
  accent: {
    lightBar: 'bg-[#80520D]',
    darkBar: 'bg-[#E8AF3E]',
    lightValue: 'text-[#442800]',
    darkValue: 'text-[#FFD071]',
  },
  neutral: {
    lightBar: 'bg-[#4B6074]',
    darkBar: 'bg-[#91A7BA]',
    lightValue: 'text-[#182A3C]',
    darkValue: 'text-[#D0DCE8]',
  },
} as const;

export function EvidenceCards({ ariaLabel, insightLabel, items, singleColumn = false }: { ariaLabel: string; insightLabel?: string; items: EvidenceCardItem[]; singleColumn?: boolean }) {
  const themeClasses = useLearningMdxTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const border = themeClasses.isLight ? 'border-[#205089]/14' : 'border-[#A8B8C8]/18';
  const surface = themeClasses.isLight ? 'bg-[#F8FAFC]' : 'bg-[#121A24]/42';
  return (
    <ol className={cx('my-6 grid gap-3', !singleColumn && 'sm:grid-cols-2')} aria-label={ariaLabel} onMouseLeave={() => setActiveIndex(0)}>
      {items.map((item, index) => {
        const tone = EVIDENCE_CARD_TONES[item.tone ?? 'primary'];
        const barColor = themeClasses.isLight ? tone.lightBar : tone.darkBar;
        const valueColor = themeClasses.isLight ? tone.lightValue : tone.darkValue;
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
              <p className={cx('mt-4 border-t pt-3 text-sm leading-6', border, themeClasses.bodyText)}>
                {insightLabel && <strong className={cx('mr-1.5 font-black', valueColor)}>{insightLabel}</strong>}
                {item.insight}
              </p>
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
          ? themeClasses.isLight
            ? 'border-[#D5B43A]/35 bg-[#FFF8D8] font-normal text-[#263B5B]'
            : 'border-[#F4C84A]/24 bg-[#F4C84A]/10 font-normal text-[#F2F6FA]'
          : cx(
            'gap-2 font-semibold',
            themeClasses.isLight
              ? 'border-[#2F6B55]/18'
              : 'border-[#A8D4FF]/25',
            themeClasses.sectionAccent.note,
          ),
      )}
    >
      {children}
    </div>
  );
}

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

type StageContinuityMapItem = {
  verticalTitle: string;
  verticalDetail: string;
  horizontalTitle: string;
  horizontalItems: string[];
};

export function StageContinuityMap({ ariaLabel, items }: { ariaLabel: string; items: StageContinuityMapItem[] }) {
  const themeClasses = useLearningMdxTheme();
  const border = themeClasses.isLight ? 'border-[#205089]/14' : 'border-[#A8B8C8]/18';
  const verticalCard = themeClasses.isLight ? 'border-[#205089]/18 bg-[#EAF2FA]' : 'border-[#A8D4FF]/20 bg-[#A8D4FF]/8';
  const horizontalCard = themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]/44';
  return (
    <figure className="my-6 grid gap-3" aria-label={ariaLabel}>
      <div className={cx('hidden gap-3 px-1 text-xs font-black uppercase tracking-[0.16em] md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)]', themeClasses.mutedText)}>
        <span>Flow Vertical</span>
        <span>Mở rộng Horizontal trong cùng stage</span>
      </div>
      <ol className="grid gap-3">
        {items.map((item, index) => (
          <li key={item.verticalTitle} className="grid gap-3 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)]">
            <section className={cx('rounded-xl border p-5 shadow-[0_10px_24px_rgba(25,55,85,0.10)]', verticalCard)}>
              <div className="mb-3 flex items-center gap-3">
                <span className={cx('grid size-8 shrink-0 place-items-center rounded-full text-sm font-black tabular-nums', themeClasses.isLight ? 'bg-[#205089] text-white' : 'bg-[#A8D4FF] text-[#0B1726]')}>
                  {index + 1}
                </span>
                <h3 className={cx('text-base font-black leading-6 text-balance', themeClasses.titleText)}>{item.verticalTitle}</h3>
              </div>
              <p className={cx('text-sm leading-6 text-pretty', themeClasses.bodyText)}>{item.verticalDetail}</p>
            </section>
            <section
              tabIndex={0}
              className={cx(
                'rounded-xl border p-5 opacity-45 transition-[opacity,transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:opacity-100 hover:shadow-[0_14px_30px_rgba(25,55,85,0.12)] focus-visible:-translate-y-0.5 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#205089]/35 focus-visible:shadow-[0_14px_30px_rgba(25,55,85,0.12)] motion-reduce:transform-none',
                border,
                horizontalCard,
              )}
            >
              <h3 className={cx('text-sm font-black leading-6 text-balance', themeClasses.titleText)}>{item.horizontalTitle}</h3>
              <ul className={cx('mt-3 grid list-disc gap-2 pl-5 text-sm leading-6', themeClasses.bodyText)}>
                {item.horizontalItems.map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
            </section>
          </li>
        ))}
      </ol>
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
      <section className="rounded-xl border border-emerald-300/80 bg-emerald-50/70 p-4">
        <h4 className={cx('text-sm font-black', neutralText ? themeClasses.titleText : 'text-emerald-800')}>Ưu điểm</h4>
        <ul className={cx('mt-3 grid list-disc gap-2 pl-5 text-sm leading-6', themeClasses.bodyText)}>
          {advantages.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
      <section className="rounded-xl border border-rose-300/80 bg-rose-50/70 p-4">
        <h4 className={cx('text-sm font-black', neutralText ? themeClasses.titleText : 'text-rose-800')}>Hạn chế</h4>
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
  const tones = {
    primary: themeClasses.isLight ? 'bg-[#205089]' : 'bg-[#7FB4E5]',
    accent: themeClasses.isLight ? 'bg-[#D5962F]' : 'bg-[#F0BE62]',
    neutral: themeClasses.isLight ? 'bg-[#8092A6]' : 'bg-[#8EA1B5]',
  };
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
              className={cx('min-w-2 transition-[width] duration-200 motion-reduce:transition-none', tones[segment.tone ?? 'neutral'])}
              style={{ width: `${(Math.max(0, segment.value) / total) * 100}%` }}
              aria-hidden="true"
            />
          ))}
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {segments.map((segment) => (
            <div key={segment.label} className="grid grid-cols-[auto_1fr_auto] items-start gap-x-2">
              <span className={cx('mt-1.5 size-2.5 rounded-sm', tones[segment.tone ?? 'neutral'])} aria-hidden="true" />
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
  tone?: 'primary' | 'accent' | 'success' | 'danger' | 'neutral';
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
  const tones = {
    primary: themeClasses.isLight ? 'bg-[#205089]' : 'bg-[#7FB4E5]',
    accent: themeClasses.isLight ? 'bg-[#D5962F]' : 'bg-[#F0BE62]',
    success: themeClasses.isLight ? 'bg-[#2E8A5A]' : 'bg-[#6ED39B]',
    danger: themeClasses.isLight ? 'bg-[#C45151]' : 'bg-[#EE8C8C]',
    neutral: themeClasses.isLight ? 'bg-[#8092A6]' : 'bg-[#8EA1B5]',
  };
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
                        className={cx('h-full rounded-full transition-[width,opacity] duration-200 motion-reduce:transition-none', tones[item.tone ?? 'neutral'])}
                        style={{ width: `${width}%`, opacity }}
                        aria-hidden="true"
                      />
                    ) : (
                      <div className="flex h-full" aria-hidden="true">
                        <div
                          className={cx('h-full transition-[width] duration-200 motion-reduce:transition-none', tones.neutral)}
                          style={{ width: `${baselineWidth}%` }}
                        />
                        <div
                          className={cx('h-full transition-[width] duration-200 motion-reduce:transition-none', tones.success)}
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

function useLearningReferencePaper(paperId: string): LearningReferencePaper | null {
  return useLearningMdxLesson().referencePapers?.find((paper) => paper.id === paperId) ?? null;
}

function useLearningCitationEvidence(evidenceId: string | undefined): LearningCitationEvidence | null {
  const lessonContext = useLearningMdxLesson();
  if (!evidenceId) return null;
  return lessonContext.citationEvidence?.find((evidence) => evidence.id === evidenceId) ?? null;
}

function useLearningCitationLinkOnlyException(exceptionId: string | undefined): LearningCitationLinkOnlyException | null {
  const lessonContext = useLearningMdxLesson();
  if (!exceptionId) return null;
  return lessonContext.citationLinkOnlyExceptions?.find((exception) => exception.id === exceptionId) ?? null;
}

function referenceAuthorLabel(paper: LearningReferencePaper): string {
  const firstAuthor = paper.authors[0]?.split(',')[0]?.trim() || paper.title;
  return paper.authors.length > 1 ? `${firstAuthor} et al.` : firstAuthor;
}

function CitationPreviewLink({ citation, evidence, reference }: {
  citation: string;
  evidence: LearningCitationEvidence;
  reference: LearningReferencePaper;
}) {
  const themeClasses = useLearningMdxTheme();
  const lessonContext = useLearningMdxLesson();
  const titleId = useId();
  const excerptId = useId();
  const lastPointerType = useRef<string>('mouse');
  const copyTimer = useRef<number | null>(null);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const open = lessonContext.activeCitationEvidenceId === evidence.id;
  const setOpen = (nextOpen: boolean) => {
    if (nextOpen) lessonContext.setActiveCitationEvidenceId(evidence.id);
    else if (lessonContext.activeCitationEvidenceId === evidence.id) lessonContext.setActiveCitationEvidenceId(null);
  };
  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'top-start',
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(10),
      flip({ padding: 12 }),
      shift({ padding: 12 }),
      size({
        padding: 12,
        apply({ availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${Math.max(0, availableHeight)}px`,
          });
        },
      }),
    ],
  });
  const hover = useHover(context, {
    mouseOnly: true,
    delay: { open: 260, close: 120 },
    handleClose: safePolygon(),
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context, { escapeKey: true, outsidePress: true });
  const role = useRole(context, { role: 'dialog' });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  useEffect(() => () => {
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
  }, []);

  const copySearchText = async () => {
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(evidence.searchText);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
    copyTimer.current = window.setTimeout(() => setCopyState('idle'), 2200);
  };

  const citationLink = (
    <a
      ref={refs.setReference}
      href={evidence.verificationUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${citation}: ${reference.title} (mở trong tab mới)`}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-describedby={open ? excerptId : undefined}
      {...getReferenceProps({
        onPointerDown(event) {
          lastPointerType.current = event.pointerType;
        },
        onClick(event) {
          if (event.detail !== 0 && (lastPointerType.current === 'touch' || lastPointerType.current === 'pen')) {
            event.preventDefault();
            setOpen(true);
          }
        },
      })}
      className={cx(
        'font-semibold underline decoration-1 underline-offset-[3px] transition-colors hover:decoration-2',
        themeClasses.focusRing,
        themeClasses.isLight ? 'text-[#205E91] decoration-[#205E91]/35' : 'text-[#9CC7EF] decoration-[#9CC7EF]/45',
      )}
    >
      {citation}
    </a>
  );

  return (
    <>
      {citationLink}
      {open ? (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false} initialFocus={-1} returnFocus={false}>
            <aside
              ref={refs.setFloating}
              style={floatingStyles}
              aria-labelledby={titleId}
              {...getFloatingProps()}
              className={cx(
                'z-[80] w-[min(28rem,calc(100vw-1.5rem))] overflow-y-auto rounded-2xl border p-4 shadow-[0_20px_55px_rgba(15,36,58,0.22)] transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none',
                isPositioned ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0',
                themeClasses.isLight
                  ? 'border-[#205089]/18 bg-[#FBFDFF] text-[#16324F]'
                  : 'border-[#A8B8C8]/22 bg-[#111C28] text-[#E5EEF8]',
              )}
            >
              <p id={titleId} className={cx('text-sm font-bold leading-5', themeClasses.titleText)}>{reference.title}</p>
              <p className={cx('mt-0.5 text-xs leading-5', themeClasses.mutedText)}>{referenceAuthorLabel(reference)}{reference.year ? ` · ${reference.year}` : ''}</p>
              <blockquote
                id={excerptId}
                className={cx(
                  'mt-3 border-l-2 pl-3 text-sm leading-6',
                  themeClasses.isLight ? 'border-[#205089]/35 text-[#294A68]' : 'border-[#9CC7EF]/40 text-[#D5E4F2]',
                )}
              >
                “{evidence.excerpt}”
              </blockquote>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={copySearchText}
                  className={cx(
                    'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-center text-sm font-black transition-colors',
                    themeClasses.focusRing,
                    themeClasses.isLight
                      ? 'border-[#205089]/22 bg-white text-[#205089] hover:bg-[#EAF2FA]'
                      : 'border-[#A8D4FF]/24 bg-[#172533] text-[#B9D8F5] hover:bg-[#213548]',
                  )}
                >
                  {copyState === 'copied' ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
                  {copyState === 'copied' ? 'Đã sao chép' : copyState === 'failed' ? 'Thử sao chép lại' : 'Sao chép đoạn để tìm'}
                </button>
                <a
                  href={evidence.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cx(
                    'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 py-2 text-center text-sm font-black no-underline transition-colors',
                    themeClasses.focusRing,
                    themeClasses.isLight ? 'bg-[#205089] text-white hover:bg-[#17456F]' : 'bg-[#9CC7EF] text-[#071522] hover:bg-[#B6D8F7]',
                  )}
                >
                  {citationEvidenceTargetLabel(evidence.targetPrecision)}
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              </div>
              <span className="sr-only" aria-live="polite">
                {copyState === 'copied' ? 'Đã sao chép đoạn tìm kiếm.' : copyState === 'failed' ? 'Không thể sao chép. Vui lòng thử lại.' : ''}
              </span>
            </aside>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}
    </>
  );
}

export function Cite({ paper, evidence: evidenceId, exception: exceptionId }: { paper: string; evidence?: string; exception?: string }) {
  const themeClasses = useLearningMdxTheme();
  const { referenceIndexByPaperId } = useLearningMdxLesson();
  const reference = useLearningReferencePaper(paper);
  const evidence = useLearningCitationEvidence(evidenceId);
  const linkOnlyException = useLearningCitationLinkOnlyException(exceptionId);
  if (!reference) return <span className="text-rose-700" title={`Unknown paper ID: ${paper}`}>[{paper}]</span>;
  if (evidenceId && exceptionId) return <span className="text-rose-700" title="A citation cannot declare both evidence and a link-only exception">[{paper}]</span>;
  if (evidenceId && !evidence) return <span className="text-rose-700" title={`Unknown citation evidence ID: ${evidenceId}`}>[{evidenceId}]</span>;
  if (exceptionId && !linkOnlyException) return <span className="text-rose-700" title={`Unknown citation link-only exception ID: ${exceptionId}`}>[{exceptionId}]</span>;
  const referenceIndex = referenceIndexByPaperId.get(paper);
  if (!referenceIndex) return <span className="text-rose-700" title={`Paper is missing from the lesson reference index: ${paper}`}>[{paper}]</span>;
  const citation = `[${referenceIndex}]`;
  if (evidence) return <CitationPreviewLink citation={citation} evidence={evidence} reference={reference} />;
  return (
    <a
      href={linkOnlyException?.verificationUrl ?? reference.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${citation}: ${reference.title} (mở trong tab mới)`}
      className={cx(
        'font-semibold underline decoration-1 underline-offset-[3px] transition-colors hover:decoration-2',
        themeClasses.focusRing,
        themeClasses.isLight ? 'text-[#205E91] decoration-[#205E91]/35' : 'text-[#9CC7EF] decoration-[#9CC7EF]/45',
      )}
    >
      {citation}
    </a>
  );
}

export function PaperSummary({ paper, question, setup, finding, limitation, relevance, locator, limitationSource = 'course-analysis' }: {
  paper: string;
  question: string;
  setup: string;
  finding: string;
  limitation: string;
  relevance: string;
  locator?: string;
  limitationSource?: 'authors' | 'course-analysis';
}) {
  const themeClasses = useLearningMdxTheme();
  const reference = useLearningReferencePaper(paper);
  if (!reference) return null;
  const rows = [
    ['Câu hỏi', question],
    ['Thiết lập', setup],
    ['Kết quả liên quan', finding],
    [limitationSource === 'authors' ? 'Giới hạn do tác giả nêu' : 'Giới hạn khi diễn giải', limitation],
    ['Vai trò trong bài', relevance],
  ];
  return (
    <section className={cx('my-6 overflow-hidden rounded-xl border', themeClasses.isLight ? 'border-[#205089]/16 bg-[#F8FAFC]' : 'border-[#A8B8C8]/18 bg-[#121A24]/42')} aria-label={`Phân tích paper ${reference.title}`}>
      <header className={cx('flex items-start gap-3 border-b px-4 py-4 sm:px-5', themeClasses.isLight ? 'border-[#205089]/12 bg-[#EAF2FA]' : 'border-[#A8B8C8]/14 bg-[#A8D4FF]/8')}>
        <BookOpen className={cx('mt-0.5 size-5 shrink-0', themeClasses.accentText)} aria-hidden="true" />
        <div className="min-w-0">
          <a href={reference.url} target="_blank" rel="noreferrer" className={cx('font-black leading-6 underline-offset-4 hover:underline', themeClasses.focusRing, themeClasses.titleText)}>{reference.title}</a>
          <p className={cx('mt-1 text-sm leading-5', themeClasses.mutedText)}>{referenceAuthorLabel(reference)}{reference.year ? ` · ${reference.year}` : ''}{locator ? ` · ${locator}` : ''}</p>
        </div>
      </header>
      <dl className="divide-y divide-[#205089]/10 px-4 sm:px-5">
        {rows.map(([term, description]) => (
          <div key={term} className="grid gap-1 py-3 sm:grid-cols-[10.5rem_1fr] sm:gap-4">
            <dt className={cx('text-sm font-black leading-6', themeClasses.titleText)}>{term}</dt>
            <dd className={cx('text-sm leading-6', themeClasses.bodyText)}>{description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function LessonReferences() {
  const themeClasses = useLearningMdxTheme();
  const { referencePapers = [], featuredReferenceIds = [], referenceCourseAnalysis } = useLearningMdxLesson();
  if (!referencePapers.length && !referenceCourseAnalysis) return null;
  const featuredSet = new Set(featuredReferenceIds);
  const featured = referencePapers.filter((paper) => featuredSet.has(paper.id));
  const additional = referencePapers.filter((paper) => !featuredSet.has(paper.id));
  return (
    <section aria-labelledby="lesson-references-heading">
      <h2 id="lesson-references-heading" className={cx('text-lg font-black text-balance', themeClasses.titleText)}>Nguồn chính được dùng trong bài</h2>
      {referenceCourseAnalysis ? <p className={cx('mt-3 max-w-[72ch] text-sm leading-6', themeClasses.bodyText)}><strong>Phạm vi diễn giải:</strong> {referenceCourseAnalysis}</p> : null}
      {featured.length ? <ReferencePaperList title="" papers={featured} startIndex={1} /> : null}
      {additional.length ? (
        <details className={cx('mt-5 rounded-xl border', themeClasses.isLight ? 'border-[#205089]/14 bg-[#F8FAFC]' : 'border-[#A8B8C8]/18 bg-[#121A24]/42')}>
          <summary className={cx('cursor-pointer px-4 py-3 text-sm font-black marker:text-[#2F78B7]', themeClasses.focusRing, themeClasses.titleText)}>
            Bằng chứng liên quan trong survey ({additional.length} paper)
          </summary>
          <div className="border-t border-[#205089]/10 px-4 pb-4"><ReferencePaperList title="" papers={additional} startIndex={featured.length + 1} /></div>
        </details>
      ) : null}
    </section>
  );
}

function ReferencePaperList({ title, papers, startIndex }: { title: string; papers: readonly LearningReferencePaper[]; startIndex: number }) {
  const themeClasses = useLearningMdxTheme();
  return (
    <div className="mt-5">
      {title ? <h3 className={cx('text-sm font-black', themeClasses.titleText)}>{title}</h3> : null}
      <ol start={startIndex} className="mt-2 grid list-decimal gap-2 pl-5">
        {papers.map((paper) => (
          <li key={paper.id} className={cx('pl-1 text-sm leading-6', themeClasses.bodyText)}>
            <a href={paper.url} target="_blank" rel="noreferrer" className={cx('font-bold underline-offset-4 hover:underline', themeClasses.focusRing, themeClasses.isLight ? 'text-[#205E91]' : 'text-[#9CC7EF]')}>
              {paper.title}<ExternalLink className="ml-1 inline size-3.5" aria-hidden="true" />
            </a>
            <span className={themeClasses.mutedText}> — {referenceAuthorLabel(paper)}{paper.year ? ` (${paper.year})` : ''}{paper.venue ? `, ${paper.venue}` : ''}</span>
          </li>
        ))}
      </ol>
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
  return useLearningMdxLesson().pageIndex === page ? <>{children}</> : null;
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

  // MDX compiles fenced code blocks to <pre><code className="language-xxx">...</code></pre>.
  // Inspect the child element to detect code blocks and hand them to CodeBlock.
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
    if (/^language-(?:python|bash|sh|shell|console|json|javascript|js|typescript|ts)(?:$|\s)/.test(codeClassName)) {
      return <CodeBlock code={rawText} variant="code" showLineNumbers themeClasses={themeClasses} />;
    }
  }

  // Non-matching code blocks: render as a normal <pre>.
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
  StageContinuityMap,
  ExperimentChecklist,
  SelfCheckList,
  ComparisonMatrix,
  PaperTradeoff,
  DatasetComposition,
  MetricBars,
  ConceptSpectrum,
  Cite,
  PaperSummary,
  LessonReferences,
  InlineMath,
  BlockMath,
  EquationCallout,
} satisfies Record<typeof SHARED_LEARNING_MDX_COMPONENT_NAMES[number], LearningMdxComponent>;

export const sharedLearningMdxComponents = {
  a: MdxLink,
  code: MdxCode,
  p: MdxParagraph,
  pre: MdxPre,
  ...sharedAuthoredMdxComponents,
};

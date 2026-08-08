import { AlertTriangle, Code2, Dice5, EyeOff, Info, ListChecks, Monitor, Terminal, Wrench, type LucideIcon } from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { createContext, isValidElement, useContext, type ComponentType, type ReactElement, type ReactNode } from 'react';
import type { AuthoredQuizPreview, LearningLessonExtra } from './authoredTypes';
import type { Language } from '../../lib/localization';
import { SHARED_LEARNING_MDX_COMPONENT_NAMES } from '../../core/learning/mdxContract';
import QuizBlock, { type QuizQuestionState } from './lesson/QuizBlock';
import { CodeBlock } from './code/CodeBlock';
import { cx, getLearningLabTheme } from './theme';

export type LearningThemeClasses = ReturnType<typeof getLearningLabTheme>;
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
  quizQuestionStates?: Record<string, QuizQuestionState>;
  onQuizQuestionStateChange?: (questionId: string, state: QuizQuestionState) => void;
} | null>(null);

const REDESIGNED_PROBABILITY_LESSON_IDS = new Set([
  'ch01-probability-origins',
  'ch01-experiments-events-sample-space',
  'ch01-event-relations',
  'ch01-probability-definitions-properties',
  'ch01-empirical-probability',
  'ch01-conditional-probability',
  'ch01-total-probability',
  'ch01-bayes-naive-bayes',
  'ch01-probability-exercises',
  'descriptive-data-analysis',
]);

function isRedesignedProbabilityLesson(domainId: string, lessonId: string): boolean {
  return domainId === 'statistics' && REDESIGNED_PROBABILITY_LESSON_IDS.has(lessonId);
}

export function LearningMdxThemeProvider({ children, themeClasses }: { children: ReactNode; themeClasses: LearningThemeClasses }) {
  return <LearningMdxThemeContext.Provider value={themeClasses}>{children}</LearningMdxThemeContext.Provider>;
}

export function LearningMdxLessonProvider({ children, domainId, lessonId, language, pageIndex, quizQuestionStates, onQuizQuestionStateChange }: {
  children: ReactNode;
  domainId: string;
  lessonId: string;
  language: Language;
  pageIndex: number;
  quizQuestionStates?: Record<string, QuizQuestionState>;
  onQuizQuestionStateChange?: (questionId: string, state: QuizQuestionState) => void;
}) {
  return <LearningMdxLessonContext.Provider value={{ domainId, lessonId, language, pageIndex, quizQuestionStates, onQuizQuestionStateChange }}>{children}</LearningMdxLessonContext.Provider>;
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

export function LessonNote({ children, label, tone = 'info', variant = 'note' }: {
  children?: ReactNode;
  label?: string;
  tone?: 'info' | 'warning';
  variant?: 'note' | 'objectives';
}) {
  const themeClasses = useLearningMdxTheme();
  const lessonContext = useLearningMdxLesson();
  if (variant === 'objectives') {
    return (
      <section className="grid w-full max-w-3xl gap-4 py-1">
        {label ? <MdxPageTitle>{label}</MdxPageTitle> : null}
        <div className={cx(
          "grid gap-3 leading-7 [&_p]:font-semibold [&_strong]:font-black [&_ul]:grid [&_ul]:list-none [&_ul]:gap-3 [&_ul]:pl-0 [&_li]:relative [&_li]:pl-8 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-1 [&_li]:before:grid [&_li]:before:h-5 [&_li]:before:w-5 [&_li]:before:place-items-center [&_li]:before:rounded-full [&_li]:before:text-xs [&_li]:before:font-black [&_li]:before:content-['✓']",
          themeClasses.bodyText,
          themeClasses.isLight
            ? '[&_li]:before:bg-[#DDEAF5] [&_li]:before:text-[#205089]'
            : '[&_li]:before:bg-[#A8D4FF]/10 [&_li]:before:text-[#A8D4FF]',
        )}>{children}</div>
      </section>
    );
  }
  if (label) {
    const isWarning = tone === 'warning';
    const LabelIcon = isWarning ? AlertTriangle : Info;
    return (
      <aside className={cx(
        'mt-5 w-full overflow-hidden rounded-xl border',
        isWarning
          ? themeClasses.isLight
            ? 'border-[#B7791F]/25 bg-[#FFF8E8] text-[#704B10]'
            : 'border-[#F2C66D]/30 bg-[#F2C66D]/10 text-[#FFE4A3]'
          : themeClasses.isLight
            ? 'border-[#205089]/14 bg-[#F5F9FD] text-[#123B68]'
            : 'border-[#A8D4FF]/18 bg-[#A8D4FF]/8 text-[#D7EAFE]',
      )}>
        <div className={cx(
          'flex items-center gap-2 border-b px-4 py-2.5 text-[0.68rem] font-black uppercase tracking-[0.14em]',
          isWarning
            ? themeClasses.isLight
              ? 'border-[#B7791F]/18 bg-[#F2C66D]/16 text-[#8A5B12]'
              : 'border-[#F2C66D]/22 bg-[#F2C66D]/8 text-[#F2C66D]'
            : themeClasses.isLight
              ? 'border-[#205089]/10 bg-[#205089]/7 text-[#205089]'
              : 'border-[#A8D4FF]/14 bg-[#A8D4FF]/7 text-[#A8D4FF]',
        )}>
          <LabelIcon className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
          <span>{label}</span>
        </div>
        <div className="grid gap-2 px-4 py-3.5 leading-7 [&_strong]:font-black">{children}</div>
      </aside>
    );
  }
  if (isRedesignedProbabilityLesson(lessonContext.domainId, lessonContext.lessonId)) {
    return (
      <aside className={cx(
        'flex w-full gap-3 rounded-lg px-4 py-3.5 leading-7',
        themeClasses.isLight ? 'bg-[#EAF1F7] text-[#254F70]' : 'bg-[#A8D4FF]/8 text-[#D7EAFE]',
      )}>
        <Info className={cx('mt-1 h-4 w-4 shrink-0', themeClasses.accentText)} strokeWidth={2.2} aria-hidden="true" />
        <div className="grid min-w-0 gap-2 [&_strong]:font-black [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-2 [&_ul]:pl-5">{children}</div>
      </aside>
    );
  }
  return <div className={cx('mt-5 grid w-full gap-2 rounded-lg px-4 py-3 text-sm font-semibold leading-6 [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-2 [&_ul]:pl-5', themeClasses.sectionAccent.note)}>{children}</div>;
}

export function MdxConceptContrast({ description, eyebrow, formula, leftLabel, leftText, rightLabel, rightText }: {
  description: string;
  eyebrow: string;
  formula?: string;
  leftLabel: string;
  leftText: string;
  rightLabel: string;
  rightText: string;
}) {
  const themeClasses = useLearningMdxTheme();
  const borderClass = themeClasses.isLight ? 'border-[#205089]/12' : 'border-[#A8D4FF]/16';
  const mutedSurface = themeClasses.isLight ? 'bg-[#F7FAFD]' : 'bg-[#A8D4FF]/5';
  return (
    <section className={cx(
      'overflow-hidden rounded-2xl border',
      borderClass,
      themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]/52',
    )}>
      <div className="px-5 py-5 sm:px-6">
        <div className={cx('mb-3 flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-[0.14em]', themeClasses.accentText)}>
          <span className={cx('grid h-8 w-8 place-items-center rounded-lg', themeClasses.isLight ? 'bg-[#205089]/9' : 'bg-[#A8D4FF]/10')}>
            <Dice5 className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
          </span>
          <span>{eyebrow}</span>
        </div>
        <p className={cx('w-full text-base font-semibold leading-7', themeClasses.bodyText)}>{description}</p>
      </div>
      <div className={cx('grid border-t md:grid-cols-2 md:divide-x', borderClass, themeClasses.isLight ? 'md:divide-[#205089]/12' : 'md:divide-[#A8D4FF]/16')}>
        <div className="flex gap-3 px-5 py-5 sm:px-6">
          <span className={cx('mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full', themeClasses.isLight ? 'bg-[#DDEAF5] text-[#205089]' : 'bg-[#A8D4FF]/10 text-[#A8D4FF]')}>
            <EyeOff className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
          </span>
          <div>
            <h3 className={cx('text-sm font-black', themeClasses.titleText)}>{leftLabel}</h3>
            <p className={cx('mt-1.5 text-sm leading-6', themeClasses.mutedText)}>{leftText}</p>
          </div>
        </div>
        <div className={cx('flex gap-3 border-t px-5 py-5 md:border-t-0 sm:px-6', borderClass)}>
          <span className={cx('mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full', themeClasses.isLight ? 'bg-[#E4F0E7] text-[#39724A]' : 'bg-[#78C990]/10 text-[#9DDBAF]')}>
            <ListChecks className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
          </span>
          <div>
            <h3 className={cx('text-sm font-black', themeClasses.titleText)}>{rightLabel}</h3>
            <p className={cx('mt-1.5 text-sm leading-6', themeClasses.mutedText)}>{rightText}</p>
          </div>
        </div>
      </div>
      {formula ? (
        <div className={cx('flex flex-col items-center justify-center gap-2 border-t px-5 py-4', borderClass, mutedSurface)}>
          <span className={cx('text-[0.68rem] font-black uppercase tracking-[0.12em]', themeClasses.mutedText)}>Không gian kết quả của xúc xắc</span>
          <span
            aria-label={formula}
            className={cx('max-w-full overflow-x-auto text-lg font-semibold', themeClasses.titleText)}
            dangerouslySetInnerHTML={{ __html: katex.renderToString(formula, { throwOnError: false }) }}
          />
        </div>
      ) : null}
    </section>
  );
}

export function MdxCode({ code, language = 'text' }: { code: string; language?: string }) {
  const themeClasses = useLearningMdxTheme();
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-white/12 bg-[#0B1220] shadow-[inset_0_0_0_1px_rgba(168,184,200,0.10)]">
      <div className="border-b border-white/10 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.09em] text-[#A8B8C8]">
        {language}
      </div>
      <pre className="max-w-full overflow-x-auto px-4 py-4 leading-7 text-[#E8F1FA]">
        <code className={cx('whitespace-pre font-mono text-[0.82rem] md:text-sm', themeClasses.focusRing)}>{code}</code>
      </pre>
    </div>
  );
}

export function MdxColumns({ children }: { children?: ReactNode }) {
  const themeClasses = useLearningMdxTheme();
  const childArray = Array.isArray(children) ? children : [children];
  const [left, right] = [childArray[0], childArray[1]];
  return (
    <div className="grid min-w-0 max-w-full gap-x-5 gap-y-5 md:grid-cols-2">
      <div className={cx('flex min-w-0 max-w-full flex-col justify-start gap-3 rounded-xl border p-5 text-sm leading-7', themeClasses.isLight ? 'border-[#205089]/12 bg-white' : 'border-[#A8D4FF]/14 bg-[#121A24]/40', themeClasses.bodyText, '[&_strong]:font-black')}>
        {left}
      </div>
      <div className="flex min-w-0 max-w-full flex-col justify-start gap-4">
        {right}
      </div>
    </div>
  );
}

export function MdxTable({
  caption,
  headers,
  rows,
}: {
  caption?: string;
  headers: string[];
  rows: (string | number)[][];
}) {
  const themeClasses = useLearningMdxTheme();
  return (
    <div className={cx(
      'my-3 w-full overflow-hidden rounded-xl border shadow-sm',
      themeClasses.isLight ? 'border-[#205089]/14 bg-white' : 'border-[#A8D4FF]/16 bg-[#121A24]/60',
    )}>
      {caption ? (
        <div className={cx(
          'flex items-center justify-between border-b px-4 py-2.5 text-xs font-black uppercase tracking-wider',
          themeClasses.isLight ? 'border-[#205089]/10 bg-[#EFF4FA] text-[#205089]' : 'border-[#A8D4FF]/12 bg-[#1A283C] text-[#A8D4FF]',
        )}>
          <span>{renderRichText(caption, themeClasses)}</span>
        </div>
      ) : null}
      <div className="w-full max-w-full overflow-x-auto">
        <table className="!table w-full min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className={cx(
              'border-b text-xs uppercase tracking-wider font-bold',
              themeClasses.isLight ? 'border-[#205089]/12 bg-[#EAF1F7] text-[#1C3A5E]' : 'border-[#A8D4FF]/14 bg-[#182638] text-[#D4E4F7]',
            )}>
              {headers.map((header, index) => (
                <th key={index} className="px-4 py-2.5 font-bold">{renderRichText(header, themeClasses)}</th>
              ))}
            </tr>
          </thead>
          <tbody className={cx('divide-y', themeClasses.isLight ? 'divide-black/5 text-[#243B53]' : 'divide-white/5 text-[#E2ECF8]')}>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={cx('transition-colors', themeClasses.isLight ? 'even:bg-[#F8FAFC]' : 'even:bg-[#15202D]/40')}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-2.5 font-medium">{renderRichText(String(cell), themeClasses)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function renderRichText(value: string, themeClasses: LearningThemeClasses): ReactNode {
  return value.split(/(\$[^$\n]+\$|`[^`]+`|“[^”]+”)/g).filter(Boolean).map((part, index) => {
    const isMath = part.startsWith('$') && part.endsWith('$');
    const isBacktickCode = part.startsWith('`') && part.endsWith('`');
    const isQuotedCode = part.startsWith('“') && part.endsWith('”');
    if (isMath) {
      const formula = part.slice(1, -1);
      return (
        <span
          key={`${index}-${part}`}
          aria-label={formula}
          className={cx('inline-block max-w-full px-0.5 align-middle', themeClasses.titleText)}
          dangerouslySetInnerHTML={{ __html: katex.renderToString(formula, { throwOnError: false }) }}
        />
      );
    }
    if (isBacktickCode || isQuotedCode) {
      return <code key={`${index}-${part}`} className={cx('rounded px-1.5 py-0.5 font-mono text-[0.88em] font-semibold', themeClasses.isLight ? 'bg-[#E8EEF5] text-[#123B68]' : 'bg-[#263B5B] text-[#DCE8F4]')}>{part.slice(1, -1)}</code>;
    }
    return <span key={`${index}-${part}`}>{part}</span>;
  });
}

export function MdxFormula({ formula, inline = false }: { formula: string; inline?: boolean }) {
  const themeClasses = useLearningMdxTheme();
  const renderedFormula = katex.renderToString(formula, {
    displayMode: !inline,
    throwOnError: false,
  });
  if (inline) {
    return (
      <span
        aria-label={formula}
        className={cx('inline-block max-w-full align-middle', themeClasses.titleText)}
        dangerouslySetInnerHTML={{ __html: renderedFormula }}
      />
    );
  }
  return (
    <div
      aria-label={formula}
      className={cx('max-w-full overflow-x-auto py-3 text-center text-base sm:text-lg', themeClasses.titleText)}
      dangerouslySetInnerHTML={{ __html: renderedFormula }}
    />
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
  return <p className={cx('w-full text-base leading-[1.625rem]', themeClasses.bodyText)}>{children}</p>;
}

function MdxPageTitle({ children }: { children?: ReactNode }) {
  const themeClasses = useLearningMdxTheme();
  return <h2 className={cx('text-pretty text-xl font-black leading-7', themeClasses.pageTitleText)}>{children}</h2>;
}

function MdxLink({ children, href }: { children?: ReactNode; href?: string }) {
  const themeClasses = useLearningMdxTheme();
  const isNumericCitation = typeof children === 'string' && /^\[\d+\]$/.test(children.trim());
  const isImageLink = isValidElement(children) && children.type === MdxImage;
  if (isImageLink) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={cx(
          'group mx-auto block w-fit max-w-full overflow-hidden rounded-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(18,59,104,0.14)]',
          themeClasses.focusRing,
        )}
      >
        {children}
      </a>
    );
  }
  if (isNumericCitation) {
    return <a href={href} target="_blank" rel="noreferrer" className={cx('underline-offset-2 transition-colors hover:underline', themeClasses.focusRing, themeClasses.isLight ? 'text-[#2F78B7]' : 'text-[#9CC7EF]')}>{children}</a>;
  }
  return <a href={href} target="_blank" rel="noreferrer" className={cx('inline-flex min-h-9 items-center rounded-lg border px-3 text-xs font-black leading-5 transition-colors', themeClasses.focusRing, themeClasses.isLight ? 'border-[#205089]/14 bg-[#F8FAFC] text-[#123B68] hover:bg-[#EEF4FA]' : 'border-[#A8B8C8]/16 bg-[#A8B8C8]/7 text-[#F2F6FA] hover:bg-[#A8B8C8]/11')}>{children}</a>;
}

function MdxImage({ alt = '', src }: { alt?: string; src?: string }) {
  return <img src={src} alt={alt} loading="lazy" className="max-h-[16rem] w-auto max-w-full rounded-lg object-contain transition-transform duration-300 group-hover:scale-[1.01] sm:max-h-[18rem]" />;
}

type AuthoredQuizQuestion = Omit<Extract<LearningLessonExtra, { kind: 'quiz' }>['questions'][number], 'title' | 'prompt' | 'options' | 'categories' | 'success' | 'error' | 'completeLabel' | 'preview'> & {
  title: string;
  prompt: string;
  options: Array<{ id: string; label: string; isCorrect?: boolean; categoryId?: string }>;
  categories?: Array<{ id: string; label: string }>;
  success: string;
  error: string;
  completeLabel?: string;
  preview?: Omit<AuthoredQuizPreview, 'caption'> & { caption?: string };
};

export function MdxQuiz({ id, questions }: { id: string; questions: AuthoredQuizQuestion[] }) {
  const themeClasses = useLearningMdxTheme();
  const lessonContext = useLearningMdxLesson();
  const question = questions[lessonContext.pageIndex];
  if (!question) return null;
  const localized = (value: string) => ({ en: value, vi: value });
  const extra: Extract<LearningLessonExtra, { kind: 'quiz' }> = {
    kind: 'quiz', id, sectionRefId: id, title: localized('Quiz'),
    questions: [{
      ...question,
      title: localized(question.title), prompt: localized(question.prompt),
      options: question.options.map((option) => ({ ...option, label: localized(option.label) })),
      categories: question.categories?.map((category) => ({ ...category, label: localized(category.label) })),
      success: localized(question.success), error: localized(question.error),
      completeLabel: question.completeLabel ? localized(question.completeLabel) : undefined,
      preview: question.preview
        ? { ...question.preview, caption: question.preview.caption ? localized(question.preview.caption) : undefined }
        : undefined,
    }],
  };
  return <QuizBlock extra={extra} language={lessonContext.language} quizQuestionStates={lessonContext.quizQuestionStates} themeClasses={themeClasses} onQuizQuestionStateChange={lessonContext.onQuizQuestionStateChange} />;
}

export function MdxPage({ children, page }: { children?: ReactNode; page: number }) {
  const lessonContext = useLearningMdxLesson();
  const themeClasses = useLearningMdxTheme();
  if (lessonContext.pageIndex !== page) return null;
  if (!isRedesignedProbabilityLesson(lessonContext.domainId, lessonContext.lessonId)) return <>{children}</>;
  return (
    <div className={cx(
      'grid w-full min-w-0 gap-5 [&_blockquote]:w-full [&_blockquote]:rounded-lg [&_blockquote]:px-4 [&_blockquote]:py-3 [&_h2]:text-pretty [&_h2]:leading-7 [&_h3]:border-b [&_h3]:pb-2 [&_h3]:pt-1 [&_h3]:text-pretty [&_p]:w-full [&_p]:text-pretty [&_table]:block [&_table]:w-full [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:rounded-lg [&_table]:border [&_table]:border-separate [&_table]:border-spacing-0 [&_td]:whitespace-nowrap [&_td]:px-3 [&_td]:py-2 [&_th]:whitespace-nowrap [&_th]:px-3 [&_th]:py-2',
      themeClasses.isLight
        ? '[&_blockquote]:bg-[#205089]/6 [&_h3]:border-[#205089]/10 [&_table]:border-[#205089]/12 [&_th]:bg-[#EAF1F7]'
        : '[&_blockquote]:bg-[#A8D4FF]/7 [&_h3]:border-[#A8D4FF]/12 [&_table]:border-[#A8D4FF]/14 [&_th]:bg-[#A8D4FF]/8',
    )}>
      {children}
    </div>
  );
}

function InlineMath({ formula }: { formula: string }) {
  const themeClasses = useLearningMdxTheme();
  const html = katex.renderToString(formula, { displayMode: false, throwOnError: false });
  return <span className={cx('px-0.5', themeClasses.bodyText)} dangerouslySetInnerHTML={{ __html: html }} />;
}

function BlockMath({ formula }: { formula: string }) {
  const themeClasses = useLearningMdxTheme();
  const html = katex.renderToString(formula, { displayMode: true, throwOnError: false });
  return (
    <div
      className={cx(
        'my-3 max-w-full overflow-x-auto rounded-lg border px-3 py-3 text-center text-base font-semibold sm:px-4 sm:text-lg',
        themeClasses.isLight
          ? 'border-[#205089]/14 bg-[#EFF4FA] text-[#123B68]'
          : 'border-[#A8B8C8]/18 bg-[#A8B8C8]/8 text-[#E5EEF8]',
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function MdxPre({ children }: { children?: ReactNode }) {
  const themeClasses = useLearningMdxTheme();

  // MDX compiles fenced code blocks to <pre><code className="language-xxx">...</code></pre>.
  // Inspect the child element to detect Python code blocks and hand them to CodeBlock.
  if (!isValidElement(children)) {
    return <pre>{children}</pre>;
  }

  const codeElement = children as ReactElement<{ className?: string; children?: ReactNode }>;
  const codeClassName = codeElement.props?.className;

  if (typeof codeClassName === 'string') {
    if (/^language-python(?:$|\s)/.test(codeClassName)) {
      const codeContent = codeElement.props?.children;
      const code = typeof codeContent === 'string' ? codeContent : '';
      return <CodeBlock code={code} variant="code" themeClasses={themeClasses} />;
    }
    if (/^language-(?:output|text)(?:$|\s)/.test(codeClassName)) {
      const codeContent = codeElement.props?.children;
      const code = typeof codeContent === 'string' ? codeContent : '';
      return <CodeBlock code={code} variant="output" themeClasses={themeClasses} />;
    }
  }

  // Non-Python or unlabeled code blocks: render as a normal <pre>.
  return <pre>{children}</pre>;
}

const sharedAuthoredMdxComponents = {
  LessonNote,
  MdxCode,
  MdxColumns,
  MdxConceptContrast,
  MdxFormula,
  MdxQuiz,
  MdxPage,
  MdxTable,
  RequirementCard,
  RequirementsGrid,
  InlineMath,
  BlockMath,
  div: 'div' as unknown as LearningMdxComponent,
} satisfies Record<typeof SHARED_LEARNING_MDX_COMPONENT_NAMES[number], LearningMdxComponent>;

export const sharedLearningMdxComponents = {
  a: MdxLink,
  h2: MdxPageTitle,
  img: MdxImage,
  p: MdxParagraph,
  pre: MdxPre,
  ...sharedAuthoredMdxComponents,
};

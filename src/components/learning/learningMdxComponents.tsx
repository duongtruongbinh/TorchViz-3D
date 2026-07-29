import { Code2, Monitor, Terminal, Wrench, type LucideIcon } from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { createContext, isValidElement, useContext, type ComponentType, type ReactElement, type ReactNode } from 'react';
import type { LearningLessonExtra } from './authoredTypes';
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

export function LessonNote({ children }: { children?: ReactNode }) {
  const themeClasses = useLearningMdxTheme();
  return <div className={cx('mt-5 grid gap-2 rounded-lg px-4 py-3 text-sm font-semibold leading-6 [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-2 [&_ul]:pl-5', themeClasses.sectionAccent.note)}>{children}</div>;
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
  return useLearningMdxLesson().pageIndex === page ? <>{children}</> : null;
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
        'my-4 overflow-x-auto rounded-lg border px-5 py-4 text-center text-lg font-semibold sm:text-xl',
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

  if (typeof codeClassName === 'string' && /^language-python(?:$|\s)/.test(codeClassName)) {
    const codeContent = codeElement.props.children;
    const code = typeof codeContent === 'string' ? codeContent : '';
    return <CodeBlock code={code} variant="code" themeClasses={themeClasses} />;
  }

  // Non-Python or unlabeled code blocks: render as a normal <pre>.
  return <pre>{children}</pre>;
}

const sharedAuthoredMdxComponents = {
  LessonNote,
  MdxQuiz,
  MdxPage,
  RequirementCard,
  RequirementsGrid,
  InlineMath,
  BlockMath,
} satisfies Record<typeof SHARED_LEARNING_MDX_COMPONENT_NAMES[number], LearningMdxComponent>;

export const sharedLearningMdxComponents = {
  a: MdxLink,
  p: MdxParagraph,
  pre: MdxPre,
  ...sharedAuthoredMdxComponents,
};

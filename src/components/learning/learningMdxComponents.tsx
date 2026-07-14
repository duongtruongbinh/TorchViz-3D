import { Code2, Monitor, Terminal, Wrench, type LucideIcon } from 'lucide-react';
import { createContext, useContext, type ComponentType, type ReactNode } from 'react';
import type { LearningLessonExtra } from '../../core/learning/types';
import type { Language } from '../../lib/localization';
import { SHARED_LEARNING_MDX_COMPONENT_NAMES } from '../../core/learning/content/mdxContract';
import QuizBlock, { type QuizQuestionState } from './lesson/QuizBlock';
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

export function RequirementCard({ children, icon = 'wrench', name, role }: { children?: ReactNode; icon?: string; name: string; role: string }) {
  const themeClasses = useLearningMdxTheme();
  const Icon = REQUIREMENT_ICONS[icon] ?? Wrench;
  const palette = themeClasses.isLight
    ? { card: 'border-[#205089]/12 bg-white', top: 'bg-[#F1F5F9]', icon: 'border border-[#205089]/12 bg-white text-[#123B68]' }
    : { card: 'border-[#A8B8C8]/14 bg-[#121A24]/36', top: 'bg-white/5', icon: 'border border-white/10 bg-white/7 text-[#F2F6FA]' };
  return (
    <section className={cx('grid h-full min-h-[20rem] grid-rows-[8rem_minmax(0,1fr)] overflow-hidden rounded-lg border shadow-[inset_0_1px_0_rgba(255,255,255,0.54)]', palette.card)}>
      <div className={cx('grid h-32 place-items-center border-b', palette.top, themeClasses.isLight ? 'border-black/5' : 'border-white/10')}>
        <div className={cx('grid h-14 w-14 place-items-center rounded-xl shadow-sm', palette.icon)}><Icon className="h-7 w-7" strokeWidth={2.1} aria-hidden="true" /></div>
      </div>
      <div className="grid content-start gap-3 p-4">
        <div><h3 className={cx('text-base font-black leading-6', themeClasses.titleText)}>{name}</h3><p className={cx('mt-0.5 text-sm font-semibold leading-6', themeClasses.mutedText)}>{role}</p></div>
        <div className={cx('grid gap-2 text-sm leading-6 [&_a]:font-black [&_a]:text-[#205089] [&_code]:block [&_code]:overflow-x-auto [&_code]:rounded-lg [&_code]:bg-[#0B1220] [&_code]:px-3 [&_code]:py-2 [&_code]:text-xs [&_code]:text-[#E5EEF8]', themeClasses.bodyText)}>{children}</div>
      </div>
    </section>
  );
}

export function LessonNote({ children }: { children?: ReactNode }) {
  const themeClasses = useLearningMdxTheme();
  return <div className={cx('mt-5 grid gap-2 rounded-lg px-4 py-3 text-sm font-semibold leading-6', themeClasses.sectionAccent.note)}>{children}</div>;
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
  return <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{children}</p>;
}

function MdxLink({ children, href }: { children?: ReactNode; href?: string }) {
  const themeClasses = useLearningMdxTheme();
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

const sharedAuthoredMdxComponents = {
  LessonNote,
  MdxQuiz,
  MdxPage,
  RequirementCard,
  RequirementsGrid,
} satisfies Record<typeof SHARED_LEARNING_MDX_COMPONENT_NAMES[number], LearningMdxComponent>;

export const sharedLearningMdxComponents = {
  a: MdxLink,
  p: MdxParagraph,
  ...sharedAuthoredMdxComponents,
};

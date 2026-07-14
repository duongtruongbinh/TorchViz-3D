import type { ReactNode } from 'react';
import { ArrowRight, BookOpen, GraduationCap, LibraryBig, Network } from 'lucide-react';

import { learningCatalog } from '../../../content/learning/index.ts';
import { getGroupedLearningLessonsForDomain } from '../../../core/learning/selectors';
import type { LearningDomain, LearningDomainId } from '../../../core/learning/types';
import { getStrings, type Language } from '../../../lib/localization';
import { getDomainText } from '../learningText';
import { cx, getLearningLabTheme, type LearningLabTheme } from '../theme';

type DomainCatalogProps = {
  language: Language;
  theme: LearningLabTheme;
  onOpenDomain: (domainId: LearningDomainId) => void;
};

export default function DomainCatalog({ language, theme, onOpenDomain }: DomainCatalogProps) {
  const strings = getStrings(language).learningLab;
  const home = strings.homePage;
  const themeClasses = getLearningLabTheme(theme);
  const isLight = themeClasses.isLight;
  const pageTone = isLight
    ? 'bg-white/[0.72]'
    : 'bg-[#172232]/[0.72]';
  const titleTone = isLight ? 'text-[#132033]' : themeClasses.titleText;
  const bodyTone = isLight ? 'text-[#42546A]' : themeClasses.bodyText;
  const labelTone = isLight ? 'text-[#245B8F]' : themeClasses.eyebrowText;
  const mutedTone = isLight ? 'text-[#6B7C91]' : themeClasses.mutedText;
  const syllabus = learningCatalog.domains.map((domain) => buildSyllabusItem(domain, language));
  const lessonCount = syllabus.reduce((total, item) => total + item.lessonCount, 0);

  return (
    <div className={cx('-m-3 min-h-full w-[calc(100%+1.5rem)] sm:-m-4 sm:w-[calc(100%+2rem)]', pageTone)}>
      <div className="mx-auto min-h-full w-full max-w-[1480px] px-3 py-4 sm:px-6 sm:py-6 lg:px-8 xl:px-10">
        <div className="min-w-0">
          <section className="relative overflow-hidden rounded-2xl bg-[#13283F] text-white shadow-[0_24px_64px_rgba(18,59,104,0.20)]">
            <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:44px_44px]" aria-hidden="true" />
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#5DA6D8]/20 blur-3xl" aria-hidden="true" />
            <div className="relative grid gap-7 px-5 py-7 sm:px-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] lg:items-center lg:px-10 lg:py-9 xl:gap-12 xl:px-12">
              <div>
                <div className="text-sm font-black uppercase tracking-[0.16em] text-[#9DD7F5]">{home.projectLabel}</div>
                <h1 className="mt-3 max-w-4xl text-[clamp(2rem,3.2vw,3.75rem)] font-black leading-[1.02] tracking-[-0.035em] text-white">
                  {home.simpleTitle}
                </h1>
              </div>

              <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-white/12 bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] lg:grid-cols-1">
                <CatalogMetric icon={<LibraryBig />} value={syllabus.length} label={strings.sidebarDomains} />
                <CatalogMetric icon={<BookOpen />} value={lessonCount} label={strings.lessonCount(lessonCount)} hideValueInLabel />
              </div>
            </div>
          </section>

          <section className="mt-4 grid overflow-hidden rounded-xl border border-[#205089]/12 bg-white/82 shadow-[0_12px_32px_rgba(33,66,105,0.08)] md:grid-cols-3" aria-label={home.projectLabel}>
            <Principle icon={<BookOpen />} title={home.idealVisualTitle} body={home.idealVisualBody} titleTone={titleTone} bodyTone={bodyTone} />
            <Principle icon={<Network />} title={home.idealLocalTitle} body={home.idealLocalBody} titleTone={titleTone} bodyTone={bodyTone} />
            <Principle icon={<GraduationCap />} title={home.idealHumanTitle} body={home.idealHumanBody} titleTone={titleTone} bodyTone={bodyTone} />
          </section>

          <section className="mt-8" aria-labelledby="learning-home-syllabus-title">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <SectionLabel text={home.syllabusLabel} toneClass={labelTone} />
                <h2 id="learning-home-syllabus-title" className={cx('mt-1 text-[clamp(1.55rem,2vw,2.25rem)] font-black leading-tight tracking-[-0.02em]', titleTone)}>
                  {home.syllabusTitle}
                </h2>
              </div>
              <p className={cx('max-w-xl text-sm leading-6 sm:text-right', mutedTone)}>{home.syllabusBody}</p>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              {syllabus.map((item, index) => (
                  <button
                    key={item.domain.id}
                    type="button"
                    onClick={() => onOpenDomain(item.domain.id)}
                    className={cx(
                      'group grid min-h-[190px] w-full grid-rows-[1fr_auto] border p-5 text-left transition-[border-color,background-color,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(32,80,137,0.13)]',
                      themeClasses.radius.card,
                      themeClasses.focusRing,
                      themeClasses.surface.interactiveCard,
                    )}
                  >
                    <span className="min-w-0">
                      <span className="flex items-start gap-3">
                        <span className={cx('text-sm font-black leading-tight', mutedTone)}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className={cx('min-w-0 flex-1 text-lg font-black leading-tight', titleTone)}>{item.title}</span>
                        <span className={cx('px-2.5 py-0.5 text-[11px] font-black', themeClasses.radius.pill, themeClasses.statusPill(item.domain.status === 'placeholder'))}>
                          {item.domain.status === 'placeholder' ? strings.domainPlaceholder : strings.domainAvailable}
                        </span>
                      </span>
                      <span className={cx('mt-3 line-clamp-2 block text-sm leading-6', bodyTone)}>{item.description}</span>
                    </span>
                    <span className="mt-4 flex items-center justify-between gap-3 border-t border-[#205089]/10 pt-3">
                      <span className="flex flex-wrap gap-2">
                        <Metric text={strings.lessonCount(item.lessonCount)} toneClass={mutedTone} />
                      </span>
                      <ArrowRight className={cx('h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1', themeClasses.accentText)} strokeWidth={2} aria-hidden="true" />
                    </span>
                  </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ text, toneClass }: { text: string; toneClass: string }) {
  return (
    <div className={cx('text-base font-black uppercase tracking-wide sm:text-lg', toneClass)}>
      {text}
    </div>
  );
}

function Metric({ text, toneClass }: { text: string; toneClass: string }) {
  return (
    <span className={cx('inline-flex items-center rounded-full bg-current/10 px-2.5 py-1 text-xs font-black', toneClass)}>
      {text}
    </span>
  );
}

function CatalogMetric({ icon, value, label, hideValueInLabel = false }: { icon: ReactNode; value: number; label: string; hideValueInLabel?: boolean }) {
  const normalizedLabel = hideValueInLabel ? label.replace(String(value), '').trim() : label;
  return (
    <div className="flex min-w-0 flex-col items-center justify-center gap-1 border-l border-white/10 px-3 py-4 text-center first:border-l-0 lg:flex-row lg:justify-start lg:gap-4 lg:border-l-0 lg:border-t lg:px-5 lg:text-left lg:first:border-t-0">
      <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#9DD7F5] lg:flex [&>svg]:h-5 [&>svg]:w-5" aria-hidden="true">{icon}</span>
      <span className="min-w-0">
        <span className="block text-2xl font-black tabular-nums text-white">{value}</span>
        <span className="block truncate text-xs font-bold text-[#E6F1F8]/66">{normalizedLabel}</span>
      </span>
    </div>
  );
}

function buildSyllabusItem(domain: LearningDomain, language: Language) {
  const groupedLessons = getGroupedLearningLessonsForDomain(learningCatalog, domain.id);
  const lessons = groupedLessons.flatMap((group) => group.lessons);
  const text = getDomainText(language, domain);

  return {
    domain,
    title: text.title,
    description: text.description,
    lessonCount: lessons.length,
  };
}

function Principle({
  icon,
  title,
  body,
  titleTone,
  bodyTone,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  titleTone: string;
  bodyTone: string;
}) {
  return (
    <div className="flex gap-4 border-t border-[#205089]/10 p-4 first:border-t-0 md:border-l md:border-t-0 md:p-5 md:first:border-l-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D7E8F5] text-[#255E88] [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className={cx('text-sm font-black leading-5', titleTone)}>{title}</h3>
        <p className={cx('mt-1 line-clamp-3 text-xs leading-5', bodyTone)}>{body}</p>
      </div>
    </div>
  );
}

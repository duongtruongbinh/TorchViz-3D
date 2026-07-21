import type { ReactNode } from 'react';
import { ArrowRight, BookOpen, GraduationCap, LibraryBig, Network } from 'lucide-react';

import { learningCatalog } from '../../../content/learning/index.ts';
import { getGroupedLearningLessonsForDomain } from '../../../core/learning/selectors';
import type { LearningDomain, LearningDomainId } from '../../../core/learning/types';
import { getStrings, type Language } from '../../../lib/localization';
import { DOMAIN_CARD_PALETTES, DOMAIN_ICONS } from '../domainPresentation';
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
                <h1 className="mt-3 w-full text-[clamp(2rem,3.2vw,3.75rem)] font-black leading-[1.02] tracking-[-0.035em] text-white">
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
            <h2 id="learning-home-syllabus-title" className={cx('text-[clamp(1.55rem,2vw,2.25rem)] font-black leading-tight tracking-[-0.02em]', titleTone)}>
              {home.syllabusLabel}
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {syllabus.map((item, index) => (
                <DomainCard
                  key={item.domain.id}
                  item={item}
                  index={index}
                  strings={strings}
                  themeClasses={themeClasses}
                  titleTone={titleTone}
                  bodyTone={bodyTone}
                  mutedTone={mutedTone}
                  onOpen={() => onOpenDomain(item.domain.id)}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
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

type SyllabusItem = ReturnType<typeof buildSyllabusItem>;
type LearningStrings = ReturnType<typeof getStrings>['learningLab'];
type ThemeClasses = ReturnType<typeof getLearningLabTheme>;

function DomainCard({
  item,
  index,
  strings,
  themeClasses,
  titleTone,
  bodyTone,
  mutedTone,
  onOpen,
}: {
  item: SyllabusItem;
  index: number;
  strings: LearningStrings;
  themeClasses: ThemeClasses;
  titleTone: string;
  bodyTone: string;
  mutedTone: string;
  onOpen: () => void;
}) {
  const DomainIcon = DOMAIN_ICONS[item.domain.id];
  const palette = DOMAIN_CARD_PALETTES[item.domain.id];

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cx(
        'group grid min-h-[410px] w-full grid-rows-[150px_1fr] overflow-hidden border p-0 text-left transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(32,80,137,0.15)]',
        themeClasses.radius.card,
        themeClasses.focusRing,
        themeClasses.surface.interactiveCard,
      )}
    >
      <span className={cx('relative grid place-items-center overflow-hidden border-b border-black/5', palette.visual)}>
        <span className={cx('absolute -right-9 -top-12 h-32 w-32 rounded-full blur-2xl', palette.glow)} aria-hidden="true" />
        <span className={cx('absolute -bottom-12 -left-8 h-28 w-28 rounded-full opacity-35', palette.glow)} aria-hidden="true" />
        <span className={cx('absolute left-0 top-0 h-1.5 w-full', palette.accent)} aria-hidden="true" />
        <span className="absolute left-4 top-4 text-xs font-black tabular-nums text-black/48">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className={cx('relative grid h-16 w-16 place-items-center rounded-2xl shadow-[0_12px_24px_rgba(30,42,56,0.12)] transition-transform duration-200 group-hover:scale-105 [&>svg]:h-8 [&>svg]:w-8', palette.icon)} aria-hidden="true">
          <DomainIcon strokeWidth={1.8} />
        </span>
      </span>

      <span className="flex min-h-0 flex-col p-4 sm:p-5">
        <span className="flex items-start justify-between gap-2">
          <span className={cx('min-w-0 flex-1 text-lg font-black leading-tight', titleTone)}>{item.title}</span>
          <span className={cx('shrink-0 px-2 py-0.5 text-[10px] font-black', themeClasses.radius.pill, themeClasses.statusPill(item.domain.status === 'placeholder'))}>
            {item.domain.status === 'placeholder' ? strings.domainPlaceholder : strings.domainAvailable}
          </span>
        </span>
        <span className={cx('mt-3 line-clamp-3 block text-sm leading-5', bodyTone)}>{item.description}</span>
        <span className="mt-auto flex items-end justify-between gap-3 border-t border-[#205089]/10 pt-4">
          <Metric text={strings.lessonCount(item.lessonCount)} toneClass={mutedTone} />
          <ArrowRight className={cx('mb-1 h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1', themeClasses.accentText)} strokeWidth={2} aria-hidden="true" />
        </span>
      </span>
    </button>
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

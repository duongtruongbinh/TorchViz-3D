import type { ReactNode } from 'react';
import { ArrowRight, BookOpen, GraduationCap, Network } from 'lucide-react';

import { learningCatalog } from '../../../core/learning/content';
import { getGroupedLearningLessonsForDomain } from '../../../core/learning/selectors';
import type { LearningDomain, LearningDomainId } from '../../../core/learning/types';
import { getStrings, type Language } from '../../../lib/localization';
import { getDomainText, getTrackText } from '../learningText';
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
  const panelTone = isLight
    ? 'bg-white/[0.72] shadow-[0_24px_70px_rgba(33,66,105,0.13)]'
    : 'bg-[#172232]/[0.72] shadow-[0_24px_70px_rgba(0,0,0,0.24)]';
  const tileTone = isLight
    ? [
        'border border-[#D8C59A]/55 bg-[#FFFBF0]/[0.84] shadow-[0_14px_30px_rgba(126,92,24,0.08)]',
        'border border-[#D8C59A]/55 bg-[#FFFBF0]/[0.84] shadow-[0_14px_30px_rgba(126,92,24,0.08)]',
        'border border-[#D8C59A]/55 bg-[#FFFBF0]/[0.84] shadow-[0_14px_30px_rgba(126,92,24,0.08)]',
      ]
    : [
        'border border-[#7DD3FC]/18 bg-[#0E2230]/[0.82] shadow-[0_14px_30px_rgba(0,0,0,0.18)]',
        'border border-[#7DD3FC]/18 bg-[#0E2230]/[0.82] shadow-[0_14px_30px_rgba(0,0,0,0.18)]',
        'border border-[#7DD3FC]/18 bg-[#0E2230]/[0.82] shadow-[0_14px_30px_rgba(0,0,0,0.18)]',
      ];
  const titleTone = isLight ? 'text-[#132033]' : themeClasses.titleText;
  const bodyTone = isLight ? 'text-[#42546A]' : themeClasses.bodyText;
  const labelTone = isLight ? 'text-[#245B8F]' : themeClasses.eyebrowText;
  const mutedTone = isLight ? 'text-[#6B7C91]' : themeClasses.mutedText;
  const dividerTone = isLight ? 'bg-[#8EA7C1]/55' : 'bg-[#A8B8C8]/32';
  const syllabus = learningCatalog.domains.map((domain) => buildSyllabusItem(domain, language));

  return (
    <div className={cx('-m-4 min-h-full w-[calc(100%+2rem)]', pageTone)}>
      <div className="mx-auto flex min-h-full w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <div className={cx('w-full p-4 sm:p-5', themeClasses.radius.panel, panelTone)}>
          <div className="min-w-0">
            <SectionLabel text={home.projectLabel} toneClass={labelTone} />
            <p className={cx('mt-3 max-w-none text-[clamp(0.88rem,1.05vw,1.08rem)] font-semibold leading-7', bodyTone)}>
              {home.goal}
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <Principle index="01" icon={<BookOpen className="h-6 w-6" strokeWidth={1.8} />} title={home.idealVisualTitle} body={home.idealVisualBody} toneClass={tileTone[0]} titleTone={titleTone} bodyTone={bodyTone} mutedTone={mutedTone} dividerTone={dividerTone} />
              <Principle index="02" icon={<Network className="h-6 w-6" strokeWidth={1.8} />} title={home.idealLocalTitle} body={home.idealLocalBody} toneClass={tileTone[1]} titleTone={titleTone} bodyTone={bodyTone} mutedTone={mutedTone} dividerTone={dividerTone} />
              <Principle index="03" icon={<GraduationCap className="h-6 w-6" strokeWidth={1.8} />} title={home.idealHumanTitle} body={home.idealHumanBody} toneClass={tileTone[2]} titleTone={titleTone} bodyTone={bodyTone} mutedTone={mutedTone} dividerTone={dividerTone} />
            </div>

            <section className="mt-7" aria-labelledby="learning-home-syllabus-title">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <SectionLabel text={home.syllabusLabel} toneClass={labelTone} />
                  <h1 id="learning-home-syllabus-title" className={cx('mt-2 text-[clamp(1.45rem,2vw,2rem)] font-black leading-tight', titleTone)}>
                    {home.syllabusTitle}
                  </h1>
                </div>
                <p className={cx('max-w-xl text-sm leading-6 sm:text-right', mutedTone)}>{home.syllabusBody}</p>
              </div>

              <div className="mt-5 grid gap-3">
                {syllabus.map((item, index) => (
                  <button
                    key={item.domain.id}
                    type="button"
                    onClick={() => onOpenDomain(item.domain.id)}
                    className={cx(
                      'group grid w-full gap-4 border p-4 text-left transition-transform duration-150 hover:-translate-y-0.5 md:grid-cols-[auto_minmax(0,1fr)_auto]',
                      themeClasses.radius.card,
                      themeClasses.focusRing,
                      themeClasses.surface.interactiveCard,
                    )}
                  >
                    <span className={cx('flex h-12 w-12 items-center justify-center text-sm font-black', themeClasses.radius.icon, themeClasses.iconTile)}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className={cx('text-base font-black leading-tight', titleTone)}>{item.title}</span>
                        <span className={cx('px-2.5 py-0.5 text-[11px] font-black', themeClasses.radius.pill, themeClasses.statusPill(item.domain.status === 'placeholder'))}>
                          {item.domain.status === 'placeholder' ? strings.domainPlaceholder : strings.domainAvailable}
                        </span>
                      </span>
                      <span className={cx('mt-1 block text-sm leading-6', bodyTone)}>{item.description}</span>
                      <span className="mt-3 flex flex-wrap gap-2">
                        <Metric text={strings.trackCount(item.trackCount)} toneClass={mutedTone} />
                        <Metric text={strings.lessonCount(item.lessonCount)} toneClass={mutedTone} />
                        <Metric text={strings.practiceCount(item.practiceCount)} toneClass={mutedTone} />
                      </span>
                      {item.previewTracks.length ? (
                        <span className="mt-3 flex flex-wrap gap-2">
                          {item.previewTracks.map((track) => (
                            <span
                              key={track.id}
                              className={cx(
                                'max-w-full truncate border px-2.5 py-1 text-xs font-bold',
                                themeClasses.radius.pill,
                                themeClasses.isLight ? 'border-[#205089]/14 bg-white/54 text-[#123B68]' : 'border-[#A8B8C8]/16 bg-[#A8B8C8]/10 text-[#F2F6FA]/74',
                              )}
                            >
                              {track.title}
                            </span>
                          ))}
                        </span>
                      ) : null}
                    </span>
                    <span className="flex items-center justify-end md:items-start">
                      <span className={cx('inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-black transition-colors', themeClasses.ctaPill)}>
                        {home.openSyllabusDomain}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.8} aria-hidden="true" />
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </div>
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

function buildSyllabusItem(domain: LearningDomain, language: Language) {
  const groupedLessons = getGroupedLearningLessonsForDomain(learningCatalog, domain.id);
  const tracks = groupedLessons.map((group) => group.track);
  const lessons = groupedLessons.flatMap((group) => group.lessons);
  const practiceCount = new Set(lessons.flatMap((lesson) => lesson.practice.map((practice) => practice.id))).size;
  const text = getDomainText(language, domain);

  return {
    domain,
    title: text.title,
    description: text.description,
    trackCount: tracks.length,
    lessonCount: lessons.length,
    practiceCount,
    previewTracks: tracks.slice(0, 3).map((track) => ({
      id: track.id,
      title: getTrackText(language, track).title,
    })),
  };
}

function Principle({
  index,
  icon,
  title,
  body,
  toneClass,
  titleTone,
  bodyTone,
  mutedTone,
  dividerTone,
}: {
  index: string;
  icon: ReactNode;
  title: string;
  body: string;
  toneClass: string;
  titleTone: string;
  bodyTone: string;
  mutedTone: string;
  dividerTone: string;
}) {
  return (
    <div className={cx('grid min-h-[280px] grid-rows-[auto_auto_auto_1fr] rounded-xl p-5', toneClass)}>
      <div className="flex items-center justify-between gap-3">
        <div className={cx('flex h-12 w-12 items-center justify-center rounded-lg bg-current/10', mutedTone)}>
          {icon}
        </div>
        <span className={cx('text-sm font-black', mutedTone)}>{index}</span>
      </div>
      <h3 className={cx('mt-6 text-[clamp(1.25rem,1.55vw,1.5rem)] font-black leading-tight', titleTone)}>{title}</h3>
      <div className={cx('mt-4 h-0.5 w-full rounded-full', dividerTone)} />
      <p className={cx('mt-5 text-[clamp(0.92rem,1.02vw,1rem)] leading-7', bodyTone)}>{body}</p>
    </div>
  );
}

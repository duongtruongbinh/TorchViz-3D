import { useState } from 'react';
import { BookOpen, Check, ChevronDown, Clock3, FileText, Globe2 } from 'lucide-react';

import type { LearningDomain, LearningLesson, LearningTrack } from '../../../core/learning/types';
import { getStrings, type Language } from '../../../lib/localization';
import { getDomainText, getTrackText, getUnifiedLessonText } from '../learningText';
import { cx, getLearningLabTheme, type LearningLabTheme } from '../theme';

type DomainCoursePageProps = {
  domain: LearningDomain;
  tracks: LearningTrack[];
  lessons: LearningLesson[];
  language: Language;
  theme: LearningLabTheme;
  onOpenLesson: (track: LearningTrack, lesson: LearningLesson) => void;
};

type TrackCourseSection = {
  track: LearningTrack;
  lessons: LearningLesson[];
};

export default function DomainCoursePage({
  domain,
  tracks,
  lessons,
  language,
  theme,
  onOpenLesson,
}: DomainCoursePageProps) {
  const strings = getStrings(language).learningLab;
  const themeClasses = getLearningLabTheme(theme);
  const domainText = getDomainText(language, domain);
  const lessonCount = lessons.length;
  const copy = getCourseCopy(strings.coursePage, language, domainText, tracks);
  const learnItems = buildLearnItems(strings.coursePage, lessons, tracks, language);
  const courseSections = tracks.map((track) => ({
    track,
    lessons: track.lessonIds
      .map((lessonId) => lessons.find((lesson) => lesson.id === lessonId))
      .filter((lesson): lesson is LearningLesson => Boolean(lesson)),
  }));
  const totalMinutes = lessons.reduce((sum, lesson) => sum + readMinutes(getUnifiedLessonText(language, lesson).duration), 0);

  return (
    <section className={cx('-mx-4 -mb-4 -mt-4 min-h-full w-[calc(100%+2rem)] shadow-[0_20px_55px_rgba(18,24,36,0.10)]', themeClasses.page)}>
      <div className="relative bg-[#121A24] text-[#F2F6FA]">
        <div className="relative">
          <div className="grid gap-7 px-6 pb-10 pt-8 sm:px-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-14 lg:pb-14">
            <div>
              <div
                role="heading"
                aria-level={1}
                className="max-w-4xl text-[1.65rem] font-black leading-tight text-[#F2F6FA]/82 sm:text-[2rem] lg:text-[2.25rem]"
              >
                {copy.title}
              </div>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[#F2F6FA]/82 sm:text-lg">
                {copy.subtitle}
              </p>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#F2F6FA]/82 sm:text-sm">
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                  {copy.updated}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Globe2 className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                  {language === 'vi' ? strings.coursePage.languageVietnamese : strings.coursePage.languageEnglish}
                </span>
                <span className="inline-flex items-center gap-2">
                  <BookOpen className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                  {strings.lessonCount(lessonCount)}
                </span>
              </div>
            </div>

            <div className="self-start rounded-xl bg-white/[0.06] p-4 text-[#F2F6FA]/86 shadow-[inset_0_0_0_1px_rgba(242,246,250,0.10)]">
              <div className="text-sm font-black uppercase tracking-wide text-[#7DD3FC]">{copy.requirementsTitle}</div>
              <ul className="mt-3 grid gap-2 text-sm leading-6">
                {copy.requirements.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A8B8C8]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>

      <div className="grid gap-5 px-6 pb-0 pt-6 sm:px-10 lg:px-14">
        <div className="grid gap-5">
          <div className="pb-0 pt-4 sm:pb-0 sm:pt-5">
            <h2 className={cx('text-2xl font-black', themeClasses.titleText)}>{copy.descriptionTitle}</h2>
            <div className={cx('mt-4 grid gap-4 text-sm leading-7', themeClasses.bodyText)}>
              {copy.description.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>

          <div
            className={cx(
              'border p-6 sm:p-7',
              themeClasses.radius.card,
              themeClasses.isLight ? 'border-[#205089]/14' : 'border-[#A8B8C8]/20',
            )}
          >
            <h2 className={cx('text-2xl font-black', themeClasses.titleText)}>{copy.whatYouWillLearn}</h2>
            <div className="mt-5 grid gap-x-7 gap-y-3 md:grid-cols-2">
              {learnItems.map((item) => (
                <div key={item} className={cx('flex gap-3 text-sm leading-6', themeClasses.bodyText)}>
                  <Check className="mt-1 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="py-4 sm:py-5">
            <h2 className={cx('text-2xl font-black', themeClasses.titleText)}>{copy.courseContent}</h2>
            <p className={cx('mt-2 text-sm', themeClasses.mutedText)}>
              {copy.courseSummary({ lessons: lessonCount, minutes: totalMinutes })}
            </p>
            <div className={cx('mt-4 overflow-hidden border', themeClasses.radius.card, themeClasses.surface.card)}>
              {courseSections.map((section) => (
                <CourseContentSection
                  key={section.track.id}
                  section={section}
                  language={language}
                  theme={theme}
                  onOpenLesson={onOpenLesson}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
      <footer
        className={cx(
          'mt-8 flex min-h-28 items-center px-6 py-8 sm:px-10 lg:px-14',
          themeClasses.isLight ? 'bg-[#172232] text-[#F2F6FA]' : 'bg-[#0D141E] text-[#F2F6FA]',
        )}
      >
        <span className="text-xl font-black tracking-tight">Future HMI</span>
      </footer>
    </section>
  );
}

function CourseContentSection({
  section,
  language,
  theme,
  onOpenLesson,
}: {
  section: TrackCourseSection;
  language: Language;
  theme: LearningLabTheme;
  onOpenLesson: (track: LearningTrack, lesson: LearningLesson) => void;
}) {
  const strings = getStrings(language).learningLab;
  const themeClasses = getLearningLabTheme(theme);
  const trackText = getTrackText(language, section.track);
  const minutes = section.lessons.reduce((sum, lesson) => sum + readMinutes(getUnifiedLessonText(language, lesson).duration), 0);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-[#205089]/14 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsExpanded((value) => !value)}
        aria-expanded={isExpanded}
        className={cx(
          'grid w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-3 px-4 py-4 text-left',
          themeClasses.focusRing,
          themeClasses.isLight ? 'bg-[#B8C8DA]/48 hover:bg-[#B8C8DA]/70' : 'bg-[#172232] hover:bg-[#223247]',
        )}
      >
        <ChevronDown className={cx('mt-1 h-4 w-4 shrink-0 transition-transform', !isExpanded && '-rotate-90')} strokeWidth={2.2} aria-hidden="true" />
        <span className="min-w-0">
          <span className={cx('block font-black', themeClasses.titleText)}>{trackText.title}</span>
          <span className={cx('mt-1 block text-sm', themeClasses.mutedText)}>
            {strings.coursePage.trackSummary({ lessons: section.lessons.length, minutes, description: trackText.description })}
          </span>
        </span>
      </button>
      <div className={isExpanded ? 'block' : 'hidden'}>
        {section.lessons.map((lesson) => {
          const lessonText = getUnifiedLessonText(language, lesson);
          return (
            <button
              key={lesson.id}
              type="button"
              onClick={() => onOpenLesson(section.track, lesson)}
              className={cx(
                'grid w-full grid-cols-[auto_minmax(0,1fr)_auto] gap-3 border-t border-[#205089]/14 px-5 py-3 text-left text-sm transition-colors',
                themeClasses.focusRing,
                themeClasses.isLight ? 'hover:bg-[#B8C8DA]/40' : 'hover:bg-[#223247]/72',
              )}
            >
              <FileText className={cx('mt-0.5 h-4 w-4', themeClasses.mutedText)} strokeWidth={1.8} aria-hidden="true" />
              <span className="min-w-0">
                <span className={cx('block truncate', themeClasses.bodyText)}>{lessonText.title}</span>
              </span>
              <span className={cx('whitespace-nowrap', themeClasses.mutedText)}>{lessonText.duration}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function buildLearnItems(
  courseText: ReturnType<typeof getStrings>['learningLab']['coursePage'],
  lessons: LearningLesson[],
  tracks: LearningTrack[],
  language: Language,
): string[] {
  const lessonTitles = lessons.map((lesson) => getUnifiedLessonText(language, lesson).title);
  const items = lessonTitles.map((title) => courseText.masterLesson(title));

  if (!items.length) {
    return tracks.map((track) => {
      const trackText = getTrackText(language, track);
      return trackText.description || trackText.title;
    }).filter(Boolean).slice(0, 8);
  }

  return Array.from(new Set(items)).slice(0, 8);
}

function readMinutes(duration: string): number {
  const match = duration.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function getCourseCopy(
  courseText: ReturnType<typeof getStrings>['learningLab']['coursePage'],
  language: Language,
  domainText: { title: string; description: string },
  tracks: LearningTrack[],
) {
  const trackNames = tracks.map((track) => getTrackText(language, track).title).filter(Boolean);
  const joinedTracks = formatList(trackNames, language);

  return {
    title: domainText.title,
    subtitle: domainText.description,
    updated: courseText.updated,
    whatYouWillLearn: courseText.whatYouWillLearn,
    courseContent: courseText.courseContent,
    courseSummary: courseText.courseSummary,
    requirementsTitle: courseText.generic.requirementsTitle,
    requirements: courseText.generic.requirements,
    descriptionTitle: courseText.generic.descriptionTitle,
    description: [
      domainText.description,
      joinedTracks ? courseText.generic.organizedDescription(joinedTracks) : courseText.generic.placeholderDescription,
      courseText.generic.goalDescription,
    ],
  };
}

function formatList(items: string[], language: Language): string {
  if (items.length <= 1) return items[0] ?? '';
  const conjunction = language === 'vi' ? 'và' : 'and';
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, ${conjunction} ${items[items.length - 1]}`;
}

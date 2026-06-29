import { useState } from 'react';
import { BookOpen, Check, ChevronDown, Clock3, FileText, Globe2 } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const practiceCount = new Set(lessons.flatMap((lesson) => lesson.practice.map((practice) => practice.id))).size;
  const lessonCount = lessons.length;
  const copy = getCourseCopy(language, domain, domainText, tracks);
  const learnItems = buildLearnItems(lessons, tracks, language);
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
          <div className="px-6 pb-10 pt-8 sm:px-10 lg:px-14 lg:pb-14">
            <nav className="flex flex-wrap items-center gap-2 text-xs font-black text-[#A8B8C8] sm:text-sm" aria-label={copy.breadcrumbLabel}>
              <Link className="transition-colors hover:text-[#F2F6FA] hover:underline hover:underline-offset-2" to="/learning">
                {strings.searchLabel}
              </Link>
              <span className="text-[#F2F6FA]/45">&gt;</span>
              <Link className="transition-colors hover:text-[#F2F6FA] hover:underline hover:underline-offset-2" to={`/learning/${domain.id}`}>
                {domainText.title}
              </Link>
            </nav>

            <div
              role="heading"
              aria-level={1}
              className="mt-7 max-w-4xl text-[1.65rem] font-black leading-tight text-[#F2F6FA]/82 sm:text-[2rem] lg:text-[2.25rem]"
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
                {language === 'vi' ? 'Tiếng Việt' : 'English'}
              </span>
              <span className="inline-flex items-center gap-2">
                <BookOpen className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                {strings.lessonCount(lessonCount)}
              </span>
            </div>
          </div>

        </div>
      </div>

      <div className="grid gap-5 px-6 pb-0 pt-6 sm:px-10 lg:px-14">
        <div className="grid gap-5">
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
              {copy.courseSummary(lessonCount, totalMinutes, practiceCount)}
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

          <div className="py-6 sm:py-7">
            <h2 className={cx('text-2xl font-black', themeClasses.titleText)}>{copy.requirementsTitle}</h2>
            <ul className={cx('mt-4 grid gap-2 text-sm leading-6', themeClasses.bodyText)}>
              {copy.requirements.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#205089]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pb-0 pt-4 sm:pb-0 sm:pt-5">
            <h2 className={cx('text-2xl font-black', themeClasses.titleText)}>{copy.descriptionTitle}</h2>
            <div className={cx('mt-4 grid gap-4 text-sm leading-7', themeClasses.bodyText)}>
              {copy.description.map((item) => (
                <p key={item}>{item}</p>
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
            {strings.lessonCount(section.lessons.length)} - {minutes} min - {trackText.description}
          </span>
        </span>
      </button>
      <div className={isExpanded ? 'block' : 'hidden'}>
        {section.lessons.map((lesson) => {
          const lessonText = getUnifiedLessonText(language, lesson);
          const practiceLabel = lesson.practice[0] ? getPracticeLabel(lesson.practice[0]) : null;
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
                {practiceLabel ? <span className={cx('mt-1 block text-xs', themeClasses.mutedText)}>{practiceLabel}</span> : null}
              </span>
              <span className={cx('whitespace-nowrap', themeClasses.mutedText)}>{lessonText.duration}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function buildLearnItems(lessons: LearningLesson[], tracks: LearningTrack[], language: Language): string[] {
  const lessonTitles = lessons.map((lesson) => getUnifiedLessonText(language, lesson).title);
  const concepts = lessons
    .flatMap((lesson) => lesson.practice)
    .map((practice) => {
      if ('targetConcept' in practice) return practice.targetConcept;
      if ('targetOperation' in practice) return practice.targetOperation;
      return null;
    })
    .filter((item): item is string => Boolean(item));

  const items = [
    ...lessonTitles.map((title) => `${language === 'vi' ? 'Nắm chắc' : 'Master'} ${title}.`),
    ...concepts,
  ];

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

function getPracticeLabel(practice: LearningLesson['practice'][number]): string {
  if ('targetConcept' in practice) return practice.targetConcept;
  return practice.targetOperation;
}

function getCourseCopy(language: Language, domain: LearningDomain, domainText: { title: string; description: string }, tracks: LearningTrack[]) {
  if (domain.id === 'reinforcement-learning' && language === 'vi') {
    return {
      breadcrumbLabel: 'Course breadcrumb',
      title: 'Reinforcement Learning for Neural Network Builders',
      subtitle: 'Đi từ MDP, Bellman values, Q-table đến Q-Learning và SARSA bằng các bài học ngắn, trực quan, có practice ngay trong TorchViz-3D.',
      updated: 'Last updated 6/2026',
      whatYouWillLearn: "What you'll learn",
      courseContent: 'Course content',
      courseSummary: (lessons: number, minutes: number, practice: number) => `${lessons} lessons - ${minutes} min - ${practice} practice items`,
      requirementsTitle: 'Requirements',
      requirements: [
        'You can read basic Python-like model code.',
        'You know tensors or are willing to learn by tracing them visually.',
        'No prior reinforcement learning implementation is required.',
      ],
      descriptionTitle: 'Description',
      description: [
        'This path teaches reinforcement learning the same way TorchViz teaches model structure: one small system at a time, with the important state and value flow visible.',
        'You will start with the vocabulary of an MDP, then connect Bellman updates to concrete Q-table entries before comparing off-policy Q-Learning with on-policy SARSA.',
        'The goal is not to memorize formulas. The goal is to build enough intuition to inspect an RL loop and understand why an update moved a value in a specific direction.',
      ],
    };
  }

  if (domain.id === 'reinforcement-learning') {
    return {
      breadcrumbLabel: 'Course breadcrumb',
      title: 'Reinforcement Learning for Neural Network Builders',
      subtitle: 'Move from MDPs, Bellman values, and Q-tables into Q-Learning and SARSA with short visual lessons and inline TorchViz-3D practice.',
      updated: 'Last updated 6/2026',
      whatYouWillLearn: "What you'll learn",
      courseContent: 'Course content',
      courseSummary: (lessons: number, minutes: number, practice: number) => `${lessons} lessons - ${minutes} min - ${practice} practice items`,
      requirementsTitle: 'Requirements',
      requirements: [
        'You can read basic Python-like model code.',
        'You know tensors or are willing to learn by tracing them visually.',
        'No prior reinforcement learning implementation is required.',
      ],
      descriptionTitle: 'Description',
      description: [
        'This path teaches reinforcement learning the same way TorchViz teaches model structure: one small system at a time, with the important state and value flow visible.',
        'You will start with the vocabulary of an MDP, then connect Bellman updates to concrete Q-table entries before comparing off-policy Q-Learning with on-policy SARSA.',
        'The goal is not to memorize formulas. The goal is to build enough intuition to inspect an RL loop and understand why an update moved a value in a specific direction.',
      ],
    };
  }

  const trackNames = tracks.map((track) => getTrackText(language, track).title).filter(Boolean);
  const joinedTracks = formatList(trackNames);

  return {
    breadcrumbLabel: 'Course breadcrumb',
    title: domainText.title,
    subtitle: domainText.description,
    updated: 'Last updated 6/2026',
    whatYouWillLearn: "What you'll learn",
    courseContent: 'Course content',
    courseSummary: (lessons: number, minutes: number, practice: number) => `${lessons} lessons - ${minutes} min - ${practice} practice items`,
    requirementsTitle: 'Requirements',
    requirements: [
      'You can read basic Python-like model code.',
      'You know tensors or are willing to learn by tracing them visually.',
      'No prior implementation in this domain is required.',
    ],
    descriptionTitle: 'Description',
    description: [
      domainText.description,
      joinedTracks ? `This path is organized around ${joinedTracks}, with short visual lessons and inline TorchViz-3D practice where content is available.` : 'This path is prepared as part of Learning Lab and will expand as more lessons are added.',
      'The goal is to build enough intuition to inspect model behavior visually instead of memorizing formulas or framework boilerplate.',
    ],
  };
}

function formatList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

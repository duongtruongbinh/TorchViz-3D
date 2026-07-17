import { useEffect, useRef } from 'react';
import { ChevronDown, PanelLeftClose, Search, X } from 'lucide-react';

import type { GroupedLearningLessons } from '../../../core/learning/selectors';
import type { LearningLesson, LearningTrack } from '../../../core/learning/types';
import { normalizeLearningSearch } from '../../../core/learning/mdxContract';
import { getLearningSearchDocument } from '../learningSearch';
import { getStrings, type Language } from '../../../lib/localization';
import { getTrackText, getUnifiedLessonText } from '../learningText';
import { cx, getLearningLabTheme, type LearningLabTheme } from '../theme';
import LessonNode from './LessonNode';

export type LessonRailFilter = 'all' | 'ready' | 'locked';

export type FilteredLearningLessonGroup = {
  track: LearningTrack;
  lessons: LearningLesson[];
  totalLessonCount: number;
};

export type LessonRailProps = {
  groups: FilteredLearningLessonGroup[];
  collapsedTrackIds: Set<string>;
  completedLessonIds: Set<string>;
  isFiltered: boolean;
  language: Language;
  chapterLessonIndexById: Map<string, number>;
  searchQuery: string;
  selectedLesson: LearningLesson;
  selectedFilter: LessonRailFilter;
  theme: LearningLabTheme;
  isRailOpen?: boolean;
  onClearSearch: () => void;
  onToggleRail?: () => void;
  onSearchChange: (value: string) => void;
  onSelectFilter: (filter: LessonRailFilter) => void;
  onSelectLesson: (lessonId: string) => void;
  onToggleTrack: (trackId: string) => void;
};

const LESSON_RAIL_FILTERS: LessonRailFilter[] = ['all', 'ready', 'locked'];
export default function LessonRail({
  groups,
  collapsedTrackIds,
  completedLessonIds,
  isFiltered,
  language,
  chapterLessonIndexById,
  searchQuery,
  selectedLesson,
  selectedFilter,
  theme,
  isRailOpen,
  onClearSearch,
  onToggleRail,
  onSearchChange,
  onSelectFilter,
  onSelectLesson,
  onToggleTrack,
}: LessonRailProps) {
  const strings = getStrings(language).learningLab;
  const themeClasses = getLearningLabTheme(theme);
  const railRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!railRef.current) return;
    const selectedEl = railRef.current.querySelector(`[data-lesson-id="${selectedLesson.id}"]`);
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [selectedLesson.id]);

  return (
    <aside ref={railRef} className="custom-scrollbar learning-lab-scrollbar flex max-h-full justify-center overflow-auto pr-1">
      <div className="grid w-full max-w-[280px] content-start gap-4">
        <div
          className={cx(
            'grid gap-2 border-b pb-4',
            themeClasses.isLight ? 'border-[#205089]/10' : 'border-[#A8B8C8]/12',
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <div
              className={cx(
                'flex h-11 min-w-0 flex-1 items-center gap-2 border px-3 shadow-[0_6px_16px_rgba(18,59,104,0.06)]',
                themeClasses.radius.button,
                themeClasses.isLight
                  ? 'border-[#205089]/14 bg-white/68 text-[#123B68]'
                  : 'border-[#A8B8C8]/18 bg-[#172232]/72 text-[#F2F6FA]/82',
              )}
            >
              <Search className="h-4 w-4 shrink-0 opacity-70" strokeWidth={2} aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                className="learning-lab-rail-search-input min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-current placeholder:opacity-50"
                placeholder={strings.lessonSearchPlaceholder}
                aria-label={strings.lessonSearchPlaceholder}
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={onClearSearch}
                  className={cx('flex h-7 w-7 shrink-0 items-center justify-center transition-colors', themeClasses.radius.icon, getRailIconButtonClass(themeClasses))}
                  title={strings.clearLessonSearch}
                  aria-label={strings.clearLessonSearch}
                >
                  <X className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
                </button>
              ) : null}
            </div>
            {onToggleRail ? (
              <button
                type="button"
                onClick={onToggleRail}
                className={themeClasses.rail.railToggleButton}
                title={strings.lessonRailCloseLabel}
                aria-label={strings.lessonRailCloseLabel}
                aria-expanded={isRailOpen}
              >
                <PanelLeftClose className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
              </button>
            ) : null}
          </div>
          <div
            className="flex min-w-0 items-center gap-1.5"
            role="group"
            aria-label={strings.lessonFilterLabel}
          >
            {LESSON_RAIL_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => onSelectFilter(filter)}
                className={getRailFilterButtonClass(themeClasses, selectedFilter === filter)}
                aria-pressed={selectedFilter === filter}
              >
                {strings.lessonFilters[filter]}
              </button>
            ))}
          </div>
        </div>

        {groups.length === 0 ? (
          <div className={cx('border p-3 text-sm font-black leading-6', themeClasses.radius.card, themeClasses.surface.card, themeClasses.mutedText)}>
            {strings.lessonFilterEmpty}
          </div>
        ) : null}

        {groups.map(({ track, lessons, totalLessonCount }) => {
          const isCollapsed = collapsedTrackIds.has(track.id);
          const isCurrentTrack = track.id === selectedLesson.trackId;
          return (
            <div key={track.id} className="grid gap-1.5">
              <button
                type="button"
                onClick={() => onToggleTrack(track.id)}
                aria-expanded={!isCollapsed}
                className={cx(
                  'group -ml-1 flex w-full items-center gap-2 px-0.5 text-left text-[17px] font-black leading-7 transition-colors duration-200',
                  themeClasses.focusRing,
                  themeClasses.rail.trackHeading(isCurrentTrack),
                )}
              >
                <ChevronDown
                  className={cx(
                    'h-5 w-5 shrink-0 transition-transform duration-200',
                    isCollapsed && '-rotate-90',
                    !isCurrentTrack && 'opacity-60',
                  )}
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                <span className={cx('min-w-0', themeClasses.rail.trackTitle(isCurrentTrack))}>
                  {getTrackText(language, track).title}
                </span>
                {isFiltered ? (
                  <span className={getRailCountClass(themeClasses)}>
                    {strings.lessonFilterCount(lessons.length, totalLessonCount)}
                  </span>
                ) : null}
              </button>
              {!isCollapsed ? (
                <div className="ml-5 grid gap-0">
                  {lessons.map((lesson, lessonIndex) => {
                    const index = chapterLessonIndexById.get(lesson.id) ?? lessonIndex;
                    const nextLesson = lessons[lessonIndex + 1] ?? null;
                    const isCompleted = completedLessonIds.has(lesson.id);
                    const isConnectorCompleted = isCompleted && Boolean(nextLesson && completedLessonIds.has(nextLesson.id));
                    return (
                      <LessonNode
                        key={lesson.id}
                        lesson={lesson}
                        index={index}
                        isCompleted={isCompleted}
                        isConnectorCompleted={isConnectorCompleted}
                        isLast={lessonIndex === lessons.length - 1}
                        isSelected={lesson.id === selectedLesson.id}
                        isTrackActive={isCurrentTrack}
                        language={language}
                        theme={theme}
                        onSelect={onSelectLesson}
                      />
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

type LearningThemeClasses = ReturnType<typeof getLearningLabTheme>;

function getRailFilterButtonClass(themeClasses: LearningThemeClasses, isActive: boolean): string {
  return cx(
    'flex h-8 min-w-0 flex-1 items-center justify-center px-2 text-[11px] font-black transition-colors',
    isActive ? 'learning-lab-rail-filter-button-active' : 'learning-lab-rail-filter-button-idle',
    themeClasses.radius.button,
    themeClasses.focusRing,
    isActive
      ? themeClasses.isLight
        ? 'border border-[#2F6F9F]/18 bg-[#D7E8F5] text-[#255E88] shadow-[inset_0_0_0_1px_rgba(47,111,159,0.10)]'
        : 'bg-[#D7DCE2] text-[#121A24] shadow-[0_5px_14px_rgba(0,0,0,0.18)]'
      : themeClasses.isLight
        ? 'text-[#123B68]/58 hover:bg-white/58 hover:text-[#123B68]'
        : 'text-[#F2F6FA]/54 hover:bg-[#A8B8C8]/10 hover:text-[#F2F6FA]',
  );
}

function getRailIconButtonClass(themeClasses: LearningThemeClasses): string {
  return cx(
    themeClasses.focusRing,
    themeClasses.isLight
      ? 'text-[#123B68]/58 hover:bg-[#205089]/10 hover:text-[#123B68]'
      : 'text-[#F2F6FA]/54 hover:bg-[#A8B8C8]/12 hover:text-[#F2F6FA]',
  );
}

function getRailCountClass(themeClasses: LearningThemeClasses): string {
  return cx(
    'ml-auto shrink-0 rounded-full border px-1.5 py-0.5 text-[11px] font-black tabular-nums',
    themeClasses.isLight
      ? 'border-[#205089]/12 bg-white/52 text-[#123B68]/62'
      : 'border-[#A8B8C8]/14 bg-[#A8B8C8]/8 text-[#F2F6FA]/58',
  );
}

export function filterLessonRailGroups(
  groups: GroupedLearningLessons[],
  {
    filter,
    language,
    query,
  }: {
    filter: LessonRailFilter;
    language: Language;
    query: string;
  },
): FilteredLearningLessonGroup[] {
  const normalizedQuery = normalizeLearningSearch(query);
  const isFiltered = normalizedQuery.length > 0 || filter !== 'all';
  return groups
    .map(({ track, lessons }) => ({
      track,
      totalLessonCount: lessons.length,
      lessons: lessons.filter((lesson) => (
        lessonMatchesRailFilter(lesson, filter)
        && lessonMatchesSearchQuery(lesson, normalizedQuery, language)
      )),
    }))
    .filter((group) => !isFiltered || group.lessons.length > 0);
}

function lessonMatchesRailFilter(lesson: LearningLesson, filter: LessonRailFilter): boolean {
  if (filter === 'ready') return lesson.status === 'available' || lesson.status === 'next';
  if (filter === 'locked') return lesson.status === 'locked';
  return true;
}

function lessonMatchesSearchQuery(lesson: LearningLesson, normalizedQuery: string, language: Language): boolean {
  if (!normalizedQuery) return true;
  const lessonText = getUnifiedLessonText(language, lesson);
  const content = getLearningSearchDocument(lesson.domainId, lesson.id, language)?.text ?? '';
  return normalizeLearningSearch(`${lessonText.title} ${lesson.id} ${content}`).includes(normalizedQuery);
}

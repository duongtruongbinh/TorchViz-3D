import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeftToLine, ChevronDown, ChevronRight, FileText, Folder, LoaderCircle, Search, TriangleAlert, X } from 'lucide-react';

import type { GroupedLearningLessons } from '../../../core/learning/selectors';
import type { LearningLesson, LearningTrack } from '../../../core/learning/types';
import { getLearningLessonIdentity } from '../../../core/learning/lessonIdentity';
import { normalizeLearningSearch } from '../../../core/learning/mdxContract';
import { getLearningSearchDocument } from '../learningSearch';
import { getStrings, type Language } from '../../../lib/localization';
import { getTrackText, getUnifiedLessonText } from '../learningText';
import { cx, getLearningLabTheme, type LearningLabTheme } from '../theme';
import LessonNode from './LessonNode';

export type LessonRailFilter = 'all' | 'ready' | 'locked';
export type LessonHierarchyViewLevel = 'all' | 'category' | 'topic' | 'paper';

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
  searchStatus: 'idle' | 'loading' | 'error' | 'success';
  selectedLesson: LearningLesson | null;
  selectedFilter: LessonRailFilter;
  theme: LearningLabTheme;
  isRailOpen?: boolean;
  breadcrumbViewLevel?: LessonHierarchyViewLevel;
  onBreadcrumbViewLevelChange?: (level: LessonHierarchyViewLevel) => void;
  onClearSearch: () => void;
  onToggleRail?: () => void;
  onSearchChange: (value: string) => void;
  onRetrySearch: () => void;
  onSelectFilter: (filter: LessonRailFilter) => void;
  onSelectLesson: (lessonId: string) => void;
  onToggleTrack: (trackId: string) => void;
};

const LESSON_RAIL_FILTERS: LessonRailFilter[] = ['all', 'ready', 'locked'];

const BREADCRUMB_ABBREVIATIONS: Record<string, string> = {
  'Continual Learning': 'CL',
};

function formatBreadcrumbLabel(name: string): string {
  return BREADCRUMB_ABBREVIATIONS[name] ?? name;
}

function formatCountLabel(count: number, singular: string, plural = singular): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export default function LessonRail({
  groups,
  collapsedTrackIds,
  completedLessonIds,
  isFiltered,
  language,
  chapterLessonIndexById,
  searchQuery,
  searchStatus,
  selectedLesson,
  selectedFilter,
  theme,
  isRailOpen,
  breadcrumbViewLevel: propsBreadcrumbViewLevel,
  onBreadcrumbViewLevelChange,
  onClearSearch,
  onToggleRail,
  onSearchChange,
  onRetrySearch,
  onSelectFilter,
  onSelectLesson,
  onToggleTrack,
}: LessonRailProps) {
  const strings = getStrings(language).learningLab;
  const themeClasses = getLearningLabTheme(theme);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!railRef.current || !selectedLesson) return;
    const selectedEl = railRef.current.querySelector(`[data-lesson-id="${selectedLesson.id}"]`);
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [selectedLesson?.id]);

  const hierarchyDomainId = groups[0]?.track.domainId;
  const isAiProjects = hierarchyDomainId === 'ai-projects';

  const isBreadcrumbDomain = useMemo(() => (
    hierarchyDomainId === 'research-papers'
    || hierarchyDomainId === 'ai-projects'
    || groups.some((group) => group.track.text.title.en.includes(' > '))
  ), [groups, hierarchyDomainId]);

  const parsedBreadcrumbTracks = useMemo(() => {
    if (!isBreadcrumbDomain) return [];
    return groups.map((group) => {
      const titleText = getTrackText(language, group.track).title;
      const parts = titleText.split(/\s*>\s*/);
      return {
        group,
        category: parts[0] || 'General',
        topic: parts[1] || 'General',
        paper: parts[2] || parts[0],
      };
    });
  }, [groups, isBreadcrumbDomain, language]);

  const currentTrackEntry = useMemo(() => {
    if (!isBreadcrumbDomain || parsedBreadcrumbTracks.length === 0) return null;
    return (
      parsedBreadcrumbTracks.find((entry) => entry.group.track.id === selectedLesson?.trackId) ??
      parsedBreadcrumbTracks[0]
    );
  }, [isBreadcrumbDomain, parsedBreadcrumbTracks, selectedLesson?.trackId]);

  const [internalViewLevel, setInternalViewLevel] = useState<LessonHierarchyViewLevel>('all');
  const breadcrumbViewLevel = propsBreadcrumbViewLevel ?? internalViewLevel;
  const setBreadcrumbViewLevel = useCallback((level: LessonHierarchyViewLevel) => {
    setInternalViewLevel(level);
    onBreadcrumbViewLevelChange?.(level);
  }, [onBreadcrumbViewLevelChange]);

  const [activeCategory, setActiveCategory] = useState('');
  const [activeTopic, setActiveTopic] = useState('');
  const [activePaperTrackId, setActivePaperTrackId] = useState('');

  useEffect(() => {
    if (currentTrackEntry) {
      setActiveCategory(currentTrackEntry.category);
      setActiveTopic(currentTrackEntry.topic);
      setActivePaperTrackId(currentTrackEntry.group.track.id);
    }
  }, [currentTrackEntry]);

  const availableCategories = useMemo(() => {
    return Array.from(new Set(parsedBreadcrumbTracks.map((item) => item.category)));
  }, [parsedBreadcrumbTracks]);

  const availableTopicsForCategory = useMemo(() => {
    return Array.from(
      new Set(
        parsedBreadcrumbTracks
          .filter((item) => item.category === activeCategory)
          .map((item) => item.topic)
      )
    );
  }, [activeCategory, parsedBreadcrumbTracks]);

  const papersInActiveTopic = useMemo(() => {
    return parsedBreadcrumbTracks.filter(
      (item) => item.category === activeCategory && item.topic === activeTopic
    );
  }, [activeCategory, activeTopic, parsedBreadcrumbTracks]);

  const activePaperGroup = useMemo(() => {
    return (
      parsedBreadcrumbTracks.find((item) => item.group.track.id === activePaperTrackId)?.group ??
      papersInActiveTopic[0]?.group ??
      groups[0] ??
      null
    );
  }, [activePaperTrackId, groups, papersInActiveTopic, parsedBreadcrumbTracks]);

  const activePaperName = useMemo(() => {
    return (
      parsedBreadcrumbTracks.find((item) => item.group.track.id === activePaperGroup?.track.id)?.paper ??
      (isAiProjects ? 'Project' : 'Paper')
    );
  }, [activePaperGroup?.track.id, isAiProjects, parsedBreadcrumbTracks]);

  return (
    <aside className="flex h-full min-h-0 justify-center pr-1">
      <div className="flex min-h-0 w-[calc(100%_-_1rem)] flex-col">
        <div
          className={cx(
            'grid shrink-0 gap-2 border-b pb-4',
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
                className="learning-lab-rail-search-input min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-current"
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
                className={cx(
                  'flex h-11 w-11 shrink-0 items-center justify-center transition-colors',
                  themeClasses.radius.icon,
                  themeClasses.button.ghost,
                )}
                title={strings.lessonRailCloseLabel}
                aria-label={strings.lessonRailCloseLabel}
                aria-expanded={isRailOpen}
              >
                <ArrowLeftToLine className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
              </button>
            ) : null}
          </div>
          {searchQuery && searchStatus === 'loading' ? (
            <p className={cx('flex items-center gap-1.5 text-xs font-semibold', themeClasses.mutedText)} role="status">
              <LoaderCircle className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
              {strings.lessonSearchLoading}
            </p>
          ) : searchQuery && searchStatus === 'error' ? (
            <div className={cx('flex items-center justify-between gap-2 text-xs font-semibold', themeClasses.mutedText)} role="alert">
              <span className="flex min-w-0 items-center gap-1.5">
                <TriangleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {strings.searchLoadError}
              </span>
              <button type="button" onClick={onRetrySearch} className={cx('shrink-0 underline underline-offset-2', themeClasses.focusRing)}>
                {strings.retry}
              </button>
            </div>
          ) : null}
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
        <div ref={railRef} className="custom-scrollbar learning-lab-scrollbar mt-4 grid min-h-0 flex-1 content-start gap-4 overflow-y-auto pr-1">

          {groups.length === 0 ? (
            <div className={cx('border p-3 text-sm font-black leading-6', themeClasses.radius.card, themeClasses.surface.card, themeClasses.mutedText)}>
              {strings.lessonFilterEmpty}
            </div>
          ) : null}

          {isBreadcrumbDomain ? (
            <div className="grid gap-3">
              {/* Compact Dynamic Interactive Breadcrumb Bar */}
              <div className="flex items-center gap-0.5 text-[11px] py-0.5 max-w-full overflow-hidden leading-tight">
                {/* Level 0: Topics */}
                <button
                  type="button"
                  onClick={() => setBreadcrumbViewLevel('all')}
                  className={cx(
                    'shrink-0 rounded px-1.5 py-0.5 transition-all',
                    breadcrumbViewLevel === 'all'
                      ? 'font-black text-[#205089] bg-[#205089]/10'
                      : 'font-semibold text-[#123B68]/75 hover:bg-[#205089]/5 hover:text-[#205089]'
                  )}
                  title={isAiProjects ? (language === 'vi' ? 'Xem danh mục dự án' : 'View project categories') : 'View topics'}
                >
                  {isAiProjects ? (language === 'vi' ? 'Dự án' : 'Projects') : 'Topics'}
                </button>

                {/* Level 1: Category */}
                {breadcrumbViewLevel === 'category' ? (
                  <>
                    <span className="font-bold text-[#205089]/30 shrink-0 text-[10px]">&gt;</span>
                    <button
                      type="button"
                      onClick={() => setBreadcrumbViewLevel('category')}
                      className="max-w-[120px] truncate shrink-0 rounded px-1.5 py-0.5 font-black text-[#205089] bg-[#205089]/10 transition-all"
                      title={activeCategory}
                    >
                      {activeCategory}
                    </button>
                  </>
                ) : null}

                {/* Level 2: Topic */}
                {breadcrumbViewLevel === 'topic' ? (
                  <>
                    <span className="font-bold text-[#205089]/30 shrink-0 text-[10px]">&gt;</span>
                    <button
                      type="button"
                      onClick={() => setBreadcrumbViewLevel('category')}
                      className="max-w-[85px] truncate shrink-0 rounded px-1 py-0.5 font-semibold text-[#123B68]/75 hover:bg-[#205089]/5 hover:text-[#205089] transition-all"
                      title={activeCategory}
                    >
                      {activeCategory}
                    </button>
                    <span className="font-bold text-[#205089]/30 shrink-0 text-[10px]">&gt;</span>
                    <button
                      type="button"
                      onClick={() => setBreadcrumbViewLevel('topic')}
                      className="max-w-[110px] truncate shrink-0 rounded px-1.5 py-0.5 font-black text-[#205089] bg-[#205089]/10 transition-all"
                      title={activeTopic}
                    >
                      {formatBreadcrumbLabel(activeTopic)}
                    </button>
                  </>
                ) : null}

                {/* Level 3: Paper */}
                {breadcrumbViewLevel === 'paper' ? (
                  <>
                    <span className="font-bold text-[#205089]/30 shrink-0 text-[10px]">&gt;</span>
                    <button
                      type="button"
                      onClick={() => setBreadcrumbViewLevel('category')}
                      className="rounded px-1 py-0.5 text-[#123B68]/50 hover:bg-[#205089]/5 hover:text-[#205089] font-bold shrink-0 transition-colors"
                      title={`Category: ${activeCategory} (Click to view topics)`}
                    >
                      ...
                    </button>
                    <span className="font-bold text-[#205089]/30 shrink-0 text-[10px]">&gt;</span>
                    <button
                      type="button"
                      onClick={() => setBreadcrumbViewLevel('topic')}
                      className="max-w-[80px] truncate shrink-0 rounded px-1 py-0.5 font-semibold text-[#123B68]/75 hover:bg-[#205089]/5 hover:text-[#205089] transition-all"
                      title={activeTopic}
                    >
                      {formatBreadcrumbLabel(activeTopic)}
                    </button>
                    <span className="font-bold text-[#205089]/30 shrink-0 text-[10px]">&gt;</span>
                    <button
                      type="button"
                      onClick={() => setBreadcrumbViewLevel('paper')}
                      className="max-w-[110px] truncate shrink-0 rounded px-1.5 py-0.5 font-black text-[#205089] bg-[#205089]/10 transition-all"
                      title={activePaperName}
                    >
                      {activePaperName}
                    </button>
                  </>
                ) : null}
              </div>

              {/* View Level 0: All Categories / Topics */}
              {breadcrumbViewLevel === 'all' ? (
                <div className="grid gap-2 pt-1">
                  {availableCategories.map((categoryName) => {
                    const tracksInCategory = parsedBreadcrumbTracks.filter((item) => item.category === categoryName);
                    const distinctTopics = Array.from(new Set(tracksInCategory.map((t) => t.topic)));
                    const isCurrent = categoryName === activeCategory;
                    return (
                      <button
                        key={categoryName}
                        type="button"
                        onClick={() => {
                          setActiveCategory(categoryName);
                          const firstTopic = distinctTopics[0] || 'General';
                          setActiveTopic(firstTopic);
                          setBreadcrumbViewLevel('category');
                        }}
                        className={cx(
                          'flex items-center justify-between rounded-xl border p-3 text-left transition-all',
                          isCurrent
                            ? 'border-[#205089]/30 bg-[#205089]/10 shadow-sm'
                            : 'border-[#205089]/12 bg-white/80 hover:border-[#205089]/30 hover:bg-white hover:shadow-sm'
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-sm font-bold text-[#123B68]">
                            <Folder className="h-4 w-4 shrink-0 text-[#205089]" />
                            <span className="truncate">{categoryName}</span>
                          </div>
                          <div className="mt-1 text-xs text-[#123B68]/65 pl-6">
                            {isAiProjects
                              ? formatCountLabel(distinctTopics.length, language === 'vi' ? 'lĩnh vực' : 'field', language === 'vi' ? 'lĩnh vực' : 'fields')
                              : formatCountLabel(distinctTopics.length, 'topic', 'topics')}
                            {' • '}
                            {isAiProjects
                              ? formatCountLabel(tracksInCategory.length, language === 'vi' ? 'dự án' : 'project', language === 'vi' ? 'dự án' : 'projects')
                              : formatCountLabel(tracksInCategory.length, 'paper', 'papers')}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-[#205089]/60" />
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {/* View Level 1: Category -> List Topics */}
              {breadcrumbViewLevel === 'category' ? (
                <div className="grid gap-2 pt-1">
                  {availableTopicsForCategory.map((topicName) => {
                    const papersCount = parsedBreadcrumbTracks.filter(
                      (item) => item.category === activeCategory && item.topic === topicName
                    ).length;
                    const isCurrent = topicName === activeTopic;
                    return (
                      <button
                        key={topicName}
                        type="button"
                        onClick={() => {
                          setActiveTopic(topicName);
                          setBreadcrumbViewLevel('topic');
                        }}
                        className={cx(
                          'flex items-center justify-between rounded-xl border p-3 text-left transition-all',
                          isCurrent
                            ? 'border-[#205089]/30 bg-[#205089]/10 shadow-sm'
                            : 'border-[#205089]/12 bg-white/80 hover:border-[#205089]/30 hover:bg-white hover:shadow-sm'
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-sm font-bold text-[#123B68]">
                            <Folder className="h-4 w-4 shrink-0 text-[#205089]" />
                            <span className="truncate">{topicName}</span>
                          </div>
                          <div className="mt-1 text-xs text-[#123B68]/65 pl-6">
                            {isAiProjects
                              ? formatCountLabel(papersCount, language === 'vi' ? 'dự án' : 'project', language === 'vi' ? 'dự án' : 'projects')
                              : formatCountLabel(papersCount, 'paper', 'papers')}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-[#205089]/60" />
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {/* View Level 2: Topic -> List Papers */}
              {breadcrumbViewLevel === 'topic' ? (
                <div className="grid gap-2 pt-1">

                  {papersInActiveTopic.map((item) => {
                    const isCurrent = item.group.track.id === activePaperGroup?.track.id;
                    const trackDescription = getTrackText(language, item.group.track).description;
                    return (
                      <button
                        key={item.group.track.id}
                        type="button"
                        onClick={() => {
                          setActivePaperTrackId(item.group.track.id);
                          setBreadcrumbViewLevel('paper');
                          if (item.group.lessons.length > 0) {
                            onSelectLesson(item.group.lessons[0].id);
                          }
                        }}
                        className={cx(
                          'flex items-center justify-between rounded-xl border p-3 text-left transition-all',
                          isCurrent
                            ? 'border-[#205089]/30 bg-[#205089]/10 shadow-sm'
                            : 'border-[#205089]/12 bg-white/80 hover:border-[#205089]/30 hover:bg-white hover:shadow-sm'
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-sm font-bold text-[#123B68]">
                            <FileText className="h-4 w-4 shrink-0 text-[#205089]" />
                            <span className="truncate">{item.paper}</span>
                          </div>
                          {trackDescription ? (
                            <div className="mt-1 text-xs text-[#123B68]/70 pl-6 leading-relaxed">
                              {trackDescription}
                            </div>
                          ) : null}
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-[#205089]/60" />
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {/* View Level 3: Paper -> List Lesson Nodes */}
              {breadcrumbViewLevel === 'paper' && activePaperGroup ? (
                <div className="grid gap-0 pl-1">
                  {activePaperGroup.lessons.map((lesson, lessonIndex) => {
                    const index = chapterLessonIndexById.get(lesson.id) ?? lessonIndex;
                    const nextLesson = activePaperGroup.lessons[lessonIndex + 1] ?? null;
                    const isCompleted = completedLessonIds.has(getLearningLessonIdentity(lesson));
                    const isConnectorCompleted = isCompleted && Boolean(nextLesson && completedLessonIds.has(getLearningLessonIdentity(nextLesson)));
                    return (
                      <LessonNode
                        key={lesson.id}
                        lesson={lesson}
                        index={index}
                        isCompleted={isCompleted}
                        isConnectorCompleted={isConnectorCompleted}
                        isLast={lessonIndex === activePaperGroup.lessons.length - 1}
                        isSelected={lesson.id === selectedLesson?.id}
                        isTrackActive={true}
                        language={language}
                        theme={theme}
                        onSelect={onSelectLesson}
                      />
                    );
                  })}
                </div>
              ) : null}
            </div>
          ) : (
            groups.map(({ track, lessons, totalLessonCount }) => {
              const isCollapsed = collapsedTrackIds.has(track.id);
              const isCurrentTrack = track.id === selectedLesson?.trackId;
              const titleText = getTrackText(language, track).title;
              return (
                <div key={track.id} className="grid gap-1.5">
                  <button
                    type="button"
                    onClick={() => onToggleTrack(track.id)}
                    aria-expanded={!isCollapsed}
                    className={cx(
                      'group -ml-1 flex w-full items-center gap-2 px-0.5 text-left text-[15px] font-black leading-6 transition-colors duration-200',
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
                      {titleText}
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
                        const isCompleted = completedLessonIds.has(getLearningLessonIdentity(lesson));
                        const isConnectorCompleted = isCompleted && Boolean(nextLesson && completedLessonIds.has(getLearningLessonIdentity(nextLesson)));
                        return (
                          <LessonNode
                            key={lesson.id}
                            lesson={lesson}
                            index={index}
                            isCompleted={isCompleted}
                            isConnectorCompleted={isConnectorCompleted}
                            isLast={lessonIndex === lessons.length - 1}
                            isSelected={lesson.id === selectedLesson?.id}
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
            })
          )}
        </div>
      </div>
    </aside>
  );
}

type LearningThemeClasses = ReturnType<typeof getLearningLabTheme>;

function getRailFilterButtonClass(themeClasses: LearningThemeClasses, isActive: boolean): string {
  return cx(
    'flex h-8 min-w-0 flex-1 items-center justify-center px-2 text-[11px] font-black transition-colors',
    isActive ? 'learning-lab-rail-filter-button-active' : 'learning-lab-muted learning-lab-rail-filter-button-idle',
    themeClasses.radius.button,
    themeClasses.focusRing,
    isActive
      ? themeClasses.isLight
        ? 'border border-[#2F6F9F]/18 bg-[#D7E8F5] text-[#255E88] shadow-[inset_0_0_0_1px_rgba(47,111,159,0.10)]'
        : 'bg-[#D7DCE2] text-[#121A24] shadow-[0_5px_14px_rgba(0,0,0,0.18)]'
      : themeClasses.isLight
        ? 'text-[#123B68] hover:bg-white/58 hover:text-[#123B68] focus-visible:text-[#123B68]'
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
    fallbackLocales = [],
    language,
    query,
  }: {
    filter: LessonRailFilter;
    fallbackLocales?: readonly string[];
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
        && lessonMatchesSearchQuery(lesson, normalizedQuery, language, fallbackLocales)
      )),
    }))
    .filter((group) => !isFiltered || group.lessons.length > 0);
}

function lessonMatchesRailFilter(lesson: LearningLesson, filter: LessonRailFilter): boolean {
  if (filter === 'ready') return lesson.status === 'available' || lesson.status === 'next';
  if (filter === 'locked') return lesson.status === 'locked';
  return true;
}

function lessonMatchesSearchQuery(
  lesson: LearningLesson,
  normalizedQuery: string,
  language: Language,
  fallbackLocales: readonly string[],
): boolean {
  if (!normalizedQuery) return true;
  const lessonText = getUnifiedLessonText(language, lesson);
  const content = getLearningSearchDocument(lesson.domainId, lesson.id, language, fallbackLocales)?.text ?? '';
  return normalizeLearningSearch(`${lessonText.title} ${lesson.id} ${content}`).includes(normalizedQuery);
}

import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { ArrowDownWideNarrow, ArrowLeft, Home, ListTree, TableOfContents } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { learningCatalog } from '../../content/learning/index.ts';
import {
  getFirstLearningLessonRoute,
  getGroupedLearningLessonsForDomain,
  getLearningDomain,
  resolveLearningLessonRoute,
} from '../../core/learning/selectors';
import type { LearningDomainId } from '../../core/learning/types';
import { resolveVisibleLearningLesson } from './lesson/visibleLesson';
import { getStrings } from '../../lib/localization';
import { useStore } from '../../store/useStore';
import LearningLabHeader from './LearningLabHeader';
import { DOMAIN_ICONS } from './domainPresentation';
import LessonDetail from './lesson/LessonDetail';
import LessonRail, { filterLessonRailGroups, type LessonRailFilter, type LessonRailProps } from './lesson/LessonRail';
import { getDomainText } from './learningText';
import DomainCatalog from './shell/DomainCatalog';
import ReviewMode from './shell/ReviewMode';
import { cx, getLearningLabTheme, isTypingTarget } from './theme';

type LearningLabViewProps = {
  onBackToLanding: () => void;
};

const DOMAIN_IDS = new Set<LearningDomainId>(learningCatalog.domains.map((domain) => domain.id));
const futureHmiLogoUrl = new URL('../../../docs/assets/Future-HMIip.webp', import.meta.url).href;
const LESSON_RAIL_MIN_WIDTH = 240;
const LESSON_RAIL_MAX_WIDTH = 440;

function isLearningDomainId(value: string | undefined): value is LearningDomainId {
  return Boolean(value && DOMAIN_IDS.has(value as LearningDomainId));
}

export default function LearningLabView({ onBackToLanding }: LearningLabViewProps) {
  const navigate = useNavigate();
  const { domainId, trackId } = useParams();
  const [searchParams] = useSearchParams();

  const routeDomainId = isLearningDomainId(domainId) ? domainId : null;
  const routeLessonId = searchParams.get('lesson');

  const language = useStore((s) => s.language);
  const theme = 'light' as const;
  const [mode, setMode] = useState<'path' | 'review'>('path');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarRendered, setIsSidebarRendered] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isLessonRailOpen, setIsLessonRailOpen] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const [collapsedChapters, setCollapsedChapters] = useState<Set<string>>(() => new Set());
  const [lessonSearchQuery, setLessonSearchQuery] = useState('');
  const [lessonRailFilter, setLessonRailFilter] = useState<LessonRailFilter>('all');
  const [lessonRailWidth, setLessonRailWidth] = useState(300);
  const [isLessonRailResizing, setIsLessonRailResizing] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(() => new Set());
  const [, startLessonTransition] = useTransition();
  const contentAreaRef = useRef<HTMLElement | null>(null);
  const lessonRailResizeRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const strings = getStrings(language).learningLab;
  const themeClasses = getLearningLabTheme(theme);

  const activeDomain = routeDomainId ? getLearningDomain(learningCatalog, routeDomainId) : null;
  const resolvedRoute = useMemo(() => (
    routeDomainId
      ? resolveLearningLessonRoute(learningCatalog, {
        domainId: routeDomainId,
        trackId,
        lessonId: routeLessonId,
      })
      : null
  ), [routeDomainId, routeLessonId, trackId]);
  const activeTrack = resolvedRoute?.track ?? null;
  const groupedDomainLessons = useMemo(() => (
    routeDomainId ? getGroupedLearningLessonsForDomain(learningCatalog, routeDomainId) : []
  ), [routeDomainId]);
  const filteredGroupedDomainLessons = useMemo(() => filterLessonRailGroups(groupedDomainLessons, {
    filter: lessonRailFilter,
    language,
    query: lessonSearchQuery,
  }), [groupedDomainLessons, language, lessonRailFilter, lessonSearchQuery]);
  const domainLessons = useMemo(() => {
    return groupedDomainLessons.flatMap((group) => group.lessons);
  }, [groupedDomainLessons]);
  const domainLessonIndexById = useMemo(() => new Map(domainLessons.map((lesson, index) => [lesson.id, index])), [domainLessons]);
  const chapterLessonIndexById = useMemo(() => new Map(
    groupedDomainLessons.flatMap((group) => {
      let numberedLessonIndex = 0;
      return group.lessons.flatMap((lesson) => {
        if (lesson.id.endsWith('-quiz') || lesson.id.includes('-quiz-')) return [];
        const entry = [lesson.id, numberedLessonIndex] as const;
        numberedLessonIndex += 1;
        return [entry];
      });
    }),
  ), [groupedDomainLessons]);
  const routeSelectedLesson = resolvedRoute?.lesson ?? null;
  const firstFilteredLesson = filteredGroupedDomainLessons[0]?.lessons[0] ?? null;
  const filteredLessonIds = useMemo(() => new Set(filteredGroupedDomainLessons.flatMap((group) => group.lessons.map((lesson) => lesson.id))), [filteredGroupedDomainLessons]);
  const isLessonRailFiltered = lessonSearchQuery.trim().length > 0 || lessonRailFilter !== 'all';
  const {
    detailLesson: selectedLesson,
    railLesson: railSelectedLesson,
  } = resolveVisibleLearningLesson({
    routeSelectedLesson,
    firstFilteredLesson,
    filteredLessonIds,
    isLessonRailFiltered,
    firstDomainLesson: domainLessons[0] ?? null,
  });
  const detailLessonIndex = selectedLesson ? domainLessonIndexById.get(selectedLesson.id) ?? -1 : -1;
  const nextLesson = detailLessonIndex >= 0 ? domainLessons[detailLessonIndex + 1] ?? null : null;
  const previousLesson = detailLessonIndex > 0 ? domainLessons[detailLessonIndex - 1] ?? null : null;

  useEffect(() => {
    setCollapsedChapters(new Set(
      groupedDomainLessons
        .map((group) => group.track.id)
        .filter((groupTrackId) => groupTrackId !== activeTrack?.id),
    ));
    setLessonSearchQuery('');
    setLessonRailFilter('all');
    setIsLessonRailOpen(window.matchMedia('(min-width: 1024px)').matches);
  }, [routeDomainId]); // Intentionally reset only when entering another domain.

  useEffect(() => {
    if (!isSidebarOpen && !isLessonRailOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsSidebarOpen(false);
      if (window.matchMedia('(max-width: 1023px)').matches) {
        setIsLessonRailOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLessonRailOpen, isSidebarOpen]);

  useEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;
    let collapseTimer = 0;

    if (isSidebarOpen) {
      setIsSidebarRendered(true);
      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => setIsSidebarExpanded(true));
      });
    } else {
      setIsSidebarExpanded(false);
      collapseTimer = window.setTimeout(() => setIsSidebarRendered(false), 300);
    }

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(collapseTimer);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      setIsSidebarOpen(false);
      setIsLessonRailOpen(event.matches && Boolean(routeDomainId));
    };
    desktopQuery.addEventListener('change', handleBreakpointChange);
    return () => desktopQuery.removeEventListener('change', handleBreakpointChange);
  }, [routeDomainId]);

  useEffect(() => {
    if (!routeDomainId || !resolvedRoute) return;
    if (resolvedRoute.isCanonical) return;
    navigate(`/learning/${routeDomainId}/${resolvedRoute.track.id}?lesson=${resolvedRoute.lesson.id}`, { replace: true });
  }, [navigate, resolvedRoute, routeDomainId]);

  useEffect(() => {
    if (!railSelectedLesson) return;
    setCollapsedChapters((current) => {
      if (!current.has(railSelectedLesson.trackId)) return current;
      const next = new Set(current);
      next.delete(railSelectedLesson.trackId);
      return next;
    });
  }, [railSelectedLesson?.trackId]);

  useEffect(() => {
    contentAreaRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [selectedLesson?.id]);

  const openDomain = (nextDomainId: LearningDomainId) => {
    setMode('path');
    const firstRoute = getFirstLearningLessonRoute(learningCatalog, nextDomainId);
    if (!firstRoute) {
      navigate(`/learning/${nextDomainId}`);
      return;
    }
    navigate(`/learning/${nextDomainId}/${firstRoute.track.id}?lesson=${firstRoute.lesson.id}`);
    setIsSidebarOpen(false);
  };

  const openLearningHome = () => {
    setMode('path');
    navigate('/learning');
    setIsSidebarOpen(false);
  };

  const toggleChapter = useCallback((trackId: string) => {
    setCollapsedChapters((current) => {
      const next = new Set(current);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      return next;
    });
  }, []);

  const selectLesson = useCallback((lessonId: string) => {
    const targetLesson = domainLessons.find((item) => item.id === lessonId);
    if (!targetLesson) return;
    startLessonTransition(() => {
      navigate(`/learning/${targetLesson.domainId}/${targetLesson.trackId}?lesson=${lessonId}`);
    });
  }, [domainLessons, navigate, startLessonTransition]);

  useEffect(() => {
    if (!selectedLesson) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
      if (isTypingTarget(event.target)) return;
      if (event.key === 'ArrowUp') {
        if (!previousLesson) return;
        event.preventDefault();
        selectLesson(previousLesson.id);
      } else {
        if (!nextLesson) return;
        event.preventDefault();
        selectLesson(nextLesson.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previousLesson, nextLesson, selectLesson, selectedLesson]);
  const clearLessonSearch = useCallback(() => setLessonSearchQuery(''), []);
  const openLessonRail = useCallback(() => setIsLessonRailOpen(true), []);
  const closeLessonRail = useCallback(() => setIsLessonRailOpen(false), []);
  const lessonRailProps = railSelectedLesson ? ({
    groups: filteredGroupedDomainLessons,
    collapsedTrackIds: collapsedChapters,
    completedLessonIds,
    isFiltered: isLessonRailFiltered,
    language,
    chapterLessonIndexById,
    searchQuery: lessonSearchQuery,
    selectedFilter: lessonRailFilter,
    selectedLesson: railSelectedLesson,
    theme,
    onClearSearch: clearLessonSearch,
    onSearchChange: setLessonSearchQuery,
    onSelectFilter: setLessonRailFilter,
    onSelectLesson: selectLesson,
    onToggleTrack: toggleChapter,
  } satisfies Omit<LessonRailProps, 'isRailOpen' | 'onToggleRail'>) : null;

  return (
    <main
      className={cx('learning-lab h-dvh w-full overflow-hidden', themeClasses.page)}
    >
      {isSidebarRendered ? (
        <button
          type="button"
          className={cx(
            'fixed inset-0 z-50 bg-[#0D1826]/35 backdrop-blur-[2px] transition-opacity duration-300 ease-out motion-reduce:transition-none',
            isSidebarExpanded ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
          )}
          onClick={() => setIsSidebarOpen(false)}
          aria-label={strings.closeSidebar}
        />
      ) : null}
      <aside className={cx(
        'fixed left-0 top-0 z-[60] flex flex-col overflow-visible transition-[width,height,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
        isSidebarRendered
          ? 'h-dvh w-[min(320px,calc(100vw-3rem))] translate-x-0 border-r shadow-xl lg:w-[300px]'
          : 'h-16 w-[72px] -translate-x-full lg:translate-x-0',
        isSidebarRendered ? themeClasses.sidebar : 'bg-transparent',
      )} role={isSidebarRendered ? 'dialog' : undefined} aria-modal={isSidebarRendered ? true : undefined} aria-label={isSidebarRendered ? strings.sidebarDomains : undefined}>
        <div
          className={cx(
            'w-full items-center',
            isSidebarRendered
              ? 'grid min-h-[88px] grid-cols-[40px_minmax(0,1fr)] gap-x-3 gap-y-2 px-4 py-3 text-left'
              : 'flex h-16 justify-center px-0',
          )}
        >
          {isSidebarRendered ? (
            <div className={cx('flex h-10 w-10 shrink-0 items-center justify-center', themeClasses.radius.icon, themeClasses.brandTile)}>
              <img src={futureHmiLogoUrl} alt="TorchViz3D" className={cx('h-8 w-8 object-cover', themeClasses.radius.icon)} />
            </div>
          ) : (
            <button
              type="button"
              className={cx(
                'group relative flex h-10 w-10 shrink-0 items-center justify-center font-black',
                themeClasses.radius.icon,
                themeClasses.brandTile,
                themeClasses.focusRing,
              )}
              onClick={() => setIsSidebarOpen(true)}
              title={strings.openSidebar}
              aria-label={strings.openSidebar}
              aria-expanded={isSidebarOpen}
            >
              <img
                src={futureHmiLogoUrl}
                alt="TorchViz3D"
                className={cx('h-8 w-8 object-cover transition-opacity group-hover:opacity-0 group-focus-within:opacity-0', themeClasses.radius.icon)}
              />
              <span
                className={cx(
                  'absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100',
                  themeClasses.radius.icon,
                  themeClasses.button.icon,
                )}
              >
                <ArrowDownWideNarrow className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              </span>
            </button>
          )}
          {isSidebarRendered ? (
            <div className="min-w-0 text-left">
              <span className="block truncate text-xl font-black leading-6" aria-label="TorchViz3D">
                TorchViz<span className={themeClasses.accentText}>3D</span>
              </span>
            </div>
          ) : null}
          {isSidebarRendered ? (
            <button
              type="button"
              onClick={onBackToLanding}
              className={cx(
                'group col-span-2 -ml-2 flex h-9 w-fit items-center gap-1.5 rounded-lg px-2 text-xs font-semibold leading-4 transition-colors duration-150',
                themeClasses.mutedText,
                themeClasses.focusRing,
                themeClasses.isLight
                  ? 'hover:bg-white/55 hover:text-[#123B68] active:bg-white/75'
                  : 'hover:bg-[#A8B8C8]/12 hover:text-[#F2F6FA] active:bg-[#A8B8C8]/18',
              )}
            >
              <ArrowLeft
                className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
                strokeWidth={2}
                aria-hidden="true"
              />
              <span>{strings.backToLanding}</span>
            </button>
          ) : null}
        </div>

        {isSidebarRendered ? (
          <div
            ref={(element) => element?.toggleAttribute('inert', !isSidebarExpanded)}
            className={cx(
              'grid min-h-0 flex-1 transition-[grid-template-rows,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:transition-none',
              isSidebarExpanded ? 'grid-rows-[1fr] translate-y-0 opacity-100' : 'pointer-events-none grid-rows-[0fr] -translate-y-3 opacity-0',
            )}
            aria-hidden={!isSidebarExpanded}
          >
            <nav className="custom-scrollbar min-h-0 overflow-y-auto px-3 pb-5 pt-1" aria-label={strings.sidebarDomains}>
              <div className="grid gap-2">
            <button
              type="button"
              onClick={openLearningHome}
              className={cx(
                'flex h-11 w-full items-center gap-2 px-2 text-left text-sm',
                themeClasses.radius.button,
                themeClasses.button.nav(!routeDomainId),
              )}
              title={strings.home}
              aria-current={!routeDomainId ? 'page' : undefined}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center text-sm" aria-hidden="true">
                <Home className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <span className="min-w-0 truncate">{strings.home}</span>
            </button>

            {learningCatalog.domains.map((domain) => {
              const text = getDomainText(language, domain);
              const isActive = routeDomainId === domain.id;
              const DomainIcon = DOMAIN_ICONS[domain.id];
              return (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => openDomain(domain.id)}
                  className={cx(
                    'flex h-11 w-full items-center gap-2 px-2 text-left text-sm',
                    themeClasses.radius.button,
                    themeClasses.button.nav(isActive),
                  )}
                  title={text.title}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center text-sm" aria-hidden="true">
                    <DomainIcon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0 truncate">{text.title}</span>
                </button>
              );
            })}
              </div>
            </nav>
          </div>
        ) : null}

      </aside>

      <div
        ref={(element) => element?.toggleAttribute('inert', isSidebarExpanded)}
        className="flex h-dvh min-h-0 min-w-0 flex-col overflow-hidden"
        aria-hidden={isSidebarExpanded}
      >
        <LearningLabHeader
          mode={mode}
          theme={theme}
          onModeChange={setMode}
          onOpenNavigation={() => setIsSidebarOpen(true)}
        />
        <section ref={contentAreaRef} className={cx('custom-scrollbar learning-lab-scrollbar learning-lab-content-area min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4', themeClasses.content)}>
          {mode === 'review' ? (
            <ReviewMode
              catalog={learningCatalog}
              language={language}
              theme={theme}
              onSelectLesson={(lesson) => {
                setMode('path');
                navigate(`/learning/${lesson.domainId}/${lesson.trackId}?lesson=${lesson.id}`);
              }}
            />
          ) : !routeDomainId ? (
            <DomainCatalog language={language} theme={theme} onOpenDomain={openDomain} />
          ) : activeDomain && !activeTrack ? (
            <div className={cx('border p-6 text-sm font-black shadow-sm', themeClasses.radius.card, themeClasses.surface.card, themeClasses.mutedText)}>
              {strings.contentInProgress}
            </div>
          ) : activeTrack && lessonRailProps ? (
            <section
              style={{ '--lesson-rail-width': `${lessonRailWidth}px` } as CSSProperties}
              className={cx(
                'learning-lab-catalog -m-3 grid min-h-full w-[calc(100%+1.5rem)] items-start gap-3 p-3 sm:-m-4 sm:w-[calc(100%+2rem)] sm:gap-4 sm:p-4',
                !isLessonRailResizing && 'transition-[grid-template-columns] duration-200',
                isLessonRailOpen ? 'learning-lab-lesson-rail-open' : 'learning-lab-lesson-rail-closed',
              )}
            >
              <div
                style={isLessonRailOpen ? { width: lessonRailWidth } : undefined}
                className={cx(
                  'sticky top-0 hidden h-[calc(100vh-7rem)] lg:block',
                  !isLessonRailOpen && 'w-11',
                )}
              >
                <div
                  style={{ width: lessonRailWidth }}
                  className={cx(
                    'absolute inset-y-0 left-0 min-w-0 overflow-hidden transition-[opacity,transform] duration-200',
                    isLessonRailOpen
                      ? 'pointer-events-auto translate-x-0 opacity-100'
                      : 'pointer-events-none -translate-x-3 opacity-0',
                  )}
                >
                  <LessonRail
                    {...lessonRailProps}
                    isRailOpen={isLessonRailOpen}
                    onToggleRail={closeLessonRail}
                  />
                </div>
                {isLessonRailOpen ? (
                  <div
                    role="separator"
                    aria-label={language === 'vi' ? 'Thay đổi chiều rộng mục lục bài học' : 'Resize lesson table of contents'}
                    aria-orientation="vertical"
                    aria-valuemin={LESSON_RAIL_MIN_WIDTH}
                    aria-valuemax={LESSON_RAIL_MAX_WIDTH}
                    aria-valuenow={lessonRailWidth}
                    tabIndex={0}
                    className={cx(
                      'group absolute -right-4 top-0 z-10 hidden h-full w-4 touch-none cursor-col-resize items-center justify-center outline-none lg:flex',
                      themeClasses.focusRing,
                    )}
                    onPointerDown={(event) => {
                      lessonRailResizeRef.current = { startX: event.clientX, startWidth: lessonRailWidth };
                      setIsLessonRailResizing(true);
                      event.currentTarget.setPointerCapture(event.pointerId);
                    }}
                    onPointerMove={(event) => {
                      const resize = lessonRailResizeRef.current;
                      if (!resize || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
                      const nextWidth = Math.min(
                        LESSON_RAIL_MAX_WIDTH,
                        Math.max(LESSON_RAIL_MIN_WIDTH, resize.startWidth + event.clientX - resize.startX),
                      );
                      setLessonRailWidth(nextWidth);
                    }}
                    onPointerUp={(event) => {
                      lessonRailResizeRef.current = null;
                      setIsLessonRailResizing(false);
                      event.currentTarget.releasePointerCapture(event.pointerId);
                    }}
                    onPointerCancel={() => {
                      lessonRailResizeRef.current = null;
                      setIsLessonRailResizing(false);
                    }}
                    onLostPointerCapture={() => {
                      lessonRailResizeRef.current = null;
                      setIsLessonRailResizing(false);
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
                      event.preventDefault();
                      const direction = event.key === 'ArrowLeft' ? -1 : 1;
                      setLessonRailWidth((current) => Math.min(
                        LESSON_RAIL_MAX_WIDTH,
                        Math.max(LESSON_RAIL_MIN_WIDTH, current + direction * 16),
                      ));
                    }}
                  >
                    <span className="h-16 w-1 rounded-full bg-[#205089]/12 transition-colors group-hover:bg-[#205089]/35 group-focus-visible:bg-[#205089]/45" aria-hidden="true" />
                  </div>
                ) : null}
                {!isLessonRailOpen ? (
                  <button
                    type="button"
                    onClick={openLessonRail}
                    className={cx(
                      'flex h-11 w-11 shrink-0 items-center justify-center transition-colors',
                      themeClasses.radius.icon,
                      themeClasses.focusRing,
                      themeClasses.isLight
                        ? 'bg-[#E8EEF5] text-[#123B68] hover:bg-white'
                        : 'bg-[#A8B8C8]/20 text-[#F2F6FA] hover:bg-[#A8B8C8]/28',
                    )}
                    title={strings.lessonRailOpenLabel}
                    aria-label={strings.lessonRailOpenLabel}
                    aria-expanded={isLessonRailOpen}
                  >
                    <TableOfContents className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
                  </button>
                ) : null}
              </div>
              <div className="lg:hidden">
                <button
                  type="button"
                  onClick={openLessonRail}
                  className={cx('flex min-h-11 w-full items-center justify-center gap-2 px-4 text-sm', themeClasses.radius.button, themeClasses.button.secondary)}
                  aria-expanded={isLessonRailOpen}
                >
                  <ListTree className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  {strings.lessonRailOpenLabel}
                </button>
                {isLessonRailOpen ? (
                  <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label={strings.lessonRailOpenLabel}>
                    <button
                      type="button"
                      className="absolute inset-0 bg-[#0D1826]/35 backdrop-blur-[2px]"
                      onClick={closeLessonRail}
                      aria-label={strings.lessonRailCloseLabel}
                    />
                    <div className={cx('absolute inset-y-0 right-0 w-[min(340px,calc(100vw-2rem))] overflow-hidden border-l p-4 shadow-2xl', themeClasses.sidebar)}>
                      <LessonRail
                        {...lessonRailProps}
                        isRailOpen={true}
                        onToggleRail={closeLessonRail}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
              {selectedLesson ? (
                <div className="min-w-0">
                  <LessonDetail
                    lesson={selectedLesson}
                    theme={theme}
                    language={language}
                    hasNextLesson={Boolean(nextLesson)}
                    onSelectNextLesson={() => {
                      if (!nextLesson) return;
                      setCompletedLessonIds((current) => {
                        const next = new Set(current);
                        next.add(selectedLesson.id);
                        return next;
                      });
                      selectLesson(nextLesson.id);
                    }}
                  />
                </div>
              ) : (
                <div className={cx('border p-6 text-sm font-black shadow-sm', themeClasses.radius.card, themeClasses.surface.card, themeClasses.mutedText)}>
                  {strings.lessonFilterEmpty}
                </div>
              )}
            </section>
          ) : (
            <div className={cx('border p-6 text-sm font-black shadow-sm', themeClasses.radius.card, themeClasses.surface.card, themeClasses.mutedText)}>
              {strings.contentInProgress}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

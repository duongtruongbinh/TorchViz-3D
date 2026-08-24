import { lazy, Suspense, type CSSProperties, useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { ArrowDownWideNarrow, ArrowLeft, GraduationCap, Home, ListTree, TableOfContents } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import learningHomeDomainData from 'virtual:learning-home-catalog';
import {
  getGroupedLearningLessonsForDomain,
  getLearningDomain,
  resolveLearningLessonRoute,
} from '../../core/learning/selectors';
import type { LearningCatalog, LearningDomainId, LearningHomeDomainSummary } from '../../core/learning/types';
import { getLearningLessonIdentity } from '../../core/learning/lessonIdentity';
import { resolveRailLearningLesson } from './lesson/visibleLesson';
import { getStrings } from '../../lib/localization';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import LearningLabHeader from './LearningLabHeader';
import { getDomainIcon } from './domainPresentation';
import { loadFullLearningCatalog, loadLearningDomainCatalog } from './learningCatalogLoader';
import { loadLearningSearchDocuments } from './learningSearch';
import LessonRail, { filterLessonRailGroups, type LessonRailFilter, type LessonRailProps } from './lesson/LessonRail';
import { getDomainText } from './learningText';
import DomainCatalog from './shell/DomainCatalog';
import ReviewMode from './shell/ReviewMode';
import { cx, getLearningLabTheme, isTypingTarget } from './theme';

type LearningLabViewProps = {
  onBackToLanding: () => void;
};

const LessonDetail = lazy(() => import('./lesson/LessonDetail'));
const learningHomeDomains: readonly LearningHomeDomainSummary[] = learningHomeDomainData;
const DOMAIN_IDS = new Set<LearningDomainId>(learningHomeDomains.map(({ domain }) => domain.id));
const futureHmiLogoUrl = new URL('../../../docs/assets/Future-HMIip.webp', import.meta.url).href;
const LESSON_RAIL_MIN_WIDTH = 240;
const LESSON_RAIL_MAX_WIDTH = 440;
const SIDEBAR_ANIMATION_MS = 450;
const SIDEBAR_ENTER_DELAY_MS = 30;
const SIDEBAR_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

function isLearningDomainId(value: string | undefined): value is LearningDomainId {
  return Boolean(value && DOMAIN_IDS.has(value as LearningDomainId));
}

export default function LearningLabView({ onBackToLanding }: LearningLabViewProps) {
  const navigate = useNavigate();
  const { domainId, trackId } = useParams();
  const [searchParams] = useSearchParams();

  const routeDomainId = isLearningDomainId(domainId) ? domainId : null;
  const routeLessonId = searchParams.get('lesson');

  const language = usePreferencesStore((s) => s.language);
  const theme = 'light' as const;
  const [mode, setMode] = useState<'path' | 'review'>('path');
  const [loadedCatalog, setLoadedCatalog] = useState<{ key: string; catalog: LearningCatalog } | null>(null);
  const [catalogLoadState, setCatalogLoadState] = useState<{ key: string; status: 'loading' | 'error' | 'success' } | null>(null);
  const [catalogRetryVersion, setCatalogRetryVersion] = useState(0);
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
  const [learningSearchRevision, setLearningSearchRevision] = useState(0);
  const [searchLoadState, setSearchLoadState] = useState<{ domainId: LearningDomainId; status: 'loading' | 'error' | 'success' } | null>(null);
  const [searchRetryVersion, setSearchRetryVersion] = useState(0);
  const [researchPaperViewLevel, setResearchPaperViewLevel] = useState<'all' | 'category' | 'topic' | 'paper'>(
    () => (routeLessonId ? 'paper' : 'all')
  );
  const [, startLessonTransition] = useTransition();
  const contentAreaRef = useRef<HTMLElement | null>(null);
  const lessonRailResizeRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const strings = getStrings(language).learningLab;
  const themeClasses = getLearningLabTheme(theme);
  const requestedCatalogKey = mode === 'review' ? 'review' : routeDomainId;
  const learningCatalog = loadedCatalog?.key === requestedCatalogKey ? loadedCatalog.catalog : null;
  const requestedCatalogStatus = catalogLoadState?.key === requestedCatalogKey ? catalogLoadState.status : 'loading';
  const isSidebarVisible = isSidebarOpen && isSidebarExpanded;
  const sidebarDrawerStyle = isSidebarRendered ? ({
    opacity: isSidebarVisible ? 1 : 0,
    transform: isSidebarVisible ? 'translate3d(0, 0, 0)' : 'translate3d(-100%, 0, 0)',
    transition: `transform ${SIDEBAR_ANIMATION_MS}ms ${SIDEBAR_EASING}, opacity ${SIDEBAR_ANIMATION_MS}ms ease-out`,
    willChange: 'transform, opacity',
  } satisfies CSSProperties) : undefined;

  const activeDomain = routeDomainId && learningCatalog ? getLearningDomain(learningCatalog, routeDomainId) : null;
  const groupedDomainLessons = useMemo(() => (
    routeDomainId && learningCatalog ? getGroupedLearningLessonsForDomain(learningCatalog, routeDomainId) : []
  ), [learningCatalog, routeDomainId]);
  const resolvedRoute = useMemo(() => (
    routeDomainId && learningCatalog
      ? resolveLearningLessonRoute(learningCatalog, {
        domainId: routeDomainId,
        trackId,
        lessonId: routeLessonId,
      })
      : null
  ), [learningCatalog, routeDomainId, routeLessonId, trackId]);
  const activeTrack = resolvedRoute?.track
    ?? groupedDomainLessons.find((group) => group.track.id === trackId)?.track
    ?? groupedDomainLessons[0]?.track
    ?? null;
  const filteredGroupedDomainLessons = useMemo(() => filterLessonRailGroups(groupedDomainLessons, {
    filter: lessonRailFilter,
    fallbackLocales: activeDomain?.mdx?.fallbackLocales,
    language,
    query: lessonSearchQuery,
  }), [activeDomain, groupedDomainLessons, language, learningSearchRevision, lessonRailFilter, lessonSearchQuery]);
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
  const selectedLesson = routeSelectedLesson;
  const railSelectedLesson = resolveRailLearningLesson({
    routeSelectedLesson,
    firstFilteredLesson,
    filteredLessonIds,
    isLessonRailFiltered,
  });
  const detailLessonIndex = selectedLesson ? domainLessonIndexById.get(selectedLesson.id) ?? -1 : -1;
  const nextLesson = detailLessonIndex >= 0 ? domainLessons[detailLessonIndex + 1] ?? null : null;
  const previousLesson = detailLessonIndex > 0 ? domainLessons[detailLessonIndex - 1] ?? null : null;

  useEffect(() => {
    if (!requestedCatalogKey) return;
    let isActive = true;
    setCatalogLoadState({ key: requestedCatalogKey, status: 'loading' });
    const catalogPromise = mode === 'review'
      ? loadFullLearningCatalog()
      : loadLearningDomainCatalog(routeDomainId!);
    void catalogPromise
      .then((catalog) => {
        if (!isActive) return;
        setLoadedCatalog({ key: requestedCatalogKey, catalog });
        setCatalogLoadState({ key: requestedCatalogKey, status: 'success' });
      })
      .catch((error: unknown) => {
        console.error('Learning Lab catalog failed to load', error);
        if (isActive) setCatalogLoadState({ key: requestedCatalogKey, status: 'error' });
      });
    return () => {
      isActive = false;
    };
  }, [catalogRetryVersion, mode, requestedCatalogKey, routeDomainId]);

  useEffect(() => {
    if (!routeDomainId || !lessonSearchQuery.trim()) {
      setSearchLoadState(null);
      return;
    }
    let isActive = true;
    setSearchLoadState({ domainId: routeDomainId, status: 'loading' });
    void loadLearningSearchDocuments(routeDomainId)
      .then(() => {
        if (!isActive) return;
        setLearningSearchRevision((current) => current + 1);
        setSearchLoadState({ domainId: routeDomainId, status: 'success' });
      })
      .catch((error: unknown) => {
        console.error('Learning Lab search documents failed to load', error);
        if (isActive) setSearchLoadState({ domainId: routeDomainId, status: 'error' });
      });
    return () => {
      isActive = false;
    };
  }, [lessonSearchQuery, routeDomainId, searchRetryVersion]);

  useEffect(() => {
    setCollapsedChapters(new Set(
      groupedDomainLessons
        .map((group) => group.track.id)
        .filter((groupTrackId) => groupTrackId !== activeTrack?.id),
    ));
    setLessonSearchQuery('');
    setLessonRailFilter('all');
    setIsLessonRailOpen(window.matchMedia('(min-width: 1024px)').matches);
  }, [learningCatalog, routeDomainId]); // Initialize once the requested domain catalog is available.

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
    let expandTimer = 0;
    let collapseTimer = 0;

    if (isSidebarOpen) {
      setIsSidebarRendered(true);
      setIsSidebarExpanded(false);
      expandTimer = window.setTimeout(() => setIsSidebarExpanded(true), SIDEBAR_ENTER_DELAY_MS);
    } else {
      setIsSidebarExpanded(false);
      collapseTimer = window.setTimeout(() => setIsSidebarRendered(false), SIDEBAR_ANIMATION_MS);
    }

    return () => {
      window.clearTimeout(expandTimer);
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
  }, [selectedLesson?.domainId, selectedLesson?.id]);

  const openDomain = (nextDomainId: LearningDomainId) => {
    setMode('path');
    navigate(`/learning/${nextDomainId}`);
    setIsSidebarOpen(false);
  };

  const openLearningHome = () => {
    setMode('path');
    navigate('/learning');
    setIsSidebarOpen(false);
  };



  const toggleChapter = (chapterId: string) => {
    setCollapsedChapters((current) => {
      const next = new Set(current);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  const selectLesson = useCallback((lessonId: string) => {
    const targetLesson = domainLessons.find((item) => item.id === lessonId);
    if (!targetLesson) return;
    if (routeDomainId === 'research-papers') {
      setResearchPaperViewLevel('paper');
    }
    startLessonTransition(() => {
      navigate(`/learning/${targetLesson.domainId}/${targetLesson.trackId}?lesson=${lessonId}`);
    });
  }, [domainLessons, navigate, routeDomainId, startLessonTransition]);

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
  const retryCatalogLoad = useCallback(() => setCatalogRetryVersion((current) => current + 1), []);
  const retryLessonSearch = useCallback(() => setSearchRetryVersion((current) => current + 1), []);
  const openLessonRail = useCallback(() => setIsLessonRailOpen(true), []);
  const closeLessonRail = useCallback(() => setIsLessonRailOpen(false), []);
  const toggleSidebar = useCallback(() => setIsSidebarOpen((current) => !current), []);

  const lessonRailProps = activeTrack ? ({
    groups: filteredGroupedDomainLessons,
    collapsedTrackIds: collapsedChapters,
    completedLessonIds,
    isFiltered: isLessonRailFiltered,
    language,
    chapterLessonIndexById,
    searchQuery: lessonSearchQuery,
    searchStatus: searchLoadState?.domainId === routeDomainId ? searchLoadState.status : 'idle',
    selectedFilter: lessonRailFilter,
    selectedLesson: railSelectedLesson,
    theme,
    breadcrumbViewLevel: routeDomainId === 'research-papers' ? researchPaperViewLevel : undefined,
    onBreadcrumbViewLevelChange: setResearchPaperViewLevel,
    onClearSearch: clearLessonSearch,
    onSearchChange: setLessonSearchQuery,
    onRetrySearch: retryLessonSearch,
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
            isSidebarVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
          )}
          onClick={() => setIsSidebarOpen(false)}
          aria-label={strings.closeSidebar}
        />
      ) : null}
      {isSidebarRendered && !isSidebarOpen ? (
        <div className="fixed left-0 top-0 z-[70] flex h-16 w-[72px] items-center justify-center px-0">
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
            aria-expanded={false}
          >
            <img
              src={futureHmiLogoUrl}
              alt="TorchViz3D"
              className={cx('h-8 w-8 object-cover transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0', themeClasses.radius.icon)}
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
        </div>
      ) : null}
      <aside
        key={isSidebarRendered ? 'learning-sidebar-drawer' : 'learning-sidebar-rail'}
        className={cx(
          'fixed left-0 top-0 z-[60] flex flex-col overflow-visible motion-reduce:transition-none',
          isSidebarRendered
            ? 'h-dvh w-[min(320px,calc(100vw-3rem))] border-r shadow-xl lg:w-[300px]'
          : 'h-16 w-[72px] -translate-x-full lg:translate-x-0',
          isSidebarRendered ? themeClasses.sidebar : 'bg-transparent',
        )}
        style={sidebarDrawerStyle}
        role={isSidebarRendered ? 'dialog' : undefined}
        aria-modal={isSidebarRendered ? true : undefined}
        aria-label={isSidebarRendered ? strings.sidebarDomains : undefined}
      >
        <div
          className={cx(
            'w-full items-center',
            isSidebarRendered
              ? 'grid min-h-[88px] grid-cols-[40px_minmax(0,1fr)] gap-x-3 gap-y-2 px-4 py-3 text-left'
              : 'flex h-16 justify-center px-0',
          )}
        >
          {isSidebarRendered ? (
            <button
              type="button"
              onClick={toggleSidebar}
              title={strings.closeSidebar}
              aria-label={strings.closeSidebar}
              aria-expanded={isSidebarOpen}
              className={cx(
                'group relative flex h-10 w-10 shrink-0 items-center justify-center font-black',
                themeClasses.radius.icon,
                themeClasses.brandTile,
                themeClasses.focusRing,
              )}
            >
              <img
                src={futureHmiLogoUrl}
                alt="TorchViz3D"
                className={cx('h-8 w-8 object-cover transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0', themeClasses.radius.icon)}
              />
              <span
                className={cx(
                  'absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100',
                  themeClasses.radius.icon,
                  themeClasses.button.icon,
                )}
              >
                <ArrowDownWideNarrow className="h-5 w-5 rotate-180" strokeWidth={2} aria-hidden="true" />
              </span>
            </button>
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
                className={cx('h-8 w-8 object-cover transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0', themeClasses.radius.icon)}
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
            ref={(element) => {
              element?.toggleAttribute('inert', !isSidebarVisible);
            }}
            className={cx(
              'grid min-h-0 flex-1 transition-[grid-template-rows,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:transition-none',
              isSidebarVisible ? 'grid-rows-[1fr] translate-y-0 opacity-100' : 'pointer-events-none grid-rows-[0fr] -translate-y-3 opacity-0',
            )}
            aria-hidden={!isSidebarVisible}
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

            {learningHomeDomains.map(({ domain }) => {
              const text = getDomainText(language, domain);
              const isActive = routeDomainId === domain.id;
              const DomainIcon = getDomainIcon(domain.id);
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
        ref={(element) => {
          element?.toggleAttribute('inert', isSidebarVisible);
        }}
        className="flex h-dvh min-h-0 min-w-0 flex-col overflow-hidden"
        aria-hidden={isSidebarVisible}
      >
        <LearningLabHeader
          mode={mode}
          theme={theme}
          onModeChange={setMode}
          onOpenNavigation={toggleSidebar}
        />
        <section ref={contentAreaRef} className={cx('custom-scrollbar learning-lab-scrollbar learning-lab-content-area min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4', themeClasses.content)}>
          {mode === 'review' && learningCatalog ? (
            <ReviewMode
              catalog={learningCatalog}
              language={language}
              theme={theme}
              onSelectLesson={(lesson) => {
                setMode('path');
                navigate(`/learning/${lesson.domainId}/${lesson.trackId}?lesson=${lesson.id}`);
              }}
            />
          ) : mode === 'review' && requestedCatalogStatus === 'error' ? (
            <LearningLoadError message={strings.catalogLoadError} retryLabel={strings.retry} onRetry={retryCatalogLoad} themeClasses={themeClasses} />
          ) : mode === 'review' ? (
            <CatalogLoadingFallback label={strings.catalogLoading} themeClasses={themeClasses} />
          ) : !routeDomainId ? (
            <DomainCatalog domains={learningHomeDomains} language={language} theme={theme} onOpenDomain={openDomain} />
          ) : !learningCatalog && requestedCatalogStatus === 'error' ? (
            <LearningLoadError message={strings.catalogLoadError} retryLabel={strings.retry} onRetry={retryCatalogLoad} themeClasses={themeClasses} />
          ) : !learningCatalog ? (
            <CatalogLoadingFallback label={strings.catalogLoading} themeClasses={themeClasses} />
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
              {routeDomainId === 'research-papers' && researchPaperViewLevel !== 'paper' ? (
                <div className="flex h-full min-h-[460px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#205089]/20 bg-white/60 p-8 text-center shadow-sm">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#205089]/10 text-[#205089] mb-4 shadow-sm">
                    <GraduationCap className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-black text-[#123B68]">
                    {language === 'vi' ? 'Chọn một bài báo nghiên cứu để bắt đầu' : 'Select a research paper to explore'}
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-[#123B68]/70 leading-relaxed">
                    {language === 'vi'
                      ? 'Khám phá các chủ đề AI & Machine Learning từ danh mục bên trái, chọn bài báo để bắt đầu học tập và phân tích chuyên sâu.'
                      : 'Browse through AI & Machine Learning research topics on the left, pick a paper to dive into its detailed analysis and math.'}
                  </p>
                </div>
              ) : selectedLesson ? (
                <div className="min-w-0">
                  <Suspense fallback={<LessonDetailFallback label={strings.lessonLoading} themeClasses={themeClasses} />}>
                    <LessonDetail
                      lesson={selectedLesson}
                      theme={theme}
                      language={language}
                      fallbackLocales={activeDomain?.mdx?.fallbackLocales}
                      hasNextLesson={Boolean(nextLesson)}
                      onSelectNextLesson={() => {
                        if (!nextLesson) return;
                        setCompletedLessonIds((current) => {
                          const next = new Set(current);
                          next.add(getLearningLessonIdentity(selectedLesson));
                          return next;
                        });
                        selectLesson(nextLesson.id);
                      }}
                    />
                  </Suspense>
                </div>
              ) : (
                <div className={cx('border p-6 text-sm font-black shadow-sm', themeClasses.radius.card, themeClasses.surface.card, themeClasses.mutedText)}>
                  {strings.contentInProgress}
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

function LessonDetailFallback({
  label,
  themeClasses,
}: {
  label: string;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const skeletonTone = themeClasses.isLight ? 'bg-[#B8C8DA]/60' : 'bg-[#A8B8C8]/14';

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={cx(
        'grid min-h-[22rem] min-w-0 overflow-hidden border shadow-sm',
        themeClasses.radius.panel,
        themeClasses.surface.card,
      )}
    >
      <span className="sr-only">{label}</span>
      <div className="border-b border-[#205089]/10 px-5 py-5 md:px-6">
        <div className={cx('h-7 w-2/3 max-w-xl animate-pulse rounded-md motion-reduce:animate-none', skeletonTone)} />
      </div>
      <div className="grid content-start gap-4 bg-white px-5 py-6 md:px-6">
        <div className={cx('h-4 w-full animate-pulse rounded motion-reduce:animate-none', skeletonTone)} />
        <div className={cx('h-4 w-11/12 animate-pulse rounded motion-reduce:animate-none', skeletonTone)} />
        <div className={cx('h-4 w-4/5 animate-pulse rounded motion-reduce:animate-none', skeletonTone)} />
      </div>
    </div>
  );
}

function CatalogLoadingFallback({
  label,
  themeClasses,
}: {
  label: string;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const skeletonTone = themeClasses.isLight ? 'bg-[#B8C8DA]/60' : 'bg-[#A8B8C8]/14';

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={cx('grid min-h-[18rem] content-start gap-5 border p-6 shadow-sm', themeClasses.radius.card, themeClasses.surface.card)}
    >
      <span className="sr-only">{label}</span>
      <div className={cx('h-8 w-1/3 min-w-48 animate-pulse rounded-md motion-reduce:animate-none', skeletonTone)} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className={cx('h-36 animate-pulse rounded-xl motion-reduce:animate-none', skeletonTone)} />
        ))}
      </div>
    </div>
  );
}

function LearningLoadError({
  message,
  retryLabel,
  onRetry,
  themeClasses,
}: {
  message: string;
  retryLabel: string;
  onRetry: () => void;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  return (
    <div role="alert" className={cx('grid min-h-48 place-content-center justify-items-center gap-4 border p-6 text-center shadow-sm', themeClasses.radius.card, themeClasses.surface.card)}>
      <p className={cx('text-sm font-bold', themeClasses.mutedText)}>{message}</p>
      <button type="button" onClick={onRetry} className={cx('min-h-11 px-4 text-sm font-black', themeClasses.radius.button, themeClasses.button.secondary, themeClasses.focusRing)}>
        {retryLabel}
      </button>
    </div>
  );
}

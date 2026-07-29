import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { Home, ListTree, PanelLeft, PanelLeftOpen } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { learningCatalog } from '../../content/learning/index.ts';
import {
  getFirstLearningLessonRoute,
  getGroupedLearningLessonsForDomain,
  getLearningDomain,
  isQuizLearningLesson,
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const [isLessonRailOpen, setIsLessonRailOpen] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const [collapsedChapters, setCollapsedChapters] = useState<Set<string>>(() => new Set());
  const [lessonSearchQuery, setLessonSearchQuery] = useState('');
  const [lessonRailFilter, setLessonRailFilter] = useState<LessonRailFilter>('all');
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(() => new Set());
  const [, startLessonTransition] = useTransition();
  const contentAreaRef = useRef<HTMLElement | null>(null);

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
        if (isQuizLearningLesson(lesson)) return [];
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
      if (window.matchMedia('(max-width: 1023px)').matches) {
        setIsSidebarOpen(false);
        setIsLessonRailOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLessonRailOpen, isSidebarOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      setIsSidebarOpen(event.matches);
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
    if (window.matchMedia('(max-width: 1023px)').matches) setIsSidebarOpen(false);
  };

  const openLearningHome = () => {
    setMode('path');
    navigate('/learning');
    if (window.matchMedia('(max-width: 1023px)').matches) setIsSidebarOpen(false);
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
      className={`learning-lab h-dvh min-h-0 w-full overflow-hidden lg:grid lg:transition-[grid-template-columns] lg:duration-300 ${
        isSidebarOpen ? 'lg:grid-cols-[300px_minmax(0,1fr)]' : 'lg:grid-cols-[72px_minmax(0,1fr)]'
      } ${themeClasses.page}`}
    >
      {isSidebarOpen ? (
        <button
          type="button"
          className="fixed inset-y-0 left-[min(320px,calc(100vw-3rem))] right-0 z-50 bg-[#0D1826]/35 backdrop-blur-[2px] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label={strings.closeSidebar}
        />
      ) : null}
      <aside className={cx(
        'fixed inset-y-0 left-0 z-[60] flex min-h-0 w-[min(320px,calc(100vw-3rem))] flex-col overflow-visible border-r shadow-xl transition-transform duration-300 lg:relative lg:z-50 lg:h-full lg:w-auto lg:translate-x-0 lg:shadow-sm',
        isSidebarOpen ? 'visible translate-x-0' : 'invisible -translate-x-full lg:visible lg:translate-x-0',
        themeClasses.sidebar,
      )}>
        <div
          className={cx(
            'flex h-16 w-full items-center',
            isSidebarOpen ? 'gap-3 px-4 text-left' : 'justify-center px-0',
          )}
        >
          <button
            type="button"
            className={cx(
              'group relative flex h-10 w-10 shrink-0 items-center justify-center font-black',
              themeClasses.radius.icon,
              themeClasses.brandTile,
              themeClasses.focusRing,
            )}
            onClick={isSidebarOpen ? onBackToLanding : () => setIsSidebarOpen(true)}
            title={isSidebarOpen ? strings.backToLanding : strings.openSidebar}
            aria-label={isSidebarOpen ? strings.backToLanding : strings.openSidebar}
          >
            <img
              src={futureHmiLogoUrl}
              alt="TorchViz3D"
              className={cx(
                'h-8 w-8 object-cover',
                themeClasses.radius.icon,
                !isSidebarOpen ? 'transition-opacity group-hover:opacity-0 group-focus-within:opacity-0' : undefined,
              )}
            />
            {!isSidebarOpen ? (
              <span
                className={cx(
                  'absolute inset-0 flex h-full w-full items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100',
                  themeClasses.radius.icon,
                  themeClasses.button.icon,
                )}
              >
                <PanelLeft className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
              </span>
            ) : null}
          </button>
          {isSidebarOpen ? (
            <>
              <button
                type="button"
                onClick={onBackToLanding}
                className={cx('min-w-0 flex-1 text-left', themeClasses.focusRing)}
                title={strings.backToLanding}
                aria-label={strings.backToLanding}
              >
                <span className="block truncate text-xl font-black leading-6">
                  TorchViz<span className={themeClasses.accentText}>3D</span>
                </span>
                <span className={cx('block truncate text-[11px] font-black uppercase tracking-wide', themeClasses.mutedText)}>
                  {strings.searchLabel}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className={cx('flex h-10 w-10 shrink-0 items-center justify-center', themeClasses.radius.icon, themeClasses.button.ghost)}
                title={strings.closeSidebar}
                aria-label={strings.closeSidebar}
                aria-pressed={isSidebarOpen}
              >
                <PanelLeft className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
              </button>
            </>
          ) : null}
        </div>

        <nav className={isSidebarOpen ? 'custom-scrollbar flex-1 overflow-y-auto px-3 pb-5 pt-5' : 'custom-scrollbar flex-1 overflow-y-auto px-3 py-5'} aria-label={strings.sidebarDomains}>
          <div className="grid gap-2">
            <button
              type="button"
              onClick={openLearningHome}
              className={cx(
                'flex h-11 w-full items-center text-left text-sm',
                isSidebarOpen ? 'gap-2 px-2' : 'justify-center px-0',
                themeClasses.radius.button,
                themeClasses.button.nav(!routeDomainId),
              )}
              title={strings.home}
              aria-current={!routeDomainId ? 'page' : undefined}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center text-sm" aria-hidden="true">
                <Home className="h-5 w-5" strokeWidth={1.8} />
              </span>
              {isSidebarOpen ? <span className="min-w-0 truncate">{strings.home}</span> : null}
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
                    'flex h-11 w-full items-center text-left text-sm',
                    isSidebarOpen ? 'gap-2 px-2' : 'justify-center px-0',
                    themeClasses.radius.button,
                    themeClasses.button.nav(isActive),
                  )}
                  title={text.title}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center text-sm" aria-hidden="true">
                    <DomainIcon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  {isSidebarOpen ? <span className="min-w-0 truncate">{text.title}</span> : null}
                </button>
              );
            })}
          </div>
        </nav>

      </aside>

      <div className="flex h-full min-h-0 min-w-0 flex-col">
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
              className={cx(
                'learning-lab-catalog -m-3 grid min-h-full w-[calc(100%+1.5rem)] items-start gap-3 p-3 transition-[grid-template-columns] duration-200 sm:-m-4 sm:w-[calc(100%+2rem)] sm:gap-4 sm:p-4',
                isLessonRailOpen ? 'lg:grid-cols-[300px_minmax(0,1fr)]' : 'lg:grid-cols-[44px_minmax(0,1fr)]',
              )}
            >
              <div
                className={cx(
                  'sticky top-4 hidden h-[calc(100vh-7rem)] lg:block',
                  !isLessonRailOpen && 'w-11',
                )}
              >
                <div
                  className={cx(
                    'absolute inset-y-0 left-0 w-[300px] min-w-0 overflow-hidden transition-[opacity,transform] duration-200',
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
                {!isLessonRailOpen ? (
                  <button
                    type="button"
                    onClick={openLessonRail}
                    className={themeClasses.rail.railToggleButton}
                    title={strings.lessonRailOpenLabel}
                    aria-label={strings.lessonRailOpenLabel}
                    aria-expanded={isLessonRailOpen}
                  >
                    <PanelLeftOpen className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
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

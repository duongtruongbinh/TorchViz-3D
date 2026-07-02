import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { BookOpen, Bot, BrainCircuit, Calculator, Code2, Cpu, Eye, Home, MessageSquareText, Network, PanelLeft, Route, ServerCog, ShieldCheck, type LucideIcon } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { learningCatalog } from '../../core/learning/content';
import {
  getFirstLearningLessonRoute,
  getGroupedLearningLessonsForDomain,
  getLearningDomain,
  resolveLearningLessonRoute,
} from '../../core/learning/selectors';
import type { LearningDomainId } from '../../core/learning/types';
import { resolveVisibleLearningLesson } from '../../core/learning/visibleLesson';
import { getStrings } from '../../lib/localization';
import { useStore } from '../../store/useStore';
import LearningLabHeader from './LearningLabHeader';
import LessonDetail from './lesson/LessonDetail';
import LessonRail, { filterLessonRailGroups, type LessonRailFilter } from './lesson/LessonRail';
import { getDomainText } from './learningText';
import DomainCatalog from './shell/DomainCatalog';
import ReviewMode from './shell/ReviewMode';
import { cx, getLearningLabTheme } from './theme';

type LearningLabMode = 'path' | 'review';

type LearningLabViewProps = {
  onBackToLanding: () => void;
};

const DOMAIN_IDS = new Set<LearningDomainId>(learningCatalog.domains.map((domain) => domain.id));
const DOMAIN_ICONS: Record<LearningDomainId, LucideIcon> = {
  'programming-foundation': Code2,
  'math-statistics-ai': Calculator,
  fundamentals: BookOpen,
  'deep-learning': BrainCircuit,
  cv: Eye,
  nlp: MessageSquareText,
  'llm-ai-engineering': Cpu,
  'mlops-llmops-production-systems': ServerCog,
  'ai-system-design': Network,
  'ai-ethics-safety-governance': ShieldCheck,
  'reinforcement-learning': Route,
  'robot-learning': Bot,
};
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
  const routePracticeId = searchParams.get('practice');

  const language = useStore((s) => s.language);
  const [mode, setMode] = useState<LearningLabMode>('path');
  const theme = 'light' as const;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [collapsedChapters, setCollapsedChapters] = useState<Set<string>>(() => new Set());
  const [lessonSearchQuery, setLessonSearchQuery] = useState('');
  const [lessonRailFilter, setLessonRailFilter] = useState<LessonRailFilter>('all');
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(() => new Set());
  const [, startLessonTransition] = useTransition();

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
  const lessonIndexById = useMemo(() => new Map(domainLessons.map((lesson, index) => [lesson.id, index])), [domainLessons]);
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
  const detailLessonIndex = selectedLesson ? lessonIndexById.get(selectedLesson.id) ?? -1 : -1;
  const nextLesson = detailLessonIndex >= 0 ? domainLessons[detailLessonIndex + 1] ?? null : null;

  useEffect(() => {
    setCollapsedChapters(new Set());
    setLessonSearchQuery('');
    setLessonRailFilter('all');
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
    if (!routePracticeId || !selectedLesson?.practice.some((practice) => practice.id === routePracticeId)) return;
    const frameId = window.requestAnimationFrame(() => {
      document.getElementById(`practice-${routePracticeId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [routePracticeId, selectedLesson?.id]);

  const openDomain = (nextDomainId: LearningDomainId) => {
    setMode('path');
    const firstRoute = getFirstLearningLessonRoute(learningCatalog, nextDomainId);
    if (!firstRoute) {
      navigate(`/learning/${nextDomainId}`);
      return;
    }
    navigate(`/learning/${nextDomainId}/${firstRoute.track.id}?lesson=${firstRoute.lesson.id}`);
  };

  const openLearningHome = () => {
    setMode('path');
    navigate('/learning');
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

  return (
    <main
      className={`learning-lab grid min-h-screen w-full overflow-hidden transition-[grid-template-columns] duration-300 ${
        isSidebarOpen ? 'grid-cols-[300px_minmax(0,1fr)]' : 'grid-cols-[72px_minmax(0,1fr)]'
      } ${themeClasses.page}`}
    >
      <aside className={cx('relative z-50 flex min-h-screen flex-col overflow-visible border-r shadow-sm transition-colors', themeClasses.sidebar)}>
        <div
          className={cx(
            'flex h-16 w-full items-center',
            isSidebarOpen ? 'gap-3 px-4 text-left' : 'justify-center px-0',
          )}
        >
          <span
            className={cx(
              'group relative flex h-10 w-10 shrink-0 items-center justify-center font-black',
              'cursor-pointer',
              themeClasses.radius.icon,
              themeClasses.brandTile,
            )}
            onClick={isSidebarOpen ? onBackToLanding : undefined}
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
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsSidebarOpen(true);
                }}
                className={cx(
                  'absolute inset-0 flex h-full w-full items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100',
                  themeClasses.radius.icon,
                  themeClasses.button.icon,
                )}
                title={strings.openSidebar}
                aria-label={strings.openSidebar}
                aria-pressed={isSidebarOpen}
              >
                <PanelLeft className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
              </button>
            ) : null}
          </span>
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

        <nav className={isSidebarOpen ? 'flex-1 overflow-y-auto px-3 pb-5 pt-5' : 'flex-1 overflow-y-auto px-3 py-5'} aria-label={strings.sidebarDomains}>
          <div className="grid gap-2">
            <button
              type="button"
              onClick={openLearningHome}
              className={cx(
                'flex h-11 w-full items-center text-left text-sm',
                isSidebarOpen ? 'gap-2 px-2' : 'justify-center px-0',
                themeClasses.radius.button,
                themeClasses.button.nav(!routeDomainId && mode === 'path'),
              )}
              title={strings.home}
              aria-current={!routeDomainId && mode === 'path' ? 'page' : undefined}
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

      <div className="flex min-h-screen min-w-0 flex-col">
        <LearningLabHeader
          mode={mode}
          theme={theme}
          onModeChange={setMode}
        />
        <section className={cx('learning-lab-content-area min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4', themeClasses.content)}>
          {mode === 'review' ? (
            <ReviewMode
              catalog={learningCatalog}
              domainId={routeDomainId}
              language={language}
              theme={theme}
            />
          ) : !routeDomainId ? (
            <DomainCatalog language={language} theme={theme} />
          ) : activeDomain && !activeTrack ? (
            <div className={cx('border p-6 text-sm font-black shadow-sm', themeClasses.radius.card, themeClasses.surface.card, themeClasses.mutedText)}>
              {strings.contentInProgress}
            </div>
          ) : activeTrack && railSelectedLesson ? (
            <section className="learning-lab-catalog -m-4 grid h-full min-h-0 w-[calc(100%+2rem)] gap-4 p-4 lg:grid-cols-[300px_minmax(0,1fr)]">
              <LessonRail
                groups={filteredGroupedDomainLessons}
                collapsedTrackIds={collapsedChapters}
                completedLessonIds={completedLessonIds}
                isFiltered={isLessonRailFiltered}
                language={language}
                lessonIndexById={lessonIndexById}
                searchQuery={lessonSearchQuery}
                selectedFilter={lessonRailFilter}
                selectedLesson={railSelectedLesson}
                theme={theme}
                onClearSearch={() => setLessonSearchQuery('')}
                onSearchChange={setLessonSearchQuery}
                onSelectFilter={setLessonRailFilter}
                onSelectLesson={selectLesson}
                onToggleTrack={toggleChapter}
              />
              {selectedLesson ? (
                <LessonDetail
                  lesson={selectedLesson}
                  theme={theme}
                  language={language}
                  selectedPracticeId={routePracticeId}
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

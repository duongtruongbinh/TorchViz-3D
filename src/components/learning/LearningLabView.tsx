import { useEffect, useMemo, useState } from 'react';
import { ArrowLeftToLine, PanelLeft } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { learningCatalog } from '../../core/learning/content';
import {
  getLearningDomain,
  getLearningLessonsForTrack,
  getLearningTrack,
  getLearningTracksForDomain,
} from '../../core/learning/selectors';
import type { LearningDomainId, LearningTrack } from '../../core/learning/types';
import { getStrings } from '../../lib/localization';
import { useStore } from '../../store/useStore';
import LearningLabHeader from './LearningLabHeader';
import LessonDetail from './lesson/LessonDetail';
import LessonNode from './lesson/LessonNode';
import { getDomainText, getDomainTextById, getTrackText } from './learningText';
import DomainCatalog from './shell/DomainCatalog';
import ReviewMode from './shell/ReviewMode';
import TrackList from './shell/TrackList';
import { cx, getLearningLabTheme } from './theme';

type LearningLabMode = 'path' | 'review';

type LearningLabViewProps = {
  onBackToLanding: () => void;
};

const DOMAIN_IDS = new Set<LearningDomainId>(learningCatalog.domains.map((domain) => domain.id));

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
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const strings = getStrings(language).learningLab;
  const themeClasses = getLearningLabTheme(theme);

  const activeDomain = routeDomainId ? getLearningDomain(learningCatalog, routeDomainId) : null;
  const activeTracks = routeDomainId ? getLearningTracksForDomain(learningCatalog, routeDomainId) : [];
  const activeTrack = routeDomainId && trackId ? getLearningTrack(learningCatalog, routeDomainId, trackId) : null;
  const trackLessons = useMemo(() => activeTrack ? getLearningLessonsForTrack(learningCatalog, activeTrack) : [], [activeTrack]);
  const selectedLesson = trackLessons.find((lesson) => lesson.id === selectedLessonId) ?? trackLessons[0] ?? null;

  useEffect(() => {
    if (!activeTrack || !trackLessons.length) return;
    if (routeLessonId && trackLessons.some((lesson) => lesson.id === routeLessonId)) {
      if (selectedLessonId !== routeLessonId) setSelectedLessonId(routeLessonId);
      return;
    }
    if (!selectedLesson || selectedLesson.id !== selectedLessonId) {
      setSelectedLessonId(trackLessons[0].id);
    }
  }, [activeTrack, routeLessonId, selectedLesson, selectedLessonId, trackLessons]);

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
    navigate(`/learning/${nextDomainId}`);
  };

  const openTrack = (track: LearningTrack) => {
    setMode('path');
    navigate(`/learning/${track.domainId}/${track.id}`);
  };

  return (
    <main
      className={`learning-lab grid min-h-screen w-full overflow-hidden transition-[grid-template-columns] duration-300 ${
        isSidebarOpen ? 'grid-cols-[300px_minmax(0,1fr)]' : 'grid-cols-[72px_minmax(0,1fr)]'
      } ${themeClasses.page}`}
    >
      <aside className={cx('relative z-50 flex min-h-screen flex-col overflow-visible border-r shadow-sm transition-colors', themeClasses.radius.sidebarEdge, themeClasses.sidebar)}>
        <div
          className={cx(
            'flex h-16 w-full items-center rounded-tr-lg',
            isSidebarOpen ? 'gap-3 px-5 text-left' : 'justify-center px-0',
          )}
        >
          <span className={cx('group relative flex h-10 w-10 shrink-0 items-center justify-center border font-black', themeClasses.radius.icon, themeClasses.brandTile)}>
            <span className={!isSidebarOpen ? 'transition-opacity group-hover:opacity-0 group-focus-within:opacity-0' : undefined}>
              TV
            </span>
            {!isSidebarOpen ? (
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
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
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xl font-black leading-6">
                  TorchViz<span className={themeClasses.accentText}>3D</span>
                </span>
                <span className={cx('block truncate text-[11px] font-black uppercase tracking-wide', themeClasses.mutedText)}>
                  {strings.searchLabel}
                </span>
              </span>
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

        <nav className={isSidebarOpen ? 'flex-1 px-4 py-5' : 'flex-1 px-3 py-5'} aria-label={strings.sidebarDomains}>
          {isSidebarOpen ? (
            <div className={cx('mb-3 px-1 text-xs font-black uppercase tracking-wide', themeClasses.mutedText)}>
              {strings.sidebarDomains}
            </div>
          ) : null}

          <div className="grid gap-2">
            {learningCatalog.domains.map((domain, index) => {
              const text = getDomainText(language, domain);
              const isActive = routeDomainId === domain.id;

              return (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => openDomain(domain.id)}
                  className={cx(
                    'flex h-11 w-full items-center text-left text-sm',
                    isSidebarOpen ? 'gap-3 px-2' : 'justify-center px-0',
                    themeClasses.radius.button,
                    themeClasses.button.nav(isActive),
                  )}
                  title={text.title}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center text-sm" aria-hidden="true">
                    {index + 1}
                  </span>
                  {isSidebarOpen ? <span className="min-w-0 truncate">{text.title}</span> : null}
                </button>
              );
            })}
          </div>
        </nav>

        <div className={isSidebarOpen ? 'px-4 pb-5' : 'px-3 pb-5'}>
          <button
            type="button"
            onClick={onBackToLanding}
            className={cx(
              'flex h-11 w-full items-center text-sm',
              isSidebarOpen ? 'gap-3 px-2 text-left' : 'justify-center px-0',
              themeClasses.radius.button,
              themeClasses.button.nav(false),
            )}
            title={strings.backToLanding}
            aria-label={strings.backToLanding}
          >
            <ArrowLeftToLine className="h-5 w-5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
            {isSidebarOpen ? <span className="min-w-0 truncate">{strings.backToLanding}</span> : null}
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-col">
        <LearningLabHeader
          mode={mode}
          theme={theme}
          onModeChange={setMode}
          onToggleTheme={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
        />

        <section className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-5">
          {mode === 'review' ? (
            <ReviewMode
              catalog={learningCatalog}
              domainId={routeDomainId}
              language={language}
              theme={theme}
            />
          ) : !routeDomainId ? (
            <DomainCatalog catalog={learningCatalog} language={language} theme={theme} onOpenDomain={openDomain} />
          ) : activeDomain && !activeTrack ? (
            <section className="grid gap-5">
              <div className={cx('border p-6 shadow-sm', themeClasses.radius.card, themeClasses.surface.card)}>
                <div className={cx('text-xs font-black uppercase tracking-wide', themeClasses.eyebrowText)}>
                  {getDomainText(language, activeDomain).title}
                </div>
                <h1 className={cx('mt-2 text-3xl font-black leading-tight', themeClasses.titleText)}>
                  {getDomainText(language, activeDomain).title}
                </h1>
                <p className={cx('mt-3 max-w-3xl text-sm leading-6', themeClasses.bodyText)}>
                  {getDomainText(language, activeDomain).description}
                </p>
              </div>
              <TrackList tracks={activeTracks} language={language} theme={theme} onOpenTrack={openTrack} />
            </section>
          ) : activeTrack && selectedLesson ? (
            <section className="grid min-h-0 w-full gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
              <aside className="grid max-h-full gap-3 overflow-auto pr-1">
                <div className={cx('border p-4 shadow-sm', themeClasses.radius.card, themeClasses.surface.card)}>
                  <div className={cx('text-[11px] font-black uppercase tracking-wide', themeClasses.mutedText)}>
                    {getDomainTextById(language, activeTrack.domainId).title}
                  </div>
                  <h2 className={cx('mt-1 text-lg font-black', themeClasses.titleText)}>
                    {getTrackText(language, activeTrack).title}
                  </h2>
                  <p className={cx('mt-2 text-xs leading-5', themeClasses.mutedText)}>
                    {getTrackText(language, activeTrack).description}
                  </p>
                </div>
                {trackLessons.map((lesson, index) => (
                  <LessonNode
                    key={lesson.id}
                    lesson={lesson}
                    index={index}
                    isSelected={lesson.id === selectedLesson.id}
                    language={language}
                    theme={theme}
                    onSelect={setSelectedLessonId}
                  />
                ))}
              </aside>
              <LessonDetail
                lesson={selectedLesson}
                theme={theme}
                language={language}
                selectedPracticeId={routePracticeId}
              />
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

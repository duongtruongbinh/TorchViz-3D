import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { learningCatalog } from '../../core/learning/content';
import {
  getLearningDomain,
  getLearningLessonsForTrack,
  getLearningTrack,
  getLearningTracksForDomain,
} from '../../core/learning/selectors';
import type { LearningDomainId, LearningTrack } from '../../core/learning/types';
import { useStore } from '../../store/useStore';
import LearningLabHeader from './LearningLabHeader';
import LessonDetail from './lesson/LessonDetail';
import LessonNode from './lesson/LessonNode';
import { getDomainText, getTrackText } from './learningText';
import DomainCatalog from './shell/DomainCatalog';
import ReviewMode from './shell/ReviewMode';
import TrackList from './shell/TrackList';

type LearningLabMode = 'path' | 'review';

type LearningLabViewProps = {
  onBackToLanding: () => void;
};

const DOMAIN_IDS: LearningDomainId[] = ['fundamentals', 'cv', 'nlp', 'reinforcement-learning', 'robot-learning'];

function isLearningDomainId(value: string | undefined): value is LearningDomainId {
  return Boolean(value && DOMAIN_IDS.includes(value as LearningDomainId));
}

export default function LearningLabView({ onBackToLanding }: LearningLabViewProps) {
  const navigate = useNavigate();
  const { domainId, trackId } = useParams();
  const routeDomainId = isLearningDomainId(domainId) ? domainId : null;
  const language = useStore((s) => s.language);
  const [mode, setMode] = useState<LearningLabMode>('path');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const isLight = theme === 'light';

  const activeDomain = routeDomainId ? getLearningDomain(learningCatalog, routeDomainId) : null;
  const activeTracks = routeDomainId ? getLearningTracksForDomain(learningCatalog, routeDomainId) : [];
  const activeTrack = routeDomainId && trackId ? getLearningTrack(learningCatalog, routeDomainId, trackId) : null;
  const trackLessons = useMemo(() => activeTrack ? getLearningLessonsForTrack(learningCatalog, activeTrack) : [], [activeTrack]);
  const selectedLesson = trackLessons.find((lesson) => lesson.id === selectedLessonId) ?? trackLessons[0] ?? null;

  useEffect(() => {
    if (!activeTrack || !trackLessons.length) return;
    if (!selectedLesson || selectedLesson.id !== selectedLessonId) {
      setSelectedLessonId(trackLessons[0].id);
    }
  }, [activeTrack, selectedLesson, selectedLessonId, trackLessons]);

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
      } ${
        isLight
          ? 'learning-lab-light bg-[#f6fbff] text-slate-950'
          : 'bg-[#050b16] text-slate-100'
      }`}
    >
      <aside className={`min-h-screen overflow-hidden rounded-r-lg border-r shadow-sm transition-colors ${
        isLight
          ? 'border-sky-100 bg-gradient-to-b from-white via-[#f6fbff] to-[#eef6ff] text-slate-950 shadow-sky-100/70'
          : 'border-slate-800 bg-gradient-to-b from-[#101827] via-[#0b1220] to-[#050b16] text-slate-100 shadow-black/30'
      }`}>
        <button
          type="button"
          onClick={onBackToLanding}
          className={`flex h-16 w-full items-center rounded-tr-lg transition-colors ${
            isSidebarOpen ? 'gap-3 px-5 text-left' : 'justify-center px-0'
          } ${isLight ? 'hover:bg-sky-50' : 'hover:bg-slate-800/80'}`}
          title="Back to landing"
          aria-label="Back to landing"
        >
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border font-black ${
            isLight ? 'border-sky-100 bg-[#eef6ff] text-sky-700' : 'border-slate-700 bg-slate-950 text-sky-300'
          }`}>
            TV
          </span>
          {isSidebarOpen ? (
            <span className="min-w-0">
              <span className="block truncate text-xl font-black leading-6">
                TorchViz<span className={isLight ? 'text-sky-600' : 'text-sky-300'}>3D</span>
              </span>
              <span className={`block truncate text-[11px] font-black uppercase tracking-wide ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Learning Lab
              </span>
            </span>
          ) : null}
        </button>

        <nav className={isSidebarOpen ? 'px-4 py-5' : 'px-3 py-5'} aria-label="Learning Lab domains">
          {isSidebarOpen ? (
            <div className={`mb-3 px-1 text-xs font-black uppercase tracking-wide ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              Domains
            </div>
          ) : null}

          <div className="grid gap-2">
            {learningCatalog.domains.map((domain, index) => {
              const text = getDomainText(language, domain.id);
              const isActive = routeDomainId === domain.id;

              return (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => openDomain(domain.id)}
                  className={`flex h-11 w-full items-center rounded-xl text-left text-sm font-black transition-colors ${
                    isSidebarOpen ? 'gap-3 px-2' : 'justify-center px-0'
                  } ${
                    isActive
                      ? isLight ? 'bg-sky-50 text-sky-700' : 'bg-slate-800/90 text-sky-200'
                      : isLight ? 'text-slate-600 hover:bg-sky-50 hover:text-sky-700' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
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
      </aside>

      <div className="flex min-h-screen min-w-0 flex-col">
        <LearningLabHeader
          mode={mode}
          theme={theme}
          isSidebarOpen={isSidebarOpen}
          onModeChange={setMode}
          onToggleTheme={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
          onToggleSidebar={() => setIsSidebarOpen((value) => !value)}
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
            <DomainCatalog catalog={learningCatalog} language={language} onOpenDomain={openDomain} />
          ) : activeDomain && !activeTrack ? (
            <section className="grid gap-5">
              <div className="rounded-xl border border-sky-100 bg-white p-6 shadow-sm shadow-sky-100/70">
                <div className="text-xs font-black uppercase tracking-wide text-sky-700">
                  {getDomainText(language, activeDomain.id).title}
                </div>
                <h1 className="mt-2 text-3xl font-black leading-tight text-slate-950">
                  {getDomainText(language, activeDomain.id).title}
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                  {getDomainText(language, activeDomain.id).description}
                </p>
              </div>
              <TrackList tracks={activeTracks} language={language} onOpenTrack={openTrack} />
            </section>
          ) : activeTrack && selectedLesson ? (
            <section className="grid min-h-0 w-full gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
              <aside className="grid max-h-full gap-3 overflow-auto pr-1">
                <div className="rounded-xl border border-sky-100 bg-white p-4 shadow-sm shadow-sky-100/70">
                  <div className="text-[11px] font-black uppercase tracking-wide text-slate-400">
                    {getDomainText(language, activeTrack.domainId).title}
                  </div>
                  <h2 className="mt-1 text-lg font-black text-slate-950">
                    {getTrackText(language, activeTrack).title}
                  </h2>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
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
                    onSelect={setSelectedLessonId}
                  />
                ))}
              </aside>
              <LessonDetail lesson={selectedLesson} theme={theme} language={language} />
            </section>
          ) : (
            <div className="rounded-xl border border-sky-100 bg-white p-6 text-sm font-black text-slate-500 shadow-sm shadow-sky-100/70">
              {language === 'vi' ? 'Nội dung đang hoàn thiện.' : 'Content is in progress.'}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

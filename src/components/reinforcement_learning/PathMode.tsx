import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { rlLearningRoles } from '../../core/rlLearningContent';
import type { RLLearningLesson, RLLearningRole } from '../../core/rlTypes';
import { getStrings } from '../../lib/localization';
import { useStore } from '../../store/useStore';
import rlLogoUrl from '../../../docs/assets/Future-HMI ip.gif';
import LessonDetail from './LessonDetail';
import PathNode from './PathNode';

type PathModeProps = {
  lessons: RLLearningLesson[];
  selectedLessonId: string;
  onSelectLesson: (lessonId: string) => void;
  theme: 'dark' | 'light';
};

export default function PathMode({
  lessons,
  selectedLessonId,
  onSelectLesson,
  theme,
}: PathModeProps) {
  const navigate = useNavigate();
  const { trackId } = useParams();
  const isLight = theme === 'light';

  const language = useStore((s) => s.language);
  const t = getStrings(language).reinforcementLearning;

  const initialRoleId =
    rlLearningRoles.find((role) => role.id === trackId)?.id ?? rlLearningRoles[0]?.id ?? '';

  const [level, setLevel] = useState<'role' | 'domain' | 'lesson'>(trackId ? 'domain' : 'role');
  const [selectedRoleId, setSelectedRoleId] = useState(initialRoleId);
  const [selectedDomainId, setSelectedDomainId] = useState('');

  const selectedRole = rlLearningRoles.find((role) => role.id === selectedRoleId) ?? rlLearningRoles[0];
  const selectedRoleText = selectedRole ? getRoleText(t, selectedRole.id) : undefined;
  const selectedDomain =
    selectedRole?.domains.find((domain) => domain.id === selectedDomainId) ?? selectedRole?.domains[0];
  const selectedDomainText =
    selectedRole && selectedDomain ? getDomainText(t, selectedRole.id, selectedDomain.id) : undefined;

  const scopedLessons = useMemo(() => {
    if (!selectedDomain || level !== 'lesson') return [];

    return selectedDomain.lessonIds
      .map((lessonId) => lessons.find((lesson) => lesson.id === lessonId))
      .filter((lesson): lesson is RLLearningLesson => Boolean(lesson));
  }, [lessons, level, selectedDomain]);

  const selectedLesson =
    scopedLessons.find((lesson) => lesson.id === selectedLessonId) ?? scopedLessons[0] ?? lessons[0];

  const startFirstLesson = () => {
    const firstRole = rlLearningRoles[0];
    const firstDomain = firstRole?.domains[0];
    const firstLessonId = firstDomain?.lessonIds[0] ?? lessons[0]?.id;

    if (firstRole) {
      setSelectedRoleId(firstRole.id);
      navigate(`/reinforcement-learning/roadmap/${firstRole.id}`);
    }

    if (firstDomain) setSelectedDomainId(firstDomain.id);
    if (firstLessonId) onSelectLesson(firstLessonId);

    setLevel('lesson');
  };

  const openRole = (roleId: string) => {
    const role = rlLearningRoles.find((item) => item.id === roleId);

    navigate(`/reinforcement-learning/roadmap/${roleId}`);
    setSelectedRoleId(roleId);
    setSelectedDomainId(role?.domains[0]?.id ?? '');
    setLevel('domain');
  };

  useEffect(() => {
    if (!trackId) return;

    const matchingRole = rlLearningRoles.find((role) => role.id === trackId);
    if (!matchingRole) return;

    setSelectedRoleId(matchingRole.id);
    setSelectedDomainId(matchingRole.domains[0]?.id ?? '');
    setLevel((currentLevel) => (currentLevel === 'lesson' ? currentLevel : 'domain'));
  }, [trackId]);

  useEffect(() => {
    if (level !== 'lesson') return;
    if (selectedLesson && selectedLesson.id !== selectedLessonId) {
      onSelectLesson(selectedLesson.id);
    }
  }, [level, onSelectLesson, selectedLesson, selectedLessonId]);

  if (level === 'lesson' && selectedLesson) {
    return (
      <section
        className={`min-h-[calc(100vh-7.5rem)] w-full rounded-xl border p-5 shadow-sm ${
          isLight
            ? 'border-sky-100 bg-white text-slate-900 shadow-sky-100/70'
            : 'border-slate-800 bg-[#0b1220] text-slate-100 shadow-black/20'
        }`}
      >
        <div
          className={`mb-5 flex flex-wrap items-center gap-1.5 text-[11px] font-black uppercase tracking-wide ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              navigate('/reinforcement-learning');
              setLevel('role');
            }}
            className={isLight ? 'hover:text-sky-700' : 'hover:text-sky-300'}
          >
            {t.role}
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => setLevel('domain')}
            className={isLight ? 'hover:text-sky-700' : 'hover:text-sky-300'}
          >
            {selectedRoleText?.title}
          </button>
          <span>/</span>
          <span className={isLight ? 'text-sky-700' : 'text-sky-300'}>{selectedDomainText?.title}</span>
        </div>

        <div className="grid min-h-0 w-full gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="grid max-h-full gap-3 overflow-auto pr-1">
            {scopedLessons.map((lesson, index) => (
              <PathNode
                key={lesson.id}
                lesson={lesson}
                index={index}
                isSelected={lesson.id === selectedLesson.id}
                onSelect={onSelectLesson}
              />
            ))}
          </div>

          <div className="min-w-0" data-tour="rl-lesson-detail">
            <LessonDetail lesson={selectedLesson} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={isLight ? 'w-full text-slate-900' : 'w-full text-slate-100'}>
      <CourseHero lessonCount={lessons.length} onStart={startFirstLesson} isLight={isLight} />

      <RoadmapShelf
        lessons={lessons}
        selectedRole={level === 'domain' ? selectedRole : undefined}
        isLight={isLight}
        onBackToRoadmaps={() => {
          navigate('/reinforcement-learning');
          setLevel('role');
          setSelectedDomainId('');
        }}
        onOpenRole={openRole}
        onOpenDomain={(domainId) => {
          const domain = selectedRole?.domains.find((item) => item.id === domainId);
          const firstLessonId = domain?.lessonIds[0];

          setSelectedDomainId(domainId);
          if (firstLessonId) onSelectLesson(firstLessonId);
          setLevel('lesson');
        }}
      />
    </section>
  );
}

function CourseHero({
  lessonCount,
  onStart,
  isLight,
}: {
  lessonCount: number;
  onStart: () => void;
  isLight: boolean;
}) {
  return (
    <section
      className={`overflow-hidden rounded-xl border shadow-sm ${
        isLight
          ? 'border-sky-100 bg-white shadow-sky-100/70'
          : 'border-slate-800 bg-[#0b1220] shadow-black/20'
      }`}
    >
      <div className="grid min-h-[300px] lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
        <div
          className={`flex flex-col justify-center p-8 lg:p-10 ${
            isLight
              ? 'bg-gradient-to-br from-white via-[#f6fbff] to-[#eef6ff] text-slate-950'
              : 'bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#050b16] text-white'
          }`}
        >
          <div
            className={`mb-4 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-black ${
              isLight ? 'bg-sky-50 text-sky-700' : 'bg-sky-500/15 text-sky-200'
            }`}
          >
            ☆ Featured
          </div>

          <h1 className={`max-w-3xl text-3xl font-black leading-tight tracking-tight lg:text-4xl ${isLight ? 'text-slate-950' : 'text-white'}`}>
            Reinforcement Learning - Beginner to Practical
          </h1>

          <p className={`mt-4 max-w-2xl text-sm leading-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            A focused learning path for understanding agents, rewards, policies,
            value estimates, and hands-on practice from fundamentals to implementation.
          </p>

          <div className={`mt-6 flex flex-wrap items-center gap-4 text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>{lessonCount} lessons</span>
            <span>Self-paced</span>
            <span>Interactive practice</span>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onStart}
              className="rounded-lg bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-sm transition-colors hover:bg-sky-700"
            >
              ▶ Start learning
            </button>

            <button
              type="button"
              className={`rounded-lg border px-5 py-3 text-sm font-black shadow-sm transition-colors ${
                isLight
                  ? 'border-sky-100 bg-white text-slate-700 hover:bg-sky-50 hover:text-sky-700'
                  : 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800'
              }`}
            >
              ▱ Save
            </button>
          </div>
        </div>

        <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#dff3ff] via-[#cfe3ff] to-[#8d6bff] p-8">
          <div className="absolute right-[-70px] top-[-70px] h-44 w-44 rounded-full bg-white/25" />
          <div className="absolute bottom-[-80px] left-[-80px] h-52 w-52 rounded-full bg-sky-200/25" />

          <div className="relative flex flex-col items-center">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-white/35 p-3 shadow-2xl shadow-sky-950/20 backdrop-blur">
              <img src={rlLogoUrl} alt="" className="h-full w-full rounded-2xl object-cover" />
            </div>
            <div className="mt-5 rounded-full bg-white/35 px-4 py-2 text-sm font-black text-slate-800 backdrop-blur">
              TorchViz3D RL
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoadmapShelf({
  lessons,
  selectedRole,
  isLight,
  onBackToRoadmaps,
  onOpenRole,
  onOpenDomain,
}: {
  lessons: RLLearningLesson[];
  selectedRole?: RLLearningRole;
  isLight: boolean;
  onBackToRoadmaps: () => void;
  onOpenRole: (roleId: string) => void;
  onOpenDomain: (domainId: string) => void;
}) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).reinforcementLearning;

  const roadmaps = selectedRole?.domains ?? rlLearningRoles;
  const isDomainView = Boolean(selectedRole);

  return (
    <section
      className={`mt-6 rounded-xl border p-4 shadow-sm ${
        isLight
          ? 'border-sky-100 bg-white text-slate-900 shadow-sky-100/70'
          : 'border-slate-800 bg-[#0b1220] text-slate-100 shadow-black/20'
      }`}
    >
      <div className="grid gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <label
            className={`flex min-w-[260px] flex-1 items-center gap-2 rounded-lg px-4 py-3 text-sm ${
              isLight ? 'bg-[#eef6ff] text-slate-500' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-5 w-5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
              {isDomainView ? `Search ${getRoleText(t, selectedRole!.id).title}...` : 'Search roadmaps...'}
            </span>
          </label>

          <div className="ml-auto flex gap-2">
            <button
              type="button"
              className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                isLight
                  ? 'border-sky-200 bg-sky-50 text-sky-700'
                  : 'border-sky-500/30 bg-sky-500/10 text-sky-300'
              }`}
              title="Grid view"
              aria-label="Grid view"
            >
              ⠿
            </button>
            <button
              type="button"
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                isLight ? 'bg-[#eef6ff] text-slate-600' : 'bg-slate-900 text-slate-400'
              }`}
              title="List view"
              aria-label="List view"
            >
              ☷
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <FilterButton label="English" icon="◎" active isLight={isLight} />
          <FilterButton label="Highest rated" icon="↕" active isLight={isLight} />
        </div>
      </div>

      <div className={`mt-6 flex items-center gap-3 text-sm font-black ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
        {isDomainView ? (
          <button
            type="button"
            onClick={onBackToRoadmaps}
            className={isLight ? 'text-sky-700 hover:text-sky-800' : 'text-sky-300 hover:text-sky-200'}
          >
            ← All roadmaps
          </button>
        ) : null}
        <span>
          {roadmaps.length} {isDomainView ? 'domains' : 'roadmaps'}
        </span>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
        {isDomainView
          ? selectedRole!.domains.map((domain, index) => {
              const domainText = getDomainText(t, selectedRole!.id, domain.id);

              return (
                <DomainRoadmapCard
                  key={domain.id}
                  title={domainText.title}
                  description={domainText.longDescription}
                  index={index}
                  lessonCount={domain.lessonIds.length}
                  isLight={isLight}
                  onOpen={() => onOpenDomain(domain.id)}
                />
              );
            })
          : rlLearningRoles.map((role, index) => (
              <RoadmapCard
                key={role.id}
                role={role}
                index={index}
                lessonCount={lessons.length}
                isLight={isLight}
                onOpen={() => onOpenRole(role.id)}
              />
            ))}
      </div>
    </section>
  );
}

function FilterButton({
  label,
  icon,
  active = false,
  isLight,
}: {
  label: string;
  icon: string;
  active?: boolean;
  isLight: boolean;
}) {
  return (
    <button
      type="button"
      className={`rounded-lg border px-4 py-2 text-sm font-black transition-colors ${
        active
          ? isLight
            ? 'border-sky-200 bg-sky-50 text-slate-950 hover:bg-sky-100'
            : 'border-sky-500/30 bg-sky-500/10 text-sky-200 hover:bg-sky-500/15'
          : isLight
            ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
            : 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
      }`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
}

function RoadmapCard({
  role,
  index,
  lessonCount,
  isLight,
  onOpen,
}: {
  role: RLLearningRole;
  index: number;
  lessonCount: number;
  isLight: boolean;
  onOpen: () => void;
}) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).reinforcementLearning;
  const profile = getRoleProfile(t, role.id);
  const roleText = getRoleText(t, role.id);
  const isRobotTrack = role.id === 'robot-learning';

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group w-full rounded-xl border p-5 text-left shadow-sm transition-transform duration-150 hover:-translate-y-0.5 focus:outline-none focus:ring-2 ${
        isLight
          ? 'border-sky-100 bg-gradient-to-br from-white to-[#f6fbff] shadow-sky-100/70 hover:border-sky-300 focus:ring-sky-300'
          : 'border-slate-800 bg-gradient-to-br from-[#111827] to-[#0b1220] shadow-black/20 hover:border-sky-500/50 focus:ring-sky-500/50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${isLight ? 'bg-[#eef6ff]' : 'bg-slate-800'}`}>
          {isRobotTrack ? '🤖' : '♻'}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-black ${
                index === 0
                  ? isLight ? 'bg-sky-100 text-sky-700' : 'bg-sky-500/15 text-sky-200'
                  : isLight ? 'bg-violet-100 text-violet-700' : 'bg-violet-500/15 text-violet-200'
              }`}
            >
              {index === 0 ? 'Beginner' : 'Intermediate'}
            </span>
          </div>

          <h3 className={`line-clamp-2 text-lg font-black leading-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
            {roleText.title}
          </h3>

          <p className={`mt-3 line-clamp-2 text-sm leading-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {profile.description}
          </p>

          <div className={`mt-4 flex flex-wrap items-center gap-3 text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
            <span>☆</span>
            <span>▱ {lessonCount}</span>
            <span>◷ 36h</span>
            <span>♧ {isRobotTrack ? 39 : 59}</span>
          </div>

          <span className={`mt-5 block text-sm font-black transition-colors ${isLight ? 'text-sky-700 group-hover:text-sky-800' : 'text-sky-300 group-hover:text-sky-200'}`}>
            Start roadmap
          </span>
        </div>
      </div>
    </button>
  );
}

function DomainRoadmapCard({
  title,
  description,
  index,
  lessonCount,
  isLight,
  onOpen,
}: {
  title: string;
  description: string;
  index: number;
  lessonCount: number;
  isLight: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group w-full rounded-xl border p-5 text-left shadow-sm transition-transform duration-150 hover:-translate-y-0.5 focus:outline-none focus:ring-2 ${
        isLight
          ? 'border-sky-100 bg-gradient-to-br from-white to-[#f6fbff] shadow-sky-100/70 hover:border-sky-300 focus:ring-sky-300'
          : 'border-slate-800 bg-gradient-to-br from-[#111827] to-[#0b1220] shadow-black/20 hover:border-sky-500/50 focus:ring-sky-500/50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${isLight ? 'bg-[#eef6ff]' : 'bg-slate-800'}`}>
          ◈
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-black ${
                index === 0
                  ? isLight ? 'bg-sky-100 text-sky-700' : 'bg-sky-500/15 text-sky-200'
                  : isLight ? 'bg-violet-100 text-violet-700' : 'bg-violet-500/15 text-violet-200'
              }`}
            >
              {index === 0 ? 'Beginner' : 'Intermediate'}
            </span>
          </div>

          <h3 className={`line-clamp-2 text-lg font-black leading-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
            {title}
          </h3>

          <p className={`mt-3 line-clamp-2 text-sm leading-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {description}
          </p>

          <div className={`mt-4 flex flex-wrap items-center gap-3 text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
            <span>☆</span>
            <span>▱ {lessonCount}</span>
            <span>◷ 12h</span>
          </div>

          <span className={`mt-5 block text-sm font-black transition-colors ${isLight ? 'text-sky-700 group-hover:text-sky-800' : 'text-sky-300 group-hover:text-sky-200'}`}>
            Start roadmap
          </span>
        </div>
      </div>
    </button>
  );
}

function getRoleProfile(t: ReturnType<typeof getStrings>['reinforcementLearning'], roleId: string) {
  return roleId === 'robot-learning' ? t.roleProfiles.robotLearning : t.roleProfiles.reinforcementLearning;
}

function getRoleText(t: ReturnType<typeof getStrings>['reinforcementLearning'], roleId: string) {
  const profile = getRoleProfile(t, roleId);
  return {
    title: profile.title,
    description: profile.description,
  };
}

function getDomainText(
  t: ReturnType<typeof getStrings>['reinforcementLearning'],
  roleId: string,
  domainId: string,
) {
  const roleDomains = t.domainProfiles.reinforcementLearning;
  if (roleId === 'robot-learning') return roleDomains.tabularControl;
  if (domainId === 'policy-behavior') return roleDomains.policyBehavior;
  return roleDomains.tabularControl;
}
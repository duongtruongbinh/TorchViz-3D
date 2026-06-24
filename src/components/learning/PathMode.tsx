import { useEffect, useMemo, useState } from 'react';
import { learningRoles } from '../../core/learningContent';
import type { LearningDomain, LearningLesson, LearningRole } from '../../core/types';
import { getStrings } from '../../lib/localization';
import { useStore } from '../../store/useStore';
import LessonDetail from './LessonDetail';
import PathNode from './PathNode';

const roleIllustrationUrls: Record<string, string> = {
  'ai-engineer': new URL('../../../docs/assets/aie_illustration.png', import.meta.url).href,
  'data-scientist': new URL('../../../docs/assets/ds_illustration.png', import.meta.url).href,
};

const domainIllustrationUrls: Record<string, string> = {
  cv: new URL('../../../docs/assets/computer_vision_illustration.png', import.meta.url).href,
  nlp: new URL('../../../docs/assets/nlp_illustration.png', import.meta.url).href,
  ml: new URL('../../../docs/assets/ml_illustration.png', import.meta.url).href,
};

type PathModeProps = {
  theme: 'dark' | 'light';
  lessons: LearningLesson[];
  selectedLessonId: string;
  onSelectLesson: (lessonId: string) => void;
};

export default function PathMode({ theme, lessons, selectedLessonId, onSelectLesson }: PathModeProps) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).learningLab;
  const [level, setLevel] = useState<'role' | 'domain' | 'lesson'>('role');
  const [selectedRoleId, setSelectedRoleId] = useState(learningRoles[0]?.id ?? '');
  const selectedRole = learningRoles.find((role) => role.id === selectedRoleId) ?? learningRoles[0];
  const selectedRoleText = selectedRole ? getRoleText(t, selectedRole.id) : undefined;
  const [selectedDomainId, setSelectedDomainId] = useState('');
  const selectedDomain = selectedRole?.domains.find((domain) => domain.id === selectedDomainId) ?? selectedRole?.domains[0];
  const selectedDomainText = selectedRole && selectedDomain ? getDomainText(t, selectedRole.id, selectedDomain.id) : undefined;
  const scopedLessons = useMemo(() => {
    if (!selectedDomain || level !== 'lesson') return [];
    return selectedDomain.lessonIds
      .map((lessonId) => lessons.find((lesson) => lesson.id === lessonId))
      .filter((lesson): lesson is LearningLesson => Boolean(lesson));
  }, [lessons, level, selectedDomain]);
  const selectedLesson = scopedLessons.find((lesson) => lesson.id === selectedLessonId) ?? scopedLessons[0] ?? lessons[0];

  useEffect(() => {
    if (level !== 'lesson') return;
    if (selectedLesson && selectedLesson.id !== selectedLessonId) {
      onSelectLesson(selectedLesson.id);
    }
  }, [level, onSelectLesson, selectedLesson, selectedLessonId]);

  return (
    <div className="grid min-h-0 gap-4 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,1.6fr)]">
      <aside className="min-h-0 rounded-lg border border-zinc-800 bg-zinc-950/55 p-3">
        <div className="mb-3 px-1">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold uppercase text-zinc-500">
            <button
              type="button"
              onClick={() => setLevel('role')}
              className={level === 'role' ? 'text-teal-200' : 'hover:text-zinc-300'}
            >
              {t.role}
            </button>
            {selectedRole && level !== 'role' && (
              <>
                <span>/</span>
                <button
                  type="button"
                  onClick={() => setLevel('domain')}
                  className={level === 'domain' ? 'text-teal-200' : 'hover:text-zinc-300'}
                >
                  {selectedRoleText?.title}
                </button>
              </>
            )}
            {selectedDomain && level === 'lesson' && (
              <>
                <span>/</span>
                <span className="text-teal-200">{selectedDomainText?.title}</span>
              </>
            )}
          </div>
          {level !== 'role' && (
            <h2 className="mt-2 text-xs font-black uppercase text-zinc-400">
              {level === 'domain' ? t.domain : t.lesson}
            </h2>
          )}
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            {level === 'role'
              ? t.pathDescription
              : level === 'domain'
                ? selectedRoleText?.description
                : selectedDomainText?.shortDescription}
          </p>
        </div>

        {level === 'role' && (
          <ChoiceList
            items={learningRoles}
            onSelect={(roleId) => {
              setSelectedRoleId(roleId);
              setSelectedDomainId('');
              setLevel('domain');
            }}
          />
        )}

        {level === 'domain' && (
          <ChoiceList
            items={selectedRole?.domains ?? []}
            selectedId={selectedDomainId}
            roleId={selectedRole?.id}
            onSelect={(domainId) => {
              const domain = selectedRole?.domains.find((item) => item.id === domainId);
              const firstLessonId = domain?.lessonIds[0];
              setSelectedDomainId(domainId);
              if (firstLessonId) onSelectLesson(firstLessonId);
              setLevel('lesson');
            }}
          />
        )}

        {level === 'lesson' && (
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
        )}
      </aside>
      {level === 'lesson' && selectedLesson ? (
        <LessonDetail theme={theme} lesson={selectedLesson} />
      ) : (
        <PathPreview
          level={level === 'role' ? 'role' : 'domain'}
          selectedRole={selectedRole}
        />
      )}
    </div>
  );
}

function PathPreview({
  level,
  selectedRole,
}: {
  level: 'role' | 'domain';
  selectedRole?: LearningRole;
}) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).learningLab;
  const isRoleLevel = level === 'role';

  return (
    <div className="min-h-[360px] rounded-lg border border-zinc-800 bg-[#080b10]/95 p-6 shadow-2xl shadow-black/25">
      <div className="max-w-3xl">
        <div className="text-xs font-black uppercase text-teal-200">
          {isRoleLevel ? t.role : t.domain}
        </div>
        <h2 className="mt-2 text-2xl font-black leading-tight text-white">
          {isRoleLevel ? t.chooseRoleTitle : t.chooseDomainTitle(selectedRole ? getRoleText(t, selectedRole.id).title : '')}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
          {isRoleLevel ? t.chooseRoleDescription : t.chooseDomainDescription}
        </p>
      </div>

      {isRoleLevel ? (
        <div className="mt-8 grid gap-8 xl:grid-cols-2 xl:gap-0">
          {learningRoles.map((role, index) => (
            <RoleTheoryColumn key={role.id} role={role} showDivider={index > 0} />
          ))}
        </div>
      ) : (
        <DomainRolePreview role={selectedRole} />
      )}
    </div>
  );
}

function RoleTheoryColumn({ role, showDivider }: { role: LearningRole; showDivider?: boolean }) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).learningLab;
  const profile = getRoleProfile(t, role.id);
  const roleText = getRoleText(t, role.id);
  const titleClass = role.id === 'data-scientist' ? 'text-sky-300' : 'text-teal-200';
  const illustrationUrl = roleIllustrationUrls[role.id];

  return (
    <div className={`min-w-0 ${showDivider ? 'xl:border-l xl:border-zinc-800 xl:pl-8' : 'xl:pr-8'}`}>
      <h3 className={`text-center text-3xl font-black leading-tight ${titleClass}`}>{roleText.title}</h3>
      {illustrationUrl && (
        <img
          src={illustrationUrl}
          alt={`${roleText.title} illustration`}
          className="mx-auto mt-5 h-72 w-72 max-w-full rounded-lg object-cover"
        />
      )}
      <p className="mt-4 text-sm leading-7 text-zinc-400">{profile.body}</p>
      <p className="mt-4 text-sm leading-7 text-zinc-400">{profile.detail}</p>
    </div>
  );
}

function DomainRolePreview({ role }: { role?: LearningRole }) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).learningLab;
  const domains = role?.domains ?? [];

  return (
    <div className="mt-8 grid gap-8 xl:grid-cols-3 xl:gap-0">
      {domains.map((domain, index) => {
        const domainText = role ? getDomainText(t, role.id, domain.id) : undefined;
        const illustrationUrl = domainIllustrationUrls[domain.id];

        return (
          <div
            key={domain.id}
            className={`min-w-0 ${index > 0 ? 'xl:border-l xl:border-zinc-800 xl:pl-8' : 'xl:pr-8'} ${
              index < domains.length - 1 ? 'xl:pr-8' : ''
            }`}
          >
            <h3 className={`learning-domain-title learning-domain-title-${domain.id} text-center text-2xl font-black leading-tight`}>
              {domainText?.title}
            </h3>
            {illustrationUrl && (
              <img
                src={illustrationUrl}
                alt={`${domainText?.title ?? domain.id} illustration`}
                className="mx-auto mt-5 h-60 w-60 max-w-full rounded-lg object-cover"
              />
            )}
            <p className="mt-4 text-sm leading-7 text-zinc-400">{domainText?.longDescription}</p>
          </div>
        );
      })}
    </div>
  );
}

function getRoleProfile(t: ReturnType<typeof getStrings>['learningLab'], roleId: string) {
  return roleId === 'data-scientist' ? t.roleProfiles.dataScientist : t.roleProfiles.aiEngineer;
}

function getRoleText(t: ReturnType<typeof getStrings>['learningLab'], roleId: string) {
  const profile = getRoleProfile(t, roleId);
  return {
    title: profile.title,
    description: profile.description,
  };
}

function getDomainText(t: ReturnType<typeof getStrings>['learningLab'], roleId: string, domainId: string) {
  const roleDomains = roleId === 'data-scientist' ? t.domainProfiles.dataScientist : t.domainProfiles.aiEngineer;
  if (domainId === 'cv') return roleDomains.cv;
  if (domainId === 'nlp') return roleDomains.nlp;
  return roleDomains.ml;
}

function ChoiceList<T extends LearningRole | LearningDomain>({
  items,
  selectedId = '',
  roleId = learningRoles[0]?.id ?? '',
  onSelect,
}: {
  items: T[];
  selectedId?: string;
  roleId?: string;
  onSelect: (id: string) => void;
}) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).learningLab;

  return (
    <div className="grid max-h-full gap-3 overflow-auto px-0.5 pb-1 pt-1">
      {items.map((item) => {
        const itemText = getChoiceListText(t, item, roleId);

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            title={t.openNextLevel}
            className={`group grid w-full grid-cols-[minmax(0,1fr)_2rem] items-center gap-3 rounded-lg border p-4 text-left transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 focus:outline-none focus:ring-2 focus:ring-teal-300/40 ${
              selectedId === item.id
                ? 'border-teal-200 bg-teal-400/15 text-teal-50 hover:shadow-teal-950/25'
                : 'border-zinc-800 bg-zinc-950/70 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900/90'
            }`}
          >
            <span className="min-w-0">
              <span className="block text-sm font-bold">{itemText.title}</span>
              <span className="mt-2 block text-xs leading-5 text-zinc-500">{itemText.description}</span>
            </span>
            <span
              className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-300 transition-colors group-hover:text-teal-100"
              aria-hidden="true"
            >
              -&gt;
            </span>
          </button>
        );
      })}
    </div>
  );
}

function getChoiceListText(t: ReturnType<typeof getStrings>['learningLab'], item: LearningRole | LearningDomain, selectedRoleId: string) {
  if (!('lessonIds' in item)) {
    return getRoleText(t, item.id);
  }

  const domainText = getDomainText(t, selectedRoleId, item.id);
  return {
    title: domainText.title,
    description: domainText.shortDescription,
  };
}

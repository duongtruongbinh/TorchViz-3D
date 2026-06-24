import { useEffect, useMemo, useState } from 'react';
import { rlLearningRoles } from '../../core/rlLearningContent';
import type { RLLearningDomain, RLLearningLesson, RLLearningRole } from '../../core/rlTypes';
import { getStrings } from '../../lib/localization';
import { useStore } from '../../store/useStore';
import LessonDetail from './LessonDetail';
import PathNode from './PathNode';

type PathModeProps = {
  lessons: RLLearningLesson[];
  selectedLessonId: string;
  onSelectLesson: (lessonId: string) => void;
};

export default function PathMode({ lessons, selectedLessonId, onSelectLesson }: PathModeProps) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).reinforcementLearning;
  const [level, setLevel] = useState<'role' | 'domain' | 'lesson'>('role');
  const [selectedRoleId, setSelectedRoleId] = useState(rlLearningRoles[0]?.id ?? '');
  const selectedRole = rlLearningRoles.find((role) => role.id === selectedRoleId) ?? rlLearningRoles[0];
  const selectedRoleText = selectedRole ? getRoleText(t, selectedRole.id) : undefined;
  const [selectedDomainId, setSelectedDomainId] = useState('');
  const selectedDomain = selectedRole?.domains.find((domain) => domain.id === selectedDomainId) ?? selectedRole?.domains[0];
  const selectedDomainText = selectedRole && selectedDomain ? getDomainText(t, selectedRole.id, selectedDomain.id) : undefined;
  const scopedLessons = useMemo(() => {
    if (!selectedDomain || level !== 'lesson') return [];
    return selectedDomain.lessonIds
      .map((lessonId) => lessons.find((lesson) => lesson.id === lessonId))
      .filter((lesson): lesson is RLLearningLesson => Boolean(lesson));
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
              className={level === 'role' ? 'text-emerald-200' : 'hover:text-zinc-300'}
            >
              {t.role}
            </button>
            {selectedRole && level !== 'role' && (
              <>
                <span>/</span>
                <button
                  type="button"
                  onClick={() => setLevel('domain')}
                  className={level === 'domain' ? 'text-emerald-200' : 'hover:text-zinc-300'}
                >
                  {selectedRoleText?.title}
                </button>
              </>
            )}
            {selectedDomain && level === 'lesson' && (
              <>
                <span>/</span>
                <span className="text-emerald-200">{selectedDomainText?.title}</span>
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
            items={rlLearningRoles}
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
        <LessonDetail lesson={selectedLesson} />
      ) : (
        <PathPreview level={level === 'role' ? 'role' : 'domain'} selectedRole={selectedRole} />
      )}
    </div>
  );
}

function PathPreview({
  level,
  selectedRole,
}: {
  level: 'role' | 'domain';
  selectedRole?: RLLearningRole;
}) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).reinforcementLearning;
  const isRoleLevel = level === 'role';

  return (
    <div className="min-h-[360px] rounded-lg border border-zinc-800 bg-[#080b10]/95 p-6 shadow-2xl shadow-black/25">
      <div className="max-w-3xl">
        <div className="text-xs font-black uppercase text-emerald-200">
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
        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          {rlLearningRoles.map((role) => (
            <RolePreviewCard key={role.id} role={role} />
          ))}
        </div>
      ) : (
        <DomainPreview role={selectedRole} />
      )}
    </div>
  );
}

function RolePreviewCard({ role }: { role: RLLearningRole }) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).reinforcementLearning;
  const profile = getRoleProfile(t, role.id);
  const roleText = getRoleText(t, role.id);

  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-950/65 p-5">
      <h3 className="text-2xl font-black leading-tight text-emerald-200">{roleText.title}</h3>
      <p className="mt-3 text-sm leading-7 text-zinc-400">{profile.body}</p>
      <p className="mt-4 text-sm leading-7 text-zinc-400">{profile.detail}</p>
    </section>
  );
}

function DomainPreview({ role }: { role?: RLLearningRole }) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).reinforcementLearning;
  const domains = role?.domains ?? [];

  return (
    <div className="mt-8">
      <h3 className="text-lg font-black text-white">{t.domainPreviewTitle}</h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{t.domainPreviewBody}</p>
      {domains.length > 0 ? (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {domains.map((domain) => {
            const domainText = role ? getDomainText(t, role.id, domain.id) : undefined;

            return (
              <section key={domain.id} className="rounded-lg border border-zinc-800 bg-zinc-950/65 p-5">
                <h4 className="text-xl font-black text-emerald-200">{domainText?.title}</h4>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{domainText?.longDescription}</p>
              </section>
            );
          })}
        </div>
      ) : (
        <EmptyTrackNotice />
      )}
    </div>
  );
}

function ChoiceList<T extends RLLearningRole | RLLearningDomain>({
  items,
  selectedId = '',
  roleId = rlLearningRoles[0]?.id ?? '',
  onSelect,
}: {
  items: T[];
  selectedId?: string;
  roleId?: string;
  onSelect: (id: string) => void;
}) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).reinforcementLearning;

  return (
    <div className="grid max-h-full gap-3 overflow-auto px-0.5 pb-1 pt-1">
      {items.length === 0 && <EmptyTrackNotice compact />}
      {items.map((item) => {
        const itemText = getChoiceListText(t, item, roleId);

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            title={t.openNextLevel}
            className={`group grid w-full grid-cols-[minmax(0,1fr)_2rem] items-center gap-3 rounded-lg border p-4 text-left transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 focus:outline-none focus:ring-2 focus:ring-emerald-300/40 ${
              selectedId === item.id
                ? 'border-emerald-200 bg-emerald-400/15 text-emerald-50 hover:shadow-emerald-950/25'
                : 'border-zinc-800 bg-zinc-950/70 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900/90'
            }`}
          >
            <span className="min-w-0">
              <span className="block text-sm font-bold">{itemText.title}</span>
              <span className="mt-2 block text-xs leading-5 text-zinc-500">{itemText.description}</span>
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-300 transition-colors group-hover:text-emerald-100" aria-hidden="true">
              -&gt;
            </span>
          </button>
        );
      })}
    </div>
  );
}

function EmptyTrackNotice({ compact = false }: { compact?: boolean }) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).reinforcementLearning;

  return (
    <div className={`rounded-lg border border-dashed border-zinc-700 bg-zinc-950/45 ${compact ? 'p-4' : 'mt-5 p-5'}`}>
      <h4 className="text-sm font-black text-zinc-200">{t.emptyTrackTitle}</h4>
      <p className="mt-2 text-xs leading-5 text-zinc-500">{t.emptyTrackDescription}</p>
    </div>
  );
}

function getChoiceListText(t: ReturnType<typeof getStrings>['reinforcementLearning'], item: RLLearningRole | RLLearningDomain, selectedRoleId: string) {
  if (!('lessonIds' in item)) {
    return getRoleText(t, item.id);
  }

  const domainText = getDomainText(t, selectedRoleId, item.id);
  return {
    title: domainText.title,
    description: domainText.shortDescription,
  };
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

function getDomainText(t: ReturnType<typeof getStrings>['reinforcementLearning'], roleId: string, domainId: string) {
  const roleDomains = t.domainProfiles.reinforcementLearning;
  if (roleId === 'robot-learning') return roleDomains.tabularControl;
  if (domainId === 'policy-behavior') return roleDomains.policyBehavior;
  return roleDomains.tabularControl;
}

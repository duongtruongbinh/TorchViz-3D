import type { RLLearningPracticeKind } from '../../core/rlTypes';
import { getStrings } from '../../lib/localization';
import { useStore } from '../../store/useStore';

type ReviewPickerProps = {
  activeKind: RLLearningPracticeKind | 'all';
  onKindChange: (kind: RLLearningPracticeKind | 'all') => void;
};

const reviewKinds: Array<{ id: RLLearningPracticeKind | 'all'; labelKey: keyof ReturnType<typeof getStrings>['reinforcementLearning']['reviewKinds'] }> = [
  { id: 'all', labelKey: 'all' },
  { id: 'rl-shape', labelKey: 'rlShape' },
  { id: 'rl-value', labelKey: 'rlValue' },
  { id: 'gridworld', labelKey: 'gridworld' },
];

export default function ReviewPicker({ activeKind, onKindChange }: ReviewPickerProps) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).reinforcementLearning;

  return (
    <div className="flex flex-wrap gap-2">
      {reviewKinds.map((kind) => (
        <button
          key={kind.id}
          type="button"
          onClick={() => onKindChange(kind.id)}
          className={`rounded-md border px-3 py-2 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-300/40 ${
            activeKind === kind.id
              ? 'border-emerald-200 bg-emerald-400/20 text-emerald-50'
              : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500 hover:text-zinc-100'
          }`}
        >
          {t.reviewKinds[kind.labelKey]}
        </button>
      ))}
    </div>
  );
}

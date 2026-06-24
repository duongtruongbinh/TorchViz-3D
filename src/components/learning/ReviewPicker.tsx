import type { LearningPracticeKind } from '../../core/types';
import { getStrings } from '../../lib/localization';
import { useStore } from '../../store/useStore';

type ReviewPickerProps = {
  activeKind: LearningPracticeKind | 'all';
  onKindChange: (kind: LearningPracticeKind | 'all') => void;
};

const reviewKinds: Array<{ id: LearningPracticeKind | 'all'; labelKey: keyof ReturnType<typeof getStrings>['learningLab']['reviewKinds'] }> = [
  { id: 'all', labelKey: 'all' },
  { id: 'shape', labelKey: 'shape' },
  { id: 'value', labelKey: 'value' },
  { id: 'review', labelKey: 'review' },
];

export default function ReviewPicker({ activeKind, onKindChange }: ReviewPickerProps) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).learningLab;
  return (
    <div className="flex flex-wrap gap-2">
      {reviewKinds.map((kind) => (
        <button
          key={kind.id}
          type="button"
          onClick={() => onKindChange(kind.id)}
          className={`rounded-md border px-3 py-2 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-300/40 ${
            activeKind === kind.id
              ? 'border-teal-200 bg-teal-400/20 text-teal-50'
              : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500 hover:text-zinc-100'
          }`}
        >
          {t.reviewKinds[kind.labelKey]}
        </button>
      ))}
    </div>
  );
}

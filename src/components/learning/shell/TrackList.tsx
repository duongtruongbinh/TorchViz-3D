import type { LearningTrack } from '../../../core/learning/types';
import { getStrings, type Language } from '../../../lib/localization';
import { getTrackText } from '../learningText';
import { cx, getLearningLabTheme, type LearningLabTheme } from '../theme';

type TrackListProps = {
  tracks: LearningTrack[];
  language: Language;
  theme: LearningLabTheme;
  onOpenTrack: (track: LearningTrack) => void;
};

export default function TrackList({ tracks, language, theme, onOpenTrack }: TrackListProps) {
  const strings = getStrings(language).learningLab;
  const themeClasses = getLearningLabTheme(theme);

  return (
    <div className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
      {tracks.map((track, index) => {
        const text = getTrackText(language, track);
        const isPlaceholder = track.status === 'placeholder';

        return (
          <button
            key={track.id}
            type="button"
            onClick={() => onOpenTrack(track)}
            className={cx(
              'group w-full rounded-xl border p-5 text-left shadow-sm transition-transform duration-150 hover:-translate-y-0.5',
              themeClasses.interactiveCard,
              themeClasses.focusRing,
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cx('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-black', themeClasses.iconTile)}>
                {index + 1}
              </div>
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className={cx('rounded-full px-3 py-1 text-xs font-black', themeClasses.statusPill(isPlaceholder))}>
                    {strings.lessonCount(track.lessonIds.length)}
                  </span>
                </div>
                <h3 className={cx('text-lg font-black leading-tight', themeClasses.titleText)}>{text.title}</h3>
                <p className={cx('mt-3 line-clamp-3 text-sm leading-6', themeClasses.bodyText)}>{text.description}</p>
                <span className={cx('mt-5 block text-sm font-black transition-colors', themeClasses.eyebrowText)}>
                  {isPlaceholder ? strings.unavailablePractice : strings.startTrack}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

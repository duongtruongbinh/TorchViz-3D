import { ArrowRight } from 'lucide-react';

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
    <div className="grid max-w-6xl gap-5 xl:grid-cols-2 2xl:grid-cols-3">
      {tracks.map((track, index) => {
        const text = getTrackText(language, track);
        const isPlaceholder = track.status === 'placeholder';

        return (
          <button
            key={track.id}
            type="button"
            onClick={() => onOpenTrack(track)}
            className={cx(
              'group flex min-h-44 w-full flex-col gap-2 p-4',
              themeClasses.radius.card,
              themeClasses.button.card,
            )}
          >
            <div className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-start gap-3">
              <div className={cx('flex h-10 w-10 shrink-0 items-center justify-center text-xl font-black', themeClasses.radius.icon, themeClasses.iconTile)}>
                {index + 1}
              </div>
              <h3 className={cx('min-w-0 pt-1 text-base font-black leading-tight', themeClasses.titleText)}>{text.title}</h3>
              <span className={cx('shrink-0 px-2.5 py-0.5 text-[11px] font-black', themeClasses.radius.pill, themeClasses.statusPill(isPlaceholder))}>
                {strings.lessonCount(track.lessonIds.length)}
              </span>
            </div>
            <div className="flex flex-1 flex-col pl-[52px]">
              <p className={cx('line-clamp-2 text-sm leading-5', themeClasses.bodyText)}>{text.description}</p>
              {!isPlaceholder ? (
                <span className="mt-auto flex justify-end pt-3">
                  <span className={cx('inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-black transition-colors', themeClasses.ctaPill)}>
                    {strings.startTrack}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                </span>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}

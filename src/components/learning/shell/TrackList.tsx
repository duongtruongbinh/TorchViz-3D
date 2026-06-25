import type { LearningTrack } from '../../../core/learning/types';
import type { Language } from '../../../lib/localization';
import { getTrackText } from '../learningText';

type TrackListProps = {
  tracks: LearningTrack[];
  language: Language;
  onOpenTrack: (track: LearningTrack) => void;
};

export default function TrackList({ tracks, language, onOpenTrack }: TrackListProps) {
  const isVi = language === 'vi';

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
            className="group w-full rounded-xl border border-sky-100 bg-gradient-to-br from-white to-[#f6fbff] p-5 text-left shadow-sm shadow-sky-100/70 transition-transform duration-150 hover:-translate-y-0.5 hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eef6ff] text-xl font-black text-sky-700">
                {index + 1}
              </div>
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${isPlaceholder ? 'bg-slate-100 text-slate-500' : 'bg-sky-100 text-sky-700'}`}>
                    {track.lessonIds.length} {isVi ? 'bài' : 'lessons'}
                  </span>
                </div>
                <h3 className="text-lg font-black leading-tight text-slate-950">{text.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{text.description}</p>
                <span className="mt-5 block text-sm font-black text-sky-700 transition-colors group-hover:text-sky-800">
                  {isPlaceholder ? (isVi ? 'Đang hoàn thiện' : 'In progress') : (isVi ? 'Bắt đầu track' : 'Start track')}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

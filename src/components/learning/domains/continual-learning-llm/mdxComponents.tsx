import { useLearningMdxTheme } from '../../learningMdxComponents';
import { cx } from '../../theme';

export type StageContinuityMapItem = {
  verticalTitle: string;
  verticalDetail: string;
  horizontalTitle: string;
  horizontalItems: string[];
};

export function StageContinuityMap({ ariaLabel, items }: { ariaLabel: string; items: StageContinuityMapItem[] }) {
  const themeClasses = useLearningMdxTheme();
  return (
    <figure className="my-6 grid gap-3" aria-label={ariaLabel}>
      <div className={cx('hidden gap-3 px-1 text-xs font-black uppercase tracking-[0.16em] md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)]', themeClasses.mutedText)}>
        <span>Flow Vertical</span>
        <span>Mở rộng Horizontal trong cùng stage</span>
      </div>
      <ol className="grid gap-3">
        {items.map((item, index) => (
          <li key={item.verticalTitle} className="grid gap-3 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)]">
            <section
              className={cx(
                'rounded-xl border p-5 shadow-[0_10px_24px_rgba(25,55,85,0.10)] transition-colors',
                themeClasses.semantic.primary.border,
                themeClasses.semantic.primary.surface,
              )}
            >
              <div className="mb-3 flex items-center gap-3">
                <span
                  className={cx(
                    'grid size-8 shrink-0 place-items-center rounded-full text-sm font-black tabular-nums',
                    themeClasses.semantic.primary.indicator,
                    'text-white',
                  )}
                >
                  {index + 1}
                </span>
                <h3 className={cx('text-base font-black leading-6 text-balance', themeClasses.titleText)}>{item.verticalTitle}</h3>
              </div>
              <p className={cx('text-sm leading-6 text-pretty', themeClasses.bodyText)}>{item.verticalDetail}</p>
            </section>
            <section
              className={cx(
                'rounded-xl border p-5 opacity-45 transition-[opacity,transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:opacity-100 hover:shadow-[0_14px_30px_rgba(25,55,85,0.12)] focus-visible:-translate-y-0.5 focus-visible:opacity-100 focus-visible:shadow-[0_14px_30px_rgba(25,55,85,0.12)] motion-reduce:transform-none',
                themeClasses.focusRing,
                themeClasses.semantic.neutral.border,
                themeClasses.semantic.neutral.surface,
              )}
            >
              <h3 className={cx('text-sm font-black leading-6 text-balance', themeClasses.titleText)}>{item.horizontalTitle}</h3>
              <ul className={cx('mt-3 grid list-disc gap-2 pl-5 text-sm leading-6', themeClasses.bodyText)}>
                {item.horizontalItems.map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
            </section>
          </li>
        ))}
      </ol>
    </figure>
  );
}

export const continualLearningLlmMdxComponents = {
  StageContinuityMap,
};

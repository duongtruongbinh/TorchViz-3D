import type { LearningCatalog, LearningDomainId } from '../../../core/learning/types';
import { getStrings, type Language } from '../../../lib/localization';
import { getDomainText } from '../learningText';
import { cx, getLearningLabTheme, type LearningLabTheme } from '../theme';

type DomainCatalogProps = {
  catalog: LearningCatalog;
  language: Language;
  theme: LearningLabTheme;
  onOpenDomain: (domainId: LearningDomainId) => void;
};

export default function DomainCatalog({ catalog, language, theme, onOpenDomain }: DomainCatalogProps) {
  const strings = getStrings(language).learningLab;
  const themeClasses = getLearningLabTheme(theme);

  return (
    <section className="grid gap-5">
      <div className={cx('rounded-xl border p-6 shadow-sm', themeClasses.card)}>
        <div className={cx('text-xs font-black uppercase tracking-wide', themeClasses.eyebrowText)}>
          {strings.domainCatalogLabel}
        </div>
        <h1 className={cx('mt-2 text-3xl font-black leading-tight', themeClasses.titleText)}>
          {strings.domainCatalogTitle}
        </h1>
        <p className={cx('mt-3 max-w-3xl text-sm leading-6', themeClasses.bodyText)}>
          {strings.domainCatalogDescription}
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
        {catalog.domains.map((domain, index) => {
          const text = getDomainText(language, domain);
          const isPlaceholder = domain.status === 'placeholder';

          return (
            <button
              key={domain.id}
              type="button"
              onClick={() => onOpenDomain(domain.id)}
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
                      {isPlaceholder ? strings.domainPlaceholder : strings.domainAvailable}
                    </span>
                  </div>
                  <h2 className={cx('text-lg font-black leading-tight', themeClasses.titleText)}>{text.title}</h2>
                  <p className={cx('mt-3 line-clamp-3 text-sm leading-6', themeClasses.bodyText)}>{text.description}</p>
                  <span className={cx('mt-5 block text-sm font-black transition-colors', themeClasses.eyebrowText)}>
                    {strings.openDomain}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

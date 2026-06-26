import { ArrowRight, BookOpen, Bot, Eye, MessageSquareText, Route } from 'lucide-react';
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
    <section className="learning-lab-catalog grid gap-5 px-2">
      <div className="grid max-w-6xl gap-5 xl:grid-cols-2 2xl:grid-cols-3">
        {catalog.domains.map((domain) => {
          const text = getDomainText(language, domain);
          const isPlaceholder = domain.status === 'placeholder';

          return (
            <button
              key={domain.id}
              type="button"
              onClick={() => onOpenDomain(domain.id)}
              className={cx(
                'group flex min-h-44 w-full flex-col gap-2 p-4',
                themeClasses.radius.card,
                themeClasses.button.card,
              )}
            >
              <div className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-start gap-3">
                <div className={cx('flex h-10 w-10 shrink-0 items-center justify-center text-xl font-black', themeClasses.radius.icon, themeClasses.iconTile)}>
                  {domain.id === 'fundamentals' ? <BookOpen className="h-6 w-6" strokeWidth={1.8} /> : null}
                  {domain.id === 'cv' ? <Eye className="h-6 w-6" strokeWidth={1.8} /> : null}
                  {domain.id === 'nlp' ? <MessageSquareText className="h-6 w-6" strokeWidth={1.8} /> : null}
                  {domain.id === 'reinforcement-learning' ? <Route className="h-6 w-6" strokeWidth={1.8} /> : null}
                  {domain.id === 'robot-learning' ? <Bot className="h-6 w-6" strokeWidth={1.8} /> : null}
                </div>
                <h2 className={cx('min-w-0 pt-1 text-base font-black leading-tight', themeClasses.titleText)}>{text.title}</h2>
                <span className={cx('shrink-0 px-2.5 py-0.5 text-[11px] font-black', themeClasses.radius.pill, themeClasses.statusPill(isPlaceholder))}>
                  {isPlaceholder ? strings.domainPlaceholder : strings.domainAvailable}
                </span>
              </div>
              <div className="flex flex-1 flex-col pl-[52px]">
                <p className={cx('line-clamp-2 text-sm leading-5', themeClasses.bodyText)}>{text.description}</p>
                {!isPlaceholder ? (
                  <span className="mt-auto flex justify-end pt-3">
                    <span className={cx('inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-black transition-colors', themeClasses.ctaPill)}>
                      {strings.openDomain}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.8} aria-hidden="true" />
                    </span>
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

import { Languages, Menu } from 'lucide-react';
import { getStrings, type Language } from '../../lib/localization';
import { useStore } from '../../store/useStore';
import { cx, getLearningLabTheme } from './theme';

type LearningLabHeaderProps = {
  mode: 'path' | 'review';
  theme: 'dark' | 'light';
  onModeChange: (mode: 'path' | 'review') => void;
  onOpenNavigation: () => void;
};

export default function LearningLabHeader({
  mode,
  theme,
  onModeChange,
  onOpenNavigation,
}: LearningLabHeaderProps) {
  const language = useStore((s) => s.language);
  const setLanguage = useStore((s) => s.setLanguage);
  const currentLanguage = language === 'vi' ? ('vi' as Language) : ('en' as Language);
  const strings = getStrings(currentLanguage);
  const text = strings.learningLab;
  const themeClasses = getLearningLabTheme(theme);

  return (
    <header className={cx('sticky top-0 z-40 w-full border-b shadow-sm', themeClasses.header)}>
      <div className="flex h-16 w-full items-center gap-2 px-3 sm:gap-4 sm:px-5">
        <button
          type="button"
          onClick={onOpenNavigation}
          className={cx('flex h-10 w-10 shrink-0 items-center justify-center lg:hidden', themeClasses.radius.icon, themeClasses.button.icon)}
          title={text.openSidebar}
          aria-label={text.openSidebar}
        >
          <Menu className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
        </button>
        <div className={cx('flex h-10 min-w-0 overflow-hidden border p-1', themeClasses.radius.pill, themeClasses.segmented)}>
          {(['path', 'review'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onModeChange(item)}
              className={cx(
                'min-w-0 px-3 text-xs sm:px-4 sm:text-sm',
                themeClasses.radius.pill,
                themeClasses.button.segmented(mode === item),
              )}
              aria-pressed={mode === item}
            >
              {item === 'path' ? text.path : text.review}
            </button>
          ))}
        </div>


        <button
          type="button"
          onClick={() => setLanguage(currentLanguage === 'vi' ? ('en' as Language) : ('vi' as Language))}
          className={cx('ml-auto flex h-10 w-10 items-center justify-center', themeClasses.radius.icon, themeClasses.button.icon)}
          title={currentLanguage === 'vi' ? strings.app.switchToEnglish : strings.app.switchToVietnamese}
          aria-label={currentLanguage === 'vi' ? strings.app.switchToEnglish : strings.app.switchToVietnamese}
          aria-pressed={currentLanguage === 'vi'}
        >
          <Languages className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

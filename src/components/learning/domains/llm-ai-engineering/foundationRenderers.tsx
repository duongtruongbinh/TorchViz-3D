import { CheckCircle2, CircleAlert, Code2, Terminal } from 'lucide-react';
import type { ReactNode } from 'react';
import { cx } from '../../theme';
import { useLearningMdxTheme } from '../../learningMdxComponents';

export function CodeLessonFrame({ children, contract, output, pitfall, takeaway, title }: {
  children?: ReactNode;
  contract: string;
  output?: string;
  pitfall?: string;
  takeaway: string;
  title: string;
}) {
  const themeClasses = useLearningMdxTheme();
  return (
    <section className="grid min-w-0 gap-5">
      <header className={cx('flex min-w-0 flex-col gap-3 rounded-lg px-4 py-4 sm:flex-row sm:items-center sm:justify-between', themeClasses.isLight ? 'bg-[#EDF5FB]' : 'bg-[#263B5B]/55')}>
        <div className="flex min-w-0 items-center gap-3">
          <span className={cx('grid h-10 w-10 shrink-0 place-items-center rounded-lg', themeClasses.isLight ? 'bg-[#205089] text-white' : 'bg-[#A8B8C8] text-[#121A24]')}>
            <Code2 className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
          </span>
          <h2 className={cx('min-w-0 text-base font-black leading-6 [text-wrap:balance]', themeClasses.titleText)}>{title}</h2>
        </div>
        <code className={cx('w-fit max-w-full break-words rounded-md px-2.5 py-1.5 text-xs font-black', themeClasses.isLight ? 'bg-white text-[#123B68]' : 'bg-[#172A43] text-[#DCE8F4]')}>{contract}</code>
      </header>

      <div className={cx('grid min-w-0 gap-4 [&>p]:max-w-[72ch]', themeClasses.bodyText)}>
        {children}
      </div>

      {output ? (
        <div className={cx('flex min-w-0 items-start gap-3 rounded-lg px-4 py-3', themeClasses.isLight ? 'bg-[#F5F8FB] text-[#52667A]' : 'bg-[#121A24]/48 text-[#DCE8F4]')}>
          <Terminal className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
          <code className="min-w-0 break-words text-xs font-black leading-5">{output}</code>
        </div>
      ) : null}

      <div className={cx('flex items-start gap-3 rounded-lg px-4 py-3', themeClasses.isLight ? 'bg-[#EAF5F0] text-[#24584D]' : 'bg-[#17332D] text-[#CBEDE2]')}>
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.9} aria-hidden="true" />
        <p className="text-sm font-semibold leading-6">{takeaway}</p>
      </div>

      {pitfall ? (
        <div className={cx('flex items-start gap-3 rounded-lg px-4 py-3', themeClasses.isLight ? 'bg-[#FFF4E8] text-[#744019]' : 'bg-[#3D2A1B] text-[#FFDDBD]')}>
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.9} aria-hidden="true" />
          <p className="text-sm font-semibold leading-6">{pitfall}</p>
        </div>
      ) : null}
    </section>
  );
}

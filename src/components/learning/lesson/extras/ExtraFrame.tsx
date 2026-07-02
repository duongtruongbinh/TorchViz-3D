import type { ReactNode } from 'react';
import { cx, getLearningLabTheme } from '../../theme';

type ExtraFrameProps = {
  title: string;
  children: ReactNode;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
  customTitle?: ReactNode;
};

export default function ExtraFrame({ title, children, themeClasses, customTitle }: ExtraFrameProps) {
  return (
    <div className="py-1">
      <div className={cx('mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide', themeClasses.eyebrowText)}>
        {customTitle ?? <span>{title}</span>}
      </div>
      {children}
    </div>
  );
}

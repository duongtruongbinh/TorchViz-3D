import type { ReactNode } from 'react';
import { BookOpen, GraduationCap, Network } from 'lucide-react';

import { getStrings, type Language } from '../../../lib/localization';
import { cx, getLearningLabTheme, type LearningLabTheme } from '../theme';

type DomainCatalogProps = {
  language: Language;
  theme: LearningLabTheme;
};

export default function DomainCatalog({ language, theme }: DomainCatalogProps) {
  const strings = getStrings(language).learningLab;
  const home = strings.homePage;
  const themeClasses = getLearningLabTheme(theme);
  const isLight = themeClasses.isLight;
  const pageTone = isLight
    ? 'bg-white/[0.72]'
    : 'bg-[#172232]/[0.72]';
  const panelTone = isLight
    ? 'bg-white/[0.72] shadow-[0_24px_70px_rgba(33,66,105,0.13)]'
    : 'bg-[#172232]/[0.72] shadow-[0_24px_70px_rgba(0,0,0,0.24)]';
  const tileTone = isLight
    ? [
        'border border-[#D8C59A]/55 bg-[#FFFBF0]/[0.84] shadow-[0_14px_30px_rgba(126,92,24,0.08)]',
        'border border-[#D8C59A]/55 bg-[#FFFBF0]/[0.84] shadow-[0_14px_30px_rgba(126,92,24,0.08)]',
        'border border-[#D8C59A]/55 bg-[#FFFBF0]/[0.84] shadow-[0_14px_30px_rgba(126,92,24,0.08)]',
      ]
    : [
        'border border-[#7DD3FC]/18 bg-[#0E2230]/[0.82] shadow-[0_14px_30px_rgba(0,0,0,0.18)]',
        'border border-[#7DD3FC]/18 bg-[#0E2230]/[0.82] shadow-[0_14px_30px_rgba(0,0,0,0.18)]',
        'border border-[#7DD3FC]/18 bg-[#0E2230]/[0.82] shadow-[0_14px_30px_rgba(0,0,0,0.18)]',
      ];
  const titleTone = isLight ? 'text-[#132033]' : themeClasses.titleText;
  const bodyTone = isLight ? 'text-[#42546A]' : themeClasses.bodyText;
  const labelTone = isLight ? 'text-[#245B8F]' : themeClasses.eyebrowText;
  const mutedTone = isLight ? 'text-[#6B7C91]' : themeClasses.mutedText;
  const dividerTone = isLight ? 'bg-[#8EA7C1]/55' : 'bg-[#A8B8C8]/32';

  return (
    <div className={cx('-m-4 min-h-full w-[calc(100%+2rem)]', pageTone)}>
      <div className="mx-auto flex min-h-full w-full max-w-6xl items-center px-4 py-5 sm:px-6 lg:px-8">
        <div className={cx('w-full p-4 sm:p-5', themeClasses.radius.panel, panelTone)}>
          <div className="min-w-0">
            <SectionLabel text={home.projectLabel} toneClass={labelTone} />
            <p className={cx('mt-3 max-w-none text-[clamp(0.88rem,1.05vw,1.08rem)] font-semibold leading-7', bodyTone)}>
              {home.goal}
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <Principle index="01" icon={<BookOpen className="h-6 w-6" strokeWidth={1.8} />} title={home.idealVisualTitle} body={home.idealVisualBody} toneClass={tileTone[0]} titleTone={titleTone} bodyTone={bodyTone} mutedTone={mutedTone} dividerTone={dividerTone} />
              <Principle index="02" icon={<Network className="h-6 w-6" strokeWidth={1.8} />} title={home.idealLocalTitle} body={home.idealLocalBody} toneClass={tileTone[1]} titleTone={titleTone} bodyTone={bodyTone} mutedTone={mutedTone} dividerTone={dividerTone} />
              <Principle index="03" icon={<GraduationCap className="h-6 w-6" strokeWidth={1.8} />} title={home.idealHumanTitle} body={home.idealHumanBody} toneClass={tileTone[2]} titleTone={titleTone} bodyTone={bodyTone} mutedTone={mutedTone} dividerTone={dividerTone} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ text, toneClass }: { text: string; toneClass: string }) {
  return (
    <div className={cx('text-base font-black uppercase tracking-wide sm:text-lg', toneClass)}>
      {text}
    </div>
  );
}

function Principle({
  index,
  icon,
  title,
  body,
  toneClass,
  titleTone,
  bodyTone,
  mutedTone,
  dividerTone,
}: {
  index: string;
  icon: ReactNode;
  title: string;
  body: string;
  toneClass: string;
  titleTone: string;
  bodyTone: string;
  mutedTone: string;
  dividerTone: string;
}) {
  return (
    <div className={cx('grid min-h-[280px] grid-rows-[auto_auto_auto_1fr] rounded-xl p-5', toneClass)}>
      <div className="flex items-center justify-between gap-3">
        <div className={cx('flex h-12 w-12 items-center justify-center rounded-lg bg-current/10', mutedTone)}>
          {icon}
        </div>
        <span className={cx('text-sm font-black', mutedTone)}>{index}</span>
      </div>
      <h3 className={cx('mt-6 text-[clamp(1.25rem,1.55vw,1.5rem)] font-black leading-tight', titleTone)}>{title}</h3>
      <div className={cx('mt-4 h-0.5 w-full rounded-full', dividerTone)} />
      <p className={cx('mt-5 text-[clamp(0.92rem,1.02vw,1rem)] leading-7', bodyTone)}>{body}</p>
    </div>
  );
}

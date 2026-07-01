import { ArrowRight } from 'lucide-react';
import type { LearningLessonExtra } from '../../../../core/learning/types';
import type { Language } from '../../../../lib/localization';
import { cx, getLearningLabTheme } from '../../theme';
import { text } from './lessonExtraText';

type DiagramViewProps = {
  extra: Extract<LearningLessonExtra, { kind: 'diagram' }>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
};

export default function DiagramView({ extra, language, themeClasses }: DiagramViewProps) {
  const diagram = extra.diagram;
  if (diagram.variant === 'pipeline') {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {diagram.steps.map((step, index) => (
          <div key={`${text(step, language)}-${index}`} className="flex items-center gap-2">
            <span className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>
              {text(step, language)}
            </span>
            {index < diagram.steps.length - 1 && <ArrowRight className={cx('h-4 w-4', themeClasses.mutedText)} aria-hidden="true" />}
          </div>
        ))}
      </div>
    );
  }

  if (diagram.variant === 'shape-flow') {
    return (
      <div className="grid gap-2">
        {diagram.steps.map((step, index) => (
          <div key={`${text(step.label, language)}-${step.shape}`} className={cx('grid gap-2 border-l-2 py-2 pl-3 text-sm md:grid-cols-[1.5rem_minmax(0,1fr)_minmax(8rem,0.6fr)] md:items-center', themeClasses.isLight ? 'border-[#205089]/16' : 'border-[#A8B8C8]/18')}>
            <span className={cx('flex h-6 w-6 items-center justify-center text-xs font-black', themeClasses.radius.icon, themeClasses.iconTile)}>{index + 1}</span>
            <span className={themeClasses.bodyText}>{text(step.label, language)}</span>
            <code className={cx('min-w-0 overflow-x-auto whitespace-nowrap text-xs', themeClasses.accentText)}>{step.shape}</code>
            {step.note && <p className={cx('md:col-start-2 md:col-span-2 text-xs leading-5', themeClasses.mutedText)}>{text(step.note, language)}</p>}
          </div>
        ))}
      </div>
    );
  }

  if (diagram.variant === 'matrix') {
    return (
      <div className="overflow-x-auto">
        <div className="grid w-max gap-1" style={{ gridTemplateColumns: `2.5rem repeat(${diagram.columns.length}, minmax(2.25rem, 1fr))` }}>
          <span />
          {diagram.columns.map((column) => <span key={column} className={cx('text-center text-xs font-semibold', themeClasses.mutedText)}>{column}</span>)}
          {diagram.rows.map((row) => (
            <MatrixRow key={row.label} row={row} themeClasses={themeClasses} />
          ))}
        </div>
        {diagram.legend && <p className={cx('mt-2 text-xs leading-5', themeClasses.mutedText)}>{text(diagram.legend, language)}</p>}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        {diagram.tokens.map((token, index) => (
          <span key={`${token}-${index}`} className={cx('border px-2 py-1 font-mono text-xs', themeClasses.radius.icon, themeClasses.isLight ? 'border-[#205089]/14 bg-white/70 text-[#123B68]' : 'border-[#A8B8C8]/16 bg-[#172232] text-[#F2F6FA]')}>{token}</span>
        ))}
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {diagram.windows.map((window, index) => (
          <div key={`${window.input.join('-')}-${index}`} className={cx('border-l-2 py-2 pl-3 text-xs', themeClasses.isLight ? 'border-[#205089]/18' : 'border-[#A8B8C8]/20')}>
            <div className={cx('font-black uppercase tracking-wide', themeClasses.eyebrowText)}>Window {index + 1}</div>
            <div className="mt-2 grid gap-1 font-mono">
              <span>input: [{window.input.join(', ')}]</span>
              <span>target: [{window.target.join(', ')}]</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MatrixRow({ row, themeClasses }: {
  row: Extract<Extract<LearningLessonExtra, { kind: 'diagram' }>['diagram'], { variant: 'matrix' }>['rows'][number];
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  return (
    <>
      <span className={cx('text-center text-xs font-semibold', themeClasses.mutedText)}>{row.label}</span>
      {row.cells.map((cell, index) => (
        <span
          key={`${row.label}-${index}`}
          className={cx(
            'flex h-9 w-9 items-center justify-center border text-xs font-black',
            themeClasses.radius.icon,
            cell === 'allowed' && (themeClasses.isLight ? 'border-[#2FBF71]/24 bg-[#2FBF71]/12 text-[#1F6F48]' : 'border-[#2FBF71]/32 bg-[#2FBF71]/16 text-[#A6E8C1]'),
            cell === 'blocked' && (themeClasses.isLight ? 'border-[#C45151]/24 bg-[#C45151]/10 text-[#8C3333]' : 'border-[#F87171]/28 bg-[#F87171]/14 text-[#FCA5A5]'),
            cell === 'target' && (themeClasses.isLight ? 'border-[#205089]/28 bg-[#205089]/12 text-[#123B68]' : 'border-[#A8B8C8]/28 bg-[#496F98]/22 text-[#F2F6FA]'),
          )}
        >
          {cell === 'blocked' ? 'x' : cell === 'target' ? '*' : ''}
        </span>
      ))}
    </>
  );
}

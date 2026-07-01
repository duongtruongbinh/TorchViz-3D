import { CheckCircle2, Code2, ListChecks, Sigma, Waypoints } from 'lucide-react';
import { BlockMath } from 'react-katex';
import type { LearningLessonExtra } from '../../../../core/learning/types';
import type { Language } from '../../../../lib/localization';
import { cx, getLearningLabTheme } from '../../theme';
import DiagramView from './DiagramView';
import ExtraFrame from './ExtraFrame';
import { renderCustomLearningExtra } from './customRendererRegistry';
import { text } from './lessonExtraText';

type LessonExtraRendererProps = {
  extra: LearningLessonExtra;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
};

export default function LessonExtraRenderer({ extra, language, themeClasses }: LessonExtraRendererProps) {
  const custom = renderCustomLearningExtra({ extra, language, themeClasses });
  if (custom) return custom;

  if (extra.kind === 'formula') {
    return <FormulaBlock extra={extra} language={language} themeClasses={themeClasses} />;
  }

  if (extra.kind === 'exercise') {
    return <ExerciseBlock extra={extra} language={language} themeClasses={themeClasses} />;
  }

  if (extra.kind === 'conceptPanel') {
    return <ConceptPanelBlock extra={extra} language={language} themeClasses={themeClasses} />;
  }

  if (extra.kind === 'codeContract') {
    return <CodeContractBlock extra={extra} language={language} themeClasses={themeClasses} />;
  }

  if (extra.kind === 'diagram') {
    return (
      <ExtraFrame icon={<Waypoints className="h-4 w-4" aria-hidden="true" />} title={text(extra.diagram.title, language)} themeClasses={themeClasses}>
        <DiagramView extra={extra} language={language} themeClasses={themeClasses} />
      </ExtraFrame>
    );
  }

  return null;
}

function FormulaBlock({ extra, language, themeClasses }: {
  extra: Extract<LearningLessonExtra, { kind: 'formula' }>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  return (
    <ExtraFrame icon={<Sigma className="h-4 w-4" aria-hidden="true" />} title={text(extra.title, language)} themeClasses={themeClasses}>
      <div className={cx('overflow-x-auto px-3 py-3 text-sm', themeClasses.radius.card, themeClasses.isLight ? 'bg-white/62' : 'bg-[#0F1721]/58')}>
        <BlockMath math={extra.latex} />
      </div>
      {extra.note && <p className={cx('mt-2 text-xs leading-6', themeClasses.mutedText)}>{text(extra.note, language)}</p>}
    </ExtraFrame>
  );
}

function ExerciseBlock({ extra, language, themeClasses }: {
  extra: Extract<LearningLessonExtra, { kind: 'exercise' }>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  return (
    <ExtraFrame icon={<ListChecks className="h-4 w-4" aria-hidden="true" />} title={text(extra.title, language)} themeClasses={themeClasses}>
      <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(extra.prompt, language)}</p>
      <ol className="mt-3 grid gap-2">
        {extra.tasks.map((task, index) => (
          <li key={text(task, language)} className={cx('grid grid-cols-[2rem_minmax(0,1fr)] gap-3 text-sm leading-6', themeClasses.bodyText)}>
            <span className={cx('font-black tabular-nums', themeClasses.accentText)}>{index + 1}</span>
            <span>{text(task, language)}</span>
          </li>
        ))}
      </ol>
      {extra.answer && (
        <div className={cx('mt-4 flex gap-2 text-sm leading-6', themeClasses.isLight ? 'text-[#1F6F48]' : 'text-[#A6E8C1]')}>
          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
          <span>{text(extra.answer, language)}</span>
        </div>
      )}
    </ExtraFrame>
  );
}

function ConceptPanelBlock({ extra, language, themeClasses }: {
  extra: Extract<LearningLessonExtra, { kind: 'conceptPanel' }>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const panelTitle = text(extra.title, language);
  const emphasis = extra.emphasis ? text(extra.emphasis, language) : '';
  const [titleBeforeEmphasis, titleAfterEmphasis] = emphasis ? panelTitle.split(emphasis) : [panelTitle, ''];

  return (
    <ExtraFrame
      icon={<Waypoints className="h-4 w-4" aria-hidden="true" />}
      title={panelTitle}
      themeClasses={themeClasses}
      customTitle={emphasis ? (
        <span className={cx('flex flex-wrap items-baseline gap-x-2 gap-y-1', themeClasses.eyebrowText)}>
          <span>{titleBeforeEmphasis}</span>
          <span className={cx('text-2xl font-black leading-none normal-case md:text-3xl', themeClasses.accentText)}>{emphasis}</span>
          <span>{titleAfterEmphasis}</span>
        </span>
      ) : undefined}
    >
      <div className="grid gap-4">
        {extra.body?.map((paragraph) => (
          <p key={text(paragraph, language)} className={cx('text-sm leading-7', themeClasses.bodyText)}>
            {text(paragraph, language)}
          </p>
        ))}

        {extra.highlights && (
          <div className="grid gap-3">
            {extra.highlights.map((item) => (
              <ConceptHighlightRow
                key={text(item.shortName, language)}
                shortName={text(item.shortName, language)}
                fullName={text(item.fullName, language)}
                description={text(item.description, language)}
                themeClasses={themeClasses}
              />
            ))}
          </div>
        )}

        {extra.table && (
          <div className={cx('overflow-hidden border', themeClasses.radius.card, themeClasses.isLight ? 'border-[#205089]/14' : 'border-[#A8B8C8]/16')}>
            <div className={cx('grid grid-cols-2 text-xs font-black uppercase tracking-wide', themeClasses.isLight ? 'bg-[#B8C8DA]/32 text-[#123B68]' : 'bg-[#A8B8C8]/10 text-[#A8B8C8]')}>
              {extra.table.columns.map((column) => (
                <div key={text(column, language)} className="px-3 py-2">{text(column, language)}</div>
              ))}
            </div>
            {extra.table.rows.map((row, index) => (
              <div key={`${text(row.cells[0], language)}-${index}`} className={cx('grid grid-cols-2 border-t text-sm leading-6', themeClasses.isLight ? 'border-[#205089]/10' : 'border-[#A8B8C8]/12')}>
                {row.cells.map((cell) => (
                  <div key={text(cell, language)} className={cx('px-3 py-3', themeClasses.bodyText)}>{text(cell, language)}</div>
                ))}
              </div>
            ))}
          </div>
        )}

        {extra.steps && (
          <div className="grid gap-0">
            {extra.steps.map((step, index) => (
              <div key={text(step.title, language)} className={cx('grid gap-3 border-t py-3 first:border-t-0 sm:grid-cols-[2.5rem_minmax(0,1fr)]', themeClasses.isLight ? 'border-[#205089]/10' : 'border-[#A8B8C8]/12')}>
                <span className={cx('font-black tabular-nums leading-6', themeClasses.accentText)}>{String(index + 1).padStart(2, '0')}</span>
                <div className="min-w-0 md:grid md:grid-cols-[13rem_minmax(0,1fr)] md:gap-4">
                  <div className={cx('text-sm font-black leading-6', themeClasses.titleText)}>{text(step.title, language)}</div>
                  <p className={cx('mt-1 text-sm leading-6 md:mt-0', themeClasses.bodyText)}>{text(step.body, language)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {extra.outline && (
          <div className="grid gap-6">
            {extra.outline.map((group, groupIndex) => (
              <div
                key={text(group.title, language)}
                className={cx(
                  'grid gap-3 border-l-2 pl-4',
                  themeClasses.isLight ? 'border-[#205089]/18' : 'border-[#A8B8C8]/20',
                )}
              >
                <div className="grid gap-3 sm:grid-cols-[3.75rem_minmax(0,1fr)] sm:items-start">
                  <div
                    className={cx(
                      'flex h-11 w-11 items-center justify-center rounded-lg text-lg font-black leading-none tabular-nums',
                      themeClasses.isLight ? 'bg-[#205089]/10 text-[#123B68]' : 'bg-[#A8B8C8]/12 text-[#F2F6FA]',
                    )}
                  >
                    {groupIndex + 1}
                  </div>
                  <div className="min-w-0">
                    <div className={cx('text-base font-black leading-6', themeClasses.titleText)}>{text(group.title, language)}</div>
                    <p className={cx('mt-1 text-sm leading-6', themeClasses.bodyText)}>{text(group.body, language)}</p>
                  </div>
                </div>

                <div className="grid gap-1 sm:pl-14">
                  {group.items.map((item, itemIndex) => (
                    <div
                      key={text(item.title, language)}
                      className={cx(
                        'group grid gap-3 py-2.5 sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:items-start',
                        itemIndex > 0 && (themeClasses.isLight ? 'border-t border-[#205089]/8' : 'border-t border-[#A8B8C8]/10'),
                      )}
                    >
                      <span
                        className={cx(
                          'inline-flex min-h-8 w-fit items-center rounded-lg px-2 text-[11px] font-black leading-5 tabular-nums transition-colors',
                          themeClasses.isLight
                            ? 'bg-[#B8C8DA]/24 text-[#123B68] group-hover:bg-[#205089]/10'
                            : 'bg-[#A8B8C8]/8 text-[#D7EAFE] group-hover:bg-[#A8B8C8]/12',
                        )}
                      >
                        {groupIndex + 1}.{itemIndex + 1}
                      </span>
                      <div className="min-w-0 lg:grid lg:grid-cols-[minmax(9rem,0.26fr)_minmax(0,1fr)] lg:gap-4">
                        <div className={cx('text-sm font-black leading-6', themeClasses.titleText)}>{text(item.title, language)}</div>
                        <p className={cx('mt-1 text-sm leading-6 lg:mt-0', themeClasses.bodyText)}>{text(item.body, language)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {extra.bullets && (
          <ul className="grid gap-2">
            {extra.bullets.map((item) => (
              <li key={text(item, language)} className={cx('flex gap-3 text-sm leading-6', themeClasses.bodyText)}>
                <CheckCircle2 className={cx('mt-1 h-4 w-4 shrink-0', themeClasses.accentText)} strokeWidth={2} aria-hidden="true" />
                <span>{text(item, language)}</span>
              </li>
            ))}
          </ul>
        )}

        {extra.links && (
          <div className="grid gap-2">
            {extra.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={cx('text-sm font-semibold leading-6 underline decoration-dotted underline-offset-4', themeClasses.accentText)}
              >
                {text(link.label, language)}
              </a>
            ))}
          </div>
        )}

        {extra.bodyAfter?.map((paragraph) => (
          <p key={text(paragraph, language)} className={cx('text-sm leading-7', themeClasses.bodyText)}>
            {text(paragraph, language)}
          </p>
        ))}
      </div>
    </ExtraFrame>
  );
}

function ConceptHighlightRow({
  shortName,
  fullName,
  description,
  themeClasses,
}: {
  shortName: string;
  fullName: string;
  description: string;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const rowTone = themeClasses.isLight
    ? 'bg-[#B8C8DA]/20 hover:bg-[#B8C8DA]/34'
    : 'bg-[#A8B8C8]/6 hover:bg-[#A8B8C8]/10';

  return (
    <div
      className={cx(
        'group grid gap-2 px-3 py-2 text-sm transition-colors sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:items-start',
        themeClasses.radius.button,
        rowTone,
      )}
    >
      <div className={cx('font-black leading-6', themeClasses.titleText)}>{shortName}</div>
      <div className="min-w-0">
        <div className={cx('font-normal leading-6', themeClasses.titleText)}>{fullName}</div>
        <p className={cx('mt-0.5 leading-6', themeClasses.bodyText)}>{description}</p>
      </div>
    </div>
  );
}

function CodeContractBlock({ extra, language, themeClasses }: {
  extra: Extract<LearningLessonExtra, { kind: 'codeContract' }>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  return (
    <ExtraFrame icon={<Code2 className="h-4 w-4" aria-hidden="true" />} title={text(extra.title, language)} themeClasses={themeClasses}>
      <div className="grid gap-2 md:grid-cols-3">
        <ContractItem label="Input" value={text(extra.input, language)} themeClasses={themeClasses} />
        <ContractItem label="Output" value={text(extra.output, language)} themeClasses={themeClasses} />
        <ContractItem label="Observe" value={text(extra.observe, language)} themeClasses={themeClasses} />
      </div>
    </ExtraFrame>
  );
}

function ContractItem({ label, value, themeClasses }: {
  label: string;
  value: string;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  return (
    <div className={cx('border-l-2 py-2 pl-3 text-sm leading-6', themeClasses.isLight ? 'border-[#205089]/18' : 'border-[#A8B8C8]/20')}>
      <div className={cx('text-[11px] font-black uppercase tracking-wide', themeClasses.eyebrowText)}>{label}</div>
      <p className={cx('mt-1', themeClasses.bodyText)}>{value}</p>
    </div>
  );
}

import { useState } from 'react';
import type { LearningLessonExtra } from '../../../../core/learning/types';
import type { Language } from '../../../../lib/localization';
import { cx, getLearningLabTheme } from '../../theme';
import ExtraFrame from './ExtraFrame';
import { text } from './lessonExtraText';

export default function ConceptPanelBlock({ extra, language, themeClasses }: {
  extra: Extract<LearningLessonExtra, { kind: 'conceptPanel' }>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const panelTitle = text(extra.title, language);
  const emphasis = extra.emphasis ? text(extra.emphasis, language) : '';
  const [titleBeforeEmphasis, titleAfterEmphasis] = emphasis ? panelTitle.split(emphasis) : [panelTitle, ''];
  const outlineGroupTitleText = themeClasses.isLight ? 'text-[#254F70]' : themeClasses.titleText;
  const outlineItemTitleText = themeClasses.isLight ? 'text-[#385F7A]' : themeClasses.titleText;
  const [activeOutlineItemKey, setActiveOutlineItemKey] = useState('0-0');
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(0);
  return (
    <ExtraFrame
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
        {extra.highlights ? (
          <div className="learning-lab-focus-group grid gap-3">
            {extra.highlights.map((item, itemIndex) => (
              <ConceptHighlightRow
                key={text(item.shortName, language)}
                shortName={text(item.shortName, language)}
                fullName={text(item.fullName, language)}
                description={text(item.description, language)}
                links={item.links?.map((link) => ({ label: text(link.label, language), href: link.href }))}
                isActive={activeHighlightIndex === itemIndex}
                themeClasses={themeClasses}
                onActivate={() => setActiveHighlightIndex(itemIndex)}
              />
            ))}
          </div>
        ) : null}

        {extra.comparisonTable && (
          <div className={cx('overflow-hidden rounded-lg border', themeClasses.isLight ? 'border-[#205089]/12 bg-white' : 'border-[#A8B8C8]/14 bg-[#121A24]/32')}>
            <div className={cx('hidden grid-cols-[7rem_repeat(3,minmax(0,1fr))] border-b text-xs font-black uppercase tracking-wide md:grid', themeClasses.isLight ? 'border-[#205089]/10 bg-[#EEF4FA] text-[#123B68]/72' : 'border-[#A8B8C8]/12 bg-[#A8B8C8]/8 text-[#F2F6FA]/62')}>
              {extra.comparisonTable.columns.map((column) => (
                <div key={text(column, language)} className="px-3 py-3">
                  {text(column, language)}
                </div>
              ))}
            </div>
            <div className="grid">
              {extra.comparisonTable.rows.map((row, rowIndex) => (
                <div
                  key={text(row.label, language)}
                  className={cx(
                    'grid gap-3 px-3 py-4 md:grid-cols-[7rem_repeat(3,minmax(0,1fr))] md:gap-0',
                    rowIndex > 0 && (themeClasses.isLight ? 'border-t border-[#205089]/10' : 'border-t border-[#A8B8C8]/12'),
                  )}
                >
                  <div className={cx('text-base font-black leading-6 md:text-sm', themeClasses.accentText)}>{text(row.label, language)}</div>
                  {row.cells.map((cell, cellIndex) => (
                    <div key={`${text(row.label, language)}-${cellIndex}`} className="min-w-0 md:px-3">
                      <div className={cx('mb-1 text-[11px] font-black uppercase tracking-wide md:hidden', themeClasses.mutedText)}>
                        {text(extra.comparisonTable?.columns[cellIndex + 1] ?? row.label, language)}
                      </div>
                      <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(cell, language)}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {extra.outline && (
          <div className="learning-lab-focus-group grid gap-6">
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
                    <div className={cx('text-base font-black leading-6', outlineGroupTitleText)}>{text(group.title, language)}</div>
                    <p className={cx('mt-1 text-sm leading-6', themeClasses.bodyText)}>{text(group.body, language)}</p>
                  </div>
                </div>

                <div className="grid gap-1 sm:pl-14">
                  {group.items.map((item, itemIndex) => {
                    const itemKey = `${groupIndex}-${itemIndex}`;
                    const isActive = activeOutlineItemKey === itemKey;
                    return (
                      <div
                        key={text(item.title, language)}
                        data-active={isActive ? 'true' : undefined}
                        tabIndex={0}
                        onFocus={() => setActiveOutlineItemKey(itemKey)}
                        onMouseEnter={() => setActiveOutlineItemKey(itemKey)}
                        className={cx(
                          'learning-lab-focus-panel group grid gap-3 px-3 py-2.5 transition-[box-shadow,filter,opacity,transform] duration-200 sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:items-start',
                          themeClasses.radius.button,
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
                          <div className={cx('text-sm font-black leading-6', outlineItemTitleText)}>{text(item.title, language)}</div>
                          <p className={cx('mt-1 text-sm leading-6 lg:mt-0', themeClasses.bodyText)}>{text(item.body, language)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
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
  links,
  isActive,
  themeClasses,
  onActivate,
}: {
  shortName: string;
  fullName: string;
  description: string;
  links?: Array<{ label: string; href: string }>;
  isActive: boolean;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
  onActivate: () => void;
}) {
  const descriptionLines = description.split('\n').filter(Boolean);
  const rowTone = themeClasses.isLight
    ? 'border border-[#205089]/10 bg-white hover:bg-white'
    : 'border border-[#A8B8C8]/14 bg-[#121A24]/42 hover:bg-[#121A24]/56';

  return (
    <div
      data-active={isActive ? 'true' : undefined}
      tabIndex={0}
      onFocus={onActivate}
      onMouseEnter={onActivate}
      className={cx(
        'learning-lab-focus-panel group grid gap-2 px-3 py-2 text-sm transition-[background-color,box-shadow,filter,opacity,transform] duration-200 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-start',
        themeClasses.radius.button,
        rowTone,
      )}
    >
      <div className={cx('whitespace-nowrap font-black leading-6', themeClasses.titleText)}>{shortName}</div>
      <div className="min-w-0">
        <div className={cx('font-normal leading-6', themeClasses.titleText)}>{fullName}</div>
        {descriptionLines.length > 1 ? (
          <ul className={cx('mt-1 grid gap-1 leading-6', themeClasses.bodyText)}>
            {descriptionLines.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-55" aria-hidden="true" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={cx('mt-0.5 leading-6', themeClasses.bodyText)}>{description}</p>
        )}
        <ConceptHighlightLinks links={links} className="mt-2" themeClasses={themeClasses} />
      </div>
    </div>
  );
}

function ConceptHighlightLinks({
  links,
  className,
  themeClasses,
}: {
  links?: Array<{ label: string; href: string }>;
  className?: string;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  if (!links?.length) return null;

  return (
    <ul className={cx(className, 'grid gap-1.5 text-xs leading-5', themeClasses.bodyText)}>
      {links.map((link) => (
        <li key={link.href} className="flex min-w-0 gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-55" aria-hidden="true" />
          <span className="min-w-0">
            <span className={cx('font-black', themeClasses.titleText)}>{link.label}: </span>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={cx('break-all font-semibold underline decoration-dotted underline-offset-4', themeClasses.accentText)}
            >
              {link.href}
            </a>
          </span>
        </li>
      ))}
    </ul>
  );
}

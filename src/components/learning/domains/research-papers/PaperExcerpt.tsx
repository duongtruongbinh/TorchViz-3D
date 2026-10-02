import React from 'react';

export interface AuthorItem {
  name: string;
  affiliationIndexes?: string[];
  isAlphabetical?: boolean;
  highlight?: boolean;
}

export interface AffiliationItem {
  index: string;
  name: string;
}

export interface PaperExcerptProps {
  ariaLabel?: string;
  venue?: string;
  titleLines?: string[];
  titleHighlights?: string[];
  hideTitle?: boolean;
  authorColumns?: AuthorItem[][];
  affiliations?: AffiliationItem[];
  abstractParagraphs?: string[];
  abstractHighlights?: string[];
  sectionHeading?: string;
  sectionParagraphs?: string[];
  sectionHighlights?: string[];
  footnote?: string;
  footnoteHighlight?: boolean;
}

function renderHighlightedString(text: string, highlights?: string[]): React.ReactNode {
  if (!highlights || highlights.length === 0) return text;
  const regex = new RegExp(`(${highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
  const parts = text.split(regex);
  return parts.map((part, i) => {
    const isHit = highlights.some((h) => h === part);
    if (isHit) {
      return (
        <span key={i} className="bg-[#FEF08A]/85 px-1 py-0.5 rounded-[2px] text-black">
          {part}
        </span>
      );
    }
    return part;
  });
}

function renderHighlightedText(text: string, highlights?: string[]): React.ReactNode {
  if (!text.includes('**')) {
    return renderHighlightedString(text, highlights);
  }
  const segments = text.split(/(\*\*[^*]+\*\*)/g);
  return segments.map((seg, idx) => {
    if (seg.startsWith('**') && seg.endsWith('**')) {
      const inner = seg.slice(2, -2);
      return (
        <strong key={idx} className="font-bold text-black font-serif">
          {renderHighlightedString(inner, highlights)}
        </strong>
      );
    }
    return renderHighlightedString(seg, highlights);
  });
}

export function PaperExcerpt({
  ariaLabel = 'Trích đoạn bài báo gốc',
  venue,
  titleLines = [
    'QUANTIFYING MEMORIZATION ACROSS',
    'NEURAL LANGUAGE MODELS',
  ],
  titleHighlights,
  hideTitle = false,
  authorColumns,
  affiliations,
  abstractParagraphs,
  abstractHighlights,
  sectionHeading,
  sectionParagraphs,
  sectionHighlights,
  footnote,
  footnoteHighlight,
}: PaperExcerptProps) {
  const hasAuthors = Boolean(authorColumns && authorColumns.length > 0);
  const hasAffiliations = Boolean(affiliations && affiliations.length > 0);
  const showTitle = !hideTitle && titleLines.length > 0;

  return (
    <div
      className="my-7 overflow-hidden rounded-xl border border-[#B8C8DA]/80 bg-[#E8EEF5] p-3 sm:p-6"
      aria-label={ariaLabel}
    >
      {/* Paper Sheet (Simulating physical printed paper page on desk) */}
      <div
        className={`mx-auto max-w-2xl rounded-[2px] border border-[#CBD5E1] bg-white shadow-[0_12px_32px_rgba(32,80,137,0.12),0_2px_6px_rgba(0,0,0,0.06)] font-serif text-black ${
          hasAuthors ? 'p-6 sm:p-10' : 'p-6 sm:p-8'
        }`}
      >
        {/* Conference Header & Horizontal Rule */}
        {venue && (
          <div className="mb-8 border-b-[1.5px] border-black pb-1">
            <span className="text-xs sm:text-[13px] tracking-normal text-black font-normal">
              {venue}
            </span>
          </div>
        )}

        {/* Paper Title */}
        {showTitle && (
          <div className={hasAuthors ? 'mb-8 text-center' : 'my-2 text-center'}>
            {titleLines.map((line, idx) => (
              <h2
                key={line + idx}
                className="text-lg sm:text-2xl font-bold uppercase tracking-wide text-black leading-snug"
              >
                {renderHighlightedText(line, titleHighlights)}
              </h2>
            ))}
          </div>
        )}

        {/* Authors: 3 Columns x 2 Rows Grid */}
        {hasAuthors && authorColumns && (
          <div className="mb-7 mx-auto max-w-xl grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4 text-center">
            {authorColumns.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col items-center gap-y-2">
                {col.map((author, authorIdx) => (
                  <div key={author.name + authorIdx} className="inline-block text-sm sm:text-base font-normal">
                    <span
                      className={
                        author.highlight
                          ? 'bg-[#FEF08A]/85 px-1 py-0.5 rounded-[2px]'
                          : undefined
                      }
                    >
                      <span className="text-black">{author.name}</span>
                      {author.isAlphabetical && (
                        <sup className="text-xs font-normal text-black ml-0.5">*</sup>
                      )}
                      {author.affiliationIndexes && (
                        <sup className="text-[11px] font-normal text-black ml-0.5">
                          {author.affiliationIndexes.join(',')}
                        </sup>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Affiliations: Stacked Vertically & Centered */}
        {hasAffiliations && affiliations && (
          <div className="mb-8 flex flex-col items-center text-center text-xs sm:text-[13px] italic text-[#1E293B] leading-relaxed">
            {affiliations.map((aff) => (
              <div key={aff.index}>
                <sup className="font-normal mr-0.5">{aff.index}</sup>
                <span>{aff.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Abstract Section */}
        {abstractParagraphs && abstractParagraphs.length > 0 && (
          <div className="mx-auto max-w-xl my-6">
            <div className="text-center mb-3">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black">
                ABSTRACT
              </span>
            </div>
            <div className="space-y-3 text-xs sm:text-[13.5px] leading-relaxed text-[#0F172A] text-justify font-serif">
              {abstractParagraphs.map((paragraph, pIdx) => (
                <p key={pIdx}>
                  {renderHighlightedText(paragraph, abstractHighlights)}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Numbered Section (e.g. 1 INTRODUCTION, 3 METHODOLOGY) */}
        {sectionParagraphs && sectionParagraphs.length > 0 && (
          <div className="mx-auto max-w-xl my-4">
            {sectionHeading && (
              <div className="mb-3 text-left">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black font-serif">
                  {sectionHeading}
                </span>
              </div>
            )}
            <div className="space-y-3 text-xs sm:text-[13.5px] leading-relaxed text-[#0F172A] text-justify font-serif">
              {sectionParagraphs.map((paragraph, pIdx) => {
                const listMatch = paragraph.match(/^(\d+)\.\s+(.*)$/);
                if (listMatch) {
                  return (
                    <div key={pIdx} className="pl-5 -indent-5 text-left leading-relaxed !mt-1.5">
                      <span className="font-serif mr-1">{listMatch[1]}.</span>
                      <span>{renderHighlightedText(listMatch[2], sectionHighlights)}</span>
                    </div>
                  );
                }
                return (
                  <p key={pIdx}>
                    {renderHighlightedText(paragraph, sectionHighlights)}
                  </p>
                );
              })}
            </div>
          </div>
        )}

        {/* Footnote: Bottom Left with Classic LaTeX Short Rule */}
        {footnote && (
          <div className={hasAuthors || showTitle ? 'mt-8 pt-2' : 'my-1'}>
            <div className="w-16 border-t border-black mb-1.5" />
            <div className="text-[11px] text-[#334155]">
              {footnoteHighlight ? (
                <span className="bg-[#FEF08A]/85 px-1 py-0.5 rounded-[2px] text-black">
                  {footnote}
                </span>
              ) : (
                footnote
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

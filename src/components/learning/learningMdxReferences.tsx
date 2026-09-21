import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  size,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { BookOpen, Check, Copy, ExternalLink } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import {
  citationEvidenceTargetLabel,
  type LearningCitationEvidence,
  type LearningCitationLinkOnlyException,
} from '../../core/learning/citationEvidence';
import {
  useLearningMdxLesson,
  useLearningMdxTheme,
  type LearningReferencePaper,
} from './learningMdxComponents';
import { cx } from './theme';

function useLearningReferencePaper(paperId: string): LearningReferencePaper | null {
  return useLearningMdxLesson().referencePapers?.find((paper) => paper.id === paperId) ?? null;
}

function useLearningCitationEvidence(evidenceId: string | undefined): LearningCitationEvidence | null {
  const lessonContext = useLearningMdxLesson();
  if (!evidenceId) return null;
  return lessonContext.citationEvidence?.find((evidence) => evidence.id === evidenceId) ?? null;
}

function useLearningCitationLinkOnlyException(exceptionId: string | undefined): LearningCitationLinkOnlyException | null {
  const lessonContext = useLearningMdxLesson();
  if (!exceptionId) return null;
  return lessonContext.citationLinkOnlyExceptions?.find((exception) => exception.id === exceptionId) ?? null;
}

function referenceAuthorLabel(paper: LearningReferencePaper): string {
  const firstAuthor = paper.authors[0]?.split(',')[0]?.trim() || paper.title;
  return paper.authors.length > 1 ? `${firstAuthor} et al.` : firstAuthor;
}

function CitationPreviewLink({
  citation,
  evidence,
  reference,
}: {
  citation: string;
  evidence: LearningCitationEvidence;
  reference: LearningReferencePaper;
}) {
  const themeClasses = useLearningMdxTheme();
  const lessonContext = useLearningMdxLesson();
  const titleId = useId();
  const excerptId = useId();
  const lastPointerType = useRef<string>('mouse');
  const copyTimer = useRef<number | null>(null);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const open = lessonContext.activeCitationEvidenceId === evidence.id;
  const setOpen = (nextOpen: boolean) => {
    if (nextOpen) lessonContext.setActiveCitationEvidenceId(evidence.id);
    else if (lessonContext.activeCitationEvidenceId === evidence.id) lessonContext.setActiveCitationEvidenceId(null);
  };
  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'top-start',
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(10),
      flip({ padding: 12 }),
      shift({ padding: 12 }),
      size({
        padding: 12,
        apply({ availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${Math.max(0, availableHeight)}px`,
          });
        },
      }),
    ],
  });
  const hover = useHover(context, {
    mouseOnly: true,
    delay: { open: 260, close: 120 },
    handleClose: safePolygon(),
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context, { escapeKey: true, outsidePress: true });
  const role = useRole(context, { role: 'dialog' });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  useEffect(() => () => {
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
  }, []);

  const copySearchText = async () => {
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(evidence.searchText);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
    copyTimer.current = window.setTimeout(() => setCopyState('idle'), 2200);
  };

  const citationLink = (
    <a
      ref={refs.setReference}
      href={evidence.verificationUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${citation}: ${reference.title} (mở trong tab mới)`}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-describedby={open ? excerptId : undefined}
      {...getReferenceProps({
        onPointerDown(event) {
          lastPointerType.current = event.pointerType;
        },
        onClick(event) {
          if (event.detail !== 0 && (lastPointerType.current === 'touch' || lastPointerType.current === 'pen')) {
            event.preventDefault();
            setOpen(true);
          }
        },
      })}
      className={cx(
        'font-semibold underline decoration-1 underline-offset-[3px] transition-colors hover:decoration-2',
        themeClasses.focusRing,
        themeClasses.isLight ? 'text-[#205E91] decoration-[#205E91]/35' : 'text-[#9CC7EF] decoration-[#9CC7EF]/45',
      )}
    >
      {citation}
    </a>
  );

  return (
    <>
      {citationLink}
      {open ? (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false} initialFocus={-1} returnFocus={false}>
            <aside
              ref={refs.setFloating}
              style={floatingStyles}
              aria-labelledby={titleId}
              {...getFloatingProps()}
              className={cx(
                'z-[80] w-[min(28rem,calc(100vw-1.5rem))] overflow-y-auto rounded-2xl border p-4 shadow-[0_20px_55px_rgba(15,36,58,0.22)] transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none',
                isPositioned ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0',
                themeClasses.isLight
                  ? 'border-[#205089]/18 bg-[#FBFDFF] text-[#16324F]'
                  : 'border-[#A8B8C8]/22 bg-[#111C28] text-[#E5EEF8]',
              )}
            >
              <p id={titleId} className={cx('text-sm font-bold leading-5', themeClasses.titleText)}>{reference.title}</p>
              <p className={cx('mt-0.5 text-xs leading-5', themeClasses.mutedText)}>{referenceAuthorLabel(reference)}{reference.year ? ` · ${reference.year}` : ''}</p>
              <blockquote
                id={excerptId}
                className={cx(
                  'mt-3 border-l-2 pl-3 text-sm leading-6',
                  themeClasses.isLight ? 'border-[#205089]/35 text-[#294A68]' : 'border-[#9CC7EF]/40 text-[#D5E4F2]',
                )}
              >
                “<mark
                  className={cx(
                    'rounded-sm px-1 py-0.5 box-decoration-clone',
                    themeClasses.isLight
                      ? 'bg-amber-200/70 text-[#16324F]'
                      : 'bg-amber-400/25 text-[#E5EEF8]',
                  )}
                >
                  {evidence.excerpt}
                </mark>”
              </blockquote>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={copySearchText}
                  className={cx(
                    'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-center text-sm font-black transition-colors',
                    themeClasses.focusRing,
                    themeClasses.isLight
                      ? 'border-[#205089]/22 bg-white text-[#205089] hover:bg-[#EAF2FA]'
                      : 'border-[#A8D4FF]/24 bg-[#172533] text-[#B9D8F5] hover:bg-[#213548]',
                  )}
                >
                  {copyState === 'copied' ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
                  {copyState === 'copied' ? 'Đã sao chép' : copyState === 'failed' ? 'Thử sao chép lại' : 'Sao chép đoạn để tìm'}
                </button>
                <a
                  href={evidence.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cx(
                    'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 py-2 text-center text-sm font-black no-underline transition-colors',
                    themeClasses.focusRing,
                    themeClasses.isLight ? 'bg-[#205089] text-white hover:bg-[#17456F]' : 'bg-[#9CC7EF] text-[#071522] hover:bg-[#B6D8F7]',
                  )}
                >
                  {citationEvidenceTargetLabel(evidence.targetPrecision)}
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              </div>
              <span className="sr-only" aria-live="polite">
                {copyState === 'copied' ? 'Đã sao chép đoạn tìm kiếm.' : copyState === 'failed' ? 'Không thể sao chép. Vui lòng thử lại.' : ''}
              </span>
            </aside>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}
    </>
  );
}

export function Cite({ paper, evidence: evidenceId, exception: exceptionId }: { paper: string; evidence?: string; exception?: string }) {
  const themeClasses = useLearningMdxTheme();
  const { referenceIndexByPaperId } = useLearningMdxLesson();
  const reference = useLearningReferencePaper(paper);
  const evidence = useLearningCitationEvidence(evidenceId);
  const linkOnlyException = useLearningCitationLinkOnlyException(exceptionId);
  if (!reference) return <span className="text-rose-700" title={`Unknown paper ID: ${paper}`}>[{paper}]</span>;
  if (evidenceId && exceptionId) return <span className="text-rose-700" title="A citation cannot declare both evidence and a link-only exception">[{paper}]</span>;
  if (evidenceId && !evidence) return <span className="text-rose-700" title={`Unknown citation evidence ID: ${evidenceId}`}>[{evidenceId}]</span>;
  if (exceptionId && !linkOnlyException) return <span className="text-rose-700" title={`Unknown citation link-only exception ID: ${exceptionId}`}>[{exceptionId}]</span>;
  const referenceIndex = referenceIndexByPaperId.get(paper);
  if (!referenceIndex) return <span className="text-rose-700" title={`Paper is missing from the lesson reference index: ${paper}`}>[{paper}]</span>;
  const citation = `[${referenceIndex}]`;
  if (evidence) return <CitationPreviewLink citation={citation} evidence={evidence} reference={reference} />;
  return (
    <a
      href={linkOnlyException?.verificationUrl ?? reference.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${citation}: ${reference.title} (mở trong tab mới)`}
      className={cx(
        'font-semibold underline decoration-1 underline-offset-[3px] transition-colors hover:decoration-2',
        themeClasses.focusRing,
        themeClasses.isLight ? 'text-[#205E91] decoration-[#205E91]/35' : 'text-[#9CC7EF] decoration-[#9CC7EF]/45',
      )}
    >
      {citation}
    </a>
  );
}

export function PaperSummary({
  paper,
  question,
  setup,
  finding,
  limitation,
  relevance,
  locator,
  limitationSource = 'course-analysis',
}: {
  paper: string;
  question: string;
  setup: string;
  finding: string;
  limitation: string;
  relevance: string;
  locator?: string;
  limitationSource?: 'authors' | 'course-analysis';
}) {
  const themeClasses = useLearningMdxTheme();
  const reference = useLearningReferencePaper(paper);
  if (!reference) return null;
  const rows = [
    ['Câu hỏi', question],
    ['Thiết lập', setup],
    ['Kết quả liên quan', finding],
    [limitationSource === 'authors' ? 'Giới hạn do tác giả nêu' : 'Giới hạn khi diễn giải', limitation],
    ['Vai trò trong bài', relevance],
  ];
  return (
    <section className={cx('my-6 overflow-hidden rounded-xl border', themeClasses.isLight ? 'border-[#205089]/16 bg-[#F8FAFC]' : 'border-[#A8B8C8]/18 bg-[#121A24]/42')} aria-label={`Phân tích paper ${reference.title}`}>
      <header className={cx('flex items-start gap-3 border-b px-4 py-4 sm:px-5', themeClasses.isLight ? 'border-[#205089]/12 bg-[#EAF2FA]' : 'border-[#A8B8C8]/14 bg-[#A8D4FF]/8')}>
        <BookOpen className={cx('mt-0.5 size-5 shrink-0', themeClasses.accentText)} aria-hidden="true" />
        <div className="min-w-0">
          <a href={reference.url} target="_blank" rel="noreferrer" className={cx('font-black leading-6 underline-offset-4 hover:underline', themeClasses.focusRing, themeClasses.titleText)}>{reference.title}</a>
          <p className={cx('mt-1 text-sm leading-5', themeClasses.mutedText)}>{referenceAuthorLabel(reference)}{reference.year ? ` · ${reference.year}` : ''}{locator ? ` · ${locator}` : ''}</p>
        </div>
      </header>
      <dl className="divide-y divide-[#205089]/10 px-4 sm:px-5">
        {rows.map(([term, description]) => (
          <div key={term} className="grid gap-1 py-3 sm:grid-cols-[10.5rem_1fr] sm:gap-4">
            <dt className={cx('text-sm font-black leading-6', themeClasses.titleText)}>{term}</dt>
            <dd className={cx('text-sm leading-6', themeClasses.bodyText)}>{description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ReferencePaperList({ title, papers, startIndex }: { title: string; papers: readonly LearningReferencePaper[]; startIndex: number }) {
  const themeClasses = useLearningMdxTheme();
  return (
    <div className="mt-5">
      {title ? <h3 className={cx('text-sm font-black', themeClasses.titleText)}>{title}</h3> : null}
      <ol start={startIndex} className="mt-2 grid list-decimal gap-2 pl-5">
        {papers.map((paper) => (
          <li key={paper.id} className={cx('pl-1 text-sm leading-6', themeClasses.bodyText)}>
            <a href={paper.url} target="_blank" rel="noreferrer" className={cx('font-bold underline-offset-4 hover:underline', themeClasses.focusRing, themeClasses.isLight ? 'text-[#205E91]' : 'text-[#9CC7EF]')}>
              {paper.title}<ExternalLink className="ml-1 inline size-3.5" aria-hidden="true" />
            </a>
            <span className={themeClasses.mutedText}> — {referenceAuthorLabel(paper)}{paper.year ? ` (${paper.year})` : ''}{paper.venue ? `, ${paper.venue}` : ''}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function LessonReferences() {
  const themeClasses = useLearningMdxTheme();
  const { referencePapers = [], featuredReferenceIds = [], referenceCourseAnalysis } = useLearningMdxLesson();
  if (!referencePapers.length && !referenceCourseAnalysis) return null;
  const featuredSet = new Set(featuredReferenceIds);
  const featured = referencePapers.filter((paper) => featuredSet.has(paper.id));
  const additional = referencePapers.filter((paper) => !featuredSet.has(paper.id));
  return (
    <section aria-labelledby="lesson-references-heading">
      <h2 id="lesson-references-heading" className={cx('text-lg font-black text-balance', themeClasses.titleText)}>Nguồn chính được dùng trong bài</h2>
      {referenceCourseAnalysis ? <p className={cx('mt-3 text-sm leading-6', themeClasses.bodyText)}><strong>Phạm vi diễn giải:</strong> {referenceCourseAnalysis}</p> : null}
      {featured.length ? <ReferencePaperList title="" papers={featured} startIndex={1} /> : null}
      {additional.length ? (
        <details className={cx('mt-5 rounded-xl border', themeClasses.isLight ? 'border-[#205089]/14 bg-[#F8FAFC]' : 'border-[#A8B8C8]/18 bg-[#121A24]/42')}>
          <summary className={cx('cursor-pointer px-4 py-3 text-sm font-black marker:text-[#2F78B7]', themeClasses.focusRing, themeClasses.titleText)}>
            Bằng chứng liên quan trong survey ({additional.length} paper)
          </summary>
          <div className="border-t border-[#205089]/10 px-4 pb-4"><ReferencePaperList title="" papers={additional} startIndex={featured.length + 1} /></div>
        </details>
      ) : null}
    </section>
  );
}

export const referenceLearningMdxComponents = {
  Cite,
  PaperSummary,
};

// Reusable, theme-aware code surface for Learning Lab lessons.
//
// - `variant="code"` (default): Python source highlighted via the shared Shiki
//   singleton (always github-dark tokens on an always-dark surface, see plan
//   Decision 5). Tokens render as colored spans; we never inject Shiki HTML or
//   mutate token content.
// - `variant="output"`: plain monospaced text, visually distinct from code, not
//   tokenized.
//
// Extras are opt-in: line numbers, separate whitespace gutters (only for the
// whitespace lesson), a header trailing slot (answer toggle, callouts), and a
// copy button. No `language` prop — only Python is bundled.

import { Check, Copy, Terminal } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { highlightPython, type PythonTokens } from './pythonHighlighter';
import { cx } from '../theme';
import type { LearningThemeClasses } from '../learningMdxComponents';

export interface CodeBlockProps {
  /** Python source. A string[] is joined with `\n` (one entry per line). */
  code: string | string[];
  /** Header label for the code variant. Ignored for `output`. */
  label?: string;
  /** `code` = highlighted Python; `output` = plain monospaced text. */
  variant?: 'code' | 'output';
  /** Show a 1-based line-number gutter. */
  showLineNumbers?: boolean;
  /**
   * Show whitespace marker gutters (indentation `→` + line-end `↵`). Intended
   * only for the whitespace lesson. The markers live in their own gutters; the
   * token stream is rendered verbatim so indentation stays correct.
   */
  showWhitespace?: boolean;
  /** Extra node rendered on the header's trailing side (answer toggle, etc.). */
  headerTrailing?: ReactNode;
  /** Show a copy button. Defaults to true for code, false for output. */
  copyable?: boolean;
  themeClasses: LearningThemeClasses;
}

/** Resolve Python tokens for `source`, dropping stale results on unmount/change. */
function usePythonTokens(source: string): PythonTokens | null {
  const [lines, setLines] = useState<PythonTokens | null>(null);
  const sourceRef = useRef(source);
  sourceRef.current = source;
  useEffect(() => {
    let cancelled = false;
    highlightPython(source)
      .then((result) => {
        // Drop the result if the component unmounted or `source` changed while
        // we were awaiting — older resolves must not clobber newer state.
        if (cancelled || sourceRef.current !== source) return;
        setLines(result);
      })
      .catch(() => {
        /* leave the plain-text fallback rendered */
      });
    return () => {
      cancelled = true;
    };
  }, [source]);
  return lines;
}

function CopyButton({ source, themeClasses }: { source: string; themeClasses: LearningThemeClasses }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      if (timerRef.current !== undefined) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const onCopy = () => {
    navigator.clipboard
      ?.writeText(source)
      .then(() => {
        setCopied(true);
        if (timerRef.current !== undefined) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => setCopied(false), 1600);
      })
      .catch(() => {
        /* clipboard unavailable (blocked / insecure context) — no-op */
      });
  };

  const Icon = copied ? Check : Copy;
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? 'Copied' : 'Copy code'}
      className={cx(
        'inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/[0.08] px-2.5 py-1 text-[0.68rem] font-black text-[#DCE8F4] transition-colors hover:bg-white/[0.14]',
        themeClasses.focusRing,
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function renderLine(lineTokens: PythonTokens[number] | undefined, fallback: string) {
  // Until the singleton resolves (or for an empty line) show the raw text so the
  // layout never shifts; tokens swap in once available.
  if (!lineTokens || lineTokens.length === 0) {
    return <span>{fallback || ' '}</span>;
  }
  return lineTokens.map((token, index) => (
    <span key={index} style={token.color ? { color: token.color } : undefined}>
      {token.content}
    </span>
  ));
}

export function CodeBlock({
  code,
  label = 'Python',
  variant = 'code',
  showLineNumbers = false,
  showWhitespace = false,
  headerTrailing,
  copyable,
  themeClasses,
}: CodeBlockProps) {
  const isOutput = variant === 'output';
  const source = Array.isArray(code) ? code.join('\n') : String(code ?? '');
  const rawLines = source.split('\n');
  // Output is never tokenized; pass '' so the hook never highlights plain text.
  const tokens = usePythonTokens(isOutput ? '' : source);
  const showCopy = copyable ?? !isOutput;

  return (
    <div className="overflow-hidden rounded-lg border border-white/12 bg-[#0B1220] shadow-[inset_0_0_0_1px_rgba(168,184,200,0.10)]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
        {isOutput ? (
          <span className="flex items-center gap-2 text-[0.68rem] font-black uppercase tracking-[0.09em] text-[#A8B8C8]">
            <Terminal className="h-4 w-4 text-[#9CC7EF]" strokeWidth={1.8} aria-hidden="true" />
            Output
          </span>
        ) : (
          <span className="flex items-center" aria-label={`${label} code window`}>
            <span className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-[#D86B72]" />
              <span className="h-2 w-2 rounded-full bg-[#CDA24F]" />
              <span className="h-2 w-2 rounded-full bg-[#63A57A]" />
            </span>
          </span>
        )}
        <span className="flex items-center gap-2">
          {headerTrailing}
          {showCopy ? <CopyButton source={source} themeClasses={themeClasses} /> : null}
        </span>
      </div>

      <pre className="overflow-x-auto px-4 py-4 leading-7 text-[#E8F1FA] md:px-5">
        <code>
          {isOutput
            ? <span className="whitespace-pre-wrap break-words font-mono text-[0.82rem] text-[#CFE2F7]">{source}</span>
            : rawLines.map((rawLine, index) => {
                const indentation = showWhitespace ? rawLine.match(/^\s*/)?.[0].length ?? 0 : 0;
                const arrows = indentation > 0 ? '→'.repeat(Math.floor(indentation / 4)) : '';
                return (
                  <span key={`${index}-${rawLine}`} className="block whitespace-pre font-mono text-[0.82rem] md:text-sm">
                    {showLineNumbers ? (
                      <span className="mr-3 inline-block w-6 shrink-0 select-none text-right text-[#59708A]">{index + 1}</span>
                    ) : null}
                    {showWhitespace && arrows ? (
                      <span className="mr-2 select-none text-[#74D99F]">{arrows} </span>
                    ) : null}
                    {renderLine(tokens?.[index], rawLine)}
                    {showWhitespace ? <span className="select-none text-[#5E7891]"> ↵</span> : null}
                  </span>
                );
              })}
        </code>
      </pre>
    </div>
  );
}

// Fine-grained Shiki v4 singleton for Learning Lab Python snippets.
//
// Only the python grammar + ONE theme (github-dark) + the pure-JS regex engine
// are bundled. No full/web bundle, no Oniguruma wasm fetch (the JS engine keeps
// highlighting fully in-browser — nothing leaves the machine). The highlighter
// is created once and shared; tokenized output is memoized so re-renders and
// sibling CodeBlocks never re-tokenize the same source.
//
// The surface stays always-dark for now (see plan Decision 5); when we switch to
// a theme-following surface, re-add `github-light` + an `isLight` arg here.

import { createHighlighterCore, type HighlighterCore, type ThemedToken } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import python from 'shiki/langs/python.mjs';
import githubDark from 'shiki/themes/github-dark.mjs';

const PYTHON_LANG = 'python';
const PYTHON_THEME = 'github-dark';

/** Highlighted source as Shiki sees it: one token array per source line. */
export type PythonTokens = ThemedToken[][];

let highlighterPromise: Promise<HighlighterCore> | null = null;

/**
 * Lazily create the singleton Shiki highlighter (python + github-dark, JS regex
 * engine). Subsequent callers share the same promise — never re-initialized.
 */
export function getPythonHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      langs: [python],
      themes: [githubDark],
      engine: createJavaScriptRegexEngine(),
    });
  }
  return highlighterPromise;
}

const tokenCache = new Map<string, PythonTokens>();

/**
 * Tokenize Python source as github-dark tokens, one entry per line. Results are
 * cached by source text; a cache hit resolves synchronously via Promise.resolve.
 */
export async function highlightPython(code: string): Promise<PythonTokens> {
  const cached = tokenCache.get(code);
  if (cached) return cached;
  const highlighter = await getPythonHighlighter();
  const { tokens } = highlighter.codeToTokens(code, { lang: PYTHON_LANG, theme: PYTHON_THEME });
  tokenCache.set(code, tokens);
  return tokens;
}

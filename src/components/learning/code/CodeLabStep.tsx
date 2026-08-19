import { useState } from 'react';
import { Check, ChevronDown, ChevronRight, Copy, FileCode, Play, Terminal } from 'lucide-react';

export interface CodeLabStepProps {
  stepNumber: number;
  title: string;
  command?: string;
  filePath?: string;
  code?: string;
  expectedOutput?: string;
  explanation?: string;
}

export function CodeLabStep({
  stepNumber,
  title,
  command,
  filePath,
  code,
  expectedOutput,
  explanation,
}: CodeLabStepProps) {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showOutput, setShowOutput] = useState(true);

  const copyToClipboard = (text: string, isCommand: boolean) => {
    navigator.clipboard.writeText(text);
    if (isCommand) {
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="my-4 rounded-xl border border-zinc-800 bg-zinc-950/70 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900/80 border-b border-zinc-800">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-xs font-bold border border-indigo-500/30">
          {stepNumber}
        </div>
        <h4 className="text-sm font-semibold text-zinc-200 m-0">{title}</h4>
      </div>

      <div className="p-4 space-y-3">
        {explanation && <p className="text-xs text-zinc-400 leading-relaxed m-0">{explanation}</p>}

        {/* Command Terminal Bar */}
        {command && (
          <div className="relative group rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900/90 border-b border-zinc-800/80 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5 font-mono">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Terminal Command
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(command, true)}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors"
                title="Sao chép lệnh"
              >
                {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedCmd ? 'Đã chép' : 'Copy'}
              </button>
            </div>
            <pre className="p-3 text-xs font-mono text-emerald-300 overflow-x-auto m-0">
              <span className="text-zinc-500 select-none">$ </span>
              {command}
            </pre>
          </div>
        )}

        {/* Code / Script View */}
        {code && (
          <div className="rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden">
            {filePath && (
              <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900/90 border-b border-zinc-800/80 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1.5 font-mono">
                  <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                  {filePath}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(code, false)}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors"
                  title="Sao chép mã nguồn"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedCode ? 'Đã chép' : 'Copy'}
                </button>
              </div>
            )}
            <pre className="p-3 text-xs font-mono text-zinc-300 overflow-x-auto m-0 leading-relaxed">
              {code}
            </pre>
          </div>
        )}

        {/* Expected Output Accordion */}
        {expectedOutput && (
          <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/50 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowOutput((prev) => !prev)}
              className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Play className="w-3 h-3 text-cyan-400" />
                Expected Console Output
              </span>
              {showOutput ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            {showOutput && (
              <pre className="p-3 pt-0 text-xs font-mono text-zinc-400 border-t border-zinc-800/40 bg-zinc-950/40 overflow-x-auto m-0">
                {expectedOutput}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

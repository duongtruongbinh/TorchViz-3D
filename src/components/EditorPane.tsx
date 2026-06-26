import React, { useEffect, useRef } from 'react';
import Editor, { Monaco, loader, type OnMount } from '@monaco-editor/react';
import { getStrings } from '../lib/localization';
import { useStore } from '../store/useStore';

loader.config({ paths: { vs: '/monaco/vs' } });

const NN_COMPLETIONS: { label: string; detail?: string }[] = [
  { label: 'Module', detail: 'Base class for all nn modules' },
  { label: 'Conv2d', detail: '(in_channels, out_channels, kernel_size, ...)' },
  { label: 'ConvTranspose2d', detail: '(in_channels, out_channels, kernel_size, ...)' },
  { label: 'Linear', detail: '(in_features, out_features)' },
  { label: 'Sequential', detail: '(*modules)' },
  { label: 'MaxPool2d', detail: '(kernel_size, stride=None, padding=0)' },
  { label: 'AvgPool2d', detail: '(kernel_size, stride=None, padding=0)' },
  { label: 'AdaptiveAvgPool2d', detail: '(output_size)' },
  { label: 'BatchNorm2d', detail: '(num_features)' },
  { label: 'LayerNorm', detail: '(normalized_shape)' },
  { label: 'GroupNorm', detail: '(num_groups, num_channels)' },
  { label: 'InstanceNorm2d', detail: '(num_features)' },
  { label: 'Identity', detail: '()' },
  { label: 'ReLU', detail: '()' },
  { label: 'GELU', detail: '()' },
  { label: 'SiLU', detail: '()' },
  { label: 'LeakyReLU', detail: '(negative_slope=0.01)' },
  { label: 'ELU', detail: '(alpha=1.0)' },
  { label: 'Hardswish', detail: '()' },
  { label: 'Tanh', detail: '()' },
  { label: 'Dropout', detail: '(p=0.5)' },
  { label: 'Dropout2d', detail: '(p=0.5)' },
  { label: 'Flatten', detail: '()' },
  { label: 'Embedding', detail: '(num_embeddings, embedding_dim)' },
  { label: 'MultiheadAttention', detail: '(embed_dim, num_heads)' },
  { label: 'RNN', detail: '(input_size, hidden_size, num_layers=1)' },
  { label: 'LSTM', detail: '(input_size, hidden_size, num_layers=1)' },
  { label: 'GRU', detail: '(input_size, hidden_size, num_layers=1)' },
  { label: 'PixelShuffle', detail: '(upscale_factor)' },
  { label: 'Upsample', detail: '(size=None, scale_factor=None, mode="nearest")' },
];

interface EditorPaneProps {
  code: string;
  onChange: (val: string) => void;
  onRun?: () => void;
  errorLine?: number;
  highlightLine?: number | null;
  onCursorChange?: (line: number) => void;
}

type CompletionModel = {
  getLineContent: (lineNumber: number) => string;
};

type CompletionPosition = {
  lineNumber: number;
  column: number;
};

const EditorPane: React.FC<EditorPaneProps> = ({
  code,
  onChange,
  onRun,
  errorLine,
  highlightLine,
  onCursorChange,
}) => {
  const language = useStore((s) => s.language);
  const t = getStrings(language);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const errorDecRef = useRef<string[]>([]);
  const highlightDecRef = useRef<string[]>([]);
  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;

  const handleEditorDidMount: OnMount = (editor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    editor.onDidChangeCursorPosition((e: { position: { lineNumber: number } }) => {
      onCursorChange?.(e.position.lineNumber);
    });

    // Ctrl+Enter / Cmd+Enter → run visualization
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => onRunRef.current?.(),
    );

    // torchstub.nn IntelliSense: suggest nn.* when typing nn.
    monaco.languages.registerCompletionItemProvider('python', {
      triggerCharacters: ['.'],
      provideCompletionItems: (model: CompletionModel, position: CompletionPosition) => {
        const lineContent = model.getLineContent(position.lineNumber);
        const beforeCursor = lineContent.slice(0, position.column - 1).trimEnd();
        if (!/nn\.?$/.test(beforeCursor)) return { suggestions: [] };
        const suggestions = NN_COMPLETIONS.map(({ label, detail }) => ({
          label,
          kind: monaco.languages.CompletionItemKind.Class,
          detail: label === 'Module' ? t.editor.completionModuleDetail : detail,
          insertText: label,
        }));
        return { suggestions };
      },
    });

    setTimeout(() => editor.layout(), 50);
  };

  // Error line decoration (red)
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;
    const editor = editorRef.current;
    const monaco = monacoRef.current;

    if (errorLine && errorLine > 0) {
      errorDecRef.current = editor.deltaDecorations(errorDecRef.current, [
        {
          range: new monaco.Range(errorLine, 1, errorLine, 1),
          options: {
            isWholeLine: true,
            className: 'bg-red-500/20 border-l-2 border-red-500',
            inlineClassName: 'text-red-200',
          },
        },
      ]);
      editor.revealLineInCenter(errorLine);
    } else {
      errorDecRef.current = editor.deltaDecorations(errorDecRef.current, []);
    }
  }, [errorLine]);

  // Hover-highlight decoration (blue, from canvas hover)
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;
    const editor = editorRef.current;
    const monaco = monacoRef.current;

    if (highlightLine && highlightLine > 0) {
      highlightDecRef.current = editor.deltaDecorations(highlightDecRef.current, [
        {
          range: new monaco.Range(highlightLine, 1, highlightLine, 1),
          options: {
            isWholeLine: true,
            className: 'bg-blue-500/15 border-l-2 border-blue-500',
          },
        },
      ]);
      editor.revealLineInCenter(highlightLine);
    } else {
      highlightDecRef.current = editor.deltaDecorations(highlightDecRef.current, []);
    }
  }, [highlightLine]);

  return (
    <div className="absolute inset-0">
      <Editor
        height="100%"
        width="100%"
        theme="vs-dark"
        defaultLanguage="python"
        value={code}
        onChange={(val) => onChange(val || '')}
        onMount={handleEditorDidMount}
        loading={<div className="text-zinc-500 text-xs p-4">{t.editor.loading}</div>}
        options={{
          minimap: { enabled: false },
          fontSize: 12,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontLigatures: true,
          scrollBeyondLastLine: false,
          padding: { top: 12, bottom: 12 },
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          lineHeight: 20,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default EditorPane;

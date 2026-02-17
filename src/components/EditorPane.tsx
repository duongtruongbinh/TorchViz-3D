import React, { useEffect, useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';

interface EditorPaneProps {
  code: string;
  onChange: (val: string) => void;
  onRun?: () => void;
  errorLine?: number;
  highlightLine?: number | null;
  onCursorChange?: (line: number) => void;
}

const EditorPane: React.FC<EditorPaneProps> = ({
  code,
  onChange,
  onRun,
  errorLine,
  highlightLine,
  onCursorChange,
}) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const errorDecRef = useRef<string[]>([]);
  const highlightDecRef = useRef<string[]>([]);
  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    editor.onDidChangeCursorPosition((e: any) => {
      onCursorChange?.(e.position.lineNumber);
    });

    // Ctrl+Enter / Cmd+Enter → run visualization
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => onRunRef.current?.(),
    );

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
        loading={
          <div className="text-zinc-500 text-xs p-4">Loading Editor...</div>
        }
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

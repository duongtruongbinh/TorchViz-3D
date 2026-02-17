import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import EditorPane from './src/components/EditorPane';
import Canvas3D from './src/components/Canvas3D';
import Inspector from './src/components/Inspector';
import BottomTabs from './src/components/BottomTabs';
import ExportSvgModal from './src/components/ExportSvgModal';
import HelpModal from './src/components/HelpModal';
import { IRGraph, LayoutData, initCollapsedIds, findNodeByLine } from './src/lib/irTypes';
import { computeLayout } from './src/lib/layout';
import { createWorker } from './src/workers/pyodideWorker';

import lenetCode from './src/templates/lenet5';
import resnetCode from './src/templates/mini_resnet';
import vitCode from './src/templates/mini_vit';

const TEMPLATES = {
  lenet: { name: 'LeNet-5 (CNN)', code: lenetCode, shape: [1, 1, 32, 32] },
  resnet: { name: 'Mini-ResNet', code: resnetCode, shape: [1, 3, 32, 32] },
  vit: { name: 'Mini-ViT', code: vitCode, shape: [1, 3, 32, 32] },
};

let nextRequestId = 0;

export default function App() {
  const [activeTemplate, setActiveTemplate] = useState('lenet');
  const [code, setCode] = useState(TEMPLATES.lenet.code.trim());
  const [inputShape, setInputShape] = useState(TEMPLATES.lenet.shape);

  const [ir, setIr] = useState<IRGraph | null>(null);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [criticalError, setCriticalError] = useState<string | null>(null);

  const [isExportOpen, setExportOpen] = useState(false);
  const [isHelpOpen, setHelpOpen] = useState(false);

  // Bi-directional highlighting + selection
  const [highlightLine, setHighlightLine] = useState<number | null>(null);
  const [highlightNodeId, setHighlightNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Resize state
  const [leftWidth, setLeftWidth] = useState(400);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const workerRef = useRef<Worker | null>(null);
  const activeRequestIdRef = useRef<number>(-1);

  // --- Layout (memoised from IR + collapsed set) ---
  const layout = useMemo<LayoutData | null>(() => {
    if (!ir) return null;
    try {
      return computeLayout(ir, collapsedIds);
    } catch (e) {
      console.error('Layout computation failed:', e);
      return null;
    }
  }, [ir, collapsedIds]);

  // --- Resize logic ---
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      if (e.clientX > 200 && e.clientX < 800) setLeftWidth(e.clientX);
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // --- Worker setup ---
  useEffect(() => {
    try {
      workerRef.current = createWorker();
      workerRef.current.onmessage = (e) => {
        const { type, data, error: err, requestId } = e.data;
        if (requestId !== undefined && requestId !== activeRequestIdRef.current) return;

        setLoading(false);
        if (type === 'success' || type === 'partial') {
          setIr(data);
          setCollapsedIds(initCollapsedIds(data));
          setError(type === 'partial' ? (data.error || err) : null);
          setSelectedNodeId(null);
        } else {
          setError(err);
        }
      };
      workerRef.current.onerror = (err) => {
        setLoading(false);
        console.error('Worker error:', err);
        setCriticalError('Python Runtime Error. Check console/network.');
      };
    } catch (err: any) {
      setCriticalError(`Init Error: ${err.message}`);
    }
    return () => workerRef.current?.terminate();
  }, []);

  // --- Manual run ---
  const handleRun = useCallback(() => {
    if (!workerRef.current || criticalError) return;
    const id = ++nextRequestId;
    activeRequestIdRef.current = id;
    setLoading(true);
    setError(null);
    workerRef.current.postMessage({
      code: code.trim(),
      inputShape,
      requestId: id,
    });
  }, [code, inputShape, criticalError]);

  // --- Template change (instant run) ---
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value;
    const t = TEMPLATES[key as keyof typeof TEMPLATES];
    setActiveTemplate(key);
    setCode(t.code.trim());
    setInputShape(t.shape);
    setIr(null);
    setError(null);
    setSelectedNodeId(null);
    if (workerRef.current) {
      const id = ++nextRequestId;
      activeRequestIdRef.current = id;
      setLoading(true);
      workerRef.current.postMessage({
        code: t.code.trim(),
        inputShape: t.shape,
        requestId: id,
      });
    }
  };

  const updateShape = (idx: number, val: number) => {
    const s = [...inputShape];
    s[idx] = val;
    setInputShape(s);
  };

  // --- Collapse toggle ---
  const handleToggleCollapse = useCallback((nodeId: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }, []);

  // --- Bi-directional highlighting ---
  const handleHoverNode = useCallback((lineno: number | null) => {
    setHighlightLine(lineno);
  }, []);

  const handleCursorChange = useCallback(
    (line: number) => {
      if (!ir) { setHighlightNodeId(null); return; }
      const found = findNodeByLine(ir.nodes, line);
      setHighlightNodeId(found?.id ?? null);
    },
    [ir],
  );

  // --- Node click (from 3D canvas) → select + highlight ---
  const handleClickNode = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
    setHighlightNodeId(nodeId);
  }, []);

  // --- Tree selection (from Inspector) → select + highlight in 3D ---
  const handleSelectNode = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
    setHighlightNodeId(nodeId);
  }, []);

  // --- Tree hover (from Inspector) → temporary highlight in 3D ---
  const handleHighlightNode = useCallback((nodeId: string | null) => {
    setHighlightNodeId(nodeId);
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 text-zinc-300 overflow-hidden min-w-[1024px]">
      {/* --- Header --- */}
      <header className="h-12 bg-zinc-900 border-b border-zinc-800 flex items-center px-5 justify-between shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 select-none group cursor-pointer">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
              <span className="text-white font-bold text-xs">T</span>
            </div>
            <span className="font-semibold text-zinc-100 tracking-tight">TorchViz 3D</span>
          </div>

          <div className="h-4 w-px bg-zinc-800 mx-2" />

          <div className="flex items-center gap-4">
            <div className="flex flex-col justify-center">
              <label className="text-[9px] uppercase font-bold text-zinc-500 leading-none mb-1 tracking-wider">
                Template
              </label>
              <select
                className="bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-xs text-zinc-200 rounded px-2 py-0.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-colors cursor-pointer"
                value={activeTemplate}
                onChange={handleTemplateChange}
              >
                {Object.entries(TEMPLATES).map(([k, t]) => (
                  <option key={k} value={k}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col justify-center">
              <label className="text-[9px] uppercase font-bold text-zinc-500 leading-none mb-1 tracking-wider">
                Input Shape
              </label>
              <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded px-1 group hover:border-zinc-600 transition-colors">
                {['B', 'C', 'H', 'W'].map((label, i) => (
                  <div key={label} className="flex items-center">
                    <span className="text-[10px] text-zinc-500 px-1 select-none">{label}</span>
                    <input
                      type="number"
                      className="w-10 bg-transparent text-center text-xs text-white focus:outline-none py-0.5 font-mono"
                      value={inputShape[i]}
                      onChange={(e) => updateShape(i, parseInt(e.target.value) || 1)}
                    />
                    {i < 3 && <span className="text-zinc-600 text-[10px] select-none">×</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={loading || !!criticalError}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-md text-xs font-semibold shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/50 hover:border-blue-400"
          >
            {loading ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.344-5.891a1.5 1.5 0 000-2.538L6.3 2.841z" />
              </svg>
            )}
            {loading ? 'Running...' : 'Visualize'}
            {!loading && (
              <kbd className="hidden sm:inline-flex text-[9px] font-mono bg-blue-700/60 px-1 py-0.5 rounded text-blue-200/80 border border-blue-500/30 ml-0.5">
                {navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}↵
              </kbd>
            )}
          </button>

          <button
            onClick={() => setExportOpen(true)}
            disabled={!layout}
            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-300 px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export SVG
          </button>

          <button
            onClick={() => setHelpOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-md bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-400 hover:text-zinc-200 text-sm font-bold transition-colors"
            title="Help"
          >
            ?
          </button>
        </div>
      </header>

      {/* --- Main Workspace --- */}
      <div className="flex-1 flex overflow-hidden relative" ref={containerRef}>
        {/* Left Pane: Editor */}
        <div
          style={{ width: leftWidth }}
          className="flex flex-col border-r border-zinc-800 bg-zinc-900 min-w-[200px] max-w-[800px] shrink-0 h-full"
        >
          <div className="h-8 bg-zinc-900 border-b border-zinc-800 flex items-center px-3 justify-between shrink-0 select-none">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.113 3.807.625a4.406 4.406 0 011.822 1.822c.512 1.024.625 1.377.625 3.807 0 2.43-.113 2.784-.625 3.807a4.406 4.406 0 01-1.822 1.822c-1.024.512-1.377.625-3.807.625-2.43 0-2.784-.113-3.807-.625a4.406 4.406 0 01-1.822-1.822c-.512-1.024-.625-1.377-.625-3.807 0-2.43.113-2.784.625-3.807a4.406 4.406 0 011.822-1.822c1.024-.512 1.377-.625 3.807-.625zM9.056 4.508a.75.75 0 00-1.083.456l-1.37 4.426-4.593.42a.75.75 0 00-.184 1.445l4.225 1.545 1.487 4.39a.75.75 0 001.42 0l1.487-4.39 4.225-1.545a.75.75 0 00-.184-1.445l-4.593-.42-1.37-4.426a.75.75 0 00-.466-.456z"
                  clipRule="evenodd"
                />
              </svg>
              Editor
            </span>
            <span className="text-[9px] font-mono text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700/50">
              model.py
            </span>
          </div>
          <div className="flex-1 relative w-full h-full overflow-hidden">
            <EditorPane
              code={code}
              onChange={setCode}
              onRun={handleRun}
              errorLine={error?.lineno}
              highlightLine={highlightLine}
              onCursorChange={handleCursorChange}
            />
          </div>
        </div>

        {/* Resizer Handle */}
        <div
          className={`w-1 hover:w-1.5 bg-zinc-900 border-l border-zinc-800 hover:bg-blue-600 transition-colors cursor-col-resize z-20 flex items-center justify-center shrink-0 ${isDragging ? 'bg-blue-600 w-1.5' : ''}`}
          onMouseDown={handleMouseDown}
        >
          <div className="h-8 w-0.5 bg-zinc-700 rounded-full" />
        </div>

        {/* Center Pane: Canvas + Bottom Terminal */}
        <div className="flex flex-col min-w-0 bg-zinc-950 relative h-full grow">
          <div className="flex-1 relative w-full min-h-0 bg-gradient-to-b from-zinc-950 to-[#0c0c0e]">
            <div className="absolute inset-0 overflow-hidden">
              <Canvas3D
                layout={layout}
                loading={loading}
                error={error}
                highlightNodeId={highlightNodeId}
                onToggleCollapse={handleToggleCollapse}
                onHoverNode={handleHoverNode}
                onClickNode={handleClickNode}
              />
            </div>

            {criticalError && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-900/90 text-white px-4 py-2 rounded shadow-lg text-xs border border-red-700 z-50 whitespace-nowrap backdrop-blur-md">
                {criticalError}
              </div>
            )}
          </div>

          <div className="h-32 border-t border-zinc-800 bg-zinc-900 flex flex-col shrink-0">
            <BottomTabs ir={ir} error={error} />
          </div>
        </div>

        {/* Right Pane: Model Explorer */}
        <div className="w-[260px] flex flex-col border-l border-zinc-800 bg-zinc-900 shrink-0 h-full">
          <Inspector
            ir={ir}
            selectedNodeId={selectedNodeId}
            highlightNodeId={highlightNodeId}
            onSelectNode={handleSelectNode}
            onHighlightNode={handleHighlightNode}
          />
        </div>
      </div>

      <ExportSvgModal isOpen={isExportOpen} onClose={() => setExportOpen(false)} layout={layout} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}

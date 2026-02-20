import React, { useState, useEffect, useRef, useCallback } from 'react';
import EditorPane from './src/components/EditorPane';
import Canvas3D from './src/components/Canvas3D';
import Inspector from './src/components/Inspector';
import BottomTabs from './src/components/BottomTabs';
import ExportSvgModal from './src/components/ExportSvgModal';
import Header from './src/components/Header';
import { hasSeenTour } from './src/components/OnboardingTour';
import { findNodeByLine } from './src/lib/irTypes';
import { useStore } from './src/store/useStore';
import { workerService } from './src/lib/workerService';

export default function App() {
  const code = useStore(s => s.code);
  const ir = useStore(s => s.ir);
  const loading = useStore(s => s.loading);
  const error = useStore(s => s.error);
  const criticalError = useStore(s => s.criticalError);
  const layout = useStore(s => s.layout);
  const highlightLine = useStore(s => s.highlightLine);
  const highlightNodeId = useStore(s => s.highlightNodeId);
  const selectedNodeId = useStore(s => s.selectedNodeId);

  const setCode = useStore(s => s.setCode);
  const toggleCollapse = useStore(s => s.toggleCollapse);
  const setHighlightLine = useStore(s => s.setHighlightLine);
  const setHighlightNodeId = useStore(s => s.setHighlightNodeId);
  const setSelectedNodeId = useStore(s => s.setSelectedNodeId);

  const [isExportOpen, setExportOpen] = useState(false);
  const [isHelpOpen, setHelpOpen] = useState(false);
  const [isTourOpen, setTourOpen] = useState(false);

  const [leftWidth, setLeftWidth] = useState(400);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasSeenTour()) setTourOpen(true);
    workerService.init();
    return () => workerService.terminate();
  }, []);

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

  const handleCursorChange = useCallback(
    (line: number) => {
      if (!ir) { setHighlightNodeId(null); return; }
      const found = findNodeByLine(ir.nodes, line);
      setHighlightNodeId(found?.id ?? null);
    },
    [ir, setHighlightNodeId],
  );

  const handleSelectNode = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
    setHighlightNodeId(nodeId);
  }, [setSelectedNodeId, setHighlightNodeId]);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden min-w-[1024px]">
      <Header
        onExportSvg={() => setExportOpen(true)}
        isTourOpen={isTourOpen}
        setTourOpen={setTourOpen}
        isHelpOpen={isHelpOpen}
        setHelpOpen={setHelpOpen}
      />

      {/* --- Main Workspace --- */}
      <div className="flex-1 flex overflow-hidden relative" ref={containerRef}>
        {/* Left Pane: Editor */}
        <div
          data-tour="editor"
          style={{ width: leftWidth }}
          className="flex flex-col border-r border-[var(--border)] bg-[var(--surface)] glass-panel rounded-r-2xl border-y-0 border-l-0 min-w-[200px] max-w-[800px] shrink-0 h-[calc(100%-16px)] my-2 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.3)] z-10 overflow-hidden"
        >
          <div className="h-10 bg-[var(--surface-elevated)] border-b border-[var(--border-subtle)] flex items-center px-4 justify-between shrink-0 select-none">
            <span className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider flex items-center gap-2">
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
              onRun={() => workerService.run()}
              errorLine={error?.lineno}
              highlightLine={highlightLine}
              onCursorChange={handleCursorChange}
            />
          </div>
        </div>

        {/* Resizer Handle */}
        <div
          className={`w-1 hover:w-1.5 transition-colors cursor-col-resize z-20 flex items-center justify-center shrink-0 ${isDragging ? 'bg-[var(--accent)] w-1.5' : 'bg-transparent'}`}
          onMouseDown={handleMouseDown}
        >
          <div className="h-8 w-1 bg-[var(--border)] rounded-full hover:bg-[var(--text-muted)] transition-colors" />
        </div>

        {/* Center Pane: Canvas + Bottom Terminal */}
        <div data-tour="canvas" className="flex flex-col min-w-0 relative h-full grow">
          <div className="flex-1 relative w-full min-h-0">
            <div className="absolute inset-0 overflow-hidden" data-torchviz-canvas-container>
              <Canvas3D
                layout={layout}
                loading={loading}
                error={error}
                highlightNodeId={highlightNodeId}
                onToggleCollapse={toggleCollapse}
                onHoverNode={setHighlightLine}
                onClickNode={handleSelectNode}
              />
            </div>

            {criticalError && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-900/90 text-white px-4 py-2 rounded shadow-lg text-xs border border-red-700 z-50 whitespace-nowrap backdrop-blur-md">
                {criticalError}
              </div>
            )}
          </div>

          <div className="h-32 border-t border-[var(--border)] flex flex-col shrink-0 z-10 glass-panel rounded-t-2xl border-x-0 border-b-0 shadow-[0_-8px_30px_rgba(0,0,0,0.3)] mx-2 mt-[-16px] overflow-hidden">
            <BottomTabs ir={ir} error={error} />
          </div>
        </div>

        {/* Right Pane: Model Explorer */}
        <div className="w-[280px] flex flex-col shrink-0 h-full z-10 relative">
          <Inspector
            ir={ir}
            selectedNodeId={selectedNodeId}
            highlightNodeId={highlightNodeId}
            onSelectNode={handleSelectNode}
            onHighlightNode={setHighlightNodeId}
          />
        </div>
      </div>

      <ExportSvgModal isOpen={isExportOpen} onClose={() => setExportOpen(false)} layout={layout} />
    </div>
  );
}

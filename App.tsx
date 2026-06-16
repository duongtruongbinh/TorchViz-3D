import React, { useState, useEffect, useRef, useCallback } from 'react';
const EditorPane = React.lazy(() => import('./src/components/EditorPane'));
import Canvas3D from './src/components/Canvas3D';
import Inspector from './src/components/Inspector';
import BottomTabs from './src/components/BottomTabs';
import ExportSvgModal from './src/components/ExportSvgModal';
import Header from './src/components/Header';
import { hasSeenTour } from './src/components/OnboardingTour';
import { findNodeByLine } from './src/lib/irTypes';
import { useStore } from './src/store/useStore';
import { workerService } from './src/lib/workerService';

type CollapseSide = 'left' | 'right' | 'bottom';

const PanelCollapseButton: React.FC<{
  side: CollapseSide;
  collapsed: boolean;
  onClick: () => void;
  className?: string;
}> = ({ side, collapsed, onClick, className = '' }) => {
  const titles: Record<CollapseSide, string> = {
    left: collapsed ? 'Expand editor panel' : 'Collapse editor panel',
    right: collapsed ? 'Expand explorer panel' : 'Collapse explorer panel',
    bottom: collapsed ? 'Expand terminal panel' : 'Collapse terminal panel',
  };
  const rotation: Record<CollapseSide, string> = {
    left: collapsed ? 'rotate-180' : '',
    right: collapsed ? '' : 'rotate-180',
    bottom: collapsed ? 'rotate-90' : '-rotate-90',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={titles[side]}
      aria-label={titles[side]}
      aria-pressed={collapsed}
      className={`w-7 h-7 flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[#3f3f46] transition-colors ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className={`w-3.5 h-3.5 transition-transform ${rotation[side]}`}
      >
        <path
          fillRule="evenodd"
          d="M12.78 4.22a.75.75 0 0 1 0 1.06L8.06 10l4.72 4.72a.75.75 0 1 1-1.06 1.06l-5.25-5.25a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

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
  const [tourResetViewToken, setTourResetViewToken] = useState(0);

  const [leftWidth, setLeftWidth] = useState(400);
  const [isLeftCollapsed, setLeftCollapsed] = useState(false);
  const [isRightCollapsed, setRightCollapsed] = useState(false);
  const [isBottomCollapsed, setBottomCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasSeenTour()) setTourOpen(true);
    workerService.init();
    return () => workerService.terminate();
  }, []);

  // --- Resize logic ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isTourOpen || isLeftCollapsed) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || isTourOpen || isLeftCollapsed) return;
      if (e.clientX > 200 && e.clientX < 800) setLeftWidth(e.clientX);
    },
    [isDragging, isTourOpen, isLeftCollapsed],
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (isTourOpen && isDragging) {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      setIsDragging(false);
      return;
    }
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
  }, [isTourOpen, isDragging, handleMouseMove, handleMouseUp]);

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

  const resetTourView = useCallback(() => {
    setTourResetViewToken((token) => token + 1);
  }, []);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden min-w-[1024px]">
      <Header
        onExportSvg={() => setExportOpen(true)}
        isTourOpen={isTourOpen}
        setTourOpen={setTourOpen}
        onTourStepChange={resetTourView}
        isHelpOpen={isHelpOpen}
        setHelpOpen={setHelpOpen}
      />

      {/* --- Main Workspace --- */}
      <div className="flex-1 flex overflow-hidden relative" ref={containerRef}>
        {/* Left Pane: Editor */}
        <div
          data-tour="editor"
          style={{ width: isLeftCollapsed ? 44 : leftWidth }}
          className={`flex flex-col border-r border-[var(--border)] bg-[var(--surface)] glass-panel rounded-r-md border-y-0 border-l-0 shrink-0 h-[calc(100%-16px)] my-2 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.3)] z-10 overflow-hidden transition-[width] duration-200 ${isLeftCollapsed ? 'min-w-[44px] max-w-[44px]' : 'min-w-[200px] max-w-[800px]'}`}
        >
          <div className={`h-10 bg-[var(--surface-elevated)] border-b border-[var(--border-subtle)] flex items-center shrink-0 select-none ${isLeftCollapsed ? 'justify-center px-1.5' : 'px-4 justify-between'}`}>
            {!isLeftCollapsed && <span className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.113 3.807.625a4.406 4.406 0 011.822 1.822c.512 1.024.625 1.377.625 3.807 0 2.43-.113 2.784-.625 3.807a4.406 4.406 0 01-1.822 1.822c-1.024.512-1.377.625-3.807.625-2.43 0-2.784-.113-3.807-.625a4.406 4.406 0 01-1.822-1.822c-.512-1.024-.625-1.377-.625-3.807 0-2.43.113-2.784.625-3.807a4.406 4.406 0 011.822-1.822c1.024-.512 1.377-.625 3.807-.625zM9.056 4.508a.75.75 0 00-1.083.456l-1.37 4.426-4.593.42a.75.75 0 00-.184 1.445l4.225 1.545 1.487 4.39a.75.75 0 001.42 0l1.487-4.39 4.225-1.545a.75.75 0 00-.184-1.445l-4.593-.42-1.37-4.426a.75.75 0 00-.466-.456z"
                  clipRule="evenodd"
                />
              </svg>
              Editor
            </span>}
            <div className="flex items-center gap-2">
              {!isLeftCollapsed && <span className="text-[9px] font-mono text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700/50">
                model.py
              </span>}
              <PanelCollapseButton
                side="left"
                collapsed={isLeftCollapsed}
                onClick={() => setLeftCollapsed((v) => !v)}
              />
            </div>
          </div>
          {!isLeftCollapsed && <div className="flex-1 relative w-full h-full overflow-hidden">
            <React.Suspense fallback={<div className="text-zinc-500 text-xs p-4 h-full flex items-center justify-center">Loading Editor module...</div>}>
              <EditorPane
                code={code}
                onChange={setCode}
                onRun={() => workerService.run()}
                errorLine={error?.lineno}
                highlightLine={highlightLine}
                onCursorChange={handleCursorChange}
              />
            </React.Suspense>
          </div>}
        </div>

        {/* Resizer Handle */}
        <div
          className={`w-1 transition-colors z-20 flex items-center justify-center shrink-0 ${isTourOpen || isLeftCollapsed ? 'cursor-default opacity-40' : 'cursor-col-resize hover:w-1.5'} ${isDragging ? 'bg-[var(--accent)] w-1.5' : 'bg-transparent'}`}
          onMouseDown={handleMouseDown}
          role="separator"
          aria-orientation="vertical"
          aria-disabled={isTourOpen || isLeftCollapsed}
          tabIndex={0}
          onKeyDown={(e) => {
            if (isTourOpen || isLeftCollapsed) return;
            if (e.key === 'ArrowLeft') setLeftWidth(w => Math.max(200, w - 10));
            if (e.key === 'ArrowRight') setLeftWidth(w => Math.min(800, w + 10));
          }}
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
                resetViewToken={tourResetViewToken}
                resetViewDisabled={isTourOpen}
              />
            </div>

            {criticalError && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-900/90 text-white px-4 py-2 rounded shadow-lg text-xs border border-red-700 z-50 whitespace-nowrap backdrop-blur-md">
                {criticalError}
              </div>
            )}
          </div>

          <div className={`${isBottomCollapsed ? 'h-10' : 'h-32'} border-t border-[var(--border)] flex flex-col shrink-0 z-10 glass-panel rounded-t-md border-x-0 border-b-0 shadow-[0_-8px_30px_rgba(0,0,0,0.3)] mx-2 mt-[-16px] overflow-hidden transition-[height] duration-200`}>
            <BottomTabs
              ir={ir}
              error={error}
              collapsed={isBottomCollapsed}
              headerAction={(
                <PanelCollapseButton
                  side="bottom"
                  collapsed={isBottomCollapsed}
                  onClick={() => setBottomCollapsed((v) => !v)}
                />
              )}
            />
          </div>
        </div>

        {/* Right Pane: Model Explorer */}
        <div className={`${isRightCollapsed ? 'w-11' : 'w-[280px]'} flex flex-col shrink-0 h-full z-10 relative transition-[width] duration-200`}>
          {isRightCollapsed ? (
            <div className="h-[calc(100%-16px)] ml-2 my-2 bg-[var(--surface)] glass-panel rounded-l-md border-y-0 border-r-0 shadow-2xl flex items-start justify-center pt-1.5">
              <PanelCollapseButton
                side="right"
                collapsed={isRightCollapsed}
                onClick={() => setRightCollapsed(false)}
              />
            </div>
          ) : (
            <Inspector
              ir={ir}
              selectedNodeId={selectedNodeId}
              highlightNodeId={highlightNodeId}
              onSelectNode={handleSelectNode}
              onHighlightNode={setHighlightNodeId}
              headerAction={(
                <PanelCollapseButton
                  side="right"
                  collapsed={isRightCollapsed}
                  onClick={() => setRightCollapsed(true)}
                />
              )}
            />
          )}
        </div>
      </div>

      <ExportSvgModal isOpen={isExportOpen} onClose={() => setExportOpen(false)} layout={layout} />
    </div>
  );
}

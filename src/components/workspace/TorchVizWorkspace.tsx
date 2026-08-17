import React, { useState, useEffect, useRef, useCallback } from 'react';
import Canvas3D from '../canvas/Canvas3D';
import Inspector from '../Inspector';
import BottomTabs from '../BottomTabs';
import ExportSvgModal from '../ExportSvgModal';
import ParamFormulaPopup from '../ParamFormulaPopup';
import Header from '../Header';
import { hasSeenTour, TERMINAL_ERROR_TOUR_STEP, TERMINAL_SUCCESS_TOUR_STEP } from '../OnboardingTour';
import { shouldCloseLayerInsightForTourStep } from '../../lib/onboardingTourSteps';
import { findNodeByLine, type IRNode } from '../../lib/irTypes';
import { useStore } from '../../store/useStore';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { workerService } from '../../lib/workerService';
import { getStrings, type LocalizedStrings } from '../../lib/localization';

const EditorPane = React.lazy(() => import('../EditorPane'));

type CollapseSide = 'left' | 'right' | 'bottom';

const PanelCollapseButton: React.FC<{
  side: CollapseSide;
  collapsed: boolean;
  onClick: () => void;
  t: LocalizedStrings;
  className?: string;
}> = ({ side, collapsed, onClick, t, className = '' }) => {
  const titles: Record<CollapseSide, string> = {
    left: collapsed ? t.app.collapse.expandEditorPanel : t.app.collapse.collapseEditorPanel,
    right: collapsed ? t.app.collapse.expandExplorerPanel : t.app.collapse.collapseExplorerPanel,
    bottom: collapsed ? t.app.collapse.expandTerminalPanel : t.app.collapse.collapseTerminalPanel,
  };
  const rotation: Record<CollapseSide, string> = {
    left: collapsed ? 'rotate-180' : '',
    right: collapsed ? '' : 'rotate-180',
    bottom: collapsed ? 'rotate-90' : '-rotate-90',
  };
  const isRightPanelButton = side === 'right';

  return (
    <button
      type="button"
      onClick={onClick}
      title={titles[side]}
      aria-label={titles[side]}
      aria-pressed={collapsed}
      className={`w-7 h-7 flex items-center justify-center rounded-md bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[#3f3f46] transition-colors duration-200 ${className}`}
    >
      {isRightPanelButton ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <path d="M14 5v14" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-3.5 h-3.5 transition-transform duration-300 ease-out ${rotation[side]}`}
        >
          <path
            fillRule="evenodd"
            d="M12.78 4.22a.75.75 0 0 1 0 1.06L8.06 10l4.72 4.72a.75.75 0 1 1-1.06 1.06l-5.25-5.25a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
};

type TorchVizWorkspaceProps = {
  onBackToLanding: () => void;
};

export default function TorchVizWorkspace({ onBackToLanding }: TorchVizWorkspaceProps) {
  const code = useStore(s => s.code);
  const language = usePreferencesStore(s => s.language);
  const ir = useStore(s => s.ir);
  const loading = useStore(s => s.loading);
  const error = useStore(s => s.error);
  const criticalError = useStore(s => s.criticalError);
  const layout = useStore(s => s.layout);
  const graphRevision = useStore(s => s.graphRevision);
  const layoutRevision = useStore(s => s.layoutRevision);
  const highlightLine = useStore(s => s.highlightLine);
  const highlightNodeId = useStore(s => s.highlightNodeId);
  const selectedNodeId = useStore(s => s.selectedNodeId);

  const setCode = useStore(s => s.setCode);
  const toggleCollapse = useStore(s => s.toggleCollapse);
  const expandAll = useStore(s => s.expandAll);
  const collapseAll = useStore(s => s.collapseAll);
  const setHighlightLine = useStore(s => s.setHighlightLine);
  const setHighlightNodeId = useStore(s => s.setHighlightNodeId);
  const setSelectedNodeId = useStore(s => s.setSelectedNodeId);

  const [isExportOpen, setExportOpen] = useState(false);
  const [isHelpOpen, setHelpOpen] = useState(false);
  const [isTourOpen, setTourOpen] = useState(false);
  const [demoModeEnabled, setDemoModeEnabled] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState<string | null>(null);
  const [layerInsightNode, setLayerInsightNode] = useState<IRNode | null>(null);
  const [tourResetViewToken, setTourResetViewToken] = useState(0);
  const t = getStrings(language);

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
    if ((isTourOpen || isLeftCollapsed) && isDragging) {
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
  }, [isTourOpen, isLeftCollapsed, isDragging, handleMouseMove, handleMouseUp]);

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

  const handleSetTourOpen = useCallback((open: boolean) => {
    setTourOpen(open);
    if (!open) setCurrentTourStep(null);
  }, []);

  const handleTourStepChange = useCallback((stepTitle: string | null) => {
    setCurrentTourStep(stepTitle);
    if (shouldCloseLayerInsightForTourStep(stepTitle)) setLayerInsightNode(null);
    if (stepTitle) setTourResetViewToken((token) => token + 1);
    if (stepTitle === TERMINAL_SUCCESS_TOUR_STEP || stepTitle === TERMINAL_ERROR_TOUR_STEP) setBottomCollapsed(false);
  }, []);

  const isTerminalSuccessTourStep = isTourOpen && currentTourStep === TERMINAL_SUCCESS_TOUR_STEP;
  const isTerminalErrorTourStep = isTourOpen && currentTourStep === TERMINAL_ERROR_TOUR_STEP;

  const terminalDemoSuccessParams = isTerminalSuccessTourStep
    ? 61706
    : null;

  const terminalDemoError = isTerminalErrorTourStep
    ? {
      lineno: 12,
      message: t.app.demoErrorMessage,
      hint: t.app.demoErrorHint,
    }
    : null;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden min-w-[1024px]">
      <Header
        onBackToLanding={onBackToLanding}
        onExportSvg={() => setExportOpen(true)}
        isTourOpen={isTourOpen}
        setTourOpen={handleSetTourOpen}
        onTourStepChange={handleTourStepChange}
        isHelpOpen={isHelpOpen}
        setHelpOpen={setHelpOpen}
        demoModeEnabled={demoModeEnabled}
        onDemoModeChange={setDemoModeEnabled}
      />

      <div className="flex-1 flex overflow-hidden relative" ref={containerRef}>
        <div
          data-tour="editor"
          style={{ width: isLeftCollapsed ? 44 : leftWidth }}
          className={`flex flex-col border-r border-[var(--border)] bg-[var(--surface)] glass-panel rounded-r-md border-y-0 border-l-0 shrink-0 h-[calc(100%-16px)] my-2 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.3)] z-10 overflow-hidden transition-[width,min-width,max-width] duration-300 ease-out ${isLeftCollapsed ? 'min-w-[44px] max-w-[44px]' : 'min-w-[200px] max-w-[800px]'}`}
        >
          <div className={`h-10 bg-[var(--surface-elevated)] border-b border-[var(--border-subtle)] flex items-center shrink-0 select-none ${isLeftCollapsed ? 'justify-center px-1.5' : 'px-4 justify-between'}`}>
            <span className={`text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider flex items-center gap-2 overflow-hidden whitespace-nowrap transition-all duration-200 ${isLeftCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.113 3.807.625a4.406 4.406 0 011.822 1.822c.512 1.024.625 1.377.625 3.807 0 2.43-.113 2.784-.625 3.807a4.406 4.406 0 01-1.822 1.822c-1.024.512-1.377.625-3.807.625-2.43 0-2.784-.113-3.807-.625a4.406 4.406 0 01-1.822-1.822c-.512-1.024-.625-1.377-.625-3.807 0-2.43.113-2.784.625-3.807a4.406 4.406 0 011.822-1.822c1.024-.512 1.377-.625 3.807-.625zM9.056 4.508a.75.75 0 00-1.083.456l-1.37 4.426-4.593.42a.75.75 0 00-.184 1.445l4.225 1.545 1.487 4.39a.75.75 0 001.42 0l1.487-4.39 4.225-1.545a.75.75 0 00-.184-1.445l-4.593-.42-1.37-4.426a.75.75 0 00-.466-.456z"
                  clipRule="evenodd"
                />
              </svg>
              {t.app.editor}
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-mono text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700/50 overflow-hidden whitespace-nowrap transition-all duration-200 ${isLeftCollapsed ? 'w-0 opacity-0 px-0 border-transparent' : 'w-auto opacity-100'}`}>
                model.py
              </span>
              <PanelCollapseButton
                side="left"
                collapsed={isLeftCollapsed}
                onClick={() => setLeftCollapsed((v) => !v)}
                t={t}
              />
            </div>
          </div>
          <div className={`flex-1 relative w-full h-full overflow-hidden transition-opacity duration-200 ${isLeftCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <React.Suspense fallback={<div className="text-zinc-500 text-xs p-4 h-full flex items-center justify-center">{t.app.loadingEditorModule}</div>}>
              <EditorPane
                code={code}
                onChange={setCode}
                onRun={() => workerService.run()}
                errorLine={error?.lineno}
                highlightLine={highlightLine}
                onCursorChange={handleCursorChange}
              />
            </React.Suspense>
          </div>
        </div>

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

        <div data-tour="canvas" className="flex flex-col min-w-0 relative h-full grow">
          <div data-tour="canvas-surface" className="flex-1 relative w-full min-h-0">
            <div className="absolute inset-0 overflow-hidden z-0" data-torchviz-canvas-container>
              <Canvas3D
                layout={layout}
                graphRevision={graphRevision}
                layoutRevision={layoutRevision}
                loading={loading}
                error={error}
                highlightNodeId={highlightNodeId}
                selectedNodeId={selectedNodeId}
                onToggleCollapse={toggleCollapse}
                onExpandAll={expandAll}
                onCollapseAll={collapseAll}
                onHoverNode={setHighlightLine}
                onClickNode={handleSelectNode}
                onOpenLayerInsight={setLayerInsightNode}
                resetViewToken={tourResetViewToken}
                demoModeEnabled={demoModeEnabled}
              />
            </div>

            {criticalError && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-900/90 text-white px-4 py-2 rounded shadow-lg text-xs border border-red-700 z-50 whitespace-nowrap backdrop-blur-md">
                {criticalError}
              </div>
            )}
          </div>

          <div data-tour="terminal" className={`${isBottomCollapsed ? 'h-10' : 'h-32'} border-t border-[var(--border)] flex flex-col shrink-0 z-10 glass-panel rounded-t-md border-x-0 border-b-0 shadow-[0_-8px_30px_rgba(0,0,0,0.3)] mx-2 mb-2 mt-[-16px] overflow-hidden transition-[height] duration-300 ease-out`}>
            <BottomTabs
              ir={ir}
              error={isTerminalSuccessTourStep ? null : (terminalDemoError ?? error)}
              collapsed={isBottomCollapsed}
              demoSuccessParams={terminalDemoSuccessParams}
              headerAction={(
                <PanelCollapseButton
                  side="bottom"
                  collapsed={isBottomCollapsed}
                  onClick={() => setBottomCollapsed((v) => !v)}
                  t={t}
                />
              )}
            />
          </div>
        </div>

        <div data-tour="explorer" className={`${isRightCollapsed ? 'w-11' : 'w-[280px]'} flex flex-col shrink-0 h-full z-10 relative overflow-hidden transition-[width] duration-300 ease-out`}>
          <div className={`absolute inset-0 transition-opacity duration-200 ${isRightCollapsed ? 'opacity-100 delay-150' : 'opacity-0 pointer-events-none'}`}>
            <div className="h-[calc(100%-16px)] ml-2 my-2 bg-[var(--surface)] glass-panel rounded-l-md border-y-0 border-r-0 shadow-2xl flex items-start justify-center pt-1.5">
              <PanelCollapseButton
                side="right"
                collapsed={isRightCollapsed}
                onClick={() => setRightCollapsed(false)}
                t={t}
              />
            </div>
          </div>
          <div className={`w-[280px] h-full transition-[opacity,transform] duration-200 ease-out ${isRightCollapsed ? 'opacity-0 translate-x-2 pointer-events-none' : 'opacity-100 translate-x-0 delay-75'}`}>
            <Inspector
              ir={ir}
              selectedNodeId={selectedNodeId}
              highlightNodeId={highlightNodeId}
              onSelectNode={handleSelectNode}
              onHighlightNode={setHighlightNodeId}
              onOpenLayerInsight={setLayerInsightNode}
              headerAction={(
                <PanelCollapseButton
                  side="right"
                  collapsed={isRightCollapsed}
                  onClick={() => setRightCollapsed(true)}
                  t={t}
                  className="!w-6 !h-6 !bg-transparent hover:!bg-[var(--border-subtle)]"
                />
              )}
            />
          </div>
        </div>
      </div>

      <ExportSvgModal isOpen={isExportOpen} onClose={() => setExportOpen(false)} layout={layout} />
      <ParamFormulaPopup node={layerInsightNode} onClose={() => setLayerInsightNode(null)} />
    </div>
  );
}

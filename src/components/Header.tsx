import React from 'react';
import { useStore, TEMPLATES } from '../store/useStore';
import { workerService, parseShape } from '../lib/workerService';
import OnboardingTour from './OnboardingTour';
import HelpModal from './HelpModal';

interface HeaderProps {
    onExportSvg: () => void;
    isTourOpen: boolean;
    setTourOpen: (v: boolean) => void;
    onTourStepChange?: (stepTitle: string | null) => void;
    isHelpOpen: boolean;
    setHelpOpen: (v: boolean) => void;
}

export default function Header({
    onExportSvg,
    isTourOpen,
    setTourOpen,
    onTourStepChange,
    isHelpOpen,
    setHelpOpen
}: HeaderProps) {
    const activeTemplate = useStore((s) => s.activeTemplate);
    const shapeInput = useStore((s) => s.shapeInput);
    const loading = useStore((s) => s.loading);
    const criticalError = useStore((s) => s.criticalError);
    const layout = useStore((s) => s.layout);

    const setActiveTemplate = useStore((s) => s.setActiveTemplate);
    const setShapeInput = useStore((s) => s.setShapeInput);

    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [buttonAttention, setButtonAttention] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const shapeValid = parseShape(shapeInput) !== null;

    const handleTemplateChange = (templateKey: string) => {
        setActiveTemplate(templateKey);
        setIsDropdownOpen(false);
        workerService.run();
    };

    const handleRun = () => {
        workerService.run();
    };

    const openTour = () => {
        setButtonAttention(false);
        setTourOpen(true);
    };

    const triggerButtonAttention = () => {
        setButtonAttention(true);
        window.setTimeout(() => setButtonAttention(false), 1800);
    };

    return (
        <>
            <header className="h-14 glass-panel border-b-0 border-b-[var(--border)] flex items-center px-5 justify-between shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 select-none group cursor-pointer">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
                            <span className="text-white font-bold text-xs">T</span>
                        </div>
                        <span className="font-semibold text-zinc-100 tracking-tight">TorchViz 3D</span>
                    </div>

                    <div className="h-4 w-px bg-zinc-800 mx-2" />

                    <div className="flex items-center gap-4">
                        <div data-tour="template-picker" className="flex flex-col justify-center relative" ref={dropdownRef}>
                            <label className="text-[9px] uppercase font-bold text-zinc-500 leading-none mb-1 tracking-wider">
                                Template
                            </label>
                            <div
                                className="bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--border-subtle)] text-xs text-zinc-200 rounded px-3 py-1 flex items-center justify-between cursor-pointer w-40 transition-colors shadow-sm"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsDropdownOpen(!isDropdownOpen); }}
                                role="combobox"
                                aria-expanded={isDropdownOpen}
                                tabIndex={0}
                            >
                                <span className="truncate">{TEMPLATES[activeTemplate]?.name || 'Select Template'}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </div>

                            {isDropdownOpen && (
                                <div className="absolute top-[calc(100%+4px)] left-0 w-48 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg shadow-xl shadow-black/80 z-50 overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                                    {Object.entries(TEMPLATES).map(([k, t]) => (
                                        <div
                                            key={k}
                                            className={`px-3 py-2 text-xs cursor-pointer transition-colors flex items-center justify-between ${activeTemplate === k ? 'bg-blue-500/10 text-blue-400 font-medium' : 'text-zinc-300 hover:bg-[var(--surface-elevated)] hover:text-zinc-100'}`}
                                            onClick={() => handleTemplateChange(k)}
                                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTemplateChange(k); }}
                                            role="option"
                                            tabIndex={0}
                                            aria-selected={activeTemplate === k}
                                        >
                                            <span className="truncate">{t.name}</span>
                                            {activeTemplate === k && (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div data-tour="input-shape" className="flex flex-col justify-center">
                            <label className="text-[9px] uppercase font-bold text-zinc-500 leading-none mb-1 tracking-wider">
                                Input Shape
                            </label>
                            <input
                                type="text"
                                placeholder="[1, 3, 224, 224]"
                                className={`w-36 bg-[var(--surface-elevated)] border rounded px-2 py-0.5 text-xs font-mono text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-zinc-600 ${!shapeValid ? 'border-red-600/70' : 'border-[var(--border)] hover:border-zinc-500'
                                    }`}
                                value={shapeInput}
                                onChange={(e) => setShapeInput(e.target.value)}
                                title="JSON array, e.g. [1, 3, 224, 224] or [10, 32, 512] for 2D/3D models"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        data-tour="visualize"
                        onClick={handleRun}
                        disabled={loading || !!criticalError || !shapeValid}
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
                        data-tour="export-svg"
                        onClick={onExportSvg}
                        disabled={!layout}
                        className="bg-[var(--surface-elevated)] hover:bg-[#3f3f46] border border-[var(--border)] text-[var(--text)] px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Export SVG
                    </button>

                    <button
                        onClick={openTour}
                        className={`w-8 h-8 flex items-center justify-center rounded-md bg-[var(--surface-elevated)] hover:bg-[#3f3f46] border border-[var(--border)] text-[var(--text-muted)] hover:text-white text-sm transition-colors ${buttonAttention ? 'tour-button-attention' : ''}`}
                        title="Tour"
                        aria-label="Open tour"
                    >
                        ℹ
                    </button>
                    <button
                        data-tour="help"
                        onClick={() => setHelpOpen(true)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md bg-[var(--surface-elevated)] hover:bg-[#3f3f46] border border-[var(--border)] text-[var(--text-muted)] hover:text-white text-sm font-bold transition-colors ${buttonAttention ? 'tour-button-attention' : ''}`}
                        title="Help"
                    >
                        ?
                    </button>
                </div>
            </header>

            <HelpModal isOpen={isHelpOpen} onClose={() => setHelpOpen(false)} />
            <OnboardingTour
                isOpen={isTourOpen}
                onClose={() => setTourOpen(false)}
                onSkip={triggerButtonAttention}
                onDone={triggerButtonAttention}
                onStepChange={onTourStepChange}
            />
        </>
    );
}

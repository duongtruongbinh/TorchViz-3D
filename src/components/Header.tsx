import React from 'react';
import { ArrowLeftToLine, Check, ChevronDown, CircleQuestionMark, Eye, Info, Languages, Play } from 'lucide-react';
import { useStore, TEMPLATES } from '../store/useStore';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { workerService, parseShape } from '../lib/workerService';
import OnboardingTour from './OnboardingTour';
import HelpModal from './HelpModal';
import { getStrings, type Language } from '../lib/localization';
import { getForwardPassLayoutCompatibility } from './mnist-demo/demoStops';
import type { ForwardPassCompatibility } from '../lib/mnistCompatibility';

interface HeaderProps {
    onBackToLanding?: () => void;
    onExportSvg: () => void;
    isTourOpen: boolean;
    setTourOpen: (v: boolean) => void;
    onTourStepChange?: (stepTitle: string | null) => void;
    isHelpOpen: boolean;
    setHelpOpen: (v: boolean) => void;
    demoModeEnabled: boolean;
    onDemoModeChange: (enabled: boolean) => void;
}

export default function Header({
    onBackToLanding,
    onExportSvg,
    isTourOpen,
    setTourOpen,
    onTourStepChange,
    isHelpOpen,
    setHelpOpen,
    demoModeEnabled,
    onDemoModeChange,
}: HeaderProps) {
    const activeTemplate = useStore((s) => s.activeTemplate);
    const language = usePreferencesStore((s) => s.language);
    const shapeInput = useStore((s) => s.shapeInput);
    const loading = useStore((s) => s.loading);
    const criticalError = useStore((s) => s.criticalError);
    const layout = useStore((s) => s.layout);

    const setActiveTemplate = useStore((s) => s.setActiveTemplate);
    const setLanguage = usePreferencesStore((s) => s.setLanguage);
    const setShapeInput = useStore((s) => s.setShapeInput);
    const t = getStrings(language);

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
    const demoCompatibility = criticalError
        ? ({ ok: false, reason: 'no-layout' } as ForwardPassCompatibility)
        : getForwardPassLayoutCompatibility(layout, loading);
    const demoAvailable = demoCompatibility.ok;
    const demoUnavailableTitle = (() => {
        if (demoCompatibility.ok === false) {
            switch (demoCompatibility.reason) {
                case 'loading':
                    return 'Forward pass unavailable: graph is still loading.';
                case 'no-layout':
                    return 'Forward pass unavailable: visualize a model first.';
                case 'no-stops':
                    return 'Forward pass unavailable: no layers with a known input shape.';
            }
        }
        return t.canvas.demo.mode;
    })();

    React.useEffect(() => {
        if (demoModeEnabled && !demoAvailable) onDemoModeChange(false);
    }, [demoAvailable, demoModeEnabled, onDemoModeChange]);

    return (
        <>
            <header className="h-14 glass-panel border-b-0 border-b-[var(--border)] flex items-center px-5 justify-between shrink-0 z-50">
                <div className="flex items-center gap-4">
                    {onBackToLanding && (
                        <button
                            type="button"
                            onClick={onBackToLanding}
                            className="h-8 flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:bg-[#3f3f46] hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                            title={t.header.backToLanding}
                            aria-label={t.header.backToLanding}
                        >
                            <ArrowLeftToLine className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
                            <span>{t.header.landing}</span>
                        </button>
                    )}
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
                                {t.header.template}
                            </label>
                            <div
                                className="bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--border-subtle)] text-xs text-zinc-200 rounded px-3 py-1 flex items-center justify-between cursor-pointer w-40 transition-colors shadow-sm"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsDropdownOpen(!isDropdownOpen); }}
                                role="combobox"
                                aria-expanded={isDropdownOpen}
                                tabIndex={0}
                            >
                                <span className="truncate">{TEMPLATES[activeTemplate]?.name || t.header.selectTemplate}</span>
                                <ChevronDown className={`h-3.5 w-3.5 text-zinc-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} strokeWidth={1.8} aria-hidden="true" />
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
                                                <Check className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div data-tour="input-shape" className="flex flex-col justify-center">
                            <label className="text-[9px] uppercase font-bold text-zinc-500 leading-none mb-1 tracking-wider">
                                {t.header.inputShape}
                            </label>
                            <input
                                type="text"
                                placeholder="[1, 3, 224, 224]"
                                className={`w-36 bg-[var(--surface-elevated)] border rounded px-2 py-0.5 text-xs font-mono text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-zinc-600 ${!shapeValid ? 'border-red-600/70' : 'border-[var(--border)] hover:border-zinc-500'
                                    }`}
                                value={shapeInput}
                                onChange={(e) => setShapeInput(e.target.value)}
                                title={t.header.inputShapeTitle}
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
                            <Play className="h-3.5 w-3.5 fill-current" strokeWidth={1.8} aria-hidden="true" />
                        )}
                        {loading ? t.header.running : t.header.visualize}
                        {!loading && (
                            <kbd className="hidden sm:inline-flex text-[9px] font-mono bg-blue-700/60 px-1 py-0.5 rounded text-blue-200/80 border border-blue-500/30 ml-0.5">
                                {navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}↵
                            </kbd>
                        )}
                    </button>

                    <button
                        data-tour="mnist-demo-toggle"
                        type="button"
                        role="switch"
                        aria-checked={demoModeEnabled}
                        aria-label={`${t.canvas.demo.mode}: ${demoModeEnabled ? t.canvas.demo.modeOn : t.canvas.demo.modeOff}`}
                        onClick={() => onDemoModeChange(!demoModeEnabled)}
                        disabled={!demoAvailable}
                        className={`group h-8 flex items-center gap-2 rounded-md border px-2.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
                            demoModeEnabled
                                ? 'border-blue-500/35 bg-[var(--surface-elevated)] text-zinc-100'
                                : 'border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:bg-[#3f3f46] hover:text-[var(--text)]'
                        }`}
                        title={demoAvailable ? t.canvas.demo.mode : demoUnavailableTitle}
                    >
                        <Eye
                            className={`h-3.5 w-3.5 transition-colors ${demoModeEnabled ? 'text-blue-300' : 'text-zinc-500 group-hover:text-zinc-300'}`}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                        <span>{t.canvas.demo.mode}</span>
                        <span
                            className={`inline-flex h-5 w-9 shrink-0 items-center rounded-full border p-0.5 transition-all ${
                                demoModeEnabled
                                    ? 'justify-end border-blue-400/60 bg-blue-500/35'
                                    : 'border-zinc-600/80 bg-black/20 group-hover:border-zinc-500'
                            }`}
                            aria-hidden="true"
                        >
                            <span
                                className={`h-4 w-4 rounded-full shadow-sm transition-colors duration-200 ${
                                    demoModeEnabled
                                        ? 'bg-blue-50 shadow-blue-950/30'
                                        : 'translate-x-0.5 bg-zinc-500 group-hover:bg-zinc-300'
                                }`}
                            />
                        </span>
                    </button>

                    <button
                        data-tour="export-svg"
                        onClick={onExportSvg}
                        disabled={!layout}
                        className="bg-[var(--surface-elevated)] hover:bg-[#3f3f46] border border-[var(--border)] text-[var(--text)] px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t.header.exportSvg}
                    </button>

                    <button
                        onClick={openTour}
                        className={`w-8 h-8 flex items-center justify-center rounded-md bg-[var(--surface-elevated)] hover:bg-[#3f3f46] border border-[var(--border)] text-[var(--text-muted)] hover:text-white text-sm transition-colors ${buttonAttention ? 'tour-button-attention' : ''}`}
                        title={t.header.tour}
                        aria-label={t.header.openTour}
                    >
                        <Info className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                    </button>
                    <button
                        data-tour="help"
                        onClick={() => setHelpOpen(true)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md bg-[var(--surface-elevated)] hover:bg-[#3f3f46] border border-[var(--border)] text-[var(--text-muted)] hover:text-white text-sm font-bold transition-colors ${buttonAttention ? 'tour-button-attention' : ''}`}
                        title={t.header.help}
                    >
                        <CircleQuestionMark className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                    </button>

                    <button
                        type="button"
                        onClick={() => setLanguage(language === 'vi' ? ('en' as Language) : ('vi' as Language))}
                        className="h-8 w-8 flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-muted)] transition-all hover:bg-[#3f3f46] hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        title={language === 'vi' ? t.app.switchToEnglish : t.app.switchToVietnamese}
                        aria-label={language === 'vi' ? t.app.switchToEnglish : t.app.switchToVietnamese}
                        aria-pressed={language === 'vi'}
                    >
                        <Languages className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
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

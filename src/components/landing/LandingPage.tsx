import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { Languages } from 'lucide-react';

import { getStrings } from '../../lib/localization';
import { useStore } from '../../store/useStore';
import LearningCard from './LearningCard';
import ToolCard from './ToolCard';

type LandingPageProps = {
  onOpenWorkspace: () => void;
  onOpenLearningLab: () => void;
};

type BranchPaths = {
  width: number;
  height: number;
  available: string;
  soon: string;
};

function HeroVisual({
  stages,
}: {
  stages: ReturnType<typeof getStrings>['landingPage']['stages'];
}) {
  return (
    <div className="landing-hero-visual group relative z-[2] h-full min-h-0 overflow-hidden rounded-lg border border-zinc-700/80 bg-[#0b0f14] shadow-2xl shadow-black/35">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(56,189,248,0.14),transparent_38%),linear-gradient(315deg,rgba(16,185,129,0.12),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_34%)]" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(226,232,240,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(226,232,240,0.24)_1px,transparent_1px)] [background-size:36px_36px]" />
      <div className="absolute left-0 right-0 top-0 z-[2] flex h-11 items-center gap-2 border-b border-white/10 bg-white/[0.035] px-4">
        <span className="h-2 w-2 rounded-full bg-rose-300/80" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full bg-amber-300/80" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full bg-emerald-300/80" aria-hidden="true" />
        <span className="ml-3 h-px flex-1 bg-white/10" aria-hidden="true" />
      </div>

      <div className="landing-clean-flow absolute z-[2] left-[clamp(18px,3vw,42px)] right-[clamp(18px,3vw,42px)] bottom-[clamp(22px,4vh,54px)] top-[clamp(64px,9vh,76px)]">
        <div className="landing-clean-beam" />
        <div className="landing-clean-pulse" />

        <div
          className="landing-clean-stage landing-clean-conv"
          style={{ '--stage-color': '#60a5fa' } as CSSProperties}
        >
          <div className="landing-stage-conv-icon" aria-hidden="true">
            <div className="landing-stage-feature-grid">
              {Array.from({ length: 16 }).map((_, index) => (
                <span key={index} />
              ))}
            </div>
            <div className="landing-stage-kernel" />
          </div>
          <div>
            <div className="landing-clean-title">{stages.convolution.title}</div>
            <div className="landing-clean-caption">{stages.convolution.caption}</div>
          </div>
        </div>

        <div
          className="landing-clean-stage landing-clean-activation"
          style={{ '--stage-color': '#22d3ee' } as CSSProperties}
        >
          <div className="landing-stage-activation-icon" aria-hidden="true">
            <svg className="landing-activation-graph" viewBox="0 0 120 72" focusable="false">
              <path className="landing-activation-grid" d="M24 28H104M24 50H104M32 14V58M82 14V58" />
              <path className="landing-activation-axis" d="M22 50H108M56 60V12" />
              <path className="landing-activation-curve-shadow" d="M22 50H56L101 22" />
              <path className="landing-activation-curve" d="M22 50H56L101 22" />
            </svg>
          </div>
          <div>
            <div className="landing-clean-title">{stages.activation.title}</div>
            <div className="landing-clean-caption">{stages.activation.caption}</div>
          </div>
        </div>

        <div
          className="landing-clean-stage landing-clean-pool"
          style={{ '--stage-color': '#fbbf24' } as CSSProperties}
        >
          <div className="landing-stage-pool-icon" aria-hidden="true">
            <div className="landing-pool-grid landing-pool-grid-large">
              {Array.from({ length: 16 }).map((_, index) => (
                <span key={index} />
              ))}
            </div>
            <div className="landing-pool-arrow" />
            <div className="landing-pool-grid landing-pool-grid-small">
              {Array.from({ length: 4 }).map((_, index) => (
                <span key={index} />
              ))}
            </div>
          </div>
          <div>
            <div className="landing-clean-title">{stages.pooling.title}</div>
            <div className="landing-clean-caption">{stages.pooling.caption}</div>
          </div>
        </div>

        <div
          className="landing-clean-stage landing-clean-head"
          style={{ '--stage-color': '#34d399' } as CSSProperties}
        >
          <span className="landing-classifier-anchor" aria-hidden="true" />
          <div className="landing-stage-classifier-icon" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div>
            <div className="landing-clean-title">{stages.classifier.title}</div>
            <div className="landing-clean-caption">{stages.classifier.caption}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage({
  onOpenWorkspace,
  onOpenLearningLab,
}: LandingPageProps) {
  const language = useStore((s) => s.language);
  const setLanguage = useStore((s) => s.setLanguage);
  const bentoRef = useRef<HTMLDivElement>(null);
  const availableAnchorRef = useRef<HTMLSpanElement>(null);
  const soonAnchorRef = useRef<HTMLSpanElement>(null);
  const [branchPaths, setBranchPaths] = useState<BranchPaths>({
    width: 1400,
    height: 620,
    available: '',
    soon: '',
  });
  const strings = getStrings(language);
  const text = strings.landingPage;

  useLayoutEffect(() => {
    const bento = bentoRef.current;
    const availableAnchor = availableAnchorRef.current;
    const soonAnchor = soonAnchorRef.current;

    if (!bento || !availableAnchor || !soonAnchor) {
      return undefined;
    }

    const getAnchorCenter = (element: Element) => {
      const bentoRect = bento.getBoundingClientRect();
      const rect = element.getBoundingClientRect();

      return {
        x: rect.left - bentoRect.left + rect.width / 2,
        y: rect.top - bentoRect.top + rect.height / 2,
      };
    };

    const updateBranches = () => {
      const classifierAnchor = bento.querySelector('.landing-classifier-anchor');
      if (!classifierAnchor) return;

      const bentoRect = bento.getBoundingClientRect();
      const start = getAnchorCenter(classifierAnchor);
      const available = getAnchorCenter(availableAnchor);
      const soon = getAnchorCenter(soonAnchor);

      const makePath = (end: { x: number; y: number }) => {
        const handle = Math.max(48, Math.min(120, (end.x - start.x) * 0.45));
        return `M ${start.x} ${start.y} C ${start.x + handle} ${start.y}, ${
          end.x - handle
        } ${end.y}, ${end.x} ${end.y}`;
      };

      setBranchPaths({
        width: bentoRect.width,
        height: bentoRect.height,
        available: makePath(available),
        soon: makePath(soon),
      });
    };

    updateBranches();

    const resizeObserver = new ResizeObserver(updateBranches);
    resizeObserver.observe(bento);
    resizeObserver.observe(availableAnchor);
    resizeObserver.observe(soonAnchor);
    window.addEventListener('resize', updateBranches);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateBranches);
    };
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#090b0f] text-zinc-100">
      <section className="relative flex min-h-screen items-stretch overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#08090d_0%,#10141a_52%,#15120f_100%)]" />
        <div className="absolute inset-0 opacity-[0.11] [background-image:linear-gradient(90deg,#ffffff_1px,transparent_1px),linear-gradient(#ffffff_1px,transparent_1px)] [background-size:84px_84px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="absolute right-8 top-8 z-10">
          <button
            type="button"
            onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-white/12 bg-white/[0.055] text-zinc-300 shadow-lg shadow-black/20 transition-all hover:border-cyan-200/45 hover:bg-white/[0.085] hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/45"
            title={language === 'vi' ? strings.app.switchToEnglish : strings.app.switchToVietnamese}
            aria-label={language === 'vi' ? strings.app.switchToEnglish : strings.app.switchToVietnamese}
            aria-pressed={language === 'vi'}
          >
            <Languages className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        <div className="relative mx-auto flex h-screen min-h-0 w-full max-w-[min(1580px,100vw)] flex-col px-[clamp(18px,3.2vw,54px)] py-[clamp(18px,3vh,34px)]">
          <div className="mx-auto max-w-4xl shrink-0 text-center">
            <h1 className="text-[clamp(3rem,5vw,5rem)] font-black leading-[0.92] text-white">
              {text.title}
            </h1>
            <p className="mx-auto mt-[clamp(12px,1.8vh,18px)] flex max-w-4xl flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[clamp(1rem,1.25vw,1.25rem)] font-semibold leading-7 text-cyan-50">
              <span>{text.eyebrow}</span>
              <span className="text-emerald-200/55" aria-hidden="true">
                -
              </span>
              <span>{text.subtitle}</span>
            </p>
            <p className="mx-auto mt-[clamp(10px,1.8vh,16px)] max-w-3xl text-[clamp(0.95rem,1vw,1rem)] leading-8 text-zinc-300">
              {text.description}
            </p>
          </div>

          <div
            ref={bentoRef}
            className="relative mt-[clamp(18px,2.6vh,30px)] grid h-[clamp(340px,48vh,430px)] min-h-0 grid-cols-1 grid-rows-[minmax(230px,1fr)_auto] gap-[clamp(14px,1.5vw,24px)] p-0 xl:grid-cols-[minmax(0,1fr)_clamp(300px,22vw,360px)] xl:grid-rows-1"
          >
            <svg
              className="landing-bento-branches pointer-events-none absolute inset-0 z-[3] hidden xl:block"
              viewBox={`0 0 ${branchPaths.width} ${branchPaths.height}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {branchPaths.available && (
                <path className="landing-route landing-route-available" d={branchPaths.available} />
              )}
              {branchPaths.soon && (
                <path className="landing-route landing-route-soon" d={branchPaths.soon} />
              )}
            </svg>

            <div className="min-h-0 min-w-0">
              <HeroVisual stages={text.stages} />
            </div>

            <div className="relative z-[4] grid min-h-0 content-center grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="landing-bento-target landing-bento-target-available">
                <span
                  ref={availableAnchorRef}
                  className="landing-card-anchor landing-card-anchor-available"
                  aria-hidden="true"
                />
                <ToolCard
                  title={text.workspaceTitle}
                  description={text.workspaceDescription}
                  openLabel={text.workspaceOpen}
                  onOpen={onOpenWorkspace}
                />
              </div>

              <div className="landing-bento-target landing-bento-target-soon">
                <span
                  ref={soonAnchorRef}
                  className="landing-card-anchor landing-card-anchor-soon"
                  aria-hidden="true"
                />
                <LearningCard
                  title={text.learningTitle}
                  description={text.learningDescription}
                  openLabel={text.learningOpen}
                  onOpen={onOpenLearningLab}
                />
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

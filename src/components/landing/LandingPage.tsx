import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { LANGUAGE_OPTIONS, type Language } from '../../lib/localization';
import { useStore } from '../../store/useStore';
import LearningCard from './LearningCard';
import ToolCard from './ToolCard';

type LandingPageProps = {
  onOpenWorkspace: () => void;
};

const landingText = {
  en: {
    language: 'Language',
    eyebrow: 'Browser-native neural network diagrams',
    title: 'TorchViz 3D',
    subtitle: 'From interaction to understanding',
    description:
      'Explore model architecture visually, trace tensor shapes locally, and build intuition for how each layer transforms data.',
    workspaceTitle: 'TorchViz-3D Workspace',
    workspaceDescription: 'Open the editor, run shape tracing, and explore the rendered model graph.',
    workspaceAvailability: 'Available now',
    workspaceOpen: 'Open workspace',
    learningTitle: 'Learning Lab',
    learningDescription: 'Guided lessons and review practice for CNN shapes, parameters, and operations.',
    learningStatus: 'Coming soon',
  },
  vi: {
    language: 'Ngôn ngữ',
    eyebrow: 'Sơ đồ mạng neural chạy trực tiếp trong trình duyệt',
    title: 'TorchViz 3D',
    subtitle: 'Từ tương tác đến thấu hiểu',
    description:
      'Khám phá kiến trúc mô hình bằng trực quan, truy vết tensor shape cục bộ, và xây dựng trực giác về cách từng layer biến đổi dữ liệu.',
    workspaceTitle: 'Không gian TorchViz-3D',
    workspaceDescription: 'Mở editor, chạy truy vết shape, và khám phá graph mô hình đã render.',
    workspaceAvailability: 'Sẵn sàng',
    workspaceOpen: 'Mở workspace',
    learningTitle: 'Learning Lab',
    learningDescription: 'Bài học có hướng dẫn và luyện tập ôn tập cho shape CNN, tham số, và phép toán.',
    learningStatus: 'Sắp ra mắt',
  },
} satisfies Record<Language, {
  language: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  workspaceTitle: string;
  workspaceDescription: string;
  workspaceAvailability: string;
  workspaceOpen: string;
  learningTitle: string;
  learningDescription: string;
  learningStatus: string;
}>;

function HeroVisual() {
  return (
    <div className="landing-hero-visual group relative z-[2] h-full min-h-0 overflow-hidden rounded-lg border border-blue-300/20 bg-[#080b10]/95 shadow-2xl shadow-black/45">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(96,165,250,0.2),transparent_34%),linear-gradient(315deg,rgba(52,211,153,0.16),transparent_36%),radial-gradient(circle_at_54%_44%,rgba(15,23,42,0.18),transparent_45%)]" />
      <div className="absolute inset-0 opacity-[0.2] [background-image:linear-gradient(rgba(148,163,184,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.2)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="landing-clean-flow absolute z-[2] left-[clamp(20px,3vw,40px)] right-[clamp(20px,3vw,40px)] bottom-[clamp(24px,4vh,64px)] top-[clamp(28px,5vh,48px)]">
        <div className="landing-clean-beam" />
        <div className="landing-clean-pulse" />
        <div className="landing-clean-stage landing-clean-conv" style={{ '--stage-color': '#60a5fa' } as CSSProperties}>
          <div className="landing-stage-conv-icon" aria-hidden="true">
            <div className="landing-stage-feature-grid">
              {Array.from({ length: 16 }).map((_, index) => (
                <span key={index} />
              ))}
            </div>
            <div className="landing-stage-kernel" />
          </div>
          <div>
            <div className="landing-clean-title">Convolution</div>
            <div className="landing-clean-caption">extract edges</div>
          </div>
        </div>
        <div className="landing-clean-stage landing-clean-activation" style={{ '--stage-color': '#22d3ee' } as CSSProperties}>
          <div className="landing-stage-activation-icon" aria-hidden="true">
            <svg className="landing-activation-graph" viewBox="0 0 120 72" focusable="false">
              <path className="landing-activation-grid" d="M24 28H104M24 50H104M32 14V58M82 14V58" />
              <path className="landing-activation-axis" d="M22 50H108M56 60V12" />
              <path className="landing-activation-curve-shadow" d="M22 50H56L101 22" />
              <path className="landing-activation-curve" d="M22 50H56L101 22" />
            </svg>
          </div>
          <div>
            <div className="landing-clean-title">Activation</div>
            <div className="landing-clean-caption">apply nonlinearity</div>
          </div>
        </div>
        <div className="landing-clean-stage landing-clean-pool" style={{ '--stage-color': '#fbbf24' } as CSSProperties}>
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
            <div className="landing-clean-title">Pooling</div>
            <div className="landing-clean-caption">compress map</div>
          </div>
        </div>
        <div className="landing-clean-stage landing-clean-head" style={{ '--stage-color': '#34d399' } as CSSProperties}>
          <span className="landing-classifier-anchor" aria-hidden="true" />
          <div className="landing-stage-classifier-icon" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div>
            <div className="landing-clean-title">Classifier</div>
            <div className="landing-clean-caption">score classes</div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function LandingPage({ onOpenWorkspace }: LandingPageProps) {
  const language = useStore((s) => s.language);
  const setLanguage = useStore((s) => s.setLanguage);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);
  const availableAnchorRef = useRef<HTMLSpanElement>(null);
  const soonAnchorRef = useRef<HTMLSpanElement>(null);
  const [branchPaths, setBranchPaths] = useState({
    width: 1400,
    height: 620,
    available: '',
    soon: '',
  });
  const text = landingText[language];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    const bento = bentoRef.current;
    const availableAnchor = availableAnchorRef.current;
    const soonAnchor = soonAnchorRef.current;
    if (!bento || !availableAnchor || !soonAnchor) return undefined;

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
        return `M ${start.x} ${start.y} C ${start.x + handle} ${start.y}, ${end.x - handle} ${end.y}, ${end.x} ${end.y}`;
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
    <main className="min-h-screen overflow-x-hidden bg-[#06070a] text-zinc-100">
      <section className="relative flex min-h-screen items-stretch">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#05060a_0%,#09090b_42%,#111827_100%)]" />
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_52%_45%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_72%_62%,rgba(52,211,153,0.12),transparent_26%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,#ffffff_1px,transparent_1px),linear-gradient(#ffffff_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/45 to-transparent" />
        <div className="absolute right-8 top-8 z-10" ref={languageRef}>
          <button
            type="button"
            onClick={() => setIsLanguageOpen((v) => !v)}
            className={`flex h-9 w-9 items-center justify-center rounded-md border bg-zinc-950/70 text-zinc-300 transition-all hover:bg-zinc-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400/40 ${isLanguageOpen ? 'border-blue-400 text-blue-200 ring-2 ring-blue-500/25' : 'border-zinc-700'}`}
            title={text.language}
            aria-label={text.language}
            aria-haspopup="menu"
            aria-expanded={isLanguageOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M4 5h9" />
              <path d="M9 3v2" />
              <path d="M6 9c1.2 2.5 3.3 4.2 6 5" />
              <path d="M11 9c-.7 1.8-2.1 3.4-4 4.6" />
              <path d="M14 19l3-7 3 7" />
              <path d="M15.1 16.5h3.8" />
            </svg>
          </button>

          {isLanguageOpen && (
            <div
              className="absolute right-0 top-[calc(100%+6px)] flex w-36 flex-col overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 py-1 shadow-xl shadow-black/80"
              role="menu"
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  className={`px-3 py-2 text-left text-xs transition-colors ${language === option.code ? 'bg-blue-600/20 font-medium text-blue-300' : 'text-zinc-200 hover:bg-zinc-800 hover:text-zinc-50'}`}
                  onClick={() => {
                    setLanguage(option.code);
                    setIsLanguageOpen(false);
                  }}
                  role="menuitemradio"
                  aria-checked={language === option.code}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative mx-auto flex h-screen min-h-0 w-full max-w-[min(1680px,100vw)] flex-col px-[clamp(20px,3.2vw,56px)] py-[clamp(18px,3vh,32px)]">
          <div className="mx-auto max-w-4xl shrink-0 text-center">
            <h1 className="text-[clamp(3.4rem,5.4vw,5.3rem)] font-black leading-[0.9] text-white">
              {text.title}
            </h1>
            <p className="mx-auto mt-[clamp(12px,1.8vh,18px)] flex max-w-4xl items-center justify-center gap-2 text-[clamp(1.05rem,1.35vw,1.35rem)] font-semibold leading-8 text-blue-100">
              <span>{text.eyebrow}</span>
              <span className="text-blue-300/60" aria-hidden="true">-</span>
              <span>{text.subtitle}</span>
            </p>
            <p className="mx-auto mt-[clamp(10px,1.8vh,16px)] max-w-3xl text-[clamp(0.95rem,1vw,1rem)] leading-8 text-zinc-300">
              {text.description}
            </p>
          </div>

          <div
            ref={bentoRef}
            className="relative mt-[clamp(20px,3vh,32px)] grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(260px,1fr)_auto] gap-[clamp(16px,1.7vw,28px)] p-0 xl:grid-cols-[minmax(0,1fr)_clamp(280px,20vw,340px)] xl:grid-rows-1"
          >
            <svg
              className="landing-bento-branches pointer-events-none absolute inset-0 z-[3]"
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
              <HeroVisual />
            </div>

            <div className="relative z-[4] grid min-h-0 content-center grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1 xl:grid-rows-[minmax(144px,164px)_minmax(126px,142px)]">
              <div className="landing-bento-target landing-bento-target-available min-h-0">
                <span ref={availableAnchorRef} className="landing-card-anchor landing-card-anchor-available" aria-hidden="true" />
                <ToolCard
                  title={text.workspaceTitle}
                  description={text.workspaceDescription}
                  availabilityLabel={text.workspaceAvailability}
                  openLabel={text.workspaceOpen}
                  onOpen={onOpenWorkspace}
                />
              </div>
              <div className="landing-bento-target landing-bento-target-soon min-h-0">
                <span ref={soonAnchorRef} className="landing-card-anchor landing-card-anchor-soon" aria-hidden="true" />
                <LearningCard
                  title={text.learningTitle}
                  description={text.learningDescription}
                  statusLabel={text.learningStatus}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

import {
  ArrowRight,
  Archive,
  BrainCircuit,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Check,
  Cloud,
  CloudRain,
  CircleDot,
  Database,
  Dices,
  Eye,
  Factory,
  FlaskConical,
  HeartPulse,
  Network,
  RefreshCw,
  ScanSearch,
  ShieldCheck,
  Sun,
  TriangleAlert,
  Users,
  type LucideIcon,
} from 'lucide-react';
import katex from 'katex';
import { useEffect, useId, useMemo, useState } from 'react';
import mereGamblingScene from '../../../../assets/learning/statistics/ch01-probability/01-statistics-probability-origins-mere-gambling-scene.jpg';
import pascalFermatIllustration from '../../../../assets/learning/statistics/ch01-probability/01-statistics-probability-origins-pascal-fermat.png';
import experimentOutcomesIllustration from '../../../../assets/learning/statistics/ch01-probability/01-statistics-probability-origins-experiment-outcomes.png';
import elementaryEventsIllustration from '../../../../assets/learning/statistics/ch01-probability/02-statistics-experiments-events-sample-space-elementary-events.png';
import bushTaxTruncatedAxisIllustration from '../../../../assets/learning/statistics/ch02-statistical-thinking/02-statistics-criticism-bush-tax.webp';
import { STATISTICS_MDX_COMPONENT_NAMES } from '../../../../content/learning/mdxComponents';
import {
  useLearningMdxTheme,
  type LearningMdxComponent,
  type LearningThemeClasses,
} from '../../learningMdxComponents';
import { cx } from '../../theme';
import {
  HistogramBinComparison,
  HistogramBinExplorer,
  HistogramConstructionVisual,
  HistogramRulesVisual,
  HistogramShapeVisual,
} from './histogramRenderers';
import {
  HistogramReadingInteraction,
  NormalDistributionVisual,
  NormalParameterExplorer,
} from './normalDistributionRenderers';
import {
  VarianceConceptVisual,
  VarianceEstimatorComparison,
  VariancePointExplorer,
} from './varianceStandardDeviationRenderers';

type ProbabilityChapterVisualKind =
  | 'axioms'
  | 'bayes'
  | 'bayes-normalization'
  | 'bayes-prior-posterior'
  | 'certainty'
  | 'conditional'
  | 'descriptive-center-histogram'
  | 'elementary'
  | 'empirical'
  | 'experiment-outcomes'
  | 'exclusive'
  | 'exclusive-not-complement'
  | 'foundations'
  | 'frequency-simulation'
  | 'frequency-stability'
  | 'hidden-coin-probability'
  | 'ideal-normal-center'
  | 'naive-bayes-combinations'
  | 'naive-bayes-exercise'
  | 'naive-bayes-laplace'
  | 'naive-bayes-practical'
  | 'naive-bayes-tradeoffs'
  | 'intersection'
  | 'large-number-applications'
  | 'responsible-statistics-checklist'
  | 'play-tennis-data'
  | 'play-tennis-likelihoods'
  | 'play-tennis-likelihoods-laplace'
  | 'email-naive-bayes-data'
  | 'email-naive-bayes-probabilities'
  | 'email-naive-bayes-scores'
  | 'sample-space'
  | 'statistical-assumptions'
  | 'statistics-misuse-quote'
  | 'statistical-thinking-sampling'
  | 'statistical-thinking-study-design'
  | 'total'
  | 'total-sum'
  | 'union';

function MathText({ className, formula }: { className?: string; formula: string }) {
  return (
    <span
      aria-label={formula}
      className={className}
      dangerouslySetInnerHTML={{ __html: katex.renderToString(formula, { throwOnError: false }) }}
    />
  );
}

const probabilitySourceImages = {
  'mere-gambling-scene': mereGamblingScene,
  'pascal-fermat': pascalFermatIllustration,
  'bush-tax-truncated-axis': bushTaxTruncatedAxisIllustration,
} as const;

function ProbabilitySourceImage({ alt, asset, children, layout = 'default', source }: {
  alt: string;
  asset: keyof typeof probabilitySourceImages;
  children?: React.ReactNode;
  layout?: 'default' | 'right';
  source: string;
}) {
  const themeClasses = useLearningMdxTheme();

  const image = (
    <figure className="grid w-full justify-items-center gap-2">
      <img src={probabilitySourceImages[asset]} alt={alt} loading="lazy" className="max-h-[18rem] w-auto max-w-full rounded-lg object-contain" />
      <figcaption className={cx('text-center text-xs font-semibold leading-5', themeClasses.mutedText)}>
        Nguồn: {source}
      </figcaption>
    </figure>
  );

  if (layout === 'right') {
    return (
      <section className={cx(
        'grid items-center gap-6 rounded-xl px-4 py-4 sm:px-5 sm:py-5 md:grid-cols-2 md:gap-8',
        themeClasses.isLight ? 'bg-white text-[#172A43]' : 'bg-[#121A24]/35 text-[#F2F6FA]',
      )}>
        <div className="min-w-0">{children}</div>
        {image}
      </section>
    );
  }

  return (
    image
  );
}

function VisualSurface({ children, label, themeClasses }: {
  children: React.ReactNode;
  label: string;
  themeClasses: LearningThemeClasses;
}) {
  return (
    <section
      aria-label={label}
      className={cx(
        'overflow-hidden rounded-xl px-4 py-4 sm:px-5 sm:py-5',
        themeClasses.isLight ? 'bg-[#EAF1F7] text-[#172A43]' : 'bg-[#A8D4FF]/7 text-[#F2F6FA]',
      )}
    >
      {children}
    </section>
  );
}

function FoundationsVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  return (
    <section
      aria-label="Từ hành động gieo xúc xắc đến kết quả quan sát được là mặt 4"
      className={cx('py-4', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}
    >
      <div className="grid items-center gap-5 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className="grid justify-items-center gap-3 text-center">
          <span className={cx(
            'grid h-20 w-20 place-items-center rounded-2xl',
            themeClasses.isLight ? 'bg-[#EAF1F7] text-[#205089]' : 'bg-[#A8D4FF]/10 text-[#A8D4FF]',
          )}>
            <Dices className="h-10 w-10" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div>
            <h3 className={cx('text-base font-black', themeClasses.titleText)}>Phép thử</h3>
            <p className={cx('mt-1 text-sm font-semibold', themeClasses.bodyText)}>Gieo một con xúc xắc</p>
          </div>
        </div>

        <ArrowRight className={cx('mx-auto h-6 w-6 rotate-90 sm:rotate-0', themeClasses.accentText)} strokeWidth={2.2} aria-hidden="true" />

        <div className="grid justify-items-center gap-3 text-center">
          <span className={cx(
            'grid h-20 w-20 place-items-center rounded-full',
            themeClasses.isLight ? 'bg-[#DDEFE3] text-[#285C38]' : 'bg-[#9DDBAF]/12 text-[#C5EBD0]',
          )}>
            <MathText className="text-3xl font-semibold" formula="4" />
          </span>
          <div>
            <h3 className={cx('text-base font-black', themeClasses.titleText)}>Một kết quả</h3>
            <p className={cx('mt-1 text-sm font-semibold', themeClasses.bodyText)}>Quan sát được mặt 4</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ElementaryEventVisual({ themeClasses: _themeClasses }: { themeClasses: LearningThemeClasses }) {
  return (
    <img
      src={elementaryEventsIllustration}
      alt="Biến cố xuất hiện mặt chẵn gồm ba biến cố sơ cấp là mặt 2, mặt 4 và mặt 6"
      loading="lazy"
      className="h-auto w-full rounded-xl object-contain"
    />
  );
}

function CertaintyVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const cases = [
    { formula: '\\Omega', label: 'Chắc chắn', description: 'Mặt từ 1 đến 6' },
    { formula: '\\varnothing', label: 'Không thể', description: 'Xuất hiện mặt 7' },
    { formula: 'A=\\{2,4,6\\}', label: 'Ngẫu nhiên', description: 'Xuất hiện mặt chẵn' },
  ];
  return (
    <section
      aria-label="So sánh biến cố chắc chắn, biến cố không thể và biến cố ngẫu nhiên"
      className={cx('py-4', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}
    >
      <div className={cx(
        'grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0',
        themeClasses.isLight ? 'divide-[#205089]/14' : 'divide-[#A8D4FF]/16',
      )}>
        {cases.map((item) => (
          <div key={item.label} className="grid min-h-36 content-center justify-items-center gap-2 px-4 py-5 text-center">
            <MathText className={cx('text-xl font-semibold', themeClasses.titleText)} formula={item.formula} />
            <h3 className={cx('text-base font-black', themeClasses.titleText)}>{item.label}</h3>
            <p className={cx('text-sm font-semibold', themeClasses.bodyText)}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ExperimentOutcomesVisual({ themeClasses: _themeClasses }: { themeClasses: LearningThemeClasses }) {
  return (
    <section
      aria-label="Trước khi tung xúc xắc, chưa biết kết quả cụ thể nhưng biết sáu kết quả có thể xảy ra"
      className="rounded-xl bg-white px-4 py-4 text-[#172A43] sm:px-5 sm:py-5"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-6 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:gap-8">
        <img
          src={experimentOutcomesIllustration}
          alt="Phép thử có kết quả chưa biết trước nhưng phạm vi kết quả của xúc xắc là Omega bằng tập hợp từ 1 đến 6"
          loading="lazy"
          className="mx-auto h-auto max-h-[22rem] w-full rounded-xl object-contain lg:order-2"
        />

        <div className="lg:order-1">
          <div className="grid gap-3">
            <section className="flex min-h-28 items-center justify-between gap-4 rounded-xl bg-[#F7E8CC] px-4 py-4 text-[#80591E] sm:px-5">
              <div>
                <span className="text-[0.68rem] font-black uppercase tracking-[0.16em] opacity-75">Chưa biết trước</span>
                <p className="mt-1 text-sm font-black">Kết quả cụ thể</p>
              </div>
              <MathText className="text-3xl font-semibold sm:text-4xl" formula="\omega=?" />
            </section>

            <div className="flex items-center gap-3" aria-hidden="true">
              <span className="h-px flex-1 bg-[#D7E1EA]" />
              <span className="text-xs font-black uppercase tracking-[0.14em] text-[#627D98]">nhưng</span>
              <span className="h-px flex-1 bg-[#D7E1EA]" />
            </div>

            <section className="grid min-h-36 content-center rounded-xl bg-[#DDEBFB] px-4 py-4 text-center text-[#173F6C] sm:px-5">
              <span className="text-[0.68rem] font-black uppercase tracking-[0.16em] opacity-75">Biết trước toàn bộ khả năng</span>
              <MathText className="mt-2 text-2xl font-semibold sm:text-3xl" formula="\Omega=\{1,2,3,4,5,6\}" />
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}

function HiddenCoinProbabilityVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const border = themeClasses.isLight ? 'border-[#205089]/14' : 'border-[#A8D4FF]/18';
  const softSurface = themeClasses.isLight ? 'bg-[#EAF1F7]' : 'bg-[#A8D4FF]/7';

  return (
    <section
      aria-label="Đồng xu đã được tung: kết quả đã cố định nhưng người quan sát vẫn chưa biết"
      className={cx(
        'mt-6 overflow-hidden rounded-xl border',
        border,
        themeClasses.isLight ? 'bg-white text-[#172A43]' : 'bg-[#121A24]/48 text-[#F2F6FA]',
      )}
    >
      <div className="grid lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
        <div className="grid content-center px-5 py-6 sm:px-7 sm:py-8">
          <h3 className={cx('max-w-md text-xl font-bold leading-8 sm:text-2xl', themeClasses.titleText)}>
            Một đồng xu đã được tung
          </h3>
          <p className={cx('mt-3 max-w-xl text-sm font-semibold leading-7 sm:text-base', themeClasses.bodyText)}>
            Đồng xu cân đối, đồng chất được che lại trước khi bạn nhìn kết quả. Xác suất nó đang nằm ở mặt sấp là bao nhiêu?
          </p>
          <div className={cx(
            'mt-6 flex items-center justify-between gap-4 rounded-xl px-4 py-4 sm:px-5',
            themeClasses.isLight ? 'bg-[#F7E8CC] text-[#704B10]' : 'bg-[#F2C66D]/12 text-[#FFE4A3]',
          )}>
            <MathText className="text-4xl font-semibold sm:text-5xl" formula="50\%" />
            <span className="max-w-28 text-right text-sm font-bold leading-5">Câu trả lời quen thuộc</span>
          </div>
        </div>

        <div className={cx('grid content-center gap-5 px-5 py-6 sm:px-7 sm:py-8', softSurface)}>
          <div className="mx-auto grid h-36 w-full max-w-sm place-items-center" aria-hidden="true">
            <div className={cx(
              'grid h-32 w-32 place-items-center rounded-full border text-4xl font-black shadow-[0_14px_28px_rgba(32,80,137,0.16)]',
              themeClasses.isLight ? 'border-[#B7791F]/20 bg-[#F2C66D] text-[#704B10]' : 'border-[#F2C66D]/30 bg-[#D7A84E] text-[#33230B]',
            )}>
              ?
            </div>
          </div>
          <p className={cx('mx-auto max-w-xl text-sm font-semibold leading-7 sm:text-base', themeClasses.bodyText)}>
            <strong className={cx('font-bold', themeClasses.titleText)}>Nhưng khoan.</strong> Đồng xu đã được tung và đã nằm yên. Bên dưới bàn tay, kết quả đã là sấp hoặc ngửa; nó không còn chờ để “quyết định” mặt nào sẽ xuất hiện.
          </p>
        </div>
      </div>

      <p className={cx(
        'px-5 py-4 text-center text-base font-semibold leading-7 sm:px-7 sm:text-lg',
        themeClasses.isLight ? 'bg-[#205089] text-white' : 'bg-[#A8D4FF]/12 text-[#D7EAFE]',
      )}>
        Đồng xu không lưỡng lự. Người chưa biết kết quả là bạn.
      </p>

      <div className="px-5 py-6 sm:px-7 sm:py-7">
        <p className={cx('text-lg font-bold leading-7 sm:text-xl', themeClasses.titleText)}>Vậy con số 50% thực sự đang mô tả điều gì?</p>
        <h3 className={cx('mt-4 text-base font-semibold leading-7', themeClasses.bodyText)}>Cách hiểu thứ nhất: Tần suất tương đối</h3>
      </div>
    </section>
  );
}

function LargeNumberApplicationsVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const examples: Array<{
    aggregate: string;
    icon: LucideIcon;
    single: string;
    title: string;
  }> = [
    {
      title: 'Sòng bạc',
      single: 'Ai sẽ thắng ở ván kế tiếp?',
      aggregate: 'Tỷ lệ thắng–thua qua hàng nghìn ván',
      icon: Dices,
    },
    {
      title: 'Công ty bảo hiểm',
      single: 'Chính xác khách hàng nào sẽ gặp sự cố?',
      aggregate: 'Tỷ lệ bồi thường trên toàn bộ nhóm',
      icon: ShieldCheck,
    },
    {
      title: 'Dây chuyền sản xuất',
      single: 'Sản phẩm nào tiếp theo sẽ bị lỗi?',
      aggregate: 'Tỷ lệ sản phẩm lỗi của cả lô',
      icon: Factory,
    },
  ];
  const border = themeClasses.isLight ? 'border-[#205089]/12' : 'border-[#A8D4FF]/16';
  const rowColors = [
    { right: 'bg-[#F7E8CC] text-[#704B10]', check: 'text-[#9A6417]' },
    { right: 'bg-[#DDEBFB] text-[#173F6C]', check: 'text-[#205089]' },
    { right: 'bg-[#DDEFE3] text-[#285C38]', check: 'text-[#2F6840]' },
  ];

  return (
    <section
      aria-label="Ba lĩnh vực chuyển từ một trường hợp khó đoán sang quy luật ở số lượng lớn"
      className={cx(
        'overflow-hidden rounded-xl border',
        border,
        themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]',
      )}
    >
      <div className="grid items-stretch gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="bg-white">
          <div className="bg-white px-5 py-5 text-[#172A43] sm:px-7">
            <h3 className="text-lg font-bold leading-7">Không quan tâm</h3>
            <p className="text-sm font-semibold leading-6 text-[#64748B]">Một trường hợp riêng lẻ</p>
          </div>

          <div className="divide-y divide-[#B8C9D8] px-5 py-6 sm:px-7 sm:py-7">
            {examples.map((example) => {
              const Icon = example.icon;
              return (
                <article key={example.title} className="flex min-h-28 gap-3 bg-white px-4 py-4 text-[#172A43]">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#EAF1F7]">
                    <Icon className="h-4.5 w-4.5" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold leading-6">{example.title}</h4>
                    <p className="mt-0.5 text-sm font-medium leading-6 opacity-85">{example.single}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="bg-white">
          <div className="bg-white px-5 py-5 text-[#172A43] sm:px-7">
            <h3 className="text-lg font-bold leading-7">Cần quan tâm</h3>
            <p className="text-sm font-semibold leading-6 text-[#64748B]">Quy luật ở số lượng lớn</p>
          </div>

          <div className="divide-y divide-white px-5 py-6 sm:px-7 sm:py-7">
            {examples.map((example, index) => (
              <article key={example.title} className={cx('flex min-h-28 gap-3 px-4 py-4', rowColors[index].right)}>
                <Check className={cx('mt-1 h-5 w-5 shrink-0', rowColors[index].check)} strokeWidth={2.4} aria-hidden="true" />
                <div>
                  <h4 className="text-sm font-semibold leading-6 opacity-75">{example.title}</h4>
                  <p className="mt-0.5 text-sm font-bold leading-6">{example.aggregate}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}

function SampleSpaceVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const outcomes = ['1', '2', '3', '4', '5', '6'];
  return (
    <section
      aria-label="Không gian mẫu của phép tung một con xúc xắc gồm sáu kết quả sơ cấp"
      className="py-2"
    >
      <div className="px-1 sm:px-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={cx(
              'grid h-11 w-11 place-items-center rounded-xl',
              themeClasses.isLight ? 'bg-[#205089] text-white' : 'bg-[#789CC2] text-[#121A24]',
            )}>
              <MathText className="text-xl font-black" formula="\Omega" />
            </span>
            <div>
              <span className={cx('text-[0.68rem] font-black uppercase tracking-[0.13em]', themeClasses.mutedText)}>Không gian mẫu</span>
              <p className={cx('mt-0.5 text-sm font-black', themeClasses.titleText)}>Toàn bộ kết quả có thể xảy ra</p>
            </div>
          </div>
          <Dices className={cx('hidden h-6 w-6 sm:block', themeClasses.accentText)} strokeWidth={1.9} aria-hidden="true" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {outcomes.map((outcome) => (
            <div
              key={outcome}
              className={cx(
                'grid aspect-square min-h-14 place-items-center rounded-xl text-center',
                themeClasses.isLight ? 'bg-[#EAF1F7]' : 'bg-[#A8D4FF]/8',
              )}
            >
              <MathText className={cx('text-xl font-black', themeClasses.titleText)} formula={outcome} />
            </div>
          ))}
        </div>

        <div className={cx('mt-3 flex items-center justify-center gap-2 text-xs font-bold', themeClasses.mutedText)}>
          <CircleDot className="h-3.5 w-3.5" strokeWidth={2.1} aria-hidden="true" />
          <span>6 kết quả sơ cấp · không thiếu · không gộp</span>
        </div>
      </div>
    </section>
  );
}

function EventSetDiagram({ themeClasses, variant }: {
  themeClasses: LearningThemeClasses;
  variant: 'intersection' | 'union';
}) {
  const clipId = useId().replaceAll(':', '');
  const palette = themeClasses.isLight
    ? {
        baseFill: 'rgba(255,255,255,0.38)',
        intersectionFill: 'rgba(40,148,122,0.42)',
        labelA: '#205089',
        labelB: '#2F6840',
        strokeA: '#7FA9E5',
        strokeB: '#78A98A',
        unionFill: 'rgba(81,127,203,0.20)',
      }
    : {
        baseFill: 'rgba(242,246,250,0.03)',
        intersectionFill: 'rgba(125,211,179,0.40)',
        labelA: '#D7EAFE',
        labelB: '#C5EBD0',
        strokeA: '#8CB9E8',
        strokeB: '#9DDBAF',
        unionFill: 'rgba(168,212,255,0.18)',
      };
  const isUnion = variant === 'union';

  return (
    <svg
      viewBox="0 0 260 150"
      role="img"
      aria-label={isUnion ? 'Toàn bộ vùng của A và B được tô màu để biểu diễn hợp A và B' : 'Chỉ vùng chồng lấn của A và B được tô màu để biểu diễn giao A và B'}
      className="mx-auto h-auto w-full max-w-[18rem]"
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="164" cy="75" r="56" />
        </clipPath>
      </defs>
      <circle cx="96" cy="75" r="56" fill={isUnion ? palette.unionFill : palette.baseFill} />
      <circle cx="164" cy="75" r="56" fill={isUnion ? palette.unionFill : palette.baseFill} />
      {!isUnion ? <circle cx="96" cy="75" r="56" fill={palette.intersectionFill} clipPath={`url(#${clipId})`} /> : null}
      <circle cx="96" cy="75" r="56" fill="none" stroke={palette.strokeA} strokeWidth="2" />
      <circle cx="164" cy="75" r="56" fill="none" stroke={palette.strokeB} strokeWidth="2" />
      <text x="75" y="82" fill={palette.labelA} fontSize="20" fontWeight="800" textAnchor="middle">A</text>
      <text x="185" y="82" fill={palette.labelB} fontSize="20" fontWeight="800" textAnchor="middle">B</text>
    </svg>
  );
}

function RelationsVisual({ focus, themeClasses }: {
  focus: 'intersection' | 'union';
  themeClasses: LearningThemeClasses;
}) {
  const isUnion = focus === 'union';
  return (
    <section
      aria-label={isUnion ? 'Minh họa hợp của hai biến cố' : 'Minh họa giao của hai biến cố'}
      className={cx(
        'py-4',
        themeClasses.isLight ? 'bg-white text-[#172A43]' : 'bg-[#121A24] text-[#F2F6FA]',
      )}
    >
      <div className="mx-auto grid max-w-xl justify-items-center gap-1">
        <MathText className={cx('text-xl font-semibold', themeClasses.titleText)} formula={isUnion ? 'A\\cup B' : 'A\\cap B'} />
        <EventSetDiagram variant={focus} themeClasses={themeClasses} />
        <p className={cx('text-center text-sm font-bold', themeClasses.bodyText)}>
          {isUnion ? 'Ít nhất một biến cố xảy ra' : 'Cả hai biến cố cùng xảy ra'}
        </p>
      </div>
    </section>
  );
}

function ExclusiveEventsVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const circleBase = 'absolute top-7 grid h-24 w-24 place-items-center rounded-full border-2';
  return (
    <section
      aria-label="Hai biến cố A và B xung khắc, không có vùng chồng lấn"
      className={cx(
        'overflow-hidden rounded-xl px-4 py-4 sm:px-5',
        themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]',
      )}
    >
      <div className="relative mx-auto h-40 w-full max-w-[25rem]">
        <div className={cx(
          circleBase,
          'left-[6%]',
          themeClasses.isLight ? 'border-[#7FA9E5] bg-[#517FCB]/16 text-[#205089]' : 'border-[#8CB9E8] bg-[#517FCB]/20 text-[#D7EAFE]',
        )}>
          <MathText className="text-2xl font-semibold" formula="A" />
        </div>
        <div className={cx(
          circleBase,
          'right-[6%]',
          themeClasses.isLight ? 'border-[#78A98A] bg-[#78C990]/20 text-[#2F6840]' : 'border-[#9DDBAF] bg-[#78C990]/18 text-[#C5EBD0]',
        )}>
          <MathText className="text-2xl font-semibold" formula="B" />
        </div>
        <span
          aria-hidden="true"
          className={cx(
            'absolute left-1/2 top-14 h-10 w-10 -translate-x-1/2 rounded-full',
            themeClasses.isLight ? 'bg-[#F5E2E2]' : 'bg-[#E98991]/14',
            'before:absolute before:left-1/2 before:top-1/2 before:h-0.5 before:w-5 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:bg-[#B84A52]',
            'after:absolute after:left-1/2 after:top-1/2 after:h-0.5 after:w-5 after:-translate-x-1/2 after:-translate-y-1/2 after:-rotate-45 after:bg-[#B84A52]',
          )}
        />
      </div>
    </section>
  );
}

function ExclusiveNotComplementVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const palette = themeClasses.isLight
    ? {
        aFill: 'rgba(81,127,203,0.30)',
        aStroke: '#517FCB',
        bFill: 'rgba(228,184,117,0.34)',
        bStroke: '#B77A2D',
        complementFill: 'rgba(120,201,144,0.18)',
        sampleStroke: '#78A98A',
      }
    : {
        aFill: 'rgba(140,185,232,0.28)',
        aStroke: '#8CB9E8',
        bFill: 'rgba(228,184,117,0.24)',
        bStroke: '#E4B875',
        complementFill: 'rgba(157,219,175,0.14)',
        sampleStroke: '#9DDBAF',
      };

  return (
    <section
      aria-label="Biến cố A và B xung khắc nhưng B chỉ là một phần của biến cố đối của A"
      className={cx(
        'grid gap-3 overflow-hidden rounded-xl px-4 py-4 sm:px-5',
        themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]',
      )}
    >
      <div className="relative mx-auto h-52 w-full max-w-[30rem]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 480 208" aria-hidden="true">
          <rect x="12" y="12" width="456" height="184" rx="14" fill={palette.complementFill} stroke={palette.sampleStroke} strokeWidth="2" />
          <circle cx="155" cy="108" r="62" fill={palette.aFill} stroke={palette.aStroke} strokeWidth="2" />
          <circle cx="330" cy="108" r="38" fill={palette.bFill} stroke={palette.bStroke} strokeWidth="2" />
        </svg>
        <MathText className={cx('absolute left-[7%] top-[9%] text-lg font-semibold', themeClasses.titleText)} formula="\Omega" />
        <MathText className={cx('absolute left-[32.5%] top-[52%] -translate-x-1/2 -translate-y-1/2 text-2xl font-semibold', themeClasses.titleText)} formula="A" />
        <MathText className={cx('absolute left-[68.75%] top-[52%] -translate-x-1/2 -translate-y-1/2 text-xl font-semibold', themeClasses.titleText)} formula="B" />
        <MathText className={cx('absolute right-[8%] top-[14%] text-lg font-semibold', themeClasses.titleText)} formula="A^c" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className={cx('rounded-lg px-3 py-2 text-sm font-semibold', themeClasses.isLight ? 'bg-[#F5F8FB] text-[#254F70]' : 'bg-[#A8D4FF]/8 text-[#D7EAFE]')}>
          <MathText formula="A\cap B=\varnothing" />
        </span>
        <span className={cx('rounded-lg px-3 py-2 text-sm font-semibold', themeClasses.isLight ? 'bg-[#F5F8FB] text-[#254F70]' : 'bg-[#A8D4FF]/8 text-[#D7EAFE]')}>
          <MathText formula="B\subsetneq A^c" />
        </span>
      </div>
    </section>
  );
}

function AxiomsVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const points = [
    { label: 'Không thể', value: '0' },
    { label: 'Bất định', value: '0.5' },
    { label: 'Chắc chắn', value: '1' },
  ];
  return (
    <VisualSurface label="Thang xác suất từ không thể đến chắc chắn" themeClasses={themeClasses}>
      <div className="px-2 pb-1 pt-3 sm:px-5">
        <div className={cx('relative h-2 rounded-full', themeClasses.isLight ? 'bg-[#B9CDE0]' : 'bg-[#A8D4FF]/16')}>
          <div className={cx('absolute inset-y-0 left-0 w-1/2 rounded-full', themeClasses.isLight ? 'bg-[#517FCB]' : 'bg-[#789CC2]')} />
          {points.map((point, index) => (
            <span
              key={point.value}
              className={cx(
                'absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px]',
                themeClasses.isLight ? 'border-white bg-[#205089]' : 'border-[#172232] bg-[#A8D4FF]',
              )}
              style={{ left: `${index * 50}%` }}
            />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3">
          {points.map((point, index) => (
            <div key={point.value} className={cx('grid gap-0.5', index === 1 ? 'justify-items-center text-center' : index === 2 ? 'justify-items-end text-right' : '')}>
              <MathText className={cx('text-base font-black', themeClasses.titleText)} formula={point.value} />
              <span className={cx('text-xs font-bold', themeClasses.mutedText)}>{point.label}</span>
            </div>
          ))}
        </div>
      </div>
    </VisualSurface>
  );
}

function EmpiricalVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const observed = [true, false, false, true, false, true, false, false, true, false];

  return (
    <section
      aria-label="Trong mười đơn hàng được quan sát, biến cố A xảy ra bốn lần nên tần suất bằng bốn phần mười, tức 0.4"
      className="py-3"
    >
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
          <p className={cx('text-sm font-bold', themeClasses.titleText)}>10 đơn được quan sát</p>
          <p className={cx('text-sm font-semibold', themeClasses.accentText)}>
            <strong className="text-lg font-black">4</strong> đơn đúng giờ
          </p>
        </div>

        <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10" aria-hidden="true">
          {observed.map((isEventA, index) => (
            <span
              key={index}
              className={cx(
                'grid aspect-square min-h-10 place-items-center rounded-full text-xs font-black sm:min-h-12',
                isEventA
                  ? themeClasses.isLight ? 'bg-[#205089] text-white' : 'bg-[#789CC2] text-[#121A24]'
                  : themeClasses.isLight ? 'bg-[#EAF1F7] text-[#172A43]' : 'bg-[#A8D4FF]/8 text-[#F2F6FA]',
              )}
            >
              {isEventA ? 'A' : '–'}
            </span>
          ))}
        </div>

        <div className="mt-7 text-center">
          <MathText className={cx('text-2xl font-semibold sm:text-3xl', themeClasses.titleText)} formula="f_{10}(A)=\frac{4}{10}=0.4" />
        </div>
      </div>
    </section>
  );
}

function DescriptiveCenterHistogramVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const frequencies = new Map([
    [12, 3],
    [15, 2],
    [18, 1],
    [20, 1],
    [22, 1],
    [24, 1],
    [30, 1],
  ]);
  const bins = Array.from({ length: 19 }, (_, index) => ({
    count: frequencies.get(index + 12) ?? 0,
    value: index + 12,
  }));
  const plot = { bottom: 250, left: 62, right: 718, top: 58 };
  const binWidth = (plot.right - plot.left) / bins.length;
  const xForValue = (value: number) => plot.left + (value - 11.5) * binWidth;
  const yForCount = (count: number) => plot.bottom - count * 52;
  const axisColor = themeClasses.isLight ? '#7A8DA3' : '#A8B8C8';
  const gridColor = themeClasses.isLight ? '#D8E2EC' : '#34465A';
  const barColor = themeClasses.isLight ? '#517FCB' : '#8CB9E8';
  const labelColor = themeClasses.isLight ? '#172A43' : '#F2F6FA';
  const mutedColor = themeClasses.isLight ? '#5D7188' : '#A8B8C8';
  const markers = [
    { color: '#C46A2B', label: 'Mode', value: 12 },
    { color: '#39724A', label: 'Median', value: 16.5 },
    { color: '#8A4F7D', label: 'Mean', value: 18 },
  ];

  return (
    <figure
      className={cx(
        'grid gap-4 rounded-xl border p-4 sm:p-5',
        themeClasses.isLight ? 'border-[#205089]/12 bg-white' : 'border-[#A8D4FF]/14 bg-[#121A24]',
      )}
    >
      <div className="grid gap-2 sm:grid-cols-3">
        {markers.map((marker) => (
          <div
            key={marker.label}
            className={cx(
              'flex min-h-11 items-center justify-between gap-3 rounded-lg border px-3 py-2',
              themeClasses.isLight ? 'border-[#205089]/10 bg-[#F6F9FC]' : 'border-[#A8D4FF]/12 bg-[#172232]',
            )}
          >
            <span className="flex items-center gap-2 text-sm font-black" style={{ color: marker.color }}>
              <span className="h-5 w-1 rounded-full" style={{ backgroundColor: marker.color }} aria-hidden="true" />
              {marker.label}
            </span>
            <span className={cx('text-sm font-black tabular-nums', themeClasses.titleText)}>{marker.value} ms</span>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <svg
          aria-labelledby="descriptive-histogram-title descriptive-histogram-description"
          className="h-auto min-w-[42rem] w-full"
          role="img"
          viewBox="0 0 780 315"
        >
          <title id="descriptive-histogram-title">Histogram độ trễ và ba thước đo xu hướng trung tâm</title>
          <desc id="descriptive-histogram-description">
            Histogram của mười độ trễ từ 12 đến 30 mili-giây. Mode bằng 12, median bằng 16.5 và mean bằng 18 mili-giây.
          </desc>

          {[0, 1, 2, 3].map((count) => {
            const y = yForCount(count);
            return (
              <g key={count}>
                <line x1={plot.left} x2={plot.right} y1={y} y2={y} stroke={gridColor} strokeWidth="1" />
                <text x={plot.left - 14} y={y + 4} fill={mutedColor} fontSize="12" fontWeight="700" textAnchor="end">
                  {count}
                </text>
              </g>
            );
          })}

          {bins.map(({ count, value }, index) => {
            const height = count * 52;
            const x = plot.left + index * binWidth + 1;
            return (
              <g key={value}>
                {count > 0 ? (
                  <>
                    <rect
                      x={x}
                      y={plot.bottom - height}
                      width={binWidth - 2}
                      height={height}
                      rx="2"
                      fill={barColor}
                      opacity="0.88"
                    />
                    <text
                      x={x + (binWidth - 2) / 2}
                      y={plot.bottom - height - 8}
                      fill={labelColor}
                      fontSize="12"
                      fontWeight="800"
                      textAnchor="middle"
                    >
                      {count}
                    </text>
                  </>
                ) : null}
              </g>
            );
          })}

          {markers.map((marker) => {
            const x = xForValue(marker.value);
            return (
              <g key={marker.label}>
                <line
                  x1={x}
                  x2={x}
                  y1={plot.top}
                  y2={plot.bottom}
                  stroke={marker.color}
                  strokeDasharray="6 5"
                  strokeWidth="3"
                />
                <circle cx={x} cy={plot.top} r="4" fill={marker.color} />
              </g>
            );
          })}

          <line x1={plot.left} x2={plot.left} y1={plot.top} y2={plot.bottom} stroke={axisColor} strokeWidth="2" />
          <line x1={plot.left} x2={plot.right} y1={plot.bottom} y2={plot.bottom} stroke={axisColor} strokeWidth="2" />

          {[12, 15, 18, 21, 24, 27, 30].map((value) => (
            <g key={value}>
              <line x1={xForValue(value)} x2={xForValue(value)} y1={plot.bottom} y2={plot.bottom + 6} stroke={axisColor} strokeWidth="1.5" />
              <text x={xForValue(value)} y={plot.bottom + 23} fill={mutedColor} fontSize="12" fontWeight="700" textAnchor="middle">
                {value}
              </text>
            </g>
          ))}

          <text x={(plot.left + plot.right) / 2} y="302" fill={labelColor} fontSize="13" fontWeight="800" textAnchor="middle">
            Độ trễ phản hồi (ms)
          </text>
          <text x="17" y={(plot.top + plot.bottom) / 2} fill={labelColor} fontSize="13" fontWeight="800" textAnchor="middle" transform={`rotate(-90 17 ${(plot.top + plot.bottom) / 2})`}>
            Tần số
          </text>
        </svg>
      </div>

      <figcaption className={cx('text-center text-xs font-semibold leading-5', themeClasses.mutedText)}>
        Mỗi bin rộng 1 ms và được đặt tại giá trị nguyên tương ứng trong bộ dữ liệu.
      </figcaption>
    </figure>
  );
}

function IdealNormalCenterVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const plot = { bottom: 224, left: 72, right: 708, top: 62 };
  const centerX = (plot.left + plot.right) / 2;
  const curvePoints = Array.from({ length: 121 }, (_, index) => {
    const normalizedX = -3 + index * 0.05;
    return {
      x: plot.left + (index / 120) * (plot.right - plot.left),
      y: plot.bottom - Math.exp(-0.5 * normalizedX ** 2) * 142,
    };
  });
  const curvePath = curvePoints.map((point, index) => `${index ? 'L' : 'M'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ');
  const areaPath = `${curvePath} L ${plot.right} ${plot.bottom} L ${plot.left} ${plot.bottom} Z`;
  const axisColor = themeClasses.isLight ? '#7A8DA3' : '#A8B8C8';
  const curveColor = themeClasses.isLight ? '#517FCB' : '#8CB9E8';
  const centerColor = themeClasses.isLight ? '#7E405F' : '#D699B8';
  const labelColor = themeClasses.isLight ? '#172A43' : '#F2F6FA';
  const mutedColor = themeClasses.isLight ? '#5D7188' : '#A8B8C8';

  return (
    <figure
      className={cx(
        'grid gap-4 rounded-xl border p-4 sm:p-5',
        themeClasses.isLight ? 'border-[#205089]/12 bg-white' : 'border-[#A8D4FF]/14 bg-[#121A24]',
      )}
    >
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-black sm:text-base">
        {['Mean', 'Median', 'Mode'].map((label, index) => (
          <div key={label} className="contents">
            {index ? <span className={themeClasses.mutedText}>=</span> : null}
            <span className={cx(
              'rounded-lg border px-3 py-2',
              themeClasses.isLight ? 'border-[#7E405F]/15 bg-[#F7EDF3] text-[#7E405F]' : 'border-[#D699B8]/18 bg-[#D699B8]/9 text-[#F3CDE0]',
            )}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <svg
          aria-labelledby="ideal-normal-title ideal-normal-description"
          className="h-auto min-w-[38rem] w-full"
          role="img"
          viewBox="0 0 780 292"
        >
          <title id="ideal-normal-title">Phân phối chuẩn lý tưởng với Mean, Median và Mode trùng nhau</title>
          <desc id="ideal-normal-description">
            Đường cong chuông đối xứng có một đường thẳng tại tâm mu, là vị trí chung của trung bình, trung vị và yếu vị.
          </desc>

          <path d={areaPath} fill={curveColor} opacity="0.12" />
          <path d={curvePath} fill="none" stroke={curveColor} strokeLinecap="round" strokeWidth="4" />
          <line x1={plot.left} x2={plot.right} y1={plot.bottom} y2={plot.bottom} stroke={axisColor} strokeWidth="2" />
          <line x1={centerX} x2={centerX} y1={plot.top} y2={plot.bottom} stroke={centerColor} strokeDasharray="7 5" strokeWidth="4" />
          <circle cx={centerX} cy={plot.top + 20} r="6" fill={centerColor} />

          <rect x={centerX - 126} y="18" width="252" height="38" rx="10" fill={centerColor} opacity="0.12" />
          <text x={centerX} y="43" fill={centerColor} fontSize="15" fontWeight="900" textAnchor="middle">
            Mean = Median = Mode
          </text>
          <text x={centerX} y={plot.bottom + 25} fill={centerColor} fontSize="15" fontWeight="900" textAnchor="middle">
            μ
          </text>
          <text x={plot.left} y={plot.bottom + 25} fill={mutedColor} fontSize="12" fontWeight="700" textAnchor="middle">
            −3σ
          </text>
          <text x={plot.right} y={plot.bottom + 25} fill={mutedColor} fontSize="12" fontWeight="700" textAnchor="middle">
            +3σ
          </text>
          <text x={centerX} y="282" fill={labelColor} fontSize="13" fontWeight="800" textAnchor="middle">
            Tâm của phân phối chuẩn đối xứng
          </text>
        </svg>
      </div>

      <figcaption className={cx('text-center text-sm font-semibold leading-6', themeClasses.bodyText)}>
        Trong mô hình phân phối chuẩn lý tưởng, cả ba thước đo cùng chỉ một vị trí trung tâm. Với một mẫu hữu hạn lấy từ phân phối chuẩn, các giá trị ước lượng có thể vẫn lệch nhau đôi chút.
      </figcaption>
    </figure>
  );
}

function FrequencyStabilityVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const points = [
    [44, 44], [80, 156], [116, 62], [152, 145],
    [188, 74], [224, 133], [260, 84], [296, 124],
    [332, 92], [368, 118], [404, 98], [440, 113],
    [476, 102], [512, 109], [548, 104], [584, 107],
  ];
  const line = themeClasses.isLight ? '#205089' : '#A8D4FF';
  const target = themeClasses.isLight ? '#39724A' : '#9DDBAF';
  const axis = themeClasses.isLight ? '#9AAFC2' : '#667C91';

  return (
    <section
      aria-label="Tần suất quan sát dao động ngày càng ít và tiến gần xác suất lý thuyết khi số phép thử tăng"
      className={cx('rounded-xl px-3 py-4 sm:px-5 sm:py-5', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-3 flex items-center justify-between gap-4">
          <span className={cx('text-sm font-black', themeClasses.titleText)}>Tần suất quan sát</span>
          <MathText className={cx('text-sm font-semibold', themeClasses.mutedText)} formula="f_n(A)" />
        </div>

        <div className="relative">
          <svg viewBox="0 0 640 200" role="img" aria-label="Đường tần suất hội tụ về xác suất lý thuyết" className="h-auto w-full">
            <line x1="34" y1="18" x2="34" y2="176" stroke={axis} strokeWidth="2" />
            <line x1="34" y1="176" x2="610" y2="176" stroke={axis} strokeWidth="2" />
            <line x1="34" y1="106" x2="610" y2="106" stroke={target} strokeWidth="2" strokeDasharray="7 6" />
            <polyline
              points={points.map(([x, y]) => `${x},${y}`).join(' ')}
              fill="none"
              stroke={line}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
            {points.map(([x, y], index) => (
              <circle
                key={`${x}-${y}`}
                cx={x}
                cy={y}
                r={index < 8 ? 4 : 3.5}
                fill={themeClasses.isLight ? '#FFFFFF' : '#121A24'}
                stroke={line}
                strokeWidth="2.5"
              />
            ))}
            <text x="22" y="24" fill={axis} fontSize="11" fontWeight="700" textAnchor="end">1</text>
            <text x="22" y="180" fill={axis} fontSize="11" fontWeight="700" textAnchor="end">0</text>
          </svg>
          <MathText
            className={cx(
              'absolute right-1 top-[53%] -translate-y-1/2 rounded-md px-2 py-1 text-sm font-semibold',
              themeClasses.isLight ? 'bg-white text-[#2F6840]' : 'bg-[#121A24] text-[#9DDBAF]',
            )}
            formula="P(A)"
          />
        </div>

        <div className={cx('mt-1 flex items-center justify-between text-xs font-bold', themeClasses.mutedText)}>
          <span>Ít phép thử</span>
          <span>Nhiều phép thử</span>
        </div>
        <div className="mt-4 flex justify-center">
          <MathText className={cx('text-lg font-semibold', themeClasses.titleText)} formula="f_n(A)\longrightarrow P(A)\quad(n\to\infty)" />
        </div>
      </div>
    </section>
  );
}

function simulateCoinFlips(seed: number) {
  const totalFlips = 10_000;
  const frequencies = new Array<number>(totalFlips);
  const headsByFlip = new Array<number>(totalFlips);
  let state = seed >>> 0;
  let heads = 0;

  for (let flips = 1; flips <= totalFlips; flips += 1) {
    state = (Math.imul(1_664_525, state) + 1_013_904_223) >>> 0;
    if (state / 4_294_967_296 < 0.5) heads += 1;
    headsByFlip[flips - 1] = heads;
    frequencies[flips - 1] = heads / flips;
  }

  return { frequencies, headsByFlip, totalFlips };
}

function FrequencySimulationVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const [run, setRun] = useState(0);
  const [visibleFlips, setVisibleFlips] = useState(1);
  const [isRunning, setIsRunning] = useState(true);
  const simulation = useMemo(() => simulateCoinFlips(run + 1), [run]);
  const line = themeClasses.isLight ? '#205089' : '#A8D4FF';
  const target = themeClasses.isLight ? '#39724A' : '#9DDBAF';
  const axis = themeClasses.isLight ? '#9AAFC2' : '#667C91';
  const currentFrequency = simulation.frequencies[visibleFlips - 1] ?? 0;
  const currentHeads = simulation.headsByFlip[visibleFlips - 1] ?? 0;
  const chartPoints = useMemo(() => {
    const pointCount = Math.min(180, visibleFlips);
    const indices = new Set<number>([0, visibleFlips - 1]);

    for (let point = 0; point < pointCount; point += 1) {
      const ratio = pointCount === 1 ? 1 : point / (pointCount - 1);
      indices.add(Math.min(visibleFlips - 1, Math.round((visibleFlips ** ratio) - 1)));
    }

    return [...indices]
      .sort((left, right) => left - right)
      .map((index) => {
        const flips = index + 1;
        const frequency = simulation.frequencies[index] ?? 0;
        const x = 34 + (Math.log10(flips) / 4) * 502;
        const y = 16 + (1 - frequency) * 134;
        return [x, y] as const;
      });
  }, [simulation.frequencies, visibleFlips]);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setVisibleFlips(simulation.totalFlips);
      setIsRunning(false);
      return undefined;
    }

    let frame = 0;
    let startedAt: number | undefined;
    setVisibleFlips(1);
    setIsRunning(true);

    const advance = (timestamp: number) => {
      startedAt ??= timestamp;
      const progress = Math.min(1, (timestamp - startedAt) / 6_500);
      const nextFlips = Math.max(1, Math.round(simulation.totalFlips ** progress));
      setVisibleFlips(nextFlips);

      if (progress < 1) {
        frame = window.requestAnimationFrame(advance);
      } else {
        setIsRunning(false);
      }
    };

    frame = window.requestAnimationFrame(advance);
    return () => window.cancelAnimationFrame(frame);
  }, [run, simulation.totalFlips]);

  return (
    <section
      aria-label="Mô phỏng tần suất mặt sấp khi tung đồng xu từ mười đến mười nghìn lần"
      className={cx('rounded-xl px-3 py-4 sm:px-5 sm:py-5', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}
    >
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={cx(
              'grid h-10 w-10 place-items-center rounded-full',
              themeClasses.isLight ? 'bg-[#EAF1F7] text-[#205089]' : 'bg-[#A8D4FF]/10 text-[#A8D4FF]',
            )}>
              <CircleDot className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            </span>
            <div>
              <h3 className={cx('text-base font-black leading-6', themeClasses.titleText)}>Mô phỏng tung đồng xu</h3>
              <p className={cx('text-xs font-semibold leading-5', themeClasses.mutedText)}>Theo dõi tần suất xuất hiện mặt sấp</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setRun((currentRun) => currentRun + 1)}
            className={cx(
              'inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
              themeClasses.isLight
                ? 'bg-[#205089] text-white hover:bg-[#173F6C] focus-visible:outline-[#205089]'
                : 'bg-[#789CC2] text-[#121A24] hover:bg-[#8CB9E8] focus-visible:outline-[#A8D4FF]',
            )}
          >
            <RefreshCw className={cx('h-4 w-4 motion-reduce:animate-none', isRunning && 'animate-spin')} strokeWidth={2} aria-hidden="true" />
            {isRunning ? 'Đang mô phỏng' : 'Mô phỏng lại'}
          </button>
        </div>

        <div className="relative mt-5">
          <svg viewBox="0 0 560 185" role="img" aria-label="Đường tần suất mô phỏng tiến gần 0.5 khi số lần tung tăng dần" className="h-auto w-full">
            <line x1="34" y1="16" x2="34" y2="150" stroke={axis} strokeWidth="2" />
            <line x1="34" y1="150" x2="536" y2="150" stroke={axis} strokeWidth="2" />
            <line x1="34" y1="85" x2="536" y2="85" stroke={target} strokeWidth="2" strokeDasharray="7 6" />
            <polyline
              points={chartPoints.map(([x, y]) => `${x},${y}`).join(' ')}
              fill="none"
              stroke={line}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
            {chartPoints.length > 0 && (
              <circle
                cx={chartPoints[chartPoints.length - 1][0]}
                cy={chartPoints[chartPoints.length - 1][1]}
                r="5"
                fill={themeClasses.isLight ? '#FFFFFF' : '#121A24'}
                stroke={line}
                strokeWidth="3"
              />
            )}
            <text x="24" y="21" fill={axis} fontSize="11" fontWeight="700" textAnchor="end">1</text>
            <text x="24" y="154" fill={axis} fontSize="11" fontWeight="700" textAnchor="end">0</text>
            <text x="34" y="174" fill={axis} fontSize="11" fontWeight="700" textAnchor="middle">1</text>
            <text x="160" y="174" fill={axis} fontSize="11" fontWeight="700" textAnchor="middle">10</text>
            <text x="285" y="174" fill={axis} fontSize="11" fontWeight="700" textAnchor="middle">100</text>
            <text x="411" y="174" fill={axis} fontSize="11" fontWeight="700" textAnchor="middle">1.000</text>
            <text x="536" y="174" fill={axis} fontSize="11" fontWeight="700" textAnchor="middle">10.000</text>
          </svg>
          <MathText
            className={cx(
              'absolute right-1 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm font-semibold',
              themeClasses.isLight ? 'bg-white text-[#2F6840]' : 'bg-[#121A24] text-[#9DDBAF]',
            )}
            formula="P(S)=0.5"
          />
        </div>

        <div aria-live="polite" className="mt-2 grid grid-cols-3 gap-2">
          <div className={cx('grid gap-1 rounded-lg px-2 py-2.5 text-center sm:px-3', themeClasses.isLight ? 'bg-[#F5F8FB]' : 'bg-[#A8D4FF]/6')}>
            <span className={cx('text-xs font-bold', themeClasses.mutedText)}>Số lần tung</span>
            <strong className={cx('text-base tabular-nums sm:text-lg', themeClasses.titleText)}>{visibleFlips.toLocaleString('vi-VN')}</strong>
          </div>
          <div className={cx('grid gap-1 rounded-lg px-2 py-2.5 text-center sm:px-3', themeClasses.isLight ? 'bg-[#F5F8FB]' : 'bg-[#A8D4FF]/6')}>
            <span className={cx('text-xs font-bold', themeClasses.mutedText)}>Số mặt sấp</span>
            <strong className={cx('text-base tabular-nums sm:text-lg', themeClasses.titleText)}>{currentHeads.toLocaleString('vi-VN')}</strong>
          </div>
          <div className={cx('grid gap-1 rounded-lg px-2 py-2.5 text-center sm:px-3', themeClasses.isLight ? 'bg-[#F5F8FB]' : 'bg-[#A8D4FF]/6')}>
            <MathText className={cx('text-xs font-bold', themeClasses.mutedText)} formula="f(S)" />
            <strong className={cx('text-base tabular-nums sm:text-lg', themeClasses.titleText)}>{currentFrequency.toFixed(4)}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function ConditionalVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const clipId = useId().replaceAll(':', '');
  const palette = themeClasses.isLight
    ? {
        aFill: 'rgba(81,127,203,0.10)',
        aStroke: '#7FA9E5',
        bFill: 'rgba(120,201,144,0.18)',
        bStroke: '#78A98A',
        intersection: 'rgba(40,148,122,0.48)',
      }
    : {
        aFill: 'rgba(140,185,232,0.10)',
        aStroke: '#8CB9E8',
        bFill: 'rgba(157,219,175,0.14)',
        bStroke: '#9DDBAF',
        intersection: 'rgba(125,211,179,0.42)',
      };
  return (
    <section
      aria-label="Minh họa B trở thành không gian mẫu mới khi tính xác suất có điều kiện"
      className={cx('py-4', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}
    >
      <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className="grid justify-items-center gap-2">
          <h3 className={cx('text-sm font-black', themeClasses.titleText)}>Trong không gian ban đầu</h3>
          <div className="relative h-44 w-full max-w-[19rem]">
            <svg viewBox="0 0 304 176" role="img" aria-label="Hai biến cố A và B giao nhau" className="h-full w-full">
              <defs>
                <clipPath id={clipId}>
                  <circle cx="186" cy="88" r="64" />
                </clipPath>
              </defs>
              <circle cx="118" cy="88" r="64" fill={palette.aFill} />
              <circle cx="186" cy="88" r="64" fill={palette.bFill} />
              <circle cx="118" cy="88" r="64" fill={palette.intersection} clipPath={`url(#${clipId})`} />
              <circle cx="118" cy="88" r="64" fill="none" stroke={palette.aStroke} strokeWidth="2.5" />
              <circle cx="186" cy="88" r="64" fill="none" stroke={palette.bStroke} strokeWidth="2.5" />
            </svg>
            <MathText className={cx('absolute left-[25%] top-1/2 -translate-y-1/2 text-lg font-semibold', themeClasses.titleText)} formula="A" />
            <MathText className={cx('absolute right-[23%] top-1/2 -translate-y-1/2 text-lg font-semibold', themeClasses.titleText)} formula="B" />
            <MathText className={cx('absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold', themeClasses.titleText)} formula="A\cap B" />
          </div>
        </div>

        <div className="grid justify-items-center gap-1">
          <ArrowRight className={cx('h-6 w-6 rotate-90 md:rotate-0', themeClasses.accentText)} strokeWidth={2.2} aria-hidden="true" />
          <span className={cx('text-center text-xs font-bold leading-4', themeClasses.mutedText)}>
            Biết <MathText formula="B" /> đã xảy ra
          </span>
        </div>

        <div className="grid justify-items-center gap-4">
          <h3 className={cx('text-sm font-black', themeClasses.titleText)}>
            Không gian mẫu mới là <MathText formula="B" />
          </h3>
          <div className="w-full max-w-[19rem]">
            <div className={cx('flex h-24 overflow-hidden rounded-lg', themeClasses.isLight ? 'bg-[#E4F0E7]' : 'bg-[#9DDBAF]/12')}>
              <div className={cx('grid w-[38%] place-items-center px-2 text-center', themeClasses.isLight ? 'bg-[#6BC3A5] text-[#123E34]' : 'bg-[#7DD3B3]/55 text-[#F2F6FA]')}>
                <MathText className="text-sm font-semibold" formula="A\cap B" />
              </div>
              <div className={cx('grid flex-1 place-items-center px-2 text-center', themeClasses.bodyText)}>
                <MathText className="text-sm font-semibold" formula="B\setminus A" />
              </div>
            </div>
            <div className={cx('mt-2 grid border-t pt-2 text-center text-sm font-semibold', themeClasses.isLight ? 'border-[#39724A]/35' : 'border-[#9DDBAF]/30', themeClasses.titleText)}>
              <MathText formula="P(B)" />
            </div>
          </div>
          <p className={cx('w-full text-center text-sm leading-6', themeClasses.bodyText)}>
            Phần thuận lợi là <MathText formula="P(A\cap B)" /> trên toàn bộ không gian mới <MathText formula="P(B)" />.
          </p>
        </div>
      </div>
    </section>
  );
}

function TotalVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const partitions = [
    {
      event: 'A_1',
      Icon: Sun,
      label: 'Nắng',
      light: 'bg-[#FFF3C4]',
      dark: 'bg-[#F2C66D]/14',
      intersectionLight: 'bg-[#F2C66D] text-[#49340A]',
      intersectionDark: 'bg-[#F2C66D]/55 text-[#FFF7DE]',
    },
    {
      event: 'A_2',
      Icon: Cloud,
      label: 'Râm',
      light: 'bg-[#EAF1F7]',
      dark: 'bg-[#A8D4FF]/9',
      intersectionLight: 'bg-[#9FC0DD] text-[#173750]',
      intersectionDark: 'bg-[#8CB9E8]/45 text-[#EAF5FF]',
    },
    {
      event: 'A_3',
      Icon: CloudRain,
      label: 'Mưa',
      light: 'bg-[#E4F0E7]',
      dark: 'bg-[#9DDBAF]/10',
      intersectionLight: 'bg-[#82BD94] text-[#143A20]',
      intersectionDark: 'bg-[#78C990]/42 text-[#ECFFF1]',
    },
  ] as const;
  return (
    <section
      aria-label="Không gian mẫu được phân hoạch thành ba loại thời tiết và biến cố đi chơi tennis cắt qua từng phần"
      className={cx('py-4', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className={cx('text-sm font-black', themeClasses.titleText)}>Phân hoạch không gian mẫu</h3>
          <MathText className={cx('text-sm font-semibold', themeClasses.mutedText)} formula={"\\Omega=A_1\\cup A_2\\cup A_3"} />
        </div>
        <div className="grid min-h-52 grid-cols-3 overflow-hidden rounded-xl">
          {partitions.map(({ event, Icon, label, light, dark, intersectionLight, intersectionDark }) => (
            <div key={event} className={cx('grid grid-rows-[1fr_auto_1fr] place-items-center px-2 py-4 text-center', themeClasses.isLight ? light : dark)}>
              <div className="grid justify-items-center gap-1.5 self-end pb-3">
                <Icon className={cx('h-6 w-6', themeClasses.accentText)} strokeWidth={2} aria-hidden="true" />
                <MathText className={cx('text-base font-semibold', themeClasses.titleText)} formula={event} />
                <span className={cx('text-xs font-bold sm:text-sm', themeClasses.mutedText)}>{label}</span>
              </div>
              <div className={cx('grid h-16 w-[calc(100%+1rem)] place-items-center px-1', themeClasses.isLight ? intersectionLight : intersectionDark)}>
                <MathText className="text-sm font-semibold sm:text-base" formula={`H\\cap ${event}`} />
              </div>
              <span className={cx('self-start pt-3 text-xs font-bold leading-5 sm:text-sm', themeClasses.bodyText)}>Đi chơi tennis</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TotalSumVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const terms = [
    { Icon: Sun, formula: 'P(A_1)P(H\\mid A_1)', label: 'Trời nắng' },
    { Icon: Cloud, formula: 'P(A_2)P(H\\mid A_2)', label: 'Trời râm' },
    { Icon: CloudRain, formula: 'P(A_3)P(H\\mid A_3)', label: 'Trời mưa' },
  ] as const;
  return (
    <section
      aria-label="Ba nhánh thời tiết được cộng lại thành xác suất đi chơi tennis"
      className={cx('py-4', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}
    >
      <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(8rem,0.32fr)]">
        <div className="grid gap-2">
          {terms.map(({ Icon, formula, label }, index) => (
            <div key={formula} className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-3">
              <span className={cx(
                'grid h-10 w-10 place-items-center rounded-full',
                themeClasses.isLight ? 'bg-[#EAF1F7] text-[#205089]' : 'bg-[#A8D4FF]/9 text-[#A8D4FF]',
              )}>
                <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              </span>
              <div className={cx('flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-lg px-3 py-2.5', themeClasses.isLight ? 'bg-[#F5F8FB]' : 'bg-[#A8D4FF]/5')}>
                <span className={cx('text-xs font-bold', themeClasses.mutedText)}>{label}</span>
                <MathText className={cx('max-w-full overflow-x-auto text-sm font-semibold', themeClasses.titleText)} formula={formula} />
              </div>
              {index < terms.length - 1 ? (
                <span className={cx('col-span-2 -my-1 text-center text-lg font-black', themeClasses.mutedText)} aria-hidden="true">+</span>
              ) : null}
            </div>
          ))}
        </div>
        <ArrowRight className={cx('mx-auto h-6 w-6 rotate-90 md:rotate-0', themeClasses.accentText)} strokeWidth={2.2} aria-hidden="true" />
        <div className={cx(
          'grid min-h-28 place-items-center rounded-xl px-4 py-5 text-center',
          themeClasses.isLight ? 'bg-[#DDEAF5] text-[#123B68]' : 'bg-[#A8D4FF]/12 text-[#D7EAFE]',
        )}>
          <div>
            <span className="text-xs font-black">Tổng xác suất</span>
            <MathText className="mt-2 block text-2xl font-semibold" formula="P(H)" />
          </div>
        </div>
      </div>
    </section>
  );
}

function BayesVisual({ focus = 'all', themeClasses }: {
  focus?: 'all' | 'prior-posterior';
  themeClasses: LearningThemeClasses;
}) {
  const isPriorPosteriorFocus = focus === 'prior-posterior';
  const annotations = [
    {
      description: 'Xác suất quan sát thấy A nếu B đúng.',
      formula: 'P(A\\mid B)',
      label: 'Likelihood',
    },
    {
      description: 'Niềm tin vào B trước khi quan sát A.',
      formula: 'P(B)',
      label: 'Prior',
    },
    {
      description: 'Niềm tin vào B sau khi đã quan sát A.',
      formula: 'P(B\\mid A)',
      label: 'Posterior',
    },
    {
      description: 'Xác suất quan sát thấy A dưới mọi khả năng.',
      formula: 'P(A)',
      label: 'Margin',
    },
  ];
  const annotationClass = cx(
    'grid gap-1 rounded-lg px-4 py-3',
    themeClasses.isLight ? 'bg-[#F5F8FB]' : 'bg-[#A8D4FF]/6',
  );
  return (
    <section aria-label="Các thành phần trong công thức Bayes" className={cx('py-4', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}>
      <div className="grid gap-3 md:hidden">
        <div className="grid grid-cols-2 gap-2">
          <BayesFormulaTerm formula="P(B\mid A)" themeClasses={themeClasses} />
          <BayesFormulaTerm formula="P(B)" themeClasses={themeClasses} />
          <BayesFormulaTerm className={cx(isPriorPosteriorFocus && 'opacity-25')} formula="P(A\mid B)" themeClasses={themeClasses} />
          <BayesFormulaTerm className={cx(isPriorPosteriorFocus && 'opacity-25')} formula="P(A)" themeClasses={themeClasses} />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {annotations.map((item) => (
            <div
              key={item.label}
              className={cx(annotationClass, isPriorPosteriorFocus && (item.label === 'Likelihood' || item.label === 'Margin') && 'opacity-25')}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={cx('text-sm font-black', themeClasses.accentText)}>{item.label}</span>
                <MathText className={cx('text-sm font-semibold', themeClasses.titleText)} formula={item.formula} />
              </div>
              <p className={cx('text-xs leading-5', themeClasses.bodyText)}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto hidden max-w-5xl grid-cols-[1.15fr_2.5rem_1fr_1fr] items-center gap-x-4 gap-y-12 md:grid">
        <BayesAnnotation
          className="col-start-3 row-start-1"
          connector="down"
          description={<>Xác suất quan sát thấy <MathText formula="A" /> nếu <MathText formula="B" /> đúng.</>}
          dimmed={isPriorPosteriorFocus}
          label="Likelihood"
          surfaceClass={annotationClass}
          themeClasses={themeClasses}
        />

        <BayesAnnotation
          className="col-start-4 row-start-1"
          connector="down"
          description={<>Niềm tin vào <MathText formula="B" /> trước khi quan sát <MathText formula="A" />.</>}
          label="Prior"
          surfaceClass={annotationClass}
          themeClasses={themeClasses}
        />

        <BayesFormulaTerm className="col-start-1 row-start-2" formula="P(B\mid A)" themeClasses={themeClasses} />
        <span className={cx('col-start-2 row-start-2 text-center text-2xl font-black', themeClasses.titleText)}>=</span>
        <div className="col-span-2 col-start-3 row-start-2 grid self-center">
          <div className={cx('grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b pb-2', themeClasses.isLight ? 'border-[#172A43]' : 'border-[#F2F6FA]')}>
            <BayesFormulaTerm dimmed={isPriorPosteriorFocus} formula="P(A\mid B)" themeClasses={themeClasses} />
            <span className={cx('text-lg font-black', themeClasses.mutedText)} aria-hidden="true">×</span>
            <BayesFormulaTerm formula="P(B)" themeClasses={themeClasses} />
          </div>
          <BayesFormulaTerm className="mt-2 w-1/2 justify-self-center" dimmed={isPriorPosteriorFocus} formula="P(A)" themeClasses={themeClasses} />
        </div>

        <BayesAnnotation
          className="col-start-1 row-start-3"
          connector="up"
          description={<>Niềm tin vào <MathText formula="B" /> sau khi đã quan sát <MathText formula="A" />.</>}
          label="Posterior"
          surfaceClass={annotationClass}
          themeClasses={themeClasses}
        />

        <BayesAnnotation
          className="col-span-2 col-start-3 row-start-3 justify-self-center"
          connector="up"
          description={<>Xác suất quan sát thấy <MathText formula="A" /> dưới mọi khả năng.</>}
          dimmed={isPriorPosteriorFocus}
          label="Margin"
          surfaceClass={annotationClass}
          themeClasses={themeClasses}
        />
      </div>
      {isPriorPosteriorFocus ? (
        <div className="mt-5 flex justify-center">
          <MathText className={cx('text-xl font-semibold', themeClasses.titleText)} formula="P(B\mid A)=P(B)" />
        </div>
      ) : null}
    </section>
  );
}

function BayesFormulaTerm({ className, dimmed = false, formula, themeClasses }: {
  className?: string;
  dimmed?: boolean;
  formula: string;
  themeClasses: LearningThemeClasses;
}) {
  return (
    <span className={cx(
      'grid min-h-14 min-w-0 place-items-center rounded-lg px-3 py-2',
      themeClasses.isLight ? 'bg-[#E4F0E7]' : 'bg-[#78C990]/10',
      dimmed && 'opacity-25',
      className,
    )}>
      <MathText className={cx('max-w-full overflow-x-auto text-xl font-semibold', themeClasses.titleText)} formula={formula} />
    </span>
  );
}

function BayesAnnotation({ className, connector, description, dimmed = false, label, surfaceClass, themeClasses }: {
  className: string;
  connector: 'down' | 'up';
  description: React.ReactNode;
  dimmed?: boolean;
  label: string;
  surfaceClass: string;
  themeClasses: LearningThemeClasses;
}) {
  const connectorClass = connector === 'down'
    ? 'left-1/2 top-full h-12'
    : 'bottom-full left-1/2 h-12';
  return (
    <div className={cx('relative', dimmed && 'opacity-25', className)}>
      <span
        aria-hidden="true"
        className={cx(
          'pointer-events-none absolute w-px -translate-x-1/2',
          connectorClass,
          themeClasses.isLight ? 'bg-[#7890A6]' : 'bg-[#7894AD]',
        )}
      />
      <div className={cx(surfaceClass, 'relative')}>
        <span className={cx('text-base font-black', themeClasses.accentText)}>{label}</span>
        <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{description}</p>
      </div>
    </div>
  );
}

function BayesNormalizationVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const scenarios = [
    {
      title: 'Kịch bản 1: Dữ liệu củng cố niềm tin',
      students: [
        { name: 'An', studied: true, result: 'Đậu' },
        { name: 'Bình', studied: true, result: 'Đậu' },
        { name: 'Chi', studied: false, result: 'Đậu' },
        { name: 'Dũng', studied: true, result: 'Rớt' },
        { name: 'Hà', studied: false, result: 'Rớt' },
        { name: 'Lan', studied: false, result: 'Rớt' },
      ],
      likelihood: 'P(A\\mid B)=\\frac{2}{3}',
      likelihoodDescription: 'Trong 3 bạn đậu, 2 bạn có học bài.',
      posterior: 'P(B\\mid A)=\\frac{P(A\\mid B)P(B)}{P(A)}=\\frac{\\frac23\\times\\frac12}{\\frac12}=\\frac23',
      summary: 'Trong 3 học sinh có học bài, 2 bạn thi đậu.',
      change: 'Niềm tin tăng từ 50% lên khoảng 67%.',
      direction: 'increase',
    },
    {
      title: 'Kịch bản 2: Dữ liệu làm niềm tin giảm',
      students: [
        { name: 'An', studied: true, result: 'Đậu' },
        { name: 'Bình', studied: false, result: 'Đậu' },
        { name: 'Chi', studied: false, result: 'Đậu' },
        { name: 'Dũng', studied: true, result: 'Rớt' },
        { name: 'Hà', studied: true, result: 'Rớt' },
        { name: 'Lan', studied: false, result: 'Rớt' },
      ],
      likelihood: 'P(A\\mid B)=\\frac{1}{3}',
      likelihoodDescription: 'Trong 3 bạn đậu, chỉ 1 bạn có học bài.',
      posterior: 'P(B\\mid A)=\\frac{P(A\\mid B)P(B)}{P(A)}=\\frac{\\frac13\\times\\frac12}{\\frac12}=\\frac13',
      summary: 'Trong 3 học sinh có học bài, chỉ 1 bạn thi đậu.',
      change: 'Niềm tin giảm từ 50% xuống khoảng 33%.',
      direction: 'decrease',
    },
  ] as const;

  return (
    <section aria-label="Giáo viên thu thập dữ liệu để cập nhật niềm tin" className={cx('py-4', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}>
      {scenarios.map((scenario, scenarioIndex) => (
        <div key={scenario.title} className={cx(scenarioIndex > 0 && 'mt-12')}>
          <h3 className={cx('!mb-4 !mt-0 text-base font-black', themeClasses.titleText)}>{scenario.title}</h3>

          <div className="grid items-start gap-8 lg:grid-cols-2">
            <div className="min-w-0 overflow-x-auto">
              <table className="!m-0 !w-full min-w-[30rem] table-fixed border-collapse text-left">
                <caption className="sr-only">{scenario.title}</caption>
                <thead>
                  <tr className={themeClasses.isLight ? 'bg-[#EEF4F8]' : 'bg-[#A8D4FF]/8'}>
                    <th className="w-[24%] rounded-l-lg px-4 py-3 text-xs font-black">Học sinh</th>
                    <th className="w-[46%] px-4 py-3 text-xs font-black">Học trước khi thi</th>
                    <th className="w-[30%] rounded-r-lg px-4 py-3 text-xs font-black">Kết quả</th>
                  </tr>
                </thead>
                <tbody className={cx('divide-y', themeClasses.isLight ? 'divide-[#DCE5ED]' : 'divide-[#A8D4FF]/12')}>
                  {scenario.students.map((student) => (
                    <tr key={student.name}>
                      <td className={cx('px-4 py-3 text-sm font-bold', themeClasses.titleText)}>{student.name}</td>
                      <td className={cx('px-4 py-3 text-sm', themeClasses.bodyText)}>
                        {student.studied ? 'Có' : 'Không'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cx(
                          'inline-flex min-w-14 justify-center rounded-full px-2.5 py-1 text-xs font-black',
                          student.result === 'Đậu'
                            ? themeClasses.isLight ? 'bg-[#DDEFE3] text-[#205B34]' : 'bg-[#78C990]/16 text-[#AEE7BE]'
                            : themeClasses.isLight ? 'bg-[#F5E5D4] text-[#7B4515]' : 'bg-[#F2C66D]/14 text-[#F7D99B]',
                        )}>
                          {student.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h4 className={cx('!m-0 text-sm font-black', themeClasses.titleText)}>Đọc từng thành phần từ bảng</h4>

              <div className={cx('mt-3 divide-y', themeClasses.isLight ? 'divide-[#DCE5ED]' : 'divide-[#A8D4FF]/12')}>
                <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 py-3">
                  <span className={cx('text-sm font-black', themeClasses.accentText)}>Prior</span>
                  <div>
                    <MathText className={cx('block overflow-x-auto text-base font-semibold', themeClasses.titleText)} formula="P(B)=\frac{3}{6}=\frac12" />
                    <span className={cx('mt-1 block text-xs leading-5', themeClasses.mutedText)}>3 trong 6 học sinh thi đậu.</span>
                  </div>
                </div>

                <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 py-3">
                  <span className={cx('text-sm font-black', themeClasses.accentText)}>Likelihood</span>
                  <div>
                    <MathText className={cx('block overflow-x-auto text-base font-semibold', themeClasses.titleText)} formula={scenario.likelihood} />
                    <span className={cx('mt-1 block text-xs leading-5', themeClasses.mutedText)}>{scenario.likelihoodDescription}</span>
                  </div>
                </div>

                <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 py-3">
                  <span className={cx('text-sm font-black', themeClasses.accentText)}>Margin</span>
                  <div>
                    <MathText className={cx('block overflow-x-auto text-base font-semibold', themeClasses.titleText)} formula="P(A)=\frac{3}{6}=\frac12" />
                    <span className={cx('mt-1 block text-xs leading-5', themeClasses.mutedText)}>3 trong 6 học sinh có học bài.</span>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <span className={cx('text-xs font-black', themeClasses.mutedText)}>Thay số vào công thức Bayes</span>
                <MathText
                  className={cx('mt-3 block max-w-full overflow-x-auto text-lg font-semibold', themeClasses.titleText)}
                  formula={scenario.posterior}
                />
                <p className={cx('mt-3 text-sm leading-6', themeClasses.bodyText)}>
                  {scenario.summary}{' '}
                  <strong className={cx(
                    scenario.direction === 'increase'
                      ? themeClasses.isLight ? 'text-[#2D7646]' : 'text-[#8ED8A4]'
                      : themeClasses.isLight ? 'text-[#A05218]' : 'text-[#F0B172]',
                  )}>
                    {scenario.change}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function NaiveBayesCombinationsVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const combinations = [
    ['Có', 'Có', 'Có'],
    ['Có', 'Có', 'Không'],
    ['Có', 'Không', 'Có'],
    ['Có', 'Không', 'Không'],
    ['Không', 'Có', 'Có'],
    ['Không', 'Có', 'Không'],
    ['Không', 'Không', 'Có'],
    ['Không', 'Không', 'Không'],
  ];
  const growth = Array.from({ length: 9 }, (_, index) => {
    const featureCount = index + 2;
    return { featureCount, combinations: 2 ** featureCount };
  });
  return (
    <section aria-label="Số tổ hợp tăng theo số lượng feature nhị phân" className={cx('py-3', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}>
      <div className="mx-auto grid max-w-5xl items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <div className="min-w-0">
          <div className="mb-4">
            <span className={cx('text-sm font-black', themeClasses.titleText)}>Ước lượng từng tổ hợp</span>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[30rem]">
              <div className={cx('grid grid-cols-[2.5rem_repeat(3,1fr)] gap-x-3 px-3 pb-2 text-center text-xs font-black', themeClasses.mutedText)}>
                <span>#</span>
                <span>Học bài</span>
                <span>Nộp bài</span>
                <span>Đi học đều</span>
              </div>
              <div className={cx('divide-y', themeClasses.isLight ? 'divide-[#DCE5ED]' : 'divide-[#A8D4FF]/12')}>
                {combinations.map((combination, index) => (
                  <div key={combination.join(`-${index}`)} className="grid grid-cols-[2.5rem_repeat(3,1fr)] gap-x-3 px-3 py-2 text-center">
                    <span className={cx('text-xs font-black', themeClasses.mutedText)}>{index + 1}</span>
                    {combination.map((value, valueIndex) => (
                      <span
                        key={`${value}-${valueIndex}`}
                        className={cx(
                          'text-sm font-bold',
                          value === 'Có'
                            ? themeClasses.isLight ? 'text-[#2D7646]' : 'text-[#8ED8A4]'
                            : themeClasses.mutedText,
                        )}
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <span className={cx('text-sm font-black', themeClasses.titleText)}>Khi số feature tăng</span>
            <span className={cx('text-xs font-bold', themeClasses.mutedText)}>Số tổ hợp</span>
          </div>
          <div className="grid gap-2.5">
            {growth.map(({ combinations: count, featureCount }) => (
              <div key={featureCount} className="grid grid-cols-[4.5rem_minmax(0,1fr)_3.5rem] items-center gap-3">
                <span className={cx('text-xs font-bold', themeClasses.mutedText)}>{featureCount} feature</span>
                <div className={cx('h-2 overflow-hidden rounded-full', themeClasses.isLight ? 'bg-[#E7EDF2]' : 'bg-[#A8D4FF]/10')}>
                  <div
                    className={cx('h-full rounded-full', themeClasses.isLight ? 'bg-[#5D92C7]' : 'bg-[#8EBBE3]')}
                    style={{ width: `${Math.max((count / 1024) * 100, 1.5)}%` }}
                  />
                </div>
                <span className={cx('text-right text-xs font-black tabular-nums', themeClasses.titleText)}>
                  {count.toLocaleString('vi-VN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function NaiveBayesExerciseVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const students = [
    { name: 'An', studied: true, submitted: true, attended: true, result: 'Đậu' },
    { name: 'Bình', studied: true, submitted: true, attended: true, result: 'Đậu' },
    { name: 'Chi', studied: true, submitted: false, attended: true, result: 'Đậu' },
    { name: 'Dũng', studied: false, submitted: true, attended: true, result: 'Đậu' },
    { name: 'Hà', studied: true, submitted: true, attended: false, result: 'Rớt' },
    { name: 'Lan', studied: false, submitted: true, attended: true, result: 'Rớt' },
    { name: 'Minh', studied: false, submitted: false, attended: false, result: 'Rớt' },
    { name: 'Nga', studied: false, submitted: false, attended: false, result: 'Rớt' },
  ] as const;
  const featureTables = [
    {
      label: 'Học bài',
      rows: [
        { value: 'Có', pass: '\\frac34', fail: '\\frac14' },
        { value: 'Không', pass: '\\frac14', fail: '\\frac34' },
      ],
    },
    {
      label: 'Nộp bài',
      rows: [
        { value: 'Có', pass: '\\frac34', fail: '\\frac12' },
        { value: 'Không', pass: '\\frac14', fail: '\\frac12' },
      ],
    },
    {
      label: 'Đi học đều',
      rows: [
        { value: 'Có', pass: '1', fail: '\\frac14' },
        { value: 'Không', pass: '0', fail: '\\frac34' },
      ],
    },
  ];
  const cellClass = cx('px-4 py-3', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]');
  return (
    <section aria-label="Từ dữ liệu học sinh đến bảng prior và likelihood" className={cx('grid gap-6 py-2', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}>
      <div className="overflow-x-auto">
        <h3 className={cx('!mb-3 !mt-0 text-sm font-black', themeClasses.titleText)}>1. Dữ liệu huấn luyện</h3>
        <div className={cx(
          'grid min-w-[44rem] grid-cols-[7rem_repeat(3,minmax(7rem,1fr))_7rem] gap-px overflow-hidden rounded-lg text-sm',
          themeClasses.isLight ? 'bg-[#D7E1EA]' : 'bg-[#344454]',
        )}>
          {['Học sinh', 'Có học bài', 'Có nộp bài', 'Đi học đều', 'Kết quả'].map((label) => (
            <div key={label} className={cx('px-3 py-3 text-center font-black first:text-left', themeClasses.isLight ? 'bg-[#EEF4F8]' : 'bg-[#A8D4FF]/8', themeClasses.titleText)}>
              {label}
            </div>
          ))}
          {students.map((student) => (
            <div key={student.name} className="contents">
              <div className={cx(cellClass, 'font-bold', themeClasses.titleText)}>{student.name}</div>
              {[student.studied, student.submitted, student.attended].map((value, index) => (
                <div key={`${student.name}-${index}`} className={cx(cellClass, 'text-center', themeClasses.bodyText)}>
                  {value ? 'Có' : 'Không'}
                </div>
              ))}
              <div className={cx(cellClass, 'text-center')}>
                <span className={cx(
                  'inline-flex min-w-14 justify-center rounded-full px-2.5 py-1 text-xs font-black',
                  student.result === 'Đậu'
                    ? themeClasses.isLight ? 'bg-[#DDEFE3] text-[#205B34]' : 'bg-[#78C990]/16 text-[#AEE7BE]'
                    : themeClasses.isLight ? 'bg-[#F5E5D4] text-[#7B4515]' : 'bg-[#F2C66D]/14 text-[#F7D99B]',
                )}>
                  {student.result}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ArrowRight className={cx('mx-auto h-6 w-6 rotate-90', themeClasses.accentText)} strokeWidth={2.2} aria-hidden="true" />

      <div className="overflow-x-auto">
        <h3 className={cx('!mb-3 !mt-0 text-sm font-black', themeClasses.titleText)}>2. Đếm riêng trong từng class</h3>
        <div className={cx(
          'mx-auto mb-7 grid max-w-3xl grid-cols-[minmax(8rem,1fr)_minmax(7rem,0.8fr)_minmax(8rem,1fr)] gap-px overflow-hidden rounded-lg text-sm',
          themeClasses.isLight ? 'bg-[#D7E1EA]' : 'bg-[#344454]',
        )}>
          <div className={cx('px-4 py-3 font-black', themeClasses.isLight ? 'bg-[#EEF4F8]' : 'bg-[#A8D4FF]/8', themeClasses.titleText)}>Class</div>
          <div className={cx('px-4 py-3 text-center font-black', themeClasses.isLight ? 'bg-[#EEF4F8]' : 'bg-[#A8D4FF]/8', themeClasses.titleText)}>Số học sinh</div>
          <div className={cx('px-4 py-3 text-center font-black', themeClasses.isLight ? 'bg-[#EEF4F8]' : 'bg-[#A8D4FF]/8', themeClasses.titleText)}>Prior</div>
          <div className={cx(cellClass, 'font-bold', themeClasses.bodyText)}>Đậu</div>
          <div className={cx(cellClass, 'text-center', themeClasses.bodyText)}>4</div>
          <div className={cx(cellClass, 'text-center')}>
            <MathText className={cx('font-semibold', themeClasses.titleText)} formula="\frac48=\frac12" />
          </div>
          <div className={cx(cellClass, 'font-bold', themeClasses.bodyText)}>Rớt</div>
          <div className={cx(cellClass, 'text-center', themeClasses.bodyText)}>4</div>
          <div className={cx(cellClass, 'text-center')}>
            <MathText className={cx('font-semibold', themeClasses.titleText)} formula="\frac48=\frac12" />
          </div>
        </div>

        <div className="mx-auto grid max-w-3xl gap-6">
          {featureTables.map((feature) => (
            <div key={feature.label}>
              <h4 className={cx('!mb-2 !mt-0 text-sm font-black', themeClasses.titleText)}>{feature.label}</h4>
              <div className={cx(
                'grid min-w-[30rem] grid-cols-[minmax(7rem,1fr)_minmax(9rem,1fr)_minmax(9rem,1fr)] gap-px overflow-hidden rounded-lg text-sm',
                themeClasses.isLight ? 'bg-[#D7E1EA]' : 'bg-[#344454]',
              )}>
                <div className={cx('px-3 py-3 font-black', themeClasses.isLight ? 'bg-[#EEF4F8]' : 'bg-[#A8D4FF]/8', themeClasses.titleText)}>Giá trị</div>
                <div className={cx('px-3 py-3 text-center font-black', themeClasses.isLight ? 'bg-[#E4F0E7]' : 'bg-[#78C990]/12', themeClasses.titleText)}>
                  P({feature.label} | Đậu)
                </div>
                <div className={cx('px-3 py-3 text-center font-black', themeClasses.isLight ? 'bg-[#F8EBD6]' : 'bg-[#F2C66D]/10', themeClasses.titleText)}>
                  P({feature.label} | Rớt)
                </div>
                {feature.rows.map((row) => (
                  <div key={row.value} className="contents">
                    <div className={cx(cellClass, 'font-bold', themeClasses.bodyText)}>{row.value}</div>
                    <div className={cx(cellClass, 'text-center')}>
                      <MathText className={cx('font-semibold', themeClasses.titleText)} formula={row.pass} />
                    </div>
                    <div className={cx(cellClass, 'text-center')}>
                      <MathText className={cx('font-semibold', themeClasses.titleText)} formula={row.fail} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NaiveBayesLaplaceVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const students = [
    { name: 'An', submitted: true, result: 'Đậu' },
    { name: 'Bình', submitted: true, result: 'Đậu' },
    { name: 'Chi', submitted: true, result: 'Đậu' },
    { name: 'Dũng', submitted: true, result: 'Rớt' },
    { name: 'Hà', submitted: false, result: 'Rớt' },
    { name: 'Lan', submitted: false, result: 'Rớt' },
  ] as const;
  const beforeRows = [
    { value: 'Có', pass: '\\frac33=1', fail: '\\frac13' },
    { value: 'Không', pass: '\\frac03=0', fail: '\\frac23' },
  ];
  const afterRows = [
    { value: 'Có', pass: '\\frac{3+1}{3+2}=\\frac45', fail: '\\frac{1+1}{3+2}=\\frac25' },
    { value: 'Không', pass: '\\frac{0+1}{3+2}=\\frac15', fail: '\\frac{2+1}{3+2}=\\frac35' },
  ];
  const cellClass = cx('px-4 py-3', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]');
  const probabilityTable = (rows: typeof beforeRows | typeof afterRows, highlightZero = false) => (
    <div className={cx(
      'grid min-w-[34rem] grid-cols-[minmax(7rem,0.8fr)_minmax(11rem,1fr)_minmax(11rem,1fr)] gap-px overflow-hidden rounded-lg text-sm',
      themeClasses.isLight ? 'bg-[#D7E1EA]' : 'bg-[#344454]',
    )}>
      <div className={cx('px-4 py-3 font-black', themeClasses.isLight ? 'bg-[#EEF4F8]' : 'bg-[#A8D4FF]/8', themeClasses.titleText)}>Giá trị</div>
      <div className={cx('px-4 py-3 text-center font-black', themeClasses.isLight ? 'bg-[#E4F0E7]' : 'bg-[#78C990]/12', themeClasses.titleText)}>P(Nộp bài | Đậu)</div>
      <div className={cx('px-4 py-3 text-center font-black', themeClasses.isLight ? 'bg-[#F8EBD6]' : 'bg-[#F2C66D]/10', themeClasses.titleText)}>P(Nộp bài | Rớt)</div>
      {rows.map((row) => (
        <div key={row.value} className="contents">
          <div className={cx(cellClass, 'font-bold', themeClasses.bodyText)}>{row.value}</div>
          <div className={cx(
            cellClass,
            'text-center',
            highlightZero && row.value === 'Không' && (themeClasses.isLight ? '!bg-[#FCE9DC]' : '!bg-[#E48A44]/12'),
          )}>
            <MathText className={cx('font-semibold', themeClasses.titleText)} formula={row.pass} />
          </div>
          <div className={cx(cellClass, 'text-center')}>
            <MathText className={cx('font-semibold', themeClasses.titleText)} formula={row.fail} />
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <section aria-label="Từ dữ liệu có xác suất bằng không đến Laplace smoothing" className={cx('grid gap-6 py-2', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}>
      <div className="overflow-x-auto">
        <h3 className={cx('!mb-3 !mt-0 text-sm font-black', themeClasses.titleText)}>1. Dữ liệu huấn luyện</h3>
        <div className={cx(
          'grid min-w-[28rem] grid-cols-[minmax(7rem,0.8fr)_minmax(10rem,1fr)_minmax(7rem,0.8fr)] gap-px overflow-hidden rounded-lg text-sm',
          themeClasses.isLight ? 'bg-[#D7E1EA]' : 'bg-[#344454]',
        )}>
          {['Học sinh', 'Có nộp bài', 'Kết quả'].map((label) => (
            <div key={label} className={cx('px-4 py-3 text-center font-black first:text-left', themeClasses.isLight ? 'bg-[#EEF4F8]' : 'bg-[#A8D4FF]/8', themeClasses.titleText)}>
              {label}
            </div>
          ))}
          {students.map((student) => (
            <div key={student.name} className="contents">
              <div className={cx(cellClass, 'font-bold', themeClasses.titleText)}>{student.name}</div>
              <div className={cx(cellClass, 'text-center', themeClasses.bodyText)}>{student.submitted ? 'Có' : 'Không'}</div>
              <div className={cx(cellClass, 'text-center')}>
                <span className={cx(
                  'inline-flex min-w-14 justify-center rounded-full px-2.5 py-1 text-xs font-black',
                  student.result === 'Đậu'
                    ? themeClasses.isLight ? 'bg-[#DDEFE3] text-[#205B34]' : 'bg-[#78C990]/16 text-[#AEE7BE]'
                    : themeClasses.isLight ? 'bg-[#F5E5D4] text-[#7B4515]' : 'bg-[#F2C66D]/14 text-[#F7D99B]',
                )}>
                  {student.result}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ArrowRight className={cx('mx-auto h-6 w-6 rotate-90', themeClasses.accentText)} strokeWidth={2.2} aria-hidden="true" />

      <div className="overflow-x-auto">
        <h3 className={cx('!mb-3 !mt-0 text-sm font-black', themeClasses.titleText)}>2. Đếm riêng trong từng class</h3>
        <div className={cx(
          'mx-auto mb-5 grid max-w-3xl grid-cols-[minmax(8rem,1fr)_minmax(7rem,0.8fr)_minmax(8rem,1fr)] gap-px overflow-hidden rounded-lg text-sm',
          themeClasses.isLight ? 'bg-[#D7E1EA]' : 'bg-[#344454]',
        )}>
          <div className={cx('px-4 py-3 font-black', themeClasses.isLight ? 'bg-[#EEF4F8]' : 'bg-[#A8D4FF]/8', themeClasses.titleText)}>Class</div>
          <div className={cx('px-4 py-3 text-center font-black', themeClasses.isLight ? 'bg-[#EEF4F8]' : 'bg-[#A8D4FF]/8', themeClasses.titleText)}>Số học sinh</div>
          <div className={cx('px-4 py-3 text-center font-black', themeClasses.isLight ? 'bg-[#EEF4F8]' : 'bg-[#A8D4FF]/8', themeClasses.titleText)}>Prior</div>
          {[
            { label: 'Đậu', formula: '\\frac36=\\frac12' },
            { label: 'Rớt', formula: '\\frac36=\\frac12' },
          ].map((row) => (
            <div key={row.label} className="contents">
              <div className={cx(cellClass, 'font-bold', themeClasses.bodyText)}>{row.label}</div>
              <div className={cx(cellClass, 'text-center', themeClasses.bodyText)}>3</div>
              <div className={cx(cellClass, 'text-center')}>
                <MathText className={cx('font-semibold', themeClasses.titleText)} formula={row.formula} />
              </div>
            </div>
          ))}
        </div>
        <div className="mx-auto max-w-3xl">{probabilityTable(beforeRows, true)}</div>
        <p className={cx('mx-auto mt-4 max-w-3xl text-sm leading-6', themeClasses.bodyText)}>
          Ô <strong>Không nộp bài | Đậu</strong> có likelihood bằng <MathText formula="0" />, nên chỉ một thừa số này cũng làm score của class Đậu bằng <MathText formula="0" />.
        </p>
      </div>

      <ArrowRight className={cx('mx-auto h-6 w-6 rotate-90', themeClasses.accentText)} strokeWidth={2.2} aria-hidden="true" />

      <div className="overflow-x-auto">
        <h3 className={cx('!mb-3 !mt-0 text-sm font-black', themeClasses.titleText)}>3. Laplace smoothing: cộng 1 vào mỗi lượt đếm</h3>
        <p className={cx('mx-auto mb-4 max-w-3xl text-sm leading-6', themeClasses.bodyText)}>
          Để khắc phục, ta cộng <MathText formula="1" /> vào tử số của <strong>tất cả</strong> <MathText formula="K" /> giá trị, không chỉ ô đang bằng <MathText formula="0" />. Tổng lượt đếm vì thế tăng thêm <MathText formula="K" />, nên mẫu số cũng phải đổi từ <MathText formula="N_i" /> thành <MathText formula="N_i+K" /> để tổng xác suất vẫn bằng <MathText formula="1" />.
        </p>
        <div className="mx-auto max-w-3xl">{probabilityTable(afterRows)}</div>
      </div>
    </section>
  );
}

function NaiveBayesPracticalVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  return (
    <section aria-label="Hai điều chỉnh giúp Naive Bayes ổn định trong thực tế" className={cx('grid gap-5 py-4 md:grid-cols-2', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}>
      <div className="grid content-start gap-3">
        <h3 className={cx('text-sm font-black', themeClasses.titleText)}>Tránh underflow</h3>
        <div className={cx('grid gap-2 rounded-xl px-4 py-4 text-center', themeClasses.isLight ? 'bg-[#F5F8FB]' : 'bg-[#A8D4FF]/5')}>
          <MathText className={cx('text-sm font-semibold', themeClasses.mutedText)} formula="\prod_k P(X_k\mid C_i)\approx 0" />
          <span className={cx('text-lg font-black', themeClasses.accentText)} aria-hidden="true">↓</span>
          <MathText className={cx('text-sm font-semibold', themeClasses.titleText)} formula="\sum_k\log P(X_k\mid C_i)" />
        </div>
        <p className={cx('text-sm leading-6', themeClasses.bodyText)}>Đổi phép nhân các số rất nhỏ thành phép cộng log ổn định hơn.</p>
      </div>
      <div className="grid content-start gap-3">
        <h3 className={cx('text-sm font-black', themeClasses.titleText)}>Tránh xác suất bằng 0</h3>
        <div className={cx('grid gap-2 rounded-xl px-4 py-4 text-center', themeClasses.isLight ? 'bg-[#F5F8FB]' : 'bg-[#A8D4FF]/5')}>
          <MathText className={cx('text-sm font-semibold', themeClasses.mutedText)} formula="N_{ik}=0" />
          <span className={cx('text-lg font-black', themeClasses.accentText)} aria-hidden="true">↓</span>
          <MathText className={cx('text-sm font-semibold', themeClasses.titleText)} formula="\hat P=\frac{N_{ik}+1}{N_i+K}" />
        </div>
        <p className={cx('text-sm leading-6', themeClasses.bodyText)}>Laplace smoothing dành một lượng xác suất nhỏ cho giá trị chưa từng xuất hiện.</p>
      </div>
    </section>
  );
}

function NaiveBayesTradeoffsVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const advantages = [
    'Huấn luyện và dự đoán nhanh vì chỉ cần ước lượng prior và likelihood.',
    'Dùng được cho feature phân loại hoặc số khi chọn mô hình likelihood phù hợp.',
    'Có thể cập nhật các thống kê đếm khi dữ liệu mới xuất hiện.',
    'Có thể xử lý giá trị thiếu nếu implementation hỗ trợ bỏ qua hoặc mô hình hóa feature bị thiếu.',
    'Feature không liên quan thường ít ảnh hưởng nếu likelihood của nó gần giống nhau giữa các class.',
  ];
  return (
    <section aria-label="Ưu điểm và hạn chế của Naive Bayes" className={cx('grid gap-9 py-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}>
      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className={cx('grid h-9 w-9 place-items-center rounded-full', themeClasses.isLight ? 'bg-[#DDEFE3] text-[#2D7646]' : 'bg-[#78C990]/14 text-[#8ED8A4]')}>
            <Check className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
          </span>
          <h3 className={cx('!m-0 text-base font-black', themeClasses.titleText)}>Ưu điểm</h3>
        </div>
        <ul className={cx('divide-y', themeClasses.isLight ? 'divide-[#DCE5ED]' : 'divide-[#A8D4FF]/12')}>
          {advantages.map((advantage) => (
            <li key={advantage} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3 py-3 first:pt-0">
              <Check className={cx('mt-1 h-4 w-4', themeClasses.isLight ? 'text-[#2D7646]' : 'text-[#8ED8A4]')} strokeWidth={2.4} aria-hidden="true" />
              <span className={cx('text-sm leading-6', themeClasses.bodyText)}>{advantage}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className={cx('grid h-9 w-9 place-items-center rounded-full', themeClasses.isLight ? 'bg-[#F5E5D4] text-[#A05218]' : 'bg-[#F2C66D]/12 text-[#F0B172]')}>
            <TriangleAlert className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
          </span>
          <h3 className={cx('!m-0 text-base font-black', themeClasses.titleText)}>Hạn chế</h3>
        </div>

        <div className="grid gap-2">
          <div className="grid grid-cols-2 gap-3">
            <div className={cx('rounded-lg px-3 py-3 text-center', themeClasses.isLight ? 'bg-[#EEF4F8]' : 'bg-[#A8D4FF]/7')}>
              <MathText className={cx('block font-semibold', themeClasses.titleText)} formula="X_1" />
              <span className={cx('mt-1 block text-xs', themeClasses.mutedText)}>Feature thứ nhất</span>
            </div>
            <div className={cx('rounded-lg px-3 py-3 text-center', themeClasses.isLight ? 'bg-[#EEF4F8]' : 'bg-[#A8D4FF]/7')}>
              <MathText className={cx('block font-semibold', themeClasses.titleText)} formula="X_2" />
              <span className={cx('mt-1 block text-xs', themeClasses.mutedText)}>Feature tương quan</span>
            </div>
          </div>
          <ArrowRight className={cx('mx-auto h-5 w-5 rotate-90', themeClasses.mutedText)} aria-hidden="true" />
          <div className={cx('rounded-lg px-4 py-3 text-center text-sm font-bold', themeClasses.isLight ? 'bg-[#F8EBD6] text-[#704514]' : 'bg-[#F2C66D]/10 text-[#F4D597]')}>
            Cùng mang một tín hiệu
          </div>
          <ArrowRight className={cx('mx-auto h-5 w-5 rotate-90', themeClasses.mutedText)} aria-hidden="true" />
          <div className={cx('rounded-lg px-4 py-3 text-center text-sm font-black', themeClasses.isLight ? 'bg-[#F5E5D4] text-[#8A4716]' : 'bg-[#E48A44]/12 text-[#F0B172]')}>
            Bị nhân như hai bằng chứng riêng → xác suất quá tự tin
          </div>
        </div>

        <p className={cx('mt-5 text-sm leading-6', themeClasses.bodyText)}>
          Giả định độc lập có điều kiện thường không hoàn toàn đúng trong thực tế. Khi các feature có tương quan mạnh, mô hình có thể đếm lặp cùng một tín hiệu. Dù vậy, Naive Bayes vẫn thường cho kết quả phân loại tốt khi xấp xỉ này đủ phù hợp với dữ liệu.
        </p>
      </div>
    </section>
  );
}

function PlayTennisDataVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const rows = [
    ['D1', 'Sunny', 'Hot', 'High', 'Weak', 'No'],
    ['D2', 'Sunny', 'Hot', 'High', 'Strong', 'No'],
    ['D3', 'Overcast', 'Hot', 'High', 'Weak', 'Yes'],
    ['D4', 'Rain', 'Mild', 'High', 'Weak', 'Yes'],
    ['D5', 'Rain', 'Cool', 'Normal', 'Weak', 'Yes'],
    ['D6', 'Rain', 'Cool', 'Normal', 'Strong', 'No'],
    ['D7', 'Overcast', 'Cool', 'Normal', 'Strong', 'Yes'],
    ['D8', 'Sunny', 'Mild', 'High', 'Weak', 'No'],
    ['D9', 'Sunny', 'Cool', 'Normal', 'Weak', 'Yes'],
    ['D10', 'Rain', 'Mild', 'Normal', 'Weak', 'Yes'],
    ['D11', 'Sunny', 'Mild', 'Normal', 'Strong', 'Yes'],
    ['D12', 'Overcast', 'Mild', 'High', 'Strong', 'Yes'],
    ['D13', 'Overcast', 'Hot', 'Normal', 'Weak', 'Yes'],
    ['D14', 'Rain', 'Mild', 'High', 'Strong', 'No'],
  ] as const;
  return (
    <section aria-label="Dataset Play Tennis gồm 14 ngày" className={cx('py-2', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}>
      <div className="overflow-x-auto">
        <div className={cx(
          'grid min-w-[46rem] grid-cols-[4rem_repeat(4,minmax(7rem,1fr))_5rem] gap-px overflow-hidden rounded-lg text-sm',
          themeClasses.isLight ? 'bg-[#D7E1EA]' : 'bg-[#344454]',
        )}>
          {['Ngày', 'Outlook', 'Temp', 'Humidity', 'Wind', 'Play'].map((label) => (
            <div key={label} className={cx('px-3 py-3 text-center font-black first:text-left', themeClasses.isLight ? 'bg-[#EEF4F8]' : 'bg-[#A8D4FF]/8', themeClasses.titleText)}>
              {label}
            </div>
          ))}
          {rows.map((row) => (
            <div key={row[0]} className="contents">
              {row.slice(0, 5).map((value, index) => (
                <div key={`${row[0]}-${index}`} className={cx('px-3 py-2.5 text-center first:text-left first:font-bold', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]', themeClasses.bodyText)}>
                  {value}
                </div>
              ))}
              <div className={cx('px-3 py-2.5 text-center', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}>
                <span className={cx(
                  'inline-flex min-w-12 justify-center rounded-full px-2 py-1 text-xs font-black',
                  row[5] === 'Yes'
                    ? themeClasses.isLight ? 'bg-[#DDEFE3] text-[#205B34]' : 'bg-[#78C990]/16 text-[#AEE7BE]'
                    : themeClasses.isLight ? 'bg-[#F5E5D4] text-[#7B4515]' : 'bg-[#F2C66D]/14 text-[#F7D99B]',
                )}>
                  {row[5]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlayTennisLikelihoodVisual({ smoothed = false, themeClasses }: {
  smoothed?: boolean;
  themeClasses: LearningThemeClasses;
}) {
  const tables = smoothed
    ? [
        {
          label: 'Outlook',
          selected: 'Sunny',
          rows: [
            { value: 'Sunny', yes: '\\frac{2+1}{9+3}=\\frac3{12}', no: '\\frac{3+1}{5+3}=\\frac48' },
            { value: 'Overcast', yes: '\\frac{4+1}{9+3}=\\frac5{12}', no: '\\frac{0+1}{5+3}=\\frac18' },
            { value: 'Rain', yes: '\\frac{3+1}{9+3}=\\frac4{12}', no: '\\frac{2+1}{5+3}=\\frac38' },
          ],
        },
        {
          label: 'Temp',
          selected: 'Cool',
          rows: [
            { value: 'Hot', yes: '\\frac{2+1}{9+3}=\\frac3{12}', no: '\\frac{2+1}{5+3}=\\frac38' },
            { value: 'Mild', yes: '\\frac{4+1}{9+3}=\\frac5{12}', no: '\\frac{2+1}{5+3}=\\frac38' },
            { value: 'Cool', yes: '\\frac{3+1}{9+3}=\\frac4{12}', no: '\\frac{1+1}{5+3}=\\frac28' },
          ],
        },
        {
          label: 'Humidity',
          selected: 'High',
          rows: [
            { value: 'High', yes: '\\frac{3+1}{9+2}=\\frac4{11}', no: '\\frac{4+1}{5+2}=\\frac57' },
            { value: 'Normal', yes: '\\frac{6+1}{9+2}=\\frac7{11}', no: '\\frac{1+1}{5+2}=\\frac27' },
          ],
        },
        {
          label: 'Wind',
          selected: 'Strong',
          rows: [
            { value: 'Weak', yes: '\\frac{6+1}{9+2}=\\frac7{11}', no: '\\frac{2+1}{5+2}=\\frac37' },
            { value: 'Strong', yes: '\\frac{3+1}{9+2}=\\frac4{11}', no: '\\frac{3+1}{5+2}=\\frac47' },
          ],
        },
      ]
    : [
        {
          label: 'Outlook',
          selected: 'Sunny',
          rows: [
            { value: 'Sunny', yes: '\\frac29', no: '\\frac35' },
            { value: 'Overcast', yes: '\\frac49', no: '0' },
            { value: 'Rain', yes: '\\frac39', no: '\\frac25' },
          ],
        },
        {
          label: 'Temp',
          selected: 'Cool',
          rows: [
            { value: 'Hot', yes: '\\frac29', no: '\\frac25' },
            { value: 'Mild', yes: '\\frac49', no: '\\frac25' },
            { value: 'Cool', yes: '\\frac39', no: '\\frac15' },
          ],
        },
        {
          label: 'Humidity',
          selected: 'High',
          rows: [
            { value: 'High', yes: '\\frac39', no: '\\frac45' },
            { value: 'Normal', yes: '\\frac69', no: '\\frac15' },
          ],
        },
        {
          label: 'Wind',
          selected: 'Strong',
          rows: [
            { value: 'Weak', yes: '\\frac69', no: '\\frac25' },
            { value: 'Strong', yes: '\\frac39', no: '\\frac35' },
          ],
        },
      ];
  const cellClass = cx('px-4 py-3', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]');
  return (
    <section aria-label={smoothed ? 'Likelihood Play Tennis sau Laplace smoothing' : 'Likelihood Play Tennis không dùng Laplace'} className={cx('grid gap-6 py-2 lg:grid-cols-2', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}>
      {tables.map((table) => (
        <div key={table.label} className="min-w-0 overflow-x-auto">
          <h3 className={cx('!mb-3 !mt-0 text-sm font-black', themeClasses.titleText)}>{table.label}</h3>
          <div className={cx(
            'grid min-w-[28rem] grid-cols-[minmax(7rem,0.9fr)_minmax(9rem,1fr)_minmax(9rem,1fr)] gap-px overflow-hidden rounded-lg text-sm',
            themeClasses.isLight ? 'bg-[#D7E1EA]' : 'bg-[#344454]',
          )}>
            <div className={cx('px-4 py-3 font-black', themeClasses.isLight ? 'bg-[#EEF4F8]' : 'bg-[#A8D4FF]/8', themeClasses.titleText)}>Giá trị</div>
            <div className={cx('px-4 py-3 text-center font-black', themeClasses.isLight ? 'bg-[#E4F0E7]' : 'bg-[#78C990]/12', themeClasses.titleText)}>Yes</div>
            <div className={cx('px-4 py-3 text-center font-black', themeClasses.isLight ? 'bg-[#F8EBD6]' : 'bg-[#F2C66D]/10', themeClasses.titleText)}>No</div>
            {table.rows.map((row) => (
              <div key={row.value} className="contents">
                <div className={cx(
                  cellClass,
                  'font-bold',
                  row.value === table.selected && (themeClasses.isLight ? '!bg-[#EAF1F7]' : '!bg-[#A8D4FF]/8'),
                  themeClasses.bodyText,
                )}>
                  {row.value}
                </div>
                <div className={cx(cellClass, 'text-center', row.value === table.selected && (themeClasses.isLight ? '!bg-[#EDF7F0]' : '!bg-[#78C990]/8'))}>
                  <MathText className={cx('font-semibold', themeClasses.titleText)} formula={row.yes} />
                </div>
                <div className={cx(cellClass, 'text-center', row.value === table.selected && (themeClasses.isLight ? '!bg-[#FCF3E6]' : '!bg-[#F2C66D]/7'))}>
                  <MathText className={cx('font-semibold', themeClasses.titleText)} formula={row.no} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function EmailNaiveBayesPracticeVisual({ step, themeClasses }: {
  step: 'data' | 'probabilities' | 'scores';
  themeClasses: LearningThemeClasses;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [prediction, setPrediction] = useState<'spam' | 'ham' | null>(null);
  const [checked, setChecked] = useState(false);
  const rows = [
    ['E1', 'Có', 'Có', 'Spam'],
    ['E2', 'Có', 'Có', 'Spam'],
    ['E3', 'Có', 'Không', 'Spam'],
    ['E4', 'Không', 'Có', 'Spam'],
    ['E5', 'Không', 'Không', 'Không spam'],
    ['E6', 'Không', 'Có', 'Không spam'],
    ['E7', 'Có', 'Không', 'Không spam'],
    ['E8', 'Không', 'Không', 'Không spam'],
  ] as const;
  const expected = {
    priorSpam: 1 / 2,
    priorHam: 1 / 2,
    freeSpam: 3 / 4,
    freeHam: 1 / 4,
    linkSpam: 3 / 4,
    linkHam: 1 / 4,
    scoreSpam: 9 / 32,
    scoreHam: 1 / 32,
  } as const;
  const parseAnswer = (value: string) => {
    const normalized = value.trim().replace(',', '.');
    const fraction = normalized.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);
    if (fraction) {
      const denominator = Number(fraction[2]);
      return denominator === 0 ? Number.NaN : Number(fraction[1]) / denominator;
    }
    return Number(normalized);
  };
  const answerIsCorrect = (key: keyof typeof expected) => (
    Number.isFinite(parseAnswer(answers[key] ?? ''))
    && Math.abs(parseAnswer(answers[key] ?? '') - expected[key]) < 1e-6
  );
  const setAnswer = (key: keyof typeof expected, value: string) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setChecked(false);
  };
  const inputClass = (key: keyof typeof expected) => cx(
    'h-10 w-full rounded-lg border bg-transparent px-3 text-center text-sm font-bold outline-none transition-colors',
    themeClasses.focusRing,
    checked
      ? answerIsCorrect(key)
        ? themeClasses.isLight ? 'border-[#4D9B65] text-[#205B34]' : 'border-[#78C990] text-[#AEE7BE]'
        : themeClasses.isLight ? 'border-[#C56B32] text-[#8A4716]' : 'border-[#E9A064] text-[#F0B172]'
      : themeClasses.isLight ? 'border-[#CBD8E3] text-[#172A43]' : 'border-[#A8D4FF]/20 text-[#F2F6FA]',
  );
  const checkButton = (
    <button
      type="button"
      onClick={() => setChecked(true)}
      className={cx(
        'inline-flex min-h-10 items-center justify-center rounded-lg px-4 text-sm font-black transition-colors',
        themeClasses.focusRing,
        themeClasses.isLight ? 'bg-[#205089] text-white hover:bg-[#173F6D]' : 'bg-[#A8D4FF] text-[#10263D] hover:bg-[#BDDFFF]',
      )}
    >
      Kiểm tra đáp án
    </button>
  );

  if (step === 'data') {
    return (
      <section aria-label="Dataset phân loại email Spam" className={cx('py-2', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}>
        <div className="overflow-x-auto">
          <div className={cx(
            'grid min-w-[34rem] grid-cols-[5rem_1fr_1fr_8rem] gap-px overflow-hidden rounded-lg text-sm',
            themeClasses.isLight ? 'bg-[#D7E1EA]' : 'bg-[#344454]',
          )}>
            {['Email', 'Có từ “miễn phí”', 'Có liên kết', 'Class'].map((label) => (
              <div key={label} className={cx('px-3 py-3 text-center font-black first:text-left', themeClasses.isLight ? 'bg-[#EEF4F8]' : 'bg-[#A8D4FF]/8', themeClasses.titleText)}>
                {label}
              </div>
            ))}
            {rows.map((row) => (
              <div key={row[0]} className="contents">
                {row.slice(0, 3).map((value, index) => (
                  <div key={`${row[0]}-${index}`} className={cx('px-3 py-2.5 text-center first:text-left first:font-bold', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]', themeClasses.bodyText)}>
                    {value}
                  </div>
                ))}
                <div className={cx('px-3 py-2.5 text-center', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}>
                  <span className={cx(
                    'inline-flex min-w-20 justify-center rounded-full px-2 py-1 text-xs font-black',
                    row[3] === 'Spam'
                      ? themeClasses.isLight ? 'bg-[#F5E5D4] text-[#8A4716]' : 'bg-[#F2C66D]/14 text-[#F7D99B]'
                      : themeClasses.isLight ? 'bg-[#DDEFE3] text-[#205B34]' : 'bg-[#78C990]/16 text-[#AEE7BE]',
                  )}>
                    {row[3]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (step === 'probabilities') {
    const probabilityKeys: Array<{
      ham: keyof typeof expected;
      label: string;
      spam: keyof typeof expected;
    }> = [
      { label: 'Prior', spam: 'priorSpam', ham: 'priorHam' },
      { label: 'Có từ “miễn phí”', spam: 'freeSpam', ham: 'freeHam' },
      { label: 'Có liên kết', spam: 'linkSpam', ham: 'linkHam' },
    ];
    const allCorrect = probabilityKeys.every((row) => answerIsCorrect(row.spam) && answerIsCorrect(row.ham));
    return (
      <section aria-label="Điền prior và likelihood cho bài phân loại email" className={cx('py-2', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}>
        <div className="overflow-x-auto">
          <div className={cx(
            'grid min-w-[34rem] grid-cols-[minmax(11rem,1.2fr)_1fr_1fr] gap-px overflow-hidden rounded-lg text-sm',
            themeClasses.isLight ? 'bg-[#D7E1EA]' : 'bg-[#344454]',
          )}>
            <div className={cx('px-4 py-3 font-black', themeClasses.isLight ? 'bg-[#EEF4F8]' : 'bg-[#A8D4FF]/8', themeClasses.titleText)}>Thành phần</div>
            <div className={cx('px-4 py-3 text-center font-black', themeClasses.isLight ? 'bg-[#F8EBD6]' : 'bg-[#F2C66D]/10', themeClasses.titleText)}>Spam</div>
            <div className={cx('px-4 py-3 text-center font-black', themeClasses.isLight ? 'bg-[#E4F0E7]' : 'bg-[#78C990]/12', themeClasses.titleText)}>Không spam</div>
            {probabilityKeys.map((row) => (
              <div key={row.label} className="contents">
                <div className={cx('px-4 py-3 font-bold', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]', themeClasses.bodyText)}>{row.label}</div>
                {[row.spam, row.ham].map((key) => (
                  <div key={key} className={cx('px-3 py-2', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}>
                    <input
                      aria-label={`${row.label} cho ${key === row.spam ? 'Spam' : 'Không spam'}`}
                      value={answers[key] ?? ''}
                      onChange={(event) => setAnswer(key, event.target.value)}
                      placeholder="Ví dụ: 3/4"
                      className={inputClass(key)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          {checkButton}
          {checked ? (
            <p className={cx('text-sm font-bold', allCorrect ? themeClasses.isLight ? 'text-[#2D7646]' : 'text-[#8ED8A4]' : themeClasses.isLight ? 'text-[#A05218]' : 'text-[#F0B172]')}>
              {allCorrect ? 'Đúng. Các prior và likelihood đã được tính chính xác.' : 'Chưa đúng. Hãy đếm riêng trong từng class và kiểm tra tổng mỗi cột bằng 1.'}
            </p>
          ) : null}
        </div>
      </section>
    );
  }

  const scoresCorrect = answerIsCorrect('scoreSpam') && answerIsCorrect('scoreHam');
  const allCorrect = scoresCorrect && prediction === 'spam';
  return (
    <section aria-label="Điền score và dự đoán class email" className={cx('py-2', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}>
      <div className="grid gap-5 md:grid-cols-2">
        {[
          { key: 'scoreSpam' as const, label: 'score(Spam)', formula: '\\frac12\\times\\frac34\\times\\frac34' },
          { key: 'scoreHam' as const, label: 'score(Không\\ spam)', formula: '\\frac12\\times\\frac14\\times\\frac14' },
        ].map((item) => (
          <div key={item.key} className="grid gap-3">
            <div className="flex items-center justify-between gap-3">
              <span className={cx('text-sm font-black', themeClasses.titleText)}>{item.label}</span>
              <MathText className={cx('text-sm font-semibold', themeClasses.mutedText)} formula={item.formula} />
            </div>
            <input
              aria-label={`Giá trị ${item.label}`}
              value={answers[item.key] ?? ''}
              onChange={(event) => setAnswer(item.key, event.target.value)}
              placeholder="Nhập phân số hoặc số thập phân"
              className={inputClass(item.key)}
            />
          </div>
        ))}
      </div>
      <div className="mt-6">
        <span className={cx('text-sm font-black', themeClasses.titleText)}>Class dự đoán</span>
        <div className="mt-3 flex flex-wrap gap-3">
          {[
            { id: 'spam' as const, label: 'Spam' },
            { id: 'ham' as const, label: 'Không spam' },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setPrediction(option.id);
                setChecked(false);
              }}
              className={cx(
                'min-h-10 rounded-lg border px-4 text-sm font-black transition-colors',
                themeClasses.focusRing,
                prediction === option.id
                  ? themeClasses.isLight ? 'border-[#205089] bg-[#EAF1F7] text-[#123B68]' : 'border-[#A8D4FF] bg-[#A8D4FF]/10 text-[#D7EAFE]'
                  : themeClasses.isLight ? 'border-[#CBD8E3] text-[#43536A]' : 'border-[#A8D4FF]/20 text-[#C8D4DF]',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        {checkButton}
        {checked ? (
          <p className={cx('text-sm font-bold', allCorrect ? themeClasses.isLight ? 'text-[#2D7646]' : 'text-[#8ED8A4]' : themeClasses.isLight ? 'text-[#A05218]' : 'text-[#F0B172]')}>
            {allCorrect ? 'Đúng. score(Spam)=9/32 lớn hơn score(Không spam)=1/32.' : 'Chưa đúng. Hãy nhân prior với hai likelihood rồi chọn score lớn hơn.'}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function StatisticalAssumptionsVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const assumptions = [
    { key: 'A', title: 'Tuyến tính', detail: 'Giá trung bình thay đổi gần theo một đường thẳng khi diện tích tăng.', issue: 'Quan hệ không tuyến tính', remedy: 'thử biến đổi dữ liệu hoặc dùng hồi quy đa thức (Polynomial Regression), spline hay GAM.' },
    { key: 'B', title: 'Sai số độc lập', detail: 'Sai số của một căn nhà không kéo theo sai số của căn nhà khác.', issue: 'Các sai số phụ thuộc nhau', remedy: 'dùng GLS, mô hình hiệu ứng hỗn hợp (mixed-effects) hoặc sai số chuẩn theo cụm.' },
    { key: 'C', title: 'Phương sai không đổi', detail: 'Độ phân tán của sai số tương đối ổn định ở mọi mức diện tích.', issue: 'Độ phân tán sai số thay đổi', remedy: 'dùng bình phương tối thiểu có trọng số (Weighted Least Squares) hoặc sai số chuẩn bền vững.' },
    { key: 'D', title: 'Phần dư gần chuẩn', detail: 'Cần thiết cho kiểm định và khoảng tin cậy, nhất là khi mẫu nhỏ.', issue: 'Phần dư lệch chuẩn rõ rệt', remedy: 'dùng bootstrap; nếu phân phối biến đích không phù hợp, cân nhắc mô hình tuyến tính tổng quát (GLM).' },
  ] as const;

  return (
    <div className="grid gap-4">
      <section
        aria-labelledby="statistical-assumptions-title"
        className={cx(
          'overflow-hidden rounded-xl px-4 py-5 sm:px-5 sm:py-6',
          themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]',
        )}
      >
        <div className="grid gap-1">
          <p className={cx('text-[0.68rem] font-black uppercase tracking-[0.18em]', themeClasses.isLight ? 'text-[#39724A]' : 'text-[#9DDBAF]')}>Ví dụ: Linear Regression</p>
          <h3 id="statistical-assumptions-title" className={cx('text-lg font-black sm:text-xl', themeClasses.titleText)}>Dự đoán giá nhà từ diện tích</h3>
          <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>Trước khi diễn giải hệ số của mô hình, ta cần kiểm tra ít nhất bốn giả thiết:</p>
        </div>

        <ol className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" aria-label="Bốn giả thiết của ví dụ Linear Regression">
          {assumptions.map((assumption) => (
            <li key={assumption.key} className={cx('grid min-h-36 content-start gap-2 rounded-lg px-3 py-3', themeClasses.isLight ? 'bg-white' : 'bg-[#172232]')}>
              <span className={cx('grid h-8 w-8 place-items-center rounded-full text-xs font-black', themeClasses.isLight ? 'bg-[#EAF1F7] text-[#205089]' : 'bg-[#A8D4FF]/12 text-[#A8D4FF]')} aria-hidden="true">{assumption.key}</span>
              <strong className={cx('text-sm font-black', themeClasses.titleText)}>{assumption.title}</strong>
              <span className={cx('text-xs font-semibold leading-5', themeClasses.mutedText)}>{assumption.detail}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="statistical-assumptions-remedies-title" className={cx('rounded-xl border px-4 py-4 sm:px-5', themeClasses.isLight ? 'border-[#205089]/14 bg-white' : 'border-[#A8D4FF]/18 bg-[#172232]')}>
        <h4 id="statistical-assumptions-remedies-title" className={cx('text-sm font-bold', themeClasses.titleText)}>Làm gì khi giả thiết bị vi phạm?</h4>
        <p className={cx('mt-1 text-xs font-normal leading-5', themeClasses.mutedText)}>Để xử lý từng vấn đề, ta có thể dùng các phương pháp sau:</p>
        <dl className="mt-3 grid gap-x-5 gap-y-3 sm:grid-cols-2">
          {assumptions.map((assumption) => (
            <div key={assumption.key} className="grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-2">
              <dt className={cx('grid h-7 w-7 place-items-center rounded-full text-xs font-black', themeClasses.isLight ? 'bg-[#FBF2E7] text-[#8A4718]' : 'bg-[#F0B172]/10 text-[#F0B172]')}>{assumption.key}</dt>
              <dd className={cx('text-xs font-normal leading-5', themeClasses.bodyText)}><strong className="font-semibold">{assumption.issue}:</strong> {assumption.remedy}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

function ResponsibleStatisticsChecklistVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const checks = [
    { lead: 'Kiểm tra nguồn dữ liệu', rest: ', cách lấy mẫu và nhóm bị bỏ sót.' },
    { lead: 'Kiểm tra giả thiết', rest: ' của phương pháp và thiết kế nghiên cứu.' },
    { lead: 'Đọc kích thước hiệu ứng', rest: ' và khoảng tin cậy, không chỉ nhìn p-value.' },
    { lead: 'Kiểm tra trục, đơn vị, mốc so sánh', rest: ' và dữ liệu có bị cắt hay không.' },
    { lead: 'Tìm phân tích thay thế', rest: ', kiểm tra độ nhạy hoặc kết quả có thể tái lập.' },
  ] as const;

  return (
    <section aria-labelledby="responsible-statistics-checklist-title" className={cx('rounded-xl px-4 py-5 sm:px-5', themeClasses.isLight ? 'bg-[#F7FAFD]' : 'bg-[#121A24]')}>
      <p className={cx('text-[0.68rem] font-black uppercase tracking-[0.18em]', themeClasses.isLight ? 'text-[#39724A]' : 'text-[#9DDBAF]')}>Checklist 5 bước</p>
      <h3 id="responsible-statistics-checklist-title" className={cx('mt-1 text-lg font-black', themeClasses.titleText)}>Trước khi tin vào một kết luận thống kê</h3>
      <ol className="mt-4 grid gap-2">
        {checks.map((check, index) => (
          <li key={check.lead} className="grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-3 py-1.5">
            <span className={cx('grid h-8 w-8 place-items-center rounded-full text-xs font-black', themeClasses.isLight ? 'bg-[#DDEFE3] text-[#2D7646]' : 'bg-[#9DDBAF]/12 text-[#9DDBAF]')} aria-hidden="true">{index + 1}</span>
            <p className={cx('pt-1 text-sm font-normal leading-6', themeClasses.bodyText)}><strong className="font-semibold">{check.lead}</strong>{check.rest}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function StatisticsMisuseQuoteVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  return (
    <section aria-labelledby="statistics-misuse-quote-title" className={cx('relative overflow-hidden rounded-xl px-5 py-7 sm:px-8 sm:py-9', themeClasses.isLight ? 'bg-[#F3F7F4]' : 'bg-[#121A24]')}>
      <span className={cx('pointer-events-none absolute -top-3 left-4 text-8xl font-black leading-none', themeClasses.isLight ? 'text-[#39724A]/15' : 'text-[#9DDBAF]/12')} aria-hidden="true">“</span>
      <blockquote id="statistics-misuse-quote-title" className={cx('relative mx-auto max-w-3xl text-xl font-black leading-8 sm:text-2xl sm:leading-9', themeClasses.titleText)}>
        “Có ba kiểu nói dối: nói dối, nói dối trắng trợn và thống kê.”
      </blockquote>
    </section>
  );
}

const populationValues = [47, 48, 48, 49, 49, 50, 50, 50, 51, 51, 52, 55] as const;
const samplingSequences = {
  random: [[48, 50, 51, 52], [47, 49, 50, 55], [48, 49, 51, 52], [48, 50, 50, 51]],
  convenience: [[51, 52, 55, 51], [50, 51, 52, 55], [51, 51, 52, 55], [50, 52, 52, 55]],
} as const;

type StudyCollectionMethod = {
  id: 'retrospective' | 'observational' | 'experiment';
  title: string;
  englishTitle: string;
  evidence: string;
  intervention: string;
  conclusion: string;
};

type PopulationSampleObservationOverviewProps = {
  overviewLabel: string;
  stages: Array<{
    id: 'population' | 'sample' | 'observation';
    title: string;
    englishTitle: string;
    description: string;
  }>;
  sampleCaption: string;
  methodsHeading: string;
  methodLabels: {
    evidence: string;
    intervention: string;
    conclusion: string;
  };
  methods: StudyCollectionMethod[];
  conclusionBoundary: {
    label: string;
    association: string;
    causal: string;
  };
};

const studyCollectionMethodMeta: Record<StudyCollectionMethod['id'], {
  icon: LucideIcon;
  lightIcon: string;
  darkIcon: string;
}> = {
  retrospective: {
    icon: Archive,
    lightIcon: 'bg-[#E8EDF3] text-[#48627A]',
    darkIcon: 'bg-[#AFC3D5]/10 text-[#BFD0DE]',
  },
  observational: {
    icon: Eye,
    lightIcon: 'bg-[#DDEAF5] text-[#205089]',
    darkIcon: 'bg-[#A8D4FF]/10 text-[#A8D4FF]',
  },
  experiment: {
    icon: FlaskConical,
    lightIcon: 'bg-[#E2F0EA] text-[#2F6F59]',
    darkIcon: 'bg-[#7FD3B1]/10 text-[#9BDCC2]',
  },
};

function PopulationSampleObservationOverview({
  overviewLabel,
  stages,
  sampleCaption,
  methodsHeading,
  methodLabels,
  methods,
  conclusionBoundary,
}: PopulationSampleObservationOverviewProps) {
  const themeClasses = useLearningMdxTheme();
  const border = themeClasses.isLight ? 'border-[#205089]/12' : 'border-[#A8D4FF]/14';
  const populationDots = Array.from({ length: 24 }, (_, index) => index);
  const sampleDots = [2, 5, 9, 14, 18, 22];

  return (
    <section
      aria-label={overviewLabel}
      className={cx('overflow-hidden rounded-2xl border', border, themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]/45')}
    >
      <div className="grid md:grid-cols-3">
        {stages.map((stage, index) => (
          <article
            key={stage.id}
            className={cx(
              'relative grid content-start gap-4 border-b px-5 py-6 sm:px-6',
              index > 0 && 'md:border-l',
              index === stages.length - 1 && 'border-b-0',
              'md:border-b-0',
              border,
              stage.id === 'sample' && (themeClasses.isLight ? 'bg-[#F7FAFD]' : 'bg-[#A8D4FF]/5'),
            )}
          >
            <div className="flex items-start gap-3">
              <span className={cx(
                'grid h-10 w-10 shrink-0 place-items-center rounded-xl',
                themeClasses.isLight ? 'bg-[#DDEAF5] text-[#205089]' : 'bg-[#A8D4FF]/10 text-[#A8D4FF]',
              )}>
                {stage.id === 'population' ? <Users className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> : null}
                {stage.id === 'sample' ? <ScanSearch className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> : null}
                {stage.id === 'observation' ? <Eye className="h-5 w-5" strokeWidth={2} aria-hidden="true" /> : null}
              </span>
              <div className="min-w-0">
                <h3 className={cx('text-base font-black leading-6', themeClasses.titleText)}>{stage.title}</h3>
                <p className={cx('mt-0.5 text-xs font-bold', themeClasses.mutedText)}>{stage.englishTitle}</p>
              </div>
            </div>

            {stage.id === 'population' ? (
              <div className="grid grid-cols-8 gap-2" aria-hidden="true">
                {populationDots.map((dot) => (
                  <span key={dot} className={cx('aspect-square rounded-full', themeClasses.isLight ? 'bg-[#BFD2E2]' : 'bg-[#A8D4FF]/28')} />
                ))}
              </div>
            ) : null}

            {stage.id === 'sample' ? (
              <div className="grid gap-2">
                <div className={cx('grid grid-cols-6 gap-2 rounded-xl border border-dashed px-3 py-4', themeClasses.isLight ? 'border-[#205089]/35' : 'border-[#A8D4FF]/40')} aria-hidden="true">
                  {sampleDots.map((dot) => (
                    <span key={dot} className={cx('aspect-square rounded-full', themeClasses.isLight ? 'bg-[#2F78B7]' : 'bg-[#8CC8F2]')} />
                  ))}
                </div>
                <p className={cx('text-center text-xs font-bold', themeClasses.mutedText)}>{sampleCaption}</p>
              </div>
            ) : null}

            {stage.id === 'observation' ? (
              <div className="grid gap-2" aria-hidden="true">
                <div className={cx('flex items-center gap-2 rounded-lg px-3 py-2', themeClasses.isLight ? 'bg-[#EAF1F7]' : 'bg-[#A8D4FF]/9')}>
                  <Eye className={cx('h-4 w-4', themeClasses.accentText)} strokeWidth={2} />
                  <span className={cx('h-1.5 flex-1 rounded-full', themeClasses.isLight ? 'bg-[#7FA7C8]' : 'bg-[#A8D4FF]/45')} />
                </div>
                <div className={cx('flex items-center gap-2 rounded-lg px-3 py-2', themeClasses.isLight ? 'bg-[#E7F3EC]' : 'bg-[#7FD3B1]/9')}>
                  <FlaskConical className={cx('h-4 w-4', themeClasses.isLight ? 'text-[#2F6F59]' : 'text-[#9BDCC2]')} strokeWidth={2} />
                  <span className={cx('h-1.5 flex-1 rounded-full', themeClasses.isLight ? 'bg-[#83B49E]' : 'bg-[#7FD3B1]/45')} />
                </div>
              </div>
            ) : null}

            <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{stage.description}</p>
            {index < stages.length - 1 ? (
              <span className={cx(
                'absolute bottom-[-0.8rem] left-1/2 z-10 grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full border md:bottom-auto md:left-auto md:right-[-0.9rem] md:top-1/2 md:-translate-y-1/2 md:translate-x-0',
                border,
                themeClasses.isLight ? 'bg-white text-[#205089]' : 'bg-[#172232] text-[#A8D4FF]',
              )} aria-hidden="true">
                <ArrowRight className="h-3.5 w-3.5 rotate-90 md:rotate-0" strokeWidth={2.2} />
              </span>
            ) : null}
          </article>
        ))}
      </div>

      <section className={cx('border-t', border)} aria-labelledby="study-collection-methods-title">
        <div className="px-5 pb-3 pt-5 sm:px-6">
          <h3 id="study-collection-methods-title" className={cx('text-lg font-black', themeClasses.titleText)}>{methodsHeading}</h3>
        </div>
        <div className={cx('grid divide-y md:grid-cols-3 md:divide-x md:divide-y-0', themeClasses.isLight ? 'divide-[#205089]/10' : 'divide-[#A8D4FF]/12')}>
          {methods.map((method) => {
            const meta = studyCollectionMethodMeta[method.id];
            const Icon = meta.icon;
            return (
              <article key={method.id} className="grid content-start gap-4 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <span className={cx('grid h-9 w-9 shrink-0 place-items-center rounded-lg', themeClasses.isLight ? meta.lightIcon : meta.darkIcon)}>
                    <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <div>
                    <h4 className={cx('text-sm font-black leading-5', themeClasses.titleText)}>{method.title}</h4>
                    <p className={cx('text-xs font-bold', themeClasses.mutedText)}>{method.englishTitle}</p>
                  </div>
                </div>
                <dl className="grid gap-3">
                  {([
                    [methodLabels.evidence, method.evidence],
                    [methodLabels.intervention, method.intervention],
                    [methodLabels.conclusion, method.conclusion],
                  ] as const).map(([term, description]) => (
                    <div key={term} className="grid gap-0.5">
                      <dt className={cx('text-xs font-black', themeClasses.mutedText)}>{term}</dt>
                      <dd className={cx('text-sm font-semibold leading-5', themeClasses.bodyText)}>{description}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            );
          })}
        </div>
      </section>

      <section className={cx('grid border-t sm:grid-cols-2', border)} aria-label={conclusionBoundary.label}>
        <p className={cx('px-5 py-4 text-sm font-black leading-6 sm:px-6', themeClasses.isLight ? 'bg-[#EEF4F9] text-[#205089]' : 'bg-[#A8D4FF]/8 text-[#BFDFFF]')}>
          {conclusionBoundary.association}
        </p>
        <p className={cx('border-t px-5 py-4 text-sm font-black leading-6 sm:border-l sm:border-t-0 sm:px-6', border, themeClasses.isLight ? 'bg-[#EDF7F1] text-[#2F6F59]' : 'bg-[#7FD3B1]/8 text-[#A9E4CC]')}>
          {conclusionBoundary.causal}
        </p>
      </section>
    </section>
  );
}

function StatisticalThinkingSamplingVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const [mode, setMode] = useState<keyof typeof samplingSequences>('random');
  const [drawCount, setDrawCount] = useState(0);
  const populationMean = populationValues.reduce((sum, value) => sum + value, 0) / populationValues.length;
  const samples = samplingSequences[mode].slice(0, drawCount);
  const latestSample = samples.at(-1);
  const latestMean = latestSample ? latestSample.reduce((sum, value) => sum + value, 0) / latestSample.length : null;
  const selectMode = (nextMode: keyof typeof samplingSequences) => {
    setMode(nextMode);
    setDrawCount(0);
  };
  const canDraw = drawCount < samplingSequences[mode].length;

  return (
    <section aria-labelledby="statistical-thinking-sampling-title" className={cx('grid gap-4 rounded-xl border px-4 py-5 sm:px-5', themeClasses.isLight ? 'border-[#205089]/14 bg-[#F7FAFD]' : 'border-[#A8D4FF]/18 bg-[#121A24]')}>
      <div className="flex items-start gap-3">
        <span className={cx('grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-black', themeClasses.isLight ? 'bg-[#DDEAF5] text-[#205089]' : 'bg-[#A8D4FF]/10 text-[#A8D4FF]')} aria-hidden="true">1</span>
        <div className="grid gap-1">
          <h3 id="statistical-thinking-sampling-title" className={cx('text-base font-black', themeClasses.titleText)}>Lấy mẫu có thể làm kết luận thay đổi ra sao?</h3>
          <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>Quần thể có 12 chi tiết; giá trị trung bình thật là <strong>{populationMean.toFixed(1)} mm</strong>. Hãy quan sát các ước lượng thay đổi theo cách lấy mẫu.</p>
        </div>
      </div>
      <div className={cx('grid gap-2 rounded-lg border px-3 py-3 sm:grid-cols-12', themeClasses.isLight ? 'border-[#205089]/14 bg-white' : 'border-[#A8D4FF]/16 bg-[#172232]')} aria-label={`Quần thể gồm các giá trị: ${populationValues.join(', ')} mm`}>
        {populationValues.map((value, index) => <span key={`${value}-${index}`} className={cx('grid min-h-9 place-items-center rounded-md text-xs font-black', themeClasses.isLight ? 'bg-[#EAF1F7] text-[#205089]' : 'bg-[#A8D4FF]/12 text-[#D7EAFE]')}>{value}</span>)}
      </div>
      <div className="grid gap-3">
        <div role="group" aria-label="Chọn cách lấy mẫu" className="flex flex-wrap gap-2">
          {([
            ['random', 'Mẫu ngẫu nhiên'],
            ['convenience', 'Mẫu thuận tiện'],
          ] as const).map(([option, label]) => (
            <button key={option} type="button" aria-pressed={mode === option} onClick={() => selectMode(option)} className={cx('min-h-10 rounded-lg border px-3 text-sm font-black transition-colors', themeClasses.focusRing, mode === option ? themeClasses.isLight ? 'border-[#205089] bg-[#EAF1F7] text-[#123B68]' : 'border-[#A8D4FF] bg-[#A8D4FF]/10 text-[#D7EAFE]' : themeClasses.isLight ? 'border-[#B8C9D8] bg-white text-[#43536A]' : 'border-[#A8D4FF]/24 text-[#C8D4DF]')}>{label}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" disabled={!canDraw} onClick={() => setDrawCount((count) => count + 1)} className={cx('min-h-10 rounded-lg px-4 text-sm font-black transition-colors disabled:cursor-not-allowed disabled:opacity-50', themeClasses.focusRing, themeClasses.isLight ? 'bg-[#205089] text-white hover:bg-[#173F6C]' : 'bg-[#A8D4FF] text-[#102030]')}>Rút một mẫu 4 chi tiết</button>
          {drawCount > 0 ? <button type="button" onClick={() => { setMode('random'); setDrawCount(0); }} className={cx('min-h-10 px-2 text-sm font-black underline underline-offset-4', themeClasses.focusRing, themeClasses.mutedText)}>Đặt lại</button> : null}
          {!canDraw ? <span className={cx('text-sm font-bold', themeClasses.mutedText)}>Đã xem đủ bốn mẫu cố định.</span> : null}
        </div>
      </div>
      {latestSample ? <div aria-live="polite" className={cx('grid gap-2 rounded-lg border px-3 py-3 text-sm sm:grid-cols-[1fr_auto]', themeClasses.isLight ? 'border-[#39724A]/22 bg-[#F0F8F2]' : 'border-[#9DDBAF]/24 bg-[#9DDBAF]/8')}>
        <p className={cx('font-bold leading-6', themeClasses.bodyText)}>Mẫu gần nhất: {latestSample.join(', ')} mm</p>
        <p className={cx('font-black', themeClasses.titleText)}>Trung bình mẫu: {latestMean?.toFixed(1)} mm</p>
      </div> : null}
      {samples.length ? <div className="grid gap-2"><p className={cx('text-sm font-black', themeClasses.titleText)}>Lịch sử ước lượng trung bình mẫu</p><ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">{samples.map((sample, index) => { const mean = sample.reduce((sum, value) => sum + value, 0) / sample.length; return <li key={`${mode}-${index}`} className={cx('rounded-lg px-3 py-2 text-sm font-bold', themeClasses.isLight ? 'bg-[#EAF1F7] text-[#205089]' : 'bg-[#A8D4FF]/10 text-[#D7EAFE]')}>Mẫu {index + 1}: {mean.toFixed(1)}</li>; })}</ol></div> : null}
      <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{mode === 'random' ? 'Các mẫu ngẫu nhiên không cho cùng một trung bình, nhưng các ước lượng dao động quanh giá trị quần thể.' : 'Mẫu thuận tiện chỉ lấy các chi tiết dễ thấy ở phía cao; các ước lượng vì thế lệch hệ thống so với quần thể.'}</p>
    </section>
  );
}

type StatisticalQuestionDomainId = 'engineering' | 'medicine' | 'business' | 'society' | 'machine-learning' | 'deep-learning' | 'evaluation';

type StatisticalQuestionGroup = {
  id: StatisticalQuestionDomainId;
  title: string;
  questions: string[];
};

const statisticalQuestionDomainMeta: Record<StatisticalQuestionDomainId, {
  icon: LucideIcon;
  lightIcon: string;
  darkIcon: string;
}> = {
  engineering: { icon: Factory, lightIcon: 'bg-[#DDEAF5] text-[#205089]', darkIcon: 'bg-[#A8D4FF]/10 text-[#A8D4FF]' },
  medicine: { icon: HeartPulse, lightIcon: 'bg-[#E2F0EA] text-[#2F6F59]', darkIcon: 'bg-[#7FD3B1]/10 text-[#9BDCC2]' },
  business: { icon: BriefcaseBusiness, lightIcon: 'bg-[#ECE7F5] text-[#66518F]', darkIcon: 'bg-[#B8A1E6]/10 text-[#C9B8ED]' },
  society: { icon: Users, lightIcon: 'bg-[#DDEAF5] text-[#205089]', darkIcon: 'bg-[#A8D4FF]/10 text-[#A8D4FF]' },
  'machine-learning': { icon: BrainCircuit, lightIcon: 'bg-[#E2F0EA] text-[#2F6F59]', darkIcon: 'bg-[#7FD3B1]/10 text-[#9BDCC2]' },
  'deep-learning': { icon: Network, lightIcon: 'bg-[#ECE7F5] text-[#66518F]', darkIcon: 'bg-[#B8A1E6]/10 text-[#C9B8ED]' },
  evaluation: { icon: ChartNoAxesCombined, lightIcon: 'bg-[#DDEAF5] text-[#205089]', darkIcon: 'bg-[#A8D4FF]/10 text-[#A8D4FF]' },
};

function StatisticalQuestionAtlas({ groups }: { groups: StatisticalQuestionGroup[] }) {
  const themeClasses = useLearningMdxTheme();
  const border = themeClasses.isLight ? 'border-[#205089]/12' : 'border-[#A8D4FF]/14';

  return (
    <section
      aria-label="Các miền câu hỏi nghiên cứu và kinh doanh"
      className={cx(
        'overflow-hidden rounded-2xl border',
        border,
        themeClasses.isLight ? 'bg-[#F8FAFC]' : 'bg-[#121A24]/45',
      )}
    >
      <div className="grid lg:grid-cols-2">
        {groups.map((group, index) => {
          const meta = statisticalQuestionDomainMeta[group.id];
          const Icon = meta.icon;
          const isLast = index === groups.length - 1;
          const hasRightDivider = index % 2 === 0 && !isLast;

          return (
            <section
              key={group.id}
              className={cx(
                'grid content-start gap-4 border-b px-5 py-5 sm:px-6 sm:py-6',
                border,
                isLast && 'border-b-0 lg:col-span-2',
                hasRightDivider && 'lg:border-r',
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cx('grid h-10 w-10 shrink-0 place-items-center rounded-xl', themeClasses.isLight ? meta.lightIcon : meta.darkIcon)}>
                  <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                </span>
                <h3 className={cx('text-base font-black leading-6', themeClasses.titleText)}>{group.title}</h3>
              </div>
              <ul className={cx('grid gap-3', isLast && 'sm:grid-cols-2 sm:gap-x-8')}>
                {group.questions.map((question) => (
                  <li key={question} className={cx('flex gap-3 text-sm font-semibold leading-6', themeClasses.bodyText)}>
                    <span className={cx('mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full', themeClasses.isLight ? 'bg-[#517FCB]' : 'bg-[#A8D4FF]')} aria-hidden="true" />
                    <span>{question}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}

type StatisticsBranch = {
  id: 'descriptive' | 'inferential';
  title: string;
  englishTitle: string;
  question: string;
  description: string;
  steps: string[];
  tools: string[];
  visualsLabel?: string;
  visuals?: Array<{
    id: 'histogram' | 'box-plot' | 'scatter-plot';
    title: string;
    insight: string;
  }>;
};

const statisticsBranchMeta: Record<StatisticsBranch['id'], {
  icon: LucideIcon;
  lightIcon: string;
  darkIcon: string;
  lightSurface: string;
  darkSurface: string;
}> = {
  descriptive: {
    icon: Database,
    lightIcon: 'bg-[#DDEAF5] text-[#205089]',
    darkIcon: 'bg-[#A8D4FF]/10 text-[#A8D4FF]',
    lightSurface: 'bg-[#F7FAFD]',
    darkSurface: 'bg-[#A8D4FF]/5',
  },
  inferential: {
    icon: ScanSearch,
    lightIcon: 'bg-[#E2F0EA] text-[#2F6F59]',
    darkIcon: 'bg-[#7FD3B1]/10 text-[#9BDCC2]',
    lightSurface: 'bg-[#F5FAF8]',
    darkSurface: 'bg-[#7FD3B1]/5',
  },
};

function DescriptiveStatisticsGallery({ label, visuals }: {
  label: string;
  visuals: NonNullable<StatisticsBranch['visuals']>;
}) {
  const themeClasses = useLearningMdxTheme();
  const border = themeClasses.isLight ? 'border-[#205089]/12' : 'border-[#A8D4FF]/14';
  const axis = themeClasses.isLight ? 'text-[#71869B]' : 'text-[#8296AA]';
  const mark = themeClasses.isLight ? 'text-[#2F78B7]' : 'text-[#8CC8F2]';

  const renderChart = (visual: NonNullable<StatisticsBranch['visuals']>[number]) => {
    if (visual.id === 'histogram') {
      return (
        <svg viewBox="0 0 140 88" role="img" aria-label={`${visual.title}: ${visual.insight}`} className="h-24 w-full" preserveAspectRatio="xMidYMid meet">
          <title>{`${visual.title}: ${visual.insight}`}</title>
          <path d="M18 12V70H128" fill="none" stroke="currentColor" strokeWidth="1.5" className={axis} />
          <g fill="currentColor" className={mark}>
            <rect x="25" y="58" width="13" height="12" rx="2" opacity="0.48" />
            <rect x="41" y="44" width="13" height="26" rx="2" opacity="0.62" />
            <rect x="57" y="23" width="13" height="47" rx="2" opacity="0.88" />
            <rect x="73" y="31" width="13" height="39" rx="2" opacity="0.76" />
            <rect x="89" y="49" width="13" height="21" rx="2" opacity="0.58" />
            <rect x="105" y="61" width="13" height="9" rx="2" opacity="0.42" />
          </g>
        </svg>
      );
    }
    if (visual.id === 'box-plot') {
      return (
        <svg viewBox="0 0 140 88" role="img" aria-label={`${visual.title}: ${visual.insight}`} className="h-24 w-full" preserveAspectRatio="xMidYMid meet">
          <title>{`${visual.title}: ${visual.insight}`}</title>
          <path d="M18 70H128" fill="none" stroke="currentColor" strokeWidth="1.5" className={axis} />
          <g fill="none" stroke="currentColor" className={mark} strokeWidth="2">
            <path d="M24 42H43M99 42H116M24 32V52M116 32V52" />
            <rect x="43" y="25" width="56" height="34" rx="3" fill="currentColor" fillOpacity="0.12" />
            <path d="M71 25V59" strokeWidth="3" />
            <circle cx="126" cy="42" r="3" fill="currentColor" stroke="none" />
          </g>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 140 88" role="img" aria-label={`${visual.title}: ${visual.insight}`} className="h-24 w-full" preserveAspectRatio="xMidYMid meet">
        <title>{`${visual.title}: ${visual.insight}`}</title>
        <path d="M18 12V70H128" fill="none" stroke="currentColor" strokeWidth="1.5" className={axis} />
        <path d="M27 64L118 22" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.55" className={mark} />
        <g fill="currentColor" className={mark}>
          <circle cx="29" cy="61" r="3.5" /><circle cx="42" cy="55" r="3.5" opacity="0.72" />
          <circle cx="54" cy="57" r="3.5" opacity="0.58" /><circle cx="65" cy="43" r="3.5" />
          <circle cx="78" cy="46" r="3.5" opacity="0.7" /><circle cx="91" cy="32" r="3.5" />
          <circle cx="104" cy="35" r="3.5" opacity="0.64" /><circle cx="117" cy="20" r="3.5" />
        </g>
      </svg>
    );
  };

  return (
    <figure className={cx('overflow-hidden rounded-xl border', border, themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]/55')}>
      <figcaption className={cx('border-b px-4 py-2.5 text-sm font-black', border, themeClasses.titleText)}>{label}</figcaption>
      <div className={cx('grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0', themeClasses.isLight ? 'divide-[#205089]/10' : 'divide-[#A8D4FF]/12')}>
        {visuals.map((visual) => (
          <div key={visual.id} className="grid content-start gap-1 px-3 py-3">
            {renderChart(visual)}
            <div>
              <span className={cx('block text-xs font-black', themeClasses.titleText)}>{visual.title}</span>
              <span className={cx('mt-0.5 block text-[0.7rem] font-semibold leading-4', themeClasses.mutedText)}>{visual.insight}</span>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

function StatisticsBranchesOverview({ branches, nextSteps }: { branches: StatisticsBranch[]; nextSteps: string[] }) {
  const themeClasses = useLearningMdxTheme();
  const border = themeClasses.isLight ? 'border-[#205089]/12' : 'border-[#A8D4FF]/14';

  return (
    <section
      aria-label="So sánh thống kê mô tả và thống kê suy luận"
      className={cx('overflow-hidden rounded-2xl border', border, themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]/45')}
    >
      <div className="grid md:grid-cols-[1.15fr_0.85fr]">
        {branches.map((branch, branchIndex) => {
          const meta = statisticsBranchMeta[branch.id];
          const Icon = meta.icon;
          return (
            <article
              key={branch.id}
              className={cx(
                'grid content-start gap-5 px-5 py-6 sm:px-6 sm:py-7',
                branchIndex > 0 && 'border-t md:border-l md:border-t-0',
                border,
                themeClasses.isLight ? meta.lightSurface : meta.darkSurface,
              )}
            >
              <div className="flex items-start gap-3">
                <span className={cx('grid h-11 w-11 shrink-0 place-items-center rounded-xl', themeClasses.isLight ? meta.lightIcon : meta.darkIcon)}>
                  <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className={cx('text-lg font-black leading-6', themeClasses.titleText)}>{branch.title}</h3>
                  <p className={cx('mt-0.5 text-xs font-bold', themeClasses.mutedText)}>{branch.englishTitle}</p>
                </div>
              </div>

              <p className={cx('text-xl font-black leading-8 text-pretty', themeClasses.titleText)}>{branch.question}</p>
              <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{branch.description}</p>

              {branch.visuals?.length && branch.visualsLabel ? (
                <DescriptiveStatisticsGallery label={branch.visualsLabel} visuals={branch.visuals} />
              ) : null}

              <ol className="grid items-center gap-2 sm:grid-cols-3" aria-label={`Quy trình ${branch.title}`}>
                {branch.steps.map((step, stepIndex) => (
                  <li key={step} className="flex items-center gap-2">
                    <span className={cx('grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.68rem] font-black', themeClasses.isLight ? meta.lightIcon : meta.darkIcon)}>
                      {stepIndex + 1}
                    </span>
                    <span className={cx('text-sm font-bold leading-5', themeClasses.bodyText)}>{step}</span>
                    {stepIndex < branch.steps.length - 1 ? <ArrowRight className={cx('ml-auto hidden h-4 w-4 shrink-0 sm:block', themeClasses.mutedText)} strokeWidth={1.8} aria-hidden="true" /> : null}
                  </li>
                ))}
              </ol>

              <ul className={cx('grid gap-2 border-t pt-4', border)}>
                {branch.tools.map((tool) => (
                  <li key={tool} className={cx('flex gap-2 text-sm font-semibold leading-6', themeClasses.bodyText)}>
                    <Check className={cx('mt-1 h-4 w-4 shrink-0', branch.id === 'descriptive' ? themeClasses.accentText : themeClasses.isLight ? 'text-[#2F6F59]' : 'text-[#9BDCC2]')} strokeWidth={2.2} aria-hidden="true" />
                    <span>{tool}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <div className={cx('flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:px-6', border, themeClasses.isLight ? 'bg-[#EEF4F9]' : 'bg-[#172232]')}>
        {nextSteps.map((step, index) => (
          <div key={step} className="contents">
            <span className={cx('text-sm font-black leading-6', themeClasses.titleText)}>{step}</span>
            {index < nextSteps.length - 1 ? <ArrowRight className={cx('h-4 w-4 shrink-0 rotate-90 sm:rotate-0', themeClasses.accentText)} strokeWidth={2.2} aria-hidden="true" /> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

const studyDesignScenarios = [
  { id: 'retrospective', title: 'Dữ liệu hồi cứu', detail: 'Một kỹ sư dùng hồ sơ bảo dưỡng cũ để xem máy nào có nhiều lỗi hơn.', answer: 'association', feedback: 'Đúng: dữ liệu quá khứ có thể mô tả hoặc chỉ ra mối liên hệ, nhưng không tự chứng minh nguyên nhân.' },
  { id: 'observational', title: 'Nghiên cứu quan sát', detail: 'Một nhóm ghi nhận nhiệt độ và tỷ lệ lỗi của các ca sản xuất như chúng vốn diễn ra.', answer: 'association', feedback: 'Đúng: có thể thấy mối liên hệ, nhưng ca nóng có thể đồng thời khác về máy, vật liệu hoặc người vận hành.' },
  { id: 'experiment', title: 'Thực nghiệm ngẫu nhiên', detail: 'Các chi tiết được phân ngẫu nhiên vào hai chế độ nhiệt, rồi so sánh tỷ lệ lỗi.', answer: 'causal', feedback: 'Đúng: phân ngẫu nhiên giúp so sánh công bằng hơn, nên bằng chứng phù hợp hơn cho kết luận nhân quả.' },
] as const;

type StudyClaim = 'association' | 'causal';

function StatisticalThinkingStudyDesignVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const [answers, setAnswers] = useState<Partial<Record<(typeof studyDesignScenarios)[number]['id'], StudyClaim>>>({});
  const reset = () => setAnswers({});
  return (
    <section aria-labelledby="statistical-thinking-design-title" className={cx('grid gap-4 rounded-xl border px-4 py-5 sm:px-5', themeClasses.isLight ? 'border-[#205089]/14 bg-[#F7FAFD]' : 'border-[#A8D4FF]/18 bg-[#121A24]')}>
      <div className="flex items-start gap-3"><span className={cx('grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-black', themeClasses.isLight ? 'bg-[#E2F0EA] text-[#2F6F59]' : 'bg-[#7FD3B1]/10 text-[#9BDCC2]')} aria-hidden="true">2</span><div className="grid gap-1"><h3 id="statistical-thinking-design-title" className={cx('text-base font-black', themeClasses.titleText)}>Bằng chứng nào cho phép kết luận gì?</h3><p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>Với mỗi tình huống, chọn kết luận mạnh nhất mà thiết kế nghiên cứu có thể hỗ trợ.</p></div></div>
      <div className="grid gap-3">
        {studyDesignScenarios.map((scenario) => {
          const selected = answers[scenario.id];
          const correct = selected === scenario.answer;
          return <article key={scenario.id} className={cx('grid gap-3 rounded-lg border px-3 py-3 sm:px-4', themeClasses.isLight ? 'border-[#205089]/14 bg-white' : 'border-[#A8D4FF]/16 bg-[#172232]')}>
            <div><h4 className={cx('text-sm font-black', themeClasses.titleText)}>{scenario.title}</h4><p className={cx('mt-1 text-sm font-semibold leading-6', themeClasses.bodyText)}>{scenario.detail}</p></div>
            <div role="group" aria-label={`Kết luận cho ${scenario.title}`} className="flex flex-wrap gap-2">
              {([
                ['association', 'Mô tả hoặc mối liên hệ'],
                ['causal', 'Quan hệ nhân quả'],
              ] as const).map(([claim, label]) => <button key={claim} type="button" aria-pressed={selected === claim} onClick={() => setAnswers((current) => ({ ...current, [scenario.id]: claim }))} className={cx('min-h-10 rounded-lg border px-3 text-sm font-black transition-colors', themeClasses.focusRing, selected === claim ? themeClasses.isLight ? 'border-[#205089] bg-[#EAF1F7] text-[#123B68]' : 'border-[#A8D4FF] bg-[#A8D4FF]/10 text-[#D7EAFE]' : themeClasses.isLight ? 'border-[#B8C9D8] text-[#43536A]' : 'border-[#A8D4FF]/24 text-[#C8D4DF]')}>{label}</button>)}
            </div>
            {selected ? <p aria-live="polite" className={cx('text-sm font-bold leading-6', correct ? themeClasses.isLight ? 'text-[#2D7646]' : 'text-[#8ED8A4]' : themeClasses.isLight ? 'text-[#A05218]' : 'text-[#F0B172]')}>{correct ? scenario.feedback : scenario.answer === 'association' ? 'Chưa đúng. Không có phân ngẫu nhiên; một yếu tố khác có thể đồng thời giải thích kết quả.' : 'Chưa đúng. Hãy tìm điểm khác biệt: các chi tiết được phân ngẫu nhiên vào hai chế độ trước khi đo kết quả.'}</p> : null}
          </article>;
        })}
      </div>
      {Object.keys(answers).length ? <button type="button" onClick={reset} className={cx('justify-self-start min-h-10 px-2 text-sm font-black underline underline-offset-4', themeClasses.focusRing, themeClasses.mutedText)}>Làm lại cả ba tình huống</button> : null}
    </section>
  );
}

function ProbabilityChapterVisual({ kind }: {
  kind: ProbabilityChapterVisualKind;
}) {
  const themeClasses = useLearningMdxTheme();
  if (kind === 'foundations') return <FoundationsVisual themeClasses={themeClasses} />;
  if (kind === 'experiment-outcomes') return <ExperimentOutcomesVisual themeClasses={themeClasses} />;
  if (kind === 'hidden-coin-probability') return <HiddenCoinProbabilityVisual themeClasses={themeClasses} />;
  if (kind === 'large-number-applications') return <LargeNumberApplicationsVisual themeClasses={themeClasses} />;
  if (kind === 'elementary') return <ElementaryEventVisual themeClasses={themeClasses} />;
  if (kind === 'certainty') return <CertaintyVisual themeClasses={themeClasses} />;
  if (kind === 'sample-space') return <SampleSpaceVisual themeClasses={themeClasses} />;
  if (kind === 'union') return <RelationsVisual focus="union" themeClasses={themeClasses} />;
  if (kind === 'intersection') return <RelationsVisual focus="intersection" themeClasses={themeClasses} />;
  if (kind === 'exclusive') return <ExclusiveEventsVisual themeClasses={themeClasses} />;
  if (kind === 'exclusive-not-complement') return <ExclusiveNotComplementVisual themeClasses={themeClasses} />;
  if (kind === 'axioms') return <AxiomsVisual themeClasses={themeClasses} />;
  if (kind === 'statistical-assumptions') return <StatisticalAssumptionsVisual themeClasses={themeClasses} />;
  if (kind === 'responsible-statistics-checklist') return <ResponsibleStatisticsChecklistVisual themeClasses={themeClasses} />;
  if (kind === 'statistics-misuse-quote') return <StatisticsMisuseQuoteVisual themeClasses={themeClasses} />;
  if (kind === 'statistical-thinking-sampling') return <StatisticalThinkingSamplingVisual themeClasses={themeClasses} />;
  if (kind === 'statistical-thinking-study-design') return <StatisticalThinkingStudyDesignVisual themeClasses={themeClasses} />;
  if (kind === 'empirical') return <EmpiricalVisual themeClasses={themeClasses} />;
  if (kind === 'descriptive-center-histogram') return <DescriptiveCenterHistogramVisual themeClasses={themeClasses} />;
  if (kind === 'ideal-normal-center') return <IdealNormalCenterVisual themeClasses={themeClasses} />;
  if (kind === 'frequency-stability') return <FrequencyStabilityVisual themeClasses={themeClasses} />;
  if (kind === 'frequency-simulation') return <FrequencySimulationVisual themeClasses={themeClasses} />;
  if (kind === 'conditional') return <ConditionalVisual themeClasses={themeClasses} />;
  if (kind === 'total') return <TotalVisual themeClasses={themeClasses} />;
  if (kind === 'total-sum') return <TotalSumVisual themeClasses={themeClasses} />;
  if (kind === 'bayes') return <BayesVisual themeClasses={themeClasses} />;
  if (kind === 'bayes-prior-posterior') return <BayesVisual focus="prior-posterior" themeClasses={themeClasses} />;
  if (kind === 'bayes-normalization') return <BayesNormalizationVisual themeClasses={themeClasses} />;
  if (kind === 'naive-bayes-combinations') return <NaiveBayesCombinationsVisual themeClasses={themeClasses} />;
  if (kind === 'naive-bayes-exercise') return <NaiveBayesExerciseVisual themeClasses={themeClasses} />;
  if (kind === 'naive-bayes-laplace') return <NaiveBayesLaplaceVisual themeClasses={themeClasses} />;
  if (kind === 'naive-bayes-practical') return <NaiveBayesPracticalVisual themeClasses={themeClasses} />;
  if (kind === 'naive-bayes-tradeoffs') return <NaiveBayesTradeoffsVisual themeClasses={themeClasses} />;
  if (kind === 'play-tennis-data') return <PlayTennisDataVisual themeClasses={themeClasses} />;
  if (kind === 'play-tennis-likelihoods') return <PlayTennisLikelihoodVisual themeClasses={themeClasses} />;
  if (kind === 'play-tennis-likelihoods-laplace') return <PlayTennisLikelihoodVisual smoothed themeClasses={themeClasses} />;
  if (kind === 'email-naive-bayes-data') return <EmailNaiveBayesPracticeVisual step="data" themeClasses={themeClasses} />;
  if (kind === 'email-naive-bayes-probabilities') return <EmailNaiveBayesPracticeVisual step="probabilities" themeClasses={themeClasses} />;
  if (kind === 'email-naive-bayes-scores') return <EmailNaiveBayesPracticeVisual step="scores" themeClasses={themeClasses} />;
  return null;
}

export const statisticsMdxComponents = {
  HistogramBinComparison,
  HistogramBinExplorer,
  HistogramConstructionVisual,
  HistogramReadingInteraction,
  HistogramRulesVisual,
  HistogramShapeVisual,
  NormalDistributionVisual,
  NormalParameterExplorer,
  PopulationSampleObservationOverview,
  ProbabilityChapterVisual,
  ProbabilitySourceImage,
  StatisticalQuestionAtlas,
  StatisticsBranchesOverview,
  VarianceConceptVisual,
  VarianceEstimatorComparison,
  VariancePointExplorer,
} satisfies Record<typeof STATISTICS_MDX_COMPONENT_NAMES[number], LearningMdxComponent>;

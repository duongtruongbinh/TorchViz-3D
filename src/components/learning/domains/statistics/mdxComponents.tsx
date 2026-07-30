import {
  ArrowRight,
  BookOpenCheck,
  Cloud,
  CloudRain,
  ChartColumn,
  CircleDot,
  Dices,
  Eye,
  GitBranch,
  ListChecks,
  RefreshCw,
  Scale,
  Sigma,
  Sun,
  Target,
  type LucideIcon,
} from 'lucide-react';
import katex from 'katex';
import { useEffect, useId, useMemo, useState } from 'react';
import experimentOutcomesIllustration from '../../../../assets/learning/statistics/ch01-probability/01-statistics-probability-origins-experiment-outcomes.png';
import certainImpossibleEventsIllustration from '../../../../assets/learning/statistics/ch01-probability/02-statistics-experiments-events-sample-space-certain-impossible-events.png';
import elementaryEventsIllustration from '../../../../assets/learning/statistics/ch01-probability/02-statistics-experiments-events-sample-space-elementary-events.png';
import experimentEventIllustration from '../../../../assets/learning/statistics/ch01-probability/02-statistics-experiments-events-sample-space-experiment-event.png';
import randomEventVariableIllustration from '../../../../assets/learning/statistics/ch01-probability/02-statistics-experiments-events-sample-space-random-event-variable.png';
import priorPosteriorProbabilityIllustration from '../../../../assets/learning/statistics/ch01-probability/06-statistics-conditional-probability-prior-posterior.png';
import { STATISTICS_MDX_COMPONENT_NAMES } from '../../../../content/learning/mdxComponents';
import {
  useLearningMdxTheme,
  type LearningMdxComponent,
  type LearningThemeClasses,
} from '../../learningMdxComponents';
import { cx } from '../../theme';

type ProbabilityChapterVisualKind =
  | 'axioms'
  | 'bayes'
  | 'bayes-normalization'
  | 'bayes-prior-posterior'
  | 'certainty'
  | 'complement'
  | 'conditional'
  | 'elementary'
  | 'empirical'
  | 'experiment-outcomes'
  | 'exhaustive'
  | 'exhaustive-raffle'
  | 'exhaustive-survey'
  | 'exclusive'
  | 'exclusive-not-complement'
  | 'exercises'
  | 'foundations'
  | 'frequency-simulation'
  | 'frequency-stability'
  | 'histogram'
  | 'independence'
  | 'naive-bayes-evidence'
  | 'naive-bayes-practical'
  | 'intersection-cases'
  | 'pairwise-exclusive'
  | 'relations'
  | 'equiprobable'
  | 'prior-posterior'
  | 'probability-definitions'
  | 'random-variable'
  | 'sample-space'
  | 'statistical-modelling-schools'
  | 'total'
  | 'total-sum';

function MathText({ className, formula }: { className?: string; formula: string }) {
  return (
    <span
      aria-label={formula}
      className={className}
      dangerouslySetInnerHTML={{ __html: katex.renderToString(formula, { throwOnError: false }) }}
    />
  );
}

function ProbabilitySourceImage({ alt, source, src }: { alt: string; source: string; src: string }) {
  const themeClasses = useLearningMdxTheme();
  return (
    <figure className="grid w-full justify-items-center gap-2">
      <img src={src} alt={alt} loading="lazy" className="max-h-[18rem] w-auto max-w-full rounded-lg object-contain" />
      <figcaption className={cx('text-center text-xs font-semibold leading-5', themeClasses.mutedText)}>
        Nguồn: {source}
      </figcaption>
    </figure>
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
  const concepts: Array<{
    description: React.ReactNode;
    english: string;
    title: string;
  }> = [
    {
      title: 'Phép thử',
      english: 'Experiment',
      description: 'gieo một con xúc xắc.',
    },
    {
      title: 'Kết quả',
      english: 'Outcome',
      description: 'xúc xắc xuất hiện một mặt cụ thể, ví dụ số 4.',
    },
    {
      title: 'Không gian mẫu',
      english: 'Sample space',
      description: <MathText formula="\Omega = \{1, 2, 3, 4, 5, 6\}" />,
    },
    {
      title: 'Biến cố',
      english: 'Event',
      description: 'Tập hợp các kết quả đầu ra. Ví dụ biến cố xuất hiện mặt chẵn.',
    },
  ];
  const numberClasses = themeClasses.isLight
    ? ['bg-[#205089] text-white', 'bg-[#39724A] text-white', 'bg-[#765426] text-white', 'bg-[#7E405F] text-white']
    : ['bg-[#789CC2] text-[#121A24]', 'bg-[#78C990] text-[#121A24]', 'bg-[#E4B875] text-[#121A24]', 'bg-[#D699B8] text-[#121A24]'];

  return (
    <div className="grid gap-4">
      <img
        src={experimentEventIllustration}
        alt="Sơ đồ thí nghiệm gieo xúc xắc: phép thử, kết quả, không gian mẫu và biến cố xuất hiện số chẵn"
        loading="lazy"
        className="h-auto w-full rounded-xl object-contain"
      />
      <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {concepts.map((concept, index) => (
          <li
            key={concept.title}
            className={cx(
              'grid min-h-36 content-start gap-4 rounded-xl border p-4',
              themeClasses.isLight
                ? 'border-[#205089]/12 bg-white text-[#172A43]'
                : 'border-[#A8B8C8]/16 bg-[#121A24]/42 text-[#F2F6FA]',
            )}
          >
            <div className="flex items-start gap-3">
              <span className={cx('grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-black', numberClasses[index])}>
                {index + 1}
              </span>
              <div className="min-w-0 pt-0.5">
                <h3 className={cx('text-sm font-black leading-5', themeClasses.titleText)}>{concept.title}</h3>
                <span className={cx('text-xs font-semibold leading-5', themeClasses.mutedText)}>{concept.english}</span>
              </div>
            </div>
            <p className={cx('text-sm font-medium leading-6', themeClasses.bodyText)}>{concept.description}</p>
          </li>
        ))}
      </ol>
    </div>
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

function RandomVariableVisual({ themeClasses: _themeClasses }: { themeClasses: LearningThemeClasses }) {
  return (
    <img
      src={randomEventVariableIllustration}
      alt="So sánh biến cố ngẫu nhiên là một tập hợp kết quả với biến ngẫu nhiên là một hàm ánh xạ kết quả thành số"
      loading="lazy"
      className="h-auto w-full rounded-xl object-contain"
    />
  );
}

function CertaintyVisual({ themeClasses: _themeClasses }: { themeClasses: LearningThemeClasses }) {
  return (
    <img
      src={certainImpossibleEventsIllustration}
      alt="So sánh biến cố chắc chắn xúc xắc xuất hiện mặt từ 1 đến 6 với biến cố không thể xúc xắc xuất hiện mặt 7"
      loading="lazy"
      className="h-auto w-full rounded-xl object-contain"
    />
  );
}

function ExperimentOutcomesVisual({ themeClasses: _themeClasses }: { themeClasses: LearningThemeClasses }) {
  return (
    <img
      src={experimentOutcomesIllustration}
      alt="Phép thử có kết quả chưa biết trước nhưng phạm vi kết quả của xúc xắc là Omega bằng tập hợp từ 1 đến 6"
      loading="lazy"
      className="h-auto w-full rounded-xl object-contain"
    />
  );
}

function SampleSpaceVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const outcomes = ['1', '2', '3', '4', '5', '6'];
  return (
    <VisualSurface label="Không gian mẫu của phép tung một con xúc sắc gồm sáu kết quả sơ cấp" themeClasses={themeClasses}>
      <div className={cx(
        'rounded-2xl border-2 border-dashed px-4 py-4 sm:px-5',
        themeClasses.isLight ? 'border-[#205089]/24 bg-white/55' : 'border-[#A8D4FF]/22 bg-[#121A24]/24',
      )}>
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
    </VisualSurface>
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

function RelationsVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  return (
    <section
      aria-label="Minh họa quan hệ hợp và giao giữa hai biến cố"
      className={cx(
        'overflow-hidden rounded-xl px-4 py-4 sm:px-5 sm:py-5',
        themeClasses.isLight ? 'bg-white text-[#172A43]' : 'bg-[#121A24] text-[#F2F6FA]',
      )}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <section className="grid content-start justify-items-center gap-1">
          <MathText className={cx('text-xl font-semibold', themeClasses.titleText)} formula="A\cup B" />
          <EventSetDiagram variant="union" themeClasses={themeClasses} />
          <p className={cx('text-center text-sm font-bold', themeClasses.bodyText)}>Ít nhất một biến cố xảy ra</p>
        </section>
        <section className="grid content-start justify-items-center gap-1">
          <MathText className={cx('text-xl font-semibold', themeClasses.titleText)} formula="A\cap B" />
          <EventSetDiagram variant="intersection" themeClasses={themeClasses} />
          <p className={cx('text-center text-sm font-bold', themeClasses.bodyText)}>Đồng thời xảy ra</p>
        </section>
      </div>
    </section>
  );
}

function IntersectionCaseDiagram({ themeClasses, variant }: {
  themeClasses: LearningThemeClasses;
  variant: 'disjoint' | 'nested' | 'partial';
}) {
  const clipId = useId().replaceAll(':', '');
  const palette = themeClasses.isLight
    ? {
        baseFill: '#F7FAFD',
        intersectionFill: 'rgba(40,148,122,0.42)',
        label: '#172A43',
        strokeA: '#7FA9E5',
        strokeB: '#78A98A',
      }
    : {
        baseFill: 'rgba(242,246,250,0.03)',
        intersectionFill: 'rgba(125,211,179,0.40)',
        label: '#F2F6FA',
        strokeA: '#8CB9E8',
        strokeB: '#9DDBAF',
      };

  if (variant === 'nested') {
    return (
      <svg viewBox="0 0 210 130" role="img" aria-label="Tập hợp A nằm hoàn toàn trong tập hợp B" className="h-auto w-full max-w-[13rem]">
        <circle cx="105" cy="65" r="50" fill={palette.baseFill} stroke={palette.strokeB} strokeWidth="2" />
        <circle cx="88" cy="65" r="27" fill={palette.intersectionFill} stroke={palette.strokeA} strokeWidth="2" />
        <text x="88" y="71" fill={palette.label} fontSize="17" fontWeight="800" textAnchor="middle">A</text>
        <text x="132" y="71" fill={palette.label} fontSize="17" fontWeight="800" textAnchor="middle">B</text>
      </svg>
    );
  }

  if (variant === 'partial') {
    return (
      <svg viewBox="0 0 210 130" role="img" aria-label="Hai tập hợp A và B giao nhau một phần" className="h-auto w-full max-w-[13rem]">
        <defs>
          <clipPath id={clipId}>
            <circle cx="127" cy="65" r="42" />
          </clipPath>
        </defs>
        <circle cx="83" cy="65" r="42" fill={palette.baseFill} />
        <circle cx="127" cy="65" r="42" fill={palette.baseFill} />
        <circle cx="83" cy="65" r="42" fill={palette.intersectionFill} clipPath={`url(#${clipId})`} />
        <circle cx="83" cy="65" r="42" fill="none" stroke={palette.strokeA} strokeWidth="2" />
        <circle cx="127" cy="65" r="42" fill="none" stroke={palette.strokeB} strokeWidth="2" />
        <text x="68" y="71" fill={palette.label} fontSize="17" fontWeight="800" textAnchor="middle">A</text>
        <text x="142" y="71" fill={palette.label} fontSize="17" fontWeight="800" textAnchor="middle">B</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 210 130" role="img" aria-label="Hai tập hợp A và B hoàn toàn không giao nhau" className="h-auto w-full max-w-[13rem]">
      <circle cx="62" cy="65" r="38" fill={palette.baseFill} stroke={palette.strokeA} strokeWidth="2" />
      <circle cx="148" cy="65" r="38" fill={palette.baseFill} stroke={palette.strokeB} strokeWidth="2" />
      <text x="62" y="71" fill={palette.label} fontSize="17" fontWeight="800" textAnchor="middle">A</text>
      <text x="148" y="71" fill={palette.label} fontSize="17" fontWeight="800" textAnchor="middle">B</text>
    </svg>
  );
}

function IntersectionCasesVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const cases = [
    {
      description: 'Một trong 2 tập hợp nằm hoàn toàn trong tập hợp kia',
      formula: 'A\\subseteq B',
      variant: 'nested',
    },
    {
      description: 'Hai tập hợp chỉ giao nhau một phần nhỏ',
      formula: 'A\\cap B\\ne\\varnothing',
      variant: 'partial',
    },
    {
      description: 'Hai tập hợp hoàn toàn không giao nhau',
      formula: 'A\\cap B=\\varnothing',
      variant: 'disjoint',
    },
  ] as const;

  return (
    <section aria-label="Ba trường hợp giao nhau giữa hai tập hợp" className="grid gap-4">
      <h3 className={cx('text-base font-black', themeClasses.titleText)}>Vậy sẽ có 3 trường hợp xảy ra:</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {cases.map((item) => (
          <article
            key={item.variant}
            className={cx(
              'grid h-full grid-rows-[auto_minmax(7.5rem,1fr)_auto] justify-items-center gap-2 rounded-xl px-3 py-4',
              themeClasses.isLight ? 'bg-[#F5F8FB]' : 'bg-[#121A24]/42',
            )}
          >
            <MathText className={cx('text-base font-semibold', themeClasses.titleText)} formula={item.formula} />
            <div className="grid w-full place-items-center">
              <IntersectionCaseDiagram variant={item.variant} themeClasses={themeClasses} />
            </div>
            <p className={cx('text-center text-sm font-semibold leading-6', themeClasses.bodyText)}>{item.description}</p>
          </article>
        ))}
      </div>
      <aside className="w-full rounded-lg bg-white px-4 py-3.5 leading-7 text-[#254F70] [&_strong]:font-black">
        Vậy phần giao như giữa 2 tập hợp đầu đều được gọi là <strong>biến cố tích</strong>. Trường hợp thứ 3 thì ta sẽ gọi hai biến cố này là <strong>xung khắc</strong>, ta sẽ đi tìm hiểu về khái niệm này ở phần sau.
      </aside>
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

function PairwiseExclusiveVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const circleClass = cx(
    'absolute z-10 grid h-24 w-24 place-items-center rounded-full border-2',
    themeClasses.isLight ? 'bg-white text-[#172A43]' : 'bg-[#172232] text-[#F2F6FA]',
  );
  const emptyBadge = cx(
    'absolute z-20 grid h-8 min-w-8 place-items-center rounded-lg px-1.5 text-sm font-semibold',
    themeClasses.isLight ? 'bg-white text-[#9D3E45]' : 'bg-[#172232] text-[#F3A7AD]',
  );
  const lineColor = themeClasses.isLight ? '#9AAFC2' : '#667C91';

  return (
    <section
      aria-label="Ba biến cố A một, A hai và A ba xung khắc theo từng cặp"
      className={cx(
        'overflow-hidden rounded-xl px-4 py-4 sm:px-5',
        themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]',
      )}
    >
      <div className="relative mx-auto h-56 w-full max-w-[27rem]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 432 224" aria-hidden="true">
          <line x1="72" y1="64" x2="360" y2="64" stroke={lineColor} strokeWidth="2" strokeDasharray="5 6" />
          <line x1="72" y1="64" x2="216" y2="176" stroke={lineColor} strokeWidth="2" strokeDasharray="5 6" />
          <line x1="360" y1="64" x2="216" y2="176" stroke={lineColor} strokeWidth="2" strokeDasharray="5 6" />
        </svg>
        <div className={cx(circleClass, 'left-0 top-2 border-[#7FA9E5]')}>
          <MathText className="text-xl font-semibold" formula="A_1" />
        </div>
        <div className={cx(circleClass, 'right-0 top-2 border-[#78A98A]')}>
          <MathText className="text-xl font-semibold" formula="A_2" />
        </div>
        <div className={cx(circleClass, 'bottom-0 left-1/2 -translate-x-1/2 border-[#B49AD6]')}>
          <MathText className="text-xl font-semibold" formula="A_3" />
        </div>
        <MathText className={cx(emptyBadge, 'left-1/2 top-7 -translate-x-1/2')} formula="\varnothing" />
        <MathText className={cx(emptyBadge, 'bottom-[4.5rem] left-[28%] -translate-x-1/2')} formula="\varnothing" />
        <MathText className={cx(emptyBadge, 'bottom-[4.5rem] right-[28%] translate-x-1/2')} formula="\varnothing" />
      </div>
    </section>
  );
}

function ComplementEventVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const palette = themeClasses.isLight
    ? {
        aFill: 'rgba(81,127,203,0.30)',
        aStroke: '#517FCB',
        complementFill: 'rgba(120,201,144,0.22)',
        sampleStroke: '#78A98A',
      }
    : {
        aFill: 'rgba(140,185,232,0.28)',
        aStroke: '#8CB9E8',
        complementFill: 'rgba(157,219,175,0.16)',
        sampleStroke: '#9DDBAF',
      };

  return (
    <section
      aria-label="Không gian mẫu Omega được chia thành biến cố A và biến cố đối của A"
      className={cx(
        'overflow-hidden rounded-xl px-4 py-4 sm:px-5',
        themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]',
      )}
    >
      <div className="relative mx-auto h-52 w-full max-w-[30rem]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 480 208" aria-hidden="true">
          <rect x="12" y="12" width="456" height="184" rx="14" fill={palette.complementFill} stroke={palette.sampleStroke} strokeWidth="2" />
          <circle cx="180" cy="104" r="72" fill={palette.aFill} stroke={palette.aStroke} strokeWidth="2" />
        </svg>
        <MathText className={cx('absolute left-[7%] top-[9%] text-lg font-semibold', themeClasses.titleText)} formula="\Omega" />
        <MathText className={cx('absolute left-[37.5%] top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-semibold', themeClasses.titleText)} formula="A" />
        <MathText className={cx('absolute right-[17%] top-1/2 -translate-y-1/2 text-2xl font-semibold', themeClasses.titleText)} formula="\overline{A}" />
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
        <MathText className={cx('absolute right-[8%] top-[14%] text-lg font-semibold', themeClasses.titleText)} formula="\overline{A}" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className={cx('rounded-lg px-3 py-2 text-sm font-semibold', themeClasses.isLight ? 'bg-[#F5F8FB] text-[#254F70]' : 'bg-[#A8D4FF]/8 text-[#D7EAFE]')}>
          <MathText formula="A\cap B=\varnothing" />
        </span>
        <span className={cx('rounded-lg px-3 py-2 text-sm font-semibold', themeClasses.isLight ? 'bg-[#F5F8FB] text-[#254F70]' : 'bg-[#A8D4FF]/8 text-[#D7EAFE]')}>
          <MathText formula="B\subsetneq\overline{A}" />
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

function ProbabilityDefinitionsVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const definitions: Array<{
    description: string;
    english: string;
    icon: LucideIcon;
    title: string;
  }> = [
    {
      title: 'Định nghĩa cổ điển',
      english: 'Classical probability',
      description: 'Dựa trên số kết quả thuận lợi trong một tập hợp các kết quả đồng khả năng.',
      icon: Sigma,
    },
    {
      title: 'Định nghĩa thống kê hay tần suất',
      english: 'Statistical/Frequentist probability',
      description: 'Dựa trên tần suất tương đối của biến cố khi phép thử được lặp lại nhiều lần.',
      icon: ChartColumn,
    },
  ];
  const accents = themeClasses.isLight
    ? ['bg-[#205089] text-white', 'bg-[#39724A] text-white']
    : ['bg-[#789CC2] text-[#121A24]', 'bg-[#78C990] text-[#121A24]'];

  return (
    <ol aria-label="Hai cách định nghĩa xác suất trong bài" className="grid gap-3 sm:grid-cols-2">
      {definitions.map((definition, index) => {
        const Icon = definition.icon;
        return (
          <li
            key={definition.title}
            className={cx(
              'grid min-h-44 content-start gap-5 rounded-xl border p-4 sm:p-5',
              themeClasses.isLight
                ? 'border-[#205089]/12 bg-white text-[#172A43]'
                : 'border-[#A8B8C8]/16 bg-[#121A24]/42 text-[#F2F6FA]',
            )}
          >
            <div className="flex items-start gap-3">
              <span className={cx('grid h-10 w-10 shrink-0 place-items-center rounded-lg', accents[index])}>
                <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className={cx('text-base font-black leading-6', themeClasses.titleText)}>{definition.title}</h3>
                <span className={cx('text-xs font-semibold leading-5', themeClasses.mutedText)}>{definition.english}</span>
              </div>
            </div>
            <p className={cx('text-sm font-medium leading-6', themeClasses.bodyText)}>{definition.description}</p>
          </li>
        );
      })}
    </ol>
  );
}

function StatisticalModellingSchoolsVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const schools: Array<{
    description: string;
    icon: LucideIcon;
    title: string;
  }> = [
    {
      title: 'Frequentist',
      description: 'Suy luận từ tần suất lấy mẫu và phân phối của dữ liệu khi phép thử được lặp lại.',
      icon: ChartColumn,
    },
    {
      title: 'Bayesian',
      description: 'Kết hợp tri thức tiên nghiệm với dữ liệu để cập nhật thành phân phối hậu nghiệm.',
      icon: RefreshCw,
    },
    {
      title: 'Machine Learning',
      description: 'Ưu tiên khả năng dự đoán và tổng quát hóa của mô hình trên dữ liệu mới.',
      icon: GitBranch,
    },
  ];
  const accents = themeClasses.isLight
    ? ['bg-[#205089] text-white', 'bg-[#39724A] text-white', 'bg-[#765426] text-white']
    : ['bg-[#789CC2] text-[#121A24]', 'bg-[#78C990] text-[#121A24]', 'bg-[#E4B875] text-[#121A24]'];

  return (
    <ol aria-label="Ba trường phái chính trong mô hình hóa thống kê" className="grid gap-3 sm:grid-cols-3">
      {schools.map((school, index) => {
        const Icon = school.icon;
        return (
          <li
            key={school.title}
            className={cx(
              'grid min-h-44 content-start gap-5 rounded-xl border p-4',
              themeClasses.isLight
                ? 'border-[#205089]/12 bg-white text-[#172A43]'
                : 'border-[#A8B8C8]/16 bg-[#121A24]/42 text-[#F2F6FA]',
            )}
          >
            <div className="flex items-center gap-3">
              <span className={cx('grid h-10 w-10 shrink-0 place-items-center rounded-lg', accents[index])}>
                <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              </span>
              <h3 className={cx('text-base font-black leading-6', themeClasses.titleText)}>{school.title}</h3>
            </div>
            <p className={cx('text-sm font-medium leading-6', themeClasses.bodyText)}>{school.description}</p>
          </li>
        );
      })}
    </ol>
  );
}

function EmpiricalVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const observed = [true, false, false, true, false, true, false, false, true, false];
  const divider = themeClasses.isLight ? 'sm:border-[#205089]/14' : 'sm:border-[#A8D4FF]/16';

  return (
    <section
      aria-label="Từ dữ liệu quan sát, đếm số lần biến cố A xảy ra rồi chia cho tổng số phép thử để thu được tần suất"
      className={cx('rounded-xl px-3 py-4 sm:px-5', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}
    >
      <div className="grid items-stretch gap-2 sm:grid-cols-[minmax(0,1.25fr)_auto_minmax(0,.75fr)_auto_minmax(0,.8fr)] sm:gap-0">
        <div className="grid content-center justify-items-center gap-3 px-3 py-3 text-center">
          <div className="flex items-center gap-2">
            <Eye className={cx('h-5 w-5', themeClasses.accentText)} strokeWidth={2} aria-hidden="true" />
            <span className={cx('text-sm font-black', themeClasses.titleText)}>Quan sát dữ liệu</span>
          </div>
          <div className="grid grid-cols-5 gap-2" aria-hidden="true">
            {observed.map((isEventA, index) => (
              <span
                key={index}
                className={cx(
                  'grid h-7 w-7 place-items-center rounded-full border text-[0.65rem] font-black',
                  isEventA
                    ? themeClasses.isLight ? 'border-[#205089] bg-[#205089] text-white' : 'border-[#A8D4FF] bg-[#789CC2] text-[#121A24]'
                    : themeClasses.isLight ? 'border-[#205089]/22 bg-white text-[#627D98]' : 'border-[#A8D4FF]/22 bg-[#172232] text-[#9FB3C8]',
                )}
              >
                {isEventA ? 'A' : '–'}
              </span>
            ))}
          </div>
          <MathText className={cx('text-sm font-semibold', themeClasses.bodyText)} formula="n=10" />
        </div>

        <ArrowRight className={cx('mx-auto h-5 w-5 rotate-90 self-center sm:rotate-0', themeClasses.mutedText)} strokeWidth={2} aria-hidden="true" />

        <div className={cx('grid content-center justify-items-center gap-3 px-3 py-4 text-center sm:border-l', divider)}>
          <Sigma className={cx('h-5 w-5', themeClasses.accentText)} strokeWidth={2} aria-hidden="true" />
          <span className={cx('text-sm font-black', themeClasses.titleText)}>Đếm biến cố</span>
          <MathText
            className={cx(
              'rounded-lg px-4 py-2 text-xl font-semibold',
              themeClasses.isLight ? 'bg-[#EAF1F7] text-[#205089]' : 'bg-[#A8D4FF]/9 text-[#D7EAFE]',
            )}
            formula="m=4"
          />
        </div>

        <ArrowRight className={cx('mx-auto h-5 w-5 rotate-90 self-center sm:rotate-0', themeClasses.mutedText)} strokeWidth={2} aria-hidden="true" />

        <div className={cx('grid content-center justify-items-center gap-3 px-3 py-4 text-center sm:border-l', divider)}>
          <Scale className={cx('h-5 w-5', themeClasses.accentText)} strokeWidth={2} aria-hidden="true" />
          <span className={cx('text-sm font-black', themeClasses.titleText)}>Tính tần suất</span>
          <MathText className={cx('text-xl font-semibold', themeClasses.titleText)} formula="f(A)=\frac{m}{n}" />
          <MathText className={cx('text-sm font-semibold', themeClasses.mutedText)} formula="=\frac{4}{10}" />
        </div>
      </div>
    </section>
  );
}

function HistogramVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const counts = [10, 20, 30, 22, 12, 6];
  const categories = [
    { label: 'Nhóm A', height: 55 },
    { label: 'Nhóm B', height: 100 },
    { label: 'Nhóm C', height: 70 },
    { label: 'Nhóm D', height: 40 },
  ];
  const axis = themeClasses.isLight ? 'border-[#205089]/28' : 'border-[#A8D4FF]/24';
  const divider = themeClasses.isLight ? 'divide-[#205089]/12' : 'divide-[#A8D4FF]/14';
  const bar = themeClasses.isLight ? 'border-white/72 bg-[#517FCB]' : 'border-[#172232]/80 bg-[#8CB9E8]';

  const panels = [
    {
      title: 'Tần số',
      english: 'Frequency',
      formula: 'm=0,1,2,\\ldots',
      topLabel: '30+',
      description: 'Không bị chặn tại 1',
      heights: counts.map((count) => (count / 30) * 100),
    },
    {
      title: 'Tần suất tương đối',
      english: 'Relative frequency',
      formula: '0\\leq\\frac{m}{n}\\leq 1',
      topLabel: '1',
      description: 'Giới hạn trên bằng 1',
      heights: counts,
    },
  ];

  return (
    <section
      aria-label="So sánh histogram tần số, histogram tần suất tương đối và bar plot cho các nhóm phân loại rời rạc"
      className={cx('rounded-xl px-3 py-4 sm:px-5', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}
    >
      <div className={cx('grid gap-6 sm:grid-cols-2 sm:gap-0 sm:divide-x', divider)}>
        {panels.map((panel) => (
          <article key={panel.title} className="grid gap-4 sm:px-5 sm:first:pl-0 sm:last:pr-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className={cx('text-base font-black leading-6', themeClasses.titleText)}>{panel.title}</h3>
                <span className={cx('text-xs font-semibold leading-5', themeClasses.mutedText)}>{panel.english}</span>
              </div>
              <MathText
                className={cx(
                  'rounded-lg px-2.5 py-1.5 text-sm font-semibold',
                  themeClasses.isLight ? 'bg-[#EAF1F7] text-[#205089]' : 'bg-[#A8D4FF]/9 text-[#D7EAFE]',
                )}
                formula={panel.formula}
              />
            </div>

            <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-2">
              <div className={cx('relative text-xs font-bold', themeClasses.mutedText)}>
                <span className="absolute right-0 top-0">{panel.topLabel}</span>
                <span className="absolute bottom-0 right-0">0</span>
              </div>
              <div>
                <div className={cx('flex h-40 items-end border-b-2 border-l-2 px-2 pt-3', axis)} aria-hidden="true">
                  {panel.heights.map((height, index) => (
                    <span
                      key={`${panel.title}-${index}`}
                      className={cx('min-w-0 flex-1 border-x', bar)}
                      style={{ height: `${height}%`, opacity: 0.62 + index * 0.055 }}
                    />
                  ))}
                </div>
                <div className={cx('mt-2 text-center text-xs font-bold', themeClasses.mutedText)}>Khoảng giá trị liên tục</div>
              </div>
            </div>

            <p className={cx(
              'text-center text-sm font-black',
              panel.title === 'Tần số'
                ? themeClasses.isLight ? 'text-[#80591E]' : 'text-[#E4B875]'
                : themeClasses.isLight ? 'text-[#2F6840]' : 'text-[#9DDBAF]',
            )}>
              {panel.description}
            </p>
          </article>
        ))}
      </div>

      <article className={cx('mt-6 grid gap-4 border-t pt-5', themeClasses.isLight ? 'border-[#205089]/12' : 'border-[#A8D4FF]/14')}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className={cx('text-base font-black leading-6', themeClasses.titleText)}>Bar plot</h3>
            <span className={cx('text-xs font-semibold leading-5', themeClasses.mutedText)}>Nhóm phân loại rời rạc</span>
          </div>
          <span className={cx(
            'rounded-lg px-2.5 py-1.5 text-sm font-black',
            themeClasses.isLight ? 'bg-[#E4F0E7] text-[#2F6840]' : 'bg-[#315E43] text-[#F2F6FA]',
          )}>
            Các cột tách rời nhau
          </span>
        </div>

        <div className="mx-auto grid w-full max-w-2xl grid-cols-[2.25rem_minmax(0,1fr)] gap-2">
          <div className={cx('relative text-xs font-bold', themeClasses.mutedText)}>
            <span className="absolute right-0 top-0">40</span>
            <span className="absolute bottom-6 right-0">0</span>
          </div>
          <div>
            <div className={cx('grid h-40 grid-cols-4 items-end gap-5 border-b-2 border-l-2 px-4 pt-3 sm:gap-8 sm:px-8', axis)} aria-hidden="true">
              {categories.map((category, index) => (
                <span
                  key={category.label}
                  className={cx(
                    'w-full rounded-t-md',
                    themeClasses.isLight ? 'bg-[#78A98A]' : 'bg-[#78C990]',
                  )}
                  style={{ height: `${category.height}%`, opacity: 0.68 + index * 0.07 }}
                />
              ))}
            </div>
            <div className="grid grid-cols-4 gap-5 px-4 pt-2 sm:gap-8 sm:px-8">
              {categories.map((category) => (
                <span key={category.label} className={cx('text-center text-xs font-bold', themeClasses.mutedText)}>
                  {category.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </section>
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

function IndependenceVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const node = cx(
    'grid h-16 w-16 shrink-0 place-items-center rounded-full border-2',
    themeClasses.isLight ? 'bg-white' : 'bg-[#172232]',
  );
  const nodeA = themeClasses.isLight ? 'border-[#7FA9E5] text-[#205089]' : 'border-[#8CB9E8] text-[#D7EAFE]';
  const nodeB = themeClasses.isLight ? 'border-[#78A98A] text-[#2F6840]' : 'border-[#9DDBAF] text-[#C5EBD0]';
  return (
    <section aria-label="So sánh biến cố độc lập và biến cố phụ thuộc" className="grid gap-3 sm:grid-cols-2">
      <article className={cx('grid content-start justify-items-center gap-4 rounded-xl px-4 py-5', themeClasses.isLight ? 'bg-[#F5F8FB]' : 'bg-[#121A24]/42')}>
        <div className="grid justify-items-center gap-1.5 text-center">
          <h3 className={cx('text-base font-black', themeClasses.titleText)}>Độc lập</h3>
          <MathText className={cx('text-xl font-semibold', themeClasses.titleText)} formula="P(B\mid A)=P(B)" />
        </div>
        <div className="flex w-full items-center justify-center gap-8 py-2 sm:gap-10">
          <div className={cx(node, nodeA)}>
            <MathText className="text-xl font-semibold" formula="A" />
          </div>
          <span className={cx('w-10 border-t-2 border-dashed', themeClasses.isLight ? 'border-[#9AAFC2]' : 'border-[#667C91]')} aria-hidden="true" />
          <div className={cx(node, nodeB)}>
            <MathText className="text-xl font-semibold" formula="B" />
          </div>
        </div>
        <p className={cx('text-center text-sm font-semibold leading-6', themeClasses.bodyText)}>
          Biết <MathText formula="A" /> xảy ra không làm đổi xác suất của <MathText formula="B" />.
        </p>
      </article>

      <article className={cx('grid content-start justify-items-center gap-4 rounded-xl px-4 py-5', themeClasses.isLight ? 'bg-[#F5F8FB]' : 'bg-[#121A24]/42')}>
        <div className="grid justify-items-center gap-1.5 text-center">
          <h3 className={cx('text-base font-black', themeClasses.titleText)}>Phụ thuộc</h3>
          <MathText className={cx('text-xl font-semibold', themeClasses.titleText)} formula="P(B\mid A)\ne P(B)" />
        </div>
        <div className="flex w-full items-center justify-center gap-3 py-2">
          <div className={cx(node, nodeA)}>
            <MathText className="text-xl font-semibold" formula="A" />
          </div>
          <div className={cx('relative h-0.5 w-16', themeClasses.isLight ? 'bg-[#B77A2D]' : 'bg-[#E4B875]')}>
            <ArrowRight className={cx('absolute right-0 top-1/2 h-5 w-5 -translate-y-1/2 translate-x-1/2', themeClasses.isLight ? 'text-[#B77A2D]' : 'text-[#E4B875]')} strokeWidth={2.2} aria-hidden="true" />
          </div>
          <div className={cx(node, nodeB)}>
            <MathText className="text-xl font-semibold" formula="B" />
          </div>
        </div>
        <p className={cx('text-center text-sm font-semibold leading-6', themeClasses.bodyText)}>
          Biết <MathText formula="A" /> xảy ra làm đổi xác suất của <MathText formula="B" />.
        </p>
      </article>
    </section>
  );
}

function ExhaustiveEventsVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const partitions = [
    {
      formula: 'A_1',
      light: 'bg-[#DDEBFB] text-[#205089]',
      dark: 'bg-[#31557A] text-[#F2F6FA]',
    },
    {
      formula: 'A_2',
      light: 'bg-[#DDEFE3] text-[#2F6840]',
      dark: 'bg-[#315E43] text-[#F2F6FA]',
    },
    {
      formula: 'A_3',
      light: 'bg-[#F7E8CC] text-[#80591E]',
      dark: 'bg-[#6A522D] text-[#FFF7E8]',
    },
  ];

  return (
    <section
      aria-label="Không gian mẫu Omega được chia kín thành ba biến cố không chồng lấn A một, A hai và A ba"
      className={cx(
        'rounded-xl px-3 py-4 sm:px-5 sm:py-5',
        themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]',
      )}
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-2 flex items-center justify-between gap-4">
          <span className={cx('text-sm font-bold', themeClasses.mutedText)}>Không gian mẫu</span>
          <MathText className={cx('text-lg font-semibold', themeClasses.titleText)} formula="\Omega" />
        </div>
        <div
          className={cx(
            'grid min-h-40 grid-cols-[1fr_1.15fr_.85fr] overflow-hidden rounded-lg border-2',
            themeClasses.isLight ? 'border-[#205089]/35' : 'border-[#A8D4FF]/34',
          )}
        >
          {partitions.map((partition, index) => (
            <div
              key={partition.formula}
              className={cx(
                'grid place-items-center',
                index > 0 && (themeClasses.isLight ? 'border-l-2 border-[#205089]/35' : 'border-l-2 border-[#A8D4FF]/34'),
                themeClasses.isLight ? partition.light : partition.dark,
              )}
            >
              <MathText className="text-xl font-bold sm:text-2xl" formula={partition.formula} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExhaustiveSurveyVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const levels = [
    {
      label: 'Rất hài lòng',
      light: 'bg-[#CDE9D5] text-[#245735]',
      dark: 'bg-[#315E43] text-[#F2F6FA]',
    },
    {
      label: 'Hài lòng',
      light: 'bg-[#DDEFE3] text-[#2F6840]',
      dark: 'bg-[#3E654B] text-[#F2F6FA]',
    },
    {
      label: 'Bình thường',
      light: 'bg-[#E9EEF3] text-[#334E68]',
      dark: 'bg-[#3E4B59] text-[#F2F6FA]',
    },
    {
      label: 'Không hài lòng',
      light: 'bg-[#F7E8CC] text-[#80591E]',
      dark: 'bg-[#6A522D] text-[#FFF7E8]',
    },
    {
      label: 'Rất không hài lòng',
      light: 'bg-[#F5DADC] text-[#87383F]',
      dark: 'bg-[#704047] text-[#FFF2F3]',
    },
  ];

  return (
    <section
      aria-label="Năm mức độ hài lòng tạo thành một thang khảo sát đầy đủ"
      className={cx('rounded-xl px-3 py-4 sm:px-5', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}
    >
      <ol
        className={cx(
          'grid overflow-hidden rounded-lg border sm:grid-cols-5',
          themeClasses.isLight ? 'border-[#205089]/20' : 'border-[#A8D4FF]/22',
        )}
      >
        {levels.map((level, index) => (
          <li
            key={level.label}
            className={cx(
              'flex min-h-16 items-center gap-3 border-t px-3 py-3 first:border-t-0 sm:min-h-28 sm:flex-col sm:justify-center sm:border-l sm:border-t-0 sm:px-2 sm:text-center sm:first:border-l-0',
              themeClasses.isLight ? `${level.light} border-[#205089]/16` : `${level.dark} border-[#A8D4FF]/18`,
            )}
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/72 text-xs font-black text-[#172A43]">
              {index + 1}
            </span>
            <span className="text-sm font-bold leading-5">{level.label}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ExhaustiveRaffleVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const prizes = [
    { label: 'Phần thưởng A', color: themeClasses.isLight ? '#DDEBFB' : '#31557A', ink: themeClasses.isLight ? '#205089' : '#F2F6FA' },
    { label: 'Phần thưởng B', color: themeClasses.isLight ? '#DDEFE3' : '#315E43', ink: themeClasses.isLight ? '#2F6840' : '#F2F6FA' },
    { label: 'Phần thưởng C', color: themeClasses.isLight ? '#F7E8CC' : '#6A522D', ink: themeClasses.isLight ? '#80591E' : '#FFF7E8' },
    { label: 'Phần thưởng D', color: themeClasses.isLight ? '#F5DADC' : '#704047', ink: themeClasses.isLight ? '#87383F' : '#FFF2F3' },
  ];
  const divider = themeClasses.isLight ? '#FFFFFF' : '#121A24';

  return (
    <section
      aria-label="Bốn phần thưởng tạo thành toàn bộ kết quả của một lần bốc thăm"
      className={cx('rounded-xl px-3 py-4 sm:px-5', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}
    >
      <div className="mx-auto grid max-w-xl items-center gap-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-7">
        <svg viewBox="0 0 160 160" role="img" aria-label="Vòng bốc thăm được chia thành bốn phần thưởng A, B, C và D" className="mx-auto h-40 w-40">
          <path d="M80 80V15A65 65 0 0 1 145 80Z" fill={prizes[0].color} stroke={divider} strokeWidth="3" />
          <path d="M80 80H145A65 65 0 0 1 80 145Z" fill={prizes[1].color} stroke={divider} strokeWidth="3" />
          <path d="M80 80V145A65 65 0 0 1 15 80Z" fill={prizes[2].color} stroke={divider} strokeWidth="3" />
          <path d="M80 80H15A65 65 0 0 1 80 15Z" fill={prizes[3].color} stroke={divider} strokeWidth="3" />
          <circle cx="80" cy="80" r="18" fill={themeClasses.isLight ? '#FFFFFF' : '#172232'} stroke={divider} strokeWidth="2" />
          <text x="80" y="84" fill={themeClasses.isLight ? '#172A43' : '#F2F6FA'} fontSize="10" fontWeight="800" textAnchor="middle">Bốc thăm</text>
          <text x="108" y="53" fill={prizes[0].ink} fontSize="16" fontWeight="900" textAnchor="middle">A</text>
          <text x="108" y="113" fill={prizes[1].ink} fontSize="16" fontWeight="900" textAnchor="middle">B</text>
          <text x="51" y="113" fill={prizes[2].ink} fontSize="16" fontWeight="900" textAnchor="middle">C</text>
          <text x="51" y="53" fill={prizes[3].ink} fontSize="16" fontWeight="900" textAnchor="middle">D</text>
        </svg>
        <ol className="grid grid-cols-2 gap-x-4 gap-y-3">
          {prizes.map((prize, index) => (
            <li key={prize.label} className={cx('flex items-center gap-2 text-sm font-bold leading-5', themeClasses.bodyText)}>
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: prize.color }} aria-hidden="true" />
              <span>{index + 1}. {prize.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function EquiprobableVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const outcomes = ['1', '2', '3', '4', '5', '6'];
  const axis = themeClasses.isLight ? 'border-[#205089]/30' : 'border-[#A8D4FF]/28';
  const guide = themeClasses.isLight ? 'border-[#39724A]/55' : 'border-[#9DDBAF]/55';
  const bar = themeClasses.isLight ? 'bg-[#7FA9E5] text-[#173F6C]' : 'bg-[#547FAE] text-white';

  return (
    <section
      aria-label="Biểu đồ xác suất của sáu mặt xúc xắc có sáu cột bằng nhau tại một phần sáu"
      className={cx('rounded-xl px-3 py-4 sm:px-5 sm:py-5', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}
    >
      <div className="mx-auto max-w-2xl">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
          <div className={cx('flex items-center pb-7 text-sm font-semibold', themeClasses.titleText)}>
            <MathText formula="P(A_i)" />
          </div>
          <div>
            <div className={cx('relative h-44 border-b-2 border-l-2', axis)}>
              <div className={cx('absolute inset-x-0 top-5 border-t-2 border-dashed', guide)}>
                <MathText
                  className={cx(
                    'absolute right-0 top-0 -translate-y-full rounded-t-md px-2 py-1 text-sm font-semibold',
                    themeClasses.isLight ? 'bg-[#E4F0E7] text-[#2F6840]' : 'bg-[#315E43] text-[#F2F6FA]',
                  )}
                  formula="\frac{1}{6}"
                />
              </div>
              <div className="absolute inset-x-3 bottom-0 top-5 grid grid-cols-6 items-end gap-2 sm:gap-4">
                {outcomes.map((outcome) => (
                  <div key={outcome} className={cx('grid h-full min-w-0 place-items-center rounded-t-md', bar)}>
                    <MathText className="text-base font-black sm:text-lg" formula={outcome} />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-6 gap-2 px-3 pt-2 sm:gap-4">
              {outcomes.map((outcome) => (
                <MathText
                  key={outcome}
                  className={cx('min-w-0 text-center text-xs font-semibold sm:text-sm', themeClasses.mutedText)}
                  formula={`A_${outcome}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <MathText className={cx('max-w-full overflow-x-auto text-lg font-semibold', themeClasses.titleText)} formula="P(A_1)=P(A_2)=\cdots=P(A_6)=\frac{1}{6}" />
        </div>
      </div>
    </section>
  );
}

function PriorPosteriorVisual() {
  return (
    <figure className="grid w-full justify-items-center">
      <img
        src={priorPosteriorProbabilityIllustration}
        alt="Quy trình từ xác suất tiên nghiệm P(Pass), qua quan sát dữ liệu X, đến xác suất hậu nghiệm P(Pass | X)"
        loading="lazy"
        className="h-auto max-h-[36rem] w-full rounded-xl object-contain"
      />
    </figure>
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
      label: 'Sunny',
      light: 'bg-[#FFF3C4]',
      dark: 'bg-[#F2C66D]/14',
      intersectionLight: 'bg-[#F2C66D] text-[#49340A]',
      intersectionDark: 'bg-[#F2C66D]/55 text-[#FFF7DE]',
    },
    {
      event: 'A_2',
      Icon: Cloud,
      label: 'Overcast',
      light: 'bg-[#EAF1F7]',
      dark: 'bg-[#A8D4FF]/9',
      intersectionLight: 'bg-[#9FC0DD] text-[#173750]',
      intersectionDark: 'bg-[#8CB9E8]/45 text-[#EAF5FF]',
    },
    {
      event: 'A_3',
      Icon: CloudRain,
      label: 'Rain',
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
  const comparisons = [
    { relation: '>', result: 'Posterior tăng', mark: '↑' },
    { relation: '=', result: 'Không đổi', mark: '→' },
    { relation: '<', result: 'Posterior giảm', mark: '↓' },
  ];
  return (
    <section aria-label="Likelihood tương đối quyết định posterior tăng hay giảm" className={cx('py-4', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}>
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-xl">
          <div className="flex h-24">
            <div className={cx('grid w-2/3 place-items-center text-center', themeClasses.isLight ? 'bg-[#82BD94] text-[#143A20]' : 'bg-[#78C990]/42 text-[#ECFFF1]')}>
              <div><strong className="text-xl">2</strong><span className="block text-xs font-bold">Học và đậu</span></div>
            </div>
            <div className={cx('grid w-1/3 place-items-center text-center', themeClasses.isLight ? 'bg-[#E7C38B] text-[#53350B]' : 'bg-[#F2C66D]/30 text-[#FFF7DE]')}>
              <div><strong className="text-xl">1</strong><span className="block text-xs font-bold">Học và rớt</span></div>
            </div>
          </div>
          <div className={cx('grid place-items-center py-2 text-sm font-black', themeClasses.isLight ? 'bg-[#F5F8FB]' : 'bg-[#A8D4FF]/5', themeClasses.titleText)}>
            Nhóm đã học <MathText className="ml-1" formula="A" />
          </div>
        </div>
        <MathText className={cx('mt-4 block text-center text-lg font-semibold', themeClasses.titleText)} formula="P(B\mid A)=\frac{2}{2+1}=\frac23" />
        <div className={cx('mt-5 divide-y', themeClasses.isLight ? 'divide-[#205089]/10' : 'divide-[#A8D4FF]/12')}>
          {comparisons.map(({ relation, result, mark }) => (
            <div key={relation} className="grid grid-cols-[minmax(0,1fr)_2rem_minmax(0,0.8fr)] items-center gap-2 py-3">
              <MathText className={cx('text-sm font-semibold', themeClasses.titleText)} formula={`P(A\\mid B)${relation}P(A\\mid\\neg B)`} />
              <span className={cx('text-center text-lg font-black', themeClasses.accentText)}>{mark}</span>
              <span className={cx('text-sm font-black', themeClasses.bodyText)}>{result}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NaiveBayesEvidenceVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const rows = [
    { label: 'Tiên nghiệm', pass: 'P(C_{Pass})', fail: 'P(C_{Fail})' },
    { label: 'Có học', pass: 'P(X_1\\mid C_{Pass})', fail: 'P(X_1\\mid C_{Fail})' },
    { label: 'Nộp bài', pass: 'P(X_2\\mid C_{Pass})', fail: 'P(X_2\\mid C_{Fail})' },
    { label: 'Đi học đều', pass: 'P(X_3\\mid C_{Pass})', fail: 'P(X_3\\mid C_{Fail})' },
  ];
  return (
    <section aria-label="Naive Bayes cộng dồn bằng chứng cho hai class" className={cx('py-4', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}>
      <div className="overflow-x-auto">
        <div className="min-w-[35rem]">
          <div className={cx('grid grid-cols-[9rem_1fr_1fr] gap-px text-center text-sm', themeClasses.isLight ? 'bg-[#D7E1EA]' : 'bg-[#344454]')}>
            <div className={cx('px-3 py-3 font-black text-left', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}>Bằng chứng</div>
            <div className={cx('px-3 py-3 font-black', themeClasses.isLight ? 'bg-[#E4F0E7]' : 'bg-[#78C990]/12')}>Class Pass</div>
            <div className={cx('px-3 py-3 font-black', themeClasses.isLight ? 'bg-[#F8EBD6]' : 'bg-[#F2C66D]/10')}>Class Fail</div>
            {rows.map((row) => (
              <div key={row.label} className="contents">
                <div className={cx('px-3 py-3 text-left font-bold', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]')}>{row.label}</div>
                <div className={cx('px-3 py-3', themeClasses.isLight ? 'bg-[#F4F9F5]' : 'bg-[#78C990]/5')}>
                  <MathText formula={row.pass} />
                </div>
                <div className={cx('px-3 py-3', themeClasses.isLight ? 'bg-[#FCF7EF]' : 'bg-[#F2C66D]/5')}>
                  <MathText formula={row.fail} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <MathText className={cx('text-sm font-semibold', themeClasses.titleText)} formula="P(C_{Pass})\prod_k P(X_k\mid C_{Pass})" />
            <MathText className={cx('text-sm font-semibold', themeClasses.titleText)} formula="P(C_{Fail})\prod_k P(X_k\mid C_{Fail})" />
          </div>
        </div>
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

function ExercisesVisual({ themeClasses }: { themeClasses: LearningThemeClasses }) {
  const steps: Array<{ icon: LucideIcon; label: string }> = [
    { icon: BookOpenCheck, label: 'Đọc đề' },
    { icon: Target, label: 'Đặt biến cố' },
    { icon: Sigma, label: 'Chọn công thức' },
    { icon: ListChecks, label: 'Kết luận' },
  ];
  return (
    <VisualSurface label="Quy trình giải một bài tập xác suất" themeClasses={themeClasses}>
      <ol className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {steps.map(({ icon: Icon, label }, index) => (
          <li key={label} className="contents">
            <div className="flex min-w-0 flex-1 items-center gap-3 py-2">
              <span className={cx('grid h-9 w-9 shrink-0 place-items-center rounded-full', themeClasses.isLight ? 'bg-white text-[#205089]' : 'bg-[#A8D4FF]/12 text-[#A8D4FF]')}>
                <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </span>
              <span className={cx('text-sm font-black', themeClasses.titleText)}>{label}</span>
            </div>
            {index < steps.length - 1 ? <ArrowRight className={cx('hidden h-4 w-4 shrink-0 sm:block', themeClasses.mutedText)} aria-hidden="true" /> : null}
          </li>
        ))}
      </ol>
    </VisualSurface>
  );
}

function ProbabilityChapterVisual({ kind }: {
  kind: ProbabilityChapterVisualKind;
}) {
  const themeClasses = useLearningMdxTheme();
  if (kind === 'foundations') return <FoundationsVisual themeClasses={themeClasses} />;
  if (kind === 'experiment-outcomes') return <ExperimentOutcomesVisual themeClasses={themeClasses} />;
  if (kind === 'elementary') return <ElementaryEventVisual themeClasses={themeClasses} />;
  if (kind === 'certainty') return <CertaintyVisual themeClasses={themeClasses} />;
  if (kind === 'sample-space') return <SampleSpaceVisual themeClasses={themeClasses} />;
  if (kind === 'random-variable') return <RandomVariableVisual themeClasses={themeClasses} />;
  if (kind === 'relations') return <RelationsVisual themeClasses={themeClasses} />;
  if (kind === 'intersection-cases') return <IntersectionCasesVisual themeClasses={themeClasses} />;
  if (kind === 'exclusive') return <ExclusiveEventsVisual themeClasses={themeClasses} />;
  if (kind === 'pairwise-exclusive') return <PairwiseExclusiveVisual themeClasses={themeClasses} />;
  if (kind === 'complement') return <ComplementEventVisual themeClasses={themeClasses} />;
  if (kind === 'exclusive-not-complement') return <ExclusiveNotComplementVisual themeClasses={themeClasses} />;
  if (kind === 'axioms') return <AxiomsVisual themeClasses={themeClasses} />;
  if (kind === 'probability-definitions') return <ProbabilityDefinitionsVisual themeClasses={themeClasses} />;
  if (kind === 'statistical-modelling-schools') return <StatisticalModellingSchoolsVisual themeClasses={themeClasses} />;
  if (kind === 'empirical') return <EmpiricalVisual themeClasses={themeClasses} />;
  if (kind === 'histogram') return <HistogramVisual themeClasses={themeClasses} />;
  if (kind === 'frequency-stability') return <FrequencyStabilityVisual themeClasses={themeClasses} />;
  if (kind === 'frequency-simulation') return <FrequencySimulationVisual themeClasses={themeClasses} />;
  if (kind === 'independence') return <IndependenceVisual themeClasses={themeClasses} />;
  if (kind === 'exhaustive') return <ExhaustiveEventsVisual themeClasses={themeClasses} />;
  if (kind === 'exhaustive-survey') return <ExhaustiveSurveyVisual themeClasses={themeClasses} />;
  if (kind === 'exhaustive-raffle') return <ExhaustiveRaffleVisual themeClasses={themeClasses} />;
  if (kind === 'equiprobable') return <EquiprobableVisual themeClasses={themeClasses} />;
  if (kind === 'prior-posterior') return <PriorPosteriorVisual />;
  if (kind === 'conditional') return <ConditionalVisual themeClasses={themeClasses} />;
  if (kind === 'total') return <TotalVisual themeClasses={themeClasses} />;
  if (kind === 'total-sum') return <TotalSumVisual themeClasses={themeClasses} />;
  if (kind === 'bayes') return <BayesVisual themeClasses={themeClasses} />;
  if (kind === 'bayes-prior-posterior') return <BayesVisual focus="prior-posterior" themeClasses={themeClasses} />;
  if (kind === 'bayes-normalization') return <BayesNormalizationVisual themeClasses={themeClasses} />;
  if (kind === 'naive-bayes-evidence') return <NaiveBayesEvidenceVisual themeClasses={themeClasses} />;
  if (kind === 'naive-bayes-practical') return <NaiveBayesPracticalVisual themeClasses={themeClasses} />;
  return <ExercisesVisual themeClasses={themeClasses} />;
}

export const statisticsMdxComponents = {
  ProbabilityChapterVisual,
  ProbabilitySourceImage,
} satisfies Record<typeof STATISTICS_MDX_COMPONENT_NAMES[number], LearningMdxComponent>;

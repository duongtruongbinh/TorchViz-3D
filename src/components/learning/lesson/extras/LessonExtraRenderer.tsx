import type { LearningDomainId, LearningLessonExtra } from '../../../../core/learning/types';
import type { Language } from '../../../../lib/localization';
import { isLlmAiEngineeringCustomConceptPanel, renderLlmAiEngineeringExtra } from '../../domains/llm-ai-engineering/renderers';
import { getLearningLabTheme } from '../../theme';
import ConceptPanelBlock from './ConceptPanelBlock';
import QuizBlock, { type QuizQuestionState } from './QuizBlock';

export type { QuizQuestionState } from './QuizBlock';

type LessonExtraRendererProps = {
  domainId: LearningDomainId;
  extra: LearningLessonExtra;
  language: Language;
  quizQuestionStates?: Record<string, QuizQuestionState>;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
  onQuizQuestionStateChange?: (questionId: string, state: QuizQuestionState) => void;
};

export default function LessonExtraRenderer({
  domainId,
  extra,
  language,
  quizQuestionStates,
  themeClasses,
  onQuizQuestionStateChange,
}: LessonExtraRendererProps) {
  if (domainId === 'llm-ai-engineering' && shouldUseLlmRenderer(extra)) {
    const renderedExtra = renderLlmAiEngineeringExtra({ extra, language, themeClasses });
    if (!renderedExtra) {
      throw new Error(`Missing LLM Learning Lab renderer for extra "${extra.id}".`);
    }
    return renderedExtra;
  }

  if (extra.kind === 'conceptPanel') {
    return <ConceptPanelBlock extra={extra} language={language} themeClasses={themeClasses} />;
  }

  if (extra.kind === 'quiz') {
    return (
      <QuizBlock
        extra={extra}
        language={language}
        quizQuestionStates={quizQuestionStates}
        themeClasses={themeClasses}
        onQuizQuestionStateChange={onQuizQuestionStateChange}
      />
    );
  }

  return null;
}

function shouldUseLlmRenderer(extra: LearningLessonExtra): boolean {
  return extra.kind === 'motivation'
    || extra.kind === 'conceptInteraction'
    || isLlmAiEngineeringCustomConceptPanel(extra);
}

function ConceptHighlightLinks({
  links,
  className,
  themeClasses,
}: {
  links?: Array<{ label: string; href: string }>;
  className?: string;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  if (!links?.length) return null;

  return (
    <ul className={cx(className, 'grid gap-1.5 text-xs leading-5', themeClasses.bodyText)}>
      {links.map((link) => (
        <li key={link.href} className="flex min-w-0 gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-55" aria-hidden="true" />
          <span className="min-w-0">
            <span className={cx('font-black', themeClasses.titleText)}>{link.label}: </span>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={cx('break-all font-semibold underline decoration-dotted underline-offset-4', themeClasses.accentText)}
            >
              {link.href}
            </a>
          </span>
        </li>
      ))}
    </ul>
  );
}

function LlmPipelineArchitecture({
  items,
  themeClasses,
}: {
  items: Array<{ shortName: string; fullName: string; description: string }>;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const tokenColors = [
    'border-[#62B8EE]/60 bg-[#E7F6FF] text-[#0B4F7D]',
    'border-[#85D96F]/60 bg-[#F0FBEA] text-[#22670F]',
    'border-[#F4B84A]/62 bg-[#FFF5DF] text-[#835300]',
    'border-[#C997F4]/62 bg-[#F7EEFF] text-[#5B1AA0]',
    'border-[#F08A9D]/62 bg-[#FFF0F3] text-[#8A2438]',
  ];
  const tokenDarkColors = [
    'border-[#62B8EE]/45 bg-[#12344A] text-[#D8F0FF]',
    'border-[#85D96F]/45 bg-[#183A22] text-[#DCF9D4]',
    'border-[#F4B84A]/48 bg-[#3B2B10] text-[#FFE8B3]',
    'border-[#C997F4]/45 bg-[#2D1D43] text-[#F0DEFF]',
    'border-[#F08A9D]/45 bg-[#45202A] text-[#FFE0E6]',
  ];
  const tokens = [
    { label: '"Tôi"', id: '1284', vector: '[0.20, -0.10, 0.70]', position: '[0.01, 0.00, -0.02]', input: '[0.21, -0.10, 0.68]' },
    { label: '" thích"', id: '920', vector: '[0.05, 0.40, -0.30]', position: '[0.02, -0.01, 0.00]', input: '[0.07, 0.39, -0.30]' },
    { label: '" học"', id: '371', vector: '[0.60, 0.10, 0.20]', position: '[0.03, 0.01, -0.01]', input: '[0.63, 0.11, 0.19]' },
    { label: '" LLM"', id: '44591', vector: '[-0.20, 0.80, 0.10]', position: '[0.04, -0.02, 0.02]', input: '[-0.16, 0.78, 0.12]' },
    { label: '"."', id: '13', vector: '[0.00, -0.30, 0.50]', position: '[0.05, 0.02, -0.03]', input: '[0.05, -0.28, 0.47]' },
  ];
  const promptTokens = tokens.slice(0, 2);
  const pipelineExamples: PipelineExample[] = [
    {
      parts: ['"Tôi thích"'],
      note: 'Một prompt/raw text được đưa vào. Trong dataset training, đây là một đoạn text có token kế tiếp đã biết; khi generation, đây là prefix để model sinh tiếp.',
    },
    {
      shape: 'T = 2 token',
      tokens: promptTokens.map((token) => token.label),
      note: 'Tokenizer cắt câu thành các token theo vocabulary của model.',
    },
    {
      shape: 'ids shape: [T]',
      tokens: promptTokens.map((token) => token.id),
      note: 'Mỗi token được đổi thành một integer cố định. Các id trong hình là minh họa; tokenizer thật có thể cắt tiếng Việt khác đi.',
    },
    {
      shape: '[T, d_model]',
      rows: promptTokens.map((token) => `${token.id} -> ${token.vector}`),
      note: 'Mỗi token id được tra thành một vector số cơ bản. Vector vẫn chưa có ngữ cảnh, chỉ là vector đại diện cho token đó.',
    },
    {
      shape: '[T, d_model]',
      rows: promptTokens.map((token) => `${token.vector} + ${token.position} = ${token.input}`),
      note: 'Cộng thêm positional embedding cùng chiều để model biết token đang ở vị trí nào trong context window.',
    },
    {
      shape: 'logits shape: [T, vocab_size]',
      flow: [
        {
          title: 'Input',
          label: '[T, d_model]',
          lines: promptTokens.map((token) => token.input),
        },
        {
          title: 'GPT blocks',
          label: 'context vectors',
          lines: ['pos 0 -> [0.18, ..., 0.31]', 'pos 1 -> [0.11, ..., 0.74]'],
        },
        {
          title: 'Logits',
          label: 'mỗi vị trí x vocab',
          lines: ['pos 0 -> [...V]', 'pos 1 -> [...V]'],
        },
        {
          title: 'Last logits',
          label: 'dùng khi generate',
          colorByRow: true,
          lines: ['3.2', '0.4', '...', '-1.1'],
        },
        {
          title: 'Vocab candidates',
          colorByRow: true,
          lines: ['" học"', '" ăn"', '...', '" xe"'],
        },
      ],
      note: 'GPT tạo logits trên toàn bộ vocabulary cho từng vị trí. Training có thể dùng mọi vị trí; generation thường lấy hàng logits cuối rồi argmax hoặc sampling.',
    },
    {
      shape: 'training branch',
      flow: [
        {
          title: 'Logits',
          label: '[T, vocab_size]',
          lines: ['pos 0 -> [...V]', 'pos 1 -> [...V]'],
        },
        {
          title: 'Targets',
          label: 'shifted [T]',
          tone: 'selected',
          lines: ['" thích"', '" học"'],
        },
        {
          title: 'Softmax',
          label: 'over vocab',
          lines: ['P(" học") = 0.82'],
        },
        {
          title: 'CE loss',
          lines: ['-log(0.82)'],
        },
      ],
      note: 'Trong training, target là token kế tiếp đã biết trong dataset. Softmax chạy trên toàn bộ vocab; model càng gán xác suất cao cho target thì loss càng thấp.',
    },
    {
      shape: 'generation branch',
      flow: [
        {
          title: 'Last logits',
          label: '[vocab_size]',
          lines: ['3.2', '0.4', '...', '-1.1'],
          colorByRow: true,
        },
        {
          title: 'Choose',
          label: 'argmax/sample',
          tone: 'selected',
          lines: ['id 371'],
        },
        {
          title: 'Token id',
          tone: 'selected',
          lines: ['371'],
        },
        {
          title: 'Decode',
          tone: 'selected',
          lines: ['" học"'],
        },
        {
          title: 'Prompt mới',
          tokens: ['"Tôi"', '" thích"', '" học"'],
          selectedTokenIndexes: [2],
        },
      ],
      note: 'Decode đổi token id đã chọn thành chữ, rồi append vào prompt. Nếu lặp lại GPT -> choose -> decode, câu sẽ dài thêm từng token.',
    },
  ];
  const frameTone = themeClasses.isLight
    ? 'bg-white'
    : 'bg-[#121A24]/42';
  const stepTone = themeClasses.isLight
    ? 'bg-white/60 text-[#062A4A]'
    : 'bg-[#A8B8C8]/6 text-[#E2EAF1]';
  const exampleTone = themeClasses.isLight
    ? 'border-[#205089]/10 bg-white/72 text-[#123B68]'
    : 'border-[#A8B8C8]/14 bg-[#0E1620]/42 text-[#E2EAF1]';
  const arrowTone = themeClasses.isLight ? 'text-[#7A8794]' : 'text-[#A8B8C8]/70';

  return (
    <div className={cx('overflow-hidden rounded-lg p-4 md:p-5', frameTone)}>
      <div className="grid gap-2">
        {items.map((item, itemIndex) => {
          const example = pipelineExamples[itemIndex];
          const nextItem = items[itemIndex + 1];
          const shouldShowStepArrow = Boolean(nextItem && !nextItem.shortName.endsWith('*'));
          return (
            <div key={item.fullName} className="grid gap-2">
              <div className="grid gap-3 lg:grid-cols-[9.5rem_minmax(0,1.2fr)_minmax(0,0.42fr)] lg:items-stretch">
                <div
                  className={cx(
                    'grid content-center rounded-lg px-2.5 py-2',
                    stepTone,
                  )}
                >
                  <div className="text-base font-medium leading-6">
                    {item.shortName}. {item.fullName}
                  </div>
                </div>
                <div className={cx('grid content-center rounded-lg border px-4 py-3 text-center', exampleTone)}>
                  <PipelineExampleView
                    example={example}
                    tokenTones={themeClasses.isLight ? tokenColors : tokenDarkColors}
                    themeClasses={themeClasses}
                  />
                </div>
                <div className={cx('grid content-center rounded-lg border px-4 py-3 text-center', exampleTone)}>
                  <p className={cx('text-center text-sm font-semibold leading-6', themeClasses.bodyText)}>{example?.note}</p>
                </div>
              </div>
              {shouldShowStepArrow ? (
                <div className="grid gap-3 lg:grid-cols-[9.5rem_minmax(0,1.2fr)_minmax(0,0.42fr)]" aria-hidden="true">
                  <div className="hidden lg:block" />
                  <div className={cx('grid h-5 w-full place-items-center text-center text-2xl font-black leading-none', arrowTone)}>
                    ↓
                  </div>
                  <div className="hidden lg:block" />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

type PipelineExample = {
  flow?: Array<{ title: string; label?: string; lines?: string[]; tokens?: string[]; selectedTokenIndexes?: number[]; colorByRow?: boolean; tone?: 'selected' }>;
  parts?: string[];
  rows?: string[];
  shape?: string;
  tokens?: string[];
  note: string;
};

function PipelineExampleView({
  example,
  tokenTones,
  themeClasses,
}: {
  example?: PipelineExample;
  tokenTones: string[];
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  if (!example) return null;

  const flowTitleTone = themeClasses.isLight ? 'text-[#123B68]' : 'text-[#F2F6FA]';
  const flowLabelTone = themeClasses.isLight ? 'text-[#57728D]' : 'text-[#B7C5D2]';
  const flowArrowTone = themeClasses.isLight ? 'text-[#7A8794]' : 'text-[#A8B8C8]/70';
  const rankedTones = themeClasses.isLight
    ? [
        'border-[#64748B] bg-[#64748B] text-white',
        'border-[#94A3B8] bg-[#94A3B8] text-white',
        'border-[#CBD5E1] bg-[#CBD5E1] text-[#243244]',
        'border-[#E2E8F0] bg-[#E2E8F0] text-[#243244]',
      ]
    : [
        'border-[#E2E8F0] bg-[#E2E8F0] text-[#111827]',
        'border-[#CBD5E1] bg-[#CBD5E1] text-[#111827]',
        'border-[#94A3B8] bg-[#94A3B8] text-[#111827]',
        'border-[#64748B] bg-[#64748B] text-white',
      ];
  const outputTokenTones = themeClasses.isLight
    ? [
        'border-[#7DD3FC]/60 bg-[#E0F2FE] text-[#075985]',
        'border-[#C4B5FD]/60 bg-[#EDE9FE] text-[#5B21B6]',
        'border-[#F9A8D4]/60 bg-[#FCE7F3] text-[#9D174D]',
      ]
    : [
        'border-[#7DD3FC]/42 bg-[#123A4A] text-[#E0F2FE]',
        'border-[#C4B5FD]/42 bg-[#2E225C] text-[#EDE9FE]',
        'border-[#F9A8D4]/42 bg-[#4A1D35] text-[#FCE7F3]',
      ];
  const getFlowTone = (
    column: NonNullable<PipelineExample['flow']>[number],
    columnIndex: number,
    lineIndex: number,
  ) => {
    if (column.tone === 'selected') return rankedTones[0];
    if (column.colorByRow) return rankedTones[lineIndex % rankedTones.length];
    return tokenTones[(columnIndex + lineIndex) % tokenTones.length];
  };

  return (
    <div className="grid justify-items-center gap-2">
      {example.shape ? (
        <span className={cx('rounded-full px-2.5 py-1 font-mono text-[0.68rem] font-black leading-4', flowLabelTone)}>
          {example.shape}
        </span>
      ) : null}
      {example.flow ? (
        <div className="flex w-full flex-col items-stretch gap-2 md:flex-row md:justify-center">
          {example.flow.map((column, columnIndex) => (
            <Fragment key={column.title}>
              <div className="grid min-w-0 flex-1 gap-1 px-1 py-1 text-center">
                <div className="grid min-h-9 content-start gap-0.5">
                  <div className={cx('text-[0.68rem] font-black leading-4', flowTitleTone)}>
                    {column.title}
                  </div>
                  {column.label ? (
                    <div className={cx('text-[0.68rem] font-medium leading-4', flowLabelTone)}>
                      {column.label}
                    </div>
                  ) : null}
                </div>
                <div className="grid content-center gap-1.5">
                  {column.lines?.map((line, lineIndex) => (
                    <span
                      key={`${column.title}-${line}`}
                      className={cx(
                        'break-words rounded-md border px-2 py-1 font-mono text-[0.68rem] font-black leading-4 md:text-xs',
                        getFlowTone(column, columnIndex, lineIndex),
                      )}
                    >
                      {line}
                    </span>
                  ))}
                  {column.tokens ? (
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {column.tokens.map((token, tokenIndex) => (
                        <span
                          key={`${column.title}-${token}`}
                          className={cx(
                            'rounded-md border px-2 py-1 font-mono text-[0.68rem] font-black leading-4 md:text-xs',
                            column.selectedTokenIndexes?.includes(tokenIndex)
                              ? rankedTones[0]
                              : outputTokenTones[tokenIndex % outputTokenTones.length],
                          )}
                        >
                          {token}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
              {columnIndex < example.flow!.length - 1 ? (
                <div className={cx('grid grid-rows-[2.25rem_1fr] text-lg font-black leading-none', flowArrowTone)}>
                  <span aria-hidden="true" />
                  <span className="hidden place-items-center md:grid">→</span>
                  <span className="grid place-items-center md:hidden">↓</span>
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>
      ) : null}
      {example.rows ? (
        <div className="grid gap-1.5">
          {example.rows.map((row, rowIndex) => (
            <span
              key={row}
              className={cx(
                'rounded-md border px-2.5 py-1 font-mono text-xs font-black leading-5 md:text-sm',
                tokenTones[rowIndex % tokenTones.length],
              )}
            >
              {row}
            </span>
          ))}
        </div>
      ) : null}
      {example.tokens ? (
        <div className="flex flex-wrap justify-center gap-1.5">
          {example.tokens.map((token, tokenIndex) => (
            <span
              key={`${token}-${tokenIndex}`}
              className={cx(
                'rounded-md border px-2.5 py-1 font-mono text-xs font-black leading-5 md:text-sm',
                tokenTones[tokenIndex % tokenTones.length],
              )}
            >
              {token}
            </span>
          ))}
        </div>
      ) : null}
      {example.parts ? (
        <pre className="whitespace-pre-wrap break-words text-center font-mono text-sm font-black leading-6">
          {example.parts.join('\n')}
        </pre>
      ) : null}
    </div>
  );
}

import { useEffect, useId, useRef, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

if (typeof window !== 'undefined') {
  (window as any).katex = katex;
}

let isMermaidInitialized = false;

async function getMermaidInstance() {
  if (typeof window === 'undefined') return null;
  let mermaidModule: any;
  try {
    // @ts-expect-error
    mermaidModule = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs');
  } catch (err) {
    console.error('Không thể tải Mermaid từ CDN:', err);
    throw new Error('Không thể tải thư viện Mermaid từ CDN');
  }
  const mermaid = mermaidModule?.default ?? mermaidModule;
  if (!isMermaidInitialized && mermaid?.initialize) {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, system-ui, sans-serif',
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
        padding: 24,
        nodeSpacing: 40,
        rankSpacing: 45,
        useMaxWidth: true,
      },
    });
    isMermaidInitialized = true;
  }
  return mermaid;
}

export function MermaidDiagram({ chart, caption }: { chart: string; caption?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const id = useId().replace(/[^a-zA-Z0-9]/g, '_');

  useEffect(() => {
    let isActive = true;

    const renderChart = async () => {
      try {
        const mermaid = await getMermaidInstance();
        const uniqueId = `mermaid_chart_${id}_${Date.now()}`;

        // 1. Chuyển đổi literal \n thành <br/> để Mermaid htmlLabels tự động xuống dòng đẹp
        let sanitizedChart = chart.replace(/\\n/g, '<br/>');

        // 2. Thay thế các công thức $...$ bằng token an toàn để Mermaid không bị lỗi cú pháp ký tự đặc biệt
        const mathTokens = new Map<string, string>();
        let counter = 0;
        sanitizedChart = sanitizedChart.replace(/\$([^$]+)\$/g, (_, math: string) => {
          const token = `KATEXMATH${counter++}END`;
          try {
            const html = katex.renderToString(math.trim(), { throwOnError: false, displayMode: false });
            const wrappedHtml = `<span class="katex-mermaid-wrap" style="display:inline-block;vertical-align:middle;padding:2px 0;line-height:1.3;">${html}</span>`;
            mathTokens.set(token, wrappedHtml);
          } catch {
            mathTokens.set(token, math);
          }
          return `<span style="display:inline-block;padding:4px 0;line-height:1.6;">${token}</span>`;
        });

        // 2. Render biểu đồ SVG với Mermaid
        const { svg } = await mermaid.render(uniqueId, sanitizedChart.trim());

        // 3. Khôi phục lại toàn bộ mã HTML của KaTeX vào SVG và tiêm override style chống clip
        let finalSvg = svg;
        for (const [token, html] of mathTokens.entries()) {
          finalSvg = finalSvg.replaceAll(token, html);
        }

        // Đảm bảo foreignObject và div nhãn bên trong không bị cắt góc và các block được bo góc mềm mại
        const styleOverride = `<style>
          #${uniqueId} foreignObject { overflow: visible !important; }
          #${uniqueId} foreignObject > div { overflow: visible !important; display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; line-height: 1.5 !important; padding: 4px 8px !important; }
          #${uniqueId} .node rect, #${uniqueId} .node polygon { rx: 10px !important; ry: 10px !important; stroke-width: 1.5px !important; stroke: #93C5FD !important; fill: #F0F6FC !important; }
          #${uniqueId} .cluster rect { rx: 12px !important; ry: 12px !important; stroke-width: 1.5px !important; stroke: #CBD5E1 !important; fill: rgba(248, 250, 252, 0.6) !important; }
          #${uniqueId} .node text, #${uniqueId} .node span { overflow: visible !important; font-family: "Be Vietnam Pro", system-ui, sans-serif !important; font-size: 12.5px !important; font-weight: 500 !important; color: #1E293B !important; }
          #${uniqueId} .edgePath path { stroke-width: 1.5px !important; stroke: #64748B !important; }
          #${uniqueId} .edgeLabel { font-family: "Be Vietnam Pro", system-ui, sans-serif !important; font-size: 11px !important; color: #475569 !important; background-color: #FFFFFF !important; padding: 1px 4px !important; border-radius: 4px !important; }
        </style>`;

        if (finalSvg.includes('</svg>')) {
          finalSvg = finalSvg.replace('</svg>', `${styleOverride}</svg>`);
        } else {
          finalSvg += styleOverride;
        }

        if (isActive) {
          setSvgContent(finalSvg);
          setError(null);
        }
      } catch (err: unknown) {
        console.error('Mermaid render error:', err);
        if (isActive) {
          setError(String(err));
        }
      }
    };

    void renderChart();

    return () => {
      isActive = false;
    };
  }, [chart, id]);

  if (error) {
    return (
      <div className="my-4 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-mono text-red-700">
        <p className="font-bold">Lỗi biểu đồ Mermaid:</p>
        <pre className="mt-1 overflow-x-auto whitespace-pre-wrap">{chart}</pre>
      </div>
    );
  }

  return (
    <figure className="my-6 grid justify-items-center gap-2 w-full">
      <div
        ref={containerRef}
        className="w-full overflow-x-auto flex justify-center py-4 px-2 bg-transparent transition-all [&_svg]:max-w-none [&_svg]:h-auto [&_svg]:overflow-visible [&_foreignObject]:overflow-visible [&_.node]:overflow-visible [&_.label]:overflow-visible [&_.label]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      {caption && (
        <figcaption className="text-center text-sm leading-5 text-[#52677F]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export const Mermaid = MermaidDiagram;

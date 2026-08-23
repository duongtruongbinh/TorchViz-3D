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
    // @ts-ignore
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
        padding: 16,
        nodeSpacing: 35,
        rankSpacing: 40,
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

        // 1. Thay thế các công thức $...$ bằng token an toàn để Mermaid không bị lỗi cú pháp ký tự đặc biệt
        const mathTokens = new Map<string, string>();
        let counter = 0;
        const sanitizedChart = chart.replace(/\$([^$]+)\$/g, (_, math: string) => {
          const token = `KATEXMATH${counter++}END`;
          try {
            const html = katex.renderToString(math.trim(), { throwOnError: false, displayMode: false });
            mathTokens.set(token, html);
          } catch {
            mathTokens.set(token, math);
          }
          return token;
        });

        // 2. Render biểu đồ SVG với Mermaid
        const { svg } = await mermaid.render(uniqueId, sanitizedChart.trim());

        // 3. Khôi phục lại toàn bộ mã HTML của KaTeX vào SVG
        let finalSvg = svg;
        for (const [token, html] of mathTokens.entries()) {
          finalSvg = finalSvg.replaceAll(token, html);
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
        className="w-full overflow-x-auto flex justify-center py-6 px-6 rounded-xl border border-[#205089]/14 bg-[#F8FAFC]/75 shadow-sm transition-all [&_svg]:max-w-none [&_svg]:h-auto [&_svg]:overflow-visible"
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

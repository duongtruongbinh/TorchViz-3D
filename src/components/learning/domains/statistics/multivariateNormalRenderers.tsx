import { useId, useState } from 'react';
import { useLearningMdxTheme } from '../../learningMdxComponents';
import { cx } from '../../theme';

type MultivariateNormalConceptKind =
  | '1d-to-2d-bell'
  | 'notation-breakdown'
  | 'density-contour-levels'
  | 'eigenvector-axes'
  | 'gaussian-marginals'
  | 'standard-normal-circle'
  | 'standardization-vs-whitening'
  | 'mahalanobis-vs-euclidean'
  | 'ai-applications';

export function MultivariateNormalConceptVisual({
  ariaLabel,
  caption,
  kind,
}: {
  ariaLabel: string;
  caption: string;
  kind: MultivariateNormalConceptKind;
}) {
  const theme = useLearningMdxTheme();
  const border = theme.isLight ? 'border-slate-200' : 'border-slate-800';
  const cardBg = theme.isLight ? 'bg-white/90' : 'bg-slate-900/90';

  let content: React.ReactNode = null;

  if (kind === '1d-to-2d-bell') {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
        <div className={cx('flex flex-col items-center justify-center p-5 rounded-2xl border text-center shadow-sm', border, cardBg)}>
          <span className="text-2xl font-black text-sky-500 mb-2">1D</span>
          <h4 className="font-bold text-sm mb-1">Normal Distribution 1D</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Bell curve trên trục số 1 chiều: <span className="font-mono font-bold">X ~ N(μ, σ²)</span></p>
        </div>

        <div className={cx('flex flex-col items-center justify-center p-5 rounded-2xl border text-center shadow-sm', border, cardBg)}>
          <span className="text-2xl font-black text-indigo-500 mb-2">2D Points</span>
          <h4 className="font-bold text-sm mb-1">Đám mây điểm 2D</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Mỗi quan sát là một vector 2 đặc trưng: <span className="font-mono font-bold">x_i = [x_i, y_i]</span></p>
        </div>

        <div className={cx('flex flex-col items-center justify-center p-5 rounded-2xl border text-center shadow-sm', border, cardBg)}>
          <span className="text-2xl font-black text-emerald-500 mb-2">2D Hill</span>
          <h4 className="font-bold text-sm mb-1">Bề mặt / Contour mật độ</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Ngọn đồi mật độ 3D hoặc các đường Ellipse đồng mức</p>
        </div>
      </div>
    );
  } else if (kind === 'notation-breakdown') {
    content = (
      <div className="p-6 flex flex-col items-center justify-center gap-6">
        <div className="text-center">
          <div className="inline-block rounded-2xl bg-sky-500/10 border border-sky-500/30 px-6 py-4 text-xl md:text-2xl font-black font-mono text-sky-600 dark:text-sky-400 shadow-md">
            X ~ N(μ, Σ)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <div className={cx('p-5 rounded-2xl border flex flex-col gap-2', border, cardBg)}>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-500" />
              <h4 className="font-bold text-sm">Mean Vector μ (d chiều)</h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Quyết định <strong>tâm của phân phối</strong> trong không gian d chiều. Tương ứng với đỉnh cao nhất của bề mặt mật độ xác suất.
            </p>
          </div>

          <div className={cx('p-5 rounded-2xl border flex flex-col gap-2', border, cardBg)}>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <h4 className="font-bold text-sm">Covariance Matrix Σ (d x d)</h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Quyết định <strong>hình dạng, độ rộng và hướng nghiêng</strong> của đám mây điểm. Đường chéo là phương sai, ngoài đường chéo là covariance.
            </p>
          </div>
        </div>
      </div>
    );
  } else if (kind === 'density-contour-levels') {
    content = (
      <div className="p-6 flex flex-col lg:flex-row items-center justify-center gap-8">
        <div className="relative w-64 h-64 rounded-2xl border border-slate-800 bg-slate-950 p-4 flex items-center justify-center shadow-xl">
          <svg viewBox="0 0 10 10" className="w-full h-full overflow-visible" role="img" aria-label="Ellipse contours">
            <line x1="1" y1="9" x2="9" y2="9" stroke="#475569" strokeWidth="0.08" />
            <line x1="1" y1="1" x2="1" y2="9" stroke="#475569" strokeWidth="0.08" />

            {/* Ellipse 3 sigma */}
            <ellipse cx="5" cy="5" rx="3.6" ry="1.8" fill="none" stroke="#38bdf8" strokeWidth="0.08" strokeDasharray="0.2,0.2" transform="rotate(-30 5 5)" />
            {/* Ellipse 2 sigma */}
            <ellipse cx="5" cy="5" rx="2.4" ry="1.2" fill="none" stroke="#0284c7" strokeWidth="0.1" transform="rotate(-30 5 5)" />
            {/* Ellipse 1 sigma */}
            <ellipse cx="5" cy="5" rx="1.2" ry="0.6" fill="none" stroke="#0369a1" strokeWidth="0.12" transform="rotate(-30 5 5)" />

            {/* Center Mean */}
            <circle cx="5" cy="5" r="0.25" fill="#f43f5e" />
            <text x="5.4" y="4.8" className="text-[0.4px] font-black fill-rose-400 font-mono">μ</text>
          </svg>
        </div>

        <div className="flex flex-col gap-3 max-w-md">
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Đường đồng mức độ mật độ (Density Contours)</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Các điểm nằm trên cùng một đường ellipse có cùng mật độ xác suất f(x) = c.
          </p>
          <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 list-disc list-inside">
            <li><span className="font-semibold text-sky-500">Gần tâm μ:</span> Mật độ xuất hiện cao nhất.</li>
            <li><span className="font-semibold text-sky-500">Rìa Ellipse ngoài:</span> Mật độ xuất hiện càng xa càng hiếm.</li>
            <li><span className="font-semibold text-sky-500">Hình dạng Ellipse:</span> Được xác định bởi dạng toàn phương (x-μ)ᵀ Σ⁻¹ (x-μ) = c.</li>
          </ul>
        </div>
      </div>
    );
  } else if (kind === 'eigenvector-axes') {
    content = (
      <div className="p-6 flex flex-col lg:flex-row items-center justify-center gap-8">
        <div className="relative w-64 h-64 rounded-2xl border border-slate-800 bg-slate-950 p-4 flex items-center justify-center shadow-xl">
          <svg viewBox="0 0 10 10" className="w-full h-full overflow-visible" role="img" aria-label="Eigenvector principal axes">
            <ellipse cx="5" cy="5" rx="3.2" ry="1.6" fill="none" stroke="#38bdf8" strokeWidth="0.1" transform="rotate(-30 5 5)" />

            {/* Principal Axis 1 (Eigenvector 1) */}
            <line x1="5" y1="5" x2="7.77" y2="3.4" stroke="#f43f5e" strokeWidth="0.15" />
            <text x="8" y="3.2" className="text-[0.4px] font-black fill-rose-400 font-mono">v1 (λ1 lớn)</text>

            {/* Principal Axis 2 (Eigenvector 2) */}
            <line x1="5" y1="5" x2="4.2" y2="3.6" stroke="#10b981" strokeWidth="0.15" />
            <text x="3.4" y="3.4" className="text-[0.4px] font-black fill-emerald-400 font-mono">v2 (λ2 nhỏ)</text>

            <circle cx="5" cy="5" r="0.2" fill="#fff" />
          </svg>
        </div>

        <div className="flex flex-col gap-3 max-w-md">
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Trục chính & Phân rã Ma trận Covariance</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Phân rã covariance matrix Σ = Q Λ Qᵀ tiết lộ hình học của phân phối:
          </p>
          <div className="space-y-2 text-xs">
            <div className={cx('p-3 rounded-xl border', border, cardBg)}>
              <span className="font-bold text-rose-500">Eigenvectors (v1, v2):</span> Xác định hướng của hai trục chính vuông góc của Ellipse.
            </div>
            <div className={cx('p-3 rounded-xl border', border, cardBg)}>
              <span className="font-bold text-emerald-500">Eigenvalues (λ1, λ2):</span> Độ dài bán trục tương ứng với độ phân tán (variance) theo từng hướng chính.
            </div>
          </div>
        </div>
      </div>
    );
  } else if (kind === 'gaussian-marginals') {
    content = (
      <div className="p-6 flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-full max-w-lg p-5 rounded-2xl border bg-slate-900 text-slate-100 shadow-xl flex flex-col gap-3">
          <h4 className="font-bold text-sm text-sky-400">Marginal Distributions của Gaussian nhiều chiều vẫn là Gaussian</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Nếu X ~ N(μ, Σ), thì phân phối biên của từng biến riêng lẻ:
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs font-mono font-bold">
            <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-sky-300">
              X ~ N(μ_X, σ_X²)
            </div>
            <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-emerald-300">
              Y ~ N(μ_Y, σ_Y²)
            </div>
          </div>
        </div>
      </div>
    );
  } else if (kind === 'standard-normal-circle') {
    content = (
      <div className="p-6 flex flex-col lg:flex-row items-center justify-center gap-8">
        <div className="relative w-56 h-56 rounded-2xl border border-slate-800 bg-slate-950 p-4 flex items-center justify-center shadow-xl">
          <svg viewBox="0 0 10 10" className="w-full h-full overflow-visible" role="img" aria-label="Standard normal circular contours">
            <line x1="1" y1="5" x2="9" y2="5" stroke="#475569" strokeWidth="0.06" />
            <line x1="5" y1="1" x2="5" y2="9" stroke="#475569" strokeWidth="0.06" />

            <circle cx="5" cy="5" r="3" fill="none" stroke="#38bdf8" strokeWidth="0.08" strokeDasharray="0.2,0.2" />
            <circle cx="5" cy="5" r="2" fill="none" stroke="#0284c7" strokeWidth="0.1" />
            <circle cx="5" cy="5" r="1" fill="none" stroke="#0369a1" strokeWidth="0.12" />

            <circle cx="5" cy="5" r="0.2" fill="#38bdf8" />
            <text x="5.3" y="4.7" className="text-[0.4px] font-black fill-sky-400 font-mono">(0,0)</text>
          </svg>
        </div>

        <div className="flex flex-col gap-3 max-w-md">
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Standard Multivariate Normal (Z ~ N(0, I))</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Khi mean vector bằng 0 và covariance matrix bằng ma trận đơn vị I:
          </p>
          <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 list-disc list-inside">
            <li>Tâm đặt chính xác tại gốc tọa độ (0, 0).</li>
            <li>Phương sai mỗi chiều bằng 1.0. Covariance giữa các chiều bằng 0.0.</li>
            <li>Các đường contour là <strong>hình tròn hoàn hảo</strong>, biểu thị độ phân tán đồng đều theo mọi hướng.</li>
          </ul>
        </div>
      </div>
    );
  } else if (kind === 'standardization-vs-whitening') {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        <div className={cx('p-5 rounded-2xl border flex flex-col gap-2', border, cardBg)}>
          <h4 className="font-bold text-sm text-amber-500">Standardization (Z-score)</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Chuẩn hóa từng feature riêng lẻ: Z_j = (X_j - μ_j)/σ_j.
          </p>
          <div className="text-xs font-mono bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-slate-700 dark:text-slate-300">
            Cov(Z) = R (Correlation Matrix)
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400">
            ⚠ Đường chéo bằng 1 nhưng ngoài đường chéo vẫn có tương quan. Ellipse bị thu hẹp nhưng vẫn nghiêng!
          </p>
        </div>

        <div className={cx('p-5 rounded-2xl border flex flex-col gap-2', border, cardBg)}>
          <h4 className="font-bold text-sm text-emerald-500">Whitening (Tẩy trắng dữ liệu)</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Biến đổi tuyến tính toàn bộ ma trận: W = Σ⁻¹/² (X - μ).
          </p>
          <div className="text-xs font-mono bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-slate-700 dark:text-slate-300">
            Cov(W) = I (Identity Matrix)
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            ✓ Triệt tiêu hoàn toàn tương quan giữa các chiều. Đưa Ellipse về hình tròn hoàn chỉnh.
          </p>
        </div>
      </div>
    );
  } else if (kind === 'mahalanobis-vs-euclidean') {
    content = (
      <div className="p-6 flex flex-col lg:flex-row items-center justify-center gap-8">
        <div className="relative w-64 h-64 rounded-2xl border border-slate-800 bg-slate-950 p-4 flex items-center justify-center shadow-xl">
          <svg viewBox="0 0 10 10" className="w-full h-full overflow-visible" role="img" aria-label="Mahalanobis vs Euclidean distance comparison">
            <ellipse cx="5" cy="5" rx="3.5" ry="1.2" fill="none" stroke="#38bdf8" strokeWidth="0.08" transform="rotate(-30 5 5)" />

            {/* Point A on long axis */}
            <circle cx="7.6" cy="3.5" r="0.25" fill="#10b981" />
            <text x="7.9" y="3.3" className="text-[0.4px] font-black fill-emerald-400 font-mono">A (Xa Euclidean, gần Mahalanobis)</text>

            {/* Point B on short axis */}
            <circle cx="4.2" cy="3.6" r="0.25" fill="#f43f5e" />
            <text x="2.2" y="3.4" className="text-[0.4px] font-black fill-rose-400 font-mono">B (Gần Euclidean, rất xa Mahalanobis)</text>

            <circle cx="5" cy="5" r="0.2" fill="#fff" />
          </svg>
        </div>

        <div className="flex flex-col gap-3 max-w-md">
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Mahalanobis Distance (D_M) vs Euclidean Distance</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-mono">
            D_M(x) = sqrt((x-μ)ᵀ Σ⁻¹ (x-μ))
          </p>
          <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2 list-disc list-inside">
            <li><span className="font-semibold text-rose-500">Euclidean Distance:</span> Coi mọi hướng khoảng cách là như nhau (độ đo hình tròn).</li>
            <li><span className="font-semibold text-emerald-500">Mahalanobis Distance:</span> Điều chỉnh khoảng cách dựa theo độ biến động (Σ). Đi xa theo hướng có variance lớn vẫn coi là gần; đi nhỏ theo hướng hẹp bị tính rất xa!</li>
          </ul>
        </div>
      </div>
    );
  } else if (kind === 'ai-applications') {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
        {[
          { title: 'Gaussian Noise', desc: 'Thêm nhiễu chuẩn hóa trong huấn luyện mô hình học sâu và Data Augmentation.' },
          { title: 'Anomaly Detection', desc: 'Phát hiện điểm dữ liệu bất thường dựa trên khoảng cách Mahalanobis cực lớn.' },
          { title: 'Gaussian Classifiers', desc: 'Phân loại Bayes mô hình hóa từng lớp bằng một phân phối chuẩn nhiều chiều.' },
          { title: 'Kalman Filter', desc: 'Ước lượng trạng thái thực và độ bất định trong các hệ thống định vị & xe tự lái.' },
          { title: 'Variational Autoencoders', desc: 'Mô hình hóa không gian ẩn (Latent space) dưới dạng Gauss chuẩn hóa N(0, I).' },
          { title: 'Diffusion Models', desc: 'Tạo hình ảnh AI bằng cách thêm và khử nhiễu Gauss từng bước (DDPM/Stable Diffusion).' },
        ].map((app, i) => (
          <div key={i} className={cx('p-4 rounded-2xl border flex flex-col gap-1.5 shadow-sm', border, cardBg)}>
            <h5 className="font-bold text-xs text-sky-500">{app.title}</h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{app.desc}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <figure aria-label={ariaLabel} className={cx('my-6 rounded-3xl border shadow-md overflow-hidden transition-all', border, theme.isLight ? 'bg-white' : 'bg-slate-900/60')}>
      {content}
      {caption && (
        <figcaption className={cx('border-t px-6 py-3.5 text-center text-xs font-semibold leading-relaxed', border, theme.mutedText)}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function MultivariateNormalExplorer({
  ariaLabel,
  caption,
}: {
  ariaLabel: string;
  caption: string;
}) {
  const theme = useLearningMdxTheme();
  const border = theme.isLight ? 'border-slate-200' : 'border-slate-800';

  const muXId = useId();
  const muYId = useId();
  const varXId = useId();
  const varYId = useId();
  const covXYId = useId();

  const [muX, setMuX] = useState<number>(0);
  const [muY, setMuY] = useState<number>(0);
  const [varX, setVarX] = useState<number>(2.0);
  const [varY, setVarY] = useState<number>(2.0);
  const [covXY, setCovXY] = useState<number>(0.0);

  // Maximum valid covariance to maintain positive-definiteness: covXY^2 < varX * varY
  const maxAbsCov = Math.sqrt(varX * varY) * 0.95;
  const clampedCovXY = Math.max(-maxAbsCov, Math.min(maxAbsCov, covXY));

  // Compute Eigenvalues & Angle for rendering 2D Ellipse
  const trace = varX + varY;
  const det = varX * varY - clampedCovXY * clampedCovXY;
  const lambda1 = trace / 2 + Math.sqrt(Math.max(0, (trace * trace) / 4 - det));
  const lambda2 = trace / 2 - Math.sqrt(Math.max(0, (trace * trace) / 4 - det));

  const rx1 = Math.sqrt(Math.max(0.1, lambda1)) * 1.2;
  const ry1 = Math.sqrt(Math.max(0.1, lambda2)) * 1.2;

  // Angle of rotation in degrees
  let angle = 0;
  if (Math.abs(clampedCovXY) > 1e-5) {
    angle = (Math.atan2(lambda1 - varX, clampedCovXY) * 180) / Math.PI;
  } else if (varX < varY) {
    angle = 90;
  }

  // Convert (muX, muY) to SVG canvas coordinates (Center = 5, 5)
  const cxCanvas = 5 + muX * 0.8;
  const cyCanvas = 5 - muY * 0.8;

  // Checklist tasks
  const isTask1Done = Math.abs(muX - 3) < 0.3 && Math.abs(muY - (-2)) < 0.3;
  const isTask2Done = varX >= 4.0 && varY <= 1.5;
  const isTask3Done = clampedCovXY <= -1.2;
  const isTask4Done = Math.abs(muX) < 0.1 && Math.abs(muY) < 0.1 && Math.abs(varX - 1.0) < 0.2 && Math.abs(varY - 1.0) < 0.2 && Math.abs(clampedCovXY) < 0.1;

  return (
    <figure aria-label={ariaLabel} className={cx('my-8 rounded-3xl border shadow-xl overflow-hidden transition-all', border, theme.isLight ? 'bg-gradient-to-b from-slate-50 via-white to-slate-50' : 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950')}>
      <div className="grid gap-6 p-6 lg:p-8 lg:grid-cols-12 items-center">
        {/* Interactive 2D Visual Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-2xl overflow-hidden">
            <svg viewBox="0 0 10 10" className="w-full h-full overflow-visible" role="img" aria-label="Interactive 2D Gaussian density ellipse contour canvas">
              {/* Grid Lines */}
              <line x1="0" y1="5" x2="10" y2="5" stroke="#334155" strokeWidth="0.05" strokeDasharray="0.2,0.2" />
              <line x1="5" y1="0" x2="5" y2="10" stroke="#334155" strokeWidth="0.05" strokeDasharray="0.2,0.2" />

              {/* Outer 2-sigma Ellipse */}
              <ellipse
                cx={cxCanvas}
                cy={cyCanvas}
                rx={rx1 * 2}
                ry={ry1 * 2}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="0.08"
                strokeDasharray="0.2,0.2"
                transform={`rotate(${angle} ${cxCanvas} ${cyCanvas})`}
              />

              {/* Inner 1-sigma Ellipse */}
              <ellipse
                cx={cxCanvas}
                cy={cyCanvas}
                rx={rx1}
                ry={ry1}
                fill="rgba(56, 189, 248, 0.15)"
                stroke="#0284c7"
                strokeWidth="0.12"
                transform={`rotate(${angle} ${cxCanvas} ${cyCanvas})`}
              />

              {/* Center Mean Marker */}
              <circle cx={cxCanvas} cy={cyCanvas} r="0.25" fill="#f43f5e" />
              <text x={cxCanvas + 0.3} y={cyCanvas - 0.3} className="text-[0.4px] font-black fill-rose-400 font-mono">
                μ ({muX.toFixed(1)}, {muY.toFixed(1)})
              </text>
            </svg>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-sky-400">
              μ = [{muX.toFixed(1)}, {muY.toFixed(1)}]ᵀ
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
              Σ = [[{varX.toFixed(1)}, {clampedCovXY.toFixed(1)}], [{clampedCovXY.toFixed(1)}, {varY.toFixed(1)}]]
            </div>
          </div>
        </div>

        {/* Controls & Tasks */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Điều chỉnh Tham số μ & Σ</h4>

            {/* Mean Sliders */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <label htmlFor={muXId}>μ_X (Mean X)</label>
                  <span className="font-mono text-sky-500">{muX.toFixed(1)}</span>
                </div>
                <input id={muXId} type="range" min="-3" max="3" step="0.1" value={muX} onChange={(e) => setMuX(parseFloat(e.target.value))} className="w-full accent-sky-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <label htmlFor={muYId}>μ_Y (Mean Y)</label>
                  <span className="font-mono text-sky-500">{muY.toFixed(1)}</span>
                </div>
                <input id={muYId} type="range" min="-3" max="3" step="0.1" value={muY} onChange={(e) => setMuY(parseFloat(e.target.value))} className="w-full accent-sky-500" />
              </div>
            </div>

            {/* Variance Sliders */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <label htmlFor={varXId}>σ_X² (Variance X)</label>
                  <span className="font-mono text-emerald-500">{varX.toFixed(1)}</span>
                </div>
                <input id={varXId} type="range" min="0.5" max="5.0" step="0.1" value={varX} onChange={(e) => setVarX(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <label htmlFor={varYId}>σ_Y² (Variance Y)</label>
                  <span className="font-mono text-emerald-500">{varY.toFixed(1)}</span>
                </div>
                <input id={varYId} type="range" min="0.5" max="5.0" step="0.1" value={varY} onChange={(e) => setVarY(parseFloat(e.target.value))} className="w-full accent-emerald-500" />
              </div>
            </div>

            {/* Covariance Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <label htmlFor={covXYId}>σ_XY (Covariance XY)</label>
                <span className="font-mono text-indigo-500">{clampedCovXY.toFixed(1)}</span>
              </div>
              <input id={covXYId} type="range" min={(-maxAbsCov).toFixed(2)} max={maxAbsCov.toFixed(2)} step="0.1" value={clampedCovXY} onChange={(e) => setCovXY(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
            </div>
          </div>

          {/* Interactive Tasks Checklist */}
          <div className={cx('p-4 rounded-2xl border flex flex-col gap-2.5', border, theme.isLight ? 'bg-slate-100' : 'bg-slate-900/90')}>
            <h5 className="font-bold text-xs text-slate-700 dark:text-slate-300">Nhiệm vụ Thử nghiệm:</h5>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span>{isTask1Done ? '✅' : '⚪'}</span>
                <span className={isTask1Done ? 'line-through text-slate-400' : ''}>1. Di chuyển tâm tới (3, -2)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{isTask2Done ? '✅' : '⚪'}</span>
                <span className={isTask2Done ? 'line-through text-slate-400' : ''}>2. Làm Ellipse rộng theo chiều ngang (σ_X² ≥ 4)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{isTask3Done ? '✅' : '⚪'}</span>
                <span className={isTask3Done ? 'line-through text-slate-400' : ''}>3. Làm Ellipse nghiêng xuống (σ_XY ≤ -1.2)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{isTask4Done ? '✅' : '⚪'}</span>
                <span className={isTask4Done ? 'line-through text-slate-400' : ''}>4. Tạo Standard Normal Distribution (μ = 0, Σ = I)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {caption && (
        <figcaption className={cx('border-t px-6 py-3.5 text-center text-xs font-semibold leading-relaxed', border, theme.mutedText)}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

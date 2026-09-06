import { cx } from '../../theme';

type DayStatus = 'current' | 'forbidden' | 'target' | 'future';

type DayInfo = {
  day: number;
  status: DayStatus;
};

// August 2022: 01/08 is d-28, 02/08-28/08 are unavailable, and 29/08 is target d.
const AUGUST_DAYS: DayInfo[] = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  if (day === 1) return { day, status: 'current' };
  if (day >= 2 && day <= 28) return { day, status: 'forbidden' };
  if (day === 29) return { day, status: 'target' };
  return { day, status: 'future' };
});

export function ForecastHorizonCalendar({
  variant = 'horizon',
}: {
  variant?: 'horizon' | 'target-info';
}) {
  // 01/08/2022 was Monday, the first column in this Monday-first calendar.
  const leadingBlanks = 0;

  return (
    <figure
      className="my-6 w-full rounded-2xl border border-[#B8C8DA]/70 bg-gradient-to-b from-[#F8FAFC] to-[#EFF3F8] p-4 sm:p-5 shadow-xs"
      aria-label={variant === 'target-info' ? 'Minh họa thông tin biết trước i_target trên lịch' : 'Khoảng dự báo H = 28 ngày trên lịch'}
    >
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold text-[#4B6382] mb-2">
        <span>T2</span>
        <span>T3</span>
        <span>T4</span>
        <span>T5</span>
        <span>T6</span>
        <span>T7</span>
        <span>CN</span>
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {/* Empty slots before Aug 1 */}
        {Array.from({ length: leadingBlanks }).map((_, idx) => (
          <div key={`blank-${idx}`} className="h-10 sm:h-11 rounded-lg bg-[#E2E8F0]/30 border border-dashed border-[#CBD5E1]/40" />
        ))}

        {/* Actual days 1 to 31 */}
        {AUGUST_DAYS.map((item) => {
          let statusClasses = '';
          let badgeText = '';

          if (variant === 'target-info') {
            // Target-info variant: Highlight day 29 (target) and scheduled promotion period (days 28-31)
            const isPromo = item.day >= 28 && item.day <= 31;

            if (item.day === 29) {
              statusClasses = 'bg-[#EFF6FF] border-[#2563EB] text-[#1D4ED8] font-black ring-2 ring-[#3B82F6]/50 shadow-sm';
              badgeText = 'target';
            } else if (isPromo) {
              statusClasses = 'bg-[#FEF3C7]/60 border-[#F59E0B]/60 text-[#92400E]';
              badgeText = 'Promo';
            } else {
              statusClasses = 'bg-white/70 border-[#CBD5E1] text-[#64748B]';
            }
          } else {
            // Horizon variant: Standard forecast horizon with forbidden gap
            if (item.status === 'current') {
              statusClasses = 'bg-[#ECFDF5] border-[#059669] text-[#065F46] font-black ring-2 ring-[#10B981]/30 shadow-xs';
              badgeText = 'target − 28';
            } else if (item.status === 'forbidden') {
              statusClasses = 'bg-[#FFF1F2] border-[#FDA4AF] text-[#9F1239]';
            } else if (item.status === 'target') {
              statusClasses = 'bg-[#EFF6FF] border-[#2563EB] text-[#1D4ED8] font-black ring-2 ring-[#3B82F6]/40 shadow-sm';
              badgeText = 'target';
            } else {
              statusClasses = 'bg-white/70 border-[#CBD5E1] text-[#64748B]';
            }
          }

          return (
            <div
              key={`day-${item.day}`}
              className={cx(
                'relative flex items-center justify-between p-1.5 sm:p-2 h-10 sm:h-11 rounded-lg border select-none',
                statusClasses,
              )}
            >
              <span className="text-xs sm:text-sm font-bold">{item.day}</span>
              {badgeText && (
                <span className="text-[10px] px-1 py-0.5 rounded font-bold leading-none">
                  {badgeText}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Target-info specific pill tags */}
      {variant === 'target-info' && (
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-[#B8C8DA]/60 text-xs">
          <span className="font-bold text-[#172A43]">i_target gồm:</span>
          <span className="rounded-md bg-[#EFF6FF] border border-[#2563EB]/30 px-2.5 py-1 font-semibold text-[#1D4ED8]">
            Thứ Hai (T2)
          </span>
          <span className="rounded-md bg-[#EFF6FF] border border-[#2563EB]/30 px-2.5 py-1 font-semibold text-[#1D4ED8]">
            Ngày 29 (Cuối tháng)
          </span>
          <span className="rounded-md bg-[#FEF3C7] border border-[#F59E0B]/50 px-2.5 py-1 font-semibold text-[#92400E]">
            Khuyến mãi (Từ promotions.csv)
          </span>
          <span className="rounded-md bg-[#ECFDF5] border border-[#059669]/30 px-2.5 py-1 font-semibold text-[#065F46]">
            100% Biết trước (An toàn)
          </span>
        </div>
      )}
    </figure>
  );
}

export function LagFeatureVisualizer() {
  return (
    <div
      className="my-6 space-y-6"
      aria-label="Minh họa đặc trưng Lag"
    >
      {/* 1. Basic mechanism */}
      <div>
        <h5 className="text-xs sm:text-sm font-bold text-[#1E293B] mb-2">
          1. Cơ chế tạo cột Lag (df['Revenue'].shift(k))
        </h5>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-[#CBD5E1] text-xs text-left bg-white">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#334155] border-b border-[#CBD5E1]">
                <th className="p-2 border-r border-[#CBD5E1]">Date</th>
                <th className="p-2 border-r border-[#CBD5E1]">Revenue</th>
                <th className="p-2 border-r border-[#CBD5E1]">lag_1</th>
                <th className="p-2">lag_2</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#334155]">
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">01/08</td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#D1FAE5] text-[#065F46] font-bold">100</span>
                </td>
                <td className="p-2 border-r border-[#E2E8F0] text-[#94A3B8]">NaN</td>
                <td className="p-2 text-[#94A3B8]">NaN</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">02/08</td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] font-bold">105</span>
                </td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#D1FAE5] text-[#065F46] font-bold">100</span>
                </td>
                <td className="p-2 text-[#94A3B8]">NaN</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">03/08</td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#E0E7FF] text-[#3730A3] font-bold">110</span>
                </td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] font-bold">105</span>
                </td>
                <td className="p-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#D1FAE5] text-[#065F46] font-bold">100</span>
                </td>
              </tr>
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">04/08</td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#FCE7F3] text-[#9D174D] font-bold">120</span>
                </td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#E0E7FF] text-[#3730A3] font-bold">110</span>
                </td>
                <td className="p-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] font-bold">105</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Wrong way: using lag_1 for 29/08 */}
      <div>
        <h5 className="text-xs sm:text-sm font-bold text-[#1E293B] mb-2">
          2. Khi Dự báo cho ngày 29/08 với lag_1 (Cách làm SAI)
        </h5>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-[#CBD5E1] text-xs text-left bg-white">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#334155] border-b border-[#CBD5E1]">
                <th className="p-2 border-r border-[#CBD5E1]">Date</th>
                <th className="p-2 border-r border-[#CBD5E1]">Revenue (y)</th>
                <th className="p-2 border-r border-[#CBD5E1]">lag_1 (X)</th>
                <th className="p-2">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#334155]">
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">01/08</td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#D1FAE5] text-[#065F46] font-bold">100</span>
                </td>
                <td className="p-2 border-r border-[#E2E8F0]">95</td>
                <td className="p-2 text-[#64748B]">Đã có</td>
              </tr>
              <tr className="bg-[#FEF2F2] text-[#991B1B]">
                <td className="p-2 border-r border-[#E2E8F0]">...</td>
                <td className="p-2 border-r border-[#E2E8F0]">...</td>
                <td className="p-2 border-r border-[#E2E8F0]">...</td>
                <td className="p-2">27 ngày trống</td>
              </tr>
              <tr className="bg-[#FEF2F2] text-[#991B1B]">
                <td className="p-2 border-r border-[#E2E8F0] font-bold">28/08</td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#FEE2E2] text-[#DC2626] font-bold">?</span>
                </td>
                <td className="p-2 border-r border-[#E2E8F0]">?</td>
                <td className="p-2">Chưa có</td>
              </tr>
              <tr className="bg-[#FEF2F2] text-[#991B1B]">
                <td className="p-2 border-r border-[#E2E8F0] font-bold">29/08</td>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold">Cần dự báo</td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#FEE2E2] text-[#DC2626] font-bold">?</span>
                </td>
                <td className="p-2 font-semibold">Cần số liệu 28/08 (chưa có)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Right way: lag_28 and lag_29 */}
      <div>
        <h5 className="font-bold text-xs text-[#1E293B] mb-2 uppercase tracking-wide">
          3. Cách làm ĐÚNG với lag_28 và lag_29
        </h5>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-[#CBD5E1] text-xs text-left bg-white">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#334155] border-b border-[#CBD5E1]">
                <th className="p-2 border-r border-[#CBD5E1]">Date</th>
                <th className="p-2 border-r border-[#CBD5E1]">Revenue (y)</th>
                <th className="p-2 border-r border-[#CBD5E1]">lag_28 (X)</th>
                <th className="p-2">lag_29 (X)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#334155]">
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">04/07</td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#E0E7FF] text-[#3730A3] font-bold">90</span>
                </td>
                <td className="p-2 border-r border-[#E2E8F0]">85</td>
                <td className="p-2">82</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">05/07</td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] font-bold">95</span>
                </td>
                <td className="p-2 border-r border-[#E2E8F0]">88</td>
                <td className="p-2">85</td>
              </tr>
              <tr className="text-[#94A3B8]">
                <td className="p-2 border-r border-[#E2E8F0]">...</td>
                <td className="p-2 border-r border-[#E2E8F0]">...</td>
                <td className="p-2 border-r border-[#E2E8F0]">...</td>
                <td className="p-2">...</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">01/08</td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#D1FAE5] text-[#065F46] font-bold">100</span>
                </td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#E0E7FF] text-[#3730A3] font-bold">90</span>
                </td>
                <td className="p-2">89</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">02/08</td>
                <td className="p-2 border-r border-[#E2E8F0] text-[#64748B]">
                  Không cần quan tâm
                </td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] font-bold">95</span>
                </td>
                <td className="p-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#E0E7FF] text-[#3730A3] font-bold">90</span>
                </td>
              </tr>
              <tr className="text-[#94A3B8]">
                <td className="p-2 border-r border-[#E2E8F0]">...</td>
                <td className="p-2 border-r border-[#E2E8F0]">...</td>
                <td className="p-2 border-r border-[#E2E8F0]">...</td>
                <td className="p-2">...</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">28/08</td>
                <td className="p-2 border-r border-[#E2E8F0] text-[#64748B]">
                  Không cần quan tâm
                </td>
                <td className="p-2 border-r border-[#E2E8F0]">98</td>
                <td className="p-2">96</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">29/08</td>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">
                  Cần dự báo
                </td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#D1FAE5] text-[#065F46] font-bold">100</span>
                </td>
                <td className="p-2">98</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function MovingAverageVisualizer() {
  return (
    <div className="my-6 space-y-6 border border-[#CBD5E1] rounded-lg p-4 bg-white text-xs text-[#334155]">
      {/* 1. Sample table: Mechanism of rolling_mean */}
      <div>
        <h5 className="font-bold text-xs text-[#1E293B] mb-2 uppercase tracking-wide">
          1. Cơ chế tạo cột Trung bình trượt (Rolling Mean)
        </h5>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-[#CBD5E1] text-xs text-left bg-white">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#334155] border-b border-[#CBD5E1]">
                <th className="p-2 border-r border-[#CBD5E1]">Date</th>
                <th className="p-2 border-r border-[#CBD5E1]">Revenue</th>
                <th className="p-2">rolling_mean_3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#334155]">
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">01/08</td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#D1FAE5] text-[#065F46] font-bold">100</span>
                </td>
                <td className="p-2 text-[#94A3B8]">NaN</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">02/08</td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] font-bold">105</span>
                </td>
                <td className="p-2 text-[#94A3B8]">NaN</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">03/08</td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#E0E7FF] text-[#3730A3] font-bold">110</span>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    <span>(</span>
                    <span className="inline-block px-1.5 py-0.5 rounded bg-[#D1FAE5] text-[#065F46] font-bold">100</span>
                    <span>+</span>
                    <span className="inline-block px-1.5 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] font-bold">105</span>
                    <span>+</span>
                    <span className="inline-block px-1.5 py-0.5 rounded bg-[#E0E7FF] text-[#3730A3] font-bold">110</span>
                    <span>) / 3 =</span>
                    <span className="font-bold text-[#1E293B]">105.0</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">04/08</td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#FCE7F3] text-[#9D174D] font-bold">120</span>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    <span>(</span>
                    <span className="inline-block px-1.5 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] font-bold">105</span>
                    <span>+</span>
                    <span className="inline-block px-1.5 py-0.5 rounded bg-[#E0E7FF] text-[#3730A3] font-bold">110</span>
                    <span>+</span>
                    <span className="inline-block px-1.5 py-0.5 rounded bg-[#FCE7F3] text-[#9D174D] font-bold">120</span>
                    <span>) / 3 =</span>
                    <span className="font-bold text-[#1E293B]">111.7</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">05/08</td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#CFFAFE] text-[#0E7490] font-bold">115</span>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    <span>(</span>
                    <span className="inline-block px-1.5 py-0.5 rounded bg-[#E0E7FF] text-[#3730A3] font-bold">110</span>
                    <span>+</span>
                    <span className="inline-block px-1.5 py-0.5 rounded bg-[#FCE7F3] text-[#9D174D] font-bold">120</span>
                    <span>+</span>
                    <span className="inline-block px-1.5 py-0.5 rounded bg-[#CFFAFE] text-[#0E7490] font-bold">115</span>
                    <span>) / 3 =</span>
                    <span className="font-bold text-[#1E293B]">115.0</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Common mistake vs Correct approach (Stacked Bar Timeline) */}
      <div>
        <h5 className="font-bold text-xs text-[#1E293B] mb-3 uppercase tracking-wide">
          2. Lỗi sai phổ biến khi tạo Rolling Mean cho ngày 29/08
        </h5>

        {/* 2.1 Wrong way */}
        <div className="mb-4">
          <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
            <span className="font-bold text-[11px] uppercase tracking-wide text-[#991B1B]">
              Cách làm SAI: Cửa sổ 3 ngày sát ngày đích (Rò rỉ tương lai)
            </span>
            <span className="text-[11px] text-[#DC2626] font-semibold">
              rolling_mean_3 = Mean(26/08 → 28/08) ✗
            </span>
          </div>
          <div className="flex h-12 w-full rounded border border-[#CBD5E1] overflow-hidden text-center text-xs">
            <div className="w-[20%] bg-[#F1F5F9] text-[#64748B] flex flex-col justify-center border-r border-[#CBD5E1] px-1">
              <span className="font-semibold truncate">Lịch sử</span>
              <span className="text-[10px] text-[#94A3B8]">≤ 01/08</span>
            </div>
            <div className="w-[55%] bg-[#F8FAFC] text-[#94A3B8] flex flex-col justify-center border-r border-[#CBD5E1] border-dashed px-1">
              <span className="truncate">24 ngày trống</span>
              <span className="text-[10px]">02/08 → 25/08</span>
            </div>
            <div className="w-[15%] min-w-[70px] bg-[#FEE2E2] text-[#991B1B] flex flex-col justify-center border-r border-[#CBD5E1] font-bold px-1">
              <span className="truncate">Cửa sổ 3 ngày</span>
              <span className="text-[10px] text-[#DC2626]">26/08 → 28/08 (Chưa có)</span>
            </div>
            <div className="w-[10%] min-w-[60px] bg-[#FEF2F2] text-[#991B1B] flex flex-col justify-center font-bold px-1">
              <span className="truncate">Đích</span>
              <span className="text-[10px]">29/08</span>
            </div>
          </div>
        </div>

        {/* 2.2 Right way */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
            <span className="font-bold text-[11px] uppercase tracking-wide text-[#065F46]">
              Cách làm ĐÚNG: Cửa sổ 3 ngày lùi sau mốc Lag 28 (An toàn)
            </span>
            <span className="text-[11px] text-[#065F46] font-semibold">
              rolling_mean_3 = Mean(30/07 → 01/08) ✓
            </span>
          </div>
          <div className="flex h-12 w-full rounded border border-[#CBD5E1] overflow-hidden text-center text-xs">
            <div className="w-[20%] bg-[#D1FAE5] text-[#065F46] flex flex-col justify-center border-r border-[#CBD5E1] font-bold px-1">
              <span className="truncate">Cửa sổ 3 ngày</span>
              <span className="text-[10px] text-[#047857]">30/07 → 01/08 (Đã có)</span>
            </div>
            <div className="w-[70%] bg-[#F1F5F9] text-[#64748B] flex flex-col justify-center border-r border-[#CBD5E1] px-1">
              <span className="truncate">Khoảng chờ rào cản (27 ngày trống)</span>
              <span className="text-[10px] text-[#94A3B8]">02/08 → 28/08</span>
            </div>
            <div className="w-[10%] min-w-[60px] bg-[#DBEAFE] text-[#1E40AF] flex flex-col justify-center font-bold px-1">
              <span className="truncate">Đích</span>
              <span className="text-[10px]">29/08</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Final right-way table */}
      <div>
        <h5 className="font-bold text-xs text-[#1E293B] mb-2 uppercase tracking-wide">
          3. Bảng dữ liệu thực tế khi làm ĐÚNG cho ngày 29/08
        </h5>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-[#CBD5E1] text-xs text-left bg-white">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#334155] border-b border-[#CBD5E1]">
                <th className="p-2 border-r border-[#CBD5E1]">Date</th>
                <th className="p-2 border-r border-[#CBD5E1]">Revenue (y)</th>
                <th className="p-2 border-r border-[#CBD5E1]">lag_28 (X)</th>
                <th className="p-2 border-r border-[#CBD5E1]">lag_29 (X)</th>
                <th className="p-2">rolling_mean_3 (X)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#334155]">
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">04/07</td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#E0E7FF] text-[#3730A3] font-bold">90</span>
                </td>
                <td className="p-2 border-r border-[#E2E8F0]">85</td>
                <td className="p-2 border-r border-[#E2E8F0]">82</td>
                <td className="p-2">83.6</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">05/07</td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] font-bold">95</span>
                </td>
                <td className="p-2 border-r border-[#E2E8F0]">88</td>
                <td className="p-2 border-r border-[#E2E8F0]">85</td>
                <td className="p-2">84.3</td>
              </tr>
              <tr className="text-[#94A3B8]">
                <td className="p-2 border-r border-[#E2E8F0]">...</td>
                <td className="p-2 border-r border-[#E2E8F0]">...</td>
                <td className="p-2 border-r border-[#E2E8F0]">...</td>
                <td className="p-2 border-r border-[#E2E8F0]">...</td>
                <td className="p-2">...</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">30/07</td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#CFFAFE] text-[#0E7490] font-bold">92</span>
                </td>
                <td className="p-2 border-r border-[#E2E8F0]">89</td>
                <td className="p-2 border-r border-[#E2E8F0]">87</td>
                <td className="p-2">88.0</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">31/07</td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#FCE7F3] text-[#9D174D] font-bold">98</span>
                </td>
                <td className="p-2 border-r border-[#E2E8F0]">91</td>
                <td className="p-2 border-r border-[#E2E8F0]">89</td>
                <td className="p-2">89.3</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">01/08</td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#D1FAE5] text-[#065F46] font-bold">100</span>
                </td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#E0E7FF] text-[#3730A3] font-bold">90</span>
                </td>
                <td className="p-2 border-r border-[#E2E8F0]">89</td>
                <td className="p-2">87.1</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">02/08</td>
                <td className="p-2 border-r border-[#E2E8F0] text-[#64748B]">
                  Không cần quan tâm
                </td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] font-bold">95</span>
                </td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#E0E7FF] text-[#3730A3] font-bold">90</span>
                </td>
                <td className="p-2">88.5</td>
              </tr>
              <tr className="text-[#94A3B8]">
                <td className="p-2 border-r border-[#E2E8F0]">...</td>
                <td className="p-2 border-r border-[#E2E8F0]">...</td>
                <td className="p-2 border-r border-[#E2E8F0]">...</td>
                <td className="p-2 border-r border-[#E2E8F0]">...</td>
                <td className="p-2">...</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">28/08</td>
                <td className="p-2 border-r border-[#E2E8F0] text-[#64748B]">
                  Không cần quan tâm
                </td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#FCE7F3] text-[#9D174D] font-bold">98</span>
                </td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#CFFAFE] text-[#0E7490] font-bold">92</span>
                </td>
                <td className="p-2">91.0</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">29/08</td>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">
                  Cần dự báo
                </td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#D1FAE5] text-[#065F46] font-bold">100</span>
                </td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#FCE7F3] text-[#9D174D] font-bold">98</span>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span>(</span>
                    <span className="inline-block px-1.5 py-0.5 rounded bg-[#CFFAFE] text-[#0E7490] font-bold">92</span>
                    <span>+</span>
                    <span className="inline-block px-1.5 py-0.5 rounded bg-[#FCE7F3] text-[#9D174D] font-bold">98</span>
                    <span>+</span>
                    <span className="inline-block px-1.5 py-0.5 rounded bg-[#D1FAE5] text-[#065F46] font-bold">100</span>
                    <span>) / 3 =</span>
                    <span className="font-bold text-[#065F46]">96.7</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function CogsLeakageVisualizer() {
  return (
    <div className="my-6 space-y-6 border border-[#CBD5E1] rounded-lg p-4 bg-white text-xs text-[#334155]">
      {/* 1. Correlation Matrix */}
      <div>
        <h5 className="font-bold text-xs text-[#1E293B] mb-2 uppercase tracking-wide">
          1. Ma trận tương quan giữa Revenue và Giá vốn (COGS)
        </h5>
        <div className="overflow-x-auto max-w-sm">
          <table className="w-full border-collapse border border-[#CBD5E1] text-xs text-left bg-white">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#334155] border-b border-[#CBD5E1]">
                <th className="p-2 border-r border-[#CBD5E1]">Biến</th>
                <th className="p-2 border-r border-[#CBD5E1]">Revenue</th>
                <th className="p-2">COGS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#334155]">
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">Revenue</td>
                <td className="p-2 border-r border-[#E2E8F0] text-[#64748B]">1.00</td>
                <td className="p-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#FEE2E2] text-[#DC2626] font-bold">0.98</span>
                </td>
              </tr>
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">COGS</td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#FEE2E2] text-[#DC2626] font-bold">0.98</span>
                </td>
                <td className="p-2 text-[#64748B]">1.00</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-[#64748B]">
          Hệ số tương quan <span className="font-bold text-[#DC2626]">0.98</span> cực kỳ cao khiến nhiều người lầm tưởng đây là đặc trưng hoàn hảo.
        </p>
      </div>

      {/* 2. Inference failure table */}
      <div>
        <h5 className="font-bold text-xs text-[#1E293B] mb-2 uppercase tracking-wide">
          2. Thực tế khi đưa COGS cùng ngày vào dự báo cho ngày 29/08 (Bẫy rò rỉ)
        </h5>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-[#CBD5E1] text-xs text-left bg-white">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#334155] border-b border-[#CBD5E1]">
                <th className="p-2 border-r border-[#CBD5E1]">Date</th>
                <th className="p-2 border-r border-[#CBD5E1]">Revenue (y)</th>
                <th className="p-2 border-r border-[#CBD5E1]">COGS cùng ngày (X)</th>
                <th className="p-2">Tình trạng tại ngày chốt đơn (01/08)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#334155]">
              <tr>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">01/08</td>
                <td className="p-2 border-r border-[#E2E8F0]">100</td>
                <td className="p-2 border-r border-[#E2E8F0]">65</td>
                <td className="p-2 text-[#065F46]">Đã có</td>
              </tr>
              <tr className="text-[#94A3B8]">
                <td className="p-2 border-r border-[#E2E8F0]">...</td>
                <td className="p-2 border-r border-[#E2E8F0]">...</td>
                <td className="p-2 border-r border-[#E2E8F0]">...</td>
                <td className="p-2">27 ngày trống</td>
              </tr>
              <tr className="bg-[#FEF2F2]">
                <td className="p-2 border-r border-[#E2E8F0] font-bold text-[#991B1B]">29/08</td>
                <td className="p-2 border-r border-[#E2E8F0] font-semibold text-[#1E293B]">Cần dự báo</td>
                <td className="p-2 border-r border-[#E2E8F0]">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#FEE2E2] text-[#DC2626] font-bold">
                    ? (Chưa có)
                  </span>
                </td>
                <td className="p-2 text-[#991B1B] font-semibold">
                  Chưa bán hàng → Chưa có giá vốn!
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export const aiProjectsMdxComponents = {
  ForecastHorizonCalendar,
  LagFeatureVisualizer,
  MovingAverageVisualizer,
  CogsLeakageVisualizer,
};

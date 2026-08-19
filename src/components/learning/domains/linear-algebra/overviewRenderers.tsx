type AiDataRepresentationDemoProps = {
  ariaLabel: string;
};

const spreadsheetRows = [
  ['Số giờ học', 'Số bài luyện tập', 'Kết quả (Đậu/Rớt)'],
  [2, 5, 0],
  [6, 8, 1],
  [4, 7, 1],
] as const;

type Rgb = readonly [number, number, number];

const colors = {
  sky: [154, 211, 247],
  sun: [250, 196, 70],
  roof: [205, 80, 72],
  wall: [245, 222, 174],
  window: [75, 150, 230],
  door: [132, 88, 62],
  grass: [88, 164, 92],
} satisfies Record<string, Rgb>;

const pixelHouse: Rgb[][] = [
  [colors.sky, colors.sky, colors.sky, colors.sky, colors.sun],
  [colors.sky, colors.sky, colors.roof, colors.sky, colors.sun],
  [colors.sky, colors.roof, colors.roof, colors.roof, colors.sky],
  [colors.grass, colors.wall, colors.window, colors.wall, colors.grass],
  [colors.grass, colors.wall, colors.door, colors.wall, colors.grass],
];

const channelDefinitions = [
  { label: 'R', index: 0, borderClassName: 'border-rose-300', labelClassName: 'bg-rose-100 text-rose-900' },
  { label: 'G', index: 1, borderClassName: 'border-emerald-300', labelClassName: 'bg-emerald-100 text-emerald-900' },
  { label: 'B', index: 2, borderClassName: 'border-blue-300', labelClassName: 'bg-blue-100 text-blue-900' },
] as const;

function channelCellColor(channelIndex: number, value: number): string {
  const secondary = 245 - Math.round((value / 255) * 115);
  if (channelIndex === 0) return `rgb(255, ${secondary}, ${secondary})`;
  if (channelIndex === 1) return `rgb(${secondary}, 255, ${secondary})`;
  return `rgb(${secondary}, ${secondary}, 255)`;
}

export function AiDataRepresentationDemo({ ariaLabel }: AiDataRepresentationDemoProps) {
  return (
    <figure className="my-6 grid gap-6" aria-label={ariaLabel}>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <h3 className="border-b border-slate-200 px-5 py-4 text-base font-black text-[#123B68]">Ví dụ 1: Bảng Excel</h3>

        <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-center">
          <div className="overflow-x-auto">
            <table className="!my-0 w-full min-w-[24rem] !border-0 border-collapse text-center text-sm tabular-nums">
              <caption className="sr-only">Bảng Excel gồm ba cột số và ba hàng dữ liệu</caption>
              <thead>
                <tr>
                  <th className="w-10 border border-slate-300 bg-slate-100" aria-label="Góc bảng tính" />
                  {['A', 'B', 'C'].map((column) => (
                    <th key={column} scope="col" className="border border-slate-300 bg-slate-100 px-3 py-2 font-black text-slate-600">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {spreadsheetRows.map((row, rowIndex) => (
                  <tr key={`sheet-row-${rowIndex + 1}`}>
                    <th scope="row" className="border border-slate-300 bg-slate-100 px-2 py-2 font-black text-slate-600">{rowIndex + 1}</th>
                    {row.map((value, columnIndex) => {
                      const isHeader = rowIndex === 0;
                      const isVectorRow = rowIndex === 2;
                      const isScalarCell = rowIndex === 2 && columnIndex === 1;
                      return (
                        <td
                          key={`sheet-cell-${rowIndex}-${columnIndex}`}
                          className={[
                            'border border-slate-300 px-3 py-2.5 font-semibold',
                            isHeader ? 'bg-[#E2F0D9] text-slate-800' : 'bg-[#EFF6FF] text-[#123B68]',
                            isVectorRow ? 'border-y-[#4D86C5] bg-[#DDEBFA] font-black' : '',
                            isScalarCell ? 'relative z-10 bg-amber-100 text-amber-950 ring-2 ring-inset ring-amber-500' : '',
                          ].join(' ')}
                        >
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="grid list-disc gap-4 pl-5 text-sm leading-6 text-slate-700 marker:text-[#205089]">
            <li><strong className="text-[#123B68]">Scalar</strong> là một giá trị số duy nhất. Trong bảng Excel này, ô B3 là một scalar có giá trị <code className="font-bold">8</code>.</li>
            <li><strong className="text-[#123B68]">Vector</strong> là một dãy giá trị có thứ tự. Hàng 3 tạo thành vector <code className="font-bold">[6, 8, 1]</code> đại diện cho dữ liệu của một đối tượng; cột B tạo thành vector <code className="font-bold">[5, 8, 7]</code> đại diện cho tính chất, đặc trưng của các đối tượng khác nhau.</li>
            <li><strong className="text-[#123B68]">Matrix</strong> hình thành khi nhiều vector được xếp thành hàng và cột. Vùng số A2:C4 là matrix shape <code className="font-bold">3 × 3</code>, gồm ba mẫu và ba đại lượng đặc trưng trên mỗi mẫu.</li>
          </ul>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <h3 className="border-b border-slate-200 px-5 py-4 text-base font-black text-[#123B68]">Ví dụ 2: Ảnh màu RGB</h3>

        <div className="grid gap-6 p-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(19rem,0.7fr)] xl:items-center">
          <div className="grid items-center gap-4 md:grid-cols-[10rem_2rem_minmax(0,1fr)]">
            <div>
              <div
                className="grid aspect-square grid-cols-5 overflow-hidden rounded-lg border-4 border-slate-800 shadow-sm"
                aria-label="Ảnh pixel ngôi nhà dưới bầu trời có mặt trời"
              >
                {pixelHouse.flat().map((pixel, index) => (
                  <span
                    key={`rgb-pixel-${index}`}
                    className={`border border-white/30 ${index === 17 ? 'relative z-10 ring-2 ring-inset ring-amber-400' : ''}`}
                    style={{ backgroundColor: `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})` }}
                  />
                ))}
              </div>
            </div>

            <span className="hidden text-center text-2xl font-black text-slate-400 md:block" aria-hidden="true">→</span>

            <div className="flex items-start justify-center overflow-x-auto px-2 pb-3 pt-1">
              {channelDefinitions.map((channel) => {
                const layerPosition = channel.index === 0
                  ? 'z-[3] mt-12'
                  : channel.index === 1
                    ? 'z-[2] -ml-4 mt-6'
                    : 'z-[1] -ml-4';
                return (
                  <div key={channel.label} className={`w-36 shrink-0 rounded-lg border bg-white p-2.5 shadow-[7px_8px_0_rgba(15,23,42,0.08)] ${channel.borderClassName} ${layerPosition}`}>
                    <div className="flex items-center justify-between gap-2">
                      <strong className={`grid size-7 place-items-center rounded-md text-sm font-black ${channel.labelClassName}`}>{channel.label}</strong>
                      <span className="text-xs font-bold text-slate-500">5 × 5</span>
                    </div>
                    <div className="mt-2 grid grid-cols-5 overflow-hidden rounded border border-slate-200 font-mono text-[0.58rem] font-black tabular-nums text-slate-900">
                      {pixelHouse.flat().map((pixel, index) => {
                        const value = pixel[channel.index];
                        return (
                          <span
                            key={`${channel.label}-${index}`}
                            className={`grid aspect-square place-items-center border border-white/50 ${index === 17 ? 'relative z-10 ring-2 ring-inset ring-amber-500' : ''}`}
                            style={{ backgroundColor: channelCellColor(channel.index, value) }}
                          >
                            {value}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <ul className="grid list-disc gap-4 pl-5 text-sm leading-6 text-slate-700 marker:text-[#205089]">
            <li><strong className="text-[#123B68]">Pixel</strong> là một điểm ảnh. Pixel cửa sổ được đánh dấu tại hàng 4, cột 3 có ba cường độ màu <code className="font-bold">[75, 150, 230]</code>.</li>
            <li><strong className="text-[#123B68]">Ba matrix màu</strong> lưu riêng cường độ Red, Green và Blue tại cùng 25 vị trí. Vì ảnh rộng 5 pixel và cao 5 pixel, mỗi kênh là một matrix shape <code className="font-bold">5 × 5</code>.</li>
            <li><strong className="text-[#123B68]">Tensor ảnh</strong> được tạo bằng cách xếp ba matrix R, G và B theo một trục màu mới. Shape đầy đủ của ảnh là <code className="font-bold">5 × 5 × 3</code>.</li>
          </ul>
        </div>
      </section>
    </figure>
  );
}

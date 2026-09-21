# SALES FORECASTING

## Câu hỏi ôn tập cuối dự án và đáp án gợi ý

**Domain:** AI Projects  
**Project:** Retail & E-Commerce — Sales Forecasting với LightGBM & SHAP  
**Ngôn ngữ:** Tiếng Việt  
**Thời lượng đề xuất:** 90 phút  
**Tổng điểm:** 100  
**Hình thức:** Câu hỏi tự luận và tình huống  
**Chương trình:** AI Coffee 2026

> **Tài liệu được phép sử dụng:** Bạn có thể tham khảo tài liệu của AIVN, các bài học trên website TorchViz và tìm kiếm thông tin bằng Google. Không nên sử dụng các công cụ AI như ChatGPT trong lúc làm bài, vì não bộ cần thời gian tự suy nghĩ, kết nối kiến thức và hình thành cách giải thích của riêng mình.

---

## Mục tiêu đánh giá

Bộ câu hỏi giúp kiểm tra xem người học đã hiểu cách xây dựng một pipeline dự báo doanh thu hay chưa. Trọng tâm không phải là nhớ cú pháp, mà là biết chọn dữ liệu, tránh sai sót và giải thích kết quả.

- Xác định đúng forecast horizon và information cutoff.
- Kiểm tra và làm sạch dữ liệu chuỗi thời gian.
- Chuyển insight từ EDA thành feature hợp lệ mà không gây leakage.
- Thiết kế time-based validation và sử dụng tập test đúng vai trò.
- Đọc WAPE, bias, SHAP và prediction interval trong ngữ cảnh kinh doanh.
- Nhận ra giới hạn của model và đề xuất cách sử dụng an toàn.

## Hướng dẫn trả lời

- Giải thích lập luận trước khi đưa ra quyết định.
- Với mỗi feature, hãy kiểm tra xem thông tin đó đã có tại thời điểm phát hành dự báo hay chưa.
- Không dùng kết quả test để quay lại chọn model hoặc tuning hyperparameter.
- Có thể dùng pseudocode khi cần mô tả một phép kiểm tra.
- Đáp án mẫu mô tả một câu trả lời tốt; cách diễn đạt khác vẫn được chấp nhận nếu lập luận đúng.

---

# PHẦN A — BỘ CÂU HỎI

## Câu mở đầu — Cần thu thập dữ liệu gì?

Nếu doanh nghiệp chỉ đưa ra yêu cầu “hãy dự báo doanh thu”, bạn sẽ đề xuất thu thập những dữ liệu nào? Với mỗi nhóm dữ liệu, hãy cho biết dữ liệu đó có sẵn trước ngày dự báo hay chỉ xuất hiện sau khi hoạt động bán hàng xảy ra.

## Câu 1 — Định nghĩa bài toán dự báo (6 điểm)

Doanh nghiệp cần phát hành kế hoạch doanh thu cho ngày (d) trước 28 ngày.

1. Hãy định nghĩa target, forecast horizon và information cutoff.
2. Phân biệt dữ liệu lịch sử với dữ liệu ngoại sinh biết trước.

## Câu 2 — Feature nào được phép sử dụng? (10 điểm)

Với (H=28), hãy đánh giá từng feature sau là hợp lệ hay gây leakage khi dự báo ngày (d):

1. Revenue tại (d-7).
2. Revenue tại (d-28).
3. Trung bình Revenue từ (d-55) đến (d-28).
4. COGS thực tế của ngày (d).
5. Thứ trong tuần của ngày (d).
6. Chương trình khuyến mãi ngày (d), đã được doanh nghiệp phê duyệt trước lúc phát hành dự báo.

Với mỗi feature, hãy nêu lý do dựa trên thông tin hệ thống biết tại thời điểm dự báo.

## Câu 3 — Kiểm tra dữ liệu thô (8 điểm)

Bạn nhận hai tệp có cấu trúc sau:

| Tệp | Cột | Ý nghĩa |
|---|---|---|
| `sales.csv` | `Date` | Ngày ghi nhận doanh thu; có thể dùng `yyyy-mm-dd`, `dd/mm/yyyy` hoặc kèm giờ `00:00:00`. |
| `sales.csv` | `Revenue` | Doanh thu trong ngày; một số giá trị có dấu phẩy phân cách hàng nghìn. |
| `sales.csv` | `COGS` | Giá vốn hàng bán trong ngày; một số giá trị có dấu phẩy phân cách hàng nghìn. |
| `promotions.csv` | `start_date` | Ngày bắt đầu chương trình khuyến mãi. |
| `promotions.csv` | `end_date` | Ngày kết thúc chương trình khuyến mãi. |
| `promotions.csv` | `discount_value` | Mức giảm giá của chương trình. |
| `promotions.csv` | `applicable_category` | Nhóm hàng được áp dụng khuyến mãi. |

Hãy nêu các kiểm tra cần thực hiện cho từng tệp trước khi EDA:

- Mỗi cột cần được chuyển sang kiểu dữ liệu nào?
- Khoảng ngày khuyến mãi cần thỏa mãn điều kiện gì?
- Làm thế nào để phát hiện ngày bán hàng bị trùng hoặc bị thiếu?
- Cần kiểm tra giá trị thiếu và giá trị bất hợp lý ở những cột nào?
- Điều kiện nào xác nhận hai tệp đã sẵn sàng cho EDA và join dữ liệu?

## Câu 4 — Xử lý ngày bị trùng (6 điểm)

Tệp thô có 3.851 dòng. Audit phát hiện 18 ngày bị ghi trùng và hai dòng của mỗi ngày trùng giống hệt nhau. Bạn sẽ:

1. Cộng hai dòng.
2. Lấy trung bình.
3. Giữ một dòng.
4. Xóa cả hai dòng rồi nội suy.

Chọn phương án, giải thích vì sao, và nêu kết quả cấu trúc dữ liệu mong đợi sau xử lý.

## Câu 5 — Dự án phát hiện doanh thu bất thường bằng cách nào? (2 điểm)

Để tìm các ngày có Revenue cao hoặc thấp bất thường, dự án đã dùng phương pháp nào? Phương pháp đó dựa trên các đại lượng nào của phân phối dữ liệu?

## Câu 6 — Có nên xóa các ngày doanh thu bất thường? (6 điểm)

Phương pháp trong dự án phát hiện 169 ngày doanh thu cao bất thường; 63,9% trong số đó nằm quanh thời điểm giao tháng.

1. Có nên **winsorize** — tức là thay các giá trị vượt ngưỡng bằng chính giá trị tại ngưỡng để giảm ảnh hưởng của chúng — hoặc xóa toàn bộ các ngày này không?
2. EDA nào cần thực hiện tiếp?
3. Insight này nên được chuyển thành feature như thế nào?

## Câu 7 — Tạo feature mà không làm lộ dữ liệu tương lai (10 điểm)

1. **Lag là gì?** Dự án dùng lag để cung cấp thông tin nào cho model? Hãy minh họa bằng `lag_28` khi dự báo Revenue ngày 29/01/2022.
2. **Khai triển Fourier là gì?** Dự án biến ngày trong năm thành các feature Fourier để làm gì? Hãy minh họa bằng một cặp feature sin–cos và giải thích vì sao cách biểu diễn này phù hợp hơn chỉ dùng số thứ tự ngày trong năm.
3. Hãy thiết kế các nhóm feature cho bài toán (H=28), bao gồm:

- Lag và rolling statistics.
- Calendar và vị trí quanh cuối tháng.
- Seasonality theo năm.
- Tết và promotion.

4. Giải thích:

   - Vì sao pipeline dùng nền `safe = y.shift(28)`.
   - Feature `lag_371` cần Revenue của 371 ngày trước. Điều gì xảy ra với 371 ngày đầu tiên của chuỗi, và vì sao project không đưa các dòng này vào bảng huấn luyện?
   - Vì sao COGS cùng ngày target phải bị loại dù tương quan với Revenue rất cao.
   - Việc loại COGS cùng ngày có đồng nghĩa phải bỏ toàn bộ dữ liệu COGS không? Hãy nêu một feature COGS lịch sử vẫn có thể dùng hợp lệ.

## Câu 8 — Kiểm tra bảng feature sau khi tạo (2 điểm)

Sau bước feature engineering, pipeline tạo bảng sau để dự báo trước 28 ngày:

| target_date | revenue_lag_7 | revenue_lag_28 | roll_mean_28_safe | day_of_week | is_promo |
|---|---:|---:|---:|---:|---:|
| 2022-12-01 | 4.800.000 | 4.100.000 | 3.920.000 | 3 | 1 |
| 2022-12-02 | 5.100.000 | 4.250.000 | 3.970.000 | 4 | 0 |

Các cột được tạo như sau:

| Cột | Cách tính |
|---|---|
| `revenue_lag_7` | Revenue của 7 ngày trước target. |
| `revenue_lag_28` | Revenue của 28 ngày trước target. |
| `roll_mean_28_safe` | Trung bình Revenue từ \(d-55\) đến \(d-28\). |
| `day_of_week` | Thứ trong tuần của ngày target. |
| `is_promo` | Chương trình khuyến mãi đã được công bố trước ngày phát hành dự báo. |

Cột nào gây data leakage? Giải thích dựa trên mốc thông tin \(d-28\).

## Câu 9 — Kiểm tra tự động việc rò rỉ dữ liệu (8 điểm)

Hãy đề xuất một phép thử tự động để kiểm tra rằng feature lịch sử tại ngày (d) không sử dụng Revenue trong 27 ngày gần target.

Mô tả:

- Dữ liệu nào được cố ý thay đổi để thử pipeline.
- Feature nào được tính lại.
- Đại lượng nào được so sánh.
- Điều kiện pass/fail.

## Câu 10 — Chia dữ liệu và chọn model theo thời gian (10 điểm)

Thiết kế quy trình expanding-window validation cho chuỗi doanh thu với (H=28).

1. Vì sao không được random split?
2. Vì sao cần chừa một khoảng cách ít nhất 28 ngày giữa phần dữ liệu dùng để huấn luyện và phần dùng để validation?
3. Nếu XGBoost thắng trung bình trên cross-validation nhưng LightGBM tốt hơn trên test cuối năm 2022, bạn chọn model nào và vì sao?

## Câu 11 — Vì sao cần baseline và ablation? (8 điểm)

Nếu chỉ huấn luyện năm mô hình cây mà không so sánh với các quy tắc dự báo đơn giản:

1. Vì sao kết quả này chưa đủ thuyết phục team business?
2. Hãy đề xuất ít nhất hai baseline phù hợp.
3. Ablation theo nhóm feature trả lời câu hỏi khác gì so với feature importance?

## Câu 12 — Đọc WAPE và bias (8 điểm)

LightGBM đạt:

- WAPE = 0,2038.
- Bias = -0,1181.
- Tập test gồm 184 ngày.
- WAPE tốt hơn baseline 30,7%.

1. Vì sao dự án chọn WAPE thay vì chỉ dùng RMSE hoặc MAPE?
2. Hãy diễn giải WAPE, bias và mức cải thiện so với baseline cho stakeholder.
3. Nêu ít nhất hai kiểm tra cần làm trước khi kết luận model sẵn sàng triển khai.

## Câu 13 — Giải thích model bằng TreeSHAP (8 điểm)

1. Global SHAP và local SHAP trả lời hai câu hỏi khác nhau như thế nào?
2. Việc bốn trong sáu feature quan trọng nhất liên quan đến mốc 364 ngày cho biết điều gì?
3. Vì sao dự án chuyển giá trị trung bình tuyệt đối của SHAP thành tỉ trọng phần trăm? Con số phần trăm này có ý nghĩa gì và không có ý nghĩa gì?
4. Vì sao cần gom các feature thành nhóm như lịch sử doanh thu, lịch, Tết và khuyến mãi? Khi các nhóm có số lượng feature khác nhau, vì sao phải xem cả tổng đóng góp của nhóm và đóng góp trung bình trên mỗi feature?
5. Hãy mô tả phép kiểm tính cộng tính để xác nhận SHAP giải thích đúng đầu ra model.
6. Vì sao SHAP không chứng minh quan hệ nhân quả?

## Câu 14 — Prediction interval và cách sử dụng trong thực tế (8 điểm)

Conformal calibration cho kết quả:

- Target coverage: 90%.
- Empirical coverage: 92,4% — 170/184 ngày.
- Bán kính: 1.215.280 đồng.
- Độ rộng trung bình: 2.412.217 đồng.
- 15/184 ngày đi vào human-review queue.

1. Đánh giá interval có đạt mục tiêu không.
2. Vì sao chỉ nhìn coverage là chưa đủ?
3. Nếu các ngày nằm ngoài interval tập trung quanh đỉnh doanh thu, bạn sẽ cải tiến gì?
4. Đề xuất cách xử lý khi interval cắt ngưỡng 5 triệu đồng/ngày.

## Câu hỏi mở rộng — Nhìn lại các quyết định của dự án

Các câu dưới đây không tính vào tổng 100 điểm. Chúng dùng để thảo luận thêm sau khi hoàn thành phần chính.

### A. Cú giảm doanh thu năm 2019

Doanh thu trung bình năm 2019 giảm 38,6% so với giai đoạn trước. Hiện tượng này có thể ảnh hưởng thế nào đến việc chia dữ liệu, so sánh model và chất lượng dự báo? Ngoài quan sát biểu đồ, bạn sẽ kiểm tra gì để xác nhận đây là một thay đổi thật của thị trường?

### B. Tách mùa vụ khỏi chênh lệch giữa các năm

Vì sao dự án phải chia Revenue mỗi ngày cho mức Revenue trung bình của năm đó trước khi so sánh doanh thu theo ngày trong tháng? Nếu bỏ bước này, ta có thể kết luận sai điều gì về ngày 31?

### C. Khuyến mãi không chỉ là có hoặc không

Dự án gộp 50 chương trình khuyến mãi thành một số feature đơn giản. Cách làm này có thể bỏ mất những thông tin nào? Hãy đề xuất feature để model phân biệt loại khuyến mãi, ảnh hưởng trước và sau chương trình, và trường hợp khuyến mãi trùng với cuối tháng hoặc cận Tết.

### D. Đưa model vào sử dụng an toàn

Vì sao không nên thay ngay quy tắc dự báo hiện tại bằng model mới? Hãy mô tả cách chạy thử song song, điều kiện quay về baseline và tín hiệu cho biết model cần được huấn luyện lại.

---

# PHẦN B — ĐÁP ÁN GỢI Ý VÀ CÁCH CHẤM

## Đáp án câu mở đầu — Cần thu thập dữ liệu gì?

Tối thiểu cần có ngày và Revenue thực tế theo đúng mức chi tiết cần dự báo, chẳng hạn theo ngày, cửa hàng hoặc nhóm sản phẩm. Nếu có nhiều chuỗi, cần thêm mã cửa hàng, sản phẩm hoặc khu vực.

Các dữ liệu có thể biết trước gồm:

- Calendar: thứ trong tuần, tháng, ngày lễ và Tết.
- Kế hoạch promotion, mức giảm giá và thay đổi giá đã được phê duyệt.
- Lịch đóng/mở cửa, ra mắt sản phẩm hoặc sự kiện đã lên kế hoạch.
- Weather forecast hoặc sự kiện bên ngoài nếu nguồn này thật sự có sẵn tại thời điểm phát hành dự báo.

Các dữ liệu chỉ xuất hiện sau hoạt động bán hàng như Revenue, COGS thực tế, số giao dịch, lượng truy cập hoặc tồn kho cuối ngày chỉ được dùng dưới dạng lịch sử và phải dừng tại information cutoff.

Ngoài giá trị dữ liệu, cần làm rõ timezone, currency, thuế, hoàn tiền, cách ghi nhận doanh thu và thời điểm từng nguồn được cập nhật. Một feature chỉ hợp lệ nếu hệ thống thật sự có dữ liệu đó vào lúc phải phát hành dự báo.

## Đáp án Câu 1 — Định nghĩa bài toán

Target là Revenue của ngày (d). Forecast horizon (H=28) nghĩa là dự báo phải được phát hành trước ngày đích 28 ngày. Vì vậy, Revenue và các biến chỉ quan sát được sau bán hàng chỉ được dùng đến (d-28). Calendar của ngày (d) và promotion đã phê duyệt trước thời điểm phát hành là dữ liệu ngoại sinh biết trước nên có thể dùng.

**Rubric:** target và horizon 2 điểm; cutoff 2 điểm; historical/exogenous 2 điểm.

## Đáp án Câu 2 — Phán quyết feature

| Feature | Phán quyết | Lý do |
|---|---|---|
| Revenue (d-7) | Leakage | Nằm trong 27 ngày chưa xảy ra tại thời điểm phát hành dự báo. |
| Revenue (d-28) | Hợp lệ | Đây là quan sát Revenue mới nhất được phép dùng. |
| Rolling (d-55) đến (d-28) | Hợp lệ | Toàn bộ cửa sổ dừng tại cutoff. |
| COGS thực tế ngày (d) | Leakage | Chỉ biết sau khi hoạt động bán hàng ngày (d) xảy ra. |
| Thứ trong tuần ngày (d) | Hợp lệ | Xác định được từ lịch trước khi dự báo. |
| Promotion đã phê duyệt | Hợp lệ có điều kiện | Chỉ hợp lệ nếu snapshot lịch promotion tồn tại trước lúc phát hành dự báo. |

**Rubric:** 1 điểm cho mỗi phán quyết đúng; tối đa 4 điểm cho lập luận theo availability time.

## Đáp án Câu 3 — Kiểm tra dữ liệu

Với `sales.csv`:

1. Xác nhận tệp có đúng ba cột `Date`, `Revenue` và `COGS`.
2. Bỏ dấu phẩy phân cách hàng nghìn rồi chuyển `Revenue` và `COGS` sang kiểu số. Báo lỗi nếu còn ô không chuyển được, bị thiếu hoặc có giá trị âm không hợp lệ.
3. Tách các giá trị `Date` theo dấu `/` và `-`, sau đó đọc từng nhóm bằng format cụ thể. Bỏ phần giờ sau khi xác nhận dữ liệu chỉ có độ chi tiết theo ngày.
4. Sắp xếp theo ngày, tìm ngày trùng và kiểm tra các dòng trùng có giống nhau hay không.
5. Tạo dải ngày liên tục từ ngày đầu đến ngày cuối để tìm ngày bị thiếu.

Với `promotions.csv`:

1. Xác nhận đủ bốn cột `start_date`, `end_date`, `discount_value` và `applicable_category`.
2. Chuyển `start_date` và `end_date` sang kiểu ngày, sau đó kiểm tra ngày bắt đầu không muộn hơn ngày kết thúc.
3. Chuyển `discount_value` sang kiểu số; kiểm tra giá trị thiếu, giá trị âm và mức giảm vượt phạm vi cho phép.
4. Kiểm tra `applicable_category` không bị thiếu và chỉ chứa các nhóm hàng đã được định nghĩa.
5. Tìm các chương trình bị chồng lấn để xác định rõ cách kết hợp mức giảm trước khi join.

Trước khi EDA, `sales.csv` cần có một dòng duy nhất cho mỗi ngày, ngày được sắp xếp liên tục, còn `Revenue` và `COGS` phải là số và không bị thiếu. `promotions.csv` cần có khoảng ngày hợp lệ và thông tin đầy đủ. Sau khi join, số dòng của chuỗi doanh thu không được tăng ngoài dự kiến và trạng thái promotion của mỗi ngày phải được xác định theo một quy tắc rõ ràng.

**Rubric:** quy trình có thứ tự 5 điểm; validation gate 3 điểm.

## Đáp án Câu 4 — Ngày trùng

Chọn giữ một dòng cho mỗi ngày. Vì hai bản ghi giống hệt nhau, cộng sẽ nhân đôi doanh thu, còn lấy trung bình chỉ tình cờ cho kết quả đúng nhưng che giấu bản chất lỗi duplicate. Sau xử lý cần có 3.833 ngày duy nhất, được sắp xếp và kiểm tra liên tục.

**Rubric:** chọn đúng 2 điểm; giải thích 2 điểm; kiểm tra 3.833 ngày duy nhất và liên tục 2 điểm.

## Đáp án Câu 5 — Cách phát hiện doanh thu bất thường

Dự án dùng Tukey fences. Phương pháp tính khoảng tứ phân vị `IQR = Q3 - Q1`, sau đó đánh dấu các giá trị nằm ngoài khoảng từ `Q1 - 1,5 × IQR` đến `Q3 + 1,5 × IQR`.

**Rubric:** nêu đúng Tukey fences 1 điểm; giải thích đúng Q1, Q3 và IQR 1 điểm.

## Đáp án Câu 6 — Ngày doanh thu bất thường

Không nên xóa cơ học. Việc outlier tập trung quanh giao tháng cho thấy một pattern kinh doanh có cấu trúc, có thể liên quan kỳ lương, chốt doanh số hoặc chiến dịch. Cần so sánh day-of-month, cuối/đầu tháng, tháng, thứ trong tuần, promotion và các năm để xác nhận pattern có lặp lại.

Feature phù hợp gồm day-of-month, reverse day-of-month, khoảng cách đến cuối tháng, cờ giao tháng và interaction với promotion. Quy tắc feature vẫn phải tuân theo information cutoff.

**Rubric:** chính sách giữ outlier 2 điểm; EDA kiểm chứng 2 điểm; feature mapping 2 điểm.

## Đáp án Câu 7 — Feature engineering

**Lag** là giá trị của cùng một biến tại một thời điểm trước đó. Dự án dùng các lag để model nhìn thấy doanh thu gần đây, trung hạn và cùng kỳ năm trước. Ví dụ, khi dự báo Revenue ngày 29/01/2022, `lag_28` là Revenue ngày 01/01/2022. Giá trị này hợp lệ vì dự báo được phát hành trước 28 ngày và chỉ sử dụng thông tin đã có tại thời điểm đó.

**Khai triển Fourier** biểu diễn một chu kỳ phức tạp bằng các sóng sin và cos đơn giản. Trong dự án, ngày thứ `doy` của năm được chuyển thành bốn cặp feature:

`fourier_sin_k = sin(2π × k × doy / 365,25)` và `fourier_cos_k = cos(2π × k × doy / 365,25)`, với `k` từ 1 đến 4.

Ví dụ, cặp `fourier_sin_1` và `fourier_cos_1` đặt mỗi ngày lên một vòng tròn biểu diễn chu kỳ một năm. Vì vậy, ngày 31/12 và 01/01 nằm gần nhau trên vòng tròn, thay vì bị xem là hai số 365 và 1 cách xa nhau. Các cặp còn lại giúp model nhận biết thêm những nhịp ngắn hơn như nửa năm, bốn tháng và một quý.

`safe = y.shift(28)` tạo một nguồn lịch sử mà quan sát mới nhất luôn dừng tại (d-28). Mọi lag và rolling được xây trên `safe` sẽ dễ audit hơn.

`lag_371` của một ngày được lấy từ Revenue cách đó 371 ngày. Ví dụ, nếu dữ liệu bắt đầu từ ngày 01/01/2021 thì chưa thể tính `lag_371` cho ngày này, vì dataset không có dữ liệu của 371 ngày trước đó. Các ngày tiếp theo cũng gặp vấn đề tương tự cho đến khi chuỗi đã tích lũy đủ 371 ngày lịch sử.

Vì vậy, `lag_371` bị thiếu ở 371 dòng đầu tiên. Project loại các dòng này khỏi bảng huấn luyện để model chỉ học từ những dòng đã có đầy đủ giá trị feature, thay vì phải học từ các ô còn trống.

COGS ngày (d) dù tương quan 0,976 với Revenue vẫn không hợp lệ nếu chỉ được quan sát sau ngày bán hàng. Tương quan cao không thay đổi được thời điểm dữ liệu thật sự xuất hiện.

Điều này không có nghĩa phải bỏ toàn bộ COGS. Tại thời điểm dự báo cho ngày (d), COGS của các ngày từ (d-28) trở về trước đã tồn tại. Vì vậy có thể tạo các feature như `cogs_lag_28` hoặc trung bình COGS lịch sử kết thúc tại (d-28), miễn là pipeline vẫn tuân thủ đúng mốc thông tin.

**Rubric:** giải thích lag và ví dụ 2 điểm; giải thích Fourier, mục đích và ví dụ 2 điểm; bốn nhóm feature và safe shift 2 điểm; giải thích 371 ngày đầu 2 điểm; phân biệt COGS cùng ngày với COGS lịch sử 2 điểm.

## Đáp án Câu 8 — Kiểm tra bảng feature

`revenue_lag_7` gây leakage vì Revenue tại \(d-7\) chưa tồn tại khi dự báo phải được phát hành ở \(d-28\). Bốn cột còn lại đều hợp lệ: `revenue_lag_28` và `roll_mean_28_safe` không vượt qua cutoff, còn `day_of_week` và `is_promo` là thông tin biết trước.

**Rubric:** xác định đúng `revenue_lag_7` 1 điểm; giải thích đúng theo mốc \(d-28\) 1 điểm.

## Đáp án Câu 9 — Kiểm tra rò rỉ dữ liệu

Chọn một số ngày kiểm tra (d), tạo feature gốc, rồi sao chép dữ liệu và thay đổi cực mạnh Revenue trong vùng (d-27) đến (d). Tính lại toàn bộ feature lịch sử tại (d). Nếu pipeline đúng, các feature đó phải không đổi vì vùng bị sửa nằm sau cutoff (d-28).

Điều kiện pass có thể là maximum absolute difference bằng 0 hoặc nhỏ hơn numerical tolerance trên toàn bộ feature và ngày kiểm tra. Bất kỳ thay đổi nào cũng là bằng chứng pipeline đã chạm vùng cấm.

**Rubric:** vùng can thiệp 2 điểm; recompute 2 điểm; so sánh 2 điểm; pass/fail tự động 2 điểm.

## Đáp án Câu 10 — Validation theo thời gian

Random split có thể đưa các ngày trong tương lai vào tập train, trong khi khi triển khai thật model chỉ có dữ liệu quá khứ. Expanding-window validation mô phỏng đúng thứ tự này: train bằng các ngày cũ, kiểm tra bằng các ngày mới hơn, rồi mở rộng dần tập train qua từng lần đánh giá.

Model phải dự báo trước 28 ngày, nên cần chừa ít nhất 28 ngày giữa tập train và validation. Nếu đặt hai tập sát nhau, một mẫu ở cuối tập train có thể dùng kết quả nằm trong khoảng thời gian đang được dùng để validation. Khi đó hai tập không còn độc lập và điểm validation có thể tốt hơn thực tế. Khoảng trống được chừa ra này thường được gọi là **purging** hoặc **embargo**.

Nếu quy trình đã quy định chọn model bằng cross-validation, phải giữ XGBoost. Test chỉ được mở một lần để ước lượng chất lượng cuối cùng; đổi sang LightGBM sau khi xem test biến test thành một phần của tuning. Có thể ghi nhận LightGBM như giả thuyết cho vòng thử nghiệm tiếp theo với một holdout mới.

**Rubric:** giải thích random split 2 điểm; expanding window 3 điểm; khoảng cách 28 ngày 2 điểm; quyết định model và cách dùng tập test 3 điểm.

## Đáp án Câu 11 — Baseline và ablation

Không có baseline, stakeholder không biết ML có tạo giá trị hơn quy tắc rẻ, dễ giải thích và dễ vận hành hay không. Hai baseline phù hợp là seasonal naive theo cùng kỳ năm trước và moving average an toàn kết thúc tại (d-28). Có thể thêm last-known-value tại cutoff.

Ablation đo phần cải thiện khi thêm hoặc bỏ cả một nhóm feature trong cùng protocol. Feature importance chỉ mô tả cách model đã fit sử dụng các cột; nó không chứng minh nhóm feature tạo ra cải thiện ngoài mẫu.

**Rubric:** vai trò baseline 2 điểm; hai baseline hợp lệ 3 điểm; phân biệt ablation/importance 3 điểm.

## Đáp án Câu 12 — WAPE và bias

Dữ liệu Revenue lệch phải, có ngày doanh thu cao gấp nhiều lần ngày thấp và có cả giá trị gần 0. RMSE bình phương sai số nên dễ bị một số ngày cực lớn chi phối. MAPE chia sai số cho Revenue từng ngày nên có thể tăng vọt khi Revenue gần 0. WAPE cộng sai số tuyệt đối của toàn bộ giai đoạn rồi chia cho tổng Revenue thực tế, vì vậy ổn định hơn và dễ diễn giải theo quy mô doanh thu.

WAPE 0,2038 nghĩa là tổng sai số tuyệt đối xấp xỉ 20,38% tổng doanh thu thực tế trên test; nó không có nghĩa model dự báo đúng 79,62% số ngày. Bias -0,1181 cho thấy tổng dự báo thấp hơn thực tế khoảng 11,81%, một rủi ro thiếu hàng nếu kết quả được dùng để lập kế hoạch tồn kho. Cải thiện 30,7% so với baseline cho thấy giá trị tương đối, nhưng cần nêu rõ baseline nào được dùng và bảo đảm hai phương pháp được đánh giá trên cùng dữ liệu.

Trước triển khai cần kiểm tra sai số theo thời gian/regime, peak day, promotion và season; kiểm tra interval, drift, inference pipeline và business loss. Test chỉ có 184 ngày nên chưa đủ để tuyên bố thứ hạng model ổn định trên mọi giai đoạn.

**Rubric:** lý do chọn WAPE 2 điểm; diễn giải WAPE 1 điểm; bias 2 điểm; baseline improvement 1 điểm; ít nhất hai kiểm tra hợp lý 2 điểm.

## Đáp án Câu 13 — TreeSHAP

Global SHAP tổng hợp mức đóng góp trên nhiều quan sát để cho biết model thường dựa vào feature nào. Local SHAP giải thích một dự báo cụ thể bằng cách chỉ ra feature nào đẩy dự báo lên hoặc xuống so với base value.

Bốn trong sáu feature hàng đầu quanh lag 364 cho thấy cùng kỳ năm trước là tín hiệu thay thế mạnh khi 27 ngày gần target bị chặn.

Dự án lấy trung bình trị tuyệt đối của SHAP vì cả đóng góp đẩy dự báo lên và kéo dự báo xuống đều thể hiện mức độ model sử dụng feature. Sau đó, mỗi giá trị được chia cho tổng của tất cả feature và đổi sang phần trăm. Cách chuẩn hóa này giúp đọc nhanh một feature chiếm bao nhiêu phần trong tổng mức đóng góp của model và dễ so sánh các feature có thang số khác nhau. Ví dụ, 25,4% của `lag364_smooth7` nghĩa là feature này chiếm 25,4% tổng giá trị SHAP tuyệt đối trung bình trong phép phân tích; nó không có nghĩa feature làm doanh thu tăng 25,4%, giải thích 25,4% biến thiên của Revenue hay giúp model chính xác hơn 25,4%.

Gom feature theo nhóm giúp trả lời câu hỏi ở mức thiết kế: model dựa chủ yếu vào lịch sử doanh thu, lịch, Tết hay khuyến mãi. Tuy nhiên, chỉ nhìn tổng đóng góp có thể thiên vị nhóm chứa nhiều cột. Vì vậy dự án báo cáo cả hai số:

- **Tổng đóng góp của nhóm** cho biết toàn bộ nhóm chiếm bao nhiêu trong cách model đưa ra dự báo.
- **Đóng góp trung bình trên mỗi feature** giúp so sánh công bằng hơn giữa nhóm có 24 cột và nhóm chỉ có 4 cột.

Việc nhóm lịch sử doanh thu đứng đầu ở cả hai cách đo là bằng chứng mạnh hơn so với việc nó chỉ có tổng SHAP lớn do chứa nhiều feature.

Kiểm tra additivity xác nhận:

[
	ext{prediction}_{log} approx 	ext{base value} + sum_{j=1}^{53}	ext{SHAP}_j
]

Sai số chỉ nên ở mức numerical tolerance. SHAP giải thích hành vi của model trên dữ liệu quan sát, không chứng minh rằng thay đổi một feature sẽ gây ra thay đổi doanh thu trong thế giới thật.

**Rubric:** global/local 1 điểm; lag 364 1 điểm; chuyển sang phần trăm và giới hạn diễn giải 2 điểm; gom nhóm và hai cách đo 2 điểm; additivity 1 điểm; giới hạn nhân quả 1 điểm.

## Đáp án Câu 14 — Interval và vận hành

Empirical coverage 92,4% cao hơn mục tiêu 90%, nên interval đạt mục tiêu trên test này. Tuy nhiên, coverage có thể được tăng bằng cách làm khoảng cực rộng; vì vậy phải đọc cùng mean width, business threshold và chi phí của forecast sai.

Nếu miss tập trung ở peak, residual không đồng nhất. Có thể hiệu chỉnh interval theo mức dự báo, season hoặc regime; dùng residual chuẩn hóa; hoặc calibration window gần hơn. Không nên chỉ nới toàn bộ interval để che lỗi model.

Khi interval cắt ngưỡng 5 triệu đồng/ngày, đưa ngày đó vào human-review queue. Reviewer kiểm tra promotion, tồn kho và sự kiện rồi chọn kế hoạch an toàn. Các ngày interval nằm hoàn toàn một phía ngưỡng có thể tự động dùng point forecast hoặc policy đã định.

**Rubric:** coverage 2 điểm; coverage-width trade-off 2 điểm; cải tiến peak 2 điểm; policy review 2 điểm.

## Đáp án câu hỏi mở rộng

### A. Cú giảm doanh thu năm 2019

Nếu trước và sau năm 2019 có mức doanh thu khác nhau rõ rệt, một model học chủ yếu từ giai đoạn cũ có thể dự báo quá cao cho giai đoạn mới. Kết quả của model cũng có thể thay đổi mạnh giữa các lần chia dữ liệu, tùy mỗi tập train chứa bao nhiêu dữ liệu trước năm 2019. Vì vậy cần giữ thứ tự thời gian, đánh giá trên nhiều cửa sổ và báo cáo kết quả riêng cho từng giai đoạn.

Ngoài biểu đồ, có thể dùng phương pháp phát hiện điểm thay đổi như CUSUM hoặc Bai–Perron, đồng thời hỏi team business xem thời điểm đó có thay đổi cửa hàng, sản phẩm, cách ghi nhận doanh thu hay điều kiện thị trường hay không. Nếu quy luật tiếp tục thay đổi sau triển khai, hệ thống cần theo dõi data drift và kích hoạt huấn luyện lại.

### B. Tách mùa vụ khỏi chênh lệch giữa các năm

Nếu một năm có doanh thu cao hơn hẳn và tình cờ chứa nhiều ngày 31, trung bình Revenue của ngày 31 có thể cao chỉ vì ảnh hưởng của năm đó, không phải vì khách hàng thật sự mua nhiều hơn vào cuối tháng. Chia Revenue cho mức trung bình của từng năm đưa các năm về một mặt bằng tương đối trước khi so sánh ngày trong tháng.

Sau khi chuẩn hóa, nếu ngày 31 vẫn cao hơn các ngày khác và pattern lặp lại qua nhiều năm, ta có cơ sở tốt hơn để xem đây là mùa vụ theo vị trí cuối tháng. Đây cũng là lý do dự án tạo feature đếm số ngày còn lại đến cuối tháng thay vì chỉ dùng số ngày 31.

### C. Khuyến mãi không chỉ là có hoặc không

Một cờ `is_promo` không phân biệt flash sale, xả kho, voucher nhỏ, mức giảm giá hay nhóm hàng được áp dụng. Nó cũng bỏ qua việc khách hàng có thể trì hoãn mua trước chương trình và mua ít đi ngay sau chương trình.

Có thể bổ sung loại khuyến mãi, mức giảm, nhóm hàng, số ngày đến lúc bắt đầu, số ngày kể từ khi kết thúc và các cờ tương tác như `is_promo × is_eom` hoặc `is_promo × tet_before`. Khi nhiều chương trình chồng nhau, pipeline phải có quy tắc kết hợp cố định, chẳng hạn lấy mức giảm lớn nhất và chương trình bắt đầu gần nhất, để cùng một dữ liệu luôn tạo ra cùng một feature.

### D. Đưa model vào sử dụng an toàn

Nên chạy model mới ở chế độ song song với quy trình hiện tại trong một khoảng thời gian: model tạo dự báo nhưng chưa tự động điều khiển quyết định tồn kho. Team theo dõi sai số, bias, độ rộng interval và kết quả ở ngày cao điểm trước khi chuyển quyền quyết định.

Nếu pipeline thiếu dữ liệu, dự báo vượt giới hạn hợp lý hoặc model kém baseline trong nhiều kỳ liên tiếp, hệ thống nên quay về quy tắc baseline đã kiểm chứng. Dấu hiệu cần huấn luyện lại gồm phân phối Revenue thay đổi, sai số hoặc bias tăng kéo dài, coverage giảm và quan hệ mùa vụ không còn giống giai đoạn huấn luyện.

---

# PHẦN C — THANG ĐÁNH GIÁ TỔNG THỂ

| Mức | Điểm | Mô tả |
|---|---:|---|
| Xuất sắc | 90–100 | Lập luận theo information cutoff nhất quán; thiết kế kiểm chứng tự động; đọc đúng metric và nối được kết quả với quyết định vận hành. |
| Tốt | 75–89 | Nắm vững pipeline và phần lớn rủi ro; còn thiếu một vài kiểm tra hoặc chưa lượng hóa đầy đủ business impact. |
| Đạt | 60–74 | Hiểu các bước chính nhưng lập luận leakage, validation hoặc metric còn hổng; cần giám sát khi triển khai. |
| Chưa đạt | Dưới 60 | Dùng thông tin tương lai, chọn model bằng test, đọc sai metric hoặc không đưa ra được validation gate có thể kiểm chứng. |

## Critical errors

Dù tổng điểm cao, bài làm cần được xem xét lại nếu mắc một trong các lỗi sau:

- Cho phép Revenue hoặc COGS sau (d-28) đi vào feature lịch sử.
- Dùng random split làm protocol đánh giá chính.
- Đổi model hoặc tuning sau khi đã xem kết quả test cuối.
- Diễn giải SHAP là bằng chứng nhân quả.
- Tuyên bố interval bảo đảm 90% vô điều kiện khi chuỗi có regime shift.

---

*Bản nháp để duyệt nội dung trước khi dàn trang PDF.*

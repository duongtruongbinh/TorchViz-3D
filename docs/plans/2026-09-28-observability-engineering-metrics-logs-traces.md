# AI for IT operations (Part 1)

# Observability Engineering
## Metrics, Logs, and Traces

**Tác giả:** Trần Quang Minh, Nguyễn Mạnh Khiêm

---

# Giới thiệu

Software Engineer và AI Engineer khi xây dựng và đưa ứng dụng vào production không chỉ cần đảm bảo chức năng hoạt động đúng, mà còn phải hiểu hệ thống đang vận hành như thế nào sau khi được triển khai. Một thao tác đơn giản từ người dùng, chẳng hạn đặt hàng hoặc thanh toán, có thể tạo ra một **yêu cầu (request)** đi qua nhiều thành phần (component) như application, service, database, cache, message queue và dịch vụ bên thứ ba trước khi trả lại kết quả cho người dùng.

![Một request đi qua nhiều thành phần, sự cố có thể xảy ra ở bất kì đâu.](images/one_request_distributed_system.pdf)

Vấn đề xuất hiện khi hệ thống bắt đầu phản hồi chậm, tỷ lệ lỗi tăng hoặc một chức năng không còn hoạt động như kỳ vọng. Lúc này, biết rằng "hệ thống đang có vấn đề" vẫn chưa đủ. Kỹ sư cần xác định điều gì đã thay đổi, sự kiện nào liên quan và khu vực nào trong luồng xử lý cần được kiểm tra trước. Để làm được điều đó, hệ thống cần cung cấp đủ thông tin để người kỹ sư có thể quan sát và hiểu những gì đang xảy ra bên trong, và đây chính là vai trò của observability.

Trong thực tế, observability được xây dựng dựa trên các tín hiệu đo lường được (telemetry signals) mà hệ thống phát sinh trong quá trình hoạt động. Theo [OpenTelemetry Observability Primer](https://opentelemetry.io/docs/concepts/observability-primer/), ba loại telemetry phổ biến là Metrics, Logs và Traces.

Tài liệu lựa chọn ba loại dữ liệu này làm trọng tâm vì chúng cung cấp những góc nhìn bổ sung cho nhau và cũng được sử dụng rộng rãi trong thực tế. [Grafana Observability Survey 2025](https://grafana.com/observability-survey/2025/) ghi nhận 95% tổ chức được khảo sát sử dụng metrics, 87% sử dụng logs và 57% sử dụng traces. Do đó, việc hiểu cách sử dụng và kết hợp ba loại telemetry này là một phần quan trọng khi làm việc với production systems.

Từ những nhu cầu thực tế đó, tài liệu được xây dựng để giúp người học và những người đang làm việc với các hệ thống phần mềm hiểu rõ hơn cách quan sát hệ thống, nhận biết khi có dấu hiệu bất thường và từng bước thu hẹp phạm vi điều tra khi sự cố xảy ra.

---

## Thuật ngữ

| Thuật ngữ | Ý nghĩa |
|---|---|
| Application | Ứng dụng hoặc phần mềm đang được vận hành |
| Request | Yêu cầu được gửi đến hệ thống để thực hiện một thao tác |
| Service | Thành phần phần mềm đảm nhiệm một nhóm chức năng |
| Latency | Thời gian cần để xử lý hoặc phản hồi một request |
| Dashboard | Giao diện tập hợp các tín hiệu để theo dõi trạng thái hệ thống |
| Alert | Cảnh báo được tạo khi một điều kiện đã cấu hình được thỏa mãn |
| Threshold | Ngưỡng dùng để xác định khi nào một giá trị cần được chú ý |
| Telemetry | Dữ liệu mà hệ thống tạo ra để mô tả hoạt động của chính nó |
| Metrics | Các giá trị số được ghi nhận theo thời gian |
| Logs | Các bản ghi về những sự kiện đã xảy ra |
| Traces | Dữ liệu mô tả hành trình của một request qua nhiều operation |
| Observability | Khả năng hiểu trạng thái bên trong của hệ thống từ dữ liệu mà nó tạo ra |
| Monitoring | Quá trình theo dõi những tín hiệu và điều kiện đã xác định trước |

# 1. Nền tảng về Observability và tín hiệu hệ thống

## 1.1. Monitoring and Observability

Một ứng dụng vẫn có thể tiếp tục phục vụ người dùng ngay cả khi chất lượng hoạt động bắt đầu giảm. Chẳng hạn, thời gian phản hồi có thể tăng dần trong khi phần lớn yêu cầu vẫn hoàn tất thành công, hoặc lỗi chỉ xuất hiện với một nhóm nhỏ người dùng. Nếu không có cơ chế theo dõi, những thay đổi này có thể kéo dài cho đến khi người dùng bắt đầu phàn nàn hoặc một chức năng bị ảnh hưởng rõ rệt.

Vì vậy, khi hệ thống được đưa vào vận hành, kỹ sư cần theo dõi một số tín hiệu quan trọng theo thời gian để sớm nhận ra khi trạng thái hệ thống lệch khỏi mức bình thường.

### Monitoring là gì?

> **Monitoring:** Là quá trình theo dõi liên tục những tín hiệu và điều kiện đã được xác định trước để đánh giá tình trạng của hệ thống.

Kỹ sư thường bắt đầu bằng những câu hỏi đã biết cần quan tâm, chẳng hạn:

- Dịch vụ có đang hoạt động không?
- Yêu cầu có đang phản hồi chậm hơn bình thường không?
- Tỷ lệ yêu cầu thất bại có tăng không?
- CPU, bộ nhớ hoặc ổ đĩa có đang được sử dụng quá nhiều không?

Từ những câu hỏi này, nhóm kỹ sư lựa chọn dữ liệu cần theo dõi. Các giá trị có thể được hiển thị trên bảng theo dõi để quan sát sự thay đổi theo thời gian. Với những điều kiện cần được chú ý sớm, hệ thống có thể tự động tạo cảnh báo thay vì chờ kỹ sư liên tục kiểm tra bảng theo dõi.

Cảnh báo thường dựa trên một ngưỡng do nhóm kỹ sư xác định. Ví dụ, nếu thời gian phản hồi của một dịch vụ thường duy trì dưới một mức nhất định nhưng sau đó vượt mức này liên tục trong vài phút, hệ thống có thể tạo cảnh báo để kỹ sư kiểm tra.

Ngưỡng này không có một giá trị chung cho mọi hệ thống. Thời gian phản hồi được xem là bình thường hay bất thường phụ thuộc vào chức năng của dịch vụ, trạng thái hoạt động trước đó và yêu cầu mà nhóm kỹ sư đặt ra. Việc yêu cầu điều kiện kéo dài trong một khoảng thời gian cũng giúp tránh tạo cảnh báo chỉ vì những biến động rất ngắn.

Monitoring cũng không nhất thiết phải đợi đến khi ứng dụng hoàn thiện mới được bổ sung. Những tín hiệu cơ bản có thể được xác định trong quá trình phát triển để khi hệ thống được đưa vào vận hành, nhóm kỹ sư đã có đủ thông tin cần thiết để theo dõi trạng thái của nó. Tuy nhiên, mức độ monitoring nên phù hợp với quy mô và nhu cầu thực tế. Một hệ thống nhỏ có thể bắt đầu từ một số tín hiệu quan trọng rồi mở rộng dần khi hệ thống trở nên phức tạp hơn.

### Monitoring ở những lớp nào?

Một yêu cầu có thể đi qua nhiều lớp trước khi được xử lý hoàn tất. Vì vậy, monitoring cũng có thể được thực hiện ở nhiều phạm vi:

1. **Synthetic Monitoring:** mô phỏng định kỳ một hành động của người dùng để kiểm tra một chức năng hoặc luồng sử dụng có hoạt động hay không.
2. **Application Monitoring:** theo dõi cách ứng dụng xử lý yêu cầu, chẳng hạn số lượng yêu cầu, tỷ lệ lỗi và thời gian phản hồi.
3. **Network Monitoring:** theo dõi kết nối và lưu lượng giữa các thành phần.
4. **Infrastructure Monitoring:** theo dõi các tài nguyên như CPU, bộ nhớ, đĩa lưu trữ và network.

![Monitoring theo dõi hệ thống từ hành vi người dùng đến ứng dụng, network và infrastructure.](images/monitoring_across_system.pdf)

Ngoài các lớp trên, kỹ sư cũng cần chú ý đến những thành phần mà hệ thống phụ thuộc vào để hoàn thành yêu cầu. Đó có thể là database, dịch vụ khác hoặc dịch vụ của bên thứ ba. Vì vậy, một dịch vụ vẫn có thể phản hồi chậm hoặc thất bại ngay cả khi tài nguyên của chính nó vẫn ở mức bình thường.

### Observability là gì?

Monitoring giúp kỹ sư nhận biết khi một tín hiệu đã được quan tâm từ trước bắt đầu thay đổi. Bảng theo dõi có thể cho thấy thời gian phản hồi đang tăng, hoặc cảnh báo có thể thông báo rằng tỷ lệ lỗi đã vượt mức được cấu hình.

Tuy nhiên, phát hiện rằng hệ thống đang có vấn đề mới chỉ là điểm bắt đầu. Một thay đổi quan sát được có thể xuất phát từ nhiều khu vực khác nhau trong luồng xử lý. Lúc này, kỹ sư cần tiếp tục đặt những câu hỏi như:

- Yêu cầu nào đang gặp vấn đề?
- Sự kiện gì đã xảy ra tại thời điểm đó?
- Thành phần nào bắt đầu xuất hiện dấu hiệu bất thường?
- Vì sao vấn đề chỉ xảy ra với một số yêu cầu?

Những câu hỏi trên không phải lúc nào cũng có thể xác định trước từ đầu. Trong quá trình điều tra, mỗi thông tin mới có thể dẫn đến một câu hỏi khác. Khả năng sử dụng dữ liệu của hệ thống để tiếp tục khám phá theo cách này chính là Observability.

> **Observability:** Là khả năng sử dụng dữ liệu mà hệ thống tạo ra để hiểu những gì đang xảy ra bên trong, đặc biệt khi nguyên nhân của vấn đề chưa được biết trước.

Điểm quan trọng là quá trình điều tra không nhất thiết chỉ dựa trên những câu hỏi đã được xác định từ đầu. Mỗi thông tin mới có thể dẫn đến một câu hỏi khác, giúp kỹ sư từng bước thu hẹp phạm vi cần kiểm tra.

### Quan hệ giữa Monitoring và Observability

Monitoring và Observability được sử dụng cùng nhau trong quá trình vận hành. Monitoring giúp phát hiện khi một tín hiệu quan trọng bắt đầu thay đổi và tạo điểm bắt đầu cho việc kiểm tra. Từ đó, observability giúp kỹ sư sử dụng dữ liệu liên quan để hiểu sâu hơn những gì đang xảy ra bên trong hệ thống.

![Từ monitoring alert đến quá trình điều tra bằng observability.](images/monitoring_observability.pdf)

Ví dụ, monitoring có thể cho thấy thời gian phản hồi của một dịch vụ đang tăng và tạo cảnh báo khi tình trạng này kéo dài đủ lâu. Từ thời điểm đó, kỹ sư có thể tiếp tục kiểm tra dữ liệu trong cùng khoảng thời gian, tìm những sự kiện liên quan và thu hẹp dần khu vực cần được điều tra.

## 1.2. Metrics, Logs, and Traces

Khi hệ thống xuất hiện dấu hiệu bất thường, kỹ sư thường cần nhiều loại dữ liệu theo dõi, tức những dữ liệu hệ thống ghi nhận trong quá trình hoạt động để hiểu chuyện gì đang xảy ra. Có loại cho biết hệ thống đang thay đổi như thế nào theo thời gian, có loại ghi lại những sự kiện đã xảy ra, và có loại cho thấy một yêu cầu đã đi qua những bước nào.

Ba loại dữ liệu theo dõi thường được sử dụng cho những mục đích này là Metrics, Logs và Traces. Phần này giới thiệu vai trò của từng loại; các chương sau sẽ trình bày chi tiết hơn.

### Metrics

Khi muốn biết trạng thái của hệ thống đang thay đổi như thế nào theo thời gian, kỹ sư cần những giá trị có thể đo lường và so sánh.

> **Metrics:** Là các giá trị số được ghi nhận theo thời gian để phản ánh trạng thái hoặc hành vi của hệ thống.

Metrics có thể được dùng để theo dõi những thay đổi như thời gian phản hồi tăng, tỷ lệ lỗi cao hơn bình thường hoặc mức sử dụng tài nguyên tăng bất thường. Vì được ghi nhận liên tục theo thời gian, Metrics phù hợp để quan sát xu hướng và nhận biết khi một tín hiệu bắt đầu lệch khỏi trạng thái bình thường.

### Logs

Metrics có thể cho thấy một giá trị đang thay đổi, nhưng thường không cho biết cụ thể sự kiện nào đã xảy ra tại thời điểm đó. Khi cần xem lại những sự kiện mà hệ thống ghi nhận trong quá trình hoạt động, kỹ sư sử dụng Logs.

> **Logs:** Là các bản ghi mô tả những sự kiện xảy ra trong quá trình hệ thống hoạt động.

Một bản ghi có thể ghi lại thời điểm xảy ra sự kiện, thành phần tạo ra bản ghi, trạng thái xử lý hoặc thông tin về lỗi. Nhờ đó, kỹ sư có thể xem lại những gì đã xảy ra quanh thời điểm hệ thống bắt đầu có dấu hiệu bất thường.

### Traces

Logs cung cấp thông tin về từng sự kiện, nhưng một yêu cầu có thể đi qua nhiều bước hoặc nhiều thành phần trước khi hoàn tất. Khi cần theo dõi toàn bộ quá trình xử lý của một yêu cầu, kỹ sư sử dụng Traces.

> **Traces:** Mô tả hành trình của một yêu cầu qua các bước xử lý và các thành phần khác nhau trong hệ thống.

Mỗi bước xử lý trong dấu vết thường được biểu diễn bằng một span. Nhờ đó, kỹ sư có thể thấy yêu cầu đã đi qua đâu, mỗi bước mất bao lâu và khu vực nào cần được kiểm tra kỹ hơn khi có vấn đề.

### Liên kết Metrics, Logs và Traces

Ba loại dữ liệu theo dõi trên cung cấp những góc nhìn khác nhau nhưng thường được sử dụng cùng nhau trong quá trình điều tra. Metrics có thể cho thấy một tín hiệu bắt đầu thay đổi, Logs giúp xem những sự kiện xảy ra quanh thời điểm đó, còn Traces giúp theo dõi yêu cầu qua các bước xử lý liên quan.

Việc đối chiếu các dữ liệu có chung ngữ cảnh để hỗ trợ điều tra được gọi là liên kết dữ liệu. Cách kết hợp Metrics, Logs và Traces sẽ được trình bày chi tiết hơn ở Chương 5.

![Metrics, Logs và Traces cung cấp các góc nhìn bổ sung khi quan sát và điều tra hệ thống.](images/correlating_three_pillar.png)

## 1.3. Lựa chọn nội dung cần đo lường

Một hệ thống có thể tạo ra rất nhiều chỉ số, từ mức sử dụng CPU và bộ nhớ đến số lượng yêu cầu, tỷ lệ lỗi và thời gian phản hồi. Nếu theo dõi tất cả chỉ số với cùng mức độ ưu tiên, kỹ sư sẽ khó biết nên bắt đầu từ đâu khi hệ thống xuất hiện vấn đề.

Vì vậy, việc lựa chọn chỉ số nên bắt đầu từ đối tượng cần quan sát. USE Method, Four Golden Signals và RED Method là ba cách tiếp cận phổ biến, mỗi cách tập trung vào một phạm vi khác nhau của hệ thống.

![USE, Four Golden Signals và RED tập trung vào những phạm vi khác nhau và có thể được kết hợp trong quá trình điều tra.](images/USE_GOLDEN_RED_Method.png)

### [USE Method](https://www.brendangregg.com/usemethod.html): Tình trạng tài nguyên

Khi cần kiểm tra tình trạng của CPU, bộ nhớ, thiết bị lưu trữ hoặc network, USE Method tập trung vào ba nhóm tín hiệu:

- **Utilization:** tài nguyên đang được sử dụng ở mức nào.
- **Saturation:** có bao nhiêu công việc đang phải chờ vì tài nguyên chưa thể xử lý kịp.
- **Errors:** các lỗi xảy ra trong quá trình tài nguyên hoạt động.

Ví dụ, với thiết bị lưu trữ, kỹ sư có thể theo dõi tỷ lệ thời gian thiết bị đang thực hiện thao tác đọc hoặc ghi để đánh giá Utilization, số yêu cầu I/O đang phải chờ để đánh giá Saturation và số lỗi đọc ghi để kiểm tra Errors.

Ba tín hiệu này giúp phân biệt một tài nguyên chỉ đang được sử dụng nhiều với trường hợp nó đã bắt đầu không theo kịp lượng công việc cần xử lý.

### [Four Golden Signals](https://sre.google/sre-book/monitoring-distributed-systems): Tình trạng chung của dịch vụ

USE giúp kiểm tra các tài nguyên bên dưới, nhưng trạng thái của tài nguyên chưa phản ánh đầy đủ cách một dịch vụ đang hoạt động. CPU và bộ nhớ có thể vẫn ở mức bình thường trong khi dịch vụ phản hồi chậm hoặc tỷ lệ lỗi bắt đầu tăng. Vì vậy, khi muốn đánh giá tình trạng chung của dịch vụ, Four Golden Signals tập trung vào bốn tín hiệu:

- **Latency:** thời gian cần để xử lý yêu cầu.
- **Traffic (lưu lượng yêu cầu):** lượng yêu cầu mà dịch vụ đang tiếp nhận.
- **Errors:** số lượng hoặc tỷ lệ yêu cầu không được xử lý đúng.
- **Saturation:** mức độ dịch vụ tiến gần giới hạn xử lý.

Latency và Errors phản ánh chất lượng xử lý yêu cầu hiện tại. Traffic cho biết lượng công việc dịch vụ đang tiếp nhận, còn Saturation cho biết dịch vụ còn khả năng xử lý thêm hay đã bắt đầu tiến gần giới hạn.

Saturation ở đây vẫn phản ánh việc hệ thống tiến gần khả năng xử lý tối đa, nhưng được xem ở cấp độ dịch vụ thay vì một thành phần tài nguyên cụ thể như trong USE Method.

### [RED Method](https://grafana.com/blog/the-red-method-how-to-instrument-your-services): Cách xử lý yêu cầu

Four Golden Signals cung cấp góc nhìn tổng thể về tình trạng của dịch vụ. Khi cần đi cụ thể hơn vào cách yêu cầu được xử lý tại từng dịch vụ hoặc điểm cuối, RED Method tập trung vào ba tín hiệu:

- **Rate:** số yêu cầu được xử lý trong một đơn vị thời gian.
- **Errors:** số lượng hoặc tỷ lệ yêu cầu thất bại.
- **Duration (thời gian xử lý):** thời gian cần để xử lý yêu cầu.

Điểm khác biệt chính là RED áp dụng cùng một bộ ba tín hiệu cho từng điểm xử lý yêu cầu. Nhờ đó, kỹ sư có thể so sánh các dịch vụ hoặc điểm cuối và nhận biết nơi nào đang nhận nhiều yêu cầu, nơi nào xuất hiện nhiều lỗi hoặc nơi nào có thời gian xử lý tăng bất thường.

### Mối quan hệ giữa ba phương pháp

Ba phương pháp này không tách rời nhau mà bổ sung cho nhau khi kỹ sư cần nhìn hệ thống ở những mức khác nhau. Một dấu hiệu bất thường ở dịch vụ có thể dẫn đến việc kiểm tra chi tiết hơn cách yêu cầu được xử lý, hoặc ngược lại, một vấn đề ở yêu cầu có thể khiến kỹ sư quay xuống kiểm tra tài nguyên bên dưới.

Trong quá trình đó, Four Golden Signals, RED và USE được sử dụng như những góc nhìn khác nhau để thu hẹp dần khu vực cần kiểm tra. Phương pháp nào được dùng trước không cố định mà phụ thuộc vào dấu hiệu ban đầu và hướng mà quá trình điều tra đang dẫn tới.

## 1.4. Độ tin cậy của dịch vụ với SLI, SLO và Error Budget

Các chỉ số cho biết hệ thống đang hoạt động như thế nào, nhưng một giá trị riêng lẻ chưa cho biết mức hoạt động đó có đáp ứng yêu cầu hay không. Để đánh giá rõ hơn, kỹ sư cần một phép đo phản ánh chất lượng thực tế, một mục tiêu để so sánh và một mức sai lệch được phép chấp nhận.

Ba khái niệm tương ứng là SLI, SLO và Error Budget. SLI phản ánh kết quả thực tế, SLO đặt ra mức mong muốn, còn Error Budget cho biết mức sai lệch được chấp nhận trong khoảng thời gian đã xác định.

![Từ chỉ số, SLI được tính và so sánh với SLO để xác định Error Budget còn lại.](images/sli_slo_eb.png)

### Chuyển chỉ số thành SLI

Các chỉ số ban đầu cung cấp dữ liệu như số yêu cầu thành công và tổng số yêu cầu. Từ những giá trị này, kỹ sư có thể xây dựng một chỉ số đại diện cho chất lượng mà người dùng thực sự nhận được.

> **SLI (Service Level Indicator – chỉ số mức dịch vụ)** là phép đo phản ánh một khía cạnh cụ thể về chất lượng hoạt động của dịch vụ.

Ví dụ, nếu muốn đo tỷ lệ yêu cầu được xử lý thành công:

$$
\mathrm{SLI}
= \frac{\text{Successful Requests}}{\text{Total Requests}}
\times 100\%
$$

Giả sử một dịch vụ xử lý 1.000.000 yêu cầu trong 30 ngày, trong đó 999.200 yêu cầu thành công:

$$
\mathrm{SLI}
= \frac{999{,}200}{1{,}000{,}000} \times 100\%
= 99{,}92\%
$$

Kết quả này phản ánh tỷ lệ yêu cầu thành công thực tế của dịch vụ trong 30 ngày.

### Đặt mục tiêu bằng SLO

Biết SLI bằng 99,92% vẫn chưa đủ để kết luận dịch vụ đang hoạt động tốt hay chưa. Kỹ sư cần một mức mục tiêu để so sánh với kết quả thực tế đó.

> **SLO (Service Level Objective – mục tiêu mức dịch vụ)** là mục tiêu được đặt cho một SLI trong một khoảng thời gian xác định.

Ví dụ:

> Trong 30 ngày, ít nhất 99,9% yêu cầu phải được xử lý thành công.

SLO này sử dụng tỷ lệ thành công của yêu cầu làm SLI và đặt mục tiêu 99,9% trong 30 ngày. Vì SLI thực tế là 99,92%, dịch vụ vẫn đang đáp ứng mục tiêu đã đặt.

### Xác định Error Budget (ngân sách lỗi)

SLO 99,9% không có nghĩa mọi yêu cầu đều phải thành công. Nó cho phép một phần nhỏ yêu cầu không đạt yêu cầu mà dịch vụ vẫn được xem là đáp ứng mục tiêu.

> **Error Budget** là mức sai lệch được phép mà dịch vụ vẫn đáp ứng SLO.

Với SLO 99,9%:

$$
\text{Error Budget} = 100\% - 99{,}9\% = 0{,}1\%
$$

Nếu dịch vụ xử lý 1.000.000 yêu cầu trong 30 ngày, số yêu cầu có thể thất bại trong Error Budget là:

$$
1{,}000{,}000 \times 0{,}1\% = 1{,}000
$$

Nếu thực tế có 800 yêu cầu thất bại, dịch vụ đã sử dụng 80% Error Budget và còn lại mức tương đương 200 yêu cầu trước khi vượt SLO.

## 1.5. Thực hành: Chuẩn bị môi trường

Các bài hướng dẫn về Metrics, Logs và Traces dùng chung bộ công cụ Observability đã được chuẩn bị trong kho mã nguồn và triển khai bằng Docker Compose. Môi trường này chỉ cần thiết lập một lần trước khi tiếp tục với các phần thực hành phía sau. Trong các chương tiếp theo, bộ công cụ này sẽ được sử dụng để thu thập, truy vấn và trực quan hóa Metrics, Logs và Traces bằng từng nhóm công cụ tương ứng.

![Kiến trúc bộ công cụ Observability trong bài hướng dẫn: Prometheus cho Metrics, Alloy và Loki cho Logs, OpenTelemetry và Jaeger cho Traces, còn Grafana dùng để trực quan hóa.](images/observability_stack.pdf)

Bộ công cụ được tổ chức thành ba pipeline chính:

- **Metrics:** điểm cuối cung cấp chỉ số / exporters → Prometheus → Grafana.
- **Logs:** Alloy → Loki → Grafana.
- **Traces:** OpenTelemetry → Jaeger → Grafana.

Sao chép kho mã nguồn và chuyển vào thư mục dự án:

```bash
git clone https://github.com/T-Sunm/observability-to-aiops-lab
cd observability-to-aiops-lab
```

Khởi chạy toàn bộ bộ công cụ:

```bash
docker compose up -d
```

Nếu các dịch vụ cần thiết đều ở trạng thái `Up` hoặc `running`, môi trường đã sẵn sàng và có thể được sử dụng cho các phần thực hành tiếp theo.

# 2. Metrics Collection and Analysis with Prometheus

Một giá trị riêng lẻ chỉ mô tả service tại một thời điểm. Muốn phát hiện traffic, lỗi, latency hoặc mức sử dụng tài nguyên đang thay đổi, engineer cần thu thập và so sánh metrics theo thời gian.

## 2.1. Prometheus and the Metrics Pipeline

Prometheus thực hiện công việc đó qua một pipeline: lấy metrics từ các nguồn đã cấu hình, lưu các sample theo thời gian và cung cấp dữ liệu cho truy vấn.

> **Prometheus:** Là hệ thống monitoring được thiết kế cho dữ liệu time series.

![Prometheus thu thập metrics từ các target, lưu dữ liệu dưới dạng time series và cung cấp chúng cho truy vấn, trực quan hóa và alerting.](images/prometheus_architecture.png)

Prometheus Server quyết định nguồn nào cần được thu thập và thời điểm thực hiện. Grafana và alerting rules sử dụng dữ liệu sau khi Prometheus đã lưu và xử lý.

### Pull-based Metrics Collection

Giả sử một web service cung cấp trạng thái metrics tại:

```text
http://web-service:8000/metrics
```

Prometheus gửi HTTP request đến endpoint này theo chu kỳ và nhận về các giá trị hiện tại.

> **Scrape và target:** Mỗi lần Prometheus lấy metrics từ một endpoint được gọi là một scrape. Endpoint được scrape được gọi là một target.

Application hoặc exporter chịu trách nhiệm tạo nội dung tại `/metrics`. Bài tiếp theo sẽ giải thích hai cách tạo dữ liệu này.

### Targets, `scrape_interval` và trạng thái scrape

Prometheus cần biết địa chỉ của từng target trước khi có thể thu thập dữ liệu. Trong môi trường lab, target có thể được khai báo trực tiếp:

```yaml
scrape_configs:
  - job_name: "demo-app"
    static_configs:
      - targets:
          - "demo-app:8000"
```

`job_name` nhóm các target có cùng vai trò. Địa chỉ `demo-app:8000` nhận diện target cụ thể trong nhóm đó.

Sau khi có danh sách target, Prometheus cần biết bao lâu sẽ scrape một lần:

```yaml
global:
  scrape_interval: 15s
```

Trong lab này, Prometheus cố gắng lấy metrics khoảng 15 giây một lần. `15s` là lựa chọn cấu hình của môi trường thực hành, không phải chu kỳ chung cho mọi hệ thống. Interval ngắn ghi nhận biến động chi tiết hơn nhưng tạo nhiều sample và tăng chi phí xử lý. Interval dài giảm lượng dữ liệu nhưng có thể bỏ qua những biến động ngắn.

Khi lưu sample, Prometheus thường bổ sung hai labels nhận diện nguồn:

```text
job="demo-app"
instance="demo-app:8000"
```

Prometheus cũng tạo metric `up` để ghi lại kết quả của lần scrape gần nhất:

```text
up{job="demo-app", instance="demo-app:8000"}
```

Giá trị `1` nghĩa là lần scrape gần nhất thành công. Giá trị `0` nghĩa là Prometheus không lấy được metrics từ target. Tín hiệu này chỉ xác nhận đường thu thập metrics còn hoạt động. Service vẫn có thể trả `/metrics` trong khi database hoặc dependency của nó đang gặp sự cố.

![Trạng thái scrape của các target trong Prometheus.](images/practice/prometheus_up.png)

### Service Discovery

Khai báo tĩnh phù hợp với lab hoặc hệ thống có ít target ổn định. Trong môi trường động, instance có thể được tạo, thay địa chỉ hoặc bị loại bỏ thường xuyên. Danh sách viết tay khi đó dễ trở nên lỗi thời.

> **Service Discovery:** Giúp Prometheus lấy và cập nhật danh sách target từ Kubernetes, Consul hoặc nền tảng cloud.

Service Discovery thay đổi cách Prometheus tìm target. Sau khi tìm thấy target, Prometheus vẫn thu thập metrics bằng cơ chế pull.

### Short-lived Jobs và Pushgateway

Cơ chế scrape theo chu kỳ giả định target tồn tại đủ lâu để Prometheus kịp truy cập. Một batch job chạy trong 5 giây có thể kết thúc trước lần scrape tiếp theo nếu lab đang dùng `scrape_interval: 15s`.

Với một số batch job ngắn, job có thể gửi metrics đến Pushgateway trước khi kết thúc. Prometheus sau đó scrape Pushgateway như một target tồn tại lâu hơn.

Pushgateway có phạm vi sử dụng hẹp cho các workload kiểu này. Team cần quản lý vòng đời metrics để dữ liệu của job đã kết thúc không tiếp tục xuất hiện như dữ liệu hiện tại.

## 2.2. Exposing Metrics: Application Instrumentation and Exporters

Prometheus đã biết khi nào và ở đâu cần lấy metrics. Endpoint `/metrics` vẫn cần một thành phần tạo ra các giá trị mà Prometheus sẽ đọc. Khi team kiểm soát source code, application có thể tự ghi nhận các sự kiện mà nó hiểu. Khi dữ liệu nằm trong operating system, database hoặc phần mềm có sẵn, một exporter có thể chuyển dữ liệu đó sang dạng Prometheus đọc được.

![Application có thể tự instrument để expose metrics, trong khi exporter chuyển dữ liệu từ các hệ thống có sẵn sang định dạng mà Prometheus có thể thu thập.](images/application_exporter.png)

### Application Instrumentation

Application là nơi hiểu rõ một request đã bắt đầu, hoàn tất hay thất bại. Nó cũng biết một tác vụ đang chờ, mất bao lâu hoặc kết thúc với kết quả nào. Muốn quan sát những tín hiệu này, code cần cập nhật metrics tại các điểm tương ứng trong quá trình xử lý.

> **Application instrumentation:** Là việc bổ sung code hoặc cấu hình để application tạo telemetry trong lúc chạy.

Với Prometheus, application thường dùng client library để định nghĩa metric, cập nhật metric khi sự kiện xảy ra và cung cấp giá trị qua endpoint `/metrics`.

Ví dụ, khi xử lý một HTTP request, application có thể tăng tổng số request, ghi nhận status và đo duration. Những dữ liệu này phản ánh hành vi bên trong application mà operating system không tự biết được.

### Exporters

Nhiều hệ thống đã có dữ liệu vận hành nhưng không cung cấp dữ liệu theo định dạng Prometheus. Operating system có CPU counters và memory statistics. Database hoặc network device có thể cung cấp dữ liệu qua API, system files hoặc giao thức riêng.

> **Exporter:** Đọc dữ liệu từ một hệ thống có sẵn, chuyển các giá trị cần thiết thành Prometheus metrics và expose chúng cho Prometheus scrape.

Node Exporter là một ví dụ. Nó đọc dữ liệu do Linux hoặc Unix cung cấp và tạo các metrics như:

```text
node_cpu_seconds_total
node_memory_MemAvailable_bytes
node_filesystem_avail_bytes
```

Dù metrics đến từ application hay exporter, endpoint vẫn phải trả về một format mà Prometheus có thể parse.

### Prometheus Exposition Format

Một endpoint metrics có thể trả về:

```text
# HELP http_requests_total Total number of HTTP requests.
# TYPE http_requests_total counter
http_requests_total{service="demo-app",status="200"} 15230
```

Hai dòng đầu cung cấp metadata:

- `# HELP` mô tả metric.
- `# TYPE` khai báo loại metric.

Dòng cuối là sample mà Prometheus lưu:

```text
metric_name{labels} value
```

Trong ví dụ trên, metric có tên `http_requests_total`, hai labels mô tả service và HTTP status, còn `15230` là giá trị tại thời điểm scrape. Prometheus gắn thêm timestamp khi lưu sample.

![Endpoint `/metrics` cung cấp metadata và các metric sample theo Prometheus exposition format.](images/practice/prometheus_metrics_endpoint.pdf)

### Metric Naming Convention

Tên metric nên cho biết đại lượng và đơn vị đang được đo. Một số suffix thường gặp gồm:

- `_total` cho giá trị tích lũy kiểu Counter, chẳng hạn `http_requests_total`.
- `_seconds` cho thời gian tính bằng giây.
- `_bytes` cho dung lượng tính bằng byte.

Đây là naming conventions giúp người đọc nhận ra ý nghĩa của metric. Chúng không thay thế phần mô tả `HELP` hoặc tài liệu của metric.

## 2.3. Prometheus Time-Series Data Model

Mỗi lần scrape chỉ tạo ra một tập giá trị tại một thời điểm. Prometheus giữ lại các lần đo liên tiếp để engineer có thể quan sát thay đổi, tính tốc độ tăng và so sánh các khoảng thời gian.

### Metric Samples và Time Series

Giả sử Prometheus đọc cùng một metric ba lần:

```text
10:00:00  http_requests_total{status="200"}  120
10:00:15  http_requests_total{status="200"}  126
10:00:30  http_requests_total{status="200"}  135
```

Mỗi dòng là một sample gồm timestamp và value. Các sample có cùng metric name và cùng label set tạo thành một time series.

> **Time series:** Được nhận diện bởi metric name cùng toàn bộ labels đi kèm.

![Mỗi lần scrape tạo ra một sample gồm timestamp và value. Các sample được thu thập liên tục theo thời gian sẽ hình thành một time series.](images/metric_samle_timeseries.png)

Thay đổi một label value sẽ tạo ra series khác:

```text
http_requests_total{method="GET",status="200"}
http_requests_total{method="POST",status="200"}
http_requests_total{method="POST",status="500"}
```

Ba dòng trên thuộc ba time series, dù dùng cùng metric name.

### Labels

Một metric name cho biết đại lượng đang được đo. Labels cho phép chia đại lượng đó theo những chiều cần phân tích:

```text
http_requests_total{
  service="demo-app",
  endpoint="/checkout",
  status="500"
}
```

Trong sample này, `service` xác định service, `endpoint` xác định nơi xử lý request và `status` phân biệt kết quả.

Application hoặc exporter thường tạo các labels mô tả dữ liệu. Prometheus có thể bổ sung `job` và `instance` để nhận diện nguồn scrape. PromQL dùng những labels này để lọc và tổng hợp series.

### Cardinality

Labels giúp đặt nhiều góc nhìn lên cùng một metric, nhưng mỗi tổ hợp label values xuất hiện trong dữ liệu đều tạo thêm một time series.

> **Cardinality:** Là số lượng time series khác nhau được tạo bởi metric name và các tổ hợp label values.

Nếu dữ liệu có 20 endpoint, 5 status code, 10 instance và 3 environment, số tổ hợp tối đa có thể đạt:

$$
20 \times 5 \times 10 \times 3 = 3{,}000
\text{ time series}.
$$

Con số 3.000 là upper bound khi mọi giá trị có thể kết hợp với nhau. Số series thực tế phụ thuộc vào những tổ hợp thực sự xuất hiện.

Các giá trị gần như luôn khác nhau, chẳng hạn `request_id`, email hoặc timestamp, có thể tạo một series mới cho gần như mỗi event. Số series lớn làm tăng memory, storage và chi phí query. Labels vì thế nên mô tả những chiều có tập giá trị tương đối ổn định và hữu ích cho việc lọc hoặc tổng hợp.

## 2.4. Hands-on: From Raw Metrics to Operational Signals with PromQL

Prometheus đang lưu các time series thô như tổng request tích lũy, lượng memory hiện tại và số observations trong các latency buckets. Những giá trị này cần được lọc và tính toán trước khi có thể trả lời các câu hỏi như traffic bao nhiêu, tỷ lệ lỗi thế nào hoặc P95 latency là bao lâu.

> **PromQL:** Là ngôn ngữ truy vấn dùng để chọn, lọc và tổng hợp time series trong Prometheus.

Trong bài thực hành này, mỗi query bắt đầu từ một câu hỏi vận hành và được chạy trực tiếp trên Prometheus. Với các phép tính `rate()`, cửa sổ `[5m]` sử dụng những sample được thu thập trong năm phút gần nhất.

### Prometheus có còn thu thập được dữ liệu không?

Query sử dụng metric `up` từ bài Prometheus pipeline để kiểm tra target của demo application:

```promql
up{job="demo-app", instance="demo-app:8000"}
```

![Truy vấn trạng thái scrape của demo application bằng metric `up`.](images/practice/prometheus_target_health.png)

Kết quả `1` xác nhận lần scrape gần nhất thành công. Application health sẽ được quan sát qua các signal ở những bước tiếp theo. Khi Prometheus đã thu thập được dữ liệu, câu hỏi tiếp theo là service đang xử lý bao nhiêu traffic.

### Service đang nhận bao nhiêu traffic?

`app_requests_total` tăng mỗi khi demo application xử lý xong một request. Giá trị này cho biết tổng số request đã ghi nhận, nhưng chưa cho biết request đang đến nhanh như thế nào.

> **Counter:** Lưu một giá trị tích lũy thường tăng theo thời gian và có thể trở về điểm bắt đầu khi process restart.

`rate()` sử dụng mức tăng của Counter trong cửa sổ năm phút để tính Request Rate:

```promql
sum(rate(app_requests_total{endpoint="/checkout"}[5m]))
```

![Request Rate trung bình của demo application đối với checkout request trong cửa sổ 5 phút.](images/practice/counter_to_request_rate.png)

Trong dữ liệu đang quan sát, kết quả `0.04` tương ứng trung bình khoảng `0.04` checkout request mỗi giây trong năm phút gần nhất. Để tính tỷ lệ request lỗi, query tiếp theo tiếp tục lọc Counter theo label `status`.

### Bao nhiêu request đang thất bại?

Cùng Counter có label `status`, nên query sau tách request 5xx khỏi tổng traffic:

```promql
sum(rate(app_requests_total{endpoint="/checkout",status=~"5.."}[5m]))
/
sum(rate(app_requests_total{endpoint="/checkout"}[5m]))
```

![Tỷ lệ request kết thúc bằng HTTP status 5xx trong cửa sổ 5 phút.](images/practice/counter_to_error_rate.png)

Kết quả `0.1667` tương ứng `16.67%`: 2 trong 12 checkout request kết thúc bằng HTTP 5xx.

### CPU đang được sử dụng bao nhiêu?

`node_cpu_seconds_total` tích lũy thời gian CPU dành cho từng mode. Query sau tính tốc độ tăng của thời gian `idle`, lấy trung bình theo instance rồi đổi phần còn lại thành phần trăm CPU đang sử dụng:

```promql
100 * (
  1 - avg by (instance) (
    rate(node_cpu_seconds_total{mode="idle"}[5m])
  )
)
```

![CPU usage theo từng core và CPU usage trung bình theo instance sau khi aggregate.](images/practice/counter_to_cpu_usage.pdf)

Kết quả cho thấy từng core sử dụng khoảng `2.3%` đến `2.5%` CPU, còn mức trung bình của instance là khoảng `2.4%`. CPU time là giá trị tích lũy nên query cần `rate()`. Memory mô tả trạng thái hiện tại nên sử dụng Gauge.

### Memory hiện đang được sử dụng bao nhiêu?

Memory được cấp phát khi application cần và được giải phóng khi không còn sử dụng, nên lượng memory hiện tại có thể tăng hoặc giảm giữa hai lần scrape. Một giá trị chỉ tăng như Counter không thể biểu diễn trạng thái này.

> **Gauge:** Lưu giá trị hiện tại của một đại lượng có thể tăng hoặc giảm.

Node Exporter cung cấp tổng memory và phần còn khả dụng:

```text
node_memory_MemTotal_bytes
node_memory_MemAvailable_bytes
```

Phần memory đang sử dụng được ước tính bằng:

```promql
100 * (
  1 - node_memory_MemAvailable_bytes
      / node_memory_MemTotal_bytes
)
```

![Tỷ lệ memory đang được sử dụng trên từng host.](images/practice/gauge_to_mem_usage.pdf)

Kết quả cho thấy host đang sử dụng khoảng `16%` memory. CPU và memory mô tả trạng thái tài nguyên, còn latency cho biết request mất bao lâu để hoàn thành.

### Phần lớn request phải chờ bao lâu?

Một giá trị latency đơn lẻ không đại diện cho trải nghiệm của nhiều request. Ta cần giữ lại phân phối để biết phần lớn request nằm ở vùng nhanh hay chậm.

> **Histogram:** Đếm observations vào các bucket có ngưỡng xác định trước. Nó cũng cung cấp tổng số observations qua `_count` và tổng giá trị qua `_sum`.

Với classic histogram, `_bucket` dùng label `le` để biểu diễn số observations nhỏ hơn hoặc bằng từng ngưỡng. P95 có thể được ước tính từ các bucket:

```promql
histogram_quantile(
  0.95,
  sum by (le) (
    rate(app_request_latency_seconds_bucket{
      endpoint="/checkout"
    }[5m])
  )
)
```

![P95 request latency của demo application trong cửa sổ 5 phút.](images/practice/p95_request_latency.pdf)

P95 được ước tính khoảng `0.98` giây. Điều này nghĩa là khoảng 95% request trong cửa sổ quan sát hoàn thành trong không quá `0.98` giây.

### Vì sao không lấy trung bình P95 của các instance?

Query trên tính P95 từ phân phối của các request. Khi service có nhiều instance, không thể thay bước aggregate bằng cách lấy trung bình các giá trị P95 riêng lẻ. Giả sử hai instance báo cáo:

- `demo-app-1`: 1.000 request, P95 = 0.4 giây.
- `demo-app-2`: 20 request, P95 = 1.0 giây.

Trung bình hai giá trị là `0.7` giây, nhưng phép tính đó trao trọng số ngang nhau cho hai instance dù lượng request rất khác nhau.

Histogram giữ bucket counts để Prometheus có thể gộp phân phối trước khi tính percentile. Summary tính quantile tại application, nên các quantile đã xuất ra thường không thể được aggregate thành percentile chính xác cho toàn service.

![Histogram giữ phân phối dưới dạng bucket để Prometheus tính percentile khi query, trong khi Summary tính quantile ngay tại application trước khi expose metrics.](images/practice/prometheus_histogram_summary.png)

### Service đáp ứng tiêu chí thành công ở mức nào?

Error Rate ở phần trước tập trung vào request 5xx. Query này xem request trả HTTP 2xx là thành công và dùng cùng Counter để tính Availability SLI trong năm phút gần nhất.

```promql
sum(rate(app_requests_total{endpoint="/checkout",status=~"2.."}[5m]))
/
sum(rate(app_requests_total{endpoint="/checkout"}[5m]))
```

![Availability SLI được tính từ tỷ lệ successful requests trên total requests.](images/practice/prometheus_sli.png)

Kết quả `0.8333` nghĩa là 10 trong 12 checkout request thành công, tương ứng khoảng `83.33%`.

### Operational Signals Overview

| Operational Signal | Dữ liệu đầu vào | Cách xử lý | Câu hỏi được trả lời |
|---|---|---|---|
| Target Health | `up` | Lọc theo `job` và `instance` | Prometheus có scrape được target không? |
| Request Rate | Counter | Tính tốc độ tăng và aggregate | Service đang nhận bao nhiêu traffic? |
| Error Rate | Counter | Lọc lỗi rồi chia cho tổng request | Tỷ lệ request thất bại là bao nhiêu? |
| CPU Usage | Counter | Tính rate của CPU time | CPU đang được sử dụng ở mức nào? |
| Memory Usage | Gauge | Tính từ total và available memory | Bao nhiêu memory đang được sử dụng? |
| P95 Latency | Histogram | Tính quantile từ buckets | Khoảng 95% request hoàn thành trong bao lâu? |
| Availability SLI | Counter | Chia successful requests cho total requests | Service đạt tiêu chí thành công ở mức nào? |

## 2.5. Visualizing Metrics with Grafana

PromQL trả lời từng câu hỏi riêng lẻ. Khi điều tra một thay đổi, engineer thường cần đặt traffic, error rate, latency và resource usage trong cùng một time range để xem chúng thay đổi vào thời điểm nào. Grafana sử dụng Prometheus làm data source và biểu diễn các query này thành dashboard.

### Connecting Grafana to Prometheus

Trong môi trường lab, mở Grafana tại [http://localhost:3000](http://localhost:3000) và đăng nhập bằng tài khoản `admin` với mật khẩu `grafana`. Sau đó cấu hình Prometheus làm data source.

![Prometheus được cấu hình làm data source trong Grafana.](images/practice/prometheus_data_sources.pdf)

### Building the Metrics Dashboard

Tạo một dashboard mới, thêm panel và chọn Prometheus làm data source. Với panel đầu tiên, sử dụng query Request Rate:

```promql
sum(rate(app_requests_total{endpoint="/checkout"}[5m]))
```

Chọn Time series, đặt tên panel là *Request Rate* và dùng đơn vị requests per second.

![Xây dựng panel Request Rate bằng PromQL và Time series visualization.](images/practice/grafana_request_rate.pdf)

Các query còn lại được thêm theo cùng quy trình:

| Panel | PromQL | Visualization | Unit |
|---|---|---|---|
| Request Rate | `sum(rate(app_requests_total{endpoint="/checkout"}[5m]))` | Time series | req/s |
| Error Rate | `sum(rate(app_requests_total{endpoint="/checkout",status=~"5.."}[5m])) / sum(rate(app_requests_total{endpoint="/checkout"}[5m]))` | Stat | Percent (0–1) |
| P95 Latency | `histogram_quantile(0.95, sum by (le) (rate(app_request_latency_seconds_bucket{endpoint="/checkout"}[5m])))` | Time series | seconds |
| CPU Usage | `100 * (1 - avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])))` | Time series | Percent (0–100) |
| Memory Usage | `100 * (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)` | Time series | Percent (0–100) |
| Availability SLI | `sum(rate(app_requests_total{endpoint="/checkout",status=~"2.."}[5m])) / sum(rate(app_requests_total{endpoint="/checkout"}[5m]))` | Stat | Percent (0–1) |

![Dashboard tập hợp các operational signals của demo application trên cùng một giao diện.](images/practice/grafana_dashboard.png)

Dashboard cho phép đối chiếu các signal trong cùng một khoảng thời gian. Chẳng hạn, engineer có thể kiểm tra error rate có tăng cùng lúc với traffic, latency hoặc resource usage hay không. Những quan sát này giúp thu hẹp hướng điều tra. Chúng chưa đủ để tự xác định nguyên nhân.

# 3. Logs with Loki and Alloy

## 3.1. From Metrics to Logs

Ở Chương 2, Prometheus và Grafana đã giúp engineer theo dõi các operational signals như Request Rate, Error Rate, P95 Latency, CPU Usage, Memory Usage và Availability SLI. Những tín hiệu này giúp phát hiện khi trạng thái của hệ thống bắt đầu thay đổi.

Tuy nhiên, Metrics chủ yếu phản ánh trạng thái tổng hợp của hệ thống theo thời gian. Khi dashboard cho thấy checkout service đang có tỷ lệ lỗi tăng, thông tin đó chưa cho biết sự kiện cụ thể nào đã xảy ra trong quá trình application xử lý request.

Để trả lời câu hỏi *What happened?*, engineer cần kiểm tra logs.

Trong một application gồm nhiều service và container, logs có thể được tạo ra ở nhiều thành phần khác nhau. Vì vậy, logs thường được đưa về một hệ thống centralized logging, nơi dữ liệu từ nhiều nguồn có thể được tìm kiếm và truy vấn tập trung.

![Logs từ nhiều application service và container được Alloy thu thập, chuyển đến Loki để lưu trữ và sau đó được truy vấn tập trung bằng Grafana.](images/centralized_logging.png)

## 3.2. Understanding Log Data

Trước khi logs được thu thập và lưu trữ tập trung, cần hiểu log được biểu diễn dưới dạng nào và những thông tin nào giúp quá trình tìm kiếm, phân tích và điều tra sự cố hiệu quả hơn. Hai cách biểu diễn phổ biến là **unstructured logging** và **structured logging**.

![Cùng một sự kiện có thể được ghi dưới dạng một chuỗi text hoặc được tổ chức thành các field có cấu trúc.](images/log_representation.png)

### Unstructured and Structured Logs

Một **unstructured log** ghi thông tin của sự kiện dưới dạng một chuỗi text tự do.

```text
2026-08-17 10:05:23 ERROR checkout Database connection timeout
```

Ngược lại, **structured log** tổ chức cùng thông tin thành các field có cấu trúc rõ ràng, thường sử dụng format như JSON hoặc key-value.

```json
{
  "timestamp": "2026-08-17T10:05:23Z",
  "level": "ERROR",
  "service_name": "checkout",
  "trace_id": "7f31a9",
  "message": "Database connection timeout"
}
```

Khi mỗi thuộc tính được biểu diễn thành một field riêng, hệ thống có thể parse, filter và query từng field trực tiếp thay vì phải suy luận cấu trúc từ một chuỗi text.

Cần phân biệt **metadata đi kèm log** với **cấu trúc của nội dung log**. Một log dạng text vẫn có thể được gắn thêm thông tin như `service="payment"` hoặc `environment="prod"` để cho biết log đến từ đâu. Tuy nhiên, nếu nội dung vẫn là `Payment failed for user 123, order ORD-456`, thì đây vẫn là unstructured log.

### Log Levels and Metadata

Một số field thường gặp gồm:

| Field | Vai trò |
|---|---|
| `timestamp` | Xác định thời điểm sự kiện xảy ra |
| `level` | Biểu thị mức độ nghiêm trọng của sự kiện |
| `service_name` | Xác định service tạo ra log |
| `trace_id` | Liên kết log với request hoặc trace tương ứng |
| `message` | Mô tả sự kiện đã xảy ra |

Các log level phổ biến:

- `DEBUG`: cung cấp thông tin chi tiết về quá trình thực thi.
- `INFO`: ghi nhận các hoạt động bình thường của hệ thống.
- `WARN`: biểu thị tình huống bất thường hoặc cần chú ý.
- `ERROR`: cho biết một operation hoặc quá trình xử lý đã gặp lỗi.

Ví dụ:

```json
{
  "timestamp": "2026-08-17T10:05:23Z",
  "level": "ERROR",
  "service_name": "checkout",
  "trace_id": "7f31a9",
  "message": "Database connection timeout"
}
```

Từ các field này, ta có thể thu hẹp dữ liệu theo `service_name`, khoảng thời gian và `level`, sau đó sử dụng `trace_id` nếu cần tiếp tục điều tra request liên quan.

## 3.3. Collecting Logs with Grafana Alloy

Trong logging architecture ở phần trước, Grafana Alloy đóng vai trò collector giữa log source và Loki. Alloy nhận log từ các source được cấu hình, có thể xử lý hoặc bổ sung metadata, sau đó forward các log entries đến Loki.

Một Alloy configuration thường xác định ba phần chính:

- **Source** xác định nơi log được lấy vào.
- **Processing** thực hiện các bước xử lý hoặc bổ sung metadata khi cần.
- **Output** xác định nơi log được gửi đến.

### Alloy Configuration

Trong repository, Alloy configuration đã được chuẩn bị sẵn để thu thập container logs và gửi chúng đến Loki.

Hai field quan trọng cần chú ý là:

- `targets`: xác định danh sách target mà component sử dụng làm input.
- `forward_to`: xác định receiver của component tiếp theo sẽ nhận log entries.

`discovery.docker` tìm các Docker containers đang chạy. Kết quả discovery được chuyển sang `discovery.relabel`, nơi chỉ các containers có label `observability.logs="true"` được giữ lại và Docker label `service` được chuyển thành label `service` để phục vụ truy vấn logs.

Các targets sau khi được lọc được chuyển đến `loki.source.docker` để thu thập container logs. Log entries sau đó đi qua `loki.process`, nơi bổ sung label tĩnh `source="docker"`, trước khi `loki.write` gửi dữ liệu đến Loki.

![Các component và data flow trong Alloy configuration từ Docker discovery đến Loki.](images/practice/alloy_config.pdf)

## 3.4. Storing Logs with Loki

Sau khi Alloy thu thập và forward log entries, dữ liệu được gửi đến Loki để tổ chức, lưu trữ và phục vụ truy vấn.

### Loki Overview

Loki là hệ thống log aggregation nhận log từ các collector như Alloy và cung cấp dữ liệu cho các công cụ truy vấn hoặc visualization. Grafana có thể sử dụng Loki như một data source để tìm kiếm log bằng LogQL và hiển thị kết quả trong Explore hoặc dashboard.

| Prometheus | Loki |
|---|---|
| Metrics | Logs |
| Time series | Log streams |
| PromQL | LogQL |
| Labels xác định series | Labels xác định streams |
| Numeric samples | Log entries |

Một điểm quan trọng là Loki sử dụng labels để xác định phạm vi log cần truy vấn thay vì index toàn bộ nội dung của từng log entry.

### Labels and Log Streams

Trong Loki, labels là các cặp key-value dùng để mô tả nguồn hoặc context của log. Những log entries có cùng một label set được nhóm vào cùng một log stream.

```text
{service_name="checkout", environment="prod"}
```

![Loki sử dụng labels để nhóm các log entries có cùng context vào một log stream.](images/label_log_stream.png)

Ví dụ, cùng một stream có thể chứa:

```text
10:05:21  INFO   Checkout request received
10:05:23  ERROR  Database connection timeout
10:05:25  INFO   Request completed
```

### Choosing Loki Labels

Không phải mọi field xuất hiện trong log đều nên trở thành label. Khi một giá trị được dùng làm label, mỗi combination khác nhau của label values có thể tạo ra một log stream mới.

Các field có số lượng giá trị tương đối nhỏ và ổn định như `service_name`, `environment` hoặc `container` thường phù hợp hơn để làm labels. Ngược lại, những field thay đổi gần như theo từng request như `trace_id`, `request_id`, `user_id` hoặc `timestamp` thường có high cardinality và không nên được dùng làm labels.

Ví dụ:

```text
{service_name="checkout", trace_id="a123"}
{service_name="checkout", trace_id="b456"}
{service_name="checkout", trace_id="c789"}
```

Điều đó không có nghĩa `trace_id` không nên xuất hiện trong log. Field này vẫn có thể được giữ trong structured log:

```json
{
  "level": "ERROR",
  "service_name": "checkout",
  "trace_id": "7f31a9",
  "message": "Database connection timeout"
}
```

## 3.5. Hands-on: Investigating Checkout Errors with LogQL

Phần này thực hành sử dụng Grafana Explore và LogQL để điều tra lỗi của service checkout.

### Open Logs in Grafana Explore

Mở Grafana Explore và chọn Loki làm data source. Sau đó đặt time range trùng với incident window đã xác định từ metrics.

![Grafana Explore được cấu hình để truy vấn Loki trong khoảng thời gian xảy ra sự cố.](images/practice/loki_explore.pdf)

### Select the Checkout Log Stream

```logql
{source="docker", service="demo-app"}
```

![Log entries của `demo-app` được trả về sau khi chọn stream bằng các labels `source` và `service`.](images/practice/loki_demo_app_log.png)

### Filter Relevant Log Lines

```logql
{source="docker", service="demo-app"} |= "ERROR"
```

Operator `|=` giữ lại các log lines chứa chuỗi được chỉ định.

![Kết quả sau khi sử dụng line filter để giữ các log lines chứa `ERROR`.](images/practice/loki_line_filter.png)

### Parse Structured Logs

```logql
{source="docker", service="demo-app"} | json
```

LogQL hỗ trợ nhiều parser như `json`, `logfmt`, `pattern` và `regexp`.

![Các field được trích xuất từ structured log bằng JSON parser trong Grafana Explore.](images/practice/loki_parse_json.png)

### Filter ERROR Logs by Field

```logql
{source="docker", service="demo-app"}
| json
| level = "ERROR"
```

![Các log entries có `level="ERROR"` trong incident window.](images/practice/loki_filter_error.png)

### Inspect the Error Context

Với event `payment_returned_error`, các field như `dependency`, `dependency_status_code`, `error_type`, `span_id` và `trace_id` cung cấp thêm context về dependency và request đang gặp lỗi.

![Các field của event `payment_returned_error` được mở rộng trong Grafana Explore.](images/practice/loki_error_context.png)

### Create a Numeric Signal from Logs

```logql
sum by (status_code) (
  count_over_time(
    {source="docker", service="demo-app"}
    | json
    | event = "http_request" [30s]
  )
)
```

`count_over_time` đếm số log entries phù hợp xuất hiện trong 30 giây gần nhất. `sum by (status_code)` sau đó nhóm kết quả theo HTTP status code.

![Số HTTP request log entries được nhóm theo `status_code` trong cửa sổ 30 giây.](images/practice/loki_error_count.png)

### Add the Query to a Logs Panel

```logql
{source="docker", service="demo-app"}
| json
| level = "ERROR"
```

![ERROR log entries được hiển thị trong Grafana Logs panel.](images/practice/loki_error_panel.pdf)

# 4. Traces with OpenTelemetry and Jaeger

## 4.1. From Logs to Distributed Tracing

Trong distributed system, nơi một lỗi được quan sát thấy chưa chắc là nơi lỗi bắt đầu. Một request `/checkout` có thể trả về HTTP 502 tại `demo-app`, nhưng nguyên nhân thực tế có thể nằm ở downstream service hoặc external dependency mà request đã gọi trong quá trình xử lý. Distributed Tracing cung cấp góc nhìn end-to-end để theo dõi cùng một request xuyên qua các thành phần này và thu hẹp operation liên quan đến latency hoặc failure.

### From Logs to Traces

Một ERROR log có thể cho thấy `demo-app` nhận lỗi từ `payment-service`:

```json
{
  "timestamp": "2026-08-17T10:07:23Z",
  "level": "ERROR",
  "service_name": "demo-app",
  "event": "payment_returned_error",
  "dependency": "payment-service",
  "dependency_status_code": 503,
  "trace_id": "36d93135e7060605138103542feda29"
}
```

Log entry này cho biết lỗi được ghi nhận tại `demo-app` trong lúc gọi `payment-service`. Tuy nhiên, thông tin đó chưa đủ để kết luận `payment-service` là nơi failure bắt đầu.

Trong troubleshooting:

- **Victim:** component chịu ảnh hưởng và là nơi symptom được quan sát thấy.
- **Culprit:** component khởi phát hoặc đóng góp chính vào failure.

![Một failure tại downstream dependency có thể được truyền ngược qua request path và biểu hiện thành lỗi tại upstream service.](images/victim_culprit.pdf)

`trace_id` xuất hiện trong log trở thành identifier để tìm đúng request trong tracing system và quan sát execution path của nó xuyên qua nhiều service.

### Trace and Span

Một Trace biểu diễn toàn bộ execution của một request từ lúc bắt đầu đến khi hoàn tất. Mỗi Span biểu diễn một operation cụ thể bên trong trace.

![Distributed trace của request `GET /checkout` với các spans trên request path.](images/distributed_trace.pdf)

Trong ví dụ này, toàn bộ `/checkout` mất khoảng 1.82 s, trong khi nhánh `payment-service` chiếm 1.61 s và outbound call đến external payment API mất 1.55 s.

Một span có duration lớn hoặc trạng thái lỗi chưa tự động đồng nghĩa với root cause. Trace trước hết giúp localize nơi latency hoặc failure tập trung trên request path.

### Trace ID, Span ID, and Span Attributes

| Field | Ý nghĩa |
|---|---|
| `trace_id` | Nhận diện toàn bộ trace của request |
| `span_id` | Nhận diện một operation cụ thể trong trace |
| `duration` | Thời gian operation thực thi |
| `status` | Trạng thái của operation |
| `attributes` | Metadata mô tả context của operation |

Ví dụ HTTP span attributes:

```text
service.name = payment-service
http.request.method = POST
http.response.status_code = 503
server.address = payment-provider
```

## 4.2. Trace Relationships and Context Propagation

Hai khái niệm chính để duy trì cấu trúc trace là *parent-child relationship* và *trace context propagation*.

### Parent-Child Relationships

Khi một operation tạo ra một operation khác trong cùng request, span của operation phía trước được xem là *parent span*, còn span được tạo ra từ nó là *child span*. Span bắt đầu trace và không có parent span bên trong trace đó được gọi là *root span*.

![Quan hệ parent-child giữa các spans trong cùng một trace.](images/trace_parent_child.pdf)

### Trace Context Propagation Across Services

Khi request đi từ một operation sang một service khác, request cần mang theo *trace context* để downstream service có thể tiếp tục trace hiện tại thay vì tạo một trace độc lập.

Quá trình này có thể hiểu theo bốn bước:

1. Request `GET /checkout` đang được xử lý trong một span.
2. Khi processing cần gọi `payment-service`, trace context được gắn vào outbound request.
3. `payment-service` đọc Trace ID và thông tin về span phía upstream.
4. `payment-service` tạo span mới với Span ID riêng nhưng vẫn sử dụng cùng Trace ID.

W3C Trace Context định nghĩa một format chung cho việc truyền trace identity, trong đó header `traceparent` chứa các thông tin cần thiết để tiếp tục trace.

![Cấu trúc của header `traceparent` trong W3C Trace Context.](images/traceparent_structure.pdf)

Header `traceparent` gồm bốn phần theo thứ tự `version`, `trace-id`, `parent-id` và `trace-flags`.

![Trace context được inject vào request và extract tại downstream service khi request đi qua các service boundaries.](images/trace_context_propagation.pdf)

Nếu trace context bị mất tại một service boundary, phần execution phía sau có thể không còn được nối với trace ban đầu.

## 4.3. Instrumenting Applications with OpenTelemetry

Instrumentation là quá trình gắn khả năng quan sát vào application. Trong bài này, chúng ta tập trung vào OpenTelemetry (OTel).

OpenTelemetry hỗ trợ hai cách chính để instrument application là *automatic instrumentation* và *manual instrumentation*.

![So sánh cách automatic instrumentation và manual instrumentation tạo spans trong application.](images/automatic_manual.png)

### Automatic Instrumentation

Ví dụ với FastAPI:

```python
@app.get("/checkout")
async def checkout():
    return {"status": "ok"}
```

Request này vẫn có thể tạo ra một span cho `GET /checkout` dù function `checkout()` không chứa tracing logic riêng.

### Manual Instrumentation

Developer có thể lấy span hiện tại và bổ sung attributes:

```python
from opentelemetry import trace

span = trace.get_current_span()
span.set_attribute("cart.item_count", len(items))
```

Hoặc tạo custom span:

```python
with tracer.start_as_current_span("checkout.calculate_cart") as span:
    span.set_attribute("cart.item_count", len(items))
    total = calculate_cart(items)
```

Trong thực tế, automatic instrumentation và manual instrumentation thường được kết hợp với nhau.

## 4.4. Trace Pipeline with OTel Collector and Jaeger

Application có thể gửi telemetry trực tiếp đến backend. Tuy nhiên, khi hệ thống có nhiều service, OpenTelemetry Collector thường được đặt giữa applications và backends để tập trung việc tiếp nhận, xử lý và chuyển tiếp telemetry.

![Kiến trúc tổng quát của telemetry pipeline từ instrumented applications qua OpenTelemetry Collector đến các backend lưu trữ và phân tích.](images/otel_pipeline.pdf)

### OTLP (OpenTelemetry Protocol)

OTLP là giao thức dùng để truyền telemetry giữa các component trong hệ sinh thái OpenTelemetry. Với distributed tracing, OpenTelemetry SDK trong application có thể export spans bằng OTLP qua gRPC hoặc HTTP.

### OpenTelemetry (OTel) Collector

Collector là một service độc lập dùng để nhận, xử lý và chuyển tiếp telemetry.

**Receiver → Processor → Exporter**

- **Receiver:** entry point của telemetry vào Collector.
- **Processor:** xử lý telemetry sau khi nhận.
- **Exporter:** gửi telemetry đã xử lý đến backend hoặc một hệ thống khác.

Ví dụ:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:

processors:
  batch:

exporters:
  otlp:
    endpoint: tracing-backend:4317

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
```

### Jaeger

Jaeger là một distributed tracing backend dùng để lưu trữ, tìm kiếm và visualize traces.

## 4.5. Hands-on: Following a Failed Checkout Request End-to-End

### From Error Log to Trace

```logql
{source="docker", service="demo-app"}
| json
| event = "payment_returned_error"
```

![`demo-app` ghi nhận event `payment_returned_error` cùng `trace_id` của request lỗi.](images/practice/jaeger_log_trace_id.png)

Sao chép `trace_id`, sau đó mở Jaeger tại [http://localhost:16686](http://localhost:16686), dán vào ô *Lookup by Trace ID*.

### Follow the Request Path

![Trace tree và timeline của failed checkout request.](images/practice/jaeger_trace_timeline.pdf)

Trace có `demo-app: GET /checkout` là root span và cho thấy request đi qua cả inventory branch lẫn payment branch.

### Inspect the Payment Spans

![Payment server span ghi nhận HTTP 503; custom span ghi nhận external payment failure.](images/practice/jaeger_span_details.pdf)

Server span `POST /payments/authorize` có `http.status_code=503`. Child span `payment.external_api.authorize` ghi nhận exception event với `exception.message=Payment provider unavailable` và `exception.type=RuntimeError`.

### Compare Duration and Localize the Failure

![Server span và custom span trên payment branch có duration gần như tương đương.](images/practice/jaeger_span_duration.pdf)

Trong trace này, `POST /payments/authorize` kéo dài khoảng 151 ms, còn child span `payment.external_api.authorize` kéo dài khoảng 150 ms. Điều này cho thấy phần lớn thời gian của payment request nằm trong child operation này.

Chuỗi evidence:

1. LogQL `event = "payment_returned_error"` thu hẹp ERROR logs xuống đúng checkout failure.
2. `trace_id` từ log dẫn đến đúng distributed trace.
3. `POST /payments/authorize` ghi nhận `http.status_code=503`, còn child span `payment.external_api.authorize` ghi nhận exception `Payment provider unavailable`.
4. Duration cho thấy phần lớn thời gian của payment request nằm trong child operation này.

Tracing giúp localize failure, nhưng chưa đủ để tự khẳng định root cause cuối cùng.

# 5. Correlation, Alerting, and Incident Investigation

## 5.1. Telemetry Correlation

Metrics, Logs và Traces cung cấp những góc nhìn khác nhau về cùng một incident. Khi các signal chia sẻ context như service, time window và `trace_id`, engineer có thể correlate chúng để lần theo cùng một vấn đề qua nhiều nguồn telemetry.

### Correlating Metrics, Logs, and Traces

Một workflow thường gặp:

**Metrics → Logs → Traces**

![Metrics xác định service và incident time window, Logs cung cấp event cụ thể, còn `trace_id` dẫn đến distributed trace của cùng request.](images/correlating_metric_log_trace.png)

Các bước correlation trên dựa vào những metadata khác nhau:

- `service.name` xác định service liên quan.
- `timestamp` và time window giới hạn khoảng thời gian cần kiểm tra.
- `environment` phân biệt các môi trường.
- `trace_id` xác định distributed trace của một request.
- `span_id` xác định một operation cụ thể trong trace.

Có thể tóm tắt workflow như sau:

> *Metrics xác định phạm vi, Logs cung cấp evidence, còn Traces localize vấn đề trên request path.*

## 5.2. Alerting and Alert Management

Operational signals như Error Rate, latency hoặc availability có thể được quan sát trên dashboard, nhưng engineer không thể liên tục theo dõi mọi thay đổi của hệ thống. Alerting cho phép các signal này được đánh giá theo những điều kiện đã xác định trước và tạo alert khi condition tương ứng được thỏa mãn.

### Alert Rules and Alert Lifecycle

Ví dụ Error Rate alert:

```promql
sum(rate(app_requests_total{endpoint="/checkout",status=~"5.."}[5m]))
/
sum(rate(app_requests_total{endpoint="/checkout"}[5m]))
> 0.05
```

Alert rule:

```yaml
alert: HighCheckoutErrorRate
expr: <error_rate_expression> > 0.05
for: 5m
```

![Alert Lifecycle](images/alert_lifecycle.png)

Các trạng thái:

- **Inactive:** condition của alert chưa được thỏa mãn.
- **Pending:** condition đã được thỏa mãn nhưng chưa duy trì đủ thời gian `for`.
- **Firing:** condition đã duy trì đủ thời gian `for`.
- **Resolved:** condition gây ra firing không còn được thỏa mãn.

Prometheus còn hỗ trợ `keep_firing_for`, cho phép giữ alert ở trạng thái Firing thêm một khoảng thời gian sau khi condition không còn đúng.

### Managing Alerts with Alertmanager

Prometheus đánh giá alert conditions và duy trì trạng thái của các alert instance. Việc tổ chức và phân phối notification được xử lý bởi Alertmanager.

![Alert Flow and Receivers](images/alert_flow_receivers.png)

Các cơ chế thường được sử dụng gồm:

- **Deduplication:** giảm việc gửi lặp lại notification cho cùng một alert.
- **Grouping:** gom các alert liên quan thành một notification.
- **Routing:** chuyển alert đến receiver phù hợp.
- **Inhibition:** giảm các notification phụ khi một alert ở phạm vi rộng hơn đã xuất hiện.
- **Silencing:** tạm thời ngăn notification được gửi trong những khoảng thời gian đã dự kiến trước.

Receiver có thể là email, Slack, PagerDuty, Opsgenie hoặc HTTP webhook.

## 5.3. End-to-End Incident Investigation

Sau khi alert xác định thời điểm cần bắt đầu investigation, ta có thể lần theo incident từ signal ở mức service xuống một request cụ thể.

**Alert → Metrics → Logs → Trace → Failure Hypothesis**

### Start from the Alert

Investigation bắt đầu từ alert `HighCheckoutErrorRate` đang ở trạng thái Firing.

![Prometheus đánh giá rule `HighCheckoutErrorRate` và chuyển alert sang trạng thái Firing.](images/checkout_alert.pdf)

### Inspect Metrics and Navigate to Logs

Trên Metrics dashboard, đối chiếu Request Rate, Error Rate và P95 Latency trong incident window.

Để tiếp tục từ metrics sang logs mà vẫn giữ incident context, tạo Data Link *Investigate checkout errors* trên panel Error Rate.

![Data Link *Investigate checkout errors* được cấu hình trên panel Error Rate.](images/error_rate_data_link.pdf)

Data Link mở Loki Explore với query ban đầu:

```logql
{source="docker", service="demo-app"}
| json
```

### Inspect Error Patterns in the Incident Window

```logql
{source="docker", service="demo-app"}
| json
| __error__ = ""
| level = "ERROR"
```

![Các ERROR logs của `demo-app` được kiểm tra trong cùng incident window.](images/incident_error_logs.pdf)

Kết quả cho thấy checkout failures trong cùng window không nhất thiết chỉ có một pattern. Một số request ghi nhận `inventory_returned_error`, trong khi các request khác ghi nhận `payment_returned_error`.

### Navigate from the Error Log to Trace

Trong phần Links, Grafana sử dụng derived field TraceID để trích xuất `trace_id` từ log và liên kết sang Jaeger.

![Derived field TraceID liên kết error log với trace của cùng request trong Jaeger.](images/traceid_to_jaeger.pdf)

Ở bước này, correlation chuyển từ event-level context sang request-level context.

### Correlate Logs Across Services

```logql
{source="docker", service=~"demo-app|payment-service"}
| json
| __error__ = ""
| trace_id = "<trace-id>"
```

![Cùng `trace_id` liên kết các error events của `demo-app` và `payment-service` trên một failed request.](images/traceid_log_correlation.pdf)

Các records trả về cho thấy cùng request được quan sát ở nhiều điểm trên execution path. `demo-app` ghi nhận request `/checkout` kết thúc với HTTP 502 và event `payment_returned_error`, trong khi `payment-service` ghi nhận `POST /payments/authorize` trả HTTP 503 cùng event `external_api_unavailable`.

Từ các signals đã quan sát, investigation có thể được tóm lại thành bốn mốc chính:

1. Alert và metrics xác định checkout Error Rate tăng tại `demo-app` trong incident window.
2. Logs cho thấy incident window có nhiều failure patterns, từ đó một `payment_returned_error` được chọn để drill down vào một failed request cụ thể.
3. `trace_id` liên kết event đó với distributed trace tương ứng và thu hẹp request path xuống payment branch.
4. HTTP 503 trên `POST /payments/authorize` và exception liên quan đến `payment.external_api.authorize` cùng hướng investigation về external payment operation. Duration bổ sung context về vị trí và thời gian của operation trên request path.

Với request được chọn để investigation, các signals đều hội tụ về payment path, đặc biệt là `payment.external_api.authorize`. Khi metrics, logs và traces được đặt trong cùng incident context, investigation đã đi từ một service-level symptom xuống operation cần được ưu tiên kiểm tra tiếp.

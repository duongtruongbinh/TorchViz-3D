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

# 1. Fundamentals of Observability and System Signals

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

## 1.3. Choosing What to Measure

Một hệ thống có thể tạo ra rất nhiều chỉ số, từ mức sử dụng CPU và bộ nhớ đến số lượng yêu cầu, tỷ lệ lỗi và thời gian phản hồi. Nếu theo dõi tất cả chỉ số với cùng mức độ ưu tiên, kỹ sư sẽ khó biết nên bắt đầu từ đâu khi hệ thống xuất hiện vấn đề.

Vì vậy, việc lựa chọn chỉ số nên bắt đầu từ đối tượng cần quan sát. USE Method, Four Golden Signals và RED Method là ba cách tiếp cận phổ biến, mỗi cách tập trung vào một phạm vi khác nhau của hệ thống.

![USE, Four Golden Signals và RED tập trung vào những phạm vi khác nhau và có thể được kết hợp trong quá trình điều tra.](images/USE_GOLDEN_RED_Method.png)

### [USE Method](https://www.brendangregg.com/usemethod.html): Resource Condition

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

## 1.4. Service Reliability with SLI, SLO, and Error Budget

Các chỉ số cho biết hệ thống đang hoạt động như thế nào, nhưng một giá trị riêng lẻ chưa cho biết mức hoạt động đó có đáp ứng yêu cầu hay không. Để đánh giá rõ hơn, kỹ sư cần một phép đo phản ánh chất lượng thực tế, một mục tiêu để so sánh và một mức sai lệch được phép chấp nhận.

Ba khái niệm tương ứng là SLI, SLO và Error Budget. SLI phản ánh kết quả thực tế, SLO đặt ra mức mong muốn, còn Error Budget cho biết mức sai lệch được chấp nhận trong khoảng thời gian đã xác định.

![Từ chỉ số, SLI được tính và so sánh với SLO để xác định Error Budget còn lại.](images/sli_slo_eb.png)

### Chuyển chỉ số thành SLI

Các chỉ số ban đầu cung cấp dữ liệu như số yêu cầu thành công và tổng số yêu cầu. Từ những giá trị này, kỹ sư có thể xây dựng một chỉ số đại diện cho chất lượng mà người dùng thực sự nhận được.

> **SLI (Service Level Indicator)** là phép đo phản ánh một khía cạnh cụ thể về chất lượng hoạt động của dịch vụ.

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

> **SLO (Service Level Objective)** là mục tiêu được đặt cho một SLI trong một khoảng thời gian xác định.

Ví dụ:

> Trong 30 ngày, ít nhất 99,9% yêu cầu phải được xử lý thành công.

SLO này sử dụng tỷ lệ thành công của yêu cầu làm SLI và đặt mục tiêu 99,9% trong 30 ngày. Vì SLI thực tế là 99,92%, dịch vụ vẫn đang đáp ứng mục tiêu đã đặt.

### Xác định Error Budget

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

## 1.5. Hands-on: Chuẩn bị môi trường

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

## 2.1. Prometheus and the Metrics Pipeline

Sau khi xác định được các metric cần theo dõi, bước tiếp theo là xây dựng một pipeline có thể thu thập, lưu trữ và truy vấn metrics theo thời gian. Prometheus là hệ thống monitoring chuyên cho dữ liệu time series, trong đó Prometheus Server định kỳ lấy metrics từ các target, lưu chúng vào TSDB và cung cấp dữ liệu cho truy vấn, dashboard và alerting.

![Prometheus thu thập metrics từ các target, lưu dữ liệu dưới dạng time series và cung cấp chúng cho truy vấn, trực quan hóa và alerting.](images/prometheus_architecture.png)

Prometheus Server là thành phần trung tâm của pipeline. Các application hoặc exporter đóng vai trò là nguồn metrics, còn TSDB (Time-Series Database) là nơi Prometheus lưu các metric sample theo thời gian. PromQL được sử dụng để truy vấn dữ liệu, trong khi Grafana có thể sử dụng Prometheus làm data source để trực quan hóa các kết quả này.

Trong môi trường nhỏ, danh sách target có thể được cấu hình trực tiếp. Với các môi trường động, Service Discovery có thể hỗ trợ Prometheus tìm và cập nhật target tự động. Prometheus cũng có thể đánh giá alerting rules và chuyển các alert được kích hoạt đến Alertmanager; phần alerting sẽ được trình bày chi tiết ở chương sau.

### Pull-based Metrics Collection

Prometheus chủ yếu sử dụng cơ chế pull-based collection, nghĩa là Prometheus chủ động kết nối đến các target để lấy metrics theo một chu kỳ xác định.

Giả sử một checkout service đã cung cấp endpoint metrics tại:

```text
http://checkout-service:8000/metrics
```

Prometheus sẽ định kỳ gửi HTTP request đến endpoint này để thu thập các metric sample hiện tại. Mỗi lần Prometheus thực hiện quá trình thu thập từ một target được gọi là một *scrape*.

Trong phần này, `/metrics` chỉ được xem là endpoint mà Prometheus sử dụng để lấy dữ liệu. Cách application hoặc exporter tạo ra nội dung tại endpoint này sẽ được trình bày ở mục Application Instrumentation.

### Targets, `scrape_interval` và trạng thái scrape

Để thu thập metrics, Prometheus trước hết cần biết những endpoint nào phải được theo dõi. Mỗi endpoint mà Prometheus định kỳ truy cập để lấy metrics được gọi là một target.

Trong một cấu hình đơn giản, các target có thể được khai báo trực tiếp trong `prometheus.yml`. Ví dụ:

```yaml
scrape_configs:
  - job_name: "checkout-service"
    static_configs:
      - targets:
          - "checkout-service:8000"
```

Ở đây, `checkout-service:8000` là target mà Prometheus sẽ scrape. Trường `job_name` đặt tên cho nhóm target này, giúp các metrics được thu thập được nhận diện theo cùng một vai trò.

Sau khi biết cần scrape target nào, Prometheus cần xác định tần suất thu thập dữ liệu. Khoảng thời gian giữa hai lần scrape được cấu hình bằng `scrape_interval`. Ví dụ:

```yaml
global:
  scrape_interval: 15s
```

Với cấu hình trên, Prometheus sẽ cố gắng lấy metrics từ các target khoảng 15 giây một lần. Mỗi lần scrape tạo ra một tập metric sample mới với timestamp tương ứng. Khi quá trình này lặp lại, các sample được lưu theo thời gian và tạo thành dữ liệu time series.

Việc chọn `scrape_interval` là sự cân bằng giữa độ chi tiết và lượng dữ liệu cần xử lý. Khoảng thời gian ngắn giúp ghi nhận thay đổi nhanh hơn nhưng tạo ra nhiều sample hơn; khoảng thời gian dài làm giảm lượng dữ liệu nhưng có thể không phản ánh được những biến động ngắn.

Khi một target được scrape, Prometheus thường bổ sung các label để xác định nguồn dữ liệu. Hai label thường gặp là `job`, đại diện cho nhóm target, và `instance`, đại diện cho target cụ thể. Với cấu hình trên, một metric có thể mang các label:

```text
job="checkout-service"
instance="checkout-service:8000"
```

Các label này giúp engineer phân biệt dữ liệu đến từ service hoặc instance nào khi truy vấn.

Prometheus đồng thời tự tạo metric `up` cho mỗi target để phản ánh kết quả của lần scrape gần nhất. Ví dụ:

```text
up{job="demo-app", instance="demo-app:8000"}
```

Kết quả `1` cho biết Prometheus đã thu thập metrics từ target thành công, trong khi `0` cho biết lần scrape gần nhất thất bại. Nhờ đó, `up` cung cấp một cách đơn giản để kiểm tra liệu Prometheus còn có thể tiếp cận và thu thập dữ liệu từ target hay không.

Tuy nhiên, metric này chỉ phản ánh scrape status, không phản ánh đầy đủ application health. Một checkout service vẫn có thể trả về endpoint metrics bình thường trong khi database hoặc một dependency phía sau đang gặp lỗi. Vì vậy, `up` thường được dùng như bước kiểm tra đầu tiên trước khi engineer xem xét thêm các tín hiệu như latency, error rate hoặc resource usage.

![Trạng thái scrape của các target trong Prometheus.](images/practice/prometheus_up.png)

### Service Discovery

Khai báo target thủ công phù hợp với lab hoặc hệ thống có ít thành phần. Trong môi trường động, instance có thể được tạo mới, thay đổi địa chỉ hoặc bị loại bỏ thường xuyên, khiến danh sách target khó được duy trì bằng cấu hình tĩnh.

Service Discovery cho phép Prometheus lấy danh sách target từ các nền tảng như Kubernetes, Consul hoặc cloud environment và cập nhật chúng khi hạ tầng thay đổi. Ở mức overview, có thể hiểu Service Discovery là lớp giúp Prometheus xác định cần scrape những target nào, còn quá trình scrape metrics vẫn được Prometheus thực hiện theo cơ chế pull.

### Short-lived Jobs và Pushgateway

Pull-based collection phù hợp với các service tồn tại đủ lâu để Prometheus có thể scrape theo chu kỳ. Tuy nhiên, một short-lived job có thể hoàn thành trước khi Prometheus thực hiện lần scrape tiếp theo.

Ví dụ, nếu một batch job chỉ chạy trong 5 giây trong khi `scrape_interval` là 15 giây, Prometheus có thể không kịp thu thập metrics trực tiếp từ job đó. Trong trường hợp này, job có thể gửi metrics đến Pushgateway trước khi kết thúc, sau đó Prometheus scrape Pushgateway như một target thông thường.

Pushgateway vì vậy chỉ đóng vai trò trung gian cho một số workload tồn tại trong thời gian ngắn. Cơ chế thu thập chính của Prometheus vẫn là pull-based collection.

## 2.2. Exposing Metrics: Application Instrumentation and Exporters

Ở phần trước, Prometheus được xem như thành phần chủ động scrape metrics từ các target thông qua endpoint `/metrics`. Câu hỏi tiếp theo là: những metrics xuất hiện tại endpoint đó được tạo ra từ đâu?

Trong thực tế, có hai cách phổ biến để cung cấp metrics cho Prometheus. Application có thể tự instrument để tạo metrics từ bên trong source code, hoặc sử dụng exporter để chuyển dữ liệu từ những hệ thống có sẵn sang định dạng mà Prometheus có thể thu thập.

![Application có thể tự instrument để expose metrics, trong khi exporter chuyển dữ liệu từ các hệ thống có sẵn sang định dạng mà Prometheus có thể thu thập.](images/application_exporter.png)

### Application Instrumentation

Instrumentation là quá trình bổ sung code hoặc cấu hình để application tạo ra các telemetry cần thiết trong quá trình hoạt động. Với Prometheus, application thường sử dụng Prometheus client library để định nghĩa, cập nhật và expose metrics.

Cách này phù hợp với những tín hiệu mà chính application hiểu rõ nhất, chẳng hạn:

- tổng số request đã xử lý.
- số request đang được xử lý.
- thời gian xử lý request.
- số request thất bại.
- business metrics như số order hoặc transaction.

Ví dụ, khi một HTTP request được xử lý, application có thể tăng request counter và ghi nhận thời gian xử lý. Client library duy trì các giá trị này và expose chúng qua endpoint `/metrics` để Prometheus scrape.

Application instrumentation vì vậy phù hợp khi team kiểm soát source code và cần theo dõi application-level hoặc business-level behavior, thay vì chỉ quan sát tài nguyên hạ tầng bên dưới.

### Exporters

Không phải hệ thống nào cũng có thể được instrument trực tiếp bằng Prometheus client library. Operating system, database, network device hoặc phần mềm có sẵn thường cung cấp dữ liệu thông qua system files, command, API hoặc giao thức riêng.

Trong trường hợp này, một exporter đóng vai trò trung gian. Exporter đọc dữ liệu từ hệ thống gốc, chuyển các giá trị cần thiết thành Prometheus metrics và expose chúng qua endpoint để Prometheus scrape.

Một ví dụ phổ biến là Node Exporter, được sử dụng để cung cấp system-level metrics từ Linux và Unix. Node Exporter đọc dữ liệu do operating system cung cấp và chuyển chúng thành các metrics về CPU, memory, disk, filesystem và network.

Một số metric thường gặp gồm:

- `node_cpu_seconds_total`: tổng thời gian CPU đã sử dụng theo từng core và mode.
- `node_memory_MemAvailable_bytes`: lượng memory còn khả dụng.
- `node_disk_read_bytes_total`: tổng số byte đã được đọc từ disk.
- `node_network_receive_bytes_total`: tổng số byte đã nhận qua network interface.
- `node_filesystem_avail_bytes`: dung lượng filesystem còn khả dụng.

Prefix `node_` giúp nhận biết metric được cung cấp bởi Node Exporter. Như vậy, application instrumentation phù hợp với application hoặc business metrics, còn exporter phù hợp khi cần lấy metrics từ những hệ thống mà team không muốn hoặc không thể sửa source code.

### Prometheus Exposition Format

Dù metrics được tạo trực tiếp bởi application hay thông qua exporter, endpoint mà Prometheus scrape cần cung cấp dữ liệu theo một format mà Prometheus có thể parse.

Ví dụ:

```text
# HELP http_requests_total Total number of HTTP requests.
# TYPE http_requests_total counter
http_requests_total{service="checkout",status="200"} 15230
```

Trong đó:

- `# HELP` mô tả ý nghĩa của metric;
- `# TYPE` khai báo loại metric;
- dòng cuối chứa metric sample thực tế.

Một metric sample thường có cấu trúc:

```text
metric_name{labels} value
```

Trong đó, labels là các cặp key-value đóng vai trò metadata, giúp bổ sung context để biết metric đang mô tả service, status hoặc nhóm tài nguyên nào. Ví dụ:

```text
http_requests_total{service="checkout", status="200"} 15230
```

Ở đây, `http_requests_total` là tên metric, `service="checkout"` cho biết metric thuộc service checkout, `status="200"` cho biết các request có HTTP status 200, còn `15230` là giá trị hiện tại. Khi Prometheus scrape endpoint này, sample được lưu cùng timestamp để tạo dữ liệu theo thời gian.

![Endpoint `/metrics` cung cấp metadata và các metric sample theo Prometheus exposition format.](images/practice/prometheus_metrics_endpoint.pdf)

### Metric Naming Convention

Tên metric nên mô tả rõ đại lượng đang được đo và sử dụng đơn vị nhất quán. Một số quy ước thường gặp:

- `_total`: thường dùng cho Counter. Ví dụ, `http_requests_total` biểu diễn tổng số HTTP request đã được xử lý.
- `_seconds`: dùng cho các đại lượng thời gian tính theo giây. Ví dụ, `http_request_duration_seconds` biểu diễn thời gian xử lý HTTP request.
- `_bytes`: dùng cho các đại lượng dung lượng tính theo byte. Ví dụ, `node_memory_MemAvailable_bytes` biểu diễn lượng memory còn khả dụng.

Việc đặt tên nhất quán giúp engineer nhận biết nhanh ý nghĩa và đơn vị của metric, đồng thời làm PromQL và dashboard dễ đọc hơn.

## 2.3. Prometheus Time-Series Data Model

Sau khi Prometheus scrape metrics từ các target, dữ liệu không chỉ được giữ dưới dạng giá trị hiện tại mà được lưu liên tục theo thời gian. Cách tổ chức này cho phép Prometheus theo dõi sự thay đổi của một metric, so sánh các thời điểm khác nhau và thực hiện các phép tính như rate, trend hoặc percentile ở bước truy vấn sau này.

### Metric Samples và Time Series

Mỗi lần Prometheus scrape một target, nó thu được các metric sample. Mỗi sample ghi lại value của metric tại một timestamp cụ thể. Khi cùng một metric tiếp tục được scrape ở các thời điểm khác nhau, các sample này được lưu nối tiếp nhau và hình thành một time series.

![Mỗi lần scrape tạo ra một sample gồm timestamp và value. Các sample được thu thập liên tục theo thời gian sẽ hình thành một time series.](images/metric_samle_timeseries.png)

Việc lưu lại toàn bộ chuỗi sample thay vì chỉ giữ giá trị mới nhất cho phép Prometheus phân tích sự thay đổi của metric theo thời gian. Một time series được xác định bởi **metric name** cùng toàn bộ **label set** đi kèm.

Ví dụ:

```text
http_requests_total{method="GET",status="200"}
```

Nếu một label thay đổi, Prometheus xem đó là một time series khác. Vì vậy:

```text
http_requests_total{method="GET",status="200"}
http_requests_total{method="POST",status="200"}
http_requests_total{method="POST",status="500"}
```

là ba time series riêng dù đều sử dụng cùng metric name `http_requests_total`.

### Labels

Labels là các cặp `key=value` dùng để mô tả thêm các chiều của metric. Nhờ labels, một metric có thể được phân tích theo service, endpoint, status code, instance hoặc environment mà không cần tạo một metric name riêng cho từng trường hợp.

Ví dụ:

```text
http_requests_total{
  service="checkout",
  endpoint="/payment",
  status="500"
}
```

Trong metric trên, các labels giúp mô tả metric theo nhiều chiều khác nhau.

- `service="checkout"`: request thuộc checkout service.
- `endpoint="/payment"`: request được xử lý tại endpoint `/payment`.
- `status="500"`: request kết thúc với server error.
- `job="checkout-service"`: nhóm các target có cùng vai trò.
- `instance="checkout-service:8000"`: xác định target cụ thể mà Prometheus đã scrape.

Trong đó, `service`, `endpoint` và `status` thường đến từ application hoặc exporter, còn `job` và `instance` thường được Prometheus bổ sung khi scrape. Nhờ cách tổ chức này, cùng một service có thể chạy trên nhiều instance mà dữ liệu vẫn được phân biệt rõ ràng.

Labels sau này cũng trở thành cơ sở để filter dữ liệu bằng PromQL.

### Cardinality

Việc thêm labels giúp metric trở nên linh hoạt hơn, nhưng mỗi tổ hợp label values khác nhau cũng tạo thêm một time series mới. Số lượng time series được tạo ra từ các tổ hợp này được gọi là cardinality.

Ví dụ, nếu một metric được phân chia theo 20 endpoint, 5 status code, 10 instance và 3 environment thì số tổ hợp có thể đạt:

$$
20 \times 5 \times 10 \times 3 = 3{,}000
\text{ time series}.
$$

Điều này cho thấy cardinality có thể tăng rất nhanh ngay cả khi mỗi label riêng lẻ chỉ có một số lượng giá trị vừa phải.

Rủi ro lớn hơn xuất hiện khi sử dụng những giá trị gần như luôn khác nhau làm label, chẳng hạn `user_id`, `request_id`, email hoặc timestamp. Nếu `request_id` được dùng làm label và mỗi request có một ID riêng, gần như mỗi request sẽ tạo thêm một time series mới. Khi số lượng series tăng quá lớn, Prometheus phải sử dụng nhiều memory và storage hơn, đồng thời query cũng trở nên tốn kém hơn.

Vì vậy, labels nên tập trung vào những chiều dữ liệu có số lượng giá trị tương đối ổn định và thực sự hữu ích cho monitoring, chẳng hạn service, status, endpoint, environment hoặc instance.

## 2.4. Hands-on: From Raw Metrics to Operational Signals with PromQL

Các ví dụ trong phần này sử dụng cùng một monitoring stack gồm checkout application, Node Exporter và Prometheus. Các operational signals được xây dựng và kiểm tra trực tiếp trên Prometheus trước khi được sử dụng lại để tạo Grafana dashboard.

Các time series được lưu trong Prometheus mới chỉ là dữ liệu thô. Để trả lời những câu hỏi vận hành như service có đang hoạt động không, traffic hiện tại bao nhiêu, tỷ lệ lỗi có tăng hay CPU và memory có gần quá tải không, các time series này cần được lựa chọn và tính toán thành những tín hiệu cụ thể.

PromQL (Prometheus Query Language) là ngôn ngữ truy vấn của Prometheus dùng để thực hiện quá trình đó. PromQL cho phép chọn metric, lọc theo labels, lấy dữ liệu trong một khoảng thời gian, tính tốc độ thay đổi và tổng hợp nhiều time series.

### Target Health

Metric `up` cho biết Prometheus có scrape một target thành công hay không.

```promql
up{job="demo-app", instance="demo-app:8000"}
```

![Truy vấn trạng thái scrape của checkout service bằng metric `up`.](images/practice/prometheus_target_health.png)

Giá trị `1` cho biết lần scrape gần nhất thành công, còn `0` cho biết Prometheus không thể thu thập metrics từ target đó.

### Counter to Request Rate

`app_requests_total` là Counter, biểu diễn tổng số HTTP request mà demo-app đã xử lý. Mỗi request hoàn tất làm Counter tăng lên, với các labels `method`, `endpoint` và `status`.

Để tính Request Rate, PromQL sử dụng `rate()` trên dữ liệu của 5 phút gần đây và có thể aggregate nhiều time series bằng `sum()`.

```promql
sum(rate(app_requests_total{endpoint="/checkout"}[5m]))
```

![Request Rate trung bình của demo-app đối với checkout request trong cửa sổ 5 phút.](images/practice/counter_to_request_rate.png)

Kết quả `0.04` trong hình có thể hiểu demo-app xử lý trung bình khoảng 0.04 checkout request mỗi giây trong 5 phút gần đây.

### Counter to Error Rate

Cùng một `app_requests_total` có thể được sử dụng để theo dõi lỗi thông qua label `status`.

```promql
sum(rate(app_requests_total{endpoint="/checkout",status=~"5.."}[5m]))
/
sum(rate(app_requests_total{endpoint="/checkout"}[5m]))
```

![Tỷ lệ request kết thúc bằng HTTP status 5xx trong cửa sổ 5 phút.](images/practice/counter_to_error_rate.png)

Kết quả `0.1667` cho biết khoảng 16.67% checkout request trong 5 phút gần đây kết thúc bằng server error. Với traffic hiện tại, tỷ lệ này tương ứng 2 request lỗi trên tổng 12 checkout request.

### Counter to CPU Usage

Một ví dụ khác của Counter là `node_cpu_seconds_total`, metric ghi nhận tổng thời gian CPU đã dành cho từng mode như `idle`, `user`, `system` hoặc `iowait`.

```promql
100 * (
  1 - avg by (instance) (
    rate(node_cpu_seconds_total{mode="idle"}[5m])
  )
)
```

![CPU usage theo từng core và CPU usage trung bình theo instance sau khi aggregate.](images/practice/counter_to_cpu_usage.pdf)

Trong hình, từng core có CPU usage khoảng 2.3–2.5%, còn `avg by (instance)` gộp bốn core thành mức trung bình khoảng 2.4% cho `node-exporter:9100`.

### Gauge to Memory Usage

Sau Counter, một metric type phổ biến khác là Gauge. Nếu Counter dùng để biểu diễn một giá trị tích lũy chỉ tăng theo thời gian, thì Gauge biểu diễn trạng thái hiện tại của một giá trị tại thời điểm được quan sát và có thể tăng hoặc giảm giữa các lần scrape.

Node Exporter cung cấp hai Gauge thường dùng để quan sát memory:

- `node_memory_MemTotal_bytes`: tổng lượng memory của host.
- `node_memory_MemAvailable_bytes`: lượng memory còn khả dụng.

```promql
100 * (
  1 - node_memory_MemAvailable_bytes
      / node_memory_MemTotal_bytes
)
```

![Tỷ lệ memory đang được sử dụng trên từng host.](images/practice/gauge_to_mem_usage.pdf)

Kết quả trong hình dao động quanh 16%, cho biết môi trường mà Node Exporter quan sát đang sử dụng khoảng 16% memory.

### Histogram to P95 Latency

Mỗi request có thể có thời gian xử lý khác nhau, vì vậy latency cần được quan sát trên nhiều request thay vì chỉ một giá trị riêng lẻ. Prometheus thường sử dụng Histogram để ghi nhận phân phối này bằng cách nhóm các observation vào các bucket theo những ngưỡng xác định trước.

Các metric `_bucket` sử dụng label `le` (*less than or equal*) để cho biết có bao nhiêu observation nhỏ hơn hoặc bằng từng ngưỡng. Histogram còn cung cấp `_count` là tổng số observation và `_sum` là tổng giá trị đã ghi nhận.

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

![P95 request latency của checkout service trong cửa sổ 5 phút.](images/practice/p95_request_latency.pdf)

Trong kết quả, bucket `le="+Inf"` cho biết tổng request rate khoảng 0.04068 req/s. Mốc P95 tương ứng với 95% tổng rate:

$$
q = 0.95 \times 0.04068 \approx 0.03864.
$$

Giá trị này nằm giữa bucket `le="0.75"` với rate khoảng 0.01356 req/s và bucket `le="1.0"` với rate khoảng 0.04068 req/s. Vì vậy, P95 nằm trong khoảng 0.75–1.0 giây.

Với một quantile nằm giữa hai bucket, phép nội suy có thể được biểu diễn bằng công thức:

$$
\mathrm{Quantile}
= L + \frac{q-C_{\mathrm{prev}}}
{C_{\mathrm{upper}}-C_{\mathrm{prev}}}(U-L).
$$

Trong đó, \(L\) và \(U\) là cận dưới và cận trên của bucket chứa quantile, \(C_{\mathrm{prev}}\) là cumulative rate trước bucket đó, \(C_{\mathrm{upper}}\) là cumulative rate tại cận trên, còn \(q\) là vị trí quantile cần tìm.

Thay các giá trị từ kết quả:

$$
\mathrm{P95}
= 0.75 + \frac{0.03864-0.01356}{0.04068-0.01356}(1.0-0.75)
\approx 0.98125\ \text{s}.
$$

Có thể hiểu rằng khoảng 95% request hoàn thành trong không quá 0.981 giây trong cửa sổ 5 phút.

### Histogram và Summary

Histogram và Summary đều được dùng để theo dõi phân phối dữ liệu như request latency, nhưng khác nhau ở cách percentile được tính. Với Histogram, application ghi observations vào các bucket và Prometheus sử dụng dữ liệu đó để tính percentile tại thời điểm query. Với Summary, percentile như p95 được tính trực tiếp tại application trước khi metrics được expose.

![Histogram giữ phân phối dưới dạng bucket để Prometheus tính percentile khi query, trong khi Summary tính quantile ngay tại application trước khi expose metrics.](images/practice/prometheus_histogram_summary.png)

Sự khác biệt này ảnh hưởng trực tiếp đến khả năng tính percentile cho toàn service.

- `checkout-1`: 1,000 requests, p95 = 0.4 s.
- `checkout-2`: 20 requests, p95 = 1.0 s.

Nếu lấy trung bình hai giá trị này sẽ được 0.7 giây, nhưng kết quả đó xem hai instance như có ảnh hưởng ngang nhau dù phần lớn request thực tế được xử lý bởi `checkout-1`. Vì vậy, p95 của toàn service phải được tính từ phân phối của tất cả request.

### Availability SLI

Metrics có thể được kết hợp để tính SLI (Service Level Indicator). Với một HTTP service, Availability SLI có thể được xác định bằng tỷ lệ giữa số request thành công và tổng số request trong cùng một khoảng thời gian.

```promql
sum(rate(app_requests_total{endpoint="/checkout",status=~"2.."}[5m]))
/
sum(rate(app_requests_total{endpoint="/checkout"}[5m]))
```

![Availability SLI được tính từ tỷ lệ successful requests trên total requests.](images/practice/prometheus_sli.png)

Kết quả `0.8333` cho biết Availability SLI của checkout service trong 5 phút gần đây là khoảng 83.33%. Trong khoảng này, 10 trong tổng 12 request kết thúc thành công với HTTP status 2xx.

### Operational Signals Overview

| Operational Signal | Raw Metric / Type | Cách xử lý | Ý nghĩa |
|---|---|---|---|
| Target Health | `up` | Chọn metric và lọc theo labels | Kiểm tra Prometheus có scrape được target hay không |
| Request Rate | Counter | Tính tốc độ tăng và aggregate | Mức traffic hiện tại của service |
| Error Rate | Counter | Lọc request lỗi, tính rate và tỷ lệ | Tỷ lệ request thất bại |
| Memory Usage | Gauge | Tính toán trực tiếp từ các giá trị hiện tại | Mức memory đang được sử dụng |
| CPU Usage | Counter | Tính rate của CPU time và aggregate | Mức CPU đang được sử dụng |
| P95 Latency | Histogram | Tính percentile từ histogram buckets | Mức latency mà khoảng 95% request không vượt quá |
| Availability SLI | Counter | Tính tỷ lệ successful requests trên total requests | Tỷ lệ request thành công |

Các query trên đã tạo ra tập operational signals cần thiết cho việc theo dõi checkout service.

## 2.5. Visualizing Metrics with Grafana

Sau khi các operational signals đã được kiểm tra trên Prometheus, Grafana được sử dụng để tập hợp chúng vào cùng một dashboard và theo dõi sự thay đổi theo thời gian.

### Connecting Grafana to Prometheus

Mở Grafana tại [http://localhost:3000](http://localhost:3000) và đăng nhập bằng tài khoản `admin` với mật khẩu `grafana`. Sau khi đăng nhập, cấu hình Prometheus làm data source để Grafana có thể truy vấn metrics.

![Prometheus được cấu hình làm data source trong Grafana.](images/practice/prometheus_data_sources.pdf)

### Building the Metrics Dashboard

Một dashboard gồm nhiều panel, trong đó mỗi panel biểu diễn một signal hoặc một góc nhìn cụ thể của hệ thống. Để minh họa quy trình, ta chọn Request Rate sử dụng làm panel mẫu.

Trong Grafana, tạo một dashboard mới, chọn *Add panel* và chọn Prometheus làm data source. Sau đó sử dụng lại PromQL query Request Rate, chọn Time series làm visualization, đặt tên panel là *Request Rate*, cấu hình đơn vị requests per second và lưu panel.

![Xây dựng panel Request Rate bằng PromQL và Time series visualization.](images/practice/grafana_request_rate.pdf)

Sau khi hoàn thành panel Request Rate, các query đã xây dựng được tái sử dụng để bổ sung các panel còn lại.

| Panel | PromQL | Visualization | Unit |
|---|---|---|---|
| Request Rate | `sum(rate(app_requests_total{endpoint="/checkout"}[5m]))` | Time series | req/s |
| Error Rate | `sum(rate(app_requests_total{endpoint="/checkout",status=~"5.."}[5m])) / sum(rate(app_requests_total{endpoint="/checkout"}[5m]))` | Stat | Percent (0 - 1) |
| P95 Latency | `histogram_quantile(0.95, sum by (le) (rate(app_request_latency_seconds_bucket{endpoint="/checkout"}[5m])))` | Time series | seconds |
| CPU Usage | `100 * (1 - avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])))` | Time series | Percent (0 - 100) |
| Memory Usage | `100 * (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)` | Time series | Percent (0 - 100) |
| Availability SLI | `sum(rate(app_requests_total{endpoint="/checkout",status=~"2.."}[5m])) / sum(rate(app_requests_total{endpoint="/checkout"}[5m]))` | Stat | Percent (0 - 1) |

![Dashboard tập hợp các operational signals của checkout service trên cùng một giao diện.](images/practice/grafana_dashboard.png)

Dashboard hoàn chỉnh cho phép quan sát nhiều khía cạnh của service trong cùng một time range. Request Rate phản ánh Traffic, Error Rate phản ánh Errors, P95 Latency thể hiện Latency, còn CPU Usage và Memory Usage cho thấy mức sử dụng tài nguyên, đồng thời hỗ trợ đánh giá saturation khi kết hợp với các tín hiệu chờ hoặc queue. Availability SLI cho biết tỷ lệ request thành công và hỗ trợ đánh giá reliability của service.

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

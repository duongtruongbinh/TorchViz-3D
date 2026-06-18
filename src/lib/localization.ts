export type Language = 'en' | 'vi';

export const LANGUAGE_OPTIONS: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'vi', label: 'Tiếng Việt' },
];

type LocalizedValue = string | ((...args: any[]) => string);
type LocalizedPair = Record<Language, LocalizedValue>;
type LocalizedNode = LocalizedPair | { [key: string]: LocalizedNode } | LocalizedNode[];

const localizedText = {
  app: {
    language: { en: 'Language', vi: 'Ngôn ngữ' },
    editor: { en: 'Editor', vi: 'Trình soạn thảo' },
    explorer: { en: 'Explorer', vi: 'Bảng thông tin' },
    loadingEditorModule: { en: 'Loading Editor module...', vi: 'Đang tải mô-đun soạn thảo...' },
    demoErrorMessage: {
      en: 'module setup failed: missing required layer configuration',
      vi: 'module setup failed: missing required layer configuration',
    },
    demoErrorHint: {
      en: 'Check the layer constructor arguments or install the missing dependency.',
      vi: 'Check the layer constructor arguments or install the missing dependency.',
    },
    collapse: {
      expandEditorPanel: { en: 'Expand editor panel', vi: 'Mở rộng khung soạn thảo' },
      collapseEditorPanel: { en: 'Collapse editor panel', vi: 'Thu gọn khung soạn thảo' },
      expandExplorerPanel: { en: 'Expand explorer panel', vi: 'Mở rộng bảng thông tin' },
      collapseExplorerPanel: { en: 'Collapse explorer panel', vi: 'Thu gọn bảng thông tin' },
      expandTerminalPanel: { en: 'Expand terminal panel', vi: 'Mở rộng khung terminal' },
      collapseTerminalPanel: { en: 'Collapse terminal panel', vi: 'Thu gọn khung terminal' },
    },
  },
  header: {
    template: { en: 'Template', vi: 'Mẫu kiến trúc' },
    selectTemplate: { en: 'Select Template', vi: 'Chọn mẫu' },
    inputShape: { en: 'Input Shape', vi: 'Kích thước đầu vào' },
    inputShapeTitle: {
      en: 'JSON array, e.g. [1, 3, 224, 224] or [10, 32, 512] for 2D/3D models',
      vi: 'Mảng JSON, ví dụ [1, 3, 224, 224] hoặc [10, 32, 512] cho mô hình 2D/3D',
    },
    running: { en: 'Running...', vi: 'Đang chạy...' },
    visualize: { en: 'Visualize', vi: 'Trực quan hóa' },
    exportSvg: { en: 'Export SVG', vi: 'Xuất SVG' },
    tour: { en: 'Tour', vi: 'Hướng dẫn' },
    openTour: { en: 'Open tour', vi: 'Mở hướng dẫn' },
    help: { en: 'Help', vi: 'Trợ giúp' },
  },
  editor: {
    loading: { en: 'Loading Editor...', vi: 'Đang tải trình soạn thảo...' },
    completionModuleDetail: { en: 'Base class for all nn modules', vi: 'Lớp cơ sở cho mọi mô-đun nn' },
  },
  terminal: {
    title: { en: 'Terminal', vi: 'Terminal' },
    runtimeErrorAtLine: {
      en: (line: number) => `Runtime Error at line ${line}`,
      vi: (line: number) => `Runtime Error at line ${line}`,
    },
    hint: {
      en: (hint: string) => `Hint: ${hint}`,
      vi: (hint: string) => `Hint: ${hint}`,
    },
    systemReady: { en: '> System ready.', vi: '> System ready.' },
    waitingForExecution: { en: '> Waiting for execution...', vi: '> Waiting for execution...' },
    buildSuccessful: {
      en: (params: string) => `> Build successful. Graph generated (${params} params).`,
      vi: (params: string) => `> Build successful. Graph generated (${params} params).`,
    },
  },
  inspector: {
    expandSection: {
      en: (label: string) => `Expand ${label}`,
      vi: (label: string) => `Mở rộng ${label}`,
    },
    collapseSection: {
      en: (label: string) => `Collapse ${label}`,
      vi: (label: string) => `Thu gọn ${label}`,
    },
    explainParameterFormula: { en: 'Explain parameter formula', vi: 'Giải thích công thức tham số' },
    fields: {
      name: { en: 'Name', vi: 'Tên' },
      type: { en: 'Type', vi: 'Loại' },
      line: { en: 'Line', vi: 'Dòng' },
      formula: { en: 'Formula', vi: 'Công thức' },
      calc: { en: 'Calc', vi: 'Tính toán' },
      error: { en: 'Error', vi: 'Lỗi' },
    },
    noModelLoaded: { en: 'No model loaded.', vi: 'Chưa tải mô hình.' },
    runCodeToExplore: { en: 'Run code to explore the model.', vi: 'Chạy mã để khám phá mô hình.' },
    structure: { en: 'Structure', vi: 'Cấu trúc' },
    details: { en: 'Details', vi: 'Chi tiết' },
    params: { en: 'params', vi: 'tham số' },
    clickNodeToInspect: { en: 'Click a node to inspect', vi: 'Bấm vào một nút để xem chi tiết' },
    input: { en: 'Input', vi: 'Input' },
    output: { en: 'Output', vi: 'Output' },
    expand: { en: 'Expand', vi: 'Mở rộng' },
    collapse: { en: 'Collapse', vi: 'Thu gọn' },
    resetCameraView: { en: 'Reset camera view', vi: 'Đặt lại góc nhìn camera' },
  },
  canvas: {
    runningTorchScript: { en: 'Running TorchScript...', vi: 'Đang chạy TorchScript...' },
    compilationFailed: { en: 'Compilation Failed', vi: 'Biên dịch thất bại' },
    unknownError: { en: 'Unknown error', vi: 'Lỗi không xác định' },
    readyToVisualize: { en: 'Ready to Visualize', vi: 'Hệ thống đã sẵn sàng' },
    emptyBefore: {
      en: 'Select a template or write PyTorch code on the left, then press',
      vi: 'Chọn mẫu hoặc viết mã PyTorch ở bên trái, rồi bấm',
    },
    emptyAfter: { en: '.', vi: '.' },
    left: { en: 'Left', vi: 'Trái' },
    right: { en: 'Right', vi: 'Phải' },
    pan: { en: 'Pan', vi: 'Di chuyển' },
    rotate: { en: 'Rotate', vi: 'Xoay' },
    zoom: { en: 'Zoom', vi: 'Thu phóng' },
    demo: {
      title: { en: 'MNIST flow demo', vi: 'Demo luồng MNIST' },
      mode: { en: 'MNIST demo', vi: 'Demo MNIST' },
      unavailable: { en: 'Run LeNet-5 to use the MNIST demo', vi: 'Chạy LeNet-5 để dùng demo MNIST' },
      modeOn: { en: 'On', vi: 'Bật' },
      modeOff: { en: 'Off', vi: 'Tắt' },
      input: { en: 'MNIST input', vi: 'Input MNIST' },
      play: { en: 'Play MNIST flow', vi: 'Phát luồng MNIST' },
      pause: { en: 'Pause MNIST flow', vi: 'Tạm dừng luồng MNIST' },
      previous: { en: 'Previous block', vi: 'Block trước' },
      next: { en: 'Next block', vi: 'Block kế tiếp' },
      scrub: { en: 'Move between blocks', vi: 'Di chuyển giữa các block' },
      jumpTo: { en: 'Jump to block', vi: 'Nhảy tới block' },
      speed: { en: 'Speed', vi: 'Tốc độ' },
      inputMap: { en: 'input map', vi: 'bản đồ vào' },
      outputMap: { en: 'output map', vi: 'bản đồ ra' },
      kernel: { en: '3x3 kernel', vi: 'kernel 3x3' },
      poolWindow: { en: 'pool window', vi: 'cửa sổ pool' },
      pooledOutput: { en: 'pooled output', vi: 'đầu ra pool' },
      activations: { en: 'activations', vi: 'activation' },
      reluOutput: { en: 'ReLU output', vi: 'đầu ra ReLU' },
      flattenVector: { en: 'flat vector', vi: 'vector phẳng' },
      classScores: { en: 'class scores', vi: 'điểm lớp' },
      inputVector: { en: 'input vector', vi: 'vector vào' },
      inputX: { en: 'input x', vi: 'x đầu vào' },
      logits: { en: 'logits', vi: 'logit' },
      probabilities: { en: 'probabilities sum to 1', vi: 'xác suất có tổng bằng 1' },
      averagedOutput: { en: 'averaged output', vi: 'đầu ra trung bình' },
      fixedOutput: { en: 'fixed output', vi: 'đầu ra cố định' },
      meanWindow: { en: 'mean(window)', vi: 'trung bình(cửa sổ)' },
      targetShape: {
        en: (shape: string) => `target ${shape}`,
        vi: (shape: string) => `đích ${shape}`,
      },
      concatAxisAdd: { en: 'dim +', vi: 'trục +' },
      perChannelStats: { en: 'per channel stats', vi: 'thống kê theo kênh' },
      perSampleFeatures: { en: 'per sample features', vi: 'đặc trưng theo mẫu' },
      convCaption: { en: 'Conv2d: read window, write output cell', vi: 'Conv2d: đọc window, ghi cell ra' },
      poolCaption: { en: 'MaxPool: keep the strongest value per window', vi: 'MaxPool: giữ giá trị mạnh nhất mỗi window' },
      avgPoolCaption: { en: 'AvgPool: average each local window', vi: 'AvgPool: lấy trung bình mỗi cửa sổ cục bộ' },
      adaptiveAvgPoolCaption: {
        en: 'AdaptiveAvgPool: resize regions to target grid',
        vi: 'AdaptiveAvgPool: co vùng về lưới đích',
      },
      reluCaption: { en: 'ReLU: clamp negatives to zero', vi: 'ReLU: chặn giá trị âm về 0' },
      sigmoidCaption: { en: 'Sigmoid: squeeze to 0..1', vi: 'Sigmoid: nén về 0..1' },
      tanhCaption: { en: 'Tanh: squeeze to -1..1', vi: 'Tanh: nén về -1..1' },
      geluCaption: { en: 'GELU: smooth activation gate', vi: 'GELU: cổng activation mượt' },
      siluCaption: { en: 'SiLU: x · sigmoid(x)', vi: 'SiLU: x · sigmoid(x)' },
      activationCaption: { en: 'Activation: transform values', vi: 'Activation: biến đổi giá trị' },
      flattenCaption: { en: 'Flatten: unroll feature map into vector', vi: 'Flatten: trải feature map thành vector' },
      reshapeCaption: { en: 'Reshape/View: same values, new dimensions', vi: 'Reshape/View: giữ giá trị, đổi kích thước' },
      permuteCaption: { en: 'Permute/Transpose: reorder axes', vi: 'Permute/Transpose: đổi thứ tự trục' },
      addResidualCaption: { en: 'Add/Residual: elementwise merge', vi: 'Add/Residual: gộp từng phần tử' },
      concatCaption: { en: 'Concat: stitch tensors along an axis', vi: 'Concat: nối tensor theo một trục' },
      normBatchCaption: { en: 'BatchNorm: center, scale, shift', vi: 'BatchNorm: căn giữa, scale, shift' },
      normLayerCaption: { en: 'LayerNorm: center, scale, shift', vi: 'LayerNorm: căn giữa, scale, shift' },
      dropoutCaption: { en: 'Dropout: mask random activations during training', vi: 'Dropout: che ngẫu nhiên activation khi huấn luyện' },
      softmaxCaption: { en: 'Softmax: logits become class probabilities', vi: 'Softmax: biến logit thành xác suất lớp' },
      linearCaption: { en: 'Linear: weighted sums produce class scores', vi: 'Linear: tổng có trọng số tạo điểm lớp' },
      orderPreserved: { en: 'order preserved', vi: 'giữ nguyên thứ tự' },
      axisOrderChanges: { en: 'values stay, axis order changes', vi: 'giữ giá trị, đổi thứ tự trục' },
      dropoutFormula: { en: 'mask · x / keep', vi: 'mask · x / keep' },
    },
  },
  layerInsight: {
    paramsLabel: {
      en: (params: string) => `${params} params`,
      vi: (params: string) => `${params} tham số`,
    },
    parameterTitle: {
      en: (opType: string) => `${opType} parameters`,
      vi: (opType: string) => `Tham số của ${opType}`,
    },
    noTrainableWeights: { en: 'No trainable weights', vi: 'Không có trọng số huấn luyện được' },
    zeroTrainableParameters: { en: '0 trainable parameters', vi: '0 tham số huấn luyện được' },
    trainableParameters: {
      en: (params: string) => `${params} trainable parameters`,
      vi: (params: string) => `${params} tham số huấn luyện được`,
    },
    totalTrainableParameters: {
      en: (params: string) => `${params} total trainable parameters`,
      vi: (params: string) => `Tổng ${params} tham số huấn luyện được`,
    },
    features: { en: 'features', vi: 'đặc trưng' },
    why: {
      conv: {
        en: 'Learns local feature filters such as edges, textures, and spatial patterns.',
        vi: 'Học các bộ lọc đặc trưng cục bộ như biên, kết cấu và mẫu không gian.',
      },
      linear: {
        en: 'Mixes features into task-specific scores or embeddings.',
        vi: 'Trộn các đặc trưng thành điểm số hoặc embedding chuyên biệt cho tác vụ.',
      },
      pool: {
        en: 'Reduces spatial size while keeping the strongest or averaged signals.',
        vi: 'Giảm kích thước không gian trong khi giữ các tín hiệu mạnh nhất hoặc trung bình.',
      },
      norm: {
        en: 'Stabilizes activations so training is less sensitive to scale shifts.',
        vi: 'Ổn định activation để quá trình huấn luyện ít nhạy với thay đổi thang đo.',
      },
      activation: {
        en: 'Adds non-linearity so stacked layers can model more complex patterns.',
        vi: 'Thêm tính phi tuyến để các lớp xếp chồng mô hình hóa được mẫu phức tạp hơn.',
      },
      dropout: {
        en: 'Randomly masks activations during training to reduce overfitting while keeping the tensor shape.',
        vi: 'Che ngẫu nhiên activation trong lúc huấn luyện để giảm overfit, đồng thời giữ nguyên kích thước tensor.',
      },
      transform: {
        en: 'Changes tensor layout so the next layer receives the expected shape.',
        vi: 'Thay đổi bố cục tensor để lớp tiếp theo nhận đúng kích thước mong đợi.',
      },
      addConcat: {
        en: 'Merges paths, commonly used for residual connections or feature fusion.',
        vi: 'Gộp các nhánh, thường dùng cho kết nối residual hoặc hợp nhất đặc trưng.',
      },
      attention: {
        en: 'Lets tokens or positions weight the most relevant context dynamically.',
        vi: 'Cho phép token hoặc vị trí gán trọng số động cho ngữ cảnh liên quan nhất.',
      },
      embedding: {
        en: 'Turns discrete ids into learned dense vectors.',
        vi: 'Biến id rời rạc thành vector đặc dày đã học.',
      },
      rnn: {
        en: 'Processes sequence state over time for ordered inputs.',
        vi: 'Xử lý trạng thái chuỗi theo thời gian cho dữ liệu có thứ tự.',
      },
      upsample: {
        en: 'Increases spatial resolution for decoder or segmentation outputs.',
        vi: 'Tăng độ phân giải không gian cho decoder hoặc đầu ra segmentation.',
      },
      container: {
        en: 'Groups child layers so the model structure is easier to scan.',
        vi: 'Nhóm các lớp con để cấu trúc mô hình dễ quét hơn.',
      },
      default: {
        en: 'Transforms tensor data for the next step in the model.',
        vi: 'Biến đổi dữ liệu tensor cho bước tiếp theo trong mô hình.',
      },
    },
    notes: {
      biasOutputChannel: {
        en: 'Bias is counted as one value per output channel.',
        vi: 'Bias được tính là một giá trị cho mỗi kênh đầu ra.',
      },
      biasOutputFeature: {
        en: 'Bias is counted as one value per output feature.',
        vi: 'Bias được tính là một giá trị cho mỗi đặc trưng đầu ra.',
      },
      normGammaBeta: {
        en: 'Normalization layers usually learn gamma and beta.',
        vi: 'Các lớp chuẩn hóa thường học gamma và beta.',
      },
      layerCountIncluded: {
        en: 'Layer count is included in the total reported by the model.',
        vi: 'Số lớp đã được tính trong tổng mà mô hình báo cáo.',
      },
      attentionHeads: {
        en: (heads: unknown) => `${heads} attention heads.`,
        vi: (heads: unknown) => `${heads} attention head.`,
      },
    },
    formula: {
      conv: {
        en: '(kernel_h x kernel_w x in_channels + bias) x out_channels',
        vi: '(kernel_h x kernel_w x in_channels + bias) x out_channels',
      },
      linear: { en: '(in_features + bias) x out_features', vi: '(in_features + bias) x out_features' },
      norm: { en: 'scale + shift', vi: 'scale + shift' },
      attention: { en: '4 x (embed_dim x embed_dim + bias)', vi: '4 x (embed_dim x embed_dim + bias)' },
      embedding: { en: 'num_embeddings x embedding_dim', vi: 'num_embeddings x embedding_dim' },
      reportedByLayer: { en: 'Reported by layer implementation', vi: 'Được báo cáo bởi triển khai lớp' },
    },
  },
  paramFormula: {
    title: { en: 'Parameter formula', vi: 'Công thức tham số' },
    close: { en: 'Close', vi: 'Đóng' },
    formula: { en: 'Formula', vi: 'Công thức' },
    calculation: { en: 'Calculation', vi: 'Tính toán' },
  },
  export: {
    title: { en: 'Export Visualization', vi: 'Xuất hình trực quan' },
    description: {
      en: 'Generate a publication-ready vector graphic or capture the current 3D view.',
      vi: 'Tạo đồ họa vector sẵn sàng cho xuất bản hoặc chụp góc nhìn 3D hiện tại.',
    },
    svgSettings: { en: 'SVG Settings', vi: 'Thiết lập SVG' },
    lightTheme: { en: 'Light Theme (Print-friendly)', vi: 'Giao diện sáng (thân thiện khi in)' },
    transparentBackground: { en: 'Transparent Background', vi: 'Nền trong suốt' },
    includeLegend: { en: 'Include Legend', vi: 'Kèm chú giải' },
    exportScale: { en: 'Export Scale', vi: 'Tỉ lệ xuất' },
    textScale: { en: 'Text Scale', vi: 'Tỉ lệ chữ' },
    strokeScale: { en: 'Stroke Scale', vi: 'Tỉ lệ nét' },
    padding: { en: 'Padding', vi: 'Khoảng đệm' },
    downloadSvg: { en: 'Download SVG', vi: 'Tải SVG' },
    exportScreenPng: { en: 'Export Screen (PNG)', vi: 'Xuất màn hình (PNG)' },
    pngDescription: { en: 'High-quality snapshot of the 3D canvas', vi: 'Ảnh chụp chất lượng cao của canvas 3D' },
    resolution: { en: 'Resolution', vi: 'Độ phân giải' },
    downloadPng: {
      en: (scale: number) => `Download PNG (${scale}x)`,
      vi: (scale: number) => `Tải PNG (${scale}x)`,
    },
    cancel: { en: 'Cancel', vi: 'Hủy' },
    options: {
      smallHalf: { en: 'Small (0.5x)', vi: 'Nhỏ (0.5x)' },
      normal: { en: 'Normal (1x)', vi: 'Bình thường (1x)' },
      normalPlain: { en: 'Normal', vi: 'Bình thường' },
      largeDouble: { en: 'Large (2x)', vi: 'Lớn (2x)' },
      large125: { en: 'Large (1.25x)', vi: 'Lớn (1.25x)' },
      hugeQuad: { en: 'Huge (4x)', vi: 'Rất lớn (4x)' },
      compact: { en: 'Compact (0.75x)', vi: 'Gọn (0.75x)' },
      larger: { en: 'Larger (1.5x)', vi: 'Lớn hơn (1.5x)' },
      xlDouble: { en: 'XL (2x)', vi: 'XL (2x)' },
      thin: { en: 'Thin (0.5x)', vi: 'Mảnh (0.5x)' },
      thick: { en: 'Thick (1.5x)', vi: 'Dày (1.5x)' },
      boldDouble: { en: 'Bold (2x)', vi: 'Đậm (2x)' },
      tight: { en: 'Tight', vi: 'Sát' },
      spacious: { en: 'Spacious', vi: 'Rộng' },
      screen: { en: '1x (Screen)', vi: '1x (Màn hình)' },
      highDpi: { en: '2x (High DPI)', vi: '2x (DPI cao)' },
      print: { en: '3x (Print)', vi: '3x (In ấn)' },
      ultra: { en: '4x (Ultra)', vi: '4x (Ultra)' },
    },
  },
  help: {
    title: { en: 'User Guide', vi: 'Hướng dẫn sử dụng' },
    description: {
      en: 'How to navigate and interact with the 3D visualization.',
      vi: 'Cách điều hướng và tương tác với trực quan hóa 3D.',
    },
    navigation: { en: 'Navigation', vi: 'Điều hướng' },
    leftButton: { en: 'Left btn', vi: 'Nút trái' },
    rightButton: { en: 'Right btn', vi: 'Nút phải' },
    scroll: { en: 'Scroll', vi: 'Cuộn' },
    pan: { en: 'Click + drag: Pan', vi: 'Bấm + kéo: Di chuyển' },
    rotateCamera: { en: 'Click + drag: Rotate camera', vi: 'Bấm + kéo: Xoay camera' },
    zoom: { en: 'Zoom in / out', vi: 'Phóng to / thu nhỏ' },
    interaction: { en: 'Interaction', vi: 'Tương tác' },
    clickBlocks: {
      en: 'Click blocks to view details in the right panel.',
      vi: 'Bấm vào các khối để xem chi tiết ở khung bên phải.',
    },
    clickPlus: { en: 'Click the', vi: 'Bấm nút' },
    plusButtonRest: { en: 'button on collapsed blocks to expand.', vi: 'trên khối đã thu gọn để mở rộng.' },
    clickMinus: { en: 'Click the', vi: 'Bấm nút' },
    minusButtonRest: {
      en: 'button on the top corner of expanded blocks to collapse.',
      vi: 'ở góc trên của khối đã mở để thu gọn.',
    },
    code: { en: 'Code', vi: 'Mã' },
    codeBeforeModel: { en: 'Define a', vi: 'Định nghĩa biến' },
    codeAfterModel: { en: 'variable in the Python editor, then press', vi: 'trong trình soạn thảo Python, rồi bấm' },
    codeAfterVisualize: { en: 'to generate the graph.', vi: 'để tạo đồ thị.' },
    gotIt: { en: 'Got it', vi: 'Đã hiểu' },
  },
  tour: {
    terminalSuccessTitle: { en: 'Terminal: Success', vi: 'Terminal: Thành công' },
    terminalErrorTitle: { en: 'Terminal: Errors', vi: 'Terminal: Lỗi' },
    ariaLabel: { en: 'Onboarding tour', vi: 'Hướng dẫn làm quen' },
    skip: { en: 'Skip', vi: 'Bỏ qua' },
    back: { en: 'Back', vi: 'Quay lại' },
    done: { en: 'Done', vi: 'Hoàn tất' },
    next: { en: 'Next', vi: 'Tiếp' },
    rightClickFirst: { en: 'Right click first', vi: 'Bấm chuột phải trước' },
    leftClickFirst: { en: 'Left click first', vi: 'Bấm chuột trái trước' },
    stepLabel: {
      en: (step: number) => `Step ${step}`,
      vi: (step: number) => `Bước ${step}`,
    },
    steps: [
      {
        title: { en: 'Templates', vi: 'Mẫu kiến trúc' },
        body: {
          en: 'Start from a model template when you want a quick example graph.',
          vi: 'Bắt đầu từ một mẫu mô hình khi bạn muốn có đồ thị ví dụ nhanh.',
        },
      },
      {
        title: { en: 'Input shape', vi: 'Kích thước đầu vào' },
        body: {
          en: 'Set the tensor shape used to trace the model and calculate layer outputs.',
          vi: 'Đặt kích thước tensor dùng để trace mô hình và tính đầu ra từng lớp.',
        },
      },
      {
        title: { en: 'Editor', vi: 'Trình soạn thảo' },
        body: { en: 'Write or adjust PyTorch-style model code here.', vi: 'Viết hoặc chỉnh mã kiểu PyTorch tại đây.' },
      },
      {
        title: { en: 'Visualize', vi: 'Trực quan hóa' },
        body: { en: 'Click to run the model trace and build the 3D graph.', vi: 'Bấm để chạy trace mô hình và dựng đồ thị 3D.' },
      },
      {
        title: { en: 'Canvas: Left click', vi: 'Canvas: Chuột trái' },
        body: {
          en: 'Left click and drag inside the canvas to pan the 3D view.',
          vi: 'Bấm chuột trái và kéo trong canvas để di chuyển góc nhìn 3D.',
        },
      },
      {
        title: { en: 'Canvas: Right click', vi: 'Canvas: Chuột phải' },
        body: {
          en: 'Right click and drag inside the canvas to rotate the 3D view.',
          vi: 'Bấm chuột phải và kéo trong canvas để xoay góc nhìn 3D.',
        },
      },
      {
        title: { en: 'Parameter formulas', vi: 'Công thức tham số' },
        body: {
          en: 'Click any layer block to open a popup with the parameter formula. Hover still shows names, shapes, counts, and why the layer matters.',
          vi: 'Bấm vào bất kỳ khối lớp nào để mở bảng công thức tham số. Khi di chuột vẫn thấy tên, kích thước, số lượng và lý do lớp đó quan trọng.',
        },
      },
      {
        title: { en: 'Reset view', vi: 'Đặt lại góc nhìn' },
        body: {
          en: 'Use this button to recenter the camera after panning, rotating, or zooming.',
          vi: 'Dùng nút này để đưa camera về giữa sau khi di chuyển, xoay hoặc thu phóng.',
        },
      },
      {
        title: { en: 'Structure', vi: 'Cấu trúc' },
        body: {
          en: 'Browse the model tree, select layers, and jump between nested modules.',
          vi: 'Duyệt cây mô hình, chọn lớp và nhảy giữa các mô-đun lồng nhau.',
        },
      },
      {
        title: { en: 'Details', vi: 'Chi tiết' },
        body: {
          en: 'Selected layers show secondary metadata, formula breakdowns, source line, and errors here.',
          vi: 'Các lớp được chọn sẽ hiển thị metadata phụ, phân tích công thức, dòng nguồn và lỗi tại đây.',
        },
      },
      {
        title: { en: 'Terminal: Success', vi: 'Terminal: Thành công' },
        body: {
          en: 'When the trace succeeds, the terminal confirms the graph build and shows the generated parameter total.',
          vi: 'Khi trace thành công, terminal xác nhận đồ thị đã dựng và hiển thị tổng tham số được tạo.',
        },
      },
      {
        title: { en: 'Terminal: Errors', vi: 'Terminal: Lỗi' },
        body: {
          en: 'If setup or code is wrong, the terminal reports the error directly with a line number, message, and hint.',
          vi: 'Nếu thiết lập hoặc mã sai, terminal báo lỗi trực tiếp với số dòng, thông báo và gợi ý.',
        },
      },
      {
        title: { en: 'Export SVG', vi: 'Xuất SVG' },
        body: {
          en: 'Export the current graph as an SVG once a model has been visualized.',
          vi: 'Xuất đồ thị hiện tại thành SVG sau khi mô hình đã được trực quan hóa.',
        },
      },
      {
        title: { en: 'Help', vi: 'Trợ giúp' },
        body: {
          en: 'Open the help panel when you need controls, tips, or supported syntax.',
          vi: 'Mở khung trợ giúp khi bạn cần điều khiển, mẹo hoặc cú pháp được hỗ trợ.',
        },
      },
    ],
  },
} satisfies Record<string, LocalizedNode>;

function isLocalizedPair(value: unknown): value is LocalizedPair {
  return !!value && typeof value === 'object' && 'en' in value && 'vi' in value;
}

function selectLocalizedText(node: LocalizedNode, language: Language): any {
  if (Array.isArray(node)) return node.map((item) => selectLocalizedText(item, language));
  if (isLocalizedPair(node)) return node[language];

  return Object.fromEntries(
    Object.entries(node).map(([key, value]) => [key, selectLocalizedText(value, language)]),
  );
}

export const strings = {
  en: selectLocalizedText(localizedText, 'en'),
  vi: selectLocalizedText(localizedText, 'vi'),
};

export type LocalizedStrings = typeof strings.en;

export function getStrings(language: Language): LocalizedStrings {
  return strings[language] ?? strings.en;
}

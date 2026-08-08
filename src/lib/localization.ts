export type Language = 'en' | 'vi';

export const LANGUAGE_OPTIONS: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'vi', label: 'Tiếng Việt' },
];

type LocalizedFormatter =
  | (() => string)
  | ((value: string) => string)
  | ((value: number) => string)
  | ((value: unknown) => string)
  | ((first: string, second: string) => string)
  | ((first: number, second: number) => string)
  | ((first: number, second: number, third: number) => string);
type LocalizedValue = string | LocalizedFormatter;
type LocalizedPair = Record<Language, LocalizedValue>;
type LocalizedNode = LocalizedPair | { [key: string]: LocalizedNode } | LocalizedNode[];
type SelectedLocalizedText<T> =
  T extends LocalizedPair ? T[Language]
  : T extends readonly (infer Item)[] ? SelectedLocalizedText<Item>[]
  : T extends object ? { [Key in keyof T]: SelectedLocalizedText<T[Key]> }
  : never;

const localizedText = {
  app: {
    language: { en: 'Language', vi: 'Ngôn ngữ' },
    switchToEnglish: { en: 'Switch to English', vi: 'Chuyển sang English' },
    switchToVietnamese: { en: 'Switch to Vietnamese', vi: 'Chuyển sang Tiếng Việt' },
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
    landing: { en: 'Landing', vi: 'Trang chính' },
    backToLanding: { en: 'Back to Landing', vi: 'Quay lại trang chính' },
  },
  landingPage: {
    language: { en: 'Language', vi: 'Ngôn ngữ' },
    eyebrow: {
      en: 'Browser-native neural network diagrams',
      vi: 'Sơ đồ mạng neural chạy trực tiếp trong trình duyệt',
    },
    title: { en: 'TorchViz 3D', vi: 'TorchViz 3D' },
    subtitle: { en: 'From interaction to understanding', vi: 'Từ tương tác đến thấu hiểu' },
    description: {
      en: 'Explore model architecture visually, trace tensor shapes locally, and build intuition for how each layer transforms data.',
      vi: 'Khám phá kiến trúc mô hình bằng trực quan, truy vết tensor shape cục bộ, và xây dựng trực giác về cách từng layer biến đổi dữ liệu.',
    },
    workspaceTitle: { en: 'TorchViz-3D Workspace', vi: 'Không gian TorchViz-3D' },
    workspaceDescription: {
      en: 'Open the editor, run shape tracing, and explore the rendered model graph.',
      vi: 'Mở editor, chạy truy vết shape, và khám phá graph mô hình đã render.',
    },
    workspaceOpen: { en: 'Open workspace', vi: 'Mở workspace' },
    learningTitle: { en: 'Learning Lab', vi: 'Learning Lab' },
    learningDescription: {
      en: 'One learning lab for ML foundations, CV, NLP, Reinforcement Learning, and future Robot Learning.',
      vi: 'Một Learning Lab cho ML foundations, CV, NLP, Reinforcement Learning và Robot Learning sau này.',
    },
    learningOpen: { en: 'Start learning', vi: 'Bắt đầu học' },
    stages: {
      convolution: {
        title: { en: 'Convolution', vi: 'Convolution' },
        caption: { en: 'extract edges', vi: 'trích xuất biên' },
      },
      activation: {
        title: { en: 'Activation', vi: 'Activation' },
        caption: { en: 'apply nonlinearity', vi: 'áp dụng phi tuyến' },
      },
      pooling: {
        title: { en: 'Pooling', vi: 'Pooling' },
        caption: { en: 'compress map', vi: 'nén feature map' },
      },
      classifier: {
        title: { en: 'Classifier', vi: 'Classifier' },
        caption: { en: 'score classes', vi: 'chấm điểm lớp' },
      },
    },
  },
  learningLab: {
    home: { en: 'Home', vi: 'Trang chủ' },
    path: { en: 'Path', vi: 'Lộ trình' },
    review: { en: 'Review', vi: 'Ôn tập' },
    reviewTitle: { en: 'Quick exercise review', vi: 'Ôn nhanh bằng bài tập' },
    reviewDescription: {
      en: 'Open any published exercise lesson directly without searching through the full catalog.',
      vi: 'Mở trực tiếp các bài tập đã hoàn thiện mà không cần tìm lại trong toàn bộ catalog.',
    },
    reviewEmpty: { en: 'No review exercises are available yet.', vi: 'Chưa có bài tập ôn tập nào.' },
    backToLanding: { en: 'Back to landing', vi: 'Quay lại trang chính' },
    openSidebar: { en: 'Open sidebar', vi: 'Mở thanh điều hướng' },
    closeSidebar: { en: 'Close sidebar', vi: 'Đóng thanh điều hướng' },
    sidebarDomains: { en: 'Domains', vi: 'Domain' },
    searchLabel: { en: 'Learning Lab', vi: 'Learning Lab' },
    domainCatalogLabel: { en: 'Learning Lab catalog', vi: 'Learning Lab catalog' },
    domainCatalogTitle: { en: 'Choose a learning domain', vi: 'Chọn domain học tập' },
    domainCatalogDescription: {
      en: 'Pick the model area you want to explore first. Each domain opens a focused learning path.',
      vi: 'Chọn vùng kiến thức muốn khám phá trước. Mỗi domain mở một lộ trình học tập tập trung.',
    },
    homePage: {
      simpleTitle: {
        en: 'A visual learning lab for neural networks.',
        vi: 'Một learning lab trực quan cho neural networks.',
      },
      projectLabel: { en: 'Goal', vi: 'Mục tiêu' },
      idealVisualTitle: { en: 'Simple and Clear', vi: 'Đơn Giản, Dễ Hiểu' },
      idealVisualBody: {
        en: 'Each lesson stays focused: less noise, fewer unnecessary terms, and enough context to know what you are looking at.',
        vi: 'Mỗi phần học giữ đúng trọng tâm: ít nhiễu, ít thuật ngữ thừa, và đủ rõ để bạn biết mình đang nhìn vào điều gì.',
      },
      idealLocalTitle: { en: 'Visual Learning', vi: 'Học Bằng Trực Quan' },
      idealLocalBody: {
        en: 'Follow authored lessons, inspect visual explanations, and connect each concept to the model pipeline.',
        vi: 'Theo dõi bài học hoàn chỉnh, quan sát giải thích trực quan, và kết nối từng khái niệm với pipeline của model.',
      },
      idealHumanTitle: { en: 'Plain-Language Theory', vi: 'Lý Thuyết Dễ Hiểu' },
      idealHumanBody: {
        en: 'Start with simple words first, then bring in formulas, code, and technical details only when they are needed.',
        vi: 'Giải thích bằng từ đơn giản trước, rồi mới đi vào công thức, code và chi tiết kỹ thuật khi thật sự cần.',
      },
      syllabusLabel: { en: 'Syllabus index', vi: 'Mục lục khóa học' },
    },
    domainAvailable: { en: 'Available', vi: 'Sẵn sàng' },
    domainPlaceholder: { en: 'Placeholder', vi: 'Đang cập nhật' },
    openDomain: { en: "Let's go", vi: "Let's go" },
    startTrack: { en: "Let's go", vi: "Let's go" },
    contentInProgress: { en: 'Content is in progress.', vi: 'Nội dung đang hoàn thiện.' },
    lessonSearchPlaceholder: { en: 'Search lessons', vi: 'Tìm bài học' },
    lessonFilterLabel: { en: 'Lesson filters', vi: 'Bộ lọc bài học' },
    lessonFilters: {
      all: { en: 'All', vi: 'Tất cả' },
      ready: { en: 'Ready', vi: 'Sẵn sàng' },
      locked: { en: 'Locked', vi: 'Đã khóa' },
    },
    lessonFilterCount: {
      en: (first: number, second: number) => `${first}/${second}`,
      vi: (first: number, second: number) => `${first}/${second}`,
    },
    lessonStepCount: {
      en: (first: number, second: number) => `${first} / ${second}`,
      vi: (first: number, second: number) => `${first} / ${second}`,
    },
    lessonPreviousSection: { en: 'Back', vi: 'Quay lại' },
    lessonNextSection: { en: 'Next', vi: 'Tiếp theo' },
    lessonCompleteAndContinue: { en: 'Too easy!', vi: 'Quá dễ!' },
    lessonScrollToContinue: { en: 'Scroll to the bottom to continue.', vi: 'Cuộn xuống cuối trang để tiếp tục.' },
    lessonContentLoading: { en: 'Loading lesson content...', vi: 'Đang tải nội dung bài học...' },
    lessonContentLoadError: { en: 'Lesson content could not be loaded. Please try again.', vi: 'Không thể tải nội dung bài học. Vui lòng thử lại.' },
    lessonRailOpenLabel: { en: 'Table of contents', vi: 'Mục lục bài học' },
    lessonRailCloseLabel: { en: 'Hide table of contents', vi: 'Ẩn mục lục bài học' },
    clearLessonSearch: { en: 'Clear lesson search', vi: 'Xóa tìm kiếm bài học' },
    lessonFilterEmpty: { en: 'No lessons match this filter.', vi: 'Không có bài học khớp bộ lọc.' },
    coreIdea: { en: 'Core idea', vi: 'Lý thuyết cốt lõi' },
    quizCategorizeUnsorted: { en: 'Unsorted tokens', vi: 'Token chưa phân loại' },
    quizCategorizeComplete: { en: 'All tokens have been placed.', vi: 'Tất cả token đã được kéo vào nhóm.' },
    lessonCount: {
      en: (count: number) => `${count} ${count === 1 ? 'lesson' : 'lessons'}`,
      vi: (count: number) => `${count} bài học`,
    },
    coursePage: {
      languageEnglish: { en: 'English', vi: 'English' },
      languageVietnamese: { en: 'Tiếng Việt', vi: 'Tiếng Việt' },
      updated: { en: 'Last updated 6/2026', vi: 'Cập nhật lần cuối 6/2026' },
      whatYouWillLearn: { en: "What you'll learn", vi: 'Bạn sẽ học được gì' },
      courseContent: { en: 'Course content', vi: 'Nội dung khóa học' },
      courseSummary: {
        en: (value: unknown) => {
          const { lessons, minutes } = value as { lessons: number; minutes: number };
          return `${lessons} ${lessons === 1 ? 'lesson' : 'lessons'} - ${minutes} min`;
        },
        vi: (value: unknown) => {
          const { lessons, minutes } = value as { lessons: number; minutes: number };
          return `${lessons} bài học - ${minutes} phút`;
        },
      },
      trackSummary: {
        en: (value: unknown) => {
          const { lessons, minutes, description } = value as { lessons: number; minutes: number; description: string };
          return `${lessons} ${lessons === 1 ? 'lesson' : 'lessons'} - ${minutes} min - ${description}`;
        },
        vi: (value: unknown) => {
          const { lessons, minutes, description } = value as { lessons: number; minutes: number; description: string };
          return `${lessons} bài học - ${minutes} phút - ${description}`;
        },
      },
      masterLesson: {
        en: (title: string) => `Master ${title}.`,
        vi: (title: string) => `Nắm chắc ${title}.`,
      },
      generic: {
        requirementsTitle: { en: 'Requirements', vi: 'Yêu cầu' },
        requirements: [
          { en: 'Basic Python.', vi: 'Python cơ bản.' },
          { en: 'Basic tensors.', vi: 'Tensor cơ bản.' },
          { en: 'No prior experience.', vi: 'Không cần kinh nghiệm trước.' },
        ],
        descriptionTitle: { en: 'Description', vi: 'Mô tả' },
        organizedDescription: {
          en: (tracks: string) => `This path is organized around ${tracks}; authored lessons appear as content becomes available.`,
          vi: (tracks: string) => `Lộ trình này được tổ chức quanh ${tracks}; bài học hoàn chỉnh sẽ xuất hiện khi nội dung sẵn sàng.`,
        },
        placeholderDescription: {
          en: 'This path is prepared as part of Learning Lab and will expand as more lessons are added.',
          vi: 'Lộ trình này là một phần của Learning Lab và sẽ mở rộng khi có thêm bài học.',
        },
        goalDescription: {
          en: 'The goal is to build enough intuition to inspect model behavior visually instead of memorizing formulas or framework boilerplate.',
          vi: 'Mục tiêu là xây đủ trực giác để quan sát hành vi model bằng trực quan, thay vì ghi nhớ công thức hoặc framework boilerplate.',
        },
      },
    },
    theory: { en: 'Theory', vi: 'Lý thuyết' },
    check: { en: 'Check', vi: 'Kiểm tra' },
    reset: { en: 'Reset', vi: 'Làm lại' },
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
    expandAll: { en: 'Expand all architecture blocks', vi: 'Mở rộng tất cả khối kiến trúc' },
    collapseAll: { en: 'Collapse all architecture blocks', vi: 'Thu gọn tất cả khối kiến trúc' },
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
      title: { en: 'Forward pass', vi: 'Lan truyền xuôi' },
      mode: { en: 'Forward pass', vi: 'Lan truyền xuôi' },
      unavailable: {
        en: 'Forward pass needs a visualized model with at least one layer',
        vi: 'Lan truyền xuôi cần một mô hình đã trực quan hóa với ít nhất một lớp',
      },
      modeOn: { en: 'On', vi: 'Bật' },
      modeOff: { en: 'Off', vi: 'Tắt' },
      input: { en: 'Input image', vi: 'Ảnh đầu vào' },
      play: { en: 'Play forward pass', vi: 'Phát lan truyền xuôi' },
      pause: { en: 'Pause forward pass', vi: 'Tạm dừng lan truyền xuôi' },
      previous: { en: 'Previous block', vi: 'Block trước' },
      next: { en: 'Next block', vi: 'Block kế tiếp' },
      scrub: { en: 'Move between blocks', vi: 'Di chuyển giữa các block' },
      jumpTo: { en: 'Jump to block', vi: 'Nhảy tới block' },
      speed: { en: 'Speed', vi: 'Tốc độ' },
      step: { en: 'Step', vi: 'Bước' },
      exercises: { en: 'Exercises', vi: 'Bài tập' },
      learningExerciseMenu: { en: 'Open lesson...', vi: 'Mở bài ôn tập...' },
      exerciseShape: { en: 'Shape', vi: 'Shape' },
      exerciseValue: { en: 'Value', vi: 'Giá trị' },
      exerciseConvValue: { en: 'Conv value', vi: 'Giá trị Conv' },
      shapeExerciseTitle: { en: 'Shape exercise', vi: 'Bài tập shape' },
      inputShapeLabel: { en: 'Input shape', vi: 'Shape đầu vào' },
      layerConfigLabel: { en: 'Layer config', vi: 'Cấu hình lớp' },
      formulaLabel: { en: 'Formula', vi: 'Công thức' },
      enterOutputShape: { en: 'Enter output shape', vi: 'Nhập shape đầu ra' },
      enterAnswer: { en: 'Enter answer', vi: 'Nhập đáp án' },
      checkAnswer: { en: 'Check answer', vi: 'Kiểm tra' },
      correct: { en: 'Correct', vi: 'Đúng' },
      expected: { en: (value: number) => `Expected ${value}`, vi: (value: number) => `Đáp án ${value}` },
      noShapeExercise: {
        en: 'This layer does not expose enough shape data for the exercise.',
        vi: 'Lớp này chưa có đủ dữ liệu shape cho bài tập.',
      },
      noValueExercise: {
        en: 'This layer does not expose a compatible value exercise.',
        vi: 'Lớp này chưa có bài tập giá trị phù hợp.',
      },
      chooseExercise: { en: 'Choose...', vi: 'Chọn...' },
      noExercises: { en: 'None', vi: 'Không có' },
      noExercisesTooltip: { en: 'No exercise is available for this step yet.', vi: 'Chưa có bài tập cho bước này.' },
      convExercise: { en: 'Conv2d exercise', vi: 'Bài tập Conv2d' },
      exerciseTitle: { en: 'Conv2d exercise', vi: 'Bài tập Conv2d' },
      exerciseDifficulty: {
        en: (difficulty: string) => difficulty,
        vi: (difficulty: string) => ({ easy: 'Dễ', medium: 'Vừa', hard: 'Khó' }[difficulty] ?? difficulty),
      },
      editableKernel: { en: 'editable kernel', vi: 'kernel chỉnh được' },
      randomKernel: { en: 'Randomly change', vi: 'Đổi ngẫu nhiên' },
      channelLabel: {
        en: (channel: number) => `channel ${channel}`,
        vi: (channel: number) => `kênh ${channel}`,
      },
      changeChannel: { en: 'Change channel', vi: 'Đổi kênh' },
      kernelCell: {
        en: (channel: number, row: number, col: number) => `Kernel channel ${channel}, row ${row}, column ${col}`,
        vi: (channel: number, row: number, col: number) => `Kernel kênh ${channel}, hàng ${row}, cột ${col}`,
      },
      exerciseInstruction: {
        en: 'Enter values to 2 decimals, then check your work.',
        vi: 'Nhập giá trị với 2 chữ số thập phân, rồi kiểm tra đáp án.',
      },
      hintExercise: { en: 'Hint', vi: 'Gợi ý' },
      shapeExercise: {
        previousHintStep: { en: 'Previous hint step', vi: 'Bước gợi ý trước' },
        nextHintStep: { en: 'Next hint step', vi: 'Bước gợi ý tiếp theo' },
        playHintSteps: { en: 'Play hint steps', vi: 'Chạy các bước gợi ý' },
        pauseHintSteps: { en: 'Pause hint steps', vi: 'Tạm dừng các bước gợi ý' },
        useIntegerValues: { en: 'Use integer values.', vi: 'Dùng giá trị integer.' },
        invalidInputShape: { en: 'Invalid input shape', vi: 'Input shape không hợp lệ' },
        invalidConfig: { en: 'Invalid config', vi: 'Config không hợp lệ' },
        fields: {
          outChannels: { en: 'out channels', vi: 'out channels' },
          padding: { en: 'padding', vi: 'padding' },
          kernel: { en: 'kernel', vi: 'kernel' },
          stride: { en: 'stride', vi: 'stride' },
          dilation: { en: 'dilation', vi: 'dilation' },
          outputH: { en: 'output h', vi: 'output h' },
          outputW: { en: 'output w', vi: 'output w' },
        },
      },
      valueExercise: {
        inputTable: { en: 'Input table', vi: 'Bảng input' },
        poolingConfig: { en: 'Pooling config', vi: 'Config pooling' },
        poolingType: { en: 'Pooling type', vi: 'Loại pooling' },
        fillOutput: { en: 'Fill output', vi: 'Điền output' },
        inputVector: { en: 'Input vector', vi: 'Vector input' },
        reluKeepsPositive: {
          en: 'ReLU keeps positive values and clamps negative values to 0.',
          vi: 'ReLU giữ giá trị dương và đưa giá trị âm về 0.',
        },
        generalRule: { en: 'General Rule:', vi: 'Quy tắc chung:' },
        outputCell: {
          en: (index: number) => `Output cell ${index}`,
          vi: (index: number) => `Ô output ${index}`,
        },
        poolHint: {
          en: (value: unknown) => {
            const { stride, outputRow, outputCol, windowRow, windowCol, mode } = value as {
              stride: number;
              outputRow: number;
              outputCol: number;
              windowRow: number;
              windowCol: number;
              mode: 'max' | 'avg';
            };
            return `With stride = ${stride}, output (${outputRow}, ${outputCol}) reads the window starting at row ${windowRow}, col ${windowCol}; then takes the ${mode === 'max' ? 'maximum value' : 'average'} from that window.`;
          },
          vi: (value: unknown) => {
            const { stride, outputRow, outputCol, windowRow, windowCol, mode } = value as {
              stride: number;
              outputRow: number;
              outputCol: number;
              windowRow: number;
              windowCol: number;
              mode: 'max' | 'avg';
            };
            return `Với stride = ${stride}, ô output (${outputRow}, ${outputCol}) đọc window bắt đầu tại hàng ${windowRow}, cột ${windowCol}; sau đó lấy ${mode === 'max' ? 'giá trị lớn nhất' : 'trung bình'} trong window.`;
          },
        },
        poolHintIdle: {
          en: 'Press Hint to inspect one output cell.',
          vi: 'Bấm Hint để xem một ô output.',
        },
        activationHint: {
          en: (value: unknown) => {
            const { index, input } = value as { index: number; input: number };
            return `Inspecting element x${index} = ${input}.`;
          },
          vi: (value: unknown) => {
            const { index, input } = value as { index: number; input: number };
            return `Đang xem xét phần tử x${index} = ${input}.`;
          },
        },
        activationHintIdle: {
          en: 'Press Hint to inspect one element.',
          vi: 'Bấm Hint để xem gợi ý từng phần tử.',
        },
        reluGraph: { en: 'ReLU graph', vi: 'Biểu đồ ReLU' },
        negativeInput: { en: 'negative input', vi: 'input âm' },
        positiveInput: { en: 'positive input', vi: 'input dương' },
      },
      hintBreakdownTitle: { en: 'Input x kernel products', vi: 'Input x kernel từng ô' },
      hintFormula: {
        en: (parts: string, total: string) => `${parts} = ${total}`,
        vi: (parts: string, total: string) => `${parts} = ${total}`,
      },
      exerciseResult: {
        en: (correct: number, total: number) => `${correct}/${total} cells correct`,
        vi: (correct: number, total: number) => `Đúng ${correct}/${total} ô`,
      },
      outputCell: {
        en: (row: number, col: number) => `Output cell row ${row}, column ${col}`,
        vi: (row: number, col: number) => `Ô output hàng ${row}, cột ${col}`,
      },
      checkExercise: { en: 'Check', vi: 'Kiểm tra' },
      resetExercise: { en: 'Reset', vi: 'Làm lại' },
      closeExercise: { en: 'Close exercise', vi: 'Đóng bài tập' },
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
      upsampledOutput: { en: 'upsampled output', vi: 'đầu ra phóng to' },
      meanWindow: { en: 'mean(window)', vi: 'trung bình(cửa sổ)' },
      targetShape: {
        en: (shape: string) => `target ${shape}`,
        vi: (shape: string) => `đích ${shape}`,
      },
      upsampleFormula: {
        en: (input: string, output: string) => `${input} -> ${output}`,
        vi: (input: string, output: string) => `${input} -> ${output}`,
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
      upsampleCaption: {
        en: 'Upsample: expand spatial cells',
        vi: 'Upsample: phóng to các ô không gian',
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
      upsampleCopyRule: { en: 'nearest: each input cell copies into a 2x2 block', vi: 'nearest: mỗi ô input sao chép thành block 2x2' },
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
      en: 'Controls, workflow, and model tracing notes for the workspace.',
      vi: 'Điều khiển, quy trình và ghi chú trace mô hình trong workspace.',
    },
    workflow: { en: 'Workflow', vi: 'Quy trình' },
    workflowItems: [
      {
        en: 'Pick a template or edit the model code.',
        vi: 'Chọn mẫu kiến trúc hoặc chỉnh mã mô hình.',
      },
      {
        en: 'Set the input shape, then press Visualize.',
        vi: 'Đặt kích thước đầu vào, rồi bấm Trực quan hóa.',
      },
      {
        en: 'Use the terminal for trace success, errors, and hints.',
        vi: 'Xem terminal để biết trace thành công, lỗi và gợi ý.',
      },
    ],
    navigation: { en: 'Navigation', vi: 'Điều hướng' },
    leftButton: { en: 'Left btn', vi: 'Nút trái' },
    rightButton: { en: 'Right btn', vi: 'Nút phải' },
    scroll: { en: 'Scroll', vi: 'Cuộn' },
    pan: { en: 'Click + drag: Pan', vi: 'Bấm + kéo: Di chuyển' },
    rotateCamera: { en: 'Click + drag: Rotate camera', vi: 'Bấm + kéo: Xoay camera' },
    zoom: { en: 'Zoom in / out', vi: 'Phóng to / thu nhỏ' },
    canvasItems: [
      {
        en: 'Left drag pans the canvas.',
        vi: 'Kéo chuột trái để di chuyển canvas.',
      },
      {
        en: 'Right drag rotates the camera.',
        vi: 'Kéo chuột phải để xoay camera.',
      },
      {
        en: 'Scroll to zoom; Reset view recenters the graph.',
        vi: 'Cuộn để thu phóng; Đặt lại góc nhìn để căn giữa đồ thị.',
      },
    ],
    interaction: { en: 'Interaction', vi: 'Tương tác' },
    blocks: { en: 'Blocks', vi: 'Block' },
    clickBlocks: {
      en: 'Click blocks to view details in the right panel.',
      vi: 'Bấm vào các khối để xem chi tiết ở khung bên phải.',
    },
    blockItems: [
      {
        en: 'Click a block to select it and open its parameter formula.',
        vi: 'Bấm block để chọn và mở công thức tham số.',
      },
      {
        en: 'Use + and - on grouped blocks to expand or collapse modules.',
        vi: 'Dùng + và - trên block nhóm để mở rộng hoặc thu gọn module.',
      },
      {
        en: 'The right panel shows structure, metadata, source line, and errors.',
        vi: 'Khung bên phải hiển thị cấu trúc, metadata, dòng nguồn và lỗi.',
      },
    ],
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
    mnistDemo: { en: 'Forward Pass', vi: 'Lan truyền xuôi' },
    mnistItems: [
      {
        en: 'Available for any visualized model — flows a sample image through every layer.',
        vi: 'Khả dụng cho mọi mô hình đã trực quan hóa — đưa ảnh mẫu đi qua từng lớp.',
      },
      {
        en: 'Turn on Forward pass, then press Play to watch the input image move through blocks.',
        vi: 'Bật Lan truyền xuôi, rồi bấm Play để xem ảnh đầu vào đi qua các block.',
      },
      {
        en: 'Use step, speed, and exercises to inspect each operation.',
        vi: 'Dùng bước, tốc độ và bài tập để xem từng phép toán.',
      },
    ],
    exportAndTour: { en: 'Export & Tour', vi: 'Xuất & Tour' },
    exportItems: [
      {
        en: 'Export SVG after a graph is visualized.',
        vi: 'Xuất SVG sau khi đồ thị đã được dựng.',
      },
      {
        en: 'Open Tour anytime for guided, clickable onboarding.',
        vi: 'Mở Tour bất cứ lúc nào để xem hướng dẫn tương tác từng bước.',
      },
    ],
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
        title: { en: 'Forward pass', vi: 'Lan truyền xuôi' },
        body: {
          en: 'Turn on Forward pass mode to show the sample image input and the flow controls for this graph.',
          vi: 'Bật chế độ Lan truyền xuôi để hiện ảnh đầu vào mẫu và bộ điều khiển luồng cho đồ thị này.',
        },
      },
      {
        title: { en: 'Press Play', vi: 'Bấm Play' },
        body: {
          en: 'Click Play to start the forward pass. The tour continues only after you start the demo.',
          vi: 'Bấm Play để chạy lan truyền xuôi. Tour chỉ đi tiếp sau khi bạn thật sự khởi động demo.',
        },
      },
      {
        title: { en: 'Follow the input', vi: 'Theo dõi input' },
        body: {
          en: 'Watch the input image move from block to block. Each active block shows how that operation transforms the data.',
          vi: 'Quan sát ảnh đầu vào đi qua từng block. Mỗi block đang hoạt động sẽ minh họa phép toán biến đổi dữ liệu như thế nào.',
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

function selectLocalizedText<T extends LocalizedNode>(node: T, language: Language): SelectedLocalizedText<T> {
  if (Array.isArray(node)) {
    return node.map((item) => selectLocalizedText(item, language)) as SelectedLocalizedText<T>;
  }
  if (isLocalizedPair(node)) return node[language] as SelectedLocalizedText<T>;

  return Object.fromEntries(
    Object.entries(node).map(([key, value]) => [key, selectLocalizedText(value, language)]),
  ) as SelectedLocalizedText<T>;
}

export const strings = {
  en: selectLocalizedText(localizedText, 'en'),
  vi: selectLocalizedText(localizedText, 'vi'),
};

export type LocalizedStrings = typeof strings.en;
type LearningLabStrings = LocalizedStrings['learningLab'];
type LearningLessonText = {
  title: string;
  eyebrow: string;
  duration: string;
  theory: string[];
};
export function getStrings(language: Language): LocalizedStrings {
  return strings[language] ?? strings.en;
}

export function getLearningLessonText(
  t: LearningLabStrings,
  lesson: {
    id: string;
    text?: {
      title: Record<Language, string>;
      eyebrow?: Record<Language, string>;
      duration?: Record<Language, string>;
      theory: Record<Language, string>[];
    };
  },
  language: Language,
): LearningLessonText {
  if (lesson.text) {
    return {
      title: lesson.text.title[language],
      eyebrow: lesson.text.eyebrow?.[language] ?? '',
      duration: lesson.text.duration?.[language] ?? '',
      theory: lesson.text.theory.length
        ? lesson.text.theory.map((item) => item[language])
        : [t.contentInProgress],
    };
  }
  return {
    title: lesson.id,
    eyebrow: '',
    duration: '',
    theory: [t.contentInProgress],
  };
}

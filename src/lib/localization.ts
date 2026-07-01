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
    label: { en: 'TORCHVIZ LEARNING LAB', vi: 'TORCHVIZ LEARNING LAB' },
    title: { en: 'TorchViz Foundations', vi: 'Lộ trình TorchViz' },
    description: {
      en: 'A guided path that turns the existing demo exercises into ordered shape and value practice.',
      vi: 'Học theo lộ trình và làm bài trực tiếp bằng các bài tập shape/value trong Learning Lab.',
    },
    back: { en: 'Back', vi: 'Quay lại' },
    home: { en: 'Home', vi: 'Trang chủ' },
    landing: { en: 'Landing', vi: 'Trang chính' },
    guide: { en: 'Guide', vi: 'Hướng dẫn' },
    visualization3d: { en: '3D', vi: '3D' },
    path: { en: 'Path', vi: 'Lộ trình' },
    review: { en: 'Review', vi: 'Ôn tập' },
    role: { en: 'Role', vi: 'Vai trò' },
    domain: { en: 'Domain', vi: 'Mảng kiến thức' },
    lesson: { en: 'Lesson', vi: 'Bài học' },
    pathDescription: {
      en: 'Choose a role and domain first, then open a focused lesson.',
      vi: 'Chọn vai trò và mảng kiến thức trước, rồi mở bài học phù hợp.',
    },
    chooseRoleTitle: { en: 'Choose your learning track', vi: 'Chọn hướng học' },
    chooseRoleDescription: {
      en: 'Start from the role closest to your work. Each role narrows the lab into domains and focused lessons.',
      vi: 'Bắt đầu từ vai trò gần với công việc của bạn. Mỗi vai trò sẽ thu hẹp Lab thành các mảng kiến thức và bài học phù hợp.',
    },
    chooseDomainTitle: {
      en: () => 'Choose a domain',
      vi: () => 'Chọn mảng kiến thức',
    },
    chooseDomainDescription: {
      en: 'Pick the model area you want to practice first. The next step opens the lesson list.',
      vi: 'Chọn vùng kiến thức muốn luyện trước. Bước tiếp theo sẽ mở danh sách bài học.',
    },
    backToLanding: { en: 'Back to landing', vi: 'Quay lại trang chính' },
    openSidebar: { en: 'Open sidebar', vi: 'Mở thanh điều hướng' },
    closeSidebar: { en: 'Close sidebar', vi: 'Đóng thanh điều hướng' },
    sidebarDomains: { en: 'Domains', vi: 'Domain' },
    searchLabel: { en: 'Learning Lab', vi: 'Learning Lab' },
    domainCatalogLabel: { en: 'Learning Lab catalog', vi: 'Learning Lab catalog' },
    domainCatalogTitle: { en: 'Choose a learning domain', vi: 'Chọn domain học tập' },
    domainCatalogDescription: {
      en: 'Pick the model area you want to practice first. Each domain opens a focused learning path.',
      vi: 'Chọn vùng kiến thức muốn luyện trước. Mỗi domain mở một lộ trình học tập tập trung.',
    },
    homePage: {
      eyebrow: { en: 'Project home', vi: 'Trang chủ dự án' },
      title: {
        en: 'TorchViz-3D turns neural networks into something you can inspect, question, and understand.',
        vi: 'TorchViz-3D biến mạng neural thành thứ có thể quan sát, đặt câu hỏi và thật sự hiểu.',
      },
      subtitle: {
        en: 'We are building a local-first learning environment where model structure, tensor shape, and algorithm behavior become visible instead of hidden behind code output.',
        vi: 'Chúng tôi xây dựng một môi trường học local-first, nơi cấu trúc mô hình, tensor shape và hành vi thuật toán trở nên nhìn thấy được thay vì ẩn sau kết quả code.',
      },
      simpleTitle: {
        en: 'A visual learning lab for neural networks.',
        vi: 'Một learning lab trực quan cho neural networks.',
      },
      simpleSubtitle: {
        en: 'TorchViz-3D helps learners see how model code becomes structure, how tensors change shape, and why each step matters.',
        vi: 'TorchViz-3D giúp người học nhìn thấy cách code mô hình trở thành cấu trúc, cách tensor đổi shape và vì sao từng bước lại quan trọng.',
      },
      projectLabel: { en: 'Learning Lab goal', vi: 'Mục tiêu của Learning Lab' },
      projectTitle: {
        en: 'A visual lab for learning how modern AI systems move information.',
        vi: 'Một phòng lab trực quan để học cách hệ thống AI hiện đại truyền và biến đổi thông tin.',
      },
      projectBody: [
        {
          en: 'TorchViz-3D started from a simple belief: learners should not have to imagine every tensor transformation in their head. The interface should make the path of data visible.',
          vi: 'TorchViz-3D giúp bạn nhìn thấy đường đi của dữ liệu trong mô hình, thay vì phải tự hình dung từng bước biến đổi tensor.',
        },
        {
          en: 'The Learning Lab extends that idea beyond diagrams. It connects concepts, visual explanations, and practice into one place so students can move from curiosity to working intuition.',
          vi: 'Learning Lab mở rộng ý tưởng đó ra ngoài sơ đồ. Nó kết nối khái niệm, giải thích trực quan và thực hành trong cùng một nơi để người học đi từ tò mò đến trực giác có thể sử dụng được.',
        },
      ],
      goalLabel: { en: 'Our goal', vi: 'Mục tiêu' },
      goal: {
        en: 'If AI feels hard to understand, Learning Lab should make it clear. If you still do not understand, the lab is not optimized enough, not you.',
        vi: 'Nếu AI khó hiểu, Learning Lab sẽ làm nó dễ hiểu. Nếu bạn vẫn chưa hiểu, đó là do lab chưa tối ưu, không phải lỗi của bạn.',
      },
      goalBody: {
        en: 'Every lesson, animation, and practice surface should help learners explain what changed, why it changed, and how that change affects the next step.',
        vi: 'Mỗi bài học, animation và phần thực hành cần giúp người học giải thích điều gì đã thay đổi, vì sao nó thay đổi và thay đổi đó ảnh hưởng thế nào đến bước tiếp theo.',
      },
      idealsLabel: { en: 'How we teach', vi: 'Cách học' },
      idealVisualTitle: { en: 'Simple and Clear', vi: 'Đơn Giản, Dễ Hiểu' },
      idealVisualBody: {
        en: 'Each lesson stays focused: less noise, fewer unnecessary terms, and enough context to know what you are looking at.',
        vi: 'Mỗi phần học giữ đúng trọng tâm: ít nhiễu, ít thuật ngữ thừa, và đủ rõ để bạn biết mình đang nhìn vào điều gì.',
      },
      idealLocalTitle: { en: 'Visual Practice', vi: 'Bài Tập Trực Quan' },
      idealLocalBody: {
        en: 'Work through short exercises, watch tensors move through each layer, and see how shapes or values change step by step.',
        vi: 'Làm bài tập ngắn, xem tensor đi qua từng layer, và quan sát cách shape hoặc giá trị thay đổi sau mỗi bước.',
      },
      idealHumanTitle: { en: 'Plain-Language Theory', vi: 'Lý Thuyết Dễ Hiểu' },
      idealHumanBody: {
        en: 'Start with simple words first, then bring in formulas, code, and technical details only when they are needed.',
        vi: 'Giải thích bằng từ đơn giản trước, rồi mới đi vào công thức, code và chi tiết kỹ thuật khi thật sự cần.',
      },
      nextLabel: { en: 'Choose a domain to start', vi: 'Chọn một domain để bắt đầu' },
      nextBody: {
        en: 'Choose a domain on the left when you are ready. Each domain opens a focused course page, while this Home page stays as the project’s shared north star.',
        vi: 'Khi sẵn sàng, hãy chọn một domain ở bên trái. Mỗi domain mở một trang học tập tập trung, còn Home là nơi giữ tinh thần chung của dự án.',
      },
      artifactLabel: { en: 'Learning artifact', vi: 'Mẫu học tập' },
      sourceCode: { en: 'Source code', vi: 'Code PyTorch' },
      shapeTrace: { en: 'Shape trace', vi: 'Luồng tensor' },
      practiceLoop: { en: 'Practice loop', vi: 'Bài tập ngắn' },
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
      practice: { en: 'Practice', vi: 'Practice' },
    },
    lessonFilterCount: {
      en: (first: number, second: number) => `${first}/${second}`,
      vi: (first: number, second: number) => `${first}/${second}`,
    },
    clearLessonSearch: { en: 'Clear lesson search', vi: 'Xóa tìm kiếm bài học' },
    lessonFilterEmpty: { en: 'No lessons match this filter.', vi: 'Không có bài học khớp bộ lọc.' },
    domains: {
      programmingFoundation: {
        title: { en: 'Programming', vi: 'Programming' },
        description: {
          en: 'Write clean, production-quality Python. This is non-negotiable.',
          vi: 'Viết Python sạch, đạt chất lượng production. Đây là nền tảng bắt buộc.',
        },
      },
      mathStatisticsAi: {
        title: { en: 'Math & Statistics', vi: 'Math & Statistics' },
        description: {
          en: "Understand the math behind what models do. You don't need to derive everything, but you must understand it.",
          vi: 'Hiểu toán phía sau hành vi của model. Không cần tự derive mọi thứ, nhưng phải hiểu bản chất.',
        },
      },
      fundamentals: {
        title: { en: 'Machine Learning', vi: 'Machine Learning' },
        description: {
          en: 'Understand the classic ML algorithms that power AI feature engineering and evaluation.',
          vi: 'Hiểu các thuật toán ML cổ điển đứng sau feature engineering và evaluation trong AI.',
        },
      },
      deepLearning: {
        title: { en: 'Deep Learning', vi: 'Deep Learning' },
        description: {
          en: 'Understand neural networks deeply enough to work with transformers.',
          vi: 'Hiểu neural networks đủ sâu để làm việc với transformers.',
        },
      },
      cv: {
        title: { en: 'Computer Vision', vi: 'Computer Vision' },
        description: {
          en: 'CNN, convolution, pooling, and classifier shape/value practice.',
          vi: 'CNN, convolution, pooling và classifier shape/value practice.',
        },
      },
      nlp: {
        title: { en: 'NLP', vi: 'NLP' },
        description: {
          en: 'Deep NLP expertise for LLM-powered products.',
          vi: 'Kiến thức NLP sâu để xây dựng sản phẩm dùng LLM.',
        },
      },
      llmAiEngineering: {
        title: { en: 'LLMs', vi: 'LLMs' },
        description: {
          en: 'Master LLM fundamentals, APIs, and production patterns.',
          vi: 'Nắm vững nền tảng LLM, API và các pattern production.',
        },
      },
      mlopsLlmopsProductionSystems: {
        title: { en: 'MLOps, LLMOps & Production', vi: 'MLOps, LLMOps & Production' },
        description: {
          en: 'Ship AI to production reliably, cheaply, and scalably.',
          vi: 'Đưa AI lên production ổn định, tiết kiệm và scale được.',
        },
      },
      aiSystemDesign: {
        title: { en: 'AI System Design', vi: 'AI System Design' },
        description: {
          en: 'Design AI systems at scale for real-world products and interviews.',
          vi: 'Thiết kế hệ thống AI ở quy mô lớn cho sản phẩm thực tế và phỏng vấn.',
        },
      },
      aiEthicsSafetyGovernance: {
        title: { en: 'AI Ethics, Safety & Governance', vi: 'AI Ethics, Safety & Governance' },
        description: {
          en: 'Build AI responsibly. This is increasingly a job requirement.',
          vi: 'Xây dựng AI có trách nhiệm. Đây ngày càng là yêu cầu nghề nghiệp.',
        },
      },
      reinforcementLearning: {
        title: { en: 'Reinforcement Learning', vi: 'Reinforcement Learning' },
        description: {
          en: 'Understand RL enough to work with RLHF, PPO, and agentic training.',
          vi: 'Hiểu RL đủ để làm việc với RLHF, PPO và agentic training.',
        },
      },
      robotLearning: {
        title: { en: 'Robot Learning', vi: 'Robot Learning' },
        description: {
          en: 'Reserved for embodied agents, control, and robotics practice.',
          vi: 'Giữ chỗ cho embodied agents, control và robotics practice.',
        },
      },
    },
    tracks: {
      pythonFundamentals: {
        title: { en: '1.1 Python Fundamentals', vi: '1.1 Python Fundamentals' },
        description: {
          en: 'Types, strings, collections, and control flow.',
          vi: 'Kiểu dữ liệu, string, collection và control flow.',
        },
      },
      pythonFunctions: {
        title: { en: '1.2 Functions', vi: '1.2 Functions' },
        description: {
          en: 'Function definitions, arguments, returns, lambdas, recursion, and docstrings.',
          vi: 'Định nghĩa hàm, arguments, return, lambda, recursion và docstring.',
        },
      },
      pythonOop: {
        title: { en: '1.3 Object-Oriented Programming', vi: '1.3 Object-Oriented Programming' },
        description: {
          en: 'Classes, methods, inheritance, dunder methods, decorators, and ABCs.',
          vi: 'Class, method, inheritance, dunder method, decorator và ABC.',
        },
      },
      pythonicCodeIdioms: {
        title: { en: '1.4 Pythonic Code & Idioms', vi: '1.4 Pythonic Code & Idioms' },
        description: {
          en: 'Comprehensions, generators, unpacking, sorting, and collections utilities.',
          vi: 'Comprehension, generator, unpacking, sorting và tiện ích collections.',
        },
      },
      fileIoDataHandling: {
        title: { en: '1.5 File I/O & Data Handling', vi: '1.5 File I/O & Data Handling' },
        description: {
          en: 'Text, CSV, JSON, pickle, paths, directories, and glob patterns.',
          vi: 'Text, CSV, JSON, pickle, path, folder và glob pattern.',
        },
      },
      errorHandlingDebugging: {
        title: { en: '1.6 Error Handling & Debugging', vi: '1.6 Error Handling & Debugging' },
        description: {
          en: 'Exceptions, logging, breakpoints, and traceback reading.',
          vi: 'Exception, logging, breakpoint và đọc traceback.',
        },
      },
      performanceMemory: {
        title: { en: '1.7 Performance & Memory', vi: '1.7 Performance & Memory' },
        description: {
          en: 'Generators, itertools, profiling, copies, and vectorization.',
          vi: 'Generator, itertools, profiling, copy và vectorization.',
        },
      },
      numpyForAi: {
        title: { en: '1.8 NumPy', vi: '1.8 NumPy' },
        description: {
          en: 'Arrays, shapes, reshaping, broadcasting, matrix math, aggregation, and randomness.',
          vi: 'Array, shape, reshape, broadcasting, ma trận, aggregation và random.',
        },
      },
      pandasDataWork: {
        title: { en: '1.9 Pandas', vi: '1.9 Pandas' },
        description: {
          en: 'DataFrames, indexing, filtering, missing values, groupby, reshaping, and dates.',
          vi: 'DataFrame, indexing, filtering, missing value, groupby, reshape và ngày tháng.',
        },
      },
      codeQualityProjectStructure: {
        title: { en: '1.10 Code Quality & Project Structure', vi: '1.10 Code Quality & Project Structure' },
        description: {
          en: 'Environments, requirements, modules, typing, dataclasses, tests, linting, and formatting.',
          vi: 'Environment, requirements, module, typing, dataclass, test, lint và format.',
        },
      },
      pythonAiWorkflows: {
        title: { en: '1.11 Python for AI Workflows', vi: '1.11 Python for AI Workflows' },
        description: {
          en: 'Notebooks, Colab, tqdm, CLI args, configs, dotenv, seeds, and model persistence.',
          vi: 'Notebook, Colab, tqdm, CLI args, config, dotenv, seed và lưu model.',
        },
      },
      asyncPythonAiApis: {
        title: { en: '1.12 Async Python', vi: '1.12 Async Python' },
        description: {
          en: 'async/await, event loops, async HTTP, concurrency, httpx, and streaming LLM responses.',
          vi: 'async/await, event loop, async HTTP, concurrency, httpx và streaming LLM.',
        },
      },
      linearAlgebra: {
        title: { en: '1.1 Linear Algebra', vi: '1.1 Linear Algebra' },
        description: {
          en: 'Vectors, matrices, ML operations, eigenvectors, PCA, and SVD.',
          vi: 'Vector, ma trận, phép toán ML, eigenvector, PCA và SVD.',
        },
      },
      calculus: {
        title: { en: '1.2 Calculus', vi: '1.2 Calculus' },
        description: {
          en: 'Derivatives, gradients, chain rule, computational graphs, and ML losses.',
          vi: 'Đạo hàm, gradient, chain rule, computational graph và loss trong ML.',
        },
      },
      probabilityStatistics: {
        title: { en: '1.3 Probability & Statistics', vi: '1.3 Probability & Statistics' },
        description: {
          en: 'Probability, Bayes, random variables, distributions, and statistical estimation.',
          vi: 'Xác suất, Bayes, biến ngẫu nhiên, phân phối và estimation.',
        },
      },
      optimization: {
        title: { en: '1.4 Optimization', vi: '1.4 Optimization' },
        description: {
          en: 'Loss functions, gradient descent, optimizers, training challenges, and regularization.',
          vi: 'Loss, gradient descent, optimizer, vấn đề khi train và regularization.',
        },
      },
      informationTheory: {
        title: { en: '1.5 Information Theory', vi: '1.5 Information Theory' },
        description: {
          en: 'Entropy, cross-entropy, KL divergence, mutual information, bits, and nats.',
          vi: 'Entropy, cross-entropy, KL divergence, mutual information, bit và nat.',
        },
      },
      tensorShapeFundamentals: {
        title: { en: 'Tensor shape fundamentals', vi: 'Tensor shape fundamentals' },
        description: {
          en: 'Read and predict shapes through core layers.',
          vi: 'Đọc và dự đoán shape qua các layer cơ bản.',
        },
      },
      valueFlow: {
        title: { en: 'Value flow', vi: 'Value flow' },
        description: {
          en: 'Follow values through Linear and activation operations.',
          vi: 'Theo dõi giá trị qua Linear và activation.',
        },
      },
      coreMlConcepts: {
        title: { en: '1.1 Core ML Concepts', vi: '1.1 Core ML Concepts' },
        description: {
          en: 'Classic dataset splits, generalization, validation, and metrics.',
          vi: 'Dataset split, generalization, validation và metrics nền tảng.',
        },
      },
      linearLogisticRegression: {
        title: { en: '1.2 Linear & Logistic Regression', vi: '1.2 Linear & Logistic Regression' },
        description: {
          en: 'Regression, classification, costs, regularization, and one-vs-rest.',
          vi: 'Regression, classification, cost, regularization và one-vs-rest.',
        },
      },
      decisionTreesEnsembles: {
        title: { en: '1.3 Decision Trees & Ensembles', vi: '1.3 Decision Trees & Ensembles' },
        description: {
          en: 'Trees, forests, boosting, and feature importance.',
          vi: 'Tree, forest, boosting và feature importance.',
        },
      },
      unsupervisedLearning: {
        title: { en: '1.4 Unsupervised Learning', vi: '1.4 Unsupervised Learning' },
        description: {
          en: 'Clustering, dimensionality reduction, and embedding visualization.',
          vi: 'Clustering, giảm chiều và trực quan hóa embedding.',
        },
      },
      hyperparameterTuning: {
        title: { en: '1.5 Hyperparameter Tuning', vi: '1.5 Hyperparameter Tuning' },
        description: {
          en: 'Search strategies, training knobs, and early stopping.',
          vi: 'Chiến lược search, tham số train và early stopping.',
        },
      },
      mlWithScikitLearn: {
        title: { en: '1.6 ML with Scikit-Learn', vi: '1.6 ML với Scikit-Learn' },
        description: {
          en: 'Pipelines, preprocessors, model selection, persistence, and API patterns.',
          vi: 'Pipeline, preprocessor, model selection, lưu model và pattern API.',
        },
      },
      neuralNetworkFundamentals: {
        title: { en: '1.1 Neural Network Fundamentals', vi: '1.1 Neural Network Fundamentals' },
        description: {
          en: 'Neurons, activation, forward flow, gradients, initialization, and gradient stability.',
          vi: 'Neuron, activation, forward flow, gradient, initialization và độ ổn định gradient.',
        },
      },
      trainingTechniques: {
        title: { en: '1.2 Training Techniques', vi: '1.2 Training Techniques' },
        description: {
          en: 'Normalization, dropout, residual connections, and clipping for stable training.',
          vi: 'Normalization, dropout, residual connection và clipping để train ổn định.',
        },
      },
      convolutionalNeuralNetworks: {
        title: { en: '1.3 Convolutional Neural Networks', vi: '1.3 Convolutional Neural Networks' },
        description: {
          en: 'Convolutions, pooling, CNN architectures, transfer learning, and vision applications.',
          vi: 'Convolution, pooling, kiến trúc CNN, transfer learning và ứng dụng vision.',
        },
      },
      recurrentNeuralNetworks: {
        title: { en: '1.4 Recurrent Neural Networks', vi: '1.4 Recurrent Neural Networks' },
        description: {
          en: 'RNNs, hidden state, LSTM, GRU, bidirectionality, seq2seq, and decoding.',
          vi: 'RNN, hidden state, LSTM, GRU, bidirectional, seq2seq và decoding.',
        },
      },
      attentionMechanism: {
        title: { en: '1.5 Attention Mechanism', vi: '1.5 Attention Mechanism' },
        description: {
          en: 'Pre-transformer attention as soft alignment for sequence models.',
          vi: 'Attention trước transformer như soft alignment cho sequence models.',
        },
      },
      pytorchMastery: {
        title: { en: '1.6 PyTorch', vi: '1.6 PyTorch' },
        description: {
          en: 'Tensors, modules, optimizers, datasets, loaders, training loops, GPU, and persistence.',
          vi: 'Tensor, module, optimizer, dataset, loader, training loop, GPU và lưu/tải model.',
        },
      },
      transferLearning: {
        title: { en: '1.7 Transfer Learning', vi: '1.7 Transfer Learning' },
        description: {
          en: 'Pretraining, fine-tuning, feature extraction, freezing, and HuggingFace models.',
          vi: 'Pretraining, fine-tuning, feature extraction, freezing và HuggingFace models.',
        },
      },
      textPreprocessing: {
        title: { en: '1.1 Text Preprocessing', vi: '1.1 Text Preprocessing' },
        description: {
          en: 'Tokenization, normalization, stopwords, stemming, sentence boundaries, special tokens, and Unicode.',
          vi: 'Tokenization, normalization, stopword, stemming, tách câu, special token và Unicode.',
        },
      },
      classicalTextRepresentation: {
        title: { en: '1.2 Classical Text Representation', vi: '1.2 Classical Text Representation' },
        description: {
          en: 'Bag of Words, TF-IDF, n-grams, one-hot encoding, and sparse versus dense representations.',
          vi: 'Bag of Words, TF-IDF, n-gram, one-hot encoding và biểu diễn sparse/dense.',
        },
      },
      wordEmbeddings: {
        title: { en: '1.3 Word Embeddings', vi: '1.3 Word Embeddings' },
        description: {
          en: 'Dense semantic vectors, Word2Vec, GloVe, FastText, similarity, analogies, and contextual embeddings.',
          vi: 'Vector ngữ nghĩa dense, Word2Vec, GloVe, FastText, similarity, analogy và contextual embedding.',
        },
      },
      subwordTokenization: {
        title: { en: '1.4 Subword Tokenization', vi: '1.4 Subword Tokenization' },
        description: {
          en: 'BPE, WordPiece, SentencePiece, special tokens, token IDs, and vocabulary tradeoffs.',
          vi: 'BPE, WordPiece, SentencePiece, special token, token ID và tradeoff vocabulary.',
        },
      },
      transformerArchitecture: {
        title: { en: '1.5 Transformer Architecture', vi: '1.5 Transformer Architecture' },
        description: {
          en: 'Self-attention, QKV, multi-head attention, position, feed-forward blocks, normalization, and masks.',
          vi: 'Self-attention, QKV, multi-head attention, vị trí, feed-forward, normalization và mask.',
        },
      },
      languageModeling: {
        title: { en: '1.6 Language Modeling', vi: '1.6 Language Modeling' },
        description: {
          en: 'Next-token probabilities, autoregressive and masked language modeling, perplexity, and decoding.',
          vi: 'Xác suất next-token, autoregressive/masked language modeling, perplexity và decoding.',
        },
      },
      keyPretrainedModels: {
        title: { en: '1.7 Key Pretrained Models', vi: '1.7 Key Pretrained Models' },
        description: {
          en: 'BERT, GPT, Claude, Gemini, T5, LLaMA, Mistral, and Qwen model families.',
          vi: 'Các họ model BERT, GPT, Claude, Gemini, T5, LLaMA, Mistral và Qwen.',
        },
      },
      nlpEvaluationMetrics: {
        title: { en: '1.8 NLP Evaluation Metrics', vi: '1.8 NLP Evaluation Metrics' },
        description: {
          en: 'Classification metrics, BLEU, ROUGE, perplexity, BERTScore, human evaluation, and exact match.',
          vi: 'Metric phân loại, BLEU, ROUGE, perplexity, BERTScore, human evaluation và exact match.',
        },
      },
      keyPythonLibraries: {
        title: { en: '1.9 Key Python Libraries', vi: '1.9 Key Python Libraries' },
        description: {
          en: 'NLTK, spaCy, HuggingFace transformers and datasets, sentence-transformers, tiktoken, and evaluate.',
          vi: 'NLTK, spaCy, HuggingFace transformers/datasets, sentence-transformers, tiktoken và evaluate.',
        },
      },
      llmFundamentals: {
        title: { en: '2.1 LLM Fundamentals', vi: '2.1 LLM Fundamentals' },
        description: {
          en: 'Scaled transformer architecture, inference internals, training methods, preferences, and scaling laws.',
          vi: 'Kiến trúc transformer ở scale lớn, inference internals, training, preference learning và scaling laws.',
        },
      },
      productionPromptEngineering: {
        title: { en: '2.2 Prompt Engineering', vi: '2.2 Prompt Engineering' },
        description: {
          en: 'Prompt anatomy, prompting techniques, production constraints, injection defense, and prompt tools.',
          vi: 'Cấu trúc prompt, kỹ thuật prompting, ràng buộc production, chống prompt injection và tooling.',
        },
      },
      workingWithAiApis: {
        title: { en: '2.3 Working with AI APIs', vi: '2.3 Working with AI APIs' },
        description: {
          en: 'OpenAI, Anthropic, Gemini, Mistral, LLaMA, Ollama, and provider-specific API patterns.',
          vi: 'OpenAI, Anthropic, Gemini, Mistral, LLaMA, Ollama và pattern API theo provider.',
        },
      },
      apiIntegrationPatterns: {
        title: { en: '2.4 API Integration Patterns', vi: '2.4 API Integration Patterns' },
        description: {
          en: 'Token limits, streaming, retries, queues, cost controls, caching, async work, and fallbacks.',
          vi: 'Token limit, streaming, retry, queue, kiểm soát cost, cache, async work và fallback.',
        },
      },
      secureApiIntegration: {
        title: { en: '2.5 Secure API Integration', vi: '2.5 Secure API Integration' },
        description: {
          en: 'API key safety, backend proxies, per-user rate limits, key rotation, logging, and monitoring.',
          vi: 'Bảo vệ API key, backend proxy, rate limit theo user, key rotation, logging và monitoring.',
        },
      },
      llmFromScratchOrientation: {
        title: { en: '1.1 LLM From Scratch Orientation', vi: '1.1 LLM From Scratch Orientation' },
        description: {
          en: 'A TorchViz-native loop for learning LLM internals: theory, hand reasoning, then code.',
          vi: 'Vòng học LLM internals theo kiểu TorchViz: lý thuyết, suy luận bằng tay, rồi code.',
        },
      },
      textDataAndTokenization: {
        title: { en: '1.2 Text Data & Tokenization', vi: '1.2 Text Data & Tokenization' },
        description: {
          en: 'Raw text, token ids, context windows, batches, and the first dataloader.',
          vi: 'Text thô, token id, context window, batch và dataloader đầu tiên.',
        },
      },
      attentionAndTransformersFromScratch: {
        title: { en: '1.3 Attention & Transformers From Scratch', vi: '1.3 Attention & Transformers From Scratch' },
        description: {
          en: 'Causal masks, QKV shapes, attention scores, heads, and a minimal attention module.',
          vi: 'Causal mask, shape QKV, attention score, head và module attention tối thiểu.',
        },
      },
      gptModelFromScratch: {
        title: { en: '1.4 GPT Model From Scratch', vi: '1.4 GPT Model From Scratch' },
        description: {
          en: 'Decoder-only blocks, residual streams, normalization, MLPs, logits, and parameter checks.',
          vi: 'Decoder-only block, residual stream, normalization, MLP, logits và kiểm tra parameter.',
        },
      },
      pretrainingAndGeneration: {
        title: { en: '1.5 Pretraining & Generation', vi: '1.5 Pretraining & Generation' },
        description: {
          en: 'Next-token loss, perplexity, training loops, checkpoints, and autoregressive generation.',
          vi: 'Next-token loss, perplexity, training loop, checkpoint và generation autoregressive.',
        },
      },
      finetuningAndAlignment: {
        title: { en: '1.6 Fine-tuning & Alignment', vi: '1.6 Fine-tuning & Alignment' },
        description: {
          en: 'Classification, instruction data, supervised fine-tuning, and preference-oriented thinking.',
          vi: 'Classification, instruction data, supervised fine-tuning và tư duy theo preference.',
        },
      },
      dataManagementVersioning: {
        title: { en: '1.1 Data Management & Versioning', vi: '1.1 Data Management & Versioning' },
        description: {
          en: 'Dataset and model versioning, validation, lineage, feature stores, and data pipelines.',
          vi: 'Versioning dataset/model, validation, lineage, feature store và data pipeline.',
        },
      },
      experimentTracking: {
        title: { en: '1.2 Experiment Tracking', vi: '1.2 Experiment Tracking' },
        description: {
          en: 'Track runs, hyperparameters, metrics, artifacts, code versions, comparisons, and reports.',
          vi: 'Theo dõi run, hyperparameter, metric, artifact, code version, so sánh và báo cáo.',
        },
      },
      modelDevelopmentTrainingInfrastructure: {
        title: { en: '1.3 Training Infrastructure', vi: '1.3 Training Infrastructure' },
        description: {
          en: 'GPU cloud, distributed training, mixed precision, checkpoints, and training monitoring.',
          vi: 'GPU cloud, distributed training, mixed precision, checkpoint và monitoring khi train.',
        },
      },
      modelEvaluationTesting: {
        title: { en: '1.4 Model Evaluation & Testing', vi: '1.4 Model Evaluation & Testing' },
        description: {
          en: 'Offline benchmarks, human evaluation, LLM-as-judge, red teaming, and online release evaluation.',
          vi: 'Benchmark offline, human evaluation, LLM-as-judge, red teaming và đánh giá release online.',
        },
      },
      modelDeploymentServing: {
        title: { en: '1.5 Model Deployment & Serving', vi: '1.5 Model Deployment & Serving' },
        description: {
          en: 'API serving, serving optimization, inference backends, and unified provider interfaces.',
          vi: 'API serving, tối ưu serving, inference backend và interface provider thống nhất.',
        },
      },
      containerizationOrchestration: {
        title: { en: '1.6 Containerization & Orchestration', vi: '1.6 Containerization & Orchestration' },
        description: {
          en: 'Docker, Compose, Kubernetes, Helm, autoscaling, and GPU scheduling.',
          vi: 'Docker, Compose, Kubernetes, Helm, autoscaling và GPU scheduling.',
        },
      },
      cloudDeployment: {
        title: { en: '1.7 Cloud Deployment', vi: '1.7 Cloud Deployment' },
        description: {
          en: 'AWS, GCP, and Azure services for model hosting, storage, containers, serverless, and monitoring.',
          vi: 'Dịch vụ AWS, GCP và Azure cho hosting model, storage, container, serverless và monitoring.',
        },
      },
      monitoringLogging: {
        title: { en: '1.8 Monitoring & Logging', vi: '1.8 Monitoring & Logging' },
        description: {
          en: 'Cost, latency, provider errors, prompt and response quality, drift, observability, and alerts.',
          vi: 'Cost, latency, lỗi provider, chất lượng prompt/response, drift, observability và cảnh báo.',
        },
      },
      ciCdForAi: {
        title: { en: '1.9 CI/CD for AI', vi: '1.9 CI/CD for AI' },
        description: {
          en: 'AI pipelines, automated tests, model and prompt validation, feature flags, and deployments.',
          vi: 'Pipeline AI, test tự động, validation model/prompt, feature flag và deployment.',
        },
      },
      llmSecuritySafety: {
        title: { en: '1.10 LLM Security & Safety', vi: '1.10 LLM Security & Safety' },
        description: {
          en: 'Prompt injection defense, moderation, PII handling, data residency, on-premise deployment, and audit logs.',
          vi: 'Chống prompt injection, moderation, xử lý PII, data residency, on-premise deployment và audit log.',
        },
      },
      aiSystemDesignFramework: {
        title: { en: '1.1 AI System Design Framework', vi: '1.1 AI System Design Framework' },
        description: {
          en: 'Requirements, AI task decomposition, data flow, model choice, scale, cost, reliability, and monitoring.',
          vi: 'Requirement, tách tác vụ AI, data flow, chọn model, scale, cost, reliability và monitoring.',
        },
      },
      classicAiSystemDesigns: {
        title: { en: '1.2 Classic AI System Designs', vi: '1.2 Classic AI System Designs' },
        description: {
          en: 'Chatbot memory, RAG, recommendation, PDF Q&A at scale, and AI customer support patterns.',
          vi: 'Pattern chatbot memory, RAG, recommendation, PDF Q&A ở scale lớn và AI customer support.',
        },
      },
      inferencePlacementStrategy: {
        title: { en: '1.3 Inference Placement Strategy', vi: '1.3 Inference Placement Strategy' },
        description: {
          en: 'Choose backend, client-side, edge, or async queue inference based on security, latency, and workload.',
          vi: 'Chọn inference ở backend, client, edge hoặc async queue theo security, latency và workload.',
        },
      },
      cachingStrategies: {
        title: { en: '1.4 Caching Strategies', vi: '1.4 Caching Strategies' },
        description: {
          en: 'Exact match caching, semantic caching, and prompt template caching for AI systems.',
          vi: 'Exact match caching, semantic caching và prompt template caching cho hệ thống AI.',
        },
      },
      asyncAiArchitecture: {
        title: { en: '1.5 Async AI Architecture', vi: '1.5 Async AI Architecture' },
        description: {
          en: 'Use task APIs, workers, polling, and webhooks when AI work is slow, expensive, or batch-oriented.',
          vi: 'Dùng task API, worker, polling và webhook khi tác vụ AI chậm, tốn kém hoặc chạy batch.',
        },
      },
      costAwareArchitecture: {
        title: { en: '1.6 Cost-Aware Architecture', vi: '1.6 Cost-Aware Architecture' },
        description: {
          en: 'Route models per feature and reduce cost with compression, limits, caching, downgrades, batching, and context control.',
          vi: 'Route model theo feature và giảm cost bằng compression, giới hạn output, cache, downgrade, batching và tối ưu context.',
        },
      },
      rlFundamentals: {
        title: { en: '1.1 RL Fundamentals', vi: '1.1 RL Fundamentals' },
        description: {
          en: 'MDPs, agents, environments, policies, values, Q-functions, exploration, and discounting.',
          vi: 'MDP, agent, environment, policy, value, Q-function, exploration và discount factor.',
        },
      },
      valueBasedMethods: {
        title: { en: '1.2 Value-Based Methods', vi: '1.2 Value-Based Methods' },
        description: {
          en: 'Q-learning, DQN, Double DQN, Dueling DQN, prioritized replay, and TD update practice.',
          vi: 'Q-learning, DQN, Double DQN, Dueling DQN, prioritized replay và practice TD update.',
        },
      },
      policyBasedMethods: {
        title: { en: '1.3 Policy-Based Methods', vi: '1.3 Policy-Based Methods' },
        description: {
          en: 'REINFORCE, actor-critic methods, PPO for RLHF, and GRPO for reasoning models.',
          vi: 'REINFORCE, actor-critic, PPO cho RLHF và GRPO cho reasoning model.',
        },
      },
      rlForLlms: {
        title: { en: '1.4 RL for LLMs', vi: '1.4 RL for LLMs' },
        description: {
          en: 'RLHF, reward models, PPO with KL constraints, DPO, RLAIF, Constitutional AI, PRMs, and ORMs.',
          vi: 'RLHF, reward model, PPO với KL constraint, DPO, RLAIF, Constitutional AI, PRM và ORM.',
        },
      },
      multiAgentRl: {
        title: { en: '1.5 Multi-Agent RL', vi: '1.5 Multi-Agent RL' },
        description: {
          en: 'Cooperative and competitive agents, game theory, self-play, and multi-agent communication.',
          vi: 'Agent hợp tác/cạnh tranh, game theory, self-play và multi-agent communication.',
        },
      },
      aiSafetyFundamentals: {
        title: { en: '1.1 AI Safety Fundamentals', vi: '1.1 AI Safety Fundamentals' },
        description: {
          en: 'AI harms, alignment, hallucination, bias, fairness, and dual-use concerns.',
          vi: 'Tác hại AI, alignment, hallucination, bias, fairness và dual-use.',
        },
      },
      promptInjectionSecurity: {
        title: { en: '1.2 Prompt Injection & Security', vi: '1.2 Prompt Injection & Security' },
        description: {
          en: 'Direct and indirect injection, defenses, jailbreak mitigations, and adversarial red teaming.',
          vi: 'Direct/indirect injection, phòng thủ, giảm jailbreak và red teaming đối kháng.',
        },
      },
      biasFairness: {
        title: { en: '1.3 Bias & Fairness', vi: '1.3 Bias & Fairness' },
        description: {
          en: 'Bias sources and types, fairness metrics, detection tools, and mitigation strategies.',
          vi: 'Nguồn và loại bias, fairness metric, công cụ phát hiện và chiến lược giảm bias.',
        },
      },
      privacyDataGovernance: {
        title: { en: '1.4 Privacy & Data Governance', vi: '1.4 Privacy & Data Governance' },
        description: {
          en: 'PII, GDPR, data minimization, right to erasure, differential privacy, and federated learning.',
          vi: 'PII, GDPR, data minimization, right to erasure, differential privacy và federated learning.',
        },
      },
      aiTransparencyExplainability: {
        title: { en: '1.5 AI Transparency & Explainability', vi: '1.5 AI Transparency & Explainability' },
        description: {
          en: 'Model cards, system cards, SHAP, LIME, attention visualization, and explanation tradeoffs.',
          vi: 'Model card, system card, SHAP, LIME, attention visualization và tradeoff giải thích.',
        },
      },
      responsibleAiProduction: {
        title: { en: '1.6 Responsible AI in Production', vi: '1.6 Responsible AI in Production' },
        description: {
          en: 'Moderation architecture, safety classifiers, human review, audit trails, incident response, and governance frameworks.',
          vi: 'Moderation architecture, safety classifier, human review, audit trail, incident response và governance framework.',
        },
      },
      cnnShapeValue: {
        title: { en: 'CNN shape and value', vi: 'CNN shape and value' },
        description: {
          en: 'Convolution and pooling from shape math to values.',
          vi: 'Convolution và pooling từ shape đến giá trị.',
        },
      },
      attentionShapes: {
        title: { en: 'Attention shapes', vi: 'Attention shapes' },
        description: {
          en: 'Batch, token, and embedding dimensions in attention.',
          vi: 'Batch, token và embedding dimensions trong attention.',
        },
      },
      tabularControl: {
        title: { en: 'Tabular Control', vi: 'Tabular Control' },
        description: {
          en: 'MDPs, Bellman values, and Q updates one transition at a time.',
          vi: 'MDP, Bellman và cập nhật Q từng transition.',
        },
      },
      policyBehavior: {
        title: { en: 'Policy Behavior', vi: 'Policy Behavior' },
        description: {
          en: 'Compare off-policy Q-Learning with on-policy SARSA.',
          vi: 'So sánh off-policy Q-Learning với on-policy SARSA.',
        },
      },
      embodiedAgents: {
        title: { en: 'Embodied agents', vi: 'Embodied agents' },
        description: {
          en: 'Robot Learning content will be added later.',
          vi: 'Nội dung Robot Learning sẽ được bổ sung sau.',
        },
      },
    },
    roleProfiles: {
      aiEngineer: {
        title: { en: 'AI Engineer', vi: 'Kỹ sư AI' },
        description: {
          en: 'Build, debug, and ship neural network systems.',
          vi: 'Xây dựng, debug và đưa hệ thống mô hình vào sản phẩm.',
        },
        focus: { en: 'Build and debug model systems', vi: 'Xây dựng và debug hệ thống mô hình' },
        body: {
          en: 'AI Engineers use the Lab to reason from architecture to runtime behavior: how tensors move, where assumptions break, and whether model components remain reliable as the system grows.',
          vi: 'Kỹ sư AI dùng Lab để nối tư duy kiến trúc với hành vi khi chạy: tensor di chuyển ra sao, giả định hỏng ở đâu, và các thành phần mô hình có còn đáng tin khi hệ thống lớn dần hay không.',
        },
        detail: {
          en: 'This path is useful when you want to build stronger debugging instincts, inspect layer interactions, and make model changes with clearer confidence before integration or deployment.',
          vi: 'Lộ trình này phù hợp khi bạn muốn rèn trực giác debug, kiểm tra tương tác giữa các layer, và tự tin hơn khi thay đổi mô hình trước lúc tích hợp hoặc đưa vào sản phẩm.',
        },
      },
      dataScientist: {
        title: { en: 'Data Scientist', vi: 'Nhà Khoa học dữ liệu' },
        description: {
          en: 'Inspect model behavior and connect outputs back to data questions.',
          vi: 'Kiểm tra hành vi mô hình và nối output về câu hỏi dữ liệu.',
        },
        focus: { en: 'Inspect and explain model behavior', vi: 'Kiểm tra và giải thích hành vi mô hình' },
        body: {
          en: 'Data Scientists use the Lab to connect model internals with data reasoning: what changed through each transformation, which signals are preserved, and how outputs support an analytical question.',
          vi: 'Nhà Khoa học dữ liệu dùng Lab để nối bên trong mô hình với tư duy dữ liệu: mỗi phép biến đổi làm thay đổi điều gì, tín hiệu nào được giữ lại, và output hỗ trợ câu hỏi phân tích ra sao.',
        },
        detail: {
          en: 'This path is useful when you want to explain behavior, validate modeling assumptions, and translate tensor-level observations into clearer decisions for experiments, reports, or stakeholders.',
          vi: 'Lộ trình này phù hợp khi bạn muốn giải thích hành vi mô hình, kiểm chứng giả định, và chuyển quan sát ở mức tensor thành quyết định rõ hơn cho thí nghiệm, báo cáo hoặc trao đổi với stakeholders.',
        },
      },
    },
    domainProfiles: {
      aiEngineer: {
        cv: {
          title: { en: 'Computer Vision', vi: 'Computer Vision' },
          shortDescription: { en: 'CNN, pooling, activation, classifier.', vi: 'CNN, pooling, activation, classifier.' },
          longDescription: {
            en: 'Understand how image tensors change across convolution, pooling, activation, and classifier stages so you can reason about spatial resolution, channels, and feature extraction decisions.',
            vi: 'Hiểu cách tensor ảnh thay đổi qua convolution, pooling, activation và classifier để suy luận rõ hơn về độ phân giải không gian, số kênh và quyết định trích xuất đặc trưng.',
          },
        },
        nlp: {
          title: { en: 'NLP', vi: 'NLP' },
          shortDescription: { en: 'Attention, sequence, embedding shape.', vi: 'Attention, sequence, embedding shape.' },
          longDescription: {
            en: 'Trace sequence representations through attention-style blocks, focusing on batch, token, head, and embedding dimensions before they become hard-to-debug integration issues.',
            vi: 'Theo dõi biểu diễn chuỗi qua các khối kiểu attention, tập trung vào batch, token, head và embedding dimension trước khi chúng trở thành lỗi tích hợp khó debug.',
          },
        },
        ml: {
          title: { en: 'ML Foundations', vi: 'ML Foundations' },
          shortDescription: { en: 'Tensor shape, value flow, layer contracts.', vi: 'Tensor shape, value flow, layer contract.' },
          longDescription: {
            en: 'Build a reliable mental model for tensor shape, value flow, and layer contracts that transfers across model families, from small prototypes to larger production architectures.',
            vi: 'Xây dựng mô hình tư duy chắc chắn về tensor shape, dòng giá trị và contract giữa các layer, dùng được từ prototype nhỏ đến kiến trúc production lớn hơn.',
          },
        },
      },
      dataScientist: {
        ml: {
          title: { en: 'ML Foundations', vi: 'ML Foundations' },
          shortDescription: { en: 'Tensor behavior and model inspection.', vi: 'Hành vi tensor và kiểm tra mô hình.' },
          longDescription: {
            en: 'Read tensor transformations as evidence: understand which quantities changed, which assumptions remain valid, and how intermediate behavior supports a modeling conclusion.',
            vi: 'Đọc các phép biến đổi tensor như bằng chứng: đại lượng nào đã thay đổi, giả định nào còn đúng, và hành vi trung gian hỗ trợ kết luận mô hình ra sao.',
          },
        },
        cv: {
          title: { en: 'Computer Vision', vi: 'Computer Vision' },
          shortDescription: { en: 'Spatial shape, pooling, visual features.', vi: 'Spatial shape, pooling, đặc trưng ảnh.' },
          longDescription: {
            en: 'Inspect image-model behavior through spatial changes, channel growth, pooling effects, and classifier outputs so visual features can be connected back to the data question.',
            vi: 'Kiểm tra hành vi mô hình ảnh qua thay đổi không gian, tăng số kênh, hiệu ứng pooling và output classifier để nối đặc trưng thị giác về câu hỏi dữ liệu.',
          },
        },
        nlp: {
          title: { en: 'NLP', vi: 'NLP' },
          shortDescription: { en: 'Sequence, attention, interpretation.', vi: 'Sequence, attention, diễn giải.' },
          longDescription: {
            en: 'Reason about sequence and attention outputs in a way that supports interpretation, error analysis, and clearer communication of what the model is using from text-like inputs.',
            vi: 'Suy luận về output sequence và attention theo cách hỗ trợ diễn giải, phân tích lỗi, và giao tiếp rõ hơn về tín hiệu mô hình dùng từ dữ liệu dạng văn bản.',
          },
        },
      },
    },
    domainPreviewTitle: { en: 'What this role will focus on', vi: 'Vai trò này sẽ tập trung vào gì' },
    domainPreviewBody: {
      en: 'Use the left panel to choose a domain. The lesson list will then switch to the exact practice sequence for that model area.',
      vi: 'Dùng panel bên trái để chọn mảng kiến thức. Danh sách bài học sau đó sẽ chuyển sang đúng chuỗi luyện tập cho vùng mô hình đó.',
    },
    domainCount: {
      en: (count: number) => `${count} ${count === 1 ? 'domain' : 'domains'}`,
      vi: (count: number) => `${count} mảng`,
    },
    lessonCount: {
      en: (count: number) => `${count} ${count === 1 ? 'lesson' : 'lessons'}`,
      vi: (count: number) => `${count} bài học`,
    },
    openNextLevel: { en: 'Open next level', vi: 'Mở cấp tiếp theo' },
    practiceCount: {
      en: (count: number) => `${count} practice ${count === 1 ? 'item' : 'items'}`,
      vi: (count: number) => `${count} bài luyện tập`,
    },
    coursePage: {
      languageEnglish: { en: 'English', vi: 'English' },
      languageVietnamese: { en: 'Tiếng Việt', vi: 'Tiếng Việt' },
      updated: { en: 'Last updated 6/2026', vi: 'Cập nhật lần cuối 6/2026' },
      whatYouWillLearn: { en: "What you'll learn", vi: 'Bạn sẽ học được gì' },
      courseContent: { en: 'Course content', vi: 'Nội dung khóa học' },
      courseSummary: {
        en: (value: unknown) => {
          const { lessons, minutes, practice } = value as { lessons: number; minutes: number; practice: number };
          return `${lessons} ${lessons === 1 ? 'lesson' : 'lessons'} - ${minutes} min - ${practice} practice ${practice === 1 ? 'item' : 'items'}`;
        },
        vi: (value: unknown) => {
          const { lessons, minutes, practice } = value as { lessons: number; minutes: number; practice: number };
          return `${lessons} bài học - ${minutes} phút - ${practice} bài practice`;
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
          en: (tracks: string) => `This path is organized around ${tracks}, with short visual lessons and inline TorchViz-3D practice where content is available.`,
          vi: (tracks: string) => `Lộ trình này được tổ chức quanh ${tracks}, với bài học trực quan ngắn và practice inline trong TorchViz-3D khi nội dung đã sẵn sàng.`,
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
      reinforcementLearning: {
        title: {
          en: 'Reinforcement Learning for Neural Network Builders',
          vi: 'Reinforcement Learning for Neural Network Builders',
        },
        subtitle: {
          en: 'Move from MDPs, Bellman values, and Q-tables into Q-Learning and SARSA with short visual lessons and inline TorchViz-3D practice.',
          vi: 'Đi từ MDP, Bellman values, Q-table đến Q-Learning và SARSA bằng các bài học ngắn, trực quan, có practice ngay trong TorchViz-3D.',
        },
        requirementsTitle: { en: 'Requirements', vi: 'Yêu cầu' },
        requirements: [
          { en: 'Basic Python.', vi: 'Python cơ bản.' },
          { en: 'Basic tensors.', vi: 'Tensor cơ bản.' },
          { en: 'No prior RL.', vi: 'Không cần RL trước.' },
        ],
        descriptionTitle: { en: 'Description', vi: 'Nội dung' },
        description: [
          {
            en: 'This path teaches reinforcement learning the same way TorchViz teaches model structure: one small system at a time, with the important state and value flow visible.',
            vi: 'Lộ trình này dạy reinforcement learning theo cách TorchViz dạy cấu trúc model: từng hệ thống nhỏ một, với state và value flow quan trọng được hiển thị rõ.',
          },
          {
            en: 'You will start with the vocabulary of an MDP, then connect Bellman updates to concrete Q-table entries before comparing off-policy Q-Learning with on-policy SARSA.',
            vi: 'Bạn sẽ bắt đầu với thuật ngữ của MDP, rồi nối Bellman updates với các ô Q-table cụ thể trước khi so sánh off-policy Q-Learning với on-policy SARSA.',
          },
          {
            en: 'The goal is not to memorize formulas. The goal is to build enough intuition to inspect an RL loop and understand why an update moved a value in a specific direction.',
            vi: 'Mục tiêu không phải là ghi nhớ công thức. Mục tiêu là xây đủ trực giác để quan sát một RL loop và hiểu vì sao một update đẩy value theo hướng cụ thể.',
          },
        ],
      },
    },
    openWorkspace: { en: 'Open workspace', vi: 'Mở workspace' },
    language: { en: 'Language', vi: 'Ngôn ngữ' },
    lightTheme: { en: 'Light', vi: 'Sáng' },
    darkTheme: { en: 'Dark', vi: 'Tối' },
    theory: { en: 'Theory', vi: 'Lý thuyết' },
    hints: { en: 'Hints', vi: 'Gợi ý' },
    hint: { en: 'Hint', vi: 'Gợi ý' },
    practice: { en: 'Practice', vi: 'Luyện tập' },
    outputShape: { en: 'Your output shape', vi: 'Output shape của bạn' },
    check: { en: 'Check', vi: 'Kiểm tra' },
    reset: { en: 'Reset', vi: 'Làm lại' },
    hideHint: { en: 'Hide hint', vi: 'Ẩn gợi ý' },
    correctFeedback: { en: 'Correct. Nice, the shape math landed.', vi: 'Đúng rồi. Shape/value đã khớp.' },
    incorrectFeedback: {
      en: 'Not quite yet. Check the highlighted answers or open a hint.',
      vi: 'Chưa đúng. Kiểm tra ô được tô màu hoặc mở gợi ý.',
    },
    inlineUnavailable: {
      en: 'This practice item is mapped, but the inline model is not available yet.',
      vi: 'Bài luyện tập này đã được ánh xạ, nhưng model inline chưa sẵn sàng.',
    },
    startExercise: { en: 'Start exercise', vi: 'Làm bài' },
    unavailablePractice: { en: 'In progress', vi: 'Đang hoàn thiện' },
    workspaceExerciseNote: {
      en: 'Opens the same interactive exercise surface used in Workspace, including checks and hints.',
      vi: 'Mở cùng giao diện bài tập tương tác như Workspace, gồm kiểm tra đáp án và gợi ý.',
    },
    reviewTitle: { en: 'Review practice', vi: 'Ôn tập' },
    reviewDescription: {
      en: 'Browse the same practice set outside the guided order. Each card can be answered directly in the lab.',
      vi: 'Luyện cùng bộ bài tập ngoài thứ tự lộ trình. Mỗi thẻ có thể làm trực tiếp trong Lab.',
    },
    openLesson: { en: 'Open lesson', vi: 'Mở bài học' },
    reviewKinds: {
      all: { en: 'All', vi: 'Tất cả' },
      shape: { en: 'Shape', vi: 'Shape' },
      value: { en: 'Value', vi: 'Giá trị' },
      review: { en: 'Review', vi: 'Ôn tập' },
    },
    lessonStatus: {
      available: { en: 'Available', vi: 'Sẵn sàng' },
      next: { en: 'Next up', vi: 'Tiếp theo' },
      locked: { en: 'Preview', vi: 'Xem trước' },
    },
    lessons: {
      shapeBasics: {
        title: { en: 'Shape basics', vi: 'Nền tảng shape' },
        eyebrow: { en: 'Lesson 1', vi: 'Bài 1' },
        duration: { en: '6 min', vi: '6 phút' },
        theory: [
          {
            en: 'Every block in the graph carries an input shape and an output shape.',
            vi: 'Mỗi block trong đồ thị đều có shape đầu vào và shape đầu ra.',
          },
          {
            en: 'The fastest way to debug a model is to predict the next shape before reading the rendered label.',
            vi: 'Cách debug mô hình nhanh nhất là tự dự đoán shape kế tiếp trước khi đọc nhãn được render.',
          },
        ],
      },
      conv2dOutput: {
        title: { en: 'Conv2d output shape', vi: 'Shape đầu ra của Conv2d' },
        eyebrow: { en: 'Lesson 2', vi: 'Bài 2' },
        duration: { en: '8 min', vi: '8 phút' },
        theory: [
          {
            en: 'Conv2d changes spatial size according to kernel, stride, padding, and dilation.',
            vi: 'Conv2d thay đổi kích thước không gian dựa trên kernel, stride, padding và dilation.',
          },
          {
            en: 'It also changes the channel count to the configured out_channels value.',
            vi: 'Conv2d cũng đổi số kênh thành giá trị out_channels đã cấu hình.',
          },
        ],
      },
      poolingOutput: {
        title: { en: 'Pooling output shape', vi: 'Shape đầu ra của pooling' },
        eyebrow: { en: 'Lesson 3', vi: 'Bài 3' },
        duration: { en: '7 min', vi: '7 phút' },
        theory: [
          {
            en: 'Pooling usually keeps channels unchanged while reducing spatial resolution.',
            vi: 'Pooling thường giữ nguyên số kênh và giảm độ phân giải không gian.',
          },
          {
            en: 'MaxPool and AvgPool share the same shape logic but explain different value behavior.',
            vi: 'MaxPool và AvgPool dùng cùng logic shape nhưng biểu diễn hành vi giá trị khác nhau.',
          },
        ],
      },
      linearActivation: {
        title: { en: 'Linear and activation values', vi: 'Giá trị Linear và activation' },
        eyebrow: { en: 'Lesson 4', vi: 'Bài 4' },
        duration: { en: '9 min', vi: '9 phút' },
        theory: [
          {
            en: 'Linear layers turn an input vector into class or feature scores.',
            vi: 'Linear layer biến vector đầu vào thành điểm lớp hoặc điểm đặc trưng.',
          },
          {
            en: 'Activations reshape the values without changing the tensor rank in typical feed-forward blocks.',
            vi: 'Activation biến đổi giá trị mà thường không đổi rank của tensor trong các khối feed-forward.',
          },
        ],
      },
      attentionShape: {
        title: { en: 'Attention shape', vi: 'Shape của attention' },
        eyebrow: { en: 'Lesson 5', vi: 'Bài 5' },
        duration: { en: '10 min', vi: '10 phút' },
        theory: [
          {
            en: 'Attention practice focuses on preserving the batch and token axes while projecting feature dimensions.',
            vi: 'Bài attention tập trung vào việc giữ trục batch và token trong khi chiếu đổi chiều đặc trưng.',
          },
          {
            en: 'The path keeps this lesson visible now, but deeper embedding can wait until the adapter supports richer node fixtures.',
            vi: 'Lộ trình tạm thời giữ bài này ở dạng xem trước; phần nhúng sâu hơn có thể làm sau khi adapter hỗ trợ fixture node phong phú hơn.',
          },
        ],
      },
      tensorRankBroadcasting: {
        title: { en: 'Rank and broadcasting', vi: 'Rank và broadcasting' },
        eyebrow: { en: 'Lesson 2', vi: 'Bài 2' },
        duration: { en: '7 min', vi: '7 phút' },
        theory: [
          { en: 'Tensor rank tells you how many axes a value carries.', vi: 'Tensor rank cho biết một giá trị có bao nhiêu trục.' },
          { en: 'Broadcasting lets compatible shapes interact without manually copying values.', vi: 'Broadcasting cho phép các shape tương thích tương tác mà không cần copy giá trị thủ công.' },
        ],
      },
      reshapeFlatten: {
        title: { en: 'Reshape and flatten', vi: 'Reshape và flatten' },
        eyebrow: { en: 'Lesson 3', vi: 'Bài 3' },
        duration: { en: '7 min', vi: '7 phút' },
        theory: [
          { en: 'Reshape changes how dimensions are grouped while preserving the number of elements.', vi: 'Reshape đổi cách nhóm chiều nhưng giữ nguyên số phần tử.' },
          { en: 'Flatten is the bridge from spatial feature maps to vector-based classifier heads.', vi: 'Flatten là cầu nối từ feature map không gian sang classifier dạng vector.' },
        ],
      },
      lossSoftmax: {
        title: { en: 'Softmax and loss', vi: 'Softmax và loss' },
        eyebrow: { en: 'Lesson 5', vi: 'Bài 5' },
        duration: { en: '8 min', vi: '8 phút' },
        theory: [
          { en: 'Softmax turns raw scores into a distribution over classes.', vi: 'Softmax biến điểm thô thành phân phối trên các lớp.' },
          { en: 'Loss measures how far the model prediction is from the target answer.', vi: 'Loss đo dự đoán của model cách đáp án mục tiêu bao xa.' },
        ],
      },
      trainingLoopBasics: {
        title: { en: 'Training loop basics', vi: 'Nền tảng training loop' },
        eyebrow: { en: 'Lesson 6', vi: 'Bài 6' },
        duration: { en: '9 min', vi: '9 phút' },
        theory: [
          { en: 'A training loop repeats forward pass, loss, backward pass, and optimizer step.', vi: 'Training loop lặp forward pass, loss, backward pass và optimizer step.' },
          { en: 'The goal is to connect code structure with the learning signal moving through the model.', vi: 'Mục tiêu là nối cấu trúc code với tín hiệu học đi qua model.' },
        ],
      },
      cnnClassifierHead: {
        title: { en: 'CNN classifier head', vi: 'Đầu phân loại CNN' },
        eyebrow: { en: 'Lesson 4', vi: 'Bài 4' },
        duration: { en: '8 min', vi: '8 phút' },
        theory: [
          { en: 'Classifier heads convert feature maps into class scores.', vi: 'Đầu phân loại biến feature map thành điểm lớp.' },
          { en: 'The key shape move is from channels and spatial axes into a final feature vector.', vi: 'Bước shape chính là từ channel và trục không gian sang vector đặc trưng cuối.' },
        ],
      },
      batchnormDropout: {
        title: { en: 'BatchNorm and Dropout', vi: 'BatchNorm và Dropout' },
        eyebrow: { en: 'Lesson 5', vi: 'Bài 5' },
        duration: { en: '8 min', vi: '8 phút' },
        theory: [
          { en: 'BatchNorm stabilizes feature statistics during training.', vi: 'BatchNorm ổn định thống kê đặc trưng trong lúc train.' },
          { en: 'Dropout changes value flow during training while keeping the tensor shape readable.', vi: 'Dropout đổi luồng giá trị khi train nhưng vẫn giữ shape dễ đọc.' },
        ],
      },
      visionAugmentation: {
        title: { en: 'Vision augmentation', vi: 'Augmentation ảnh' },
        eyebrow: { en: 'Lesson 6', vi: 'Bài 6' },
        duration: { en: '8 min', vi: '8 phút' },
        theory: [
          { en: 'Augmentation changes input examples to make the model less brittle.', vi: 'Augmentation đổi mẫu đầu vào để model bớt mong manh.' },
          { en: 'Good augmentation preserves the label while varying appearance.', vi: 'Augmentation tốt giữ nguyên nhãn nhưng làm đa dạng hình thức.' },
        ],
      },
      tokenizationSequences: {
        title: { en: 'Tokens and sequences', vi: 'Token và sequence' },
        eyebrow: { en: 'Lesson 1', vi: 'Bài 1' },
        duration: { en: '7 min', vi: '7 phút' },
        theory: [
          { en: 'NLP models read text as token sequences, not raw sentences.', vi: 'Model NLP đọc văn bản dưới dạng chuỗi token, không phải câu thô.' },
          { en: 'Sequence length becomes a visible axis that later attention layers preserve or transform.', vi: 'Độ dài sequence trở thành một trục rõ ràng mà attention giữ hoặc biến đổi.' },
        ],
      },
      embeddingShapes: {
        title: { en: 'Embedding shapes', vi: 'Shape của embedding' },
        eyebrow: { en: 'Lesson 2', vi: 'Bài 2' },
        duration: { en: '8 min', vi: '8 phút' },
        theory: [
          { en: 'Embedding layers map token ids into dense feature vectors.', vi: 'Embedding layer ánh xạ token id thành vector đặc trưng dense.' },
          { en: 'The output shape usually keeps batch and sequence axes while adding feature width.', vi: 'Output thường giữ batch và sequence, đồng thời thêm chiều đặc trưng.' },
        ],
      },
      transformerBlock: {
        title: { en: 'Transformer block', vi: 'Transformer block' },
        eyebrow: { en: 'Lesson 4', vi: 'Bài 4' },
        duration: { en: '10 min', vi: '10 phút' },
        theory: [
          { en: 'A transformer block combines attention, residual paths, normalization, and feed-forward layers.', vi: 'Transformer block kết hợp attention, residual path, normalization và feed-forward.' },
          { en: 'The main reading habit is to track which axes stay stable across the block.', vi: 'Thói quen đọc chính là theo dõi trục nào ổn định qua block.' },
        ],
      },
      sequenceClassifier: {
        title: { en: 'Sequence classifier', vi: 'Sequence classifier' },
        eyebrow: { en: 'Lesson 5', vi: 'Bài 5' },
        duration: { en: '9 min', vi: '9 phút' },
        theory: [
          { en: 'Sequence classifiers compress token-level features into a decision.', vi: 'Sequence classifier nén đặc trưng theo token thành một quyết định.' },
          { en: 'Pooling strategy determines which sequence information reaches the final head.', vi: 'Chiến lược pooling quyết định thông tin sequence nào đi tới head cuối.' },
        ],
      },
      robotStateAction: {
        title: { en: 'Robot state and action', vi: 'State và action robot' },
        eyebrow: { en: 'Lesson 1', vi: 'Bài 1' },
        duration: { en: '8 min', vi: '8 phút' },
        theory: [
          { en: 'Robot learning starts by naming what the agent observes and controls.', vi: 'Robot learning bắt đầu bằng việc gọi tên agent quan sát và điều khiển gì.' },
          { en: 'State and action spaces define the boundary between model code and the physical task.', vi: 'Không gian state và action định nghĩa ranh giới giữa code model và tác vụ vật lý.' },
        ],
      },
      controlLoopBasics: {
        title: { en: 'Control loop basics', vi: 'Nền tảng control loop' },
        eyebrow: { en: 'Lesson 2', vi: 'Bài 2' },
        duration: { en: '9 min', vi: '9 phút' },
        theory: [
          { en: 'A control loop repeatedly observes, decides, acts, and receives feedback.', vi: 'Control loop lặp quan sát, quyết định, hành động và nhận phản hồi.' },
          { en: 'Timing and feedback make embodied learning different from static prediction.', vi: 'Thời gian và phản hồi khiến embodied learning khác dự đoán tĩnh.' },
        ],
      },
      imitationLearning: {
        title: { en: 'Imitation learning', vi: 'Imitation learning' },
        eyebrow: { en: 'Lesson 3', vi: 'Bài 3' },
        duration: { en: '9 min', vi: '9 phút' },
        theory: [
          { en: 'Imitation learning trains behavior from demonstrations.', vi: 'Imitation learning huấn luyện hành vi từ demo.' },
          { en: 'The core question is what observation-action pairs should teach the policy.', vi: 'Câu hỏi cốt lõi là cặp observation-action nào nên dạy policy.' },
        ],
      },
      simToReal: {
        title: { en: 'Sim-to-real gap', vi: 'Khoảng cách sim-to-real' },
        eyebrow: { en: 'Lesson 4', vi: 'Bài 4' },
        duration: { en: '10 min', vi: '10 phút' },
        theory: [
          { en: 'Sim-to-real work asks whether behavior learned in simulation survives the real world.', vi: 'Sim-to-real hỏi hành vi học trong mô phỏng có sống được ngoài đời thật không.' },
          { en: 'The lesson path will later compare dynamics, sensing noise, and domain randomization.', vi: 'Lộ trình sau này sẽ so sánh dynamics, nhiễu cảm biến và domain randomization.' },
        ],
      },
    },
    practiceItems: {
      shapeBasicsOutput: { title: { en: 'Read the next output shape', vi: 'Đọc shape đầu ra kế tiếp' } },
      conv2dShapeOutput: { title: { en: 'Predict Conv2d shape', vi: 'Dự đoán shape Conv2d' } },
      conv2dValueWindow: { title: { en: 'Follow one convolution window', vi: 'Theo dõi một cửa sổ convolution' } },
      poolShapeOutput: { title: { en: 'Predict pooling shape', vi: 'Dự đoán shape pooling' } },
      poolValueWindow: { title: { en: 'Choose the pooled value', vi: 'Chọn giá trị sau pooling' } },
      linearValueScore: { title: { en: 'Compute one Linear score', vi: 'Tính một điểm Linear' } },
      activationValuePass: { title: { en: 'Apply ReLU to values', vi: 'Áp dụng ReLU lên giá trị' } },
      attentionShapeOutput: { title: { en: 'Trace attention dimensions', vi: 'Theo dõi chiều attention' } },
    },
  },
  reinforcementLearning: {
    label: { en: 'TORCHVIZ REINFORCEMENT LEARNING', vi: 'TORCHVIZ REINFORCEMENT LEARNING' },
    title: { en: 'Reinforcement Learning', vi: 'Reinforcement Learning' },
    description: {
      en: 'A guided path for reinforcement learning fundamentals, from MDPs to temporal-difference updates.',
      vi: 'Lộ trình reinforcement learning từ MDP đến các cập nhật temporal-difference.',
    },
    back: { en: 'Back', vi: 'Quay lại' },
    landing: { en: 'Landing', vi: 'Trang chính' },
    path: { en: 'Path', vi: 'Lộ trình' },
    review: { en: 'Review', vi: 'Ôn tập' },
    role: { en: 'Track', vi: 'Hướng học' },
    domain: { en: 'Focus', vi: 'Trọng tâm' },
    lesson: { en: 'Lesson', vi: 'Bài học' },
    theory: { en: 'Theory', vi: 'Lý thuyết' },
    language: { en: 'Language', vi: 'Ngôn ngữ' },
    lightTheme: { en: 'Light', vi: 'Sáng' },
    darkTheme: { en: 'Dark', vi: 'Tối' },
    pathDescription: {
      en: 'Choose a track and focus area first, then open a focused lesson.',
      vi: 'Chọn hướng học và trọng tâm trước, rồi mở bài học phù hợp.',
    },
    chooseRoleTitle: { en: 'Choose your RL track', vi: 'Chọn hướng học RL' },
    chooseRoleDescription: {
      en: 'Start from the way you want to use reinforcement learning. Each track narrows the page into focused practice sequences.',
      vi: 'Bắt đầu từ cách bạn muốn dùng reinforcement learning. Mỗi hướng học sẽ thu hẹp trang thành các chuỗi luyện tập phù hợp.',
    },
    chooseDomainTitle: {
      en: () => 'Choose a focus area',
      vi: () => 'Chọn trọng tâm',
    },
    chooseDomainDescription: {
      en: 'Pick the RL idea you want to practice first. The next step opens the lesson sequence.',
      vi: 'Chọn ý tưởng RL muốn luyện trước. Bước tiếp theo sẽ mở chuỗi bài học.',
    },
    domainPreviewTitle: { en: 'What this track will focus on', vi: 'Hướng học này sẽ tập trung vào gì' },
    domainPreviewBody: {
      en: 'Use the left panel to choose a focus area. The lesson list will then switch to that RL sequence.',
      vi: 'Dùng panel bên trái để chọn trọng tâm. Danh sách bài học sau đó sẽ chuyển sang đúng chuỗi RL đó.',
    },
    guideTour: {
      ariaLabel: { en: 'Reinforcement Learning guide tour', vi: 'Hướng dẫn Reinforcement Learning' },
      skip: { en: 'Skip', vi: 'Bỏ qua' },
      back: { en: 'Back', vi: 'Quay lại' },
      next: { en: 'Next', vi: 'Tiếp' },
      done: { en: 'Done', vi: 'Hoàn tất' },
      stepLabel: {
        en: (step: number, total: number) => `Step ${step}/${total}`,
        vi: (step: number, total: number) => `Bước ${step}/${total}`,
      },
      steps: [
        {
          target: { en: '[data-tour="rl-logo"]', vi: '[data-tour="rl-logo"]' },
          title: { en: 'RL header', vi: 'Header RL' },
          body: {
            en: 'This is the Reinforcement Learning surface. The logo returns with the page header and the left brand area takes you back to Landing.',
            vi: 'Đây là khu vực Reinforcement Learning. Logo nằm trong header và vùng thương hiệu bên trái đưa bạn về Landing.',
          },
        },
        {
          target: { en: '[data-tour="rl-sidebar-toggle"]', vi: '[data-tour="rl-sidebar-toggle"]' },
          title: { en: 'Track sidebar', vi: 'Thanh lộ trình' },
          body: {
            en: 'Use this button to collapse or reopen the track sidebar when you want more room for the lesson content.',
            vi: 'Dùng nút này để thu gọn hoặc mở lại thanh lộ trình khi cần thêm không gian cho nội dung bài học.',
          },
        },
        {
          target: { en: '[data-tour="rl-mode-switch"]', vi: '[data-tour="rl-mode-switch"]' },
          title: { en: 'RL and 3D modes', vi: 'Chế độ RL và 3D' },
          body: {
            en: 'Switch between the RL learning path and the upcoming 3D visualization area.',
            vi: 'Chuyển đổi giữa lộ trình học RL và khu vực trực quan hóa 3D đang triển khai.',
          },
        },
        {
          target: { en: '[data-tour="rl-sidebar"]', vi: '[data-tour="rl-sidebar"]' },
          title: { en: 'Choose track and focus', vi: 'Chọn hướng và trọng tâm' },
          body: {
            en: 'Start with a track, choose a focus area, then open the ordered lesson list.',
            vi: 'Bắt đầu bằng hướng học, chọn trọng tâm, rồi mở danh sách bài học theo thứ tự.',
          },
        },
        {
          target: { en: '[data-tour="rl-path-content"]', vi: '[data-tour="rl-path-content"]' },
          title: { en: 'Lesson preview', vi: 'Xem trước bài học' },
          body: {
            en: 'The main panel explains what the selected track or focus area covers before you enter exercises.',
            vi: 'Khung chính giải thích hướng học hoặc trọng tâm đang chọn trước khi vào bài luyện tập.',
          },
        },
      ],
    },
    emptyTrackTitle: { en: 'No content yet', vi: 'Chưa có nội dung' },
    emptyTrackDescription: {
      en: 'This track is reserved for future Robot Learning lessons.',
      vi: 'Hướng học này được giữ chỗ cho các bài Robot Learning sau này.',
    },
    openNextLevel: { en: 'Open next level', vi: 'Mở cấp tiếp theo' },
    roleProfiles: {
      reinforcementLearning: {
        title: { en: 'Reinforcement Learning', vi: 'Reinforcement Learning' },
        description: {
          en: 'Learn RL fundamentals from MDPs to temporal-difference updates.',
          vi: 'Học nền tảng RL từ MDP đến các cập nhật temporal-difference.',
        },
        body: {
          en: 'This track emphasizes the mechanics behind an agent update: what state the agent saw, which action it took, and how the value estimate changes after feedback.',
          vi: 'Hướng này tập trung vào cơ chế phía sau một cập nhật agent: agent thấy state nào, chọn action nào, và ước lượng giá trị đổi ra sao sau phản hồi.',
        },
        detail: {
          en: 'Use it when you want implementation-level confidence before wiring a loop, reward signal, or policy into a larger system.',
          vi: 'Dùng hướng này khi bạn muốn tự tin ở mức triển khai trước khi nối loop, reward signal hoặc policy vào hệ thống lớn hơn.',
        },
      },
      robotLearning: {
        title: { en: 'Robot Learning', vi: 'Robot Learning' },
        description: {
          en: 'Reserved for embodied agents, control, and robotics practice.',
          vi: 'Giữ chỗ cho embodied agents, control và luyện tập robotics.',
        },
        body: {
          en: 'Robot Learning content is not available yet.',
          vi: 'Nội dung Robot Learning chưa sẵn sàng.',
        },
        detail: {
          en: 'This placeholder keeps the track visible while the lesson sequence is still being designed.',
          vi: 'Mục giữ chỗ này giúp hướng học hiển thị trong khi chuỗi bài học còn đang được thiết kế.',
        },
      },
    },
    domainProfiles: {
      reinforcementLearning: {
        tabularControl: {
          title: { en: 'Tabular Control', vi: 'Điều khiển dạng bảng' },
          shortDescription: { en: 'MDP, Bellman, Q-table updates.', vi: 'MDP, Bellman, cập nhật Q-table.' },
          longDescription: {
            en: 'Practice the core tabular loop: define the environment, read values from a table, and update Q estimates one transition at a time.',
            vi: 'Luyện vòng lặp tabular cốt lõi: định nghĩa environment, đọc giá trị từ bảng, và cập nhật Q từng transition.',
          },
        },
        policyBehavior: {
          title: { en: 'Policy Behavior', vi: 'Hành vi policy' },
          shortDescription: { en: 'Compare off-policy and on-policy updates.', vi: 'So sánh cập nhật off-policy và on-policy.' },
          longDescription: {
            en: 'Focus on how action selection changes the target in Q-Learning and SARSA, especially when exploration and the greedy action diverge.',
            vi: 'Tập trung vào cách chọn action làm đổi target trong Q-Learning và SARSA, nhất là khi exploration khác action tham lam.',
          },
        },
      },
    },
    reviewTitle: { en: 'RL review practice', vi: 'Ôn tập RL' },
    reviewDescription: {
      en: 'Jump directly to MDP, Bellman, or GridWorld practice outside the guided order.',
      vi: 'Nhảy thẳng đến bài MDP, Bellman hoặc GridWorld ngoài thứ tự lộ trình.',
    },
    openLesson: { en: 'Open lesson', vi: 'Mở bài học' },
    unavailablePractice: { en: 'In progress', vi: 'Đang hoàn thiện' },
    practiceCount: {
      en: (count: number) => `${count} practice ${count === 1 ? 'item' : 'items'}`,
      vi: (count: number) => `${count} bài luyện tập`,
    },
    lessonStatus: {
      available: { en: 'Available', vi: 'Sẵn sàng' },
      next: { en: 'Next up', vi: 'Tiếp theo' },
      locked: { en: 'Preview', vi: 'Xem trước' },
    },
    reviewKinds: {
      all: { en: 'All', vi: 'Tất cả' },
      rlShape: { en: 'MDP', vi: 'MDP' },
      rlValue: { en: 'Bellman', vi: 'Bellman' },
      gridworld: { en: 'GridWorld', vi: 'GridWorld' },
    },
    exercise: {
      mdpPrompt: {
        en: 'Identify the MDP pieces from the transition sketch. Use the transition that reaches Goal.',
        vi: 'Xác định các thành phần MDP từ sơ đồ transition. Dùng transition đi đến Goal.',
      },
      bellmanPrompt: {
        en: 'For optimal control, V*(s) is the maximum Q(s,a). Enter the best Q value.',
        vi: 'Với điều khiển tối ưu, V*(s) là Q(s,a) lớn nhất. Nhập giá trị Q tốt nhất.',
      },
      gridPrompt: {
        en: 'Compute the updated Q value for this single GridWorld step.',
        vi: 'Tính giá trị Q mới cho một bước GridWorld này.',
      },
      qLearningFormula: { en: 'Q <- Q + alpha * [r + gamma * max Q(next) - Q]', vi: 'Q <- Q + alpha * [r + gamma * max Q(next) - Q]' },
      sarsaFormula: { en: 'Q <- Q + alpha * [r + gamma * Q(next, next_action) - Q]', vi: 'Q <- Q + alpha * [r + gamma * Q(next, action kế tiếp) - Q]' },
      state: { en: 'State', vi: 'State' },
      action: { en: 'Action', vi: 'Action' },
      reward: { en: 'Reward', vi: 'Reward' },
      discount: { en: 'Discount', vi: 'Discount' },
      updatedQ: { en: 'updated Q', vi: 'updated Q' },
      maxQ: { en: 'max Q', vi: 'max Q' },
      check: { en: 'Check', vi: 'Kiểm tra' },
      reset: { en: 'Reset', vi: 'Làm lại' },
      correct: { en: 'Correct.', vi: 'Đúng rồi.' },
      incorrect: { en: 'Not quite yet. Recheck the update.', vi: 'Chưa đúng. Kiểm tra lại phép cập nhật.' },
    },
    lessons: {
      rlMdpBasics: {
        title: { en: 'MDP basics', vi: 'Nền tảng MDP' },
        eyebrow: { en: 'RL Lesson 1', vi: 'Bài RL 1' },
        duration: { en: '7 min', vi: '7 phút' },
        theory: [
          {
            en: 'An MDP defines states, actions, transition dynamics, rewards, a discount factor, episodes, and a policy.',
            vi: 'MDP định nghĩa state, action, dynamics chuyển trạng thái, reward, hệ số discount, episode và policy.',
          },
          {
            en: 'The useful debugging habit is to name which part of the environment each symbol represents before applying an update.',
            vi: 'Thói quen debug hữu ích là gọi tên từng ký hiệu thuộc phần nào của environment trước khi áp dụng công thức.',
          },
        ],
      },
      rlBellman: {
        title: { en: 'Bellman values', vi: 'Giá trị Bellman' },
        eyebrow: { en: 'RL Lesson 2', vi: 'Bài RL 2' },
        duration: { en: '8 min', vi: '8 phút' },
        theory: [
          {
            en: 'Bellman equations connect a current value to immediate reward plus discounted future value.',
            vi: 'Phương trình Bellman nối giá trị hiện tại với reward tức thời cộng giá trị tương lai đã discount.',
          },
          {
            en: 'For optimality, the agent chooses the action with the highest future value estimate.',
            vi: 'Với tối ưu, agent chọn action có ước lượng giá trị tương lai cao nhất.',
          },
        ],
      },
      rlQLearning: {
        title: { en: 'Q-Learning update', vi: 'Cập nhật Q-Learning' },
        eyebrow: { en: 'RL Lesson 3', vi: 'Bài RL 3' },
        duration: { en: '10 min', vi: '10 phút' },
        theory: [
          {
            en: 'Q-Learning is off-policy: the target uses the best next action, even if exploration picked something else.',
            vi: 'Q-Learning là off-policy: target dùng action kế tiếp tốt nhất, dù exploration có thể chọn action khác.',
          },
          {
            en: 'The update moves the old Q estimate toward reward plus discounted max next Q.',
            vi: 'Cập nhật kéo ước lượng Q cũ về reward cộng max next Q đã discount.',
          },
        ],
      },
      rlSarsa: {
        title: { en: 'SARSA update', vi: 'Cập nhật SARSA' },
        eyebrow: { en: 'RL Lesson 4', vi: 'Bài RL 4' },
        duration: { en: '10 min', vi: '10 phút' },
        theory: [
          {
            en: 'SARSA is on-policy: the target uses the next action actually selected by the current policy.',
            vi: 'SARSA là on-policy: target dùng action kế tiếp thật sự được policy hiện tại chọn.',
          },
          {
            en: 'Comparing SARSA with Q-Learning makes the policy boundary visible in one update.',
            vi: 'So sánh SARSA với Q-Learning làm rõ ranh giới policy chỉ trong một cập nhật.',
          },
        ],
      },
      rlExplorationPolicy: {
        title: { en: 'Exploration policy', vi: 'Policy exploration' },
        eyebrow: { en: 'RL Lesson 5', vi: 'Bài RL 5' },
        duration: { en: '8 min', vi: '8 phút' },
        theory: [
          {
            en: 'Exploration controls how often the agent tries actions that are not currently best.',
            vi: 'Exploration kiểm soát tần suất agent thử action chưa phải tốt nhất hiện tại.',
          },
          {
            en: 'This placeholder will later compare greedy, epsilon-greedy, and scheduled exploration.',
            vi: 'Placeholder này sau này sẽ so sánh greedy, epsilon-greedy và exploration theo lịch.',
          },
        ],
      },
      rlPolicyEvaluation: {
        title: { en: 'Policy evaluation', vi: 'Đánh giá policy' },
        eyebrow: { en: 'RL Lesson 6', vi: 'Bài RL 6' },
        duration: { en: '9 min', vi: '9 phút' },
        theory: [
          {
            en: 'Policy evaluation estimates how good a policy is before changing it.',
            vi: 'Policy evaluation ước lượng policy tốt đến đâu trước khi thay đổi policy đó.',
          },
          {
            en: 'The lesson will later connect rollouts, returns, and value estimates.',
            vi: 'Bài này sau này sẽ nối rollout, return và ước lượng value.',
          },
        ],
      },
    },
    practiceItems: {
      rlMdpComponentsGridworld: { title: { en: 'Identify MDP components', vi: 'Xác định thành phần MDP' } },
      rlBellmanQTableValue: { title: { en: 'Pick the Bellman value', vi: 'Chọn giá trị Bellman' } },
      rlQLearningGridworldStep: { title: { en: 'Update Q-Learning once', vi: 'Cập nhật Q-Learning một bước' } },
      rlSarsaGridworldStep: { title: { en: 'Update SARSA once', vi: 'Cập nhật SARSA một bước' } },
    },
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
      learning: { en: 'Learning', vi: 'Learning' },
      exercisePanelTitle: {
        en: (operation: string) => `Exercises · ${operation}`,
        vi: (operation: string) => `Bài tập · ${operation}`,
      },
      learningOpenPanelTitle: {
        en: (exercise: string) => `Open ${exercise} in Learning Lab`,
        vi: (exercise: string) => `Mở ${exercise} trong Learning Lab`,
      },
      learningOpenPanelBody: {
        en: 'The current visualization will stay here. Open the matching lesson in a new tab to study the theory, animation, and exercise inline.',
        vi: 'Trang visualization hiện tại sẽ được giữ nguyên. Mở lesson tương ứng ở tab mới để học lý thuyết, animation và bài tập inline.',
      },
      openLearningNewTab: { en: 'Open new tab', vi: 'Mở tab mới' },
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
type LearningPracticeText = {
  title: string;
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
  const lessons = t.lessons as Record<string, LearningLessonText>;
  const localizedLesson = lessons[toLearningContentKey(lesson.id)];
  if (localizedLesson) return localizedLesson;
  if (lesson.text) {
    return {
      title: lesson.text.title[language],
      eyebrow: lesson.text.eyebrow?.[language] ?? '',
      duration: lesson.text.duration?.[language] ?? '',
      theory: lesson.text.theory.map((item) => item[language]),
    };
  }
  return {
    title: lesson.id,
    eyebrow: '',
    duration: '',
    theory: [t.contentInProgress],
  };
}

export function getLearningPracticeText(
  t: LearningLabStrings,
  practice: { id: string },
): LearningPracticeText {
  const practiceItems = t.practiceItems as Record<string, LearningPracticeText>;
  return practiceItems[toLearningContentKey(practice.id)] ?? { title: practice.id };
}

function toLearningContentKey(id: string): string {
  return id.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

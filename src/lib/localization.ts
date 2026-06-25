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
      en: 'Guided lessons and review practice for CNN shapes, parameters, and operations.',
      vi: 'Bài học có hướng dẫn và luyện tập ôn tập cho shape CNN, tham số, và phép toán.',
    },
    learningOpen: { en: 'Start learning', vi: 'Bắt đầu học' },
    reinforcementLearningTitle: { en: 'Reinforcement Learning', vi: 'Reinforcement Learning' },
    reinforcementLearningDescription: {
      en: 'Guided reinforcement learning lessons for MDPs, Bellman updates, Q-Learning, and SARSA.',
      vi: 'Bài học reinforcement learning về MDP, Bellman update, Q-Learning và SARSA.',
    },
    reinforcementLearningOpen: { en: 'Start RL path', vi: 'Bắt đầu RL' },
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
            vi: 'Chuyển giữa lộ trình học RL và khu vực trực quan hóa 3D sắp có.',
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
      exercisePanelTitle: {
        en: (operation: string) => `Exercises · ${operation}`,
        vi: (operation: string) => `Bài tập · ${operation}`,
      },
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
type ReinforcementLearningStrings = LocalizedStrings['reinforcementLearning'];

export function getStrings(language: Language): LocalizedStrings {
  return strings[language] ?? strings.en;
}

export function getLearningLessonText(
  t: LearningLabStrings,
  lesson: { id: string },
): LearningLessonText {
  const lessons = t.lessons as Record<string, LearningLessonText>;
  return lessons[toLearningContentKey(lesson.id)] ?? { title: lesson.id, eyebrow: '', duration: '', theory: [] };
}

export function getLearningPracticeText(
  t: LearningLabStrings,
  practice: { id: string },
): LearningPracticeText {
  const practiceItems = t.practiceItems as Record<string, LearningPracticeText>;
  return practiceItems[toLearningContentKey(practice.id)] ?? { title: practice.id };
}

export function getReinforcementLessonText(
  t: ReinforcementLearningStrings,
  lesson: { id: string },
): LearningLessonText {
  const lessons = t.lessons as Record<string, LearningLessonText>;
  return lessons[toLearningContentKey(lesson.id)] ?? { title: lesson.id, eyebrow: '', duration: '', theory: [] };
}

export function getReinforcementPracticeText(
  t: ReinforcementLearningStrings,
  practice: { id: string },
): LearningPracticeText {
  const practiceItems = t.practiceItems as Record<string, LearningPracticeText>;
  return practiceItems[toLearningContentKey(practice.id)] ?? { title: practice.id };
}

function toLearningContentKey(id: string): string {
  return id.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

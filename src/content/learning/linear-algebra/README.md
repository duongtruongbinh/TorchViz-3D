# Linear Algebra Chapter 1 Content

Bộ này chứa nội dung Chapter 1 đã qua content review theo curriculum đã khóa.

## Theory

1. `vectors-intuition.vi.mdx`
2. `vector-operations.vi.mdx`
3. `vector-norms.vi.mdx`
4. `unit-vectors-normalization.vi.mdx`
5. `dot-product.vi.mdx`
6. `cosine-similarity.vi.mdx`
7. `matrix-operations.vi.mdx`
8. `elementwise-vs-matrix-product.vi.mdx`

## Quiz

Mỗi theory lesson có một quiz riêng. Phần lớn quiz có 3 câu. Quiz cuối chapter có 4 câu để kiểm tra thêm tính không giao hoán của matrix multiplication. Quiz dùng canonical `questions` contract giống các course LLM và Continual Learning.

## Visual

`CHAPTER1_VISUAL_SPEC.md` mô tả ý nghĩa và behavior cần có của các visual component. Agent có thể tái sử dụng primitive nội bộ nhưng không được đổi learning intent.

## Content rule

Nội dung trong các MDX file là authoritative cho giai đoạn implementation. Agent không tự paraphrase, thêm ví dụ, bỏ đoạn hoặc đổi công thức nếu chưa có yêu cầu riêng.

Implementation prompt: AGENT_IMPLEMENTATION_PROMPT.md

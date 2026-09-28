---
title: AIOps Learning Lab course
status: done
created: 2026-09-28T11:48:32+07:00
updated: 2026-09-28T13:15:00+07:00
author: Codex
task: "Plan the three-source AIOps course and implement Source 1 through the Chapter 1 vertical slice without editing the source Markdown."
supersedes: []
---

# Goal

Build one AIOps Learning Lab domain from three source documents. Source 1 is available and is the only source implemented in this delivery. Source 2 and Source 3 remain pending until their files are provided.

# Lineage

Genesis plan — no predecessor.

# Source model

| Source | Status | Current delivery |
|---|---|---|
| Source 1 — `2026-09-28-observability-engineering-metrics-logs-traces.md` | Available | Plan all chapters; publish Chapter 1 as the vertical slice |
| Source 2 | Pending upload | No invented chapters, lessons, or metadata |
| Source 3 | Pending upload | No invented chapters, lessons, or metadata |

# Decisions (locked)

- Create one `aiops` domain. Future sources extend the same domain.
- Keep the source Markdown unchanged. Its SHA-256 before implementation is `9948192B8DBF8670915DE032BE864F3F5D7038C2D11B65CAEDE9DE4A481E78F9`.
- Map each Source 1 `#` chapter to one Learning Lab chapter and each `##` section to one lesson.
- Publish only Chapter 1 in this delivery. Register Chapters 2–5 as missing content so the complete Source 1 path is visible without fabricating MDX.
- Copy Chapter 1 prose, lists, formulas, code, and links without editorial rewriting.
- Replace unavailable image embeds in the MDX copies with explicit `TODO(image)` comments containing the original asset path and alt text. The source Markdown remains untouched.
- Reuse the existing typed TOC, catalog, routes, MDX runtime, and shared components. Add no new runtime component or dependency.
- Keep the domain status `partial` until all three sources are delivered.

# Source 1 curriculum map

## Chapter 1 — Fundamentals of Observability and System Signals

| Source section | Lesson ID | Delivery status |
|---|---|---|
| 1.1 Monitoring and Observability | `monitoring-and-observability` | Published in Phase 4 |
| 1.2 Metrics, Logs, and Traces | `metrics-logs-and-traces` | Published in Phase 4 |
| 1.3 Choosing What to Measure | `choosing-what-to-measure` | Published in Phase 4 |
| 1.4 Service Reliability with SLI, SLO, and Error Budget | `service-reliability-sli-slo-error-budget` | Published in Phase 4 |
| 1.5 Hands-on: Chuẩn bị môi trường | `observability-environment-setup` | Published in Phase 4 |

## Chapter 2 — Metrics Collection and Analysis with Prometheus

| Source section | Lesson ID | Delivery status |
|---|---|---|
| 2.1 Prometheus and the Metrics Pipeline | `prometheus-metrics-pipeline` | Missing |
| 2.2 Exposing Metrics: Application Instrumentation and Exporters | `exposing-prometheus-metrics` | Missing |
| 2.3 Prometheus Time-Series Data Model | `prometheus-time-series-data-model` | Missing |
| 2.4 Hands-on: From Raw Metrics to Operational Signals with PromQL | `promql-operational-signals` | Missing |
| 2.5 Visualizing Metrics with Grafana | `grafana-metrics-dashboard` | Missing |

## Chapter 3 — Logs with Loki and Alloy

| Source section | Lesson ID | Delivery status |
|---|---|---|
| 3.1 From Metrics to Logs | `from-metrics-to-logs` | Missing |
| 3.2 Understanding Log Data | `understanding-log-data` | Missing |
| 3.3 Collecting Logs with Grafana Alloy | `collecting-logs-with-alloy` | Missing |
| 3.4 Storing Logs with Loki | `storing-logs-with-loki` | Missing |
| 3.5 Hands-on: Investigating Checkout Errors with LogQL | `logql-checkout-investigation` | Missing |

## Chapter 4 — Traces with OpenTelemetry and Jaeger

| Source section | Lesson ID | Delivery status |
|---|---|---|
| 4.1 From Logs to Distributed Tracing | `from-logs-to-distributed-tracing` | Missing |
| 4.2 Trace Relationships and Context Propagation | `trace-context-propagation` | Missing |
| 4.3 Instrumenting Applications with OpenTelemetry | `opentelemetry-instrumentation` | Missing |
| 4.4 Trace Pipeline with OTel Collector and Jaeger | `otel-collector-jaeger-pipeline` | Missing |
| 4.5 Hands-on: Following a Failed Checkout Request End-to-End | `failed-checkout-trace-investigation` | Missing |

## Chapter 5 — Correlation, Alerting, and Incident Investigation

| Source section | Lesson ID | Delivery status |
|---|---|---|
| 5.1 Telemetry Correlation | `telemetry-correlation` | Missing |
| 5.2 Alerting and Alert Management | `alerting-and-alert-management` | Missing |
| 5.3 End-to-End Incident Investigation | `end-to-end-incident-investigation` | Missing |

# Phases

## Phase 1 — Lock the course architecture

- Record the three-source model and no-invention boundary for pending sources.
- Lock the source preservation and image-flagging rules.

## Phase 2 — Map Source 1

- Register all five Source 1 chapters and their lesson IDs in this plan.
- Use the source heading structure as the curriculum boundary.

## Phase 3 — Create the AIOps course shell

- Add the `aiops` domain type and typed TOC.
- Register `aiops` in the React-free Learning Lab catalog.
- Keep unpublished lessons at `contentStatus: 'missing'`.

## Phase 4 — Publish the Chapter 1 vertical slice

- Create five Vietnamese MDX lessons from Source 1 sections 1.1–1.5.
- Preserve authored wording and technical examples.
- Flag unavailable images with `TODO(image)` comments.
- Verify catalog and MDX contracts without modifying the source Markdown.

# Deferred phases

- Convert Source 1 Chapters 2–5 in later batches.
- Audit and integrate Source 2 after upload.
- Audit and integrate Source 3 after upload.
- Mark the domain ready only after all three sources are complete.

# Out of scope

- Editing Source 1 prose.
- Inventing Source 2 or Source 3 curriculum.
- New Learning Lab UI components, routes, or dependencies.
- Image generation or image asset creation.
- Quiz and code-lab expansion beyond the authored Source 1 structure.

# Execution log

- 2026-09-28 11:48 +07:00 — Plan approved from the requested Phase 1–4 scope; execution started.
- 2026-09-28 11:55 +07:00 — Added the `aiops` domain, registered 23 Source 1 lessons across five chapters, published the five Chapter 1 MDX lessons, and left the remaining 18 lessons at `contentStatus: 'missing'`.
- 2026-09-28 11:55 +07:00 — Added six `TODO(image)` flags for unavailable Chapter 1 illustrations. Mechanical comparison confirmed that all five lesson bodies match their source sections after image-line substitution.
- 2026-09-28 11:55 +07:00 — Confirmed the source Markdown SHA-256 remains `9948192B8DBF8670915DE032BE864F3F5D7038C2D11B65CAEDE9DE4A481E78F9`. No test or build command was run for this content-only delivery.
- 2026-09-28 12:05 +07:00 — Added the missing `aiops` icon and card palette entries reported by TypeScript after the user ran `npm run verify`.
- 2026-09-28 12:25 +07:00 — Re-expressed the four Source 1.4 display formulas with the existing `BlockMath` component because raw `$$` LaTeX braces are parsed as JavaScript expressions by the MDX runtime. Formula content and source Markdown remain unchanged.
- 2026-09-28 12:40 +07:00 — Replaced all six Chapter 1 image flags with shared `LessonImage` references after the user uploaded the WebP assets to `assets/learning/aiops/` in R2.
- 2026-09-28 13:00 +07:00 — Added the optional shared `LessonImage.maxWidth` prop and limited the six Chapter 1 illustrations to `52rem`; existing lessons retain the full-width default.
- 2026-09-28 13:15 +07:00 — Reused the shared `LessonNote` info box for the eight authored definitions in Chapter 1; retained the SLO target example as a normal blockquote.

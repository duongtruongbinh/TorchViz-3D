import type { LearningTableOfContents, LearningTocTrackSeed } from '../../../core/learning/types.ts';

const published = (id: string, en: string, vi: string) => ({
  id,
  status: 'available' as const,
  contentStatus: 'published' as const,
  title: { en, vi },
});

const missing = (id: string, title: string) => ({
  id,
  status: 'locked' as const,
  contentStatus: 'missing' as const,
  title: { en: title, vi: title },
});

const chapters: LearningTocTrackSeed[] = [
  {
    id: 'observability-fundamentals',
    text: {
      title: {
        en: '1. Fundamentals of Observability and System Signals',
        vi: '1. Fundamentals of Observability and System Signals',
      },
      description: {
        en: 'Monitoring, observability, telemetry signals, measurement methods, service reliability, and the shared lab environment.',
        vi: 'Monitoring, observability, các tín hiệu telemetry, phương pháp đo lường, độ tin cậy dịch vụ và môi trường thực hành chung.',
      },
    },
    lessonIds: [
      published('monitoring-and-observability', 'Monitoring and Observability', 'Monitoring and Observability'),
      published('metrics-logs-and-traces', 'Metrics, Logs, and Traces', 'Metrics, Logs, and Traces'),
      published('choosing-what-to-measure', 'Choosing What to Measure', 'Choosing What to Measure'),
      published(
        'service-reliability-sli-slo-error-budget',
        'Service Reliability with SLI, SLO, and Error Budget',
        'Service Reliability with SLI, SLO, and Error Budget',
      ),
      published('observability-environment-setup', 'Hands-on: Environment Setup', 'Hands-on: Chuẩn bị môi trường'),
    ],
  },
  {
    id: 'prometheus-metrics',
    text: {
      title: { en: '2. Metrics Collection and Analysis with Prometheus', vi: '2. Metrics Collection and Analysis with Prometheus' },
      description: { en: 'Prometheus collection, data model, PromQL, and Grafana dashboards.', vi: 'Prometheus collection, data model, PromQL và Grafana dashboards.' },
    },
    lessonIds: [
      missing('prometheus-metrics-pipeline', 'Prometheus and the Metrics Pipeline'),
      missing('exposing-prometheus-metrics', 'Exposing Metrics: Application Instrumentation and Exporters'),
      missing('prometheus-time-series-data-model', 'Prometheus Time-Series Data Model'),
      missing('promql-operational-signals', 'Hands-on: From Raw Metrics to Operational Signals with PromQL'),
      missing('grafana-metrics-dashboard', 'Visualizing Metrics with Grafana'),
    ],
  },
  {
    id: 'loki-alloy-logs',
    text: {
      title: { en: '3. Logs with Loki and Alloy', vi: '3. Logs with Loki and Alloy' },
      description: { en: 'Log data, Alloy collection, Loki storage, and LogQL investigation.', vi: 'Log data, Alloy collection, Loki storage và LogQL investigation.' },
    },
    lessonIds: [
      missing('from-metrics-to-logs', 'From Metrics to Logs'),
      missing('understanding-log-data', 'Understanding Log Data'),
      missing('collecting-logs-with-alloy', 'Collecting Logs with Grafana Alloy'),
      missing('storing-logs-with-loki', 'Storing Logs with Loki'),
      missing('logql-checkout-investigation', 'Hands-on: Investigating Checkout Errors with LogQL'),
    ],
  },
  {
    id: 'opentelemetry-jaeger-traces',
    text: {
      title: { en: '4. Traces with OpenTelemetry and Jaeger', vi: '4. Traces with OpenTelemetry and Jaeger' },
      description: { en: 'Distributed tracing, context propagation, instrumentation, and Jaeger investigation.', vi: 'Distributed tracing, context propagation, instrumentation và Jaeger investigation.' },
    },
    lessonIds: [
      missing('from-logs-to-distributed-tracing', 'From Logs to Distributed Tracing'),
      missing('trace-context-propagation', 'Trace Relationships and Context Propagation'),
      missing('opentelemetry-instrumentation', 'Instrumenting Applications with OpenTelemetry'),
      missing('otel-collector-jaeger-pipeline', 'Trace Pipeline with OTel Collector and Jaeger'),
      missing('failed-checkout-trace-investigation', 'Hands-on: Following a Failed Checkout Request End-to-End'),
    ],
  },
  {
    id: 'incident-investigation',
    text: {
      title: { en: '5. Correlation, Alerting, and Incident Investigation', vi: '5. Correlation, Alerting, and Incident Investigation' },
      description: { en: 'Telemetry correlation, alert management, and end-to-end incident investigation.', vi: 'Telemetry correlation, alert management và end-to-end incident investigation.' },
    },
    lessonIds: [
      missing('telemetry-correlation', 'Telemetry Correlation'),
      missing('alerting-and-alert-management', 'Alerting and Alert Management'),
      missing('end-to-end-incident-investigation', 'End-to-End Incident Investigation'),
    ],
  },
];

export const learningTableOfContents = {
  id: 'aiops',
  text: {
    title: { en: 'AIOps', vi: 'AIOps' },
    description: {
      en: 'Apply observability, automation, and AI techniques to understand and operate production systems.',
      vi: 'Ứng dụng observability, tự động hóa và AI để hiểu và vận hành các hệ thống production.',
    },
  },
  status: 'partial',
  fallbackLocales: ['vi'],
  chapters,
  sectionKinds: ['theory', 'code'],
} satisfies LearningTableOfContents;

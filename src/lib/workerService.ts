import { createWorker } from '../workers/pyodideWorker.ts';
import { useStore } from '../store/useStore.ts';
import type { AppError } from './appError.ts';

const DEFAULT_RUN_TIMEOUT_MS = 15000;
const DEFAULT_INIT_TIMEOUT_MS = 45000;
const INVALID_SHAPE_ERROR: AppError = {
    message: 'Invalid input shape.',
    lineno: 0,
    hint: 'Use a JSON array of positive integers, e.g. [1, 3, 224, 224].',
};
const TIMEOUT_ERROR: AppError = {
    message: 'Python execution timed out.',
    lineno: 0,
    hint: 'Check for infinite loops or very expensive model construction, then run again.',
};

export function parseShape(s: string): number[] | null {
    try {
        const arr = JSON.parse(s);
        if (!Array.isArray(arr) || arr.length === 0) return null;
        if (!arr.every((n: unknown) => Number.isInteger(n) && (n as number) > 0)) return null;
        return arr as number[];
    } catch {
        return null;
    }
}

type WorkerFactory = () => Worker;

export class WorkerService {
    private worker: Worker | null = null;
    private workerReady = false;
    private nextRequestId = 0;
    private activeRequestId = -1;
    private activeTimeout: ReturnType<typeof setTimeout> | null = null;
    private activeInitTimeout: ReturnType<typeof setTimeout> | null = null;
    private activeRunWaitingForReady = false;
    private readonly workerFactory: WorkerFactory;
    private readonly runTimeoutMs: number;
    private readonly initTimeoutMs: number;

    constructor(
        workerFactory: WorkerFactory = createWorker,
        runTimeoutMs = DEFAULT_RUN_TIMEOUT_MS,
        initTimeoutMs = DEFAULT_INIT_TIMEOUT_MS,
    ) {
        this.workerFactory = workerFactory;
        this.runTimeoutMs = runTimeoutMs;
        this.initTimeoutMs = initTimeoutMs;
    }

    public init() {
        if (this.worker) return;
        try {
            this.worker = this.workerFactory();
            this.workerReady = false;
            this.startInitTimeout();
            this.worker.onmessage = (e) => {
                const { type, data, error: err, requestId } = e.data;
                if (type === 'ready') {
                    this.handleWorkerReady();
                    return;
                }
                if (requestId !== undefined && requestId !== this.activeRequestId) return;
                this.clearRunTimeout();
                this.clearInitTimeout();
                this.activeRunWaitingForReady = false;
                this.activeRequestId = -1;

                if (type === 'success' || type === 'partial') {
                    useStore.getState().setIrResult(data, type === 'partial' ? ((data.error || err) as AppError) : null);
                    useStore.getState().setLoading(false);
                } else {
                    useStore.getState().setError(err as AppError);
                    useStore.getState().setLoading(false);
                }
            };
            this.worker.onerror = (err) => {
                this.clearRunTimeout();
                this.clearInitTimeout();
                this.workerReady = false;
                this.activeRunWaitingForReady = false;
                this.activeRequestId = -1;
                useStore.getState().setLoading(false);
                console.error('Worker error:', err);
                useStore.getState().setCriticalError('Python Runtime Error. Check console/network.');
            };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            useStore.getState().setCriticalError(`Init Error: ${message}`);
        }
    }

    public run() {
        const state = useStore.getState();
        if (state.criticalError) return;
        const shape = parseShape(state.shapeInput);
        if (!shape) {
            state.setLoading(false);
            state.setError(INVALID_SHAPE_ERROR);
            return;
        }
        if (!this.worker) this.init();
        if (!this.worker) return;
        const id = ++this.nextRequestId;
        this.activeRequestId = id;

        state.setLoading(true);
        state.setError(null);
        this.activeRunWaitingForReady = !this.workerReady;
        if (this.workerReady) this.startRunTimeout(id);
        this.worker.postMessage({
            code: state.code.trim(),
            inputShape: shape,
            requestId: id,
        });
    }

    public runWithCodeAndShape(code: string, shape: number[]) {
        const state = useStore.getState();
        if (state.criticalError) return;
        if (!this.worker) this.init();
        if (!this.worker) return;
        if (!shape.length || !shape.every((n) => Number.isInteger(n) && n > 0)) {
            state.setLoading(false);
            state.setError(INVALID_SHAPE_ERROR);
            return;
        }
        const id = ++this.nextRequestId;
        this.activeRequestId = id;
        state.setLoading(true);
        state.setError(null);
        this.activeRunWaitingForReady = !this.workerReady;
        if (this.workerReady) this.startRunTimeout(id);
        this.worker.postMessage({
            code: code.trim(),
            inputShape: shape,
            requestId: id,
        });
    }

    public terminate() {
        this.clearRunTimeout();
        this.clearInitTimeout();
        this.worker?.terminate();
        this.worker = null;
        this.workerReady = false;
        this.activeRunWaitingForReady = false;
        this.activeRequestId = -1;
    }

    private handleWorkerReady() {
        this.workerReady = true;
        this.clearInitTimeout();
        if (!this.activeRunWaitingForReady || this.activeRequestId === -1) return;
        this.activeRunWaitingForReady = false;
        this.startRunTimeout(this.activeRequestId);
    }

    private startRunTimeout(requestId: number) {
        this.clearRunTimeout();
        this.activeTimeout = setTimeout(() => {
            if (requestId !== this.activeRequestId) return;
            this.worker?.terminate();
            this.worker = null;
            this.workerReady = false;
            this.activeRunWaitingForReady = false;
            this.activeRequestId = -1;
            const state = useStore.getState();
            state.setLoading(false);
            state.setError(TIMEOUT_ERROR);
            this.init();
        }, this.runTimeoutMs);
    }

    private clearRunTimeout() {
        if (!this.activeTimeout) return;
        clearTimeout(this.activeTimeout);
        this.activeTimeout = null;
    }

    private startInitTimeout() {
        this.clearInitTimeout();
        this.activeInitTimeout = setTimeout(() => {
            if (!this.worker || this.workerReady) return;
            this.clearRunTimeout();
            this.worker.terminate();
            this.worker = null;
            this.workerReady = false;
            this.activeRunWaitingForReady = false;
            this.activeRequestId = -1;
            const state = useStore.getState();
            state.setLoading(false);
            state.setCriticalError('Python Runtime Error. Check console/network.');
        }, this.initTimeoutMs);
    }

    private clearInitTimeout() {
        if (!this.activeInitTimeout) return;
        clearTimeout(this.activeInitTimeout);
        this.activeInitTimeout = null;
    }
}

export const workerService = new WorkerService();

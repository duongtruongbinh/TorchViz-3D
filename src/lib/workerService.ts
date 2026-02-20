import { createWorker } from '../workers/pyodideWorker';
import { useStore, TEMPLATES } from '../store/useStore';

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

class WorkerService {
    private worker: Worker | null = null;
    private nextRequestId = 0;
    private activeRequestId = -1;

    public init() {
        if (this.worker) return;
        try {
            this.worker = createWorker();
            this.worker.onmessage = (e) => {
                const { type, data, error: err, requestId } = e.data;
                if (requestId !== undefined && requestId !== this.activeRequestId) return;

                useStore.getState().setLoading(false);
                if (type === 'success' || type === 'partial') {
                    useStore.getState().setIrResult(data, type === 'partial' ? (data.error || err) : null);
                } else {
                    useStore.getState().setError(err);
                }
            };
            this.worker.onerror = (err) => {
                useStore.getState().setLoading(false);
                console.error('Worker error:', err);
                useStore.getState().setCriticalError('Python Runtime Error. Check console/network.');
            };
        } catch (err: any) {
            useStore.getState().setCriticalError(`Init Error: ${err.message}`);
        }
    }

    public run() {
        const state = useStore.getState();
        if (!this.worker || state.criticalError) return;

        const shape = parseShape(state.shapeInput) ?? TEMPLATES[state.activeTemplate].shape;
        const id = ++this.nextRequestId;
        this.activeRequestId = id;

        state.setLoading(true);
        state.setError(null);
        this.worker.postMessage({
            code: state.code.trim(),
            inputShape: shape,
            requestId: id,
        });
    }

    public runWithCodeAndShape(code: string, shape: number[]) {
        const state = useStore.getState();
        if (!this.worker || state.criticalError) return;
        const id = ++this.nextRequestId;
        this.activeRequestId = id;
        state.setLoading(true);
        state.setError(null);
        this.worker.postMessage({
            code: code.trim(),
            inputShape: shape,
            requestId: id,
        });
    }

    public terminate() {
        this.worker?.terminate();
        this.worker = null;
    }
}

export const workerService = new WorkerService();

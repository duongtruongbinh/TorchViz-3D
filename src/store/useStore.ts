import { create } from 'zustand';
import {
    collectCollapsibleContainerIds,
    initCollapsedIds,
} from '../lib/irTypes.ts';
import type {
    IRGraph,
    LayoutData,
} from '../lib/irTypes.ts';
import { computeLayout } from '../lib/layout.ts';
import lenetCode from '../templates/lenet5.ts';
import resnetCode from '../templates/mini_resnet.ts';
import vitCode from '../templates/mini_vit.ts';
import alexnetCode from '../templates/alexnet.ts';
import vgg16Code from '../templates/vgg16.ts';
import mobilenetV2Code from '../templates/mobilenet_v2.ts';
import unetCode from '../templates/unet.ts';
import type { Language } from '../lib/localization.ts';
import type { AppError } from '../lib/appError.ts';

export const TEMPLATES: Record<string, { name: string; code: string; shape: number[] }> = {
    lenet: { name: 'LeNet-5', code: lenetCode, shape: [1, 1, 32, 32] },
    resnet: { name: 'Mini-ResNet', code: resnetCode, shape: [1, 3, 32, 32] },
    vit: { name: 'Mini-ViT', code: vitCode, shape: [1, 3, 32, 32] },
    alexnet: { name: 'AlexNet', code: alexnetCode, shape: [1, 3, 224, 224] },
    vgg16: { name: 'VGG-16', code: vgg16Code, shape: [1, 3, 224, 224] },
    mobilenet: { name: 'MobileNetV2', code: mobilenetV2Code, shape: [1, 3, 224, 224] },
    unet: { name: 'UNet', code: unetCode, shape: [1, 3, 128, 128] },
};

interface AppState {
    language: Language;
    activeTemplate: string;
    code: string;
    shapeInput: string;

    ir: IRGraph | null;
    collapsedIds: Set<string>;
    loading: boolean;
    error: AppError | null;
    criticalError: string | null;

    highlightLine: number | null;
    highlightNodeId: string | null;
    selectedNodeId: string | null;

    layout: LayoutData | null;
    graphRevision: number;
    layoutRevision: number;

    setLanguage: (language: Language) => void;
    setActiveTemplate: (templateId: string) => void;
    setCode: (code: string) => void;
    setShapeInput: (shape: string) => void;
    setIrResult: (ir: IRGraph, error: AppError | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: AppError | null) => void;
    setCriticalError: (err: string | null) => void;

    toggleCollapse: (nodeId: string) => void;
    expandAll: () => void;
    collapseAll: () => void;
    setHighlightLine: (line: number | null) => void;
    setHighlightNodeId: (id: string | null) => void;
    setSelectedNodeId: (id: string | null) => void;
}

export const useStore = create<AppState>((set, get) => ({
    language: 'vi',
    activeTemplate: 'lenet',
    code: TEMPLATES.lenet.code.trim(),
    shapeInput: JSON.stringify(TEMPLATES.lenet.shape),

    ir: null,
    collapsedIds: new Set(),
    loading: false,
    error: null,
    criticalError: null,

    highlightLine: null,
    highlightNodeId: null,
    selectedNodeId: null,

    layout: null,
    graphRevision: 0,
    layoutRevision: 0,

    setLanguage: (language) => set({ language }),

    setActiveTemplate: (templateId: string) => {
        const t = TEMPLATES[templateId];
        if (!t) return;
        set({
            activeTemplate: templateId,
            code: t.code.trim(),
            shapeInput: JSON.stringify(t.shape),
            ir: null,
            error: null,
            selectedNodeId: null,
            layout: null
        });
    },

    setCode: (code) => set({ code }),
    setShapeInput: (shapeInput) => set({ shapeInput }),

    setIrResult: (ir, error) => {
        const collapsedIds = initCollapsedIds(ir);
        try {
            const layout = computeLayout(ir, collapsedIds);
            set((state) => ({
                ir,
                collapsedIds,
                error,
                selectedNodeId: null,
                layout,
                graphRevision: state.graphRevision + 1,
                layoutRevision: state.layoutRevision + 1,
            }));
        } catch (e) {
            console.error('Layout computation failed:', e);
            set((state) => ({
                ir,
                collapsedIds,
                error,
                selectedNodeId: null,
                layout: null,
                graphRevision: state.graphRevision + 1,
                layoutRevision: state.layoutRevision + 1,
            }));
        }
    },

    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setCriticalError: (criticalError) => set({ criticalError }),

    toggleCollapse: (nodeId) => {
        const state = get();
        if (!state.ir) return;
        const next = new Set(state.collapsedIds);
        if (next.has(nodeId)) next.delete(nodeId);
        else next.add(nodeId);

        try {
            const layout = computeLayout(state.ir, next);
            set((current) => ({ collapsedIds: next, layout, layoutRevision: current.layoutRevision + 1 }));
        } catch (e) {
            console.error('Layout computation failed:', e);
            set({ collapsedIds: next });
        }
    },

    expandAll: () => {
        const state = get();
        if (!state.ir) return;
        const next = new Set<string>();

        try {
            const layout = computeLayout(state.ir, next);
            set((current) => ({ collapsedIds: next, layout, layoutRevision: current.layoutRevision + 1 }));
        } catch (e) {
            console.error('Layout computation failed:', e);
            set({ collapsedIds: next });
        }
    },

    collapseAll: () => {
        const state = get();
        if (!state.ir) return;
        const next = collectCollapsibleContainerIds(state.ir);

        try {
            const layout = computeLayout(state.ir, next);
            set((current) => ({ collapsedIds: next, layout, layoutRevision: current.layoutRevision + 1 }));
        } catch (e) {
            console.error('Layout computation failed:', e);
            set({ collapsedIds: next });
        }
    },

    setHighlightLine: (highlightLine) => set({ highlightLine }),
    setHighlightNodeId: (highlightNodeId) => set({ highlightNodeId }),
    setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),
}));

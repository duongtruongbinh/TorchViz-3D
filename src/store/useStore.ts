import { create } from 'zustand';
import { IRGraph, LayoutData, initCollapsedIds } from '../lib/irTypes';
import { computeLayout } from '../lib/layout';
import lenetCode from '../templates/lenet5';
import resnetCode from '../templates/mini_resnet';
import vitCode from '../templates/mini_vit';
import alexnetCode from '../templates/alexnet';
import vgg16Code from '../templates/vgg16';
import mobilenetV2Code from '../templates/mobilenet_v2';
import unetCode from '../templates/unet';
import type { Language } from '../lib/localization';

export const TEMPLATES: Record<string, { name: string; code: string; shape: number[] }> = {
    lenet: { name: 'LeNet-5 (CNN)', code: lenetCode, shape: [1, 1, 32, 32] },
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
    error: any | null;
    criticalError: string | null;

    highlightLine: number | null;
    highlightNodeId: string | null;
    selectedNodeId: string | null;

    layout: LayoutData | null;

    setLanguage: (language: Language) => void;
    setActiveTemplate: (templateId: string) => void;
    setCode: (code: string) => void;
    setShapeInput: (shape: string) => void;
    setIrResult: (ir: IRGraph, error: any | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: any) => void;
    setCriticalError: (err: string | null) => void;

    toggleCollapse: (nodeId: string) => void;
    setHighlightLine: (line: number | null) => void;
    setHighlightNodeId: (id: string | null) => void;
    setSelectedNodeId: (id: string | null) => void;
}

export const useStore = create<AppState>((set, get) => ({
    language: 'en',
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
        set({ ir, collapsedIds, error, selectedNodeId: null });
        // update layout immediately
        try {
            const layout = computeLayout(ir, collapsedIds);
            set({ layout });
        } catch (e) {
            console.error('Layout computation failed:', e);
            set({ layout: null });
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
            set({ collapsedIds: next, layout });
        } catch (e) {
            console.error('Layout computation failed:', e);
            set({ collapsedIds: next });
        }
    },

    setHighlightLine: (highlightLine) => set({ highlightLine }),
    setHighlightNodeId: (highlightNodeId) => set({ highlightNodeId }),
    setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),
}));

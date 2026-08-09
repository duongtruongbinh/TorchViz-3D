import {
  BookOpen,
  Bot,
  BrainCircuit,
  Calculator,
  Code2,
  Cpu,
  Eye,
  MessageSquareText,
  Network,
  RefreshCw,
  Route,
  ServerCog,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

import type { LearningDomainId } from '../../core/learning/types';

export const DOMAIN_ICONS: Record<LearningDomainId, LucideIcon> = {
  'programming-foundation': Code2,
  'linear-algebra': Calculator,
  fundamentals: BookOpen,
  'deep-learning': BrainCircuit,
  cv: Eye,
  nlp: MessageSquareText,
  'llm-ai-engineering': Cpu,
  'continual-learning-llm': RefreshCw,
  'mlops-llmops-production-systems': ServerCog,
  'ai-system-design': Network,
  'ai-ethics-safety-governance': ShieldCheck,
  'reinforcement-learning': Route,
  'robot-learning': Bot,
};

export const DOMAIN_CARD_PALETTES: Record<LearningDomainId, {
  visual: string;
  glow: string;
  icon: string;
  accent: string;
}> = {
  'programming-foundation': {
    visual: 'bg-[#CDD0E5]',
    glow: 'bg-[#FFFFFF]/45',
    icon: 'bg-[#F5F4FF] text-[#454A75]',
    accent: 'bg-[#777EAF]',
  },
  'linear-algebra': {
    visual: 'bg-[#9BC9BB]',
    glow: 'bg-[#E8FFF5]/38',
    icon: 'bg-[#E8FFF7] text-[#245E52]',
    accent: 'bg-[#3E8978]',
  },
  fundamentals: {
    visual: 'bg-[#F0C9B5]',
    glow: 'bg-[#FFF1E9]/45',
    icon: 'bg-[#FFF3EC] text-[#8A5138]',
    accent: 'bg-[#C77655]',
  },
  'deep-learning': {
    visual: 'bg-[#B9CBE8]',
    glow: 'bg-[#EDF4FF]/42',
    icon: 'bg-[#EEF5FF] text-[#315D91]',
    accent: 'bg-[#5685BD]',
  },
  cv: {
    visual: 'bg-[#DAB9D3]',
    glow: 'bg-[#FFF0FC]/40',
    icon: 'bg-[#FFF0FB] text-[#7D476F]',
    accent: 'bg-[#AE6A9E]',
  },
  nlp: {
    visual: 'bg-[#F2D391]',
    glow: 'bg-[#FFF5D6]/48',
    icon: 'bg-[#FFF7DF] text-[#7B5B1E]',
    accent: 'bg-[#C79632]',
  },
  'llm-ai-engineering': {
    visual: 'bg-[#AABBD8]',
    glow: 'bg-[#EFF5FF]/38',
    icon: 'bg-[#EFF4FF] text-[#3C5680]',
    accent: 'bg-[#607CA8]',
  },
  'continual-learning-llm': {
    visual: 'bg-[#B4C6E7]',
    glow: 'bg-[#F0F4FF]/40',
    icon: 'bg-[#EFF4FF] text-[#3B5480]',
    accent: 'bg-[#5B78A8]',
  },
  'mlops-llmops-production-systems': {
    visual: 'bg-[#A7C8CF]',
    glow: 'bg-[#E9FCFF]/38',
    icon: 'bg-[#ECFBFD] text-[#32636C]',
    accent: 'bg-[#4F8A94]',
  },
  'ai-system-design': {
    visual: 'bg-[#C3B8DF]',
    glow: 'bg-[#F5F0FF]/42',
    icon: 'bg-[#F5F0FF] text-[#62518C]',
    accent: 'bg-[#8670B5]',
  },
  'ai-ethics-safety-governance': {
    visual: 'bg-[#B7D8C2]',
    glow: 'bg-[#EDFFF3]/42',
    icon: 'bg-[#EDFFF3] text-[#3E7050]',
    accent: 'bg-[#609770]',
  },
  'reinforcement-learning': {
    visual: 'bg-[#E4B9A8]',
    glow: 'bg-[#FFF0EA]/42',
    icon: 'bg-[#FFF0EA] text-[#86513C]',
    accent: 'bg-[#B96F52]',
  },
  'robot-learning': {
    visual: 'bg-[#B8C4C8]',
    glow: 'bg-[#F1FAFC]/38',
    icon: 'bg-[#F1FAFC] text-[#49636B]',
    accent: 'bg-[#6D8991]',
  },
};

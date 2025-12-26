export const categories = [
  { id: 'miniatures', label: 'Miniatures' },
  { id: 'props-cosplay', label: 'Props and Cosplay' },
  { id: 'generative', label: 'Generative 3D Model' },
  { id: 'tools', label: 'Tools' }
] as const

export type CategoryId = typeof categories[number]['id']

export interface Background {
  id: string
  name: string
  description: string
  color: string
  gradient: string | null
}

export const backgrounds: Background[] = [
  { id: 'transparent', name: 'Transparent', description: 'No background', color: 'transparent', gradient: null },
  { id: 'white', name: 'Studio White', description: 'Clean white', color: '#ffffff', gradient: null },
  { id: 'gray', name: 'Studio Gray', description: 'Neutral gray', color: '#f3f4f6', gradient: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' },
  { id: 'wood', name: 'Wood Desk', description: 'Natural wood', color: '#d4a574', gradient: 'linear-gradient(135deg, #d4a574 0%, #b8956a 100%)' },
  { id: 'gradient-purple', name: 'Modern Purple', description: 'Trendy purple', color: '#9333ea', gradient: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)' },
  { id: 'gradient-blue', name: 'Cool Blue', description: 'Professional', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }
]

export const stats = [
  { value: '-90%', label: 'Visual Production Costs' },
  { value: '+30%', label: 'Average Order Value' },
  { value: '+70%', label: 'Faster Time to Market' }
]

export const miniatureShowcase = {
  primedSrc: '/miniatures/space-marine-painted.png',
  paintedSrc: '/miniatures/space-marine-primed.png',
  promptedSrc: '/miniatures/space-marine-stylized.png',
  videoSrc: '' // Removed video as per user request for simplicity
}

export const PLAN_CONFIG = {
  free: {
    label: 'Free',
    monthlyPrice: 0,
    imageLimit: 5,
    sceneLimit: 0,
    models3DLimit: 0,
  },
  starter: {
    label: 'Starter',
    monthlyPrice: 19,
    imageLimit: 100,
    sceneLimit: 0,
    models3DLimit: 0,
  },
  pro: {
    label: 'Pro',
    monthlyPrice: 49,
    imageLimit: 500,
    sceneLimit: 100,
    models3DLimit: 0,
  },
  premium: {
    label: 'Premium (Add-on)',
    monthlyPrice: 29,
    imageLimit: 500,
    sceneLimit: 100,
    models3DLimit: 20,
  },
  enterprise: {
    label: 'Enterprise',
    monthlyPrice: null,
    custom: true,
  },
};

export type PlanTier = keyof typeof PLAN_CONFIG;

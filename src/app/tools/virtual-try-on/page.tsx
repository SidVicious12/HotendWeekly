import { ComingSoonTool } from '@/components/ComingSoonTool';

export default function VirtualTryOnPage() {
  return (
    <ComingSoonTool
      name="Virtual Try-On (Apparel)"
      tagline="See how clothing looks on different AI models"
      description="Upload your flat-lay or mannequin product photos and instantly see how they look on realistic AI models. No photoshoots required—just upload and transform."
      status="planned-q1"
      category="AI Model Image"
      features={[
        {
          title: "Flat-Lay to Model",
          description: "Transform flat clothing photos into on-model lifestyle shots."
        },
        {
          title: "Mannequin Removal",
          description: "Replace mannequins with realistic AI models automatically."
        },
        {
          title: "Size Visualization",
          description: "Show how garments fit on different body types and sizes."
        },
        {
          title: "Fabric Simulation",
          description: "AI preserves fabric texture, drape, and movement realistically."
        },
        {
          title: "Custom Poses",
          description: "Choose from various poses to showcase your garments best."
        },
        {
          title: "Background Options",
          description: "Select studio, lifestyle, or custom backgrounds for your shots."
        }
      ]}
      useCases={[
        "Fashion retailers",
        "Dropshipping businesses",
        "Clothing manufacturers",
        "Online boutiques",
        "Fashion marketplaces",
        "Resale platforms",
        "Fashion designers",
        "Wholesale catalogs"
      ]}
    />
  );
}

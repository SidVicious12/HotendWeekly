import { ComingSoonTool } from '@/components/ComingSoonTool';

export default function ProductInHandPage() {
  return (
    <ComingSoonTool
      name="Product In Hand"
      tagline="Show products being held or used in realistic scenarios"
      description="Create authentic-looking images of your products being held, worn, or used by AI-generated hands and models. Perfect for showing scale and creating relatable product imagery."
      status="planned-q2"
      category="AI Product Image"
      features={[
        {
          title: "Realistic Hand Placement",
          description: "AI generates natural-looking hands holding your products."
        },
        {
          title: "Scale Reference",
          description: "Help customers understand product size with human reference."
        },
        {
          title: "Use Case Scenarios",
          description: "Show products being used in their intended context."
        },
        {
          title: "Diverse Representation",
          description: "Choose from various skin tones and hand types."
        },
        {
          title: "Multiple Angles",
          description: "Generate different holding positions and perspectives."
        },
        {
          title: "Natural Integration",
          description: "Seamless blending with proper lighting and shadows."
        }
      ]}
      useCases={[
        "Small product photography",
        "Jewelry and accessories",
        "Electronics and gadgets",
        "Beauty products",
        "Food and beverages",
        "Handmade crafts",
        "3D printed items",
        "Collectibles and figurines"
      ]}
    />
  );
}

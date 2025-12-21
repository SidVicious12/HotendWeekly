import { ComingSoonTool } from '@/components/ComingSoonTool';

export default function InstructEditPage() {
  return (
    <ComingSoonTool
      name="Instruct Edit"
      tagline="Edit images using natural language instructions"
      description="Simply describe what you want to change, and our AI makes it happen. No complex tools or editing skills required—just type your instructions and watch the magic."
      status="planned-q1"
      category="AI Editor"
      features={[
        {
          title: "Natural Language Control",
          description: "Describe changes in plain English—AI understands context."
        },
        {
          title: "Selective Editing",
          description: "AI identifies exactly what to change based on your description."
        },
        {
          title: "Iterative Refinement",
          description: "Make follow-up adjustments with additional instructions."
        },
        {
          title: "Style Transfer",
          description: "Apply artistic styles or visual treatments with a sentence."
        },
        {
          title: "Object Manipulation",
          description: "Add, remove, or modify objects through text commands."
        },
        {
          title: "Quality Preservation",
          description: "Maintains image quality throughout the editing process."
        }
      ]}
      useCases={[
        "Quick product adjustments",
        "Marketing image tweaks",
        "Creative experimentation",
        "Batch editing workflows",
        "Non-designer users",
        "Rapid prototyping",
        "Content localization",
        "A/B testing variations"
      ]}
    />
  );
}

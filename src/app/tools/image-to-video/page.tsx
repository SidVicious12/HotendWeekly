import { ComingSoonTool } from '@/components/ComingSoonTool';

export default function ImageToVideoPage() {
  return (
    <ComingSoonTool
      name="Image to Video"
      tagline="Transform static product images into dynamic short videos"
      description="Turn your product photos into engaging video content for social media and ads. Our AI adds motion, transitions, and effects to bring your products to life."
      status="planned-q2"
      category="AI Video"
      features={[
        {
          title: "Smart Animation",
          description: "AI adds natural-looking motion to static product images."
        },
        {
          title: "Multiple Video Styles",
          description: "Choose from zoom, pan, rotate, and custom motion paths."
        },
        {
          title: "Social Media Ready",
          description: "Export in formats optimized for TikTok, Instagram, and more."
        },
        {
          title: "Music Integration",
          description: "Add royalty-free background music or upload your own."
        },
        {
          title: "Text Overlays",
          description: "Add animated text, prices, and call-to-actions."
        },
        {
          title: "Batch Video Creation",
          description: "Create videos for your entire catalog automatically."
        }
      ]}
      useCases={[
        "TikTok product showcases",
        "Instagram Reels",
        "Facebook video ads",
        "YouTube Shorts",
        "Product launch teasers",
        "Email marketing",
        "Digital signage",
        "Marketplace video listings"
      ]}
    />
  );
}

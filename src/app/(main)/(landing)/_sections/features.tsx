import { Brain, Palette, Sparkles } from "lucide-react";
import Container from "@/components/container";

const features = [
  {
    icon: <Brain className="h-10 w-10 text-primary" />,
    title: "Multiple AI Models",
    description:
      "Choose from various AI models including DALL-E, Stable Diffusion, and Midjourney to find the perfect style for your needs.",
  },
  {
    icon: <Sparkles className="h-10 w-10 text-primary" />,
    title: "Free to Try",
    description:
      "Start creating without commitment. Generate your first 10 images completely free, no credit card required.",
  },
  {
    icon: <Palette className="h-10 w-10 text-primary" />,
    title: "Multiple Styles",
    description: "Choose from various artistic styles including realistic, 3D, anime, and more to match your vision.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-secondary/50">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered tool makes image generation simple, fast, and accessible to everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
} 
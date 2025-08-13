import { SignedIn, SignedOut } from "@/components/auth";
import Container from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { ImagePreview } from "@/components/ui/image-preview";
import { HeroStats } from "@/components/ui/hero-stats";
import { Brain, Palette, Sparkles } from "lucide-react";
import { applicationName } from "@/app-config";

const features = [
  {
    icon: <Brain className="h-6 w-6 text-primary" />,
    title: "AI Models",
    description:
      "Choose from AI models including DALL-E 2, DALL-E 3.",
  },
  {
    icon: <Sparkles className="h-6 w-6 text-primary" />,
    title: "Free to Try",
    description:
      "Start creating without commitment. Generate your first 10 images completely free.",
  },
  {
    icon: <Palette className="h-6 w-6 text-primary" />,
    title: "Multiple Styles",
    description: "Choose from various artistic styles including realistic, 3D, anime, and more.",
  },
];

export async function HeroSection() {
  return (
    <>
      <Container>
        <div className="flex flex-col md:flex-row gap-y-14 w-full justify-between">
          <div className="flex flex-col justify-between max-w-[600px]">
            <div>
              <Badge className="text-sm md:text-base">
                No subscription required. Just flexible pricing.
              </Badge>
              <h1 className="text-3xl md:text-4xl mt-8 leading-[1.2] font-semibold">
                Skip the boring prompts, generate images with powerful AI models.
              </h1>
              <p className="mt-6 text-xl text-muted-foreground">
                I built {applicationName} because I was tired of boring prompts and clunky AI tools. Now, I use it every day to create, experiment, and have fun with the latest AI models. No hassle, just consistently professional results. Join me and see how powerful and enjoyable AI can be!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <SignedIn>
                  <Button 
                    asChild 
                    size="lg"
                    variant="default"
                    className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Link href={"/generate-image/from-text"}>Generate Now</Link>
                  </Button>
                </SignedIn>

                <SignedOut>
                  <Button 
                    asChild 
                    size="lg"
                    variant="default"
                    className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Link href={"/sign-in"}>Start Free with 10 Credits</Link>
                  </Button>
                </SignedOut>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 -ml-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 p-4 rounded-lg bg-card/50 hover:bg-card/80 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {feature.icon}
                      <h3 className="font-medium">{feature.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <Suspense fallback={<p className="mt-4 text-lg text-muted-foreground">Loading stats...</p>}>
              <HeroStats />
            </Suspense>
          </div>
          <ImagePreview
            src="/hero.png"
            width={500}
            height={300}
            prompt="Red-haired girl with blue eyes riding a giant fluffy white British Shorthair cat with a red bow tie, flying through the sky like Appa from Avatar The Last Airbender, among ancient stone pillars, fantasy style."
            style="Photo-Realistic"
            aiModel="dall-e-3"
          />
        </div>
      </Container>
    </>
  );
}

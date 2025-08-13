"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import { CheckoutButton } from "@/components/lemonSqueezy/buy-credits/checkout-button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Credit tier constants
const VOLUME_1_MAX_CREDITS = 200;
const VOLUME_2_MAX_CREDITS = 1000;
const VOLUME_3_START_CREDITS = VOLUME_2_MAX_CREDITS;
const MIN_CREDITS = 50;
const MAX_CREDITS = 2000;

// Price constants
const VOLUME_1_PRICE = 0.06;
const VOLUME_2_PRICE = 0.05;
const VOLUME_3_PRICE = 0.04;

// AI Models
type AIModel = {
  id: string;
  name: string;
  provider: string;
  isComingSoon?: boolean;
};

const AI_MODELS: AIModel[] = [
  {
    id: "dall-e-2",
    name: "DALL·E 2",
    provider: "OpenAI"
  },
  {
    id: "dall-e-3",
    name: "DALL·E 3",
    provider: "OpenAI"
  },
  {
    id: "stable-diffusion",
    name: "Stable Diffusion",
    provider: "Stability AI",
    isComingSoon: true
  }
];

// Features
type Feature = {
  id: string;
  name: string;
  description: string;
  isComingSoon?: boolean;
};

const FEATURES: Feature[] = [
  {
    id: "image-generation",
    name: "Image Generation From Text",
    description: "Generate images from text descriptions"
  },
  {
    id: "photo-editing",
    name: "Photo Editing",
    description: "Edit and enhance existing photos",
    isComingSoon: true
  }
];

// Credit costs per model and feature
type CreditCost = {
  modelId: string;
  featureId: string;
  credits: number | null; // null means feature not available for this model
};

const CREDIT_COSTS: CreditCost[] = [
  // DALL·E 2
  { modelId: "dall-e-2", featureId: "image-generation", credits: 1 },
  { modelId: "dall-e-2", featureId: "photo-editing", credits: null },
  
  // DALL·E 3
  { modelId: "dall-e-3", featureId: "image-generation", credits: 2 },
  { modelId: "dall-e-3", featureId: "photo-editing", credits: 3 },
  
  // Stable Diffusion
  { modelId: "stable-diffusion", featureId: "image-generation", credits: 1 },
  { modelId: "stable-diffusion", featureId: "photo-editing", credits: 2 }
];

function getCreditCost(modelId: string, featureId: string): number | null {
  const cost = CREDIT_COSTS.find(
    cost => cost.modelId === modelId && cost.featureId === featureId
  );
  return cost?.credits ?? null;
}

function PricingCard({
  title,
  price,
  credits,
}: {
  title: string;
  price: string;
  credits: number;
}) {
  const maxCredits = title === "Volume 1" 
    ? VOLUME_1_MAX_CREDITS 
    : title === "Volume 2" 
    ? VOLUME_2_MAX_CREDITS - VOLUME_1_MAX_CREDITS
    : VOLUME_2_MAX_CREDITS;

  const progressWidth = Math.min(100, (credits / maxCredits) * 100);

  return (
    <Card className="transition-all duration-300">
      <CardContent className="pt-6">
        <div className="mb-4">
          <div className="text-sm font-medium text-muted-foreground mb-1">{title}</div>
          <div className="text-2xl font-bold">
            ${price} <span className="text-sm font-normal text-muted-foreground">per credit</span>
          </div>
        </div>

        <div className="h-2 bg-muted rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressWidth}%` }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span>{credits} credits</span>
          <span>${(credits * parseFloat(price)).toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function FeatureSelector() {
  const [selectedFeature, setSelectedFeature] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  
  const availableModels = selectedFeature 
    ? AI_MODELS.filter(model => {
        const cost = getCreditCost(model.id, selectedFeature);
        return cost !== null;
      })
    : [];

  const creditCost = selectedModel && selectedFeature 
    ? getCreditCost(selectedModel, selectedFeature)
    : null;

  const selectedModelInfo = AI_MODELS.find(m => m.id === selectedModel);
  const selectedFeatureInfo = FEATURES.find(f => f.id === selectedFeature);

  return (
    <div className="space-y-8">
      <div className="grid gap-6">
        <div className="space-y-3">
          <label className="text-base font-medium text-foreground">What would you like to create?</label>
          <Select value={selectedFeature} onValueChange={(value) => {
            setSelectedFeature(value);
            setSelectedModel(""); // Reset model when feature changes
          }}>
            <SelectTrigger className="w-full h-14 bg-background border-2 hover:bg-accent/10 transition-colors">
              <SelectValue placeholder="Choose what you want to create" />
            </SelectTrigger>
            <SelectContent>
              {FEATURES.map((feature) => (
                <SelectItem 
                  key={feature.id} 
                  value={feature.id}
                  disabled={feature.isComingSoon}
                  className="h-12 hover:bg-accent focus:bg-accent data-[disabled]:opacity-50"
                >
                  <div className="flex justify-between items-center w-full pr-2">
                    <span className="font-medium">{feature.name}</span>
                    {feature.isComingSoon && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Coming Soon</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedFeature && !FEATURES.find(f => f.id === selectedFeature)?.isComingSoon && (
          <div className="space-y-3">
            <label className="text-base font-medium text-foreground">Choose your AI model</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-full h-14 bg-background border-2 hover:bg-accent/10 transition-colors">
                <SelectValue placeholder="Select an AI model" />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map((model) => (
                  <SelectItem 
                    key={model.id} 
                    value={model.id}
                    disabled={model.isComingSoon}
                    className="h-12 hover:bg-accent focus:bg-accent data-[disabled]:opacity-50"
                  >
                    <div className="flex justify-between items-center w-full pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{model.name}</span>
                        <span className="text-sm text-muted-foreground">by {model.provider}</span>
                      </div>
                      {model.isComingSoon && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Coming Soon</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {selectedModel && selectedFeature && creditCost !== null && 
       !FEATURES.find(f => f.id === selectedFeature)?.isComingSoon && 
       !AI_MODELS.find(m => m.id === selectedModel)?.isComingSoon && (
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary">
          <CardContent className="pt-4 pb-4">
            <div className="text-center space-y-3">
              <div className="space-y-1">
                <div className="text-base font-medium">{selectedModelInfo?.name}</div>
                <div className="text-sm text-muted-foreground">{selectedFeatureInfo?.name}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {creditCost} <span className="text-xl">credit{creditCost > 1 ? 's' : ''}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  per generation
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function PricingSection() {
  const [credits, setCredits] = useState(MIN_CREDITS)
  const [customCredits, setCustomCredits] = useState("")
  const [isCustomAmount, setIsCustomAmount] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [breakdown, setBreakdown] = useState({
    tier1: { credits: 0, cost: 0 },
    tier2: { credits: 0, cost: 0 },
    tier3: { credits: 0, cost: 0 },
    total: 0,
  })

  // JSON-LD Schema for pricing
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "AI Image Generation Credits",
    "description": "Pay-as-you-go credits for AI image generation from text descriptions",
    "image": "/logo.png",
    "brand": {
      "@type": "Brand",
      "name": "ToolDashAI"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Volume 1",
        "priceCurrency": "USD",
        "price": VOLUME_1_PRICE,
        "description": `1-${VOLUME_1_MAX_CREDITS} credits at $${VOLUME_1_PRICE} per credit`,
        "availability": "https://schema.org/InStock",
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "0",
            "currency": "USD"
          }
        },
        "hasMerchantReturnPolicy": {
          "@type": "MerchantReturnPolicy",
          "applicableCountry": "US",
          "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
          "merchantReturnDays": 14,
          "returnMethod": "https://schema.org/ReturnByMail"
        }
      },
      {
        "@type": "Offer",
        "name": "Volume 2",
        "priceCurrency": "USD",
        "price": VOLUME_2_PRICE,
        "description": `${VOLUME_1_MAX_CREDITS + 1}-${VOLUME_2_MAX_CREDITS} credits at $${VOLUME_2_PRICE} per credit`,
        "availability": "https://schema.org/InStock",
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "0",
            "currency": "USD"
          }
        },
        "hasMerchantReturnPolicy": {
          "@type": "MerchantReturnPolicy",
          "applicableCountry": "US",
          "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
          "merchantReturnDays": 14,
          "returnMethod": "https://schema.org/ReturnByMail"
        }
      },
      {
        "@type": "Offer",
        "name": "Volume 3",
        "priceCurrency": "USD",
        "price": VOLUME_3_PRICE,
        "description": `${VOLUME_2_MAX_CREDITS}+ credits at $${VOLUME_3_PRICE} per credit`,
        "availability": "https://schema.org/InStock",
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "0",
            "currency": "USD"
          }
        },
        "hasMerchantReturnPolicy": {
          "@type": "MerchantReturnPolicy",
          "applicableCountry": "US",
          "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
          "merchantReturnDays": 14,
          "returnMethod": "https://schema.org/ReturnByMail"
        }
      }
    ]
  };

  // Calculate pricing breakdown based on selected credits
  useEffect(() => {
    const creditAmount = isCustomAmount ? parseInt(customCredits) || MIN_CREDITS : credits
    
    if (creditAmount < MIN_CREDITS) {
      setError(`Minimum credit amount is ${MIN_CREDITS}`)
      return
    } else {
      setError(null)
    }

    const tier1Credits = Math.min(creditAmount, VOLUME_1_MAX_CREDITS) // First 250 credits at $0.08
    const tier2Credits = Math.max(0, Math.min(creditAmount - VOLUME_1_MAX_CREDITS, VOLUME_2_MAX_CREDITS - VOLUME_1_MAX_CREDITS)) // Next 750 credits at $0.06
    const tier3Credits = Math.max(0, creditAmount - VOLUME_3_START_CREDITS) // Remaining credits at $0.05

    const tier1Cost = tier1Credits * VOLUME_1_PRICE
    const tier2Cost = tier2Credits * VOLUME_2_PRICE
    const tier3Cost = tier3Credits * VOLUME_3_PRICE

    const totalCost = tier1Cost + tier2Cost + tier3Cost

    setBreakdown({
      tier1: { credits: tier1Credits, cost: tier1Cost },
      tier2: { credits: tier2Credits, cost: tier2Cost },
      tier3: { credits: tier3Credits, cost: tier3Cost },
      total: totalCost,
    })
  }, [credits, customCredits, isCustomAmount])

  const handleSliderChange = (value: number[]) => {
    const newValue = value[0]
    setCredits(newValue)
    setIsCustomAmount(false)
    setCustomCredits("")
    setError(null)
  }

  const handleCustomCreditsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "") {
      setCustomCredits("")
      setIsCustomAmount(false)
      setError(null)
      return
    }
    
    setCustomCredits(value)
    setIsCustomAmount(true)
  }

  const effectiveCredits = isCustomAmount ? (parseInt(customCredits) || MIN_CREDITS) : credits

  return (
    <section
      id="pricing"
      className="container mx-auto py-24 bg-gray-100 dark:bg-background"
      aria-labelledby="pricing-title"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="w-full max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 id="pricing-title" className="text-3xl font-bold tracking-tight mb-2">Credit-Based Pricing</h2>
          <p className="text-muted-foreground mb-6">Start with 10 free credits. Additional credits can be purchased anytime.</p>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Calculate Credit Usage</h3>
            
            <div className="mb-12 max-w-md mx-auto">
              <FeatureSelector />
            </div>

            <section aria-label="Features included" className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-8">
              <h4 className="font-medium mb-3">Every Purchase Includes:</h4>
              <ul className="space-y-2" role="list">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>Access to All Available AI Models</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>Commercial Usage Rights</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>Credits Never Expire</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>One-Time Payment (No Subscription)</span>
                </li>
              </ul>
            </section>

            <section aria-label="Volume pricing tiers" className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-3">Volume-Based Credit Pricing:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded">
                  <div className="font-semibold">Volume 1</div>
                  <div className="text-lg sm:text-xl font-bold my-1">${VOLUME_1_PRICE.toFixed(2)}/credit</div>
                  <div className="text-muted-foreground text-xs sm:text-sm">1-{VOLUME_1_MAX_CREDITS} credits</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded">
                  <div className="font-semibold">Volume 2</div>
                  <div className="text-lg sm:text-xl font-bold my-1">${VOLUME_2_PRICE.toFixed(2)}/credit</div>
                  <div className="text-muted-foreground text-xs sm:text-sm">{VOLUME_1_MAX_CREDITS + 1}-{VOLUME_2_MAX_CREDITS} credits</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded">
                  <div className="font-semibold">Volume 3</div>
                  <div className="text-lg sm:text-xl font-bold my-1">${VOLUME_3_PRICE.toFixed(2)}/credit</div>
                  <div className="text-muted-foreground text-xs sm:text-sm">{VOLUME_2_MAX_CREDITS}+ credits</div>
                </div>
              </div>
              <div className="mt-4 text-center p-2 border border-primary/20 rounded bg-primary/5">
                <p className="text-sm font-medium text-primary">
                  Minimum purchase: {MIN_CREDITS} credits
                </p>
              </div>
            </section>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <PricingCard
            title="Volume 1"
            price={VOLUME_1_PRICE.toFixed(2)}
            credits={breakdown.tier1.credits}
          />
          <PricingCard
            title="Volume 2"
            price={VOLUME_2_PRICE.toFixed(2)}
            credits={breakdown.tier2.credits}
          />
          <PricingCard
            title="Volume 3"
            price={VOLUME_3_PRICE.toFixed(2)}
            credits={breakdown.tier3.credits}
          />
        </div>

        <div className="mb-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Credits: {effectiveCredits}</span>
            <span className="text-sm font-medium text-right">
              Total: <span className="text-xl font-bold">${breakdown.total.toFixed(2)}</span>
            </span>
          </div>
          <div className="space-y-4">
            <Slider
              value={[credits]}
              min={MIN_CREDITS}
              max={MAX_CREDITS}
              step={10}
              onValueChange={handleSliderChange}
              className="mb-4"
              aria-label="Select credit amount"
            />
            <div className="space-y-2">
              <Input
                type="number"
                placeholder={`Enter custom amount (min ${MIN_CREDITS})`}
                value={customCredits}
                onChange={handleCustomCreditsChange}
                min={MIN_CREDITS}
                className={`w-full ${error ? 'border-red-500' : ''}`}
                aria-label="Custom credit amount"
                aria-invalid={!!error}
                aria-describedby={error ? "credit-error" : undefined}
              />
              {error && (
                <p id="credit-error" className="text-sm text-red-500" role="alert">{error}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-center mb-6">
            <div className="text-sm text-muted-foreground mb-1">You selected</div>
            <div className="text-xl font-bold">{effectiveCredits} credits</div>
            <div className="text-xl font-medium">Total: ${breakdown.total.toFixed(2)}</div>

            <CheckoutButton
              credits={effectiveCredits}
              className="text-lg w-full md:w-auto md:px-8 md:py-2 mt-4"
              disabled={!!error || effectiveCredits < MIN_CREDITS}
            >
              Buy Credits
            </CheckoutButton>
          </div>
        </div>
      </div>
    </section>
  )
}
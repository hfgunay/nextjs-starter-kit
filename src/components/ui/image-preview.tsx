'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Loader2, AlertCircle, Download, Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface ImagePreviewProps {
  src: string;
  prompt: string;
  aiModel?: string;
  style?: string;
  width?: number;
  height?: number;
  className?: string;
  showActions?: boolean;
}

export function ImagePreview({
  src,
  prompt,
  aiModel,
  style,
  width = 400,
  height = 400,
  className,
  showActions = true,
}: ImagePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const imageUrl = src;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Copied",
        description: "Prompt copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy prompt. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    try {
      const a = document.createElement('a');
      a.href = src;
      a.download = `${prompt.slice(0, 30)}.png`;
      a.click();
    } catch (error) {
      console.error('Failed to download image:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        try {
          // Önce resmi blob olarak alalım
          const response = await fetch(src);
          const blob = await response.blob();
          
          // Blob'dan file oluşturalım
          const file = new File([blob], `${prompt.slice(0, 30)}.png`, { 
            type: 'image/png' 
          });

          // Eğer files paylaşımı destekleniyorsa
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: prompt,
              text: `Check out this AI-generated image: ${prompt}`,
            });
          } else {
            // Files paylaşımı desteklenmiyorsa URL paylaş
            await navigator.share({
              title: prompt,
              text: `Check out this AI-generated image: ${prompt}`,
              url: src
            });
          }
        } catch (shareError) {
          if (shareError instanceof Error && 
             (shareError.name === 'AbortError' || 
              shareError.message.includes('Share canceled') || 
              shareError.message.includes('Share cancelled'))) {
            return;
          }
          throw shareError;
        }
      } else {
        await navigator.clipboard.writeText(src);
        toast({
          title: "Link Copied",
          description: "Image link copied to clipboard!",
        });
      }
    } catch (error) {
      console.error('Failed to share image:', error);
      if (error instanceof Error && 
          error.name !== 'AbortError' && 
          !error.message.includes('Share canceled') && 
          !error.message.includes('Share cancelled')) {
        toast({
          title: "Share Failed",
          description: "Failed to share the image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className={cn(
      "group relative aspect-square rounded-lg overflow-hidden border border-border/20 bg-secondary/10 hover:shadow-md transition-safe",
      className
    )}>
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/20 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-destructive/10 z-10">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-destructive">Failed to load image</p>
        </div>
      )}

      {/* Image */}
      <Image
        src={imageUrl}
        alt={prompt}
        width={width}
        height={height}
        className={cn(
          "w-full h-full object-cover transition-safe",
          isLoading ? "opacity-0" : "group-hover:scale-105",
          hasError && "hidden"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        priority={true}
        quality={90}
        loading="eager"
      />

      {/* Info Overlay */}
      {!hasError && (
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-safe flex flex-col justify-end p-4",
            isLoading ? "opacity-0" : "opacity-0 group-hover:opacity-100"
          )}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-white text-sm line-clamp-2 mb-2 cursor-default font-medium">
                  {prompt}
                </p>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                className="max-w-[300px] break-words"
                sideOffset={5}
              >
                <div className="flex items-start gap-2">
                  <p className="flex-1">{prompt}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={handleCopyPrompt}
                  >
                    {isCopied ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="flex gap-2">
              {aiModel && (
                <span className="px-2 py-1 rounded-md bg-primary/20 backdrop-blur-sm text-white/90 text-xs font-medium">
                  {aiModel}
                </span>
              )}
              {style && (
                <span className="px-2 py-1 rounded-md bg-secondary/20 backdrop-blur-sm text-white/90 text-xs font-medium">
                  {style}
                </span>
              )}
            </div>
            {showActions && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-black/20 hover:bg-black/40 text-white"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-black/20 hover:bg-black/40 text-white"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 
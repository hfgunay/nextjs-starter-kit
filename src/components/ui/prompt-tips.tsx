'use client';

import { Sparkles, ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';

interface Tip {
  title: string;
  example: string;
}

interface PromptTipsProps {
  proTip?: string;
  tips: Tip[];
  children?: ReactNode;
}

export function PromptTips({ 
  proTip,
  tips,
  children
}: PromptTipsProps) {
  return (
    <div className="mt-2 space-y-2 text-sm text-muted-foreground">
      {proTip && (
        <p className="flex items-center text-primary/80">
          <Sparkles className="h-4 w-4" />
          {proTip}
        </p>
      )}
      <details className="cursor-pointer group">
        <summary className="flex items-center gap-2 text-sm text-muted-foreground pl-0">
          <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
          <span>Tips for better prompts</span>
        </summary>
        <ul className="mt-2 ml-4 space-y-1 list-disc">
          {tips.map((tip, index) => (
            <li key={index}>
              {tip.title} (e.g., "{tip.example}")
            </li>
          ))}
        </ul>
      </details>
      {children}
    </div>
  );
} 
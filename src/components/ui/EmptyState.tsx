import React, { ComponentType } from "react";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Card } from "./Card";

interface EmptyStateProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  upcomingFeatures?: string[];
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  badgeText?: string;
  variant?: "mediterranean" | "violet" | "rose";
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  upcomingFeatures = [],
  primaryActionLabel = "Module prêt pour le Prompt 002",
  onPrimaryAction,
  badgeText = "Architecture v1.0",
  variant = "mediterranean",
}: EmptyStateProps) {
  const iconGradients = {
    mediterranean: "from-mediterranean-500/10 to-light-blue/20 text-mediterranean-600 border-mediterranean-200/60",
    violet: "from-violet-500/10 to-violet-200/30 text-violet-600 border-violet-200/60",
    rose: "from-rose-500/10 to-rose-200/30 text-rose-600 border-rose-200/60",
  };

  return (
    <Card className="flex flex-col items-center justify-center p-8 sm:p-12 text-center max-w-3xl mx-auto my-6 border-dashed">
      <div
        className={`mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br border shadow-sm ${iconGradients[variant]}`}
      >
        <Icon className="h-10 w-10" />
      </div>

      <div className="mb-2 flex items-center justify-center gap-2">
        <Badge variant={variant}>{badgeText}</Badge>
      </div>

      <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl mt-2 mb-3">
        {title}
      </h2>

      <p className="text-sm text-slate-500 max-w-lg mb-8 leading-relaxed">
        {description}
      </p>

      {upcomingFeatures.length > 0 && (
        <div className="w-full max-w-md bg-slate-50/80 rounded-2xl p-5 border border-slate-200/70 mb-8 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5 text-mediterranean-500" />
            <span>Fonctionnalités prévues (Roadmap)</span>
          </div>

          <ul className="space-y-2.5">
            {upcomingFeatures.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {primaryActionLabel && (
        <Button
          variant={variant}
          size="md"
          icon={<ArrowRight className="h-4 w-4" />}
          onClick={onPrimaryAction}
        >
          {primaryActionLabel}
        </Button>
      )}
    </Card>
  );
}

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  bordered?: boolean;
  variant?: "default" | "glass" | "elevated" | "flat" | "stage";
}

export function Card({
  children,
  className,
  interactive = false,
  bordered = true,
  variant = "default",
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-white text-slate-900 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.05),0_1px_3px_0_rgba(15,23,42,0.02)]",
    glass: "bg-white/80 backdrop-blur-xl text-slate-900 shadow-glass",
    elevated: "bg-white text-slate-900 shadow-glass-elevated",
    flat: "bg-slate-50/70 text-slate-900 shadow-none",
    stage: "bg-stage-gradient text-white shadow-glow-lg border-white/10",
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-4 sm:p-5 transition-all duration-200 relative overflow-hidden",
        variantStyles[variant],
        bordered && variant !== "stage" && "border border-slate-200/80",
        bordered && variant === "stage" && "border border-white/15",
        interactive &&
          "cursor-pointer hover:shadow-card-hover hover:border-mediterranean-300/90 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] active:bg-slate-50/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  subtitle,
  action,
  children,
  className,
}: CardHeaderProps) {
  if (children) {
    return (
      <div className={cn("flex flex-col gap-1 mb-3.5", className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn("mb-3.5 flex items-start justify-between gap-3", className)}>
      <div>
        {title && <h3 className="text-base font-extrabold text-slate-900 tracking-tight">{title}</h3>}
        {subtitle && <p className="mt-0.5 text-xs text-slate-500 font-medium">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("text-base font-extrabold text-slate-900 tracking-tight", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-xs text-slate-500 font-medium leading-relaxed", className)}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("text-sm", className)}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-4 pt-3 border-t border-slate-100/90 flex items-center justify-between text-xs text-slate-500 font-medium", className)}>
      {children}
    </div>
  );
}

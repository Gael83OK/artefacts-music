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
  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      background: "var(--bg-card)",
      color: "var(--text-primary)",
    },
    glass: {
      background: "rgba(28, 24, 41, 0.85)",
      backdropFilter: "blur(20px) saturate(160%)",
      WebkitBackdropFilter: "blur(20px) saturate(160%)",
      color: "var(--text-primary)",
    },
    elevated: {
      background: "var(--bg-elevated)",
      color: "var(--text-primary)",
    },
    flat: {
      background: "rgba(255,255,255,0.03)",
      color: "var(--text-primary)",
    },
    stage: {
      background: "linear-gradient(135deg, #0B0F1A 0%, #1A1744 40%, #2D2880 70%, #0369A1 100%)",
      color: "#F0EDF8",
    },
  };

  const borderStyles: Record<string, string> = {
    default:  "border border-white/[0.06]",
    glass:    "border border-white/[0.08]",
    elevated: "border border-white/[0.07]",
    flat:     "border border-white/[0.04]",
    stage:    "border border-white/[0.12]",
  };

  return (
    <div
      className={cn(
        "rounded-2xl p-4 sm:p-5 transition-all duration-200 relative overflow-hidden",
        bordered && borderStyles[variant],
        interactive && "cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]",
        className
      )}
      style={{
        ...variantStyles[variant],
        ...(interactive
          ? { boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }
          : { boxShadow: "0 2px 16px rgba(0,0,0,0.25)" }),
      }}
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
        {title && (
          <h3 className="text-base font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="mt-0.5 text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
            {subtitle}
          </p>
        )}
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
    <h3
      className={cn("text-base font-extrabold tracking-tight", className)}
      style={{ color: "var(--text-primary)" }}
    >
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
    <p
      className={cn("text-xs font-medium leading-relaxed", className)}
      style={{ color: "var(--text-secondary)" }}
    >
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
    <div
      className={cn(
        "mt-4 pt-3 flex items-center justify-between text-xs font-medium",
        className
      )}
      style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        color: "var(--text-muted)",
      }}
    >
      {children}
    </div>
  );
}

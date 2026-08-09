import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  bordered?: boolean;
}

export function Card({
  children,
  className,
  interactive = false,
  bordered = true,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-5 text-slate-900 shadow-card transition-all duration-200",
        bordered && "border border-slate-200/70",
        interactive &&
          "cursor-pointer hover:shadow-card-hover hover:border-mediterranean-200/80 active:scale-[0.995]",
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
      <div className={cn("flex flex-col gap-1 mb-4", className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn("mb-4 flex items-start justify-between gap-4", className)}>
      <div>
        {title && <h3 className="text-base font-semibold text-slate-900 tracking-tight">{title}</h3>}
        {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
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
    <h3 className={cn("text-base font-semibold text-slate-900 tracking-tight", className)}>
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
    <p className={cn("text-xs text-slate-500 leading-relaxed", className)}>
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
    <div className={cn("mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500", className)}>
      {children}
    </div>
  );
}


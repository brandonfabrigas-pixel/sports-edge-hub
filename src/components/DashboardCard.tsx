import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export const DashboardCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = "neutral",
  className,
}: DashboardCardProps) => {
  return (
    <div
      className={cn(
        "bg-card rounded-xl p-5 shadow-lg border border-border hover:border-primary/50 transition-all",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {Icon && (
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p
          className={cn(
            "text-3xl font-bold",
            trend === "up" && "text-accent",
            trend === "down" && "text-destructive",
            trend === "neutral" && "text-foreground"
          )}
        >
          {value}
        </p>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

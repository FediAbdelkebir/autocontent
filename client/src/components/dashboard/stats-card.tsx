import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  iconColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
    label: string;
  };
}

export const StatsCard = ({
  title,
  value,
  icon,
  iconColor,
  trend
}: StatsCardProps) => {
  return (
    <div className="bg-surface rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={cn("stats-card-icon", `bg-${iconColor}`)}>
          <i className={cn(icon, `text-${iconColor}`)}></i>
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-3 text-xs">
          <span className={cn("flex items-center", trend.isPositive ? 'text-secondary' : 'text-destructive')}>
            <i className={cn(trend.isPositive ? 'ri-arrow-up-line' : 'ri-arrow-down-line', 'mr-1')}></i>
            {trend.value}
          </span>
          <span className="text-muted-foreground ml-2">{trend.label}</span>
        </div>
      )}
    </div>
  );
};

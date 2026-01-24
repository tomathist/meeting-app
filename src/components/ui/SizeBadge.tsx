import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SizeBadgeProps {
  size: string;
  className?: string;
  variant?: 'default' | 'compact';
}

export function SizeBadge({ size, className, variant = 'default' }: SizeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-secondary text-secondary-foreground font-semibold",
        variant === 'default' && "px-2.5 py-1 text-xs",
        variant === 'compact' && "px-2 py-0.5 text-xs",
        className
      )}
    >
      <Users className={cn(
        variant === 'default' && "w-3 h-3",
        variant === 'compact' && "w-3 h-3"
      )} />
      {size}
    </span>
  );
}

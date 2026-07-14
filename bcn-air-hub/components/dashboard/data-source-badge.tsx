import { cn } from '@/lib/utils';
import type { DataSource } from '@/types';

export function DataSourceBadge({ source }: { source: DataSource }) {
  const isLive = source === 'live';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wide',
        isLive
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
          : 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400')} />
      {isLive ? 'Dades en viu' : 'Dades de demo'}
    </span>
  );
}

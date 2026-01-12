import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CardSkeletonProps {
  showHeader?: boolean;
  headerHeight?: string;
  contentLines?: number;
  className?: string;
}

export function CardSkeleton({
  showHeader = true,
  headerHeight = "h-6",
  contentLines = 3,
  className = "",
}: CardSkeletonProps) {
  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          <Skeleton className={`${headerHeight} w-3/4`} />
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {Array.from({ length: contentLines }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-4 ${i === contentLines - 1 ? "w-2/3" : "w-full"}`}
          />
        ))}
      </CardContent>
    </Card>
  );
}

interface StatCardSkeletonProps {
  count?: number;
}

export function StatCardSkeleton({ count = 4 }: StatCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
          <div className="flex items-baseline gap-2">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </>
  );
}

interface GridCardSkeletonProps {
  count?: number;
  className?: string;
}

export function GridCardSkeleton({
  count = 6,
  className = "",
}: GridCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden p-4 space-y-3",
            className
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>

          <div className="flex items-end justify-between pt-1">
            <div className="space-y-1">
              <Skeleton className="h-2 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="space-y-1 text-right">
              <Skeleton className="h-2 w-12" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-zinc-50 dark:border-zinc-900">
            <Skeleton className="h-8 flex-1 rounded-md" />
            <Skeleton className="h-8 flex-1 rounded-md" />
          </div>
        </div>
      ))}
    </>
  );
}

interface ListCardSkeletonProps {
  count?: number;
}

export function ListCardSkeleton({ count = 5 }: ListCardSkeletonProps) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 overflow-hidden">
      <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-12 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

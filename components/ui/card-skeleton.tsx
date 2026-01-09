import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
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
        <Card key={i} className={className}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-full rounded-lg mt-4" />
          </CardContent>
        </Card>
      ))}
    </>
  );
}

interface ListCardSkeletonProps {
  count?: number;
}

export function ListCardSkeleton({ count = 5 }: ListCardSkeletonProps) {
  return (
    <Card>
      <div className="divide-y">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function ListSkeleton() {
  return (
    <div className="group flex flex-col gap-3">
      <Skeleton className="relative aspect-4/3 w-full rounded-2xl" />
      <div className="space-y-2 px-1 relative mt-1">
        <Skeleton className="h-8 w-1/3" />
        <div className="flex items-center gap-1.5 pt-1">
          <Skeleton className="h-4 w-4 shrink-0" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex items-center gap-1.5 pt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export function ALertSkeleton() {
  return (
    <div className="flex flex-col space-y-3 w-[80%]">
      <Skeleton className="h-4 w-[100%] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-[500px] w-[100%]" />
      </div>
    </div>
  );
}

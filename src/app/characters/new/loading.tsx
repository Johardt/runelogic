import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <p className="text-xl">Loading...</p>
      <div className="h-10 w-2/3 bg-gray-300 animate-pulse rounded-md" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

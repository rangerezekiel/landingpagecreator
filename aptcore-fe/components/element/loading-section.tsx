import { Skeleton } from "@/components/ui/skeleton";

type LoadingContentProps = {
  simple?: boolean;
};

export default function LoadingContent({ simple = false }: LoadingContentProps) {
  return (
    <div className="flex flex-col space-y-5 p-6">
      {!simple && (
        <>
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/2 rounded" />
            <Skeleton className="h-4 w-1/3 rounded" />
          </div>
          <Skeleton className="h-48 w-full rounded-xl" />
        </>
      )}

      <div className="space-y-2">
        <Skeleton className="h-4 w-[85%] rounded" />
        <Skeleton className="h-4 w-[75%] rounded" />
        <Skeleton className="h-4 w-[75%] rounded" />
      </div>
    </div>
  );
}

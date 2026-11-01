export const Skeleton = ({ className = '' }) => {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
};

export const CardSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
    <Skeleton className="h-48 w-full rounded-xl" />
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <div className="flex justify-between items-center pt-2">
      <Skeleton className="h-8 w-24 rounded-lg" />
      <Skeleton className="h-10 w-28 rounded-xl" />
    </div>
  </div>
);

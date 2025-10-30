import { Skeleton } from '../ui/skeleton';

export default function Loading() {
  return (
    <>
      <div className="h-18 flex flex-col md:flex-row items-start md:items-center gap-5 justify-between py-2 rounded-md">
        <Skeleton className="h-full w-full bg-slate-200" />
        <div className="flex h-full gap-3 self-end md:self-center">
          <Skeleton className="h-full w-12 bg-slate-200" />
          <Skeleton className="h-full w-12 bg-slate-200" />
        </div>
      </div>
      <div className="h-18 flex flex-col md:flex-row items-start md:items-center gap-5 justify-between py-2 rounded-md">
        <Skeleton className="h-full w-full bg-slate-200" />
        <div className="flex h-full gap-3 self-end md:self-center">
          <Skeleton className="h-full w-12 bg-slate-200" />
          <Skeleton className="h-full w-12 bg-slate-200" />
        </div>
      </div>
    </>
  );
}

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden animate-pulse">
      <div className="bg-zinc-100 aspect-square w-full" />
      <div className="p-4 space-y-2.5">
        <div className="h-3 bg-zinc-100 rounded-lg w-1/3" />
        <div className="h-4 bg-zinc-100 rounded-lg w-4/5" />
        <div className="h-4 bg-zinc-100 rounded-lg w-3/5" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-zinc-100 rounded-lg w-16" />
          <div className="h-8 bg-zinc-100 rounded-xl w-20" />
        </div>
      </div>
    </div>
  );
}

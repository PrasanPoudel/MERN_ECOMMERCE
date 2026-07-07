export default function Spinner({ size = 'md' }) {
  const s = { sm: 'w-4 h-4 border-2', md: 'w-7 h-7 border-2', lg: 'w-10 h-10 border-[3px]' }[size];
  return (
    <div className="flex justify-center items-center py-12">
      <div className={`${s} border-zinc-200 border-t-zinc-800 rounded-full animate-spin`} />
    </div>
  );
}

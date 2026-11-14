import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex h-12 items-center gap-2.5 rounded-xl border border-stone-200 bg-white px-3.5 focus-within:border-brand">
      <Search size={20} className="shrink-0 text-stone-400" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name, town or service"
        aria-label="Search providers"
        className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-stone-400 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button type="button" onClick={() => onChange('')} aria-label="Clear search" className="grid h-8 w-8 place-items-center rounded-lg text-stone-400 hover:bg-stone-100">
          <X size={16} />
        </button>
      )}
    </div>
  );
}

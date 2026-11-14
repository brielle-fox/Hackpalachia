import { useLocation } from 'react-router-dom';

/** Stand-in body for routes whose workstream hasn't merged yet. title like "Search — WS3". */
export default function PagePlaceholder({ title }: { title: string }) {
  const { pathname } = useLocation();
  const [name, ws] = title.split(' — ');
  return (
    <div className="flex justify-center px-4 py-24 md:py-32">
      <div className="flex w-full max-w-[520px] flex-col items-center gap-2.5 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
        {ws && <p className="text-xs font-medium tracking-wide text-stone-400 uppercase">{ws}</p>}
        <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
        <p className="text-sm text-stone-600">This page is a placeholder. Its workstream owner replaces the body.</p>
        <code className="rounded-md bg-stone-100 px-2.5 py-1 text-xs text-stone-600">/#{pathname}</code>
      </div>
    </div>
  );
}

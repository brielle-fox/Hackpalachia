// Simulated video visit screen — nothing here is functional.
export default function MockVideoCall({ providerName, onEnd }: { providerName?: string; onEnd: () => void }) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-stone-900 text-white shadow-lg">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-stone-700 text-5xl" aria-hidden>🩺</div>
          <p className="text-2xl font-semibold">{providerName ?? 'Your provider'}</p>
          <p className="flex items-center gap-3 text-xl text-stone-200">
            <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" /></span>
            Your visit will start when your provider joins
          </p>
        </div>
        <div className="absolute bottom-4 right-4 flex h-24 w-36 flex-col items-center justify-center rounded-xl border border-stone-600 bg-stone-800 text-sm text-stone-300">
          <span className="text-2xl" aria-hidden>📷</span>Camera off
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-sm">Demo: simulated video call</span>
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <button type="button" className="min-h-16 rounded-2xl bg-stone-200 px-6 text-xl text-stone-900">🎤 Mute</button>
        <button type="button" className="min-h-16 rounded-2xl bg-stone-200 px-6 text-xl text-stone-900">📷 Camera</button>
        <button type="button" onClick={onEnd} className="min-h-16 rounded-2xl bg-red-600 px-6 text-xl font-semibold text-white">End visit</button>
      </div>
    </div>
  );
}

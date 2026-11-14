// Generic "sign in with your patient portal" consent screen (simulated).
export default function PortalConsent({ system, onAllow, onCancel }: { system: string; onAllow: () => void; onCancel: () => void }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-stone-500">{system} · Patient portal</p>
      <h2 className="mt-1 text-xl font-semibold">CareBridge wants to connect to your portal</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1 font-medium text-ok">✓ Will share</p>
          <ul className="space-y-1 text-sm text-stone-700">
            <li>Your name</li><li>Insurance</li><li>Active conditions</li><li>Current medications</li>
          </ul>
        </div>
        <div>
          <p className="mb-1 font-medium text-danger">✕ Won't share</p>
          <ul className="space-y-1 text-sm text-stone-700">
            <li>Visit notes</li><li>Test results</li><li>Billing</li><li>Anything else</li>
          </ul>
        </div>
      </div>
      <p className="mt-4 text-xs text-stone-500">You can disconnect at any time.</p>
      <div className="mt-5 flex gap-2">
        <button type="button" onClick={onAllow} className="min-h-11 flex-1 rounded-xl bg-brand px-4 font-semibold text-white">Allow</button>
        <button type="button" onClick={onCancel} className="min-h-11 flex-1 rounded-xl border border-stone-300 px-4">Cancel</button>
      </div>
    </div>
  );
}

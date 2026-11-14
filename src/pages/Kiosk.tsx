// WS5 — /kiosk: shared-computer mode for library / church PCs.
// Register this route OUTSIDE the normal <Layout> so it is full-screen with no app nav.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { APP_NAME, DEMO_CAST } from '../config';
import MockVideoCall from '../components/telehealth/MockVideoCall';
import { useIdleTimer } from '../components/telehealth/useIdleTimer';

const IDLE_MS = 3 * 60 * 1000; // 3 minutes (set to 10_000 to test)
const COUNTDOWN_S = 30;

type Screen = 'home' | 'call' | 'help';

export default function Kiosk() {
  const navigate = useNavigate();
  const setRole = useStore(s => s.setRole);
  const setCurrentPatient = useStore(s => s.setCurrentPatient);
  const clinicName = useStore(s => s.providers.find(p => p.id === DEMO_CAST.clinicProviderId)?.name);
  const [screen, setScreen] = useState<Screen>('home');
  const [cleared, setCleared] = useState(false);

  const endSession = () => {
    setRole(null);
    setCurrentPatient(null);
    try { sessionStorage.clear(); } catch { /* storage may be blocked */ }
    setScreen('home');
    setCleared(true);
    navigate('/kiosk');
  };

  useEffect(() => {
    if (!cleared) return;
    const t = window.setTimeout(() => setCleared(false), 3000);
    return () => window.clearTimeout(t);
  }, [cleared]);

  const { warning, remaining, stillHere } = useIdleTimer(IDLE_MS, COUNTDOWN_S, endSession);

  const findCare = () => {
    // Shared computer: start a fresh anonymous patient session on the demo persona.
    setCurrentPatient(DEMO_CAST.patientId);
    setRole('patient');
    navigate('/patient');
  };

  const bigBtn = 'flex min-h-24 w-full items-center gap-4 rounded-3xl border-4 px-6 py-5 text-left text-2xl font-semibold shadow-sm focus:outline-none focus-visible:ring-8 focus-visible:ring-yellow-400 md:text-3xl';

  return (
    <div className="flex min-h-screen flex-col bg-white text-xl text-stone-950">
      <div role="status" className="bg-stone-950 px-6 py-3 text-center text-lg font-semibold text-white md:text-xl">
        🔒 This is a shared computer. Nothing is saved after you leave.
      </div>
      <header className="flex items-center justify-between gap-4 border-b-2 border-stone-200 px-6 py-4">
        <p className="text-2xl font-bold text-brand md:text-3xl">{APP_NAME} <span className="font-normal text-stone-600">· Telehealth station</span></p>
        <button type="button" onClick={endSession}
          className="min-h-16 rounded-2xl border-4 border-red-700 bg-red-50 px-5 text-xl font-semibold text-red-800 focus:outline-none focus-visible:ring-8 focus-visible:ring-yellow-400">
          End session &amp; clear
        </button>
      </header>

      {cleared && (
        <p role="status" className="mx-6 mt-4 rounded-2xl bg-green-100 px-5 py-3 text-center text-xl font-semibold text-green-900">
          ✅ Session cleared. This computer is ready for the next person.
        </p>
      )}

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        {screen === 'home' && (
          <div className="w-full max-w-3xl">
            <h1 className="mb-8 text-center text-4xl font-bold">How can we help today?</h1>
            <div className="grid gap-5">
              <button type="button" onClick={findCare} className={`${bigBtn} border-stone-900 bg-white hover:bg-stone-100`}>
                <span className="text-5xl" aria-hidden>🔎</span> Find care near me
              </button>
              <button type="button" onClick={() => setScreen('call')} className={`${bigBtn} border-teal-900 bg-brand text-white hover:opacity-95`}>
                <span className="text-5xl" aria-hidden>🎥</span> Start my telehealth visit
              </button>
              <button type="button" onClick={() => setScreen('help')} className={`${bigBtn} border-stone-900 bg-yellow-100 hover:bg-yellow-200`}>
                <span className="text-5xl" aria-hidden>🙋</span> Get help from staff
              </button>
            </div>
          </div>
        )}

        {screen === 'call' && (
          <div className="w-full">
            <MockVideoCall providerName={clinicName} onEnd={() => setScreen('home')} />
          </div>
        )}

        {screen === 'help' && (
          <div className="w-full max-w-2xl rounded-3xl border-4 border-stone-900 bg-yellow-50 p-8 text-center">
            <div className="text-6xl" aria-hidden>🙋</div>
            <p className="mt-4 text-3xl font-bold">Help is on the way</p>
            <p className="mt-2 text-2xl">A library staff member has been notified and will be right with you.</p>
            <p className="mt-2 text-base text-stone-600">(Demo: simulated notification)</p>
            <button type="button" onClick={() => setScreen('home')}
              className="mt-6 min-h-16 rounded-2xl bg-stone-950 px-8 text-2xl font-semibold text-white">Back</button>
          </div>
        )}
      </main>

      {warning && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 p-6" role="alertdialog" aria-modal="true" aria-labelledby="idle-title">
          <div className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-2xl">
            <p id="idle-title" className="text-3xl font-bold">Still there?</p>
            <p className="mt-3 text-2xl">We'll sign you out in <span className="font-bold text-red-700">{remaining}</span> seconds to protect your privacy.</p>
            <button type="button" onClick={stillHere} autoFocus
              className="mt-6 min-h-16 w-full rounded-2xl bg-brand px-8 text-2xl font-semibold text-white focus:outline-none focus-visible:ring-8 focus-visible:ring-yellow-400">
              I'm still here
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

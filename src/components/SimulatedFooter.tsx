import { SIMULATED_NOTE } from '../config';

export default function SimulatedFooter() {
  return (
    <footer className="mt-auto bg-stone-100 px-4 py-6 text-center text-xs font-medium">
      <p className="text-stone-600">{SIMULATED_NOTE}</p>
      <p className="mt-1 text-stone-400">Built at Hackpalachia 2026</p>
    </footer>
  );
}

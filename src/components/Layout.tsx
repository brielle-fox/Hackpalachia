import { Link, Outlet, useLocation } from 'react-router-dom';
import Logo from './Logo';
import RoleSwitcher from './RoleSwitcher';
import SimulatedFooter from './SimulatedFooter';
import DemoPanel from './DemoPanel';

/** Sticky header + content + simulated-data footer + Demo Panel. `fullWidth` drops the max-w-6xl container. */
export default function Layout({ fullWidth = false }: { fullWidth?: boolean }) {
  const { pathname } = useLocation();
  const kiosk = pathname === '/kiosk'; // shared-computer mode draws its own chrome (WS5)

  return (
    <div className="flex min-h-dvh flex-col">
      {!kiosk && (
        <header className="sticky top-0 z-[900] border-b border-stone-200 bg-white">
          <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-8">
            <Link to="/" aria-label="Home" className="shrink-0 rounded-lg">
              <Logo />
            </Link>
            <RoleSwitcher />
          </div>
        </header>
      )}
      <main className={fullWidth ? 'w-full flex-1' : 'mx-auto w-full max-w-6xl flex-1 px-4'}>
        <Outlet />
      </main>
      <SimulatedFooter />
      <DemoPanel />
    </div>
  );
}

import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import MusicToggle from './components/MusicToggle.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  return (
    <div className="min-h-screen">
      <Header right={<MusicToggle />} />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/live" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="relative mt-10 overflow-hidden border-t border-white/10">
        <img
          src="/composite.jpg"
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/70" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 text-center sm:px-6">
          <p className="font-head text-sm font-extrabold uppercase tracking-[0.2em] text-gold">
            Women and Child Welfare Committee
          </p>
          <p className="mt-1 text-xs text-white/70">
            Directorate of Women and Child Development Department
          </p>
          <p className="mt-3 text-[11px] uppercase tracking-widest text-muted">
            World Cup 2026 · Prediction Contest
          </p>
        </div>
      </footer>
    </div>
  );
}

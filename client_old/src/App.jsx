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
      <footer className="border-t border-white/10 py-6 text-center text-xs text-muted">
        Women and Child Development Department · World Cup 2026 Prediction Contest
      </footer>
    </div>
  );
}

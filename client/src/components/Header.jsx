import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getVisibility } from '../api';

const linkClass = ({ isActive }) =>
  `font-head text-[13px] font-semibold uppercase tracking-wide px-3 py-2 rounded-lg transition ${
    isActive ? 'bg-gold text-ink' : 'text-white/80 hover:bg-white/10'
  }`;

export default function Header({ right }) {
  const [vis, setVis] = useState(null);

  useEffect(() => {
    const load = () => getVisibility().then(setVis).catch(() => {});
    load();
    const id = setInterval(load, 30000); // keep nav in sync with admin changes
    return () => clearInterval(id);
  }, []);

  const now = Date.now();
  const end = vis?.window?.end_time ? new Date(vis.window.end_time).getTime() : null;
  // Predict link: shown while admin allows it AND the window hasn't closed.
  const showPredict = vis ? vis.show_register && (!end || now <= end) : true;
  const showLive = vis ? vis.show_live : true;

  const links = (
    <>
      {showPredict && (
        <NavLink to="/" className={linkClass} end>
          Predict
        </NavLink>
      )}
      {showLive && (
        <NavLink to="/live" className={linkClass}>
          Live
        </NavLink>
      )}
      <NavLink to="/admin" className={linkClass}>
        Admin
      </NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <motion.img
          src="/wcd-logo.png"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/wcd-logo.svg'; }}
          alt="WCD"
          className="h-11 w-11 shrink-0 object-contain"
          initial={{ rotate: -12, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 140, damping: 12 }}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-head text-[13px] font-extrabold leading-tight text-gold sm:text-[15px]">
            WCD Staff Welfare Committee
          </p>
          <p className="truncate text-[11px] leading-tight text-white/70 sm:text-[12px]">
            Directorate of Women and Child Development Department
          </p>
        </div>
        <nav className="hidden items-center gap-1 sm:flex">{links}</nav>
        {right}
      </div>
      <nav className="flex items-center justify-center gap-1 border-t border-white/10 px-4 py-2 sm:hidden">
        {links}
      </nav>
    </header>
  );
}

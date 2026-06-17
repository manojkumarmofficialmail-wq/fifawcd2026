import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const linkClass = ({ isActive }) =>
  `font-head text-[13px] font-semibold uppercase tracking-wide px-3 py-2 rounded-lg transition ${
    isActive ? 'bg-gold text-ink' : 'text-white/80 hover:bg-white/10'
  }`;

export default function Header({ right }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <motion.img
          src="/wcd-logo.svg"
          alt="WCD"
          className="h-11 w-11 shrink-0"
          initial={{ rotate: -12, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 140, damping: 12 }}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-head text-[13px] font-extrabold leading-tight text-gold sm:text-[15px]">
            Women and Child Welfare Committee
          </p>
          <p className="truncate text-[11px] leading-tight text-white/70 sm:text-[12px]">
            Directorate of Women and Child Development Department
          </p>
        </div>
        <nav className="hidden items-center gap-1 sm:flex">
          <NavLink to="/" className={linkClass} end>
            Predict
          </NavLink>
          <NavLink to="/live" className={linkClass}>
            Live
          </NavLink>
          <NavLink to="/admin" className={linkClass}>
            Admin
          </NavLink>
        </nav>
        {right}
      </div>
      {/* mobile nav */}
      <nav className="flex items-center justify-center gap-1 border-t border-white/10 px-4 py-2 sm:hidden">
        <NavLink to="/" className={linkClass} end>
          Predict
        </NavLink>
        <NavLink to="/live" className={linkClass}>
          Live
        </NavLink>
        <NavLink to="/admin" className={linkClass}>
          Admin
        </NavLink>
      </nav>
    </header>
  );
}

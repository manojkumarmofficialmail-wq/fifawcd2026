import { motion } from 'framer-motion';
import Jersey from './Jersey.jsx';
import Flag from './Flag.jsx';
import { metaFor } from '../teamMeta.js';

// One team in the live breakdown: jersey + flag, progress bar, eliminated styling.
export default function TeamRow({ team, max, rank }) {
  const pct = max > 0 ? Math.round((team.active_count / max) * 100) : 0;
  const out = team.is_eliminated;
  const isLeader = rank === 0 && !out && team.active_count > 0;
  const meta = metaFor(team.name);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: out ? 0.55 : 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 26 }}
      className={`panel flex items-center gap-3 p-3 ${
        isLeader ? 'shadow-glow ring-1 ring-gold/40' : ''
      } ${out ? 'grayscale' : ''}`}
    >
      <span className="w-5 text-center font-head text-xs text-muted">{rank + 1}</span>
      <Jersey colors={meta.colors} size={30} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`flex min-w-0 items-center gap-2 font-head text-sm font-bold ${
              out ? 'text-white/60' : 'text-white'
            }`}
          >
            <Flag code={meta.code} size="0.95rem" />
            <span className={`truncate ${out ? 'line-through' : ''}`}>{team.name}</span>
            {isLeader && <span className="shrink-0 text-[10px] text-gold">★ TOP</span>}
            {out && <span className="shrink-0 text-[10px] text-hot">OUT</span>}
          </p>
          <p className="stat-num shrink-0 text-lg text-white">{team.active_count}</p>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className={`h-full rounded-full ${out ? 'bg-hot/60' : 'bg-gradient-to-r from-grass to-gold'}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

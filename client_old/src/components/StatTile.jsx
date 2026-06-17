import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

// A scoreboard tile with a count-up animation, jersey-number typography.
export default function StatTile({ label, value, accent = 'gold', sub }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    const controls = animate(mv, value || 0, { duration: 1.1, ease: 'easeOut' });
    return controls.stop;
  }, [value, mv]);

  const accentText =
    accent === 'grass' ? 'text-grass' : accent === 'hot' ? 'text-hot' : 'text-gold';
  const accentBar =
    accent === 'grass' ? 'bg-grass' : accent === 'hot' ? 'bg-hot' : 'bg-gold';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="panel relative overflow-hidden p-5"
    >
      <div className={`absolute left-0 top-0 h-full w-1 ${accentBar}`} />
      <p className="eyebrow">{label}</p>
      <motion.p className={`stat-num mt-2 text-5xl sm:text-6xl ${accentText}`}>{rounded}</motion.p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </motion.div>
  );
}

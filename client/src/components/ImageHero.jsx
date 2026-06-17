import { motion } from 'framer-motion';

/**
 * Full-bleed cinematic hero with a background photo, gradient scrims for
 * legibility, an optional gold edge, and a slow Ken Burns zoom.
 *
 * Props:
 *  - src: image path (in /public)
 *  - overlay: 'left' | 'bottom' | 'center' — where the text sits / scrim direction
 *  - className: extra classes (e.g. height)
 *  - children: content rendered above the image
 *  - eager: load immediately (true for above-the-fold heroes)
 */
export default function ImageHero({
  src,
  overlay = 'left',
  className = '',
  children,
  eager = false,
}) {
  const scrim =
    overlay === 'bottom'
      ? 'bg-gradient-to-t from-ink via-ink/55 to-ink/10'
      : overlay === 'center'
      ? 'bg-gradient-to-b from-ink/70 via-ink/35 to-ink/80'
      : 'bg-gradient-to-r from-ink via-ink/75 to-ink/15';

  return (
    <section className={`relative isolate overflow-hidden rounded-3xl border border-white/10 ${className}`}>
      {/* photo */}
      <motion.img
        src={src}
        alt=""
        aria-hidden
        loading={eager ? 'eager' : 'lazy'}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="kenburns absolute inset-0 h-full w-full object-cover"
      />
      {/* scrims for text contrast */}
      <div className={`absolute inset-0 ${scrim}`} />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,rgba(0,0,0,0.35),transparent_60%)]" />
      {/* gold top hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
      {/* content */}
      <div
        className={`relative z-10 flex h-full flex-col p-6 sm:p-8 ${
          overlay === 'center' ? 'justify-center' : 'justify-end'
        }`}
      >
        {children}
      </div>
    </section>
  );
}

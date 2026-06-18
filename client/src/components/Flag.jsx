// Renders a real rectangular flag image via the flag-icons library.
// (Emoji flags don't render on Windows — they show country letters — so we
// use flag-icons everywhere instead.)
export default function Flag({ code, size = '1.1rem', className = '' }) {
  if (!code) {
    return <span className={`inline-block rounded-[2px] bg-white/15 ${className}`} style={{ width: '1.4em', height: '1em', fontSize: size }} />;
  }
  return (
    <span
      className={`fi fi-${code} rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.15)] ${className}`}
      style={{ fontSize: size }}
      aria-hidden
    />
  );
}

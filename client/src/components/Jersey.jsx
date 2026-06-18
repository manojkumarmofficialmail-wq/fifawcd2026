// A small football jersey graphic, filled with a team's kit colours.
// colors = [primary, secondary]
export default function Jersey({ colors = ['#8FA0B3', '#FFFFFF'], size = 30, className = '' }) {
  const [primary, secondary] = colors;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`}
      aria-hidden
    >
      <g stroke="rgba(0,0,0,0.30)" strokeWidth="0.6" strokeLinejoin="round">
        {/* body + sleeves silhouette */}
        <polygon
          points="8,3.5 16,3.5 21,7.5 18,11.5 16.6,9.8 16.6,21 7.4,21 7.4,9.8 6,11.5 3,7.5"
          fill={primary}
        />
        {/* collar V */}
        <polygon points="9.4,3.5 12,6.8 14.6,3.5" fill={secondary} stroke="none" />
        {/* centre stripe for kit detail */}
        <rect x="11.1" y="6.5" width="1.8" height="14.5" fill={secondary} opacity="0.45" stroke="none" />
      </g>
    </svg>
  );
}

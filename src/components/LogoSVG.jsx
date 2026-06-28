export default function LogoSVG({ className = '', style = {} }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 250"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id="tcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>

      {/* TC Monogram */}
      <text
        x="300"
        y="118"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="110"
        fontWeight="900"
        fill="url(#tcGrad)"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        textAnchor="middle"
        letterSpacing="-8"
      >
        TC
      </text>

      {/* Accent line */}
      <line
        x1="160" y1="148" x2="440" y2="148"
        stroke="url(#tcGrad)" strokeWidth="1.5" opacity="0.55"
      />

      {/* Full name */}
      <text
        x="300"
        y="182"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="36"
        fontWeight="800"
        fill="#FFFFFF"
        textAnchor="middle"
        letterSpacing="7"
      >
        TOMER COHEN
      </text>

      {/* Subtitle */}
      <text
        x="300"
        y="216"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="13"
        fontWeight="500"
        fill="#9CA3AF"
        textAnchor="middle"
        letterSpacing="2.5"
      >
        FULL-STACK · SOFTWARE ENGINEER · AI SYSTEMS
      </text>
    </svg>
  )
}

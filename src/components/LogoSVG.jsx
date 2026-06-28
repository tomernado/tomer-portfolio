export default function LogoSVG({ className = '', style = {} }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 290"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id="tcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#60A5FA" />
          <stop offset="55%"  stopColor="#818CF8" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="transparent" />
          <stop offset="35%"  stopColor="#818CF8" stopOpacity="0.55" />
          <stop offset="65%"  stopColor="#818CF8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>

      {/* Dashed ring behind TC */}
      <circle
        cx="300" cy="122" r="102"
        fill="rgba(59,130,246,0.035)"
        stroke="rgba(99,102,241,0.16)"
        strokeWidth="1"
        strokeDasharray="6 4"
      />

      {/* Corner brackets — top-left */}
      <path d="M 178 30 L 150 30 L 150 58"  stroke="url(#tcGrad)" strokeWidth="2" fill="none" opacity="0.6" />
      {/* top-right */}
      <path d="M 422 30 L 450 30 L 450 58"  stroke="url(#tcGrad)" strokeWidth="2" fill="none" opacity="0.6" />
      {/* bottom-left */}
      <path d="M 178 214 L 150 214 L 150 186" stroke="url(#tcGrad)" strokeWidth="2" fill="none" opacity="0.6" />
      {/* bottom-right */}
      <path d="M 422 214 L 450 214 L 450 186" stroke="url(#tcGrad)" strokeWidth="2" fill="none" opacity="0.6" />

      {/* TC Monogram */}
      <text
        x="300" y="150"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="118"
        fontWeight="900"
        fill="url(#tcGrad)"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="2"
        textAnchor="middle"
        letterSpacing="-8"
      >
        TC
      </text>

      {/* Separator line */}
      <line x1="130" y1="172" x2="470" y2="172" stroke="url(#lineGrad)" strokeWidth="1" />

      {/* Diamond accents at line ends */}
      <polygon points="126,172 132,167 138,172 132,177" fill="rgba(129,140,248,0.45)" />
      <polygon points="462,172 468,167 474,172 468,177" fill="rgba(129,140,248,0.45)" />

      {/* Full name */}
      <text
        x="300" y="208"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="34"
        fontWeight="800"
        fill="#FFFFFF"
        textAnchor="middle"
        letterSpacing="7"
      >
        TOMER COHEN
      </text>

      {/* Subtitle */}
      <text
        x="300" y="246"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="11.5"
        fontWeight="400"
        fill="#6B7280"
        textAnchor="middle"
        letterSpacing="2.5"
      >
        FULL-STACK · SOFTWARE ENGINEER · AI SYSTEMS
      </text>
    </svg>
  )
}

import { useId } from 'react'

export default function LogoSVG({ className = '', style = {} }) {
  const uid = useId().replace(/:/g, 'x')
  const grad  = `${uid}G`
  const line  = `${uid}L`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 620 285"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id={grad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#60A5FA" />
          <stop offset="55%"  stopColor="#818CF8" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
        <linearGradient id={line} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="transparent" />
          <stop offset="35%"  stopColor="#818CF8" stopOpacity="0.55" />
          <stop offset="65%"  stopColor="#818CF8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>

      {/* Dashed ring */}
      <circle cx="310" cy="114" r="105"
        fill="rgba(59,130,246,0.035)"
        stroke="rgba(99,102,241,0.16)"
        strokeWidth="1"
        strokeDasharray="6 4"
      />

      {/* Corner brackets */}
      <path d="M 192 26 L 162 26 L 162 54"  stroke={`url(#${grad})`} strokeWidth="2" fill="none" opacity="0.6"/>
      <path d="M 428 26 L 458 26 L 458 54"  stroke={`url(#${grad})`} strokeWidth="2" fill="none" opacity="0.6"/>
      <path d="M 192 210 L 162 210 L 162 182" stroke={`url(#${grad})`} strokeWidth="2" fill="none" opacity="0.6"/>
      <path d="M 428 210 L 458 210 L 458 182" stroke={`url(#${grad})`} strokeWidth="2" fill="none" opacity="0.6"/>

      {/* TC Monogram */}
      <text
        x="310" y="148"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="118"
        fontWeight="900"
        fill={`url(#${grad})`}
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1.5"
        textAnchor="middle"
        letterSpacing="-8"
      >TC</text>

      {/* Separator line */}
      <line x1="150" y1="168" x2="470" y2="168" stroke={`url(#${line})`} strokeWidth="1"/>
      <polygon points="146,168 152,163 158,168 152,173" fill="rgba(129,140,248,0.45)"/>
      <polygon points="462,168 468,163 474,168 468,173" fill="rgba(129,140,248,0.45)"/>

      {/* Full name */}
      <text
        x="310" y="204"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="32"
        fontWeight="800"
        fill="#FFFFFF"
        textAnchor="middle"
        letterSpacing="7"
      >TOMER COHEN</text>

      {/* Subtitle — hidden on mobile, visible on sm+ */}
      <text
        x="310" y="250"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="16"
        fontWeight="400"
        fill="#6B7280"
        textAnchor="middle"
        letterSpacing="1.5"
        className="hidden sm:inline"
      >SOFTWARE DEVELOPER  |  FULL-STACK ENGINEER  |  AI SYSTEMS</text>
    </svg>
  )
}

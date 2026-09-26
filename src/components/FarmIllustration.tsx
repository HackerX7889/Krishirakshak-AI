export default function FarmIllustration() {
  return (
    <svg
      viewBox="0 0 520 440"
      className="h-auto w-full"
      role="img"
      aria-label="Farmer scanning a crop leaf with a smartphone while sensors and a drone monitor the farm"
    >
      <defs>
        <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dff3e2" />
          <stop offset="100%" stopColor="#fefaec" />
        </linearGradient>
        <linearGradient id="phoneG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16283a" />
          <stop offset="100%" stopColor="#2c5373" />
        </linearGradient>
      </defs>

      <rect width="520" height="440" rx="28" fill="url(#skyG)" />

      {/* Sun */}
      <circle cx="438" cy="56" r="34" fill="#f3ae27" />
      <g stroke="#f3ae27" strokeWidth="4" strokeLinecap="round">
        <line x1="438" y1="8" x2="438" y2="0" />
        <line x1="438" y1="104" x2="438" y2="112" />
        <line x1="498" y1="56" x2="506" y2="56" />
        <line x1="378" y1="56" x2="370" y2="56" />
        <line x1="480" y1="14" x2="486" y2="8" />
        <line x1="396" y1="98" x2="390" y2="104" />
      </g>

      {/* Clouds */}
      <g fill="#ffffff" opacity="0.9">
        <ellipse cx="90" cy="54" rx="30" ry="14" />
        <ellipse cx="120" cy="46" rx="24" ry="12" />
        <ellipse cx="150" cy="56" rx="22" ry="11" />
        <ellipse cx="300" cy="30" rx="26" ry="11" />
        <ellipse cx="330" cy="24" rx="20" ry="10" />
      </g>

      {/* Drone */}
      <g transform="translate(150 96)">
        <rect x="-18" y="-6" width="36" height="10" rx="4" fill="#35678e" />
        <circle cx="-16" cy="-19" r="2.5" fill="#35678e" />
        <circle cx="16" cy="-19" r="2.5" fill="#35678e" />
        <line x1="-12" y1="-10" x2="-20" y2="-30" stroke="#35678e" strokeWidth="3" />
        <line x1="12" y1="-10" x2="20" y2="-30" stroke="#35678e" strokeWidth="3" />
        <ellipse cx="-20" cy="-32" rx="7" ry="4" fill="#699cc0" opacity="0.6" transform="rotate(-12 -20 -32)" />
        <ellipse cx="20" cy="-32" rx="7" ry="4" fill="#699cc0" opacity="0.6" transform="rotate(12 20 -32)" />
        <rect x="-6" y="2" width="12" height="5" rx="2" fill="#eab308" />
      </g>

      {/* Ground */}
      <rect x="0" y="300" width="520" height="140" rx="28" fill="#5cb871" />
      <rect x="0" y="348" width="520" height="92" fill="#379c4f" />

      {/* Soil rows */}
      <g stroke="#287f3e" strokeWidth="3" opacity="0.6">
        <line x1="0" y1="372" x2="520" y2="372" />
        <line x1="0" y1="396" x2="520" y2="396" />
        <line x1="0" y1="420" x2="520" y2="420" />
      </g>

      {/* Field plants */}
      <g>
        {[40, 90, 140, 190, 380, 430, 480].map((x) => (
          <g key={x}>
            <line x1={x} y1="350" x2={x} y2="318" stroke="#1a4427" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx={x - 8} cy="320" rx="9" ry="14" fill="#287f3e" transform={`rotate(-20 ${x - 8} 320)`} />
            <ellipse cx={x + 8} cy="320" rx="9" ry="14" fill="#287f3e" transform={`rotate(20 ${x + 8} 320)`} />
          </g>
        ))}
      </g>

      {/* Sensor node pole */}
      <g transform="translate(416 220)">
        <rect x="-4" y="0" width="8" height="95" rx="3" fill="#2c5373" />
        <circle cx="0" cy="0" r="12" fill="#ed900d" />
        <rect x="8" y="-4" width="26" height="8" rx="3" fill="#eab308" />
        <rect x="8" y="10" width="20" height="8" rx="3" fill="#eab308" />
        <g transform="translate(-24 84)">
          <rect x="-10" y="-6" width="20" height="12" rx="4" fill="#16283a" />
          <circle cx="0" cy="0" r="3" fill="#4ade80" />
        </g>
      </g>

      {/* Farmer smartphone */}
      <g transform="translate(260 190)">
        {/* arm */}
        <path
          d="M -40 96 Q -2 60 34 30"
          fill="none"
          stroke="#e8b06b"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* hand */}
        <circle cx="34" cy="30" r="9" fill="#e8b06b" />
        {/* phone */}
        <g transform="translate(48 -14) rotate(10)">
          <rect x="-16" y="-32" width="32" height="64" rx="6" fill="url(#phoneG)" stroke="#16283a" strokeWidth="2" />
          <rect x="-11" y="-26" width="22" height="44" rx="3" fill="#f0f5fa" />
          <rect x="-11" y="-26" width="22" height="12" rx="3" fill="#dff3e2" />
          <circle cx="0" cy="-19" r="3.5" fill="#287f3e" />
          <rect x="-7" y="-4" width="14" height="10" rx="2" fill="#5cb871" />
          <rect x="-7" y="9" width="14" height="3" rx="1.5" fill="#ed900d" />
          <rect x="-7" y="14" width="9" height="3" rx="1.5" fill="#ed900d" />
          <rect x="-5" y="24" width="8" height="1.5" rx="0.75" fill="#2c5373" />
        </g>
        <circle cx="63" cy="17" r="3" fill="#4ade80" stroke="#16283a" strokeWidth="1.5" />
      </g>

      {/* Person */}
      <g>
        {/* body */}
        <rect x="196" y="196" width="52" height="86" rx="18" fill="#35678e" />
        {/* legs */}
        <rect x="204" y="282" width="16" height="66" rx="7" fill="#274760" />
        <rect x="224" y="282" width="16" height="66" rx="7" fill="#274760" />
        {/* head */}
        <circle cx="222" cy="164" r="32" fill="#e8b06b" />
        {/* hat */}
        <ellipse cx="222" cy="142" rx="42" ry="12" fill="#ed900d" />
        <path d="M 192 142 Q 222 108 252 142 Z" fill="#d26c08" />
      </g>

      {/* Leaf being scanned */}
      <g transform="translate(250 214)">
        <path d="M 0 18 C 22 12 24 -6 8 -14 C -4 -19 -14 -8 -8 4" fill="#287f3e" stroke="#1a4427" strokeWidth="2" />
        <path d="M -2 6 C 6 2 10 0 14 -8" fill="none" stroke="#1a4427" strokeWidth="1.5" />
      </g>

      {/* Scan rays */}
      <g stroke="#4ade80" strokeWidth="3" strokeLinecap="round" opacity="0.85">
        <line x1="282" y1="196" x2="300" y2="186" />
        <line x1="276" y1="208" x2="308" y2="196" />
        <line x1="270" y1="220" x2="298" y2="210" />
      </g>

      {/* Water droplet icon */}
      <g transform="translate(66 236)">
        <path d="M 0 28 C -18 12 -16 -6 0 -16 C 16 -6 18 12 0 28 Z" fill="#5cb871" stroke="#287f3e" strokeWidth="2" />
        <circle cx="0" cy="6" r="4" fill="#ffffff" opacity="0.7" />
        <rect x="-16" y="34" width="32" height="14" rx="5" fill="#287f3e" />
        <rect x="-24" y="40" width="48" height="10" rx="5" fill="#379c4f" />
      </g>
    </svg>
  )
}
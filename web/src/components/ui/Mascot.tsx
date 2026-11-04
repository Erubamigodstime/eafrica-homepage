import './Mascot.css';

/**
 * "Simba": an original E-Africa lion-cub mascot, drawn as inline SVG so it scales crisply and
 * can be animated by its parent (pop, buck, peek). Eyes blink on their own.
 */
export default function Mascot({ className = '', title = 'E-Africa lion mascot', fit }: { className?: string; title?: string; /** SVG preserveAspectRatio, e.g. 'xMidYMax meet' to sit the cub on the floor of a taller box */ fit?: string }) {
  const ring = (n: number, r: number, cx: number, cy: number, fills: string[]) =>
    Array.from({ length: n }, (_, k) => {
      const a = (k / n) * Math.PI * 2 + (fills.length > 2 ? 0.2 : 0);
      return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r * 0.94, rot: (a * 180) / Math.PI + 90, fill: fills[k % fills.length] };
    });
  const outer = ring(16, 86, 150, 132, ['#1F6B2E', '#2E8B47']);
  const inner = ring(14, 66, 150, 134, ['#E9A23B', '#F4B73E', '#DE9530']);
  return (
    <svg className={`mascot ${className}`} viewBox="0 0 300 320" preserveAspectRatio={fit} role="img" aria-label={title}>
      {/* tail */}
      <path d="M212 268 C 250 268, 262 238, 258 214" fill="none" stroke="#EBD3AC" strokeWidth="11" strokeLinecap="round" />
      <circle cx="258" cy="208" r="13" fill="#257F3F" />
      {/* body */}
      <ellipse cx="150" cy="258" rx="74" ry="56" fill="#F2DEBF" />
      <ellipse cx="150" cy="270" rx="44" ry="38" fill="#FBF0DC" />
      {/* medal */}
      <g className="m-medal">
        <path d="M140 250 L150 266 L160 250" fill="#D94826" />
        <circle cx="150" cy="272" r="15" fill="#257F3F" stroke="#fff" strokeWidth="3" />
        <text x="150" y="278" textAnchor="middle" fontFamily="Montserrat, Arial, sans-serif" fontWeight="800" fontSize="16" fill="#fff">E</text>
      </g>
      {/* paws */}
      <ellipse cx="116" cy="302" rx="25" ry="15" fill="#F7E7CC" />
      <ellipse cx="184" cy="302" rx="25" ry="15" fill="#F7E7CC" />
      <path d="M108 296v10M118 295v11M128 297v8M172 297v8M182 295v11M192 296v10" stroke="#D9BC93" strokeWidth="2.4" strokeLinecap="round" />

      <g className="m-head">
        {/* mane: brand-green outer tufts, golden inner tufts */}
        {outer.map((p, i) => (
          <ellipse key={`o${i}`} cx={p.x} cy={p.y} rx="27" ry="36" fill={p.fill} transform={`rotate(${p.rot} ${p.x} ${p.y})`} />
        ))}
        <circle cx="150" cy="132" r="80" fill="#257F3F" />
        <path d="M84 96 C 98 64, 138 50, 174 56" fill="none" stroke="#7DC895" strokeWidth="7" strokeLinecap="round" opacity=".55" />
        {inner.map((p, i) => (
          <ellipse key={`i${i}`} cx={p.x} cy={p.y} rx="19" ry="25" fill={p.fill} transform={`rotate(${p.rot} ${p.x} ${p.y})`} />
        ))}
        {/* ears sit on the mane's edge */}
        <circle cx="96" cy="74" r="20" fill="#F2DEBF" />
        <circle cx="96" cy="74" r="11" fill="#EBA48D" />
        <circle cx="204" cy="74" r="20" fill="#F2DEBF" />
        <circle cx="204" cy="74" r="11" fill="#EBA48D" />
        {/* face */}
        <ellipse cx="150" cy="140" rx="62" ry="58" fill="#F7E8CF" />
        <ellipse cx="108" cy="160" rx="11" ry="6.5" fill="#E2775C" opacity=".42" />
        <ellipse cx="192" cy="160" rx="11" ry="6.5" fill="#E2775C" opacity=".42" />
        <path d="M112 112 q12 -8 24 -2 M164 110 q12 -6 24 2" fill="none" stroke="#B88B5E" strokeWidth="3.4" strokeLinecap="round" />
        <g className="m-eyes">
          <ellipse cx="124" cy="132" rx="8.5" ry="10.5" fill="#1D1D1B" />
          <ellipse cx="176" cy="132" rx="8.5" ry="10.5" fill="#1D1D1B" />
          <circle cx="127" cy="128" r="3" fill="#fff" />
          <circle cx="179" cy="128" r="3" fill="#fff" />
        </g>
        {/* muzzle */}
        <ellipse cx="135" cy="167" rx="22" ry="17" fill="#FFF7EA" />
        <ellipse cx="165" cy="167" rx="22" ry="17" fill="#FFF7EA" />
        <circle cx="128" cy="166" r="1.8" fill="#C9A47A" /><circle cx="122" cy="171" r="1.8" fill="#C9A47A" />
        <circle cx="172" cy="166" r="1.8" fill="#C9A47A" /><circle cx="178" cy="171" r="1.8" fill="#C9A47A" />
        <path d="M139 175 Q150 190 161 175 Z" fill="#C8473A" />
        <path d="M141 151 Q150 146 159 151 Q157 160 150 163 Q143 160 141 151Z" fill="#5B3A29" />
        <path d="M150 163 V170 M150 170 Q142 178 134 172 M150 170 Q158 178 166 172" fill="none" stroke="#5B3A29" strokeWidth="3.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

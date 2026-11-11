const pts = [20, 26, 27, 29, 30, 45, 40, 38, 50, 46, 31, 40, 35, 52, 55, 43, 42, 86, 35, 42, 52, 48, 46, 50, 42, 54, 44, 46, 58, 55, 62, 24, 31, 32, 27, 47, 48, 44, 43, 72, 60, 58, 65, 60, 54, 52, 52, 58, 42, 56, 51, 57, 52, 49, 55]
const labels = ['5k', '10k', '15k', '20k', '25k', '30k', '35k', '40k', '45k', '50k', '55k', '60k']

export default function SalesChart() {
  const W = 1000, H = 280, L = 40, B = 30
  const x = (i: number) => L + (i / (pts.length - 1)) * (W - L)
  const y = (v: number) => 10 + (1 - (v - 20) / 80) * (H - B - 10)
  const line = pts.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto text-slate-400" role="img" aria-label="Sales chart">
      <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4379EE" stopOpacity=".18" /><stop offset="1" stopColor="#4379EE" stopOpacity="0" /></linearGradient></defs>
      {[20, 40, 60, 80, 100].map(t => (<g key={t}><line x1={L} x2={W} y1={y(t)} y2={y(t)} stroke="currentColor" strokeOpacity=".25" /><text x="0" y={y(t) + 4} fontSize="11" fill="currentColor">{t}%</text></g>))}
      <path d={`${line} L${W},${y(20)} L${L},${y(20)} Z`} fill="url(#g)" />
      <path d={line} fill="none" stroke="#4379EE" strokeWidth="1.5" />
      <circle cx={x(17)} cy={y(86)} r="4" fill="#4379EE" />
      <rect x={x(17) - 42} y={y(86) - 30} width="84" height="20" rx="3" fill="#4379EE" /><text x={x(17)} y={y(86) - 16} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">64,3664.77</text>
      {labels.map((l, i) => <text key={l} x={L + (i + .5) * ((W - L) / labels.length)} y={H - 8} textAnchor="middle" fontSize="11" fill="currentColor">{l}</text>)}
    </svg>
  )
}

import { Filter } from 'lucide-react'
import { PageHead } from '../ui'

const pal = ['#4379EE', '#00B69B', '#FF9066', '#F2509B', '#FEC53D', '#8280FF']
const Bars = () => {
  const groups = 12
  return (
    <svg viewBox="0 0 1000 220" className="h-52 w-full" preserveAspectRatio="none" role="img" aria-label="Bar chart">
      {Array.from({ length: groups * 4 }, (_, i) => {
        const g = Math.floor(i / 4), k = i % 4, h = 40 + ((i * 53) % 150)
        return <rect key={i} x={20 + g * 80 + k * 14} y={220 - h} width="8" height={h} rx="4" fill={pal[(g + k) % pal.length]} />
      })}
    </svg>
  )
}
const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  const [x0, y0] = p(a0), [x1, y1] = p(a1)
  return `M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1} ${y1}Z`
}
const Pie = ({ pct, color, donut }: { pct: number; color: string; donut?: boolean }) => (
  <svg viewBox="0 0 100 100" className="mx-auto h-28 w-28 sm:h-36 sm:w-36">
    <circle cx="50" cy="50" r="48" fill={color} fillOpacity=".15" />
    <path d={arc(50, 50, 48, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * pct)} fill={color} />
    {donut && <circle cx="50" cy="50" r="28" className="fill-card dark:fill-card-dark" />}
  </svg>
)
const cols = ['#4379EE', '#8E5CF5', '#FF9066', '#3B8BEB']

export default function UiElements() {
  return (
    <>
      <PageHead title="UI Elements">
        <button className="flex items-center gap-3 rounded-lg border border-line bg-card px-4 py-2.5 text-sm font-semibold dark:border-line-dark dark:bg-card-dark"><Filter size={16} /> Filter By <span className="text-primary">Charts ⌄</span></button>
      </PageHead>
      <div className="space-y-6">
        <section className="card p-6"><h2 className="mb-4 text-xl font-bold">Bar Chart</h2><Bars /></section>
        <section className="card p-6"><h2 className="mb-6 text-xl font-bold">Pie Chart</h2>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">{[0.66, 0.4, 0.55, 0.7].map((p, i) => <Pie key={i} pct={p} color={cols[i]} />)}</div></section>
        <section className="card p-6"><h2 className="mb-6 text-xl font-bold">Donut Chart</h2>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">{[0.7, 0.5, 0.6, 0.45].map((p, i) => <Pie key={i} pct={p} color={['#4379EE', '#8E5CF5', '#00B69B', '#FF9066'][i]} donut />)}</div></section>
      </div>
    </>
  )
}

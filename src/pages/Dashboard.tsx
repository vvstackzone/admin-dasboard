import { ChevronDown, Package, Users, LineChart, History, TrendingUp, TrendingDown } from 'lucide-react'

const stats = [
  { label: 'Total User', value: '40,689', note: '8.5%', text: 'Up from yesterday', up: true, icon: Users, tint: 'bg-[#8280FF]/20 text-[#8280FF]' },
  { label: 'Total Order', value: '10293', note: '1.3%', text: 'Up from past week', up: true, icon: Package, tint: 'bg-[#FEC53D]/25 text-[#FEC53D]' },
  { label: 'Total Sales', value: '$89,000', note: '4.3%', text: 'Down from yesterday', up: false, icon: LineChart, tint: 'bg-[#4AD991]/20 text-[#4AD991]' },
  { label: 'Total Pending', value: '2040', note: '1.8%', text: 'Up from yesterday', up: true, icon: History, tint: 'bg-[#FF9066]/25 text-[#FF9066]' },
]
const sales = [20,26,27,29,30,48,40,39,41,51,38,31,39,35,45,55,43,44,52,50,47,45,46,41,48,54,47,43,45,50,57,56,61,24,31,32,27,47,46,48,47,44,72,43,59,65,60,54,52,52,58,42,56,50,57,52,49,55]
const deals = [{ name: 'Apple Watch', location: '6096 Marjolaine Landing', date: '12.09.2019 - 12.53 PM', piece: 423, amount: '$34,295', status: 'Delivered' }]

function SalesChart() {
  const w = 1000, h = 300, pad = 8
  const pts = sales.map((v, i) => [pad + (i / (sales.length - 1)) * (w - pad * 2), h - (v / 100) * h] as const)
  const line = pts.map(([x, y]) => `${x},${y}`).join(' ')
  return (
    <div className="flex gap-3">
      <div className="flex h-[300px] flex-col justify-between text-xs text-muted dark:text-muted-dark">
        {['100%', '80%', '60%', '40%', '20%'].map(t => <span key={t}>{t}</span>)}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-[200px] w-full sm:h-[300px]" role="img" aria-label="Sales chart">
        <defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#4379EE" stopOpacity=".2" /><stop offset="1" stopColor="#4379EE" stopOpacity="0" /></linearGradient></defs>
        {[0, 1, 2, 3, 4].map(i => <line key={i} x1="0" x2={w} y1={(i * h) / 4.2} y2={(i * h) / 4.2} className="stroke-line dark:stroke-line-dark" strokeWidth="1" />)}
        <polygon points={`${pad},${h} ${line} ${w - pad},${h}`} fill="url(#fill)" />
        <polyline points={line} fill="none" stroke="#4379EE" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  )
}

const Select = ({ label = 'October' }: { label?: string }) => (
  <button className="flex items-center gap-2 rounded border border-line px-3 py-1.5 text-xs text-muted dark:border-line-dark dark:text-muted-dark">{label} <ChevronDown size={14} /></button>
)
const smooth = (v: number[], w: number, h: number) => {
  const pts = v.map((y, i) => [(i / (v.length - 1)) * w, h - (y / 100) * h])
  return pts.reduce((d, [x, y], i) => i === 0 ? `M${x},${y}` : `${d} C${(pts[i - 1][0] + x) / 2},${pts[i - 1][1]} ${(pts[i - 1][0] + x) / 2},${y} ${x},${y}`, '')
}
function Revenue() {
  const w = 1000, h = 260
  const a = [30, 55, 95, 60, 35, 75, 85, 50, 70, 45, 65, 40], b = [20, 40, 70, 45, 25, 50, 60, 40, 50, 30, 45, 30]
  return (
    <section className="card p-5 sm:p-7">
      <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold sm:text-2xl">Revenue</h2><Select label="October" /></div>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-56 w-full sm:h-72" role="img" aria-label="Revenue chart">
        <path d={`${smooth(a, w, h)} L${w},${h} L0,${h}Z`} fill="#FF9066" fillOpacity=".7" />
        <path d={`${smooth(b, w, h)} L${w},${h} L0,${h}Z`} fill="#8280FF" fillOpacity=".55" />
      </svg>
      <div className="mt-3 flex justify-center gap-8 text-sm"><span className="flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-[#FF9066]" />Sales</span><span className="flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-[#8280FF]" />Profit</span></div>
    </section>
  )
}
function Customers() {
  return (
    <section className="card p-5 sm:p-7"><h2 className="mb-4 text-xl font-bold">Customers</h2>
      <div className="relative mx-auto h-40 w-40"><svg viewBox="0 0 100 100" className="h-full w-full -rotate-90"><circle cx="50" cy="50" r="40" fill="none" strokeWidth="6" strokeDasharray="2 6" stroke="#4379EE" /><circle cx="50" cy="50" r="40" fill="none" strokeWidth="6" strokeDasharray="2 6" stroke="#8280FF" strokeDashoffset="-190" opacity=".4" /></svg></div>
      <div className="mt-4 flex justify-around text-center"><div><p className="text-2xl font-bold">34,249</p><p className="text-xs muted"><i className="mr-1 inline-block h-2 w-2 rounded-full bg-primary" />New Customers</p></div><div><p className="text-2xl font-bold">1420</p><p className="text-xs muted"><i className="mr-1 inline-block h-2 w-2 rounded-full bg-[#8280FF]" />Repeated</p></div></div>
    </section>
  )
}
function Featured() {
  return (
    <section className="card p-5 sm:p-7"><h2 className="mb-4 text-xl font-bold">Featured Product</h2>
      <div className="flex items-center justify-center gap-4"><span className="grid h-7 w-7 place-items-center rounded-full bg-page dark:bg-page-dark">‹</span>
        <img src="/img/watch-black.jpg" alt="Beats Headphone 2019" className="h-36 object-contain" /><span className="grid h-7 w-7 place-items-center rounded-full bg-page dark:bg-page-dark">›</span></div>
      <p className="mt-4 text-center font-bold">Beats Headphone 2019</p><p className="text-center font-bold text-primary">$89.00</p>
    </section>
  )
}
function Analytics() {
  const w = 300, h = 140
  return (
    <section className="card p-5 sm:p-7"><h2 className="mb-4 text-xl font-bold">Sales Analytics</h2>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-36 w-full" preserveAspectRatio="none" role="img" aria-label="Sales analytics">
        <path d={smooth([30, 50, 40, 20, 60, 90, 70], w, h)} fill="none" stroke="#4379EE" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        <path d={smooth([10, 35, 55, 60, 45, 70, 85], w, h)} fill="none" stroke="#00B69B" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-2 flex justify-between text-[10px] muted">{['2014', '2015', '2016', '2017', '2018', '2019', '2020'].map(y => <span key={y}>{y}</span>)}</div>
    </section>
  )
}


export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
        {stats.map(s => (
          <div key={s.label} className="card p-5">
            <div className="flex items-start justify-between">
              <div><p className="text-muted dark:text-muted-dark">{s.label}</p><p className="mt-3 text-3xl font-bold">{s.value}</p></div>
              <span className={`grid h-14 w-14 place-items-center rounded-2xl ${s.tint}`}><s.icon size={26} /></span>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-muted dark:text-muted-dark">
              {s.up ? <TrendingUp size={18} className="text-emerald-500" /> : <TrendingDown size={18} className="text-red-500" />}
              <span className={s.up ? 'text-emerald-500' : 'text-red-500'}>{s.note}</span> {s.text}
            </p>
          </div>
        ))}
      </div>
      <section className="card p-5 sm:p-7">
        <div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-bold sm:text-2xl">Sales Details</h2><Select /></div>
        <SalesChart />
      </section>
      <Revenue />
      <div className="grid gap-6 lg:grid-cols-3"><Customers /><Featured /><Analytics /></div>
      <section className="card p-5 sm:p-7">
        <div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-bold sm:text-2xl">Deals Details</h2><Select /></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead><tr className="bg-page text-ink dark:bg-page-dark dark:text-ink-dark">
              {['Product Name', 'Location', 'Date - Time', 'Piece', 'Amount', 'Status'].map(h => <th key={h} className="px-4 py-3 font-bold first:rounded-l-md last:rounded-r-md">{h}</th>)}
            </tr></thead>
            <tbody>{deals.map(d => (
              <tr key={d.name} className="border-b border-line dark:border-line-dark">
                <td className="px-4 py-4"><span className="flex items-center gap-3"><img src="/img/watch-thumb.jpg" alt="" className="h-8 w-8 rounded-full object-cover" />{d.name}</span></td>
                <td className="px-4">{d.location}</td><td className="px-4">{d.date}</td><td className="px-4">{d.piece}</td><td className="px-4">{d.amount}</td>
                <td className="px-4"><span className="rounded bg-emerald-500 px-5 py-1.5 text-xs font-semibold text-white">{d.status}</span></td>
              </tr>))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

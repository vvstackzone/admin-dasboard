import { ChevronLeft, ChevronRight, Filter, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Badge, PageHead, Pager, Popover } from '../ui'

export const orders = [
  ['00001', 'Christine Brooks', '089 Kutch Green Apt. 448', '04 Sep 2019', 'Electric', 'Completed'], ['00002', 'Rosie Pearson', '979 Immanuel Ferry Suite 526', '28 May 2019', 'Book', 'Processing'],
  ['00003', 'Darrell Caldwell', '8587 Frida Ports', '23 Nov 2019', 'Medicine', 'Rejected'], ['00004', 'Gilbert Johnston', '768 Destiny Lake Suite 600', '05 Feb 2019', 'Mobile', 'Completed'],
  ['00005', 'Alan Cain', '042 Mylene Throughway', '29 Jul 2019', 'Watch', 'Processing'], ['00006', 'Alfred Murray', '543 Weimann Mountain', '15 Aug 2019', 'Medicine', 'Completed'],
  ['00007', 'Maggie Sullivan', 'New Scottsdale', '21 Dec 2019', 'Watch', 'Processing'], ['00008', 'Rosie Todd', 'New Jon', '30 Apr 2019', 'Medicine', 'On Hold'],
  ['00009', 'Dollie Hines', '124 Lyla Forge Suite 975', '09 Jan 2019', 'Book', 'In Transit'],
]
const types = ['Health & Medicine', 'Book & Stationary', 'Services & Industry', 'Fashion & Beauty', 'Home & Living', 'Electronics', 'Mobile & Phone', 'Accessories']
const statuses = ['Completed', 'Processing', 'Rejected', 'On Hold', 'In Transit']

function Chips({ items, sel, setSel, title, note, close }: { items: string[]; sel: string[]; setSel: (v: string[]) => void; title: string; note: string; close: () => void }) {
  return (
    <div className="w-72 sm:w-96">
      <h4 className="mb-3 font-bold">{title}</h4>
      <div className="flex flex-wrap gap-2">{items.map(t => (
        <button key={t} onClick={() => setSel(sel.includes(t) ? sel.filter(x => x !== t) : [...sel, t])}
          className={`rounded-full border px-3 py-1.5 text-xs ${sel.includes(t) ? 'border-primary bg-primary text-white' : 'border-line dark:border-line-dark'}`}>{t}</button>))}</div>
      <p className="mt-4 text-[11px] muted">{note}</p>
      <button onClick={close} className="btn-primary mx-auto mt-3 block py-2 text-xs">Apply Now</button>
    </div>
  )
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const pad = (n: number) => String(n).padStart(2, '0')
const key = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`
/** '04 Sep 2019' -> '2019-09-04' */
const orderKey = (s: string) => { const [d, m, y] = s.split(' '); return key(+y, MONTHS.indexOf(m), +d) }
const typeMap: Record<string, string> = { Medicine: 'Health & Medicine', Book: 'Book & Stationary', Electric: 'Electronics', Mobile: 'Mobile & Phone', Watch: 'Accessories' }

function Cal({ value, onApply }: { value: string[]; onApply: (v: string[]) => void }) {
  const first = value[0]?.split('-').map(Number)
  const [ym, setYm] = useState<[number, number]>(first ? [first[0], first[1] - 1] : [2019, 8])
  const [pick, setPick] = useState<string[]>(value)
  const [y, m] = ym
  const lead = new Date(y, m, 1).getDay()
  const total = new Date(y, m + 1, 0).getDate()
  const prevTotal = new Date(y, m, 0).getDate()
  const has = new Set(orders.map(o => orderKey(o[3])))
  const go = (n: number) => setYm(([yy, mm]) => { const d = new Date(yy, mm + n, 1); return [d.getFullYear(), d.getMonth()] })
  return (
    <div className="w-64">
      <div className="mb-3 flex items-center justify-between text-sm font-bold"><span>{FULL[m]} {y}</span>
        <span className="flex gap-1">
          <button type="button" aria-label="Previous month" onClick={() => go(-1)}><ChevronLeft size={16} /></button>
          <button type="button" aria-label="Next month" onClick={() => go(1)}><ChevronRight size={16} /></button></span></div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <b key={i}>{d}</b>)}
        {Array.from({ length: lead }, (_, i) => <span key={`p${i}`} className="grid h-7 place-items-center muted opacity-40">{prevTotal - lead + i + 1}</span>)}
        {Array.from({ length: total }, (_, i) => {
          const d = i + 1, k = key(y, m, d), on = pick.includes(k)
          return <button type="button" key={k} onClick={() => setPick(p => (on ? p.filter(x => x !== k) : [...p, k]))}
            className={`grid h-7 place-items-center rounded ${on ? 'bg-primary text-white' : has.has(k) ? 'bg-primary/10 font-bold text-primary' : 'hover:bg-primary/10'}`}>{d}</button>
        })}
      </div>
      <p className="mt-3 text-[11px] muted">*You can choose multiple date ({pick.length} selected)</p>
      <div className="mt-3 flex justify-center gap-2">
        <button type="button" onClick={() => setPick([])} className="btn-ghost py-2 text-xs">Clear</button>
        <button type="button" onClick={() => onApply(pick)} className="btn-primary py-2 text-xs">Apply Now</button>
      </div>
    </div>
  )
}

export function OrderTable({ rows = orders }: { rows?: string[][] }) {
  return (
    <div className="overflow-x-auto"><table className="w-full min-w-[760px]">
      <thead className="border-b border-line dark:border-line-dark"><tr>{['ID', 'NAME', 'ADDRESS', 'DATE', 'TYPE', 'STATUS'].map(h => <th key={h} className="th text-xs">{h}</th>)}</tr></thead>
      <tbody>{rows.map(r => <tr key={r[0]} className="border-b border-line last:border-0 dark:border-line-dark">
        {r.slice(0, 5).map((c, i) => <td key={i} className="td">{c}</td>)}<td className="td"><Badge label={r[5]} /></td></tr>)}</tbody>
    </table></div>
  )
}

export default function Orders() {
  const [type, setType] = useState<string[]>([]); const [status, setStatus] = useState<string[]>([]); const [dates, setDates] = useState<string[]>([])
  const btn = (label: string, on: boolean) => (t: () => void) => <button onClick={t} className={`px-4 py-3 text-sm font-semibold ${on ? 'text-primary' : ''}`}>{label} ⌄</button>
  const rows = orders.filter(o =>
    (!dates.length || dates.includes(orderKey(o[3]))) &&
    (!type.length || type.includes(typeMap[o[4]])) &&
    (!status.length || status.includes(o[5])))
  return (
    <>
      <PageHead title="Order Lists" />
      <div className="card p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center overflow-visible rounded-lg border border-line dark:border-line-dark">
          <span className="border-r border-line px-4 py-3 dark:border-line-dark"><Filter size={18} /></span>
          <span className="border-r border-line px-4 py-3 text-sm font-semibold dark:border-line-dark">Filter By</span>
          <Popover trigger={t => btn(dates.length ? `Date (${dates.length})` : 'Date', dates.length > 0)(t)}>{close => <Cal value={dates} onApply={v => { setDates(v); close() }} />}</Popover>
          <Popover trigger={t => btn(type.length ? `Order Type (${type.length})` : 'Order Type', type.length > 0)(t)}>{close => <Chips close={close} items={types} sel={type} setSel={setType} title="Select Order Type" note="*You can choose multiple Order type" />}</Popover>
          <Popover trigger={t => btn(status.length ? `Order Status (${status.length})` : 'Order Status', status.length > 0)(t)}>{close => <Chips close={close} items={statuses} sel={status} setSel={setStatus} title="Select Order Status" note="*You can choose multiple Order Status" />}</Popover>
          <button onClick={() => { setType([]); setStatus([]); setDates([]) }} className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-red-500"><RotateCcw size={14} /> Reset Filter</button>
        </div>
        {rows.length ? <OrderTable rows={rows} /> : <p className="py-10 text-center text-sm muted">No orders match the selected filters.</p>}
        <Pager text={`Showing ${rows.length ? '1' : '0'}-${pad(rows.length)} of ${rows.length === orders.length ? 78 : rows.length}`} />
      </div>
    </>
  )
}

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FormPage } from '../ui'
import { ApiError, useResource } from '../api'

export type EventItem = { id: number; name: string; start: string; end: string; time: string; address: string; contact?: string; cover?: string }

export const useEvents = () => useResource<EventItem>('events')

const FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const pad = (n: number) => String(n).padStart(2, '0')
const key = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`
const label = (k: string) => { const [y, m, d] = k.split('-').map(Number); return `${d} ${FULL[m - 1]} ${y}` }
const when = (e: EventItem) => `${e.start === e.end ? label(e.start) : `${label(e.start)} - ${label(e.end)}`} at ${e.time}`
const to12 = (t: string) => { if (!/^\d{2}:\d{2}$/.test(t)) return t; const h = +t.slice(0, 2); return `${pad(h % 12 || 12)}:${t.slice(3)} ${h < 12 ? 'AM' : 'PM'}` }

const dots = ['bg-gray-300', 'bg-orange-300', 'bg-green-300', 'bg-blue-300']
const chips = ['bg-indigo-100 text-indigo-600 border-indigo-400', 'bg-pink-100 text-pink-500 border-pink-400', 'bg-orange-100 text-orange-500 border-orange-300', 'bg-emerald-100 text-emerald-600 border-emerald-400']
const colorOf = (list: EventItem[], id: number) => Math.max(0, list.findIndex(e => e.id === id)) % 4

export default function Calendar() {
  const { items: events, error, reload } = useEvents()
  const loc = useLocation()
  const start = (loc.state as { ym?: [number, number] } | null)?.ym ?? [2019, 9]
  const [[y, m], setYm] = useState<[number, number]>(start)
  const [view, setView] = useState('Month'); const [hover, setHover] = useState<string>(); const [all, setAll] = useState(false)
  const go = (n: number) => setYm(([yy, mm]) => { const d = new Date(yy, mm + n, 1); return [d.getFullYear(), d.getMonth()] })
  const today = new Date()

  const lead = (new Date(y, m, 1).getDay() + 6) % 7 // Monday first
  const total = new Date(y, m + 1, 0).getDate()
  const cells = Array.from({ length: Math.ceil((lead + total) / 7) * 7 }, (_, i) => { const d = i - lead + 1; return d >= 1 && d <= total ? d : 0 })
  const side = [...events].reverse(); const shown = all ? side : side.slice(0, 4)

  return (
    <>
      <div className="mb-6"><h1 className="text-2xl font-bold sm:text-3xl">Calender</h1></div>
      <ApiError message={error} onRetry={reload} />
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="card p-5">
          <Link to="/calendar/new" className="btn-primary w-full">+ Add New Event</Link>
          <h3 className="my-5 font-bold">You are going to</h3>
          <ul className="space-y-5">{shown.map(e => (
            <li key={e.id} className="flex gap-3 text-xs"><i className={`mt-1 h-7 w-7 shrink-0 rounded-full ${dots[colorOf(events, e.id)]}`} />
              <div><p className="text-sm font-bold">{e.name}</p><p className="muted">{when(e)}</p><p className="muted">{e.address}</p>
                <div className="mt-2 flex -space-x-2">{[1, 2, 3].map(k => <img key={k} src={`/img/ev-av${k}.jpg`} alt="" className="h-6 w-6 rounded-full border-2 border-white object-cover dark:border-card-dark" />)}<span className="grid h-6 w-6 place-items-center rounded-full border border-primary bg-card text-[9px] font-bold text-primary dark:bg-card-dark">15+</span></div></div>
            </li>))}</ul>
          {events.length > 4 && <button onClick={() => setAll(a => !a)} className="btn-ghost mx-auto mt-6 block text-xs">{all ? 'See Less' : 'See More'}</button>}
        </aside>
        <section className="card p-4 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <button onClick={() => setYm([today.getFullYear(), today.getMonth()])} className="text-sm muted hover:text-primary">Today</button>
            <div className="flex items-center gap-3 text-lg font-bold">
              <button aria-label="Previous month" onClick={() => go(-1)}><ChevronLeft size={18} /></button> {FULL[m]} {y} <button aria-label="Next month" onClick={() => go(1)}><ChevronRight size={18} /></button></div>
            <div className="flex overflow-hidden rounded-md border border-line text-xs font-semibold dark:border-line-dark">{['Day', 'Week', 'Month'].map(v => <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 ${view === v ? 'bg-primary text-white' : ''}`}>{v}</button>)}</div>
          </div>
          <div className="overflow-x-auto"><div className="grid min-w-[640px] grid-cols-7 border-l border-t border-line dark:border-line-dark">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => <div key={d} className="border-b border-r border-line bg-page py-3 text-center text-xs font-bold dark:border-line-dark dark:bg-page-dark">{d}</div>)}
            {cells.map((d, i) => {
              const k = d ? key(y, m, d) : ''
              const evs = d ? events.filter(e => e.start <= k && k <= e.end) : []
              const isToday = d && y === today.getFullYear() && m === today.getMonth() && d === today.getDate()
              return (
                <div key={i} className="relative min-h-24 border-b border-r border-line p-2 text-sm dark:border-line-dark">
                  <div className="text-right">{d ? <span className={isToday ? 'rounded-full bg-primary px-1.5 py-0.5 text-xs font-bold text-white' : ''}>{d}</span> : ''}</div>
                  <div className="mt-1 space-y-1">{evs.map(e => (
                    <div key={e.id} onMouseEnter={() => setHover(e.id + k)} onMouseLeave={() => setHover(undefined)}
                      className={`relative truncate border-l-4 px-2 py-1 text-left text-[10px] font-semibold ${chips[colorOf(events, e.id)]}`}>{k === e.start || i % 7 === 0 ? e.name : '\u00A0'}
                      {hover === e.id + k && (
                        <div className={`absolute top-0 z-20 w-56 whitespace-normal rounded-xl bg-card p-3 text-xs font-normal text-ink shadow-xl dark:bg-card-dark dark:text-ink-dark ${i % 7 > 3 ? 'right-full mr-2' : 'left-full ml-2'}`}>
                          <img src={e.cover ?? '/img/event.jpg'} alt="" className="mb-2 h-28 w-full rounded-lg object-cover" />
                          <p className="text-sm font-bold">{e.name}</p><p className="muted">{when(e)}</p><p className="muted">{e.address}</p>{e.contact && <p className="muted">{e.contact}</p>}
                        </div>)}
                    </div>))}</div>
                </div>)
            })}
          </div></div>
        </section>
      </div>
    </>
  )
}

export function AddEvent() {
  const { add } = useEvents()
  const nav = useNavigate()
  return (
    <FormPage title="Add New Event" upload="Upload Cover Photo" cta="Add Now" wide
      onSubmit={async (v, cover) => {
        await add({ name: v.name, start: v.date, end: v.date, time: to12(v.time) || 'All day', address: v.address, contact: v.contact, cover })
        const [yy, mm] = v.date.split('-').map(Number)
        nav('/calendar', { state: { ym: [yy, mm - 1] } })
      }}
      fields={[
        { name: 'name', label: 'Event Name', ph: 'Enter event name', req: true }, { name: 'time', label: 'Time', ph: '12:00 PM', type: 'time' },
        { name: 'date', label: 'Date', ph: '11-08-2019', type: 'date', req: true }, { name: 'address', label: 'Address', ph: 'Address' },
        { name: 'contact', label: 'Contact Number', ph: 'Enter Your Contact Number', type: 'tel', full: true }]} />
  )
}

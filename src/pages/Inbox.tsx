import { ArrowLeft, Inbox as InboxI, Paperclip, Printer, Search, Send, Star, Trash2, Info, Archive, Pencil } from 'lucide-react'
import { useState } from 'react'
import { PageHead, Pager } from '../ui'

const folders = [['Inbox', '1253'], ['Starred', '245'], ['Sent', '24,532'], ['Draft', '09'], ['Spam', '14'], ['Important', '18'], ['Bin', '9']]
const labels = [['Primary', 'border-teal-400'], ['Social', 'border-blue-400'], ['Work', 'border-orange-400'], ['Friends', 'border-pink-400']]
const tags: Record<string, string> = { Primary: 'bg-teal-100 text-teal-600', Social: 'bg-blue-100 text-blue-600', Work: 'bg-orange-100 text-orange-600', Friends: 'bg-purple-100 text-purple-600' }
const mails = [
  ['Julia Jalal', 'Primary', 'Our Bachelor of Commerce program is ACBSP-accredited.', '8:38 AM'], ['Minerva Barnett', 'Friends', 'Get Best Advertiser In Your Side Pocket', '8:13 AM'],
  ['Peter Lewis', '', 'Vacation Home Rental Success', '7:52 PM'], ['Anthony Briggs', '', 'Free Classifieds Using Them To Promote Your Stuff Online', '7:52 PM'],
  ['Clifford Morgan', '', 'Enhance Your Brand Potential With Giant Advertising Blimps', '4:13 PM'], ['Cecilia Webster', '', 'Always Look On The Bright Side Of Life', '3:52 PM'],
  ['Harvey Manning', '', 'Curling Irons Are As Individual As The Women Who Use Them', '2:30 PM'], ['Willie Blake', 'Social', 'Our Bachelor of Commerce program is ACBSP-accredited.', '8:38 AM'],
  ['Minerva Barnett', '', 'Get Best Advertiser In Your Side Pocket', '8:13 AM'], ['Fanny Weaver', '', 'Free Classifieds Using Them To Promote Your Stuff Online', '7:52 PM'],
  ['Olga Hogan', '', 'Enhance Your Brand Potential With Giant Advertising Blimps', '4:13 PM'], ['Lora Houston', '', 'Vacation Home Rental Success', '7:52 PM'],
]
const msgs = [
  { me: false, t: 'It is a long-established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.', time: '6:30 pm' },
  { me: true, t: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.', time: '6:34 pm' },
  { me: false, t: 'The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text.', time: '6:38 pm' },
]

export default function Inbox() {
  const [folder, setFolder] = useState(0)
  const [sel, setSel] = useState<number[]>([])
  const [stars, setStars] = useState<number[]>([1, 6])
  const [open, setOpen] = useState<number | null>(null)
  const toggle = (l: number[], set: (v: number[]) => void, i: number) => set(l.includes(i) ? l.filter(x => x !== i) : [...l, i])
  return (
    <>
      <PageHead title="Inbox" />
      <div className="grid gap-5 lg:grid-cols-[230px_1fr]">
        <aside className="card p-5">
          <button className="btn-primary w-full"><Pencil size={14} /> + Compose</button>
          <h3 className="mb-3 mt-6 text-sm font-bold">My Email</h3>
          <ul className="grid grid-cols-2 gap-1 lg:block">{folders.map(([n, c], i) => (
            <li key={n}><button onClick={() => setFolder(i)} className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm ${folder === i ? 'bg-primary/10 font-bold text-primary' : 'muted'}`}>
              <InboxI size={15} />{n}<span className="ml-auto text-xs">{c}</span></button></li>))}</ul>
          <h3 className="mb-3 mt-6 text-sm font-bold">Label</h3>
          <ul className="space-y-3">{labels.map(([n, c]) => <li key={n} className="flex items-center gap-3 px-3 text-sm muted"><i className={`h-4 w-4 rounded border-2 ${c}`} />{n}</li>)}</ul>
          <p className="mt-4 px-3 text-xs muted">+ Create New Label</p>
        </aside>
        <section className="card p-5">
          {open === null ? (
            <>
              <div className="mb-4 flex items-center gap-3">
                <div className="relative w-full max-w-xs"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 muted" /><input placeholder="Search mail" className="h-9 w-full rounded-full bg-page pl-9 text-sm outline-none dark:bg-page-dark" /></div>
                <span className="ml-auto flex gap-2 muted"><Archive size={16} /><Info size={16} /><Trash2 size={16} /></span>
              </div>
              <div className="overflow-x-auto"><ul className="min-w-[620px]">{mails.map(([n, tag, sub, time], i) => (
                <li key={i} onClick={() => setOpen(i)} className={`flex cursor-pointer items-center gap-3 border-b border-line px-2 py-3 text-sm dark:border-line-dark ${sel.includes(i) ? 'bg-primary/10' : ''}`}>
                  <input type="checkbox" checked={sel.includes(i)} onClick={e => e.stopPropagation()} onChange={() => toggle(sel, setSel, i)} className="h-4 w-4 accent-primary" />
                  <button onClick={e => { e.stopPropagation(); toggle(stars, setStars, i) }} aria-label="Star"><Star size={15} className={stars.includes(i) ? 'fill-yellow-400 text-yellow-400' : 'muted'} /></button>
                  <b className="w-36 shrink-0 font-semibold">{n}</b>
                  <span className="w-16 shrink-0">{tag && <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${tags[tag]}`}>{tag}</span>}</span>
                  <span className="flex-1 truncate">{sub}</span><span className="muted">{time}</span>
                </li>))}</ul></div>
              <Pager text="Showing 1-12 of 1,253" />
            </>
          ) : (
            <>
              <div className="mb-4 flex items-center gap-3 border-b border-line pb-3 dark:border-line-dark">
                <button onClick={() => setOpen(null)} aria-label="Back"><ArrowLeft size={18} /></button>
                <b>{mails[open][0]}</b><span className={`rounded px-2 py-0.5 text-[10px] font-bold ${tags.Friends}`}>Friends</span>
                <span className="ml-auto flex gap-3 muted"><Printer size={16} /><Star size={16} /><Trash2 size={16} /></span>
              </div>
              <div className="space-y-4">{msgs.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.me ? 'justify-end' : ''}`}>
                  {!m.me && <i className="mt-auto h-6 w-6 shrink-0 rounded-full bg-gray-300 dark:bg-gray-600" />}
                  <div className={`max-w-[80%] rounded-xl p-4 text-xs leading-relaxed ${m.me ? 'bg-primary text-white' : 'bg-page dark:bg-page-dark'}`}>{m.t}<p className="mt-2 text-right opacity-70">{m.time}</p></div>
                </div>))}</div>
              <div className="mt-6 flex items-center gap-3 border-t border-line pt-4 dark:border-line-dark">
                <input placeholder="Write message" className="flex-1 bg-transparent text-sm outline-none" />
                <Paperclip size={16} className="muted" /><Trash2 size={16} className="muted" />
                <button className="btn-primary py-2">Send <Send size={14} /></button>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  )
}

import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { useRef, useState, type ReactNode } from 'react'
import { fileToDataUrl } from './store'

export const PageHead = ({ title, children }: { title: string; children?: ReactNode }) => (
  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
    <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>{children}
  </div>
)

export const Stars = ({ n, count }: { n: number; count: number }) => (
  <div className="flex items-center gap-1 text-sm muted">
    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} className={i <= n ? 'fill-orange-400 text-orange-400' : 'fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600'} />)}
    <span className="ml-1">({count})</span>
  </div>
)

export const Pager = ({ text, onPrev, onNext, canPrev = true, canNext = true }: { text: string; onPrev?: () => void; onNext?: () => void; canPrev?: boolean; canNext?: boolean }) => (
  <div className="flex items-center justify-between pt-4 text-sm muted">
    <span>{text}</span>
    <span className="flex overflow-hidden rounded-md border border-line dark:border-line-dark">
      <button aria-label="Previous" onClick={onPrev} disabled={!canPrev} className="px-2 py-1.5 hover:bg-primary/10 disabled:opacity-40"><ChevronLeft size={16} /></button>
      <button aria-label="Next" onClick={onNext} disabled={!canNext} className="border-l border-line px-2 py-1.5 hover:bg-primary/10 disabled:opacity-40 dark:border-line-dark"><ChevronRight size={16} /></button>
    </span>
  </div>
)

const tones: Record<string, string> = {
  Completed: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20', Processing: 'bg-purple-100 text-purple-600 dark:bg-purple-500/20',
  Rejected: 'bg-red-100 text-red-500 dark:bg-red-500/20', 'On Hold': 'bg-orange-100 text-orange-500 dark:bg-orange-500/20',
  'In Transit': 'bg-violet-100 text-violet-600 dark:bg-violet-500/20', Delivered: 'bg-emerald-500 text-white',
}
export const Badge = ({ label }: { label: string }) => (
  <span className={`inline-block min-w-[88px] rounded px-3 py-1.5 text-center text-xs font-bold ${tones[label] ?? ''}`}>{label}</span>
)

export const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block text-sm"><span className="mb-2 block font-semibold">{label}</span>{children}</label>
)

export function Popover({ trigger, children, align = 'left' }: { trigger: (toggle: () => void, open: boolean) => ReactNode; children: (close: () => void) => ReactNode; align?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      {trigger(() => setOpen(o => !o), open)}
      {open && <>
        <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
        <div className={`pop top-full mt-2 ${align === 'right' ? 'right-0' : 'left-0'}`}>{children(() => setOpen(false))}</div>
      </>}
    </div>
  )
}

export const Upload = ({ label, round = true, img, onPick }: { label: string; round?: boolean; img?: string; onPick?: (dataUrl: string) => void }) => {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <div className={`grid h-16 w-16 place-items-center overflow-hidden bg-[#F1F4F9] dark:bg-page-dark ${round ? 'rounded-full' : 'rounded-lg'}`}>
        {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>}
      </div>
      <input ref={ref} type="file" accept="image/*" hidden onChange={async e => {
        const f = e.target.files?.[0]
        if (f && onPick) { try { onPick(await fileToDataUrl(f)) } catch { /* ignore bad file */ } }
        e.target.value = ''
      }} />
      <button type="button" onClick={() => ref.current?.click()} className="text-xs font-semibold text-primary">{label}</button>
    </div>
  )
}

export type FormField = { name: string; label: string; ph: string; type?: string; options?: string[]; area?: boolean; full?: boolean; req?: boolean }

export function FormPage({ title, upload, fields, cta, wide = false, onSubmit }: {
  title: string; upload: string; fields: FormField[]; cta: string; wide?: boolean
  onSubmit: (values: Record<string, string>, photo?: string) => void | Promise<void>
}) {
  const [vals, setVals] = useState<Record<string, string>>(() => Object.fromEntries(fields.map(f => [f.name, f.options ? f.options[0] : ''])))
  const [photo, setPhoto] = useState<string>()
  const [errs, setErrs] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState('')
  const set = (k: string, v: string) => { setVals(p => ({ ...p, [k]: v })); if (errs[k]) setErrs(p => ({ ...p, [k]: '' })) }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    const er: Record<string, string> = {}
    fields.forEach(f => {
      const v = vals[f.name].trim()
      if (f.req && !v) er[f.name] = `${f.label} is required`
      else if (f.type === 'email' && v && !/^\S+@\S+\.\S+$/.test(v)) er[f.name] = 'Enter a valid email'
    })
    setErrs(er)
    if (Object.keys(er).length) return
    setBusy(true); setFailed('')
    try {
      await onSubmit(Object.fromEntries(Object.entries(vals).map(([k, v]) => [k, v.trim()])), photo)
    } catch (err) {
      setFailed((err as Error).message || 'Something went wrong. Please try again.')
      setBusy(false)
    }
  }

  return (
    <>
      <PageHead title={title} />
      <form onSubmit={submit} noValidate className="card mx-auto max-w-6xl p-5 sm:p-10">
        <Upload label={upload} round={!upload.includes('Cover')} img={photo} onPick={setPhoto} />
        <div className={`mx-auto mt-6 grid gap-5 ${wide ? 'max-w-4xl' : 'max-w-3xl'} sm:grid-cols-2`}>
          {fields.map(f => (
            <div key={f.name} className={f.full ? 'sm:col-span-2' : ''}>
              <Field label={f.label + (f.req ? ' *' : '')}>
                {f.area ? <textarea rows={4} placeholder={f.ph} value={vals[f.name]} onChange={e => set(f.name, e.target.value)} className="input h-auto py-3" />
                  : f.options ? <select value={vals[f.name]} onChange={e => set(f.name, e.target.value)} className="input">{f.options.map(o => <option key={o}>{o}</option>)}</select>
                  : <input type={f.type ?? 'text'} placeholder={f.ph} value={vals[f.name]} onChange={e => set(f.name, e.target.value)} className={`input ${errs[f.name] ? 'border-red-500' : ''}`} />}
              </Field>
              {errs[f.name] && <p className="mt-1 text-xs text-red-500">{errs[f.name]}</p>}
            </div>
          ))}
        </div>
        {failed && <p role="alert" className="mt-6 text-center text-sm text-red-500">{failed}</p>}
        <div className="mt-10 text-center"><button disabled={busy} className="btn-primary w-full max-w-xs disabled:opacity-60">{busy ? 'Saving…' : cta}</button></div>
      </form>
    </>
  )
}

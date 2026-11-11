import { Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, ApiError, useResource } from '../api'
import { Field, PageHead, Pager, Upload } from '../ui'

export type StockItem = { id: number; name: string; category: string; price: number; qty: number; image: string; colors: string[] }

export const useStock = () => useResource<StockItem>('stock')
const money = (n: number) => `$${n.toFixed(2)}`

type TableProps = { rows: StockItem[]; onDelete?: (r: StockItem) => void }

/** Edit is a link to the edit page; the Action column only shows when onDelete is given. */
export function StockTable({ rows, onDelete }: TableProps) {
  const actions = !!onDelete
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="border-b-2 border-line dark:border-line-dark"><tr>
            {['Image', 'Product Name', 'Category', 'Price', 'Piece', 'Available Color', ...(actions ? ['Action'] : [])].map(h => <th key={h} className="th py-4">{h}</th>)}
          </tr></thead>
          <tbody>{rows.map(r => (
            <tr key={r.id} className="border-b border-line last:border-0 dark:border-line-dark">
              <td className="td"><img src={r.image} alt="" className="h-14 w-14 rounded-lg object-cover" /></td>
              <td className="td">{r.name}</td><td className="td">{r.category}</td><td className="td">{money(r.price)}</td><td className="td">{r.qty}</td>
              <td className="td"><span className="flex gap-3">{r.colors.map((c, i) => <i key={c + i} className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ background: c }} />)}</span></td>
              {actions && <td className="td"><span className="inline-flex overflow-hidden rounded-md border border-line dark:border-line-dark">
                <Link aria-label={`Edit ${r.name}`} to={`/stock/${r.id}/edit`} className="px-3 py-2 muted hover:bg-primary/10"><Pencil size={16} /></Link>
                <button aria-label={`Delete ${r.name}`} onClick={() => onDelete!(r)} className="border-l border-line px-3 py-2 text-red-500 hover:bg-red-500/10 dark:border-line-dark"><Trash2 size={16} /></button></span></td>}
            </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const PAGE = 8
const pad = (n: number) => String(n).padStart(2, '0')

export default function Stock() {
  const { items, loading, error, reload, remove } = useStock()
  const [q, setQ] = useState('')
  const [page, setPage] = useState(0)
  const [delErr, setDelErr] = useState('')

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase()
    return t ? items.filter(r => r.name.toLowerCase().includes(t) || r.category.toLowerCase().includes(t)) : items
  }, [items, q])
  const pages = Math.max(1, Math.ceil(rows.length / PAGE))
  const cur = Math.min(page, pages - 1)
  const shown = rows.slice(cur * PAGE, cur * PAGE + PAGE)

  const del = async (r: StockItem) => {
    if (!window.confirm(`Delete "${r.name}" from stock? This cannot be undone.`)) return
    setDelErr('')
    try { await remove(r.id) } catch (e) { setDelErr((e as Error).message) }
  }

  return (
    <>
      <PageHead title="Product Stock">
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <div className="relative w-full sm:w-72"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 muted" />
            <input value={q} onChange={e => { setQ(e.target.value); setPage(0) }} placeholder="Search product name" className="h-10 w-full rounded-full border border-line bg-card pl-10 pr-4 text-sm outline-none dark:border-line-dark dark:bg-card-dark" /></div>
          <Link to="/stock/new" className="btn-primary"><Plus size={16} /> Add Product</Link>
        </div>
      </PageHead>
      <ApiError message={error ?? (delErr || null)} onRetry={error ? reload : undefined} />
      {loading && !items.length ? <p className="muted">Loading stock…</p>
        : !rows.length ? <div className="card p-10 text-center muted">{q ? 'No products match your search.' : 'No products in stock yet.'}</div>
        : <>
          <StockTable rows={shown} onDelete={del} />
          <Pager text={`Showing ${pad(cur * PAGE + 1)}-${pad(cur * PAGE + shown.length)} of ${rows.length}`}
            onPrev={() => setPage(cur - 1)} onNext={() => setPage(cur + 1)} canPrev={cur > 0} canNext={cur < pages - 1} />
        </>}
    </>
  )
}

/** One page for both /stock/new (create) and /stock/:id/edit (update). */
export function StockForm() {
  const { id } = useParams()
  const editing = id !== undefined
  const nav = useNavigate()
  const [loaded, setLoaded] = useState(!editing)
  const [loadErr, setLoadErr] = useState('')
  const [image, setImage] = useState('/img/stock1.jpg')
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [qty, setQty] = useState('')
  const [colors, setColors] = useState<string[]>(['#000000'])
  const [cats, setCats] = useState<string[]>([])
  const [errs, setErrs] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState('')
  const clr = (k: string) => setErrs(p => (p[k] ? { ...p, [k]: '' } : p))

  useEffect(() => {
    let alive = true
    api.list<StockItem>('stock').then(all => {
      if (!alive) return
      setCats([...new Set(all.map(s => s.category))].sort())
      if (editing) {
        const it = all.find(s => String(s.id) === id)
        if (!it) { setLoadErr('This product no longer exists.'); return }
        setImage(it.image); setName(it.name); setCategory(it.category); setPrice(String(it.price)); setQty(String(it.qty)); setColors(it.colors)
        setLoaded(true)
      }
    }).catch(e => alive && setLoadErr((e as Error).message))
    return () => { alive = false }
  }, [id, editing])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    const er: Record<string, string> = {}
    if (!name.trim()) er.name = 'Product name is required'
    const p = Number(price), n = Number(qty)
    if (!price.trim() || Number.isNaN(p) || p < 0) er.price = 'Enter a valid price'
    if (!qty.trim() || !Number.isInteger(n) || n < 0) er.qty = 'Enter a whole number'
    setErrs(er)
    if (Object.keys(er).length) return
    const body = { name: name.trim(), category: category.trim() || 'General', price: Math.round(p * 100) / 100, qty: n, image, colors }
    setBusy(true); setFailed('')
    try {
      if (editing) await api.update<StockItem>('stock', Number(id), body)
      else await api.create<StockItem>('stock', body)
      nav('/stock')
    } catch (err) { setFailed((err as Error).message); setBusy(false) }
  }

  if (loadErr) return <><PageHead title="Product Stock" /><ApiError message={loadErr} /><Link to="/stock" className="btn-ghost">Back to stock</Link></>
  if (!loaded) return <p className="muted">Loading…</p>

  const err = (k: string) => errs[k] && <p className="mt-1 text-xs text-red-500">{errs[k]}</p>
  return (
    <>
      <PageHead title={editing ? 'Edit Stock Product' : 'Add Stock Product'} />
      <form onSubmit={submit} noValidate className="card mx-auto max-w-6xl p-5 sm:p-10">
        <Upload label="Upload Image" round={false} img={image} onPick={setImage} />
        <div className="mx-auto mt-6 grid max-w-3xl gap-5 sm:grid-cols-2">
          <div><Field label="Product Name *"><input value={name} onChange={e => { setName(e.target.value); clr('name') }} placeholder="Enter product name" className={`input ${errs.name ? 'border-red-500' : ''}`} /></Field>{err('name')}</div>
          <div><Field label="Category"><input list="stock-cats" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Mobile" className="input" /></Field>
            <datalist id="stock-cats">{cats.map(c => <option key={c} value={c} />)}</datalist></div>
          <div><Field label="Price ($) *"><input value={price} onChange={e => { setPrice(e.target.value); clr('price') }} inputMode="decimal" placeholder="0.00" className={`input ${errs.price ? 'border-red-500' : ''}`} /></Field>{err('price')}</div>
          <div><Field label="Piece (quantity) *"><input value={qty} onChange={e => { setQty(e.target.value); clr('qty') }} inputMode="numeric" placeholder="0" className={`input ${errs.qty ? 'border-red-500' : ''}`} /></Field>{err('qty')}</div>
          <div className="sm:col-span-2">
            <span className="mb-2 block text-sm font-semibold">Available Color</span>
            <div className="flex flex-wrap items-center gap-3">
              {colors.map((c, i) => (
                <span key={i} className="relative">
                  <input type="color" aria-label={`Color ${i + 1}`} value={c} onChange={e => setColors(l => l.map((x, j) => (j === i ? e.target.value.toUpperCase() : x)))} className="h-10 w-10 cursor-pointer rounded-full border border-line bg-transparent p-0.5 dark:border-line-dark" />
                  <button type="button" aria-label={`Remove color ${i + 1}`} onClick={() => setColors(l => l.filter((_, j) => j !== i))} className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-white"><X size={10} /></button>
                </span>))}
              {colors.length < 6 && <button type="button" onClick={() => setColors(l => [...l, '#4338F2'])} className="btn-ghost h-10"><Plus size={14} /> Add color</button>}
            </div>
          </div>
        </div>
        {failed && <p role="alert" className="mt-6 text-center text-sm text-red-500">{failed}</p>}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/stock" className="btn-ghost px-8">Cancel</Link>
          <button disabled={busy} className="btn-primary w-full max-w-xs disabled:opacity-60">{busy ? 'Saving…' : editing ? 'Save Changes' : 'Add Product'}</button>
        </div>
      </form>
    </>
  )
}

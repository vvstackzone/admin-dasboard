import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Field, Upload } from '../ui'
import type { Product } from '../pages/Products'

type Props = {
  /** The product being edited, or null to add a new one. */
  product: Product | null
  categories: string[]
  onClose: () => void
  onSave: (data: Omit<Product, 'id'>) => Promise<void>
  onDelete?: () => Promise<void>
}

export default function ProductModal({ product, categories, onClose, onSave, onDelete }: Props) {
  const [name, setName] = useState(product?.name ?? '')
  const [price, setPrice] = useState(product ? String(product.price) : '')
  const [category, setCategory] = useState(product?.category ?? categories[0] ?? '')
  const [stars, setStars] = useState(product?.stars ?? 4)
  const [count, setCount] = useState(String(product?.count ?? 0))
  const [image, setImage] = useState(product?.image ?? '/img/watch-black.jpg')
  const [errs, setErrs] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState('')
  const clr = (k: string) => setErrs(p => (p[k] ? { ...p, [k]: '' } : p))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    const er: Record<string, string> = {}
    if (!name.trim()) er.name = 'Product name is required'
    const p = Number(price)
    if (!price.trim() || Number.isNaN(p) || p < 0) er.price = 'Enter a valid price'
    const c = Number(count)
    if (!Number.isInteger(c) || c < 0) er.count = 'Enter a whole number'
    setErrs(er)
    if (Object.keys(er).length) return
    setBusy(true); setFailed('')
    try {
      await onSave({
        name: name.trim(), price: Math.round(p * 100) / 100, category: category.trim() || 'General',
        stars, count: c, image, liked: product?.liked ?? false,
      })
    } catch (err) {
      setFailed((err as Error).message); setBusy(false)
    }
  }

  const remove = async () => {
    if (!onDelete || busy || !window.confirm(`Delete "${product?.name}"? This cannot be undone.`)) return
    setBusy(true); setFailed('')
    try { await onDelete() } catch (err) { setFailed((err as Error).message); setBusy(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:items-center" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <form onSubmit={submit} noValidate role="dialog" aria-modal="true" aria-label={product ? 'Edit product' : 'Add product'} className="card w-full max-w-xl p-5 sm:p-8">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-bold">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="rounded-full p-1 hover:bg-primary/10"><X size={20} /></button>
        </div>

        <Upload label="Change Image" round={false} img={image} onPick={setImage} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Product Name *"><input value={name} onChange={e => { setName(e.target.value); clr('name') }} placeholder="Enter product name" className={`input ${errs.name ? 'border-red-500' : ''}`} autoFocus /></Field>
            {errs.name && <p className="mt-1 text-xs text-red-500">{errs.name}</p>}
          </div>
          <div>
            <Field label="Price ($) *"><input value={price} onChange={e => { setPrice(e.target.value); clr('price') }} inputMode="decimal" placeholder="0.00" className={`input ${errs.price ? 'border-red-500' : ''}`} /></Field>
            {errs.price && <p className="mt-1 text-xs text-red-500">{errs.price}</p>}
          </div>
          <div>
            <Field label="Category">
              <input list="product-categories" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Watches" className="input" />
            </Field>
            <datalist id="product-categories">{categories.map(c => <option key={c} value={c} />)}</datalist>
          </div>
          <Field label="Rating">
            <select value={stars} onChange={e => setStars(Number(e.target.value))} className="input">
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
            </select>
          </Field>
          <div>
            <Field label="Reviews"><input value={count} onChange={e => { setCount(e.target.value); clr('count') }} inputMode="numeric" className={`input ${errs.count ? 'border-red-500' : ''}`} /></Field>
            {errs.count && <p className="mt-1 text-xs text-red-500">{errs.count}</p>}
          </div>
        </div>

        {failed && <p role="alert" className="mt-4 text-sm text-red-500">{failed}</p>}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {onDelete && <button type="button" onClick={remove} disabled={busy} className="mr-auto rounded-md px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-500/10 disabled:opacity-60">Delete</button>}
          <button type="button" onClick={onClose} className="btn-ghost ml-auto">Cancel</button>
          <button disabled={busy} className="btn-primary px-8 disabled:opacity-60">{busy ? 'Saving…' : product ? 'Save Changes' : 'Add Product'}</button>
        </div>
      </form>
    </div>
  )
}

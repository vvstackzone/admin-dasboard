import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ApiError, useResource } from '../api'
import ProductModal from '../components/ProductModal'
import { PageHead, Stars } from '../ui'

export type Product = { id: number; name: string; category: string; price: number; stars: number; count: number; image: string; liked: boolean }

export const money = (n: number) => `$${n.toFixed(2)}`

/** Shared by Products and Favorites: loads products from the API and owns the edit modal. */
export function useProducts() {
  const res = useResource<Product>('products')
  const [editing, setEditing] = useState<Product | 'new' | null>(null)
  const categories = useMemo(() => [...new Set(res.items.map(p => p.category))].sort(), [res.items])
  const toggleLike = (p: Product) => res.updateOptimistic(p.id, { liked: !p.liked })

  const modal = editing && (
    <ProductModal
      product={editing === 'new' ? null : editing}
      categories={categories}
      onClose={() => setEditing(null)}
      onSave={async data => {
        if (editing === 'new') await res.add(data)
        else await res.update(editing.id, data)
        setEditing(null)
      }}
      onDelete={editing === 'new' ? undefined : async () => { await res.remove(editing.id); setEditing(null) }}
    />
  )
  return { ...res, setEditing, toggleLike, modal }
}

export function ProductGrid({ items, onLike, onEdit }: { items: Product[]; onLike: (p: Product) => void; onEdit: (p: Product) => void }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
      {items.map(p => (
        <article key={p.id} className="card p-5">
          <div className="relative flex h-64 items-center justify-center sm:h-72">
            <button aria-label="Previous" className="absolute left-0 grid h-9 w-9 place-items-center rounded-full bg-[#F1F4F9] dark:bg-page-dark"><ChevronLeft size={16} /></button>
            <img src={p.image} alt={p.name} className="h-full object-contain" />
            <button aria-label="Next" className="absolute right-0 grid h-9 w-9 place-items-center rounded-full bg-[#F1F4F9] dark:bg-page-dark"><ChevronRight size={16} /></button>
          </div>
          <div className="mt-4 flex items-start justify-between gap-3">
            <div className="min-w-0"><h3 className="text-lg font-bold">{p.name}</h3><p className="my-1 font-bold text-primary">{money(p.price)}</p><Stars n={p.stars} count={p.count} /></div>
            <button aria-label={p.liked ? 'Remove from favorites' : 'Add to favorites'} aria-pressed={p.liked} onClick={() => onLike(p)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#F1F4F9] dark:bg-page-dark">
              <Heart size={18} className={p.liked ? 'fill-rose-500 text-rose-500' : 'text-rose-500'} /></button>
          </div>
          <button onClick={() => onEdit(p)} className="mt-4 rounded-md bg-[#EEF1FB] px-4 py-2 text-sm font-bold hover:bg-primary/10 dark:bg-page-dark">Edit Product</button>
        </article>
      ))}
    </div>
  )
}

export default function Products() {
  const { items, loading, error, reload, setEditing, toggleLike, modal } = useProducts()
  return (
    <>
      <PageHead title="Products"><button onClick={() => setEditing('new')} className="btn-primary">Add Product</button></PageHead>
      <ApiError message={error} onRetry={reload} />
      <section className="relative mb-6 overflow-hidden rounded-2xl bg-primary px-6 py-10 text-white sm:px-20 sm:py-16"
        style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,.12) 0, transparent 40%), radial-gradient(circle at 10% 90%, rgba(255,255,255,.1) 0, transparent 35%)' }}>
        <button aria-label="Previous" className="absolute left-4 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/60 text-ink"><ChevronLeft size={18} /></button>
        <button aria-label="Next" className="absolute right-4 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/60 text-ink"><ChevronRight size={18} /></button>
        <p className="text-sm">September 12-22</p>
        <h2 className="my-3 max-w-md text-3xl font-extrabold leading-tight sm:text-4xl">Enjoy free home delivery in this summer</h2>
        <p className="text-sm text-white/80">Designer Dresses - Pick from trendy Designer Dress.</p>
        <button className="mt-6 rounded-md bg-orange-500 px-6 py-2.5 text-sm font-bold">Get Started</button>
      </section>
      {loading && !items.length ? <p className="muted">Loading products…</p>
        : <ProductGrid items={items} onLike={toggleLike} onEdit={setEditing} />}
      {modal}
    </>
  )
}

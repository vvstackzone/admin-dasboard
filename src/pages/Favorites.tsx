import { Link } from 'react-router-dom'
import { ApiError } from '../api'
import { PageHead } from '../ui'
import { ProductGrid, useProducts } from './Products'

export default function Favorites() {
  const { items, loading, error, reload, setEditing, toggleLike, modal } = useProducts()
  const liked = items.filter(p => p.liked)
  return (
    <>
      <PageHead title="Favorites" />
      <ApiError message={error} onRetry={reload} />
      {loading && !items.length ? <p className="muted">Loading favorites…</p>
        : liked.length ? <ProductGrid items={liked} onLike={toggleLike} onEdit={setEditing} />
        : !error && <div className="card p-10 text-center"><p className="mb-4 muted">You haven't liked any products yet.</p><Link to="/products" className="btn-primary">Browse products</Link></div>}
      {modal}
    </>
  )
}

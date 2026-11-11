import { PageHead } from '../ui'
import { OrderTable, orders } from './Orders'
import { StockTable, useStock } from './Stock'

export default function Table() {
  const { items } = useStock()
  return (
    <>
      <PageHead title="Table" />
      <div className="card mb-6 p-4 sm:p-6"><OrderTable rows={orders.slice(0, 6)} /></div>
      <StockTable rows={items.slice(0, 6)} />
    </>
  )
}

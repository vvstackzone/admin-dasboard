import { Printer, Send } from 'lucide-react'
import { PageHead } from '../ui'

const rows = [[1, 'Children Toy', 2, '$20', '$80'], [2, 'Makeup', 2, '$50', '$100'], [3, 'Asus Laptop', 5, '$100', '$500'], [4, 'Iphone X', 4, '$1000', '$4000']]
export default function Invoice() {
  return (
    <>
      <PageHead title="Invoice" />
      <div className="card p-5 sm:p-10">
        <div className="mx-auto grid max-w-3xl gap-6 text-sm sm:grid-cols-3">
          <div><b>Invoice From :</b><p className="mt-1 muted">Virginia Walker<br />9694 Krajcik Locks Suite 635</p></div>
          <div><b>Invoice To :</b><p className="mt-1 muted">Austin Miller<br />Brookview</p></div>
          <div><p>Invoice Date : 12 Nov 2019</p><p>Due Date : 25 Dec 2019</p></div>
        </div>
        <div className="mx-auto mt-10 max-w-4xl overflow-x-auto"><table className="w-full min-w-[560px] text-sm">
          <thead className="bg-page dark:bg-page-dark"><tr>{['Serial No.', 'Description', 'Quantity', 'Base Cost', 'Total Cost'].map((h, i) => <th key={h} className={`th ${i > 1 ? 'text-right' : ''}`}>{h}</th>)}</tr></thead>
          <tbody>{rows.map(r => <tr key={r[0]} className="border-b border-line dark:border-line-dark">{r.map((c, i) => <td key={i} className={`td py-5 ${i > 1 ? 'text-right' : ''}`}>{c}</td>)}</tr>)}</tbody>
        </table></div>
        <p className="mx-auto mt-8 max-w-4xl text-right font-bold">Total <span className="ml-3 text-primary">= $4680</span></p>
        <div className="mx-auto mt-8 flex max-w-4xl justify-end gap-3">
          <button aria-label="Print" className="btn-ghost"><Printer size={16} /></button>
          <button className="btn-primary px-10">Send <Send size={14} /></button>
        </div>
      </div>
    </>
  )
}

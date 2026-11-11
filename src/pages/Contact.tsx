import { Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { FormPage, PageHead } from '../ui'
import { ApiError, useResource } from '../api'

export type ContactItem = { id: number; name: string; email: string; phone?: string; photo: string }

export const useContacts = () => useResource<ContactItem>('contacts')

export default function Contact() {
  const { items: people, loading, error, reload } = useContacts()
  return (
    <>
      <PageHead title="Contact"><Link to="/contact/new" className="btn-primary">Add New Contact</Link></PageHead>
      <ApiError message={error} onRetry={reload} />
      {loading && !people.length && <p className="muted">Loading contacts…</p>}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {people.map(p => (
          <div key={p.id} className="card overflow-hidden pb-6 text-center">
            <img src={p.photo} alt={p.name} className="aspect-[4/3] w-full object-cover" />
            <h3 className="mt-4 font-bold">{p.name}</h3><p className="mb-5 text-sm muted">{p.email}</p>
            <a href={`mailto:${p.email}`} className="btn-ghost px-8"><Mail size={16} /> Message</a>
          </div>))}
      </div>
    </>
  )
}

export function AddContact() {
  const { add } = useContacts()
  const nav = useNavigate()
  return (
    <FormPage title="Add New Contact" upload="Upload Photo" cta="Add New"
      onSubmit={async (v, photo) => {
        await add({ name: `${v.first} ${v.last}`.trim(), email: v.email, phone: v.phone, photo: photo ?? '/img/avatar.jpg' })
        nav('/contact')
      }}
      fields={[
        { name: 'first', label: 'First Name', ph: 'Enter first Name', req: true }, { name: 'last', label: 'Last Name', ph: 'Enter Last Name' },
        { name: 'email', label: 'Your email', ph: 'Enter your email', type: 'email', req: true }, { name: 'phone', label: 'Phone Number', ph: 'Enter phone number', type: 'tel' },
        { name: 'dob', label: 'Date of Birth', ph: 'Enter your Birthday', type: 'date' }, { name: 'gender', label: 'Gender', ph: '', options: ['Male', 'Female', 'Other'] }]} />
  )
}

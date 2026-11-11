import { Link, useNavigate } from 'react-router-dom'
import { FormPage, PageHead } from '../ui'
import { ApiError, useResource } from '../api'

export type Member = { id: number; name: string; role: string; email: string; phone?: string; gender?: string; photo: string }

export const useTeam = () => useResource<Member>('team')

export default function Team() {
  const { items: team, loading, error, reload } = useTeam()
  return (
    <>
      <PageHead title="Team"><Link to="/team/new" className="btn-primary">Add New Member</Link></PageHead>
      <ApiError message={error} onRetry={reload} />
      {loading && !team.length && <p className="muted">Loading team…</p>}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {team.map(m => (
          <div key={m.id} className="card px-4 py-8 text-center">
            <img src={m.photo} alt={m.name} className="mx-auto h-24 w-24 rounded-full object-cover" />
            <h3 className="mt-4 font-bold">{m.name}</h3><p className="my-1 text-sm muted">{m.role}</p><p className="break-all text-sm">{m.email}</p>
          </div>))}
      </div>
    </>
  )
}

export function AddMember() {
  const { add } = useTeam()
  const nav = useNavigate()
  return (
    <FormPage title="Add Team Member" upload="Upload Photo" cta="Add Now"
      onSubmit={async (v, photo) => {
        await add({ name: `${v.first} ${v.last}`.trim(), role: v.position || 'Member', email: v.email, phone: v.phone, gender: v.gender, photo: photo ?? '/img/avatar.jpg' })
        nav('/team')
      }}
      fields={[
        { name: 'first', label: 'First Name', ph: 'Enter first Name', req: true }, { name: 'last', label: 'Last Name', ph: 'Enter Last Name' },
        { name: 'email', label: 'Your email', ph: 'Enter your email', type: 'email', req: true }, { name: 'phone', label: 'Phone Number', ph: 'Enter phone number', type: 'tel' },
        { name: 'position', label: 'Position', ph: 'Enter position' }, { name: 'gender', label: 'Gender', ph: '', options: ['Male', 'Female', 'Other'] }]} />
  )
}

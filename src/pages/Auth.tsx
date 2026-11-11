import { Eye, EyeOff } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'

const Wave = () => (
  <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden>
    <path d="M0 200 C300 50 500 400 800 250 S1250 100 1440 300 V0 H0Z" fill="#fff" fillOpacity=".06" />
    <path d="M0 900 V500 C300 400 500 800 900 600 S1300 450 1440 650 V900Z" fill="#fff" fillOpacity=".07" />
    <path d="M-50 400 C200 300 300 700 600 520 S1000 300 1500 520" stroke="#fff" strokeOpacity=".08" strokeWidth="80" fill="none" />
  </svg>
)
const Shell = ({ children }: { children: ReactNode }) => (
  <div className="relative grid min-h-screen place-items-center overflow-hidden bg-primary p-4"><Wave />{children}</div>
)
const Err = ({ msg }: { msg?: string }) => (msg ? <p role="alert" className="mt-1.5 text-xs font-semibold text-red-500">{msg}</p> : null)
const card = 'relative w-full max-w-md rounded-2xl bg-card p-8 shadow-xl dark:bg-card-dark sm:p-10'
const emailOk = (v: string) => /^\S+@\S+\.\S+$/.test(v)

function Password({ value, onChange, error, extra }: { value: string; onChange: (v: string) => void; error?: string; extra?: ReactNode }) {
  const [show, setShow] = useState(false)
  return (
    <div className="text-sm">
      <div className="mb-2 flex justify-between font-semibold"><label htmlFor="pw">Password</label>{extra}</div>
      <div className="relative">
        <input id="pw" type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder="Enter password" className="input pr-10" />
        <button type="button" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 muted">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
      </div>
      <Err msg={error} />
    </div>
  )
}

export function Signup() {
  const { signup } = useAuth(); const nav = useNavigate()
  const [f, setF] = useState({ email: '', username: '', password: '', terms: false })
  const [e, setE] = useState<Record<string, string>>({})
  const submit = (ev: FormEvent) => {
    ev.preventDefault()
    const er: Record<string, string> = {}
    if (!emailOk(f.email)) er.email = 'Enter a valid email address.'
    if (!f.username.trim()) er.username = 'Username is required.'
    if (f.password.length < 6) er.password = 'Password must be at least 6 characters.'
    if (!f.terms) er.terms = 'Please accept the terms and conditions.'
    setE(er)
    if (Object.keys(er).length) return
    signup({ email: f.email.trim(), username: f.username.trim(), password: f.password })
    nav('/login', { replace: true, state: { registered: true, email: f.email.trim() } })
  }
  return (
    <Shell>
      <form onSubmit={submit} noValidate className={card}>
        <h1 className="text-center text-2xl font-bold">Create an Account</h1><p className="mb-8 mt-2 text-center text-sm muted">Create a account to continue</p>
        <div className="space-y-5">
          <div className="text-sm"><label htmlFor="em" className="mb-2 block font-semibold">Email address:</label>
            <input id="em" type="email" value={f.email} onChange={ev => setF({ ...f, email: ev.target.value })} placeholder="esteban_schiller@gmail.com" className="input" /><Err msg={e.email} /></div>
          <div className="text-sm"><label htmlFor="un" className="mb-2 block font-semibold">Username</label>
            <input id="un" value={f.username} onChange={ev => setF({ ...f, username: ev.target.value })} placeholder="Username" className="input" /><Err msg={e.username} /></div>
          <Password value={f.password} onChange={v => setF({ ...f, password: v })} error={e.password} />
          <div><label className="flex items-center gap-2 text-sm muted"><input type="checkbox" checked={f.terms} onChange={ev => setF({ ...f, terms: ev.target.checked })} className="h-4 w-4 accent-primary" />I accept terms and conditions</label><Err msg={e.terms} /></div>
          <button className="btn-primary w-full py-3">Sign Up</button>
        </div>
        <p className="mt-6 text-center text-sm muted">Already have an account? <Link to="/login" className="font-semibold text-primary">Login</Link></p>
      </form>
    </Shell>
  )
}

export function Login() {
  const { login } = useAuth(); const nav = useNavigate()
  const state = (useLocation().state ?? {}) as { registered?: boolean; email?: string }
  const [f, setF] = useState({ email: state.email ?? '', password: '', remember: true })
  const [e, setE] = useState<Record<string, string>>({})
  const submit = (ev: FormEvent) => {
    ev.preventDefault()
    const er: Record<string, string> = {}
    if (!emailOk(f.email)) er.email = 'Enter a valid email address.'
    if (!f.password) er.password = 'Password is required.'
    if (!Object.keys(er).length) { const msg = login(f.email, f.password, f.remember); if (msg) er.form = msg }
    setE(er)
    if (!Object.keys(er).length) nav('/', { replace: true })
  }
  return (
    <Shell>
      <form onSubmit={submit} noValidate className={card}>
        <h1 className="text-center text-2xl font-bold">Login to Account</h1><p className="mb-8 mt-2 text-center text-sm muted">Please enter your email and password to continue</p>
        {state.registered && !e.form && <p role="status" className="mb-5 rounded-lg bg-emerald-50 px-3 py-2 text-center text-sm font-semibold text-emerald-600 dark:bg-emerald-500/10">Account created. Please log in to continue.</p>}
        {e.form && <p role="alert" className="mb-5 rounded-lg bg-red-50 px-3 py-2 text-center text-sm font-semibold text-red-500 dark:bg-red-500/10">{e.form}</p>}
        <div className="space-y-5">
          <div className="text-sm"><label htmlFor="em" className="mb-2 block font-semibold">Email address:</label>
            <input id="em" type="email" value={f.email} onChange={ev => setF({ ...f, email: ev.target.value })} placeholder="esteban_schiller@gmail.com" className="input" /><Err msg={e.email} /></div>
          <Password value={f.password} onChange={v => setF({ ...f, password: v })} error={e.password} extra={<span className="muted">Forgot Password?</span>} />
          <label className="flex items-center gap-2 text-sm muted"><input type="checkbox" checked={f.remember} onChange={ev => setF({ ...f, remember: ev.target.checked })} className="h-4 w-4 accent-primary" />Remember Password</label>
          <button className="btn-primary w-full py-3">Sign In</button>
        </div>
        <p className="mt-6 text-center text-sm muted">Don't have an account? <Link to="/signup" className="font-semibold text-primary">Create Account</Link></p>
      </form>
    </Shell>
  )
}

export function NotFound() {
  return (
    <Shell>
      <div className={`${card} text-center`}>
        <div className="mx-auto mb-10 w-56 overflow-hidden rounded-md bg-primary pb-4 shadow-lg">
          <div className="flex gap-1.5 bg-blue-300/40 p-2"><i className="h-2 w-2 rounded-full bg-red-400" /><i className="h-2 w-2 rounded-full bg-yellow-300" /><i className="h-2 w-2 rounded-full bg-green-300" /></div>
          <p className="py-4 text-6xl font-extrabold text-orange-400">404</p>
        </div>
        <h1 className="mb-8 text-2xl font-bold">Looks like you've got lost....</h1>
        <Link to="/" className="btn-primary w-full py-3">Back to Dashboard</Link>
      </div>
    </Shell>
  )
}

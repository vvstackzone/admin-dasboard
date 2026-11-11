import { Bell, Check, ChevronDown, Menu, Moon, Search, Sun, User, KeyRound, Activity, LifeBuoy } from 'lucide-react'
import { useState } from 'react'
import { Popover } from '../ui'
import { useAuth } from '../auth'

type Props = { toggleSidebar: () => void; dark: boolean; toggleDark: () => void }
const langs = [{ n: 'English', f: '/img/flags/gb.svg' }, { n: 'French', f: '/img/flags/fr.svg' }, { n: 'Spanish', f: '/img/flags/es.svg' }]
const Flag = ({ src, name }: { src: string; name: string }) => <img src={src} alt={`${name} flag`} className="h-4 w-6 rounded-[2px] object-cover shadow-sm ring-1 ring-black/10" />
const notes = [
  { t: 'Settings', s: 'Update dashboard', c: 'bg-blue-500' }, { t: 'Event Update', s: 'An event date update again', c: 'bg-green-500' },
  { t: 'Profile', s: 'Update your profile', c: 'bg-purple-500' }, { t: 'Application Error', s: 'Check Your running application', c: 'bg-red-500' },
]

export default function Topbar({ toggleSidebar, dark, toggleDark }: Props) {
  const [lang, setLang] = useState(0)
  const { user, logout } = useAuth()
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-card px-4 dark:border-line-dark dark:bg-card-dark sm:px-6">
      <button aria-label="Toggle menu" onClick={toggleSidebar}><Menu size={22} /></button>
      <div className="relative hidden w-full max-w-sm sm:block">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 muted" />
        <input placeholder="Search" className="h-10 w-full rounded-full border border-line bg-page pl-10 pr-4 text-sm outline-none focus:border-primary dark:border-line-dark dark:bg-page-dark" />
      </div>
      <div className="ml-auto flex items-center gap-3 sm:gap-6">
        <button aria-label="Toggle dark mode" onClick={toggleDark} className="rounded-full p-2 hover:bg-primary/10">{dark ? <Sun size={20} /> : <Moon size={20} />}</button>
        <Popover align="right" trigger={t => (
          <button aria-label="Notifications" onClick={t} className="relative text-primary"><Bell size={22} fill="currentColor" />
            <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">6</span></button>)}>
          {() => (
            <div className="w-64 text-sm">
              <p className="mb-3 text-xs muted">Notification</p>
              {notes.map(n => <div key={n.t} className="mb-3 flex items-center gap-3"><span className={`h-8 w-8 rounded-full ${n.c}`} /><div><p className="font-semibold">{n.t}</p><p className="text-xs muted">{n.s}</p></div></div>)}
              <p className="border-t border-line pt-3 text-center text-xs muted dark:border-line-dark">See all notifications</p>
            </div>)}
        </Popover>
        <Popover align="right" trigger={t => <button onClick={t} className="hidden items-center gap-2 text-sm muted md:flex"><Flag src={langs[lang].f} name={langs[lang].n} />{langs[lang].n}<ChevronDown size={14} /></button>}>
          {close => (
            <div className="w-48 text-sm"><p className="mb-2 text-xs muted">Select Language</p>
              {langs.map((l, i) => <button key={l.n} onClick={() => { setLang(i); close() }} className="flex w-full items-center gap-3 py-2"><Flag src={l.f} name={l.n} />{l.n}{i === lang && <Check size={16} className="ml-auto text-emerald-500" />}</button>)}
            </div>)}
        </Popover>
        <Popover align="right" trigger={t => (
          <button onClick={t} className="flex items-center gap-3 text-left">
            <img src="/img/avatar.jpg" alt="Moni Roy" className="h-10 w-10 rounded-full object-cover" />
            <span className="hidden text-sm leading-tight sm:block"><b>{user?.username ?? 'Moni Roy'}</b><br /><span className="text-xs muted">Admin</span></span>
            <ChevronDown size={16} className="hidden sm:block" /></button>)}>
          {() => (
            <div className="w-44 text-sm">
              {[[User, 'Manage Account'], [KeyRound, 'Change Password'], [Activity, 'Activity log']].map(([I, l]) => {
                const Icon = I as typeof User
                return <p key={l as string} className="flex items-center gap-3 py-2"><Icon size={16} />{l as string}</p>
              })}
              <button onClick={logout} className="flex w-full items-center gap-3 py-2 text-red-500"><LifeBuoy size={16} />Log out</button>
            </div>)}
        </Popover>
      </div>
    </header>
  )
}

import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth'
import { footerNav, mainNav, pagesNav, type NavItem } from '../nav'

function Item({ item, onClick }: { item: NavItem; onClick: () => void }) {
  const { logout } = useAuth()
  return (
    <NavLink to={item.to} end={item.to === '/'} onClick={() => { if (window.innerWidth < 1024) onClick(); if (item.label === 'Logout') logout() }} className="relative block pr-4">
      {({ isActive }) => (
        <>
          {isActive && <span className="absolute left-0 top-0 h-full w-1.5 rounded-r-md bg-primary" />}
          <span className={`ml-4 flex items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold transition-colors ${
            isActive ? 'bg-primary text-white' : 'text-ink hover:bg-primary/10 dark:text-ink-dark'}`}>
            <item.icon size={18} /> {item.label}
          </span>
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar({ open, close }: { open: boolean; close: () => void }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={close} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col overflow-y-auto border-r border-line bg-card transition-transform dark:border-line-dark dark:bg-card-dark ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="py-5 text-center text-2xl font-extrabold text-primary">Dash<span className="text-ink dark:text-ink-dark">Stack</span></div>
        <nav className="flex flex-1 flex-col gap-1 pb-4">
          {mainNav.map(i => <Item key={i.to} item={i} onClick={close} />)}
          <div className="my-3 border-t border-line dark:border-line-dark" />
          <p className="px-8 pb-2 text-xs font-semibold uppercase text-muted dark:text-muted-dark">Pages</p>
          {pagesNav.map(i => <Item key={i.to} item={i} onClick={close} />)}
          <div className="my-3 border-t border-line dark:border-line-dark" />
          {footerNav.map(i => <Item key={i.to} item={i} onClick={close} />)}
        </nav>
      </aside>
    </>
  )
}

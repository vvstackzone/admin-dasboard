import { Navigate, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from './auth'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Favorites from './pages/Favorites'
import Inbox from './pages/Inbox'
import Orders from './pages/Orders'
import Stock, { StockForm } from './pages/Stock'
import Pricing from './pages/Pricing'
import Calendar, { AddEvent } from './pages/Calendar'
import Todo, { AddTodo } from './pages/Todo'
import Contact, { AddContact } from './pages/Contact'
import Invoice from './pages/Invoice'
import UiElements from './pages/UiElements'
import Team, { AddMember } from './pages/Team'
import Table from './pages/Table'
import Settings from './pages/Settings'
import { Login, NotFound, Signup } from './pages/Auth'

function RequireAuth() {
  const { user, loggedIn } = useAuth()
  if (!loggedIn) return <Navigate to={user ? '/login' : '/signup'} replace />
  return <Layout />
}
function GuestOnly({ children }: { children: ReactNode }) {
  const { loggedIn } = useAuth()
  return loggedIn ? <Navigate to="/" replace /> : <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="orders" element={<Orders />} />
        <Route path="stock" element={<Stock />} />
        <Route path="stock/new" element={<StockForm />} />
        <Route path="stock/:id/edit" element={<StockForm />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="calendar/new" element={<AddEvent />} />
        <Route path="todo" element={<Todo />} />
        <Route path="todo/new" element={<AddTodo />} />
        <Route path="contact" element={<Contact />} />
        <Route path="contact/new" element={<AddContact />} />
        <Route path="invoice" element={<Invoice />} />
        <Route path="ui-elements" element={<UiElements />} />
        <Route path="team" element={<Team />} />
        <Route path="team/new" element={<AddMember />} />
        <Route path="table" element={<Table />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="login" element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="signup" element={<GuestOnly><Signup /></GuestOnly>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

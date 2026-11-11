import { LayoutDashboard, LayoutGrid, Heart, MessageSquareText, ListChecks, Table2, Gift, CalendarDays, ClipboardList, Users, Banknote, BarChart3, User, Settings, LogOut, type LucideIcon } from 'lucide-react'

export type NavItem = { label: string; to: string; icon: LucideIcon }
export const mainNav: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Products', to: '/products', icon: LayoutGrid },
  { label: 'Favorites', to: '/favorites', icon: Heart },
  { label: 'Inbox', to: '/inbox', icon: MessageSquareText },
  { label: 'Order Lists', to: '/orders', icon: ListChecks },
  { label: 'Product Stock', to: '/stock', icon: Table2 },
]
export const pagesNav: NavItem[] = [
  { label: 'Pricing', to: '/pricing', icon: Gift },
  { label: 'Calender', to: '/calendar', icon: CalendarDays },
  { label: 'To-Do', to: '/todo', icon: ClipboardList },
  { label: 'Contact', to: '/contact', icon: Users },
  { label: 'Invoice', to: '/invoice', icon: Banknote },
  { label: 'UI Elements', to: '/ui-elements', icon: BarChart3 },
  { label: 'Team', to: '/team', icon: User },
  { label: 'Table', to: '/table', icon: Table2 },
]
export const footerNav: NavItem[] = [
  { label: 'Settings', to: '/settings', icon: Settings },
  { label: 'Logout', to: '/login', icon: LogOut },
]

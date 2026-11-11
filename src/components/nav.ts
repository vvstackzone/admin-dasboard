export interface NavItem { label: string; to: string; icon: string; group: 'main' | 'pages' | 'bottom' }
export const nav: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: '◔', group: 'main' },
  { label: 'Products', to: '/products', icon: '▦', group: 'main' },
  { label: 'Favorites', to: '/favorites', icon: '♡', group: 'main' },
  { label: 'Inbox', to: '/inbox', icon: '✉', group: 'main' },
  { label: 'Order Lists', to: '/order-lists', icon: '☰', group: 'main' },
  { label: 'Product Stock', to: '/product-stock', icon: '▤', group: 'main' },
  { label: 'Pricing', to: '/pricing', icon: '✦', group: 'pages' },
  { label: 'Calender', to: '/calender', icon: '▣', group: 'pages' },
  { label: 'To-Do', to: '/todo', icon: '☑', group: 'pages' },
  { label: 'Contact', to: '/contact', icon: '☏', group: 'pages' },
  { label: 'Invoice', to: '/invoice', icon: '▭', group: 'pages' },
  { label: 'UI Elements', to: '/ui-elements', icon: '▥', group: 'pages' },
  { label: 'Team', to: '/team', icon: '☺', group: 'pages' },
  { label: 'Table', to: '/table', icon: '▦', group: 'pages' },
  { label: 'Settings', to: '/settings', icon: '⚙', group: 'bottom' },
  { label: 'Logout', to: '/logout', icon: '⏻', group: 'bottom' },
]

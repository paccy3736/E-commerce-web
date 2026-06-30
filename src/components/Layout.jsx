import { useQuery } from '@tanstack/react-query'
import { NavLink, Outlet } from 'react-router-dom'
import { DEMO_USER_ID } from '../constants/user'
import { getCart } from '../services/ecommerce'

const navItems = [
  { to: '/', label: 'Shop' },
  { to: '/cart', label: 'Cart', showBadge: true },
  { to: '/orders', label: 'Orders' },
]

function Layout() {
  const { data: cart } = useQuery({
    queryKey: ['cart', DEMO_USER_ID],
    queryFn: () => getCart(DEMO_USER_ID),
  })

  const cartCount = cart?.itemCount ?? cart?.items?.length ?? 0

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">E-comus</p>
            <h1 className="text-xl font-semibold">Modern e-commerce</h1>
          </div>
          <nav className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-violet-600 text-white shadow' : 'text-slate-600 hover:bg-slate-200'
                  }`
                }
              >
                {item.label}
                {item.showBadge && cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout

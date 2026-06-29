import { useQuery } from '@tanstack/react-query'
import { getOrders } from '../api/ecommerce'

const userId = '64b8d3e2f1a9c7b5d6e4f3a2'

function OrdersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['orders', userId],
    queryFn: () => getOrders(userId),
  })

  const orders = data?.data ?? []

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Order history</h2>
      <p className="mt-2 text-sm text-slate-500">Past orders from the live backend are listed here.</p>

      {isLoading && <p className="mt-6 text-sm text-slate-500">Loading orders…</p>}
      {!isLoading && error && <p className="mt-6 text-sm text-rose-600">Orders could not be loaded right now.</p>}
      {!isLoading && !error && orders.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
          No orders yet. Complete a checkout to see your history.
        </div>
      )}

      {!isLoading && !error && orders.length > 0 && (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900">Order #{order.id}</p>
                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">{order.status || 'Processing'}</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">{order.address || 'Shipping address pending'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersPage

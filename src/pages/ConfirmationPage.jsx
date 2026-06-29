import { useLocation, Link } from 'react-router-dom'

function ConfirmationPage() {
  const location = useLocation()
  const order = location.state?.order

  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-emerald-900 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Order confirmed</p>
      <h2 className="mt-3 text-3xl font-semibold">Thanks for your purchase.</h2>
      <p className="mt-3 text-sm text-emerald-800">
        Your order has been submitted successfully. Use the Orders page to review recent purchases.
      </p>
      {order && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-white p-4">
          <p className="text-sm text-slate-500">Order reference</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{order.id || 'Pending confirmation'}</p>
        </div>
      )}
      <div className="mt-6 flex gap-3">
        <Link to="/orders" className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
          View orders
        </Link>
        <Link to="/" className="rounded-full border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100">
          Continue shopping
        </Link>
      </div>
    </div>
  )
}

export default ConfirmationPage

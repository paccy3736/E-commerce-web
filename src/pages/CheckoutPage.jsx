import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { placeOrder } from '../services/ecommerce'

const userId = '64b8d3e2f1a9c7b5d6e4f3a2'

function CheckoutPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ customerName: '', email: '', address: '' })
  const [error, setError] = useState('')

  const checkoutMutation = useMutation({
    mutationFn: placeOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      navigate('/confirmation', { state: { order: data?.data ?? data } })
    },
    onError: () => setError('Checkout failed. Please double-check the details and try again.'),
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.customerName || !form.email || !form.address) {
      setError('Please fill in your full name, email, and shipping address.')
      return
    }

    checkoutMutation.mutate({
      userId,
      items: [],
      customerName: form.customerName,
      email: form.email,
      address: form.address,
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Checkout</h2>
        <p className="mt-2 text-sm text-slate-500">Place your order with the live API and receive a confirmation view.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Full name
            <input value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-violet-500" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-violet-500" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Address
            <textarea value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} rows="4" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-violet-500" />
          </label>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button type="submit" disabled={checkoutMutation.isPending} className="w-full rounded-full bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70">
            {checkoutMutation.isPending ? 'Placing order…' : 'Place order'}
          </button>
        </form>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">What happens next?</h3>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          <li>• The order is submitted to the live backend.</li>
          <li>• A confirmation view is shown immediately after success.</li>
          <li>• You can revisit your orders from the Orders page.</li>
        </ul>
      </div>
    </div>
  )
}

export default CheckoutPage

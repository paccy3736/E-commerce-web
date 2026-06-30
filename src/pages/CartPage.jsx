import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { DEMO_USER_ID } from '../constants/user'
import { useCartNotification } from '../context/CartNotificationContext'
import { getCart, removeCartItem, updateCartItem } from '../services/ecommerce'
import { getProductImageUrl } from '../utils/images'

function CartPage() {
  const queryClient = useQueryClient()
  const { showCartNotification } = useCartNotification()

  const { data: cart, isLoading, error } = useQuery({
    queryKey: ['cart', DEMO_USER_ID],
    queryFn: () => getCart(DEMO_USER_ID),
  })

  const updateMutation = useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      showCartNotification('Cart updated.', 'success')
    },
    onError: () => showCartNotification('Could not update the cart. Please retry.', 'error'),
  })

  const removeMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      showCartNotification('Item removed from cart.', 'info')
    },
    onError: () => showCartNotification('Could not remove the item. Please retry.', 'error'),
  })

  const subtotal = useMemo(
    () =>
      (cart?.items ?? []).reduce(
        (sum, item) => sum + ((item.unitPrice ?? item.price ?? 0) * (item.quantity ?? 0)),
        0,
      ),
    [cart],
  )

  const total = cart?.total ?? subtotal

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity < 1) return
    updateMutation.mutate({ itemId, userId: DEMO_USER_ID, quantity })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Your cart</h2>
            <p className="text-sm text-slate-500">Items persist using the live cart endpoint.</p>
          </div>
          <Link to="/checkout" className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700">
            Checkout
          </Link>
        </div>

        {isLoading && <p className="mt-6 text-sm text-slate-500">Loading cart…</p>}
        {!isLoading && error && (
          <div role="alert" className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Your cart could not be loaded right now.
          </div>
        )}

        {!isLoading && !error && (!cart || !cart.items?.length) && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
            Your cart is empty. Add a product to see it here.
          </div>
        )}

        {!isLoading && !error && cart?.items?.length > 0 && (
          <div className="mt-6 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={getProductImageUrl(item)}
                    alt={item.productName || 'Cart item'}
                    className="h-16 w-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">{item.productName || 'Cart item'}</p>
                    <p className="text-sm text-slate-500">${(item.unitPrice ?? item.price ?? 0).toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)} className="rounded-full border border-slate-300 px-3 py-1 text-sm">−</button>
                  <span className="min-w-8 text-center text-sm font-semibold">{item.quantity || 1}</span>
                  <button type="button" onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)} className="rounded-full border border-slate-300 px-3 py-1 text-sm">+</button>
                  <button type="button" onClick={() => removeMutation.mutate({ itemId: item.id, userId: DEMO_USER_ID })} className="rounded-full bg-rose-500 px-3 py-1 text-sm font-semibold text-white">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Summary</h3>
        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-semibold text-slate-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export default CartPage

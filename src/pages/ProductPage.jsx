import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { DEMO_USER_ID } from '../constants/user'
import { useCartNotification } from '../context/CartNotificationContext'
import { addCartItem, getProductById } from '../services/ecommerce'
import { getProductImageUrl } from '../utils/images'

function ProductPage() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const { showCartNotification } = useCartNotification()

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
  })

  const variantId = product?.variants?.[0]?.id

  const addToCartMutation = useMutation({
    mutationFn: addCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      showCartNotification(`${product?.name || 'Item'} added to your cart.`, 'success')
    },
    onError: () => {
      showCartNotification('Unable to add this item to the cart right now.', 'error')
    },
  })

  const handleAddToCart = () => {
    if (!product || !variantId) {
      showCartNotification('Unable to add this item to the cart right now.', 'error')
      return
    }

    addToCartMutation.mutate({ userId: DEMO_USER_ID, productId: product.id, variantId, quantity: 1 })
  }

  if (isLoading) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-10 text-slate-600">Loading product…</div>
  }

  if (error || !product) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
        This product could not be loaded from the live API. Please return home and try again.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link to="/" className="text-sm font-medium text-violet-600 hover:text-violet-700">
        ← Back to catalog
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <img
            src={getProductImageUrl(product)}
            alt={product.name}
            className="h-72 w-full rounded-3xl object-cover"
          />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">{product.category?.name || 'Featured product'}</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">{product.name}</h2>
          <p className="mt-4 text-slate-600">{product.description || 'A premium product from the live catalog.'}</p>
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span className="text-sm text-slate-500">Price</span>
            <span className="text-2xl font-semibold text-slate-900">${product.price}</span>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending}
            className="mt-6 w-full rounded-full bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {addToCartMutation.isPending ? 'Adding…' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductPage

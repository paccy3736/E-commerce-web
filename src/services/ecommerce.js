import api from './client'
import { withProductImages } from '../utils/images'

function enrichProductsData(data = {}) {
  let source = data

  if (!Array.isArray(source.all) && source.grouped) {
    source = {
      ...source,
      all: Object.values(source.grouped).flat(),
    }
  }

  const all = Array.isArray(source.all) ? source.all.map(withProductImages) : []

  const grouped = source.grouped
    ? Object.fromEntries(
        Object.entries(source.grouped).map(([key, products]) => [
          key,
          Array.isArray(products) ? products.map(withProductImages) : products,
        ]),
      )
    : source.grouped

  return {
    ...source,
    all,
    grouped,
  }
}

export const getProducts = (params = {}) =>
  api.get('/products', { params }).then((res) => {
    const payload = res.data
    const data = enrichProductsData(payload?.data || {})

    return {
      ...payload,
      data,
    }
  })

export const getProductById = (id) =>
  api.get(`/products/${id}`).then((res) => withProductImages(res.data?.data?.product))

export const getCategories = (params = {}) =>
  api.get('/categories', { params }).then((res) => res.data?.data ?? [])

export const getCart = (userId) =>
  api.get('/cart', { params: { userId } }).then((res) => {
    const cart = res.data?.data?.cart
    if (!cart?.items?.length) return cart

    return {
      ...cart,
      items: cart.items.map((item) => withProductImages(item)),
    }
  })

export const addCartItem = ({ userId, productId, variantId, quantity = 1 }) =>
  api.post('/cart/items', { userId, productId, variantId, quantity }).then((res) => res.data)

export const updateCartItem = ({ itemId, userId, quantity }) =>
  api.patch(`/cart/items/${itemId}`, { userId, quantity }).then((res) => res.data)

export const removeCartItem = ({ itemId, userId }) =>
  api.delete(`/cart/items/${itemId}`, { data: { userId } }).then((res) => res.data)

export const placeOrder = ({ userId, items, customerName, email, address }) => {
  const payload = { userId, customerName, email, address }
  if (items?.length) payload.items = items
  return api.post('/orders', payload).then((res) => res.data?.data?.order ?? res.data?.data ?? res.data)
}

export const getOrders = (userId) =>
  api.get('/orders', { params: { userId } }).then((res) => res.data?.data ?? [])

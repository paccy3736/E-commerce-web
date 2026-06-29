import api from './client'

export const getProducts = (params = {}) => api.get('/products', { params }).then((res) => res.data)

export const getProductById = (id) => api.get(`/products/${id}`).then((res) => res.data)

export const getCategories = (params = {}) => api.get('/categories', { params }).then((res) => res.data)

export const getCart = (userId) => api.get('/cart', { params: { userId } }).then((res) => res.data)

export const addCartItem = ({ userId, productId, quantity = 1 }) =>
  api.post('/cart/items', { userId, productId, quantity }).then((res) => res.data)

export const updateCartItem = ({ itemId, userId, quantity }) =>
  api.patch(`/cart/items/${itemId}`, { userId, quantity }).then((res) => res.data)

export const removeCartItem = ({ itemId, userId }) =>
  api.delete(`/cart/items/${itemId}`, { params: { userId } }).then((res) => res.data)

export const placeOrder = ({ userId, items, customerName, email, address }) =>
  api.post('/orders', { userId, items, customerName, email, address }).then((res) => res.data)

export const getOrders = (userId) => api.get('/orders', { params: { userId } }).then((res) => res.data)

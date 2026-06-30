const API_ORIGIN = (
  import.meta.env.VITE_API_BASE_URL || 'https://e-commas-apis-production-e0f8.up.railway.app/api'
).replace(/\/api\/?$/, '')

const DEFAULT_PLACEHOLDER =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'

const CATEGORY_IMAGE_POOLS = {
  clothing: [
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
  ],
  electronics: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80',
  ],
  home: [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
  ],
  beauty: [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
  ],
  sports: [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba7951?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=600&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  ],
}

function hashString(value = '') {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash)
}

function toAbsoluteImageUrl(url) {
  if (!url || typeof url !== 'string') return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/')) return `${API_ORIGIN}${url}`
  return `${API_ORIGIN}/${url}`
}

function extractImageUrl(imageEntry) {
  if (!imageEntry) return null

  if (typeof imageEntry === 'string') return toAbsoluteImageUrl(imageEntry)
  if (typeof imageEntry === 'object') {
    return (
      toAbsoluteImageUrl(imageEntry.url) ||
      toAbsoluteImageUrl(imageEntry.src) ||
      toAbsoluteImageUrl(imageEntry.path)
    )
  }

  return null
}

function getCategoryKey(product) {
  const category = product?.category?.name || product?.category || ''
  return String(category).trim().toLowerCase()
}

function buildFallbackImageUrl(product) {
  const categoryKey = getCategoryKey(product)
  const pool = CATEGORY_IMAGE_POOLS[categoryKey] || CATEGORY_IMAGE_POOLS.default
  const seed = product?.id || product?.productId || product?.name || product?.productName || 'product'
  return pool[hashString(String(seed)) % pool.length] || DEFAULT_PLACEHOLDER
}

function extractImageUrlFromProduct(product) {
  if (!product) return null

  const directFields = [product.image, product.thumbnail, product.imageUrl]
  for (const field of directFields) {
    const url = extractImageUrl(field)
    if (url) return url
  }

  for (const imageEntry of product.images ?? []) {
    const url = extractImageUrl(imageEntry)
    if (url) return url
  }

  const variant = product.variant || product.variants?.[0]
  for (const imageEntry of variant?.images ?? []) {
    const url = extractImageUrl(imageEntry)
    if (url) return url
  }

  return null
}

export function getProductImageUrl(product) {
  if (!product) return DEFAULT_PLACEHOLDER
  return extractImageUrlFromProduct(product) || buildFallbackImageUrl(product)
}

export function withProductImages(product) {
  if (!product) return product

  const resolvedUrl = extractImageUrlFromProduct(product) || buildFallbackImageUrl(product)
  const imageEntry = { url: resolvedUrl }

  const variants = product.variants?.map((variant) => {
    const variantUrl = extractImageUrl(variant?.images?.[0]) || resolvedUrl
    return {
      ...variant,
      images: [{ url: variantUrl }],
    }
  })

  return {
    ...product,
    image: resolvedUrl,
    images: [imageEntry],
    ...(variants ? { variants } : {}),
  }
}

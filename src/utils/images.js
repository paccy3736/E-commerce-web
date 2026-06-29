const PRODUCT_IMAGES = {
  'Sonos Era 300': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
  'DJI Mini 4 Pro': 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80',
  'Dyson V15 Detect': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80',
  'Keychron Q1 Pro': 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80',
  'Kindle Paperwhite': 'https://images.unsplash.com/photo-1592496001020-d31bd830651f?auto=format&fit=crop&w=600&q=80',
  'GoPro HERO12 Black': 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?auto=format&fit=crop&w=600&q=80',
  'LG C3 OLED 55-inch TV': 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80',
  'Apple Watch Series 9': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
  'Logitech MX Master 3S': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
  'Xbox Series X': 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=600&q=80',
  'Sony PlayStation 5': 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80',
  'Dell XPS 13 Plus': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80',
}

const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'

export function getProductImageUrl(product) {
  if (!product) return DEFAULT_PLACEHOLDER
  
  // Check if API actually returned a valid absolute URL first
  if (product.image && product.image.startsWith('http')) return product.image
  if (product.thumbnail && product.thumbnail.startsWith('http')) return product.thumbnail
  if (product.images?.[0]?.url && product.images[0].url.startsWith('http')) return product.images[0].url

  // If not, map by product name or return default placeholder
  const name = product.name || ''
  return PRODUCT_IMAGES[name] || DEFAULT_PLACEHOLDER
}

export const CATEGORY_CONFIG = {
  'Adventure': { emoji: '🏔️', gradient: 'linear-gradient(135deg, #2d6a4f 0%, #74c69d 100%)' },
  'Cultural': { emoji: '🏛️', gradient: 'linear-gradient(135deg, #7b4f12 0%, #e9a825 100%)' },
  'Food & Drink': { emoji: '🍜', gradient: 'linear-gradient(135deg, #c1440e 0%, #f4a261 100%)' },
  'Water Activities': { emoji: '🤿', gradient: 'linear-gradient(135deg, #1B4F72 0%, #5dade2 100%)' },
  'Wildlife': { emoji: '🦁', gradient: 'linear-gradient(135deg, #5d4037 0%, #bcaaa4 100%)' },
  'Wellness': { emoji: '🧘', gradient: 'linear-gradient(135deg, #4a235a 0%, #c39bd3 100%)' },
  'Art & History': { emoji: '🎨', gradient: 'linear-gradient(135deg, #1a237e 0%, #7986cb 100%)' },
  'Nightlife': { emoji: '🌃', gradient: 'linear-gradient(135deg, #0d0d0d 0%, #6c3483 100%)' },
}

export const getCategoryEmoji = (category) => CATEGORY_CONFIG[category]?.emoji ?? '✈️'
export const getCoverGradient = (category) => CATEGORY_CONFIG[category]?.gradient ?? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

export const formatPrice = (price) => {
  if (price === 0) return 'Free'
  return `$${Number(price).toLocaleString()}`
}

export const formatDuration = (hours) => {
  if (hours < 1) return `${hours * 60}min`
  if (hours === 1) return '1 hour'
  if (Number.isInteger(hours)) return `${hours} hours`
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return m ? `${h}h ${m}m` : `${h}h`
}

export const CATEGORIES = Object.keys(CATEGORY_CONFIG)

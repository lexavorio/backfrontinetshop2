import { flattenShopList } from './Flatten.shopList'

export const applyFilters = (shopList, filters) => {
  let result = flattenShopList(shopList)

  const getPrice = p =>
    p.price * (1 - (p.procent || 0) / 100)

  if (filters.priceFrom !== '') {
    result = result.filter(
      p => getPrice(p) >= Number(filters.priceFrom)
    )
  }

  if (filters.priceTo !== '') {
    result = result.filter(
      p => getPrice(p) <= Number(filters.priceTo)
    )
  }

  if (filters.onlyDiscount) {
    result = result.filter(p => p.procent > 0)
  }

  if (filters.minStars) {
    result = result.filter(
      p => p.stars >= filters.minStars
    )
  }

  if (filters.sort === 'priceAsc') {
    result = [...result].sort(
      (a, b) => getPrice(a) - getPrice(b)
    )
  }

  if (filters.sort === 'priceDesc') {
    result = [...result].sort(
      (a, b) => getPrice(b) - getPrice(a)
    )
  }

  return result
}

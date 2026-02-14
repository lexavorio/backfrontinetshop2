export const flattenShopList = (shopList = []) => {
  if (!Array.isArray(shopList) || !shopList.length) return []

  const root = shopList[0]
  const internetShop = root?.['internet-shop']

  if (!internetShop || typeof internetShop !== 'object') return []

  const result = []

  Object.entries(internetShop).forEach(
    ([category, brands]) => {
      if (!brands || typeof brands !== 'object') return

      Object.entries(brands).forEach(
        ([brand, items]) => {
          if (!Array.isArray(items)) return

          items.forEach(item => {
            result.push({
              ...item,
              id: item.id ?? item._id,
              __category: category,
              __brand: brand
            })
          })
        }
      )
    }
  )

  return result
}

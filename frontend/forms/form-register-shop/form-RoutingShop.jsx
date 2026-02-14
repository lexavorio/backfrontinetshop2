import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import styles from './InternetShop.module.css'

export const RoutingInternetShop = ({ searchValue }) => {
  const navigate = useNavigate()

  const { shopList, isLoading, error } = useSelector(
    s => s.shopState
  )

  const internetShop = shopList?.[0]?.['internet-shop']

  const categoryNames = {
    videogames: 'Видеоигры',
    videocards: 'Видеокарты',
    appliances: 'Бытовая техника',
    headphones: 'Наушники'
  }

  const flatProducts = useMemo(() => {
    if (!internetShop) return []

    const result = []

    Object.entries(internetShop).forEach(
      ([category, brands]) => {
        Object.values(brands).forEach(products => {
          products.forEach(p => {
            result.push({ ...p, category })
          })
        })
      }
    )

    return result
  }, [internetShop])

  const searchResults = useMemo(() => {
    if (!searchValue) return []

    const lower = searchValue.toLowerCase()
    return flatProducts.filter(p =>
      p.name.toLowerCase().includes(lower)
    )
  }, [searchValue, flatProducts])

  if (isLoading) return <p className={styles.loading}>Загрузка…</p>
  if (error) return <p className={styles.error}>Ошибка: {error}</p>
  if (!internetShop) return <p>Магазин пуст</p>

  if (searchValue) {
    return (
      <div className={styles.block}>
        <h3>🔍 Результаты поиска</h3>
        <ul className={styles.grid}>
          {searchResults.map(item => {
            const finalPrice = item.discount
              ? Math.round(item.price * (1 - item.procent / 100))
              : item.price

            return (
              <li
                key={item.id}
                className={styles.card}
                onClick={() =>
                  navigate(`/shop/product/${item.id}`)
                }
              >
                <h4>{item.name}</h4>
                {item.discount && (
                  <span className={styles.oldPrice}>
                    {item.price} ₽
                  </span>
                )}
                <span className={styles.price}>
                  {finalPrice} ₽
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <div className={styles.block}>
      <h3>Категории</h3>
      <div className={styles.grid}>
        {Object.keys(internetShop).map(cat => (
          <button
            key={cat}
            className={styles.categoryBtn}
            onClick={() =>
              navigate(`/shop/category/${cat}`)
            }
          >
            {categoryNames[cat] || cat}
          </button>
        ))}
      </div>
    </div>
  )
}

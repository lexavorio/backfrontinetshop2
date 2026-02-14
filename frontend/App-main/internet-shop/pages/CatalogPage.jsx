import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Pages.module.scss'
import { applyFilters } from '../../../forms/details-shop/applyFilters'

export const CatalogPage = () => {
  const navigate = useNavigate()

  const shopList = useSelector(s => s.shopState.shopList)
  const filters = useSelector(s => s.filters)

  const filtered = useMemo(
    () => applyFilters(shopList, filters),
    [shopList, filters]
  )

  return (
  <div className={styles.page}>
    <h2>Каталог</h2>

    {filtered.length ? (
      filtered.map(p => (
        <div
          key={p.id}
          className={styles.cartItem}
          onClick={() => navigate(`/shop/product/${p.id}`)}
        >
          <span>{p.name}</span>
          <span className={styles.price}>{p.price} ₽</span>
          <span>⭐ {p.stars}</span>
        </div>
      ))
    ) : (
      <p className={styles.empty}>Ничего не найдено</p>
    )}
  </div>
)

}

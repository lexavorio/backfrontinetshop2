import { useDispatch, useSelector } from 'react-redux'
import { setFilters, resetFilters } from '../../../actions'
import styles from './Pages.module.scss'
import { useNavigate } from 'react-router-dom'

export const FilterPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const filters = useSelector(s => s.filters)

  return (
    <div className={`${styles.page} ${styles.filterPage}`}>
      <h2>Фильтр товаров</h2>

      <div className={styles.filterGroup}>
        <input
          type="number"
          placeholder="Цена от"
          value={filters.priceFrom}
          onChange={e =>
            dispatch(setFilters({ priceFrom: e.target.value }))
          }
        />

        <input
          type="number"
          placeholder="Цена до"
          value={filters.priceTo}
          onChange={e =>
            dispatch(setFilters({ priceTo: e.target.value }))
          }
        />
      </div>

      <select
        value={filters.minStars}
        onChange={e =>
          dispatch(setFilters({ minStars: Number(e.target.value) }))
        }
      >
        <option value={0}>Любой рейтинг</option>
        <option value={3}>3+</option>
        <option value={5}>5+</option>
        <option value={7}>7+</option>
      </select>

      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={filters.onlyDiscount}
          onChange={e =>
            dispatch(setFilters({ onlyDiscount: e.target.checked }))
          }
        />
        Только со скидкой
      </label>

      <select
        value={filters.sort || ''}
        onChange={e =>
          dispatch(setFilters({ sort: e.target.value }))
        }
      >
        <option value="">Без сортировки</option>
        <option value="priceAsc">Цена ↑</option>
        <option value="priceDesc">Цена ↓</option>
      </select>

      <div className={styles.actions}>
        <button
          className={styles.primaryBtn}
          onClick={() => navigate('/shop/results')}
        >
          Применить
        </button>

        <button
          className={styles.outlineBtn}
          onClick={() => dispatch(resetFilters())}
        >
          Сброс
        </button>
      </div>
    </div>
  )
}

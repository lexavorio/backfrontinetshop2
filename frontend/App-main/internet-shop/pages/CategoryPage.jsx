import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import styles from './Pages.module.scss'

export const CategoryPage = () => {
  const { category, brand } = useParams()
  const navigate = useNavigate()

  const internetShop = useSelector(
    s => s.shopState.shopList?.[0]?.['internet-shop']
  )

  if (!internetShop || !internetShop[category]) {
    return <p>Категория не найдена</p>
  }

  const categoryData = internetShop[category]

  if (!brand) {
    return (
      <>
        <button onClick={() => navigate(-1)}>← Назад</button>
        <h3>{category}</h3>

        <div className={styles.grid}>
          {Object.keys(categoryData).map(b => (
            <button
              key={b}
              className={styles.categoryBtn}
              onClick={() =>
                navigate(`/shop/category/${category}/${b}`)
              }
            >
              {b}
            </button>
          ))}
        </div>
      </>
    )
  }

  const items = categoryData[brand]
  if (!Array.isArray(items)) {
    return <p>Бренд не найден</p>
  }

  return (
    <>
      <button onClick={() => navigate(-1)}>← Назад</button>
      <h3 className={styles.brand}>{brand}</h3>

      <div className={styles.grid}>
        {items.map(item => {
          const finalPrice = item.discount
            ? Math.round(
                item.price * (1 - item.procent / 100)
              )
            : item.price

          return (
            <button
              key={item.id}
              className={styles.card}
              onClick={() =>
                navigate(`/shop/product/${item.id}`)
              }
            >
              <h4>{item.name}</h4>

              {item.discount && (
                <div className={styles.priceSteam}>
                                  <div className={styles.discountPercent}>
                                    −{item.procent}%
                                  </div>
                
                                  <div className={styles.priceBlock}>
                                    <span className={styles.oldPrice}>
                                      {item.price} ₽
                                    </span>
                                    <span className={styles.newPrice}>
                                      {finalPrice} ₽
                                    </span>
                                  </div>
                                </div>
              )}

                {!item.discount && (
                  <div>
                  <span className={styles.price}>
                  {item.price} ₽
                </span>
              </div>
                )}
            </button>
          )
        })}
      </div>
    </>
  )
}

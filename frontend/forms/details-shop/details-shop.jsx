import styles from './Details.module.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../components'
import { useDispatch } from 'react-redux'
import { toggleFavorite, syncCart } from '../../actions'
import { isBanned } from '../../App-main/internet-shop/profile/others/punishment'

export const DetailsShop = ({ product }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuth } = useAuth()

  if (!product) return null

  const banned = isBanned(user)

  const cart = Array.isArray(user?.cart) ? user.cart : []
  const favorites = Array.isArray(user?.favorites)
    ? user.favorites
    : []

  const inCart = cart.some(i => i.id === product.id)
  const inFav = favorites.some(i => i.id === product.id)
  const isOut = product.amount === 0

  const price = product.discount
    ? Math.round(
        product.price * (1 - product.procent / 100)
      )
    : product.price

  const addToCart = () => {
    if (!user || banned || inCart) return

    dispatch(
      syncCart([
        ...cart,
        { ...product, count: 1 }
      ])
    )
  }

  const toggleFav = () => {
    if (!user) return
    dispatch(toggleFavorite(product))
  }

  return (
    <div className={styles.productDetail}>
      <button
      className={styles.backButtonSmall} 
      onClick={() => navigate(-1)}>
        ← Назад
      </button>

      <h2>{product.name}</h2>

      {product.img && (
        <img
          src={product.img}
          alt={product.name}
          className={styles.image}
           width="300"
          height="200"
        />
      )}

      <div className={styles.stars}>Рейтинг: {product.stars}/10</div>

      <div className={styles.priceBlock}>
        {product.discount && (
          <span className={styles.oldPrice}>
            {product.price} ₽
          </span>
        )}
        <span className={styles.price}>
          {price} ₽
        </span>
      </div>

      <p className={styles.description}>
        {product.title}
      </p>

      {isAuth ? (
        <div className={styles.actions}>
          <button
          className={styles.primary}
            disabled={isOut || inCart || banned}
            onClick={addToCart}
          >
            {banned
              ? '⛔ Забанены'
              : inCart
              ? 'В корзине'
              : product.amount === 0 
              ? 'Нет товара на складе'
              : 'В корзину'}
          </button>

          <button
          className={`${styles.heartButton} ${styles.secondary}`}
           onClick={toggleFav}
           >
            {inFav ? '❤️' : '🤍'}
          </button>
        </div>
      ) : (
        <p className={styles.login}>Войдите, чтобы купить</p>
      )}
    </div>
  )
}

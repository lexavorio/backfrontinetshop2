import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../../../components'
import {
  incrementCart,
  decrementCart,
  removeFromCart
} from '../../../actions'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '../../../components/components-internetShop/axios-shopUser'
import styles from './Pages.module.scss'
import {
  isBanned,
  getRemainingDays
} from '../profile/others/punishment'

export const ProfilePage = () => {
  const { isAuth, logout } = useAuth()
  const user = useSelector(s => s.authUserShopState.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const shopList = useSelector(s => s.shopState.shopList)

  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (!isAuth) navigate('/')
  }, [isAuth, navigate])

  useEffect(() => {
    if (!isAuth) return

    api.get('/orders/my')
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]))
  }, [isAuth])

  if (!user) return <p>Загрузка...</p>

  const banned = isBanned(user)
  const banDays = getRemainingDays(user.banUntil)

  const cart = Array.isArray(user.cart) ? user.cart : []
  const favorites = Array.isArray(user.favorites)
    ? user.favorites
    : []

  const getStock = id => {
    const all = Object.values(shopList?.[0] || {}).flatMap(
      group =>
        Array.isArray(group)
          ? group
          : Object.values(group).flat()
    )
    return all.find(p => p.id === id)?.amount ?? 0
  }

  const totalCart = cart.reduce(
    (sum, i) =>
      sum +
      i.price *
        (1 - (i.procent || 0) / 100) *
        i.count,
    0
  )

  const getDiscountPrice = item =>
    Math.round(
      item.price * (1 - (item.procent || 0) / 100)
    )

  return (
    <div className={styles.profile}>

      <h2 className={styles.userName}>
        {user.firstName || user.login}
      </h2>

      {banned && (
        <div className={styles.banBox}>
          <strong>⛔ Вы забанены</strong>
          <div>{user.banBy && <>Кем: {user.banBy}</>}</div>
          <div>
            {user.banUntil === 'permanent'
              ? 'Срок: навсегда'
              : `Осталось: ${banDays} дней`}
          </div>
          <div>
            Причина: {user.banReason || 'не указана'}
          </div>
        </div>
      )}

      <section className={styles.section}>
        <h3>🛒 Корзина</h3>

        {cart.length ? (
          <>
            {cart.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <span
                  className={styles.itemLink}
                  onClick={() =>
                    navigate(`/shop/product/${item.id}`)
                  }
                >
                  {item.name}
                </span>

                <div className={styles.counter}>
                  <button
                    className={styles.counterBtn}
                    onClick={() =>
                      dispatch(decrementCart(item.id))
                    }
                    disabled={item.count <= 1}
                  >
                    −
                  </button>

                  <span className={styles.count}>
                    {item.count}
                  </span>

                  <button
                    className={styles.counterBtn}
                    onClick={() =>
                      dispatch(incrementCart(item.id))
                    }
                  >
                    +
                  </button>
                </div>

                <span className={styles.price}>
                  {getDiscountPrice(item) *
                    item.count}{' '}
                  ₽
                </span>

                <button
                  className={styles.removeBtn}
                  onClick={() =>
                    dispatch(removeFromCart(item.id))
                  }
                >
                  ✕
                </button>
              </div>
            ))}

            <div className={styles.total}>
              Итого: {Math.round(totalCart)} ₽
            </div>

            <button
              className={styles.buyBtn}
              disabled={banned}
              onClick={() => navigate('/shop/order')}
            >
              {banned
                ? '⛔ Покупка запрещена'
                : 'Купить'}
            </button>
          </>
        ) : (
          <p className={styles.empty}>Корзина пуста</p>
        )}
      </section>

      <section className={styles.section}>
        <h3>📦 История покупок</h3>

        {orders.length ? (
          orders.map(order => (
            <div key={order._id} className={styles.order}>
              <div className={styles.orderDate}>
                🕒{' '}
                {new Date(
                  order.createdAt
                ).toLocaleString()}
              </div>

              {order.items.map(item => {
                const priceWithDiscount =
                  item.price *
                  (1 - (item.procent || 0) / 100)

                return (
                  <div
                    key={item.id}
                    className={styles.orderItem}
                    onClick={() =>
                      navigate(
                        `/shop/product/${item.id}`
                      )
                    }
                  >
                    <span>{item.name}</span>
                    <span>
                      {item.count} ×{' '}
                      {Math.round(priceWithDiscount)} ₽
                    </span>
                  </div>
                )
              })}

              <div className={styles.orderTotal}>
                Итого:{' '}
                {Math.round(
                  order.items.reduce(
                    (sum, i) =>
                      sum +
                      i.price *
                        (1 -
                          (i.procent || 0) /
                            100) *
                        i.count,
                    0
                  )
                )}{' '}
                ₽
              </div>
            </div>
          ))
        ) : (
          <p className={styles.empty}>
            История покупок пока пуста
          </p>
        )}
      </section>

      <section className={styles.section}>
        <h3>❤️ Избранное</h3>

        {favorites.length ? (
          favorites.map(item => (
            <div
              key={item.id}
              className={styles.favoriteItem}
              onClick={() =>
                navigate(`/shop/product/${item.id}`)
              }
            >
              {item.name}
            </div>
          ))
        ) : (
          <p className={styles.empty}>Пусто</p>
        )}
      </section>

      <button
        className={styles.logout}
        onClick={logout}
      >
        Выйти
      </button>
    </div>
  )
}

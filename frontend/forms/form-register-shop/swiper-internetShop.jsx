import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../../components'
import { toggleFavorite, syncCart } from '../../actions'
import styles from './InternetShop.module.css'
import { isBanned } from '../../App-main/internet-shop/profile/others/punishment'

export const SwiperInternetShop = ({ onSelectProduct }) => {
  const dispatch = useDispatch()
  const { user, isAuth } = useAuth()

  const { shopList, isLoading, error } = useSelector(
    state => state.shopState
  )

  const banned = isBanned(user)


  const flatProducts = useMemo(() => {
    if (!shopList.length) return []

    const internetShop = shopList[0]['internet-shop']
    if (!internetShop) return []

    const result = []

    Object.entries(internetShop).forEach(
      ([category, brands]) => {
        Object.values(brands).forEach(products => {
          products.forEach(p => {
            result.push({
              ...p,
              id: p.id ?? p._id,
              category
            })
          })
        })
      }
    )

    return result
  }, [shopList])

  const discountItems = useMemo(
    () => flatProducts.filter(p => p.discount && p.procent),
    [flatProducts]
  )

  const addToCart = item => {
    if (!user || banned) return

    const cart = Array.isArray(user.cart) ? user.cart : []

    const exists = cart.some(i => i.id === item.id)
    if (exists) return

    dispatch(syncCart([...cart, { ...item, count: 1 }]))
  }

  if (isLoading) return <div>Загрузка…</div>
  if (error) return <div>Ошибка: {error}</div>
  if (!discountItems.length) return null

  return (
    <div className={styles.swiperWrapper}>
      <div className="swiper-button-prev" />
      <div className="swiper-button-next" />

      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }}
        spaceBetween={20}
        slidesPerView={3}
      >
        {discountItems.map(item => {
          const cart = Array.isArray(user?.cart)
            ? user.cart
            : []

          const favorites = Array.isArray(user?.favorites)
            ? user.favorites
            : []

          const inCart = cart.some(i => i.id === item.id)
          const inFav = favorites.some(i => i.id === item.id)

          const finalPrice = Math.round(
            item.price * (1 - item.procent / 100)
          )

          return (
            <SwiperSlide key={item.id}>
              <div
                className={styles.card}
                onClick={() =>
                  onSelectProduct(item)
                }
              >
                {isAuth && (
                  <div
                    className={styles.cardActions}
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      className={styles.iconBtn}
                      title={
                        banned ? 'Вы забанены' : 'В корзину'
                      }
                      disabled={banned || inCart}
                      onClick={() => addToCart(item)}
                    >
                      {inCart ? '✅' : '🛒'}
                    </button>

                    <button
                      className={styles.iconBtn}
                      title="В избранное"
                      onClick={() =>
                        dispatch(toggleFavorite(item))
                      }
                    >
                      {inFav ? '❤️' : '🤍'}
                    </button>
                  </div>
                )}

                {item.img && (
                  <img
                    src={item.img}
                    alt={item.name}
                    className={styles.image}
                  />
                )}

                <h3 className={styles.title}>{item.name}</h3>

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
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

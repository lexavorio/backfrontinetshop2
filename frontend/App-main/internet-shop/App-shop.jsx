import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { BanBanner } from '../../actions'
import { useDispatch } from 'react-redux'
import { getProducts, getMe, useAuth } from '../../components'
import '../../scss/global.scss'
import '../../scss/theme.scss'
import { ThemeToggle } from '../../forms/details-shop'
import {
  SearchInternetShop,
  SwiperInternetShop,
  RoutingInternetShop
} from '../../forms'
import styles from './App-shop.module.css'

export const AppInternetShop = () => {
  const [search, setSearch] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuth } = useAuth()

  useEffect(() => {
    dispatch(getProducts())
    dispatch(getMe())
  }, [dispatch])

  const isShopHome = location.pathname === '/shop'

  return (
    <div className={styles.appShop}>

      <header className={styles.topBar}>
        
        <div
          className={styles.logo}
          onClick={() => navigate('/shop')}
        >
          🛒 Internet Shop
        </div>

        <SearchInternetShop onChange={setSearch} />

        <button
          className={styles.filterBtn}
          onClick={() => navigate('/shop/filter')}
        >
          ⚙ Фильтр
        </button>
        
        <div className={styles.actions}>
          {!isAuth && (
            <>
              <button
                className={styles.topBtn}
                onClick={() => navigate('/shop/login')}
              >
                Войти
              </button>

              <button
                className={styles.topBtnOutline}
                onClick={() => navigate('/shop/register')}
              >
                Регистрация
              </button>
            </>
          )}

          {isAuth && (
            <>
              <button
                className={styles.profileBtn}
                onClick={() => navigate('/shop/profile')}
              >
                👤 {user.firstName}
              </button>

              {user.role === 'admin' && (
                <button
                  className={styles.roleBtn}
                  onClick={() => navigate('/shop/admin')}
                  title="Admin panel"
                >
                  🛡
                </button>
              )}

              {user.role === 'developer' && (
                <button
                  className={styles.roleBtn}
                  onClick={() => navigate('/shop/dev')}
                  title="Developer panel"
                >
                  🛠
                </button>
              )}
            </>
          )}
          {isAuth && (
            <div className={styles.actions}>
              <ThemeToggle />
            </div>)}
        </div>
      </header>

      {isShopHome ? (
        <>
          <SwiperInternetShop
            onSelectProduct={p =>
              navigate(`/shop/product/${p.id}`)
            }
          />
          <RoutingInternetShop searchValue={search} />
        </>
      ) : (
        <Outlet />
      )}

      <BanBanner />
    </div>
  )
}

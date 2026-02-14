import { useDispatch, useSelector } from 'react-redux'
import { authLogin, authLogout } from '../../actions'
import { getMe } from './axios-get-internetShop'
import { useEffect } from 'react'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, isAuth, isLoading } = useSelector(
    state => state.authUserShopState
  )

  useEffect(() => {
    if (isAuth) return
  if (!isLoading) return

  const saved = localStorage.getItem('authUser')

  if (saved) {
    dispatch(getMe())
  } else {
    dispatch({ type: 'AUTH_ME_FAIL' })
  }
  }, [dispatch, isAuth, isLoading])

  const login = (userData, remember) => {
    dispatch(authLogin(userData))

    const storage = remember ? localStorage : sessionStorage
    const other = remember ? sessionStorage : localStorage

    storage.setItem('authUser', JSON.stringify(userData))
    other.removeItem('authUser')
  }

  const logout = () => {
  dispatch(authLogout())

  localStorage.removeItem('authUser')
  sessionStorage.removeItem('authUser')

  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
}

  useEffect(() => {
    if (!user?.banUntil || user.banUntil === 'permanent') return

    if (Date.now() > user.banUntil) {
      const updatedUser = {
        ...user,
        banUntil: null,
        banReason: null,
        banBy: null
      }

      dispatch({
        type: 'AUTH_UPDATE_USER',
        payload: updatedUser
      })

      if (localStorage.getItem('authUser')) {
        localStorage.setItem(
          'authUser',
          JSON.stringify(updatedUser)
        )
      } else {
        sessionStorage.setItem(
          'authUser',
          JSON.stringify(updatedUser)
        )
      }
    }
  }, [user, dispatch])

  return { user, isAuth, login, logout }
}

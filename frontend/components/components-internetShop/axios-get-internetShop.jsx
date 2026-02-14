

import { api } from './axios-shopUser'


export const getMe = () => async dispatch => {
  const token = localStorage.getItem('token')
  if (!token) {
    dispatch({ type: 'AUTH_LOGOUT' })
    return
  }

  try {
    const res = await api.get('/users/me')

    const user = {
      ...res.data,
      id: res.data._id,          
      cart: res.data.cart || [],
      favorites: res.data.favorites || []
    }

    dispatch({
      type: 'AUTH_LOGIN',
      payload: user
    })
  } catch {

    dispatch({ type: 'AUTH_ME_FAIL' })
  }
}

export const getProducts = () => async dispatch => {
  dispatch({ type: 'SHOP_REQUEST' })

  try {
    const res = await api.get('/products')
    dispatch({
      type: 'SHOP_SUCCESS',
      payload: res.data 
    })

  } catch (e) {
    dispatch({
      type: 'SHOP_FAILURE',
      payload: e.message
    })
  }
}

export const loginUser = data => async dispatch => {
  dispatch({ type: 'SHOP_REQUEST' })

  try {
    const res = await api.post('/auth/login', data)

    localStorage.setItem('token', res.data.token)

    dispatch(getMe(), {
      type: 'AUTH_LOGIN',
      payload: res.data.user
    })
  } catch (e) {
    dispatch({
      type: 'SHOP_FAILURE',
      payload: e.response?.data?.message
    })
  }
}

export const registerUser = data => async dispatch => {
  dispatch({ type: 'SHOP_REQUEST' })

  try {
    const res = await api.post('/auth/register', data)

    localStorage.setItem('token', res.data.token)

    dispatch(getMe(),{
      type: 'AUTH_LOGIN',
      payload: res.data.user
    })
  } catch (e) {
    dispatch({
      type: 'SHOP_FAILURE',
      payload: e.response?.data?.message
    })
  }
}

import { api } from '../../components/components-internetShop/axios-shopUser'

const syncStorageUser = user => {
  if (localStorage.getItem('authUser')) {
    localStorage.setItem('authUser', JSON.stringify(user))
  } else if (sessionStorage.getItem('authUser')) {
    sessionStorage.setItem('authUser', JSON.stringify(user))
  }
}

export const syncCart =
  cart =>
  async dispatch => {
    try {
      const res = await api.put('/users/cart', { cart })

      dispatch({
        type: 'AUTH_UPDATE_USER',
        payload: res.data
      })

      syncStorageUser(res.data)
    } catch (e) {
      console.error('SYNC CART ERROR', e)
    }
  }


export const incrementCart =
  productId =>
  (dispatch, getState) => {
    const state = getState()

    const user = state.authUserShopState.user
    const cart = Array.isArray(user.cart) ? user.cart : []

    const shop = state.shopState.shopList?.[0]?.['internet-shop']
    if (!shop) return
    console.log(shop)

    const allProducts = Object.values(shop).flatMap(
      brands =>
        Object.values(brands).flat()
    )

    const stock =
      allProducts.find(p => p.id === productId)?.amount

    if (typeof stock !== 'number') return

    dispatch(
      syncCart(
        cart.map(item => {
          if (item.id !== productId) return item
          if (item.count >= stock) return item 
          return {
            ...item,
            count: item.count + 1
          }
        })
      )
    )
  }




export const decrementCart =
  productId =>
  (dispatch, getState) => {
    const { user } = getState().authUserShopState
    const cart = Array.isArray(user.cart) ? user.cart : []

    dispatch(
      syncCart(
        cart
          .map(item =>
            item.id === productId
              ? { ...item, count: item.count - 1 }
              : item
          )
          .filter(item => item.count > 0)
      )
    )
  }



export const removeFromCart =
  productId =>
  (dispatch, getState) => {
    const { user } = getState().authUserShopState
    const cart = Array.isArray(user.cart) ? user.cart : []

    dispatch(
      syncCart(cart.filter(i => i.id !== productId))
    )
  }

export const toggleFavorite =
  product =>
  async dispatch => {
    try {
      const res = await api.put('/users/favorites', {
        product
      })

      dispatch({
        type: 'AUTH_UPDATE_USER',
        payload: res.data
      })

      syncStorageUser(res.data)
    } catch (e) {
      console.error('FAVORITE ERROR', e)
    }
  }



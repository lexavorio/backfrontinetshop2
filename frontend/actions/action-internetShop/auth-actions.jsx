export const authLogin = (user) => ({
  type: 'AUTH_LOGIN',
  payload: user
})

export const authLogout = () => ({
  type: 'AUTH_LOGOUT'
})


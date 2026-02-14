const initialState = {
  shopList: [],
  filteredList: [],
  isLoading: false,
  error: null,
  filter: {
    category: null,
    search: ''
  }
}

const initialAuthState = {
  user: null,
  isAuth: false,
  usersList: [],
  isLoading: true
}

const initialFilters = {
  priceFrom: '',
  priceTo: '',
  minStars: 0,
  onlyDiscount: false,
  sort: null
}

export const filtersReducer = (state = initialFilters, action) => {
  switch (action.type) {
    case 'SET_FILTERS':
      return {
        ...state,
        ...action.payload
      }

    case 'RESET_FILTERS':
      return initialFilters

    default:
      return state
  }
}

export const authUserShopReducer = (state = initialAuthState, action) => {
  switch (action.type) {

    case 'AUTH_LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuth: true,
        isLoading: false
      }

    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuth: false,
        usersList: [],
        isLoading: false
      }

    case 'USERS_LIST_LOADED':
      return {
        ...state,
        usersList: action.payload,
         isLoading: false
      }

    case 'USER_ROLE_UPDATED':
      return {
        ...state,
        usersList: state.usersList.map(u =>
          u.id === action.payload.id
            ? { ...u, role: action.payload.role }
            : u
        )
      }

    case 'AUTH_UPDATE_USER':
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      }
      case 'AUTH_ME_FAIL':
      return {
        ...state,
        isLoading: false
      }

    default:
      return state
  }
}


export const shopReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOP_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null
      }

    case 'SHOP_SUCCESS':
      return {
        ...state,
        shopList: action.payload,
        filteredList: action.payload,
        isLoading: false
      }

    case 'SHOP_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    /* ===== ФИЛЬТРЫ ===== */

    case 'SHOP_SET_CATEGORY': {
      const filtered = action.payload
        ? state.shopList.filter(
            p => p.category === action.payload
          )
        : state.shopList

      return {
        ...state,
        filter: {
          ...state.filter,
          category: action.payload
        },
        filteredList: filtered
      }
    }

    case 'SHOP_SET_SEARCH': {
      const value = action.payload.toLowerCase()

      const filtered = state.shopList.filter(p =>
        p.name.toLowerCase().includes(value)
      )

      return {
        ...state,
        filter: {
          ...state.filter,
          search: action.payload
        },
        filteredList: filtered
      }
    }

    default:
      return state
  }
}

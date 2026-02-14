import { createStore, applyMiddleware, combineReducers } from 'redux'
import { 
    reducerTodos, 
    reducerTic, 
    shopReducer, 
    authUserShopReducer,
    filtersReducer
} from './reducers'
import { thunk } from 'redux-thunk'

const reducer = combineReducers({
    todosState: reducerTodos,
    ticState: reducerTic,
    authUserShopState: authUserShopReducer,
  shopState: shopReducer,
  filters: filtersReducer
})

export const store = createStore(reducer, applyMiddleware(thunk))
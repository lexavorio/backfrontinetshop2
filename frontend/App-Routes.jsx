import { Routes, Route } from 'react-router-dom'
import { App } from './App.jsx'
import { AppTodos, AppTic, AppCalc, AppInternetShop } from './App-main/index.js'
import { RoutingInternetShop } from './forms/index.js'
import { RequireRole } from './forms/roles-userShop/RequireRole.jsx'
import { AdminPanel, DevPanel } from './forms/roles-userShop/panels/index.js'
import {
  ProductPage,
  CategoryPage,
  FilterPage,
  ProfilePage,
  ResultsPage,
  OrderPage
} from './App-main/internet-shop/pages/index.js'
import { FormRegisterShop } from './forms/index.js'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={null} />

        <Route path="calculator" element={<AppCalc />} />
        <Route path="todos" element={<AppTodos />} />
        <Route path="tic" element={<AppTic />} />


        <Route path="shop" element={<AppInternetShop />}>
          <Route index element={<RoutingInternetShop />} />

          <Route path="login" element={<FormRegisterShop mode="login" />} />
          <Route path="register" element={<FormRegisterShop mode="register" />} />

          <Route path="filter" element={<FilterPage />} />
          <Route path="results" element={<ResultsPage />} />

          <Route path="profile" element={<ProfilePage />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="order" element={<OrderPage />} />

          <Route
            path="admin"
            element={
              <RequireRole allow={['admin', 'developer']}>
                <AdminPanel />
              </RequireRole>
            }
          />

          <Route
            path="dev"
            element={
              <RequireRole allow={['developer']}>
                <DevPanel />
              </RequireRole>
            }
          />

          <Route
            path="category/:category/:brand?/:model?"
            element={<CategoryPage />}
          />
        </Route>
      </Route>
    </Routes>
  )
}

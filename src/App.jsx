import { Routes, Route } from 'react-router-dom'

import DashboardLayout from './layout/DashboardLayout'

import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Products from './pages/Products'
import Slides from './pages/Slides'
import Offers from './pages/Offers'
import Services from './pages/Services'
import Videos from './pages/Videos'
import Orders from './pages/Orders'
import Company from './pages/Company'

export default function App() {

  return (

    <Routes>

      {/* WEBSITE */}

      <Route
        path="/home"
        element={<Home />}
      />

      {/* DASHBOARD */}

      <Route
        path="/"
        element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        }
      />

      <Route
        path="/products"
        element={
          <DashboardLayout>
            <Products />
          </DashboardLayout>
        }
      />

      <Route
        path="/slides"
        element={
          <DashboardLayout>
            <Slides />
          </DashboardLayout>
        }
      />

      <Route
        path="/offers"
        element={
          <DashboardLayout>
            <Offers />
          </DashboardLayout>
        }
      />

      <Route
        path="/services"
        element={
          <DashboardLayout>
            <Services />
          </DashboardLayout>
        }
      />

      <Route
        path="/videos"
        element={
          <DashboardLayout>
            <Videos />
          </DashboardLayout>
        }
      />

      <Route
        path="/orders"
        element={
          <DashboardLayout>
            <Orders />
          </DashboardLayout>
        }
      />

      <Route
        path="/company"
        element={
          <DashboardLayout>
            <Company />
          </DashboardLayout>
        }
      />

    </Routes>

  )

}
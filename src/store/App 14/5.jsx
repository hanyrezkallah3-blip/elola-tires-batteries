import { Routes, Route } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Slides from './pages/Slides'
import Products from './pages/Products'
import Videos from './pages/Videos'
import Offers from './pages/Offers'
import Services from './pages/Services'
import Warehouses from './pages/Warehouses'
import Counters from './pages/Counters'
import Mappage from './pages/Mappage'

import DashboardLayout from './layout/DashboardLayout'

export default function App() {

  return (

    <DashboardLayout>

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/slides"
          element={<Slides />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/videos"
          element={<Videos />}
        />

        <Route
          path="/offers"
          element={<Offers />}
        />

        <Route
          path="/services"
          element={<Services />}
        />

        <Route
          path="/warehouses"
          element={<Warehouses />}
        />

        <Route
          path="/counters"
          element={<Counters />}
        />

        <Route
          path="/map"
          element={<Mappage />}
        />

      </Routes>

    </DashboardLayout>

  )

}
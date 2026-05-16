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
import Login from './pages/Login'

// 🔓 تعطيل الحماية مؤقتاً
function ProtectedRoute({ children }) {

  return children

}

export default function App() {

  return (

    <Routes>

      {/* LOGIN */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* WEBSITE */}

      <Route
        path="/home"
        element={<Home />}
      />

      {/* DASHBOARD */}

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Products />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/slides"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Slides />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/offers"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Offers />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/services"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Services />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/videos"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Videos />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Orders />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/company"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Company />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

    </Routes>

  )

}
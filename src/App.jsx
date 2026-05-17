import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

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
import Admin from './pages/Admin'

// ================= PROTECTED ROUTE =================

function ProtectedRoute({ children }) {

  // 🔓 الحماية معطلة مؤقتاً

  const isLoggedIn = true

  return isLoggedIn

    ? children

    : <Navigate to="/login" replace />

}

// ================= DASHBOARD WRAPPER =================

function DashboardPage({ children }) {

  return (

    <ProtectedRoute>

      <DashboardLayout>

        {children}

      </DashboardLayout>

    </ProtectedRoute>

  )

}

export default function App() {

  return (

    <div className="bg-black min-h-screen">

      <Routes>

        {/* ================= LOGIN ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ================= WEBSITE ================= */}

        <Route
          path="/home"
          element={<Home />}
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/"
          element={
            <DashboardPage>
              <Admin />
            </DashboardPage>
          }
        />

        <Route
          path="/admin"
          element={
            <DashboardPage>
              <Admin />
            </DashboardPage>
          }
        />

        {/* ================= DASHBOARD ================= */}

        <Route
          path="/dashboard"
          element={
            <DashboardPage>
              <Dashboard />
            </DashboardPage>
          }
        />

        {/* ================= PRODUCTS ================= */}

        <Route
          path="/products"
          element={
            <DashboardPage>
              <Products />
            </DashboardPage>
          }
        />

        {/* ================= SLIDES ================= */}

        <Route
          path="/slides"
          element={
            <DashboardPage>
              <Slides />
            </DashboardPage>
          }
        />

        {/* ================= OFFERS ================= */}

        <Route
          path="/offers"
          element={
            <DashboardPage>
              <Offers />
            </DashboardPage>
          }
        />

        {/* ================= SERVICES ================= */}

        <Route
          path="/services"
          element={
            <DashboardPage>
              <Services />
            </DashboardPage>
          }
        />

        {/* ================= VIDEOS ================= */}

        <Route
          path="/videos"
          element={
            <DashboardPage>
              <Videos />
            </DashboardPage>
          }
        />

        {/* ================= ORDERS ================= */}

        <Route
          path="/orders"
          element={
            <DashboardPage>
              <Orders />
            </DashboardPage>
          }
        />

        {/* ================= COMPANY ================= */}

        <Route
          path="/company"
          element={
            <DashboardPage>
              <Company />
            </DashboardPage>
          }
        />

        {/* ================= 404 ================= */}

        <Route
          path="*"
          element={

            <div
              className="
                min-h-screen
                flex
                flex-col
                items-center
                justify-center
                text-white
                bg-black
                p-10
                text-center
              "
            >

              <div className="text-9xl mb-6">
                ⚠
              </div>

              <h1
                className="
                  text-6xl
                  font-black
                  text-yellow-400
                  mb-6
                "
              >
                الصفحة غير موجودة
              </h1>

              <p
                className="
                  text-2xl
                  text-gray-400
                  mb-10
                "
              >
                الرابط الذي تحاول الوصول إليه غير متوفر
              </p>

              <Navigate to="/" replace />

            </div>

          }
        />

      </Routes>

    </div>

  )

}
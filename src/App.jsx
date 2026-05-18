import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import { useWebsiteStore } from './store/websiteStore'

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

import WarehouseDashboard from './pages/WarehouseDashboard'
import WarehouseAdminPanel from './pages/WarehouseAdminPanel'

// ================= PROTECTED ROUTE =================

function ProtectedRoute({ children }) {

  const currentUser = useWebsiteStore(
    (state) => state.currentUser
  )

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return children
}

// ================= OWNER ONLY =================

function OwnerRoute({ children }) {

  const currentUser = useWebsiteStore(
    (state) => state.currentUser
  )

  if (!currentUser || currentUser.role !== 'owner') {
    return <Navigate to="/home" replace />
  }

  return children
}

// ================= WAREHOUSE ROUTE =================

function WarehouseRoute({ children }) {

  const currentUser = useWebsiteStore(
    (state) => state.currentUser
  )

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (
    currentUser.role !== 'warehouse' &&
    currentUser.role !== 'owner'
  ) {
    return <Navigate to="/home" replace />
  }

  return children
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

// ================= APP =================

export default function App() {

  return (
    <div className="bg-black min-h-screen">

      <Routes>

        {/* ================= LOGIN ================= */}
        <Route path="/login" element={<Login />} />

        {/* ================= WEBSITE ================= */}
        <Route path="/home" element={<Home />} />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <OwnerRoute>
              <Admin />
            </OwnerRoute>
          }
        />

        {/* ================= MAIN DASHBOARD ================= */}
        <Route
          path="/dashboard"
          element={
            <DashboardPage>
              <Dashboard />
            </DashboardPage>
          }
        />

        {/* ================= WAREHOUSE DASHBOARD (FIXED) ================= */}
        <Route
          path="/warehouse-dashboard"
          element={
            <WarehouseRoute>
              <DashboardLayout>
                <WarehouseDashboard />
              </DashboardLayout>
            </WarehouseRoute>
          }
        />

        {/* ================= WAREHOUSE ADMIN ================= */}
        <Route
          path="/warehouse-admin"
          element={
            <OwnerRoute>
              <DashboardPage>
                <WarehouseAdminPanel />
              </DashboardPage>
            </OwnerRoute>
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
          element={<Navigate to="/home" replace />}
        />

      </Routes>

    </div>
  )
}
import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useWebsiteStore } from './store/websiteStore'

import ERPController from './erp/ERPController'

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
import BIDashboard from './pages/BIDashboard'

import Wallets from './pages/Wallets'
import FinanceDashboard from './pages/FinanceDashboard'

import Warehouses from './pages/Warehouses'
import Users from './pages/Users'
import Transfers from './pages/Transfers'
import Permissions from './pages/Permissions'
import WalletSettings from './pages/WalletSettings'

// ================= LOADING =================

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-3xl font-black">
      جاري التحميل...
    </div>
  )
}

// ================= ROUTES GUARDS (FIXED) =================

function ProtectedRoute({ children }) {
  const currentUser = useWebsiteStore((s) => s.currentUser)
  const hydrated = useWebsiteStore((s) => s.hydrated)

  if (!hydrated) return <LoadingScreen />

  if (!currentUser || !currentUser.id) {
    return <Navigate to="/login" replace />
  }

  return children
}

function OwnerRoute({ children }) {
  const currentUser = useWebsiteStore((s) => s.currentUser)
  const hydrated = useWebsiteStore((s) => s.hydrated)

  if (!hydrated) return <LoadingScreen />

  if (!currentUser || currentUser.role !== 'owner') {
    return <Navigate to="/home" replace />
  }

  return children
}

// ================= APP =================

export default function App() {

  const hydrated = useWebsiteStore((s) => s.hydrated)
  const setHydrated = useWebsiteStore((s) => s.setHydrated)

  // ERP INIT (SAFE WRAP TO PREVENT CRASH)
  useEffect(() => {
    try {
      if (ERPController?.init) {
        ERPController.init()
      }
    } catch (err) {
      console.error('ERPController Error:', err)
    }
  }, [])

  // FIXED HYDRATION (NO TIMEOUT)
  useEffect(() => {
    setHydrated(true)
  }, [setHydrated])

  // if (!hydrated) return <LoadingScreen />

  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/bi"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <BIDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/ai"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <BIDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <OwnerRoute>
            <DashboardLayout>
              <Admin />
            </DashboardLayout>
          </OwnerRoute>
        }
      />

      <Route
        path="/warehouse-dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <WarehouseDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/warehouses"
        element={
          <OwnerRoute>
            <DashboardLayout>
              <Warehouses />
            </DashboardLayout>
          </OwnerRoute>
        }
      />

      <Route
        path="/transfers"
        element={
          <OwnerRoute>
            <DashboardLayout>
              <Transfers />
            </DashboardLayout>
          </OwnerRoute>
        }
      />

      <Route
        path="/users"
        element={
          <OwnerRoute>
            <DashboardLayout>
              <Users />
            </DashboardLayout>
          </OwnerRoute>
        }
      />

      <Route
        path="/permissions"
        element={
          <OwnerRoute>
            <DashboardLayout>
              <Permissions />
            </DashboardLayout>
          </OwnerRoute>
        }
      />

      <Route
        path="/warehouse-admin"
        element={
          <OwnerRoute>
            <DashboardLayout>
              <WarehouseAdminPanel />
            </DashboardLayout>
          </OwnerRoute>
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

      <Route
        path="/wallets"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Wallets />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/finance"
        element={
          <OwnerRoute>
            <DashboardLayout>
              <FinanceDashboard />
            </DashboardLayout>
          </OwnerRoute>
        }
      />

      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route path="*" element={<Navigate to="/home" replace />} />

      <Route path="/wallet-settings" element={<WalletSettings />} />

    </Routes>
  )
}
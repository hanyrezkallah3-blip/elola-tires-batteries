import { useUserStore } from "./store/userStore";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useWebsiteStore } from "./store/websiteStore";

import ERPController from "./erp/ERPController";

import DashboardLayout from "./layout/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Slides from "./pages/Slides";
import Offers from "./pages/Offers";
import Services from "./pages/Services";
import Videos from "./pages/Videos";
import Orders from "./pages/Orders";
import Company from "./pages/Company";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

import WarehouseDashboard from "./pages/WarehouseDashboard";
import WarehouseAdminPanel from "./pages/WarehouseAdminPanel";
import WarehouseDetails from "./pages/WarehouseDetails";
import BIDashboard from "./pages/BIDashboard";

import Wallets from "./pages/Wallets";
import FinanceDashboard from "./pages/FinanceDashboard";

import Warehouses from "./pages/Warehouses";
import Users from "./pages/Users";
import Transfers from "./pages/Transfers";
import Permissions from "./pages/Permissions";
import WalletSettings from "./pages/WalletSettings";
import Suppliers from "./pages/Suppliers";
import DemandAnalytics from "./pages/DemandAnalytics";

// ================= LOADING =================

function LoadingScreen() {
  return (
    <div className="
      min-h-screen
      bg-slate-950
      flex
      items-center
      justify-center
      text-white
      text-3xl
      font-black
    ">
      جاري التحميل...
    </div>
  );
}

// ================= ROUTE GUARDS =================

function ProtectedRoute({ children }) {

  const currentUser =
    useUserStore((s) => s.currentUser);

  const hydrated =
    useWebsiteStore((s) => s.hydrated);

  if (!hydrated) {
    return <LoadingScreen />;
  }

  if (!currentUser || !currentUser.id) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

function OwnerRoute({ children }) {

  const currentUser =
    useUserStore((s) => s.currentUser);

  const hydrated =
    useWebsiteStore((s) => s.hydrated);

  if (!hydrated) {
    return <LoadingScreen />;
  }

  if (
    !currentUser ||
    currentUser.role !== "owner"
  ) {
    return (
      <Navigate
        to="/home"
        replace
      />
    );
  }

  return children;
}

// ================= APP =================

export default function App() {

  const setHydrated =
    useWebsiteStore((s) => s.setHydrated);

  // ================= ERP INIT =================

  useEffect(() => {

    try {

      if (ERPController?.init) {
        ERPController.init();
      }

    } catch (err) {

      console.error(
        "ERPController Error:",
        err
      );

    }

  }, []);

  // ================= HYDRATION =================

  useEffect(() => {

    setHydrated(true);

  }, [setHydrated]);

  // ================= ROUTES =================

  return (

    <Routes>

      {/* ================= PUBLIC ================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/home"
        element={<Home />}
      />


      {/* ================= DASHBOARD ================= */}

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


      {/* ================= BI ================= */}

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


      {/* ================= AI ================= */}

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


      {/* ================= ADMIN ================= */}

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


      {/* ================= WAREHOUSE DASHBOARD ================= */}

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


      {/* ================= WAREHOUSES ================= */}

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

// ================= WAREHOUSE DETAILS =================

<Route
  path="/warehouses/:id"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <WarehouseDetails />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>

      {/* ================= TRANSFERS ================= */}

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


      {/* ================= USERS ================= */}

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


      {/* ================= PERMISSIONS ================= */}

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


      {/* ================= WAREHOUSE ADMIN ================= */}

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


      {/* ================= PRODUCTS ================= */}

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


      {/* ================= SLIDES ================= */}

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


      {/* ================= OFFERS ================= */}

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


      {/* ================= SERVICES ================= */}

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


      {/* ================= VIDEOS ================= */}

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


      {/* ================= ORDERS ================= */}

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


      {/* ================= COMPANY ================= */}

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


      {/* ================= WALLETS ================= */}

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


      {/* ================= FINANCE ================= */}

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


      {/* ================= DEMAND ANALYTICS ================= */}

      <Route
        path="/demand-analytics"
        element={
          <OwnerRoute>
            <DashboardLayout>
              <DemandAnalytics />
            </DashboardLayout>
          </OwnerRoute>
        }
      />


      {/* ================= SUPPLIERS ================= */}

      <Route
        path="/suppliers"
        element={
          <OwnerRoute>
            <DashboardLayout>
              <Suppliers />
            </DashboardLayout>
          </OwnerRoute>
        }
      />


      {/* ================= WALLET SETTINGS ================= */}

      <Route
        path="/wallet-settings"
        element={
          <WalletSettings />
        }
      />


      {/* ================= DEFAULT ================= */}

      <Route
        path="/"
        element={
          <Navigate
            to="/home"
            replace
          />
        }
      />


      {/* ================= NOT FOUND ================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/home"
            replace
          />
        }
      />

    </Routes>

  );
}


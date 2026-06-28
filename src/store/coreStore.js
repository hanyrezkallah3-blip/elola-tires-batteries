import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCoreStore = create(
  persist(
    (set, get) => ({

      // ================= HYDRATION =================

      hydrated: false,
      setHydrated: (value) =>
        set({ hydrated: value }),

      // ================= SYSTEM KERNEL (SAP CORE) =================

      systemMode: 'manual', 
      // manual | ai | hybrid

      setSystemMode: (mode) =>
        set({ systemMode: mode }),

      systemLocked: false,

      lockSystem: () =>
        set({ systemLocked: true }),

      unlockSystem: () =>
        set({ systemLocked: false }),

      // ================= MULTI TENANT SYSTEM =================

      currentTenantId: null,

      setTenant: (id) =>
        set({ currentTenantId: id }),

      // ================= APP INFO =================

      appName: 'شركة العلا للإطارات والبطاريات',
      appVersion: '1.0.0',
      appInitialized: false,

      setAppInitialized: (value) =>
        set({ appInitialized: value }),

      // ================= UI STATE =================

      sidebarOpen: true,

      toggleSidebar: () =>
        set((state) => ({
          sidebarOpen: !state.sidebarOpen
        })),

      closeSidebar: () =>
        set({ sidebarOpen: false }),

      openSidebar: () =>
        set({ sidebarOpen: true }),

      // ================= THEME =================

      darkMode: true,

      setDarkMode: (value) =>
        set({ darkMode: value }),

      toggleDarkMode: () =>
        set((state) => ({
          darkMode: !state.darkMode
        })),

      // ================= GLOBAL LOADING =================

      globalLoading: false,

      setGlobalLoading: (value) =>
        set({ globalLoading: value }),

      // ================= NOTIFICATIONS =================

      notifications: [],

      addNotification: (notification) => {

        const newNotification = {
          id: Date.now().toString(),
          title: '',
          message: '',
          type: 'info',
          read: false,
          createdAt: new Date().toISOString(),
          ...notification
        }

        set((state) => ({
          notifications: [
            newNotification,
            ...(state.notifications || [])
          ]
        }))
      },

      clearNotifications: () =>
        set({ notifications: [] }),

      // ================= ALERTS =================

      alerts: [],

      addAlert: (alert) => {

        const newAlert = {
          id: Date.now().toString(),
          title: '',
          message: '',
          severity: 'warning',
          createdAt: new Date().toISOString(),
          ...alert
        }

        set((state) => ({
          alerts: [
            newAlert,
            ...(state.alerts || [])
          ]
        }))
      },

      clearAlerts: () =>
        set({ alerts: [] }),

      // ================= SYSTEM STATUS =================

      systemStatus: {
        server: 'online',
        database: 'online',
        walletSystem: 'online',
        inventorySystem: 'online',
        analyticsSystem: 'online',
        erpCore: 'online'
      },

      updateSystemStatus: (key, value) =>
        set((state) => ({
          systemStatus: {
            ...state.systemStatus,
            [key]: value
          }
        })),

      // ================= FINANCIAL LEDGER (SAP CORE) =================

      ledger: [],

      addLedgerEntry: ({
        type, // income | expense
        amount,
        description
      }) => {

        const entry = {
          id: Date.now().toString(),
          type,
          amount: Number(amount || 0),
          description,
          tenantId: get().currentTenantId,
          createdAt: new Date().toISOString()
        }

        set((state) => ({
          ledger: [
            entry,
            ...(state.ledger || [])
          ]
        }))
      },

      getFinancialSummary: () => {

        const ledger = get().ledger || []

        const income = ledger
          .filter(l => l.type === 'income')
          .reduce((a, b) => a + b.amount, 0)

        const expense = ledger
          .filter(l => l.type === 'expense')
          .reduce((a, b) => a + b.amount, 0)

        return {
          income,
          expense,
          profit: income - expense
        }
      },

      // ================= AUDIT LOGS (SAP FEATURE) =================

      systemLogs: [],

      addSystemLog: (log) => {

        const newLog = {
          id: Date.now().toString(),
          action: '',
          message: '',
          user: get().currentUser?.username,
          tenantId: get().currentTenantId,
          createdAt: new Date().toISOString(),
          ...log
        }

        set((state) => ({
          systemLogs: [
            newLog,
            ...(state.systemLogs || [])
          ]
        }))
      },

      clearSystemLogs: () =>
        set({ systemLogs: [] })

    }),

    // ================= PERSIST =================

    {
      name: 'sap-core-erp',

      partialize: (state) => ({
        systemMode: state.systemMode,
        systemLocked: state.systemLocked,
        currentTenantId: state.currentTenantId,
        darkMode: state.darkMode,
        sidebarOpen: state.sidebarOpen,
        notifications: state.notifications,
        alerts: state.alerts,
        systemStatus: state.systemStatus,
        ledger: state.ledger,
        systemLogs: state.systemLogs
      }),

      onRehydrateStorage: () => (state) => {
        if (state) state.setHydrated(true)
      }
    }
  )
)
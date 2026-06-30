import { create } from 'zustand'

export const useSystemStore = create((set, get) => ({

  // ================= SETTINGS =================

  settings: {

    companyName: 'Elola ERP',

    taxEnabled: false,

    taxPercentage: 14,

    currency: 'EGP',

    demoMode: false

  },

  updateSettings: (data) =>

    set((state) => ({

      settings: {

        ...state.settings,

        ...data

      }

    })),

  // ================= BACKUPS =================

  backups: [],

  createBackup: (backup) =>

    set((state) => ({

      backups: [

        {

          id: crypto.randomUUID(),

          createdAt:
            new Date().toISOString(),

          ...backup

        },

        ...state.backups

      ]

    })),

  deleteBackup: (id) =>

    set((state) => ({

      backups:

        state.backups.filter(

          (b) => b.id !== id

        )

    }))

}))
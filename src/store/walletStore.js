// src/store/walletStore.js

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { STORAGE_KEYS } from './constants'

import {
  ensureArray,
  generateId,
  now,
  toNumber,
  contains
} from './helpers'

export const useWalletStore = create(
  persist(
    (set, get) => ({

      // ==================================================
      // STATE
      // ==================================================

      wallets: [],

      walletTransactions: [],

      walletEnabled: true,

      cashbackPercentage: 0,

      // ==================================================
      // SETTINGS
      // ==================================================

      setWalletEnabled: (enabled) =>
        set({
          walletEnabled: !!enabled
        }),

      setCashbackPercentage: (percentage) =>
        set({
          cashbackPercentage: toNumber(percentage)
        }),

      // ==================================================
      // WALLETS
      // ==================================================

      setWallets: (wallets) =>
        set({
          wallets: ensureArray(wallets)
        }),

      getWallet: (phone) =>
        get().wallets.find(
          wallet => wallet.phone === phone
        ) || null,

      searchWallets: (keyword) => {

        if (!keyword)
          return get().wallets

        return get().wallets.filter(wallet =>

          contains(wallet.customerName, keyword) ||

          contains(wallet.phone, keyword)

        )

      },

      // ==================================================
      // CREATE
      // ==================================================

      createWallet: (wallet) => {

        const exists =
          get().getWallet(wallet.phone)

        if (exists)
          return exists

        const newWallet = {

          id: generateId(),

          customerName: '',

          phone: '',

          balance: 0,

          totalCashback: 0,

          createdAt: now(),

          updatedAt: now(),

          ...wallet

        }

        set(state => ({

          wallets: [

            ...state.wallets,

            newWallet

          ]

        }))

        return newWallet

      },

      // ==================================================
      // BALANCE
      // ==================================================

      addWalletBalance: ({
        phone,
        customerName,
        amount,
        reason = 'إضافة رصيد'
      }) => {

        const value = toNumber(amount)

        set(state => {

          const wallets = [...state.wallets]

          let wallet =
            wallets.find(
              w => w.phone === phone
            )

          if (!wallet) {

            wallet = {

              id: generateId(),

              customerName,

              phone,

              balance: 0,

              totalCashback: 0,

              createdAt: now(),

              updatedAt: now()

            }

            wallets.push(wallet)

          }

          wallet.balance =
            toNumber(wallet.balance) + value

          wallet.updatedAt = now()

          return {

            wallets,

            walletTransactions: [

              {

                id: generateId(),

                type: 'add',

                phone,

                customerName,

                amount: value,

                reason,

                createdAt: now()

              },

              ...state.walletTransactions

            ]

          }

        })

      },

      deductWalletBalance: ({
        phone,
        customerName,
        amount,
        reason = 'خصم رصيد'
      }) => {

        const value = toNumber(amount)

        set(state => ({

          wallets: state.wallets.map(wallet =>

            wallet.phone === phone

              ? {

                  ...wallet,

                  balance: Math.max(

                    0,

                    toNumber(wallet.balance) - value

                  ),

                  updatedAt: now()

                }

              : wallet

          ),

          walletTransactions: [

            {

              id: generateId(),

              type: 'deduct',

              phone,

              customerName,

              amount: value,

              reason,

              createdAt: now()

            },

            ...state.walletTransactions

          ]

        }))

      },

      // ==================================================
      // DELETE
      // ==================================================

      deleteWallet: (phone) =>

        set(state => ({

          wallets:

            state.wallets.filter(

              wallet => wallet.phone !== phone

            )

        })),

      // ==================================================
      // TRANSACTIONS
      // ==================================================

      setWalletTransactions: (transactions) =>
        set({
          walletTransactions:
            ensureArray(transactions)
        }),

      // ==================================================
      // STATISTICS
      // ==================================================

      getStatistics: () => {

        const wallets =
          get().wallets

        const transactions =
          get().walletTransactions

        return {

          totalWallets:

            wallets.length,

          totalBalance:

            wallets.reduce(

              (sum, wallet) =>

                sum +

                toNumber(wallet.balance),

              0

            ),

          totalCashback:

            wallets.reduce(

              (sum, wallet) =>

                sum +

                toNumber(wallet.totalCashback),

              0

            ),

          totalTransactions:

            transactions.length

        }

      },

      // ==================================================
      // RESET
      // ==================================================

      resetWallets: () =>

        set({

          wallets: [],

          walletTransactions: []

        })

    }),

    {

      name: STORAGE_KEYS.WALLETS,

      partialize: (state) => ({

        wallets: state.wallets,

        walletTransactions:
          state.walletTransactions,

        walletEnabled:
          state.walletEnabled,

        cashbackPercentage:
          state.cashbackPercentage

      })

    }

  )

)
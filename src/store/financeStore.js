// src/store/financeStore.js

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

export const useFinanceStore = create(
  persist(
    (set, get) => ({

      // ==================================================
      // STATE
      // ==================================================

      income: [],

      expenses: [],

      treasury: {

        cash: 0,

        bank: 0

      },

      // ==================================================
      // INCOME
      // ==================================================

      setIncome: (income) =>
        set({
          income: ensureArray(income)
        }),

      addIncome: (record) => {

        const item = {

          id: generateId(),

          title: '',

          category: '',

          amount: 0,

          notes: '',

          createdAt: now(),

          ...record

        }

        set(state => ({

          income: [

            item,

            ...state.income

          ],

          treasury: {

            ...state.treasury,

            cash:

              toNumber(state.treasury.cash) +

              toNumber(item.amount)

          }

        }))

        return item

      },

      deleteIncome: (id) =>

        set(state => {

          const item =
            state.income.find(
              i => i.id === id
            )

          return {

            income:

              state.income.filter(
                i => i.id !== id
              ),

            treasury: {

              ...state.treasury,

              cash:

                toNumber(state.treasury.cash) -

                toNumber(item?.amount)

            }

          }

        }),

      // ==================================================
      // EXPENSES
      // ==================================================

      setExpenses: (expenses) =>
        set({
          expenses: ensureArray(expenses)
        }),

      addExpense: (record) => {

        const item = {

          id: generateId(),

          title: '',

          category: '',

          amount: 0,

          notes: '',

          createdAt: now(),

          ...record

        }

        set(state => ({

          expenses: [

            item,

            ...state.expenses

          ],

          treasury: {

            ...state.treasury,

            cash:

              toNumber(state.treasury.cash) -

              toNumber(item.amount)

          }

        }))

        return item

      },

      deleteExpense: (id) =>

        set(state => {

          const item =
            state.expenses.find(
              i => i.id === id
            )

          return {

            expenses:

              state.expenses.filter(
                i => i.id !== id
              ),

            treasury: {

              ...state.treasury,

              cash:

                toNumber(state.treasury.cash) +

                toNumber(item?.amount)

            }

          }

        }),

      // ==================================================
      // TREASURY
      // ==================================================

      setCash: (amount) =>

        set(state => ({

          treasury: {

            ...state.treasury,

            cash:

              toNumber(amount)

          }

        })),

      setBank: (amount) =>

        set(state => ({

          treasury: {

            ...state.treasury,

            bank:

              toNumber(amount)

          }

        })),

      // ==================================================
      // SEARCH
      // ==================================================

      searchIncome: (keyword) => {

        if (!keyword)
          return get().income

        return get().income.filter(item =>

          contains(item.title, keyword) ||

          contains(item.category, keyword)

        )

      },

      searchExpenses: (keyword) => {

        if (!keyword)
          return get().expenses

        return get().expenses.filter(item =>

          contains(item.title, keyword) ||

          contains(item.category, keyword)

        )

      },

      // ==================================================
      // STATISTICS
      // ==================================================

      getStatistics: () => {

        const income = get().income

        const expenses = get().expenses

        const totalIncome = income.reduce(

          (sum, item) =>

            sum + toNumber(item.amount),

          0

        )

        const totalExpenses = expenses.reduce(

          (sum, item) =>

            sum + toNumber(item.amount),

          0

        )

        return {

          totalIncome,

          totalExpenses,

          netProfit:

            totalIncome -

            totalExpenses,

          incomeCount:

            income.length,

          expenseCount:

            expenses.length,

          cash:

            get().treasury.cash,

          bank:

            get().treasury.bank

        }

      },

      // ==================================================
      // RESET
      // ==================================================

      resetFinance: () =>

        set({

          income: [],

          expenses: [],

          treasury: {

            cash: 0,

            bank: 0

          }

        })

    }),

    {

      name: STORAGE_KEYS.FINANCE,

      partialize: (state) => ({

        income: state.income,

        expenses: state.expenses,

        treasury: state.treasury

      })

    }

  )

)
import { create } from 'zustand'

const defaultUnits = [

  { id: 'piece', name: 'قطعة' },
  { id: 'pair', name: 'زوج' },
  { id: 'set', name: 'طقم' },
  { id: 'box', name: 'علبة' },
  { id: 'carton', name: 'كرتونة' },
  { id: 'liter', name: 'لتر' },
  { id: 'gallon', name: 'جالون' },
  { id: 'kg', name: 'كيلوجرام' },
  { id: 'gram', name: 'جرام' },
  { id: 'meter', name: 'متر' }

]

export const useUnitStore = create(

  () => ({

    units: defaultUnits

  })

)
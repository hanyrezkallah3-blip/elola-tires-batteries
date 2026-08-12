import { create } from 'zustand'

const defaultProductTypes = [

  {
    id: 'tire',
    name: 'إطار'
  },

  {
    id: 'battery',
    name: 'بطارية'
  },

  {
    id: 'oil',
    name: 'زيت'
  },

  {
    id: 'spare-part',
    name: 'قطعة غيار'
  },

  {
    id: 'service',
    name: 'خدمة'
  }

]

export const useProductTypeStore = create(

  () => ({

    productTypes: defaultProductTypes

  })

)
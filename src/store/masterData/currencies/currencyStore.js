import { create } from 'zustand'

const defaultCurrencies = [

  { id: 'EGP', name: 'جنيه مصري' },
  { id: 'USD', name: 'دولار أمريكي' },
  { id: 'EUR', name: 'يورو' },
  { id: 'SAR', name: 'ريال سعودي' },
  { id: 'AED', name: 'درهم إماراتي' },
  { id: 'KWD', name: 'دينار كويتي' },
  { id: 'QAR', name: 'ريال قطري' },
  { id: 'OMR', name: 'ريال عماني' },
  { id: 'BHD', name: 'دينار بحريني' }

]

export const useCurrencyStore = create(

  () => ({

    currencies: defaultCurrencies

  })

)
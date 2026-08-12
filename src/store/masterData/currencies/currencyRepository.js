import { useCurrencyStore } from './currencyStore'

export function getCurrencies() {

  return useCurrencyStore

    .getState()

    .currencies || []

}
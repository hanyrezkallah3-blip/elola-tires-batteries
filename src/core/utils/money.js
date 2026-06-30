// ======================================================
// Elola ERP Enterprise
// Money Utilities
// ======================================================

import {

  toNumber,

  safeMultiply

} from './number'

export function calculateTax(

  amount,

  percentage

) {

  return safeMultiply(

    toNumber(amount),

    toNumber(percentage) / 100

  )

}

export function addTax(

  amount,

  percentage

) {

  return (

    toNumber(amount) +

    calculateTax(

      amount,

      percentage

    )

  )

}

export function removeTax(

  amount,

  percentage

) {

  const rate =

    1 +

    toNumber(percentage) / 100

  if (rate === 0)

    return 0

  return toNumber(amount) / rate

}

export function roundMoney(

  value,

  decimals = 2

) {

  return Number(

    toNumber(value)

      .toFixed(decimals)

  )

}

export function calculateDiscount(

  amount,

  percentage

) {

  return safeMultiply(

    amount,

    toNumber(percentage) / 100

  )

}

export function applyDiscount(

  amount,

  percentage

) {

  return (

    toNumber(amount) -

    calculateDiscount(

      amount,

      percentage

    )

  )

}
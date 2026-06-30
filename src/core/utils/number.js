// ======================================================
// Elola ERP Enterprise
// Number Utilities
// ======================================================

export function toNumber(value, fallback = 0) {

  const number = Number(value)

  return Number.isFinite(number)

    ? number

    : fallback

}

export function clamp(value, min = 0, max = Infinity) {

  return Math.min(

    max,

    Math.max(

      min,

      toNumber(value)

    )

  )

}

export function safeAdd(...values) {

  return values.reduce(

    (total, value) =>

      total + toNumber(value),

    0

  )

}

export function safeSubtract(a, b) {

  return toNumber(a) - toNumber(b)

}

export function safeMultiply(a, b) {

  return toNumber(a) * toNumber(b)

}

export function safeDivide(a, b) {

  const divisor = toNumber(b)

  if (divisor === 0)

    return 0

  return toNumber(a) / divisor

}
// ======================================================
// EL OLA ERP
// Vehicle Cache
// ======================================================

const PREFIX = 'elola_vehicle_cache_'

const DEFAULT_EXPIRE_HOURS = 24

export default class VehicleCache {

  // ====================================================
  // SAVE
  // ====================================================

  static save(key, data, expireHours = DEFAULT_EXPIRE_HOURS) {

    try {

      const payload = {

        createdAt: Date.now(),

        expiresAt:

          Date.now()

          +

          (expireHours * 60 * 60 * 1000),

        data

      }

      localStorage.setItem(

        PREFIX + key,

        JSON.stringify(payload)

      )

      return true

    }

    catch (error) {

      console.error(

        'VehicleCache.save',

        error

      )

      return false

    }

  }

  // ====================================================
  // LOAD
  // ====================================================

  static load(key) {

    try {

      const raw = localStorage.getItem(

        PREFIX + key

      )

      if (!raw)

        return null

      const payload = JSON.parse(raw)

      if (

        !payload ||

        !payload.expiresAt

      )

        return null

      if (

        Date.now() >

        payload.expiresAt

      ) {

        this.remove(key)

        return null

      }

      return payload.data

    }

    catch (error) {

      console.error(

        'VehicleCache.load',

        error

      )

      return null

    }

  }

  // ====================================================
  // EXISTS
  // ====================================================

  static has(key) {

    return this.load(key) !== null

  }

  // ====================================================
  // REMOVE
  // ====================================================

  static remove(key) {

    localStorage.removeItem(

      PREFIX + key

    )

  }

  // ====================================================
  // CLEAR ALL
  // ====================================================

  static clear() {

    Object.keys(localStorage)

      .filter(key =>

        key.startsWith(PREFIX)

      )

      .forEach(key =>

        localStorage.removeItem(key)

      )

  }

  // ====================================================
  // EXPIRED
  // ====================================================

  static isExpired(key) {

    try {

      const raw = localStorage.getItem(

        PREFIX + key

      )

      if (!raw)

        return true

      const payload = JSON.parse(raw)

      return (

        Date.now()

        >

        payload.expiresAt

      )

    }

    catch {

      return true

    }

  }

}
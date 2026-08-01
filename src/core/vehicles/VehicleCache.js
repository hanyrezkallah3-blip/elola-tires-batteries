// ======================================================
// EL OLA ERP
// Vehicle Cache
// ======================================================

import CacheManager
from '../cache/CacheManager'

export default class VehicleCache {

  // ====================================================
  // HAS
  // ====================================================

  static has(key) {

    return CacheManager.has(

      key

    )

  }

  // ====================================================
  // GET
  // ====================================================

  static get(key) {

    return CacheManager.get(

      key

    )

  }

  // ====================================================
  // SET
  // ====================================================

  static set(

    key,

    value

  ) {

    return CacheManager.set(

      key,

      value

    )

  }

  // ====================================================
  // REMOVE
  // ====================================================

  static remove(key) {

    CacheManager.remove(

      key

    )

  }

  // ====================================================
  // CLEAR
  // ====================================================

  static clear() {

    CacheManager.clear()

  }

  // ====================================================
  // GET OR SET
  // ====================================================

  static getOrSet(

    key,

    loader

  ) {

    return CacheManager.getOrSet(

      key,

      loader

    )

  }

}
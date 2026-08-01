// ======================================================
// EL OLA ERP
// Cache Manager
// ======================================================

import MemoryCache
from './MemoryCache'

export default class CacheManager {

  // ====================================================
  // EXISTS
  // ====================================================

  static has(key) {

    return MemoryCache.has(

      key

    )

  }

  // ====================================================
  // GET
  // ====================================================

  static get(key) {

    return MemoryCache.get(

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

    MemoryCache.set(

      key,

      value

    )

    return value

  }

  // ====================================================
  // REMOVE
  // ====================================================

  static remove(key) {

    MemoryCache.remove(

      key

    )

  }

  // ====================================================
  // CLEAR
  // ====================================================

  static clear() {

    MemoryCache.clear()

  }

  // ====================================================
  // GET OR LOAD
  // ====================================================

  static getOrSet(

    key,

    loader

  ) {

    if (

      this.has(key)

    ) {

      return this.get(key)

    }

    const value =

      loader()

    this.set(

      key,

      value

    )

    return value

  }

}
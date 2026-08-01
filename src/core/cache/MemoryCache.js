// ======================================================
// EL OLA ERP
// Memory Cache
// ======================================================

export default class MemoryCache {

  static cache = new Map()

  static has(key) {

    return this.cache.has(key)

  }

  static get(key) {

    return this.cache.get(key)

  }

  static set(key, value) {

    this.cache.set(key, value)

    return value

  }

  static remove(key) {

    this.cache.delete(key)

  }

  static clear() {

    this.cache.clear()

  }

}
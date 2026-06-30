// ======================================================
// Elola ERP Enterprise
// Base Service
// ======================================================

export default class BaseService {

  constructor(store) {

    this.store = store

  }

  getState() {

    return this.store.getState()

  }

  setState(data) {

    this.store.setState(data)

  }

  subscribe(listener) {

    return this.store.subscribe(listener)

  }

}
import { useInventoryStore } from '../../store/inventoryStore'

export const InventoryAdapter = {

  getStore() {

    return useInventoryStore.getState()

  }

}
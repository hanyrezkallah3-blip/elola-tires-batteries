import { useUnitStore } from './unitStore'

export function getUnits() {

  return useUnitStore

    .getState()

    .units || []

}
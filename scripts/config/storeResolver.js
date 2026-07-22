import path from 'path'

import { resolveStore } from '../config/storeMap.js'

export function resolveStoreInfo(file, property) {

  const config = resolveStore(property)

  if (!config) {

    return null

  }

  const currentDir = path.dirname(file)

  const srcIndex = currentDir.lastIndexOf(`${path.sep}src`)

  if (srcIndex === -1) {

    return {

      ...config,

      importPath: `../store/${config.store}`

    }

  }

  const fromDir = currentDir.substring(srcIndex + 5)

  const depth = fromDir
    .split(path.sep)
    .filter(Boolean)
    .length

  const prefix = '../'.repeat(depth)

  return {

    ...config,

    importPath: `${prefix}store/${config.store}`

  }

}
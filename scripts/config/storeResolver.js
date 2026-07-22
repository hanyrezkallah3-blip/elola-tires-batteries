import path from 'path'

import { resolveStore } from '../config/storeMap.js'

export function resolveStoreInfo(file, property) {

  const config = resolveStore(property)

  if (!config) {

    return null

  }

  const currentDir = path.dirname(
    path.resolve(file)
  )

  const storeFile = path.resolve(
    'src',
    'store',
    config.store
  )

  let relativePath = path.relative(

    currentDir,

    storeFile

  )

  relativePath = relativePath
    .replace(/\\/g, '/')

  if (

    !relativePath.startsWith('.')

  ) {

    relativePath = './' + relativePath

  }

  return {

    ...config,

    importPath: relativePath

  }

}
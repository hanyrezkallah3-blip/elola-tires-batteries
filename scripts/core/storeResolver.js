import { STORE_MAP } from '../config/storeMap.js'

export function resolveStoreInfo(file, property) {

  const config = STORE_MAP[property]

  if (!config) {

    return null

  }

  let importPath = config.importPath

  // App.jsx موجود داخل src مباشرة
  if (file.endsWith('App.jsx')) {

    importPath = importPath.replace('../', './')

  }

  return {

    property,

    hook: config.hook,

    store: config.store,

    importPath

  }

}
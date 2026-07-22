import {
  scanImports
} from './importScanner.js'

const STORE_NAMES = new Set([

  'useWebsiteStore',

  'useProductStore',

  'useOrderStore',

  'useWalletStore',

  'useUserStore',

  'useInventoryStore',

  'useAnalyticsStore'

])



export function detectStores(file) {

  const imports = scanImports(file)

  const stores = []



  for (const importDeclaration of imports) {

    for (const specifier of importDeclaration.specifiers) {

      if (!STORE_NAMES.has(specifier.local))
        continue



      stores.push({

        name: specifier.local,

        source: importDeclaration.source

      })

    }

  }



  return stores

}



export function usesStore(

  file,

  storeName

) {

  return detectStores(file).some(

    store =>

      store.name === storeName

  )

}
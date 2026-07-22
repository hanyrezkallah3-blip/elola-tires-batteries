import {
  createASTSession,
  finishASTSession
} from '../../core/astSession.js'

import {
  STORE_MAP
} from '../../config/storeMap.js'

import {
  transformStoreMigration
} from './transformStoreMigration.js'

export function transformAllStores(file) {

  const session = createASTSession(file)

  for (const property of Object.keys(STORE_MAP)) {

    transformStoreMigration(

      session,

      property

    )

  }

  return finishASTSession(session)

}
import {
  createASTSession,
  finishASTSession
} from '../../core/astSession.js'

import {
  visit
} from '../../core/ast.js'

import {
  resolveStoreInfo
} from '../../config/storeResolver.js'

import {
  hasImport
} from '../../core/importScanner.js'

import {
  createImportManager
} from '../../core/importManager.js'

export function transformAllStores(file) {

  if (!hasImport(file, 'useWebsiteStore')) {

    return {

      changed: false,

      code: null

    }

  }

  const session = createASTSession(file)

  const imports =

    createImportManager(session)

  visit(session.ast, {

    CallExpression(path) {

      const node = path.node

      if (

        node.callee?.type !== 'Identifier' ||

        node.callee.name !== 'useWebsiteStore'

      ) {

        return

      }

      if (

        node.arguments.length !== 1

      ) {

        return

      }

      const selector =

        node.arguments[0]

      if (

        selector.type !==

        'ArrowFunctionExpression'

      ) {

        return

      }

      if (

        selector.body?.type !==

        'MemberExpression'

      ) {

        return

      }

      const property =

        selector.body.property?.name

      if (!property) {

        return

      }

      const info =

        resolveStoreInfo(

          file,

          property

        )

      if (!info) {

        return

      }

      node.callee.name =

        info.hook

      imports.ensureImport(

        info.hook,

        info.importPath

      )

      session.changed = true

    }

  })

  imports.removeWebsiteImportIfUnused()

  return finishASTSession(

    session

  )

}
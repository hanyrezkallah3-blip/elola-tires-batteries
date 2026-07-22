import * as t from '@babel/types'

import {
  visit
} from '../../core/ast.js'

import {
  hasIdentifier
} from '../../core/astUtils.js'

import {
  resolveStoreInfo
} from '../../config/storeResolver.js'

export function transformStoreMigration(session, property) {

  const info = resolveStoreInfo(

    session.file,

    property

  )

  if (!info) {

    return

  }

  let hasImport = false
  let websiteImport = null
  let changed = false

  visit(session.ast, {

    ImportDeclaration(path) {

      const value = path.node.source.value

      if (

        value.endsWith(`/store/${info.store}`)

      ) {

        hasImport = true

      }

      if (

        value.endsWith('/store/websiteStore')

      ) {

        websiteImport = path

      }

    },

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

      const selector = node.arguments[0]

      if (

        selector.type !== 'ArrowFunctionExpression' ||

        selector.body?.type !== 'MemberExpression'

      ) {

        return

      }

      if (

        selector.body.property?.name !== property

      ) {

        return

      }

      node.callee.name = info.hook

      changed = true

    }

  })

  if (!changed) {

    return

  }

  session.changed = true

  if (!hasImport) {

    session.ast.program.body.unshift(

      t.importDeclaration(

        [

          t.importSpecifier(

            t.identifier(info.hook),

            t.identifier(info.hook)

          )

        ],

        t.stringLiteral(

          info.importPath

        )

      )

    )

  }

  if (websiteImport) {

    if (

      !hasIdentifier(

        session.ast,

        'useWebsiteStore'

      )

    ) {

      websiteImport.remove()

    }

  }

}
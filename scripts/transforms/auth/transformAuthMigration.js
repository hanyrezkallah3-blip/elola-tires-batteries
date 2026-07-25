import * as t from '@babel/types'

import { visit } from '../../core/ast.js'

import { hasIdentifier } from '../../core/astUtils.js'

import { AUTH_PROPERTIES } from './authProperties.js'

function isAuthProperty(name) {

  return AUTH_PROPERTIES.includes(name)

}

function createUserStoreCall() {

  return t.callExpression(

    t.identifier('useUserStore'),

    []

  )

}

function createWebsiteStoreCall() {

  return t.callExpression(

    t.identifier('useWebsiteStore'),

    []

  )

}

function createUserImport() {

  return t.importDeclaration(

    [

      t.importSpecifier(

        t.identifier('useUserStore'),

        t.identifier('useUserStore')

      )

    ],

    t.stringLiteral('./store/userStore')

  )

}

export function transformAuthMigration(session) {

  let changed = false

  let hasUserImport = false

  let websiteImport = null

  visit(session.ast, {

    ImportDeclaration(path) {

      const source = path.node.source.value

      if (

        source.endsWith('/store/userStore')

      ) {

        hasUserImport = true

      }

      if (

        source.endsWith('/store/websiteStore')

      ) {

        websiteImport = path

      }

    },

    CallExpression(path) {

      const node = path.node

      if (

        !t.isIdentifier(node.callee)

      ) {

        return

      }

      if (

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

        !t.isArrowFunctionExpression(selector)

      ) {

        return

      }

      if (

        !t.isMemberExpression(selector.body)

      ) {

        return

      }

      if (

        !t.isIdentifier(selector.body.property)

      ) {

        return

      }

      const property =

        selector.body.property.name

      if (

        !isAuthProperty(property)

      ) {

        return

      }

      node.callee =

        t.identifier('useUserStore')

      changed = true

    },
        VariableDeclarator(path) {

      const node = path.node

      if (

        !t.isObjectPattern(node.id)

      ) {

        return

      }

      if (

        !t.isCallExpression(node.init)

      ) {

        return

      }

      if (

        !t.isIdentifier(node.init.callee)

      ) {

        return

      }

      if (

        node.init.callee.name !== 'useWebsiteStore'

      ) {

        return

      }

      const authProperties = []

      const websiteProperties = []

      for (const property of node.id.properties) {

        if (

          !t.isObjectProperty(property)

        ) {

          websiteProperties.push(property)

          continue

        }

        if (

          !t.isIdentifier(property.key)

        ) {

          websiteProperties.push(property)

          continue

        }

        if (

          isAuthProperty(property.key.name)

        ) {

          authProperties.push(property)

        }

        else {

          websiteProperties.push(property)

        }

      }

      if (

        authProperties.length === 0

      ) {

        return

      }

      changed = true

      const declarations = []

      if (

        websiteProperties.length > 0

      ) {

        declarations.push(

          t.variableDeclarator(

            t.objectPattern(

              websiteProperties

            ),

            createWebsiteStoreCall()

          )

        )

      }
            declarations.push(

        t.variableDeclarator(

          t.objectPattern(

            authProperties

          ),

          createUserStoreCall()

        )

      )

      path.replaceWith(

        t.variableDeclaration(

          'const',

          declarations

        )

      )

    },

    VariableDeclaration(path) {

      if (

        path.node.kind !== 'const'

      ) {

        return

      }

      if (

        path.node.declarations.length !== 1

      ) {

        return

      }

      const declaration =

        path.node.declarations[0]

      if (

        !t.isVariableDeclarator(declaration)

      ) {

        return

      }

      if (

        !t.isCallExpression(declaration.init)

      ) {

        return

      }

      if (

        !t.isIdentifier(declaration.init.callee)

      ) {

        return

      }

      if (

        declaration.init.callee.name !== 'useWebsiteStore'

      ) {

        return

      }

      if (

        !t.isObjectPattern(declaration.id)

      ) {

        return

      }

      declaration.id.properties =

        declaration.id.properties.filter(property => {

          if (

            !t.isObjectProperty(property)

          ) {

            return true

          }

          if (

            !t.isIdentifier(property.key)

          ) {

            return true

          }

          return !isAuthProperty(

            property.key.name

          )

        })

    },
        Identifier(path) {

      if (

        path.node.name !== 'useWebsiteStore'

      ) {

        return

      }

      if (

        !path.isReferencedIdentifier()

      ) {

        return

      }

      const parent = path.parent

      if (

        t.isCallExpression(parent) &&

        parent.callee === path.node

      ) {

        return

      }

    }

  })

  if (

    !changed

  ) {

    return

  }

  session.changed = true

  if (

    !hasUserImport

  ) {

    session.ast.program.body.unshift(

      createUserImport()

    )

  }

  if (

    !websiteImport

  ) {

    return

  }
    let stillUsesWebsiteStore = false

  visit(session.ast, {

    Identifier(path) {

      if (

        path.node.name !== 'useWebsiteStore'

      ) {

        return

      }

      if (

        !path.isReferencedIdentifier()

      ) {

        return

      }

      const parent = path.parent

      if (

        t.isImportSpecifier(parent) ||

        t.isImportDeclaration(parent)

      ) {

        return

      }

      stillUsesWebsiteStore = true

      path.stop()

    }

  })

  if (

    !stillUsesWebsiteStore

  ) {

    websiteImport.remove()

  }

}
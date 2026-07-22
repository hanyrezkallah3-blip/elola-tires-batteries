import * as t from '@babel/types'

import {
  visit
} from '../../core/ast.js'


export function transformAuthMigration(session) {

  let changed = false

  let hasUserImport = false

  let websiteImport = null


  const authProperties = [

    'login',

    'logout',

    'currentUser',

    'setCurrentUser'

  ]


  // ==========================================
  // SCAN IMPORTS
  // ==========================================

  visit(session.ast, {

    ImportDeclaration(path) {

      const source =
        path.node.source.value


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

    }

  })


  // ==========================================
  // REPLACE AUTH CALLS ONLY
  // ==========================================

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

        selector.type !== 'ArrowFunctionExpression'

      ) {

        return

      }


      let property = null


      if (

        selector.body?.type === 'MemberExpression'

      ) {

        property =
          selector.body.property?.name

      }


      if (

        !authProperties.includes(property)

      ) {

        return

      }


      node.callee.name =
        'useUserStore'


      changed = true


    }

  })


  // ==========================================
  // STOP IF NOTHING CHANGED
  // ==========================================

  if (!changed) {

    return

  }


  session.changed = true


  // ==========================================
  // ADD USER STORE IMPORT
  // ==========================================

  if (!hasUserImport) {


    session.ast.program.body.unshift(

      t.importDeclaration(

        [

          t.importSpecifier(

            t.identifier('useUserStore'),

            t.identifier('useUserStore')

          )

        ],

        t.stringLiteral(

          './store/userStore'

        )

      )

    )


  }


  // ==========================================
  // REMOVE WEBSITE IMPORT IF EMPTY
  // ==========================================

  if (websiteImport) {


    let stillUsingWebsite = false


    visit(session.ast, {


      Identifier(path) {


        if (

          path.node.name === 'useWebsiteStore' &&

          path.parent.type !== 'ImportSpecifier'

        ) {

          stillUsingWebsite = true

        }


      }


    })


    if (!stillUsingWebsite) {

      websiteImport.remove()

    }


  }


}
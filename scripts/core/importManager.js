import * as t from '@babel/types'

import {
  visit
} from './ast.js'

export function createImportManager(session) {

  const imports = new Map()

  let websiteImport = null

  for (const node of session.ast.program.body) {

    if (node.type !== 'ImportDeclaration') {

      continue

    }

    const source = node.source.value

    if (

      source.endsWith('/store/websiteStore')

    ) {

      websiteImport = node

    }

    for (const specifier of node.specifiers) {

      if (

        specifier.type !== 'ImportSpecifier'

      ) {

        continue

      }

      imports.set(

        specifier.imported.name,

        source

      )

    }

  }

  function ensureImport(

    hook,

    importPath

  ) {

    if (

      imports.has(hook)

    ) {

      return

    }

    session.ast.program.body.unshift(

      t.importDeclaration(

        [

          t.importSpecifier(

            t.identifier(hook),

            t.identifier(hook)

          )

        ],

        t.stringLiteral(

          importPath

        )

      )

    )

    imports.set(

      hook,

      importPath

    )

  }

  function removeWebsiteImportIfUnused() {

    if (!websiteImport) {

      return

    }

    let used = false

    visit(session.ast, {

      Identifier(path) {

        if (

          path.node.name !== 'useWebsiteStore'

        ) {

          return

        }

        if (

          path.parent.type === 'ImportSpecifier'

        ) {

          return

        }

        if (

          path.parent.type === 'ImportDeclaration'

        ) {

          return

        }

        used = true

        path.stop()

      }

    })

    if (used) {

      return

    }

    session.ast.program.body =

      session.ast.program.body.filter(

        node => node !== websiteImport

      )

  }

  return {

    ensureImport,

    removeWebsiteImportIfUnused

  }

}
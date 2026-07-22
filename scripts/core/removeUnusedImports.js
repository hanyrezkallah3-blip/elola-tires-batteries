import * as t from '@babel/types'

export function removeUnusedImports(ast) {

  const used = new Set()

  function collect(node) {

    if (!node || typeof node !== 'object')
      return

    if (Array.isArray(node)) {

      node.forEach(collect)

      return

    }

    if (
      node.type === 'Identifier'
    ) {

      used.add(node.name)

    }

    for (const key of Object.keys(node)) {

      collect(node[key])

    }

  }

  collect(ast.program)

  ast.program.body = ast.program.body.filter(node => {

    if (
      node.type !== 'ImportDeclaration'
    ) {

      return true

    }

    node.specifiers =
      node.specifiers.filter(spec => {

        if (
          spec.type === 'ImportDefaultSpecifier'
        ) {

          return used.has(spec.local.name)

        }

        if (
          spec.type === 'ImportSpecifier'
        ) {

          return used.has(spec.local.name)

        }

        if (
          spec.type === 'ImportNamespaceSpecifier'
        ) {

          return used.has(spec.local.name)

        }

        return true

      })

    return node.specifiers.length > 0

  })

}
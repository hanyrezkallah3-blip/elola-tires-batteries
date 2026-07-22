import { visit } from './ast.js'

export function hasIdentifier(ast, name) {

  let found = false

  visit(ast, {

    Identifier(path) {

      if (path.node.name === name) {

        found = true

        path.stop()

      }

    }

  })

  return found

}
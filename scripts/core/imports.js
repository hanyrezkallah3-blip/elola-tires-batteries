import * as t from '@babel/types'

export function hasImport(ast, importedName) {

  return ast.program.body.some(node =>

    node.type === 'ImportDeclaration' &&

    node.specifiers.some(spec =>

      spec.type === 'ImportSpecifier' &&

      spec.imported.name === importedName

    )

  )

}

export function removeImport(ast, importedName) {

  ast.program.body = ast.program.body.flatMap(node => {

    if (node.type !== 'ImportDeclaration')
      return node

    node.specifiers = node.specifiers.filter(spec =>

      !(
        spec.type === 'ImportSpecifier' &&
        spec.imported.name === importedName
      )

    )

    if (node.specifiers.length === 0)
      return []

    return node

  })

}

export function addImport(
  ast,
  importedName,
  source
) {

  if (hasImport(ast, importedName))
    return

  ast.program.body.unshift(

    t.importDeclaration(

      [

        t.importSpecifier(

          t.identifier(importedName),

          t.identifier(importedName)

        )

      ],

      t.stringLiteral(source)

    )

  )

}
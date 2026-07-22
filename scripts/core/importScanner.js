import {
  parseFile
} from './ast.js'

import {
  getCachedAST
} from './astSession.js'



export function scanImports(file) {

  let parsed = getCachedAST(file)

  if (!parsed) {

    parsed = parseFile(file)

  }



  const ast = parsed.ast

  const imports = []



  for (const node of ast.program.body) {

    if (node.type !== 'ImportDeclaration')
      continue



    imports.push({

      source: node.source.value,



      specifiers: node.specifiers.map(specifier => ({

        local: specifier.local.name,



        imported:

          specifier.imported

            ? specifier.imported.name

            : 'default'

      }))

    })

  }



  return imports

}



export function hasImport(

  file,

  localName

) {

  return scanImports(file).some(

    importDeclaration =>

      importDeclaration.specifiers.some(

        specifier =>

          specifier.local === localName

      )

  )

}
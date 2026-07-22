import fs from 'fs'

import * as parser from '@babel/parser'
import babelTraverse from '@babel/traverse'
import babelGenerator from '@babel/generator'

export function parseFile(file) {

  const source = fs.readFileSync(
    file,
    'utf8'
  )

  const ast = parser.parse(source, {

    sourceType: 'module',

    plugins: [

      'jsx',

      'importAssertions'

    ]

  })

  return {

    ast,

    source

  }

}

export function visit(ast, visitor) {

  const traverse =

    babelTraverse.default ||

    babelTraverse

  traverse(

    ast,

    visitor

  )

}

export function printAST(ast) {

  const generate =

    babelGenerator.default ||

    babelGenerator

  return generate(

    ast,

    {

      retainLines: false,

      comments: true,

      compact: false,

      concise: false,

      decoratorsBeforeExport: true

    }

  ).code

}
import * as t from '@babel/types'
import { parseFile, printAST, visit } from '../../core/ast.js'

const PRODUCT_FIELDS = [

  'products',

  'setProducts',

  'addProduct',

  'updateProduct',

  'deleteProduct',

  'duplicateProduct',

  'archiveProduct',

  'restoreProduct',

  'getProductById',

  'getProductByCode',

  'searchProducts',

  'productStatistics',

  'lowStockProducts',

  'outOfStockProducts'

]

export function transformUseProductStore(file) {

  const { ast, source } = parseFile(file)

  let changed = false

  let hasProductImport = false

  let firstImportIndex = -1

  let websiteImport = null

  visit(ast, {

    ImportDeclaration(path) {

      if (firstImportIndex === -1) {

        firstImportIndex = path.key

      }

      const value = path.node.source.value

      if (value.endsWith('/store/productStore')) {

        hasProductImport = true

      }

      if (value.endsWith('/store/websiteStore')) {

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

      if (node.arguments.length !== 1) {

        return

      }

      const selector = node.arguments[0]

      if (

        selector.type !== 'ArrowFunctionExpression'

      ) {

        return

      }

      let property = null

      const body = selector.body

      if (

        body.type === 'MemberExpression'

      ) {

        property = body.property?.name

      }

      else if (

        body.type === 'LogicalExpression' &&
        body.left?.type === 'MemberExpression'

      ) {

        property = body.left.property?.name

      }

      if (!PRODUCT_FIELDS.includes(property)) {

        return

      }

      node.callee = t.identifier('useProductStore')

      changed = true

    }

  })

  if (!changed) {

    return {

      changed: false,

      code: source

    }

  }

  if (!hasProductImport) {

    let importPath = '../store/productStore'

    if (file.endsWith('App.jsx')) {

      importPath = './store/productStore'

    }

    const importNode = t.importDeclaration(

      [

        t.importSpecifier(

          t.identifier('useProductStore'),

          t.identifier('useProductStore')

        )

      ],

      t.stringLiteral(importPath)

    )

    if (firstImportIndex >= 0) {

      ast.program.body.splice(

        firstImportIndex,

        0,

        importNode

      )

    }

    else {

      ast.program.body.unshift(

        importNode

      )

    }

  }

  let stillUsesWebsiteStore = false

  visit(ast, {

    CallExpression(path) {

      const node = path.node

      if (

        node.callee?.type === 'Identifier' &&
        node.callee.name === 'useWebsiteStore'

      ) {

        stillUsesWebsiteStore = true

      }

    }

  })

  if (websiteImport && !stillUsesWebsiteStore) {

    const specifiers = websiteImport.node.specifiers.filter(spec => {

      return !(

        spec.type === 'ImportSpecifier' &&
        spec.local.name === 'useWebsiteStore'

      )

    })

    if (specifiers.length === 0) {

      websiteImport.remove()

    }

    else {

      websiteImport.node.specifiers = specifiers

    }

  }

  return {

    changed: true,

    code: printAST(ast)

  }

}
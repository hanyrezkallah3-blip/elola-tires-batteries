import * as t from '@babel/types'
import { parseFile, visit, printAST } from '../../core/ast.js'

const USER_FIELDS = [

  'users',

  'currentUser',

  'login',

  'logout',

  'logoutUser',

  'register',

  'permissions',

  'setCurrentUser',

  'setUsers',

  'addUser',

  'updateUser',

  'deleteUser',

  'enableUser',

  'disableUser',

  'getUserById',

  'getUserByUsername',

  'searchUsers',

  'getStatistics'

]

export function transformUseUserStore(file) {

  const { ast, source } = parseFile(file)

  let changed = false

  let hasUserImport = false

  let firstImportIndex = -1

  let websiteImport = null

  visit(ast, {

    ImportDeclaration(path) {

      if (firstImportIndex === -1) {

    firstImportIndex = path.key

}

      const value = path.node.source.value

      if (value.endsWith('/store/userStore')) {

        hasUserImport = true

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

      if (!USER_FIELDS.includes(property)) {

        return

      }

      node.callee = t.identifier('useUserStore')

      changed = true

    }

  })

  if (!changed) {

    return {

      changed: false,

      code: source

    }

  }
    if (!hasUserImport) {

  let importPath = '../store/userStore'

  if (file.endsWith('App.jsx')) {

    importPath = './store/userStore'

  }

  const importNode = t.importDeclaration(

    [

      t.importSpecifier(

        t.identifier('useUserStore'),

        t.identifier('useUserStore')

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
import {
  parseFile,
  printAST
} from './ast.js'

export function createASTSession(file) {

  const {

    ast,

    source

  } = parseFile(file)

  return {

    file,

    ast,

    source,

    changed: false

  }

}

export function finishASTSession(session) {

  return {

    changed: session.changed,

    code: session.changed

      ? printAST(session.ast)

      : session.source

  }

}